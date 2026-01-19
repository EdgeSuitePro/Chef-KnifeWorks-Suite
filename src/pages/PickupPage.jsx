import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import SafeIcon from '../common/SafeIcon';
import { API_BASE_URL } from '../config';
import supabase from '../supabase/supabase';
import * as FiIcons from 'react-icons/fi';

const { FiSearch, FiCheckCircle, FiPackage, FiUser, FiAlertCircle, FiHome, FiDollarSign, FiCreditCard, FiTag } = FiIcons;

const PickupPage = () => {
  const [lookupData, setLookupData] = useState({ phone: '', email: '', reservationId: '' });
  const [foundReservation, setFoundReservation] = useState(null);
  const [invoice, setInvoice] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [step, setStep] = useState('lookup'); // lookup, confirm, complete
  const [error, setError] = useState('');

  // Payment & Coupon State
  const [promoCode, setPromoCode] = useState('');
  const [discount, setDiscount] = useState(null);
  const [couponMsg, setCouponMsg] = useState({ type: '', text: '' });
  const [isPaymentProcessing, setIsPaymentProcessing] = useState(false);

  // 1. Check for ?id= in URL on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const idParam = params.get('id');
    if (idParam) {
      setLookupData(prev => ({ ...prev, reservationId: idParam }));
      executeLookup(idParam);
    }
  }, []);

  const handleLookupChange = (e) => {
    setLookupData({ ...lookupData, [e.target.name]: e.target.value });
  };

  const executeLookup = async (id) => {
    setIsProcessing(true);
    setError('');
    setDiscount(null);
    setCouponMsg({ type: '', text: '' });
    
    const searchId = id ? id.toUpperCase() : lookupData.reservationId.toUpperCase();
    let found = null;
    let foundInvoice = null;

    try {
      // 1. Search by ID
      if (searchId) {
        const { data } = await supabase
          .from('reservations')
          .select('*, invoices(*)')
          .ilike('id', `${searchId}%`)
          .single();
        if (data) found = data;
      } 
      // 2. Search by Phone/Email
      else if (lookupData.email || lookupData.phone) {
        let query = supabase.from('reservations').select('*, invoices(*)');
        if (lookupData.email) query = query.eq('email', lookupData.email);
        if (lookupData.phone) query = query.eq('phone', lookupData.phone);
        
        const { data } = await query.order('created_at', { ascending: false }).limit(1);
        if (data && data.length > 0) found = data[0];
      }

      // 3. Process Result
      if (found) {
        if (found.invoices && found.invoices.length > 0) {
          foundInvoice = found.invoices[0];
        }

        // Logic for "Ready for Pickup"
        // Show if status is ready/finished OR if it's already picked-up (to show record)
        setFoundReservation(found);
        setInvoice(foundInvoice);
        setStep('confirm');
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
    executeLookup();
  };

  // --- Coupon Logic ---
  const handleApplyCoupon = async () => {
    if (!promoCode) return;
    setCouponMsg({ type: 'info', text: 'Checking...' });
    
    try {
      const { data, error } = await supabase
        .from('coupons')
        .select('*')
        .eq('code', promoCode.toUpperCase())
        .eq('active', true)
        .single();

      if (error || !data) {
        setCouponMsg({ type: 'error', text: 'Invalid or expired code' });
        setDiscount(null);
      } else {
        setCouponMsg({ type: 'success', text: 'Coupon applied!' });
        setDiscount({
          code: data.code,
          type: data.discount_type,
          value: data.discount_value
        });
      }
    } catch (err) {
      setCouponMsg({ type: 'error', text: 'Error checking coupon' });
    }
  };

  // --- Payment & Completion Logic ---
  const calculateTotal = () => {
    if (!invoice) return 0;
    const subtotal = invoice.total_amount; // Assuming initial amount is subtotal
    if (!discount) return subtotal;
    
    let discountAmount = 0;
    if (discount.type === 'percentage') {
      discountAmount = subtotal * (discount.value / 100);
    } else {
      discountAmount = Math.min(subtotal, discount.value);
    }
    return Math.max(0, subtotal - discountAmount);
  };

  const finalTotal = calculateTotal();

  const handlePayPalApprove = async (details) => {
    setIsPaymentProcessing(true);
    try {
      // 1. Update Invoice
      await supabase.from('invoices').update({
        payment_status: 'paid',
        payment_method: 'paypal',
        total_amount: finalTotal, // Update to paid amount
        details: {
          ...invoice.details,
          discount_applied: discount,
          paypal_order_id: details.id
        }
      }).eq('id', invoice.id);

      // 2. Refresh Local State
      setInvoice(prev => ({ ...prev, payment_status: 'paid', total_amount: finalTotal }));
      
      // 3. Notify
      await supabase.from('communications').insert({
        reservation_id: foundReservation.id,
        type: 'email',
        direction: 'outbound',
        summary: 'Payment Received',
        content: `Payment of $${finalTotal.toFixed(2)} received via PayPal.`
      });

    } catch (err) {
      console.error('Payment update failed', err);
      alert('Payment processed but failed to update record. Please contact staff.');
    } finally {
      setIsPaymentProcessing(false);
    }
  };

  const handleConfirmPickup = async () => {
    setIsProcessing(true);
    try {
      await supabase.from('reservations').update({
        status: 'picked-up'
      }).eq('id', foundReservation.id);

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
    setInvoice(null);
    setStep('lookup');
    setError('');
    setDiscount(null);
    setPromoCode('');
    window.history.pushState({}, '', window.location.pathname);
  };

  const isPaid = invoice?.payment_status === 'paid';

  return (
    <PayPalScriptProvider options={{ "client-id": "sb", currency: "USD" }}>
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
                        placeholder="ABC12345"
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
                    {foundReservation.id.substring(0,8).toUpperCase()}
                  </div>

                  {/* Order Details */}
                  <div className="bg-carbon-black/50 rounded-xl p-6 mb-6 text-left border border-white/10">
                    <div className="flex items-center space-x-3 mb-4">
                      <SafeIcon icon={FiUser} className="text-gray-400" />
                      <span className="text-whetstone-cream font-semibold">
                        {foundReservation.customer_name || foundReservation.name || 'Guest'}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm border-t border-white/10 pt-4">
                      <span className="text-gray-400">Quantity</span>
                      <span className="text-whetstone-cream font-bold">{foundReservation.knife_quantity} Knives</span>
                    </div>
                  </div>

                  {/* PAYMENT SECTION */}
                  <div className="bg-whetstone-cream text-carbon-black rounded-xl p-6 mb-8 text-left shadow-lg">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="font-bold text-lg flex items-center">
                        <SafeIcon icon={FiDollarSign} className="mr-2 text-damascus-bronze" />
                        Payment
                      </h3>
                      {isPaid ? (
                        <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-bold border border-green-200 flex items-center">
                          <SafeIcon icon={FiCheckCircle} className="mr-1" /> PAID
                        </span>
                      ) : (
                        <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-xs font-bold border border-yellow-200 flex items-center">
                          <SafeIcon icon={FiAlertCircle} className="mr-1" /> DUE
                        </span>
                      )}
                    </div>

                    {invoice ? (
                      <div className="space-y-4">
                        <div className="flex justify-between items-end border-b border-gray-200 pb-4">
                          <span className="text-sm text-gray-600">Total Due</span>
                          <span className="text-2xl font-bold text-carbon-black">
                            ${finalTotal.toFixed(2)}
                          </span>
                        </div>

                        {!isPaid && (
                          <div className="space-y-4">
                            {/* Coupon Input */}
                            <div className="bg-gray-100 p-3 rounded-lg">
                              <label className="text-xs font-bold text-gray-500 mb-1 block">Promo Code</label>
                              <div className="flex space-x-2">
                                <input 
                                  type="text" 
                                  value={promoCode}
                                  onChange={(e) => setPromoCode(e.target.value)}
                                  placeholder="CODE"
                                  className="flex-1 p-2 rounded border border-gray-300 text-sm"
                                />
                                <button 
                                  onClick={handleApplyCoupon}
                                  className="bg-gray-800 text-white px-3 rounded text-sm font-bold"
                                >
                                  Apply
                                </button>
                              </div>
                              {couponMsg.text && (
                                <p className={`text-xs mt-1 ${couponMsg.type === 'error' ? 'text-red-500' : 'text-green-600'}`}>
                                  {couponMsg.text}
                                </p>
                              )}
                              {discount && (
                                <div className="flex justify-between text-green-600 text-sm font-bold mt-2 border-t border-gray-200 pt-2">
                                  <span>Discount Applied</span>
                                  <span>-${(invoice.total_amount - finalTotal).toFixed(2)}</span>
                                </div>
                              )}
                            </div>

                            {/* PayPal Button */}
                           <div className="relative z-0">
                             <PayPalButtons 
                               forceReRender={[finalTotal]}
                               style={{ layout: "vertical", color: "blue", shape: "rect", label: "pay" }}
                               createOrder={(data, actions) => {
                                 return actions.order.create({
                                   purchase_units: [{
                                     description: `Order ${foundReservation.id}`,
                                     amount: { value: finalTotal.toFixed(2) }
                                   }]
                                 });
                               }}
                               onApprove={async (data, actions) => {
                                 const details = await actions.order.capture();
                                 await handlePayPalApprove(details);
                               }}
                             />
                           </div>
                         </div>
                        )}

                        {isPaid && (
                          <div className="text-center bg-green-50 p-4 rounded-lg border border-green-200">
                             <p className="text-green-800 font-bold mb-1">Payment Complete</p>
                             <p className="text-xs text-green-600">Transaction recorded securely.</p>
                          </div>
                        )}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500 italic text-center">
                        No invoice found for this order. Please ask staff for assistance.
                      </p>
                    )}
                  </div>

                  <div className="space-y-4">
                    <button 
                      onClick={handleConfirmPickup}
                      disabled={!isPaid || isProcessing}
                      className={`w-full btn-primary py-4 text-lg font-bold shadow-lg flex items-center justify-center space-x-2 ${(!isPaid) ? 'opacity-50 cursor-not-allowed' : ''}`}
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
    </PayPalScriptProvider>
  );
};

export default PickupPage;