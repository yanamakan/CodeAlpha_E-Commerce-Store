async function api(url, options = {}) {
  const res = await fetch(url, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || "Something went wrong.");
  return data;
}

async function getCurrentUser() {
  const { user } = await api("/api/auth/me");
  return user;
}

async function updateCartBadge() {
  const badge = document.getElementById("cart-count");
  if (!badge) return;
  try {
    const user = await getCurrentUser();
    if (!user) {
      badge.textContent = "";
      return;
    }
    const cart = await api("/api/cart");
    const count = cart.items.reduce((sum, i) => sum + i.quantity, 0);
    badge.textContent = count > 0 ? count : "";
  } catch {
    badge.textContent = "";
  }
}

async function renderNav() {
  const authArea = document.getElementById("nav-auth-area");
  if (!authArea) return;

  const user = await getCurrentUser();
  if (user) {
    authArea.innerHTML = `
      <a href="/orders.html">My Orders</a>
      <span>Hi, ${escapeHtml(user.name)}</span>
      <button class="btn secondary" id="logout-btn">Logout</button>
    `;
    document.getElementById("logout-btn").addEventListener("click", async () => {
      await api("/api/auth/logout", { method: "POST" });
      window.location.href = "/index.html";
    });
  } else {
    authArea.innerHTML = `
      <a href="/login.html">Login</a>
      <a href="/register.html">Register</a>
    `;
  }
  updateCartBadge();
}

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

function formatPrice(n) {
  return `$${Number(n).toFixed(2)}`;
}

document.addEventListener("DOMContentLoaded", renderNav);
