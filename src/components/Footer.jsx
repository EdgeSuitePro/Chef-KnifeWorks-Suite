import React from 'react';
import { Link } from 'react-router-dom';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiMapPin, FiMail, FiPhone, FiInstagram, FiFacebook, FiYoutube, FiClock } = FiIcons;

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-carbon-black border-t border-white/10 text-gray-300 pb-24 md:pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand Column */}
          <div className="space-y-6">
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="w-10 h-10 bg-steel-gray rounded-full flex items-center justify-center border border-white/20">
                <span className="text-whetstone-cream font-serif font-bold text-lg">CKW</span>
              </div>
              <div>
                <h3 className="font-serif text-lg text-whetstone-cream tracking-wide">Chef KnifeWorks</h3>
                <p className="text-[10px] text-honed-sage uppercase tracking-widest">Precision • Craft • Performance</p>
              </div>
            </Link>
            <p className="text-sm font-light leading-relaxed text-gray-400">
              Professional knife sharpening services dedicated to restoring the perfect edge to your culinary tools.
              Experience the difference sharp can make.
            </p>
            <div className="flex space-x-4 pt-2">
              <a href="#" className="text-gray-400 hover:text-honed-sage transition-colors">
                <SafeIcon icon={FiInstagram} className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-honed-sage transition-colors">
                <SafeIcon icon={FiFacebook} className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-honed-sage transition-colors">
                <SafeIcon icon={FiYoutube} className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-whetstone-cream font-bold uppercase tracking-wider text-sm mb-6">Explore</h4>
            <ul className="space-y-3">
              <li>
                <Link to="/pricing" className="text-sm text-gray-400 hover:text-honed-sage transition-colors flex items-center gap-2">
                  <span className="w-1 h-1 bg-honed-sage rounded-full opacity-0 group-hover:opacity-100"></span>
                  Services & Pricing
                </Link>
              </li>
              <li>
                <Link to="/appointment" className="text-sm text-gray-400 hover:text-honed-sage transition-colors flex items-center gap-2">
                  <span className="w-1 h-1 bg-honed-sage rounded-full opacity-0 group-hover:opacity-100"></span>
                  Book Appointment
                </Link>
              </li>
              <li>
                <Link to="/dropbox" className="text-sm text-gray-400 hover:text-honed-sage transition-colors flex items-center gap-2">
                  <span className="w-1 h-1 bg-honed-sage rounded-full opacity-0 group-hover:opacity-100"></span>
                  Check-In Kiosk
                </Link>
              </li>
              <li>
                <Link to="/lookup" className="text-sm text-gray-400 hover:text-honed-sage transition-colors flex items-center gap-2">
                  <span className="w-1 h-1 bg-honed-sage rounded-full opacity-0 group-hover:opacity-100"></span>
                  Track Order
                </Link>
              </li>
              <li>
                <Link to="/login" className="text-sm text-gray-400 hover:text-honed-sage transition-colors flex items-center gap-2">
                  <span className="w-1 h-1 bg-honed-sage rounded-full opacity-0 group-hover:opacity-100"></span>
                  Staff Login
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-whetstone-cream font-bold uppercase tracking-wider text-sm mb-6">Contact</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <SafeIcon icon={FiMapPin} className="w-5 h-5 text-honed-sage shrink-0 mt-0.5" />
                <span className="text-sm text-gray-400 leading-relaxed">
                  13969 88th Place North<br />
                  Maple Grove, MN 55369
                </span>
              </li>
              <li className="flex items-center gap-3">
                <SafeIcon icon={FiPhone} className="w-5 h-5 text-honed-sage shrink-0" />
                <a href="tel:612-567-4640" className="text-sm text-gray-400 hover:text-white transition-colors">
                  (612) 567-4640
                </a>
              </li>
              <li className="flex items-center gap-3">
                <SafeIcon icon={FiMail} className="w-5 h-5 text-honed-sage shrink-0" />
                <a href="mailto:info@chefknifeworks.com" className="text-sm text-gray-400 hover:text-white transition-colors">
                  info@chefknifeworks.com
                </a>
              </li>
            </ul>
          </div>

          {/* Hours */}
          <div>
            <h4 className="text-whetstone-cream font-bold uppercase tracking-wider text-sm mb-6">Hours</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <SafeIcon icon={FiClock} className="w-5 h-5 text-honed-sage shrink-0 mt-0.5" />
                <div className="text-sm text-gray-400">
                  <span className="block text-white font-medium mb-1">Drop-Off & Pickup</span>
                  <span className="block">Daily 7:00AM - 9:00PM</span>
                  <span className="block text-xs text-gray-500 mt-1 italic">Drop Box Available</span>
                </div>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/5 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-gray-500">
            &copy; {currentYear} Chef KnifeWorks. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link to="/privacy" className="text-xs text-gray-500 hover:text-white transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="text-xs text-gray-500 hover:text-white transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;