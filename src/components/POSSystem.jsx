import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiDollarSign, FiPackage, FiPlus, FiMinus, FiX, FiCheck, FiCreditCard, FiShoppingCart, FiAlertTriangle, FiTag, FiPercent, FiTrash2 } = FiIcons;

const POSSystem = () => {
  return null;
}

const RealPOSSystem = ({ reservation, onClose, onRecordPayment }) => {
  const [knives, setKnives] = useState([]);
  const [selectedKnifeType, setSelectedKnifeType] = useState('everyday');
  const [selectedServices, setSelectedServices] = useState([]);
  
  // Discount States
  const [activeDiscounts, setActiveDiscounts] = useState([]);
  const [customDiscount, setCustomDiscount] = useState({ name: '', value: '', type: '%' });
  const [savedDiscounts, setSavedDiscounts] = useState([]);
  const [showDiscountForm, setShowDiscountForm] = useState(false);
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [showInvoice, setShowInvoice] = useState(false);
  const [invoiceData, setInvoiceData] = useState(null);
  const [offlinePaymentMode, setOfflinePaymentMode] = useState(false);
  const [offlineNote, setOfflineNote] = useState('');
  
  // Settings
  const [paypalHandle, setPaypalHandle] = useState('chefknifeworks');

  const knifeTypes = [
    { id: 'everyday', name: 'Everyday Kitchen Knife', basePrice: 12 },
    { id: 'japanese', name: 'Japanese & Specialty', basePrice: 25 },
    { id: 'scissors', name: 'Scissors & Shears', basePrice: 10 }
  ];

  const services = [
    { id: 'tip-repair', name: 'Tip Repair', price: 5 },
    { id: 'chip-removal', name: 'Chip Removal', price: 8 },
    { id: 'rust-removal', name: 'Rust & Patina Removal', price: 7 },
    { id: 'polishing', name: 'Polishing', price: 6 },
    { id: 'micro-bevel', name: 'Micro-bevel Conditioning', price: 10 },
    { id: 'straightening', name: 'Straightening', price: 12 }
  ];

  useEffect(() => {
    if (reservation.knives && reservation.knives.length > 0) {
      setKnives(reservation.knives);
    }
    
    // Load settings for discounts and paypal
    const storedSettings = localStorage.getItem('crm_settings');
    if (storedSettings) {
      const parsed = JSON.parse(storedSettings);
      if (parsed.savedDiscounts) setSavedDiscounts(parsed.savedDiscounts);
      if (parsed.paypalHandle) setPaypalHandle(parsed.paypalHandle);
    }
  }, [reservation]);

  const addKnife = () => {
    const knifeType = knifeTypes.find(t => t.id === selectedKnifeType);
    const servicesTotal = selectedServices.reduce((sum, serviceId) => {
      const service = services.find(s => s.id === serviceId);
      return sum + (service ? service.price : 0);
    }, 0);

    const newKnife = {
      id: Date.now() + Math.random(),
      type: knifeType.name,
      basePrice: knifeType.basePrice,
      services: selectedServices.map(serviceId => {
        const service = services.find(s => s.id === serviceId);
        return service ? service.name : '';
      }).filter(Boolean),
      servicesPrice: servicesTotal,
      totalPrice: knifeType.basePrice + servicesTotal
    };

    setKnives([...knives, newKnife]);
    setSelectedServices([]);
  };

  const removeKnife = (knifeId) => {
    setKnives(knives.filter(k => k.id !== knifeId));
  };

  const toggleService = (serviceId) => {
    setSelectedServices(prev => 
      prev.includes(serviceId) 
        ? prev.filter(id => id !== serviceId) 
        : [...prev, serviceId]
    );
  };

  // --- CALCULATION LOGIC ---

  const calculateSubtotal = () => {
    return knives.reduce((sum, knife) => sum + knife.totalPrice, 0);
  };

  const getVolumeDiscountPercent = () => {
    const count = knives.length;
    if (count >= 15) return 0.20; // 20%
    if (count >= 10) return 0.15; // 15%
    if (count >= 5) return 0.10;  // 10%
    return 0; // 0%
  };

  const calculateTotal = () => {
    let total = calculateSubtotal();
    
    // 1. Apply Volume Discount
    const volPercent = getVolumeDiscountPercent();
    if (volPercent > 0) {
      total = total * (1 - volPercent);
    }

    // 2. Apply Custom Discounts
    activeDiscounts.forEach(discount => {
      if (discount.type === '%') {
        const percent = parseFloat(discount.value) / 100;
        total = total * (1 - percent);
      } else {
        total = total - parseFloat(discount.value);
      }
    });

    return Math.max(0, total); // Prevent negative total
  };

  const addCustomDiscount = () => {
    if (customDiscount.name && customDiscount.value) {
      setActiveDiscounts([...activeDiscounts, { ...customDiscount, id: Date.now() }]);
      setCustomDiscount({ name: '', value: '', type: '%' });
      setShowDiscountForm(false);
    }
  };

  const addSavedDiscount = (discount) => {
    setActiveDiscounts([...activeDiscounts, { ...discount, id: Date.now() }]);
  };

  const removeDiscount = (id) => {
    setActiveDiscounts(activeDiscounts.filter(d => d.id !== id));
  };

  // --- INVOICE GENERATION ---

  const handleGenerateInvoice = async () => {
    setIsProcessing(true);
    try {
      const subtotal = calculateSubtotal();
      const volumeDiscountPercent = getVolumeDiscountPercent();
      const volumeDiscountAmount = subtotal * volumeDiscountPercent;
      const total = calculateTotal();
      
      const invoicePayload = {
        paymentMethod: 'paypal',
        paymentStatus: 'pending',
        paypalHandle: paypalHandle,
        knives: knives.map(k => ({
          type: k.type,
          price: k.totalPrice,
          services: k.services.join(', ')
        })),
        details: {
          subtotal,
          volumeDiscount: { percent: volumeDiscountPercent * 100, amount: volumeDiscountAmount },
          activeDiscounts,
          total
        }
      };

      const response = await fetch(`http://localhost:3001/api/reservations/${reservation.id}/invoice`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(invoicePayload)
      });

      const data = await response.json();
      
      if (data.success) {
        setInvoiceData(data.invoice);
        setShowInvoice(true);
      }
    } catch (error) {
      console.error('Error generating invoice:', error);
      alert('Error generating invoice. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };
  
  const handleRecordOfflinePayment = async (type) => {
    setIsProcessing(true);
    try {
      const subtotal = calculateSubtotal();
      const volumeDiscountPercent = getVolumeDiscountPercent();
      const volumeDiscountAmount = subtotal * volumeDiscountPercent;
      const total = calculateTotal();
      
      // 1. Update Invoice as PAID
      const invoicePayload = {
        paymentMethod: type,
        paymentStatus: 'paid', // Mark as paid so pickup page knows
        paypalHandle: paypalHandle,
        knives: knives.map(k => ({
          type: k.type,
          price: k.totalPrice,
          services: k.services.join(', ')
        })),
        details: {
          subtotal,
          volumeDiscount: { percent: volumeDiscountPercent * 100, amount: volumeDiscountAmount },
          activeDiscounts,
          total
        }
      };

      await fetch(`http://localhost:3001/api/reservations/${reservation.id}/invoice`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(invoicePayload)
      });

      // 2. Log Communication
      const summary = `Payment Received via ${type}`;
      const content = `Amount: $${total.toFixed(2)}. Note: ${offlineNote || 'No notes'}. Items: ${knives.length} items.`;
      
      await fetch(`http://localhost:3001/api/reservations/${reservation.id}/communication`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'note',
          direction: 'inbound',
          summary: summary,
          content: content
        })
      });

      // 3. Save Knives State
      await fetch(`http://localhost:3001/api/reservations/${reservation.id}/knives`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          knives: knives.map(k => ({ type: k.type, price: k.totalPrice, services: k.services.join(',') })) 
        })
      });

      alert(`Payment recorded: ${type}`);
      onClose();
    } catch (e) {
      console.error("Error recording payment", e);
      alert("Failed to record payment");
    } finally {
      setIsProcessing(false);
    }
  };

  // Check for quantity mismatch
  const checkInQuantity = reservation.actual_quantity || (reservation.knife_quantity !== 'Pending' ? parseInt(reservation.knife_quantity) : 0);
  const currentQuantity = knives.length;
  const hasQtyMismatch = checkInQuantity > 0 && checkInQuantity !== currentQuantity;

  if (showInvoice && invoiceData) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="min-h-screen bg-gray-100 p-4 text-gray-900"
      >
        <div className="max-w-2xl mx-auto">
          <div className="bg-white shadow rounded-lg p-8 border border-gray-200">
            {/* Invoice Header */}
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-honed-sage rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                <SafeIcon icon={FiCheck} className="w-8 h-8 text-white" />
              </div>
              <h1 className="font-serif font-bold text-3xl text-gray-900 mb-2">
                Invoice Generated
              </h1>
              <p className="text-gray-500">
                Invoice #{invoiceData.id.substring(0, 8).toUpperCase()}
              </p>
            </div>

            {/* Invoice Details */}
            <div className="bg-gray-50 rounded-lg p-6 mb-6 border border-gray-200">
              <div className="grid grid-cols-2 gap-6 mb-6">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Customer</h3>
                  <p className="text-gray-600">{reservation.customer_name}</p>
                  <p className="text-gray-600">{reservation.email}</p>
                </div>
                <div className="text-right">
                  <h3 className="font-semibold text-gray-900 mb-2">Invoice Details</h3>
                  <p className="text-gray-600">Date: {new Date().toLocaleDateString()}</p>
                </div>
              </div>

              {/* Line Items */}
              <div className="space-y-2 mb-4">
                {invoiceData.knives.map((knife, index) => (
                  <div key={index} className="flex justify-between py-2 border-b border-gray-200 last:border-0">
                    <div>
                      <p className="font-medium text-gray-900">{knife.type}</p>
                      {knife.services && (
                        <p className="text-sm text-gray-500">{knife.services}</p>
                      )}
                    </div>
                    <p className="font-semibold text-gray-900">${knife.price.toFixed(2)}</p>
                  </div>
                ))}
              </div>

              {/* Totals Breakdown */}
              <div className="space-y-2 pt-4 border-t border-gray-300">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal:</span>
                  <span>${invoiceData.details.subtotal.toFixed(2)}</span>
                </div>
                
                {/* Volume Discount Line */}
                {invoiceData.details.volumeDiscount.percent > 0 && (
                  <div className="flex justify-between text-honed-sage font-medium">
                    <span>Volume Discount ({invoiceData.details.volumeDiscount.percent}%):</span>
                    <span>-${invoiceData.details.volumeDiscount.amount.toFixed(2)}</span>
                  </div>
                )}

                {/* Other Discounts */}
                {invoiceData.details.activeDiscounts.map((discount, i) => (
                  <div key={i} className="flex justify-between text-honed-sage font-medium">
                    <span>{discount.name}:</span>
                    <span>
                      {discount.type === '%' 
                        ? `-${discount.value}%` 
                        : `-$${parseFloat(discount.value).toFixed(2)}`}
                    </span>
                  </div>
                ))}

                <div className="flex justify-between font-bold text-xl border-t border-gray-300 pt-3 text-gray-900 mt-2">
                  <span>Total Due:</span>
                  <span>${invoiceData.details.total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Payment Link */}
            <div className="bg-damascus-bronze text-white rounded-lg p-6 mb-6 shadow-md">
              <h3 className="font-semibold text-lg mb-3">Payment Link</h3>
              <p className="text-sm mb-4 opacity-90">
                Share this link with {reservation.customer_name} to collect payment via PayPal.
              </p>
              <div className="bg-white/10 p-3 rounded text-sm font-mono break-all mb-4 select-all">
                {invoiceData.invoiceUrl}
              </div>
              <a 
                href={invoiceData.invoiceUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-white text-damascus-bronze px-4 py-2 rounded font-semibold inline-block hover:bg-gray-100 transition-colors shadow-sm"
              >
                Test Link
              </a>
            </div>

            {/* Actions */}
            <div className="flex space-x-4">
              <button 
                onClick={() => {
                  navigator.clipboard.writeText(invoiceData.invoiceUrl);
                  alert('Payment link copied to clipboard!');
                }}
                className="flex-1 btn-secondary !text-gray-600 !border-gray-300 hover:!bg-gray-100 hover:!text-gray-900"
              >
                Copy Link
              </button>
              <button 
                onClick={onClose} 
                className="flex-1 btn-primary text-white"
              >
                Close & Return
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  const volumeDiscountPercent = getVolumeDiscountPercent();

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="min-h-screen bg-gray-100 p-4 text-gray-900"
    >
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="font-serif font-bold text-3xl text-gray-900 mb-2">
              Point of Sale
            </h1>
            <div className="flex items-center space-x-4 text-gray-500 text-sm">
              <span className="bg-white px-2 py-1 rounded border border-gray-200">Res: {reservation.id}</span>
              <span className="bg-white px-2 py-1 rounded border border-gray-200">Client: {reservation.customer_name}</span>
              {reservation.actual_quantity && (
                <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded border border-blue-200 font-semibold">
                  Checked In Qty: {reservation.actual_quantity}
                </span>
              )}
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-lg transition-colors text-gray-500 hover:text-gray-700">
            <SafeIcon icon={FiX} className="w-6 h-6" />
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Item Entry */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Add Items Card */}
            <div className="bg-white shadow rounded-lg p-6 border border-gray-200">
              <h2 className="font-serif font-bold text-xl text-gray-900 mb-4">
                Add Items to Order
              </h2>
              
              {/* Knife Type Selection */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Item Type
                </label>
                <select 
                  value={selectedKnifeType}
                  onChange={(e) => setSelectedKnifeType(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-damascus-bronze focus:border-transparent bg-white text-gray-900 light-input"
                >
                  {knifeTypes.map(type => (
                    <option key={type.id} value={type.id}>
                      {type.name} - ${type.basePrice}
                    </option>
                  ))}
                </select>
              </div>

              {/* Services Selection */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Additional Services
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {services.map(service => (
                    <label key={service.id} className="flex items-center space-x-2 cursor-pointer p-2 hover:bg-gray-50 rounded transition-colors">
                      <input 
                        type="checkbox" 
                        checked={selectedServices.includes(service.id)}
                        onChange={() => toggleService(service.id)}
                        className="rounded text-damascus-bronze focus:ring-damascus-bronze border-gray-300"
                      />
                      <span className="text-sm text-gray-700">{service.name} (+${service.price})</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Add Button */}
              <button 
                onClick={addKnife}
                className="w-full btn-primary flex items-center justify-center space-x-2 text-white shadow-sm"
              >
                <SafeIcon icon={FiPlus} className="w-5 h-5" />
                <span>Add Item</span>
              </button>
            </div>

            {/* Current Items List */}
            <div className="bg-white shadow rounded-lg p-6 border border-gray-200">
              <h2 className="font-serif font-bold text-xl text-gray-900 mb-4">
                Current Order ({knives.length} items)
              </h2>
              
              {knives.length === 0 ? (
                <div className="text-center py-8 text-gray-400">
                  <SafeIcon icon={FiPackage} className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>No items added yet.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {knives.map((knife) => (
                    <motion.div 
                      key={knife.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="bg-gray-50 rounded-lg p-4 flex items-center justify-between border border-gray-200"
                    >
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900">{knife.type}</p>
                        {knife.services.length > 0 && (
                          <p className="text-sm text-gray-500">
                            Services: {knife.services.join(', ')}
                          </p>
                        )}
                        <p className="text-sm text-damascus-bronze font-semibold">
                          ${knife.totalPrice.toFixed(2)}
                        </p>
                      </div>
                      <button 
                        onClick={() => removeKnife(knife.id)}
                        className="p-2 hover:bg-red-50 rounded-lg transition-colors text-red-500"
                      >
                        <SafeIcon icon={FiTrash2} className="w-4 h-4" />
                      </button>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Calculations & Payment */}
          <div className="space-y-6">
            
            {/* Order Summary */}
            <div className="bg-white shadow rounded-lg p-6 border border-gray-200">
              <h2 className="font-serif font-bold text-xl text-gray-900 mb-4">
                Order Summary
              </h2>

              {hasQtyMismatch && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4 flex items-start gap-3">
                  <SafeIcon icon={FiAlertTriangle} className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-bold text-red-800">Quantity Mismatch</p>
                    <p className="text-xs text-red-700">
                      Client checked in <strong>{checkInQuantity}</strong> items, but you have invoiced <strong>{currentQuantity}</strong> items.
                    </p>
                  </div>
                </div>
              )}

              <div className="space-y-3 text-gray-700">
                <div className="flex justify-between">
                  <span className="text-gray-500">Subtotal:</span>
                  <span className="font-semibold">${calculateSubtotal().toFixed(2)}</span>
                </div>

                {/* Discounts Section */}
                <div className="pt-2 border-t border-gray-100">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Discounts</span>
                    <button 
                      onClick={() => setShowDiscountForm(!showDiscountForm)}
                      className="text-xs text-damascus-bronze hover:underline flex items-center"
                    >
                      <SafeIcon icon={FiPlus} className="mr-1" /> Add Discount
                    </button>
                  </div>

                  {/* Volume Discount Display */}
                  {volumeDiscountPercent > 0 && (
                    <div className="flex justify-between text-sm text-honed-sage">
                      <span>Volume ({volumeDiscountPercent * 100}%):</span>
                      <span>-${(calculateSubtotal() * volumeDiscountPercent).toFixed(2)}</span>
                    </div>
                  )}

                  {/* Active Discounts Display */}
                  {activeDiscounts.map(discount => (
                    <div key={discount.id} className="flex justify-between text-sm text-honed-sage items-center group">
                      <span>{discount.name} ({discount.type === '$' ? '$' : ''}{discount.value}{discount.type === '%' ? '%' : ''}):</span>
                      <div className="flex items-center">
                        <span className="mr-2">
                          {discount.type === '%' 
                            ? `-${(calculateSubtotal() * (parseFloat(discount.value)/100)).toFixed(2)}` 
                            : `-${parseFloat(discount.value).toFixed(2)}`}
                        </span>
                        <button onClick={() => removeDiscount(discount.id)} className="text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                          <SafeIcon icon={FiX} className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  ))}
                  
                  {/* Discount Form */}
                  {showDiscountForm && (
                    <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 mt-2 space-y-2 text-sm">
                      {/* Saved Discounts Dropdown */}
                      {savedDiscounts.length > 0 && (
                        <div className="mb-2">
                          <p className="text-xs text-gray-500 mb-1">Saved Discounts</p>
                          <div className="flex flex-wrap gap-2">
                            {savedDiscounts.map(d => (
                              <button 
                                key={d.id}
                                onClick={() => { addSavedDiscount(d); setShowDiscountForm(false); }}
                                className="bg-white border border-gray-300 px-2 py-1 rounded text-xs hover:bg-honed-sage hover:text-white hover:border-honed-sage transition-colors"
                              >
                                {d.name}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {/* Manual Discount */}
                      <p className="text-xs text-gray-500 mb-1">One-off Discount</p>
                      <input 
                        type="text" 
                        placeholder="Name (e.g. Neighbor)" 
                        className="w-full p-1.5 border rounded text-xs mb-1"
                        value={customDiscount.name}
                        onChange={(e) => setCustomDiscount({...customDiscount, name: e.target.value})}
                      />
                      <div className="flex gap-1">
                        <input 
                          type="number" 
                          placeholder="Value" 
                          className="w-full p-1.5 border rounded text-xs"
                          value={customDiscount.value}
                          onChange={(e) => setCustomDiscount({...customDiscount, value: e.target.value})}
                        />
                        <select 
                          className="border rounded text-xs px-1"
                          value={customDiscount.type}
                          onChange={(e) => setCustomDiscount({...customDiscount, type: e.target.value})}
                        >
                          <option value="%">%</option>
                          <option value="$">$</option>
                        </select>
                        <button 
                          onClick={addCustomDiscount}
                          className="bg-damascus-bronze text-white px-2 rounded text-xs"
                        >
                          Add
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex justify-between font-bold text-lg border-t border-gray-200 pt-3 text-gray-900">
                  <span>Total:</span>
                  <span>${calculateTotal().toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Payment Actions */}
            <div className="bg-white shadow rounded-lg p-6 border border-gray-200 space-y-4">
              <h2 className="font-serif font-bold text-xl text-gray-900 mb-2">
                Process Payment
              </h2>
              
              {/* Main Action: Online Invoice */}
              <button 
                onClick={handleGenerateInvoice}
                disabled={knives.length === 0 || isProcessing}
                className="w-full btn-primary py-4 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 text-white shadow-md"
              >
                {isProcessing ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <SafeIcon icon={FiDollarSign} className="w-5 h-5" />
                    <span>Generate Invoice Link</span>
                  </>
                )}
              </button>

              <div className="relative flex py-2 items-center">
                <div className="flex-grow border-t border-gray-200"></div>
                <span className="flex-shrink-0 mx-4 text-gray-400 text-xs uppercase">Or Record Offline</span>
                <div className="flex-grow border-t border-gray-200"></div>
              </div>

              {/* Offline Payment Toggle */}
              {!offlinePaymentMode ? (
                <button 
                  onClick={() => setOfflinePaymentMode(true)}
                  className="w-full py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 text-sm font-semibold"
                >
                  Record Cash / Check Payment
                </button>
              ) : (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="space-y-3 bg-gray-50 p-3 rounded-lg border border-gray-200"
                >
                  <input 
                    type="text" 
                    placeholder="Notes (e.g. Check #123)" 
                    value={offlineNote} 
                    onChange={(e) => setOfflineNote(e.target.value)}
                    className="w-full p-2 text-sm border border-gray-300 rounded bg-white text-gray-900"
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <button 
                      onClick={() => handleRecordOfflinePayment('Cash')}
                      disabled={isProcessing}
                      className="bg-green-600 text-white py-2 rounded text-sm font-bold hover:bg-green-700"
                    >
                      Paid Cash
                    </button>
                    <button 
                      onClick={() => handleRecordOfflinePayment('Check')}
                      disabled={isProcessing}
                      className="bg-blue-600 text-white py-2 rounded text-sm font-bold hover:bg-blue-700"
                    >
                      Paid Check
                    </button>
                  </div>
                  <button 
                    onClick={() => setOfflinePaymentMode(false)}
                    className="text-xs text-gray-500 underline w-full text-center"
                  >
                    Cancel
                  </button>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default RealPOSSystem;