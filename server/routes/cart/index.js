import express from "express";
import { pool } from "../../config/db.js";

const router = express.Router();

// ✅ 加入購物車
router.post("/add", async (req, res) => {
  const { userId, productId, quantity } = req.body;

  console.log("🔎 /add 收到 req.body:", req.body);

  if (!userId || !productId || !quantity) {
    return res.status(400).json({ success: false, message: "缺少必要參數" });
  }

  try {
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
      console.log("🆕 新建購物車 cartId:", cartId);
    }

    const [existingItem] = await pool.execute(
      "SELECT quantity FROM cart_items WHERE cart_id = ? AND product_id = ?",
      [cartId, productId]
    );

    if (existingItem.length > 0) {
      const newQuantity = existingItem[0].quantity + quantity;

      await pool.execute(
        "UPDATE cart_items SET quantity = ? WHERE cart_id = ? AND product_id = ?",
        [newQuantity, cartId, productId]
      );

      console.log(`✅ 已存在，更新數量為 ${newQuantity}`);
    } else {
      await pool.execute(
        "INSERT INTO cart_items (cart_id, product_id, quantity) VALUES (?, ?, ?)",
        [cartId, productId, quantity]
      );

      console.log("✅ 新增新的商品到 cart_items");
    }

    res.json({ success: true, message: "加入購物車成功" });
  } catch (error) {
    console.error("🔥 加入購物車失敗:", error.message);
    res.status(500).json({ success: false, message: "錯誤", error: error.message });
  }
});

// ✅ 取得購物車
router.get("/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    let [cart] = await pool.execute(
      "SELECT id FROM carts WHERE user_id = ? AND status = 'active'",
      [userId]
    );

    // 沒有 active 購物車 -> 自動建立
    if (!cart.length) {
      const [result] = await pool.execute(
        "INSERT INTO carts (user_id, status) VALUES (?, 'active')",
        [userId]
      );
      cart = [{ id: result.insertId }];
    }

    const cartId = cart[0].id;

    const [items] = await pool.execute(
      `SELECT 
          ci.id AS id,
          ci.product_id,
          ci.quantity,
          p.name,
          p.price,
          pi.image_path AS image_url
        FROM cart_items ci
        JOIN product p ON ci.product_id = p.id
        LEFT JOIN product_images pi ON p.id = pi.product_id AND pi.sort_order = 1
        WHERE ci.cart_id = ?`,
      [cartId]
    );

    res.json({
      success: true,
      cart: items
    });
  } catch (error) {
    console.error("獲取購物車錯誤:", error);
    res.status(500).json({ success: false, message: "獲取購物車失敗", error });
  }
});


// ✅ 更新數量
router.put("/update", async (req, res) => {
  const { userId, itemId, quantity } = req.body;

  if (!userId || !itemId) {
    return res.status(400).json({ success: false, message: "缺少必要參數" });
  }

  try {
    const [cart] = await pool.execute(
      "SELECT id FROM carts WHERE user_id = ? AND status = 'active'",
      [userId]
    );

    if (!cart.length) {
      return res.status(404).json({ success: false, message: "找不到購物車" });
    }

    const cartId = cart[0].id;

    const [result] = await pool.execute(
      `UPDATE cart_items SET quantity = ? WHERE cart_id = ? AND id = ?`,
      [quantity, cartId, itemId]
    );

    console.log("✅ 更新數量結果:", result);

    res.json({ success: true, message: "更新數量成功" });
  } catch (error) {
    console.error("🔥 更新數量失敗:", error);
    res.status(500).json({ success: false, message: "更新失敗", error });
  }
});

// ✅ 移除商品
router.delete("/remove", async (req, res) => {
  const { userId, itemIds } = req.body;

  if (!userId || !itemIds || !itemIds.length) {
    return res.status(400).json({ success: false, message: "缺少必要參數" });
  }

  try {
    const [cart] = await pool.execute(
      "SELECT id FROM carts WHERE user_id = ? AND status = 'active'",
      [userId]
    );

    if (!cart.length) {
      return res.status(404).json({ success: false, message: "找不到購物車" });
    }

    const cartId = cart[0].id;

    const placeholders = itemIds.map(() => "?").join(",");
    const deleteSQL = `
      DELETE FROM cart_items 
      WHERE cart_id = ? AND id IN (${placeholders})`;

    console.log("🚀 DELETE SQL:", deleteSQL);
    console.log("🚀 DELETE PARAMS:", [cartId, ...itemIds]);

    const [result] = await pool.execute(deleteSQL, [cartId, ...itemIds]);

    console.log("✅ 刪除商品結果:", result);

    res.json({ success: true, message: "刪除成功" });
  } catch (error) {
    console.error("🔥 刪除失敗:", error);
    res.status(500).json({ success: false, message: "刪除失敗", error });
  }
});

// ✅ 結帳
router.post("/checkout", async (req, res) => {
  const { userId, totalPrice, items } = req.body;

  console.log("📢 結帳資料:", { userId, totalPrice, items });

  if (!userId || !totalPrice || !items || !items.length) {
    return res.status(400).json({ success: false, message: "缺少必要參數" });
  }

  // ✅ 計算 total_items (總商品數量)
  const totalItems = items.reduce((acc, item) => acc + item.quantity, 0);

  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    // ✅ 建立訂單，新增 total_items 欄位
    const [orderResult] = await connection.execute(
      "INSERT INTO orders (user_id, status, total_price, total_items) VALUES (?, 'paid', ?, ?)",
      [userId, totalPrice, totalItems]
    );

    const orderId = orderResult.insertId;
    console.log("📝 訂單 ID:", orderId);

    // ✅ 插入訂單明細（order_items）
    const orderItemsParams = [];
    const orderItemsValues = items.map(item => {
      orderItemsParams.push(orderId, item.product_id, item.quantity, item.price || 0);
      return "(?, ?, ?, ?)";
    }).join(", ");

    await connection.execute(
      `INSERT INTO order_items (order_id, product_id, quantity, price) VALUES ${orderItemsValues}`,
      orderItemsParams
    );

    // ✅ 更新購物車狀態
    await connection.execute(
      "UPDATE carts SET status = 'checked_out' WHERE user_id = ? AND status = 'active'",
      [userId]
    );

    // ✅ 自動建立新的 active 購物車
    const [newCartResult] = await connection.execute(
      "INSERT INTO carts (user_id, status) VALUES (?, 'active')",
      [userId]
    );

    console.log("🆕 已新建 active 購物車 ID:", newCartResult.insertId);

    await connection.commit();

    res.json({
      success: true,
      message: "訂單完成",
      orderId
    });

  } catch (error) {
    await connection.rollback();
    console.error("🔥 Checkout 失敗:", error);
    res.status(500).json({
      success: false,
      message: "結帳失敗",
      error: error.message
    });
  } finally {
    connection.release();
  }
});

export default router;
