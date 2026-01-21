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
import SafeIcon from '../common/SafeIcon';
import { generateGoogleCalendarUrl } from '../utils/calendarUtils';
import * as FiIcons from 'react-icons/fi';

const { FiCalendar, FiClock, FiUser, FiCheck, FiArrowLeft, FiSun, FiMoon, FiSunrise } = FiIcons;

const ReservationForm = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    day: '',
    selectedSlot: '',
    name: '',
    phone: '',
    email: '',
    notes: '',
    selectedDate: null
  });
  const [reservationId, setReservationId] = useState('');
  const [finalReservationData, setFinalReservationData] = useState(null);

  const generateReservationId = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  const getDayOptions = () => {
    const today = startOfToday();
    const tomorrow = startOfTomorrow();
    
    return [
      {
        value: 'today',
        label: `Today (${format(today, 'MMM do')})`,
        date: format(today, 'yyyy-MM-dd')
      },
      {
        value: 'tomorrow',
        label: `Tomorrow (${format(tomorrow, 'MMM do')})`,
        date: format(tomorrow, 'yyyy-MM-dd')
      },
      {
        value: 'thisweek',
        label: 'Pick a Date',
        date: null
      }
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
    // Convert selected date string to Date object
    let selectedDate;
    if (selectedDateStr) {
      selectedDate = parseISO(selectedDateStr);
    } else {
      selectedDate = new Date();
    }
    
    const isTodaySelected = isToday(selectedDate);
    const now = new Date();
    
    const dayParts = [
      {
        id: 'morning',
        label: 'Morning',
        icon: FiSunrise,
        start: 8,
        end: 12
      },
      {
        id: 'midday',
        label: 'Midday',
        icon: FiSun,
        start: 12,
        end: 16
      },
      {
        id: 'evening',
        label: 'Evening',
        icon: FiMoon,
        start: 16,
        end: 19
      }
    ];

    return dayParts.map(part => {
      const slots = [];
      
      for (let hour = part.start; hour < part.end; hour++) {
        for (let minute of [0, 30]) {
          const time = new Date(selectedDate);
          time.setHours(hour, minute, 0, 0);
          
          // Skip past time slots if today is selected
          if (isTodaySelected && isPast(time)) {
            continue;
          }
          
          const endTime = addMinutes(time, 30);
          slots.push(`${format(time, 'h:mma')} ~ ${format(endTime, 'h:mma')}`);
        }
      }
      
      return {
        ...part,
        slots
      };
    });
  };

  const dayOptions = getDayOptions();
  const thisWeekDates = getThisWeekDates();

  const handleDateSelection = (dateVal) => {
    setFormData({
      ...formData,
      day: 'thisweek',
      selectedDate: dateVal
    });
    setCurrentStep(2);
  };

  const handleSlotSelection = (slot) => {
    setFormData({
      ...formData,
      selectedSlot: slot
    });
    setCurrentStep(3);
  };

  const handleFinalSubmit = async (e) => {
    e.preventDefault();
    const id = generateReservationId();
    setReservationId(id);
    
    const [y, m, d] = formData.selectedDate.split('-').map(Number);
    const localDate = new Date(y, m - 1, d);
    const pickupDate = addDays(localDate, 1);
    
    const reservation = {
      id,
      ...formData,
      knifeQty: 'Pending',
      dropOffDate: format(localDate, 'EEEE, MMMM do'),
      selectedDate: formData.selectedDate,
      pickupDate: format(pickupDate, 'EEEE, MMMM do'),
      status: 'booked',
      createdAt: new Date().toISOString()
    };
    
    setFinalReservationData(reservation);
    
    try {
      const response = await fetch('http://localhost:3001/api/reservations/book', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          customer: {
            name: formData.name,
            email: formData.email,
            phone: formData.phone
          },
          reservation
        })
      });
      
      if (!response.ok) throw new Error('Failed to create reservation');
      
      localStorage.setItem(`reservation_${id}`, JSON.stringify(reservation));
      setCurrentStep(4);
    } catch (error) {
      console.error('Error creating reservation:', error);
      localStorage.setItem(`reservation_${id}`, JSON.stringify(reservation));
      setCurrentStep(4);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const resetForm = () => {
    setFormData({
      day: '',
      selectedSlot: '',
      name: '',
      phone: '',
      email: '',
      notes: '',
      selectedDate: null
    });
    setCurrentStep(1);
    setReservationId('');
  };

  // Determine which time slots to show based on selected date
  const timeSlotsByPart = formData.selectedDate 
    ? generateTimeSlots(formData.selectedDate) 
    : [];

  return (
    <div className="max-w-3xl mx-auto min-h-[60vh] flex flex-col justify-center">
      {/* Progress Indicator */}
      {currentStep < 4 && (
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center space-x-4">
            {[1, 2, 3].map((step) => (
              <React.Fragment key={step}>
                <div
                  className={`progress-step ${
                    currentStep === step
                      ? 'active'
                      : currentStep > step
                      ? 'completed'
                      : 'inactive'
                  }`}
                >
                  {currentStep > step ? (
                    <SafeIcon icon={FiCheck} className="w-5 h-5" />
                  ) : (
                    step
                  )}
                </div>
                {step < 3 && (
                  <div
                    className={`progress-line ${
                      currentStep > step ? 'completed' : ''
                    }`}
                  />
                )}
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
              <h2 className="font-serif font-bold text-3xl text-whetstone-cream mb-2">
                Make Reservations
              </h2>
              <p className="text-gray-300">Select a day for your drop-off</p>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {dayOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => {
                      if (option.value === 'thisweek') {
                        setFormData({
                          ...formData,
                          day: 'thisweek',
                          selectedDate: null
                        });
                      } else {
                        setFormData({
                          ...formData,
                          day: option.value,
                          selectedDate: option.date
                        });
                        setCurrentStep(2);
                      }
                    }}
                    className={`p-6 rounded-xl transition-all font-medium flex flex-col items-center justify-center h-40 shadow-lg relative overflow-hidden group ${
                      formData.day === option.value && formData.day !== 'thisweek'
                        ? 'bg-damascus-bronze text-white ring-2 ring-white/50'
                        : 'bg-carbon-black text-whetstone-cream hover:bg-honed-sage/20 hover:border-honed-sage border border-white/10'
                    }`}
                  >
                    <div
                      className={`absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity ${
                        formData.day === option.value ? 'bg-black' : 'bg-white'
                      }`}
                    ></div>
                    <span className="text-xl font-bold mb-2 font-serif tracking-wide">
                      {option.value === 'thisweek' ? 'Pick Date' : option.value === 'today' ? 'Today' : 'Tomorrow'}
                    </span>
                    <span
                      className={`text-sm ${
                        formData.day === option.value ? 'text-white/90' : 'text-gray-400'
                      }`}
                    >
                      {option.value === 'thisweek' ? 'More options' : option.label.split('(')[1].replace(')', '')}
                    </span>
                    {formData.day === option.value && (
                      <div className="absolute top-3 right-3">
                        <SafeIcon icon={FiCheck} className="w-5 h-5" />
                      </div>
                    )}
                  </button>
                ))}
              </div>

              {/* Date Picker for "This Week" */}
              {formData.day === 'thisweek' && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="mt-6 pt-6 border-t border-white/10"
                >
                  <h3 className="text-center font-semibold text-whetstone-cream mb-4">
                    Select a specific date:
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    {thisWeekDates.map((dateObj) => (
                      <button
                        key={dateObj.value}
                        onClick={() => handleDateSelection(dateObj.value)}
                        className="p-3 rounded-lg border border-gray-600 hover:bg-damascus-bronze hover:text-white hover:border-damascus-bronze transition-colors text-sm font-medium text-gray-300 bg-carbon-black"
                      >
                        {format(dateObj.date, 'EEE, MMM do')}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}

        {/* Step 2: Choose Time Slot */}
        {currentStep === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="card bg-steel-gray text-whetstone-cream"
          >
            <div className="flex items-center justify-between mb-6">
              <button
                onClick={() => setCurrentStep(1)}
                className="text-gray-300 hover:text-white flex items-center space-x-1 px-3 py-1 rounded hover:bg-white/10 transition-colors"
              >
                <SafeIcon icon={FiArrowLeft} />
                <span>Change Day</span>
              </button>
              <span className="font-semibold text-damascus-bronze bg-black/20 px-3 py-1 rounded-full">
                {formData.selectedDate &&
                  format(
                    new Date(formData.selectedDate.replace(/-/g, '/')),
                    'EEEE, MMMM do'
                  )}
              </span>
            </div>
            <div className="text-center mb-8">
              <h2 className="font-serif font-bold text-3xl text-whetstone-cream mb-2">
                Select Arrival Window
              </h2>
              <p className="text-gray-300">
                Choose your 30-minute drop-off window
              </p>
            </div>
            <div className="space-y-8">
              {timeSlotsByPart.map((part) => (
                <div key={part.id}>
                  <div className="flex items-center space-x-2 mb-3 border-b border-white/10 pb-2">
                    <SafeIcon icon={part.icon} className="text-damascus-bronze w-5 h-5" />
                    <h3 className="font-semibold text-whetstone-cream text-lg">
                      {part.label}
                    </h3>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    {part.slots.map((slot) => {
                      const [startTime, endTime] = slot.split(' ~ ');
                      const isSelected = formData.selectedSlot === slot;
                      
                      return (
                        <button
                          key={slot}
                          onClick={() => handleSlotSelection(slot)}
                          className={`relative overflow-hidden rounded-xl border-2 transition-all duration-200 flex flex-col items-center justify-center py-5 px-3 gap-1 group shadow-md ${
                            isSelected
                              ? 'bg-damascus-bronze text-white border-damascus-bronze shadow-lg scale-[1.05] z-10'
                              : 'bg-whetstone-cream text-carbon-black border-transparent hover:border-honed-sage hover:bg-white hover:shadow-lg hover:scale-[1.02]'
                          }`}
                        >
                          <span
                            className={`text-xl font-extrabold font-sans tracking-tight ${
                              isSelected ? 'text-white' : 'text-carbon-black'
                            }`}
                          >
                            {startTime}
                          </span>
                          <span
                            className={`text-[11px] uppercase tracking-wider font-bold ${
                              isSelected ? 'text-white/80' : 'text-gray-500'
                            }`}
                          >
                            Until {endTime}
                          </span>
                          {isSelected && (
                            <div className="absolute top-2 right-2 bg-white/20 rounded-full p-0.5">
                              <SafeIcon icon={FiCheck} className="w-3.5 h-3.5" />
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Step 3: Customer Details */}
        {currentStep === 3 && (
          <motion.div
            key="step3"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="card bg-steel-gray text-whetstone-cream"
          >
            <div className="text-center mb-8">
              <SafeIcon icon={FiUser} className="w-16 h-16 text-damascus-bronze mx-auto mb-4" />
              <h2 className="font-serif font-bold text-3xl text-whetstone-cream mb-2">
                Confirm Your Details
              </h2>
              <div className="bg-carbon-black/50 rounded-lg p-4 mb-4 border border-white/10">
                <p className="text-gray-300">
                  <strong>Reservation:</strong>{' '}
                  {formData.selectedDate &&
                    format(
                      new Date(formData.selectedDate.replace(/-/g, '/')),
                      'EEEE, MMM do'
                    )}
                  <br />
                  <strong>Window:</strong> {formData.selectedSlot}
                </p>
              </div>
            </div>
            <form onSubmit={handleFinalSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-whetstone-cream mb-2">
                    Customer Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-carbon-black/50 border border-gray-600 rounded-lg focus:ring-2 focus:ring-damascus-bronze focus:border-transparent transition-colors text-white"
                    placeholder="Your full name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-whetstone-cream mb-2">
                    Phone *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-carbon-black/50 border border-gray-600 rounded-lg focus:ring-2 focus:ring-damascus-bronze focus:border-transparent transition-colors text-white"
                    placeholder="(555) 123-4567"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-whetstone-cream mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-carbon-black/50 border border-gray-600 rounded-lg focus:ring-2 focus:ring-damascus-bronze focus:border-transparent transition-colors text-white"
                  placeholder="your@email.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-whetstone-cream mb-2">
                  Notes (Optional)
                </label>
                <textarea
                  name="notes"
                  rows={4}
                  value={formData.notes}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-carbon-black/50 border border-gray-600 rounded-lg focus:ring-2 focus:ring-damascus-bronze focus:border-transparent transition-colors resize-vertical text-white"
                  placeholder="Any special instructions or notes about your knives..."
                />
              </div>
              <div className="flex space-x-4">
                <button
                  type="button"
                  onClick={() => setCurrentStep(2)}
                  className="flex-1 btn-secondary py-3 flex items-center justify-center space-x-2"
                >
                  <SafeIcon icon={FiArrowLeft} className="w-5 h-5" />
                  <span>Back</span>
                </button>
                <button
                  type="submit"
                  className="flex-1 btn-primary py-3 flex items-center justify-center space-x-2"
                >
                  <span>Reserve Appointment</span>
                  <SafeIcon icon={FiCheck} className="w-5 h-5" />
                </button>
              </div>
            </form>
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
            <h2 className="font-serif font-bold text-3xl text-whetstone-cream mb-4">
              Reservation Confirmed!
            </h2>
            <div className="bg-damascus-bronze text-white rounded-lg p-6 mb-6 shadow-lg">
              <p className="text-sm mb-2">Your Reservation ID:</p>
              <p className="font-bold text-2xl tracking-wider">{reservationId}</p>
              {finalReservationData && (
                <div className="mt-4 pt-4 border-t border-white/20">
                  <a
                    href={generateGoogleCalendarUrl(finalReservationData)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-2 bg-white text-damascus-bronze px-4 py-2 rounded-lg text-sm font-bold hover:bg-gray-100 transition-colors"
                  >
                    <SafeIcon icon={FiCalendar} className="w-4 h-4" />
                    <span>Add to Google Calendar</span>
                  </a>
                </div>
              )}
            </div>
            <p className="text-gray-300 mb-8 leading-relaxed">
              We've sent a confirmation email with your reservation details. Please
              remember to check in using the Drop-Off Lookup page when you arrive.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={resetForm}
                className="btn-secondary py-3 px-6"
              >
                Make Another Reservation
              </button>
              <button
                onClick={() => (window.location.href = '#/dropbox')}
                className="btn-primary py-3 px-6"
              >
                Drop-Off Lookup
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ReservationForm;