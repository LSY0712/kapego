import nodemailer from "nodemailer";
import { serverConfig } from "../config/server.config.js";
import { isDev } from "./utils.js"; // 假設你有環境偵測工具

// smtp 設定（目前只用 gmail）
const { host, user, pass, provider } = serverConfig.smtp;

const gmailTransport = {
  host,
  port: 465,
  secure: true,
  auth: {
    user,
    pass,
  },
  tls: {
    rejectUnauthorized: false,
  },
};

const transport = provider === "gmail" ? gmailTransport : ethereal;

// ✅ 產生 OTP 信件 HTML
const otpMailHtml = (otpToken, secret) => `
<!DOCTYPE html>
<html lang="zh-TW">
<head>
  <meta charset="UTF-8">
  <title>重設登入密碼的一次性驗證碼</title>
</head>
<body style="font-family: Arial, sans-serif; background: #f5f5f5; padding: 20px;">
  <div style="max-width: 600px; margin: 0 auto; background: #fff; padding: 20px; border-radius: 8px;">
    <h2 style="color: #333;">重設登入密碼的一次性驗證碼 (OTP)</h2>
    <p>親愛的會員您好：</p>
    <p>您的一次性驗證碼為：</p>
    <h1 style="color: #007BFF; font-size: 24px;">${otpToken}</h1>
    <p>請於 5 分鐘內使用該驗證碼完成驗證。</p>
    <p>或點擊以下連結直接進行重設密碼：</p>
    <a href="${serverConfig.nextUrl}/reset-password?secret=${secret}" style="color: #007BFF;">
      重設密碼連結
    </a>
    <hr />
    <small>如果您沒有申請重設密碼，請忽略此封郵件。</small>
  </div>
</body>
</html>
`;

// ✅ 產生 OTP 純文字
const otpMailText = (otpToken, secret) => `
親愛的會員您好：

您的一次性驗證碼為：${otpToken}
請於 5 分鐘內完成驗證。

也可以直接點擊重設密碼頁面：
${serverConfig.nextUrl}/reset-password?secret=${secret}

如果您沒有申請重設密碼，請忽略此郵件。
`;

// ✅ 發送 OTP 驗證信
export const sendOtpMail = async (toEmail, otpToken, secret = "") => {
  if (isDev) console.log("[OTP]", otpToken);

  const transporter = nodemailer.createTransport(transport);

  const mailOptions = {
    from: user,
    to: toEmail,
    subject: "重設登入密碼的一次性驗證碼",
    text: otpMailText(otpToken, secret),
    html: otpMailHtml(otpToken, secret),
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    if (isDev) console.log("✉️ 郵件發送成功:", info.messageId);
  } catch (error) {
    console.error("❌ 郵件發送失敗:", error);
    throw new Error("無法寄送驗證信，請稍後再試");
  }
};
