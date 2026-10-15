import { type UserRole } from "../authorization/authorization-policy.js";
import { hashPassword } from "./passwords.js";

export interface User {
  id: string;
  username: string;
  name: string;
  role: UserRole;
  /** Server-trusted category grants. An empty set grants no request access. */
  categoryIds: readonly string[];
  passwordHash: string;
}

export interface UserDirectory {
  findByUsername(username: string): User | undefined;
  findById(id: string): User | undefined;
  /** Staff who hold a grant for the category (the assignee eligibility rule, FR-007). */
  staffWithGrant(categoryId: string): User[];
}

export class InMemoryUserDirectory implements UserDirectory {
  constructor(private readonly users: readonly User[]) {}

  findByUsername(username: string): User | undefined {
    const wanted = username.trim().toLowerCase();
    return this.users.find((user) => user.username === wanted);
  }

  findById(id: string): User | undefined {
    return this.users.find((user) => user.id === id);
  }

  staffWithGrant(categoryId: string): User[] {
    return this.users.filter(
      (user) => user.role === "Staff" && user.categoryIds.includes(categoryId)
    );
  }
}

const ALL_CATEGORIES = [
  "c-facilities",
  "c-it",
  "c-security",
  "c-maintenance",
  "c-lost",
  "c-other",
];

/**
 * Seeded users and category grants (ADR-007). Grant administration is out of
 * M3 scope: the grants below are fixed server configuration (TD register).
 */
export async function buildSeedUsers(password: string): Promise<User[]> {
  const passwordHash = await hashPassword(password);
  const base = { passwordHash };
  return [
    { ...base, id: "u-thandi", username: "thandi", name: "Thandi Nkosi", role: "Requester", categoryIds: [] },
    { ...base, id: "u-bongani", username: "bongani", name: "Bongani Dlamini", role: "Requester", categoryIds: [] },
    { ...base, id: "u-sipho", username: "sipho", name: "Sipho Mokoena", role: "Staff", categoryIds: ["c-facilities", "c-it", "c-maintenance"] },
    { ...base, id: "u-lerato", username: "lerato", name: "Lerato Pillay", role: "Staff", categoryIds: ["c-facilities", "c-security"] },
    { ...base, id: "u-mary", username: "mary", name: "Mary van Wyk", role: "Management", categoryIds: ALL_CATEGORIES },
  ];
}

/**
 * The shared seed password comes from the environment, never from the repository.
 * Outside development the server refuses to start without it (fail closed).
 */
export function resolveSeedPassword(env: NodeJS.ProcessEnv): string {
  if (env.SEED_USER_PASSWORD) return env.SEED_USER_PASSWORD;
  if (env.NODE_ENV === "production" || env.NODE_ENV === "staging") {
    throw new Error("SEED_USER_PASSWORD must be set when NODE_ENV is production or staging");
  }
  return "demo";
}
