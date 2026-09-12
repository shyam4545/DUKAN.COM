import { useAuth } from '../../context/AuthContext';
import Sidebar from '../../components/Sidebar';
import ChangePassword from '../../components/ChangePassword';

const OwnerProfilePage = () => {
  const { user } = useAuth();

  return (
    <div className="app-layout">
      <Sidebar />
      <main className="main-content">
        <div className="page-container">
          <div className="page-header">
            <div>
              <h1 className="page-title">Store Owner Profile</h1>
              <p className="page-subtitle">Manage your store account settings</p>
            </div>
          </div>

          <div style={{ maxWidth: 800 }}>
            {/* Profile Info */}
            <div className="card">
              <div className="card-header">
                <span className="card-title">👤 Account Info</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div className="detail-field">
                  <div className="field-label">Owner Name</div>
                  <div className="field-value">{user?.name}</div>
                </div>
                <div className="detail-field">
                  <div className="field-label">Email</div>
                  <div className="field-value">{user?.email}</div>
                </div>
                <div className="detail-field">
                  <div className="field-label">Address</div>
                  <div className="field-value">{user?.address}</div>
                </div>
              </div>
            </div>

            {/* Change Password Component */}
            <ChangePassword />
          </div>
        </div>
      </main>
    </div>
  );
};

export default OwnerProfilePage;
