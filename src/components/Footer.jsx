import React from 'react';
import { Link } from 'react-router-dom';
import { FiArrowRight, FiMail, FiMapPin, FiPhone } from 'react-icons/fi';
import ckwLogo from '../assets/ckw-logo.svg';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="bg-[#0d0f0d] border-t border-white/10 text-gray-300">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 py-12 lg:py-16">
        <div className="grid lg:grid-cols-[1.15fr_0.85fr_0.85fr] gap-12">
          <div className="space-y-5">
            <Link to="/" className="inline-block"><img src={ckwLogo} alt="Chef KnifeWorks" className="h-20 w-auto max-w-[280px] object-contain" /></Link>
            <p className="max-w-md text-sm leading-7 text-white/55">Professional sharpening in Maple Grove with a simple reserve, drop-off and pickup experience.</p>
            <Link to="/book" className="inline-flex items-center gap-2 text-sm font-bold text-whetstone-cream hover:text-honed-sage transition-colors">Book Your Arrival <FiArrowRight /></Link>
          </div>
          <div><h4 className="text-whetstone-cream font-bold uppercase tracking-wider text-xs mb-5">Explore</h4><div className="space-y-3 text-sm text-white/55"><a href="/#how-it-works" className="block hover:text-honed-sage">How It Works</a><a href="/#services" className="block hover:text-honed-sage">Services</a><Link to="/pricing" className="block hover:text-honed-sage">Pricing</Link><a href="/#about" className="block hover:text-honed-sage">About</a><a href="/#faq" className="block hover:text-honed-sage">FAQ</a><Link to="/contact" className="block hover:text-honed-sage">Contact</Link></div></div>
          <div><h4 className="text-whetstone-cream font-bold uppercase tracking-wider text-xs mb-5">Contact</h4><div className="space-y-4 text-sm text-white/55"><div className="flex gap-3"><FiMapPin className="text-honed-sage mt-0.5 shrink-0"/><span>Professional home sharpening studio<br/>Maple Grove, Minnesota</span></div><a href="tel:+16125674640" className="flex gap-3 hover:text-white"><FiPhone className="text-honed-sage mt-0.5 shrink-0"/><span>(612) 567-4640</span></a><a href="mailto:sales@chefknifeworks.com" className="flex gap-3 hover:text-white"><FiMail className="text-honed-sage mt-0.5 shrink-0"/><span>sales@chefknifeworks.com</span></a></div></div>
        </div>
        <div className="border-t border-white/10 mt-12 pt-7 flex flex-col sm:flex-row gap-3 justify-between text-xs text-white/35"><span>© {currentYear} Chef KnifeWorks. All rights reserved.</span><span>Feel the Difference Sharp Can Make.</span></div>
      </div>
    </footer>
  );
};

export default Footer;
