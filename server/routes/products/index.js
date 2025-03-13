import express from "express";

import allRouter from "./all.js";
import detailRouter from "./detail.js";

const router = express.Router();

router.use("/", allRouter);       // 商品列表 + 篩選 + 分頁
router.use("/", detailRouter);    // 單一商品詳細

export default router;