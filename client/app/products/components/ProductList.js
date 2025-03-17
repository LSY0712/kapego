"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import ProductCard from "./ProductCard";
import SidebarProductList from "./SidebarProductList";
import { Slider, InputNumber, Space } from "antd";

const API_BASE_URL = "http://localhost:3005/api";

export default function ProductList() {
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(24);
  const [sort] = useState("id");
  const [order] = useState("ASC");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // 側邊新品
  const [newProducts, setNewProducts] = useState([]);

  // 價格篩選
  const [priceRange, setPriceRange] = useState({
    min: 0,
    max: 40000,
  });
  
  const [filterPrice, setFilterPrice] = useState({
    min: 0,
    max: 40000,
  });

  useEffect(() => {
    fetchProducts();
    fetchNewProducts();
  }, [page, filterPrice]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE_URL}/products`, {
        params: {
          page,
          limit,
          sort,
          order,
          min_price: filterPrice.min,
          max_price: filterPrice.max,
        },
      });
      setProducts(res.data.data || []);
    } catch (err) {
      console.error("❌ 取得商品列表失敗:", err);
      setError("無法取得商品列表");
    } finally {
      setLoading(false);
    }
  };

  const fetchNewProducts = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/products`, {
        params: {
          page: 1,
          limit: 5,
          sort: "id",
          order: "DESC",
        },
      });
      setNewProducts(res.data.data || []);
    } catch (err) {
      console.error("❌ 取得新品失敗:", err);
    }
  };

  const handlePriceSliderChange = (values) => {
    setFilterPrice({
      min: values[0],
      max: values[1],
    });
  };

  const handleMinInputChange = (value) => {
    setFilterPrice((prev) => ({
      ...prev,
      min: value || 0,
    }));
  };

  const handleMaxInputChange = (value) => {
    setFilterPrice((prev) => ({
      ...prev,
      max: value || 40000,
    }));
  };

  if (error) return <p>{error}</p>;

  return (
    <div className="container py-4">
      <div className="row">
        {/* 側邊欄 */}
        <div className="col-lg-3">
          {/* 價格篩選 */}
          <div className="card mb-4">
            <div className="card-header">
              <h5>價格篩選</h5>
            </div>
            <div className="card-body">
              <Space direction="vertical" style={{ width: "100%" }}>
                <div style={{ display: "flex", gap: "10px" }}>
                  <InputNumber
                    min={0}
                    max={filterPrice.max}
                    value={filterPrice.min}
                    onChange={handleMinInputChange}
                    style={{ width: "100%" }}
                    placeholder="最低價格"
                  />
                  <InputNumber
                    min={filterPrice.min}
                    max={priceRange.max}
                    value={filterPrice.max}
                    onChange={handleMaxInputChange}
                    style={{ width: "100%" }}
                    placeholder="最高價格"
                  />
                </div>
                <Slider
                  range
                  min={priceRange.min}
                  max={priceRange.max}
                  value={[filterPrice.min, filterPrice.max]}
                  onChange={handlePriceSliderChange}
                  tooltip={{
                    formatter: (value) => `NT$${value.toLocaleString()}`,
                  }}
                />
              </Space>
            </div>
          </div>

          {/* 新品上市 */}
          <SidebarProductList title="新品上市" products={newProducts} />
        </div>

        {/* 商品清單 */}
        <div className="col-lg-9">
          <h2>商品列表</h2>
          {loading ? (
            <p>載入中...</p>
          ) : (
            <div className="row">
              {products.map((product) => (
                <div key={product.id} className="col-lg-4">
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          )}

          {/* 分頁 */}
          <div className="d-flex justify-content-between mt-4">
            <button
              className="btn btn-outline-primary"
              disabled={page === 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              上一頁
            </button>
            <span>第 {page} 頁</span>
            <button
              className="btn btn-outline-primary"
              onClick={() => setPage((p) => p + 1)}
            >
              下一頁
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
