import pool from "../../config/db.js";

const createProduct = async (req, res, next) => {
  try {
    const { name, price, category_id, brand_id, description } = req.body;

    if (!name || !price) {
      return res.status(400).json({
        success: false,
        message: "缺少必要欄位",
      });
    }

    const [result] = await pool.query(
      `INSERT INTO products (name, price, category_id, brand_id, description) VALUES (?, ?, ?, ?, ?)`,
      [name, price, category_id, brand_id, description]
    );

    res.json({
      success: true,
      message: "商品新增成功",
      data: { id: result.insertId },
    });
  } catch (error) {
    console.error("新增商品錯誤", error);
    next(error);
  }
};

export default createProduct;
