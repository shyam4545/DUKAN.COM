import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import Logo from './components/Logo';

// Auth & Public Pages
import LandingPage from './pages/LandingPage';
import UserAuthPage from './pages/user/UserAuthPage';
import OwnerAuthPage from './pages/owner/OwnerAuthPage';
import AdminAuthPage from './pages/admin/AdminAuthPage';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminUsersPage from './pages/admin/AdminUsersPage';
import AdminAddUserPage from './pages/admin/AdminAddUserPage';
import AdminUserDetail from './pages/admin/AdminUserDetail';
import AdminStoresPage from './pages/admin/AdminStoresPage';
import AdminAddStorePage from './pages/admin/AdminAddStorePage';
import AdminStoreDetail from './pages/admin/AdminStoreDetail';
import AdminProfilePage from './pages/admin/AdminProfilePage';

// Normal User Pages
import UserStoresPage from './pages/user/UserStoresPage';
import UserStoreDetailsPage from './pages/user/UserStoreDetailsPage';
import UserCartPage from './pages/user/UserCartPage';
import UserOrdersPage from './pages/user/UserOrdersPage';
import UserProfilePage from './pages/user/UserProfilePage';

// Store Owner Pages
import OwnerDashboard from './pages/owner/OwnerDashboard';
import OwnerProductsPage from './pages/owner/OwnerProductsPage';
import OwnerOrdersPage from './pages/owner/OwnerOrdersPage';
import OwnerProfilePage from './pages/owner/OwnerProfilePage';

// Smart root redirect based on role
const RootRedirect = () => {
  const { isAuthenticated, user } = useAuth();
  if (!isAuthenticated) return <LandingPage />;
  if (user?.role === 'ADMIN') return <Navigate to="/admin/dashboard" replace />;
  if (user?.role === 'STORE_OWNER') return <Navigate to="/owner/dashboard" replace />;
  return <Navigate to="/user/stores" replace />;
};

const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <div style={{ position: 'fixed', top: '24px', right: '32px', zIndex: 9999 }}>
          <Logo />
        </div>
        <Routes>
          {/* Root */}
          <Route path="/" element={<RootRedirect />} />

          {/* Public */}
          <Route path="/user/auth" element={<UserAuthPage />} />
          <Route path="/owner/auth" element={<OwnerAuthPage />} />
          <Route path="/admin/login" element={<AdminAuthPage />} />

          {/* Admin */}
          <Route
            path="/admin/dashboard"
            element={<PrivateRoute role="ADMIN"><AdminDashboard /></PrivateRoute>}
          />
          <Route
            path="/admin/users"
            element={<PrivateRoute role="ADMIN"><AdminUsersPage /></PrivateRoute>}
          />
          <Route
            path="/admin/users/new"
            element={<PrivateRoute role="ADMIN"><AdminAddUserPage /></PrivateRoute>}
          />
          <Route
            path="/admin/users/:id"
            element={<PrivateRoute role="ADMIN"><AdminUserDetail /></PrivateRoute>}
          />
          <Route
            path="/admin/stores"
            element={<PrivateRoute role="ADMIN"><AdminStoresPage /></PrivateRoute>}
          />
          <Route
            path="/admin/stores/new"
            element={<PrivateRoute role="ADMIN"><AdminAddStorePage /></PrivateRoute>}
          />
          <Route
            path="/admin/stores/:id"
            element={<PrivateRoute role="ADMIN"><AdminStoreDetail /></PrivateRoute>}
          />
          <Route
            path="/admin/profile"
            element={<PrivateRoute role="ADMIN"><AdminProfilePage /></PrivateRoute>}
          />

          {/* Normal User */}
          <Route
            path="/user/stores"
            element={<PrivateRoute role="USER"><UserStoresPage /></PrivateRoute>}
          />
          <Route
            path="/user/store/:id"
            element={<PrivateRoute role="USER"><UserStoreDetailsPage /></PrivateRoute>}
          />
          <Route
            path="/user/cart"
            element={<PrivateRoute role="USER"><UserCartPage /></PrivateRoute>}
          />
          <Route
            path="/user/orders"
            element={<PrivateRoute role="USER"><UserOrdersPage /></PrivateRoute>}
          />
          <Route
            path="/user/profile"
            element={<PrivateRoute role="USER"><UserProfilePage /></PrivateRoute>}
          />

          {/* Store Owner */}
          <Route
            path="/owner/dashboard"
            element={<PrivateRoute role="STORE_OWNER"><OwnerDashboard /></PrivateRoute>}
          />
          <Route
            path="/owner/products"
            element={<PrivateRoute role="STORE_OWNER"><OwnerProductsPage /></PrivateRoute>}
          />
          <Route
            path="/owner/orders"
            element={<PrivateRoute role="STORE_OWNER"><OwnerOrdersPage /></PrivateRoute>}
          />
          <Route
            path="/owner/profile"
            element={<PrivateRoute role="STORE_OWNER"><OwnerProfilePage /></PrivateRoute>}
          />

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
