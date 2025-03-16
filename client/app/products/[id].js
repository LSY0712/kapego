import { useRouter } from "next/router";
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
