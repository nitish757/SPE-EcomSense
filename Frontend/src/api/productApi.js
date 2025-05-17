import axios from 'axios';

export const getProducts = async (category) => {
  if (category && category.trim() !== '') {
    const res = await axios.get(`/products?category=${encodeURIComponent(category)}`);
    return res.data;
  } else {
    const res = await axios.get('/products');
    return res.data;
  }
};

export const createProduct = async (product) => {
  const res = await axios.post('/products', product)
  return res.data
}

export const updateProduct = async (id, product) => {
  const res = await axios.put(`/products/${id}`, product);
  return res.data;
};

export const deleteProduct = async (id) => {
  await axios.delete(`/products/${id}`);
};

export const restoreProduct = async (id) => {
  const res = await axios.patch(`/products/${id}/restore`);
  return res.data;
};
