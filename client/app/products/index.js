import { useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [filters, setFilters] = useState({
    series: "",
    minPrice: "",
    maxPrice: "",
    sort: "id",
    order: "ASC",
  });

  const fetchProducts = async () => {
    try {
      const { data } = await axios.get("/api/products", {
        params: {
          page,
          ...filters,
        },
      });
      if (data.success) {
        setProducts(data.data);
        setTotal(data.total);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [page, filters]);

  return (
    <div className="container">
      <h1>商品列表</h1>

      {/* 篩選表單 */}
      <div className="filters">
        <select
          value={filters.series}
          onChange={(e) => setFilters({ ...filters, series: e.target.value })}
        >
          <option value="">全部系列</option>
          <option value="1">Series 1</option>
          <option value="2">Series 2</option>
        </select>

        <input
          type="number"
          placeholder="最低價格"
          value={filters.minPrice}
          onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
        />
        <input
          type="number"
          placeholder="最高價格"
          value={filters.maxPrice}
          onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
        />

        <button onClick={() => setPage(1)}>套用篩選</button>
      </div>

      {/* 商品清單 */}
      <div className="product-grid">
        {products.map((product) => (
          <div key={product.id} className="product-card">
            <img src={product.cover_image || "/placeholder.jpg"} alt={product.name} />
            <h3>{product.name}</h3>
            <p>價格：NT${product.price}</p>
            <Link href={`/products/${product.id}`}>查看詳情</Link>
          </div>
        ))}
      </div>

      {/* 分頁 */}
      <div className="pagination">
        {Array.from({ length: Math.ceil(total / 10) }).map((_, idx) => (
          <button key={idx} onClick={() => setPage(idx + 1)}>
            {idx + 1}
          </button>
        ))}
      </div>
    </div>
  );
}


