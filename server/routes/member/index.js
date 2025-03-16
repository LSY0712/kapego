import express, { json } from "express";
import multer from "multer";
import moment from "moment";
import cors from "cors";
import { checkToken } from "../../middleware/auth.js";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import { pool } from "../../config/db.js";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { sendOtpMail } from "../../lib/mail.js";
import { generateToken } from "../../lib/otp.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const whiteList = ["http://localhost:3301", "http://localhost:3000"];
const corsOptions = {
  credentials: true,
  origin(origin, callback) {
    if (!origin || whiteList.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("不允許連線"));
    }
  },
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, "../../public/img/member"); // **這樣會存到伺服器內**

    // **確保資料夾存在**
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }

    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, uuidv4() + path.extname(file.originalname));
  },
});

// **正確初始化 `multer`**
const upload = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const fileTypes = /jpeg|jpg|png|webp/;
    const extname = fileTypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    const mimetype = fileTypes.test(file.mimetype);
    if (extname && mimetype) {
      return cb(null, true);
    } else {
      return cb(new Error("❌ 只允許上傳 JPEG、JPG、PNG、GIF 格式的圖片"));
    }
  },
});

const router = express.Router();
router.use(cors(corsOptions));
router.use(express.json());
router.use(express.urlencoded({ extended: true }));

// otp驗證碼
router.post("/users/otp", async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({
      success: false,
      message: "請提供 Email！",
    });
  }

  try {
    const { token: otpToken } = generateToken(); // 隨機 OTP
    const expiresAt = new Date(Date.now() + 30 * 60 * 1000); // 30 分鐘後過期

    // 查詢 OTP 是否存在
    const [existing] = await pool.execute("SELECT * FROM otp WHERE email = ?", [
      email,
    ]);

    if (existing.length > 0) {
      // 更新 OTP
      await pool.execute(
        "UPDATE otp SET token = ?, expires_at = ? WHERE email = ?",
        [otpToken, expiresAt, email]
      );
    } else {
      // 新增 OTP
      await pool.execute(
        "INSERT INTO otp (email, token, created_at, expires_at) VALUES (?, ?, NOW(), ?)",
        [email, otpToken, expiresAt]
      );
    }

    console.log("✅ 產生 OTP：", otpToken);

    // 發送 email（把 email 傳進去！）
    await sendOtpMail(email, otpToken);

    res.json({
      success: true,
      message: "驗證碼已寄出，請檢查您的信箱！",
    });
  } catch (error) {
    console.error("❌ 發送 OTP 發生錯誤:", error);
    res.status(500).json({
      success: false,
      message: "伺服器錯誤，無法寄送驗證碼",
    });
  }
});

// 重設密碼
router.post("/users/reset-password", async (req, res) => {
  const { email, token, password } = req.body;

  console.log("📦 [重設密碼] 收到參數:", { email, token, password });

  if (!email || !token || !password) {
    console.log("⚠️ 條件未通過:", { email, token, password });
    return res.status(400).json({
      success: false,
      message: "請填寫所有欄位",
    });
  }

  try {
    console.log("✅ 條件通過，進入驗證流程");

    // 查找 OTP 驗證（確認這裡有沒有問題）
    const [rows] = await pool.execute(
      "SELECT * FROM otp WHERE email = ? AND token = ?",
      [email, token]
    );

    console.log("🔎 查詢 OTP 結果:", rows);

    if (rows.length === 0) {
      return res.status(400).json({
        success: false,
        message: "驗證碼錯誤或已過期",
      });
    }
    // ✅ 密碼 hash
    const hashedPassword = await bcrypt.hash(password, 10);
    await pool.execute("UPDATE users SET password = ? WHERE email = ?", [
      hashedPassword,
      email,
    ]);

    // ✅ 刪除 OTP
    await pool.execute("DELETE FROM otp WHERE email = ?", [email]);

    res.json({
      success: true,
      message: "密碼已成功重設！",
    });
  } catch (error) {
    console.error("❌ 重設密碼發生錯誤:", error);
    res.status(500).json({
      success: false,
      message: "伺服器錯誤，無法重設密碼",
    });
  }
});

// 測試 API
router.get("/", (req, res) => {
  res.json({ status: "success", data: null, message: "會員首頁" });
});

// 取得所有使用者
router.get("/users", async (req, res) => {
  try {
    const [rows] = await pool.execute("SELECT * FROM `users`");
    res.status(200).json({
      status: "success",
      data: rows,
      message: "取得資料成功",
    });
  } catch (err) {
    res.status(400).json({
      status: "error",
      message: err.message || "取得資料失敗",
    });
  }
});

router.get("/users/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const sql =
      "SELECT id, name, email, birthday, gender, phone, address, emergency_contact, emergency_phone, img FROM `users` WHERE id = ?";
    const [rows] = await pool.execute(sql, [id]);

    if (rows.length === 0) {
      return res
        .status(404)
        .json({ status: "error", message: "找不到該使用者" });
    }
    const genderReverseMapping = {
      1: "male",
      2: "female",
      3: "other",
    };
    rows[0].gender = genderReverseMapping[rows[0].gender] || "";

    console.log("後端返回的 user 資料:", rows[0]);

    res.status(200).json({
      status: "success",
      data: rows[0],
      message: "成功獲取使用者資料",
    });
  } catch (err) {
    console.error("獲取使用者失敗:", err);
    res.status(500).json({ status: "error", message: "伺服器錯誤" });
  }
});

router.put("/users/:id", checkToken, async (req, res) => {
  const { id } = req.params;
  if (parseInt(id) !== req.decoded.id) {
    return res.status(403).json({
      status: "error",
      message: "沒有修改權限",
    });
  }
  const {
    name,
    password,
    phone,
    gender,
    birthday,
    address,
    emergency_contact,
    emergency_phone,
  } = req.body;

  try {
    const updateFields = [];
    const values = [];
    const genderMapping = {
      male: 1,
      female: 2,
      other: 3,
    };
    const genderValue = genderMapping[gender] || 0;

    const fields = [
      { key: "name", value: name },
      { key: "password", value: password, hash: true },
      {
        key: "phone",
        value: phone,
        regex: /^09\d{8}$/,
        errorMsg: "手機號碼格式不正確",
      },
      { key: "gender", value: genderValue },
      { key: "birthday", value: birthday },
      { key: "address", value: address },
      { key: "emergency_contact", value: emergency_contact },
      {
        key: "emergency_phone",
        value: emergency_phone,
        regex: /^09\d{8}$/,
        errorMsg: "手機號碼格式不正確",
      },
    ];
    for (const field of fields) {
      if (field.value) {
        if (field.regex && !field.regex.test(field.value)) {
          return res.status(400).json({
            status: "error",
            message: field.errorMsg,
          });
        }
        updateFields.push("`" + field.key + "` = ?");
        if (field.hash) {
          const hashed = await bcrypt.hash(field.value, 10);
          values.push(hashed);
        } else {
          values.push(field.value);
        }
      }
    }
    updateFields.push("`updated_at` = NOW()");
    // 若沒有任何欄位需要更新，直接回傳
    if (updateFields.length === 0) {
      return res.status(400).json({
        status: "error",
        message: "沒有任何欄位需要更新",
      });
    }

    // 最後將 id 加入作為條件
    values.push(id);
    const sql = `UPDATE users SET ${updateFields.join(", ")} WHERE id = ?;`;
    const [result] = await pool.execute(sql, values);

    if (result.affectedRows === 0) {
      throw new Error("更新失敗");
    }

    res.status(200).json({
      status: "success",
      message: `更新個人資料成功`,
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({
      status: "error",
      message: err.message || "修改失敗",
    });
  }
});

router.post("/users/register", async (req, res) => {
  const { email, password } = req.body;
  const createAt = new Date();

  if (!email || !password) {
    return res.status(400).json({ message: "請提供Email或密碼" });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: "請提供有效的 Email" });
  }

  try {
    const checkSql = "SELECT * FROM `users` WHERE email = ?";
    const [existingUser] = await pool.execute(checkSql, [email]);
    console.log(existingUser);
    if (existingUser.length > 0) {
      return res
        .status(409)
        .json({ status: "exists", message: "Email 已存在" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const sql =
      "INSERT INTO `users` (`email`, `password`, `img`, `created_at`) VALUES (?, ?, ?, ?)";
    const imgPath = "/img/default.png";
    const [result] = await pool.execute(sql, [
      email,
      hashedPassword,
      imgPath,
      createAt,
    ]);

    res
      .status(201)
      .json({
        status: "success",
        message: "註冊成功",
        userId: result.insertId,
        img: imgPath,
      });
  } catch (error) {
    console.error("註冊錯誤:", error);
    res.status(500).json({ status: "error", message: "註冊失敗" });
  }
});

router.post("/users/google-login", async (req, res) => {
  const { uid, displayName, email, photoURL } = req.body;

  if (!email || !uid) {
    return res.status(400).json({ message: "缺少必要的使用者資訊" });
  }

  try {
    const checkSql = "SELECT * FROM users WHERE email = ? OR google_uid = ?";
    const [existingUser] = await pool.execute(checkSql, [email, uid]);

    let userId;

    if (existingUser.length > 0) {
      userId = existingUser[0].id;

      // 不改 img，只更新 google_uid 跟 name
      const updateSql = `
        UPDATE users 
        SET google_uid = ?
        WHERE id = ?
      `;
      await pool.execute(updateSql, [
        uid,
        displayName || email.split("@")[0],
        userId,
      ]);
    } else {
      // 新增帳號才帶 img
      const insertSql = `
        INSERT INTO users (email, google_uid, name, img, created_at)
        VALUES (?, ?, ?, ?, NOW())
      `;
      const [result] = await pool.execute(insertSql, [
        email,
        uid,
        displayName || email.split("@")[0],
        photoURL || "/img/default.png",
      ]);
      userId = result.insertId;
    }

    // 建立 JWT
    const token = jwt.sign(
      {
        id: userId,
        email,
      },
      process.env.JWT_SECRET,
      { expiresIn: "30m" }
    );

    res.status(200).json({
      status: "success",
      data: { token },
      message: "Google 登入成功",
    });
  } catch (error) {
    console.error("Google 登入錯誤:", error);
    res.status(500).json({ status: "error", message: "Google 登入失敗" });
  }
});

// 上傳頭像
router.post("/users/upload", upload.single("avatar"), async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({
        status: "error",
        message: "❌ 缺少使用者 ID",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        status: "error",
        message: "❌ 請選擇一張圖片",
      });
    }

    const imagePath = `/img/member/${req.file.filename}`;

    console.log("✅ 上傳成功，圖片路徑:", imagePath);

    const sql = "UPDATE users SET img = ? WHERE id = ?";
    const [result] = await pool.execute(sql, [imagePath, userId]);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        status: "error",
        message: "找不到該使用者，更新失敗",
      });
    }

    res.json({
      status: "success",
      message: "✅ 圖片上傳成功！",
      img: imagePath,
    });
  } catch (err) {
    console.error("❌ 圖片存儲失敗:", err);
    res.status(500).json({
      status: "error",
      message: "❌ 圖片存儲失敗",
    });
  }
});

router.delete("/users/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const sql = "DELETE FROM `users` WHERE id = ?";
    const [result] = await pool.execute(sql, [id]);

    if (result.affectedRows === 0) throw new Error("刪除失敗，找不到該使用者");

    res.status(200).json({
      status: "success",
      message: `成功刪除使用者 ID: ${id}`,
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({
      status: "error",
      message: err.message || "刪除失敗",
    });
  }
});

router.post("/users/login", upload.none(), async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "請提供Email 和密碼" });
  }

  try {
    const sql = "SELECT * FROM `users` WHERE email = ?";
    const [rows] = await pool.execute(sql, [email]);

    if (rows.length == 0) throw new Error("Email 不存在");

    const user = rows[0];

    const isMatch = await bcrypt.compare(password, user.password);
    // console.log(password, user.password);
    // console.log("輸入密碼:", password);
    // console.log("資料庫密碼:", user.password);
    // console.log("比對結果:", isMatch);
    if (!isMatch) throw new Error("帳號或密碼錯誤");

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
      },
      process.env.JWT_SECRET,
      { expiresIn: "30m" }
    );

    res.status(200).json({
      status: "success",
      data: { token },
      message: "登入成功",
    });
  } catch (err) {
    console.log("登入錯誤:", err); // 打印錯誤詳細信息
    res.status(400).json({
      status: "error",
      message: err.message ? err.message : "登入失敗",
    });
  }
});

router.post("/users/logout", checkToken, (req, res) => {
  try {
    res.clearCookie("token"); // 清除 token（如果存放於 cookie）
    res.json({
      status: "success",
      message: "登出成功",
    });
  } catch (error) {
    console.error("登出錯誤:", error);
    res.status(500).json({
      status: "error",
      message: "伺服器錯誤，登出失敗",
    });
  }
});

router.post("/users/status", checkToken, (req, res) => {
  const { decoded } = req;
  const token = jwt.sign(
    {
      id: decoded.id,
      email: decoded.email, // 改成這裡
      name: decoded.name,
    },
    process.env.JWT_SECRET,
    { expiresIn: "30m" }
  );
  res.json({
    status: "success",
    data: { token },
    message: "狀態: 登入中",
  });
});

export { upload };
export { checkToken };
export default router;
