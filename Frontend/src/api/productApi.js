import axios from 'axios'

export const getProducts = async () => {
  const res = await axios.get('/products')
  return res.data
}

export const createProduct = async (product) => {
  const res = await axios.post('/products', product)
  return res.data
}

export const updateProduct = async (id, product) => {
  const res = await axios.put(`/products/${id}`, product)
  return res.data
}

export const deleteProduct = async (id) => {
  await axios.delete(`/products/${id}`)
}
