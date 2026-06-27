const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

export const apiUrl = (path) => {
  if (!path.startsWith('/')) {
    path = `/${path}`;
  }
  return `${API_BASE_URL}${path}`;
};

export const isApiConfigured = () => Boolean(API_BASE_URL);

export const getCheckInUrl = (reservationId) => {
  const origin = window.location.origin;
  return `${origin}/dropbox?id=${encodeURIComponent(reservationId)}`;
};
