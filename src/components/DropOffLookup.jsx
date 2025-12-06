import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiSearch, FiCheckCircle, FiCamera, FiUpload, FiX, FiUser, FiMinus, FiPlus, FiAlertCircle } = FiIcons;

const DropOffLookup = () => {
  const [lookupData, setLookupData] = useState({ phone: '', email: '', reservationId: '' });
  const [foundReservation, setFoundReservation] = useState(null);
  const [uploadedPhotos, setUploadedPhotos] = useState([]);
  const [showReceipt, setShowReceipt] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [actualQuantity, setActualQuantity] = useState('');
  const [step, setStep] = useState('lookup'); // lookup, confirm, photos, complete
  const [qrError, setQrError] = useState('');
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

  // Check for QR/NFC parameters in URL
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const reservationId = urlParams.get('id');
    const phone = urlParams.get('phone');
    const email = urlParams.get('email');

    if (reservationId) {
      setLookupData({ reservationId: reservationId.toUpperCase() });
      setTimeout(() => {
        handleLookupSubmit(null);
      }, 500);
    } else if (phone || email) {
      setLookupData({ phone: phone || '', email: email || '', reservationId: '' });
    }
  }, []);

  const handleLookupChange = (e) => {
    setLookupData({ ...lookupData, [e.target.name]: e.target.value });
  };

  const normalizeReservation = (reservation) => {
    return {
      ...reservation,
      id: reservation.id || '',
      customer_name: reservation.customer_name || reservation.name || '',
      email: reservation.email || '',
      phone: reservation.phone || '',
      knife_quantity: reservation.knife_quantity || reservation.knifeQty || '',
      drop_off_date: reservation.drop_off_date || reservation.dropOffDate || '',
      drop_off_time: reservation.drop_off_time || reservation.selectedSlot || '',
      pickup_date: reservation.pickup_date || reservation.pickupDate || '',
      status: reservation.status || 'booked',
      photos: reservation.photos || [],
      notes: reservation.notes || '',
      created_at: reservation.createdAt || reservation.created_at || new Date().toISOString()
    };
  };

  const handleLookupSubmit = async (e) => {
    if (e) e.preventDefault();
    setIsProcessing(true);
    setQrError('');

    try {
      let found = null;

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

      if (!found) {
        const allReservations = [];
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key && key.startsWith('reservation_')) {
            try {
              const reservation = JSON.parse(localStorage.getItem(key));
              allReservations.push(reservation);
            } catch (error) { 
              console.warn('Skipping invalid reservation key', key);
            }
          }
        }
        found = allReservations.find(res => {
          const normalized = normalizeReservation(res);
          return (lookupData.phone && normalized.phone === lookupData.phone) ||
                 (lookupData.email && normalized.email.toLowerCase() === lookupData.email.toLowerCase()) ||
                 (lookupData.reservationId && res.id === lookupData.reservationId.toUpperCase());
        });
      }

      if (found) {
        const normalized = normalizeReservation(found);
        setFoundReservation(normalized);
        setActualQuantity(normalized.actual_quantity || '');
        setStep('confirm');
      } else {
        setQrError('No reservation found. Please check your information and try again.');
      }
    } catch (error) {
      console.error('Error looking up reservation:', error);
      setQrError('Error looking up reservation. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePhotoUpload = (e) => {
    const files = Array.from(e.target.files);
    const newPhotos = files.map(file => ({
      id: Date.now() + Math.random(),
      name: file.name,
      size: file.size,
      url: URL.createObjectURL(file),
      file: file
    }));
    setUploadedPhotos([...uploadedPhotos, ...newPhotos]);
  };

  const removePhoto = (photoId) => {
    setUploadedPhotos(uploadedPhotos.filter(photo => photo.id !== photoId));
  };

  const sendNotifications = async (reservation) => {
    if (serverStatus === 'connected') {
      try {
        const notificationData = {
          reservationId: reservation.id,
          customerName: reservation.customer_name,
          customerEmail: reservation.email,
          customerPhone: reservation.phone,
          actualQuantity: actualQuantity,
          photoCount: uploadedPhotos.length,
          status: 'received'
        };

        await fetch('http://localhost:3001/api/notify/dropoff', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(notificationData)
        });
        return true;
      } catch (error) {
        return false;
      }
    } else {
      return true;
    }
  };

  const handleCompleteCheckIn = async () => {
    if (!actualQuantity) {
      alert('Please confirm the number of items you are dropping off.');
      return;
    }
    
    setIsProcessing(true);
    setStep('complete');

    const toBase64 = file => new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });

    let photoPayload = [];
    try {
      photoPayload = await Promise.all(
        uploadedPhotos.map(async (photo) => ({
          name: photo.name,
          data: await toBase64(photo.file)
        }))
      );
    } catch (error) {
      alert('Error processing photos. Please try again.');
      setIsProcessing(false);
      return;
    }

    try {
      if (serverStatus === 'connected') {
        await fetch(`http://localhost:3001/api/reservations/${foundReservation.id}/check-in`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            actualQuantity: parseInt(actualQuantity),
            photos: photoPayload,
            checkInTime: new Date().toISOString()
          })
        });
      } else {
        const storageKey = `reservation_${foundReservation.id}`;
        const updatedReservation = {
          ...foundReservation,
          status: 'received',
          photos: photoPayload,
          checkInTime: new Date().toISOString(),
          actual_quantity: actualQuantity,
          knife_quantity: actualQuantity
        };
        localStorage.setItem(storageKey, JSON.stringify(updatedReservation));
      }

      await sendNotifications(foundReservation);
      setShowReceipt(true);

    } catch (error) {
      alert(`Error completing check-in: ${error.message}`);
      setIsProcessing(false);
    }
  };

  const resetLookup = () => {
    setLookupData({ phone: '', email: '', reservationId: '' });
    setFoundReservation(null);
    setUploadedPhotos([]);
    setShowReceipt(false);
    setStep('lookup');
    setActualQuantity('');
    setQrError('');
  };

  const incrementQty = () => {
    const current = parseInt(actualQuantity) || 0;
    setActualQuantity((current + 1).toString());
  };

  const decrementQty = () => {
    const current = parseInt(actualQuantity) || 0;
    if (current > 1) {
      setActualQuantity((current - 1).toString());
    }
  };

  if (showReceipt) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }} 
        animate={{ opacity: 1, scale: 1 }} 
        className="max-w-md mx-auto min-h-[60vh] flex flex-col justify-center py-8"
      >
        <div className="card text-center bg-steel-gray text-whetstone-cream">
          <div className="w-20 h-20 bg-honed-sage rounded-full flex items-center justify-center mx-auto mb-6">
            <SafeIcon icon={FiCheckCircle} className="w-10 h-10 text-white" />
          </div>
          <h2 className="font-serif font-bold text-3xl text-whetstone-cream mb-2">
            Received!
          </h2>
          <p className="text-gray-300 mb-8">
            Your knives are safe with us. We'll verify your order shortly.
          </p>
          
          <div className="bg-carbon-black rounded-xl p-6 mb-8 text-left border border-white/10">
            <div className="flex justify-between mb-3 border-b border-white/10 pb-2">
              <span className="text-gray-400">Reservation ID</span>
              <span className="font-mono font-bold text-whetstone-cream">{foundReservation.id}</span>
            </div>
            <div className="flex justify-between mb-3 border-b border-white/10 pb-2">
              <span className="text-gray-400">Item Count</span>
              <span className="font-bold text-honed-sage">{actualQuantity}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Photos</span>
              <span className="text-whetstone-cream">{uploadedPhotos.length}</span>
            </div>
          </div>

          <div className="space-y-3">
            <button onClick={resetLookup} className="w-full btn-secondary py-4 font-bold">
              Check In Another
            </button>
            <button onClick={() => window.location.href = '#/'} className="w-full btn-primary py-4 font-bold">
              Return Home
            </button>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="max-w-lg mx-auto min-h-screen flex flex-col justify-center py-12">
      <AnimatePresence mode="wait">
        {/* Step 1: Lookup */}
        {step === 'lookup' && (
          <motion.div
            key="lookup"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex flex-col h-full"
          >
            <div className="card flex-1 flex flex-col justify-center bg-steel-gray text-whetstone-cream">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-damascus-bronze rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <SafeIcon icon={FiSearch} className="w-8 h-8 text-white" />
                </div>
                <h2 className="font-serif font-bold text-3xl text-whetstone-cream mb-2">
                  Check In
                </h2>
                <p className="text-gray-300">
                  Find your reservation to start drop-off
                </p>
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
                    type="tel" 
                    name="phone" 
                    value={lookupData.phone} 
                    onChange={handleLookupChange}
                    className="w-full px-4 py-3 border border-gray-500 rounded-lg focus:ring-2 focus:ring-honed-sage focus:border-transparent text-center bg-carbon-black/50 text-white"
                    placeholder="Phone Number"
                  />
                  <input 
                    type="email" 
                    name="email" 
                    value={lookupData.email} 
                    onChange={handleLookupChange}
                    className="w-full px-4 py-3 border border-gray-500 rounded-lg focus:ring-2 focus:ring-honed-sage focus:border-transparent text-center bg-carbon-black/50 text-white"
                    placeholder="Email Address"
                  />
                </div>

                {qrError && (
                  <div className="bg-red-900/30 border border-red-800 rounded-lg p-4 flex items-center space-x-3 animate-pulse">
                    <SafeIcon icon={FiAlertCircle} className="w-5 h-5 text-red-400" />
                    <span className="text-red-300 text-sm font-medium">{qrError}</span>
                  </div>
                )}

                <button 
                  type="submit" 
                  disabled={(!lookupData.phone && !lookupData.email && !lookupData.reservationId) || isProcessing}
                  className="w-full btn-primary py-4 text-lg font-bold shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 mt-4"
                >
                  {isProcessing ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Searching...</span>
                    </>
                  ) : (
                    <>
                      <SafeIcon icon={FiSearch} className="w-5 h-5" />
                      <span>Find Reservation</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          </motion.div>
        )}

        {/* Step 2: Confirm Details & Quantity */}
        {step === 'confirm' && foundReservation && (
          <motion.div
            key="confirm"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex flex-col h-full"
          >
            <div className="card flex-1 flex flex-col bg-steel-gray text-whetstone-cream">
              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center px-4 py-1 bg-honed-sage/20 text-honed-sage rounded-full text-sm font-bold mb-4 border border-honed-sage/30">
                  <SafeIcon icon={FiUser} className="mr-2 w-3 h-3" />
                  {foundReservation.customer_name}
                </div>
                <h2 className="font-serif font-bold text-2xl text-whetstone-cream">
                  Items to Drop Off?
                </h2>
              </div>

              {/* Enhanced Quantity Input */}
              <div className="flex-1 flex flex-col justify-center items-center py-8">
                <div className="flex items-center space-x-6">
                  <button 
                    onClick={decrementQty}
                    className="w-16 h-16 rounded-full border-2 border-gray-500 flex items-center justify-center text-gray-400 hover:bg-gray-600 hover:text-white transition-colors text-2xl"
                  >
                    <SafeIcon icon={FiMinus} />
                  </button>

                  <div className="relative">
                    <input 
                      type="number" 
                      min="1"
                      value={actualQuantity} 
                      onChange={(e) => setActualQuantity(e.target.value)}
                      className="w-32 h-32 text-6xl font-bold text-center border-4 border-damascus-bronze rounded-2xl focus:outline-none focus:ring-4 focus:ring-damascus-bronze/30 bg-carbon-black text-white"
                      placeholder="0"
                      autoFocus
                    />
                    <div className="absolute -bottom-6 left-0 w-full text-center text-sm text-gray-400 font-medium uppercase tracking-wider">
                      Items
                    </div>
                  </div>

                  <button 
                    onClick={incrementQty}
                    className="w-16 h-16 rounded-full bg-damascus-bronze text-white flex items-center justify-center hover:bg-opacity-90 transition-colors shadow-lg text-2xl"
                  >
                    <SafeIcon icon={FiPlus} />
                  </button>
                </div>
              </div>

              {/* Photo Section */}
              <div className="mt-8 border-t border-white/10 pt-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-lg text-whetstone-cream flex items-center">
                    <SafeIcon icon={FiCamera} className="mr-2 text-gray-400" />
                    Photos
                  </h3>
                  <span className="text-xs bg-carbon-black text-gray-400 px-3 py-1 rounded-full font-medium border border-white/10">Optional</span>
                </div>
                
                {uploadedPhotos.length === 0 ? (
                  <div className="grid grid-cols-2 gap-4">
                    <label className="block cursor-pointer group">
                      <input type="file" multiple accept="image/*" onChange={handlePhotoUpload} className="hidden" capture="environment" />
                      <div className="border-2 border-dashed border-gray-600 group-hover:border-honed-sage rounded-xl p-4 text-center transition-all bg-carbon-black/30 group-hover:bg-carbon-black/50 h-full flex flex-col items-center justify-center">
                        <SafeIcon icon={FiCamera} className="w-8 h-8 text-gray-500 group-hover:text-honed-sage mb-2 transition-colors" />
                        <span className="text-sm font-bold text-gray-400 group-hover:text-gray-200">Take Photo</span>
                      </div>
                    </label>
                    <label className="block cursor-pointer group">
                      <input type="file" multiple accept="image/*" onChange={handlePhotoUpload} className="hidden" />
                      <div className="border-2 border-dashed border-gray-600 group-hover:border-honed-sage rounded-xl p-4 text-center transition-all bg-carbon-black/30 group-hover:bg-carbon-black/50 h-full flex flex-col items-center justify-center">
                        <SafeIcon icon={FiUpload} className="w-8 h-8 text-gray-500 group-hover:text-honed-sage mb-2 transition-colors" />
                        <span className="text-sm font-bold text-gray-400 group-hover:text-gray-200">Upload</span>
                      </div>
                    </label>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="grid grid-cols-4 gap-2">
                      {uploadedPhotos.map((photo) => (
                        <div key={photo.id} className="relative group aspect-square">
                          <img src={photo.url} alt="Item" className="w-full h-full object-cover rounded-lg border border-gray-600 shadow-sm" />
                          <button 
                            onClick={() => removePhoto(photo.id)}
                            className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center shadow-md"
                          >
                            <SafeIcon icon={FiX} className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                      <label className="block cursor-pointer border-2 border-dashed border-gray-600 hover:border-honed-sage rounded-lg flex items-center justify-center hover:bg-carbon-black/30 transition-colors">
                        <input type="file" multiple accept="image/*" onChange={handlePhotoUpload} className="hidden" />
                        <SafeIcon icon={FiPlus} className="w-6 h-6 text-gray-500" />
                      </label>
                    </div>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex space-x-4 mt-8 pt-4 border-t border-white/10">
                <button onClick={() => setStep('lookup')} className="flex-1 btn-secondary py-4 font-bold">
                  Back
                </button>
                <button 
                  onClick={handleCompleteCheckIn}
                  disabled={!actualQuantity || isProcessing}
                  className="flex-[2] btn-primary py-4 text-lg font-bold shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transform hover:-translate-y-1 transition-transform"
                >
                  {isProcessing ? 'Processing...' : 'Confirm Drop-Off'}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DropOffLookup;