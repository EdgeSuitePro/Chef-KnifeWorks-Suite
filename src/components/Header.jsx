import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiMenu, FiX, FiCalendar, FiCheckSquare } = FiIcons;

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const SQUARE_GIFT_CARD_URL = "https://app.squareup.com/gift/VKHWTKDWTQ08J/order";

  const navigation = [
    { name: 'Home', href: '/', anchor: 'hero' },
    { name: 'Pricing', href: '/pricing' },
    { name: 'Lookup', href: '/lookup' },
    { name: 'Gift Cards', href: SQUARE_GIFT_CARD_URL, external: true },
    { name: 'Contact', href: '/contact' },
  ];

  const handleNavigation = (item) => {
    if (item.external) {
      window.open(item.href, '_blank');
      setIsMenuOpen(false);
      return;
    }

    const href = item.anchor ? `/#${item.anchor}` : item.href;
    setIsMenuOpen(false);

    if (href.startsWith('/#') || href.includes('#')) {
      const [path, anchorId] = href.split('#').filter(Boolean);
      const targetPath = path || '/';

      if (location.pathname === targetPath) {
        const element = document.getElementById(anchorId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      } else {
        navigate(targetPath);
        setTimeout(() => {
          const element = document.getElementById(anchorId);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }, 300);
      }
    } else {
      navigate(href);
    }
  };

  return (
    <header className="bg-[#2C2C2C]/95 backdrop-blur-2xl border-b border-white/10 sticky top-0 z-50 shadow-2xl transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link 
            to="/#hero" 
            className="flex items-center space-x-3 group"
            onClick={(e) => {
              e.preventDefault();
              handleNavigation({ href: '/', anchor: 'hero' });
            }}
          >
            <div className="w-10 h-10 bg-steel-gray rounded-full flex items-center justify-center border border-white/20 shadow-lg group-hover:border-honed-sage transition-colors">
              <span className="text-whetstone-cream font-serif font-bold text-lg">CKW</span>
            </div>
            <div className="hidden sm:block">
              <h1 className="font-serif text-lg text-whetstone-cream tracking-wide group-hover:text-white transition-colors">Chef KnifeWorks</h1>
              <p className="text-[10px] text-honed-sage uppercase tracking-widest group-hover:text-damascus-bronze transition-colors">Precision • Craft • Performance</p>
            </div>
          </Link>

          {/* Desktop Navigation - Centered */}
          <nav className="hidden lg:flex items-center space-x-8">
            {navigation.map((item) => (
              <button
                key={item.name}
                onClick={() => handleNavigation(item)}
                className={`text-xs font-semibold uppercase tracking-wider transition-all duration-200 hover:-translate-y-0.5 ${
                  location.pathname === item.href && !item.external
                    ? 'text-honed-sage font-bold' 
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                {item.name}
              </button>
            ))}
          </nav>

          {/* Right Side CTA Buttons */}
          <div className="hidden md:flex items-center space-x-3">
            <Link 
              to="/dropbox" 
              className="border border-honed-sage text-honed-sage hover:bg-honed-sage hover:text-white text-xs font-bold uppercase tracking-wider px-4 py-3 rounded transition-all duration-300 flex items-center space-x-2 shadow-md hover:shadow-lg"
            >
              <SafeIcon icon={FiCheckSquare} className="w-4 h-4" />
              <span>Check-In</span>
            </Link>
            <Link 
              to="/appointment" 
              className="bg-honed-sage hover:bg-damascus-bronze text-white text-xs font-bold uppercase tracking-wider px-6 py-3 rounded transition-all duration-300 shadow-lg hover:shadow-xl flex items-center space-x-2"
            >
              <SafeIcon icon={FiCalendar} className="w-4 h-4" />
              <span>Reservations</span>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="lg:hidden p-2 text-whetstone-cream hover:text-white transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <SafeIcon icon={isMenuOpen ? FiX : FiMenu} className="w-6 h-6" />
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <motion.nav 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="lg:hidden py-4 border-t border-white/10 bg-[#2C2C2C]/95 backdrop-blur-xl shadow-xl rounded-b-lg"
          >
            {navigation.map((item) => (
              <button
                key={item.name}
                onClick={() => handleNavigation(item)}
                className={`block w-full text-left px-4 py-3 text-sm font-medium uppercase tracking-wider ${
                  location.pathname === item.href 
                    ? 'text-honed-sage bg-white/5' 
                    : 'text-gray-300 hover:text-white hover:bg-white/5'
                }`}
              >
                {item.name}
              </button>
            ))}
            <div className="px-4 pt-4 pb-2 space-y-3">
              <Link 
                to="/dropbox" 
                onClick={() => setIsMenuOpen(false)}
                className="block w-full text-center border border-honed-sage text-honed-sage py-3 rounded font-bold uppercase tracking-wider text-sm hover:bg-honed-sage hover:text-white transition-colors"
              >
                Check-In
              </Link>
              <Link 
                to="/appointment" 
                onClick={() => setIsMenuOpen(false)}
                className="block w-full text-center bg-honed-sage text-white py-3 rounded font-bold uppercase tracking-wider text-sm shadow-md hover:bg-damascus-bronze transition-colors"
              >
                Reservations
              </Link>
            </div>
          </motion.nav>
        )}
      </div>
    </header>
  );
};

export default Header;