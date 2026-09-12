import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import Stars from '../../components/Stars';
import api from '../../api/client';

const AdminStoreDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [store, setStore] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api
      .get(`/admin/stores/${id}`)
      .then((res) => setStore(res.data.store))
      .catch((err) => {
        setError(err.response?.data?.message || 'Failed to load store details.');
      })
      .finally(() => setLoading(false));
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm(`Are you sure you want to permanently delete "${store.name}" and all associated products, ratings, and orders? This action cannot be undone.`)) {
      return;
    }
    
    try {
      await api.delete(`/admin/stores/${id}`);
      navigate('/admin/stores');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete store.');
    }
  };

  return (
    <div className="app-layout">
      <Sidebar />
      <main className="main-content">
        <div className="page-container">
          <div className="page-header">
            <div>
              <button
                className="btn btn-secondary btn-sm"
                onClick={() => navigate('/admin/stores')}
                style={{ marginBottom: 12 }}
              >
                ← Back to Stores
              </button>
              <h1 className="page-title">Store Details</h1>
              <p className="page-subtitle">Viewing complete details for store #{id}</p>
            </div>
            {store && (
              <button className="btn" style={{ backgroundColor: 'var(--danger-color)', color: 'white', borderColor: 'transparent' }} onClick={handleDelete}>
                🗑️ Delete Store
              </button>
            )}
          </div>

          {error && <div className="alert alert-error">⚠️ {error}</div>}

          {loading ? (
            <div className="loading-center"><div className="spinner" /></div>
          ) : store ? (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 24, maxWidth: 800 }}>
              
              <div className="card">
                <div className="card-header">
                  <span className="card-title">🏪 Primary Information</span>
                </div>
                <div className="detail-grid">
                  <div className="detail-field">
                    <div className="field-label">Shop Name</div>
                    <div className="field-value">{store.name}</div>
                  </div>
                  <div className="detail-field">
                    <div className="field-label">Shop Type</div>
                    <div className="field-value" style={{ fontWeight: 600, color: 'var(--secondary-color)' }}>
                      {store.shopType || 'Not specified'}
                    </div>
                  </div>
                  <div className="detail-field">
                    <div className="field-label">Email Address</div>
                    <div className="field-value">{store.email}</div>
                  </div>
                  <div className="detail-field">
                    <div className="field-label">Average Rating</div>
                    <div className="field-value" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <Stars value={store.avgRating} /> 
                      <span className="rating-number">{store.avgRating > 0 ? store.avgRating.toFixed(1) : 'No ratings'}</span>
                      <span style={{ fontSize: '0.85em', color: 'var(--text-muted)' }}>({store.ratingCount} reviews)</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="card">
                <div className="card-header">
                  <span className="card-title">📍 Location Details</span>
                </div>
                <div className="detail-grid">
                  <div className="detail-field">
                    <div className="field-label">State</div>
                    <div className="field-value">{store.state || '—'}</div>
                  </div>
                  <div className="detail-field">
                    <div className="field-label">City</div>
                    <div className="field-value">{store.city || '—'}</div>
                  </div>
                  <div className="detail-field">
                    <div className="field-label">Village</div>
                    <div className="field-value">{store.village || '—'}</div>
                  </div>
                  <div className="detail-field">
                    <div className="field-label">Pincode</div>
                    <div className="field-value">{store.pincode || '—'}</div>
                  </div>
                  <div className="detail-field">
                    <div className="field-label">Shop No / Area</div>
                    <div className="field-value">{store.shopNo || '—'}</div>
                  </div>
                  <div className="detail-field" style={{ gridColumn: '1/-1' }}>
                    <div className="field-label">Full Address (Legacy)</div>
                    <div className="field-value" style={{ fontStyle: 'italic', color: 'var(--text-secondary)' }}>
                      {store.address || '—'}
                    </div>
                  </div>
                </div>
              </div>

              <div className="card">
                <div className="card-header">
                  <span className="card-title">👤 Owner Details</span>
                </div>
                {store.owner ? (
                  <div className="detail-grid">
                    <div className="detail-field">
                      <div className="field-label">Owner Name</div>
                      <div className="field-value">{store.owner.name}</div>
                    </div>
                    <div className="detail-field">
                      <div className="field-label">Owner Email</div>
                      <div className="field-value">{store.owner.email}</div>
                    </div>
                  </div>
                ) : (
                  <p style={{ color: 'var(--text-muted)' }}>This store currently has no associated owner.</p>
                )}
              </div>

            </div>
          ) : null}
        </div>
      </main>
    </div>
  );
};

export default AdminStoreDetail;
