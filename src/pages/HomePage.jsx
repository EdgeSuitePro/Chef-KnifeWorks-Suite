import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const {
  FiShield,
  FiClock,
  FiStar,
  FiMapPin,
  FiGift,
  FiCalendar,
  FiPackage,
  FiCheckCircle,
  FiUserCheck,
  FiHome
} = FiIcons;

const HomePage = () => {
  const SQUARE_GIFT_CARD_URL = 'https://app.squareup.com/gift/VKHWTKDWTQ08J/order';

  const features = [
    {
      icon: FiShield,
      title: 'Expert Craftsmanship',
      description:
        'Over 15 years of professional knife sharpening experience with attention to every detail.'
    },
    {
      icon: FiClock,
      title: 'Quick Turnaround',
      description:
        'Most knives sharpened within 24-48 hours. We respect your time and schedule.'
    },
    {
      icon: FiStar,
      title: 'Premium Quality',
      description:
        'Restaurant-quality sharpening that brings your knives back to like-new condition.'
    },
    {
      icon: FiMapPin,
      title: 'Local Service',
      description:
        'Proudly serving Maple Grove and surrounding Minnesota communities.'
    }
  ];

  const journeySteps = [
    {
      number: '01',
      icon: FiCalendar,
      title: 'Reserve',
      description: 'Book your drop-off time online. This lets me prepare for your arrival and ensures your knives enter the sharpening queue immediately.'
    },
    {
      number: '02',
      icon: FiPackage,
      title: 'Arrive + Check In',
      description: 'Tap "I\'m Here" on the website or simply walk up to the shoppe. I\'ll step out to receive your knives personally—or guide you to our secure drop box.'
    },
    {
      number: '03',
      icon: FiStar,
      title: 'Sharpening',
      description: 'Each knife is inspected individually and expertly restored using chef-level precision, traditional techniques, and modern equipment.'
    },
    {
      number: '04',
      icon: FiCheckCircle,
      title: 'Pickup + Pay',
      description: 'You\'ll receive a message when your order is complete. Pick up anytime, day or night, and pay only for the work that was actually needed.'
    }
  ];

  return (
    <div className="bg-carbon-black">
      {/* Hero Section */}
      <section
        id="hero"
        className="hero-section min-h-[85vh] flex items-center relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-black/30 z-0"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center w-full relative z-10 py-20">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="flex flex-col items-center"
          >
            <h1 className="font-serif text-6xl md:text-7xl lg:text-8xl text-whetstone-cream mb-6 tracking-tight">
              Chef KnifeWorks
            </h1>
            <h2 className="text-xl md:text-2xl text-honed-sage font-light mb-8 tracking-wide uppercase">
              Feel the Difference Sharp Can Make
            </h2>
            <p className="text-lg text-gray-300 mb-12 max-w-2xl mx-auto leading-relaxed font-light">
              Professional knife sharpening services in Maple Grove, Minnesota. We bring the
              precision and care your blades deserve.
            </p>
            <div className="flex flex-col sm:flex-row gap-6">
              <Link
                to="/appointment"
                className="btn-secondary px-8 py-4 text-sm tracking-widest hover:bg-whetstone-cream hover:text-carbon-black"
              >
                Schedule Your Appointment
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section id="why-choose-us" className="py-24 bg-carbon-black relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="font-serif text-4xl md:text-5xl text-whetstone-cream mb-6">
              Why Choose Chef KnifeWorks?
            </h2>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto font-light">
              We combine traditional craftsmanship with modern precision to deliver exceptional
              results.
            </p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="card group text-left hover:bg-steel-gray/50"
              >
                <div className="w-12 h-12 rounded-full bg-honed-sage/10 flex items-center justify-center mb-6 group-hover:bg-honed-sage/20 transition-colors">
                  <SafeIcon icon={feature.icon} className="w-6 h-6 text-honed-sage" />
                </div>
                <h3 className="font-bold text-lg mb-3 text-whetstone-cream">{feature.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed group-hover:text-gray-300">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Your Knife's Journey */}
      <section className="py-24 bg-carbon-black border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="font-serif text-4xl md:text-5xl text-whetstone-cream mb-4">
              Your Knife's Journey
            </h2>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto font-light">
              A seamless experience tailored to you — whether you meet me at the shoppe or prefer a
              quick, contactless drop-off.
            </p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {journeySteps.map((step, index) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="relative bg-steel-gray/10 border border-white/5 rounded-lg p-8 pb-10 text-center overflow-hidden group hover:bg-steel-gray/20 transition-all duration-300 hover:-translate-y-1"
              >
                {/* Background Number */}
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/4 text-9xl font-serif font-bold text-white/[0.03] pointer-events-none select-none z-0">
                  {step.number}
                </div>
                {/* Content */}
                <div className="relative z-10 flex flex-col items-center h-full">
                  <div className="w-16 h-16 mb-6 rounded-full bg-damascus-bronze/10 flex items-center justify-center border border-damascus-bronze/20 group-hover:border-damascus-bronze/50 transition-colors">
                    <SafeIcon icon={step.icon} className="w-7 h-7 text-damascus-bronze" />
                  </div>
                  <h3 className="text-xl font-bold text-whetstone-cream mb-4">{step.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed whitespace-pre-line">
                    {step.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Gift Card Section */}
      <section className="py-20 bg-steel-gray border-y border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-12">
            <div className="md:w-1/2 text-center md:text-left">
              <h2 className="font-serif text-3xl md:text-4xl text-whetstone-cream mb-4">
                Give the Gift of Sharpness
              </h2>
              <p className="text-gray-300 mb-8 max-w-md">
                Perfect for the home cook or professional chef. Chef KnifeWorks gift cards never
                expire.
              </p>
              <a
                href={SQUARE_GIFT_CARD_URL}
                target="_blank"
                rel="noreferrer"
                className="btn-primary inline-flex items-center gap-3"
              >
                <SafeIcon icon={FiGift} />
                Purchase Gift Cards
              </a>
            </div>
            <div className="md:w-1/2 flex justify-center">
              <div className="w-full max-w-md aspect-video bg-gradient-to-br from-honed-sage to-steel-gray rounded-xl shadow-2xl flex items-center justify-center border border-white/10 p-8 relative overflow-hidden">
                <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
                <div className="text-center relative z-10">
                  <span className="block font-serif text-3xl text-white mb-2">
                    Chef KnifeWorks
                  </span>
                  <span className="block text-sm text-white/80 uppercase tracking-widest">
                    Gift Card
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;