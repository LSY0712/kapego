import Link from "next/link";
import Image from "next/image";
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
  } = useFavorite(product.id, "product");

  const { addToCart } = useCart();
  const { showToast } = useToast();
  const [imageLoaded, setImageLoaded] = useState(false);

  const handleCartClick = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      const cartData = {
        userId: 1,
        type: "product",
        variantId: product.variant_id,
        quantity: 1,
      };

      const success = await addToCart(1, cartData);
      if (success) {
        showToast ? showToast("商品已加入購物車") : alert("成功加入購物車！");
      }
    } catch (error) {
      console.error("加入購物車失敗:", error);
      alert("加入購物車失敗，請稍後再試");
    }
  };
  console.log("product.main_image:", product.main_image);

  const renderPriceRange = () => {
    const minPrice = product.min_price || product.price;
    const maxPrice = product.max_price;

    if (!maxPrice || minPrice === maxPrice) {
      return `NT$${minPrice}`;
    }

    return `NT$${minPrice} ~ NT$${maxPrice}`;
  };

  return (
    <div
      className={`${styles.productItem} ${imageLoaded ? styles.fadeIn : ""}`}
    >
      <Link href={`/products/${product.id}`} className={styles.productLink}>
        <div className={styles.productImg}>
          <img
            src={`http://localhost:3005${
              product.images?.[0]?.image_path || "/img/default.png"
            }`}
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
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                if (!favoriteLoading) {
                  toggleFavorite();
                }
              }}
              style={{ border: "none", background: "none" }}
              disabled={favoriteLoading}
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
          <div className={styles.salePrice}>{renderPriceRange()}</div>
          <div className={styles.originalPrice}>
            NT${product.original_price || (product.min_price || 0) * 1.5}
          </div>
        </div>
      </Link>
    </div>
  );
}
