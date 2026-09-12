import React, { useEffect, useState } from 'react';
import Sidebar from '../../components/Sidebar';
import DataTable from '../../components/DataTable';
import api from '../../api/client';
import { useForm } from 'react-hook-form';

const OwnerProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  const { register, handleSubmit, reset } = useForm();

  const loadProducts = () => {
    setLoading(true);
    api.get('/owner/products')
      .then(res => setProducts(res.data.products))
      .catch(() => setError('Failed to load products'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const openModal = (product = null) => {
    setEditingProduct(product);
    if (product) {
      reset({ ...product });
    } else {
      reset({ name: '', description: '', price: '', imageUrl: '' });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
  };

  const onSubmit = async (data) => {
    setIsSaving(true);
    try {
      const formData = new FormData();
      formData.append('name', data.name);
      formData.append('description', data.description || '');
      formData.append('price', data.price);
      
      // If a new image file is selected, append it
      if (data.image && data.image[0]) {
        formData.append('image', data.image[0]);
      } else if (data.imageUrl) {
        formData.append('imageUrl', data.imageUrl);
      }

      if (editingProduct) {
        await api.put(`/owner/products/${editingProduct.id}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      } else {
        await api.post('/owner/products', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      }
      closeModal();
      loadProducts();
    } catch (err) {
      alert(err.response?.data?.message || 'Error saving product');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await api.delete(`/owner/products/${id}`);
        loadProducts();
      } catch (err) {
        alert('Failed to delete product');
      }
    }
  };

  const columns = [
    { 
      key: 'image', 
      header: 'Image', 
      render: (row) => row.imageUrl ? (
        <img src={`http://localhost:5000${row.imageUrl}`} alt={row.name} style={{ width: 40, height: 40, objectFit: 'cover', borderRadius: '4px' }} onError={(e) => { e.target.src = row.imageUrl; }} />
      ) : (
        <div style={{ width: 40, height: 40, background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '4px', fontSize: '10px', color: '#94a3b8' }}>No Img</div>
      )
    },
    { key: 'name', header: 'Product Name', render: (row) => <strong>{row.name}</strong> },
    { key: 'price', header: 'Price', render: (row) => `₹${row.price}` },
    { key: 'description', header: 'Description' },
    {
      key: 'actions',
      header: 'Actions',
      render: (row) => (
        <div style={{ display: 'flex', gap: '8px' }}>
          <button className="btn btn-secondary btn-sm" onClick={() => openModal(row)}>Edit</button>
          <button className="btn btn-sm" style={{ background: '#ef4444', color: '#fff' }} onClick={() => handleDelete(row.id)}>Delete</button>
        </div>
      )
    }
  ];

  return (
    <div className="app-layout">
      <Sidebar />
      <main className="main-content">
        <div className="page-container">
          <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h1 className="page-title">Manage Products</h1>
              <p className="page-subtitle">Add or edit products in your Kirana store</p>
            </div>
            <button className="btn btn-primary" onClick={() => openModal()}>+ Add Product</button>
          </div>

          {error && <div className="alert alert-error">⚠️ {error}</div>}

          {loading ? (
            <div className="loading-center"><div className="spinner" /></div>
          ) : (
            <div className="card">
              <DataTable data={products} columns={columns} globalFilterPlaceholder="Search products..." />
            </div>
          )}

          {isModalOpen && (
            <div className="modal-overlay" style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
              <div className="card" style={{ width: '100%', maxWidth: '500px' }}>
                <div className="card-header"><span className="card-title">{editingProduct ? 'Edit Product' : 'Add Product'}</span></div>
                <form onSubmit={handleSubmit(onSubmit)} style={{ padding: '20px' }}>
                  <div className="form-group">
                    <label>Product Name</label>
                    <input type="text" className="form-control" {...register('name')} required />
                  </div>
                  <div className="form-group">
                    <label>Description</label>
                    <textarea className="form-control" rows="3" {...register('description')}></textarea>
                  </div>
                  <div className="form-group">
                    <label>Price (₹)</label>
                    <input type="number" step="0.01" className="form-control" {...register('price')} required />
                  </div>
                  <div className="form-group">
                    <label>Upload Image</label>
                    <input type="file" className="form-control" accept="image/*" {...register('image')} />
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                      Select a product image from your device. {editingProduct?.imageUrl && 'Leave empty to keep current image.'}
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                    <button type="submit" className="btn btn-primary" disabled={isSaving}>{isSaving ? 'Saving...' : (editingProduct ? 'Save Changes' : 'Create')}</button>
                    <button type="button" className="btn btn-secondary" onClick={closeModal} disabled={isSaving}>Cancel</button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default OwnerProductsPage;
