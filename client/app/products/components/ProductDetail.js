"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import axios from "axios";

import "./ProductDetail.css";
import ProductReviews from "./ProductReviews";
import BrowsingHistory from "./BrowsingHistory";
import RecommendedProducts from "./RecommendedProducts";
import SocialToolbar from "./SocialToolbar";

import useFavorite from "@/hooks/useFavorite";
import { useCart } from "@/hooks/cartContext";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode, Navigation, Thumbs } from "swiper/modules";
import useToast from "@/hooks/useToast";

// API URL 基礎設定
const API_BASE_URL = "http://localhost:3005/api";
const IMAGE_BASE_URL = "http://localhost:3005";

export default function ProductDetail() {
  const { showToast } = useToast();
  const params = useParams();
  const [product, setProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState(null);

  const { addToCart } = useCart();
  const {
    isFavorite,
    toggleFavorite,
    loading: favoriteLoading,
  } = useFavorite(parseInt(params.id), "product");

  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const [currentStock, setCurrentStock] = useState(0);
  const [currentPrice, setCurrentPrice] = useState(0);
  const [currentOriginalPrice, setCurrentOriginalPrice] = useState(0);
  const [allImages, setAllImages] = useState([]);

  const mainSwiperRef = useRef(null);

  // ✅ 取得商品詳情
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const productId = Number(params.id);
        if (!productId) {
          setError("無效的商品 ID");
          return;
        }

        const response = await axios.get(`${API_BASE_URL}/products/${productId}`);
        const productData = response.data.data;

        if (!productData) {
          setError("找不到商品");
          return;
        }

        // 組合所有圖片
        const variantImages = productData.variants?.flatMap(variant => variant.images || []) || [];
        const images = [...(productData.images || []), ...variantImages];

        setProduct(productData);
        setAllImages(images);

        // 預設選擇第一個 size 和 color
        if (productData.sizes?.length && productData.colors?.length) {
          const initialSize = productData.sizes[0];
          const initialColor = productData.colors[0];
          setSelectedSize(initialSize);
          setSelectedColor(initialColor);

          const initialVariant = productData.variants.find(
            (v) => v.color_id === initialColor.id && v.size_id === initialSize.id
          );

          if (initialVariant) {
            setCurrentPrice(initialVariant.price);
            setCurrentOriginalPrice(initialVariant.original_price);
            setCurrentStock(initialVariant.stock);
          }
        }
      } catch (err) {
        console.error("獲取商品詳情失敗:", err);
        setError(err.response?.data?.message || "商品獲取失敗");
      }
    };

    if (params.id) fetchProduct();
  }, [params.id]);

  // ✅ 當尺寸/顏色變化時更新庫存
  useEffect(() => {
    const variant = getCurrentVariant();
    if (variant) {
      setCurrentStock(variant.stock);
    }
  }, [selectedColor, selectedSize]);

  // ✅ 根據尺寸和顏色取得當前變體
  const getCurrentVariant = () => {
    if (!product || !selectedColor || !selectedSize) return null;
    return product.variants.find(
      (v) => v.color_id === selectedColor.id && v.size_id === selectedSize.id
    );
  };

  // ✅ 數量處理
  const handleQuantityChange = (value) => {
    setQuantity((prev) => {
      const newQuantity = prev + value;
      const variant = getCurrentVariant();

      if (newQuantity >= 1 && variant && newQuantity <= variant.stock) {
        return newQuantity;
      } else {
        alert("超過庫存數量！");
        return prev;
      }
    });
  };

  // ✅ 加入購物車
  const handleAddToCart = async () => {
    const currentVariant = getCurrentVariant();
    if (!currentVariant) {
      alert("請選擇顏色和尺寸！");
      return;
    }

    try {
      const cartData = {
        userId: 1, // 測試用，請改成真實 user
        variantId: currentVariant.id,
        quantity,
        type: "product",
      };

      const res = await axios.post(`${API_BASE_URL}/cart/add`, cartData);

      if (res.data.success) {
        showToast("商品已加入購物車");
      } else {
        alert(res.data.message || "加入購物車失敗");
      }
    } catch (error) {
      console.error("加入購物車失敗:", error);
      alert("加入購物車失敗，請稍後再試");
    }
  };

  // ✅ 圖片 URL 組合邏輯
  const getImageUrl = (path) => {
    if (!path) return `${IMAGE_BASE_URL}/img/default.png`;
    return `${IMAGE_BASE_URL}${path}`;
  };

  return (
    <div className="container">
      {error && <div className="alert alert-danger">{error}</div>}

      {!product ? (
        <div className="text-center py-5">載入中...</div>
      ) : (
        <div className="productDetailContainer">
          <div className="row">
            {/* ✅ 左側圖片區 */}
            <div className="col-md-6">
              <Swiper
                spaceBetween={10}
                navigation
                thumbs={{ swiper: thumbsSwiper }}
                modules={[FreeMode, Navigation, Thumbs]}
                onSwiper={(swiper) => (mainSwiperRef.current = swiper)}
                className="mySwiper2"
              >
                {allImages.map((img, index) => (
                  <SwiperSlide key={index}>
                    <div className="product-img-wrapper">
                      <img
                        src={getImageUrl(img.image_path)}
                        alt={`${product.name}-${index + 1}`}
                        style={{
                          width: "100%",
                          height: "auto",
                          objectFit: "contain",
                        }}
                      />
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>

              <Swiper
                onSwiper={setThumbsSwiper}
                spaceBetween={10}
                slidesPerView={4}
                freeMode
                watchSlidesProgress
                modules={[FreeMode, Navigation, Thumbs]}
                className="mySwiper"
              >
                {allImages.map((img, index) => (
                  <SwiperSlide key={index}>
                    <div className="thumb-wrapper">
                      <img
                        src={getImageUrl(img.image_path)}
                        alt={`${product.name}-${index + 1}`}
                        style={{
                          width: "100%",
                          height: "auto",
                          objectFit: "cover",
                        }}
                      />
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>

            {/* ✅ 右側商品資訊 */}
            <div className="col-md-6">
              <h3>{product.brand_name || "無品牌"}</h3>
              <h2>{product.name}</h2>
              <h2 className="salePrice">NT${currentPrice}</h2>
              <h5 className="text-decoration-line-through">
                NT${currentOriginalPrice}
              </h5>

              <div className="d-flex gap-2 flex-wrap my-2">
                {product.colors?.map((color) => (
                  <div
                    key={color.id}
                    onClick={() => handleColorSelect(color)}
                    className={`circle ${
                      selectedColor?.id === color.id ? "active" : ""
                    }`}
                    style={{
                      backgroundColor: color.code,
                      cursor: "pointer",
                    }}
                    title={color.name}
                  ></div>
                ))}
              </div>

              <div className="d-flex gap-2 my-2">
                {product.sizes?.map((size) => (
                  <div
                    key={size.id}
                    onClick={() => handleSizeSelect(size)}
                    className={`sizeBox ${
                      selectedSize?.id === size.id ? "active" : ""
                    }`}
                  >
                    {size.name}
                  </div>
                ))}
              </div>

              <div className="buttonCount mt-2">
                <button onClick={() => handleQuantityChange(-1)}>-</button>
                <input type="text" value={quantity} readOnly />
                <button onClick={() => handleQuantityChange(1)}>+</button>
              </div>

              <div className="d-flex gap-2 mt-3">
                <button onClick={handleAddToCart} className="btn btn-primary">
                  加入購物車
                </button>
                <button className="btn btn-success">立即購買</button>
              </div>
            </div>
          </div>

          {/* ✅ 其他 */}
          <div className="mt-5">
            <ul className="nav nav-tabs">
              <li className="nav-item">
                <button
                  className={`nav-link ${
                    activeTab === "description" ? "active" : ""
                  }`}
                  onClick={() => setActiveTab("description")}
                >
                  商品詳情
                </button>
              </li>
              <li className="nav-item">
                <button
                  className={`nav-link ${
                    activeTab === "reviews" ? "active" : ""
                  }`}
                  onClick={() => setActiveTab("reviews")}
                >
                  商品評價
                </button>
              </li>
            </ul>

            {activeTab === "description" && (
              <div className="mt-3">
                <h4>{product.name}</h4>
                <p>{product.detailed_description}</p>
              </div>
            )}

            {activeTab === "reviews" && (
              <ProductReviews
                rating={product.rating}
                reviewCount={product.review_count}
              />
            )}
          </div>

          <BrowsingHistory />
          <RecommendedProducts />
          <SocialToolbar />
        </div>
      )}
    </div>
  );
}
