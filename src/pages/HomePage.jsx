import React from 'react';
import { Link } from 'react-router-dom';
import { FiArrowRight, FiCheck, FiClock, FiMapPin, FiShield, FiStar, FiTool, FiUser, FiBell, FiScissors } from 'react-icons/fi';
import ckwLogo from '../assets/ckw-logo.svg';

const PHONE = 'tel:+16125674640';

const SectionTitle = ({ eyebrow, title, copy, dark = true }) => (
  <div className="max-w-3xl">
    <p className={`text-xs font-bold uppercase tracking-[0.24em] mb-4 ${dark ? 'text-honed-sage' : 'text-steel-gray'}`}>{eyebrow}</p>
    <h2 className={`font-serif text-4xl md:text-6xl leading-[1.12] mb-6 ${dark ? 'text-whetstone-cream' : 'text-carbon-black'}`}>{title}</h2>
    {copy && <p className={`text-lg leading-8 ${dark ? 'text-white/65' : 'text-carbon-black/65'}`}>{copy}</p>}
  </div>
);

const HomePage = () => {
  const steps = [
    ['01', 'Reserve', 'Choose a day and broad arrival window online.'],
    ['02', 'Arrive', 'Bring the items you need sharpened to the Maple Grove studio.'],
    ['03', 'Sharpen', 'Each item is inspected, serviced and finished by hand.'],
    ['04', 'Depart', 'We message you when everything is ready for pickup.'],
  ];

  const services = [
    [FiTool, 'Kitchen knives', 'German, Western and everyday kitchen knives.'],
    [FiStar, 'Japanese knives', 'Premium steels and fine edges handled with extra care.'],
    [FiShield, 'Repairs & restoration', 'Chips, broken tips and damaged edges evaluated at intake.'],
    [FiScissors, 'Scissors & specialty', 'Kitchen and household scissors plus select sharpening items.'],
  ];

  const faqs = [
    ['Is this a storefront?', 'No. Chef KnifeWorks operates from a dedicated professional home sharpening studio in Maple Grove. Your reservation gives you clear arrival instructions.'],
    ['How long does sharpening take?', 'Most standard orders are completed in roughly 36–48 hours. Faster service may be available depending on workload.'],
    ['Do I pay when I book?', 'No. Payment happens after the work is completed.'],
    ['Do I need an appointment?', 'Reserve an arrival window online. It keeps drop-offs organized without forcing you into an exact appointment time.'],
    ['Can I bring scissors or other items?', 'Yes. The booking form asks how many items need sharpening and gives you space to tell us what you are bringing.'],
  ];

  return (
    <div className="bg-carbon-black text-whetstone-cream overflow-hidden">
      <section className="relative border-b border-white/10 bg-[#0a0b0a]">
        <div className="absolute inset-0 opacity-70" style={{backgroundImage:'radial-gradient(circle at 76% 34%, rgba(139,154,136,.22), transparent 30%), radial-gradient(circle at 18% 80%, rgba(200,117,78,.11), transparent 26%)'}} />
        <div className="relative max-w-[1500px] mx-auto px-5 sm:px-8 lg:px-10 py-16 md:py-20 lg:py-24 grid lg:grid-cols-[0.9fr_1.1fr] gap-12 lg:gap-14 items-center min-h-[620px]">
          <div className="max-w-3xl">
            <p className="text-sm font-bold uppercase tracking-[0.24em] text-honed-sage mb-6">Professional sharpening · Maple Grove, MN</p>
            <h1 className="font-serif text-[54px] sm:text-7xl lg:text-[82px] leading-[1.08] tracking-[-0.025em] mb-8">Chef-grade edges.<span className="block text-honed-sage mt-3">Every time.</span></h1>
            <p className="max-w-2xl text-lg md:text-xl leading-9 text-white/72 mb-9">Reserve a convenient drop-off. I’ll inspect, sharpen, repair and finish the items you bring, then let you know when they’re ready for pickup.</p>
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center mb-7"><Link to="/book" className="inline-flex items-center justify-center gap-3 rounded-xl bg-honed-sage px-7 py-4 font-bold text-white hover:bg-damascus-bronze transition-colors shadow-lg shadow-black/20">Book Your Arrival <FiArrowRight /></Link><a href="#how-it-works" className="inline-flex items-center justify-center rounded-xl border border-white/20 px-7 py-4 font-semibold text-white/85 hover:bg-white/5 transition-colors">See How It Works</a></div>
            <p className="text-sm text-white/45">Booking takes about a minute.</p>
          </div>
          <div className="relative lg:min-h-[460px] flex items-center justify-center"><div className="absolute inset-6 bg-gradient-to-br from-honed-sage/10 via-transparent to-damascus-bronze/10 rounded-[40px] blur-2xl" /><div className="relative w-full rounded-[32px] overflow-hidden border border-white/10 bg-[#131512] shadow-2xl shadow-black/40"><div className="aspect-[16/10] p-7 md:p-10 flex items-center justify-center bg-[radial-gradient(circle_at_50%_40%,rgba(255,255,255,.06),transparent_45%)]"><img src={ckwLogo} alt="Chef KnifeWorks Performance Knife Sharpening" className="w-full max-w-[650px] h-auto object-contain" /></div><div className="grid grid-cols-3 border-t border-white/10 bg-black/25 text-center"><div className="p-5 border-r border-white/10"><div className="text-honed-sage font-bold">30+ years</div><div className="text-xs text-white/45 mt-1">culinary experience</div></div><div className="p-5 border-r border-white/10"><div className="text-honed-sage font-bold">5+ years</div><div className="text-xs text-white/45 mt-1">professional sharpening</div></div><div className="p-5"><div className="text-honed-sage font-bold">Maple Grove</div><div className="text-xs text-white/45 mt-1">local studio</div></div></div></div></div>
        </div>
      </section>

      <section className="bg-whetstone-cream text-carbon-black border-b border-black/10"><div className="max-w-[1500px] mx-auto px-5 sm:px-8 lg:px-10 py-7 grid sm:grid-cols-2 lg:grid-cols-4 gap-5">{[[FiClock, 'Convenient drop-off', 'Reserve a day and arrival window.'],[FiTool, 'Expert sharpening', 'Inspection, repairs and precise finishing.'],[FiBell, 'We’ll let you know', 'Get a message when your items are ready.'],[FiStar, 'Pick up & enjoy', 'Get back to using sharp tools.']].map(([Icon, big, small]) => <div key={big} className="flex items-start gap-4 py-3"><div className="w-11 h-11 rounded-xl bg-honed-sage/15 text-honed-sage flex items-center justify-center shrink-0"><Icon /></div><div><div className="font-bold">{big}</div><div className="text-sm text-carbon-black/60 leading-5 mt-1">{small}</div></div></div>)}</div></section>

      <section id="how-it-works" className="bg-[#f2efe7] text-carbon-black scroll-mt-28"><div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 py-24 md:py-28"><SectionTitle dark={false} eyebrow="Arrival → Departure" title="Sharpening should feel simple." copy="Four clear steps from drop-off to pickup."/><div className="grid md:grid-cols-4 gap-4 mt-12">{steps.map(([num,title,copy]) => <div key={num} className="bg-white/70 border border-black/10 rounded-2xl p-7 min-h-[220px] flex flex-col shadow-sm"><span className="font-serif text-4xl text-honed-sage mb-auto">{num}</span><h3 className="text-xl font-bold mb-3">{title}</h3><p className="text-carbon-black/60 leading-6">{copy}</p></div>)}</div></div></section>

      <section id="services" className="bg-carbon-black scroll-mt-28"><div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 py-24 md:py-28"><SectionTitle eyebrow="Sharpening Services" title="Bring the items you actually use." copy="Kitchen knives are the heart of the business, with scissors, repairs and select specialty sharpening available too."/><div className="mt-12 grid md:grid-cols-2 gap-4">{services.map(([Icon,title,copy]) => <div key={title} className="rounded-2xl border border-white/10 p-7 md:p-9 bg-white/[0.025]"><Icon className="text-honed-sage text-2xl mb-5"/><h3 className="font-serif text-3xl mb-3">{title}</h3><p className="text-white/55 leading-7">{copy}</p></div>)}</div><div className="mt-8"><Link to="/pricing" className="inline-flex items-center gap-2 font-bold text-honed-sage hover:text-white">See service & pricing guide <FiArrowRight/></Link></div></div></section>

      <section id="about" className="bg-whetstone-cream text-carbon-black scroll-mt-28"><div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 py-24 md:py-28 grid lg:grid-cols-[0.9fr_1.1fr] gap-14 items-start"><div><SectionTitle dark={false} eyebrow="The Chef Behind the Edge" title="Sharpened with a cook’s perspective." copy="Decades in professional kitchens inform how each edge is evaluated: by performance, purpose and how the tool will actually be used."/><div className="mt-8 rounded-2xl border border-honed-sage/30 bg-honed-sage/10 p-6"><div className="flex gap-4"><FiMapPin className="mt-1 text-honed-sage shrink-0"/><p className="text-carbon-black/70 leading-7"><strong>Professional home studio:</strong> reserve your arrival and your confirmation will guide you through the handoff.</p></div></div></div><div className="grid sm:grid-cols-2 gap-4">{[[FiUser,'Chef’s perspective','Working tools are judged by performance, purpose and feel.'],[FiTool,'Craft first','The edge is matched to the item, steel and intended use.'],[FiCheck,'Pay after service','You are billed after the work is completed.'],[FiShield,'Performance edge','The target is durable, useful sharpness.']].map(([Icon,title,copy]) => <div key={title} className="rounded-2xl border border-black/10 bg-white/65 p-7 shadow-sm"><Icon className="text-honed-sage text-2xl mb-6"/><h3 className="font-bold text-lg mb-3">{title}</h3><p className="text-carbon-black/60 leading-6">{copy}</p></div>)}</div></div></section>

      <section className="bg-honed-sage text-carbon-black"><div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 py-20 md:py-24 grid lg:grid-cols-[1fr_auto] gap-10 items-center"><div><p className="text-xs font-bold uppercase tracking-[0.24em] mb-4">Ready when you are</p><h2 className="font-serif text-4xl md:text-6xl leading-[1.12]">Put chef-grade performance back in your kitchen.</h2></div><Link to="/book" className="inline-flex items-center justify-center gap-3 rounded-xl bg-carbon-black text-white px-8 py-4 font-bold hover:bg-steel-gray transition-colors">Book Your Arrival <FiArrowRight /></Link></div></section>

      <section id="faq" className="bg-[#f2efe7] text-carbon-black scroll-mt-28"><div className="max-w-5xl mx-auto px-5 sm:px-8 py-24 md:py-28"><SectionTitle dark={false} eyebrow="Before You Arrive" title="A few useful answers."/><div className="mt-10 divide-y divide-black/10 border-y border-black/10">{faqs.map(([q,a]) => <details key={q} className="group py-6"><summary className="cursor-pointer list-none flex items-center justify-between gap-5 font-bold text-lg"><span>{q}</span><span className="text-honed-sage text-2xl group-open:rotate-45 transition-transform">+</span></summary><p className="pt-4 max-w-3xl text-carbon-black/60 leading-7">{a}</p></details>)}</div></div></section>

      <section className="bg-carbon-black border-t border-white/10"><div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 py-16 flex flex-col md:flex-row gap-8 md:items-end md:justify-between"><div><div className="font-serif text-3xl mb-2">Chef KnifeWorks</div><div className="text-white/45">Professional sharpening · Maple Grove, Minnesota</div></div><div className="flex flex-wrap gap-5 text-sm"><Link to="/book" className="hover:text-honed-sage">Book Your Arrival</Link><a href={PHONE} className="hover:text-honed-sage">Call (612) 567-4640</a><a href="mailto:sales@chefknifeworks.com" className="hover:text-honed-sage">Email</a></div></div></section>
    </div>
  );
};

export default HomePage;
