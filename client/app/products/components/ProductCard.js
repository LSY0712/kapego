import Link from "next/link";
import { useAuth } from "@/hooks/use-auth";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import styles from "./products.module.css";
import useFavorite from "@/hooks/useFavorite";
import { useCart } from "@/hooks/cartContext";
import useToast from "@/hooks/useToast";
import { useState } from "react";

// 這邊定義 series 對應表
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

export default function ProductCard({ product }) {
  const {
    isFavorite,
    toggleFavorite,
    loading: favoriteLoading,
  } = useFavorite(product.id);

  const { user } = useAuth();
  const { addToCart } = useCart();
  const { showToast } = useToast();
  const [imageLoaded, setImageLoaded] = useState(false);

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
    <div
      className={`${styles.productItem} ${imageLoaded ? styles.fadeIn : ""}`}
    >
      <Link href={`/products/${product.id}`} className={styles.productLink}>
        <div className={styles.productImg}>
          <img
            src={
              product.id
                ? `/img/product/${product.id}/main.png`
                : "/img/default.png"
            }
            alt={product.name || "商品圖片"}
            style={{
              objectFit: "cover",
              width: "100%",
              height: "auto",
            }}
          />

          <div className={styles.productOverlay}>
            <button
              className={styles.iconButton}
              onClick={handleFavoriteClick}
              disabled={favoriteLoading}
              style={{ border: "none", background: "none" }}
            >
              {isFavorite ? (
                <AiFillHeart color="red" size={36} />
              ) : (
                <AiOutlineHeart color="white" size={36} />
              )}
            </button>
            <button
              className="btn btn-primary w-75 mt-2"
              onClick={handleCartClick}
            >
              加入購物車
            </button>
          </div>
        </div>

        <div className={styles.productInfo}>
          <div className={styles.brandName}>
            {seriesMap[product.series] || "其他系列"}
          </div>

          <div>{product.name || "商品名稱"}</div>
          <div className={styles.originalPrice}>NT${product.price}</div>
        </div>
      </Link>
    </div>
  );
}
