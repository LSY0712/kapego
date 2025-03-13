import pool from "../../config/db.js";

const deleteProduct = async (req, res, next) => {
  try {
    const { id } = req.params;

    const [result] = await pool.query(
      `DELETE FROM products WHERE id = ?`,
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "找不到該商品",
      });
    }

    res.json({
      success: true,
      message: "商品刪除成功",
    });
  } catch (error) {
    console.error("刪除商品錯誤", error);
    next(error);
  }
};

export default deleteProduct;
