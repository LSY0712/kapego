"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import Link from "next/link";
import styles from "./swiper.module.css";

const kvSlides = [
  {
    img: "/img/20241106132451l0svy.jpg",
    title: "點亮每一個建築靈魂",
    subTitle: "專業戶外照明，精工打造，呈現建築最真實的質感。",
  },
  {
    img: "/img/20241106125108dn198.jpg",
    title: "德國設計 × 東莞製造",
    subTitle: "融合德國工藝與東方精密，專注於每一道光影的細節。",
  },
  // {
  //   img: "/image/kv-lighting-03.jpg",
  //   title: "戶外燈光解決方案專家",
  //   subTitle: "從景觀到建築，Kapego 提供全方位 LED 照明系統。",
  // },
];

const Carousel = () => {
  return (
    <Swiper
      modules={[Navigation, Pagination, Autoplay]}
      spaceBetween={0}
      slidesPerView={1}
      navigation
      pagination={{ clickable: true }}
      autoplay={{ delay: 3000, disableOnInteraction: false }}
      loop={true}
      className="swiper"
    >
      {kvSlides.map((slide, index) => (
        <SwiperSlide key={index}>
          <div
            className={styles.kvCommon}
            style={{ backgroundImage: `url(${slide.img})` }}
          >
            <div className="text-center w-100">
              <div className={`d-flex flex-column ${styles.kvText}`}>
                <h1>{slide.title}</h1>
                <p className="d-none d-sm-block">{slide.subTitle}</p>
              </div>
              <Link href="/products">
                <button className={styles.secondaryBtn}>馬上逛逛</button>
              </Link>
            </div>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default Carousel;
