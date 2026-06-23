import { useRouter } from 'next/router';

export default function Dashboard() {
  const router = useRouter();

  const applicationStatus = 'Interview';
  const appliedDate = '2nd June 2026';
  const interviewData = {
    date: '18 Jun 2026',
    day: 'Tuesday',
    time: '04 - 08 pm',
    meetLink: 'https://meet.google.com/abc-tgibc-nwl'
  };
  const notifications = [
    { id: 1, message: 'Your application has been shortlisted', date: '2 days ago', read: false },
    { id: 2, message: 'Interview scheduled for 18 June', date: '3 days ago', read: false },
    { id: 3, message: 'Welcome to Trust Nexus! Complete your profile', date: '1 week ago', read: true }
  ];

  return (
    <div className="dashboard-page">
      <div className="container">
        <div className="dashboard-header">
          <div>
            <h1 className="dashboard-welcome">Welcome back, Ayesha! 👋</h1>
            <p className="dashboard-subtitle">Here's what's happening with your applications.</p>
          </div>
          <div className="dashboard-actions">
            <button className="btn btn-primary" onClick={() => router.push('/apply')}>
              <i className="fas fa-plus" style={{ marginRight: '6px' }}></i> New Application
            </button>
            <button className="btn btn-ghost" onClick={() => router.push('/track')}>
              <i className="fas fa-search" style={{ marginRight: '6px' }}></i> Track Status
            </button>
          </div>
        </div>

        <div className="dashboard-stats">
          <div className="stat-card">
            <div className="stat-icon" style={{ background: 'var(--bg-light)' }}>
              <i className="fas fa-file-alt"></i>
            </div>
            <div>
              <div className="stat-number">3</div>
              <div className="stat-label">Total Applications</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon" style={{ background: '#0ED1CD' }}>
              <i className="fas fa-clock"></i>
            </div>
            <div>
              <div className="stat-number">1</div>
              <div className="stat-label">In Progress</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon" style={{ background: '#25625D' }}>
              <i className="fas fa-check-circle"></i>
            </div>
            <div>
              <div className="stat-number">0</div>
              <div className="stat-label">Selected</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon" style={{ background: '#76777D' }}>
              <i className="fas fa-times-circle"></i>
            </div>
            <div>
              <div className="stat-number">0</div>
              <div className="stat-label">Rejected</div>
            </div>
          </div>
        </div>

        <div className="dashboard-grid">
          <div className="dashboard-left">
            <div className="dashboard-card">
              <h3><i className="fas fa-chart-line" style={{ marginRight: '8px', color: 'var(--primary)' }}></i>Application Status</h3>
              <div className="status-item">
                <span className="status-label">Position</span>
                <span className="status-value">AI Engineer Intern</span>
              </div>
              <div className="status-item">
                <span className="status-label">Applied on</span>
                <span className="status-value">{appliedDate}</span>
              </div>
              <div className="status-item">
                <span className="status-label">Current Status</span>
                <span className={`status-badge ${applicationStatus.toLowerCase()}`}>
                  {applicationStatus}
                </span>
              </div>
              <button className="btn btn-primary" style={{ width: '100%', marginTop: '12px' }} onClick={() => router.push('/track')}>
                View Full Status
              </button>
            </div>

            <div className="dashboard-card interview-card">
              <h3><i className="fas fa-video" style={{ marginRight: '8px', color: 'var(--primary)' }}></i>Upcoming Interview</h3>
              <div className="interview-details">
                <div><strong>Date:</strong> {interviewData.date}</div>
                <div><strong>Day:</strong> {interviewData.day}</div>
                <div><strong>Time:</strong> {interviewData.time}</div>
              </div>
              <button className="btn btn-dark" style={{ width: '100%', marginTop: '8px' }}>
                <i className="fas fa-external-link-alt" style={{ marginRight: '6px' }}></i> Join Interview
              </button>
            </div>
          </div>

          <div className="dashboard-right">
            <div className="dashboard-card">
              <h3><i className="fas fa-bell" style={{ marginRight: '8px', color: 'var(--primary)' }}></i>Notifications</h3>
              {notifications.length === 0 ? (
                <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '20px 0' }}>No new notifications</p>
              ) : (
                <ul className="notification-list">
                  {notifications.map((notif) => (
                    <li key={notif.id} className={`notification-item ${notif.read ? 'read' : 'unread'}`}>
                      <div className="notification-dot"></div>
                      <div className="notification-content">
                        <p className="notification-message">{notif.message}</p>
                        <span className="notification-date">{notif.date}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
              <button className="btn btn-ghost" style={{ width: '100%', marginTop: '8px' }}>
                View All Notifications
              </button>
            </div>

            <div className="dashboard-card">
              <h3><i className="fas fa-rocket" style={{ marginRight: '8px', color: 'var(--primary)' }}></i>Quick Actions</h3>
              <div className="quick-actions">
                <button className="btn btn-primary" style={{ flex: 1 }} onClick={() => router.push('/apply')}>
                  <i className="fas fa-file-alt" style={{ marginRight: '6px' }}></i> Apply Now
                </button>
                <button className="btn btn-dark" style={{ flex: 1 }} onClick={() => router.push('/track')}>
                  <i className="fas fa-search" style={{ marginRight: '6px' }}></i> Track
                </button>
              </div>
              <button className="btn btn-ghost" style={{ width: '100%', marginTop: '8px' }}>
                <i className="fas fa-user-edit" style={{ marginRight: '6px' }}></i> Edit Profile
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}