import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Header from './components/Header';
import HomePage from './pages/HomePage';
import LocationPage from './pages/LocationPage';
import LocationDetailsPage from './pages/LocationDetailsPage';
import LoginPage from './pages/LoginPage';
import ReservationsPage from './pages/ReservationsPage';

const PrivateRoute = ({ children }) => {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <div className="app">
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/locations/:location" element={<LocationPage />} />
        <Route path="/listing/:id" element={<LocationDetailsPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/reservations" element={<PrivateRoute><ReservationsPage /></PrivateRoute>} />
      </Routes>
    </div>
  );
}

export default App;
