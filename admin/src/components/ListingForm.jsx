import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './ListingForm.css';

const AMENITY_OPTIONS = [
  'wifi', 'kitchen', 'pool', 'gym', 'free parking', 'air conditioning',
  'washer', 'hot tub', 'beach access', 'fireplace', 'bbq', 'ski storage',
  'doorman', 'concierge', 'valet parking', 'gym access',
];

const INITIAL = {
  title: '', location: '', description: '', type: 'Entire apartment',
  bedrooms: 1, bathrooms: 1, guests: 1, price: '',
  amenities: [], weeklyDiscount: 0, cleaningFee: 0,
  serviceFee: 0, occupancyTaxes: 0,
  enhancedCleaning: false, selfCheckIn: false,
};

export default function ListingForm({ initial = {}, onSubmit, submitLabel = 'Create Listing' }) {
  const navigate = useNavigate();
  const [form, setForm] = useState({ ...INITIAL, ...initial });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState('');
  const [success, setSuccess] = useState('');
  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState(initial.images || []);

  const validate = () => {
    const errs = {};
    if (!form.title.trim()) errs.title = 'Title is required';
    if (!form.location.trim()) errs.location = 'Location is required';
    if (!form.description.trim()) errs.description = 'Description is required';
    if (!form.price || form.price <= 0) errs.price = 'Price must be greater than 0';
    return errs;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === 'checkbox' ? checked : value });
    setErrors({ ...errors, [name]: '' });
  };

  const handleAmenity = (a) => {
    setForm({
      ...form,
      amenities: form.amenities.includes(a)
        ? form.amenities.filter((x) => x !== a)
        : [...form.amenities, a],
    });
  };

  const handleImages = (e) => {
    const files = Array.from(e.target.files);
    setImageFiles(files);
    setImagePreviews(files.map((f) => URL.createObjectURL(f)));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }

    setLoading(true);
    setServerError('');
    setSuccess('');

    try {
      const formData = new FormData();
      Object.entries(form).forEach(([key, val]) => {
        if (key === 'amenities') {
          val.forEach((a) => formData.append('amenities', a));
        } else {
          formData.append(key, val);
        }
      });
      imageFiles.forEach((f) => formData.append('images', f));

      await onSubmit(formData);
      setSuccess('Listing saved successfully!');
      setTimeout(() => navigate('/listings'), 1200);
    } catch (err) {
      setServerError(err.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="listing-form" encType="multipart/form-data">
      {serverError && <div className="error-banner">{serverError}</div>}
      {success && <div className="success-banner">{success}</div>}

      <div className="form-grid-2">
        {/* Title */}
        <div className="form-group span-2">
          <label>Title *</label>
          <input name="title" value={form.title} onChange={handleChange} placeholder="Modern Apartment in New York" className={errors.title ? 'input-error' : ''} />
          {errors.title && <span className="field-error">{errors.title}</span>}
        </div>

        {/* Location */}
        <div className="form-group">
          <label>Location *</label>
          <input name="location" value={form.location} onChange={handleChange} placeholder="New York" className={errors.location ? 'input-error' : ''} />
          {errors.location && <span className="field-error">{errors.location}</span>}
        </div>

        {/* Type */}
        <div className="form-group">
          <label>Property Type *</label>
          <select name="type" value={form.type} onChange={handleChange}>
            <option>Entire apartment</option>
            <option>Entire house</option>
            <option>Entire villa</option>
            <option>Private room</option>
            <option>Shared room</option>
          </select>
        </div>

        {/* Description */}
        <div className="form-group span-2">
          <label>Description *</label>
          <textarea name="description" value={form.description} onChange={handleChange} placeholder="Describe your property..." rows={4} className={errors.description ? 'input-error' : ''} />
          {errors.description && <span className="field-error">{errors.description}</span>}
        </div>

        {/* Bedrooms / Bathrooms / Guests */}
        <div className="form-group">
          <label>Bedrooms</label>
          <input type="number" name="bedrooms" value={form.bedrooms} onChange={handleChange} min="0" max="20" />
        </div>
        <div className="form-group">
          <label>Bathrooms</label>
          <input type="number" name="bathrooms" value={form.bathrooms} onChange={handleChange} min="0" max="20" />
        </div>
        <div className="form-group">
          <label>Max Guests</label>
          <input type="number" name="guests" value={form.guests} onChange={handleChange} min="1" max="50" />
        </div>

        {/* Price */}
        <div className="form-group">
          <label>Price per Night ($) *</label>
          <input type="number" name="price" value={form.price} onChange={handleChange} placeholder="150" min="1" className={errors.price ? 'input-error' : ''} />
          {errors.price && <span className="field-error">{errors.price}</span>}
        </div>

        {/* Fees */}
        <div className="form-group">
          <label>Weekly Discount (%)</label>
          <input type="number" name="weeklyDiscount" value={form.weeklyDiscount} onChange={handleChange} min="0" max="100" />
        </div>
        <div className="form-group">
          <label>Cleaning Fee ($)</label>
          <input type="number" name="cleaningFee" value={form.cleaningFee} onChange={handleChange} min="0" />
        </div>
        <div className="form-group">
          <label>Service Fee ($)</label>
          <input type="number" name="serviceFee" value={form.serviceFee} onChange={handleChange} min="0" />
        </div>
        <div className="form-group">
          <label>Occupancy Taxes ($)</label>
          <input type="number" name="occupancyTaxes" value={form.occupancyTaxes} onChange={handleChange} min="0" />
        </div>
      </div>

      {/* Amenities */}
      <div className="form-group">
        <label>Amenities</label>
        <div className="amenities-picker">
          {AMENITY_OPTIONS.map((a) => (
            <button
              type="button"
              key={a}
              className={`amenity-toggle ${form.amenities.includes(a) ? 'selected' : ''}`}
              onClick={() => handleAmenity(a)}
            >
              {a}
            </button>
          ))}
        </div>
      </div>

      {/* Checkboxes */}
      <div className="checkbox-row">
        <label className="checkbox-label">
          <input type="checkbox" name="enhancedCleaning" checked={form.enhancedCleaning} onChange={handleChange} />
          Enhanced Cleaning
        </label>
        <label className="checkbox-label">
          <input type="checkbox" name="selfCheckIn" checked={form.selfCheckIn} onChange={handleChange} />
          Self Check-in
        </label>
      </div>

      {/* Images */}
      <div className="form-group">
        <label>Images</label>
        <div className="image-upload-area" onClick={() => document.getElementById('imgInput').click()}>
          <input id="imgInput" type="file" multiple accept="image/*" onChange={handleImages} style={{ display: 'none' }} />
          <span>📷 Click to upload images</span>
          <span className="upload-sub">JPG, PNG, GIF up to 5MB each</span>
        </div>
        {imagePreviews.length > 0 && (
          <div className="image-previews">
            {imagePreviews.map((src, i) => (
              <img key={i} src={src} alt={`preview ${i}`} className="img-preview" />
            ))}
          </div>
        )}
      </div>

      {/* Submit */}
      <div className="form-actions">
        <button type="button" className="btn btn-outline" onClick={() => navigate('/listings')}>Cancel</button>
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Saving...' : submitLabel}
        </button>
      </div>
    </form>
  );
}
