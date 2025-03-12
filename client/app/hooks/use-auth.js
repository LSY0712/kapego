"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import jwt from "jsonwebtoken";

const appKey = "loginWithToken";
const AuthContext = createContext(null);
AuthContext.displayName = "AuthContext";

export function AuthProvider({ children }) {
  // user 的三個狀態
  // null: 沒有登入
  // -1: 載入中
  // {email: achu@test.com}: 登入

  const [user, setUser] = useState(-1);
  const [profile, setProfile] = useState({
    id: "",
    google_uid: "",
    name: "",
    email: "",
    birthday: "",
    gender: "",
    address: "",
    emergency_contact: "",
    emergency_phone: "",
    img: "/img/default.png",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const router = useRouter();
  const pathname = usePathname();
  const protectedRoutes = ["/admin"];

  useEffect(() => {
    const storedToken = localStorage.getItem(appKey);
    if (
      !storedToken &&
      !["/member/login", "/member/register", "/member/forgot"]
    ) {
      router.replace("/member/login");
    }
  }, [router, pathname]);

  // 處理用戶登入
  const login = async (email, password) => {
    const API = "http://localhost:3005/api/member/users/login";

    try {
      const res = await fetch(API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const result = await res.json();
      console.log(result);
      if (result.status !== "success") throw new Error(result.message);
      const token = result.data.token;
      const newUser = jwt.decode(token);
      setUser(newUser);
      localStorage.setItem(appKey, token);

      await getProfile(newUser.id);

      router.replace("/");
    } catch (err) {
      console.log(err);
      alert(err.message);
      router.replace("/member/register");
    }
  };
  // google 登入
  const googleLogin = async (googleUserData) => {
    const API = "http://localhost:3005/api/member/users/google-login";
  
    try {
      const res = await fetch(API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(googleUserData),
      });
  
      const result = await res.json();
      if (result.status !== "success") throw new Error(result.message);
  
      // 拿到後端回傳的 JWT
      const token = result.data.token;
      const newUser = jwt.decode(token);
  
      // 儲存 token 和 user 狀態
      localStorage.setItem(appKey, token);
      setUser(newUser);
  
      await getProfile(newUser.id);

      console.log("✅ Google 登入成功:", newUser);
      router.replace("/");
  
      return { status: "success", user: newUser };
    } catch (err) {
      console.error("❌ Google 登入失敗:", err);
      alert(err.message || "Google 登入失敗，請稍後再試");
  
      return { status: "error", message: err.message };
    }
  };

  const getProfile = async (userId) => {
    try {
      const token = localStorage.getItem(appKey);
      if (!token) throw new Error("Token 不存在，請重新登入");
  
      const res = await fetch(`http://localhost:3005/api/member/users/${userId}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      const result = await res.json();
  
      if (result.status !== "success") throw new Error(result.message);
  
      console.log("✅ 取得個人資料成功:", result.data);
  
      setProfile(result.data);  // 將資料寫進 profile 狀態
    } catch (err) {
      console.error("❌ 取得個人資料失敗:", err);
    }
  };

// 處理用戶登出
  const logout = async () => {
    let API = "http://localhost:3005/api/member/users/logout";
    let token = localStorage.getItem(appKey);

    try {
        if (!token) throw new Error("身分認證訊息不存在, 請重新登入");

        const res = await fetch(API, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        const result = await res.json();
        if (result.status !== "success") throw new Error(result.message);

        console.log("✅ 成功登出:", result.message);
    } catch (err) {
        console.error("❌ 登出錯誤:", err);
        alert(err.message);
    }

    // 無論 API 成功或失敗，都應該清除 localStorage
    localStorage.removeItem(appKey);
    setUser(null);
    router.push("/");
};

  // 处理用户注册
  const register = async (email, password, password1) => {
    if (password !== password1) {
      return { status: "error", message: "密碼不一致，請重新確認" };
    }
    const API = "http://localhost:3005/api/member/users/register";

    try {
      const res = await fetch(API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, password1 }),
      });

      const result = await res.json();
      if (result.status !== "success") {
        throw new Error(result.message || "註冊失敗，請稍後再試");
      }

      return { status: "success", message: result.message || "註冊成功" };
    } catch (error) {
      console.error("註冊錯誤:", error);
      // 顯示錯誤訊息以便偵錯
      alert(error.message || "註冊失敗，請稍後再試");
      // 如果錯誤訊息中包含 '409' 或 'Email 已存在'，就跳轉到 login 頁面
      if (
        error.message &&
        (error.message.includes("409") || error.message.includes("已存在"))
      ) {
        router.push("/member/login");
      }
    }
  };

  // 獲取使用者個人資料
  useEffect(() => {
    const token = localStorage.getItem(appKey);
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        const res = await fetch(
          "http://localhost:3005/api/member/users/status",
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const result = await res.json();
        if (result.status !== "success") throw new Error(result.message);

        localStorage.setItem(appKey, result.data.token);
        const newUser = jwt.decode(result.data.token);
        console.log("✅ 使用者登入成功:", newUser);
        setUser(newUser);
        await getProfile(newUser.id);
      } catch (err) {
        console.error("❌ 取得用戶狀態失敗:", err);
        localStorage.removeItem(appKey);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        profile,
        loading,
        error,
        login,
        logout,
        register,
        googleLogin,
        getProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
// 使用 Auth
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth 必須在 AuthProvider 內使用");
  }
  return context;
};
