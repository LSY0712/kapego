import express from "express";
import { pool } from "../../config/db.js";

const router = express.Router();

/* ✅ 查詢會員所有訂單
 * GET /api/orders/user/:userId
 */
router.get("/user/:userId", async (req, res) => {
  const { userId } = req.params;

  console.log("👉 收到請求 userId:", req.params.userId);
  try {
    const [orderRows] = await pool.execute(
      `SELECT id, total_price, total_items, status, createdAt
       FROM orders 
       WHERE user_id = ?
       ORDER BY createdAt DESC`,
      [userId]
    );

    const ordersAll = await Promise.all(
      orderRows.map(async (order) => {
        const [items] = await pool.execute(
          `SELECT p.name, pi.image_path AS image_url, oi.quantity, oi.price
           FROM order_items oi
           JOIN product p ON oi.product_id = p.id
           LEFT JOIN (
         SELECT DISTINCT product_id, image_path
         FROM product_images
         GROUP BY product_id
       ) pi ON p.id = pi.product_id
           WHERE oi.order_id = ?`,
          [order.id]
        );

        return {
          ...order,
          orderNumber: `OD${String(order.id).padStart(8, "0")}`,
          items: items || [],
        };
      })
    );

    res.json({
      success: true,
      data: ordersAll,
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

  if (!userId || typeof userId !== "number") {
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
      `SELECT oi.product_id, p.name, oi.quantity, oi.price
       FROM order_items oi
       JOIN product p ON oi.product_id = p.id
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
  //     console.log("cartId:", cartId);
  // console.log("item.product_id:", item.product_id);
  // console.log("item.quantity:", item.quantity);
      const [existingItems] = await connection.execute(
        `SELECT id, quantity FROM cart_items WHERE cart_id = ? AND product_id = ?`,
        [cartId, item.product_id]
      );
      
      if (existingItems.length > 0) {
        const newQuantity = existingItems[0].quantity + item.quantity;

        await connection.execute(
          `UPDATE cart_items SET quantity = ? WHERE id = ?`,
          [newQuantity, existingItems[0].id]
        );
      } else {
        await connection.execute(
          `INSERT INTO cart_items (cart_id, product_id, quantity) VALUES (?, ?, ?)`,
          [cartId, item.product_id, item.quantity]
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
