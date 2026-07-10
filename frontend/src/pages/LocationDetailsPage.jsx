import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import './LocationDetailsPage.css';

const AMENITY_ICONS = {
  wifi: '📶', kitchen: '🍳', pool: '🏊', gym: '🏋️', parking: '🅿️',
  'free parking': '🅿️', fireplace: '🔥', 'hot tub': '♨️', 'beach access': '🏖️',
  bbq: '🍖', washer: '🧺', 'air conditioning': '❄️', doorman: '🚪',
  concierge: '🛎️', 'ski storage': '⛷️', 'valet parking': '🚗', 'gym access': '🏋️',
};

export default function LocationDetailsPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeImg, setActiveImg] = useState(0);

  // Calculator state
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState(1);
  const [reserving, setReserving] = useState(false);
  const [reserveSuccess, setReserveSuccess] = useState(false);
  const [reserveError, setReserveError] = useState('');
  const API_URL = 'https://zaio-assignment-tdmairbnb-d989e8ad01ac.herokuapp.com';
  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await axios.get(`${API_URL}/api/accommodations/${id}`);
        setListing(data);
        setGuests(1);
      } catch {
        setError('Failed to load listing.');
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [id]);

  // Cost calculations
  const calcCosts = () => {
    if (!listing || !checkIn || !checkOut) return null;
    const inDate = new Date(checkIn);
    const outDate = new Date(checkOut);
    const nights = Math.ceil((outDate - inDate) / (1000 * 60 * 60 * 24));
    if (nights <= 0) return null;

    const subtotal = listing.price * nights;
    const weeklyDiscountAmt = nights >= 7 && listing.weeklyDiscount > 0
      ? (subtotal * listing.weeklyDiscount) / 100 : 0;
    const total = subtotal - weeklyDiscountAmt + listing.cleaningFee + listing.serviceFee + listing.occupancyTaxes;

    return { nights, subtotal, weeklyDiscountAmt, total };
  };

  const costs = calcCosts();

  const handleReserve = async () => {
    if (!user) { navigate('/login'); return; }
    if (!checkIn || !checkOut) { setReserveError('Please select check-in and check-out dates.'); return; }
    if (!costs || costs.nights <= 0) { setReserveError('Invalid dates selected.'); return; }

    setReserving(true);
    setReserveError('');
    try {
      await axios.post(`${API_URL}/api/reservations`, {
        accommodationId: id,
        checkIn,
        checkOut,
        guests,
      });
      setReserveSuccess(true);
    } catch (err) {
      setReserveError(err.response?.data?.message || 'Reservation failed. Please try again.');
    } finally {
      setReserving(false);
    }
  };

  if (loading) return (
    <div className="details-loading">
      <div className="details-skeleton" />
      <p>Loading listing...</p>
    </div>
  );
  if (error) return <div className="container" style={{ padding: '48px 24px' }}><div className="error-msg">{error}</div></div>;
  if (!listing) return null;

  const images = listing.images?.length > 0
    ? listing.images
    : Array(5).fill('https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800');

  return (
    <div className="details-page">
      <div className="container">
        {/* Heading */}
        <div className="details-heading">
          <div>
            <span className="details-type">{listing.type}</span>
            <h1>{listing.title}</h1>
            <div className="details-sub">
              <span>⭐ {listing.rating.toFixed(1)}</span>
              <span className="dot">·</span>
              <span>{listing.reviews} reviews</span>
              <span className="dot">·</span>
              <span>📍 {listing.location}</span>
            </div>
          </div>
        </div>

        {/* Image Gallery */}
        <div className="gallery">
          <div className="gallery-main">
            <img src={images[activeImg]} alt="main" />
          </div>
          <div className="gallery-thumbs">
            {images.slice(0, 4).map((img, i) => (
              <div
                key={i}
                className={`gallery-thumb ${activeImg === i ? 'active' : ''}`}
                onClick={() => setActiveImg(i)}
              >
                <img src={img} alt={`view ${i + 1}`} />
              </div>
            ))}
          </div>
        </div>

        {/* Two Column Layout */}
        <div className="details-layout">
          {/* Left Column */}
          <div className="details-left">
            {/* Accommodation Details */}
            <div className="detail-section">
              <h2>Hosted by {listing.hostName || 'Your Host'}</h2>
              <div className="hosting-meta">
                <span>🛏 {listing.bedrooms} bedroom{listing.bedrooms !== 1 ? 's' : ''}</span>
                <span>·</span>
                <span>🚿 {listing.bathrooms} bathroom{listing.bathrooms !== 1 ? 's' : ''}</span>
                <span>·</span>
                <span>👥 {listing.guests} guests max</span>
              </div>
            </div>

            {/* Features */}
            <div className="detail-section features-row">
              {listing.selfCheckIn && (
                <div className="feature-item">
                  <span className="feature-icon">🗝️</span>
                  <div>
                    <strong>Self check-in</strong>
                    <p>Check yourself in with the lockbox.</p>
                  </div>
                </div>
              )}
              {listing.enhancedCleaning && (
                <div className="feature-item">
                  <span className="feature-icon">🧹</span>
                  <div>
                    <strong>Enhanced cleaning</strong>
                    <p>This host follows Airbnb's 5-step enhanced cleaning process.</p>
                  </div>
                </div>
              )}
            </div>

            {/* Description */}
            <div className="detail-section">
              <h3>About this place</h3>
              <p className="description-text">{listing.description}</p>
            </div>

            {/* Where you'll sleep */}
            <div className="detail-section">
              <h3>Where you'll sleep</h3>
              <div className="sleep-cards">
                {Array.from({ length: listing.bedrooms }, (_, i) => (
                  <div key={i} className="sleep-card">
                    <span>🛏️</span>
                    <strong>Bedroom {i + 1}</strong>
                    <p>1 double bed</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Amenities */}
            <div className="detail-section">
              <h3>What this place offers</h3>
              <div className="amenities-grid">
                {listing.amenities?.map((a) => (
                  <div key={a} className="amenity-item">
                    <span>{AMENITY_ICONS[a.toLowerCase()] || '✓'}</span>
                    <span>{a}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Reviews */}
            <div className="detail-section">
              <h3>⭐ {listing.rating.toFixed(1)} · {listing.reviews} reviews</h3>
              {listing.specificRatings && (
                <div className="ratings-grid">
                  {Object.entries(listing.specificRatings).map(([key, val]) => (
                    <div key={key} className="rating-row">
                      <span className="rating-label">{key.charAt(0).toUpperCase() + key.slice(1)}</span>
                      <div className="rating-bar-wrap">
                        <div className="rating-bar">
                          <div className="rating-fill" style={{ width: `${(val / 5) * 100}%` }} />
                        </div>
                        <span className="rating-val">{val.toFixed(1)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Host Details */}
            <div className="detail-section host-section">
              <div className="host-avatar">{listing.hostName?.[0] || 'H'}</div>
              <div>
                <h3>Hosted by {listing.hostName || 'Your Host'}</h3>
                <p className="host-sub">Superhost · 3 years hosting</p>
              </div>
            </div>

            {/* House Rules */}
            <div className="detail-section">
              <h3>House Rules</h3>
              <ul className="rules-list">
                <li>✅ No smoking</li>
                <li>✅ No pets</li>
                <li>✅ No parties or events</li>
                <li>✅ Check-in: After 3:00 PM</li>
                <li>✅ Checkout: 11:00 AM</li>
              </ul>
            </div>

            {/* Health & Safety */}
            <div className="detail-section">
              <h3>Health & Safety</h3>
              <ul className="rules-list">
                <li>🧼 Airbnb's social-distancing and other COVID-19-related guidelines apply</li>
                <li>🚨 Carbon monoxide alarm installed</li>
                <li>🔥 Smoke alarm installed</li>
              </ul>
            </div>

            {/* Cancellation Policy */}
            <div className="detail-section">
              <h3>Cancellation Policy</h3>
              <p className="description-text">Free cancellation for 48 hours after booking. After that, cancel before check-in and get a 50% refund, minus the first night and service fee.</p>
            </div>
          </div>

          {/* Right Column — Cost Calculator */}
          <div className="details-right">
            <div className="calculator-card">
              <div className="calc-header">
                <span className="calc-price">${listing.price}</span>
                <span className="calc-night">/ night</span>
                <div className="calc-rating">
                  ⭐ {listing.rating.toFixed(1)} · <span>{listing.reviews} reviews</span>
                </div>
              </div>

              {/* Date Pickers */}
              <div className="date-grid">
                <div className="date-field">
                  <label>CHECK-IN</label>
                  <input
                    type="date"
                    value={checkIn}
                    min={new Date().toISOString().split('T')[0]}
                    onChange={(e) => setCheckIn(e.target.value)}
                  />
                </div>
                <div className="date-field">
                  <label>CHECKOUT</label>
                  <input
                    type="date"
                    value={checkOut}
                    min={checkIn || new Date().toISOString().split('T')[0]}
                    onChange={(e) => setCheckOut(e.target.value)}
                  />
                </div>
              </div>

              {/* Guests */}
              <div className="guests-field">
                <label>GUESTS</label>
                <div className="guests-control">
                  <button onClick={() => setGuests(Math.max(1, guests - 1))}>−</button>
                  <span>{guests} guest{guests !== 1 ? 's' : ''}</span>
                  <button onClick={() => setGuests(Math.min(listing.guests, guests + 1))}>+</button>
                </div>
              </div>

              {/* Reserve button */}
              {reserveSuccess ? (
                <div className="reserve-success">
                  🎉 Reservation confirmed! <br />
                  <a href="/reservations" style={{ color: 'var(--primary)', fontWeight: 600 }}>View your reservations →</a>
                </div>
              ) : (
                <button
                  className="btn btn-gradient reserve-btn"
                  onClick={handleReserve}
                  disabled={reserving}
                >
                  {reserving ? 'Reserving...' : user ? 'Reserve' : 'Log in to Reserve'}
                </button>
              )}

              {reserveError && <div className="reserve-error">{reserveError}</div>}

              {/* Cost Breakdown */}
              {costs && (
                <div className="cost-breakdown">
                  <div className="cost-row">
                    <span>${listing.price} × {costs.nights} night{costs.nights !== 1 ? 's' : ''}</span>
                    <span>${costs.subtotal.toFixed(2)}</span>
                  </div>
                  {costs.weeklyDiscountAmt > 0 && (
                    <div className="cost-row discount">
                      <span>Weekly discount ({listing.weeklyDiscount}%)</span>
                      <span>−${costs.weeklyDiscountAmt.toFixed(2)}</span>
                    </div>
                  )}
                  {listing.cleaningFee > 0 && (
                    <div className="cost-row">
                      <span>Cleaning fee</span>
                      <span>${listing.cleaningFee}</span>
                    </div>
                  )}
                  {listing.serviceFee > 0 && (
                    <div className="cost-row">
                      <span>Service fee</span>
                      <span>${listing.serviceFee}</span>
                    </div>
                  )}
                  {listing.occupancyTaxes > 0 && (
                    <div className="cost-row">
                      <span>Occupancy taxes & fees</span>
                      <span>${listing.occupancyTaxes}</span>
                    </div>
                  )}
                  <div className="cost-row total">
                    <span>Total</span>
                    <span>${costs.total.toFixed(2)}</span>
                  </div>
                </div>
              )}

              <p className="no-charge-note">You won't be charged yet</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
