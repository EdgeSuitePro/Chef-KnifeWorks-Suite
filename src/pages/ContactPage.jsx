import React, { useState } from 'react';
import { motion } from 'framer-motion';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiMapPin, FiPhone, FiMail, FiClock, FiSend, FiInfo } = FiIcons;

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Message sent! We\'ll get back to you soon.');
    setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
  };

  const contactInfo = [
    {
      icon: FiMapPin,
      title: 'Address',
      details: ['13969 88th Place North', 'Maple Grove, MN 55369'],
      note: 'Home Shoppe - Drop-off by reservation only'
    },
    {
      icon: FiPhone,
      title: 'Phone',
      details: ['(612) 567-4640'],
      note: 'Call or text for questions'
    },
    {
      icon: FiMail,
      title: 'Email',
      details: ['info@chefknifeworks.com'],
      note: 'We respond within 24 hours'
    },
    {
      icon: FiClock,
      title: 'Service Hours',
      details: ['Drop-off: By reservation', 'Pickup: Next Day (within 24 hours typically)'],
      note: 'Flexible scheduling available'
    }
  ];

  return (
    <div className="min-h-screen bg-carbon-black text-whetstone-cream">
      {/* Hero Section */}
      <section className="bg-steel-gray text-whetstone-cream py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <h1 className="font-serif font-bold text-5xl mb-6">Get in Touch</h1>
            <p className="text-xl mb-8 opacity-90 max-w-3xl mx-auto text-gray-300">
              Questions about our knife sharpening services? Need help with your reservation? We're here to help make your experience seamless.
            </p>
          </motion.div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}>
            <h2 className="font-serif font-bold text-3xl text-whetstone-cream mb-8">Contact Information</h2>
            <div className="space-y-6">
              {contactInfo.map((info, index) => (
                <motion.div key={info.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.2 }} className="card">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-damascus-bronze rounded-full flex items-center justify-center flex-shrink-0">
                      <SafeIcon icon={info.icon} className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg text-whetstone-cream mb-2">{info.title}</h3>
                      {info.details.map((detail, i) => (
                        <p key={i} className="text-gray-400 mb-1">{detail}</p>
                      ))}
                      <p className="text-sm text-honed-sage mt-2">{info.note}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
            
            {/* Important Notice */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }} className="mt-8 p-6 bg-honed-sage text-white rounded-lg shadow-lg">
              <div className="flex items-start space-x-3">
                <SafeIcon icon={FiInfo} className="w-6 h-6 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold mb-2">Home Shoppe Notice</h4>
                  <p className="text-sm opacity-90">
                    This is a residential Home Shoppe location. All drop-offs must be scheduled in advance using our reservation system. Please do not arrive without a confirmed appointment time.
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Contact Form */}
          <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}>
            <div className="card">
              <h2 className="font-serif font-bold text-3xl text-whetstone-cream mb-6">Send Us a Message</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">Full Name *</label>
                    <input type="text" id="name" name="name" required value={formData.name} onChange={handleChange} className="w-full px-4 py-3" placeholder="Your name" />
                  </div>
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-300 mb-2">Phone Number</label>
                    <input type="tel" id="phone" name="phone" value={formData.phone} onChange={handleChange} className="w-full px-4 py-3" placeholder="(612) 567-4640" />
                  </div>
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">Email Address *</label>
                  <input type="email" id="email" name="email" required value={formData.email} onChange={handleChange} className="w-full px-4 py-3" placeholder="your@email.com" />
                </div>
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-300 mb-2">Subject</label>
                  <select id="subject" name="subject" value={formData.subject} onChange={handleChange} className="w-full px-4 py-3">
                    <option value="">Select a topic</option>
                    <option value="reservation">Reservation Question</option>
                    <option value="pricing">Pricing Inquiry</option>
                    <option value="service">Service Question</option>
                    <option value="dropbox">DropBox System</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-2">Message *</label>
                  <textarea id="message" name="message" required rows={6} value={formData.message} onChange={handleChange} className="w-full px-4 py-3 resize-vertical" placeholder="Tell us how we can help you..." />
                </div>
                <button type="submit" className="w-full btn-primary text-lg py-4 flex items-center justify-center space-x-2">
                  <SafeIcon icon={FiSend} className="w-5 h-5" />
                  <span>Send Message</span>
                </button>
              </form>
            </div>
          </motion.div>
        </div>

        {/* Map Section */}
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mt-16">
          <h3 className="font-serif font-bold text-3xl text-whetstone-cream mb-6 text-center">Find our Home Shoppe</h3>
          <div className="card overflow-hidden p-0 border-0">
            <div className="relative w-full h-96 bg-gray-800">
              <iframe 
                width="100%" 
                height="100%" 
                style={{ border: 0, filter: 'grayscale(100%) invert(92%) contrast(83%)' }} 
                src="https://www.openstreetmap.org/export/embed.html?bbox=-93.4542,45.1098,-93.4142,45.1498&amp;layer=mapnik&amp;marker=45.1298,-93.4342" 
                allowFullScreen 
                title="Chef KnifeWorks Location"
              ></iframe>
              <div className="absolute top-4 right-4 bg-carbon-black p-4 rounded-lg shadow-lg max-w-xs border border-white/10">
                <h3 className="font-bold text-whetstone-cream mb-1">Chef KnifeWorks</h3>
                <p className="text-sm text-gray-400">13969 88th Place North<br/>Maple Grove, MN 55369</p>
                <a href="https://www.google.com/maps/search/?api=1&query=13969+88th+Place+North+Maple+Grove+MN+55369" target="_blank" rel="noreferrer" className="text-xs text-honed-sage font-bold mt-2 block hover:text-white transition-colors">
                  Open in Google Maps
                </a>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ContactPage;