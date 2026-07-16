// components/HRLayout.js
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
export default function HRLayout({ children }) {
  const router = useRouter();

  // State to hold dynamic HR user data
  const [user, setUser] = useState({ name: 'HR User', role: 'HR' });

  useEffect(() => {
    // Get the saved user data from localStorage
    const savedData = localStorage.getItem('userData');
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        if (parsed && parsed.name) {
          setUser({
            name: parsed.name,
            role: localStorage.getItem('userRole') || 'HR'
          });
        }
      } catch (err) {
        console.error("Error parsing user data:", err);
      }
    }
  }, []);
  const initials = user.name
    ? user.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
    : 'HR';
  const navItems = [
    { name: 'Dashboard', path: '/hr-dashboard', icon: 'fa-chart-pie' },
    { name: 'Calendar', path: '/calendar', icon: 'fa-calendar-alt' },
    { name: 'Candidates', path: '/candidates', icon: 'fa-users' },
    { name: 'Messages', path: '/messages', icon: 'fa-envelope' },
    { name: 'Leave management', path: '/leave-management', icon: 'fa-clock' },
    { name: 'Internal communication', path: '/internal-communication', icon: 'fa-comments' },
  ];

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userData');
    localStorage.removeItem('userRole');
    router.push('/');
  };

  return (
    <div className="hr-layout">
      <div className="hr-body">
        <aside className="hr-sidebar">
          <div className="sidebar-profile">
            <div className="profile-avatar">{initials}</div>
            <div className="profile-name">{user.name}</div>
            <div className="profile-role">{user.role}</div>
          </div>
          <nav className="sidebar-nav">
            {navItems.map((item) => (
              <a
                key={item.path}
                className={`sidebar-link ${router.pathname === item.path ? 'active' : ''}`}
                onClick={() => router.push(item.path)}
              >
                <i className={`fas ${item.icon}`}></i>
                <span>{item.name}</span>
              </a>
            ))}
          </nav>
          <div style={{ padding: '16px 12px' }}>
            <button
              style={{
                width: '100%',
                background: '#ffffff',
                color: '#06504A',
                border: 'none',
                padding: '10px',
                borderRadius: '12px',
                fontWeight: 600,
                cursor: 'pointer',
                fontFamily: "'Poppins', sans-serif",
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
              onClick={() => router.push('/internal-communication')}
            >
              <i className="fas fa-plus-circle"></i> Create Task
            </button>
          </div>
          <div style={{ padding: '0 12px 16px', marginTop: 'auto' }}>
            <button
              style={{
                width: '100%',
                background: 'transparent',
                color: '#ffffff',
                border: '1px solid rgba(255,255,255,0.3)',
                padding: '10px',
                borderRadius: '12px',
                fontWeight: 500,
                cursor: 'pointer',
                fontFamily: "'Poppins', sans-serif",
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => e.target.style.background = 'rgba(255,255,255,0.1)'}
              onMouseLeave={(e) => e.target.style.background = 'transparent'}
              onClick={handleLogout}
            >
              <i className="fas fa-sign-out-alt"></i> Logout
            </button>
          </div>
        </aside>
        <main className="hr-main">
          {children}
        </main>
      </div>
    </div>
  );
}