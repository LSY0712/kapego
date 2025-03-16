import express from "express";
import "dotenv/config.js";
import cors from "cors";
import logger from "morgan";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";
import createError from "http-errors";

// 路由模組
import productRouter from "../routes/products/index.js";
import favoritesRouter from "../routes/favorites/index.js";
import cartRouter from "../routes/cart/index.js"; 
import checkoutRouter from "../routes/checkout/index.js";
import ecpayRouter from "../routes/ecpay/index.js";
import linepayRouter from "../routes/linepay/index.js";
import orderRouter from "../routes/order/index.js";
import memberRouter from "../routes/member/index.js";

const app = express();

// 設定 CORS
app.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:3001"], // 只允許前端的域名
    credentials: true,
  })
);

// 獲取當前目錄
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// 中間件
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// 靜態資源
app.use("/img", express.static('public/img'));
app.use(express.static(path.join(process.cwd(), "../public")));

// 測試 API
app.get("/", (req, res) => {
  res.json({ message: "Express server is running" });
});

// API 路由群組
const apiRouter = express.Router();
app.use("/api", apiRouter);

// 產品相關
apiRouter.use("/products", productRouter);
apiRouter.use("/favorites", favoritesRouter);
apiRouter.use("/cart", cartRouter);
apiRouter.use("/checkout", checkoutRouter);
apiRouter.use("/ecpay", ecpayRouter);
apiRouter.use("/linepay", linepayRouter);
apiRouter.use("/order", orderRouter);
apiRouter.use("/member", memberRouter);

// 捕捉 404 錯誤
app.use((req, res, next) => {
  next(createError(404));
});

// 全域錯誤處理
app.use((err, req, res, next) => {
  res.status(err.status || 500).json({
    status: "error",
    message: err.message,
  });
});

// 啟動伺服器
const port = process.env.PORT || 3005;
app.listen(port, () => {
  console.log(`後端伺服器運行在 http://localhost:${port}`);
});

export default app;
