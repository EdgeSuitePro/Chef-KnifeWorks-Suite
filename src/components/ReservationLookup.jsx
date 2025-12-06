import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiSearch, FiCalendar, FiClock, FiAlertCircle, FiUser, FiFileText, FiMapPin } = FiIcons;

const ReservationLookup = () => {
  const [lookupData, setLookupData] = useState({ phone: '', email: '', reservationId: '' });
  const [foundReservation, setFoundReservation] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');
  const [serverStatus, setServerStatus] = useState('unknown');

  // Test server connection on mount
  useEffect(() => {
    const testConnection = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/test');
        if (response.ok) {
          setServerStatus('connected');
        }
      } catch (error) {
        setServerStatus('disconnected');
      }
    };
    testConnection();
  }, []);

  const handleLookupChange = (e) => {
    setLookupData({ ...lookupData, [e.target.name]: e.target.value });
  };

  const handleLookupSubmit = async (e) => {
    e.preventDefault();
    setIsProcessing(true);
    setError('');
    setFoundReservation(null);

    try {
      let found = null;

      // 1. Try Server Lookup
      if (serverStatus === 'connected') {
        if (lookupData.reservationId) {
          const response = await fetch(`http://localhost:3001/api/reservations/${lookupData.reservationId.toUpperCase()}`);
          if (response.ok) {
            found = await response.json();
          }
        } else if (lookupData.email || lookupData.phone) {
          const response = await fetch('http://localhost:3001/api/reservations');
          if (response.ok) {
            const reservations = await response.json();
            found = reservations.find(res => 
              (lookupData.phone && res.phone === lookupData.phone) ||
              (lookupData.email && res.email.toLowerCase() === lookupData.email.toLowerCase())
            );
          }
        }
      }

      // 2. Try Local Storage Lookup (Fallback)
      if (!found) {
        const allReservations = [];
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key && key.startsWith('reservation_')) {
            try {
              const reservation = JSON.parse(localStorage.getItem(key));
              allReservations.push(reservation);
            } catch (error) {
              // ignore invalid
            }
          }
        }

        found = allReservations.find(res => {
          const matchesId = lookupData.reservationId && res.id === lookupData.reservationId.toUpperCase();
          const matchesPhone = lookupData.phone && res.phone === lookupData.phone;
          const matchesEmail = lookupData.email && res.email.toLowerCase() === lookupData.email.toLowerCase();
          return matchesId || matchesPhone || matchesEmail;
        });
      }

      if (found) {
        setFoundReservation(found);
      } else {
        setError('No reservation found matching your information.');
      }
    } catch (error) {
      console.error('Error looking up reservation:', error);
      setError('Error looking up reservation. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const resetLookup = () => {
    setLookupData({ phone: '', email: '', reservationId: '' });
    setFoundReservation(null);
    setError('');
  };

  return (
    <div className="max-w-lg mx-auto">
      <AnimatePresence mode="wait">
        {!foundReservation ? (
          <motion.div
            key="lookup-form"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="card bg-steel-gray"
          >
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-honed-sage rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <SafeIcon icon={FiSearch} className="w-8 h-8 text-white" />
              </div>
              <h2 className="font-serif font-bold text-2xl text-whetstone-cream mb-2">Find Your Reservation</h2>
              <p className="text-gray-300 text-sm">Enter your details to check status and instructions</p>
            </div>

            <form onSubmit={handleLookupSubmit} className="space-y-6">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
                  Reservation ID
                </label>
                <input 
                  type="text" 
                  name="reservationId" 
                  value={lookupData.reservationId} 
                  onChange={handleLookupChange} 
                  className="w-full px-4 py-4 border-2 border-gray-500 rounded-xl focus:ring-4 focus:ring-honed-sage/20 focus:border-honed-sage text-center font-mono text-xl tracking-widest uppercase placeholder:normal-case placeholder:font-sans placeholder:text-gray-500 transition-all bg-carbon-black/50 text-white" 
                  placeholder="ABC123"
                />
              </div>

              <div className="relative flex py-2 items-center">
                <div className="flex-grow border-t border-gray-600"></div>
                <span className="flex-shrink-0 mx-4 text-gray-500 text-xs uppercase">Or Search By</span>
                <div className="flex-grow border-t border-gray-600"></div>
              </div>

              <div className="grid grid-cols-1 gap-4">
                <input 
                  type="email" 
                  name="email" 
                  value={lookupData.email} 
                  onChange={handleLookupChange} 
                  className="w-full px-4 py-3 border border-gray-500 rounded-lg focus:ring-2 focus:ring-honed-sage focus:border-transparent text-center bg-carbon-black/50 text-white" 
                  placeholder="Email Address"
                />
                 <input 
                  type="tel" 
                  name="phone" 
                  value={lookupData.phone} 
                  onChange={handleLookupChange} 
                  className="w-full px-4 py-3 border border-gray-500 rounded-lg focus:ring-2 focus:ring-honed-sage focus:border-transparent text-center bg-carbon-black/50 text-white" 
                  placeholder="Phone Number"
                />
              </div>

              {error && (
                <div className="bg-red-900/30 border border-red-800 rounded-lg p-4 flex items-center space-x-3">
                  <SafeIcon icon={FiAlertCircle} className="w-5 h-5 text-red-400 flex-shrink-0" />
                  <span className="text-red-300 text-sm font-medium">{error}</span>
                </div>
              )}

              <button 
                type="submit" 
                disabled={isProcessing || (!lookupData.reservationId && !lookupData.phone && !lookupData.email)}
                className="w-full btn-primary py-4 text-lg font-bold shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                {isProcessing ? 'Searching...' : 'Look Up'}
              </button>
            </form>
          </motion.div>
        ) : (
          <motion.div
            key="details"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="card bg-steel-gray"
          >
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center px-4 py-1 bg-honed-sage/20 text-honed-sage rounded-full text-sm font-bold mb-4 border border-honed-sage/30 uppercase tracking-wider">
                {foundReservation.status}
              </div>
              <h2 className="font-serif font-bold text-2xl text-whetstone-cream mb-2">Reservation Details</h2>
              <p className="text-gray-400 font-mono text-lg">{foundReservation.id}</p>
            </div>

            <div className="bg-carbon-black/50 rounded-xl p-6 mb-6 border border-white/10 space-y-4">
              <div className="flex items-start space-x-3">
                <SafeIcon icon={FiUser} className="w-5 h-5 text-damascus-bronze mt-0.5" />
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wider">Customer</p>
                  <p className="text-whetstone-cream font-semibold">{foundReservation.customer_name || foundReservation.name}</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <SafeIcon icon={FiCalendar} className="w-5 h-5 text-damascus-bronze mt-0.5" />
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wider">Drop-Off Time</p>
                  <p className="text-whetstone-cream font-semibold">
                    {foundReservation.drop_off_date || foundReservation.dropOffDate}<br/>
                    <span className="text-gray-300 font-normal">{foundReservation.drop_off_time || foundReservation.selectedSlot}</span>
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <SafeIcon icon={FiMapPin} className="w-5 h-5 text-damascus-bronze mt-0.5" />
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wider">Location</p>
                  <p className="text-whetstone-cream font-semibold">
                    13969 88th Place North<br/>
                    <span className="text-gray-300 font-normal">Maple Grove, MN 55369</span>
                  </p>
                  <a 
                    href="https://www.google.com/maps/search/?api=1&query=13969+88th+Place+North+Maple+Grove+MN+55369" 
                    target="_blank" 
                    rel="noreferrer"
                    className="text-xs text-honed-sage underline mt-1 block"
                  >
                    Get Directions
                  </a>
                </div>
              </div>

              {foundReservation.notes && (
                <div className="flex items-start space-x-3 pt-2 border-t border-white/5">
                  <SafeIcon icon={FiFileText} className="w-5 h-5 text-gray-500 mt-0.5" />
                  <div>
                    <p className="text-xs text-gray-400 uppercase tracking-wider">Notes</p>
                    <p className="text-gray-300 italic text-sm">"{foundReservation.notes}"</p>
                  </div>
                </div>
              )}
            </div>

            <button onClick={resetLookup} className="w-full btn-secondary py-3">
              Check Another ID
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ReservationLookup;