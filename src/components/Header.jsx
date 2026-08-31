import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiMenu, FiX, FiArrowRight } from 'react-icons/fi';
import ckwLogo from '../assets/ckw-logo.svg';

const Header = () => {
  const [open, setOpen] = useState(false);
  const links = [
    ['Home', '/'],
    ['How It Works', '/#how-it-works'],
    ['Services', '/#services'],
    ['Pricing', '/pricing'],
    ['About', '/#about'],
    ['FAQ', '/#faq'],
    ['Contact', '/contact'],
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#101110]/95 backdrop-blur-xl text-whetstone-cream shadow-sm">
      <div className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8 h-20 md:h-24 flex items-center gap-4">
        <Link to="/" className="shrink min-w-0 flex items-center" onClick={() => setOpen(false)} aria-label="Chef KnifeWorks home">
          <img src={ckwLogo} alt="Chef KnifeWorks Performance Knife Sharpening" className="h-[58px] md:h-[78px] max-w-[215px] md:max-w-[290px] w-auto object-contain" />
        </Link>

        <nav className="hidden xl:flex flex-1 items-center justify-center gap-7 text-[13px] font-semibold uppercase tracking-[0.08em] text-white/72">
          {links.map(([label, href]) => label === 'Home'
            ? <Link key={label} to={href} className="hover:text-honed-sage transition-colors">{label}</Link>
            : href.startsWith('/#')
              ? <a key={label} href={href} className="hover:text-honed-sage transition-colors">{label}</a>
              : <Link key={label} to={href} className="hover:text-honed-sage transition-colors">{label}</Link>
          )}
        </nav>

        <div className="hidden md:flex ml-auto items-center gap-3 shrink-0">
          <a href="tel:+16125674640" className="hidden lg:block px-3 py-3 text-sm text-white/70 hover:text-honed-sage">Call</a>
          <Link to="/appointments" className="inline-flex items-center gap-2 rounded-xl bg-honed-sage text-white px-5 py-3 text-sm font-bold hover:bg-damascus-bronze transition-colors">Book Your Arrival <FiArrowRight /></Link>
        </div>

        <button className="md:hidden shrink-0 ml-auto w-12 h-12 rounded-full border border-white/20 bg-white/10 flex items-center justify-center text-white" aria-label="Toggle navigation" aria-expanded={open} onClick={() => setOpen(!open)}>{open ? <FiX size={25}/> : <FiMenu size={25}/>}</button>
      </div>

      {open && (
        <div className="md:hidden border-t border-white/10 bg-[#101110] px-5 py-5">
          <nav className="space-y-1">
            {links.map(([label, href]) => href.startsWith('/#')
              ? <a key={label} href={href} onClick={() => setOpen(false)} className="block py-3 text-white/82 font-semibold">{label}</a>
              : <Link key={label} to={href} onClick={() => setOpen(false)} className="block py-3 text-white/82 font-semibold">{label}</Link>
            )}
          </nav>
          <div className="border-t border-white/10 mt-3 pt-4">
            <a href="tel:+16125674640" className="block py-3 text-white/70">Call (612) 567-4640</a>
            <Link to="/appointments" onClick={() => setOpen(false)} className="mt-2 flex items-center justify-center gap-2 rounded-xl bg-honed-sage text-white px-5 py-4 font-bold">Book Your Arrival <FiArrowRight /></Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
