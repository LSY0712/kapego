"use client";

import { useRouter } from "next/navigation"; 
import { useEffect, useState } from "react";
import axios from "axios";

export default function ProductDetail() {
  const router = useRouter();
  const { id } = router.query;
  const [product, setProduct] = useState(null);

  const fetchProductDetail = async () => {
    try {
      const { data } = await axios.get(`/api/products/${id}`);
      if (data.success) {
        setProduct(data.data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (id) fetchProductDetail();
  }, [id]);

  if (!product) return <p>Loading...</p>;

  return (
    <div className="container">
      <h1>{product.name}</h1>
      <div className="product-images">
        {product.images.map((img) => (
          <img key={img.id} src={img.image_path} alt={product.name} />
        ))}
      </div>
      <p>價格：NT${product.price}</p>
      <p>{product.description || "商品說明待補充"}</p>
      <button>加入購物車</button>
    </div>
  );
}
// "use client"; // 確保這是 Client Component
// import { useParams } from "next/navigation";

// const ProductDetail = () => {
//   const params = useParams();
//   const id = params?.id; // 確保不會出錯

//   if (!id) {
//     return <div>⚠️ 找不到產品 ID</div>;
//   }

//   return <div>產品 ID: {id}</div>;
// };

// export default ProductDetail;