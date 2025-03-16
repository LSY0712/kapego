"use client";

import styles from "../account/account.module.css";
import Link from "next/link";
import { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Modal, Button } from "react-bootstrap";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// 模擬登入 userId
// ⚠️ ⚠️ ⚠️ 之後改用 useAuth() 或 context 拿 user 資訊
const MOCK_USER_ID = 60;

export default function Order() {
  const [orders, setOrders] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    fetchOrders(MOCK_USER_ID);
  }, []);

  // ✅ 拉訂單列表
  const fetchOrders = async (userId) => {
    try {
      const res = await fetch(`http://localhost:3005/api/orders/user/${userId}`);
      const data = await res.json();

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

  // ✅ 點「訂單詳情」才去撈單筆資料
  const fetchOrderDetail = async (orderId) => {
    try {
      const res = await fetch(`http://localhost:3005/api/orders/${orderId}/simple`);
      const data = await res.json();

      if (data.success) {
        console.log("✅ 單筆訂單資料", data.data);
        setSelectedOrder(data.data);
        setShowModal(true);
      } else {
        toast.error("查詢訂單詳情失敗");
      }
    } catch (err) {
      console.error(err);
      toast.error("系統錯誤");
    }
  };

  // ✅ 再買一次
  const handleRebuy = async (orderId) => {
    try {
      const res = await fetch(`http://localhost:3005/api/orders/${orderId}/rebuy`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: MOCK_USER_ID }),
      });

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

  // ➡️ 日期格式化 (可以依需求再調整)
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
                      <p className="mb-0 fw-bold">{formatDate(order.createdAt)}</p>
                      <p className="mb-0">訂單編號：{order.orderNumber}</p>
                    </div>
                    <div className="fw-bold">{order.status}</div>
                  </div>

                  {/* 商品預覽 */}
                  <div className="px-4 py-3 d-flex flex-column gap-3">
                    {order.previewItem ? (
                      <div className="d-flex justify-content-between align-items-center border-bottom pb-3">
                        <div className="d-flex align-items-center gap-3">
                          <img
                            src={order.previewItem.image_url || "/img/default.png"}
                            alt={order.previewItem.name}
                            style={{
                              width: "100px",
                              height: "100px",
                              objectFit: "cover",
                            }}
                            className="rounded"
                          />
                          <div>
                            <p className="mb-1 fw-bold">{order.previewItem.name}</p>
                            <p className="mb-1 text-muted">商品數量: {order.totalItems}</p>
                          </div>
                        </div>
                        <div className="text-end">
                          <p className="fw-bold text-danger">NT${order.total_price}</p>
                        </div>
                      </div>
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
                      <div
                        className={styles.dfbtn}
                        role="button"
                        onClick={() => fetchOrderDetail(order.id)}
                      >
                        訂單詳情
                      </div>
                    </div>
                    <div className="text-end">
                      <p className="mb-0 fw-bold">
                        訂單金額：
                        <span className="text-danger">NT${order.total_price}</span>
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </main>
      </div>

      {/* ===== Modal (訂單詳情) ===== */}
      <Modal show={showModal} onHide={handleCloseModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>訂單詳情</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedOrder ? (
            <>
              <p>訂單編號：{selectedOrder.order.id}</p>
              <p>日期：{formatDate(selectedOrder.order.createdAt)}</p>
              <p>狀態：{selectedOrder.order.status}</p>
              <hr />
              {selectedOrder.items.length > 0 ? (
                selectedOrder.items.map((item, index) => (
                  <div key={index} className="d-flex justify-content-between mb-2">
                    <div>
                      <p className="fw-bold mb-0">{item.name}</p>
                      <p className="text-muted mb-0">數量: x{item.quantity}</p>
                    </div>
                    <div className="text-end">
                      <p className="text-danger mb-0">NT${item.price}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p>沒有商品資料</p>
              )}
              <hr />
              <p className="fw-bold text-end">
                訂單總金額：NT${selectedOrder.order.total_price}
              </p>
            </>
          ) : (
            <p>載入中...</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            關閉
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
