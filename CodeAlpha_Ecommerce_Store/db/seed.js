const db = require("./database");

const products = [
  {
    name: "Wireless Headphones",
    description: "Over-ear Bluetooth headphones with noise cancellation and 30-hour battery life.",
    price: 59.99,
    image: "https://picsum.photos/seed/headphones/400/300",
    category: "Electronics",
    stock: 40,
  },
  {
    name: "Smart Watch",
    description: "Fitness tracking smart watch with heart-rate monitor and sleep tracking.",
    price: 89.5,
    image: "https://picsum.photos/seed/smartwatch/400/300",
    category: "Electronics",
    stock: 25,
  },
  {
    name: "Running Shoes",
    description: "Lightweight breathable running shoes with cushioned sole.",
    price: 45.0,
    image: "https://picsum.photos/seed/shoes/400/300",
    category: "Footwear",
    stock: 60,
  },
  {
    name: "Backpack",
    description: "Durable 25L backpack with laptop compartment, perfect for daily commutes.",
    price: 34.99,
    image: "https://picsum.photos/seed/backpack/400/300",
    category: "Accessories",
    stock: 50,
  },
  {
    name: "Coffee Maker",
    description: "12-cup programmable drip coffee maker with auto shut-off.",
    price: 39.99,
    image: "https://picsum.photos/seed/coffee/400/300",
    category: "Home",
    stock: 30,
  },
  {
    name: "Desk Lamp",
    description: "LED desk lamp with adjustable brightness and USB charging port.",
    price: 22.5,
    image: "https://picsum.photos/seed/lamp/400/300",
    category: "Home",
    stock: 45,
  },
  {
    name: "Yoga Mat",
    description: "Non-slip eco-friendly yoga mat, 6mm thick, includes carry strap.",
    price: 18.99,
    image: "https://picsum.photos/seed/yoga/400/300",
    category: "Fitness",
    stock: 70,
  },
  {
    name: "Bluetooth Speaker",
    description: "Portable waterproof speaker with 12-hour playtime and deep bass.",
    price: 29.99,
    image: "https://picsum.photos/seed/speaker/400/300",
    category: "Electronics",
    stock: 35,
  },
];

const insert = db.prepare(`
  INSERT INTO products (name, description, price, image, category, stock)
  VALUES (@name, @description, @price, @image, @category, @stock)
`);

const countRow = db.prepare("SELECT COUNT(*) AS c FROM products").get();

if (countRow.c === 0) {
  db.exec("BEGIN");
  try {
    for (const item of products) insert.run(item);
    db.exec("COMMIT");
  } catch (err) {
    db.exec("ROLLBACK");
    throw err;
  }
  console.log(`Seeded ${products.length} products.`);
} else {
  console.log(`Products table already has ${countRow.c} rows — skipping seed.`);
}
