"use client";
import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";

const CartContext = createContext();
const API_BASE_URL = "http://localhost:3005/api";

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const userId = user?.id;

  const [cartData, setCartData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedItems, setSelectedItems] = useState([]);

  const router = useRouter();
  const id = router.query?.id || "";
  const fetchCart = async () => {
    if (!userId) return;
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE_URL}/cart/${userId}`);

      console.log("🚀 fetchCart API 回傳:", res.data);

      if (res.data.success) {
        const products = res.data.cart || [];
        console.log("✅ 設定 cartData:", products);

        setCartData(products);
        setSelectedItems(products.map((item) => item.id));
      } else {
        setError(res.data.message || "取得購物車失敗");
      }
    } catch (error) {
      console.error("❌ 獲取購物車失敗:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (user?.id) {
      console.log("✅ user.id 有值，fetchCart 開始");
      fetchCart();
    }
  }, [user?.id]);

  const addToCart = async (cartItem) => {
    if (!userId) {
      setError("未登入，請登入後操作！");
      return false;
    }

    console.log("🔥 addToCart 傳送 payload:", { userId, ...cartItem });

    try {
      const res = await axios.post(`${API_BASE_URL}/cart/add`, {
        userId,
        ...cartItem,
      });

      if (res.data.success) {
        await fetchCart();
        return true;
      } else {
        setError(res.data.message || "加入失敗");
        return false;
      }
    } catch (error) {
      console.error("加入購物車失敗:", error);
      setError(error.message);
      return false;
    }
  };

  const removeFromCart = async (itemIds) => {
    if (!userId) return false;

    try {
      const res = await axios.delete(`${API_BASE_URL}/cart/remove`, {
        data: {
          userId,
          itemIds: Array.isArray(itemIds) ? itemIds : [itemIds],
        },
      });

      if (res.data.success) {
        await fetchCart();
        return true;
      } else {
        setError(res.data.message || "刪除失敗");
        return false;
      }
    } catch (error) {
      console.error("刪除購物車失敗:", error);
      setError(error.message);
      return false;
    }
  };

  const updateQuantity = async (itemId, newQuantity) => {
    if (!userId) return;

    try {
      const res = await axios.put(`${API_BASE_URL}/cart/update`, {
        userId,
        itemId,
        quantity: newQuantity,
      });

      if (res.data.success) {
        await fetchCart();
      } else {
        setError(res.data.message || "更新失敗");
      }
    } catch (error) {
      console.error("更新數量失敗:", error);
      setError(error.message);
    }
  };

  return (
    <CartContext.Provider
      value={{
        cartData,
        loading,
        error,
        selectedItems,
        fetchCart,
        addToCart,
        removeFromCart,
        updateQuantity,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);