import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import './DashboardPage.css';

export default function DashboardPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState({ listings: 0, reservations: 0, revenue: 0 });
  const [recentListings, setRecentListings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [listingsRes, reservationsRes] = await Promise.all([
          axios.get('/api/accommodations'),
          axios.get('/api/reservations/host').catch(() => ({ data: [] })),
        ]);
        const listings = listingsRes.data;
        const reservations = reservationsRes.data;
        const revenue = reservations.reduce((sum, r) => sum + (r.totalPrice || 0), 0);
        setStats({ listings: listings.length, reservations: reservations.length, revenue });
        setRecentListings(listings.slice(0, 5));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const STAT_CARDS = [
    { label: 'Total Listings', value: stats.listings, icon: '🏠', color: '#FF385C' },
    { label: 'Total Reservations', value: stats.reservations, icon: '📋', color: '#6366F1' },
    { label: 'Total Revenue', value: `$${stats.revenue.toLocaleString()}`, icon: '💰', color: '#10B981' },
  ];

  return (
    <div className="dashboard">
      <div className="page-header">
        <div>
          <h1>Dashboard</h1>
          <p className="dashboard-sub">Welcome back, <strong>{user?.username}</strong> 👋</p>
        </div>
        <Link to="/listings/create" className="btn btn-primary">+ New Listing</Link>
      </div>

      {/* Stats */}
      <div className="stats-grid">
        {STAT_CARDS.map((card) => (
          <div key={card.label} className="stat-card card">
            <div className="stat-icon" style={{ background: `${card.color}20`, color: card.color }}>
              {card.icon}
            </div>
            <div>
              <div className="stat-value">{loading ? '—' : card.value}</div>
              <div className="stat-label">{card.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Listings */}
      <div className="card">
        <div className="section-header">
          <h2>Recent Listings</h2>
          <Link to="/listings" className="view-all">View all →</Link>
        </div>

        {loading ? (
          <div className="table-skeleton">
            {[1, 2, 3].map(i => <div key={i} className="skeleton-row" />)}
          </div>
        ) : recentListings.length === 0 ? (
          <div className="empty-state">
            <p>No listings yet. <Link to="/listings/create">Create your first listing</Link></p>
          </div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Property</th>
                <th>Location</th>
                <th>Type</th>
                <th>Price/night</th>
                <th>Rating</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {recentListings.map((l) => (
                <tr key={l._id}>
                  <td>
                    <div className="table-property">
                      <img
                        src={l.images?.[0] || 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=100'}
                        alt=""
                      />
                      <span>{l.title}</span>
                    </div>
                  </td>
                  <td>📍 {l.location}</td>
                  <td><span className="type-badge">{l.type}</span></td>
                  <td><strong>${l.price}</strong></td>
                  <td>⭐ {l.rating.toFixed(1)}</td>
                  <td>
                    <div className="table-actions">
                      <Link to={`/listings/edit/${l._id}`} className="btn btn-outline btn-sm">Edit</Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
