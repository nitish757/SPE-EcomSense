import axios from 'axios';

// Use environment variable for the product service base URL
const PRODUCT_API_URL = import.meta.env.VITE_PRODUCT_API_URL;

const api = axios.create({
  baseURL: PRODUCT_API_URL,
});

export const getProducts = async (category) => {
  if (category && category.trim() !== '') {
    const res = await api.get(`/products?category=${encodeURIComponent(category)}`);
    return res.data;
  } else {
    const res = await api.get('/products');
    return res.data;
  }
};

export const createProduct = async (product) => {
  const res = await api.post('/products', product);
  return res.data;
};

export const updateProduct = async (id, product) => {
  const res = await api.put(`/products/${id}`, product);
  return res.data;
};

export const deleteProduct = async (id) => {
  await api.delete(`/products/${id}`);
};

export const restoreProduct = async (id) => {
  const res = await api.patch(`/products/${id}/restore`);
  return res.data;
};
