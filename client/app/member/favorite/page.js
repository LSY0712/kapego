"use client";

import styles from "../account/account.module.css";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Favorite() {
  const { user, profile, loading } = useAuth();
  const userId = user?.id || profile?.id;

  const [favorites, setFavorites] = useState([]);
  const [isAdding, setIsAdding] = useState(false); // ✅ 加入購物車 loading
  const storedToken =
    typeof window !== "undefined"
      ? localStorage.getItem("loginWithToken")
      : null;

  // 🚀 取得收藏清單
  const fetchFavorites = async () => {
    if (!userId || !storedToken) {
      console.warn("⚠️ 無法取得 userId 或 token");
      return;
    }

    try {
      const res = await fetch(`http://localhost:3005/api/favorite`, {
        headers: {
          Authorization: `Bearer ${storedToken}`,
        },
      });

      const result = await res.json();
      if (result.success) {
        setFavorites(result.data);
      } else {
        console.warn(result.message);
      }
    } catch (err) {
      console.error("取得收藏失敗", err);
    }
  };

  // ➕ 加入購物車
  const addToCart = async (productId) => {
    if (!userId || !storedToken) {
      toast.error("請先登入！");
      return;
    }

    try {
      setIsAdding(true); // loading 狀態開啟

      const res = await fetch(`http://localhost:3005/api/cart`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${storedToken}`,
        },
        body: JSON.stringify({
          userId: userId,
          productId: productId,
          quantity: 1,
        }),
      });

      const result = await res.json();

      if (result.status === "success") {
        toast.success(
          <div>
            ✅ 已加入購物車！
            <button
              className="btn btn-sm btn-light ms-2"
              onClick={() => (window.location.href = "/cart")}
            >
              前往購物車
            </button>
          </div>,
          {
            icon: "🛒",
            autoClose: 3000,
          }
        );
      } else {
        toast.error(`❌ ${result.message}`);
      }
    } catch (err) {
      console.error("加入購物車失敗", err);
      toast.error("加入購物車失敗");
    } finally {
      setIsAdding(false); // loading 關閉
    }
  };

  // ❌ 移除收藏
  const removeFavorite = async (productId) => {
    if (!userId || !storedToken) return;

    try {
      const res = await fetch(`http://localhost:3005/api/favorite`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${storedToken}`,
        },
        body: JSON.stringify({
          productIds: [productId],
        }),
      });

      const result = await res.json();
      toast.success(result.message); // ✅ 改為 toast！

      // 更新收藏清單
      setFavorites(favorites.filter((item) => item.product_id !== productId));
    } catch (err) {
      console.error("移除收藏失敗", err);
      toast.error("移除收藏失敗");
    }
  };

  // 首次載入 ➜ 取得收藏清單
  useEffect(() => {
    fetchFavorites();
  }, [userId, storedToken]);

  // 尚未登入 or loading
  if (loading) return <div className="text-center py-5">載入中...</div>;

  return (
    <>
      <div className="container my-5">
        <div className="row">
          {/* 側邊選單 */}
          <aside className="col-md-3">
            <div className={`${styles.listBox} shadow-sm rounded-3`}>
              <div className={styles.asideTitle}>
                <h5 className="fw-bold m-0">會員中心</h5>
              </div>

              <div className={styles.asideContent}>
                <Link href="/member/account" className={styles.menuItem}>
                  <i className="bi bi-person-fill me-2"></i>
                  <span>我的帳戶</span>
                </Link>
                <Link href="/member/order" className={styles.menuItem}>
                  <i className="bi bi-bag-check-fill me-2"></i>
                  <span>我的訂單</span>
                </Link>
                <Link
                  href="/member/favorite"
                  className={`${styles.menuItem} ${styles.active}`}
                >
                  <i className="bi bi-heart-fill me-2"></i>
                  <span>我的最愛</span>
                </Link>
              </div>
            </div>
          </aside>

          {/* 主內容 */}
          <main className="col-md-9">
            <h4 className="fw-bold mb-4 ms-4">我的最愛</h4>

            <div className="d-flex flex-wrap gap-4 justify-content-start">
              {favorites.length === 0 ? (
                <p>尚無收藏商品。</p>
              ) : (
                favorites.map((item) => (
                  <div
                    key={item.product_id}
                    className="card shadow-sm rounded-3"
                    style={{ width: "18rem" }}
                  >
                    <img
                      src={item.image_url || "/img/default.png"}
                      className="card-img-top"
                      alt={item.name}
                      style={{ height: "200px", objectFit: "cover" }}
                    />
                    <div className="card-body d-flex flex-column justify-content-between">
                      <h5 className="card-title">{item.name}</h5>
                      <p className="card-text fw-bold text-danger">
                        NT${item.price}
                      </p>
                      <div className="d-flex justify-content-between align-items-center mt-3">
                        <button
                          className="btn btn-sm btn-outline-secondary"
                          onClick={() => addToCart(item.product_id)}
                          disabled={isAdding} // ✅ loading 時禁止點擊
                        >
                          {isAdding ? (
                            <>
                              <span
                                className="spinner-border spinner-border-sm me-2"
                                role="status"
                                aria-hidden="true"
                              ></span>
                              加入中...
                            </>
                          ) : (
                            "加入購物車"
                          )}
                        </button>
                        <button
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => removeFavorite(item.product_id)}
                        >
                          移除
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </main>
        </div>
      </div>
      <ToastContainer position="top-right" autoClose={2000} />
    </>
  );
}
