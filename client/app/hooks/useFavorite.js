"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import useToast from "@/hooks/useToast";

export default function useFavorite(itemId) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { showToast } = useToast();

  const API_BASE_URL = "http://localhost:3005/api/favorites";

  // ✅ 取得 token & 驗證是否登入
  const getAuthHeader = () => {
    const token = localStorage.getItem("loginWithToken");
    return token ? { Authorization: `Bearer ${token}` } : null;
  };

  // ✅ 初始查詢「是否已收藏」
  const fetchFavoriteStatus = async () => {
    const headers = getAuthHeader();

    if (!headers) {
      setIsFavorite(false);
      return;
    }

    try {
      const { data } = await axios.get(`${API_BASE_URL}`, { headers });

      if (data.success) {
        const favorites = data.data.products || [];
        const ids = favorites.map((item) => item.product_id);

        setIsFavorite(ids.includes(itemId));
      } else {
        console.error("取得收藏列表失敗");
      }
    } catch (err) {
      console.error("查詢收藏狀態失敗", err);
      setError(err);
    }
  };

  useEffect(() => {
    if (itemId) {
      fetchFavoriteStatus();
    }
  }, [itemId]);

  // ✅ 切換收藏
  const toggleFavorite = async () => {
    const headers = getAuthHeader();

    if (!headers) {
      showToast("請先登入才能收藏", "error");
      return false;
    }

    setLoading(true);

    try {
      if (!isFavorite) {
        // ➕ 加入收藏
        const { data } = await axios.post(
          `${API_BASE_URL}`,
          { productIds: [itemId] },
          { headers }
        );

        if (data.success) {
          showToast("已加入收藏");
          setIsFavorite(true);
          return true;
        } else {
          showToast(data.message || "加入收藏失敗", "error");
          return false;
        }
      } else {
        // ➖ 取消收藏
        const { data } = await axios.delete(
          `${API_BASE_URL}`,
          {
            headers,
            data: { productIds: [itemId] },
          }
        );

        if (data.success) {
          showToast("已取消收藏");
          setIsFavorite(false);
          return true;
        } else {
          showToast(data.message || "取消收藏失敗", "error");
          return false;
        }
      }
    } catch (err) {
      console.error("切換收藏失敗", err);
      showToast(err.response?.data?.message || "收藏操作失敗", "error");
      setError(err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    isFavorite,
    toggleFavorite,
    loading,
    error,
  };
}
