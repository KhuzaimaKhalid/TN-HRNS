import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

export default function Header() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  }, []);

  const navigate = (path) => router.push(path);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    setIsLoggedIn(false);
    router.push('/');
  };

  return (
    <header className="header">
      <div className="container">
        <div className="logo" onClick={() => navigate('/')}>
          <div className="tn-logo">
            <span className="tn-logo-text">TN</span>
          </div>
          TrustNexus-<span>HRMS</span>
        </div>

        <ul className="nav-links">
          <li><a onClick={() => navigate('/')}>Home</a></li>
          <li><a onClick={() => navigate('/features')}>Features</a></li>
          <li><a onClick={() => navigate('/careers')}>Careers</a></li>
          <li><a onClick={() => navigate('/contact')}>Contact</a></li>
        </ul>

        <div className="nav-actions">
          {isLoggedIn && (
            <button className="btn btn-outline" onClick={handleLogout}>
              <i className="fas fa-sign-out-alt" style={{ marginRight: '6px' }}></i> Logout
            </button>
          )}
        </div>
      </div>
    </header>
  );
}