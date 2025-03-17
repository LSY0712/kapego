"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import styles from "./page.module.css";
import Carousel from "./components/Swiper/Carousel";
import ProductCard from "@/products/components/ProductCard";
import { FaRegHeart, FaStar, FaRegStar } from "react-icons/fa";
import { FiShoppingCart } from "react-icons/fi";

export default function Home() {
  const [activities, setActivities] = useState([]);
  // const [products, setProducts] = useState([]);
  const [articles, setArticles] = useState([]);
  const products = [
    {
      id: 58,
      name: "6jd",
      price: 800,
      rating: 4,
      image: "/img/product/58/main.png",
    },
    {
      id: 8,
      name: "1xh",
      price: 700,
      rating: 4,
      image: "/img/product/8/main.png",
    },
    {
      id: 60,
      name: "7ah",
      price: 800,
      rating: 7,
      image: "/img/product/60/main.png",
    },

  ]

  // ✅ 假設你之後會串 API
  useEffect(() => {
    fetchHomeData();
  }, []);

  const fetchHomeData = async () => {
    try {
      // 測試用靜態資料，可自行替換 API
      setActivities([
        {
          id: 1,
          title: "限時特賣",
          description: "全館85折",
          image: "/img/activity1.jpg",
        },
        {
          id: 2,
          title: "新品上市",
          description: "質感生活新選擇",
          image: "/img/activity2.jpg",
        },
      ]);

      // setProducts([
      //   {
      //     id: 5,
      //     title: "內嵌型壁燈",
      //     price: 1500,
      //     rating: 4,
      //     image: "/img/product/5/main.png",
      //   },
      //   {
      //     id: 6,
      //     title: "水底投射燈",
      //     price: 3000,
      //     rating: 5,
      //     image: "/img/product/6/main.png",
      //   },
      // ]);

      setArticles([
        {
          id: 1,
          title: "燈光設計趨勢",
          summary: "2025年最新照明設計概念",
          date: "2025/03/18",
          image: "/img/article1.jpg",
        },
        // {
        //   id: 2,
        //   title: "戶外照明安裝指南",
        //   summary: "一步步帶你了解",
        //   date: "2025/03/15",
        //   image: "/img/article2.jpg",
        // },
      ]);
    } catch (err) {
      console.error("首頁資料載入失敗", err);
    }
  };

  return (
    <main>
      {/* Banner 輪播 */}
      <Carousel />

      {/* 熱門商品推薦 */}
      <section className={`container ${styles.section}`}>
        <h3 className={`${styles.h3} mt-5`}>熱門商品推薦</h3>
        <div className={`d-flex justify-content-around ${styles.cards}`}>
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* 品牌介紹 */}
      <section className={`container ${styles.section}`}>
        <h3 className={styles.h3}>Why Kapego?</h3>
        <div className="d-flex justify-content-between">
          <div className={styles.cardText}>
            {/* <h4>專業設計、德國工藝</h4> */}
            <p>Kapego 自成立以來，Kapego 專注於戶外LED景觀與建築照明領域，涵蓋所有高端產品類型，包括：庭院燈、地埋燈、水下燈、泳池燈、壁燈和線型洗牆燈。我們始終堅持100%原創設計，擁有自主開發的模型與智慧財產權，本公司拒絕抄襲或採用市場上通用的模具。
            </p>
          </div>
          {/* <img
            src="/image/leftside-img.png"
            alt="Kapego 品牌"
            className={styles.img}
          /> */}
        </div>
      </section>

      {/* 文章專區 */}
      <section className={`container ${styles.section}`}>
        <h3 className={styles.h3}>最新文章</h3>
        <div className={`d-flex justify-content-around ${styles.cards}`}>
          {articles.map((article) => (
            <Link
              key={article.id}
              href={`/articles/${article.id}`}
              className={styles.card}
            >
              <img
                src={article.image}
                alt={article.title}
                className={styles.img}
              />
              <div className={styles.cardText}>
                <h5>{article.title}</h5>
                <h6>{article.summary}</h6>
                <small>{article.date}</small>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
