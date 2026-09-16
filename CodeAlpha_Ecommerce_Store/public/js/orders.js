async function loadOrders() {
  const wrap = document.getElementById("orders-wrap");
  const user = await getCurrentUser();
  if (!user) {
    window.location.href = "/login.html?next=/orders.html";
    return;
  }

  const placedId = new URLSearchParams(window.location.search).get("placed");
  const banner = placedId
    ? `<div class="message success">Order #${placedId} placed successfully! Thank you for your purchase.</div>`
    : "";

  const orders = await api("/api/orders");

  if (orders.length === 0) {
    wrap.innerHTML = banner + `<div class="empty-state">You have no orders yet. <a href="/index.html">Start shopping</a></div>`;
    return;
  }

  wrap.innerHTML =
    banner +
    orders
      .map(
        (o) => `
    <div class="order-card">
      <div class="order-header">
        <span>Order #${o.id} — ${o.status}</span>
        <span>${new Date(o.created_at).toLocaleString()}</span>
      </div>
      ${o.items
        .map(
          (i) => `<div class="order-item-row"><span>${escapeHtml(i.product_name)} × ${i.quantity}</span><span>${formatPrice(i.price * i.quantity)}</span></div>`
        )
        .join("")}
      <div class="order-item-row" style="font-weight:700; color: var(--text); border-top:1px solid var(--border); padding-top:8px; margin-top:6px;">
        <span>Total</span><span>${formatPrice(o.total)}</span>
      </div>
      <div style="color: var(--muted); font-size: 0.85rem; margin-top: 6px;">
        Shipping to: ${escapeHtml(o.shipping_name)}, ${escapeHtml(o.shipping_address)}
      </div>
    </div>`
      )
      .join("");
}

document.addEventListener("DOMContentLoaded", loadOrders);
