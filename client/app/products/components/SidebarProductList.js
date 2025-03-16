"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import styles from "./products.module.css";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { useAuth } from "@/hooks/use-auth";
import useFavorite from "@/hooks/useFavorite";
import useToast from "@/hooks/useToast";
import { useCart } from "@/hooks/cartContext";

const seriesMap = {
  1: "內嵌型壁燈",
  2: "埋地燈",
  3: "投射燈",
  4: "水底內嵌型壁燈",
  5: "水底投射燈",
  6: "長條型洗牆燈",
  7: "壁燈",
  8: "吸頂燈",
  9: "柱燈",
  0: "其他燈具",
};

export default function SidebarProductList({ title, products }) {
  const { user } = useAuth();
  const { addToCart } = useCart();
  const { showToast } = useToast();

  return (
    <div className={styles.sideCard}>
      <div className={styles.cardTitle}>
        <h5>{title}</h5>
      </div>

      {products.length === 0 ? (
        <p className="text-center py-3">暫無商品</p>
      ) : (
        products.map((product) => (
          <SidebarProductItem
            key={product.id}
            product={product}
            user={user}
            addToCart={addToCart}
            showToast={showToast}
          />
        ))
      )}
    </div>
  );
}

function SidebarProductItem({ product, user, addToCart, showToast }) {
  const {
    isFavorite,
    toggleFavorite,
    loading: favoriteLoading,
  } = useFavorite(product.id);

  const handleCartClick = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      const userId = user?.id;
      if (!userId) {
        alert("請先登入才能加入購物車");
        return;
      }
      const cartData = {
        productId: product.id, // ← 保證有傳！
        quantity: 1, // ← 預設數量
      };

      const success = await addToCart(cartData);

      if (success) {
        showToast("商品已加入購物車");
      } else {
        alert("加入購物車失敗，請稍後再試");
      }
    } catch (error) {
      console.error("加入購物車失敗:", error);
      alert(error.response?.data?.message || "加入購物車失敗，請稍後再試");
    }
  };

  const handleFavoriteClick = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user?.id) {
      alert("請先登入才能收藏商品");
      return;
    }

    if (favoriteLoading) return;

    const success = await toggleFavorite();

    if (!success) {
      alert("收藏操作失敗，請稍後再試");
    }
  };

  return (
    <Link
      href={`/products/${product.id}`}
      className={styles.sidebarProduct}
    >
      <div className={styles.sidebarProductImg}>
        <Image
          src={
            product.id
              ? `/img/product/${product.id}/main.png`
              : "/img/default.png"
          }
          alt={product.name || "商品圖片"}
          fill
          sizes="80px"
          style={{ objectFit: "cover" }}
          onError={() => setImageError(true)}
        />
      </div>

      <div className={styles.sidebarProductInfo}>
        <div className={styles.sidebarProductBrand}>
          {seriesMap[product.series] || "其他系列"}
        </div>

        <div className={styles.sidebarProductTitle}>
          {product.name}
        </div>

        <div className={styles.sidebarProductPrice}>
          NT${product.price}
          </div>

        <div className={styles.productActionButtons}>
          <button
            className={styles.iconButton}
            onClick={handleFavoriteClick}
            disabled={favoriteLoading}
          >
            {isFavorite ? (
              <AiFillHeart size={20} color="#95001D" />
            ) : (
              <AiOutlineHeart size={20} color="#333" />
            )}
          </button>

          <button
            className={styles.addToCartBtn}
            onClick={handleCartClick}
          >
            加入購物車
          </button>
        </div>
      </div>
    </Link>
  );
}
