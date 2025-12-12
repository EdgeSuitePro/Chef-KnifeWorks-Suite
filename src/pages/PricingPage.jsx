import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import SafeIcon from '../common/SafeIcon';
import KnifeIcon from '../common/KnifeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiCheck, FiInfo, FiStar, FiClock, FiAward, FiZap, FiScissors } = FiIcons;

const PricingPage = () => {
  // Updated Pricing Tiers based on the new structure
  const pricingTiers = [
    {
      name: 'Chef-Edge Sharpening',
      price: '$12',
      perUnit: 'per knife',
      subtext: 'For everyday home cooks',
      icon: KnifeIcon,
      highlight: false,
      features: [
        'Includes minor repairs',
        'Satin finish',
        'Chef-grade sharpness',
        'Ideal for German steel & household knives'
      ]
    },
    {
      name: 'Pro-Edge Sharpening',
      price: '$17–$25',
      perUnit: 'per knife',
      subtext: 'For culinary professionals or high-performance steels',
      icon: FiAward,
      highlight: false,
      features: [
        'Edge refinement',
        'Retention optimization',
        'Controlled angles',
        'Ideal for busy chefs & daily use blades'
      ]
    },
    {
      name: 'Signature-Edge Restoration',
      price: '$40',
      perUnit: 'per knife',
      subtext: 'For high-end Japanese knives, damaged blades, and serious tuning',
      icon: FiStar,
      highlight: false,
      features: [
        'Whetstone/CBN work',
        'Reprofiling & chip repair',
        'Polishing',
        'Ideal for SG2, Aogami, Shirogami & heirlooms'
      ]
    },
    {
      name: 'Scissor Sharpening',
      price: 'Starting at $10',
      perUnit: 'Each',
      subtext: 'Culinary, Household, Tailor',
      icon: FiScissors,
      highlight: false,
      features: [
        'Clean, precise scissor edges',
        'For kitchens, home use, and craftwork',
        'Fabric shears & utility scissors',
        'Tension adjustment included'
      ]
    }
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

      {/* Pricing Tiers */}
      <section className="py-16 bg-carbon-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-16">
            {pricingTiers.map((tier, index) => (
              <motion.div
                key={tier.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-steel-gray/20 border border-white/10 rounded-xl overflow-hidden flex flex-col h-full hover:border-honed-sage/50 transition-colors duration-300"
              >
                <div className="p-8 text-center border-b border-white/5 bg-white/[0.02]">
                  <div className="mb-4 flex justify-center text-honed-sage">
                    <SafeIcon icon={tier.icon} className="w-8 h-8" />
                  </div>
                  <h3 className="font-serif font-bold text-xl mb-2 text-whetstone-cream h-14 flex items-center justify-center">
                    {tier.name}
                  </h3>
                  <div className="flex flex-col items-center justify-center gap-1 mb-2">
                    <span className="text-3xl font-bold text-white">{tier.price}</span>
                    <span className="text-gray-400 text-xs uppercase tracking-wide">{tier.perUnit}</span>
                  </div>
                  <p className="text-gray-400 text-sm italic font-medium min-h-[40px]">
                    {tier.subtext}
                  </p>
                </div>
                
                <div className="p-6 flex-1 bg-black/20">
                  <ul className="space-y-3">
                    {tier.features.map((feature, i) => (
                      <li key={i} className="flex items-start text-sm text-gray-300">
                        <SafeIcon
                          icon={FiCheck}
                          className="w-4 h-4 text-honed-sage mr-3 mt-0.5 flex-shrink-0"
                        />
                        <span className="leading-relaxed">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                {/* Book Now button removed as requested */}
              </motion.div>
            ))}
          </div>

          {/* Volume Discounts */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto"
          >
            <div className="border border-honed-sage/30 rounded-2xl p-8 md:p-12 text-center bg-gradient-to-b from-carbon-black to-steel-gray/30 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-honed-sage to-transparent opacity-50"></div>
              
              <h3 className="font-serif text-3xl text-honed-sage mb-4">
                Volume Discounts Available
              </h3>
              <p className="text-gray-400 mb-10">
                Make the most of your visit — bring your whole set.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-4 mb-10">
                <div className="flex flex-col items-center">
                  <span className="text-5xl font-bold text-white mb-2">10%</span>
                  <span className="text-gray-400 uppercase tracking-widest text-sm">5+ Knives</span>
                </div>
                <div className="flex flex-col items-center md:border-x border-white/10">
                  <span className="text-5xl font-bold text-white mb-2">15%</span>
                  <span className="text-gray-400 uppercase tracking-widest text-sm">10+ Knives</span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-5xl font-bold text-white mb-2">20%</span>
                  <span className="text-gray-400 uppercase tracking-widest text-sm">15+ Knives</span>
                </div>
              </div>

              <p className="text-sm text-gray-500 italic">
                Discount applied automatically after inspection.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Pricing Philosophy */}
      <section className="py-16 bg-steel-gray text-whetstone-cream border-t border-white/5">
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
                  <h3 className="font-semibold text-lg mb-2">Next Day Pickup</h3>
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