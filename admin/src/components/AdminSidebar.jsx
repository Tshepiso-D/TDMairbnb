import React from 'react';
import { NavLink } from 'react-router-dom';
import './AdminSidebar.css';

const NAV_ITEMS = [
  { path: '/', icon: '📊', label: 'Dashboard', exact: true },
  { path: '/listings', icon: '🏠', label: 'Listings' },
  { path: '/listings/create', icon: '➕', label: 'Add Listing' },
  { path: '/reservations', icon: '📋', label: 'Reservations' },
];

export default function AdminSidebar() {
  return (
    <aside className="admin-sidebar">
      <nav className="sidebar-nav">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.exact}
            className={({ isActive }) =>
              `sidebar-link ${isActive ? 'active' : ''}`
            }
          >
            <span className="sidebar-icon">{item.icon}</span>
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>
      <div className="sidebar-footer">
        <p>Airbnb Admin</p>
        <span>v1.0.0</span>
      </div>
    </aside>
  );
}
