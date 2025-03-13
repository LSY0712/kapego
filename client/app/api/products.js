import axios from 'axios';

// 取得商品列表
export const fetchProducts = async (params) => {
  try {
    const response = await axios.get('/api/products', { params });
    return response.data;
  } catch (error) {
    console.error('取得商品列表失敗', error);
    throw error;
  }
};

// 取得單一商品
export const fetchProductById = async (id) => {
  try {
    const response = await axios.get(`/api/products/${id}`);
    return response.data;
  } catch (error) {
    console.error('取得商品詳情失敗', error);
    throw error;
  }
};
