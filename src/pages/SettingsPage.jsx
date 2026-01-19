import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';
import { Link } from 'react-router-dom';
import supabase from '../supabase/supabase';

const { FiSave, FiArrowLeft, FiUser, FiLock, FiBriefcase, FiCalendar, FiCheck, FiDollarSign, FiPercent, FiTrash2, FiPlus, FiTag, FiRefreshCw } = FiIcons;

const SettingsPage = () => {
  const [settings, setSettings] = useState({
    businessName: 'Chef KnifeWorks',
    paypalHandle: 'chefknifeworks',
    googleCalendarConnected: false,
    adminUsername: 'admin',
    adminPassword: 'SharpKnives2024!'
  });
  
  // Coupon State
  const [coupons, setCoupons] = useState([]);
  const [newCoupon, setNewCoupon] = useState({ code: '', value: '', type: 'percentage' });
  const [loadingCoupons, setLoadingCoupons] = useState(false);
  
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    document.body.classList.add('light-theme-active');
    const storedSettings = localStorage.getItem('crm_settings');
    if (storedSettings) setSettings(JSON.parse(storedSettings));
    
    fetchCoupons();
    
    return () => {
      document.body.classList.remove('light-theme-active');
    };
  }, []);

  const fetchCoupons = async () => {
    setLoadingCoupons(true);
    const { data, error } = await supabase.from('coupons').select('*').order('created_at', { ascending: false });
    if (!error && data) setCoupons(data);
    setLoadingCoupons(false);
  };

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

  const handleAddCoupon = async () => {
    if (!newCoupon.code || !newCoupon.value) return;
    
    const { data, error } = await supabase.from('coupons').insert({
      code: newCoupon.code.toUpperCase(),
      discount_type: newCoupon.type,
      discount_value: parseFloat(newCoupon.value),
      active: true
    }).select().single();

    if (error) {
      alert('Error adding coupon (Code might be duplicate)');
    } else {
      setCoupons([data, ...coupons]);
      setNewCoupon({ code: '', value: '', type: 'percentage' });
    }
  };

  const handleDeleteCoupon = async (id) => {
    await supabase.from('coupons').delete().eq('id', id);
    setCoupons(coupons.filter(c => c.id !== id));
  };

  return (
    <div className="min-h-screen bg-whetstone-cream text-carbon-black p-4 md:p-8">
      <header className="max-w-4xl mx-auto mb-8 flex items-center">
        <Link to="/crm" className="mr-4 text-steel-gray hover:text-damascus-bronze">
          <SafeIcon icon={FiArrowLeft} className="w-6 h-6" />
        </Link>
        <h1 className="font-serif font-bold text-3xl text-carbon-black">Staff Settings</h1>
      </header>

      <main className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Col: General Settings */}
        <div className="lg:col-span-2 space-y-8">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white shadow rounded-lg p-6 border border-gray-200">
            <h2 className="flex items-center text-xl font-semibold mb-6 border-b pb-2">
              <SafeIcon icon={FiBriefcase} className="mr-2 text-damascus-bronze" /> Business Info
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Business Name</label>
                <input 
                  type="text" name="businessName" value={settings.businessName} onChange={handleChange} 
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-damascus-bronze"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">PayPal Handle</label>
                <div className="flex items-center border rounded bg-gray-50">
                  <span className="pl-3 text-gray-500 text-sm">paypal.me/</span>
                  <input 
                    type="text" name="paypalHandle" value={settings.paypalHandle} onChange={handleChange} 
                    className="w-full p-2 bg-transparent border-none focus:ring-0"
                  />
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white shadow rounded-lg p-6 border border-gray-200">
             <h2 className="flex items-center text-xl font-semibold mb-6 border-b pb-2">
              <SafeIcon icon={FiUser} className="mr-2 text-damascus-bronze" /> Admin Credentials
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Username</label>
                <input 
                  type="text" name="adminUsername" value={settings.adminUsername} onChange={handleChange} 
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-damascus-bronze"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Password</label>
                <input 
                  type="text" name="adminPassword" value={settings.adminPassword} onChange={handleChange} 
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-damascus-bronze"
                />
              </div>
            </div>
            <div className="mt-6">
              <button onClick={handleSave} className="w-full btn-primary py-3 flex items-center justify-center space-x-2 text-white">
                {saved ? <><SafeIcon icon={FiCheck} /> <span>Saved</span></> : <><SafeIcon icon={FiSave} /> <span>Save Changes</span></>}
              </button>
            </div>
          </motion.div>
        </div>

        {/* Right Col: Coupon Management */}
        <div className="lg:col-span-1">
          <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} className="bg-white shadow rounded-lg p-6 border border-gray-200 h-full">
            <div className="flex items-center justify-between mb-6 border-b pb-2">
              <h2 className="flex items-center text-xl font-semibold">
                <SafeIcon icon={FiTag} className="mr-2 text-damascus-bronze" /> Coupons
              </h2>
              <button onClick={fetchCoupons} className="text-gray-400 hover:text-damascus-bronze">
                <SafeIcon icon={FiRefreshCw} className={loadingCoupons ? "animate-spin" : ""} />
              </button>
            </div>

            {/* Add Coupon Form */}
            <div className="bg-gray-50 p-4 rounded-lg mb-6 border border-gray-100">
              <h3 className="text-sm font-bold text-gray-700 mb-3">Create New Coupon</h3>
              <div className="space-y-3">
                <input 
                  type="text" placeholder="Code (e.g. WELCOME)" 
                  value={newCoupon.code} onChange={e => setNewCoupon({...newCoupon, code: e.target.value})}
                  className="w-full p-2 text-sm border rounded uppercase"
                />
                <div className="flex space-x-2">
                  <input 
                    type="number" placeholder="Value" 
                    value={newCoupon.value} onChange={e => setNewCoupon({...newCoupon, value: e.target.value})}
                    className="w-2/3 p-2 text-sm border rounded"
                  />
                  <select 
                    value={newCoupon.type} onChange={e => setNewCoupon({...newCoupon, type: e.target.value})}
                    className="w-1/3 p-2 text-sm border rounded"
                  >
                    <option value="percentage">%</option>
                    <option value="fixed">$</option>
                  </select>
                </div>
                <button 
                  onClick={handleAddCoupon}
                  disabled={!newCoupon.code || !newCoupon.value}
                  className="w-full bg-honed-sage text-white py-2 rounded text-sm font-bold hover:bg-opacity-90 disabled:opacity-50"
                >
                  Add Coupon
                </button>
              </div>
            </div>

            {/* Coupon List */}
            <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1">
              {coupons.map(coupon => (
                <div key={coupon.id} className="flex justify-between items-center p-3 bg-white border border-gray-100 rounded shadow-sm">
                  <div>
                    <p className="font-bold text-gray-800">{coupon.code}</p>
                    <p className="text-xs text-gray-500">
                      {coupon.discount_type === 'percentage' ? `${coupon.discount_value}% Off` : `$${coupon.discount_value} Off`}
                    </p>
                  </div>
                  <button 
                    onClick={() => handleDeleteCoupon(coupon.id)}
                    className="text-gray-300 hover:text-red-500 transition-colors"
                  >
                    <SafeIcon icon={FiTrash2} />
                  </button>
                </div>
              ))}
              {coupons.length === 0 && !loadingCoupons && (
                <p className="text-center text-gray-400 text-sm py-4">No active coupons</p>
              )}
            </div>
          </motion.div>
        </div>

      </main>
    </div>
  );
};

export default SettingsPage;