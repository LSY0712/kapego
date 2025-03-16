import express from "express";
import { pool } from "../../config/db.js";

const router = express.Router();

router.get("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);

    // 查詢單一商品 + 系列名稱
    const productSql = `
      SELECT 
        p.*
      FROM product p
      WHERE p.id = ?
    `;

    const [productRows] = await pool.query(productSql, [id]);
    
    if (!Array.isArray(productRows) || productRows.length === 0) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }


    const product = productRows[0];

    // 查詢圖片（如果有圖片表的話，假設是 product_images）
    const imagesSql = `
      SELECT id, image_path
      FROM product_images
      WHERE product_id = ?
      ORDER BY sort_order ASC
    `;

    const [imageRows] = await pool.query(imagesSql, [id]);

    // 整合資料
    const result = {
      ...product,
      images: imageRows || [],
    };

    res.json({ success: true, data: result });
  } catch (error) {
    console.error("取得商品詳細失敗:", error);
    res.status(500).json({ success: false, message: "伺服器錯誤" });
  }
});

export default router;
