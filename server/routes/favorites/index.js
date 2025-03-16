import express from "express";
import { pool } from "../../config/db.js";
import { checkToken } from "../../middleware/auth.js";

const router = express.Router();

// 🔒 所有收藏 API 都套用驗證
router.use(checkToken);

// ✅ 取得收藏清單（只抓商品）
router.get("/", async (req, res) => {
  const userId = req.decoded.id;

  try {
    const [products] = await pool.execute(
      `SELECT f.product_id, p.name, p.description, pi.image_path AS image_url, pv.price
       FROM favorites f
       JOIN product p ON f.product_id = p.id
       LEFT JOIN product_images pi ON p.id = pi.product_id AND pi.sort_order = 1
       LEFT JOIN product_variant pv ON p.id = pv.product_id
       WHERE f.user_id = ? AND f.product_id != 0`,
      [userId]
    );

    res.json({
      success: true,
      data: products,
      message: "取得商品收藏成功"
    });
  } catch (error) {
    console.error("取得收藏清單錯誤:", error);
    res.status(500).json({
      success: false,
      message: "取得收藏清單失敗"
    });
  }
});

// ✅ 加入收藏（單一或多個 product）
router.post("/", async (req, res) => {
  const userId = req.decoded.id;
  const { productIds } = req.body;

  if (!productIds || productIds.length === 0) {
    return res.status(400).json({
      success: false,
      message: "請提供至少一個商品 ID"
    });
  }

  const ids = Array.isArray(productIds) ? productIds : [productIds];

  try {
    // 驗證商品是否存在
    const [existingProducts] = await pool.execute(
      `SELECT id FROM product WHERE id IN (${ids.join(",")})`
    );

    const existingIds = existingProducts.map((p) => p.id);
    const invalidIds = ids.filter((id) => !existingIds.includes(id));

    if (invalidIds.length > 0) {
      return res.status(404).json({
        success: false,
        message: `找不到商品 ID: ${invalidIds.join(", ")}`
      });
    }

    // 查找已收藏項目
    const [existingFavorites] = await pool.execute(
      `SELECT product_id FROM favorites WHERE user_id = ? AND product_id IN (${ids.join(",")})`,
      [userId]
    );

    const alreadyFavoriteIds = existingFavorites.map((f) => f.product_id);
    const newIds = ids.filter((id) => !alreadyFavoriteIds.includes(id));

    if (newIds.length === 0) {
      return res.json({
        success: true,
        message: "這些商品已在收藏中"
      });
    }

    // 新增收藏
    const values = newIds.map((id) => `(${userId}, ${id})`).join(", ");

    await pool.execute(
      `INSERT INTO favorites (user_id, product_id) VALUES ${values}`
    );

    res.json({
      success: true,
      message: "商品已成功加入收藏"
    });
  } catch (error) {
    console.error("加入收藏錯誤:", error);
    res.status(500).json({
      success: false,
      message: "加入商品收藏失敗"
    });
  }
});

// ✅ 移除收藏（單一或多個 product）
router.delete("/", async (req, res) => {
  const userId = req.decoded.id;
  const { productIds } = req.body;

  if (!productIds || productIds.length === 0) {
    return res.status(400).json({
      success: false,
      message: "請提供至少一個商品 ID"
    });
  }

  const ids = Array.isArray(productIds) ? productIds : [productIds];

  try {
    const [result] = await pool.execute(
      `DELETE FROM favorites WHERE user_id = ? AND product_id IN (${ids.join(",")})`,
      [userId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "沒有找到對應的商品收藏"
      });
    }

    res.json({
      success: true,
      message: "商品已成功移除收藏"
    });
  } catch (error) {
    console.error("移除收藏錯誤:", error);
    res.status(500).json({
      success: false,
      message: "移除商品收藏失敗"
    });
  }
});

export default router;
