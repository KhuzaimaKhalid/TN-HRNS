// pages/dashboard.js
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { applicationAPI } from '@/services/api';
import Layout from '@/components/Layout';
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
        // If response has data, use it; otherwise fallback
        if (response && response.data) {
          setData(response.data);
        } else {
          setData(fallbackData);
        }
      } catch (err) {
        console.error('Dashboard API error:', err);
        setError('Unable to load dashboard data. Showing sample data.');
        setData(fallbackData); // fallback on error
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <Layout><div style={{ padding: '60px 0' }}><Spinner /></div></Layout>;

  // Use fallback if data is still null
  const info = data || fallbackData;

  return (
    <Layout>
      <div className="dashboard-page">
        <div className="container">
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

          <div className="dashboard-header" style={{ background: 'rgba(255,255,255,0.7)', borderRadius: '16px', padding: '24px', backdropFilter: 'blur(4px)' }}>
            <div>
              <h1 className="dashboard-welcome" style={{ color: 'var(--text-primary)' }}>
                Welcome back, {info.name ?? 'there'}! 😊
              </h1>
              <p className="dashboard-subtitle" style={{ color: 'var(--text-dark)' }}>Here's what's happening with your applications.</p>
            </div>
            <div className="dashboard-actions">
              <button className="btn btn-primary" onClick={() => router.push('/apply')}><i className="fas fa-plus"></i> New Application</button>
              <button className="btn btn-ghost" onClick={() => router.push('/track')}><i className="fas fa-search"></i> Track Status</button>
            </div>
          </div>

          <div className="dashboard-stats">
            <div className="stat-card"><div className="stat-icon" style={{ background: 'var(--bg-light)' }}><i className="fas fa-file-alt"></i></div><div><div className="stat-number">{info.stats?.total ?? 0}</div><div className="stat-label">Total Applications</div></div></div>
            <div className="stat-card"><div className="stat-icon" style={{ background: '#0ED1CD' }}><i className="fas fa-clock"></i></div><div><div className="stat-number">{info.stats?.inProgress ?? 0}</div><div className="stat-label">In Progress</div></div></div>
            <div className="stat-card"><div className="stat-icon" style={{ background: '#25625D' }}><i className="fas fa-check-circle"></i></div><div><div className="stat-number">{info.stats?.selected ?? 0}</div><div className="stat-label">Selected</div></div></div>
            <div className="stat-card"><div className="stat-icon" style={{ background: '#76777D' }}><i className="fas fa-times-circle"></i></div><div><div className="stat-number">{info.stats?.rejected ?? 0}</div><div className="stat-label">Rejected</div></div></div>
          </div>

          <div className="dashboard-grid">
            <div className="dashboard-left">
              <div className="dashboard-card">
                <h3><i className="fas fa-chart-line" style={{ marginRight: '8px', color: 'var(--primary)' }}></i>Application Status</h3>
                <div className="status-item"><span className="status-label">Position</span><span className="status-value">{info.status?.position ?? 'N/A'}</span></div>
                <div className="status-item"><span className="status-label">Applied on</span><span className="status-value">{info.status?.appliedDate ?? 'N/A'}</span></div>
                <div className="status-item"><span className="status-label">Current Status</span><Badge status={info.status?.current ?? 'N/A'} /></div>
                <button className="btn btn-primary" style={{ width: '100%', marginTop: '12px' }} onClick={() => router.push('/track')}>View Full Status</button>
              </div>
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
            <div className="dashboard-right">
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
    </Layout>
  );
}