import express from "express";
import pool from "../../config/db.js"; // 你自己的 mysql2 連線池

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const { page = 1, limit = 10, sort = 'id', order = 'ASC', series } = req.query;
    const offset = (page - 1) * limit;

    let sql = "SELECT * FROM product";
    const params = [];

    if (series) {
      sql += " WHERE series = ?";
      params.push(series);
    }

    sql += ` ORDER BY ${sort} ${order} LIMIT ? OFFSET ?`;
    params.push(Number(limit), Number(offset));

    const [rows] = await pool.query(sql, params);

    res.json({ success: true, data: rows });
  } catch (error) {
    console.error("取得商品列表失敗:", error);
    res.status(500).json({ success: false, message: "伺服器錯誤" });
  }
});

export default router;
