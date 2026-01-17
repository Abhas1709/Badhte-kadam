import axios from 'axios';

const envApiUrl = import.meta.env.VITE_API_URL;
const API_URL = envApiUrl
  ? (envApiUrl.endsWith('/api') ? envApiUrl : `${envApiUrl.replace(/\/$/, '')}/api`)
  : 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    if (import.meta.env.DEV) {
      console.log("Request Headers:", config.headers);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle 401 Unauthorized globally (optional: redirect to login)
    if (error.response && error.response.status === 401) {
      try {
        localStorage.removeItem('token');
      } catch (err) {
        console.error("Error removing token:", err);
      }
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
