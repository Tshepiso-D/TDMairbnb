import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './ListingsPage.css';

export default function ListingsPage() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleting, setDeleting] = useState(null);
  const [search, setSearch] = useState('');

  const fetchListings = async () => {
    try {
      const { data } = await axios.get('/api/accommodations');
      setListings(data);
    } catch {
      setError('Failed to load listings.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchListings(); }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this listing? This cannot be undone.')) return;
    setDeleting(id);
    try {
      await axios.delete(`/api/accommodations/${id}`);
      setListings(listings.filter((l) => l._id !== id));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete listing.');
    } finally {
      setDeleting(null);
    }
  };

  const filtered = listings.filter((l) =>
    l.title.toLowerCase().includes(search.toLowerCase()) ||
    l.location.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="listings-admin">
      <div className="page-header">
        <h1>All Listings</h1>
        <Link to="/listings/create" className="btn btn-primary">+ New Listing</Link>
      </div>

      {error && <div className="error-banner">{error}</div>}

      <div className="card">
        <div className="listings-toolbar">
          <input
            type="text"
            className="search-input"
            placeholder="Search by title or location..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <span className="count-badge">{filtered.length} listing{filtered.length !== 1 ? 's' : ''}</span>
        </div>

        {loading ? (
          <div className="table-skeleton">
            {[1, 2, 3, 4].map(i => <div key={i} className="skeleton-row" style={{ height: 56 }} />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="empty-state">
            <p>No listings found. <Link to="/listings/create">Create one now</Link></p>
          </div>
        ) : (
          <table className="admin-table listings-table">
            <thead>
              <tr>
                <th>Property</th>
                <th>Location</th>
                <th>Type</th>
                <th>Beds/Baths</th>
                <th>Price</th>
                <th>Rating</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((l) => (
                <tr key={l._id}>
                  <td>
                    <div className="table-property">
                      <img
                        src={l.images?.[0] || 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=100'}
                        alt={l.title}
                      />
                      <div>
                        <span className="prop-title">{l.title}</span>
                        <span className="prop-guests">{l.guests} guests max</span>
                      </div>
                    </div>
                  </td>
                  <td>📍 {l.location}</td>
                  <td><span className="type-badge">{l.type}</span></td>
                  <td>🛏 {l.bedrooms} · 🚿 {l.bathrooms}</td>
                  <td><strong>${l.price}</strong>/night</td>
                  <td>⭐ {l.rating.toFixed(1)} ({l.reviews})</td>
                  <td>
                    <div className="table-actions">
                      <Link to={`/listings/edit/${l._id}`} className="btn btn-outline btn-sm">Edit</Link>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleDelete(l._id)}
                        disabled={deleting === l._id}
                      >
                        {deleting === l._id ? '...' : 'Delete'}
                      </button>
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
