import { useRouter } from 'next/router';

export default function Footer() {
  const router = useRouter();

  const navigate = (path) => {
    router.push(path);
  };

  return (
    <footer className="footer-new">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-left">
            <div className="footer-brand">Trust Nexus - <span>HRMS</span></div>
            <p className="footer-tagline">
              Built exclusively for Trust Nexus to simplify HR, projects, attendance, and team collaboration
            </p>
            <div className="footer-contact">
              <div>Karachi, Pakistan</div>
              <div>hrms@trustnexus.com</div>
            </div>
            <div className="footer-copy">
              &copy; {new Date().getFullYear()} Trust Nexus. All rights reserved.
            </div>
          </div>
          <div className="footer-right">
            <ul className="footer-nav-links">
              <li><a onClick={() => navigate('/')}>Home</a></li>
              <li><a onClick={() => navigate('/')}>Features</a></li>
              <li><a onClick={() => navigate('/')}>Careers</a></li>
              <li><a onClick={() => navigate('/')}>Contact</a></li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}