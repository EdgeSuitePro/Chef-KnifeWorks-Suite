import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SafeIcon from '../common/SafeIcon';
import { API_BASE_URL } from '../config';
import * as FiIcons from 'react-icons/fi';

const { FiSearch, FiCheckCircle, FiPackage, FiUser, FiAlertCircle, FiHome, FiDollarSign, FiCreditCard } = FiIcons;

const PickupPage = () => {
  const [lookupData, setLookupData] = useState({ phone: '', email: '', reservationId: '' });
  const [foundReservation, setFoundReservation] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [step, setStep] = useState('lookup'); // lookup, confirm, complete
  const [error, setError] = useState('');
  const [serverStatus, setServerStatus] = useState('unknown');
  const [marketingTriggered, setMarketingTriggered] = useState(false);

  // 1. Check for ?id= in URL on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const idParam = params.get('id');
    
    // Test server connection
    const testConnection = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/test`);
        if (response.ok) {
          setServerStatus('connected');
          // If we have an ID and a connection, auto-lookup
          if (idParam) {
            setLookupData(prev => ({ ...prev, reservationId: idParam }));
            executeLookup(idParam, 'connected');
          }
        }
      } catch (error) {
        setServerStatus('disconnected');
        // Fallback for ID lookup if offline (local storage)
        if (idParam) {
           setLookupData(prev => ({ ...prev, reservationId: idParam }));
           executeLookup(idParam, 'disconnected');
        }
      }
    };
    testConnection();
  }, []);

  const handleLookupChange = (e) => {
    setLookupData({ ...lookupData, [e.target.name]: e.target.value });
  };

  // Separated lookup logic for reuse
  const executeLookup = async (id, status) => {
    setIsProcessing(true);
    setError('');
    let found = null;
    const searchId = id ? id.toUpperCase() : lookupData.reservationId.toUpperCase();

    try {
      // 1. Server Lookup
      if (status === 'connected') {
        if (searchId) {
          const response = await fetch(`${API_BASE_URL}/reservations/${searchId}`);
          if (response.ok) found = await response.json();
        } else if (lookupData.email || lookupData.phone) {
          const response = await fetch(`${API_BASE_URL}/reservations`);
          if (response.ok) {
            const reservations = await response.json();
            found = reservations.find(res => 
              (lookupData.phone && res.phone === lookupData.phone) ||
              (lookupData.email && res.email.toLowerCase() === lookupData.email.toLowerCase())
            );
          }
        }
      }

      // 2. Local Storage Lookup
      if (!found) {
        const allReservations = [];
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key && key.startsWith('reservation_')) {
            try {
              allReservations.push(JSON.parse(localStorage.getItem(key)));
            } catch (e) {
              // Ignore invalid JSON in local storage
            }
          }
        }
        found = allReservations.find(res => {
          return (searchId && res.id === searchId) ||
                 (lookupData.phone && res.phone === lookupData.phone) ||
                 (lookupData.email && res.email.toLowerCase() === lookupData.email.toLowerCase());
        });
      }

      // 3. Process Result
      if (found) {
        if (found.status === 'ready' || found.status === 'finished') {
          setFoundReservation(found);
          setStep('confirm');
        } else if (found.status === 'picked-up') {
          setError('This reservation has already been picked up.');
        } else {
          setError(`Order is currently "${found.status}". Not ready for pickup yet.`);
        }
      } else {
        setError('No reservation found.');
      }
    } catch (e) {
      console.error(e);
      setError('Error looking up reservation.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleLookupSubmit = (e) => {
    e.preventDefault();
    executeLookup(null, serverStatus);
  };

  const handleConfirmPickup = async () => {
    setIsProcessing(true);
    try {
      if (serverStatus === 'connected') {
        await fetch(`${API_BASE_URL}/reservations/${foundReservation.id}/status`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: 'picked-up' })
        });
        await fetch(`${API_BASE_URL}/notify/pickup`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ reservationId: foundReservation.id })
        });
      } else {
        const storageKey = `reservation_${foundReservation.id}`;
        const updated = { ...foundReservation, status: 'picked-up', updated_at: new Date().toISOString() };
        localStorage.setItem(storageKey, JSON.stringify(updated));
      }
      setMarketingTriggered(true);
      setStep('complete');
    } catch (error) {
      setError('Failed to complete pickup process.');
    } finally {
      setIsProcessing(false);
    }
  };

  const resetLookup = () => {
    setLookupData({ phone: '', email: '', reservationId: '' });
    setFoundReservation(null);
    setStep('lookup');
    setError('');
    // Clear URL param if reset
    window.history.pushState({}, '', window.location.pathname);
  };

  const isPaid = foundReservation?.invoice?.payment_status === 'paid';
  const hasInvoice = !!foundReservation?.invoice;

  return (
    <div className="min-h-screen bg-carbon-black text-whetstone-cream flex flex-col">
      <div className="flex-1 flex flex-col justify-center py-12 px-4">
        <div className="max-w-lg mx-auto w-full">
          <div className="text-center mb-8">
            <h1 className="font-serif font-bold text-3xl text-whetstone-cream mb-2">Pickup Kiosk</h1>
            <p className="text-gray-400">Securely retrieve your sharpened knives</p>
          </div>

          <AnimatePresence mode="wait">
            {step === 'lookup' && (
              <motion.div 
                key="lookup"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="card bg-steel-gray"
              >
                <div className="w-16 h-16 bg-honed-sage rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <SafeIcon icon={FiSearch} className="w-8 h-8 text-white" />
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
                  
                  <div className="space-y-4">
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
                    disabled={isProcessing}
                    className="w-full btn-primary py-4 text-lg font-bold shadow-lg flex items-center justify-center space-x-2"
                  >
                    {isProcessing ? 'Searching...' : 'Find Order'}
                  </button>
                </form>
              </motion.div>
            )}

            {step === 'confirm' && foundReservation && (
              <motion.div 
                key="confirm"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="card bg-steel-gray text-center"
              >
                <div className="w-20 h-20 bg-damascus-bronze rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <SafeIcon icon={FiPackage} className="w-10 h-10 text-white" />
                </div>
                
                <h2 className="font-serif font-bold text-2xl text-whetstone-cream mb-2">
                  Order Ready for Pickup!
                </h2>
                <div className="inline-block px-4 py-1 rounded-full bg-honed-sage/20 text-honed-sage text-sm font-bold border border-honed-sage/30 mb-6">
                  {foundReservation.id}
                </div>

                <div className="bg-carbon-black/50 rounded-xl p-6 mb-6 text-left border border-white/10">
                  <div className="flex items-center space-x-3 mb-4">
                    <SafeIcon icon={FiUser} className="text-gray-400" />
                    <span className="text-whetstone-cream font-semibold">
                      {foundReservation.customer_name || foundReservation.name}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm border-t border-white/10 pt-4">
                    <span className="text-gray-400">Quantity</span>
                    <span className="text-whetstone-cream font-bold">{foundReservation.knife_quantity} Knives</span>
                  </div>
                </div>

                <div className="bg-whetstone-cream text-carbon-black rounded-xl p-6 mb-8 text-left shadow-lg">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold text-lg flex items-center">
                      <SafeIcon icon={FiDollarSign} className="mr-2 text-damascus-bronze" />
                      Payment Status
                    </h3>
                    {isPaid ? (
                      <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-bold border border-green-200 flex items-center">
                        <SafeIcon icon={FiCheckCircle} className="mr-1" /> PAID
                      </span>
                    ) : (
                      <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-xs font-bold border border-yellow-200 flex items-center">
                        <SafeIcon icon={FiAlertCircle} className="mr-1" /> PENDING
                      </span>
                    )}
                  </div>

                  {hasInvoice ? (
                    <div className="space-y-4">
                      <div className="flex justify-between items-end border-b border-gray-200 pb-4">
                        <span className="text-sm text-gray-600">Total Due</span>
                        <span className="text-2xl font-bold text-carbon-black">
                          ${foundReservation.invoice.total_amount.toFixed(2)}
                        </span>
                      </div>
                      {!isPaid && (
                        <a 
                          href={foundReservation.invoice.invoice_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block w-full bg-[#0070BA] hover:bg-[#003087] text-white text-center font-bold py-3 rounded-lg transition-colors shadow-md flex items-center justify-center space-x-2"
                        >
                          <SafeIcon icon={FiCreditCard} />
                          <span>Pay Now via PayPal</span>
                        </a>
                      )}
                      {isPaid && (
                        <div className="text-center text-sm text-green-600 font-medium">
                          Thank you for your payment via {foundReservation.invoice.payment_method}.
                        </div>
                      )}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500 italic text-center">
                      Invoice is being finalized. Please check back shortly.
                    </p>
                  )}
                </div>

                <div className="space-y-4">
                  <button 
                    onClick={handleConfirmPickup}
                    disabled={isProcessing}
                    className={`w-full btn-primary py-4 text-lg font-bold shadow-lg ${!isPaid && hasInvoice ? 'opacity-90' : ''}`}
                  >
                    {isProcessing ? 'Processing...' : 'I Have Retrieved My Knives'}
                  </button>
                  <button onClick={resetLookup} className="w-full btn-secondary py-3">
                    Cancel / Wrong Order
                  </button>
                </div>
              </motion.div>
            )}

            {step === 'complete' && (
              <motion.div 
                key="complete"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="card bg-steel-gray text-center"
              >
                <div className="w-20 h-20 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <SafeIcon icon={FiCheckCircle} className="w-10 h-10 text-white" />
                </div>
                <h2 className="font-serif font-bold text-3xl text-whetstone-cream mb-4">
                  Pickup Confirmed
                </h2>
                <p className="text-gray-300 mb-8">
                  Thank you for choosing Chef KnifeWorks!
                </p>
                <a href="/" className="btn-primary inline-flex items-center space-x-2 px-8 py-3">
                  <SafeIcon icon={FiHome} />
                  <span>Return Home</span>
                </a>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default PickupPage;