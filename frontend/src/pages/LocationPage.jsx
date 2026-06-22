import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import './LocationPage.css';

const AMENITY_ICONS = {
  wifi: '📶', kitchen: '🍳', pool: '🏊', gym: '🏋️', parking: '🅿️',
  'free parking': '🅿️', fireplace: '🔥', 'hot tub': '♨️', 'beach access': '🏖️',
  bbq: '🍖', washer: '🧺', 'air conditioning': '❄️', doorman: '🚪',
  concierge: '🛎️', 'ski storage': '⛷️', 'valet parking': '🚗',
  'gym access': '🏋️',
};

export default function LocationPage() {
  const { location } = useParams();
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState({
    type: '',
    minPrice: '',
    maxPrice: '',
    guests: ''
  });

  const fetchListings = async (currentFilter = filter) => {
    setLoading(true);
    setError('');

    try {
      const params = { location };
      if (currentFilter.type) params.type = currentFilter.type;
      if (currentFilter.minPrice !== '') params.minPrice = currentFilter.minPrice;
      if (currentFilter.maxPrice !== '') params.maxPrice = currentFilter.maxPrice;
      if (currentFilter.guests !== '') params.guests = currentFilter.guests;

    const { data } = await axios.get('/api/accommodations', { params });
    setListings(Array.isArray(data) ? data : data?.data || []);
    console.log('response data:',  data , Array.isArray(data));
    } catch (err) {
      setError('Failed to load listings. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchListings();
  }, [location]);

  const handleFilterApply = (e) => {
    e.preventDefault();
    fetchListings(filter);
  };

  const handleFilterReset = () => {
    const clearedFilter = { type: '', minPrice: '', maxPrice: '', guests: '' };
    setFilter(clearedFilter);
    fetchListings(clearedFilter);
  };

  return (
    <div className="location-page">
      {/* Filter Bar */}
      <div className="filter-bar">
        <div className="container filter-inner">
          <form className="filter-form" onSubmit={handleFilterApply}>
            <select
              value={filter.type}
              onChange={(e) => setFilter({ ...filter, type: e.target.value })}
            >
              <option value="">All Types</option>
              <option>Entire apartment</option>
              <option>Entire house</option>
              <option>Entire villa</option>
              <option>Private room</option>
              <option>Shared room</option>
            </select>

            <input
              type="number"
              placeholder="Min price"
              value={filter.minPrice}
              onChange={(e) => setFilter({ ...filter, minPrice: e.target.value })}
            />
            <input
              type="number"
              placeholder="Max price"
              value={filter.maxPrice}
              onChange={(e) => setFilter({ ...filter, maxPrice: e.target.value })}
            />
            <input
              type="number"
              placeholder="Guests"
              min="1"
              value={filter.guests}
              onChange={(e) => setFilter({ ...filter, guests: e.target.value })}
            />
            <button type="submit" className="btn btn-primary filter-btn">Filter</button>
            <button type="button" className="btn btn-outline filter-btn" onClick={handleFilterReset}>Reset</button>
          </form>
        </div>
      </div>

      <div className="container location-content">
        {/* Heading */}
        <div className="location-heading">
          <h1>{listings.length} accommodation{listings.length !== 1 ? 's' : ''} in <span>{decodeURIComponent(location)}</span></h1>
        </div>

        {/* Loading */}
        {loading && (
          <div className="loading-grid">
            {[1, 2, 3, 4].map(i => <div key={i} className="skeleton-card" />)}
          </div>
        )}

        {/* Error */}
        {error && <div className="error-msg">{error}</div>}

        {/* No results */}
        {!loading && !error && listings.length === 0 && (
          <div className="no-results">
            <div className="no-results-icon">🔍</div>
            <h2>No listings found in {decodeURIComponent(location)}</h2>
            <p>Try adjusting your filters or search a different location.</p>
          </div>
        )}

        {/* Listing Cards */}
        {!loading && !error && (
          <div className="listings-list">
            {listings.map((listing) => (
              <Link to={`/listing/${listing._id}`} key={listing._id} className="listing-card">
                {/* Image */}
                <div className="listing-img">
                  <img
                    src={listing.images?.[0] || 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=500'}
                    alt={listing.title}
                  />
                  <span className="listing-type-badge">{listing.type}</span>
                </div>

                {/* Details */}
                <div className="listing-details">
                  <div className="listing-top">
                    <div>
                      <span className="listing-location">📍 {listing.location}</span>
                      <h3 className="listing-title">{listing.title}</h3>
                    </div>
                    <div className="listing-rating">
                      ⭐ <strong>{listing.rating.toFixed(1)}</strong>
                      <span className="rating-count">({listing.reviews})</span>
                    </div>
                  </div>

                  <div className="listing-meta">
                    <span>🛏 {listing.bedrooms} bed{listing.bedrooms !== 1 ? 's' : ''}</span>
                    <span>🚿 {listing.bathrooms} bath{listing.bathrooms !== 1 ? 's' : ''}</span>
                    <span>👥 {listing.guests} guests</span>
                  </div>

                  <div className="listing-amenities">
                    {listing.amenities?.slice(0, 4).map((a) => (
                      <span key={a} className="amenity-pill">
                        {AMENITY_ICONS[a.toLowerCase()] || '✓'} {a}
                      </span>
            ))}
                    {listing.amenities?.length > 4 && (
                      <span className="amenity-pill">+{listing.amenities.length - 4} more</span>
                    )}
                  </div>

                  <div className="listing-price">
                    <span className="price-amount">${listing.price}</span>
                    <span className="price-night"> / night</span>
                    {listing.weeklyDiscount > 0 && (
                      <span className="discount-badge">{listing.weeklyDiscount}% weekly discount</span>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
