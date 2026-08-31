import React from 'react';
import { FiArrowRight, FiCheck, FiClock, FiHome, FiMapPin, FiShield, FiStar, FiTool, FiUser } from 'react-icons/fi';

const BOOK_URL = 'https://chefknifeworks.setmore.com/';
const PHONE = 'tel:+16125674640';

const SectionTitle = ({ eyebrow, title, copy }) => (
  <div className="max-w-3xl">
    <p className="text-xs font-bold uppercase tracking-[0.24em] text-honed-sage mb-4">{eyebrow}</p>
    <h2 className="font-serif text-4xl md:text-6xl leading-[1.08] text-whetstone-cream mb-5">{title}</h2>
    {copy && <p className="text-lg leading-8 text-white/65">{copy}</p>}
  </div>
);

const HomePage = () => {
  const steps = [
    ['01', 'Reserve', 'Choose a convenient drop-off window online.'],
    ['02', 'Arrive', 'Come to our professional home sharpening studio in Maple Grove.'],
    ['03', 'Sharpen', 'Your knives are inspected, sharpened, finished and checked by hand.'],
    ['04', 'Depart', 'We message you when they are ready. Pay, pick up, and get cooking.'],
  ];

  const services = [
    ['Chef knives', 'Everyday German, Western and household kitchen knives.'],
    ['Japanese knives', 'Premium steels and fine edges handled with the care they deserve.'],
    ['Repairs', 'Chips, broken tips, bolster work and edge restoration when needed.'],
    ['Scissors & specialty', 'Kitchen and household scissors plus select specialty sharpening.'],
  ];

  const faqs = [
    ['Is this a storefront?', 'No. Chef KnifeWorks operates from a dedicated professional home sharpening studio in Maple Grove. Your reservation gives you the arrival instructions you need.'],
    ['How long does sharpening take?', 'Most standard orders are completed in roughly 36–48 hours. Faster service may be available depending on the day and workload.'],
    ['Do I pay when I book?', 'No. You pay after the work is completed, so you are charged for the sharpening and repairs actually performed.'],
    ['Do I need an appointment?', 'A reservation is strongly recommended. It keeps arrivals organized and makes drop-off much smoother.'],
  ];

  return (
    <div className="bg-carbon-black text-whetstone-cream overflow-hidden">
      <section id="hero" className="relative min-h-[84vh] flex items-center border-b border-white/10">
        <div className="absolute inset-0 opacity-40" style={{backgroundImage:'radial-gradient(circle at 75% 25%, rgba(139,154,136,.28), transparent 30%), radial-gradient(circle at 15% 70%, rgba(200,117,78,.12), transparent 24%)'}} />
        <div className="relative max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 py-24 md:py-32 w-full">
          <div className="max-w-5xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.04] px-4 py-2 text-xs uppercase tracking-[0.2em] text-white/70 mb-8">
              <FiMapPin className="text-honed-sage" /> Maple Grove, Minnesota
            </div>
            <h1 className="font-serif text-5xl sm:text-7xl lg:text-[92px] leading-[1.08] tracking-[-0.03em] mb-8 max-w-5xl">
              Professional knife sharpening.
              <span className="block text-honed-sage mt-2">Done with a chef’s eye for detail.</span>
            </h1>
            <p className="max-w-2xl text-lg md:text-xl leading-9 text-white/70 mb-10">
              Reserve a convenient drop-off in Maple Grove. I’ll inspect, sharpen, repair and finish your knives, then let you know when they’re ready to pick up.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
              <a href={BOOK_URL} className="inline-flex items-center justify-center gap-3 rounded-full bg-honed-sage px-7 py-4 font-bold text-white hover:bg-damascus-bronze transition-colors">
                Book Your Arrival <FiArrowRight />
              </a>
              <a href="#how-it-works" className="inline-flex items-center justify-center rounded-full border border-white/20 px-7 py-4 font-semibold text-white/85 hover:bg-white/5 transition-colors">
                See How It Works
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-whetstone-cream text-carbon-black">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 py-8 grid sm:grid-cols-3 gap-5">
          {[
            [FiClock, '36–48 hour', 'typical turnaround'],
            [FiHome, 'Home studio', 'clear arrival instructions'],
            [FiShield, 'Professional care', 'from intake to final edge'],
          ].map(([Icon, big, small]) => (
            <div key={big} className="flex items-center gap-4 py-3">
              <div className="w-11 h-11 rounded-full border border-carbon-black/10 text-steel-gray flex items-center justify-center"><Icon /></div>
              <div><div className="font-bold">{big}</div><div className="text-sm text-carbon-black/60">{small}</div></div>
            </div>
          ))}
        </div>
      </section>

      <section id="how-it-works" className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 py-24 md:py-32">
        <SectionTitle eyebrow="Arrival → Departure" title="Knife sharpening should feel simple." copy="No mystery, no wandering through a complicated booking maze. Four clear steps from dull to done." />
        <div className="grid md:grid-cols-4 gap-px bg-white/10 border border-white/10 mt-14">
          {steps.map(([num,title,copy]) => (
            <div key={num} className="bg-carbon-black p-7 md:p-8 min-h-[240px] flex flex-col">
              <span className="font-serif text-5xl text-honed-sage mb-auto">{num}</span>
              <h3 className="text-xl font-bold mb-3">{title}</h3>
              <p className="text-white/55 leading-6">{copy}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-y border-white/10 bg-steel-gray/25">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 py-24 md:py-32 grid lg:grid-cols-[0.9fr_1.1fr] gap-14 items-start">
          <div>
            <SectionTitle eyebrow="The Studio" title="Yes, you’re in the right place." copy="Chef KnifeWorks is intentionally operated from a dedicated home sharpening studio in Maple Grove — not a retail storefront. That keeps the focus where it belongs: careful craft, efficient service and your knives." />
            <div className="mt-8 rounded-2xl border border-honed-sage/30 bg-honed-sage/10 p-6">
              <div className="flex gap-4"><FiMapPin className="mt-1 text-honed-sage shrink-0" /><p className="text-white/75 leading-7"><strong className="text-white">Before you arrive:</strong> reserve your drop-off. Your confirmation and arrival instructions will guide you through the simple handoff.</p></div>
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              [FiUser,'Chef’s perspective','Your knives are understood as working culinary tools, not just pieces of steel.'],
              [FiTool,'Craft first','Edges are evaluated and serviced according to the knife and how it is used.'],
              [FiCheck,'Pay after service','You are billed after the work is completed — not before we know what your knives need.'],
              [FiStar,'Local service','Personal sharpening service for home cooks, culinary professionals and serious knife owners.'],
            ].map(([Icon,title,copy]) => (
              <div key={title} className="rounded-2xl border border-white/10 bg-white/[0.025] p-7">
                <Icon className="text-honed-sage text-2xl mb-6" />
                <h3 className="font-bold text-lg mb-3">{title}</h3>
                <p className="text-white/55 leading-6">{copy}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="services" className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 py-24 md:py-32">
        <SectionTitle eyebrow="Sharpening Services" title="Bring the knives you actually use." copy="From the everyday chef knife to the blade you save for serious prep, the service is matched to the tool in front of us." />
        <div className="mt-14 grid md:grid-cols-2 gap-4">
          {services.map(([title,copy]) => (
            <div key={title} className="group rounded-2xl border border-white/10 p-7 md:p-9 hover:border-honed-sage/60 transition-colors">
              <div className="flex items-start justify-between gap-5">
                <div><h3 className="font-serif text-3xl mb-3">{title}</h3><p className="text-white/55 leading-7">{copy}</p></div>
                <FiArrowRight className="mt-2 text-honed-sage group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ))}
        </div>
        <p className="mt-7 text-sm text-white/45">Final pricing depends on blade type, condition and service required. You’ll pay after service.</p>
      </section>

      <section className="bg-honed-sage text-carbon-black">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 py-20 md:py-24 grid lg:grid-cols-[1fr_auto] gap-10 items-center">
          <div><p className="text-xs font-bold uppercase tracking-[0.24em] mb-4">Ready when you are</p><h2 className="font-serif text-4xl md:text-6xl leading-[1.08]">Give your knives a proper service call.</h2></div>
          <a href={BOOK_URL} className="inline-flex items-center justify-center gap-3 rounded-full bg-carbon-black text-white px-8 py-4 font-bold hover:bg-steel-gray transition-colors">Book Your Arrival <FiArrowRight /></a>
        </div>
      </section>

      <section id="faq" className="max-w-5xl mx-auto px-5 sm:px-8 py-24 md:py-32">
        <SectionTitle eyebrow="Before You Arrive" title="A few useful answers." />
        <div className="mt-12 divide-y divide-white/10 border-y border-white/10">
          {faqs.map(([q,a]) => (
            <details key={q} className="group py-6">
              <summary className="cursor-pointer list-none flex items-center justify-between gap-5 font-bold text-lg"><span>{q}</span><span className="text-honed-sage text-2xl group-open:rotate-45 transition-transform">+</span></summary>
              <p className="pt-4 max-w-3xl text-white/60 leading-7">{a}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 py-16 flex flex-col md:flex-row gap-8 md:items-end md:justify-between">
          <div><div className="font-serif text-3xl mb-2">Chef KnifeWorks</div><div className="text-white/45">Professional knife sharpening · Maple Grove, Minnesota</div></div>
          <div className="flex flex-wrap gap-5 text-sm"><a href={BOOK_URL} className="hover:text-honed-sage">Book Your Arrival</a><a href={PHONE} className="hover:text-honed-sage">Call (612) 567-4640</a><a href="mailto:info@chefknifeworks.com" className="hover:text-honed-sage">Email</a></div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
