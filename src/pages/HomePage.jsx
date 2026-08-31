import React from 'react';
import { FiArrowRight, FiCheck, FiClock, FiMapPin, FiShield, FiStar, FiTool, FiUser, FiBell } from 'react-icons/fi';
import ckwLogo from '../assets/ckw-logo.svg';

const BOOK_URL = '/book';
const PHONE = 'tel:+16125674640';

const SectionTitle = ({ eyebrow, title, copy }) => (
  <div className="max-w-3xl">
    <p className="text-xs font-bold uppercase tracking-[0.24em] text-honed-sage mb-4">{eyebrow}</p>
    <h2 className="font-serif text-4xl md:text-6xl leading-[1.12] text-whetstone-cream mb-6">{title}</h2>
    {copy && <p className="text-lg leading-8 text-white/65">{copy}</p>}
  </div>
);

const HomePage = () => {
  const steps = [
    ['01', 'Reserve', 'Choose a convenient drop-off window online.'],
    ['02', 'Arrive', 'Come to our professional home sharpening studio in Maple Grove.'],
    ['03', 'Sharpen', 'Your knives are inspected, sharpened, repaired and finished by hand.'],
    ['04', 'Depart', 'We message you when they’re ready. Pay, pick up and enjoy chef-grade edges.'],
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
      <section id="hero" className="relative border-b border-white/10 bg-[#0b0b0b]">
        <div className="absolute inset-0 opacity-60" style={{backgroundImage:'radial-gradient(circle at 74% 30%, rgba(139,154,136,.20), transparent 30%), radial-gradient(circle at 16% 80%, rgba(200,117,78,.13), transparent 26%)'}} />
        <div className="relative max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 py-16 md:py-24 lg:py-28 grid lg:grid-cols-[1.05fr_.95fr] gap-12 lg:gap-16 items-center">
          <div className="max-w-3xl">
            <p className="text-sm font-bold uppercase tracking-[0.24em] text-honed-sage mb-6">Professional knife sharpening · Maple Grove, MN</p>
            <h1 className="font-serif text-5xl sm:text-7xl lg:text-[84px] leading-[1.12] tracking-[-0.025em] mb-8">
              Chef-grade edges.
              <span className="block text-honed-sage mt-3">Every time.</span>
            </h1>
            <p className="max-w-2xl text-lg md:text-xl leading-9 text-white/72 mb-9">
              Reserve a convenient drop-off in Maple Grove. I’ll inspect, sharpen, repair and finish your knives for the kind of edge a chef expects — then let you know when they’re ready for pickup.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center mb-8">
              <a href={BOOK_URL} className="inline-flex items-center justify-center gap-3 rounded-xl bg-honed-sage px-7 py-4 font-bold text-white hover:bg-damascus-bronze transition-colors shadow-lg shadow-black/20">
                Book Your Arrival <FiArrowRight />
              </a>
              <a href="#how-it-works" className="inline-flex items-center justify-center rounded-xl border border-white/20 px-7 py-4 font-semibold text-white/85 hover:bg-white/5 transition-colors">
                See How It Works
              </a>
            </div>
            <p className="text-sm text-white/45">Booking takes about a minute. You pay after service.</p>
          </div>

          <div className="relative lg:min-h-[500px] flex items-center justify-center">
            <div className="absolute inset-8 rounded-full bg-honed-sage/10 blur-3xl" />
            <div className="relative w-full max-w-[620px] rounded-3xl border border-white/10 bg-black/35 p-4 sm:p-8 shadow-2xl shadow-black/40">
              <img src={ckwLogo} alt="Chef KnifeWorks Performance Knife Sharpening" className="w-full h-auto object-contain opacity-95" />
              <div className="grid grid-cols-3 gap-3 mt-3 border-t border-white/10 pt-5 text-center">
                <div><div className="text-honed-sage font-bold">30+ years</div><div className="text-xs text-white/45 mt-1">culinary experience</div></div>
                <div><div className="text-honed-sage font-bold">5+ years</div><div className="text-xs text-white/45 mt-1">professional sharpening</div></div>
                <div><div className="text-honed-sage font-bold">Local</div><div className="text-xs text-white/45 mt-1">Maple Grove studio</div></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-whetstone-cream text-carbon-black border-b border-black/10">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 py-7 grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {[
            [FiClock, 'Reserve', 'Choose a convenient drop-off.'],
            [FiTool, 'Sharpen', 'Inspection, repairs and precision finishing.'],
            [FiBell, 'We’ll let you know', 'Get a message when your knives are ready.'],
            [FiStar, 'Chef-grade edges', 'Pick up, pay and get back to cooking.'],
          ].map(([Icon, big, small]) => (
            <div key={big} className="flex items-start gap-4 py-3">
              <div className="w-11 h-11 rounded-xl bg-honed-sage/15 text-honed-sage flex items-center justify-center shrink-0"><Icon /></div>
              <div><div className="font-bold">{big}</div><div className="text-sm text-carbon-black/60 leading-5 mt-1">{small}</div></div>
            </div>
          ))}
        </div>
      </section>

      <section id="how-it-works" className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 py-24 md:py-32">
        <SectionTitle eyebrow="Arrival → Departure" title="Knife sharpening should feel simple." copy="No mystery and no complicated booking maze. Four clear steps from dull to chef-grade sharp." />
        <div className="grid md:grid-cols-4 gap-px bg-white/10 border border-white/10 mt-14">
          {steps.map(([num,title,copy]) => (
            <div key={num} className="bg-carbon-black p-7 md:p-8 min-h-[250px] flex flex-col">
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
              [FiShield,'Performance edge','The goal is not simply sharp. It is a durable, useful edge matched to how you cook.'],
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
          <div><p className="text-xs font-bold uppercase tracking-[0.24em] mb-4">Ready when you are</p><h2 className="font-serif text-4xl md:text-6xl leading-[1.12]">Put a chef-grade edge back on your knives.</h2></div>
          <a href={BOOK_URL} className="inline-flex items-center justify-center gap-3 rounded-xl bg-carbon-black text-white px-8 py-4 font-bold hover:bg-steel-gray transition-colors">Book Your Arrival <FiArrowRight /></a>
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
          <div><div className="font-serif text-3xl mb-2">Chef KnifeWorks</div><div className="text-white/45">Chef-grade knife sharpening · Maple Grove, Minnesota</div></div>
          <div className="flex flex-wrap gap-5 text-sm"><a href={BOOK_URL} className="hover:text-honed-sage">Book Your Arrival</a><a href={PHONE} className="hover:text-honed-sage">Call (612) 567-4640</a><a href="mailto:info@chefknifeworks.com" className="hover:text-honed-sage">Email</a></div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
