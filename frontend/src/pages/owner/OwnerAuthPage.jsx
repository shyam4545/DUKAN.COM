import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/client';
import { Store } from 'lucide-react';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

const registerSchema = z.object({
  name: z.string().min(1, 'Owner name is required').max(20, 'Name must be at most 20 characters'),
  shopName: z.string().min(1, 'Shop name is required'),
  shopType: z.string().min(1, 'Shop type is required'),
  state: z.string().min(1, 'State is required'),
  city: z.string().min(1, 'City is required'),
  village: z.string().optional(),
  pincode: z.string().min(1, 'Pincode is required'),
  shopNo: z.string().min(1, 'Shop No is required'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters').max(16, 'Password must be at most 16 characters').regex(/[A-Z]/, 'Password must contain at least one uppercase letter').regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character'),
});

const OwnerAuthPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: zodResolver(isLogin ? loginSchema : registerSchema)
  });

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setServerError('');
    reset();
  };

  const onSubmit = async (data) => {
    setLoading(true);
    setServerError('');
    try {
      if (isLogin) {
        const res = await api.post('/auth/login', data);
        if (res.data.user.role !== 'STORE_OWNER') {
          return setServerError('Access denied. This portal is for Store Owners only.');
        }
        login(res.data.token, res.data.user);
        navigate('/owner/dashboard');
      } else {
        const address = `${data.shopNo}, ${data.village ? data.village + ', ' : ''}${data.city}, ${data.state} - ${data.pincode}`;
        await api.post('/auth/register', { ...data, address, role: 'STORE_OWNER' });
        setIsLogin(true);
        setServerError('Registration successful! Please sign in.');
      }
    } catch (err) {
      setServerError(err.response?.data?.message || 'Authentication failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card" style={{ borderColor: 'rgba(var(--secondary-rgb), 0.3)', borderWidth: '2px' }}>
        <div className="auth-logo">
          <div className="bg-[rgba(var(--secondary-rgb),0.1)] p-4 rounded-full mb-2 inline-block">
            <Store className="w-8 h-8 text-[var(--secondary-color)]" />
          </div>
          <h1 style={{ color: 'var(--secondary-color)' }}>{isLogin ? 'Owner Login' : 'Owner Registration'}</h1>
          <p>{isLogin ? 'Manage your Kirana store' : 'Take your store online today'}</p>
        </div>

        {serverError && <div className={`alert ${serverError.includes('successful') ? 'alert-success' : 'alert-error'}`}>{serverError}</div>}

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          {!isLogin && (
            <>
              <div className="form-group">
                <label>Owner Name</label>
                <input type="text" className={`form-control ${errors.name ? 'error' : ''}`} {...register('name')} />
                {errors.name && <div className="form-error">⚠️ {errors.name.message}</div>}
              </div>
              <div className="form-group">
                <label>Shop Name</label>
                <input type="text" className={`form-control ${errors.shopName ? 'error' : ''}`} {...register('shopName')} />
                {errors.shopName && <div className="form-error">⚠️ {errors.shopName.message}</div>}
              </div>
              <div className="form-group">
                <label>Shop Type</label>
                <select className={`form-control ${errors.shopType ? 'error' : ''}`} {...register('shopType')}>
                  <option value="">Select Shop Type</option>
                  <option value="Kirana">Kirana</option>
                  <option value="Stationery">Stationery</option>
                  <option value="Medical">Medical</option>
                  <option value="Electronics">Electronics</option>
                  <option value="Other">Other</option>
                </select>
                {errors.shopType && <div className="form-error">⚠️ {errors.shopType.message}</div>}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div className="form-group">
                  <label>State</label>
                  <input type="text" className={`form-control ${errors.state ? 'error' : ''}`} {...register('state')} />
                  {errors.state && <div className="form-error">⚠️ {errors.state.message}</div>}
                </div>
                <div className="form-group">
                  <label>City</label>
                  <input type="text" className={`form-control ${errors.city ? 'error' : ''}`} {...register('city')} />
                  {errors.city && <div className="form-error">⚠️ {errors.city.message}</div>}
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div className="form-group">
                  <label>Village (Optional)</label>
                  <input type="text" className={`form-control ${errors.village ? 'error' : ''}`} {...register('village')} />
                  {errors.village && <div className="form-error">⚠️ {errors.village.message}</div>}
                </div>
                <div className="form-group">
                  <label>Pincode</label>
                  <input type="text" className={`form-control ${errors.pincode ? 'error' : ''}`} {...register('pincode')} />
                  {errors.pincode && <div className="form-error">⚠️ {errors.pincode.message}</div>}
                </div>
              </div>

              <div className="form-group">
                <label>Shop No. / Area</label>
                <input type="text" className={`form-control ${errors.shopNo ? 'error' : ''}`} {...register('shopNo')} />
                {errors.shopNo && <div className="form-error">⚠️ {errors.shopNo.message}</div>}
              </div>
            </>
          )}

          <div className="form-group">
            <label>Email Address</label>
            <input type="email" className={`form-control ${errors.email ? 'error' : ''}`} {...register('email')} />
            {errors.email && <div className="form-error">⚠️ {errors.email.message}</div>}
          </div>

          <div className="form-group">
            <label>Password</label>
            <input type="password" className={`form-control ${errors.password ? 'error' : ''}`} {...register('password')} />
            {errors.password && <div className="form-error">⚠️ {errors.password.message}</div>}
          </div>

          <button type="submit" className="btn btn-secondary btn-full btn-lg" disabled={loading} style={{ marginTop: 8 }}>
            {loading ? 'Processing...' : (isLogin ? 'Sign In →' : 'Register →')}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: 24, color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          {isLogin ? "Don't have an owner account? " : "Already registered your store? "}
          <button onClick={toggleMode} style={{ color: 'var(--secondary-color)', fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer' }}>
            {isLogin ? 'Register here' : 'Sign in here'}
          </button>
        </p>
        <div className="text-center mt-4">
          <Link to="/" className="text-sm text-[var(--text-muted)] hover:text-white">← Back to Home</Link>
        </div>
      </div>
    </div>
  );
};

export default OwnerAuthPage;
