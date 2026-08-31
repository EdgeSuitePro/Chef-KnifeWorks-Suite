import React from 'react';
import { Link } from 'react-router-dom';
import { FiArrowRight, FiMail, FiMapPin, FiPhone } from 'react-icons/fi';

const BOOK_URL = 'https://chefknifeworks.setmore.com/';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-carbon-black border-t border-white/10 text-gray-300">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 py-12 lg:py-16">
        <div className="grid lg:grid-cols-[1.15fr_0.85fr_0.85fr] gap-12">
          <div className="space-y-5">
            <Link to="/" className="inline-flex items-center gap-3">
              <div className="w-10 h-10 rounded-full border border-honed-sage/60 bg-steel-gray/30 flex items-center justify-center font-serif text-xs tracking-wider text-honed-sage">CKW</div>
              <div>
                <div className="font-serif text-lg text-whetstone-cream">Chef KnifeWorks</div>
                <div className="text-[10px] uppercase tracking-[0.18em] text-honed-sage">Precision · Craft · Performance</div>
              </div>
            </Link>
            <p className="max-w-md text-sm leading-7 text-white/55">
              Professional knife sharpening in Maple Grove, Minnesota, with a simple reservation-to-pickup experience and careful service from a dedicated home sharpening studio.
            </p>
            <a href={BOOK_URL} className="inline-flex items-center gap-2 text-sm font-bold text-whetstone-cream hover:text-honed-sage transition-colors">
              Book Your Arrival <FiArrowRight />
            </a>
          </div>

          <div>
            <h4 className="text-whetstone-cream font-bold uppercase tracking-wider text-xs mb-5">Explore</h4>
            <div className="space-y-3 text-sm text-white/55">
              <a href="/#how-it-works" className="block hover:text-honed-sage transition-colors">How It Works</a>
              <a href="/#services" className="block hover:text-honed-sage transition-colors">Sharpening Services</a>
              <a href="/#faq" className="block hover:text-honed-sage transition-colors">Before You Arrive</a>
              <Link to="/contact" className="block hover:text-honed-sage transition-colors">Contact</Link>
            </div>
          </div>

          <div>
            <h4 className="text-whetstone-cream font-bold uppercase tracking-wider text-xs mb-5">Contact</h4>
            <div className="space-y-4 text-sm text-white/55">
              <div className="flex gap-3"><FiMapPin className="text-honed-sage mt-0.5 shrink-0" /><span>Professional home sharpening studio<br />Maple Grove, Minnesota</span></div>
              <a href="tel:+16125674640" className="flex gap-3 hover:text-white transition-colors"><FiPhone className="text-honed-sage mt-0.5 shrink-0" /><span>(612) 567-4640</span></a>
              <a href="mailto:info@chefknifeworks.com" className="flex gap-3 hover:text-white transition-colors"><FiMail className="text-honed-sage mt-0.5 shrink-0" /><span>info@chefknifeworks.com</span></a>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 mt-12 pt-7 flex flex-col sm:flex-row gap-3 justify-between text-xs text-white/35">
          <span>© {currentYear} Chef KnifeWorks. All rights reserved.</span>
          <span>Feel the Difference Sharp Can Make.</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
