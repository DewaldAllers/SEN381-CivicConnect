import { api } from "./api.js";
import { el, clear, when, statusBadge, say, showFieldErrors, fillSelect, requireRole, historyList } from "./dom.js";

if (requireRole("Requester")) start();

async function start() {
  const form = document.getElementById("request-form");

  try {
    fillSelect(form.elements.categoryId, await api.categories(), "Choose a category");
  } catch (error) {
    say("form-message", error.message);
  }

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    say("form-message", "");
    showFieldErrors(form, null);
    try {
      const created = await api.sendRequest({
        title: form.elements.title.value,
        description: form.elements.description.value,
        categoryId: form.elements.categoryId.value,
      });
      form.reset();
      say("form-message", `Request sent. Your reference is ${created.id}.`, "ok");
      await loadList();
    } catch (error) {
      say("form-message", error.message);
      showFieldErrors(form, error.fields);
    }
  });

  await loadList();
}

async function loadList() {
  const rows = document.getElementById("request-rows");
  const empty = document.getElementById("empty-note");
  try {
    const list = await api.myRequests();
    clear(rows);
    empty.hidden = list.length > 0;
    for (const r of list) {
      rows.append(
        el(
          "tr",
          { onclick: () => showDetail(r.id) },
          el("td", {}, r.id),
          el("td", {}, r.title),
          el("td", {}, when(r.submittedAt)),
          el("td", {}, statusBadge(r.status))
        )
      );
    }
  } catch (error) {
    say("list-message", error.message);
  }
}

async function showDetail(id) {
  const box = document.getElementById("detail");
  try {
    const [request, history] = await Promise.all([api.request(id), api.history(id)]);
    clear(box);
    box.hidden = false;
    box.append(
      el("h2", {}, request.id + ": " + request.title),
      el(
        "dl",
        { class: "details" },
        el("dt", {}, "Status"),
        el("dd", {}, statusBadge(request.status)),
        el("dt", {}, "Category"),
        el("dd", {}, request.categoryName),
        el("dt", {}, "Description"),
        el("dd", {}, request.description),
        el("dt", {}, "Looked after by"),
        el("dd", {}, request.ownerName || "Nobody yet")
      ),
      el("h3", {}, "Updates"),
      historyList(history)
    );
    box.scrollIntoView({ behavior: "smooth" });
  } catch (error) {
    say("list-message", error.message);
  }
}
