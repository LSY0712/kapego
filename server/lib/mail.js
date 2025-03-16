import nodemailer from "nodemailer";
import { serverConfig } from "../config/server.config.js";

// 判斷是否開發環境
const env = process.env.NODE_ENV || "development";
const isDev = env === "development";

// smtp 設定（目前只用 gmail）
const { host, user, pass, provider } = serverConfig.smtp;

// Gmail SMTP 設定
const gmailTransport = {
  host,
  port: 465,             // SSL port
  secure: true,          // 465 需要 secure:true
  auth: {
    user,
    pass,
  },
  tls: {
    rejectUnauthorized: false, // 可避免自簽憑證錯誤（一般 Gmail 不用這個）
  },
};

// 目前只寫 Gmail，若 provider 還有 ethereal，可以自己補
const transport = gmailTransport;

// ✅ 產生 OTP 信件 HTML
const otpMailHtml = (otpToken) => `
<!DOCTYPE html>
<html lang="zh-TW">
<head>
  <meta charset="UTF-8">
  <title>您的驗證碼</title>
</head>
<body style="font-family: Arial, sans-serif; background: #f5f5f5; padding: 20px;">
  <div style="max-width: 600px; margin: 0 auto; background: #fff; padding: 20px; border-radius: 8px;">
    <h2 style="color: #333;">您的一次性驗證碼 (OTP)</h2>
    <p>親愛的會員您好：</p>
    <p>您的一次性驗證碼為：</p>
    <h1 style="color: #007BFF; font-size: 24px;">${otpToken}</h1>
    <p>請於 5 分鐘內使用該驗證碼完成驗證。</p>
    <hr />
    <small>如果您沒有申請驗證碼，請忽略此封郵件。</small>
  </div>
</body>
</html>
`;

// ✅ 產生 OTP 純文字
const otpMailText = (otpToken) => `
親愛的會員您好：

您的一次性驗證碼為：${otpToken}
請於 5 分鐘內完成驗證。

如果您沒有申請驗證碼，請忽略此郵件。
`;

// ✅ 發送 OTP 驗證信
export const sendOtpMail = async (otpToken) => {
  if (isDev) console.log("[OTP]", otpToken);

  const transporter = nodemailer.createTransport(transport);

  const mailOptions = {
    from: user,                  // 發件人信箱
    to: user,                    // 🔥🔥🔥 寫死寄給自己（目前測試）
    subject: "您的一次性驗證碼",
    text: otpMailText(otpToken), // 純文字
    html: otpMailHtml(otpToken), // HTML 內容
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("✅ 郵件發送成功:", info.messageId);
  } catch (error) {
    console.error("❌ 郵件發送失敗:", error);
    throw new Error("無法寄送驗證信，請稍後再試");
  }
};
