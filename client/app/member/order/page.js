"use client";
import { useAuth } from "@/hooks/use-auth";
import styles from "../account/account.module.css";
import Link from "next/link";
import { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Modal, Button } from "react-bootstrap";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Order() {
  const { user } = useAuth();
  const userId = user?.id;

  const [orders, setOrders] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    if (!userId) return; // 沒登入就不 fetch
    fetchOrders(userId);
  }, [userId]);

  // ✅ 拉訂單列表
  const fetchOrders = async (userId) => {
    try {
      const res = await fetch(
        `http://localhost:3005/api/orders/user/${userId}`
      );
      const data = await res.json();
      console.log(data);
      if (data.success) {
        console.log("✅ 訂單列表", data.data);
        setOrders(data.data);
      } else {
        toast.error("訂單列表查詢失敗");
      }
    } catch (err) {
      console.error(err);
      toast.error("系統錯誤");
    }
  };

  // ✅ 再買一次
  const handleRebuy = async (orderId) => {
    try {
      const res = await fetch(
        `http://localhost:3005/api/orders/${orderId}/rebuy`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId }),
        }
      );

      const result = await res.json();

      if (result.success) {
        toast.success("已加入購物車！");
      } else {
        toast.error(result.message || "再買一次失敗");
      }
    } catch (err) {
      console.error(err);
      toast.error("再買一次失敗");
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedOrder(null);
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("zh-TW", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  return (
    <div className="container my-5">
      <ToastContainer position="top-right" autoClose={2000} />
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
              <Link
                href="/member/order"
                className={`${styles.menuItem} ${styles.active}`}
              >
                <i className="bi bi-bag-check-fill me-2"></i>
                <span>我的訂單</span>
              </Link>
              <Link href="/member/favorite" className={styles.menuItem}>
                <i className="bi bi-heart-fill me-2"></i>
                <span>我的收藏</span>
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
                <div
                  key={order.id}
                  className="border rounded-4 p-0 shadow-sm overflow-hidden"
                >
                  {/* 訂單 header */}
                  <div
                    className="px-4 py-3 d-flex justify-content-between align-items-center"
                    style={{ backgroundColor: "#a8a8a8", color: "#fff" }}
                  >
                    <div className="d-flex align-items-center gap-3 flex-wrap">
                      <p className="mb-0 fw-bold">
                        {formatDate(order.createdAt)}
                      </p>
                      <p className="mb-0">訂單編號：{order.orderNumber}</p>
                    </div>
                    <div className="fw-bold">{order.status}</div>
                  </div>

                  {/* 商品預覽 */}
                  <div className="px-4 py-3 d-flex flex-column gap-3">
                    {order.items && order.items.length > 0 ? (
                      order.items.map((item, index) => (
                        <div
                          key={index}
                          className="d-flex justify-content-between align-items-center border-bottom pb-3"
                        >
                          <div className="d-flex align-items-center gap-3">
                            <img
                              src={item.image_url || "/img/default.png"}
                              alt={item.name}
                              style={{
                                width: "100px",
                                height: "100px",
                                objectFit: "cover",
                              }}
                              className="rounded"
                            />
                            <div>
                              <p className="mb-1 fw-bold">{item.name}</p>
                              <p className="mb-1 text-muted">
                                數量: {item.quantity}
                              </p>
                              <p className="mb-1 text-muted">
                                單價: NT${item.price}
                              </p>
                            </div>
                          </div>
                          <div
                            className="text-end"
                            style={{ minWidth: "100px" }}
                          >
                            <p className="fw-bold text-danger mb-0">
                              小計: NT${item.price * item.quantity}
                            </p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-muted">沒有商品資料</p>
                    )}
                  </div>

                  {/* 按鈕 / 金額 */}
                  <div className="px-4 py-3 d-flex justify-content-between align-items-center bg-white">
                    <div className={`d-flex gap-2 ${styles.IBbtn}`}>
                      <div
                        className={styles.hvbtn}
                        role="button"
                        onClick={() => handleRebuy(order.id)}
                      >
                        再買一次
                      </div>
                    </div>
                    <div className="text-end">
                      <p className="mb-0 fw-bold">
                        訂單金額：
                        <span className="text-danger">
                          NT${order.total_price}
                        </span>
                      </p>
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
