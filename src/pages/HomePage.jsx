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
  FiHome,
  FiAward,
  FiArrowRight,
  FiTool,
  FiCheck,
  FiExternalLink
} = FiIcons;

const DissolveCard = ({ frontContent, backContent, number }) => {
  return (
    <div className="group h-[300px] w-full relative">
      {/* Front Face */}
      <div className="absolute inset-0 h-full w-full bg-steel-gray/10 border border-white/5 rounded-xl p-8 flex flex-col items-center justify-center text-center transition-opacity duration-500 ease-in-out group-hover:opacity-0">
        {number && (
          <div className="absolute top-6 text-6xl font-serif font-bold text-white/[0.03] select-none">
            {number}
          </div>
        )}
        <div className="relative z-10">{frontContent}</div>
      </div>

      {/* Back Face */}
      <div className="absolute inset-0 h-full w-full bg-steel-gray border border-damascus-bronze/30 rounded-xl p-8 flex flex-col items-center justify-center text-center shadow-xl transition-opacity duration-500 ease-in-out opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto">
        <div className="text-gray-200 text-sm leading-relaxed font-light">
          {backContent}
        </div>
      </div>
    </div>
  );
};

const GoogleReviewCard = ({ name, date, rating, text, image }) => (
  <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 flex flex-col h-full">
    <div className="flex items-center gap-3 mb-4">
      <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 font-bold text-lg overflow-hidden">
        {image ? (
          <img src={image} alt={name} className="w-full h-full object-cover" />
        ) : (
          name.charAt(0)
        )}
      </div>
      <div>
        <h4 className="font-bold text-gray-900 text-sm">{name}</h4>
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <span>{date}</span>
        </div>
      </div>
      <div className="ml-auto">
        <img 
          src="https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg" 
          alt="Google" 
          className="h-4 opacity-50" 
        />
      </div>
    </div>
    <div className="flex text-yellow-500 mb-3 text-sm">
      {[...Array(5)].map((_, i) => (
        <SafeIcon 
          key={i} 
          icon={FiStar} 
          className={`w-4 h-4 ${i < rating ? 'fill-current' : 'text-gray-300'}`} 
        />
      ))}
    </div>
    <p className="text-gray-600 text-sm leading-relaxed flex-grow">
      {text}
    </p>
  </div>
);

const HomePage = () => {
  const SQUARE_GIFT_CARD_URL = 'https://app.squareup.com/gift/VKHWTKDWTQ08J/order';
  // Updated with your specific Place ID
  const GOOGLE_REVIEW_LINK = 'https://www.google.com/maps/place/?q=place_id:ChIJZz3zJ-tHs1IRjXKZBBvsoM4'; 

  const features = [
    {
      icon: FiStar,
      title: 'Expert Craftsmanship',
      subtitle: 'Professional sharpening by certified blade specialists',
      description:
        'Over 15 years of professional knife sharpening experience with attention to every detail.'
    },
    {
      icon: FiClock,
      title: 'Quick Turnaround',
      subtitle: 'Same-day service available for most knife types',
      description:
        'Most knives sharpened within 24-48 hours. We respect your time and schedule.'
    },
    {
      icon: FiShield,
      title: 'Safe & Secure',
      subtitle: 'Fully insured handling with photo documentation',
      description:
        'Your knives are treated with the utmost care, fully insured, and tracked from drop-off to pickup.'
    },
    {
      icon: FiAward,
      title: 'Quality Guarantee',
      subtitle: '100% satisfaction guaranteed or your money back',
      description:
        'Restaurant-quality sharpening that brings your knives back to like-new condition. Satisfaction guaranteed.'
    }
  ];

  const journeySteps = [
    {
      number: '01',
      title: 'Reserve Online',
      subtitle: 'Book your preferred time slot in seconds',
      description: 'Book your drop-off time online. This lets me prepare for your arrival and ensures your knives enter the sharpening queue immediately.'
    },
    {
      number: '02',
      title: 'Drop Off',
      subtitle: 'Bring your knives to our secure facility',
      description: 'Tap "Check-In" on the menu or simply walk up to the shoppe. I\'ll step out to receive your knives personally—or guide you to our secure drop box.'
    },
    {
      number: '03',
      title: 'Expert Service',
      subtitle: 'We sharpen with precision and care',
      description: 'Each knife is inspected individually and expertly restored using chef-level precision, traditional techniques, and modern equipment.'
    },
    {
      number: '04',
      title: 'Pick Up',
      subtitle: 'Collect your razor-sharp knives',
      description: 'You\'ll receive a message when your order is complete. Pick up anytime, day or night, and pay only for the work that was actually needed.'
    }
  ];

  const trackerStages = [
    { title: 'Received', icon: FiPackage },
    { title: 'Sharpening', icon: FiTool },
    { title: 'Finishing Touches', icon: FiStar },
    { title: 'Ready for Pickup', icon: FiCheck }
  ];

  const googleReviews = [
    {
      name: "Chef Marcus",
      date: "2 weeks ago",
      rating: 5,
      text: "The sharpest edges I've ever worked with. Jason's craftsmanship is truly exceptional. My entire kitchen team now uses Chef KnifeWorks exclusively.",
    },
    {
      name: "Sarah Mitchell",
      date: "1 month ago",
      rating: 5,
      text: "My vintage Japanese knives have never performed better. Worth every penny. The drop-off and pickup system is so convenient.",
    },
    {
      name: "David Kowalski",
      date: "3 days ago",
      rating: 5,
      text: "Professional service with real passion for the craft. My knives feel brand new, actually sharper than when I bought them!",
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

      {/* Tracker Preview Section */}
      <section className="py-16 bg-carbon-black relative z-20 -mt-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-steel-gray/30 backdrop-blur-md border border-white/10 rounded-2xl p-8 md:p-12 shadow-2xl"
          >
            <div className="text-center mb-10">
              <h2 className="font-serif text-3xl md:text-4xl text-whetstone-cream mb-3">
                Track Your Knife Journey
              </h2>
              <p className="text-gray-400 font-light">
                Know exactly where your knives are in the sharpening process
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4 mb-10 relative">
              {/* Connector Line (Desktop) */}
              <div className="hidden md:block absolute top-[2.5rem] left-0 w-full h-0.5 bg-white/5 -z-10" />

              {trackerStages.map((stage, index) => (
                <div key={index} className="flex flex-col items-center text-center group">
                  <div className="w-20 h-20 rounded-full bg-carbon-black border border-honed-sage/30 flex items-center justify-center mb-4 shadow-lg group-hover:border-honed-sage/60 transition-colors duration-300 relative z-10">
                    <SafeIcon icon={stage.icon} className="w-8 h-8 text-honed-sage" />
                  </div>
                  <h3 className="text-whetstone-cream font-medium text-sm md:text-base">{stage.title}</h3>
                </div>
              ))}
            </div>

            <div className="flex justify-center">
              <Link 
                to="/lookup" 
                className="btn-primary py-3 px-8 text-sm tracking-widest uppercase font-medium shadow-lg hover:shadow-damascus-bronze/20"
              >
                Check Your Status
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
              Why Choose Chef KnifeWorks
            </h2>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto font-light">
              Experience the difference of professional knife care
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
              >
                <DissolveCard
                  frontContent={
                    <div className="flex flex-col items-center">
                      <div className="w-12 h-12 rounded-full bg-honed-sage/10 flex items-center justify-center mb-6">
                        <SafeIcon icon={feature.icon} className="w-6 h-6 text-honed-sage" />
                      </div>
                      <h3 className="font-bold text-lg mb-3 text-whetstone-cream">{feature.title}</h3>
                      <p className="text-gray-400 text-sm">{feature.subtitle}</p>
                    </div>
                  }
                  backContent={feature.description}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works (Renamed from Your Knife Journey) */}
      <section className="py-24 bg-carbon-black border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="font-serif text-4xl md:text-5xl text-whetstone-cream mb-4">
              How It Works
            </h2>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto font-light">
              From dull to razor-sharp in four simple steps
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
              >
                <DissolveCard
                  number={step.number}
                  frontContent={
                    <div className="flex flex-col items-center pt-8">
                      <h3 className="text-xl font-bold text-whetstone-cream mb-4">{step.title}</h3>
                      <p className="text-gray-400 text-sm">{step.subtitle}</p>
                    </div>
                  }
                  backContent={step.description}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Google Reviews Section */}
      <section className="py-24 bg-gray-50 text-carbon-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className="flex items-center justify-center gap-2 mb-4">
              <span className="bg-white px-3 py-1 rounded-full border border-gray-200 shadow-sm flex items-center gap-2 text-sm font-bold text-gray-700">
                <img src="https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg" alt="Google" className="h-4" />
                Rating
              </span>
              <div className="flex items-center text-yellow-500 gap-1">
                <span className="text-gray-900 font-bold text-lg">5.0</span>
                <SafeIcon icon={FiStar} className="fill-current w-5 h-5" />
                <SafeIcon icon={FiStar} className="fill-current w-5 h-5" />
                <SafeIcon icon={FiStar} className="fill-current w-5 h-5" />
                <SafeIcon icon={FiStar} className="fill-current w-5 h-5" />
                <SafeIcon icon={FiStar} className="fill-current w-5 h-5" />
              </div>
            </div>
            <h2 className="font-serif text-4xl md:text-5xl mb-4 text-carbon-black">
              What Our Customers Say
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto font-light">
              Trusted by professional chefs and home cooks alike
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {googleReviews.map((review, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <GoogleReviewCard {...review} />
              </motion.div>
            ))}
          </div>
          
          <div className="mt-12 text-center">
            <a 
              href={GOOGLE_REVIEW_LINK} target="_blank" rel="noreferrer"
              className="inline-flex items-center gap-2 text-honed-sage font-bold hover:text-damascus-bronze transition-colors"
            >
              See all reviews on Google <SafeIcon icon={FiExternalLink} />
            </a>
          </div>
        </div>
      </section>

      {/* Referral Program Section */}
      <section id="loyalty" className="py-20 bg-steel-gray/10 border-t border-white/5 bg-carbon-black">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-serif text-4xl md:text-5xl text-whetstone-cream mb-6">
              Edge Referral Program
            </h2>
            <p className="text-lg text-gray-300 mb-10 leading-relaxed font-light">
              Refer a friend and both of you receive special rewards. Share the precision, spread the craft.
            </p>
            <Link 
              to="/contact" 
              className="inline-flex items-center gap-2 text-honed-sage border border-honed-sage hover:bg-honed-sage hover:text-carbon-black px-8 py-3 rounded transition-colors duration-300 uppercase tracking-widest text-sm font-medium"
            >
              Learn More <SafeIcon icon={FiArrowRight} className="w-4 h-4" />
            </Link>
          </motion.div>
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