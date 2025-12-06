import React, { useState } from 'react';
import { motion } from 'framer-motion';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiPackage, FiTool, FiStar, FiCheckCircle, FiDollarSign, FiClock, FiMail, FiPhone, FiMoreVertical } = FiIcons;

const KanBanBoard = ({ reservations, stages, onMoveReservation, onOpenPOS, onUpdateStatus, onOpenClientDetails }) => {
  const [draggedReservation, setDraggedReservation] = useState(null);
  const [expandedCard, setExpandedCard] = useState(null);

  const handleDragStart = (reservation) => {
    setDraggedReservation(reservation);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e, targetStage) => {
    e.preventDefault();
    if (draggedReservation) {
      onMoveReservation(draggedReservation.id, draggedReservation.status, targetStage);
      setDraggedReservation(null);
    }
  };

  const formatTime = (timeString) => {
    if (!timeString) return '';
    const [time, period] = timeString.split(' ');
    return `${time} ${period}`;
  };

  return (
    <div className="overflow-x-auto">
      <div className="grid grid-cols-1 md:grid-cols-6 gap-4 min-w-[1400px]">
        {stages.map((stage) => {
          const stageReservations = reservations.filter(r => r.status === stage.id);
          
          return (
            <div key={stage.id} className="bg-gray-100 rounded-xl p-4 border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <div className={`w-8 h-8 ${stage.color} rounded-full flex items-center justify-center shadow-sm`}>
                    <SafeIcon icon={stage.icon} className="w-4 h-4 text-white" />
                  </div>
                  <h3 className="font-semibold text-gray-800">{stage.title}</h3>
                  <span className="bg-white px-2 py-1 rounded-full text-xs font-medium text-gray-500 border border-gray-200 shadow-sm">
                    {stageReservations.length}
                  </span>
                </div>
              </div>
              
              <div 
                className={`min-h-[400px] rounded-lg border-2 border-dashed transition-colors ${draggedReservation ? 'border-damascus-bronze bg-white' : 'border-gray-300'}`}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, stage.id)}
              >
                <div className="space-y-3 p-2">
                  {stageReservations.map((reservation, index) => (
                    <motion.div
                      key={reservation.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      draggable
                      onDragStart={() => handleDragStart(reservation)}
                      onDoubleClick={() => onOpenClientDetails && onOpenClientDetails(reservation)}
                      className="bg-white rounded-lg shadow-sm hover:shadow-md transition-all cursor-move border border-gray-200 group"
                    >
                      <div className="p-3">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <p className="font-mono text-xs text-damascus-bronze font-semibold">
                              {reservation.id}
                            </p>
                            <p className="font-semibold text-sm text-gray-900">
                              {reservation.customer_name}
                            </p>
                          </div>
                          <div className="flex items-center space-x-1">
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                setExpandedCard(expandedCard === reservation.id ? null : reservation.id);
                              }}
                              className="p-1 hover:bg-gray-100 rounded text-gray-400 hover:text-gray-600"
                            >
                              <SafeIcon icon={FiMoreVertical} className="w-3 h-3" />
                            </button>
                          </div>
                        </div>

                        <div className="space-y-1 text-xs">
                          <div className="flex items-center space-x-2">
                            <SafeIcon icon={FiPackage} className="w-3 h-3 text-gray-400" />
                            <span className="text-gray-600">{reservation.knife_quantity}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <SafeIcon icon={FiClock} className="w-3 h-3 text-gray-400" />
                            <span className="text-gray-600">{formatTime(reservation.drop_off_time)}</span>
                          </div>
                        </div>

                        {/* Mobile visible hint */}
                        <div className="md:hidden text-[10px] text-center mt-2 text-damascus-bronze opacity-0 group-hover:opacity-100 transition-opacity">
                          Double tap for details
                        </div>

                        {expandedCard === reservation.id && (
                          <motion.div 
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            className="mt-3 pt-3 border-t border-gray-100 space-y-2"
                          >
                            <div className="flex items-center space-x-2">
                              <SafeIcon icon={FiMail} className="w-3 h-3 text-gray-400" />
                              <span className="text-xs text-gray-600 truncate">{reservation.email}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <SafeIcon icon={FiPhone} className="w-3 h-3 text-gray-400" />
                              <span className="text-xs text-gray-600">{reservation.phone}</span>
                            </div>
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                onOpenClientDetails(reservation);
                              }}
                              className="w-full mt-2 text-center text-xs bg-gray-50 text-gray-700 py-1.5 rounded hover:bg-gray-100 border border-gray-200"
                            >
                              Open Client Card
                            </button>
                          </motion.div>
                        )}

                        <div className="flex space-x-2 mt-3">
                          {stage.id !== 'picked-up' && (
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                onOpenPOS(reservation);
                              }}
                              className="flex-1 bg-damascus-bronze text-white px-2 py-1.5 rounded text-xs font-medium hover:bg-opacity-90 transition-colors flex items-center justify-center space-x-1 shadow-sm"
                            >
                              <SafeIcon icon={FiDollarSign} className="w-3 h-3" />
                              <span>POS</span>
                            </button>
                          )}
                          {stage.id === 'ready' && (
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                onUpdateStatus(reservation.id, 'picked-up');
                              }}
                              className="flex-1 bg-honed-sage text-white px-2 py-1.5 rounded text-xs font-medium hover:bg-opacity-90 transition-colors shadow-sm"
                            >
                              Complete
                            </button>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default KanBanBoard;