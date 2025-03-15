"use client";

import styles from "../account/account.module.css"; // 直接沿用
import Link from "next/link";
import { useState, useEffect } from "react";

export default function Order() {
  const [orders, setOrders] = useState([]);

  // 模擬訂單資料（之後可以換 API）
  useEffect(() => {
    const fakeOrders = [
      {
        id: "ORD20240312001",
        date: "2024/03/12",
        status: "已完成",
        total: "$5,800",
        items: [
          { id: 1, name: "潛水呼吸管", qty: 1 },
          { id: 2, name: "專業潛水面鏡", qty: 2 },
        ],
      },
      {
        id: "ORD20240228002",
        date: "2024/02/28",
        status: "配送中",
        total: "$3,200",
        items: [
          { id: 3, name: "潛水蛙鞋", qty: 1 },
        ],
      },
    ];
    setOrders(fakeOrders);
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
              <Link href="/member/order/orderRent" className={`${styles.menuItem} ${styles.active}`}>
                <i className="bi bi-bag-check-fill me-2"></i>
                <span>我的訂單</span>
              </Link>
              <Link href="/member/favorite" className={styles.menuItem}>
                <i className="bi bi-heart-fill me-2"></i>
                <span>我的最愛</span>
              </Link>
            </div>
          </div>
        </aside>

        {/* 主內容 */}
        <main className="col-md-9">
          <h4 className="fw-bold mb-4 ms-4">我的訂單</h4>

          <div className="d-flex flex-column gap-4">
            {orders.length === 0 ? (
              <p>目前沒有訂單紀錄。</p>
            ) : (
              orders.map((order) => (
                <div key={order.id} className="border rounded-4 p-4 shadow-sm">
                  <div className="d-flex justify-content-between mb-3 flex-wrap">
                    <div>
                      <p className="mb-1 fw-bold">訂單編號：{order.id}</p>
                      <p className="mb-1 text-muted">日期：{order.date}</p>
                      <p className={`mb-1 ${order.status === '已完成' ? 'text-success' : 'text-warning'}`}>
                        狀態：{order.status}
                      </p>
                    </div>
                    <div className="text-end">
                      <p className="mb-1 fw-bold">訂單金額</p>
                      <p className="text-danger h5">{order.total}</p>
                    </div>
                  </div>

                  <hr />

                  <div className="d-flex flex-column gap-2">
                    {order.items.map((item) => (
                      <div key={item.id} className="d-flex justify-content-between">
                        <p className="mb-0">{item.name}</p>
                        <p className="mb-0">數量：{item.qty}</p>
                      </div>
                    ))}
                  </div>

                  <div className="text-end mt-4">
                    <button className="btn btn-outline-primary btn-sm">訂單詳情</button>
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
