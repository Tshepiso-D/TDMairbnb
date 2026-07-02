import React from 'react';
import axios from 'axios';
import ListingForm from '../components/ListingForm';

const API_URL = 'https://zaio-assignment-tdmairbnb-d989e8ad01ac.herokuapp.com';

export default function CreateListingPage() {
  const handleSubmit = async (formData) => {
    await axios.post(`${API_URL}/api/accommodations`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  };

  return (
    <div>
      <div className="page-header">
        <h1>Create New Listing</h1>
      </div>
      <div className="card">
        <ListingForm onSubmit={handleSubmit} submitLabel="Create Listing" />
      </div>
    </div>
  );
}
