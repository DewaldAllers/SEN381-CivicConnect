import { api } from "./api.js";
import { el, clear, when, day, statusBadge, say, fillSelect, requireRole, historyList } from "./dom.js";

const STATUSES = ["Submitted", "Accepted", "Rejected", "In Progress", "Resolved", "Closed"];

const me = requireRole("Staff");
let openId = null;
if (me) start();

async function start() {
  const form = document.getElementById("filter-form");
  try {
    fillSelect(form.elements.categoryId, await api.categories(), "All categories");
  } catch (error) {
    say("queue-message", error.message);
  }
  fillSelect(form.elements.status, STATUSES.map((s) => ({ id: s, name: s })), "All statuses");
  form.addEventListener("change", loadQueue);
  await loadQueue();
}

async function loadQueue() {
  const form = document.getElementById("filter-form");
  const rows = document.getElementById("queue-rows");
  const empty = document.getElementById("empty-note");
  say("queue-message", "");
  try {
    const list = await api.queue({
      categoryId: form.elements.categoryId.value,
      status: form.elements.status.value,
      sort: form.elements.oldest.checked ? "oldest" : "",
    });
    clear(rows);
    empty.hidden = list.length > 0;
    for (const r of list) {
      rows.append(
        el(
          "tr",
          { onclick: () => showDetail(r.id) },
          el("td", {}, r.id),
          el("td", {}, r.title),
          el("td", {}, r.categoryName),
          el("td", {}, when(r.submittedAt)),
          el("td", {}, statusBadge(r.status), r.overdue ? el("span", { class: "overdue" }, " Overdue") : null),
          el("td", {}, r.ownerName || "Nobody yet")
        )
      );
    }
  } catch (error) {
    say("queue-message", error.message);
  }
}

async function showDetail(id) {
  openId = id;
  const box = document.getElementById("detail");
  try {
    const [request, history] = await Promise.all([api.request(id), api.history(id)]);
    const eligible = await api.staffFor(request.categoryId);
    clear(box);
    box.hidden = false;
    box.append(
      el("h2", {}, request.id + ": " + request.title),
      el("div", { id: "detail-message", class: "message", hidden: true }),
      el(
        "dl",
        { class: "details" },
        el("dt", {}, "Status"),
        el("dd", {}, statusBadge(request.status), request.overdue ? el("span", { class: "overdue" }, " Overdue") : null),
        el("dt", {}, "Category"),
        el("dd", {}, request.categoryName),
        el("dt", {}, "Sent by"),
        el("dd", {}, request.requesterName + " on " + when(request.submittedAt)),
        el("dt", {}, "Description"),
        el("dd", {}, request.description),
        el("dt", {}, "Responsible"),
        el("dd", {}, request.ownerName || "Nobody yet"),
        el("dt", {}, "Due date"),
        el("dd", {}, request.dueDate ? day(request.dueDate) : "Due date not set")
      ),
      el("div", { class: "actions" }, ownerBox(request, eligible), statusBox(request), noteBox(request), dueBox(request)),
      el("h3", {}, "History"),
      historyList(history)
    );
    box.scrollIntoView({ behavior: "smooth" });
  } catch (error) {
    say("queue-message", error.message);
  }
}

// After any change: tell the person, reload the queue and the open request.
async function afterChange(message) {
  await loadQueue();
  await showDetail(openId);
  say("detail-message", message, "ok");
}

function ownerBox(request, eligible) {
  const select = el("select", { id: "assignee" });
  fillSelect(select, eligible);
  const button = (label, getId) =>
    el(
      "button",
      {
        type: "button",
        onclick: async () => {
          try {
            await api.assign(request.id, getId());
            await afterChange("Responsibility saved.");
          } catch (error) {
            say("detail-message", error.message);
          }
        },
      },
      label
    );
  return el(
    "div",
    {},
    el("h3", {}, "Who is responsible"),
    button("Take it myself", () => me.id),
    el("label", { for: "assignee" }, "Or give it to"),
    select,
    button("Assign", () => select.value)
  );
}

function statusBox(request) {
  const select = el("select", { id: "new-status" });
  fillSelect(select, STATUSES.filter((s) => s !== request.status).map((s) => ({ id: s, name: s })));
  const reason = el("textarea", { id: "reason" });
  const reasonLabel = el("label", { for: "reason" }, "");

  // Rejecting needs a reason and resolving needs resolution information.
  function updateLabel() {
    const needed = { Rejected: "Reason for rejecting", Resolved: "What was done to resolve it" }[select.value];
    reasonLabel.textContent = needed || "";
    reasonLabel.hidden = !needed;
    reason.hidden = !needed;
  }
  select.addEventListener("change", updateLabel);
  updateLabel();

  return el(
    "div",
    {},
    el("h3", {}, "Change status"),
    el("label", { for: "new-status" }, "New status"),
    select,
    reasonLabel,
    reason,
    el(
      "button",
      {
        type: "button",
        onclick: async () => {
          try {
            await api.changeStatus(request.id, {
              status: select.value,
              hasOwner: !!request.ownerId,
              rejectionReason: select.value === "Rejected" ? reason.value : undefined,
              resolutionInformation: select.value === "Resolved" ? reason.value : undefined,
            });
            await afterChange("Status changed to " + select.value + ".");
          } catch (error) {
            say("detail-message", error.message);
          }
        },
      },
      "Change status"
    )
  );
}

function noteBox(request) {
  const text = el("textarea", { id: "note-text" });
  const visible = el("input", { type: "checkbox", id: "note-visible" });
  return el(
    "div",
    {},
    el("h3", {}, "Add a note"),
    el("label", { for: "note-text" }, "Note"),
    text,
    el("label", { for: "note-visible" }, visible, "Show this to the requester"),
    el(
      "button",
      {
        type: "button",
        onclick: async () => {
          try {
            await api.addNote(request.id, text.value, visible.checked);
            await afterChange("Note saved.");
          } catch (error) {
            say("detail-message", error.message);
          }
        },
      },
      "Save note"
    )
  );
}

function dueBox(request) {
  const input = el("input", { type: "date", id: "due" });
  return el(
    "div",
    {},
    el("h3", {}, "Due date"),
    el("label", { for: "due" }, "Date"),
    input,
    el(
      "button",
      {
        type: "button",
        onclick: async () => {
          try {
            await api.setDueDate(request.id, input.value);
            await afterChange("Due date saved.");
          } catch (error) {
            say("detail-message", error.message);
          }
        },
      },
      "Save due date"
    )
  );
}
