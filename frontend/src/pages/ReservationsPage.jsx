import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import './ReservationsPage.css';

export default function ReservationsPage() {
  const { user } = useAuth();
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [cancelling, setCancelling] = useState(null);

  const fetchReservations = async () => {
    try {
      const { data } = await axios.get('/api/reservations/user');
      setReservations(data);
    } catch {
      setError('Failed to load reservations.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchReservations(); }, []);

  const handleCancel = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this reservation?')) return;
    setCancelling(id);
    try {
      await axios.delete(`/api/reservations/${id}`);
      setReservations(reservations.filter((r) => r._id !== id));
    } catch {
      alert('Failed to cancel reservation. Please try again.');
    } finally {
      setCancelling(null);
    }
  };

  const formatDate = (date) =>
    new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  return (
    <div className="reservations-page container">
      <h1>My Reservations</h1>
      <p className="res-sub">Welcome back, <strong>{user?.username}</strong>! Here are your bookings.</p>

      {loading && (
        <div className="res-loading">
          {[1, 2].map(i => <div key={i} className="skeleton-card" style={{ height: '120px' }} />)}
        </div>
      )}

      {error && <div className="error-msg">{error}</div>}

      {!loading && !error && reservations.length === 0 && (
        <div className="no-reservations">
          <div style={{ fontSize: 56, marginBottom: 16 }}>🏖️</div>
          <h2>No reservations yet</h2>
          <p>Time to start planning your next adventure!</p>
          <a href="/" className="btn btn-gradient" style={{ marginTop: 20, display: 'inline-flex' }}>
            Explore Stays
          </a>
        </div>
      )}

      {!loading && !error && reservations.length > 0 && (
        <div className="reservations-table-wrap">
          <table className="reservations-table">
            <thead>
              <tr>
                <th>Property</th>
                <th>Location</th>
                <th>Check-in</th>
                <th>Checkout</th>
                <th>Nights</th>
                <th>Guests</th>
                <th>Total</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {reservations.map((r) => (
                <tr key={r._id}>
                  <td>
                    <div className="res-property">
                      {r.accommodationImage && (
                        <img src={r.accommodationImage} alt="" className="res-img" />
                      )}
                      <span>{r.accommodationTitle || r.accommodation?.title || 'Property'}</span>
                    </div>
                  </td>
                  <td>📍 {r.accommodationLocation || r.accommodation?.location || '-'}</td>
                  <td>{formatDate(r.checkIn)}</td>
                  <td>{formatDate(r.checkOut)}</td>
                  <td>{r.nights}</td>
                  <td>{r.guests}</td>
                  <td><strong>${r.totalPrice?.toFixed(2)}</strong></td>
                  <td>
                    <span className={`status-badge status-${r.status}`}>{r.status}</span>
                  </td>
                  <td>
                    <button
                      className="btn btn-outline cancel-btn"
                      onClick={() => handleCancel(r._id)}
                      disabled={cancelling === r._id}
                    >
                      {cancelling === r._id ? '...' : 'Cancel'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
