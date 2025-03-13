import pool from "../../config/db.js";

const getProducts = async (req, res, next) => {
  try {
    const [rows] = await pool.query(
      `SELECT * FROM products ORDER BY id DESC`
    );

    res.json({
      success: true,
      data: rows,
    });
  } catch (error) {
    console.error("取得商品清單錯誤", error);
    next(error);
  }
};

export default getProducts;
