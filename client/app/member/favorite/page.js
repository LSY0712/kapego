"use client";
import styles from "../account/account.module.css"; 
import Link from "next/link";
import { useState, useEffect } from "react";

export default function Favorite() {
  const [favorites, setFavorites] = useState([]);

  // 模擬獲取我的最愛商品資料
  useEffect(() => {
    // 這裡可以換成從 API 拉資料
    const fakeData = [
      {
        id: 1,
        name: "專業潛水面鏡",
        price: "$2,500",
        img: "/img/product1.jpg",
      },
      {
        id: 2,
        name: "潛水呼吸管",
        price: "$1,200",
        img: "/img/product2.jpg",
      },
      {
        id: 3,
        name: "潛水蛙鞋",
        price: "$3,800",
        img: "/img/product3.jpg",
      },
    ];
    setFavorites(fakeData);
  }, []);

  return (
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
              <Link href="/member/order/orderRent" className={styles.menuItem}>
                <i className="bi bi-bag-check-fill me-2"></i>
                <span>我的訂單</span>
              </Link>
              <Link href="/member/favorite" className={`${styles.menuItem} ${styles.active}`}>
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
                  key={item.id}
                  className="card shadow-sm rounded-3"
                  style={{ width: "18rem" }}
                >
                  <img
                    src={item.img}
                    className="card-img-top"
                    alt={item.name}
                    style={{ height: "200px", objectFit: "cover" }}
                  />
                  <div className="card-body d-flex flex-column justify-content-between">
                    <h5 className="card-title">{item.name}</h5>
                    <p className="card-text fw-bold text-danger">{item.price}</p>
                    <div className="d-flex justify-content-between align-items-center mt-3">
                      <button className="btn btn-sm btn-outline-secondary">
                        加入購物車
                      </button>
                      <button className="btn btn-sm btn-outline-danger">
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
  );
}
