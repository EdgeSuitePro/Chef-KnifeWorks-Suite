import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import SafeIcon from '../common/SafeIcon';
import KanBanBoard from '../components/KanBanBoard';
import POSSystem from '../components/POSSystem';
import ClientDetailModal from '../components/ClientDetailModal';
import CalendarView from '../components/CalendarView';
import * as FiIcons from 'react-icons/fi';
import { Link, useNavigate } from 'react-router-dom';

const { FiPackage, FiTool, FiStar, FiCheckCircle, FiArrowLeft, FiRefreshCw, FiDatabase, FiLogOut, FiUser, FiSettings, FiCalendar, FiList } = FiIcons;

const CRMPage = () => {
  const [reservations, setReservations] = useState([]);
  const [selectedReservation, setSelectedReservation] = useState(null);
  const [showPOS, setShowPOS] = useState(false);
  const [showClientDetails, setShowClientDetails] = useState(false);
  const [loading, setLoading] = useState(true);
  const [lastRefresh, setLastRefresh] = useState(null);
  const [serverStatus, setServerStatus] = useState('unknown');
  const [currentUser, setCurrentUser] = useState(null);
  const [viewMode, setViewMode] = useState('board'); // 'board' or 'calendar'
  const navigate = useNavigate();

  const stages = [
    { id: 'booked', title: 'Booked', color: 'bg-purple-500', icon: FiPackage },
    { id: 'received', title: 'Received', color: 'bg-blue-500', icon: FiPackage },
    { id: 'sharpening', title: 'Sharpening', color: 'bg-damascus-bronze', icon: FiTool },
    { id: 'finished', title: 'Finished', color: 'bg-honed-sage', icon: FiStar },
    { id: 'ready', title: 'Ready for Pickup', color: 'bg-green-500', icon: FiCheckCircle },
    { id: 'picked-up', title: 'Picked Up', color: 'bg-steel-gray', icon: FiCheckCircle }
  ];

  // Enable light theme for body when CRM is active
  useEffect(() => {
    document.body.classList.add('light-theme-active');
    return () => {
      document.body.classList.remove('light-theme-active');
    };
  }, []);

  const testServerConnection = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/test');
      if (response.ok) {
        setServerStatus('connected');
        return true;
      }
    } catch (error) {
      setServerStatus('disconnected');
      return false;
    }
    return false;
  };

  useEffect(() => {
    // Check auth user
    const userStr = localStorage.getItem('crm_user');
    if (userStr) setCurrentUser(JSON.parse(userStr));

    const initializeCRM = async () => {
      setLoading(true);
      const connected = await testServerConnection();
      if (connected) {
        await loadReservations();
      } else {
        loadReservationsFromStorage();
      }
      setLoading(false);
    };

    initializeCRM();

    const interval = setInterval(() => {
      if (serverStatus === 'connected') {
        loadReservations();
      } else {
        testServerConnection().then(connected => {
          if (connected) loadReservations();
        });
      }
    }, 10000);

    return () => clearInterval(interval);
  }, [serverStatus]);

  const loadReservationsFromStorage = () => {
    const allReservations = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('reservation_')) {
        try {
          const reservation = JSON.parse(localStorage.getItem(key));
          const normalizedReservation = {
            ...reservation,
            id: reservation.id || key.replace('reservation_', ''),
            customer_name: reservation.customer_name || reservation.name || '',
            email: reservation.email || '',
            phone: reservation.phone || '',
            knife_quantity: reservation.knife_quantity || reservation.knifeQty || '1-4',
            drop_off_date: reservation.drop_off_date || reservation.dropOffDate || '',
            drop_off_time: reservation.drop_off_time || reservation.selectedSlot || '',
            pickup_date: reservation.pickup_date || reservation.pickupDate || '',
            status: reservation.status || 'received',
            photos: reservation.photos || [],
            notes: reservation.notes || '',
            created_at: reservation.createdAt || reservation.created_at || new Date().toISOString()
          };
          allReservations.push(normalizedReservation);
        } catch (e) {
          console.error('Error parsing reservation:', e);
        }
      }
    }
    allReservations.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    setReservations(allReservations);
    setLastRefresh(new Date());
  };

  const loadReservations = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/reservations');
      if (response.ok) {
        const data = await response.json();
        setReservations(data);
        setLastRefresh(new Date());
      } else {
        loadReservationsFromStorage();
      }
    } catch (error) {
      loadReservationsFromStorage();
    }
  };

  const updateReservationStatus = async (reservationId, newStatus) => {
    try {
      if (serverStatus === 'connected') {
        const response = await fetch(`http://localhost:3001/api/reservations/${reservationId}/status`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: newStatus })
        });
        if (response.ok) {
          loadReservations();
          return true;
        }
      } 
      
      const reservation = reservations.find(r => r.id === reservationId);
      if (reservation) {
        const updatedReservation = { ...reservation, status: newStatus, updated_at: new Date().toISOString() };
        const storageKey = `reservation_${reservationId}`;
        localStorage.setItem(storageKey, JSON.stringify(updatedReservation));
        loadReservationsFromStorage();
        return true;
      }
      return false;
    } catch (error) {
      return false;
    }
  };

  const moveReservation = (id, currentStatus, targetStatus) => {
    if (currentStatus !== targetStatus) {
      updateReservationStatus(id, targetStatus);
    }
  };

  const openPOS = (reservation) => {
    // If client details is open, we can close it or just open POS on top
    // The current logic renders one or the other based on state.
    // Let's ensure client details is closed if we open POS
    if (showClientDetails) setShowClientDetails(false);
    setSelectedReservation(reservation);
    setShowPOS(true);
  };

  const openClientDetails = (reservation) => {
    setSelectedReservation(reservation);
    setShowClientDetails(true);
  };

  const closePOS = () => {
    setSelectedReservation(null);
    setShowPOS(false);
    loadReservations();
  };

  const closeClientDetails = () => {
    setSelectedReservation(null);
    setShowClientDetails(false);
    loadReservations();
  };

  const handleLogout = () => {
    localStorage.removeItem('crm_auth_token');
    localStorage.removeItem('crm_user');
    // Use navigate to go back to main website (home) to avoid GET errors with hash router/server
    navigate('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-whetstone-cream flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-damascus-bronze border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-xl text-steel-gray">Loading CRM...</p>
        </div>
      </div>
    );
  }

  if (showPOS && selectedReservation) {
    return <POSSystem reservation={selectedReservation} onClose={closePOS} />;
  }

  return (
    <div className="min-h-screen bg-whetstone-cream flex flex-col h-screen text-carbon-black">
      {/* Client Detail Modal */}
      {showClientDetails && selectedReservation && (
        <ClientDetailModal 
          reservation={selectedReservation} 
          onClose={closeClientDetails} 
          onUpdateStatus={updateReservationStatus}
          onOpenPOS={openPOS} // Pass the function to open POS
        />
      )}

      {/* Header - Uses Theme Classes */}
      <header className="bg-edge-white shadow-sm border-b border-steel-gray/20 flex-shrink-0 z-10">
        <div className="w-full px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-damascus-bronze rounded-lg flex items-center justify-center shadow-sm">
                <span className="text-white font-bold">CK</span>
              </div>
              <div>
                <h1 className="font-serif font-bold text-2xl hidden sm:block text-carbon-black">Chef KnifeWorks CRM</h1>
                <h1 className="font-serif font-bold text-xl sm:hidden text-carbon-black">CRM</h1>
                <div className="flex items-center space-x-2 text-sm text-steel-gray">
                  <SafeIcon icon={FiUser} className="w-3 h-3" />
                  <span>{currentUser?.username || 'Staff'}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              {/* View Toggle */}
              <div className="bg-whetstone-cream rounded-lg p-1 flex border border-steel-gray/20">
                <button 
                  onClick={() => setViewMode('board')}
                  className={`p-2 rounded transition-colors ${viewMode === 'board' ? 'bg-edge-white text-damascus-bronze shadow-sm' : 'text-steel-gray hover:text-carbon-black'}`}
                  title="Board View"
                >
                  <SafeIcon icon={FiList} />
                </button>
                <button 
                  onClick={() => setViewMode('calendar')}
                  className={`p-2 rounded transition-colors ${viewMode === 'calendar' ? 'bg-edge-white text-damascus-bronze shadow-sm' : 'text-steel-gray hover:text-carbon-black'}`}
                  title="Calendar View"
                >
                  <SafeIcon icon={FiCalendar} />
                </button>
              </div>

              {/* Server Status */}
              <div className="hidden md:flex items-center space-x-2 bg-whetstone-cream border border-steel-gray/20 px-3 py-1 rounded-full">
                <div className={`w-2 h-2 rounded-full ${serverStatus === 'connected' ? 'bg-green-500' : serverStatus === 'disconnected' ? 'bg-red-500' : 'bg-yellow-500'}`}></div>
                <span className="text-xs text-steel-gray">
                  {serverStatus === 'connected' ? 'Online' : 'Offline Mode'}
                </span>
              </div>

              <Link to="/settings" className="btn-secondary !text-steel-gray !border-steel-gray/30 hover:!bg-whetstone-cream hover:!text-carbon-black px-3 py-2 text-xs flex items-center space-x-1">
                <SafeIcon icon={FiSettings} />
                <span className="hidden sm:inline">Settings</span>
              </Link>

              <button 
                onClick={handleLogout}
                className="btn-secondary !text-steel-gray !border-steel-gray/30 hover:!bg-red-50 hover:!text-red-600 hover:!border-red-200 px-3 py-2 text-xs flex items-center space-x-1"
              >
                <SafeIcon icon={FiLogOut} />
                <span className="hidden sm:inline">Logout</span>
              </button>

              <button 
                onClick={() => {
                  if (serverStatus === 'connected') {
                    loadReservations();
                  } else {
                    testServerConnection();
                  }
                }}
                className="btn-primary px-3 py-2 flex items-center space-x-2 text-white"
                title="Refresh"
              >
                <SafeIcon icon={serverStatus === 'connected' ? FiRefreshCw : FiDatabase} className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 overflow-x-hidden overflow-y-auto bg-whetstone-cream p-4">
        {reservations.length === 0 ? (
          <div className="bg-edge-white shadow rounded-lg p-8 text-center max-w-2xl mx-auto mt-10 border border-steel-gray/10">
            <SafeIcon icon={FiPackage} className="w-16 h-16 text-steel-gray mx-auto mb-4 opacity-50" />
            <h3 className="text-xl font-semibold text-carbon-black mb-2">No Reservations Yet</h3>
            <p className="text-steel-gray mb-4">
              Reservations will appear here once customers make bookings.
            </p>
            <button 
              onClick={() => window.location.href = '#/appointment'}
              className="btn-primary text-white"
            >
              Create Test Reservation
            </button>
          </div>
        ) : (
          <>
            {viewMode === 'board' ? (
              <KanBanBoard 
                reservations={reservations} 
                stages={stages} 
                onMoveReservation={moveReservation}
                onOpenPOS={openPOS}
                onUpdateStatus={updateReservationStatus}
                onOpenClientDetails={openClientDetails}
              />
            ) : (
              <div className="w-full">
                <CalendarView 
                  reservations={reservations} 
                  onOpenClientDetails={openClientDetails} 
                />
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default CRMPage;