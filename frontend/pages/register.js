import { useState } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/context/AuthContext';
import Footer from '@/components/Footer';
import Button from '@/components/common/Button';
import Input from '@/components/common/Input';

export default function Register() {   // ✅ default export
  const router = useRouter();
  const { register, loading } = useAuth();
  const [form, setForm] = useState({ fullName: '', email: '', password: '', confirmPassword: '' });
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');

  const validate = () => {
    const newErrors = {};
    if (!form.fullName) newErrors.fullName = 'Full name is required';
    if (!form.email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) newErrors.email = 'Invalid email';
    if (!form.password) newErrors.password = 'Password is required';
    else if (form.password.length < 6) newErrors.password = 'Minimum 6 characters';
    if (form.password !== form.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length) {
      setErrors(validationErrors);
      return;
    }
    setApiError('');
    const result = await register({ ...form, role: 'Employee' });
    if (result.success) {
      router.push('/dashboard');
    } else {
      setApiError(result.error || 'Registration failed');
    }
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

          <Input
            label="Full Name"
            type="text"
            placeholder="John Doe"
            value={form.fullName}
            onChange={(e) => setForm({ ...form, fullName: e.target.value })}
            error={errors.fullName}
          />

          <Input
            label="Email Address"
            type="email"
            placeholder="name@email.com"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            error={errors.email}
          />

          <Input
            label="Password"
            type="password"
            placeholder="••••••"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            error={errors.password}
          />
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '-8px', marginBottom: '12px' }}>
            Minimum 6 characters
          </div>

          <Input
            label="Confirm Password"
            type="password"
            placeholder="••••••"
            value={form.confirmPassword}
            onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
            error={errors.confirmPassword}
          />

          {apiError && (
            <div className="error-message" style={{ textAlign: 'center', marginBottom: '12px' }}>
              {apiError}
            </div>
          )}

          <Button variant="primary" loading={loading} onClick={handleSubmit} style={{ width: '100%' }}>
            Create Account
          </Button>

          <div className="auth-switch">
            Already have an account? <a onClick={() => router.push('/login')}>Login</a>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}