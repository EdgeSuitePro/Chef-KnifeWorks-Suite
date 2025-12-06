// Centralized configuration for API and App URLs
// In production, VITE_API_URL should be set in your environment variables
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

// Helper to get the current frontend URL for sharing links
export const getAppBaseUrl = () => {
  return window.location.origin + window.location.pathname;
};

export const getPickupLink = (reservationId) => {
  // Handles HashRouter format automatically
  const baseUrl = getAppBaseUrl();
  // Ensure we don't double slashes if pathname ends with /
  const cleanBase = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
  return `${cleanBase}/#/pickup?id=${reservationId}`;
};