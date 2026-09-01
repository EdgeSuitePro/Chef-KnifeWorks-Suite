import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiLock, FiArrowLeft } = FiIcons;

const LoginPage = () => {
  useEffect(() => {
    document.body.classList.add('light-theme-active');
    return () => document.body.classList.remove('light-theme-active');
  }, []);

  return (
    <div className="min-h-screen bg-whetstone-cream flex items-center justify-center px-4 text-carbon-black">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full"
      >
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-damascus-bronze rounded-lg flex items-center justify-center mx-auto mb-4 shadow-md">
            <SafeIcon icon={FiLock} className="text-white text-2xl" />
          </div>
          <h1 className="font-serif font-bold text-3xl text-carbon-black">Staff Access</h1>
          <p className="text-steel-gray mt-2">Secure staff sign-in is being upgraded for launch.</p>
        </div>

        <div className="bg-edge-white shadow-lg rounded-lg p-8 border border-steel-gray/20 text-center">
          <p className="text-steel-gray leading-7">
            The public Chef KnifeWorks site and customer booking experience remain available. Staff CRM access will return after secure authentication is connected.
          </p>
          <a href="/" className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-damascus-bronze hover:underline">
            <SafeIcon icon={FiArrowLeft} /> Back to Chef KnifeWorks
          </a>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;
