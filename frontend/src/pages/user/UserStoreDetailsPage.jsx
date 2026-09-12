import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import api from '../../api/client';

const UserStoreDetailsPage = () => {
  const { id } = useParams();
  const [products, setProducts] = useState([]);
  const [store, setStore] = useState(null);
  const [loading, setLoading] = useState(true);
  const [addingToCart, setAddingToCart] = useState(null);

  useEffect(() => {
    // We could fetch store details and products. For simplicity, just products for now.
    api.get(`/stores/${id}/products`)
      .then(res => {
        setProducts(res.data.products);
        // Assuming we can get store details from another endpoint or from the products if we expand the backend.
        // Let's just fetch all stores and find it for now
        return api.get(`/stores`);
      })
      .then(res => {
        const found = res.data.stores.find(s => s.id === parseInt(id));
        setStore(found);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  const handleAddToCart = async (productId) => {
    setAddingToCart(productId);
    try {
      await api.post('/user/cart', { productId, quantity: 1 });
      alert('Added to cart!');
    } catch (err) {
      alert('Failed to add to cart');
    } finally {
      setAddingToCart(null);
    }
  };

  return (
    <div className="app-layout">
      <Sidebar />
      <main className="main-content">
        <div className="page-container">
          <Link to="/user/stores" className="btn btn-secondary btn-sm mb-4 inline-block">← Back to Stores</Link>
          
          <div className="page-header">
            <div>
              <h1 className="page-title">{store?.name || 'Store'}</h1>
              <p className="page-subtitle">{store?.address || 'Loading...'}</p>
            </div>
            <Link to="/user/cart" className="btn btn-primary">🛒 View Cart</Link>
          </div>

          {loading ? (
            <div className="loading-center"><div className="spinner" /></div>
          ) : products.length === 0 ? (
            <div className="empty-state">
              <p>This store has no products yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {products.map(product => (
                <div key={product.id} className="card p-4 flex flex-col h-full" style={{ padding: '16px' }}>
                  {product.imageUrl ? (
                    <img 
                      src={product.imageUrl.startsWith('/') ? `http://localhost:5000${product.imageUrl}` : product.imageUrl} 
                      alt={product.name} 
                      style={{ width: '100%', height: '192px', objectFit: 'cover', borderRadius: '8px', marginBottom: '16px' }} 
                      onError={(e) => { e.target.src = product.imageUrl; }}
                    />
                  ) : (
                    <div style={{ width: '100%', height: '192px', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '8px', marginBottom: '16px', color: '#94a3b8' }}>No Image Available</div>
                  )}
                  <h3 className="text-lg font-bold" style={{ fontSize: '1.125rem', fontWeight: 700 }}>{product.name}</h3>
                  <p className="text-[var(--text-muted)] text-sm flex-1">{product.description}</p>
                  <div className="flex justify-between items-center mt-4">
                    <span className="text-xl font-bold text-[var(--primary-color)]">₹{product.price}</span>
                    <button 
                      className="btn btn-primary btn-sm"
                      onClick={() => handleAddToCart(product.id)}
                      disabled={addingToCart === product.id}
                    >
                      {addingToCart === product.id ? 'Adding...' : 'Add to Cart'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default UserStoreDetailsPage;
