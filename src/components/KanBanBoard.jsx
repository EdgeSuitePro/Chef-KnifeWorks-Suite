import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { 
  FiPackage, 
  FiTool, 
  FiStar, 
  FiCheckCircle, 
  FiDollarSign, 
  FiClock, 
  FiMail, 
  FiPhone, 
  FiMoreVertical,
  FiUser,
  FiCalendar,
  FiEdit2,
  FiCamera,
  FiSave,
  FiX,
  FiImage,
  FiChevronRight,
  FiChevronLeft
} = FiIcons;

const KanBanBoard = ({ reservations, stages, onMoveReservation, onOpenPOS, onUpdateStatus, onOpenClientDetails, onUpdateReservation }) => {
  const [draggedReservation, setDraggedReservation] = useState(null);
  const [dragOverStage, setDragOverStage] = useState(null);
  const [expandedCard, setExpandedCard] = useState(null);
  const scrollContainerRef = useRef(null);
  
  // Edit State
  const [isEditing, setIsEditing] = useState(false);
  const [editFormData, setEditFormData] = useState({});

  const handleDragStart = (e, reservation) => {
    setDraggedReservation(reservation);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e, stageId) => {
    e.preventDefault();
    if (dragOverStage !== stageId) {
      setDragOverStage(stageId);
    }
  };

  const handleDrop = (e, targetStage) => {
    e.preventDefault();
    setDragOverStage(null);
    if (draggedReservation && draggedReservation.status !== targetStage) {
      onMoveReservation(draggedReservation.id, draggedReservation.status, targetStage);
      
      // Auto-open edit mode if moved to 'received' to verify quantity
      if (targetStage === 'received') {
        setExpandedCard(draggedReservation.id);
        startEditing(draggedReservation);
      }
    }
    setDraggedReservation(null);
  };

  const formatTime = (timeString) => {
    if (!timeString) return '';
    const [time, period] = timeString.split(' ');
    return period ? `${time} ${period}` : timeString; 
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const getPriorityColor = (qty) => {
    const quantity = parseInt(qty) || 0;
    if (quantity > 10) return 'bg-red-500';
    if (quantity > 5) return 'bg-orange-400';
    if (quantity > 0) return 'bg-blue-400';
    return 'bg-gray-300';
  };

  const startEditing = (reservation) => {
    setEditFormData({
      knife_quantity: reservation.knife_quantity || '',
      notes: reservation.notes || '',
      photos: reservation.photos || [],
      id: reservation.id
    });
    setIsEditing(true);
  };

  const handleCardDoubleClick = (e, reservation) => {
    e.stopPropagation();
    setExpandedCard(reservation.id);
    startEditing(reservation);
  };

  const cancelEditing = () => {
    setIsEditing(false);
    setEditFormData({});
  };

  const saveEditing = () => {
    if (onUpdateReservation && editFormData.id) {
      onUpdateReservation(editFormData.id, {
        knife_quantity: editFormData.knife_quantity,
        notes: editFormData.notes,
        photos: editFormData.photos
      });
    }
    setIsEditing(false);
  };

  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Convert to Base64
    const toBase64 = file => new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });

    try {
      const base64Data = await toBase64(file);
      const newPhoto = {
        id: Date.now(),
        name: file.name,
        url: base64Data
      };
      
      setEditFormData(prev => ({
        ...prev,
        photos: [...(prev.photos || []), newPhoto]
      }));
    } catch (error) {
      console.error("Error uploading photo", error);
    }
  };

  const removePhoto = (photoId) => {
    setEditFormData(prev => ({
      ...prev,
      photos: prev.photos.filter(p => p.id !== photoId)
    }));
  };

  return (
    <div className="h-full flex flex-col overflow-hidden relative">
      {/* Mobile Scroll Indicators */}
      <div className="md:hidden absolute top-1/2 left-2 z-20 pointer-events-none opacity-50">
        <SafeIcon icon={FiChevronLeft} className="w-6 h-6 text-gray-400" />
      </div>
      <div className="md:hidden absolute top-1/2 right-2 z-20 pointer-events-none opacity-50">
        <SafeIcon icon={FiChevronRight} className="w-6 h-6 text-gray-400" />
      </div>

      <div 
        ref={scrollContainerRef}
        className="flex-1 overflow-x-auto overflow-y-hidden snap-x snap-mandatory scroll-smooth"
      >
        <div className="h-full flex space-x-4 min-w-max pb-4 px-4 sm:px-2">
          {stages.map((stage) => {
            const stageReservations = reservations.filter(r => r.status === stage.id);
            const isDragOver = dragOverStage === stage.id;
            
            return (
              <div 
                key={stage.id} 
                className={`
                  w-[85vw] sm:w-80 flex flex-col rounded-xl transition-all duration-200 snap-center
                  ${isDragOver ? 'bg-blue-50 ring-2 ring-blue-200' : 'bg-gray-50/90'} 
                  border border-gray-200/60 shadow-sm backdrop-blur-sm
                `}
                onDragOver={(e) => handleDragOver(e, stage.id)}
                onDrop={(e) => handleDrop(e, stage.id)}
              >
                {/* Column Header */}
                <div className={`p-4 sm:p-3 border-b border-gray-100 flex items-center justify-between rounded-t-xl ${stage.color.replace('bg-', 'bg-opacity-10 bg-')}`}>
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 sm:p-1.5 rounded-md ${stage.color} text-white shadow-sm`}>
                      <SafeIcon icon={stage.icon} className="w-4 h-4 sm:w-3.5 sm:h-3.5" />
                    </div>
                    <span className="font-bold text-gray-800 text-base sm:text-sm tracking-wide font-sans">{stage.title}</span>
                  </div>
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${stage.color} bg-opacity-15 text-gray-700`}>
                    {stageReservations.length}
                  </span>
                </div>
                
                {/* Cards Container */}
                <div className="flex-1 overflow-y-auto p-3 sm:p-2 space-y-3 scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent">
                  <AnimatePresence>
                    {stageReservations.map((reservation) => (
                      <motion.div
                        layoutId={reservation.id}
                        key={reservation.id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        draggable
                        onDragStart={(e) => handleDragStart(e, reservation)}
                        onDoubleClick={(e) => handleCardDoubleClick(e, reservation)}
                        className={`
                          group relative bg-white rounded-lg border shadow-sm hover:shadow-md transition-all cursor-grab active:cursor-grabbing select-none
                          ${expandedCard === reservation.id ? 'ring-2 ring-damascus-bronze/20 z-10' : 'border-gray-200'}
                          ${draggedReservation?.id === reservation.id ? 'opacity-50 rotate-3' : 'opacity-100'}
                        `}
                      >
                        {/* Status Stripe */}
                        <div className={`absolute left-0 top-0 bottom-0 w-1.5 rounded-l-lg ${getPriorityColor(reservation.knife_quantity)} opacity-70`}></div>

                        <div className="p-3 pl-5">
                          {/* Card Header */}
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <div className="flex items-center space-x-2 mb-1">
                                <span className="text-[10px] font-mono text-gray-400 uppercase tracking-wider">
                                  #{reservation.id.slice(0, 6)}
                                </span>
                                {reservation.created_at && (
                                  <span className="text-[10px] text-gray-400 bg-gray-50 px-1 rounded">
                                    {formatDate(reservation.created_at)}
                                  </span>
                                )}
                              </div>
                              <h4 className="font-bold text-gray-800 text-base leading-tight group-hover:text-damascus-bronze transition-colors font-sans">
                                {reservation.customer_name}
                              </h4>
                            </div>
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                setExpandedCard(expandedCard === reservation.id ? null : reservation.id);
                                setIsEditing(false); // Reset edit mode when toggling card
                              }}
                              className="text-gray-400 hover:text-gray-700 p-2 -mr-2 -mt-2 rounded-full hover:bg-gray-100 transition-colors"
                            >
                              <SafeIcon icon={FiMoreVertical} className="w-5 h-5" />
                            </button>
                          </div>

                          {/* Key Details Grid */}
                          <div className="grid grid-cols-2 gap-2 mb-3">
                            <div className="flex items-center space-x-1.5 text-xs text-gray-600 bg-gray-50 p-2 rounded border border-gray-100/50">
                              <SafeIcon icon={FiPackage} className="text-gray-400 w-3.5 h-3.5" />
                              <span className="font-medium">
                                {reservation.knife_quantity ? `${reservation.knife_quantity} Items` : 'No Qty'}
                              </span>
                            </div>
                            <div className="flex items-center space-x-1.5 text-xs text-gray-600 bg-gray-50 p-2 rounded border border-gray-100/50">
                              <SafeIcon icon={FiClock} className="text-gray-400 w-3.5 h-3.5" />
                              <span className="truncate">{formatTime(reservation.drop_off_time)}</span>
                            </div>
                          </div>

                          {/* Quick Actions (Always Visible) */}
                          <div className="flex items-center justify-between gap-2 mt-2 pt-2 border-t border-gray-50">
                             {stage.id !== 'picked-up' && (
                                <button 
                                  onClick={() => onOpenPOS(reservation)}
                                  className="flex-1 flex items-center justify-center space-x-1.5 bg-gray-50 hover:bg-damascus-bronze hover:text-white text-gray-600 py-2 rounded text-xs font-bold transition-colors border border-gray-200 hover:border-transparent group/btn font-sans"
                                >
                                  <SafeIcon icon={FiDollarSign} className="w-3.5 h-3.5" />
                                  <span>POS</span>
                                </button>
                             )}
                             {stage.id === 'ready' && (
                                <button 
                                  onClick={() => onUpdateStatus(reservation.id, 'picked-up')}
                                  className="flex-1 flex items-center justify-center space-x-1.5 bg-honed-sage/10 hover:bg-honed-sage text-honed-sage hover:text-white py-2 rounded text-xs font-bold transition-colors border border-honed-sage/20 hover:border-transparent font-sans"
                                >
                                  <SafeIcon icon={FiCheckCircle} className="w-3.5 h-3.5" />
                                  <span>Finish</span>
                                </button>
                             )}
                             <button 
                                onClick={() => onOpenClientDetails(reservation)}
                                className="px-3 py-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded transition-colors"
                                title="Client Details"
                             >
                               <SafeIcon icon={FiUser} className="w-4 h-4" />
                             </button>
                          </div>

                          {/* Expanded Details */}
                          <AnimatePresence>
                            {(expandedCard === reservation.id) && (
                              <motion.div 
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="overflow-hidden"
                              >
                                <div className="mt-3 pt-3 border-t border-gray-100 space-y-3 pb-1">
                                  {/* Contact Info */}
                                  <div className="space-y-2">
                                    <div className="flex items-center space-x-2 text-xs text-gray-500">
                                      <SafeIcon icon={FiMail} className="w-3.5 h-3.5 text-gray-400" />
                                      <span className="truncate">{reservation.email}</span>
                                    </div>
                                    <div className="flex items-center space-x-2 text-xs text-gray-500">
                                      <SafeIcon icon={FiPhone} className="w-3.5 h-3.5 text-gray-400" />
                                      <span>{reservation.phone}</span>
                                    </div>
                                  </div>

                                  {/* Edit Mode / View Mode */}
                                  {isEditing && editFormData.id === reservation.id ? (
                                    <div className="bg-gray-50 p-2 rounded border border-gray-200 space-y-2">
                                      <div>
                                        <label className="text-[10px] font-bold text-gray-500 uppercase block mb-1">Knife Quantity</label>
                                        <input 
                                          type="number" 
                                          autoFocus
                                          placeholder="Enter quantity"
                                          value={editFormData.knife_quantity}
                                          onChange={(e) => setEditFormData({...editFormData, knife_quantity: e.target.value})}
                                          className="w-full text-sm p-2 border border-blue-200 rounded focus:ring-2 focus:ring-blue-100 outline-none"
                                        />
                                      </div>
                                      <div>
                                        <label className="text-[10px] font-bold text-gray-500 uppercase block mb-1">Notes</label>
                                        <textarea 
                                          value={editFormData.notes}
                                          onChange={(e) => setEditFormData({...editFormData, notes: e.target.value})}
                                          className="w-full text-xs p-2 border border-gray-300 rounded h-16 focus:ring-2 focus:ring-blue-100 outline-none"
                                          placeholder="Add notes..."
                                        />
                                      </div>

                                      {/* Photo Upload in Edit Mode */}
                                      <div>
                                        <div className="flex items-center justify-between mb-1">
                                           <label className="text-[10px] font-bold text-gray-500 uppercase">Photos</label>
                                           <label className="cursor-pointer text-blue-600 text-[10px] hover:underline flex items-center">
                                              <SafeIcon icon={FiCamera} className="w-3 h-3 mr-1"/> Add Photo
                                              <input type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} />
                                           </label>
                                        </div>
                                        {editFormData.photos && editFormData.photos.length > 0 && (
                                            <div className="grid grid-cols-3 gap-1">
                                                {editFormData.photos.map(photo => (
                                                    <div key={photo.id} className="relative group/photo aspect-square bg-gray-200 rounded overflow-hidden">
                                                        <img src={photo.url} alt="Knife" className="w-full h-full object-cover" />
                                                        <button 
                                                            onClick={() => removePhoto(photo.id)}
                                                            className="absolute top-0.5 right-0.5 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover/photo:opacity-100 transition-opacity"
                                                        >
                                                            <SafeIcon icon={FiX} className="w-2.5 h-2.5" />
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                      </div>


                                      <div className="flex space-x-2 pt-1">
                                        <button onClick={saveEditing} className="flex-1 bg-damascus-bronze text-white text-xs py-2 rounded flex items-center justify-center gap-1 hover:bg-opacity-90 font-bold">
                                          <SafeIcon icon={FiSave} className="w-3 h-3"/> Save
                                        </button>
                                        <button onClick={cancelEditing} className="px-3 bg-gray-200 text-gray-600 text-xs py-2 rounded hover:bg-gray-300 font-medium">
                                          Cancel
                                        </button>
                                      </div>
                                    </div>
                                  ) : (
                                    <>
                                      {reservation.notes && (
                                        <div className="text-xs text-gray-600 bg-yellow-50 p-2 rounded border border-yellow-100 italic">
                                          "{reservation.notes}"
                                        </div>
                                      )}
                                      
                                      {/* Photos Preview in View Mode */}
                                      {reservation.photos && reservation.photos.length > 0 && (
                                          <div className="flex gap-1 overflow-x-auto pb-1">
                                              {reservation.photos.map((photo, i) => (
                                                  <div key={i} className="w-10 h-10 flex-shrink-0 rounded overflow-hidden border border-gray-200">
                                                      <img src={photo.url} alt="Thumbnail" className="w-full h-full object-cover" />
                                                  </div>
                                              ))}
                                              <div className="w-10 h-10 flex-shrink-0 rounded bg-gray-50 border border-gray-200 flex items-center justify-center text-[10px] text-gray-500">
                                                  +{reservation.photos.length}
                                              </div>
                                          </div>
                                      )}

                                      {/* Editor Actions */}
                                      <div className="flex space-x-2 mt-2">
                                        <button 
                                          onClick={() => startEditing(reservation)}
                                          className="flex items-center space-x-1 text-xs text-blue-600 bg-blue-50 hover:bg-blue-100 px-3 py-2 rounded transition-colors flex-1 justify-center font-bold"
                                        >
                                          <SafeIcon icon={FiEdit2} className="w-3 h-3" />
                                          <span>Edit Qty & Notes</span>
                                        </button>
                                      </div>
                                    </>
                                  )}
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                  
                  {/* Empty State / Drop Target Hint */}
                  {stageReservations.length === 0 && (
                    <div className={`min-h-[120px] rounded-lg border-2 border-dashed flex flex-col items-center justify-center text-gray-300 transition-colors ${isDragOver ? 'border-blue-300 bg-blue-50/50' : 'border-gray-200'}`}>
                      <SafeIcon icon={FiPackage} className="w-6 h-6 mb-2 opacity-50" />
                      <span className="text-xs font-medium">Drop here</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default KanBanBoard;