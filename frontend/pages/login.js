import { useState } from 'react';
import { useRouter } from 'next/router';
import Footer from '@/components/Footer';

export default function Login() {
  const router = useRouter();
  const [selectedRole, setSelectedRole] = useState('Employee');
  const roles = ['Admin', 'HR', 'PM', 'Team lead', 'CEO', 'CFO', 'CTO', 'Employee'];

  // Form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Email is invalid';
    if (!password) newErrors.password = 'Password is required';
    else if (password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    return newErrors;
  };

  const handleSignIn = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    // If valid, navigate to dashboard
    router.push('/dashboard');
  };

  return (
    <div className="auth-page">
      <div className="auth-wrapper">
        <div className="auth-card">
          <button className="auth-close" onClick={() => router.push('/')}>
            <i className="fas fa-times"></i>
          </button>

          <h1 className="auth-welcome">Welcome back</h1>
          <p className="auth-subtitle">Enter your credentials to access your dashboard.</p>

          <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-primary)', display: 'block', marginBottom: '8px' }}>Select your role</label>
          <div className="role-grid">
            {roles.map(role => (
              <button
                key={role}
                className={`role-btn ${selectedRole === role ? 'active' : ''}`}
                onClick={() => setSelectedRole(role)}
              >
                {role}
              </button>
            ))}
          </div>

          <button className="auth-google">
            <i className="fab fa-google"></i> Continue with Google
          </button>

          <div className="auth-or">OR EMAIL</div>

          <div className="auth-form-group">
            <label>Email Address</label>
            <input
              type="email"
              className={`auth-input ${errors.email ? 'error' : ''}`}
              placeholder="name@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {errors.email && <span className="error-message">{errors.email}</span>}
          </div>

          <div className="auth-form-group">
            <label>Password</label>
            <input
              type="password"
              className={`auth-input ${errors.password ? 'error' : ''}`}
              placeholder="••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {errors.password && <span className="error-message">{errors.password}</span>}
          </div>

          <div className="auth-forgot-password">
            <a>Forget Password?</a>
          </div>

          <button className="auth-submit" onClick={handleSignIn}>Sign In to Account</button>

          <div className="auth-switch">
            Don't have an account? <a onClick={() => router.push('/register')}>Sign Up</a>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}