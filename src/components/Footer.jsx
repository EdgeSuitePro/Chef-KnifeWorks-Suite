import React from 'react';
import { Link } from 'react-router-dom';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiMapPin, FiPhone, FiMail, FiClock, FiGift, FiLock, FiInstagram, FiFacebook } = FiIcons;

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const SQUARE_GIFT_CARD_URL = 'https://app.squareup.com/gift/VKHWTKDWTQ08J/order';

  return (
    <footer className="bg-carbon-black text-gray-300 border-t border-steel-gray/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="col-span-1 md:col-span-1">
            <Link to="/" className="flex items-center space-x-2 mb-6">
              <div className="w-8 h-8 bg-honed-sage rounded flex items-center justify-center text-white font-bold font-serif">
                CK
              </div>
              <span className="font-serif text-white text-lg">Chef KnifeWorks</span>
            </Link>
            <p className="text-sm leading-relaxed mb-6 text-gray-400">
              Professional knife sharpening services. Restoring the edge to your culinary tools with
              precision and care.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-honed-sage transition-colors">
                <SafeIcon icon={FiInstagram} />
              </a>
              <a href="#" className="text-gray-400 hover:text-honed-sage transition-colors">
                <SafeIcon icon={FiFacebook} />
              </a>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-bold uppercase tracking-wider text-xs mb-6">Contact</h3>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start space-x-3">
                <SafeIcon icon={FiMapPin} className="mt-1 text-honed-sage" />
                <span>
                  13969 88th Place North
                  <br />
                  Maple Grove, MN 55369
                </span>
              </li>
              <li className="flex items-center space-x-3">
                <SafeIcon icon={FiPhone} className="text-honed-sage" />
                <a href="tel:6125674640" className="hover:text-white transition-colors">
                  (612) 567-4640
                </a>
              </li>
              <li className="flex items-center space-x-3">
                <SafeIcon icon={FiMail} className="text-honed-sage" />
                <a href="mailto:info@chefknifeworks.com" className="hover:text-white transition-colors">
                  info@chefknifeworks.com
                </a>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-bold uppercase tracking-wider text-xs mb-6">Explore</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link to="/appointment" className="hover:text-honed-sage transition-colors">
                  Make Reservation
                </Link>
              </li>
              <li>
                <Link to="/pricing" className="hover:text-honed-sage transition-colors">
                  Pricing & Services
                </Link>
              </li>
              <li>
                <Link to="/dropbox" className="hover:text-honed-sage transition-colors">
                  Drop-Off System
                </Link>
              </li>
              <li>
                <a
                  href={SQUARE_GIFT_CARD_URL}
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-honed-sage transition-colors"
                >
                  Gift Cards
                </a>
              </li>
            </ul>
          </div>

          {/* Hours */}
          <div>
            <h3 className="text-white font-bold uppercase tracking-wider text-xs mb-6">Hours</h3>
            <div className="space-y-4 text-sm">
              <div>
                <p className="text-white font-medium mb-1">DROP-OFF</p>
                <p className="mb-1">Secure Drop Box: 8 AM – 8 PM</p>
                <p>Personal Handoff: By appointment</p>
              </div>
              <div>
                <p className="text-white font-medium mb-1">PICKUP</p>
                <p>After notification: 8 AM – 8 PM</p>
              </div>
              <div>
                <p className="text-white font-medium mb-1">TURNAROUND</p>
                <p>Next Day (typically within 24 hours)</p>
              </div>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-16 pt-8 flex flex-col md:flex-row justify-between items-center text-xs">
          <p>&copy;{currentYear} Chef KnifeWorks. All rights reserved.</p>
          <div className="flex items-center space-x-6 mt-4 md:mt-0">
            <Link
              to="/crm"
              className="flex items-center space-x-1 hover:text-white transition-colors text-gray-600"
            >
              <SafeIcon icon={FiLock} className="w-3 h-3" />
              <span>Staff</span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;