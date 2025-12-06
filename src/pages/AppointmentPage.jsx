import React from 'react';
import { motion } from 'framer-motion';
import SafeIcon from '../common/SafeIcon';
import ReservationForm from '../components/ReservationForm';
import * as FiIcons from 'react-icons/fi';

const { FiCalendar, FiClock, FiCheck } = FiIcons;

const AppointmentPage = () => {
  return (
    <div className="min-h-screen bg-carbon-black text-whetstone-cream">
      {/* Hero Section */}
      <section id="hero" className="bg-steel-gray text-whetstone-cream py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <h1 className="font-serif font-bold text-5xl mb-6">Reserve Your Drop-Off Time</h1>
            <p className="text-xl mb-8 opacity-90 max-w-3xl mx-auto text-gray-300">
              Schedule a convenient 30-minute window to drop off your knives at the Home Shoppe. Our contactless system makes it simple and safe.
            </p>
          </motion.div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-12 bg-carbon-black border-b border-white/5">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-damascus-bronze rounded-full flex items-center justify-center mb-4 shadow-lg">
                <SafeIcon icon={FiCalendar} className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold text-lg mb-2 text-whetstone-cream">Choose Your Time</h3>
              <p className="text-gray-400 text-sm">Select a day and 30-minute arrival window</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-damascus-bronze rounded-full flex items-center justify-center mb-4 shadow-lg">
                <SafeIcon icon={FiClock} className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold text-lg mb-2 text-whetstone-cream">Drop Off Knives</h3>
              <p className="text-gray-400 text-sm">Use our Porch DropBox system during your window</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-damascus-bronze rounded-full flex items-center justify-center mb-4 shadow-lg">
                <SafeIcon icon={FiCheck} className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold text-lg mb-2 text-whetstone-cream">Get Confirmation</h3>
              <p className="text-gray-400 text-sm">Receive your reservation ID and pickup details</p>
            </div>
          </div>
        </div>
      </section>

      {/* Reservation Form */}
      <section id="reservation-form" className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <ReservationForm />
        </div>
      </section>

      {/* Important Notes - Updated Colors */}
      <section id="important-info" className="py-12 bg-whetstone-cream text-carbon-black">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="font-serif font-bold text-2xl mb-6 text-center text-carbon-black">Important Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
            <div>
              <h4 className="font-semibold mb-2 text-carbon-black">Arrival Windows</h4>
              <p className="opacity-90 text-steel-gray">All reservations are 30-minute arrival windows, not exact appointment times. This allows for flexibility in your schedule.</p>
            </div>
            <div>
              <h4 className="font-semibold mb-2 text-carbon-black">Home Shoppe Model</h4>
              <p className="opacity-90 text-steel-gray">This is a residential location with a contactless drop-off system. Please arrive only during your reserved window.</p>
            </div>
            <div>
              <h4 className="font-semibold mb-2 text-carbon-black">Typical Turnaround</h4>
              <p className="opacity-90 text-steel-gray">Next Day (within 24 hours typically). You'll receive pickup notifications.</p>
            </div>
            <div>
              <h4 className="font-semibold mb-2 text-carbon-black">Payment</h4>
              <p className="opacity-90 text-steel-gray">No payment required upfront. Final pricing is determined after inspection, and payment is collected at pickup.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AppointmentPage;