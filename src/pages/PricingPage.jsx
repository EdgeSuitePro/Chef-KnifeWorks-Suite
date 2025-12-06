import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import SafeIcon from '../common/SafeIcon';
import KnifeIcon from '../common/KnifeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiCheck, FiInfo, FiScissors, FiStar, FiUsers, FiClock, FiGift } = FiIcons;

const PricingPage = () => {
  // Core Services Data
  const coreServices = [
    {
      name: 'Core Essentials',
      price: '$12',
      subtext: 'volume discounts apply',
      icon: KnifeIcon, // Using custom KnifeIcon
      features: [
        'Includes ALL repairs',
        'Hand sharpened to optimal angle',
        'Honed and polished edge',
        '24-48 hour turnaround',
        'Suitable for all kitchen knives'
      ]
    },
    {
      name: 'Scissors & Shears',
      price: 'from $10',
      subtext: '',
      icon: FiScissors,
      features: [
        'Fabric / Tailor Shears',
        'Household Scissors',
        'Culinary Scissors / Shears'
      ]
    },
    {
      name: 'Japanese & Specialty',
      price: 'from $25',
      subtext: '',
      icon: FiStar,
      features: [
        'All Standard features',
        'Multi-stage precision sharpening',
        'Advanced polishing treatment',
        'Blade conditioning',
        'Perfect for Japanese & specialty knives',
        'Same-day service available'
      ]
    }
  ];

  const addOnServices = [
    'Tip Repair',
    'Chip Removal',
    'Rust & Patina Removal',
    'Polishing',
    'Micro-bevel Conditioning',
    'Straightening (if needed)'
  ];

  const volumeDiscounts = [
    { range: '1–4 knives', pricing: 'Core Rate', icon: KnifeIcon },
    { range: '5–9 knives', pricing: '10% off Core Rate', icon: FiUsers, highlight: true },
    { range: '10–14 knives', pricing: '15% off Core Rate', icon: FiStar, highlight: true },
    { range: '15+ knives', pricing: '20% off Core Rate', icon: FiScissors, highlight: true }
  ];

  return (
    <div className="min-h-screen bg-carbon-black text-whetstone-cream">
      {/* Hero Section */}
      <section className="bg-steel-gray text-whetstone-cream py-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="font-serif font-bold text-5xl mb-6 text-whetstone-cream">
              Transparent Pricing
            </h1>
            <p className="text-xl mb-8 opacity-90 max-w-3xl mx-auto font-light text-gray-300">
              Professional knife sharpening at fair rates. Final pricing determined after inspection; no hidden fees.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Core Services */}
      <section className="py-16 bg-carbon-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="font-serif font-bold text-4xl text-whetstone-cream mb-4">
              Core Sharpening Services
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Professional sharpening tailored to your blade type and condition.
            </p>
          </motion.div>

          {/* 3 Columns Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {coreServices.map((service, index) => (
              <motion.div
                key={service.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className={`card flex flex-col h-full transform transition-all duration-300 hover:-translate-y-2 ${
                  index === 0 ? 'border-honed-sage shadow-lg shadow-honed-sage/10' : 'border-white/10'
                }`}
              >
                <div className="text-center">
                  <div
                    className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 ${
                      index === 0
                        ? 'bg-honed-sage'
                        : index === 2
                        ? 'bg-damascus-bronze'
                        : 'bg-gray-600'
                    }`}
                  >
                    <SafeIcon icon={service.icon} className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="font-serif font-bold text-xl mb-2 text-whetstone-cream">
                    {service.name}
                  </h3>
                  <div
                    className={`text-3xl font-bold mb-1 ${
                      index === 2 ? 'text-damascus-bronze' : 'text-honed-sage'
                    }`}
                  >
                    {service.price}
                  </div>
                  {service.subtext && (
                    <div className="text-sm text-gray-400 italic mb-4">
                      {service.subtext}
                    </div>
                  )}
                  <div className="border-t border-white/10 my-4 w-1/2 mx-auto"></div>
                </div>
                <ul className="space-y-4 text-left mt-2 flex-1 px-4">
                  {service.features.map((feature, i) => (
                    <li key={i} className="flex items-start text-sm text-gray-300">
                      <SafeIcon
                        icon={FiCheck}
                        className="w-5 h-5 text-honed-sage mr-3 mt-0.5 flex-shrink-0"
                      />
                      <span
                        className={`leading-tight font-medium ${
                          i === 0 && index === 0
                            ? 'text-white font-bold uppercase tracking-wide'
                            : ''
                        }`}
                      >
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
                <div className="mt-8 text-center">
                  <Link to="/appointment" className="btn-secondary w-full text-sm">
                    Book Now
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Premium Add-Ons */}
      <section className="py-16 bg-steel-gray border-y border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="font-serif font-bold text-4xl text-whetstone-cream mb-4">
              Premium Add-On Services
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Additional services to restore and enhance your blades beyond basic sharpening.
            </p>
          </motion.div>
          <div className="max-w-4xl mx-auto">
            <div className="bg-carbon-black/50 rounded-xl p-8 border border-white/10 shadow-lg">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {addOnServices.map((service, index) => (
                  <motion.div
                    key={service}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center space-x-3"
                  >
                    <div className="w-6 h-6 bg-honed-sage rounded-full flex items-center justify-center flex-shrink-0">
                      <SafeIcon icon={FiCheck} className="w-4 h-4 text-white" />
                    </div>
                    <span className="font-medium text-gray-200">{service}</span>
                  </motion.div>
                ))}
              </div>
              <div className="mt-8 pt-6 border-t border-white/10 flex items-start space-x-3">
                <SafeIcon icon={FiInfo} className="w-5 h-5 text-damascus-bronze flex-shrink-0 mt-0.5" />
                <p className="text-gray-400 text-sm">
                  Add-on services are priced based on the condition and complexity of each blade. Final pricing will be discussed before any additional work begins.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Volume Discounts */}
      <section className="py-16 bg-carbon-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="font-serif font-bold text-4xl text-whetstone-cream mb-4">
              Volume Discount Structure
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              The more knives you bring, the more you save. Perfect for restaurants, culinary schools, and knife enthusiasts.
            </p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {volumeDiscounts.map((discount, index) => (
              <motion.div
                key={discount.range}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className={`card text-center ${
                  discount.highlight ? 'border-2 border-damascus-bronze shadow-lg shadow-damascus-bronze/10' : ''
                }`}
              >
                {discount.highlight && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="bg-damascus-bronze text-white px-3 py-1 rounded-full text-sm font-medium shadow-sm">
                      Best Value
                    </span>
                  </div>
                )}
                <div className="w-12 h-12 bg-honed-sage rounded-full flex items-center justify-center mx-auto mb-4">
                  <SafeIcon icon={discount.icon} className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold text-lg mb-2 text-whetstone-cream">
                  {discount.range}
                </h3>
                <p className="text-damascus-bronze font-bold text-lg">
                  {discount.pricing}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Turnaround Info */}
      <section className="py-16 bg-steel-gray text-whetstone-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="font-serif font-bold text-4xl mb-6">Our Pricing Philosophy</h2>
              <p className="text-xl mb-8 opacity-90 leading-relaxed font-light">
                At Chef KnifeWorks, we believe in clear, honest, experience-driven pricing. Every knife is inspected individually after drop-off so you're only charged for the work your blade actually needs. No guessing. No rushed assumptions. Just skilled evaluation and chef-level craftsmanship.
              </p>
              <p className="text-xl mb-8 opacity-90 leading-relaxed font-light">
                You always pay after the service is complete—never before—ensuring complete transparency and trust throughout the process.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
                <div className="text-center">
                  <div className="w-16 h-16 bg-damascus-bronze rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <SafeIcon icon={FiCheck} className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">No Hidden Fees</h3>
                  <p className="opacity-80 text-sm">
                    Because each knife is unique, pricing is based on its condition after inspection, not a one-size-fits-all quote.<br/>
                    You'll always know the final price before you pay.
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-damascus-bronze rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <SafeIcon icon={FiClock} className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">Next-Day Turnaround</h3>
                  <p className="opacity-80 text-sm">
                    Most orders are completed within 24 hours.<br/>
                    Fast, consistent, and reliable—drop off today, cook better tomorrow.
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-damascus-bronze rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <SafeIcon icon={FiStar} className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">Pay After Service</h3>
                  <p className="opacity-80 text-sm">
                    Payment only happens when the work is finished and your knives are ready for pickup.<br/>
                    Simple, fair, and honest—just how sharpening should be.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-black/30 text-whetstone-cream text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-serif font-bold text-4xl mb-6">Ready to Get Started?</h2>
            <p className="text-xl mb-8 opacity-90 font-light text-gray-300">
              Book your reservation today and experience the Chef KnifeWorks difference.
            </p>
            <Link to="/appointment" className="btn-primary text-lg px-8 py-4">
              Make a Reservation
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default PricingPage;