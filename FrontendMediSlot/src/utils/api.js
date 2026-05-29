const API_BASE = import.meta.env.VITE_API_URL || '/api';

export const fetchApi = async (endpoint, options = {}) => {
  const token = localStorage.getItem('token');
  
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  // Artificial 500ms delay in dev
  if (import.meta.env && import.meta.env.DEV) {
    await new Promise(r => setTimeout(r, 500));
  }

  let response;
  try {
    response = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers,
    });
  } catch (error) {
    throw new Error("Unable to connect. Check your connection and try again.");
  }

  let data = {};
  try {
    data = await response.json();
  } catch (e) {
    // Empty response body
  }

  if (!response.ok) {
    if (response.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login?expired=true';
    }
    throw new Error(data.error || data.detail || 'API request failed');
  }

  return data;
};
