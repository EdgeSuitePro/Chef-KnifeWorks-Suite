import React, { useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Outlet, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Header from './components/Header';
import Footer from './components/Footer';
import BottomNav from './components/BottomNav';
import HomePage from './pages/HomePage';
import PricingPage from './pages/PricingPage';
import AppointmentPage from './pages/AppointmentPage';
import DropBoxPage from './pages/DropBoxPage';
import ContactPage from './pages/ContactPage';
import CRMPage from './pages/CRMPage';
import LoginPage from './pages/LoginPage';
import SettingsPage from './pages/SettingsPage';
import PickupPage from './pages/PickupPage';
import LookupPage from './pages/LookupPage'; 

import ProtectedRoute from './components/ProtectedRoute';
import './App.css';

// Component to handle scrolling to top on route change
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

// Layout for public pages that need Header and Footer
const PublicLayout = () => {
  return (
    <div className="min-h-screen bg-whetstone-cream flex flex-col">
      <Header />
      <main className="flex-1 flex flex-col">
        <Outlet />
      </main>
      <Footer />
      <BottomNav />
    </div>
  );
};

function App() {
  return (
    <Router>
      <ScrollToTop />
      <AnimatePresence mode="wait">
        <Routes>
          {/* Public Routes wrapped in Layout */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/pricing" element={<PricingPage />} />
            <Route path="/appointment" element={<AppointmentPage />} />
            <Route path="/dropbox" element={<DropBoxPage />} />
            <Route path="/lookup" element={<LookupPage />} />
            <Route path="/contact" element={<ContactPage />} />
          </Route>
          
          {/* Standalone Routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/pickup" element={<PickupPage />} />
          
          {/* Protected CRM Routes */}
          <Route 
            path="/crm" 
            element={
              <ProtectedRoute>
                <CRMPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/settings" 
            element={
              <ProtectedRoute>
                <SettingsPage />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </AnimatePresence>
    </Router>
  );
}

export default App;