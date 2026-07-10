import { useState } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/context/AuthContext';
import Button from '@/components/common/Button';
import Input from '@/components/common/Input';

export default function Login() {
  const router = useRouter();
  const { login, loading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('Employee');
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');

  const validate = () => {
    const newErrors = {};
    if (!email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Invalid email';
    if (!password) newErrors.password = 'Password is required';
    else if (password.length < 6) newErrors.password = 'Minimum 6 characters';
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
    const result = await login(email, password, role);
    if (result.success) {
      router.push(role === 'HR' ? '/hr-dashboard' : '/dashboard');
    } else {
      setApiError(result.error || 'Invalid email or password. Please try again.');
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: '#effbfb',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
    }}>
      <div className="auth-wrapper" style={{ maxWidth: '520px', width: '100%' }}>
        <div className="auth-card">
          <button className="auth-close" onClick={() => router.push('/')}>
            <i className="fas fa-times"></i>
          </button>
          <h1 className="auth-welcome">Welcome back</h1>
          <p className="auth-subtitle">Enter your credentials to access your dashboard.</p>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Login as</label>
            <div style={{ display: 'flex', gap: '12px' }}>
              {['Employee', 'HR'].map(r => (
                <button key={r} type="button" className={`role-btn ${role === r ? 'active' : ''}`} style={{ flex: 1 }} onClick={() => setRole(r)}>
                  {r}
                </button>
              ))}
            </div>
          </div>

          <button className="auth-google"><i className="fab fa-google"></i> Continue with Google</button>
          <div className="auth-or">OR EMAIL</div>

          <Input label="Email Address" type="email" placeholder="name@email.com" value={email} onChange={(e) => setEmail(e.target.value)} error={errors.email} />
          <Input label="Password" type="password" placeholder="••••••" value={password} onChange={(e) => setPassword(e.target.value)} error={errors.password} />

          <div className="auth-forgot-password"><a>Forget Password?</a></div>

          {apiError && (
            <div style={{
              background: '#f8d7da',
              color: '#721c24',
              padding: '10px 14px',
              borderRadius: '12px',
              marginBottom: '16px',
              textAlign: 'center',
              fontSize: '0.9rem',
            }}>
              <i className="fas fa-exclamation-circle" style={{ marginRight: '8px' }}></i>
              {apiError}
            </div>
          )}

          <Button variant="primary" loading={loading} onClick={handleSubmit} style={{ width: '100%' }}>Sign In to Account</Button>

          <div className="auth-switch">
            Don't have an account? <a onClick={() => router.push('/register')}>Sign Up</a>
          </div>
        </div>
      </div>
    </div>
  );
}