import express from "express";

import allRouter from "./all.js";
import detailRouter from "./detail.js";
import createRouter from "./create.js";
import updateRouter from "./update.js";
import deleteRouter from "./delete.js";

const router = express.Router();

router.use("/", allRouter);       // 商品列表 + 篩選 + 分頁
router.use("/", detailRouter);    // 單一商品詳細
router.use("/", createRouter);    // 新增商品
router.use("/", updateRouter);    // 修改商品
router.use("/", deleteRouter);    // 刪除商品

export default router;