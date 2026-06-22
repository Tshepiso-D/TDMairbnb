import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './AdminLoginPage.css';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState('');

  const validate = () => {
    const errs = {};
    if (!form.email) errs.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Invalid email';
    if (!form.password) errs.password = 'Password is required';
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setLoading(true);
    setServerError('');
    try {
      await login(form.email, form.password);
      navigate('/');
    } catch (err) {
      setServerError(err.response?.data?.message || err.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
  };

  return (
    <div className="admin-login-page">
      <div className="admin-login-card">
        <div className="admin-login-logo">
          <svg viewBox="0 0 32 32" width="44" height="44" fill="#FF385C">
            <path d="M16 1c2.008 0 3.463.963 4.751 3.269l.533 1.025c1.954 3.83 6.114 12.54 7.1 14.836l.145.353c.667 1.592.84 2.812.588 3.957-.265 1.24-1.065 2.296-2.253 3.003C25.595 28.182 23.877 28.5 22 28.5c-1.313 0-2.396-.2-3.585-.59l-.338-.117-.34-.122c-.58-.21-1.135-.408-1.737-.537A8.94 8.94 0 0016 27.1a8.94 8.94 0 00-.338.034c-.602.13-1.157.327-1.737.537l-.34.122-.338.117C12.061 28.3 10.978 28.5 9.665 28.5c-1.877 0-3.595-.318-4.864-1.057-1.188-.707-1.988-1.763-2.253-3.003-.252-1.145-.079-2.365.588-3.957l.145-.353c.986-2.297 5.146-11.006 7.1-14.836l.533-1.025C11.962 1.963 13.417 1 15.425 1H16z"/>
          </svg>
          <div>
            <span className="admin-login-brand">airbnb</span>
            <span className="admin-login-badge">Admin Portal</span>
          </div>
        </div>

        <h1>Sign in to Admin</h1>
        <p className="admin-login-sub">Access the property management dashboard</p>

        <div className="demo-creds">
          <strong>Demo credentials:</strong>
          <span>Admin: admin@airbnb.com / admin123</span>
          <span>Host: john@airbnb.com / password123</span>
        </div>

        {serverError && <div className="error-banner">{serverError}</div>}

        <form onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label>Email</label>
            <input name="email" type="email" placeholder="admin@airbnb.com" value={form.email} onChange={handleChange} className={errors.email ? 'input-error' : ''} />
            {errors.email && <span className="field-error">{errors.email}</span>}
          </div>
          <div className="form-group">
            <label>Password</label>
            <input name="password" type="password" placeholder="••••••••" value={form.password} onChange={handleChange} className={errors.password ? 'input-error' : ''} />
            {errors.password && <span className="field-error">{errors.password}</span>}
          </div>
          <button type="submit" className="btn btn-primary admin-login-btn" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}
