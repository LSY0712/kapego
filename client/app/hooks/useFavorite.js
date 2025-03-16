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

  const isLoggedIn = () => {
    return Boolean(localStorage.getItem("loginWithToken"));
  };

  const getAuthHeader = () => {
    const token = localStorage.getItem("loginWithToken");
    return {
      Authorization: `Bearer ${token}`,
    };
  };

  // ✅ 初始化時檢查該商品是否已收藏
  useEffect(() => {
    const fetchFavoriteStatus = async () => {
      if (!isLoggedIn()) {
        setIsFavorite(false);
        return;
      }

      try {
        const response = await axios.get(`${API_BASE_URL}`, {
          headers: getAuthHeader(),
        });

        if (response.data.success) {
          const favorites = response.data.data.products || [];
          const ids = favorites.map((item) => item.product_id);
          setIsFavorite(ids.includes(itemId));
        }
      } catch (err) {
        console.error("獲取收藏狀態失敗:", err);
        setError(err);
      }
    };

    if (itemId) {
      fetchFavoriteStatus();
    }
  }, [itemId]);

  // ✅ 切換收藏狀態
  const toggleFavorite = async () => {
    const token = localStorage.getItem("loginWithToken");

    if (!token) {
      showToast("請先登入才能收藏", "error");
      return false;
    }

    try {
      setLoading(true);

      if (!isFavorite) {
        // ➕ 加入收藏
        const res = await axios.post(
          `${API_BASE_URL}`,
          {
            productIds: [itemId],
          },
          {
            headers: getAuthHeader(),
          }
        );

        if (res.data.success) {
          showToast("已加入收藏");
          setIsFavorite(true);
          return true;
        } else {
          showToast(res.data.message || "加入收藏失敗", "error");
          return false;
        }
      } else {
        // ➖ 取消收藏
        const res = await axios.delete(
          `${API_BASE_URL}`,
          {
            headers: getAuthHeader(),
            data: {
              productIds: [itemId],
            },
          }
        );

        if (res.data.success) {
          showToast("已取消收藏");
          setIsFavorite(false);
          return true;
        } else {
          showToast(res.data.message || "取消收藏失敗", "error");
          return false;
        }
      }
    } catch (error) {
      console.error("收藏請求錯誤:", error);
      showToast(error.response?.data?.message || "收藏失敗", "error");
      setError(error);
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
