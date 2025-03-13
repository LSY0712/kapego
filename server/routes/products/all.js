import express from "express";
import { pool } from "../../config/db.js";


const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const { page = 1, limit = 10, sort = 'id', order = 'ASC', series, minPrice, maxPrice } = req.query;
    const offset = (page - 1) * limit;

    const validSortFields = ['id', 'name', 'price', 'created_at'];
    const validOrder = ['ASC', 'DESC'];

    const sortField = validSortFields.includes(sort) ? sort : 'id';
    const sortOrder = validOrder.includes(order.toUpperCase()) ? order.toUpperCase() : 'ASC';

    let whereSQL = 'WHERE 1';
    const params = [];

    if (series) {
      whereSQL += ' AND p.series = ?';
      params.push(series);
    }

    if (minPrice) {
      whereSQL += ' AND p.price >= ?';
      params.push(minPrice);
    }

    if (maxPrice) {
      whereSQL += ' AND p.price <= ?';
      params.push(maxPrice);
    }

    // 查詢商品 + 系列名稱
    const sql = `
  SELECT 
    p.* 
  FROM product p
  ${whereSQL}
  ORDER BY p.${sortField} ${sortOrder}
  LIMIT ? OFFSET ?
`;

    params.push(Number(limit), Number(offset));

    const [rows] = await pool.query(sql, params);

    // 查詢總筆數
    const countSQL = `
      SELECT COUNT(*) AS total
      FROM product p
      ${whereSQL}
    `;
    const [countResult] = await pool.query(countSQL, params.slice(0, -2));

    res.json({
      success: true,
      data: rows,
      total: countResult[0].total,
      page: Number(page),
      limit: Number(limit)
    });

  } catch (error) {
    console.error("取得商品列表失敗:", error);
    res.status(500).json({ success: false, message: "伺服器錯誤" });
  }
});

export default router;
