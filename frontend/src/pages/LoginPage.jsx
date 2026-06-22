import React, { useState } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './LoginPage.css';

export default function LoginPage() {
  const { login, register } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isRegister, setIsRegister] = useState(searchParams.get('register') === 'true');

  const [form, setForm] = useState({ username: '', email: '', password: '', confirmPassword: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState('');

  const validate = () => {
    const errs = {};
    if (!form.email) errs.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Invalid email address';
    if (!form.password) errs.password = 'Password is required';
    else if (form.password.length < 6) errs.password = 'Password must be at least 6 characters';
    if (isRegister) {
      if (!form.username) errs.username = 'Username is required';
      if (form.password !== form.confirmPassword) errs.confirmPassword = 'Passwords do not match';
    }
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }

    setLoading(true);
    setServerError('');
    try {
      if (isRegister) {
        await register(form.username, form.email, form.password);
      } else {
        await login(form.email, form.password);
      }
      navigate('/');
    } catch (err) {
      setServerError(err.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
  };

  return (
    <div className="login-page">
      <div className="login-card">
        {/* Logo */}
        <div className="login-logo">
          <svg viewBox="0 0 32 32" width="40" height="40" fill="#FF385C">
            <path d="M16 1c2.008 0 3.463.963 4.751 3.269l.533 1.025c1.954 3.83 6.114 12.54 7.1 14.836l.145.353c.667 1.592.84 2.812.588 3.957-.265 1.24-1.065 2.296-2.253 3.003C25.595 28.182 23.877 28.5 22 28.5c-1.313 0-2.396-.2-3.585-.59l-.338-.117-.34-.122c-.58-.21-1.135-.408-1.737-.537A8.94 8.94 0 0016 27.1a8.94 8.94 0 00-.338.034c-.602.13-1.157.327-1.737.537l-.34.122-.338.117C12.061 28.3 10.978 28.5 9.665 28.5c-1.877 0-3.595-.318-4.864-1.057-1.188-.707-1.988-1.763-2.253-3.003-.252-1.145-.079-2.365.588-3.957l.145-.353c.986-2.297 5.146-11.006 7.1-14.836l.533-1.025C11.962 1.963 13.417 1 15.425 1H16z"/>
          </svg>
        </div>

        <h1>{isRegister ? 'Create an account' : 'Welcome back'}</h1>
        <p className="login-sub">{isRegister ? 'Join millions of travellers worldwide' : 'Log in to your Airbnb account'}</p>

        {serverError && <div className="server-error">{serverError}</div>}

        <form onSubmit={handleSubmit} className="login-form" noValidate>
          {isRegister && (
            <div className="form-group">
              <label>Username</label>
              <input
                name="username"
                type="text"
                placeholder="John Doe"
                value={form.username}
                onChange={handleChange}
                className={errors.username ? 'input-error' : ''}
              />
              {errors.username && <span className="field-error">{errors.username}</span>}
            </div>
          )}

          <div className="form-group">
            <label>Email</label>
            <input
              name="email"
              type="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={handleChange}
              className={errors.email ? 'input-error' : ''}
            />
            {errors.email && <span className="field-error">{errors.email}</span>}
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              name="password"
              type="password"
              placeholder="••••••••"
              value={form.password}
              onChange={handleChange}
              className={errors.password ? 'input-error' : ''}
            />
            {errors.password && <span className="field-error">{errors.password}</span>}
          </div>

          {isRegister && (
            <div className="form-group">
              <label>Confirm Password</label>
              <input
                name="confirmPassword"
                type="password"
                placeholder="••••••••"
                value={form.confirmPassword}
                onChange={handleChange}
                className={errors.confirmPassword ? 'input-error' : ''}
              />
              {errors.confirmPassword && <span className="field-error">{errors.confirmPassword}</span>}
            </div>
          )}

          <button type="submit" className="btn btn-gradient login-submit" disabled={loading}>
            {loading ? 'Please wait...' : isRegister ? 'Create Account' : 'Log In'}
          </button>
        </form>

        <div className="login-divider"><span>or</span></div>

        <p className="login-switch">
          {isRegister ? 'Already have an account?' : "Don't have an account?"}
          <button className="switch-btn" onClick={() => { setIsRegister(!isRegister); setErrors({}); setServerError(''); }}>
            {isRegister ? 'Log in' : 'Sign up'}
          </button>
        </p>
      </div>
    </div>
  );
}
