const express = require("express");
const db = require("../db/database");
const { requireLogin } = require("../middleware/auth");

const router = express.Router();
router.use(requireLogin);

router.post("/", (req, res) => {
  const { shippingName, shippingAddress } = req.body;
  if (!shippingName || !shippingAddress) {
    return res.status(400).json({ error: "Shipping name and address are required." });
  }

  const userId = req.session.userId;
  const cartItems = db
    .prepare(
      `SELECT ci.quantity, p.id AS product_id, p.name, p.price
      FROM cart_items ci JOIN products p ON p.id = ci.product_id
      WHERE ci.user_id = ?`
    )
    .all(userId);

  if (cartItems.length === 0) {
    return res.status(400).json({ error: "Your cart is empty." });
  }

  const total = cartItems.reduce((sum, i) => sum + i.price * i.quantity, 0);

  function placeOrder() {
    db.exec("BEGIN");
    try {
      const orderResult = db
        .prepare(
          `INSERT INTO orders (user_id, total, shipping_name, shipping_address)
          VALUES (?, ?, ?, ?)`
        )
        .run(userId, total, shippingName, shippingAddress);

      const orderId = orderResult.lastInsertRowid;
      const insertItem = db.prepare(
        `INSERT INTO order_items (order_id, product_id, product_name, price, quantity)
        VALUES (?, ?, ?, ?, ?)`
      );
      for (const item of cartItems) {
        insertItem.run(orderId, item.product_id, item.name, item.price, item.quantity);
      }

      db.prepare("DELETE FROM cart_items WHERE user_id = ?").run(userId);
      db.exec("COMMIT");
      return orderId;
    } catch (err) {
      db.exec("ROLLBACK");
      throw err;
    }
  }

  const orderId = placeOrder();
  res.status(201).json({ orderId, total: Number(total.toFixed(2)) });
});

router.get("/", (req, res) => {
  const orders = db
    .prepare("SELECT * FROM orders WHERE user_id = ? ORDER BY id DESC")
    .all(req.session.userId);

  const itemsStmt = db.prepare("SELECT * FROM order_items WHERE order_id = ?");
  const withItems = orders.map((o) => ({ ...o, items: itemsStmt.all(o.id) }));

  res.json(withItems);
});

router.get("/:id", (req, res) => {
  const order = db
    .prepare("SELECT * FROM orders WHERE id = ? AND user_id = ?")
    .get(req.params.id, req.session.userId);
  if (!order) return res.status(404).json({ error: "Order not found." });

  order.items = db.prepare("SELECT * FROM order_items WHERE order_id = ?").all(order.id);
  res.json(order);
});

module.exports = router;
