import pool from "../../config/db.js";

const updateProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, price, category_id, brand_id, description } = req.body;

    const [result] = await pool.query(
      `UPDATE products SET name = ?, price = ?, category_id = ?, brand_id = ?, description = ? WHERE id = ?`,
      [name, price, category_id, brand_id, description, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "找不到該商品",
      });
    }

    res.json({
      success: true,
      message: "商品更新成功",
    });
  } catch (error) {
    console.error("更新商品錯誤", error);
    next(error);
  }
};

export default updateProduct;
