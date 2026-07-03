// pages/track.js
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { applicationAPI } from '@/services/api';
import Footer from '@/components/Footer';
import Spinner from '@/components/common/Spinner';
import Badge from '@/components/common/Badge';

export default function Track() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [tracked, setTracked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [error, setError] = useState('');

// track.js
const handleTrack = async (e) => {
  e.preventDefault();
  if (!email) return;
  setLoading(true);
  setError('');
  try {
      const response = await applicationAPI.getStatusByEmail(email);
      setData(response.data);
      setTracked(true);
  } catch (err) {
      setError(err.message || 'Failed to fetch status');
  } finally {
      setLoading(false);
  }
};

  return (
    <div className="auth-page">
      <div className="auth-wrapper">
        <div className="auth-card track-card">
          <button className="auth-close" onClick={() => router.push('/')}><i className="fas fa-times"></i></button>
          <div className="track-header">
            <h1 className="auth-welcome" style={{ fontSize: '1.5rem' }}>Track your application</h1>
            <div className="track-actions">
              <button className="btn-apply" onClick={() => router.push('/apply')}>Apply now</button>
              <button className="btn-apply" style={{ background: 'var(--primary)', color: 'var(--white)' }}>Track application</button>
            </div>
          </div>
          <p className="auth-subtitle">Enter the email you applied with to track your application status.</p>

          <form onSubmit={handleTrack}>
            <div className="track-search">
              <input type="email" className="auth-input" placeholder="ayeshaharsh@gmail.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
              <button type="submit" className="btn btn-primary" style={{ borderRadius: '12px', padding: '13px 28px' }}>Track your application</button>
            </div>
          </form>

          {loading && <Spinner />}
          {error && <div className="error-message" style={{ textAlign: 'center' }}>{error}</div>}

          {tracked && data && (
            <div className="track-result">
              <div className="candidate-header">
                <div>
                  <div className="candidate-name">{data.name || 'Ayesha Khan'} - {data.position || 'AI Engineer'}</div>
                  <div className="applied-date"><i className="far fa-calendar-alt"></i> Applied on {data.appliedDate || '2nd June 2026'}</div>
                </div>
                <button className="btn-apply" style={{ background: 'transparent', border: '1px solid var(--border-color)' }} onClick={() => { setTracked(false); setData(null); }}><i className="fas fa-redo"></i> Reset</button>
              </div>

              {data.status === 'Interview Scheduled' && data.interview && (
                <div className="interview-info-card">
                  <h4><i className="fas fa-video"></i> Interview Information</h4>
                  <p><strong>Your interview is scheduled for</strong></p>
                  <div className="interview-details">
                    <div><strong>Date:</strong> {data.interview.date}</div>
                    <div><strong>Day:</strong> {data.interview.day}</div>
                    <div><strong>Time:</strong> {data.interview.time}</div>
                  </div>
                  <button className="interview-add-btn" onClick={() => router.push(`/interview?appId=${data.id}`)}>
                    <i className="fas fa-plus-circle"></i> View full interview details
                  </button>
                </div>
              )}

              <div className="timeline">
                {data.statuses && data.statuses.map((item, i) => (
                  <div key={i} className={`timeline-item ${i < data.statuses.length - 1 ? 'completed' : 'active'}`}>
                    <div className="tl-title">{item.stage}</div>
                    <div className="tl-date">{item.date || 'Pending'}</div>
                    <div className="tl-desc">{item.description}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}