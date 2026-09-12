import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/client';
import { ShoppingBag } from 'lucide-react';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

const registerSchema = z.object({
  name: z.string().min(1, 'Name is required').max(20, 'Name must be at most 20 characters'),
  email: z.string().email('Invalid email address'),
  address: z.string().max(400, 'Address must be at most 400 characters').min(1, 'Address is required'),
  password: z.string().min(8, 'Password must be at least 8 characters').max(16, 'Password must be at most 16 characters').regex(/[A-Z]/, 'Password must contain at least one uppercase letter').regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character'),
});

const UserAuthPage = () => {
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
        if (res.data.user.role !== 'USER') {
          return setServerError('Access denied. This portal is for Shoppers only.');
        }
        login(res.data.token, res.data.user);
        navigate('/user/stores');
      } else {
        await api.post('/auth/register', { ...data, role: 'USER' });
        setIsLogin(true); // Switch to login after successful register
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
      <div className="auth-card">
        <div className="auth-logo">
          <div className="bg-[rgba(var(--primary-rgb),0.1)] p-4 rounded-full mb-2 inline-block">
            <ShoppingBag className="w-8 h-8 text-[var(--primary-color)]" />
          </div>
          <h1>{isLogin ? 'Shopper Login' : 'Shopper Registration'}</h1>
          <p>{isLogin ? 'Sign in to start shopping' : 'Create an account to order from local stores'}</p>
        </div>

        {serverError && <div className={`alert ${serverError.includes('successful') ? 'alert-success' : 'alert-error'}`}>{serverError}</div>}

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          {!isLogin && (
            <>
              <div className="form-group">
                <label>Full Name</label>
                <input type="text" className={`form-control ${errors.name ? 'error' : ''}`} {...register('name')} />
                {errors.name && <div className="form-error">⚠️ {errors.name.message}</div>}
              </div>
              <div className="form-group">
                <label>Address</label>
                <textarea className={`form-control ${errors.address ? 'error' : ''}`} rows="2" {...register('address')}></textarea>
                {errors.address && <div className="form-error">⚠️ {errors.address.message}</div>}
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

          <button type="submit" className="btn btn-primary btn-full btn-lg" disabled={loading} style={{ marginTop: 8 }}>
            {loading ? 'Processing...' : (isLogin ? 'Sign In →' : 'Register →')}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: 24, color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button onClick={toggleMode} style={{ color: 'var(--primary-color)', fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer' }}>
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

export default UserAuthPage;
