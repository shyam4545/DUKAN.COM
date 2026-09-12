import { useEffect, useState } from 'react';
import Sidebar from '../../components/Sidebar';
import DataTable from '../../components/DataTable';
import Stars from '../../components/Stars';
import api from '../../api/client';
import { useAuth } from '../../context/AuthContext';


const OwnerDashboard = () => {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api
      .get('/owner/dashboard')
      .then((res) => setData(res.data))
      .catch(() => setError('Failed to load dashboard data.'))
      .finally(() => setLoading(false));
  }, []);


  const raterColumns = [
    {
      key: 'userName',
      header: 'Customer Name',
      render: (row) => (
        <span style={{ fontWeight: 500, color: 'var(--text-primary)' }}>{row.user?.name}</span>
      ),
    },
    {
      key: 'userEmail',
      header: 'Email',
      render: (row) => row.user?.email,
    },
    {
      key: 'value',
      header: 'Rating Given',
      render: (row) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Stars value={row.value} />
          <span className="rating-number">{row.value}/5</span>
        </div>
      ),
    },
    {
      key: 'ratedAt',
      header: 'Rated At',
      render: (row) =>
        new Date(row.ratedAt).toLocaleDateString('en-US', {
          year: 'numeric', month: 'short', day: 'numeric',
        }),
    },
  ];

  return (
    <div className="app-layout">
      <Sidebar />
      <main className="main-content">
        <div className="page-container">
          <div className="page-header">
            <div>
              <h1 className="page-title">Store Dashboard</h1>
              <p className="page-subtitle">Your store's performance overview</p>
            </div>
          </div>

          {error && <div className="alert alert-error">⚠️ {error}</div>}

          {loading ? (
            <div className="loading-center"><div className="spinner" /></div>
          ) : data ? (
            <>
              {/* Store Info + Avg Rating */}
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 24, marginBottom: 28 }}>
                <div className="card">
                  <div className="card-header">
                    <span className="card-title">🏪 Store Information</span>
                  </div>
                  <div className="detail-grid">
                    <div className="detail-field">
                      <div className="field-label">Store Name</div>
                      <div className="field-value">{data.store.name}</div>
                    </div>
                    <div className="detail-field">
                      <div className="field-label">Email</div>
                      <div className="field-value">{data.store.email}</div>
                    </div>
                    <div className="detail-field" style={{ gridColumn: '1/-1' }}>
                      <div className="field-label">Address</div>
                      <div className="field-value">{data.store.address}</div>
                    </div>
                  </div>
                </div>

                <div className="card" style={{ textAlign: 'center' }}>
                  <div className="card-header" style={{ justifyContent: 'center' }}>
                    <span className="card-title">⭐ Average Rating</span>
                  </div>
                  <div className="avg-rating-number">
                    {data.store.avgRating > 0 ? data.store.avgRating.toFixed(1) : '—'}
                  </div>
                  <div style={{ margin: '12px 0' }}>
                    <Stars value={data.store.avgRating} size="1.4rem" />
                  </div>
                  <div className="avg-rating-label">
                    Based on <strong>{data.store.totalRatings}</strong> rating{data.store.totalRatings !== 1 ? 's' : ''}
                  </div>
                </div>
              </div>

              {/* Raters Table */}
              <div className="card">
                <div className="card-header">
                  <span className="card-title">👥 Customer Ratings</span>
                </div>
                {data.raters.length === 0 ? (
                  <div className="empty-state">
                    <div className="empty-icon">⭐</div>
                    <p>No ratings yet. Encourage your customers to rate your store!</p>
                  </div>
                ) : (
                  <DataTable
                    data={data.raters}
                    columns={raterColumns}
                    globalFilterPlaceholder="Search customers..."
                  />
                )}
              </div>


            </>
          ) : null}
        </div>
      </main>
    </div>
  );
};

export default OwnerDashboard;
