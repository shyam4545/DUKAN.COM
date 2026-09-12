import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const adminLinks = [
  { to: '/admin/dashboard', icon: '📊', label: 'Dashboard' },
  { to: '/admin/users', icon: '👥', label: 'Users' },
  { to: '/admin/stores', icon: '🏪', label: 'Stores' },
  { to: '/admin/profile', icon: '👤', label: 'Profile' },
];

const userLinks = [
  { to: '/user/stores', icon: '🏪', label: 'Browse Stores' },
  { to: '/user/cart', icon: '🛒', label: 'My Cart' },
  { to: '/user/orders', icon: '📦', label: 'My Orders' },
  { to: '/user/profile', icon: '👤', label: 'Profile' },
];

const ownerLinks = [
  { to: '/owner/dashboard', icon: '📈', label: 'Dashboard' },
  { to: '/owner/products', icon: '🛍️', label: 'Products' },
  { to: '/owner/orders', icon: '📦', label: 'Orders' },
  { to: '/owner/profile', icon: '👤', label: 'Profile' },
];

const Sidebar = () => {
  const { user, logout, isAdmin, isUser, isOwner } = useAuth();
  const navigate = useNavigate();

  const links = isAdmin ? adminLinks : isUser ? userLinks : ownerLinks;
  const roleLabel = isAdmin ? 'Administrator' : isOwner ? 'Store Owner' : 'User';

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-logo p-4 text-center">
        <img src="/logo.png" alt="Dukan.com" className="h-10 mx-auto" onError={(e) => { e.target.style.display = 'none'; }} />
        <span className="logo-text ml-2 font-bold text-xl">Dukan.com</span>
      </div>

      <div className="sidebar-user">
        <div className="user-name">{user?.name}</div>
        <div className="user-role">{roleLabel}</div>
      </div>

      <nav className="sidebar-nav">
        <div className="nav-section-label">Navigation</div>
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
          >
            <span className="nav-icon">{link.icon}</span>
            {link.label}
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">
        <button className="nav-item" onClick={handleLogout} id="logout-btn">
          <span className="nav-icon">🚪</span>
          Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
