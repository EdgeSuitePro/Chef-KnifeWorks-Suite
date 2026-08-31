import React from 'react';
import { Link } from 'react-router-dom';
import { FiArrowRight, FiInfo, FiScissors, FiShield, FiStar, FiTool } from 'react-icons/fi';

const services = [
  [FiTool, 'Kitchen knives', 'Everyday chef knives, utility knives and household kitchen knives.', 'Sharpening is matched to the steel, geometry and intended use.'],
  [FiStar, 'Japanese & premium knives', 'Fine steels and higher-performance edges.', 'Handled with extra care and a technique appropriate to the knife.'],
  [FiShield, 'Repairs & restoration', 'Chips, broken tips and damaged edges.', 'Quoted after inspection because repair work varies by condition.'],
  [FiScissors, 'Scissors & select specialty', 'Kitchen and household scissors plus select sharpening items.', 'Tell us what you are bringing when you reserve.'],
];

const PricingPage = () => (
  <div className="min-h-screen bg-[#f2efe7] text-carbon-black">
    <section className="bg-[#0d0f0d] text-whetstone-cream border-b border-white/10">
      <div className="max-w-6xl mx-auto px-5 sm:px-8 py-20 md:py-28">
        <p className="text-xs font-bold uppercase tracking-[0.24em] text-honed-sage mb-4">Services & Pricing</p>
        <h1 className="font-serif text-5xl md:text-7xl leading-[1.1] mb-6">Clear service. Fair pricing.</h1>
        <p className="text-lg md:text-xl leading-8 text-white/65 max-w-3xl">Every item is inspected before the final charge is determined. You pay after the work is complete, so the price reflects the work your items actually need.</p>
      </div>
    </section>

    <section className="max-w-6xl mx-auto px-5 sm:px-8 py-20 md:py-24">
      <div className="grid md:grid-cols-2 gap-4">
        {services.map(([Icon,title,copy,note]) => <div key={title} className="rounded-2xl border border-black/10 bg-white/70 p-7 md:p-9 shadow-sm"><Icon className="text-honed-sage text-2xl mb-5"/><h2 className="font-serif text-3xl mb-3">{title}</h2><p className="text-carbon-black/70 leading-7 mb-4">{copy}</p><p className="text-sm text-carbon-black/50 leading-6">{note}</p></div>)}
      </div>

      <div className="mt-10 rounded-2xl border border-honed-sage/30 bg-honed-sage/10 p-7 md:p-8 flex gap-4 items-start"><FiInfo className="text-honed-sage mt-1 shrink-0"/><div><h3 className="font-bold mb-2">Why final pricing follows inspection</h3><p className="text-carbon-black/65 leading-7">Two similar-looking items can need very different work. Condition, steel and repair needs matter, so Chef KnifeWorks confirms the final charge after seeing what you actually brought.</p></div></div>

      <div className="mt-14 bg-honed-sage rounded-3xl p-8 md:p-12 grid md:grid-cols-[1fr_auto] gap-8 items-center"><div><p className="text-xs uppercase tracking-[0.2em] font-bold mb-3">Ready to get started?</p><h2 className="font-serif text-4xl md:text-5xl leading-[1.12]">Reserve your sharpening drop-off.</h2></div><Link to="/book" className="inline-flex items-center justify-center gap-3 rounded-xl bg-carbon-black text-white px-7 py-4 font-bold">Book Your Arrival <FiArrowRight/></Link></div>
    </section>
  </div>
);

export default PricingPage;
