import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import Stars from '../../components/Stars';
import api from '../../api/client';

const roleBadge = (role) => {
  const map = {
    ADMIN: ['badge-admin', '🛡️ Administrator'],
    USER: ['badge-user', '👤 Normal User'],
    STORE_OWNER: ['badge-owner', '🏪 Store Owner'],
  };
  const [cls, label] = map[role] || ['badge-user', role];
  return <span className={`badge ${cls}`}>{label}</span>;
};

const AdminUserDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api
      .get(`/admin/users/${id}`)
      .then((res) => setUser(res.data.user))
      .finally(() => setLoading(false));
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm(`Are you sure you want to permanently delete "${user.name}" and all associated data (feedbacks, orders, ratings, and their store)? This action cannot be undone.`)) {
      return;
    }
    
    try {
      await api.delete(`/admin/users/${id}`);
      navigate('/admin/users');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete user.');
    }
  };

  return (
    <div className="app-layout">
      <Sidebar />
      <main className="main-content">
        <div className="page-container">
          <div className="page-header">
            <div>
              <h1 className="page-title">User Details</h1>
              <p className="page-subtitle">Viewing profile information</p>
            </div>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button className="btn btn-secondary" onClick={() => navigate('/admin/users')}>
                ← Back to Users
              </button>
              {user && user.role !== 'ADMIN' && (
                <button className="btn" style={{ backgroundColor: 'var(--danger-color)', color: 'white', borderColor: 'transparent' }} onClick={handleDelete}>
                  🗑️ Delete User
                </button>
              )}
            </div>
          </div>

          {error && <div className="alert alert-error">⚠️ {error}</div>}

          {loading ? (
            <div className="loading-center"><div className="spinner" /></div>
          ) : user ? (
            <div className="card">
              <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 32, paddingBottom: 24, borderBottom: '1px solid var(--border-subtle)' }}>
                <div style={{
                  width: 72, height: 72, borderRadius: '50%',
                  background: 'var(--accent-gradient)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 32, flexShrink: 0,
                }}>
                  {user.role === 'ADMIN' ? '🛡️' : user.role === 'STORE_OWNER' ? '🏪' : '👤'}
                </div>
                <div>
                  <div style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                    {user.name}
                  </div>
                  <div style={{ marginTop: 6 }}>{roleBadge(user.role)}</div>
                </div>
              </div>

              <div className="detail-grid">
                <div className="detail-field">
                  <div className="field-label">Email</div>
                  <div className="field-value">{user.email}</div>
                </div>
                <div className="detail-field">
                  <div className="field-label">Role</div>
                  <div className="field-value">{roleBadge(user.role)}</div>
                </div>
                <div className="detail-field" style={{ gridColumn: '1 / -1' }}>
                  <div className="field-label">Address</div>
                  <div className="field-value">{user.address}</div>
                </div>
                <div className="detail-field">
                  <div className="field-label">Member Since</div>
                  <div className="field-value">
                    {new Date(user.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric', month: 'long', day: 'numeric',
                    })}
                  </div>
                </div>
              </div>

              {/* Store Owner section */}
              {user.role === 'STORE_OWNER' && (
                <div style={{
                  marginTop: 24, padding: 20,
                  background: 'rgba(99,102,241,0.06)',
                  border: '1px solid rgba(99,102,241,0.15)',
                  borderRadius: 'var(--radius-md)',
                }}>
                  <div style={{ fontWeight: 600, fontSize: '1rem', marginBottom: 16, color: 'var(--text-primary)' }}>
                    🏪 Store Information
                  </div>
                  {user.store ? (
                    <div className="detail-grid">
                      <div className="detail-field">
                        <div className="field-label">Store Name</div>
                        <div className="field-value">{user.store.name}</div>
                      </div>
                      <div className="detail-field">
                        <div className="field-label">Average Rating</div>
                        <div className="field-value" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <Stars value={user.store.avgRating ?? 0} />
                          <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                            ({user.store.avgRating ?? 0} / 5)
                          </span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <p style={{ color: 'var(--text-muted)' }}>No store assigned to this owner yet.</p>
                  )}
                </div>
              )}

              {/* Feedbacks Section */}
              <div style={{
                marginTop: 24, padding: 20,
                background: 'rgba(0,0,0,0.02)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-md)',
              }}>
                <div style={{ fontWeight: 600, fontSize: '1rem', marginBottom: 16, color: 'var(--text-primary)' }}>
                  📝 User Feedback
                </div>
                {user.feedbacks && user.feedbacks.length > 0 ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {user.feedbacks.map(fb => (
                      <div key={fb.id} style={{
                        padding: 16,
                        background: 'white',
                        border: '1px solid var(--border-subtle)',
                        borderRadius: 'var(--radius-sm)'
                      }}>
                        <p style={{ margin: 0, color: 'var(--text-primary)', lineHeight: 1.5 }}>
                          "{fb.text}"
                        </p>
                        <div style={{ marginTop: 8, fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                          Submitted on {new Date(fb.createdAt).toLocaleDateString()} at {new Date(fb.createdAt).toLocaleTimeString()}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p style={{ color: 'var(--text-muted)' }}>This user has not submitted any feedback.</p>
                )}
              </div>
            </div>
          ) : null}
        </div>
      </main>
    </div>
  );
};

export default AdminUserDetail;
