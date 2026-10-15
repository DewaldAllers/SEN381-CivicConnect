// A small stand-in for the real backend, so the pages can be built and tried now.
// It follows the endpoints listed in README.md and keeps everything in memory.
// Run it with: node mock-server.mjs  (no npm install needed)

import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.dirname(fileURLToPath(import.meta.url));
const PORT = process.env.PORT || 3000;

// Sample data. The real category list and the real field limits are still to be
// chosen (P-01), so these are only here to try the pages.
const categories = [
  { id: "c-facilities", name: "Facilities" },
  { id: "c-it", name: "IT support" },
  { id: "c-security", name: "Security" },
  { id: "c-maintenance", name: "Maintenance" },
  { id: "c-lost", name: "Lost property" },
  { id: "c-other", name: "Other" },
];

const users = {
  thandi: { id: "u-thandi", name: "Thandi Nkosi", role: "Requester", password: "demo", categories: [] },
  bongani: { id: "u-bongani", name: "Bongani Dlamini", role: "Requester", password: "demo", categories: [] },
  sipho: { id: "u-sipho", name: "Sipho Mokoena", role: "Staff", password: "demo", categories: ["c-facilities", "c-it", "c-maintenance"] },
  lerato: { id: "u-lerato", name: "Lerato Pillay", role: "Staff", password: "demo", categories: ["c-facilities", "c-security"] },
  mary: { id: "u-mary", name: "Mary van Wyk", role: "Management", password: "demo", categories: categories.map((c) => c.id) },
};

const byId = (id) => Object.values(users).find((u) => u.id === id);
const sessions = new Map();

const TITLE_MIN = 5, TITLE_MAX = 100, DESC_MIN = 10, DESC_MAX = 1000;
const STATUSES = ["Submitted", "Accepted", "Rejected", "In Progress", "Resolved", "Closed"];

function daysAgo(n) {
  return new Date(Date.now() - n * 86400000).toISOString();
}

let counter = 4;
const requests = [
  { id: "REQ-001", title: "Broken tap in the kitchen", description: "The cold tap in the staff kitchen will not turn off.", categoryId: "c-facilities", requesterId: "u-thandi", status: "Submitted", ownerId: null, dueDate: null, submittedAt: daysAgo(2), version: 0 },
  { id: "REQ-002", title: "Projector not working in room 4", description: "The projector shows a blue screen and nothing else.", categoryId: "c-it", requesterId: "u-thandi", status: "In Progress", ownerId: "u-sipho", dueDate: daysAgo(1), submittedAt: daysAgo(6), version: 0 },
  { id: "REQ-003", title: "Gate lock is loose", description: "The side gate lock does not close properly at night.", categoryId: "c-security", requesterId: "u-bongani", status: "Accepted", ownerId: "u-lerato", dueDate: null, submittedAt: daysAgo(4), version: 0 },
];
const events = [
  { requestId: "REQ-001", at: daysAgo(2), actorId: "u-thandi", type: "Submitted", text: "Request submitted.", visibleToRequester: true },
  { requestId: "REQ-002", at: daysAgo(6), actorId: "u-thandi", type: "Submitted", text: "Request submitted.", visibleToRequester: true },
  { requestId: "REQ-002", at: daysAgo(5), actorId: "u-sipho", type: "Status", text: "Status changed from Submitted to Accepted.", visibleToRequester: true },
  { requestId: "REQ-002", at: daysAgo(4), actorId: "u-sipho", type: "Owner", text: "Sipho Mokoena took responsibility for this request.", visibleToRequester: true },
  { requestId: "REQ-002", at: daysAgo(3), actorId: "u-sipho", type: "Status", text: "Status changed from Accepted to In Progress.", visibleToRequester: true },
  { requestId: "REQ-002", at: daysAgo(3), actorId: "u-sipho", type: "Note", text: "Waiting on a new cable from the supplier.", visibleToRequester: false },
  { requestId: "REQ-003", at: daysAgo(4), actorId: "u-bongani", type: "Submitted", text: "Request submitted.", visibleToRequester: true },
  { requestId: "REQ-003", at: daysAgo(3), actorId: "u-lerato", type: "Status", text: "Status changed from Submitted to Accepted.", visibleToRequester: true },
];

// The status rules from P-02.
function transitionOk(from, to, body, request) {
  if (from === "Submitted" && to === "Accepted") return true;
  if (from === "Submitted" && to === "Rejected") return !!(body.rejectionReason || "").trim();
  if (from === "Accepted" && to === "In Progress") return !!request.ownerId;
  if (from === "In Progress" && to === "Resolved") return !!(body.resolutionInformation || "").trim();
  if (from === "Resolved" && to === "Closed") return true;
  return false;
}

const isOverdue = (r) =>
  !!r.dueDate && ["Accepted", "In Progress"].includes(r.status) && new Date(r.dueDate) < new Date();

// A requester never sees who in staff is looking after a request, only that someone is.
// The stand-in server hides the name the way the real server does.
function view(r, user) {
  const cat = categories.find((c) => c.id === r.categoryId);
  const owner = r.ownerId ? byId(r.ownerId) : null;
  const requester = byId(r.requesterId);
  return {
    id: r.id,
    title: r.title,
    description: r.description,
    categoryId: r.categoryId,
    categoryName: cat ? cat.name : "",
    requesterName: requester ? requester.name : "",
    status: r.status,
    ownerId: user.role === "Requester" ? null : r.ownerId,
    ownerName: owner ? (user.role === "Requester" ? "Assigned staff" : owner.name) : null,
    dueDate: r.dueDate,
    overdue: isOverdue(r),
    submittedAt: r.submittedAt,
    version: r.version,
  };
}

function canSee(user, r) {
  if (user.role === "Requester") return r.requesterId === user.id;
  return user.categories.includes(r.categoryId);
}

// Every change must send the version the caller saw. A stale version is refused,
// the same way the real store refuses it, so a browser cannot overwrite a newer change.
function isStale(r, body) {
  return body.expectedVersion !== r.version;
}
function stale(res) {
  return send(res, 409, { error: "This request was changed by someone else after you opened it", code: "stale" });
}

function addEvent(requestId, actorId, type, text, visibleToRequester) {
  events.push({ requestId, at: new Date().toISOString(), actorId, type, text, visibleToRequester });
}

// ---- helpers for the HTTP side ----
function send(res, status, payload) {
  res.writeHead(status, { "Content-Type": "application/json" });
  res.end(JSON.stringify(payload));
}
const ok = (res, data, status = 200) => send(res, status, { data });
const fail = (res, status, error, fields) => send(res, status, fields ? { error, fields } : { error });

function readBody(req) {
  return new Promise((resolve) => {
    let raw = "";
    req.on("data", (chunk) => (raw += chunk));
    req.on("end", () => {
      try { resolve(raw ? JSON.parse(raw) : {}); } catch { resolve({}); }
    });
  });
}

async function handleApi(req, res, url) {
  const route = url.pathname.replace("/api/v1", "");
  const method = req.method;
  const body = ["POST", "PATCH"].includes(method) ? await readBody(req) : {};

  if (method === "POST" && route === "/session") {
    const user = users[(body.username || "").toLowerCase()];
    if (!user || user.password !== body.password) return fail(res, 401, "Wrong username or password");
    const token = "token-" + user.id + "-" + Date.now();
    sessions.set(token, user);
    return ok(res, { token, user: { id: user.id, name: user.name, role: user.role } });
  }

  const header = req.headers.authorization || "";
  const user = sessions.get(header.replace("Bearer ", ""));
  if (!user) return fail(res, 401, "Not signed in");

  if (method === "DELETE" && route === "/session") {
    sessions.delete(header.replace("Bearer ", ""));
    return ok(res, { signedOut: true });
  }

  if (method === "GET" && route === "/categories") return ok(res, categories);

  // Requester: send a request
  if (method === "POST" && route === "/requests") {
    if (user.role !== "Requester") return fail(res, 403, "Forbidden");
    const fields = {};
    const title = (body.title || "").trim();
    const description = (body.description || "").trim();
    if (title.length < TITLE_MIN || title.length > TITLE_MAX) fields.title = `Title must be ${TITLE_MIN} to ${TITLE_MAX} characters.`;
    if (description.length < DESC_MIN || description.length > DESC_MAX) fields.description = `Description must be ${DESC_MIN} to ${DESC_MAX} characters.`;
    if (!categories.some((c) => c.id === body.categoryId)) fields.categoryId = "Choose a category from the list.";
    if (Object.keys(fields).length) return fail(res, 400, "Some fields need correcting", fields);
    counter += 1;
    const r = { id: "REQ-" + String(counter).padStart(3, "0"), title, description, categoryId: body.categoryId, requesterId: user.id, status: "Submitted", ownerId: null, dueDate: null, submittedAt: new Date().toISOString(), version: 0 };
    requests.push(r);
    addEvent(r.id, user.id, "Submitted", "Request submitted.", true);
    return ok(res, view(r, user), 201);
  }

  if (method === "GET" && route === "/requests/mine") {
    if (user.role !== "Requester") return fail(res, 403, "Forbidden");
    return ok(res, requests.filter((r) => r.requesterId === user.id).map((r) => view(r, user)));
  }

  // Staff: the queue
  if (method === "GET" && route === "/requests") {
    if (user.role !== "Staff") return fail(res, 403, "Forbidden");
    let list = requests.filter((r) => canSee(user, r));
    const category = url.searchParams.get("categoryId");
    const status = url.searchParams.get("status");
    if (category) list = list.filter((r) => r.categoryId === category);
    if (status) list = list.filter((r) => r.status === status);
    const sort = url.searchParams.get("sort");
    if (sort === "oldest") list = [...list].sort((a, b) => a.submittedAt.localeCompare(b.submittedAt));
    if (sort === "newest") list = [...list].sort((a, b) => b.submittedAt.localeCompare(a.submittedAt));
    return ok(res, list.map((r) => view(r, user)));
  }

  if (method === "GET" && route === "/staff") {
    if (user.role !== "Staff") return fail(res, 403, "Forbidden");
    const categoryId = url.searchParams.get("categoryId");
    return ok(res, Object.values(users).filter((u) => u.role === "Staff" && (!categoryId || u.categories.includes(categoryId))).map((u) => ({ id: u.id, name: u.name })));
  }

  // Management
  if (method === "GET" && route === "/management/summary") {
    if (user.role !== "Management") return fail(res, 403, "Forbidden");
    const list = managementList(user, url);
    const open = list.filter((r) => ["Submitted", "Accepted", "In Progress"].includes(r.status));
    return ok(res, {
      open: open.length,
      overdue: list.filter(isOverdue).length,
      resolved: list.filter((r) => r.status === "Resolved").length,
      closed: list.filter((r) => r.status === "Closed").length,
      openWithoutDueDate: open.filter((r) => !r.dueDate).length,
    });
  }
  if (method === "GET" && route === "/management/requests") {
    if (user.role !== "Management") return fail(res, 403, "Forbidden");
    const list = managementList(user, url);
    const bucket = url.searchParams.get("bucket");
    const picked = list.filter((r) => {
      if (bucket === "open") return ["Submitted", "Accepted", "In Progress"].includes(r.status);
      if (bucket === "overdue") return isOverdue(r);
      if (bucket === "resolved") return r.status === "Resolved";
      if (bucket === "closed") return r.status === "Closed";
      return true;
    });
    return ok(res, picked.map((r) => view(r, user)));
  }

  // One request
  const match = /^\/requests\/([^/]+)(\/[a-z-]+)?$/.exec(route);
  if (match) {
    const r = requests.find((x) => x.id === match[1]);
    if (!r) return fail(res, 404, "Request not found");
    // A person outside the scope gets the same answer as for a missing request.
    if (!canSee(user, r)) return fail(res, 404, "Request not found");
    const sub = match[2] || "";

    if (method === "GET" && sub === "") return ok(res, view(r, user));

    if (method === "GET" && sub === "/history") {
      let list = events.filter((e) => e.requestId === r.id);
      if (user.role === "Requester") list = list.filter((e) => e.visibleToRequester);
      list = [...list].sort((a, b) => a.at.localeCompare(b.at));
      const hide = (e) => user.role === "Requester" && e.actorId !== user.id;
      return ok(res, list.map((e) => ({
        at: e.at,
        actorName: hide(e) ? "Staff" : (byId(e.actorId) || {}).name || "",
        type: e.type,
        text: hide(e) && e.type === "Owner" ? "A member of staff took responsibility for this request." : e.text,
        visibleToRequester: e.visibleToRequester,
      })));
    }

    if (user.role !== "Staff") return fail(res, 403, "Forbidden");

    if (method === "POST" && sub === "/assign") {
      if (isStale(r, body)) return stale(res);
      const assignee = byId(body.assigneeId);
      if (!assignee || assignee.role !== "Staff" || !assignee.categories.includes(r.categoryId)) return fail(res, 409, "That person cannot take this request");
      r.ownerId = assignee.id;
      r.version += 1;
      addEvent(r.id, user.id, "Owner", `${assignee.name} is now responsible for this request.`, true);
      return ok(res, view(r, user));
    }

    if (method === "PATCH" && sub === "/status") {
      if (!STATUSES.includes(body.status)) return fail(res, 400, "Invalid status value");
      if (isStale(r, body)) return stale(res);
      if (!transitionOk(r.status, body.status, body, r)) return fail(res, 409, "Invalid request status transition");
      let text = `Status changed from ${r.status} to ${body.status}.`;
      if (body.status === "Rejected") text += ` Reason: ${body.rejectionReason.trim()}`;
      if (body.status === "Resolved") text += ` Resolution: ${body.resolutionInformation.trim()}`;
      r.status = body.status;
      r.version += 1;
      addEvent(r.id, user.id, "Status", text, true);
      return ok(res, { id: r.id, status: r.status, version: r.version });
    }

    if (method === "POST" && sub === "/notes") {
      const text = (body.text || "").trim();
      if (!text) return fail(res, 400, "Write something first", { text: "A note cannot be empty." });
      if (isStale(r, body)) return stale(res);
      r.version += 1;
      addEvent(r.id, user.id, "Note", text, body.visibleToRequester === true);
      return ok(res, view(r, user), 201);
    }

    if (method === "PATCH" && sub === "/due-date") {
      const when = new Date(body.dueDate);
      if (Number.isNaN(when.getTime())) return fail(res, 400, "Choose a valid date", { dueDate: "Choose a valid date." });
      if (isStale(r, body)) return stale(res);
      r.version += 1;
      r.dueDate = when.toISOString();
      addEvent(r.id, user.id, "DueDate", `Due date set to ${r.dueDate.slice(0, 10)}.`, true);
      return ok(res, view(r, user));
    }
  }

  return fail(res, 404, "Not found");
}

function managementList(user, url) {
  let list = requests.filter((r) => canSee(user, r));
  const category = url.searchParams.get("categoryId");
  const status = url.searchParams.get("status");
  if (category) list = list.filter((r) => r.categoryId === category);
  if (status) list = list.filter((r) => r.status === status);
  return list;
}

const types = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".mjs": "text/javascript", ".avif": "image/avif" };

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, "http://localhost");
  if (url.pathname.startsWith("/api/v1")) {
    try { return await handleApi(req, res, url); } catch { return fail(res, 500, "Internal server error"); }
  }
  const file = url.pathname === "/" ? "/index.html" : url.pathname;
  const full = path.join(root, path.normalize(file));
  if (!full.startsWith(root) || full.endsWith("mock-server.mjs") || !fs.existsSync(full) || fs.statSync(full).isDirectory()) {
    res.writeHead(404);
    return res.end("Not found");
  }
  res.writeHead(200, { "Content-Type": types[path.extname(full)] || "application/octet-stream" });
  fs.createReadStream(full).pipe(res);
});

server.listen(PORT, () => console.log(`Mock CivicConnect running at http://localhost:${PORT}`));
