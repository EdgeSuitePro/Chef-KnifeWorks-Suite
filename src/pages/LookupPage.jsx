import React from 'react';
import { motion } from 'framer-motion';
import ReservationLookup from '../components/ReservationLookup';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiSearch } = FiIcons;

const LookupPage = () => {
  return (
    <div className="min-h-screen bg-carbon-black text-whetstone-cream">
      {/* Hero Section */}
      <section className="bg-steel-gray text-whetstone-cream py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <h1 className="font-serif font-bold text-5xl mb-6">Reservation Lookup</h1>
            <p className="text-xl mb-8 opacity-90 max-w-3xl mx-auto text-gray-300">
              Check the status and details of your upcoming drop-off or sharpening service.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Lookup Component */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <ReservationLookup />
        </div>
      </section>
    </div>
  );
};

export default LookupPage;