#!/usr/bin/env node
/**
 * Deploys one identified release to the local staging environment.
 *
 *   node scripts/deploy-staging.mjs <tag-or-commit>
 *
 * What makes this a separate environment and not "npm run dev":
 *  - it builds from a clean checkout of the named tag or commit, not the working folder
 *  - it runs the compiled output with NODE_ENV=staging on its own port
 *  - its configuration and secret come from .env.staging, which git ignores
 *  - it asks the running server which release it is, and fails if the answer is wrong
 *
 * Rolling back is the same command with the previous tag.
 */
import { spawn, spawnSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

const ref = process.argv[2];
if (!ref) {
  console.error("Usage: node scripts/deploy-staging.mjs <tag-or-commit>");
  process.exit(2);
}

const isWindows = process.platform === "win32";
const run = (cmd, args, options = {}) => {
  const result = spawnSync(cmd, args, { stdio: "inherit", shell: isWindows, ...options });
  if (result.status !== 0) {
    console.error(`\nStep failed: ${cmd} ${args.join(" ")}`);
    process.exit(result.status ?? 1);
  }
};
const capture = (cmd, args, options = {}) => {
  const result = spawnSync(cmd, args, { encoding: "utf8", shell: isWindows, ...options });
  if (result.status !== 0) return null;
  return result.stdout.trim();
};

const repoRoot = capture("git", ["rev-parse", "--show-toplevel"]);
if (!repoRoot) {
  console.error("Run this inside the CivicConnect repository.");
  process.exit(2);
}
const sha = capture("git", ["rev-parse", "--verify", `${ref}^{commit}`], { cwd: repoRoot });
if (!sha) {
  console.error(`"${ref}" is not a tag or commit in this repository. Run: git fetch --tags`);
  process.exit(2);
}

// ---- Configuration (secrets stay out of git) ----
const envFile = path.join(repoRoot, "app", "backend", ".env.staging");
if (!fs.existsSync(envFile)) {
  console.error(`Missing ${envFile}\nCopy app/backend/staging.env.example to .env.staging and set SEED_USER_PASSWORD.`);
  process.exit(2);
}
const fileEnv = {};
for (const line of fs.readFileSync(envFile, "utf8").split(/\r?\n/)) {
  const match = /^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/.exec(line);
  if (match && !line.trim().startsWith("#")) fileEnv[match[1]] = match[2];
}
if (!fileEnv.SEED_USER_PASSWORD) {
  console.error("SEED_USER_PASSWORD is empty in .env.staging. Staging will not start without it.");
  process.exit(2);
}
const port = fileEnv.PORT || "4000";

// ---- A clean checkout of exactly the release being deployed ----
const stagingDir = process.env.STAGING_DIR || path.join(os.tmpdir(), "civicconnect-staging");
spawnSync("git", ["worktree", "remove", "--force", stagingDir], { cwd: repoRoot, stdio: "ignore" });
fs.rmSync(stagingDir, { recursive: true, force: true });
spawnSync("git", ["worktree", "prune"], { cwd: repoRoot, stdio: "ignore" });
console.log(`\n== Checking out ${ref} (${sha.slice(0, 12)}) into ${stagingDir}`);
run("git", ["worktree", "add", "--detach", stagingDir, sha], { cwd: repoRoot });

const backend = path.join(stagingDir, "app", "backend");
const env = {
  ...process.env,
  ...fileEnv,
  NODE_ENV: "staging",
  PORT: port,
  APP_VERSION: `${ref} (${sha.slice(0, 12)})`,
  FRONTEND_DIR: path.join(stagingDir, "app", "frontend"),
};
// Only the migration process receives owner credentials. The running app must
// use its restricted DATABASE_URL, never the schema-owner connection.
const migrationEnv = { ...env };
delete env.DATABASE_ADMIN_URL;
delete env.TEST_DATABASE_URL;

console.log("\n== Installing exactly what the lock file says");
run("npm", ["ci"], { cwd: backend });

console.log("\n== Building");
run("npx", ["tsc"], { cwd: backend });

const scripts = JSON.parse(fs.readFileSync(path.join(backend, "package.json"), "utf8")).scripts ?? {};
if (fileEnv.DATABASE_URL && scripts["db:migrate"]) {
  console.log("\n== Applying database migrations");
  run("npm", ["run", "db:migrate"], { cwd: backend, env: migrationEnv });
}

// ---- Start, then verify we are running the release we meant to ----
console.log(`\n== Starting on port ${port}`);
const server = spawn("node", ["dist/src/server.js"], { cwd: backend, env, stdio: "inherit", shell: isWindows });
const stop = () => { server.kill(); process.exit(0); };
process.on("SIGINT", stop);
process.on("SIGTERM", stop);
server.on("exit", (code) => {
  if (code) console.error(`Server stopped with code ${code}`);
  process.exit(code ?? 0);
});

const base = `http://localhost:${port}`;
let health = null;
for (let attempt = 0; attempt < 40 && !health; attempt++) {
  await new Promise((resolve) => setTimeout(resolve, 500));
  try {
    const res = await fetch(`${base}/api/v1/health`);
    if (res.ok) health = (await res.json()).data;
  } catch { /* not up yet */ }
}
if (!health) {
  console.error("Staging did not answer /api/v1/health in 20 seconds.");
  server.kill();
  process.exit(1);
}
if (!health.version.includes(sha.slice(0, 12))) {
  console.error(`Wrong release is running. Expected ${sha.slice(0, 12)}, server reports ${health.version}.`);
  server.kill();
  process.exit(1);
}
console.log(`\n== VERIFIED: staging at ${base} is running release ${health.version}`);
console.log("   Stop with Ctrl+C. To roll back, run this script again with the previous tag.\n");
