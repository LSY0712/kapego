import express from "express";
import { pool } from "../../config/db.js";
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    const sql = `
      SELECT 
        p.id, p.name, p.price, p.series,
        pi.image_path AS main_image
      FROM product p
      LEFT JOIN product_images pi 
        ON p.id = pi.product_id AND pi.sort_order = 1
      ORDER BY p.id ASC
      LIMIT ? OFFSET ?
    `;
    const [rows] = await pool.query(sql, [Number(limit), Number(offset)]);

    res.json({
      success: true,
      data: rows,
      page: Number(page),
      limit: Number(limit)
    });
  } catch (error) {
    console.error("取得商品列表失敗:", error);
    res.status(500).json({ success: false, message: "伺服器錯誤" });
  }
});


export default router;
