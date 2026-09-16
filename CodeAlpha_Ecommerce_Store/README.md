# CodeAlpha_Ecommerce_Store

Simple E-commerce Store — Full Stack Development, Task 1 (CodeAlpha internship).

Built with **Node.js + Express.js** and a **SQLite** database (via Node's built-in `node:sqlite` module — no separate DB server, and nothing to compile).

> Requires **Node.js 22.5+** (check with `node -v`). If you're on an older version, upgrade Node from [nodejs.org](https://nodejs.org).

## Features

- Product listing with search and category filter
- Product details page
- Shopping cart (add, update quantity, remove)
- Order processing / checkout with order history
- User registration and login (hashed passwords, session-based auth)
- SQLite database storing users, products, cart items, orders, and order items

## Tech Stack

- **Backend:** Node.js, Express.js, express-session, bcryptjs
- **Database:** SQLite
- **Frontend:** Plain HTML, CSS, JavaScript

## Project Structure

```
CodeAlpha_Ecommerce_Store/
├── server.js              # Express app entry point
├── db/
│   ├── database.js        # DB connection + schema
│   └── seed.js             # Seeds sample products
├── middleware/
│   └── auth.js             # Login-required guard
├── routes/
│   ├── auth.js              # register / login / logout / me
│   ├── products.js          # product listing / detail
│   ├── cart.js               # cart CRUD
│   └── orders.js             # checkout + order history
└── public/                 # Frontend (served statically)
    ├── index.html            # Product listing
    ├── product.html           # Product detail
    ├── cart.html               # Shopping cart
    ├── checkout.html            # Checkout form
    ├── orders.html               # Order history
    ├── login.html
    ├── register.html
    ├── css/style.css
    └── js/*.js
```

## Setup & Run

1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the server:
   ```bash
   npm start
   ```
3. Open your browser at **http://localhost:3000**

The SQLite database file (`db/store.db`) and sample products are created automatically the first time the server starts — no manual DB setup needed.

## How to Use

1. Go to **Register** and create an account.
2. Browse products on the home page, use search/category filters.
3. Click a product to view its detail page and add it to your cart.
4. Go to **Cart** to update quantities or remove items.
5. Click **Proceed to Checkout**, fill in shipping details, and place the order.
6. View your past orders under **My Orders**.

## Notes for Submission (per CodeAlpha instructions)

- Push this project to a GitHub repo named `CodeAlpha_EcommerceStore` (or similar, prefixed `CodeAlpha_`).
- Record a short video walking through the features (register → browse → cart → checkout → order history) and post it on LinkedIn tagging @CodeAlpha, linking the GitHub repo.
- Submit via the official submission form shared in your CodeAlpha WhatsApp group.
