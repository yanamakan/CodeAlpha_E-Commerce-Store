async function loadCart() {
  const wrap = document.getElementById("cart-wrap");
  const user = await getCurrentUser();
  if (!user) {
    window.location.href = "/login.html?next=/cart.html";
    return;
  }

  const cart = await api("/api/cart");

  if (cart.items.length === 0) {
    wrap.innerHTML = `<div class="empty-state">Your cart is empty. <a href="/index.html">Browse products</a></div>`;
    return;
  }

  wrap.innerHTML = `
    <table class="cart-table">
      <thead>
        <tr><th></th><th>Product</th><th>Price</th><th>Qty</th><th>Subtotal</th><th></th></tr>
      </thead>
      <tbody>
        ${cart.items
          .map(
            (i) => `
          <tr data-cart-item-id="${i.cart_item_id}">
            <td><img src="${i.image}" alt="${escapeHtml(i.name)}" /></td>
            <td><a href="/product.html?id=${i.id}">${escapeHtml(i.name)}</a></td>
            <td>${formatPrice(i.price)}</td>
            <td><input type="number" class="qty-input" min="1" value="${i.quantity}" style="width:60px; padding:6px;" /></td>
            <td class="subtotal">${formatPrice(i.price * i.quantity)}</td>
            <td><button class="btn danger remove-btn">Remove</button></td>
          </tr>`
          )
          .join("")}
      </tbody>
    </table>
    <div class="cart-summary">
      <div class="box">
        <div class="total-row"><span>Total</span><span id="cart-total">${formatPrice(cart.total)}</span></div>
        <a href="/checkout.html" class="btn" style="display:block; text-align:center;">Proceed to Checkout</a>
      </div>
    </div>
  `;

  wrap.querySelectorAll(".qty-input").forEach((input) => {
    input.addEventListener("change", async (e) => {
      const row = e.target.closest("tr");
      const cartItemId = row.dataset.cartItemId;
      const quantity = Number(e.target.value) || 1;
      try {
        await api(`/api/cart/${cartItemId}`, {
          method: "PUT",
          body: JSON.stringify({ quantity }),
        });
        await loadCart();
        updateCartBadge();
      } catch (err) {
        alert(err.message);
      }
    });
  });

  wrap.querySelectorAll(".remove-btn").forEach((btn) => {
    btn.addEventListener("click", async (e) => {
      const row = e.target.closest("tr");
      const cartItemId = row.dataset.cartItemId;
      await api(`/api/cart/${cartItemId}`, { method: "DELETE" });
      await loadCart();
      updateCartBadge();
    });
  });
}

document.addEventListener("DOMContentLoaded", loadCart);
