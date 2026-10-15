#!/usr/bin/env node
/**
 * NFR-005 load check, built to follow AC-NFR-005 (docs/requirements/acceptance-criteria.md):
 *  - three request types: list (staff queue), detail (one request), summary (management)
 *  - 10 concurrent requesters, at least 100 observed cases per type
 *  - a case succeeds only if it returns HTTP 200 with data within the target time
 *  - warm-up requests are run first and reported separately, never mixed into the result
 *  - errors and timeouts count as failures
 *  - the environment, data volume and load level are written into the result
 *
 * The 2 second / 95 percent target is a PROPOSAL (DEC-010 / P-05), not a baselined number.
 *
 *   PERF_PASSWORD=<seed password> node scripts/perf-nfr005.mjs --base http://localhost:4000
 *
 * Options: --seed 300 --requests 200 --concurrency 10 --warmup 20
 *          --target-ms 2000 --target-rate 95 --timeout 10000 --out perf-results
 */
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { performance } from "node:perf_hooks";

const args = Object.fromEntries(
  process.argv.slice(2).reduce((pairs, token, i, all) => {
    if (token.startsWith("--")) pairs.push([token.slice(2), all[i + 1]]);
    return pairs;
  }, [])
);
const base = (args.base ?? "http://localhost:4000").replace(/\/$/, "");
const password = process.env.PERF_PASSWORD ?? args.password;
const seedCount = Number(args.seed ?? 300);
const observed = Number(args.requests ?? 200);
const concurrency = Number(args.concurrency ?? 10);
const warmup = Number(args.warmup ?? 20);
const targetMs = Number(args["target-ms"] ?? 2000);
const targetRate = Number(args["target-rate"] ?? 95);
const timeoutMs = Number(args.timeout ?? 10000);
const outDir = args.out ?? "perf-results";

if (!password) {
  console.error("Set PERF_PASSWORD to the seed password of the environment under test.");
  process.exit(2);
}
if (observed < 100) {
  console.error("AC-NFR-005 asks for at least 100 observed cases per type. Use --requests 100 or more.");
  process.exit(2);
}

async function call(method, route, token, body) {
  const started = performance.now();
  try {
    const res = await fetch(`${base}/api/v1${route}`, {
      method,
      headers: { "Content-Type": "application/json", ...(token && { Authorization: `Bearer ${token}` }) },
      body: body === undefined ? undefined : JSON.stringify(body),
      signal: AbortSignal.timeout(timeoutMs),
    });
    const json = await res.json().catch(() => null);
    return { ms: performance.now() - started, status: res.status, ok: res.ok && json?.data !== undefined, json };
  } catch (error) {
    return { ms: performance.now() - started, status: 0, ok: false, error: error?.name === "TimeoutError" ? "timeout" : "network", json: null };
  }
}

async function signIn(username) {
  const res = await call("POST", "/session", null, { username, password });
  if (!res.ok) throw new Error(`Could not sign in as ${username} (HTTP ${res.status}). Check PERF_PASSWORD and the base URL.`);
  return res.json.data.token;
}

/** Runs `total` calls with `workers` in flight at once. Returns every observation and the elapsed window. */
async function pool(total, workers, makeCall) {
  const results = [];
  let next = 0;
  const started = performance.now();
  await Promise.all(
    Array.from({ length: workers }, async () => {
      while (next < total) {
        const index = next++;
        results.push(await makeCall(index));
      }
    })
  );
  return { results, windowMs: performance.now() - started };
}

const percentile = (sorted, p) => sorted[Math.min(sorted.length - 1, Math.ceil((p / 100) * sorted.length) - 1)];
const round = (n) => Math.round(n * 10) / 10;

// ---- Setup ----
const health = await call("GET", "/health");
if (!health.ok) throw new Error(`No answer from ${base}/api/v1/health`);
const tokens = {
  thandi: await signIn("thandi"),
  bongani: await signIn("bongani"),
  sipho: await signIn("sipho"),
  mary: await signIn("mary"),
};

const categories = (await call("GET", "/categories", tokens.sipho)).json.data.map((c) => c.id);
console.log(`Seeding ${seedCount} requests through the API (2 requesters, ${categories.length} categories)...`);
await pool(seedCount, concurrency, (i) =>
  call("POST", "/requests", i % 2 ? tokens.thandi : tokens.bongani, {
    title: `Load check request ${i + 1}`,
    description: `Seeded by the NFR-005 load check, number ${i + 1}.`,
    categoryId: categories[i % categories.length],
  })
);

const queue = (await call("GET", "/requests?sort=oldest", tokens.sipho)).json.data;
const everything = (await call("GET", "/management/requests", tokens.mary)).json.data;
const detailIds = queue.map((r) => r.id);
if (detailIds.length === 0) throw new Error("The staff queue is empty, so there is nothing to measure.");

const types = {
  list: { label: "List: staff queue, oldest first", call: () => call("GET", "/requests?sort=oldest", tokens.sipho) },
  detail: { label: "Detail: one request", call: (i) => call("GET", `/requests/${detailIds[i % detailIds.length]}`, tokens.sipho) },
  summary: { label: "Summary: management counts", call: () => call("GET", "/management/summary", tokens.mary) },
};

// ---- Measure ----
const report = [];
for (const [key, type] of Object.entries(types)) {
  console.log(`\n${type.label}`);
  const first = await type.call(0);
  console.log(`  first request: ${round(first.ms)} ms (HTTP ${first.status})`);

  const warm = await pool(warmup, concurrency, (i) => type.call(i));
  console.log(`  warm-up: ${warm.results.length} requests, not counted`);

  const { results, windowMs } = await pool(observed, concurrency, (i) => type.call(i));
  const times = results.map((r) => r.ms).sort((a, b) => a - b);
  const succeeded = results.filter((r) => r.ok).length;
  const withinTarget = results.filter((r) => r.ok && r.ms <= targetMs).length;
  const errors = {};
  for (const r of results.filter((x) => !x.ok)) {
    const reason = r.error ?? `HTTP ${r.status}`;
    errors[reason] = (errors[reason] ?? 0) + 1;
  }
  const rate = (withinTarget / results.length) * 100;
  const row = {
    type: key,
    label: type.label,
    observed: results.length,
    succeeded,
    withinTarget,
    withinTargetPercent: round(rate),
    verdict: rate >= targetRate ? "PASS" : "FAIL",
    ms: { min: round(times[0]), mean: round(times.reduce((a, b) => a + b, 0) / times.length), p50: round(percentile(times, 50)), p95: round(percentile(times, 95)), p99: round(percentile(times, 99)), max: round(times[times.length - 1]) },
    throughputPerSecond: round(results.length / (windowMs / 1000)),
    firstRequestMs: round(first.ms),
    warmupRequests: warm.results.length,
    errors,
  };
  report.push(row);
  console.log(`  ${row.verdict}: ${row.withinTargetPercent}% within ${targetMs} ms, p95 ${row.ms.p95} ms, ${row.throughputPerSecond} req/s`);
}

// ---- Record ----
const localhost = /localhost|127\.0\.0\.1/.test(base);
const result = {
  measuredAt: new Date().toISOString(),
  target: { milliseconds: targetMs, minimumPercent: targetRate, status: "PROPOSED (DEC-010, P-05): not a baselined number" },
  load: { concurrency, observedPerType: observed, warmupPerType: warmup, timeoutMs },
  data: { seededThisRun: seedCount, totalRequestsInSystem: everything.length, requestsVisibleToStaffQueue: queue.length, requesters: 2, categories: categories.length },
  environment: {
    baseUrl: base,
    serverVersion: health.json.data.version,
    node: process.version,
    os: `${os.type()} ${os.release()} ${os.arch()}`,
    cpu: `${os.cpus()[0]?.model ?? "unknown"} x${os.cpus().length}`,
    memoryGB: round(os.totalmem() / 1024 ** 3),
    loadGeneratorOnSameMachine: localhost ? "Yes: base URL is local, so server and load generator compete for the same CPU" : "Not known from the URL: state it where this result is used",
  },
  results: report,
};
fs.mkdirSync(outDir, { recursive: true });
const stamp = result.measuredAt.replace(/[:.]/g, "-");
fs.writeFileSync(path.join(outDir, `nfr-005-${stamp}.json`), JSON.stringify(result, null, 2));

const md = [
  `# NFR-005 load check, ${result.measuredAt}`,
  "",
  `Release: ${result.environment.serverVersion} | ${result.environment.baseUrl}`,
  `Target (PROPOSED, DEC-010): at least ${targetRate}% of cases succeed within ${targetMs} ms.`,
  `Load: ${concurrency} concurrent requesters, ${observed} observed cases per type, ${warmup} warm-up per type (not counted), ${timeoutMs} ms timeout.`,
  `Data: ${result.data.totalRequestsInSystem} requests in the system, ${result.data.requestsVisibleToStaffQueue} in the staff queue, ${result.data.requesters} requesters, ${result.data.categories} categories.`,
  `Environment: ${result.environment.os}, ${result.environment.cpu}, ${result.environment.memoryGB} GB, Node ${result.environment.node}.`,
  `Load generator: ${result.environment.loadGeneratorOnSameMachine}.`,
  "",
  "| Type | Within target | p50 ms | p95 ms | p99 ms | max ms | req/s | first request ms | Errors | Verdict |",
  "| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |",
  ...report.map((r) => `| ${r.label} | ${r.withinTargetPercent}% (${r.withinTarget}/${r.observed}) | ${r.ms.p50} | ${r.ms.p95} | ${r.ms.p99} | ${r.ms.max} | ${r.throughputPerSecond} | ${r.firstRequestMs} | ${Object.keys(r.errors).length ? JSON.stringify(r.errors) : "none"} | ${r.verdict} |`),
  "",
].join("\n");
fs.writeFileSync(path.join(outDir, `nfr-005-${stamp}.md`), md);
console.log(`\n${md}\nSaved to ${outDir}/nfr-005-${stamp}.{json,md}`);
