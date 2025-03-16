"use client";

import { useState } from "react";
import styles from "./Login.module.css";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Link from "next/link";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [step, setStep] = useState(1);

  const handleSendOtp = async () => {
    if (!email) {
      toast.error("請輸入 Email");
      return;
    }

    try {
      const res = await fetch("http://localhost:3005/api/member/otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (data.success) {
        toast.success("驗證碼已寄出！");
        setStep(2);
      } else {
        toast.error(data.message || "寄送失敗");
      }
    } catch (err) {
      toast.error("系統錯誤，請稍後再試");
    }
  };

  const handleResetPassword = async () => {
    if (!otp || !newPassword) {
      toast.error("請填寫驗證碼與新密碼");
      return;
    }

    try {
      const res = await fetch("http://localhost:3005/api/member/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, token: otp, password: newPassword }),
      });

      const data = await res.json();

      if (data.success) {
        toast.success("密碼已重設！");
        setTimeout(() => {
          window.location.href = "/member/login";
        }, 2000);
      } else {
        toast.error(data.message || "重設失敗");
      }
    } catch (err) {
      toast.error("系統錯誤，請稍後再試");
    }
  };

  return (
    <div className={styles.loginPage}>
      <ToastContainer position="top-center" />

      <div className={styles.main}>
        <img src="/img/logoblack.png" alt="logo" className={styles.logo} />

        <div className={styles.sectionLogin}>
          <h3>忘記密碼</h3>

          {/* 步驟 1：輸入 email */}
          {step === 1 && (
            <>
              <input
                type="email"
                className={styles.wordbox}
                placeholder="請輸入註冊信箱"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <div className={styles.loginBtn} onClick={handleSendOtp}>
                <h6>發送驗證碼</h6>
              </div>
            </>
          )}

          {/* 步驟 2：輸入 OTP 與新密碼 */}
          {step === 2 && (
            <>
              <input
                type="text"
                className={styles.wordbox}
                placeholder="請輸入驗證碼"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
              />

              <input
                type="password"
                className={styles.wordbox}
                placeholder="請輸入新密碼"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />

              <div className={styles.loginBtn} onClick={handleResetPassword}>
                <h6>重設密碼</h6>
              </div>
            </>
          )}

          <div className={styles.fcBox}>
            <Link href="/member/login" className={styles.ftext}>
              回到登入
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
