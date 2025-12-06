import React from 'react';
import { motion } from 'framer-motion';
import SafeIcon from '../common/SafeIcon';
import DropOffLookup from '../components/DropOffLookup';
import * as FiIcons from 'react-icons/fi';

const { FiMapPin, FiClock, FiCamera, FiCheck, FiSmartphone, FiMail, FiKey } = FiIcons;

const DropBoxPage = () => {
  const steps = [
    { icon: FiMapPin, title: 'Make a Reservation', description: 'Book your 30-minute drop-off window online first' },
    { icon: FiClock, title: 'Arrive During Your Window', description: 'Come to the Home Shoppe during your reserved time' },
    { icon: FiKey, title: 'Look Up Your Reservation', description: 'Use Reservation ID, phone number, or email below' },
    { icon: FiCheck, title: 'Confirm Details', description: 'System asks "Is this you?" to verify your booking' },
    { icon: FiCamera, title: 'Upload Photos (Optional)', description: 'Take pictures of items you\'re dropping off' },
    { icon: FiMail, title: 'Get Confirmation', description: 'Both you and the sharpener receive notifications' }
  ];

  return (
    <div className="min-h-screen bg-carbon-black text-whetstone-cream">
      {/* Hero Section */}
      <section className="bg-steel-gray text-whetstone-cream py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <h1 className="font-serif font-bold text-5xl mb-6">
              DropBox Check-In
            </h1>
            <p className="text-xl mb-8 opacity-90 max-w-3xl mx-auto text-gray-300">
              Welcome to the Home Shoppe. Use this page to safely check in your knives when you arrive at our secure drop box.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Drop-Off Lookup Form */}
      <section className="py-16 bg-steel-gray/20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <DropOffLookup />
        </div>
      </section>

      {/* Security & Safety */}
      <section className="py-16 bg-honed-sage text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <h2 className="font-serif font-bold text-4xl mb-6">
                Security & Safety First
              </h2>
              <p className="text-xl mb-8 opacity-90 leading-relaxed text-gray-100">
                Our DropBox system is designed with security and safety as top priorities. Every drop-off is logged, photographed, and confirmed to ensure your knives are protected throughout the entire process.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
                <div className="text-center">
                  <div className="w-16 h-16 bg-damascus-bronze rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <SafeIcon icon={FiCheck} className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">Secure Drop-Off</h3>
                  <p className="opacity-90 text-gray-100">Locked system accessible only during your window</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-damascus-bronze rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <SafeIcon icon={FiCamera} className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">Photo Documentation</h3>
                  <p className="opacity-90 text-gray-100">Pictures taken for your protection and ours</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-damascus-bronze rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <SafeIcon icon={FiSmartphone} className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">Instant Notifications</h3>
                  <p className="opacity-90 text-gray-100">Real-time updates via email and text</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default DropBoxPage;