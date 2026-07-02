import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import ListingForm from '../components/ListingForm';

const API_URL = 'https://zaio-assignment-tdmairbnb-d989e8ad01ac.herokuapp.com';

export default function EditListingPage() {
  const { id } = useParams();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await axios.get(`${API_URL}/api/accommodations/${id}`);
        setListing(data);
      } catch {
        setError('Failed to load listing. It may have been deleted.');
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [id]);

  const handleSubmit = async (formData) => {
    await axios.put(`${API_URL}/api/accommodations/${id}`, formData);
  };

  if (loading) return <div style={{ padding: 48, textAlign: 'center', color: 'var(--gray)' }}>Loading listing...</div>;
  if (error) return <div className="error-banner" style={{ margin: 24 }}>{error}</div>;

  return (
    <div>
      <div className="page-header">
        <h1>Edit Listing</h1>
      </div>
      <div className="card">
        <ListingForm initial={listing} onSubmit={handleSubmit} submitLabel="Save Changes" />
      </div>
    </div>
  );
}
