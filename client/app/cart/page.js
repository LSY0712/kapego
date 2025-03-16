"use client";

import { useState } from "react";
import Link from "next/link";
import styles from "./cart.module.css";
import { FiTrash2 } from "react-icons/fi";

export default function Cart() {
  const [cartItems, setCartItems] = useState([]); // 模擬購物車數據

  const increaseQty = (index) => {
    const updatedCart = [...cartItems];
    updatedCart[index].quantity += 1;
    setCartItems(updatedCart);
  };

  const decreaseQty = (index) => {
    const updatedCart = [...cartItems];
    if (updatedCart[index].quantity > 1) {
      updatedCart[index].quantity -= 1;
      setCartItems(updatedCart);
    }
  };

  const removeItem = (index) => {
    const updatedCart = cartItems.filter((_, i) => i !== index);
    setCartItems(updatedCart);
  };

  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  return (
    <div className={`container ${styles.cartContainer}`}>
      <h2 className={styles.title}>購物車</h2>

      {cartItems.length === 0 ? (
        <div className={styles.emptyCart}>
          <p>購物車是空的！</p>
          <Link href="/products">
            <button className={styles.secondaryBtn}>去逛逛</button>
          </Link>
        </div>
      ) : (
        <div className={styles.cartContent}>
          <div className={styles.cartItems}>
            {cartItems.map((item, index) => (
              <div key={index} className={styles.cartItem}>
                <img src={item.image} alt={item.title} className={styles.image} />
                <div className={styles.details}>
                  <h4>{item.title}</h4>
                  <p>規格：{item.spec}</p>
                  <p>單價：NT${item.price}</p>
                  <div className={styles.qtyControl}>
                    <button onClick={() => decreaseQty(index)}>-</button>
                    <span>{item.quantity}</span>
                    <button onClick={() => increaseQty(index)}>+</button>
                  </div>
                </div>
                <div className={styles.subtotal}>NT${item.price * item.quantity}</div>
                <button className={styles.removeBtn} onClick={() => removeItem(index)}>
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
            <button className={styles.checkoutBtn}>前往結帳</button>
          </div>
        </div>
      )}
    </div>
  );
}
