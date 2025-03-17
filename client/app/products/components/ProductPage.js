// "use client";

// import { useState, useEffect } from "react";
// import axios from "axios";
// import { Slider, InputNumber, Space } from "antd";
// import Image from "next/image";
// import Link from "next/link";
// import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
// import useFavorite from "@/hooks/useFavorite";
// import { useCart } from "@/hooks/cartContext";
// import useToast from "@/hooks/useToast";
// import styles from "./products.module.css";

// const API_BASE_URL = "http://localhost:3005/api";
// const seriesMap = {
//   1: "內嵌型壁燈",
//   2: "埋地燈",
//   3: "投射燈",
//   4: "水底內嵌型壁燈",
//   5: "水底投射燈",
//   6: "長條型洗牆燈",
//   7: "壁燈",
//   8: "吸頂燈",
//   9: "柱燈",
//   0: "其他燈具",
// };

// // 🔹 Products Page 🔹
// export default function ProductsPage() {
//   const [products, setProducts] = useState([]);
//   const [page, setPage] = useState(1);
//   const [limit] = useState(24);
//   const [sort] = useState("id");
//   const [order] = useState("ASC");
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [newProducts, setNewProducts] = useState([]);

//   const [priceRange] = useState({ min: 0, max: 40000 });
//   const [filterPrice, setFilterPrice] = useState({ min: 0, max: 40000 });

//   useEffect(() => {
//     fetchProducts();
//     fetchNewProducts();
//   }, [page, filterPrice]);

//   const fetchProducts = async () => {
//     setLoading(true);
//     try {
//       const res = await axios.get(`${API_BASE_URL}/products`, {
//         params: {
//           page,
//           limit,
//           sort,
//           order,
//           min_price: filterPrice.min,
//           max_price: filterPrice.max,
//         },
//       });
//       setProducts(res.data.data || []);
//     } catch (err) {
//       setError("無法取得商品列表");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchNewProducts = async () => {
//     try {
//       const res = await axios.get(`${API_BASE_URL}/products`, {
//         params: {
//           page: 1,
//           limit: 5,
//           sort: "id",
//           order: "DESC",
//         },
//       });
//       setNewProducts(res.data.data || []);
//     } catch (err) {
//       console.error("取得新品失敗:", err);
//     }
//   };

//   if (error) return <p>{error}</p>;

//   return (
//     <div className="container py-4">
//       <div className="row">
//         {/* 側邊欄 */}
//         <div className="col-lg-3">
//           <PriceFilter
//             priceRange={priceRange}
//             filterPrice={filterPrice}
//             setFilterPrice={setFilterPrice}
//           />
//           <SidebarProductList title="新品上市" products={newProducts} />
//         </div>

//         {/* 商品清單 */}
//         <div className="col-lg-9">
//           <h2>商品列表</h2>
//           {loading ? (
//             <p>載入中...</p>
//           ) : (
//             <div className="row g-3">
//               {products.map((product) => (
//                 <div key={product.id} className="col-lg-4">
//                   <ProductCard product={product} />
//                 </div>
//               ))}
//             </div>
//           )}

//           {/* 分頁 */}
//           <div className="d-flex justify-content-between mt-4">
//             <button
//               className="btn btn-outline-primary"
//               disabled={page === 1}
//               onClick={() => setPage((p) => Math.max(1, p - 1))}
//             >
//               上一頁
//             </button>
//             <span>第 {page} 頁</span>
//             <button
//               className="btn btn-outline-primary"
//               onClick={() => setPage((p) => p + 1)}
//             >
//               下一頁
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// // 🔹 價格篩選元件 🔹
// function PriceFilter({ priceRange, filterPrice, setFilterPrice }) {
//   const handlePriceSliderChange = (values) => {
//     setFilterPrice({ min: values[0], max: values[1] });
//   };

//   const handleMinInputChange = (value) => {
//     setFilterPrice((prev) => ({ ...prev, min: value || 0 }));
//   };

//   const handleMaxInputChange = (value) => {
//     setFilterPrice((prev) => ({ ...prev, max: value || 4000 }));
//   };

//   return (
//     <div className="card mb-4">
//       <div className="card-header">
//         <h5>價格篩選</h5>
//       </div>
//       <div className="card-body">
//         <Space direction="vertical" style={{ width: "100%" }}>
//           <div style={{ display: "flex", gap: "10px" }}>
//             <InputNumber
//               min={0}
//               max={filterPrice.max}
//               value={filterPrice.min}
//               onChange={handleMinInputChange}
//               placeholder="最低價格"
//               style={{ width: "100%" }}
//             />
//             <InputNumber
//               min={filterPrice.min}
//               max={priceRange.max}
//               value={filterPrice.max}
//               onChange={handleMaxInputChange}
//               placeholder="最高價格"
//               style={{ width: "100%" }}
//             />
//           </div>
//           <Slider
//             range
//             min={priceRange.min}
//             max={priceRange.max}
//             value={[filterPrice.min, filterPrice.max]}
//             onChange={handlePriceSliderChange}
//             tooltip={{
//               formatter: (value) => `NT$${value.toLocaleString()}`,
//             }}
//           />
//         </Space>
//       </div>
//     </div>
//   );
// }

// // 🔹 Sidebar Product List 🔹
// function SidebarProductList({ title, products }) {
//   return (
//     <div className={styles.sideCard}>
//       <div className={styles.cardTitle}>
//         <h5>{title}</h5>
//       </div>
//       {products.map((product) => (
//         <Link
//           href={`/products/${product.id}`}
//           key={product.id}
//           className={styles.sidebarProduct}
//         >
//           <div className={styles.sidebarProductImg}>
//             <Image
//               src={`/img/product/${product.image_name}`}
//               alt={product.name}
//               fill
//               sizes="80px"
//               style={{ objectFit: "cover" }}
//             />
//           </div>
//           <div className={styles.sidebarProductInfo}>
//             <div className={styles.sidebarProductBrand}>
//               {product.brand_name}
//             </div>
//             <div className={styles.sidebarProductTitle}>{product.name}</div>
//             <div className={styles.sidebarProductPrice}>
//               NT${product.min_price}
//               {product.min_original_price > product.min_price && (
//                 <span className={styles.originalPrice}>
//                   NT${product.min_original_price}
//                 </span>
//               )}
//             </div>
//           </div>
//         </Link>
//       ))}
//     </div>
//   );
// }

// // 🔹 Product Card 🔹
// function ProductCard({ product }) {
//   const {
//     isFavorite,
//     toggleFavorite,
//     loading: favoriteLoading,
//   } = useFavorite(product.id, "product");
//   const { addToCart } = useCart();
//   const { showToast } = useToast();
//   const [imageLoaded, setImageLoaded] = useState(false);

//   const handleCartClick = async (e) => {
//     e.preventDefault();
//     e.stopPropagation();
//     try {
//       const cartData = {
//         userId: 1,
//         type: "product",
//         variantId: product.variant_id,
//         quantity: 1,
//       };
//       const success = await addToCart(1, cartData);
//       if (success) {
//         showToast ? showToast("商品已加入購物車") : alert("成功加入購物車！");
//       }
//     } catch (error) {
//       alert("加入購物車失敗，請稍後再試");
//     }
//   };

//   const renderPriceRange = () => {
//     const minPrice = product.min_price || product.price;
//     const maxPrice = product.max_price;
//     if (!maxPrice || minPrice === maxPrice) return `NT$${minPrice}`;
//     return `NT$${minPrice} ~ NT$${maxPrice}`;
//   };

//   return (
//     <div
//       className={`${styles.productItem} ${imageLoaded ? styles.fadeIn : ""}`}
//     >
//       <Link href={`/products/${product.id}`} className={styles.productLink}>
//         <div className={styles.productImg}>
//           <img
//             src={`http://localhost:3005${
//               product.main_image || "/img/default.png"
//             }`}
//             alt={product.name}
//           />

//           <div className={styles.productOverlay}>
//             <button
//               className={styles.iconButton}
//               onClick={(e) => {
//                 e.preventDefault();
//                 e.stopPropagation();
//                 if (!favoriteLoading) toggleFavorite();
//               }}
//               disabled={favoriteLoading}
//             >
//               {isFavorite ? (
//                 <AiFillHeart color="red" size={36} />
//               ) : (
//                 <AiOutlineHeart color="white" size={36} />
//               )}
//             </button>
//             <button
//               className="btn btn-primary w-75 mt-2"
//               onClick={handleCartClick}
//             >
//               加入購物車
//             </button>
//           </div>
//         </div>

//         <div className={styles.productInfo}>
//           <div className={styles.brandName}>
//             {seriesMap[product.series] || "其他系列"}
//           </div>
//           <div>{product.name || "商品名稱"}</div>
//           <div className={styles.salePrice}>{renderPriceRange()}</div>
//           <div className={styles.originalPrice}>
//             NT${product.original_price || (product.min_price || 0) * 1.5}
//           </div>
//         </div>
//       </Link>
//     </div>
//   );
// }
