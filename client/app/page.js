"use client";

import Image from "next/image";
import styles from "./page.module.css";
import {
  FaAngleLeft,
  FaAngleRight,
  FaRegHeart,
  FaStar,
  FaRegStar,
} from "react-icons/fa";
import { FiShoppingCart } from "react-icons/fi";
import Link from "next/link";
import { useState } from "react";
import Carousel from "./components/Swiper/Carousel";

export default function Home() {
  const [activity, setActivity] = useState([]);
  const [product, setProduct] = useState([]);
  const [article, setArticle] = useState([]);

  return (
    <main>
      {/* Hero Banner / Carousel */}
      <Carousel />

      {/* Section: 熱門商品推薦 */}
      <section className={`container ${styles.section}`}>
        <h3 className={styles.h3}>熱門商品推薦</h3>
        <div className={`d-flex justify-content-around ${styles.cards}`}>
          {/* 商品卡片（建議做map渲染） */}
          {product.map((item, index) => (
            <div key={index} className={styles.card}>
              <div className={styles.imgContainer}>
                <div className={styles.circleIcons}>
                  <button className={styles.circleIcon}><FaRegHeart /></button>
                  <button className={styles.circleIcon}><FiShoppingCart /></button>
                </div>
                <div className={styles.stars}>
                  {[...Array(item.rating)].map((_, i) => <FaStar key={i} />)}
                  {[...Array(5 - item.rating)].map((_, i) => <FaRegStar key={i} />)}
                </div>
                <img className={styles.img} src={item.image} alt={item.title} />
              </div>
              <div className={`text-center ${styles.title}`}>
                <p>{item.title}</p>
                <h6>NT ${item.price}</h6>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Section: 最新活動 */}
      <section className={`container ${styles.section}`}>
        <h3 className={styles.h3}>最新活動</h3>
        <div className={`d-flex justify-content-center ${styles.cards}`}>
          {activity.map((act, index) => (
            <div key={index} className={styles.card}>
              <img src={act.image} alt={act.title} className={styles.img} />
              <h5>{act.title}</h5>
              <p>{act.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Section: Why Kapego / 品牌介紹 */}
      <section className={`container ${styles.section}`}>
        <h3 className={styles.h3}>Why Kapego?</h3>
        <div className="d-flex justify-content-between">
          <div className={styles.cardText}>
            <h4>專業設計、德國工藝</h4>
            <p>Kapego 提供高品質原創設計的戶外照明，打造卓越產品體驗。</p>
          </div>
          <img src="/image/leftside-img.png" alt="Kapego" className={styles.img} />
        </div>
      </section>

      {/* Section: 文章專區 */}
      <section className={`container ${styles.section}`}>
        <h3 className={styles.h3}>最新文章</h3>
        <div className={`d-flex justify-content-around ${styles.cards}`}>
          {article.map((art, index) => (
            <Link key={index} href={`/article/${art.id}`} className={styles.card}>
              <img src={art.image} alt={art.title} className={styles.img} />
              <div className={styles.cardText}>
                <h5>{art.title}</h5>
                <p>{art.summary}</p>
                <small>{art.date}</small>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Section: Footer Info */}
      <footer className={`container-fluid ${styles.footer}`}>
        <div className="d-flex justify-content-between align-items-center">
          <div>
            <p>Kapego Co., Ltd.</p>
            <p>Copyright © 2025</p>
          </div>
          <div className={styles.footerLinks}>
            <Link href="/activity">活動列表</Link>
            <Link href="/products">商品列表</Link>
            <Link href="/rentals">租賃服務</Link>
            <Link href="/articles">文章專區</Link>
          </div>
          <div className={styles.footerContact}>
            <p>地址：桃園市中壢區新生路421號</p>
            <p>電話：03-12345678</p>
            <p>Email：info@kapego.com</p>
          </div>
        </div>
      </footer>
    </main>
  );
}


// "use client";
// import Image from "next/image";
// import styles from "./page.module.css";
// import {
//   FaAngleLeft,
//   FaAngleRight,
//   FaRegHeart,
//   FaStar,
//   FaRegStar,
//   FaCircle,
// } from "react-icons/fa";
// import { FiShoppingCart } from "react-icons/fi";
// import Link from "next/link";
// import { useState } from "react";
// import Carousel from "./components/Swiper/Carousel";

// export default function Home() {
//   // 設定串接資料
//   const [activity, setActivity] = useState([]);
//   const [product, setProduct] = useState([]);
//   const [article, setArticle] = useState([]);

//   return (
//     <>
//       <main>
//         {/* KV */}
//         <Carousel />

//         {/* section start */}
//         <div className={`container ${styles.sectionStart}`}>
          
//         </div>

//         {/* section activity */}
//         <div
//           className={`container ${styles.sectionActivity} ${styles.section}`}
//         >
//           <h3 className={styles.h3}>必試潛水冒險，精彩不容錯過</h3>
//           <div>
//             <div className={`d-flex justify-content-center ${styles.btns}`}>
//               <button className={`${styles.chooseBtn} ${styles.active}`}>
//                 所有活動
//               </button>
//               <button className={`${styles.chooseBtn}`}>初學者體驗</button>
//               <button className={`${styles.chooseBtn}`}>開放水域潛水</button>
//               <button className={`${styles.chooseBtn}`}>
//                 進階深潛或技術潛水
//               </button>
//             </div>
//             <div
//               className={`d-flex justify-content-sm-between justify-content-around w-100 ${styles.cards}`}
//             >
//               <div className={styles.card}>
//                 <div className={styles.imgContainer}>
//                   <div className={styles.circleIcons}>
//                     <button className={styles.circleIcon}>
//                       <FaRegHeart />
//                     </button>
//                     <button className={styles.circleIcon}>
//                       <FiShoppingCart />
//                     </button>
//                   </div>
//                   <div className={styles.stars}>
//                     <FaStar />
//                     <FaStar />
//                     <FaStar />
//                     <FaStar />
//                     <FaRegStar />
//                   </div>
//                   <img
//                     className={styles.img}
//                     src="/image/jpg (5).webp"
//                     alt=""
//                   />
//                 </div>
//                 <div className={`text-center ${styles.title}`}>
//                   <p className={`m-0`}>體驗潛水</p>
//                   <h6 className={`m-0`}>NT $2500</h6>
//                 </div>
//               </div>
//               <div className={styles.card}>
//                 <div className={styles.imgContainer}>
//                   <div className={styles.circleIcons}>
//                     <button className={styles.circleIcon}>
//                       <FaRegHeart />
//                     </button>
//                     <button className={styles.circleIcon}>
//                       <FiShoppingCart />
//                     </button>
//                   </div>
//                   <div className={styles.stars}>
//                     <FaStar />
//                     <FaStar />
//                     <FaStar />
//                     <FaStar />
//                     <FaRegStar />
//                   </div>
//                   <img
//                     className={styles.img}
//                     src="/image/jpg (5).webp"
//                     alt=""
//                   />
//                 </div>
//                 <div className={`text-center ${styles.title}`}>
//                   <p className={`m-0`}>體驗潛水</p>
//                   <h6 className={`m-0`}>NT $2500</h6>
//                 </div>
//               </div>
//               <div className={`${styles.card} d-none d-sm-flex`}>
//                 <div className={styles.imgContainer}>
//                   <div className={styles.circleIcons}>
//                     <button className={styles.circleIcon}>
//                       <FaRegHeart />
//                     </button>
//                     <button className={styles.circleIcon}>
//                       <FiShoppingCart />
//                     </button>
//                   </div>
//                   <div className={styles.stars}>
//                     <FaStar />
//                     <FaStar />
//                     <FaStar />
//                     <FaStar />
//                     <FaRegStar />
//                   </div>
//                   <img
//                     className={styles.img}
//                     src="/image/jpg (5).webp"
//                     alt=""
//                   />
//                 </div>
//                 <div className={`text-center ${styles.title}`}>
//                   <p className={`m-0`}>體驗潛水</p>
//                   <h6 className={`m-0`}>NT $2500</h6>
//                 </div>
//               </div>
//               <div className={`${styles.card} d-none d-sm-flex`}>
//                 <div className={styles.imgContainer}>
//                   <div className={styles.circleIcons}>
//                     <button className={styles.circleIcon}>
//                       <FaRegHeart />
//                     </button>
//                     <button className={styles.circleIcon}>
//                       <FiShoppingCart />
//                     </button>
//                   </div>
//                   <div className={styles.stars}>
//                     <FaStar />
//                     <FaStar />
//                     <FaStar />
//                     <FaStar />
//                     <FaRegStar />
//                   </div>
//                   <img
//                     className={styles.img}
//                     src="/image/jpg (5).webp"
//                     alt=""
//                   />
//                 </div>
//                 <div className={`text-center ${styles.title}`}>
//                   <p className={`m-0`}>體驗潛水</p>
//                   <h6
//                     className={`m-0 text-secondary text-decoration-line-through`}
//                   >
//                     NT $2500
//                   </h6>
//                   <h6 className={`m-0`}>NT $2500</h6>
//                 </div>
//               </div>
//             </div>
//             <div
//               className={`d-sm-none d-flex justify-content-center ${styles.nextBtns}`}
//             >
//               <button className={styles.btn}>
//                 <FaAngleLeft />
//               </button>
//               <button className={styles.btn}>
//                 <FaAngleRight />
//               </button>
//             </div>
//             <div className="text-center">
//               <button className={styles.scondaryBtn}>查看更多</button>
//             </div>
//           </div>
//         </div>

//         {/* section chooseUs */}
//         <div
//           className={`d-sm-flex d-none container ${styles.sectionchooseUs} ${styles.section}`}
//         >
//           <h3 className={styles.h3}>Why Kapego?</h3>
//           <div className="d-flex">
//             <div className={styles.imgContainer}>
//               <img src="/image/leftside-img.png" alt="" />
//             </div>
//             <div className={`d-flex flex-column ${styles.rightSideInfo}`}>
//               <div className={`d-flex flex-column`}>
//                 <h4>一站式潛水體驗</h4>
//                 <p>我們將提供......</p>
//               </div>
//               <div>
//                 <div className={`d-flex justify-content-between`}>
//                   <div className={`d-flex align-items-center ${styles.card}`}>
//                     <div className={styles.circleIcon}>
//                       <img
//                         className={styles.img}
//                         src="/image/Rectangle 5.png"
//                         alt=""
//                       />
//                     </div>
//                     <div className={styles.cardText}>
//                       <p className={`${styles.p} ${styles.p1}`}>精彩活動</p>
//                       <p className={`${styles.p} ${styles.p2}`}>
//                         發現海底的無限魅力，開啟你的潛水冒險
//                       </p>
//                       <Link
//                         href="/activity"
//                         className={`${styles.p} ${styles.p3}`}
//                       >
//                         我們提供豐富多元的潛水活動
//                       </Link>
//                     </div>
//                   </div>
//                   <div className={`d-flex align-items-center ${styles.card}`}>
//                     <div className={styles.circleIcon}>
//                       <img
//                         className={styles.img}
//                         src="/image/Rectangle 11.png"
//                         alt=""
//                       />
//                     </div>
//                     <div className={styles.cardText}>
//                       <p className={`${styles.p} ${styles.p1}`}>精選裝備</p>
//                       <p className={`${styles.p} ${styles.p2}`}>
//                         嚴選品質，確保每件商品經過嚴格檢驗
//                       </p>
//                       <Link
//                         href="/products"
//                         className={`${styles.p} ${styles.p3}`}
//                       >
//                         現在就去逛逛！
//                       </Link>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//               <div>
//                 <div className={`d-flex justify-content-between`}>
                  
//                   <div className={`d-flex align-items-center ${styles.card}`}>
//                     <div className={styles.circleIcon}>
//                       <img
//                         className={styles.img}
//                         src="/image/Rectangle 9.png"
//                         alt=""
//                       />
//                     </div>
//                     <div className={styles.cardText}>
//                       <p className={`${styles.p} ${styles.p1}`}>公開透明評論</p>
//                       <p className={`${styles.p} ${styles.p2}`}>
//                         提供討論區讓學員交流心得，幫助您安心選擇課程與裝備
//                       </p>
//                       <Link
//                         href="/article"
//                         className={`${styles.p} ${styles.p3}`}
//                       >
//                         看看大家都在討論什麼
//                       </Link>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>

        
        
//         {/* section article
//         <div className={`container ${styles.section} ${styles.sectionArticle}`}>
//           <h3 className={styles.h3}>潛水新知報報，深海探險的必讀文章</h3>
//           <div className={styles.cardsAndBtns}>
//             <div
//               className={`d-flex justify-content-sm-between justify-content-center ${styles.cards}`}
//             >
//               <a href="" className={`${styles.card}`}>
//                 <div className={styles.imgContainer}>
//                   <img
//                     className={styles.img}
//                     src="/image/pc-img00.jpg"
//                     alt=""
//                   />
//                 </div>
//                 <div className={styles.cardText}>
//                   <p className={styles.title}>台灣浮潛體驗</p>
//                   <p className={styles.content}>
//                     浮潛很適合第一次接觸潛水的人，對新手來說非常友善。浮潛時是以身體面朝下的方式漂浮在水面上，同時嘴巴含住呼吸管呼吸。因為只有漂浮在水面上而已，一有不適，抬起頭來就回到海平面上方，危險性相對較低。不確定自己喜不喜歡或適不適合潛水的人，第一次可以先透過體驗「浮潛」的方式接觸看看。而目前台灣浮潛大多以觀光性質居多，所以台灣許多以水上水下活動聞名的海域，都有相關體驗行程
//                   </p>
//                 </div>
//                 <div className={styles.date}>28 NOV 2024</div>
//               </a>
//               <a href="" className={`${styles.card} d-sm-flex d-none`}>
//                 <div className={styles.imgContainer}>
//                   <img
//                     className={styles.img}
//                     src="/image/pc-img00.jpg"
//                     alt=""
//                   />
//                 </div>
//                 <div className={styles.cardText}>
//                   <p className={styles.title}>台灣水肺潛水</p>
//                   <p className={styles.content}>
//                     平常旅遊觀光時，如果聽到「深潛」，通常指的就是「水肺潛水」。水肺潛水就不只是浮在水面上了，而是會真的潛入水中，至於換氣的方式主要是利用「壓縮氣瓶」。潛者在下水時就會揹著氣瓶下水，並用呼吸調節器從氣瓶中呼吸。深潛跟浮潛一樣，目前也有很多觀光業者在提供「體驗潛水」的項目，所以在許多觀光海域也能夠輕鬆體驗
//                   </p>
//                 </div>
//                 <div className={styles.date}>28 NOV 2024</div>
//               </a>
//               <a href="" className={`${styles.card} d-sm-flex d-none`}>
//                 <div className={styles.imgContainer}>
//                   <img
//                     className={styles.img}
//                     src="/image/pc-img00.jpg"
//                     alt=""
//                   />
//                 </div>
//                 <div className={styles.cardText}>
//                   <p className={styles.title}>台灣自由潛水 </p>
//                   <p className={styles.content}>
//                     自由潛水相較上面兩者，難度就加倍升級了呢～如同它名字所寫的「自由」，自由潛水是不會攜帶氣瓶這類設備下水，而只靠著單次的呼吸憋氣（屏息）完成每一次的潛水過程。另外，「深潛」其實不是水肺潛水的專屬，自潛一樣可以潛得很深。不過因為自潛相對危險，在開始學自潛時，一定會聽到教練耳提面命地說：「自由潛水絕對不要獨自進行喔！」。
//                   </p>
//                 </div>
//                 <div className={styles.date}>28 NOV 2024</div>
//               </a>
//             </div>
//             <div className={`d-flex justify-content-center ${styles.btns}`}>
//               <button className={styles.circleButton}>
//                 <FaAngleLeft />
//               </button>
//               <button className={styles.circleButton}>
//                 <FaAngleRight />
//               </button>
//             </div>
//           </div>
//         </div> */}
//       </main>
//     </>
//   );
// }
