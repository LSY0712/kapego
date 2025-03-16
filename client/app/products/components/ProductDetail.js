"use client";

import { useEffect, useState } from "react";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import axios from "axios";
import Image from "next/image";
import styles from "../components/products.module.css";
import { useAuth } from "@/hooks/use-auth";
import useFavorite from "@/hooks/useFavorite";
import useToast from "@/hooks/useToast";
import { useCart } from "@/hooks/cartContext";

export default function ProductDetail({ id }) {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  const { user } = useAuth();
  const { addToCart } = useCart();
  const { showToast } = useToast();

  // ✅ 收藏邏輯：帶入 id
  const {
    isFavorite,
    toggleFavorite,
    loading: favoriteLoading,
  } = useFavorite(id);

  useEffect(() => {
    if (!id) return;

    const fetchProductDetail = async () => {
      try {
        const { data } = await axios.get(`http://localhost:3005/api/products/${id}`);
        if (data.success) {
          setProduct(data.data);
        } else {
          console.error("查詢產品失敗");
        }
      } catch (err) {
        console.error("產品請求失敗", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetail();
  }, [id]);

  // ✅ 收藏點擊事件
  const handleFavoriteClick = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user?.id) {
      alert("請先登入才能收藏商品");
      return;
    }

    const success = await toggleFavorite();
    if (!success) {
      alert("收藏操作失敗，請稍後再試");
    }
  };

  // ✅ 購物車加入
  const handleCartClick = async () => {
    if (!user?.id) {
      alert("請先登入才能加入購物車");
      return;
    }

    const cartData = {
      productId: id,
      quantity: 1,
    };

    const success = await addToCart(cartData);
    if (success) {
      showToast("商品已加入購物車");
    } else {
      alert("加入購物車失敗，請稍後再試");
    }
  };

  // ✅ loading 狀態
  if (loading) return <p>Loading...</p>;
  if (!product) return <p>找不到這個商品 😢</p>;

  return (
    <div className="container py-5">
      <div className="row">
        {/* 圖片區 */}
        <div className="col-md-6">
          {product.images && product.images.length > 0 ? (
            product.images.map((img) => (
              <div key={img.id} className="mb-3">
                <Image
                  src={img.image_path || "/img/default.png"}
                  alt={product.name}
                  width={500}
                  height={500}
                  style={{ objectFit: "cover" }}
                />
              </div>
            ))
          ) : (
            <p>尚無商品圖片</p>
          )}
        </div>

        {/* 商品資訊區 */}
        <div className="col-md-6 mt-5 pt-5">
          <h1 className="mb-4">{product.name}</h1>
          <p className="h4 text-danger mb-3">價格：NT${product.price}</p>
          <p className="mb-4">{product.description || "商品說明待補充"}</p>

          {/* 收藏按鈕 + 加入購物車 */}
          <div className="d-flex align-items-center gap-3">
            <button
              className={styles.iconButton}
              onClick={handleFavoriteClick}
              disabled={favoriteLoading}
              style={{ border: "none", background: "none" }}
            >
              {isFavorite ? (
                <AiFillHeart color="red" size={36} />
              ) : (
                <AiOutlineHeart color="black" size={36} />
              )}
            </button>

            <button
              className="btn"
              style={{
                backgroundColor: "#95001D",
                color: "#fff",
                width: "200px",
                padding: "10px",
              }}
              onClick={handleCartClick}
            >
              加入購物車
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
