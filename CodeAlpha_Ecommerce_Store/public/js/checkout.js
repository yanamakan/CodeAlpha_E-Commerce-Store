async function loadCheckoutSummary() {
  const summaryEl = document.getElementById("checkout-summary");
  const cart = await api("/api/cart");

  if (cart.items.length === 0) {
    document.getElementById("checkout-form-wrap").style.display = "none";
    summaryEl.innerHTML = `<div class="empty-state">Your cart is empty. <a href="/index.html">Browse products</a></div>`;
    return;
  }

  summaryEl.innerHTML = `
    ${cart.items
      .map(
        (i) => `<div class="order-item-row"><span>${escapeHtml(i.name)} × ${i.quantity}</span><span>${formatPrice(i.price * i.quantity)}</span></div>`
      )
      .join("")}
    <div class="total-row"><span>Total</span><span>${formatPrice(cart.total)}</span></div>
  `;
}

document.addEventListener("DOMContentLoaded", async () => {
  const user = await getCurrentUser();
  if (!user) {
    window.location.href = "/login.html?next=/checkout.html";
    return;
  }
  document.getElementById("shipping-name").value = user.name;
  await loadCheckoutSummary();

  document.getElementById("checkout-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    const shippingName = document.getElementById("shipping-name").value.trim();
    const shippingAddress = document.getElementById("shipping-address").value.trim();
    const msg = document.getElementById("checkout-message");

    try {
      const result = await api("/api/orders", {
        method: "POST",
        body: JSON.stringify({ shippingName, shippingAddress }),
      });
      window.location.href = `/orders.html?placed=${result.orderId}`;
    } catch (err) {
      msg.innerHTML = `<div class="message error">${escapeHtml(err.message)}</div>`;
    }
  });
});
