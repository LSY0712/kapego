import ProductDetail from "../components/ProductDetail";

export default async function ProductPage({ params }) {
  const id = params.id; // ✅ 正確！不要解構 { id }，直接 params.id

  return <ProductDetail id={id} />;
}
