import { useRouter } from 'next/router';
// import Header from './Header';  // ❌ removed
import Footer from './Footer';

export default function HRLayout({ children }) {
  const router = useRouter();

  const navItems = [
    { name: 'Dashboard', path: '/hr-dashboard', icon: 'fa-chart-pie' },
    { name: 'Calendar', path: '/calendar', icon: 'fa-calendar-alt' },
    { name: 'Candidates', path: '/candidates', icon: 'fa-users' },
    { name: 'Messages', path: '/messages', icon: 'fa-envelope' },
    { name: 'Leave management', path: '/leave-management', icon: 'fa-clock' },
  ];

  return (
    <div className="hr-layout">
      {/* Header removed – now only sidebar + content */}
      <div className="hr-body">
        <aside className="hr-sidebar">
          <div className="sidebar-profile">
            <div className="profile-avatar">SA</div>
            <div className="profile-name">Sara Afzal</div>
            <div className="profile-role">HR</div>
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
        </aside>
        <main className="hr-main">
          {children}
        </main>
      </div>
      <Footer />
    </div>
  );
}