import React, { useEffect, useState } from 'react';
import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  restoreProduct
} from '../api/productApi';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function ProductList() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({ productId: '', category: '', unitPrice: '' });
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState(null);
  const [categoryFilter, setCategoryFilter] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchProducts = async (category) => {
    setLoading(true);
    try {
      const data = await getProducts(category);
      setProducts(data);
    } catch (err) {
      console.log(err)
      setError('Failed to fetch products.');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchProducts(categoryFilter);
    // eslint-disable-next-line
  }, [categoryFilter]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isEditing) {
        await updateProduct(form.productId, form);
      } else {
        await createProduct(form);
      }
      setForm({ productId: '', category: '', unitPrice: '' });
      setIsEditing(false);
      setError(null);
      await fetchProducts(categoryFilter);
    } catch (err) {
      console.log(err)
      setError('Failed to submit the form.');
    }
    setLoading(false);
  };

  const handleDelete = async (id) => {
    setLoading(true);
    try {
      await deleteProduct(id);
      await fetchProducts(categoryFilter);
    } catch (err) {
      console.log(err)
      setError('Failed to delete product.');
    }
    setLoading(false);
  };

  const handleRestore = async (id) => {
    setLoading(true);
    try {
      await restoreProduct(id);
      await fetchProducts(categoryFilter);
    } catch (err) {
      console.log(err)
      setError('Failed to restore product.');
    }
    setLoading(false);
  };

  const handleEdit = (product) => {
    setForm({
      productId: product.productId,
      category: product.category,
      unitPrice: product.unitPrice,
    });
    setIsEditing(true);
    setError(null);
  };

  const handleCategoryFilter = (e) => {
    setCategoryFilter(e.target.value);
  };

  const handleClearCategory = () => {
    setCategoryFilter('');
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Products</h2>
      {error && <div className="alert alert-danger">{error}</div>}

      <div className="mb-3 d-flex flex-wrap align-items-center">
        <form onSubmit={handleSubmit} className="d-flex flex-wrap gap-2 align-items-center">
          <input
            name="productId"
            placeholder="Product ID"
            value={form.productId}
            onChange={handleChange}
            className="form-control"
            style={{ width: 120 }}
            required
            disabled={isEditing}
          />
          <input
            name="category"
            placeholder="Category"
            value={form.category}
            onChange={handleChange}
            className="form-control"
            style={{ width: 140 }}
            required
          />
          <input
            name="unitPrice"
            placeholder="Unit Price"
            type="number"
            value={form.unitPrice}
            onChange={handleChange}
            className="form-control"
            style={{ width: 120 }}
            required
          />
          <button type="submit" className={`btn ${isEditing ? 'btn-success' : 'btn-primary'}`}>
            {isEditing ? 'Update Product' : 'Add Product'}
          </button>
          {isEditing && (
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => {
                setForm({ productId: '', category: '', unitPrice: '' });
                setIsEditing(false);
              }}
            >
              Cancel
            </button>
          )}
        </form>
        <div className="ms-auto d-flex align-items-center gap-2">
          <input
            type="text"
            placeholder="Filter by Category"
            value={categoryFilter}
            onChange={handleCategoryFilter}
            className="form-control"
            style={{ width: 160 }}
          />
          <button
            className="btn btn-outline-secondary"
            onClick={handleClearCategory}
            disabled={!categoryFilter}
          >
            Clear
          </button>
        </div>
      </div>

      <div className="table-responsive">
        <table className="table table-striped table-bordered align-middle">
          <thead className="table-primary">
            <tr>
              <th>ID</th>
              <th>Category</th>
              <th>Unit Price</th>
              <th>Active</th>
              <th style={{ minWidth: '180px' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="5" className="text-center">Loading...</td>
              </tr>
            ) : products.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center text-muted">No products found.</td>
              </tr>
            ) : (
              products.map((p) => (
                <tr key={p.productId}>
                  <td>{p.productId}</td>
                  <td>{p.category}</td>
                  <td>{p.unitPrice}</td>
                  <td>
                    <span className={`badge ${p.active ? 'bg-success' : 'bg-danger'}`}>
                      {p.active ? 'Yes' : 'No'}
                    </span>
                  </td>
                  <td>
                    {p.active ? (
                      <>
                        <button
                          className="btn btn-sm btn-primary me-2"
                          onClick={() => handleEdit(p)}
                        >
                          Edit
                        </button>
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => handleDelete(p.productId)}
                        >
                          Delete
                        </button>
                      </>
                    ) : (
                      <button
                        className="btn btn-sm btn-success"
                        onClick={() => handleRestore(p.productId)}
                      >
                        Restore
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
