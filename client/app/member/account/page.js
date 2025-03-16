"use client";

import { useAuth } from "@/hooks/use-auth";
import styles from "./account.module.css";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { FaUser, FaClipboardList, FaHeart } from "react-icons/fa";
import UploadAvatar from "@/member/components/UploadAvatar";
import PasswordResetModal from "@/member/components/PasswordResetModal";

export default function Account() {
  const router = useRouter();
  const pathname = usePathname();
  const { user, profile, loading, getProfile } = useAuth();
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  // 初始化用戶數據
  const [userData, setUserData] = useState({
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

  // 處理表單輸入
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData((prev) => ({
      ...prev, // 保留其他欄位
      [name]: value, // 只更新這次輸入的欄位
    }));
  };
  // 更新用戶信息
  const handleUpdateUser = async (e) => {
    e.preventDefault();
    try {
      const storedToken = localStorage.getItem("loginWithToken");
      if (!storedToken) {
        alert("❌ 無法獲取 Token，請重新登入");
        router.replace("/member/login");
        return;
      }

      const userId = user?.id || profile?.id;
      if (!userId) {
        alert("❌ 無法獲取用戶 ID，請重新登入");
        return;
      }
      const filteredData = Object.fromEntries(
        Object.entries(userData).filter(([_, v]) => v !== "")
      );

      const res = await fetch(
        `http://localhost:3005/api/member/users/${user.id}`,
        {
          method: "PUT",
          body: JSON.stringify(filteredData),
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${storedToken}`,
          },
        }
      );

      const result = await res.json();
      alert(result.message);
      if (result.status === "success") {
        setUserData((prev) => ({
          ...prev,
          ...result.data, // 更新已修改的欄位
        }));
      }
    } catch (error) {
      console.error("更新用户信息失败:", error);
    }
  };

  const handleOpenModal = () => {
    setStep(1); // 每次開都從第一步開始
    setShowModal(true);
  };
  const handleSendCode = () => {
    // 這裡應該檢查 email 格式
    // 發送 API
    console.log("驗證碼已發送");
    setStep(2); // 切到下一步
  };
  const handleSubmitPassword = () => {
    // 驗證兩次密碼一致
    // 送 API 修改密碼
    console.log("密碼已修改");
    setShowModal(false);
  };

  // 設定「發送驗證碼」按鈕的點擊事件，驗證成功後切換 Modal
  useEffect(() => {
    const sendCodeBtn = document.getElementById("sendCodeBtn");
    if (!sendCodeBtn) return;

    const handleSendCodeClick = () => {
      const staticBackdropModalEl = document.getElementById("staticBackdrop");
      const passwordModalEl = document.getElementById("passwordModal");
      if (staticBackdropModalEl && passwordModalEl) {
        // 如果第一個 Modal 已經初始化，則取得它的實例，否則新建一個
        const staticBackdropModal =
          window.bootstrap.Modal.getInstance(staticBackdropModalEl) ||
          new window.bootstrap.Modal(staticBackdropModalEl);
        staticBackdropModal.hide(); // 隱藏第一個 modal

        // 建立並顯示第二個 modal
        const passwordModal = new window.bootstrap.Modal(passwordModalEl);
        passwordModal.show();
      }
    };

    sendCodeBtn.addEventListener("click", handleSendCodeClick);
    return () => {
      sendCodeBtn.removeEventListener("click", handleSendCodeClick);
    };
  }, []);
  useEffect(() => {
    const storedToken = localStorage.getItem("loginWithToken");
    console.log("🔍 Token:", storedToken); // ✅ 檢查 token
    if (loading) return;

    // 沒有 user，重導到登入
    if (!user || !user.id) {
      router.replace("/member/login");
      return;
    }

    // 沒有 profile，主動撈！
    if (!profile || !profile.id) {
      console.log("🚀 嘗試撈取個人資料...");
      getProfile(user.id); // 👉 這一行是關鍵
      return;
    }

    // profile 有了，設置 userData
    setUserData({
      id: profile.id,
      name: profile.name || "",
      email: profile.email || "",
      birthday: profile.birthday || "",
      gender: profile.gender ?? "",
      phone: profile.phone || "",
      address: profile.address || "",
      emergency_contact: profile.emergency_contact || "",
      emergency_phone: profile.emergency_phone || "",
      img: profile.img || "/img/default.png",
    });

    console.log("✅ 已取得 profile:", profile);
  }, [user, profile, loading]);
  if (loading) return <p>加載中...</p>;

  return (
    <>
      <div className="container my-5">
        <div className="row">
          {/* aside */}
          <aside className="col-md-3">
            <div className={`${styles.listBox} shadow-sm rounded-3`}>
              <div className={`${styles.asideTitle}`}>
                <h5 className="fw-bold m-0">會員中心</h5>
              </div>

              <div className={`${styles.asideContent}`}>
                <Link
                  href="/member/account"
                  className={`${styles.menuItem} ${
                    pathname === "/member/account" ? styles.active : ""
                  }`}
                >
                  <FaUser className="me-2" size={16} />
                  <span>我的帳戶</span>
                </Link>

                <Link
                  href="/member/order"
                  className={`${styles.menuItem} ${
                    pathname === "/member/order" ? styles.active : ""
                  }`}
                >
                  <FaClipboardList className="me-2" size={16} />
                  <span>我的訂單</span>
                </Link>

                <Link
                  href="/member/favorite"
                  className={`${styles.menuItem} ${
                    pathname === "/member/favorite" ? styles.active : ""
                  }`}
                >
                  <FaHeart className="me-2" size={16} />
                  <span>我的收藏</span>
                </Link>
              </div>
            </div>
          </aside>
          {/* main */}
          <main className="col-md-9">
            <h4 className="fw-bold mb-4 ms-4">我的帳戶</h4>
            {/* 表單和頭像卡片區塊 */}
            <div className={`${styles.sectionList}`}>
              {/* 左側表單 */}
              <div className="flex-grow-1 border-end">
                <form>
                  <div className="mb-4 row">
                    <label className="col-sm-3 col-form-label">姓名</label>
                    <div className="col-sm-9">
                      <input
                        type="text"
                        name="name"
                        value={userData.name || ""}
                        className={`${styles.box2} ${styles.boxSame}`}
                        onChange={handleInputChange}
                        placeholder="姓名"
                      />
                    </div>
                  </div>
                  <div className="mb-4 row">
                    <label className="col-sm-3 col-form-label">生日</label>
                    <div className="col-sm-9">
                      <input
                        type="date"
                        name="birthday"
                        value={userData.birthday || ""}
                        className={`${styles.box} ${styles.boxSame}`}
                        onChange={handleInputChange}
                        placeholder="生日"
                      />
                    </div>
                  </div>
                  <div className="mb-4 row">
                    <label className="col-sm-3 col-form-label">手機號碼</label>
                    <div className="col-sm-9">
                      <input
                        type="tel"
                        name="phone"
                        value={userData.phone || ""}
                        className={`${styles.box1} ${styles.boxSame}`}
                        onChange={handleInputChange}
                        placeholder="手機號碼"
                      />
                    </div>
                  </div>
                  <div className="mb-4 row">
                    <label className="col-sm-3 col-form-label">地址</label>
                    <div className="col-sm-9">
                      <input
                        type="text"
                        name="address"
                        value={userData.address || ""}
                        className={`${styles.box3} ${styles.boxSame}`}
                        onChange={handleInputChange}
                        placeholder="地址"
                      />
                    </div>
                  </div>
                  <div className="mb-4 row">
                    <label className="col-sm-3 col-form-label">性別</label>
                    <div className="col-sm-9 d-flex align-items-center">
                      <div className="form-check me-3">
                        <input
                          type="radio"
                          id="male"
                          name="gender"
                          value="male"
                          checked={userData.gender === "male"} // ✅ 確保 `checked` 與 `gender` 匹配
                          onChange={(e) =>
                            setUserData((prev) => ({
                              ...prev,
                              gender: e.target.value,
                            }))
                          }
                        />
                        <label className="form-check-label" htmlFor="male">
                          男性
                        </label>
                      </div>
                      <div className="form-check me-3">
                        <input
                          type="radio"
                          id="female"
                          name="gender"
                          value="female"
                          checked={userData.gender === "female"}
                          onChange={(e) =>
                            setUserData((prev) => ({
                              ...prev,
                              gender: e.target.value,
                            }))
                          }
                        />
                        <label className="form-check-label" htmlFor="female">
                          女性
                        </label>
                      </div>
                      <div className="form-check">
                        <input
                          type="radio"
                          id="other"
                          name="gender"
                          value="other"
                          checked={userData.gender === "other"}
                          onChange={(e) =>
                            setUserData((prev) => ({
                              ...prev,
                              gender: e.target.value,
                            }))
                          }
                        />
                        <label className="form-check-label" htmlFor="other">
                          其他
                        </label>
                      </div>
                    </div>
                  </div>
                </form>
                <div className={`${styles.IBbtn}`}>
                  <div className={`${styles.hvbtn}`} onClick={handleUpdateUser}>
                    變更
                  </div>
                  <PasswordResetModal
                    show={showPasswordModal}
                    onClose={() => setShowPasswordModal(false)}
                    userEmail={user?.email || ""}
                  />

                  {/* 打開按鈕 */}
                  <div
                    onClick={() => setShowPasswordModal(true)}
                    className={`${styles.dfbtn}`}
                  >
                    修改密碼
                  </div>
                </div>
              </div>
              {/* 右側大頭貼卡片 */}

              <div className={`${styles.infoBox2}`}>
                <UploadAvatar
                  userId={user?.id}
                  currentAvatar={profile?.img || "/img/default.png"}
                  onUploadSuccess={(newImg) =>
                    setUserData((prev) => ({ ...prev, img: newImg }))
                  }
                />
                <p className="fw-bold mb-1">{userData.name || "使用者名稱"}</p>
                <p className="text-muted mb-3">{userData.email}</p>
              </div>
            </div>
          </main>
        </div>
      </div>
    </>
  );
}
