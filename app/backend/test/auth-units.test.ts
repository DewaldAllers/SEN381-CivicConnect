import { describe, expect, it } from "vitest";

import { hashPassword, verifyPassword } from "../src/auth/passwords.js";
import { SessionStore } from "../src/auth/sessions.js";
import { buildSeedUsers, resolveSeedPassword } from "../src/auth/user-directory.js";

describe("Password hashing (NFR-001)", () => {
  it("[TC-UNIT-01] a password verifies against its own hash, and a different one does not", async () => {
    const stored = await hashPassword("correct horse");

    expect(await verifyPassword("correct horse", stored)).toBe(true);
    expect(await verifyPassword("correct horsf", stored)).toBe(false);
    expect(stored).not.toContain("correct horse");
  });

  it("[TC-UNIT-02] the same password hashes differently each time (random salt)", async () => {
    expect(await hashPassword("same")).not.toBe(await hashPassword("same"));
  });

  it.each(["", "plain-text-password", "scrypt:zz", "scrypt::"])(
    "[TC-UNIT-03] a malformed stored value %j never verifies",
    async (stored) => {
      expect(await verifyPassword("anything", stored)).toBe(false);
    }
  );
});

describe("Sessions (NFR-001)", () => {
  it("[TC-UNIT-04] a live token resolves to its user; an unknown token does not", () => {
    const sessions = new SessionStore();
    const token = sessions.create("u-sipho");

    expect(sessions.resolve(token)).toBe("u-sipho");
    expect(sessions.resolve("not-a-token")).toBeUndefined();
  });

  it("[TC-UNIT-05] a token stops working once it expires", () => {
    let now = 1_000_000;
    const sessions = new SessionStore(60_000, () => now);
    const token = sessions.create("u-sipho");

    now += 59_999;
    expect(sessions.resolve(token)).toBe("u-sipho");
    now += 1;
    expect(sessions.resolve(token)).toBeUndefined();
  });

  it("[TC-UNIT-06] a revoked token stops working at once, and tokens are unique and long", () => {
    const sessions = new SessionStore();
    const a = sessions.create("u-a");
    const b = sessions.create("u-a");

    sessions.revoke(a);

    expect(sessions.resolve(a)).toBeUndefined();
    expect(sessions.resolve(b)).toBe("u-a");
    expect(a).not.toBe(b);
    expect(a.length).toBeGreaterThanOrEqual(43);
  });
});

describe("Seed users and configuration (NFR-001, secrets control)", () => {
  it.each(["production", "staging"])(
    "[TC-UNIT-07] the server refuses to start in %s without SEED_USER_PASSWORD",
    (NODE_ENV) => {
      expect(() => resolveSeedPassword({ NODE_ENV })).toThrow("SEED_USER_PASSWORD");
    }
  );

  it("[TC-UNIT-08] the environment value wins, and development falls back to the documented demo password", () => {
    expect(resolveSeedPassword({ SEED_USER_PASSWORD: "from-env", NODE_ENV: "production" })).toBe("from-env");
    expect(resolveSeedPassword({})).toBe("demo");
  });

  it("[TC-UNIT-09][AC-NFR-001] only staff hold category grants; requesters hold none, and no role reads every category by default except where granted", async () => {
    const users = await buildSeedUsers("x");
    const byName = (name: string) => users.find((u) => u.username === name)!;

    expect(byName("thandi").categoryIds).toEqual([]);
    expect(byName("sipho").categoryIds).not.toContain("c-security");
    expect(byName("lerato").categoryIds).not.toContain("c-it");
    expect(users.every((u) => u.passwordHash.startsWith("scrypt:"))).toBe(true);
  });
});
