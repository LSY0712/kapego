"use client";
import { useCart } from "@/hooks/cartContext";
import { useRouter } from 'next/navigation';
import { useAuth } from "@/hooks/use-auth";
import { useEffect, useState } from "react";
import Link from "next/link";
import styles from "./cart.module.css";
import { FiTrash2 } from "react-icons/fi";
import axios from "axios";

export default function Cart() {
  const router = useRouter();
  const { cartData, fetchCart, updateQuantity, removeFromCart, loading } = useCart();
  const { user } = useAuth(); 
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  useEffect(() => {
    fetchCart();
  }, []);

  const products = cartData || []; 

  console.log("🛒 products in component:", products);

  const subtotal = products.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  const increaseQty = (item) => {
    updateQuantity(item.id, item.quantity + 1);
  };

  const decreaseQty = (item) => {
    if (item.quantity > 1) {
      updateQuantity(item.id, item.quantity - 1);
    }
  };

  const removeItem = (item) => {
    console.log("🧐 removeItem item:", item);
    removeFromCart(item.id);
  };

  const handleCheckout = async () => {
    if (!user || !user.id) {
      alert("請先登入！");
      return;
    }
  
    setCheckoutLoading(true);
  
    try {
      const response = await axios.post("http://localhost:3005/api/cart/checkout", {
        userId: user.id,
        totalPrice: subtotal,
        items: products
      });
  
      if (response.data.success) {
        alert("結帳完成");
  
        // ✅ 刷新購物車 ➜ 重新 fetch 新購物車（空的）
        fetchCart();
  
        // ✅ 或跳轉到訂單頁
        router.push("/member/order");
      } else {
        alert("結帳失敗: " + response.data.message);
      }
    } catch (error) {
      console.error("🔥 Checkout 發生錯誤:", error);
      alert("系統錯誤，請稍後再試！");
    } finally {
      setCheckoutLoading(false);
    }
  };
  
  

  if (loading) return <div>載入中...</div>;

  return (
    <div className={`container ${styles.cartContainer}`}>
      <h2 className={styles.title}>購物車</h2>

      {products.length === 0 ? (
        <div className={styles.emptyCart}>
          <p>購物車是空的！</p>
          <Link href="/products">
            <button className={styles.secondaryBtn}>去逛逛</button>
          </Link>
        </div>
      ) : (
        <div className={styles.cartContent}>
          <div className={styles.cartItems}>
            {products.map((item) => (
              <div key={item.id} className={styles.cartItem}>
                <img
                  src={item.image_url || "/img/default.png"}
                  alt={item.name}
                  className={styles.image}
                />
                <div className={styles.details}>
                  <h4>{item.name}</h4>
                  <p>單價：NT${item.price}</p>
                  <div className={styles.qtyControl}>
                    <button onClick={() => decreaseQty(item)}>-</button>
                    <span>{item.quantity}</span>
                    <button onClick={() => increaseQty(item)}>+</button>
                  </div>
                </div>
                <div className={styles.subtotal}>
                  NT${item.price * item.quantity}
                </div>
                <button
                  className={styles.removeBtn}
                  onClick={() => removeItem(item)}
                >
                  <FiTrash2 />
                </button>
              </div>
            ))}
          </div>

          <div className={styles.summary}>
            <h4>價格明細</h4>
            <div className={styles.summaryRow}>
              <span>小計</span>
              <span>NT${subtotal}</span>
            </div>
            <div className={styles.summaryRow}>
              <span>運費</span>
              <span>NT$0</span>
            </div>
            <div className={styles.summaryRowTotal}>
              <strong>總計</strong>
              <strong>NT${subtotal}</strong>
            </div>
            <button
              className={styles.checkoutBtn}
              onClick={handleCheckout}
              disabled={checkoutLoading}
            >
              {checkoutLoading ? "結帳中..." : "前往結帳"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
