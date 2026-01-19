import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  format,
  addDays,
  startOfTomorrow,
  startOfToday,
  eachDayOfInterval,
  isAfter,
  isToday,
  addMinutes,
  parseISO,
  isPast
} from 'date-fns';
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import SafeIcon from '../common/SafeIcon';
import { generateGoogleCalendarUrl } from '../utils/calendarUtils';
import supabase from '../supabase/supabase';
import * as FiIcons from 'react-icons/fi';

const { FiCalendar, FiClock, FiUser, FiCheck, FiArrowLeft, FiSun, FiMoon, FiSunrise, FiCreditCard, FiTag, FiAlertCircle } = FiIcons;

const SERVICE_TIERS = [
  { id: 'chef-edge', name: 'Chef-Edge Sharpening', price: 12, desc: 'Everyday sharpness' },
  { id: 'pro-edge', name: 'Pro-Edge Sharpening', price: 20, desc: 'High-performance edge' },
  { id: 'signature-edge', name: 'Signature Restoration', price: 40, desc: 'Repair & polish' },
  { id: 'scissors', name: 'Scissor Sharpening', price: 10, desc: 'Kitchen/Fabric' }
];

const ReservationForm = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    day: '',
    selectedSlot: '',
    name: '',
    phone: '',
    email: '',
    notes: '',
    selectedDate: null,
    serviceType: 'chef-edge',
    knifeCount: 3
  });
  
  // Payment & Coupon State
  const [promoCode, setPromoCode] = useState('');
  const [discount, setDiscount] = useState(null); // { type: '%', value: 10, code: 'SAVE10' }
  const [couponError, setCouponError] = useState('');
  const [reservationId, setReservationId] = useState('');
  const [finalReservationData, setFinalReservationData] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // --- Helpers ---

  const getDayOptions = () => {
    const today = startOfToday();
    const tomorrow = startOfTomorrow();
    
    return [
      { value: 'today', label: `Today (${format(today, 'MMM do')})`, date: format(today, 'yyyy-MM-dd') },
      { value: 'tomorrow', label: `Tomorrow (${format(tomorrow, 'MMM do')})`, date: format(tomorrow, 'yyyy-MM-dd') },
      { value: 'thisweek', label: 'Pick a Date', date: null }
    ];
  };

  const getThisWeekDates = () => {
    const today = startOfToday();
    const weekEnd = addDays(today, 14);
    const dates = eachDayOfInterval({ start: today, end: weekEnd });
    
    return dates
      .filter(date => isAfter(date, today) || isToday(date))
      .map(date => ({
        date,
        formatted: format(date, 'EEEE, MMMM do'),
        value: format(date, 'yyyy-MM-dd')
      }));
  };

  const generateTimeSlots = (selectedDateStr) => {
    let selectedDate = selectedDateStr ? parseISO(selectedDateStr) : new Date();
    const isTodaySelected = isToday(selectedDate);
    
    const dayParts = [
      { id: 'morning', label: 'Morning', icon: FiSunrise, start: 8, end: 12 },
      { id: 'midday', label: 'Midday', icon: FiSun, start: 12, end: 16 },
      { id: 'evening', label: 'Evening', icon: FiMoon, start: 16, end: 19 }
    ];

    return dayParts.map(part => {
      const slots = [];
      for (let hour = part.start; hour < part.end; hour++) {
        for (let minute of [0, 30]) {
          const time = new Date(selectedDate);
          time.setHours(hour, minute, 0, 0);
          if (isTodaySelected && isPast(time)) continue;
          const endTime = addMinutes(time, 30);
          slots.push(`${format(time, 'h:mma')} ~ ${format(endTime, 'h:mma')}`);
        }
      }
      return { ...part, slots };
    });
  };

  // --- Calculations ---

  const selectedTier = SERVICE_TIERS.find(t => t.id === formData.serviceType) || SERVICE_TIERS[0];
  const subtotal = selectedTier.price * Math.max(1, parseInt(formData.knifeCount) || 0);
  
  const calculateDiscountAmount = () => {
    if (!discount) return 0;
    if (discount.type === 'percentage') {
      return subtotal * (discount.value / 100);
    }
    return Math.min(subtotal, discount.value); // Fixed amount
  };

  const discountAmount = calculateDiscountAmount();
  const total = Math.max(0, subtotal - discountAmount);

  // --- Handlers ---

  const handleApplyCoupon = async () => {
    if (!promoCode) return;
    setCouponError('');
    setIsProcessing(true);

    try {
      const { data, error } = await supabase
        .from('coupons')
        .select('*')
        .eq('code', promoCode)
        .eq('active', true)
        .single();

      if (error || !data) {
        setCouponError('Invalid or expired code');
        setDiscount(null);
      } else {
        setDiscount({
          code: data.code,
          type: data.discount_type,
          value: data.discount_value
        });
      }
    } catch (err) {
      setCouponError('Error checking coupon');
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePaymentSuccess = async (details) => {
    setIsProcessing(true);
    
    // 1. Generate Reservation Data
    const [y, m, d] = formData.selectedDate.split('-').map(Number);
    const localDate = new Date(y, m - 1, d);
    const pickupDate = addDays(localDate, 1);
    
    // NOTE: In a real app, let Supabase gen UUID, but we need one for display. 
    // We'll use the ID from Supabase response.
    
    try {
      // 2. Find or Create Customer
      let customerId;
      const { data: existingCust } = await supabase
        .from('customers')
        .select('id')
        .eq('email', formData.email)
        .single();

      if (existingCust) {
        customerId = existingCust.id;
      } else {
        const { data: newCust, error: custError } = await supabase
          .from('customers')
          .insert({
            name: formData.name,
            email: formData.email,
            phone: formData.phone
          })
          .select()
          .single();
          
        if (custError) throw custError;
        customerId = newCust.id;
      }

      // 3. Create Reservation
      const { data: reservation, error: resError } = await supabase
        .from('reservations')
        .insert({
          customer_id: customerId,
          drop_off_date: format(localDate, 'EEEE, MMMM do'),
          drop_off_time: formData.selectedSlot,
          pickup_date: format(pickupDate, 'EEEE, MMMM do'),
          knife_quantity: formData.knifeCount.toString(),
          notes: formData.notes,
          status: 'booked',
          actual_quantity: parseInt(formData.knifeCount),
          photos: []
        })
        .select()
        .single();

      if (resError) throw resError;
      
      const resId = reservation.id.substring(0, 8).toUpperCase(); // Display friendly ID
      setReservationId(resId);
      setFinalReservationData({ ...reservation, id: resId });

      // 4. Create Invoice Record
      await supabase.from('invoices').insert({
        reservation_id: reservation.id,
        total_amount: total,
        payment_method: 'paypal',
        payment_status: 'paid',
        details: {
          subtotal,
          discount,
          serviceType: selectedTier.name,
          paypal_order_id: details.id
        }
      });
      
      // 5. Create Notification (Communication Log)
      await supabase.from('communications').insert({
        reservation_id: reservation.id,
        type: 'email',
        direction: 'outbound',
        summary: 'Booking Confirmation',
        content: `Booking confirmed for ${formData.selectedSlot}. Paid $${total}.`
      });

      setCurrentStep(4);
    } catch (error) {
      console.error('Booking Error:', error);
      alert('There was an issue creating your reservation. Please contact support.');
    } finally {
      setIsProcessing(false);
    }
  };

  const dayOptions = getDayOptions();
  const timeSlotsByPart = formData.selectedDate ? generateTimeSlots(formData.selectedDate) : [];

  return (
    <PayPalScriptProvider options={{ "client-id": "sb", currency: "USD" }}>
      <div className="max-w-3xl mx-auto min-h-[60vh] flex flex-col justify-center">
        {/* Progress Indicator */}
        {currentStep < 4 && (
          <div className="flex items-center justify-center mb-8">
            <div className="flex items-center space-x-4">
              {[1, 2, 3].map((step) => (
                <React.Fragment key={step}>
                  <div className={`progress-step ${currentStep === step ? 'active' : currentStep > step ? 'completed' : 'inactive'}`}>
                    {currentStep > step ? <SafeIcon icon={FiCheck} className="w-5 h-5" /> : step}
                  </div>
                  {step < 3 && <div className={`progress-line ${currentStep > step ? 'completed' : ''}`} />}
                </React.Fragment>
              ))}
            </div>
          </div>
        )}

        <AnimatePresence mode="wait">
          {/* Step 1: Select Day */}
          {currentStep === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="card bg-steel-gray text-whetstone-cream"
            >
              <div className="text-center mb-8">
                <SafeIcon icon={FiCalendar} className="w-16 h-16 text-damascus-bronze mx-auto mb-4" />
                <h2 className="font-serif font-bold text-3xl text-whetstone-cream mb-2">Select Date</h2>
                <p className="text-gray-300">When will you drop off your knives?</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {dayOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => {
                      if (option.value === 'thisweek') {
                        setFormData({ ...formData, day: 'thisweek', selectedDate: null });
                      } else {
                        setFormData({ ...formData, day: option.value, selectedDate: option.date });
                        setCurrentStep(2);
                      }
                    }}
                    className={`p-6 rounded-xl transition-all font-medium flex flex-col items-center justify-center h-40 shadow-lg group ${
                      formData.day === option.value && formData.day !== 'thisweek'
                        ? 'bg-damascus-bronze text-white ring-2 ring-white/50'
                        : 'bg-carbon-black text-whetstone-cream hover:bg-honed-sage/20 border border-white/10'
                    }`}
                  >
                    <span className="text-xl font-bold mb-2 font-serif tracking-wide">
                      {option.value === 'thisweek' ? 'Pick Date' : option.value === 'today' ? 'Today' : 'Tomorrow'}
                    </span>
                    <span className="text-sm opacity-80">
                      {option.value === 'thisweek' ? 'More options' : option.label.split('(')[1].replace(')', '')}
                    </span>
                  </button>
                ))}
              </div>
              {formData.day === 'thisweek' && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-6 pt-6 border-t border-white/10">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {getThisWeekDates().map((dateObj) => (
                      <button
                        key={dateObj.value}
                        onClick={() => {
                          setFormData({ ...formData, day: 'thisweek', selectedDate: dateObj.value });
                          setCurrentStep(2);
                        }}
                        className="p-3 rounded-lg border border-gray-600 hover:bg-damascus-bronze hover:text-white transition-colors text-sm font-medium bg-carbon-black"
                      >
                        {format(dateObj.date, 'EEE, MMM do')}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </motion.div>
          )}

          {/* Step 2: Time Slot */}
          {currentStep === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="card bg-steel-gray text-whetstone-cream"
            >
              <div className="flex items-center justify-between mb-6">
                <button onClick={() => setCurrentStep(1)} className="text-gray-300 hover:text-white flex items-center space-x-1">
                  <SafeIcon icon={FiArrowLeft} /> <span>Back</span>
                </button>
                <span className="font-semibold text-damascus-bronze bg-black/20 px-3 py-1 rounded-full">
                  {formData.selectedDate && format(new Date(formData.selectedDate.replace(/-/g, '/')), 'MMM do')}
                </span>
              </div>
              <h2 className="text-center font-serif font-bold text-3xl mb-8">Select Drop-Off Time</h2>
              <div className="space-y-6">
                {timeSlotsByPart.map((part) => (
                  <div key={part.id}>
                    <div className="flex items-center space-x-2 mb-3 text-damascus-bronze">
                      <SafeIcon icon={part.icon} />
                      <h3 className="font-semibold text-whetstone-cream">{part.label}</h3>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {part.slots.map((slot) => {
                        const isSelected = formData.selectedSlot === slot;
                        return (
                          <button
                            key={slot}
                            onClick={() => {
                              setFormData({ ...formData, selectedSlot: slot });
                              setCurrentStep(3);
                            }}
                            className={`py-3 px-2 rounded-lg border transition-all text-sm font-bold ${
                              isSelected
                                ? 'bg-damascus-bronze text-white border-damascus-bronze shadow-lg scale-105'
                                : 'bg-whetstone-cream text-carbon-black border-transparent hover:bg-white'
                            }`}
                          >
                            {slot.split(' ~ ')[0]}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Step 3: Details & Payment */}
          {currentStep === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="card bg-steel-gray text-whetstone-cream"
            >
              <div className="flex items-center justify-between mb-4">
                <button onClick={() => setCurrentStep(2)} className="text-gray-300 hover:text-white flex items-center space-x-1">
                  <SafeIcon icon={FiArrowLeft} /> <span>Back</span>
                </button>
                <h2 className="font-serif font-bold text-2xl">Details & Payment</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Left: Contact Info */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg text-damascus-bronze border-b border-white/10 pb-2">Your Information</h3>
                  <div>
                    <label className="block text-sm mb-1 text-gray-300">Name</label>
                    <input
                      type="text"
                      className="w-full p-3 rounded bg-carbon-black/50 border border-gray-600 focus:border-damascus-bronze"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm mb-1 text-gray-300">Phone</label>
                    <input
                      type="tel"
                      className="w-full p-3 rounded bg-carbon-black/50 border border-gray-600 focus:border-damascus-bronze"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm mb-1 text-gray-300">Email</label>
                    <input
                      type="email"
                      className="w-full p-3 rounded bg-carbon-black/50 border border-gray-600 focus:border-damascus-bronze"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm mb-1 text-gray-300">Notes</label>
                    <textarea
                      rows={2}
                      className="w-full p-3 rounded bg-carbon-black/50 border border-gray-600 focus:border-damascus-bronze resize-none"
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    />
                  </div>
                </div>

                {/* Right: Order & Payment */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg text-damascus-bronze border-b border-white/10 pb-2">Order Details</h3>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm mb-1 text-gray-300">Service Level</label>
                      <select
                        value={formData.serviceType}
                        onChange={(e) => setFormData({ ...formData, serviceType: e.target.value })}
                        className="w-full p-3 rounded bg-carbon-black/50 border border-gray-600 text-white"
                      >
                        {SERVICE_TIERS.map(tier => (
                          <option key={tier.id} value={tier.id}>{tier.name} (${tier.price})</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm mb-1 text-gray-300">Quantity</label>
                      <input
                        type="number"
                        min="1"
                        className="w-full p-3 rounded bg-carbon-black/50 border border-gray-600 text-white"
                        value={formData.knifeCount}
                        onChange={(e) => setFormData({ ...formData, knifeCount: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="bg-carbon-black/30 p-4 rounded-lg space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Subtotal ({formData.knifeCount} x ${selectedTier.price})</span>
                      <span>${subtotal.toFixed(2)}</span>
                    </div>
                    
                    {/* Promo Code */}
                    <div className="flex space-x-2 pt-2">
                      <input
                        type="text"
                        placeholder="Promo Code"
                        className="flex-1 p-2 rounded bg-white/10 border border-transparent focus:border-damascus-bronze text-sm"
                        value={promoCode}
                        onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                      />
                      <button 
                        onClick={handleApplyCoupon}
                        disabled={!promoCode || isProcessing}
                        className="px-3 bg-damascus-bronze text-white rounded text-sm font-bold disabled:opacity-50"
                      >
                        Apply
                      </button>
                    </div>
                    {couponError && <p className="text-red-400 text-xs">{couponError}</p>}
                    {discount && (
                      <div className="flex justify-between text-green-400 text-sm font-medium">
                        <span>Discount ({discount.code})</span>
                        <span>-${discountAmount.toFixed(2)}</span>
                      </div>
                    )}
                    
                    <div className="flex justify-between text-xl font-bold border-t border-white/20 pt-2 mt-2">
                      <span>Total Due</span>
                      <span>${total.toFixed(2)}</span>
                    </div>
                  </div>

                  {/* PayPal Button */}
                  <div className="mt-4 pt-2">
                    {!formData.name || !formData.email ? (
                      <div className="text-center text-sm text-gray-400 bg-white/5 p-3 rounded">
                        Please complete contact details to pay
                      </div>
                    ) : (
                      <div className="relative z-0">
                         <PayPalButtons 
                          forceReRender={[total, discount]}
                          style={{ layout: "horizontal", color: "gold", tagline: false }}
                          createOrder={(data, actions) => {
                            return actions.order.create({
                              purchase_units: [{
                                description: `${selectedTier.name} x ${formData.knifeCount}`,
                                amount: { value: total.toFixed(2) }
                              }]
                            });
                          }}
                          onApprove={async (data, actions) => {
                            const details = await actions.order.capture();
                            await handlePaymentSuccess(details);
                          }}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 4: Confirmation */}
          {currentStep === 4 && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="card text-center bg-steel-gray text-whetstone-cream"
            >
              <div className="w-20 h-20 bg-honed-sage rounded-full flex items-center justify-center mx-auto mb-6">
                <SafeIcon icon={FiCheck} className="w-10 h-10 text-white" />
              </div>
              <h2 className="font-serif font-bold text-3xl text-whetstone-cream mb-4">Reservation Confirmed</h2>
              <div className="bg-damascus-bronze text-white rounded-lg p-6 mb-6 shadow-lg inline-block min-w-[300px]">
                <p className="text-sm opacity-90 mb-1">Reservation ID</p>
                <p className="font-bold text-3xl tracking-wider mb-4">{reservationId}</p>
                {finalReservationData && (
                  <a
                    href={generateGoogleCalendarUrl(finalReservationData)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-2 bg-white text-damascus-bronze px-4 py-2 rounded-lg text-sm font-bold shadow-sm hover:bg-gray-100"
                  >
                    <SafeIcon icon={FiCalendar} className="w-4 h-4" /> <span>Add to Google Calendar</span>
                  </a>
                )}
              </div>
              <p className="text-gray-300 mb-8 max-w-md mx-auto">
                Payment received! We've sent a confirmation to <strong>{formData.email}</strong>.
                Please bring your knives during your selected drop-off window.
              </p>
              <button onClick={() => window.location.reload()} className="btn-secondary py-3 px-8">
                Book Another
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </PayPalScriptProvider>
  );
};

export default ReservationForm;