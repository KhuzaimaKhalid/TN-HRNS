// pages/dashboard.js
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { applicationAPI } from '@/services/api';
import Spinner from '@/components/common/Spinner';
import Badge from '@/components/common/Badge';

// Fallback mock data (used if API fails or returns empty)
const fallbackData = {
  stats: { total: 3, inProgress: 1, selected: 0, rejected: 0 },
  status: {
    position: 'AI Engineer Intern',
    appliedDate: '2nd June 2026',
    current: 'Interview'
  },
  interview: {
    date: '18 Jun 2026',
    day: 'Tuesday',
    time: '04 - 08 pm'
  },
  notifications: [
    { id: 1, message: 'Your application has been shortlisted', date: '2 days ago', read: false },
    { id: 2, message: 'Interview scheduled for 18 June', date: '3 days ago', read: false },
  ]
};

export default function Dashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await applicationAPI.getAll();
        if (response && response.data) {
          setData(response.data);
        } else {
          setData(fallbackData);
        }
      } catch (err) {
        console.error('Dashboard API error:', err);
        setError('Unable to load dashboard data. Showing sample data.');
        setData(fallbackData);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return (
    <div style={{ minHeight: '100vh', background: '#effbfb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Spinner />
    </div>
  );

  const info = data || fallbackData;

  return (
    <div style={{
      minHeight: '100vh',
      background: '#effbfb',
      padding: '32px 24px',
      overflowY: 'auto', // ✅ allows vertical scroll
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Error banner if any */}
        {error && (
          <div style={{
            background: '#fff3cd',
            color: '#856404',
            padding: '12px 20px',
            borderRadius: '12px',
            marginBottom: '20px',
            textAlign: 'center'
          }}>
            <i className="fas fa-exclamation-triangle" style={{ marginRight: '8px' }}></i>
            {error}
          </div>
        )}

        {/* Header */}
        <div style={{
          background: 'rgba(255,255,255,0.7)',
          backdropFilter: 'blur(4px)',
          borderRadius: '16px',
          padding: '24px',
          marginBottom: '32px',
          border: '1px solid rgba(255,255,255,0.3)',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <h1 style={{ fontSize: '2rem', fontWeight: 700, color: '#1A1A1A', marginBottom: '2px' }}>
                Welcome back, {info.name ?? 'there'}! 😊
              </h1>
              <p style={{ fontSize: '1rem', color: '#76777D' }}>
                Here's what's happening with your applications.
              </p>
            </div>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <button className="btn btn-primary" onClick={() => router.push('/apply')}>
                <i className="fas fa-plus" style={{ marginRight: '6px' }}></i> New Application
              </button>
              <button className="btn btn-ghost" onClick={() => router.push('/track')}>
                <i className="fas fa-search" style={{ marginRight: '6px' }}></i> Track Status
              </button>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '16px',
          marginBottom: '32px',
        }}>
          <div className="stat-card"><div className="stat-icon" style={{ background: 'var(--bg-light)' }}><i className="fas fa-file-alt"></i></div><div><div className="stat-number">{info.stats?.total ?? 0}</div><div className="stat-label">Total Applications</div></div></div>
          <div className="stat-card"><div className="stat-icon" style={{ background: '#0ED1CD' }}><i className="fas fa-clock"></i></div><div><div className="stat-number">{info.stats?.inProgress ?? 0}</div><div className="stat-label">In Progress</div></div></div>
          <div className="stat-card"><div className="stat-icon" style={{ background: '#25625D' }}><i className="fas fa-check-circle"></i></div><div><div className="stat-number">{info.stats?.selected ?? 0}</div><div className="stat-label">Selected</div></div></div>
          <div className="stat-card"><div className="stat-icon" style={{ background: '#76777D' }}><i className="fas fa-times-circle"></i></div><div><div className="stat-number">{info.stats?.rejected ?? 0}</div><div className="stat-label">Rejected</div></div></div>
        </div>

        {/* Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '24px',
        }}>
          {/* Left */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Application Status */}
            <div className="dashboard-card">
              <h3><i className="fas fa-chart-line" style={{ marginRight: '8px', color: 'var(--primary)' }}></i>Application Status</h3>
              <div className="status-item"><span className="status-label">Position</span><span className="status-value">{info.status?.position ?? 'N/A'}</span></div>
              <div className="status-item"><span className="status-label">Applied on</span><span className="status-value">{info.status?.appliedDate ?? 'N/A'}</span></div>
              <div className="status-item"><span className="status-label">Current Status</span><Badge status={info.status?.current ?? 'N/A'} /></div>
              <button className="btn btn-primary" style={{ width: '100%', marginTop: '12px' }} onClick={() => router.push('/track')}>View Full Status</button>
            </div>

            {/* Upcoming Interview */}
            <div className="dashboard-card interview-card">
              <h3><i className="fas fa-video" style={{ marginRight: '8px', color: 'var(--primary)' }}></i>Upcoming Interview</h3>
              <div className="interview-details">
                <div><strong>Date:</strong> {info.interview?.date ?? 'TBD'}</div>
                <div><strong>Day:</strong> {info.interview?.day ?? 'TBD'}</div>
                <div><strong>Time:</strong> {info.interview?.time ?? 'TBD'}</div>
              </div>
              <button className="btn btn-dark" style={{ width: '100%', marginTop: '8px' }}><i className="fas fa-external-link-alt"></i> Join Interview</button>
            </div>
          </div>

          {/* Right */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Notifications */}
            <div className="dashboard-card">
              <h3><i className="fas fa-bell"></i> Notifications</h3>
              <ul className="notification-list">
                {(info.notifications || []).map((n) => (
                  <li key={n.id} className={`notification-item ${n.read ? 'read' : 'unread'}`}>
                    <div className="notification-dot"></div>
                    <div className="notification-content"><p className="notification-message">{n.message}</p><span className="notification-date">{n.date}</span></div>
                  </li>
                ))}
                {(!info.notifications || info.notifications.length === 0) && (
                  <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '12px 0' }}>No notifications</p>
                )}
              </ul>
              <button className="btn btn-ghost" style={{ width: '100%', marginTop: '8px' }}>View All</button>
            </div>

            {/* Quick Actions */}
            <div className="dashboard-card">
              <h3><i className="fas fa-rocket"></i> Quick Actions</h3>
              <div className="quick-actions">
                <button className="btn btn-primary" style={{ flex: 1 }} onClick={() => router.push('/apply')}><i className="fas fa-file-alt"></i> Apply Now</button>
                <button className="btn btn-dark" style={{ flex: 1 }} onClick={() => router.push('/track')}><i className="fas fa-search"></i> Track</button>
              </div>
              <button className="btn btn-ghost" style={{ width: '100%', marginTop: '8px' }}><i className="fas fa-user-edit"></i> Edit Profile</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}