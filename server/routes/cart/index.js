import express from "express";
import { pool } from "../../config/db.js";

const router = express.Router();


router.post("/cart/add", async (req, res) => {
  const { userId, productId, quantity } = req.body;

  try {
    // 查詢有沒有購物車
    const [cart] = await pool.execute(
      "SELECT id FROM carts WHERE user_id = ? AND status = 'active'",
      [userId]
    );

    let cartId = cart.length > 0 ? cart[0].id : null;

    if (!cartId) {
      const [result] = await pool.execute(
        "INSERT INTO carts (user_id, status) VALUES (?, 'active')",
        [userId]
      );
      cartId = result.insertId;
    }

    // 加入商品
    await pool.execute(
      "INSERT INTO cart_items (cart_id, product_id, quantity) VALUES (?, ?, ?)",
      [cartId, productId, quantity]
    );

    res.json({ success: true, message: "加入購物車成功" });
  } catch (error) {
    res.status(500).json({ success: false, message: "錯誤", error });
  }
});

router.get("/cart/:userId", async (req, res) => {
  const { userId } = req.params;

  const [cart] = await pool.execute(
    "SELECT id FROM carts WHERE user_id = ? AND status = 'active'",
    [userId]
  );

  if (!cart.length) {
    return res.json({ success: true, cart: [] });
  }

  const cartId = cart[0].id;

  const [items] = await pool.execute(
    `SELECT ci.id, ci.quantity, p.name, p.price
     FROM cart_items ci
     JOIN product p ON ci.product_id = p.id
     WHERE ci.cart_id = ?`,
    [cartId]
  );

  res.json({ success: true, cart: items });
});

router.post("/cart/checkout", async (req, res) => {
  const { userId } = req.body;

  try {
    const [cart] = await pool.execute(
      "SELECT id FROM carts WHERE user_id = ? AND status = 'active'",
      [userId]
    );

    if (!cart.length) {
      return res.status(400).json({ success: false, message: "購物車為空" });
    }

    const cartId = cart[0].id;

    const [items] = await pool.execute(
      "SELECT * FROM cart_items WHERE cart_id = ?",
      [cartId]
    );

    if (!items.length) {
      return res.status(400).json({ success: false, message: "沒有商品" });
    }

    // 建立訂單
    const [order] = await pool.execute(
      "INSERT INTO orders (user_id, status, total_amount) VALUES (?, 'paid', ?)",
      [userId, 1000] // 1000 可根據 items 計算總價
    );

    // 可以選擇插入 order_items（這裡省略）

    // 結束購物車
    await pool.execute("UPDATE carts SET status = 'checked_out' WHERE id = ?", [
      cartId,
    ]);

    res.json({ success: true, message: "訂單成立！", orderId: order.insertId });
  } catch (error) {
    res.status(500).json({ success: false, message: "錯誤", error });
  }
});

export default router;