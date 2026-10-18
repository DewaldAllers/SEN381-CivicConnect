import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

// M1 was accepted on 9 September, at the merge of PR #26. Do not let later
// edits silently change which acceptance criteria are counted for M4.
const baseline = "13fe8a0ac68319c8d466c09e440756b9c39f2e97";
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../..");
const criteriaPath = "docs/requirements/acceptance-criteria.md";
const baselineText = execFileSync("git", ["show", `${baseline}:${criteriaPath}`], { cwd: root, encoding: "utf8" });
const currentText = readFileSync(path.join(root, criteriaPath), "utf8");
const assessmentPath = process.argv[2]
  ? path.resolve(process.argv[2])
  : path.join(root, "docs/PED/final-scope-assessment.md");
const assessment = readFileSync(assessmentPath, "utf8");

function inventory(text) {
  const result = new Map();
  let group;
  let ordinal = 0;
  for (const line of text.split(/\r?\n/)) {
    if (line.startsWith("## ")) {
      group = /^## (AC-(?:FR|NFR)-\d{3})$/.exec(line)?.[1];
      ordinal = 0;
    } else if (group && /^-\s+\S/.test(line)) {
      ordinal += 1;
      result.set(`${group}.${ordinal}`, line.replace(/^-\s+/, ""));
    }
  }
  return result;
}
const original = inventory(baselineText);
const current = inventory(currentText);
if (original.size !== 40) throw new Error("Unexpected M1 inventory; review the baseline rather than changing the denominator");
const normalise = (text) => text.replace(/[\u201c\u201d]/g, '"').replace(/[\u2018\u2019]/g, "'").trim();
if (current.size !== original.size) throw new Error("Acceptance inventory changed; reconcile an approved change before scoring");
for (const [id, text] of original) {
  if (!current.has(id) || normalise(current.get(id)) !== normalise(text)) {
    throw new Error(`Criterion changed since M1: ${id}; reconcile its approved change explicitly`);
  }
}
const weights = { Met: 1, "Partially Met": 0.5, "Not Met": 0 };
const counts = { Met: 0, "Partially Met": 0, "Not Met": 0 };
const seen = new Set();
let total = 0;
for (const line of assessment.split(/\r?\n/)) {
  const row = /^\| (AC-(?:FR|NFR)-\d{3}\.\d+) \| ([^|]+) \| (.+) \|$/.exec(line);
  if (!row) continue;
  const [, id, status, evidence] = row;
  if (!original.has(id)) throw new Error(`Unknown baseline criterion: ${id}`);
  if (seen.has(id)) throw new Error(`Duplicate criterion: ${id}`);
  if (!Object.hasOwn(weights, status.trim())) throw new Error(`Invalid status for ${id}`);
  if (!/\[[^\]]+\]\([^)]+\)/.test(evidence)) throw new Error(`Missing evidence link for ${id}`);
  seen.add(id);
  counts[status.trim()] += 1;
  total += weights[status.trim()];
}
const missing = [...original.keys()].filter((id) => !seen.has(id));
if (missing.length) throw new Error(`Missing criteria: ${missing.join(", ")}`);
const percent = total / original.size * 100;
const declared = /^Declared calculation: ([\d.]+) \/ (\d+) = ([\d.]+)%\.$/m.exec(assessment);
if (!declared || Number(declared[1]) !== total || Number(declared[2]) !== original.size || Number(declared[3]) !== percent) {
  throw new Error(`Declared calculation must match ${total} / ${original.size} = ${percent}%`);
}
console.log(JSON.stringify({
  assessment: path.relative(root, assessmentPath), baseline, applicableCriteria: original.size,
  counts, score: total, percentage: percent,
  status: "Working evidence assessment; not team approval or a frozen final release",
}, null, 2));
