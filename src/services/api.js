import axios from 'axios';

// ✅ DIRECT PRODUCTION URL - No environment variable
const API_URL = 'https://sjs-backend-new.onrender.com/api';

console.log('🔗 API Base URL:', API_URL);

const api = axios.create({
  baseURL: API_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Request interceptor to add token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log(`📤 ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('❌ Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    console.log(`📥 ${response.config.url} - ${response.status}`);
    return response;
  },
  (error) => {
    console.error('❌ Response Error:', error.response?.status, error.response?.data);
    if (error.code === 'ERR_NETWORK') {
      console.error('⚠️ Network error - Backend URL:', API_URL);
    }
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('userType');
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;