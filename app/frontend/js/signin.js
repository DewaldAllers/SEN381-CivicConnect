import { api, saveSession } from "./api.js";
import { say } from "./dom.js";

const pages = {
  Requester: "/requester.html",
  Staff: "/staff.html",
  Management: "/manager.html",
};

document.getElementById("signin-form").addEventListener("submit", async (event) => {
  event.preventDefault();
  const form = event.target;
  say("signin-message", "");

  if (!form.elements.username.value.trim() || !form.elements.password.value) {
    say("signin-message", "Enter your username and password.");
    return;
  }

  try {
    const session = await api.signIn(form.elements.username.value.trim(), form.elements.password.value);
    saveSession(session);
    location.href = pages[session.user.role];
  } catch (error) {
    say("signin-message", error.message);
  }
});
