import pool from "../../config/db.js";

const getProductById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const [rows] = await pool.query(
      `SELECT * FROM products WHERE id = ?`, [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "找不到該商品",
      });
    }

    res.json({
      success: true,
      data: rows[0],
    });
  } catch (error) {
    console.error("取得單一商品錯誤", error);
    next(error);
  }
};

export default getProductById;
