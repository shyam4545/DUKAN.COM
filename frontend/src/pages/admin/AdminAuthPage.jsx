import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/client';
import { ShieldCheck } from 'lucide-react';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

const AdminAuthPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(loginSchema)
  });

  const onSubmit = async (data) => {
    setLoading(true);
    setServerError('');
    try {
      const res = await api.post('/auth/login', data);
      if (res.data.user.role !== 'ADMIN') {
        return setServerError('Access denied. Administrator privileges required.');
      }
      login(res.data.token, res.data.user);
      navigate('/admin/dashboard');
    } catch (err) {
      setServerError(err.response?.data?.message || 'Authentication failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page bg-[#0f172a]">
      <div className="auth-card" style={{ borderColor: 'rgba(255, 255, 255, 0.1)', borderWidth: '1px' }}>
        <div className="auth-logo">
          <div className="bg-slate-800 p-4 rounded-full mb-2 inline-block">
            <ShieldCheck className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-white">Admin Portal</h1>
          <p>System Administrator Access Only</p>
        </div>

        {serverError && <div className="alert alert-error">{serverError}</div>}

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
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

          <button type="submit" className="btn btn-full btn-lg bg-white text-black hover:bg-gray-200 mt-2 font-bold" disabled={loading}>
            {loading ? 'Authenticating...' : 'Secure Login →'}
          </button>
        </form>

        <div className="text-center mt-6">
          <Link to="/" className="text-sm text-[var(--text-muted)] hover:text-white">← Return to Public Site</Link>
        </div>
      </div>
    </div>
  );
};

export default AdminAuthPage;
