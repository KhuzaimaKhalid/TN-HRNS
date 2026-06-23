import { useRouter } from 'next/router';

export default function Header() {
  const router = useRouter();

  const navigate = (path) => {
    router.push(path);
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
          <li><a onClick={() => navigate('/')}>Features</a></li>
          <li><a onClick={() => navigate('/')}>Careers</a></li>
          <li><a onClick={() => navigate('/')}>Contact</a></li>
        </ul>
        <div className="nav-actions">
          <a className="btn btn-outline" onClick={() => navigate('/login')}>Login</a>
          <a className="btn btn-primary" onClick={() => navigate('/register')}>Sign Up</a>
        </div>
      </div>
    </header>
  );
}