import React from 'react';
import { Link, Navigate } from 'react-router-dom';
import { ShoppingBag, Store, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const LandingPage = () => {
  const { isAuthenticated, user } = useAuth();
  
  if (isAuthenticated) {
    if (user?.role === 'ADMIN') return <Navigate to="/admin/dashboard" replace />;
    if (user?.role === 'STORE_OWNER') return <Navigate to="/owner/dashboard" replace />;
    return <Navigate to="/user/stores" replace />;
  }

  return (
    <div className="landing-page">
      <header className="landing-header">
        <div className="landing-logo">
          <img src="/logo.png" alt="Dukan.com Logo" onError={(e) => { e.target.style.display = 'none'; }} />
          <span>Dukan.com</span>
        </div>
      </header>

      <main className="landing-main">
        <div className="landing-hero">
          <h1 className="landing-title">India's Neighborhood Shopping App</h1>
          <p className="landing-subtitle">Transforming Retail with Smart Technology</p>
        </div>

        <div className="landing-cards">
          <div className="landing-card shopper-card">
            <div className="landing-card-icon">
              <ShoppingBag />
            </div>
            <h2>For Shoppers</h2>
            <p>Order fresh groceries from your trusted local Kirana stores. Fast delivery, quick & easy.</p>
            <Link to="/user/auth" className="btn btn-primary btn-full btn-lg">
              Start Shopping
            </Link>
          </div>

          <div className="landing-card owner-card">
            <div className="landing-card-icon">
              <Store />
            </div>
            <h2>For Store Owners</h2>
            <p>Take your Kirana online. Manage products, receive orders, and grow your local business.</p>
            <Link to="/owner/auth" className="btn btn-secondary btn-full btn-lg">
              Manage Store
            </Link>
          </div>
        </div>
      </main>

      <footer className="landing-footer">
        <Link to="/admin/login" className="admin-link">
          <ShieldCheck size={16} /> Admin Portal
        </Link>
      </footer>
    </div>
  );
};

export default LandingPage;
