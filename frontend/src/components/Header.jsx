import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Header.css';

const LOCATIONS = ['New York', 'Miami', 'Aspen', 'Chicago', 'Los Angeles', 'San Francisco'];

export default function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);
  const [searchLocation, setSearchLocation] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const dropdownRef = useRef(null);

  const filtered = LOCATIONS.filter(l =>
    l.toLowerCase().includes(searchLocation.toLowerCase())
  );

  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchLocation.trim()) {
      navigate(`/locations/${encodeURIComponent(searchLocation.trim())}`);
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (loc) => {
    setSearchLocation(loc);
    setShowSuggestions(false);
    navigate(`/locations/${encodeURIComponent(loc)}`);
  };

  return (
    <header className="header">
      <div className="header-inner">
        {/* Logo */}
        <Link to="/" className="logo">
          <svg viewBox="0 0 32 32" width="32" height="32" fill="#FF385C">
            <path d="M16 1c2.008 0 3.463.963 4.751 3.269l.533 1.025c1.954 3.83 6.114 12.54 7.1 14.836l.145.353c.667 1.592.84 2.812.588 3.957-.265 1.24-1.065 2.296-2.253 3.003C25.595 28.182 23.877 28.5 22 28.5c-1.313 0-2.396-.2-3.585-.59l-.338-.117-.34-.122c-.58-.21-1.135-.408-1.737-.537A8.94 8.94 0 0016 27.1a8.94 8.94 0 00-.338.034c-.602.13-1.157.327-1.737.537l-.34.122-.338.117C12.061 28.3 10.978 28.5 9.665 28.5c-1.877 0-3.595-.318-4.864-1.057-1.188-.707-1.988-1.763-2.253-3.003-.252-1.145-.079-2.365.588-3.957l.145-.353c.986-2.297 5.146-11.006 7.1-14.836l.533-1.025C11.962 1.963 13.417 1 15.425 1H16zm0 2h-.575C14.396 3 13.453 3.577 12.5 5.27l-.518.994c-1.932 3.79-6.052 12.42-7.038 14.718l-.14.34c-.54 1.286-.666 2.187-.469 3.078.18.842.693 1.547 1.554 2.056 1.01.6 2.49.877 4.11.877 1.09 0 2.004-.168 3.02-.505l.337-.117.34-.12c.648-.237 1.281-.464 1.99-.602A11.1 11.1 0 0116 25.9c.307 0 .614.027.914.09.709.138 1.342.365 1.99.602l.34.12.337.117c1.016.337 1.93.505 3.02.505 1.62 0 3.1-.277 4.11-.877.861-.509 1.374-1.214 1.554-2.056.197-.89.071-1.792-.469-3.078l-.14-.34C26.67 18.684 22.55 10.054 20.618 6.264l-.518-.994C19.147 3.577 18.204 3 17.15 3H16z"/>
          </svg>
          <span>airbnb</span>
        </Link>

        {/* Search Bar */}
        <form className="search-bar" onSubmit={handleSearch}>
          <div className="search-input-wrap">
            <input
              type="text"
              placeholder="Search destinations..."
              value={searchLocation}
              onChange={(e) => { setSearchLocation(e.target.value); setShowSuggestions(true); }}
              onFocus={() => setShowSuggestions(true)}
            />
            {showSuggestions && searchLocation && filtered.length > 0 && (
              <div className="suggestions">
                {filtered.map(loc => (
                  <div key={loc} className="suggestion-item" onClick={() => handleSuggestionClick(loc)}>
                    📍 {loc}
                  </div>
                ))}
              </div>
            )}
          </div>
          <button type="submit" className="search-btn">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="3">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
          </button>
        </form>

        {/* Profile */}
        <div className="profile-section" ref={dropdownRef}>
          {!user && (
            <Link to="/" className="become-host-link">Become a Host</Link>
          )}
          <div className="profile-btn" onClick={() => setShowDropdown(!showDropdown)}>
            <svg viewBox="0 0 32 32" width="18" height="18" fill="currentColor">
              <path d="M16 .7C7.56.7.7 7.56.7 16S7.56 31.3 16 31.3 31.3 24.44 31.3 16 24.44.7 16 .7zm0 28c-4.02 0-7.6-1.88-9.96-4.81a12.43 12.43 0 0 1 6.45-4.4A6.5 6.5 0 0 1 9.5 14a6.5 6.5 0 0 1 13 0 6.51 6.51 0 0 1-3 5.5 12.42 12.42 0 0 1 6.45 4.4C23.6 26.82 20.02 28.7 16 28.7z"/>
            </svg>
            <svg viewBox="0 0 18 18" width="12" height="12" fill="currentColor">
              <path d="M3 6l6 6 6-6"/>
            </svg>
          </div>
          {showDropdown && (
            <div className="dropdown">
              {user ? (
                <>
                  <div className="dropdown-greeting">Hello, {user.username}!</div>
                  <div className="dropdown-divider" />
                  <Link to="/reservations" className="dropdown-item" onClick={() => setShowDropdown(false)}>
                    My Reservations
                  </Link>
                  <button className="dropdown-item logout-btn" onClick={() => { logout(); setShowDropdown(false); }}>
                    Log out
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="dropdown-item font-bold" onClick={() => setShowDropdown(false)}>
                    Log in
                  </Link>
                  <Link to="/login?register=true" className="dropdown-item" onClick={() => setShowDropdown(false)}>
                    Sign up
                  </Link>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}