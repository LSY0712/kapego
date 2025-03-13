import React, { useEffect, useState } from 'react';
import { fetchProducts } from '../../api/products';

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [series, setSeries] = useState('');
  const [page, setPage] = useState(1);

  useEffect(() => {
    const getProducts = async () => {
      try {
        const params = {
          page,
          limit: 24,
          series: series || undefined,
        };
        const res = await fetchProducts(params);
        setProducts(res.data);
      } catch (error) {
        console.error(error);
      }
    };

    getProducts();
  }, [page, series]);

  return (
    <div>
      <h1>商品列表</h1>
      <div>
        <button onClick={() => setSeries('1')}>系列 1</button>
        <button onClick={() => setSeries('2')}>系列 2</button>
      </div>
      <div className="product-list">
        {products.map(product => (
          <div key={product.id}>
            <h2>{product.name}</h2>
            <p>價格: {product.price}</p>
            <a href={`/products/${product.id}`}>查看詳細</a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductsPage;
