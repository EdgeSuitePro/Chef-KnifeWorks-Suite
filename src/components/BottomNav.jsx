import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import SafeIcon from '../common/SafeIcon';
import ReservationLookup from './ReservationLookup';
import DropOffLookup from './DropOffLookup';
import * as FiIcons from 'react-icons/fi';

const { FiSearch, FiGift, FiUsers, FiCheckSquare, FiX, FiArrowRight } = FiIcons;

const BottomNav = () => {
  const location = useLocation();
  const [activeModal, setActiveModal] = useState(null);
  const SQUARE_GIFT_CARD_URL = "https://app.squareup.com/gift/VKHWTKDWTQ08J/order";
  const REFERRAL_URL = "https://refer.chefknifeworks.com";

  const toggleModal = (modalName) => {
    setActiveModal(activeModal === modalName ? null : modalName);
  };

  const closeModal = () => setActiveModal(null);

  const navItems = [
    { 
      name: 'Track Order', 
      icon: FiSearch, 
      id: 'track-order',
      type: 'modal',
      component: <ReservationLookup />
    },
    { 
      name: 'Gift Cards', 
      icon: FiGift, 
      path: SQUARE_GIFT_CARD_URL,
      type: 'external'
    },
    { 
      name: 'Referrals', 
      icon: FiUsers, 
      path: REFERRAL_URL,
      type: 'external'
    },
    { 
      name: 'Check-In', 
      icon: FiCheckSquare, 
      id: 'check-in',
      type: 'modal',
      component: <DropOffLookup />
    }
  ];

  const handleNavigation = (item) => {
    if (item.type === 'external') {
      window.open(item.path, '_blank');
      return;
    }
    if (item.type === 'modal') {
      toggleModal(item.id);
    }
  };

  return (
    <>
      {/* Modal Overlay */}
      <AnimatePresence>
        {activeModal && (
          <div className="fixed inset-0 z-[60] flex items-end md:items-center justify-center sm:p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeModal}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            
            {/* Modal Content */}
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="relative w-full max-w-2xl bg-[#1E1E1E] rounded-t-2xl md:rounded-2xl shadow-2xl overflow-hidden max-h-[85vh] flex flex-col"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between p-4 border-b border-white/10 bg-[#252525]">
                <h3 className="text-whetstone-cream font-serif text-lg tracking-wide">
                  {navItems.find(i => i.id === activeModal)?.name}
                </h3>
                <button 
                  onClick={closeModal}
                  className="p-2 text-gray-400 hover:text-white transition-colors rounded-full hover:bg-white/10"
                >
                  <SafeIcon icon={FiX} className="w-6 h-6" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6 overflow-y-auto custom-scrollbar">
                {navItems.find(i => i.id === activeModal)?.component}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Bottom Navigation Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-[#2C2C2C]/80 backdrop-blur-xl border-t border-white/10 shadow-[0_-4px_30px_rgba(0,0,0,0.5)]">
        <div className="max-w-7xl mx-auto px-4 safe-area-bottom">
          <div className="flex justify-around items-center h-16 md:h-20">
            {navItems.map((item) => {
              const isActive = activeModal === item.id;
              const Icon = item.icon;
              
              return (
                <button
                  key={item.name}
                  onClick={() => handleNavigation(item)}
                  className="flex flex-col items-center justify-center w-full h-full space-y-1 group"
                >
                  <div className={`p-1.5 rounded-full transition-all duration-300 ${isActive ? 'bg-honed-sage/20 text-honed-sage' : 'text-gray-400 group-hover:text-honed-sage'}`}>
                    <SafeIcon icon={Icon} className="w-5 h-5 md:w-6 md:h-6" />
                  </div>
                  <span className={`text-[10px] md:text-xs font-medium uppercase tracking-wider transition-colors duration-300 ${isActive ? 'text-honed-sage' : 'text-gray-500 group-hover:text-gray-300'}`}>
                    {item.name}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
};

export default BottomNav;