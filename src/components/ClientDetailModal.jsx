import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import SafeIcon from '../common/SafeIcon';
import { getPickupLink, API_BASE_URL } from '../config';
import * as FiIcons from 'react-icons/fi';

const { FiX, FiPhone, FiMail, FiMessageSquare, FiClock, FiUser, FiCalendar, FiPlus, FiSend, FiCamera, FiTrash2, FiDollarSign, FiLink } = FiIcons;

const ClientDetailModal = ({ reservation, onClose, onUpdateStatus, onOpenPOS }) => {
  const [communications, setCommunications] = useState([]);
  const [newNote, setNewNote] = useState('');
  const [jobPhotos, setJobPhotos] = useState([]);
  const [copyFeedback, setCopyFeedback] = useState('');

  useEffect(() => {
    if (reservation.communications) {
      setCommunications(reservation.communications);
    }
    const storedJobPhotos = localStorage.getItem(`job_photos_${reservation.id}`);
    if (storedJobPhotos) {
      setJobPhotos(JSON.parse(storedJobPhotos));
    }
  }, [reservation]);

  const saveJobPhotos = (photos) => {
    setJobPhotos(photos);
    localStorage.setItem(`job_photos_${reservation.id}`, JSON.stringify(photos));
  };

  const handlePhotoUpload = (e) => {
    const files = Array.from(e.target.files);
    const newPhotos = files.map(file => ({
      id: Date.now() + Math.random(),
      name: file.name,
      url: URL.createObjectURL(file), // Note: In production, upload to server
      timestamp: new Date().toISOString()
    }));
    const updated = [...jobPhotos, ...newPhotos];
    saveJobPhotos(updated);
    logCommunication('note', `Added ${newPhotos.length} job photo(s)`);
  };

  const removePhoto = (photoId) => {
    const updated = jobPhotos.filter(p => p.id !== photoId);
    saveJobPhotos(updated);
  };

  const logCommunication = async (type, summary) => {
    const newComm = {
      id: Date.now().toString(),
      type,
      direction: 'outbound',
      summary,
      created_at: new Date().toISOString()
    };
    setCommunications([newComm, ...communications]);
    try {
      await fetch(`${API_BASE_URL}/reservations/${reservation.id}/communication`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, direction: 'outbound', summary, content: '' })
      });
    } catch (e) {
      console.error('Failed to log comms remotely', e);
    }
  };

  const handleCopyPickupLink = () => {
    const link = getPickupLink(reservation.id);
    navigator.clipboard.writeText(link);
    setCopyFeedback('Link Copied!');
    setTimeout(() => setCopyFeedback(''), 2000);
  };

  const handleAction = (action, value) => {
    let link = '';
    let summary = '';
    const pickupLink = getPickupLink(reservation.id);
    
    switch (action) {
      case 'call': 
        link = `tel:${value}`; 
        summary = `Called client (${value})`; 
        break;
      case 'sms': 
        // Include pickup link in SMS body
        link = `sms:${value}?body=Hi ${reservation.customer_name}, your knives are ready! Pickup portal: ${pickupLink}`; 
        summary = `Sent SMS to client`; 
        break;
      case 'email': 
        link = `mailto:${value}?subject=Chef KnifeWorks - Order Ready&body=Hi ${reservation.customer_name},\n\nYour knives are ready for pickup. Please visit our portal to pay and confirm retrieval:\n\n${pickupLink}`; 
        summary = `Emailed client`; 
        break;
    }
    if (link) {
      window.location.href = link;
      logCommunication(action, summary);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center p-4 z-50 backdrop-blur-sm text-gray-900"
      onClick={onClose}
    >
      <motion.div 
        initial={{ scale: 0.95, y: 20 }} 
        animate={{ scale: 1, y: 0 }} 
        className="bg-white rounded-xl shadow-2xl max-w-6xl w-full max-h-[95vh] overflow-hidden flex flex-col md:flex-row border border-gray-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Left Sidebar */}
        <div className="w-full md:w-1/3 bg-gray-50 p-6 border-r border-gray-200 overflow-y-auto">
          <div className="mb-6">
            <h2 className="font-serif font-bold text-2xl text-gray-900 mb-1">{reservation.customer_name}</h2>
            <div className="flex items-center space-x-2 mb-2">
              <span className="inline-block bg-damascus-bronze text-white text-xs px-2 py-1 rounded font-medium">
                {reservation.status.toUpperCase()}
              </span>
              <span className="text-xs text-gray-500">
                ID: {reservation.id}
              </span>
            </div>
          </div>

          <div className="space-y-6">
            {/* Primary Actions */}
            <div className="space-y-2">
              <button 
                onClick={() => onOpenPOS && onOpenPOS(reservation)}
                className="w-full bg-damascus-bronze text-white py-2 rounded-lg flex items-center justify-center space-x-2 hover:bg-opacity-90 transition-colors shadow-sm"
              >
                <SafeIcon icon={FiDollarSign} className="w-4 h-4" />
                <span className="font-bold text-sm">Open Invoice / POS</span>
              </button>
              
              <button 
                onClick={handleCopyPickupLink}
                className="w-full bg-white border border-gray-300 text-gray-700 py-2 rounded-lg flex items-center justify-center space-x-2 hover:bg-gray-50 transition-colors shadow-sm"
              >
                <SafeIcon icon={FiLink} className="w-4 h-4" />
                <span className="font-bold text-sm">{copyFeedback || 'Copy Pickup Link'}</span>
              </button>
            </div>

            {/* Contact Grid */}
            <div className="grid grid-cols-3 gap-2">
              <button onClick={() => handleAction('call', reservation.phone)} className="flex flex-col items-center p-3 bg-white rounded-lg border border-gray-200 hover:border-damascus-bronze hover:text-damascus-bronze transition-colors">
                <SafeIcon icon={FiPhone} className="mb-1" />
                <span className="text-xs font-medium">Call</span>
              </button>
              <button onClick={() => handleAction('sms', reservation.phone)} className="flex flex-col items-center p-3 bg-white rounded-lg border border-gray-200 hover:border-damascus-bronze hover:text-damascus-bronze transition-colors">
                <SafeIcon icon={FiMessageSquare} className="mb-1" />
                <span className="text-xs font-medium">Text</span>
              </button>
              <button onClick={() => handleAction('email', reservation.email)} className="flex flex-col items-center p-3 bg-white rounded-lg border border-gray-200 hover:border-damascus-bronze hover:text-damascus-bronze transition-colors">
                <SafeIcon icon={FiMail} className="mb-1" />
                <span className="text-xs font-medium">Email</span>
              </button>
            </div>

            {/* Info */}
            <div className="space-y-3 text-sm">
              <div className="flex items-start space-x-3">
                <SafeIcon icon={FiUser} className="w-4 h-4 text-gray-400 mt-1" />
                <div>
                  <p className="font-medium text-gray-900">Contact Info</p>
                  <p className="text-gray-600">{reservation.phone}</p>
                  <p className="text-gray-600 truncate">{reservation.email}</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <SafeIcon icon={FiCalendar} className="w-4 h-4 text-gray-400 mt-1" />
                <div>
                  <p className="font-medium text-gray-900">Reservation</p>
                  <p className="text-gray-600">{reservation.drop_off_date}</p>
                  <p className="text-gray-600">Qty: {reservation.knife_quantity}</p>
                </div>
              </div>
            </div>
            
            {reservation.notes && (
              <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-100">
                <p className="text-xs font-bold text-yellow-800 mb-1">NOTES</p>
                <p className="text-sm text-yellow-900 italic">"{reservation.notes}"</p>
              </div>
            )}
          </div>
        </div>

        {/* Right Content */}
        <div className="w-full md:w-2/3 p-6 bg-white flex flex-col h-full overflow-hidden">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-lg text-gray-900">Job History</h3>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full text-gray-500">
              <SafeIcon icon={FiX} className="w-6 h-6" />
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto pr-2">
            {/* Photos */}
            <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div className="flex justify-between items-center mb-3">
                <h4 className="font-semibold text-sm text-gray-900 flex items-center">
                  <SafeIcon icon={FiCamera} className="mr-2 text-gray-500" /> Job Photos
                </h4>
                <label className="cursor-pointer bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 text-xs font-medium px-3 py-1.5 rounded-md flex items-center shadow-sm">
                  <SafeIcon icon={FiPlus} className="mr-1" /> Add Photo
                  <input type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} />
                </label>
              </div>
              
              {jobPhotos.length === 0 ? (
                <p className="text-xs text-gray-400 italic text-center py-4">No photos added.</p>
              ) : (
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                  {jobPhotos.map(photo => (
                    <div key={photo.id} className="relative group aspect-square">
                      <img src={photo.url} alt="Job" className="w-full h-full object-cover rounded-md border border-gray-200" />
                      <button onClick={() => removePhoto(photo.id)} className="absolute top-1 right-1 text-white opacity-0 group-hover:opacity-100 bg-red-500 rounded-full p-1">
                        <SafeIcon icon={FiTrash2} className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            {/* Timeline */}
            <div className="space-y-4">
              {communications.map((comm) => (
                <div key={comm.id} className="flex space-x-3">
                  <div className="flex-col items-center hidden sm:flex">
                     <div className={`w-8 h-8 rounded-full flex items-center justify-center shadow-sm border border-gray-100 bg-gray-100 text-gray-600`}>
                       <SafeIcon icon={FiUser} className="w-4 h-4" />
                     </div>
                     <div className="h-full w-0.5 bg-gray-200 my-1"></div>
                  </div>
                  <div className="flex-1 bg-gray-50 p-3 rounded-lg border border-gray-100">
                    <div className="flex justify-between items-start">
                      <p className="font-medium text-sm text-gray-900">{comm.summary}</p>
                      <span className="text-xs text-gray-400">{new Date(comm.created_at).toLocaleString()}</span>
                    </div>
                    {comm.content && <p className="text-xs text-gray-600 mt-1">{comm.content}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Note */}
          <div className="mt-4 pt-4 border-t border-gray-200 flex space-x-3">
            <input 
              type="text" 
              placeholder="Add internal note..." 
              className="flex-1 border border-gray-300 rounded-lg px-4 py-2 text-sm bg-white text-gray-900"
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && newNote.trim() && (logCommunication('note', newNote), setNewNote(''))}
            />
            <button 
              onClick={() => newNote.trim() && (logCommunication('note', newNote), setNewNote(''))}
              className="btn-primary py-2 px-4 text-white"
            >
              <SafeIcon icon={FiSend} />
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ClientDetailModal;