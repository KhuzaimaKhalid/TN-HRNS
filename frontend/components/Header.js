import Link from 'next/link';
import { useRouter } from 'next/router';

export default function Header() {
  const router = useRouter();

  return (
    <header className="header">
      <div className="container">
        <div className="logo" onClick={() => router.push('/')}>
          <div className="tn-logo">
            <span className="tn-logo-text">TN</span>
          </div>
          TrustNexus-<span>HRMS</span>
        </div>
        <ul className="nav-links">
          <li><a onClick={() => router.push('/')}>Home</a></li>
          <li><a onClick={() => router.push('/')}>Features</a></li>
          <li><a onClick={() => router.push('/')}>Careers</a></li>
          <li><a onClick={() => router.push('/')}>Contact</a></li>
        </ul>
        <div className="nav-actions">
          <a className="btn btn-outline" onClick={() => router.push('/login')}>Login</a>
          <a className="btn btn-primary" onClick={() => router.push('/register')}>Sign Up</a>
        </div>
      </div>
    </header>
  );
}