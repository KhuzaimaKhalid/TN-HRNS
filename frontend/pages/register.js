import { useState } from 'react';
import { useRouter } from 'next/router';
import Footer from '@/components/Footer';

export default function Register() {
  const router = useRouter();

  // Form state
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!fullName) newErrors.fullName = 'Full name is required';
    if (!email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Email is invalid';
    if (!password) newErrors.password = 'Password is required';
    else if (password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    if (password !== confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    return newErrors;
  };

  const handleRegister = (e) => {
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

          <h1 className="auth-welcome">Create Account</h1>
          <p className="auth-subtitle">Join Trust Nexus and start managing your workforce.</p>

          <div className="auth-form-group">
            <label>Full Name</label>
            <input
              type="text"
              className={`auth-input ${errors.fullName ? 'error' : ''}`}
              placeholder="John Doe"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
            {errors.fullName && <span className="error-message">{errors.fullName}</span>}
          </div>

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

          <div className="auth-form-group">
            <label>Confirm Password</label>
            <input
              type="password"
              className={`auth-input ${errors.confirmPassword ? 'error' : ''}`}
              placeholder="••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            {errors.confirmPassword && <span className="error-message">{errors.confirmPassword}</span>}
          </div>

          <button className="auth-submit" onClick={handleRegister}>Create Account</button>

          <div className="auth-switch">
            Already have an account? <a onClick={() => router.push('/login')}>Login</a>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}