import express from "express";
import { pool } from "../../config/db.js";

const router = express.Router();

/**
 * ✅ 單筆訂單詳情 (簡易版)
 * GET /api/orders/:orderId/simple
 */
router.get("/:orderId/simple", async (req, res) => {
  const { orderId } = req.params;

  try {
    const [orderRows] = await pool.execute(
      `SELECT id, user_id, total_price, status, createdAt 
       FROM orders 
       WHERE id = ?`,
      [orderId]
    );

    if (orderRows.length === 0) {
      return res.status(404).json({ success: false, message: "找不到訂單" });
    }

    const [orderItems] = await pool.execute(
      `SELECT oi.quantity, oi.price, p.name, pi.image_url
       FROM order_items oi
       JOIN product_variant pv ON oi.variant_id = pv.id
       JOIN product p ON pv.product_id = p.id
       LEFT JOIN product_images pi ON p.id = pi.product_id AND pi.is_main = 1
       WHERE oi.order_id = ?`,
      [orderId]
    );

    res.json({
      success: true,
      data: {
        order: orderRows[0],
        items: orderItems,
      },
    });
  } catch (error) {
    console.error("查詢簡單訂單失敗", error);
    res.status(500).json({
      success: false,
      message: "查詢訂單失敗",
    });
  }
});

/**
 * ✅ 查詢會員所有訂單 (簡易版)
 * GET /api/orders/user/:userId
 */
router.get("/user/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    const [orderRows] = await pool.execute(
      `SELECT id, total_price, status, createdAt
       FROM orders 
       WHERE user_id = ?
       ORDER BY createdAt DESC`,
      [userId]
    );

    const ordersWithPreview = await Promise.all(
      orderRows.map(async (order) => {
        const [firstItem] = await pool.execute(
          `SELECT p.name, pi.image_url
           FROM order_items oi
           JOIN product_variant pv ON oi.variant_id = pv.id
           JOIN product p ON pv.product_id = p.id
           LEFT JOIN product_images pi ON p.id = pi.product_id AND pi.is_main = 1
           WHERE oi.order_id = ?
           LIMIT 1`,
          [order.id]
        );

        return {
          ...order,
          orderNumber: `OD${String(order.id).padStart(8, "0")}`,
          previewItem: firstItem[0] || null,
        };
      })
    );

    res.json({
      success: true,
      data: ordersWithPreview,
    });
  } catch (error) {
    console.error("獲取用戶訂單失敗:", error);
    res.status(500).json({
      success: false,
      message: "獲取用戶訂單失敗",
      error: error.message,
    });
  }
});

/**
 * ✅ 再買一次
 * POST /api/orders/:orderId/rebuy
 */
router.post("/:orderId/rebuy", async (req, res) => {
  const { orderId } = req.params;
  const { userId } = req.body;

  if (!userId) {
    return res.status(400).json({
      success: false,
      message: "缺少 userId",
    });
  }

  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    // 取得該訂單商品
    const [orderItems] = await connection.execute(
      `SELECT pv.id as variant_id, oi.quantity
       FROM order_items oi
       JOIN product_variant pv ON oi.variant_id = pv.id
       WHERE oi.order_id = ?`,
      [orderId]
    );

    if (!orderItems.length) {
      await connection.rollback();
      return res.status(400).json({
        success: false,
        message: "訂單內無商品可加入購物車",
      });
    }

    // 找到或建立 active 購物車
    const [cartRows] = await connection.execute(
      `SELECT id FROM carts WHERE user_id = ? AND status = 'active'`,
      [userId]
    );

    let cartId;
    if (cartRows.length === 0) {
      const [cartResult] = await connection.execute(
        `INSERT INTO carts (user_id, status) VALUES (?, 'active')`,
        [userId]
      );
      cartId = cartResult.insertId;
    } else {
      cartId = cartRows[0].id;
    }

    // 將商品加入購物車（判斷是否已存在）
    for (const item of orderItems) {
      const [existingItems] = await connection.execute(
        `SELECT id, quantity FROM cart_items WHERE cart_id = ? AND variant_id = ?`,
        [cartId, item.variant_id]
      );

      if (existingItems.length > 0) {
        const newQuantity = existingItems[0].quantity + item.quantity;

        await connection.execute(
          `UPDATE cart_items SET quantity = ? WHERE id = ?`,
          [newQuantity, existingItems[0].id]
        );
      } else {
        await connection.execute(
          `INSERT INTO cart_items (cart_id, variant_id, quantity) VALUES (?, ?, ?)`,
          [cartId, item.variant_id, item.quantity]
        );
      }
    }

    await connection.commit();

    res.json({
      success: true,
      message: "再買一次已加入購物車",
    });
  } catch (error) {
    await connection.rollback();
    console.error("再買一次失敗:", error);
    res.status(500).json({
      success: false,
      message: "再買一次失敗",
      error: error.message,
    });
  } finally {
    connection.release();
  }
});

export default router;
