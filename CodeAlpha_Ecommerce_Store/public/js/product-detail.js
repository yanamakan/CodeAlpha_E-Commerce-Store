function getProductId() {
  return new URLSearchParams(window.location.search).get("id");
}

async function loadProduct() {
  const id = getProductId();
  const container = document.getElementById("product-detail");
  try {
    const p = await api(`/api/products/${id}`);
    document.title = `${p.name} — CodeAlpha Store`;
    container.innerHTML = `
      <img src="${p.image}" alt="${escapeHtml(p.name)}" />
      <div>
        <div class="category">${escapeHtml(p.category)}</div>
        <h1>${escapeHtml(p.name)}</h1>
        <div class="price">${formatPrice(p.price)}</div>
        <p>${escapeHtml(p.description || "")}</p>
        <div class="qty-row">
          <label for="qty">Quantity:</label>
          <input type="number" id="qty" value="1" min="1" max="${p.stock}" />
          <span style="color:var(--muted); font-size:0.85rem;">${p.stock} in stock</span>
        </div>
        <div id="detail-message"></div>
        <button class="btn" id="add-to-cart-btn">Add to Cart</button>
      </div>
    `;

    document.getElementById("add-to-cart-btn").addEventListener("click", async () => {
      const qty = Number(document.getElementById("qty").value) || 1;
      const msg = document.getElementById("detail-message");
      try {
        const user = await getCurrentUser();
        if (!user) {
          window.location.href = "/login.html?next=/product.html?id=" + id;
          return;
        }
        await api("/api/cart", {
          method: "POST",
          body: JSON.stringify({ productId: Number(id), quantity: qty }),
        });
        msg.innerHTML = `<div class="message success">Added to cart!</div>`;
        updateCartBadge();
      } catch (err) {
        msg.innerHTML = `<div class="message error">${escapeHtml(err.message)}</div>`;
      }
    });
  } catch (err) {
    container.innerHTML = `<div class="empty-state">${escapeHtml(err.message)}</div>`;
  }
}

document.addEventListener("DOMContentLoaded", loadProduct);
