import { createHash, randomBytes } from "node:crypto";

interface Session {
  userId: string;
  expiresAt: number;
}

const hashToken = (token: string): string =>
  createHash("sha256").update(token).digest("hex");

/**
 * Server-side sessions with opaque random tokens (ADR-007).
 * Only a hash of each token is kept, so reading the store does not reveal usable tokens.
 * Signing out deletes the session, so the token stops working immediately.
 */
export class SessionStore {
  private readonly sessions = new Map<string, Session>();

  constructor(
    private readonly ttlMs: number = 8 * 60 * 60 * 1000,
    private readonly now: () => number = () => Date.now()
  ) {}

  create(userId: string): string {
    const token = randomBytes(32).toString("base64url");
    this.sessions.set(hashToken(token), {
      userId,
      expiresAt: this.now() + this.ttlMs,
    });
    return token;
  }

  /** Returns the user id for a live token, or undefined if unknown, revoked or expired. */
  resolve(token: string): string | undefined {
    const key = hashToken(token);
    const session = this.sessions.get(key);
    if (!session) return undefined;
    if (session.expiresAt <= this.now()) {
      this.sessions.delete(key);
      return undefined;
    }
    return session.userId;
  }

  revoke(token: string): void {
    this.sessions.delete(hashToken(token));
  }
}
