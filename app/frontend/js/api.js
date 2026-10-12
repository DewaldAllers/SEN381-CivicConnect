// Every call to the server goes through this file.
// If an endpoint changes, this is the only place to edit.

const BASE = "/api/v1";

export function getSession() {
  try {
    return JSON.parse(sessionStorage.getItem("session") || "null");
  } catch {
    return null;
  }
}

export function saveSession(session) {
  sessionStorage.setItem("session", JSON.stringify(session));
}

export function clearSession() {
  sessionStorage.removeItem("session");
}

async function call(method, path, body) {
  const headers = { "Content-Type": "application/json" };
  const session = getSession();
  if (session) headers.Authorization = "Bearer " + session.token;

  const response = await fetch(BASE + path, {
    method,
    headers,
    body: body === undefined ? undefined : JSON.stringify(body),
  });

  let json = null;
  try {
    json = await response.json();
  } catch {
    // The server sent no JSON. The status code below still tells us what happened.
  }

  if (!response.ok) {
    const error = new Error((json && json.error) || "Something went wrong. Please try again.");
    error.status = response.status;
    error.fields = (json && json.fields) || null;
    throw error;
  }
  return json ? json.data : null;
}

function query(params) {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value) search.set(key, value);
  }
  const text = search.toString();
  return text ? "?" + text : "";
}

export const api = {
  signIn: (username, password) => call("POST", "/session", { username, password }),
  signOut: () => call("DELETE", "/session"),
  categories: () => call("GET", "/categories"),

  // Requester
  sendRequest: (data) => call("POST", "/requests", data),
  myRequests: () => call("GET", "/requests/mine"),

  // Staff
  queue: (filters) => call("GET", "/requests" + query(filters)),
  staffFor: (categoryId) => call("GET", "/staff" + query({ categoryId })),
  assign: (id, assigneeId) => call("POST", `/requests/${id}/assign`, { assigneeId }),
  changeStatus: (id, body) => call("PATCH", `/requests/${id}/status`, body),
  addNote: (id, text, visibleToRequester) => call("POST", `/requests/${id}/notes`, { text, visibleToRequester }),
  setDueDate: (id, dueDate) => call("PATCH", `/requests/${id}/due-date`, { dueDate }),

  // Shared
  request: (id) => call("GET", `/requests/${id}`),
  history: (id) => call("GET", `/requests/${id}/history`),

  // Management
  summary: (filters) => call("GET", "/management/summary" + query(filters)),
  managementList: (filters) => call("GET", "/management/requests" + query(filters)),
};
