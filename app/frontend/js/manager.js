import { api } from "./api.js";
import { el, clear, day, statusBadge, say, fillSelect, requireRole } from "./dom.js";

const STATUSES = ["Submitted", "Accepted", "Rejected", "In Progress", "Resolved", "Closed"];
const BUCKETS = [
  { key: "open", label: "Open" },
  { key: "overdue", label: "Overdue" },
  { key: "resolved", label: "Resolved" },
  { key: "closed", label: "Closed" },
];

let bucket = "open";

if (requireRole("Management")) start();

async function start() {
  const form = document.getElementById("filter-form");
  try {
    fillSelect(form.elements.categoryId, await api.categories(), "All categories");
  } catch (error) {
    say("summary-message", error.message);
  }
  fillSelect(form.elements.status, STATUSES.map((s) => ({ id: s, name: s })), "All statuses");
  form.addEventListener("change", refresh);
  await refresh();
}

function filters() {
  const form = document.getElementById("filter-form");
  return { categoryId: form.elements.categoryId.value, status: form.elements.status.value };
}

// The counts and the list below them use the same filters, so they always agree.
async function refresh() {
  say("summary-message", "");
  try {
    const [counts, list] = await Promise.all([api.summary(filters()), api.managementList({ ...filters(), bucket })]);
    drawCards(counts);
    drawList(list);
  } catch (error) {
    say("summary-message", error.message);
  }
}

function drawCards(counts) {
  const cards = document.getElementById("cards");
  clear(cards);
  for (const b of BUCKETS) {
    cards.append(
      el(
        "button",
        {
          type: "button",
          class: "card" + (b.key === bucket ? " selected" : ""),
          onclick: () => {
            bucket = b.key;
            refresh();
          },
        },
        el("span", { class: "number" }, counts[b.key]),
        b.label
      )
    );
  }
  const note = document.getElementById("no-due-note");
  note.hidden = counts.openWithoutDueDate === 0;
  note.textContent = counts.openWithoutDueDate + " open request(s) have no due date set.";
}

function drawList(list) {
  const rows = document.getElementById("rows");
  const label = BUCKETS.find((b) => b.key === bucket).label;
  document.getElementById("list-title").textContent = label + " requests";
  document.getElementById("empty-note").hidden = list.length > 0;
  clear(rows);
  for (const r of list) {
    rows.append(
      el(
        "tr",
        {},
        el("td", {}, r.id),
        el("td", {}, r.title),
        el("td", {}, r.categoryName),
        el("td", {}, statusBadge(r.status)),
        el("td", {}, r.dueDate ? day(r.dueDate) : "Due date not set", r.overdue ? el("span", { class: "overdue" }, " Overdue") : null)
      )
    );
  }
}
