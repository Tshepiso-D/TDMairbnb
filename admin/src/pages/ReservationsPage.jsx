import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

export default function ReservationsPage() {
  const { user } = useAuth();
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetch = async () => {
      try {
        const endpoint = user?.role === 'admin' ? '/api/reservations' : '/api/reservations/host';
        const { data } = await axios.get(endpoint);
        setReservations(data);
      } catch {
        setError('Failed to load reservations.');
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [user]);

  const formatDate = (d) =>
    new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  const handleCancel = async (id) => {
    if (!window.confirm('Cancel this reservation?')) return;
    try {
      await axios.delete(`/api/reservations/${id}`);
      setReservations(reservations.filter((r) => r._id !== id));
    } catch {
      alert('Failed to cancel reservation.');
    }
  };

  return (
    <div>
      <div className="page-header">
        <h1>Reservations</h1>
        <span style={{ color: 'var(--gray)', fontSize: 14 }}>{reservations.length} total</span>
      </div>

      {error && <div className="error-banner">{error}</div>}

      <div className="card">
        {loading ? (
          <p style={{ color: 'var(--gray)', padding: '24px 0' }}>Loading reservations...</p>
        ) : reservations.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '48px', color: 'var(--gray)' }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>📋</div>
            <p>No reservations yet.</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Property</th>
                  <th>Guest</th>
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
                      <div className="table-property">
                        {r.accommodationImage && (
                          <img src={r.accommodationImage} alt="" style={{ width: 40, height: 40, borderRadius: 6, objectFit: 'cover' }} />
                        )}
                        <span style={{ fontWeight: 600, fontSize: 13 }}>
                          {r.accommodationTitle || r.accommodation?.title || 'Property'}
                        </span>
                      </div>
                    </td>
                    <td style={{ fontSize: 13 }}>
                      {r.user?.username || 'Guest'}<br />
                      <span style={{ color: 'var(--gray)', fontSize: 12 }}>{r.user?.email}</span>
                    </td>
                    <td style={{ fontSize: 13 }}>{formatDate(r.checkIn)}</td>
                    <td style={{ fontSize: 13 }}>{formatDate(r.checkOut)}</td>
                    <td>{r.nights}</td>
                    <td>{r.guests}</td>
                    <td><strong>${r.totalPrice?.toFixed(2)}</strong></td>
                    <td>
                      <span className={`status-badge status-${r.status}`}>{r.status}</span>
                    </td>
                    <td>
                      <button className="btn btn-danger btn-sm" onClick={() => handleCancel(r._id)}>
                        Cancel
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
