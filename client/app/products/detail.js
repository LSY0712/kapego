import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchProductById } from '../../api/products';

const ProductDetailPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    const getProduct = async () => {
      try {
        const res = await fetchProductById(id);
        setProduct(res.data);
      } catch (error) {
        console.error(error);
      }
    };

    getProduct();
  }, [id]);

  if (!product) return <p>載入中...</p>;

  return (
    <div>
      <h1>{product.name}</h1>
      <p>價格: {product.price}</p>
      <p>介紹: {product.description}</p>
      {/* 顯示圖片 */}
      <img src={`/img/${product.image}`} alt={product.name} />
    </div>
  );
};

export default ProductDetailPage;
