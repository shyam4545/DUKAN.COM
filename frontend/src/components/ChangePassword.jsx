import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import api from '../api/client';

const passwordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(16, 'Password must be at most 16 characters')
    .regex(/[A-Z]/, 'Must contain at least one uppercase letter')
    .regex(/[^A-Za-z0-9]/, 'Must contain at least one special character'),
  confirmPassword: z.string(),
}).refine((d) => d.newPassword === d.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

const ChangePassword = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [pwError, setPwError] = useState('');
  const [pwSuccess, setPwSuccess] = useState('');
  const [pwLoading, setPwLoading] = useState(false);

  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: zodResolver(passwordSchema),
  });

  const onPasswordSubmit = async (formData) => {
    setPwLoading(true);
    setPwError('');
    setPwSuccess('');
    try {
      await api.put('/auth/password', {
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword,
      });
      setPwSuccess('Password updated successfully!');
      reset();
    } catch (err) {
      setPwError(err.response?.data?.message || 'Failed to update password.');
    } finally {
      setPwLoading(false);
    }
  };

  if (!isOpen) {
    return (
      <div className="card" style={{ marginTop: 24 }}>
        <div className="card-header" style={{ borderBottom: 'none', paddingBottom: 0 }}>
          <span className="card-title">Security</span>
          <button className="btn btn-secondary" onClick={() => setIsOpen(true)}>
            Change Password
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="card" style={{ marginTop: 24, maxWidth: 500 }}>
      <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span className="card-title">🔑 Change Password</span>
        <button className="btn btn-secondary" onClick={() => setIsOpen(false)} style={{ padding: '4px 12px', fontSize: '0.85rem' }}>
          Cancel
        </button>
      </div>

      {pwError && <div className="alert alert-error">⚠️ {pwError}</div>}
      {pwSuccess && <div className="alert alert-success">✅ {pwSuccess}</div>}

      <form onSubmit={handleSubmit(onPasswordSubmit)} noValidate>
        <div className="form-group">
          <label htmlFor="current-pw">Current Password</label>
          <input
            id="current-pw"
            type="password"
            className={`form-control ${errors.currentPassword ? 'error' : ''}`}
            placeholder="Your current password"
            {...register('currentPassword')}
          />
          {errors.currentPassword && <div className="form-error">⚠️ {errors.currentPassword.message}</div>}
        </div>

        <div className="form-group">
          <label htmlFor="new-pw">New Password</label>
          <input
            id="new-pw"
            type="password"
            className={`form-control ${errors.newPassword ? 'error' : ''}`}
            placeholder="8–16 chars, uppercase + special char"
            {...register('newPassword')}
          />
          {errors.newPassword ? (
            <div className="form-error">⚠️ {errors.newPassword.message}</div>
          ) : (
            <div className="form-hint">8–16 chars, at least 1 uppercase and 1 special character</div>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="confirm-pw">Confirm New Password</label>
          <input
            id="confirm-pw"
            type="password"
            className={`form-control ${errors.confirmPassword ? 'error' : ''}`}
            placeholder="Repeat new password"
            {...register('confirmPassword')}
          />
          {errors.confirmPassword && <div className="form-error">⚠️ {errors.confirmPassword.message}</div>}
        </div>

        <button
          id="pw-submit"
          type="submit"
          className="btn btn-primary"
          disabled={pwLoading}
        >
          {pwLoading ? 'Updating...' : '🔐 Update Password'}
        </button>
      </form>
    </div>
  );
};

export default ChangePassword;
