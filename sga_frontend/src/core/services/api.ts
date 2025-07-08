import axios from 'axios';
import { apiBaseUrl } from '../../config/apiConfig';

const api = axios.create({
  baseURL: apiBaseUrl,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: false,
});

/*
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token'); // or from Redux/auth context
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Optional: Add response interceptor (e.g., for auto-logout on 401)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.warn('Unauthorized - redirecting to login...');
    }
    return Promise.reject(error);
  }
);
*/

export default api;
