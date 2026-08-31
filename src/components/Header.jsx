import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiMenu, FiX, FiArrowRight } from 'react-icons/fi';

const BOOK_URL = 'https://chefknifeworks.setmore.com/';

const Header = () => {
  const [open, setOpen] = useState(false);

  const links = [
    ['How It Works', '/#how-it-works'],
    ['Services', '/#services'],
    ['FAQ', '/#faq'],
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-carbon-black/95 backdrop-blur-xl text-whetstone-cream">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 h-20 flex items-center justify-between gap-5">
        <Link to="/" className="flex items-center gap-3 min-w-0" onClick={() => setOpen(false)}>
          <div className="w-10 h-10 rounded-full border border-honed-sage/60 bg-steel-gray/30 flex items-center justify-center font-serif text-xs tracking-wider text-honed-sage">CKW</div>
          <div className="min-w-0">
            <div className="font-serif text-lg leading-tight truncate">Chef KnifeWorks</div>
            <div className="text-[10px] uppercase tracking-[0.18em] text-honed-sage hidden sm:block">Precision · Craft · Performance</div>
          </div>
        </Link>

        <nav className="hidden lg:flex items-center gap-8 text-sm text-white/65">
          {links.map(([label, href]) => (
            <a key={label} href={href} className="hover:text-honed-sage transition-colors">{label}</a>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <a href="tel:+16125674640" className="px-4 py-3 text-sm text-white/65 hover:text-honed-sage">Call</a>
          <a href={BOOK_URL} className="inline-flex items-center gap-2 rounded-full bg-honed-sage text-white px-5 py-3 text-sm font-bold hover:bg-damascus-bronze transition-colors">Book Your Arrival <FiArrowRight /></a>
        </div>

        <button className="md:hidden p-2" aria-label="Toggle navigation" onClick={() => setOpen(!open)}>{open ? <FiX size={22}/> : <FiMenu size={22}/>}</button>
      </div>

      {open && (
        <div className="md:hidden border-t border-white/10 bg-carbon-black px-5 py-5 space-y-2">
          {links.map(([label, href]) => <a key={label} href={href} onClick={() => setOpen(false)} className="block py-3 text-white/75">{label}</a>)}
          <a href="tel:+16125674640" className="block py-3 text-white/75">Call (612) 567-4640</a>
          <a href={BOOK_URL} className="mt-3 flex items-center justify-center gap-2 rounded-full bg-honed-sage text-white px-5 py-4 font-bold">Book Your Arrival <FiArrowRight /></a>
        </div>
      )}
    </header>
  );
};

export default Header;
