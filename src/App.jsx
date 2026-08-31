import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet, useLocation, Navigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import BookingPage from './pages/BookingPage';
import PricingPage from './pages/PricingPage';
import DropBoxPage from './pages/DropBoxPage';
import ContactPage from './pages/ContactPage';
import CRMPage from './pages/CRMPage';
import LoginPage from './pages/LoginPage';
import SettingsPage from './pages/SettingsPage';
import PickupPage from './pages/PickupPage';
import LookupPage from './pages/LookupPage';
import ProtectedRoute from './components/ProtectedRoute';
import './App.css';

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
};

const PublicLayout = () => (
  <div className="min-h-screen bg-carbon-black flex flex-col">
    <Header />
    <main className="flex-1 flex flex-col"><Outlet /></main>
    <Footer />
  </div>
);

function App() {
  return (
    <Router>
      <ScrollToTop />
      <AnimatePresence mode="wait">
        <Routes>
          <Route element={<PublicLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/appointments" element={<BookingPage />} />
            <Route path="/book" element={<Navigate to="/appointments" replace />} />
            <Route path="/appointment" element={<Navigate to="/appointments" replace />} />
            <Route path="/pricing" element={<PricingPage />} />
            <Route path="/dropbox" element={<DropBoxPage />} />
            <Route path="/lookup" element={<LookupPage />} />
            <Route path="/contact" element={<ContactPage />} />
          </Route>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/pickup" element={<PickupPage />} />
          <Route path="/crm" element={<ProtectedRoute><CRMPage /></ProtectedRoute>} />
          <Route path="/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
        </Routes>
      </AnimatePresence>
    </Router>
  );
}

export default App;
