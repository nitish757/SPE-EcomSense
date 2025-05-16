import React, { useEffect, useState } from 'react'
import { getProducts, createProduct, updateProduct, deleteProduct } from '../api/productApi'

export default function ProductList() {
    const [products, setProducts] = useState([])
    const [form, setForm] = useState({ productId: '', category: '', unitPrice: '' })
    const [isEditing, setIsEditing] = useState(false)
    const [error, setError] = useState(null)
  
    const fetchProducts = async () => {
      try {
        const data = await getProducts()
        setProducts(data)
      } catch (err) {
        console.error(err)
        setError('Failed to fetch products.')
      }
    }
  
    useEffect(() => {
      fetchProducts()
    }, [])
  
    const handleChange = (e) => {
      setForm({ ...form, [e.target.name]: e.target.value })
    }
  
    const handleSubmit = async (e) => {
      e.preventDefault()
      try {
        if (isEditing) {
          await updateProduct(form.productId, form)
        } else {
          await createProduct(form)
        }
        setForm({ productId: '', category: '', unitPrice: '' })
        setIsEditing(false)
        setError(null)
        await fetchProducts()
      } catch (err) {
        console.error(err)
        setError('Failed to submit the form.')
      }
    }
  
    const handleDelete = async (id) => {
      try {
        await deleteProduct(id)
        await fetchProducts()
      } catch (err) {
        console.error(err)
        setError('Failed to delete product.')
      }
    }
  
    const handleEdit = (product) => {
      setForm({
        productId: product.productId,
        category: product.category,
        unitPrice: product.unitPrice,
      })
      setIsEditing(true)
      setError(null)
    }
  
    return (
      <div>
        <h2>Products</h2>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <form onSubmit={handleSubmit}>
          <input name="productId" placeholder="Product ID" value={form.productId} onChange={handleChange} required />
          <input name="category" placeholder="Category" value={form.category} onChange={handleChange} required />
          <input name="unitPrice" placeholder="Default Price" type="number" value={form.unitPrice} onChange={handleChange} required />
          <button type="submit">{isEditing ? 'Update Product' : 'Add Product'}</button>
          {isEditing && <button type="button" onClick={() => { setForm({ productId: '', category: '', unitPrice: '' }); setIsEditing(false) }}>Cancel</button>}
        </form>
        <div style={{ overflowX: 'auto' }}>
        <table>
          <thead>
            <tr>
              <th>ID</th><th>Category</th><th>Price</th><th>Active</th><th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map(p => (
              <tr key={p.productId}>
                <td>{p.productId}</td>
                <td>{p.category}</td>
                <td>{p.unitPrice}</td>
                <td>{p.active ? 'Yes' : 'No'}</td>
                <td>
                  <button onClick={() => handleEdit(p)}>Edit</button>
                  <button onClick={() => handleDelete(p.productId)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      </div>
    )
  }