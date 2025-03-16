"use client";
import { useState } from "react";
import { FaSearch, FaBars } from "react-icons/fa";
import User from "./user";
import { FiShoppingCart } from "react-icons/fi";
import Link from "next/link";
// import HeaderPop from "./headerPop"; // 引入 HeaderPop 組件

export default function Header() {
  const [showPop, setShowPop] = useState(false);
  const [activeMenu, setActiveMenu] = useState(null);

  const handleMouseEnter = (menu) => {
    setShowPop(true);
    setActiveMenu(menu);
  };

  const handleMouseLeave = () => {
    setShowPop(false);
    setActiveMenu(null);
  };
  return (
    <header className="sticky-top">
      <nav className="container" onMouseLeave={handleMouseLeave}>
        {/* 電腦版 navbar */}
        <div className="d-none d-sm-flex">
          <div className="header-icon-container">
            <Link href="/">
              <img src="/img/logowhite.png" alt="Logo" />
            </Link>
          </div>
          <div className="header-list d-flex justify-content-between align-items-center">
            <ul className="m-0 d-flex justify-content-between align-items-center list-unstyled">
              <li className="px-5 py-2">
                <Link
                  className="a"
                  href="/"
                  onMouseEnter={() => {
                    setShowPop(false);
                  }}
                >
                  首頁
                </Link>
              </li>
              <li className="px-5 py-2">
                <Link
                  className="a"
                  href="/products"
                  onMouseEnter={() => handleMouseEnter("products")}
                >
                  商品列表
                </Link>
              </li>
              <li className="px-5 py-2">
                <Link
                  className="a"
                  href="/article"
                  onMouseEnter={() => handleMouseEnter("forum")}
                >
                  關於我們
                </Link>
              </li>
            </ul>
          </div>
          {/* <HeaderPop show={showPop} activeMenu={activeMenu} /> */}
          <div className="header-right-box d-flex justify-content-end align-items-center">
            <a href="/cart" className="header-cart a" id="cart-icon">
              <FiShoppingCart size={20}/>
            </a>
            <User />
          </div>
        </div>

        {/* 手機板 navbar*/}
        <div className="w-100 d-flex d-sm-none justify-content-between align-items-center">
          <div>
            <button
              className="btn"
              type="button"
              data-bs-toggle="offcanvas"
              data-bs-target="#offcanvasExample"
              aria-controls="offcanvasExample"
            >
              <FaBars />
            </button>
          </div>
          <div className="header-icon-container text-center">
            <img src="/img/logowhite.png" alt="Logo" />
          </div>
          <div className="mobile-cart fs-4">
            <Link href="/cart" className="a text-black">
              <FiShoppingCart />
            </Link>
            {/* <a href="#"="" class="a text-black ms-1"><i class="bi bi-person"></i></a> */}
          </div>
        </div>
      </nav>

      {/* 漢堡選單內容 */}
      <div
        className="mobile-offcanvas offcanvas offcanvas-start "
        tabIndex={-1}
        id="offcanvasExample"
        aria-labelledby="offcanvasExampleLabel"
      >
        <div className="mobile-offcanvas-header offcanvas-header">
          <h5
            className="offcanvas-title text-secondary"
            id="offcanvasScrollingLabel"
          />
          <button
            type="button"
            className="btn-close text-reset"
            data-bs-dismiss="offcanvas"
            aria-label="Close"
          />
        </div>
        <div className="mobile-offcanvas-body offcanvas-body p-0">
          <ul className="m-0 list-unstyled border-bottom">
            <li className="px-3 pt-4 pb-2">
              <Link className="a text-reset" href="/">
                首頁
              </Link>
            </li>
            <li className="px-3 py-2">
              <button
                className="btn dropdown-toggle p-0 text-reset"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#product-menu"
              >
                商品
              </button>
            </li>
          </ul>
          <div className="border-bottom">
            <h5 className="px-3 pt-4 py-2 text-secondary">帳戶</h5>
            <ul className="m-0 px-4 list-unstyled">
              <li className="px-3 py-2">
                <Link className="a text-reset" href="/member/login">
                  登入
                </Link>
              </li>
              <li className="px-3 pt-2 pb-4">
                <Link className="a text-reset" href="/member/register">
                  註冊
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </header>
  );
}
