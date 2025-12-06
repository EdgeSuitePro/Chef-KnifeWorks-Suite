import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';
import { Link } from 'react-router-dom';

const { FiSave, FiArrowLeft, FiUser, FiLock, FiBriefcase, FiCalendar, FiCheck, FiDollarSign, FiPercent, FiTrash2, FiPlus, FiTag } = FiIcons;

const SettingsPage = () => {
  const [settings, setSettings] = useState({
    businessName: 'Chef KnifeWorks',
    paypalHandle: 'chefknifeworks', // Default example
    googleCalendarConnected: false,
    adminUsername: 'admin',
    adminPassword: 'SharpKnives2024!',
    savedDiscounts: [
      { id: 1, name: 'Friends & Family', value: 50, type: '%' },
      { id: 2, name: 'First Time Customer', value: 5, type: '$' }
    ]
  });
  
  const [newDiscount, setNewDiscount] = useState({ name: '', value: '', type: '%' });
  const [saved, setSaved] = useState(false);

  // Enable light theme for body
  useEffect(() => {
    document.body.classList.add('light-theme-active');
    return () => {
      document.body.classList.remove('light-theme-active');
    };
  }, []);

  useEffect(() => {
    const storedSettings = localStorage.getItem('crm_settings');
    if (storedSettings) {
      setSettings(JSON.parse(storedSettings));
    }
  }, []);

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setSettings({ ...settings, [e.target.name]: value });
  };

  const handleSave = (e) => {
    e.preventDefault();
    localStorage.setItem('crm_settings', JSON.stringify(settings));
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const addDiscount = () => {
    if (newDiscount.name && newDiscount.value) {
      const updatedDiscounts = [
        ...settings.savedDiscounts,
        { ...newDiscount, id: Date.now() }
      ];
      setSettings({ ...settings, savedDiscounts: updatedDiscounts });
      setNewDiscount({ name: '', value: '', type: '%' });
    }
  };

  const removeDiscount = (id) => {
    const updatedDiscounts = settings.savedDiscounts.filter(d => d.id !== id);
    setSettings({ ...settings, savedDiscounts: updatedDiscounts });
  };

  return (
    <div className="min-h-screen bg-whetstone-cream text-carbon-black">
      <header className="bg-edge-white text-carbon-black shadow-sm border-b border-steel-gray/20 py-4">
        <div className="max-w-3xl mx-auto px-4 flex items-center">
          <Link to="/crm" className="mr-4 text-steel-gray hover:text-damascus-bronze transition-colors">
            <SafeIcon icon={FiArrowLeft} className="w-6 h-6" />
          </Link>
          <h1 className="font-serif font-bold text-2xl text-carbon-black">Staff Settings</h1>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-edge-white shadow-sm rounded-lg p-8 border border-steel-gray/20"
        >
          <form onSubmit={handleSave} className="space-y-10">
            
            {/* Business Info */}
            <div>
              <div className="flex items-center space-x-2 mb-4 border-b border-steel-gray/20 pb-2">
                <SafeIcon icon={FiBriefcase} className="text-damascus-bronze" />
                <h2 className="text-xl font-semibold text-carbon-black">Business Info</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-steel-gray mb-2">Business Name</label>
                  <input 
                    type="text" 
                    name="businessName" 
                    value={settings.businessName} 
                    onChange={handleChange} 
                    className="w-full px-4 py-3 border border-steel-gray/30 rounded-lg focus:ring-2 focus:ring-damascus-bronze focus:border-transparent bg-dark-input text-carbon-black" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-steel-gray mb-2">PayPal.me Handle</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500 text-sm pointer-events-none">paypal.me/</span>
                    <input 
                      type="text" 
                      name="paypalHandle" 
                      value={settings.paypalHandle || ''} 
                      onChange={handleChange} 
                      className="w-full pl-24 pr-4 py-3 border border-steel-gray/30 rounded-lg focus:ring-2 focus:ring-damascus-bronze focus:border-transparent bg-dark-input text-carbon-black" 
                      placeholder="username"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Used to generate payment links for invoices.</p>
                </div>
              </div>
            </div>

            {/* Discount Management */}
            <div>
              <div className="flex items-center space-x-2 mb-4 border-b border-steel-gray/20 pb-2">
                <SafeIcon icon={FiTag} className="text-damascus-bronze" />
                <h2 className="text-xl font-semibold text-carbon-black">Preset Discounts</h2>
              </div>
              
              <div className="bg-whetstone-cream rounded-lg p-4 border border-steel-gray/10 mb-4">
                <div className="flex flex-col md:flex-row gap-3 items-end">
                  <div className="flex-grow w-full">
                    <label className="block text-xs font-semibold text-gray-500 mb-1">Discount Name</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Summer Sale" 
                      value={newDiscount.name}
                      onChange={(e) => setNewDiscount({...newDiscount, name: e.target.value})}
                      className="w-full px-3 py-2 border border-steel-gray/30 rounded-md text-sm"
                    />
                  </div>
                  <div className="w-full md:w-32">
                     <label className="block text-xs font-semibold text-gray-500 mb-1">Value</label>
                     <input 
                      type="number" 
                      placeholder="0" 
                      value={newDiscount.value}
                      onChange={(e) => setNewDiscount({...newDiscount, value: e.target.value})}
                      className="w-full px-3 py-2 border border-steel-gray/30 rounded-md text-sm"
                    />
                  </div>
                  <div className="w-full md:w-24">
                    <label className="block text-xs font-semibold text-gray-500 mb-1">Type</label>
                    <select 
                      value={newDiscount.type}
                      onChange={(e) => setNewDiscount({...newDiscount, type: e.target.value})}
                      className="w-full px-3 py-2 border border-steel-gray/30 rounded-md text-sm"
                    >
                      <option value="%">% Off</option>
                      <option value="$">$ Off</option>
                    </select>
                  </div>
                  <button 
                    type="button" 
                    onClick={addDiscount}
                    disabled={!newDiscount.name || !newDiscount.value}
                    className="w-full md:w-auto btn-primary py-2 px-4 flex items-center justify-center"
                  >
                    <SafeIcon icon={FiPlus} className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                {settings.savedDiscounts && settings.savedDiscounts.map(discount => (
                  <div key={discount.id} className="flex justify-between items-center bg-white p-3 rounded border border-gray-200">
                    <div className="flex items-center space-x-3">
                      <span className="bg-gray-100 p-1.5 rounded text-gray-600">
                        <SafeIcon icon={discount.type === '%' ? FiPercent : FiDollarSign} className="w-4 h-4" />
                      </span>
                      <span className="font-medium text-gray-800">{discount.name}</span>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span className="font-bold text-damascus-bronze">
                        {discount.type === '$' ? `$${discount.value}` : `${discount.value}%`} Off
                      </span>
                      <button 
                        type="button" 
                        onClick={() => removeDiscount(discount.id)}
                        className="text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <SafeIcon icon={FiTrash2} className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
                {(!settings.savedDiscounts || settings.savedDiscounts.length === 0) && (
                  <p className="text-sm text-gray-500 text-center italic py-2">No preset discounts saved.</p>
                )}
              </div>
            </div>

            {/* Integrations */}
            <div>
              <div className="flex items-center space-x-2 mb-4 border-b border-steel-gray/20 pb-2">
                <SafeIcon icon={FiCalendar} className="text-damascus-bronze" />
                <h2 className="text-xl font-semibold text-carbon-black">Integrations</h2>
              </div>
              <div className="bg-whetstone-cream p-4 rounded-lg border border-steel-gray/20 flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-carbon-black">Google Calendar</h3>
                  <p className="text-sm text-steel-gray">Sync reservations to your calendar automatically.</p>
                </div>
                <div className="flex items-center">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      name="googleCalendarConnected" 
                      checked={settings.googleCalendarConnected} 
                      onChange={handleChange} 
                      className="sr-only peer" 
                    />
                    <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-100 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-damascus-bronze"></div>
                    <span className="ml-3 text-sm font-medium text-steel-gray">{settings.googleCalendarConnected ? 'Connected' : 'Disconnected'}</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Admin Access */}
            <div>
              <div className="flex items-center space-x-2 mb-4 border-b border-steel-gray/20 pb-2">
                <SafeIcon icon={FiUser} className="text-damascus-bronze" />
                <h2 className="text-xl font-semibold text-carbon-black">Staff Access Credentials</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-steel-gray mb-2">Username</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <SafeIcon icon={FiUser} className="text-steel-gray" />
                    </div>
                    <input 
                      type="text" 
                      name="adminUsername" 
                      value={settings.adminUsername} 
                      onChange={handleChange} 
                      className="w-full pl-10 pr-4 py-3 border border-steel-gray/30 rounded-lg focus:ring-2 focus:ring-damascus-bronze focus:border-transparent bg-dark-input text-carbon-black" 
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-steel-gray mb-2">Password</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <SafeIcon icon={FiLock} className="text-steel-gray" />
                    </div>
                    <input 
                      type="text" 
                      name="adminPassword" 
                      value={settings.adminPassword} 
                      onChange={handleChange} 
                      className="w-full pl-10 pr-4 py-3 border border-steel-gray/30 rounded-lg focus:ring-2 focus:ring-damascus-bronze focus:border-transparent bg-dark-input text-carbon-black" 
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4">
              <button 
                type="submit" 
                className="w-full btn-primary py-3 flex items-center justify-center space-x-2 text-white shadow-md"
              >
                {saved ? (
                  <>
                    <SafeIcon icon={FiCheck} className="w-5 h-5" />
                    <span>Settings Saved</span>
                  </>
                ) : (
                  <>
                    <SafeIcon icon={FiSave} className="w-5 h-5" />
                    <span>Save Changes</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </main>
    </div>
  );
};

export default SettingsPage;