import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './AdminHeader.css';

export default function AdminHeader() {
  const { user, logout } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <header className="admin-header">
      <div className="admin-header-left">
        <Link to="/" className="admin-logo">
          <svg viewBox="0 0 32 32" width="28" height="28" fill="#FF385C">
            <path d="M16 1c2.008 0 3.463.963 4.751 3.269l.533 1.025c1.954 3.83 6.114 12.54 7.1 14.836l.145.353c.667 1.592.84 2.812.588 3.957-.265 1.24-1.065 2.296-2.253 3.003C25.595 28.182 23.877 28.5 22 28.5c-1.313 0-2.396-.2-3.585-.59l-.338-.117-.34-.122c-.58-.21-1.135-.408-1.737-.537A8.94 8.94 0 0016 27.1a8.94 8.94 0 00-.338.034c-.602.13-1.157.327-1.737.537l-.34.122-.338.117C12.061 28.3 10.978 28.5 9.665 28.5c-1.877 0-3.595-.318-4.864-1.057-1.188-.707-1.988-1.763-2.253-3.003-.252-1.145-.079-2.365.588-3.957l.145-.353c.986-2.297 5.146-11.006 7.1-14.836l.533-1.025C11.962 1.963 13.417 1 15.425 1H16z"/>
          </svg>
          <span>airbnb</span>
          <span className="admin-badge">Admin</span>
        </Link>
      </div>

      <div className="admin-header-right" ref={dropdownRef}>
        {user ? (
          <>
            <span className="admin-greeting">Hello, <strong>{user.username}</strong></span>
            <div className="admin-profile-btn" onClick={() => setShowDropdown(!showDropdown)}>
              <div className="admin-avatar">{user.username?.[0]?.toUpperCase()}</div>
              <svg viewBox="0 0 18 18" width="12" height="12" fill="currentColor">
                <path d="M3 6l6 6 6-6" stroke="currentColor" strokeWidth="2" fill="none"/>
              </svg>
            </div>
            {showDropdown && (
              <div className="admin-dropdown">
                <div className="dropdown-user">
                  <strong>{user.username}</strong>
                  <span>{user.email}</span>
                  <span className="role-badge">{user.role}</span>
                </div>
                <div className="dropdown-divider" />
                <Link to="/reservations" className="admin-dropdown-item" onClick={() => setShowDropdown(false)}>
                  📋 View Reservations
                </Link>
                <button className="admin-dropdown-item logout" onClick={() => { logout(); setShowDropdown(false); }}>
                  🚪 Log Out
                </button>
              </div>
            )}
          </>
        ) : (
          <Link to="/login" className="btn btn-primary">Log In</Link>
        )}
      </div>
    </header>
  );
}
