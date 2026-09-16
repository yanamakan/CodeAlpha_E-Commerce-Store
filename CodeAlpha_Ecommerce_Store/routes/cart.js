const express = require("express");
const db = require("../db/database");
const { requireLogin } = require("../middleware/auth");

const router = express.Router();
router.use(requireLogin);

function getCartForUser(userId) {
  return db
    .prepare(
      `SELECT ci.id AS cart_item_id, ci.quantity, p.*
      FROM cart_items ci
      JOIN products p ON p.id = ci.product_id
      WHERE ci.user_id = ?
      ORDER BY ci.id`
    )
    .all(userId);
}

router.get("/", (req, res) => {
  const items = getCartForUser(req.session.userId);
  const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  res.json({ items, total: Number(total.toFixed(2)) });
});

router.post("/", (req, res) => {
  const { productId, quantity = 1 } = req.body;
  const product = db.prepare("SELECT * FROM products WHERE id = ?").get(productId);
  if (!product) return res.status(404).json({ error: "Product not found." });

  const existing = db
    .prepare("SELECT * FROM cart_items WHERE user_id = ? AND product_id = ?")
    .get(req.session.userId, productId);

  if (existing) {
    db.prepare("UPDATE cart_items SET quantity = quantity + ? WHERE id = ?").run(
      quantity,
      existing.id
    );
  } else {
    db.prepare(
      "INSERT INTO cart_items (user_id, product_id, quantity) VALUES (?, ?, ?)"
    ).run(req.session.userId, productId, quantity);
  }

  res.status(201).json({ items: getCartForUser(req.session.userId) });
});

router.put("/:cartItemId", (req, res) => {
  const { quantity } = req.body;
  if (quantity < 1) return res.status(400).json({ error: "Quantity must be at least 1." });

  const item = db
    .prepare("SELECT * FROM cart_items WHERE id = ? AND user_id = ?")
    .get(req.params.cartItemId, req.session.userId);
  if (!item) return res.status(404).json({ error: "Cart item not found." });

  db.prepare("UPDATE cart_items SET quantity = ? WHERE id = ?").run(quantity, item.id);
  res.json({ items: getCartForUser(req.session.userId) });
});

router.delete("/:cartItemId", (req, res) => {
  db.prepare("DELETE FROM cart_items WHERE id = ? AND user_id = ?").run(
    req.params.cartItemId,
    req.session.userId
  );
  res.json({ items: getCartForUser(req.session.userId) });
});

module.exports = router;
