import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiMenu, FiX, FiArrowRight } from 'react-icons/fi';
import ckwLogo from '../assets/ckw-logo.svg';

const BOOK_URL = '/book';

const Header = () => {
  const [open, setOpen] = useState(false);
  const links = [['How It Works', '/#how-it-works'], ['Services', '/#services'], ['FAQ', '/#faq']];

  return (
    <header className="sticky top-0 z-50 border-b border-black/10 bg-whetstone-cream/95 backdrop-blur-xl text-carbon-black shadow-sm">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 h-24 flex items-center justify-between gap-5">
        <Link to="/" className="flex items-center min-w-0" onClick={() => setOpen(false)} aria-label="Chef KnifeWorks home">
          <img src={ckwLogo} alt="Chef KnifeWorks Performance Knife Sharpening" className="h-[78px] w-auto object-contain" />
        </Link>
        <nav className="hidden lg:flex items-center gap-8 text-sm text-carbon-black/65">{links.map(([label, href]) => <a key={label} href={href} className="hover:text-honed-sage transition-colors">{label}</a>)}</nav>
        <div className="hidden md:flex items-center gap-3"><a href="tel:+16125674640" className="px-4 py-3 text-sm text-carbon-black/65 hover:text-honed-sage">Call</a><Link to={BOOK_URL} className="inline-flex items-center gap-2 rounded-full bg-honed-sage text-white px-5 py-3 text-sm font-bold hover:bg-damascus-bronze transition-colors">Book Your Arrival <FiArrowRight /></Link></div>
        <button className="md:hidden p-2 text-carbon-black" aria-label="Toggle navigation" onClick={() => setOpen(!open)}>{open ? <FiX size={22}/> : <FiMenu size={22}/>}</button>
      </div>
      {open && <div className="md:hidden border-t border-black/10 bg-whetstone-cream px-5 py-5 space-y-2">{links.map(([label, href]) => <a key={label} href={href} onClick={() => setOpen(false)} className="block py-3 text-carbon-black/70">{label}</a>)}<a href="tel:+16125674640" className="block py-3 text-carbon-black/70">Call (612) 567-4640</a><Link to={BOOK_URL} onClick={() => setOpen(false)} className="mt-3 flex items-center justify-center gap-2 rounded-full bg-honed-sage text-white px-5 py-4 font-bold">Book Your Arrival <FiArrowRight /></Link></div>}
    </header>
  );
};

export default Header;
