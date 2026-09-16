document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("login-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;
    const msg = document.getElementById("form-message");

    try {
      await api("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });
      const next = new URLSearchParams(window.location.search).get("next") || "/index.html";
      window.location.href = next;
    } catch (err) {
      msg.innerHTML = `<div class="message error">${escapeHtml(err.message)}</div>`;
    }
  });
});
