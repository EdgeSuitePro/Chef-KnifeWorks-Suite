import React from 'react';
import { Link } from 'react-router-dom';
import { FiArrowRight, FiMail, FiMapPin, FiPhone } from 'react-icons/fi';

const ContactPage = () => (
  <div className="min-h-screen bg-[#f2efe7] text-carbon-black">
    <section className="bg-[#0d0f0d] text-whetstone-cream border-b border-white/10">
      <div className="max-w-6xl mx-auto px-5 sm:px-8 py-20 md:py-28">
        <p className="text-xs font-bold uppercase tracking-[0.24em] text-honed-sage mb-4">Contact Chef KnifeWorks</p>
        <h1 className="font-serif text-5xl md:text-7xl leading-[1.1] mb-6">Questions before you arrive?</h1>
        <p className="text-lg md:text-xl leading-8 text-white/65 max-w-3xl">Call, text or email. For a sharpening drop-off, the fastest path is to reserve an arrival window online.</p>
      </div>
    </section>

    <section className="max-w-6xl mx-auto px-5 sm:px-8 py-20 md:py-24 grid lg:grid-cols-[1fr_1fr] gap-8">
      <div className="space-y-4">
        <a href="tel:+16125674640" className="flex gap-5 items-start rounded-2xl border border-black/10 bg-white/70 p-7 shadow-sm hover:border-honed-sage/50 transition-colors"><div className="w-12 h-12 rounded-xl bg-honed-sage/15 text-honed-sage flex items-center justify-center shrink-0"><FiPhone/></div><div><h2 className="font-bold text-lg mb-1">Call or text</h2><p className="text-carbon-black/65">(612) 567-4640</p></div></a>
        <a href="mailto:sales@chefknifeworks.com" className="flex gap-5 items-start rounded-2xl border border-black/10 bg-white/70 p-7 shadow-sm hover:border-honed-sage/50 transition-colors"><div className="w-12 h-12 rounded-xl bg-honed-sage/15 text-honed-sage flex items-center justify-center shrink-0"><FiMail/></div><div><h2 className="font-bold text-lg mb-1">Email</h2><p className="text-carbon-black/65">sales@chefknifeworks.com</p></div></a>
        <div className="flex gap-5 items-start rounded-2xl border border-black/10 bg-white/70 p-7 shadow-sm"><div className="w-12 h-12 rounded-xl bg-honed-sage/15 text-honed-sage flex items-center justify-center shrink-0"><FiMapPin/></div><div><h2 className="font-bold text-lg mb-1">Maple Grove, Minnesota</h2><p className="text-carbon-black/65 leading-7">Chef KnifeWorks operates from a professional home sharpening studio. Your reservation confirmation provides the arrival guidance you need.</p></div></div>
      </div>

      <div className="rounded-3xl bg-honed-sage p-8 md:p-10 self-start"><p className="text-xs uppercase tracking-[0.2em] font-bold mb-4">Sharpening drop-off</p><h2 className="font-serif text-4xl md:text-5xl leading-[1.12] mb-5">Skip the back-and-forth.</h2><p className="text-carbon-black/70 leading-7 mb-8">Choose your day and arrival window online. Tell us what you are bringing, and you are set.</p><Link to="/book" className="inline-flex items-center gap-3 rounded-xl bg-carbon-black text-white px-7 py-4 font-bold">Book Your Arrival <FiArrowRight/></Link></div>
    </section>
  </div>
);

export default ContactPage;
