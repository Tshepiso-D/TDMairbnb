import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import AdminHeader from './components/AdminHeader';
import AdminSidebar from './components/AdminSidebar';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import ListingsPage from './pages/ListingsPage';
import CreateListingPage from './pages/CreateListingPage';
import EditListingPage from './pages/EditListingPage';
import ReservationsPage from './pages/ReservationsPage';
import './App.css';

const ProtectedLayout = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="admin-loading">Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  return (
    <div className="admin-layout">
      <AdminHeader />
      <div className="admin-body">
        <AdminSidebar />
        <main className="admin-main">{children}</main>
      </div>
    </div>
  );
};

function App() {
  const { user } = useAuth();
  return (
    <Routes>
      <Route path="/login" element={user ? <Navigate to="/" /> : <LoginPage />} />
      <Route path="/" element={<ProtectedLayout><DashboardPage /></ProtectedLayout>} />
      <Route path="/listings" element={<ProtectedLayout><ListingsPage /></ProtectedLayout>} />
      <Route path="/listings/create" element={<ProtectedLayout><CreateListingPage /></ProtectedLayout>} />
      <Route path="/listings/edit/:id" element={<ProtectedLayout><EditListingPage /></ProtectedLayout>} />
      <Route path="/reservations" element={<ProtectedLayout><ReservationsPage /></ProtectedLayout>} />
    </Routes>
  );
}

export default App;