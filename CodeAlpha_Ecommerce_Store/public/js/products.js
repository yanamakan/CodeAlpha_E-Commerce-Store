async function loadCategories() {
  const select = document.getElementById("category-filter");
  const categories = await api("/api/products/categories");
  categories.forEach((c) => {
    const opt = document.createElement("option");
    opt.value = c;
    opt.textContent = c;
    select.appendChild(opt);
  });
}

async function loadProducts() {
  const grid = document.getElementById("product-grid");
  const search = document.getElementById("search-input").value.trim();
  const category = document.getElementById("category-filter").value;

  const params = new URLSearchParams();
  if (search) params.set("search", search);
  if (category) params.set("category", category);

  const products = await api(`/api/products?${params.toString()}`);

  if (products.length === 0) {
    grid.innerHTML = `<div class="empty-state">No products match your search.</div>`;
    return;
  }

  grid.innerHTML = products
    .map(
      (p) => `
    <a class="product-card" href="/product.html?id=${p.id}">
      <img src="${p.image}" alt="${escapeHtml(p.name)}" />
      <div class="info">
        <div class="category">${escapeHtml(p.category)}</div>
        <div class="name">${escapeHtml(p.name)}</div>
        <div class="price">${formatPrice(p.price)}</div>
      </div>
    </a>`
    )
    .join("");
}

document.addEventListener("DOMContentLoaded", async () => {
  await loadCategories();
  await loadProducts();

  document.getElementById("search-input").addEventListener("input", debounce(loadProducts, 300));
  document.getElementById("category-filter").addEventListener("change", loadProducts);
});

function debounce(fn, delay) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}
