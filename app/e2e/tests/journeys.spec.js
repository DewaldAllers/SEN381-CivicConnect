// Two browser journeys through the real pages, the real server and its store.
// Each test name carries the design id from docs/testing/test-cases.md and the
// acceptance criteria it checks, so the result links back to the RTM.
import { test, expect } from "@playwright/test";

const PASSWORD = "demo";

// Opens a fresh browser context, signs in and returns the page.
// Every person gets their own context, so their sessions never mix.
async function signedIn(browser, username) {
  const context = await browser.newContext();
  const page = await context.newPage();
  const dialogs = [];
  page.on("dialog", (dialog) => {
    dialogs.push(dialog.message());
    dialog.dismiss();
  });
  await page.goto("/");
  await page.getByLabel("Username").fill(username);
  await page.getByLabel("Password").fill(PASSWORD);
  await page.getByRole("button", { name: "Sign in" }).click();
  await page.waitForURL(/\/(requester|staff|manager)\.html$/);
  return { page, context, dialogs };
}

// Sends a request from the requester page and returns its reference.
async function sendRequest(page, { title, description, categoryId }) {
  await page.getByLabel("Title").fill(title);
  await page.getByLabel("Description").fill(description);
  await page.locator("#categoryId").selectOption(categoryId);
  await page.getByRole("button", { name: "Send request" }).click();
  const message = page.locator("#form-message");
  await expect(message).toContainText("Request sent. Your reference is");
  const text = await message.textContent();
  return /reference is ([^\s]+?)\.$/.exec(text.trim())[1];
}

// Opens a request from the staff queue. "find" is a piece of the title that picks the row.
async function openFromQueue(page, find, reference, title = find) {
  await page.locator("#queue-rows tr", { hasText: find }).click();
  await expect(page.locator("#detail h2")).toHaveText(`${reference}: ${title}`);
}

async function changeStatus(page, to, text) {
  await page.locator("#new-status").selectOption(to);
  if (text) await page.locator("#reason").fill(text);
  await page.getByRole("button", { name: "Change status" }).click();
  await expect(page.locator("#detail-message")).toHaveText(`Status changed to ${to}.`);
}

test("[T-E2E-01][AC-FR-001][AC-FR-003][AC-FR-004][AC-FR-007][AC-FR-008] a request goes from sent to resolved and the requester sees the outcome", async ({ browser }) => {
  const stamp = Date.now();
  const title = `E2E dripping tap ${stamp}`;
  const privateNote = `Private: plumber booked ${stamp}`;

  // Thandi sends the request.
  const thandi = await signedIn(browser, "thandi");
  const reference = await sendRequest(thandi.page, {
    title,
    description: "The cold tap in the staff kitchen will not turn off.",
    categoryId: "c-facilities",
  });
  const ownRow = thandi.page.locator("#request-rows tr", { hasText: title });
  await expect(ownRow).toContainText(reference);
  await expect(ownRow.locator(".badge")).toHaveText("Submitted");

  // Sipho finds it in his queue, takes it, accepts it and resolves it.
  const sipho = await signedIn(browser, "sipho");
  await openFromQueue(sipho.page, title, reference);
  await changeStatus(sipho.page, "Accepted");
  await sipho.page.getByRole("button", { name: "Take it myself" }).click();
  await expect(sipho.page.locator("#detail-message")).toHaveText("Responsibility saved.");
  await expect(sipho.page.locator("#detail dd", { hasText: "Sipho Mokoena" })).toBeVisible();
  await sipho.page.locator("#note-text").fill(privateNote);
  await sipho.page.getByRole("button", { name: "Save note" }).click();
  await expect(sipho.page.locator("#detail-message")).toHaveText("Note saved.");
  await changeStatus(sipho.page, "In Progress");
  await changeStatus(sipho.page, "Resolved", "Washer replaced.");
  await expect(sipho.page.locator("#detail .badge").first()).toHaveText("Resolved");

  // Thandi reads her updates.
  await thandi.page.reload();
  await expect(ownRow.locator(".badge")).toHaveText("Resolved");
  await ownRow.click();
  const detail = thandi.page.locator("#detail");
  await expect(detail.locator(".badge").first()).toHaveText("Resolved");
  await expect(detail).toContainText("Washer replaced.");
  await expect(detail).toContainText("Assigned staff");

  // A requester never sees staff names or private notes.
  await expect(detail).not.toContainText("Sipho");
  await expect(detail).not.toContainText("Plumber booked");
  await expect(detail).not.toContainText(privateNote);

  await thandi.context.close();
  await sipho.context.close();
});

test("[T-E2E-02][AC-NFR-001][AC-FR-010][AC-FR-008] a script in a title stays text, a stale change is refused, a requester cannot reach staff pages and the counts match the lists", async ({ browser }) => {
  const marker = `E2E-${Date.now()}`;
  const title = `<script>window.__pwned="${marker}"</script> ${marker}`;

  // A requester sends a request whose title is a script tag.
  const thandi = await signedIn(browser, "thandi");
  const reference = await sendRequest(thandi.page, {
    title,
    description: `<img src=x onerror="window.__pwned2='${marker}'"> shown as plain text`,
    categoryId: "c-facilities",
  });
  const ownRow = thandi.page.locator("#request-rows tr", { hasText: marker });
  await expect(ownRow).toContainText("<script>");
  await ownRow.click();
  await expect(thandi.page.locator("#detail")).toContainText("<img src=x");
  expect(await thandi.page.evaluate(() => window.__pwned)).toBeUndefined();
  expect(await thandi.page.evaluate(() => window.__pwned2)).toBeUndefined();
  expect(thandi.dialogs).toEqual([]);

  // A requester cannot open a staff page or call a staff endpoint.
  await thandi.page.goto("/staff.html");
  await thandi.page.waitForURL(/\/index\.html$/);
  const token = JSON.parse(await thandi.page.evaluate(() => sessionStorage.getItem("session"))).token;
  const asThandi = { headers: { Authorization: `Bearer ${token}` } };
  expect((await thandi.page.request.get("/api/v1/requests", asThandi)).status()).toBe(403);
  expect((await thandi.page.request.get("/api/v1/management/summary", asThandi)).status()).toBe(403);
  expect((await thandi.page.request.get("/api/v1/requests")).status()).toBe(401);

  // Two staff open the request. Lerato changes it first, so Sipho's page is out of date.
  const sipho = await signedIn(browser, "sipho");
  const lerato = await signedIn(browser, "lerato");
  await openFromQueue(sipho.page, marker, reference, title);
  await openFromQueue(lerato.page, marker, reference, title);
  expect(await sipho.page.evaluate(() => window.__pwned)).toBeUndefined();
  expect(sipho.dialogs).toEqual([]);

  await changeStatus(lerato.page, "Accepted");

  await sipho.page.locator("#note-text").fill("Checked the tap on site.");
  await sipho.page.getByRole("button", { name: "Save note" }).click();
  await expect(sipho.page.locator("#detail-message")).toContainText("Someone else changed this request after you opened it");
  await expect(sipho.page.locator("#detail .badge").first()).toHaveText("Accepted");

  // On the latest version the same note goes through.
  await sipho.page.locator("#note-text").fill("Checked the tap on site.");
  await sipho.page.getByRole("button", { name: "Save note" }).click();
  await expect(sipho.page.locator("#detail-message")).toHaveText("Note saved.");

  // Mary's counts match the lists behind them, and the request is in the open list.
  const mary = await signedIn(browser, "mary");
  for (const label of ["Open", "Overdue", "Resolved", "Closed"]) {
    const card = mary.page.locator("#cards button", { hasText: label });
    await card.click();
    await expect(mary.page.locator("#cards button.selected")).toContainText(label);
    await expect(mary.page.locator("#list-title")).toHaveText(`${label} requests`);
    const counted = Number(await mary.page.locator("#cards button.selected .number").textContent());
    await expect(mary.page.locator("#rows tr")).toHaveCount(counted);
  }
  await mary.page.locator("#cards button", { hasText: "Open" }).click();
  await expect(mary.page.locator("#cards button.selected")).toContainText("Open");
  await expect(mary.page.locator("#rows tr", { hasText: marker })).toBeVisible();

  for (const person of [thandi, sipho, lerato, mary]) await person.context.close();
});
