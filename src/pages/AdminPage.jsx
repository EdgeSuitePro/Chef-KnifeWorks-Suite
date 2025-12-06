import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiCalendar, FiUser, FiPackage, FiClock, FiEdit, FiEye, FiFilter } = FiIcons;

const AdminPage = () => {
  const [reservations, setReservations] = useState([]);
  const [filter, setFilter] = useState('all');
  const [selectedReservation, setSelectedReservation] = useState(null);

  const statusOptions = [
    { value: 'received', label: 'Received', color: 'bg-blue-500' },
    { value: 'sharpening', label: 'Sharpening', color: 'bg-damascus-bronze' },
    { value: 'finished', label: 'Finished', color: 'bg-honed-sage' },
    { value: 'ready', label: 'Ready for Pickup', color: 'bg-green-500' },
    { value: 'picked-up', label: 'Picked Up', color: 'bg-gray-500' }
  ];

  useEffect(() => {
    loadReservations();
  }, []);

  const loadReservations = () => {
    const allReservations = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('reservation_')) {
        try {
          const reservation = JSON.parse(localStorage.getItem(key));
          if (!reservation.status) {
            reservation.status = 'received'; // Default status
          }
          allReservations.push(reservation);
        } catch (e) {
          // Skip invalid entries
        }
      }
    }
    
    // Sort by creation date (newest first)
    allReservations.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    setReservations(allReservations);
  };

  const updateReservationStatus = (reservationId, newStatus) => {
    const reservation = reservations.find(r => r.id === reservationId);
    if (reservation) {
      const updatedReservation = {
        ...reservation,
        status: newStatus,
        lastUpdated: new Date().toISOString()
      };
      
      localStorage.setItem(`reservation_${reservationId}`, JSON.stringify(updatedReservation));
      loadReservations();
    }
  };

  const filteredReservations = reservations.filter(reservation => {
    if (filter === 'all') return true;
    return reservation.status === filter;
  });

  const getStatusColor = (status) => {
    const statusOption = statusOptions.find(opt => opt.value === status);
    return statusOption ? statusOption.color : 'bg-gray-500';
  };

  return (
    <div className="min-h-screen bg-whetstone-cream">
      {/* Header */}
      <section className="bg-steel-gray text-edge-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="font-serif font-bold text-4xl mb-4">
            Admin Dashboard
          </h1>
          <p className="text-xl opacity-90">
            Manage reservations and track knife sharpening progress
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {statusOptions.slice(0, 4).map((status) => {
            const count = reservations.filter(r => r.status === status.value).length;
            return (
              <motion.div
                key={status.value}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="card text-center"
              >
                <div className={`w-12 h-12 ${status.color} rounded-full flex items-center justify-center mx-auto mb-4`}>
                  <span className="text-white font-bold text-lg">{count}</span>
                </div>
                <h3 className="font-semibold text-carbon-black">{status.label}</h3>
              </motion.div>
            );
          })}
        </div>

        {/* Filter Bar */}
        <div className="card mb-8">
          <div className="flex items-center space-x-4">
            <SafeIcon icon={FiFilter} className="w-5 h-5 text-steel-gray" />
            <span className="font-medium text-carbon-black">Filter by status:</span>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-3 py-2 border border-steel-gray rounded-lg focus:ring-2 focus:ring-damascus-bronze focus:border-transparent"
            >
              <option value="all">All Reservations</option>
              {statusOptions.map((status) => (
                <option key={status.value} value={status.value}>
                  {status.label}
                </option>
              ))}
            </select>
            <span className="text-steel-gray">
              Showing {filteredReservations.length} of {reservations.length} reservations
            </span>
          </div>
        </div>

        {/* Reservations Table */}
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-whetstone-cream">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-carbon-black">
                    Reservation
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-carbon-black">
                    Customer
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-carbon-black">
                    Drop-Off
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-carbon-black">
                    Knives
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-carbon-black">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-carbon-black">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-whetstone-cream">
                {filteredReservations.map((reservation) => (
                  <motion.tr
                    key={reservation.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="hover:bg-whetstone-cream transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <SafeIcon icon={FiPackage} className="w-5 h-5 text-damascus-bronze" />
                        <div>
                          <p className="font-mono font-semibold text-carbon-black">
                            {reservation.id}
                          </p>
                          <p className="text-sm text-steel-gray">
                            {new Date(reservation.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <SafeIcon icon={FiUser} className="w-5 h-5 text-steel-gray" />
                        <div>
                          <p className="font-semibold text-carbon-black">{reservation.name}</p>
                          <p className="text-sm text-steel-gray">{reservation.phone}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <SafeIcon icon={FiCalendar} className="w-5 h-5 text-steel-gray" />
                        <div>
                          <p className="font-semibold text-carbon-black">{reservation.dropOffDate}</p>
                          <p className="text-sm text-steel-gray">{reservation.selectedSlot}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-honed-sage text-edge-white">
                        {reservation.knifeQty}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <select
                        value={reservation.status}
                        onChange={(e) => updateReservationStatus(reservation.id, e.target.value)}
                        className={`px-3 py-1 rounded-full text-sm font-medium text-white border-none ${getStatusColor(reservation.status)}`}
                      >
                        {statusOptions.map((status) => (
                          <option key={status.value} value={status.value}>
                            {status.label}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => setSelectedReservation(reservation)}
                        className="text-damascus-bronze hover:text-steel-gray transition-colors"
                      >
                        <SafeIcon icon={FiEye} className="w-5 h-5" />
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredReservations.length === 0 && (
            <div className="text-center py-12">
              <SafeIcon icon={FiPackage} className="w-16 h-16 text-steel-gray mx-auto mb-4 opacity-50" />
              <p className="text-steel-gray text-lg">No reservations found</p>
              <p className="text-steel-gray">Reservations will appear here once customers make bookings</p>
            </div>
          )}
        </div>
      </div>

      {/* Reservation Detail Modal */}
      {selectedReservation && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          onClick={() => setSelectedReservation(null)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-edge-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-serif font-bold text-2xl text-carbon-black">
                Reservation Details
              </h3>
              <button
                onClick={() => setSelectedReservation(null)}
                className="text-steel-gray hover:text-carbon-black"
              >
                <SafeIcon icon={FiEdit} className="w-6 h-6" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-steel-gray">Reservation ID</label>
                  <p className="font-mono font-bold text-lg">{selectedReservation.id}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-steel-gray">Customer Name</label>
                  <p className="font-semibold">{selectedReservation.name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-steel-gray">Phone</label>
                  <p>{selectedReservation.phone}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-steel-gray">Email</label>
                  <p>{selectedReservation.email}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-steel-gray">Knife Quantity</label>
                  <p className="font-semibold">{selectedReservation.knifeQty}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-steel-gray">Drop-Off Date</label>
                  <p>{selectedReservation.dropOffDate}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-steel-gray">Drop-Off Time</label>
                  <p>{selectedReservation.selectedSlot}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-steel-gray">Expected Pickup</label>
                  <p>{selectedReservation.pickupDate}</p>
                </div>
              </div>
            </div>

            {selectedReservation.notes && (
              <div className="mt-6">
                <label className="text-sm font-medium text-steel-gray">Notes</label>
                <p className="mt-1 p-3 bg-whetstone-cream rounded-lg">{selectedReservation.notes}</p>
              </div>
            )}

            {selectedReservation.photos && selectedReservation.photos.length > 0 && (
              <div className="mt-6">
                <label className="text-sm font-medium text-steel-gray mb-3 block">
                  Uploaded Photos ({selectedReservation.photos.length})
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {selectedReservation.photos.map((photo) => (
                    <img
                      key={photo.id}
                      src={photo.url}
                      alt={photo.name}
                      className="w-full h-24 object-cover rounded-lg border border-steel-gray"
                    />
                  ))}
                </div>
              </div>
            )}

            <div className="mt-6 pt-6 border-t border-whetstone-cream">
              <div className="flex items-center justify-between">
                <span className="text-sm text-steel-gray">
                  Created: {new Date(selectedReservation.createdAt).toLocaleString()}
                </span>
                {selectedReservation.lastUpdated && (
                  <span className="text-sm text-steel-gray">
                    Updated: {new Date(selectedReservation.lastUpdated).toLocaleString()}
                  </span>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default AdminPage;