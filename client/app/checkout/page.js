import { useCart } from "@/hooks/cartContext";
import { useAuth } from "@/hooks/use-auth";
import axios from "axios";

export default function OneClickCheckout() {
  const { cartData, fetchCart } = useCart();
  const { user } = useAuth();

  const handleCheckout = async () => {
    if (!user?.id) {
      alert("請先登入");
      return;
    }

    try {
      // 發送 checkout 請求
      const res = await axios.post("http://localhost:3005/api/cart/checkout", {
        userId: user.id,
      });

      if (res.data.success) {
        alert(`訂單完成！訂單編號: ${res.data.orderId}`);
        // 可以選擇跳轉
        // router.push("/order/history")
        fetchCart(); // 更新購物車狀態
      } else {
        alert(res.data.message || "結帳失敗！");
      }
    } catch (error) {
      console.error("🔥 結帳錯誤:", error);
      alert("發生錯誤，請稍後再試！");
    }
  };

  return (
    <div>
      <h2>購物車結帳</h2>
      <button onClick={handleCheckout}>立即結帳</button>
    </div>
  );
}
