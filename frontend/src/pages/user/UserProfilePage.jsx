import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import Sidebar from '../../components/Sidebar';
import ChangePassword from '../../components/ChangePassword';
import api from '../../api/client';

const UserProfilePage = () => {
  const { user } = useAuth();
  const [feedback, setFeedback] = useState('');
  const [feedbackStatus, setFeedbackStatus] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFeedbackSubmit = async (e) => {
    e.preventDefault();
    if (!feedback.trim()) return;
    
    setIsSubmitting(true);
    setFeedbackStatus('');
    try {
      await api.post('/user/feedback', { text: feedback });
      setFeedback('');
      setFeedbackStatus('✅ Feedback submitted successfully! Thank you.');
      setTimeout(() => setFeedbackStatus(''), 5000);
    } catch (err) {
      setFeedbackStatus('❌ Failed to submit feedback. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="app-layout">
      <Sidebar />
      <main className="main-content">
        <div className="page-container">
          <div className="page-header">
            <div>
              <h1 className="page-title">My Profile</h1>
              <p className="page-subtitle">Manage your account settings</p>
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
                  <div className="field-label">Name</div>
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

            {/* Submit Feedback Section */}
            <div className="card" style={{ marginTop: 24 }}>
              <div className="card-header">
                <span className="card-title">📝 Submit Feedback</span>
              </div>
              <div style={{ padding: '0 24px 24px' }}>
                <p style={{ color: 'var(--text-muted)', marginBottom: 16 }}>
                  Have thoughts, complaints, or suggestions? Send feedback directly to the administrator.
                </p>
                {feedbackStatus && (
                  <div style={{
                    padding: 12, marginBottom: 16, borderRadius: 'var(--radius-sm)',
                    background: feedbackStatus.includes('✅') ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                    color: feedbackStatus.includes('✅') ? 'var(--success-color)' : 'var(--danger-color)'
                  }}>
                    {feedbackStatus}
                  </div>
                )}
                <form onSubmit={handleFeedbackSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  <textarea
                    className="form-control"
                    rows="4"
                    placeholder="Write your feedback here..."
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    required
                  ></textarea>
                  <button type="submit" className="btn btn-primary" disabled={isSubmitting || !feedback.trim()}>
                    {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default UserProfilePage;
