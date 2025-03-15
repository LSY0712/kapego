"use client";
import styles from "./Login.module.css";
import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { auth, googleProvider } from "@/firebase/firebase-config"; 
import { signInWithPopup } from "firebase/auth";

export default function Login() {
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const { user, login, googleLogin } = useAuth() || {};
  const router = useRouter();

const handleGoogleLogin = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const googleUser = result.user;

    const loginResult = await googleLogin({
      providerId: googleUser.providerData[0].providerId,
      uid: googleUser.uid,
      displayName: googleUser.displayName,
      email: googleUser.email,
      photoURL: googleUser.photoURL,
    });

    if (loginResult.status === "success") {
      alert("Google 登入成功！");
      router.push("/");
    } else {
      alert("Google 登入失敗，請稍後再試");
    }
  } catch (error) {
    console.error("Google 登入錯誤:", error);
    alert("Google 登入失敗，請稍後再試");
  }
};

  const handleLogin = () => {
    if (!email.trim() || !password.trim()) {
      alert("請輸入 Email 和密碼！");
      return;
    }
    console.log(email, password);

    if (typeof login === "function") {
      login(email, password);
    } else {
      console.error("login is not a function");
    }
  };

  useEffect(() => {
    if (!user) setCheckingAuth(false);
  }, [user]);

  if (checkingAuth) {
    return <div>載入中...</div>;
  }

  return (
    <div className={styles.loginPage}>
      <div className={styles.main}>
        <img
          src="/img/logoblack.png"
          alt="logo"
          className={styles.logo}
        />
        <div className={styles.line1}></div>
        <div className={styles.sectionLogin}>
          <h3>登入</h3>
          <input
            type="email"
            name="email"
            className={styles.wordbox}
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
            }}
            placeholder="Email"
          />
          <div style={{ position: "relative" }}>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              className={styles.wordbox}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="密碼"
            />
            <span
              onClick={() => setShowPassword(!showPassword)}
              style={{
                position: "absolute",
                right: "2rem",
                top: "50%",
                transform: "translateY(-50%)",
                cursor: "pointer",
              }}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>
          <div className={styles.loginWays}>
            <div className={styles.loginBtn} onClick={handleLogin}>
              <h6>登入</h6>
            </div>
            <div className={styles.or}>
              <div className={styles.line2}></div>
              <p>或</p>
              <div className={styles.line2}></div>
            </div>
            <div className={styles.loginGoogle}>
              <div className={styles.googleBox} onClick={handleGoogleLogin}>
                <img src="/img/ic_google.svg" alt="Google logo" />
                <h6>Continue with Google</h6>
              </div>
            </div>
            <div className={styles.fcBox}>
              <Link href="/member/forgot" className={styles.ftext}>
                忘記密碼？
              </Link>
              <Link href="/member/register" className={styles.ctext}>
                註冊新帳號！
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
