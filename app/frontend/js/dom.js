// Small helpers for building the page.
//
// Safety rule: text from users (titles, descriptions, notes, names) is only ever
// put on the page as text. Never use innerHTML with it. Someone could type a
// script tag into a field and it would run in other people's browsers.

import { getSession, clearSession, api } from "./api.js";

// Build an element. Strings and numbers become text. Attributes go in the second argument.
export function el(tag, attrs = {}, ...children) {
  const node = document.createElement(tag);
  for (const [key, value] of Object.entries(attrs)) {
    if (key === "class") node.className = value;
    else if (key.startsWith("on")) node.addEventListener(key.slice(2), value);
    else if (value === true) node.setAttribute(key, "");
    else if (value !== false && value !== null && value !== undefined) node.setAttribute(key, value);
  }
  for (const child of children.flat()) {
    if (child === null || child === undefined || child === false) continue;
    node.append(child instanceof Node ? child : document.createTextNode(String(child)));
  }
  return node;
}

export function clear(node) {
  node.replaceChildren();
}

export function when(iso) {
  if (!iso) return "";
  // Times are stored in UTC and shown in South African time (CR-003).
  return new Date(iso).toLocaleString("en-ZA", { timeZone: "Africa/Johannesburg", dateStyle: "medium", timeStyle: "short" });
}

export function day(iso) {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("en-ZA", { timeZone: "Africa/Johannesburg", dateStyle: "medium" });
}

export function statusBadge(status) {
  return el("span", { class: "badge status-" + status.toLowerCase().replace(/\s+/g, "-") }, status);
}

// Show a message in an element with the given id. kind is "error" or "ok".
export function say(id, text, kind = "error") {
  const box = document.getElementById(id);
  if (!box) return;
  box.className = "message " + kind;
  box.textContent = text;
  box.hidden = !text;
}

// Put a server field error next to its field. fields looks like { title: "..." }.
export function showFieldErrors(form, fields) {
  for (const note of form.querySelectorAll(".field-error")) note.remove();
  if (!fields) return;
  for (const [name, text] of Object.entries(fields)) {
    const input = form.elements[name];
    if (input) input.insertAdjacentElement("afterend", el("div", { class: "field-error" }, text));
  }
}

export function fillSelect(select, items, firstLabel) {
  clear(select);
  if (firstLabel !== undefined) select.append(el("option", { value: "" }, firstLabel));
  for (const item of items) select.append(el("option", { value: item.id }, item.name));
}

// Every page except sign in calls this first.
export function requireRole(role) {
  const session = getSession();
  if (!session || session.user.role !== role) {
    location.href = "/index.html";
    return null;
  }
  const bar = document.getElementById("topbar");
  if (bar) {
    bar.append(
      el("span", {}, session.user.name + " (" + session.user.role + ")"),
      el(
        "button",
        {
          class: "link",
          onclick: async () => {
            try {
              await api.signOut();
            } catch {
              // Signing out locally is enough if the server cannot be reached.
            }
            clearSession();
            location.href = "/index.html";
          },
        },
        "Sign out"
      )
    );
  }
  return session.user;
}

export function historyList(events) {
  if (!events.length) return el("p", { class: "muted" }, "Nothing has happened to this request yet.");
  return el(
    "ol",
    { class: "history" },
    events.map((e) =>
      el(
        "li",
        {},
        el("div", { class: "history-when" }, when(e.at) + " - " + e.actorName),
        el("div", {}, e.text),
        e.visibleToRequester ? null : el("div", { class: "muted" }, "Staff only")
      )
    )
  );
}
