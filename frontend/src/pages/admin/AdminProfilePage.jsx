import { useAuth } from '../../context/AuthContext';
import Sidebar from '../../components/Sidebar';
import ChangePassword from '../../components/ChangePassword';

const AdminProfilePage = () => {
  const { user } = useAuth();

  return (
    <div className="app-layout">
      <Sidebar />
      <main className="main-content">
        <div className="page-container">
          <div className="page-header">
            <div>
              <h1 className="page-title">Admin Profile</h1>
              <p className="page-subtitle">Manage your admin account settings</p>
            </div>
          </div>

          <div style={{ maxWidth: 800 }}>
            <div className="card">
              <div className="card-header">
                <span className="card-title">👤 Account Info</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div className="detail-field">
                  <div className="field-label">Admin Name</div>
                  <div className="field-value">{user?.name}</div>
                </div>
                <div className="detail-field">
                  <div className="field-label">Email</div>
                  <div className="field-value">{user?.email}</div>
                </div>
              </div>
            </div>

            <ChangePassword />
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminProfilePage;
