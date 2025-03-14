import styles from "./favorite.module.css";
import Link from "next/link";

export default function favorite() {
  return (
    <div className={styles.content}>
      <div className={styles.aside}>
        <div className={styles.listBox}>
          <div className={styles.asideTitle}>
            <h5 style={{ margin: 0 }}>會員中心</h5>
          </div>
          <div className={styles.asideContent}>
            <div className={styles.ASpoint}>
              <Link href="/member/account" className={styles.ASpoint}>
                <h6>我的帳戶</h6>
              </Link>
            </div>
            <Link href="/member/order/orderRent" className={styles.ASother}>
              <h6>我的訂單</h6>
            </Link>
            <Link href="/member/group" className={styles.ASother}>
              <h6>我的揪團</h6>
            </Link>
            <Link href="/member/favorite" className={styles.ASother}>
              <h6>我的最愛</h6>
            </Link>
          </div>
        </div>
      </div>
      <div className={styles.main}>
        <div className={styles.mainTitle}>
          <h4 style={{ fontWeight: 700, margin: 0 }}>我的最愛</h4>
        </div>
        {/* Repeat for each order section */}
        <div className={styles.sectionContent}>
          <div className={styles.SCcard}>
            <img src="/dc48b717dc65c863526fd471b4d2a2c7.jpg" alt="" />
            <div className={styles.SCtext}>
              <p style={{ color: "#898989" }}>APORO</p>
              <p>揪團名稱</p>
              <h5 style={{ fontWeight: 700 }}>NT $2000</h5>
            </div>
          </div>
          <div className={styles.SCcard}>
            <img src="/dc48b717dc65c863526fd471b4d2a2c7.jpg" alt="" />
            <div className={styles.SCtext}>
              <p style={{ color: "#898989" }}>APORO</p>
              <p>揪團名稱</p>
              <h5 style={{ fontWeight: 700 }}>NT $2000</h5>
            </div>
          </div>
          <div className={styles.SCcard}>
            <img src="/dc48b717dc65c863526fd471b4d2a2c7.jpg" alt="" />
            <div className={styles.SCtext}>
              <p style={{ color: "#898989" }}>APORO</p>
              <p>揪團名稱</p>
              <h5 style={{ fontWeight: 700 }}>NT $2000</h5>
            </div>
          </div>
          <div className={styles.SCcard}>
            <img src="/dc48b717dc65c863526fd471b4d2a2c7.jpg" alt="" />
            <div className={styles.SCtext}>
              <p style={{ color: "#898989" }}>APORO</p>
              <p>揪團名稱</p>
              <h5 style={{ fontWeight: 700 }}>NT $2000</h5>
            </div>
          </div>
        </div>
        <div className={styles.sectionContent}>
          <div className={styles.SCcard}>
            <img src="/dc48b717dc65c863526fd471b4d2a2c7.jpg" alt="" />
            <div className={styles.SCtext}>
              <p style={{ color: "#898989" }}>APORO</p>
              <p>揪團名稱</p>
              <h5 style={{ fontWeight: 700 }}>NT $2000</h5>
            </div>
          </div>
          <div className={styles.SCcard}>
            <img src="/dc48b717dc65c863526fd471b4d2a2c7.jpg" alt="" />
            <div className={styles.SCtext}>
              <p style={{ color: "#898989" }}>APORO</p>
              <p>揪團名稱</p>
              <h5 style={{ fontWeight: 700 }}>NT $2000</h5>
            </div>
          </div>
          <div className={styles.SCcard}>
            <img src="/dc48b717dc65c863526fd471b4d2a2c7.jpg" alt="" />
            <div className={styles.SCtext}>
              <p style={{ color: "#898989" }}>APORO</p>
              <p>揪團名稱</p>
              <h5 style={{ fontWeight: 700 }}>NT $2000</h5>
            </div>
          </div>
          <div className={styles.SCcard}>
            <img src="/dc48b717dc65c863526fd471b4d2a2c7.jpg" alt="" />
            <div className={styles.SCtext}>
              <p style={{ color: "#898989" }}>APORO</p>
              <p>揪團名稱</p>
              <h5 style={{ fontWeight: 700 }}>NT $2000</h5>
            </div>
          </div>
        </div>
        <div className={styles.sectionContent}>
          <div className={styles.SCcard}>
            <img src="/dc48b717dc65c863526fd471b4d2a2c7.jpg" alt="" />
            <div className={styles.SCtext}>
              <p style={{ color: "#898989" }}>APORO</p>
              <p>揪團名稱</p>
              <h5 style={{ fontWeight: 700 }}>NT $2000</h5>
            </div>
          </div>
          <div className={styles.SCcard}>
            <img src="/dc48b717dc65c863526fd471b4d2a2c7.jpg" alt="" />
            <div className={styles.SCtext}>
              <p style={{ color: "#898989" }}>APORO</p>
              <p>揪團名稱</p>
              <h5 style={{ fontWeight: 700 }}>NT $2000</h5>
            </div>
          </div>
          <div className={styles.SCcard}>
            <img src="/dc48b717dc65c863526fd471b4d2a2c7.jpg" alt="" />
            <div className={styles.SCtext}>
              <p style={{ color: "#898989" }}>APORO</p>
              <p>揪團名稱</p>
              <h5 style={{ fontWeight: 700 }}>NT $2000</h5>
            </div>
          </div>
          <div className={styles.SCcard}>
            <img src="/dc48b717dc65c863526fd471b4d2a2c7.jpg" alt="" />
            <div className={styles.SCtext}>
              <p style={{ color: "#898989" }}>APORO</p>
              <p>揪團名稱</p>
              <h5 style={{ fontWeight: 700 }}>NT $2000</h5>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
