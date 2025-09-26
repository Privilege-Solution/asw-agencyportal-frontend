const API_BASE = '/agency/api';

export const apiCall = (endpoint: string, options?: RequestInit) => {
  return fetch(`${API_BASE}${endpoint}`, options);
};