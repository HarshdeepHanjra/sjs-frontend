import axios from 'axios';

// ✅ Get API URL from environment variable or use production URL
const API_URL = import.meta.env.VITE_API_URL || 
                import.meta.env.REACT_APP_API_URL || 
                'https://sjs-backend-new.onrender.com/api';

console.log('🔗 API Base URL:', API_URL);

const api = axios.create({
  baseURL: API_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  withCredentials: false  // Change to false for production
});

// Request interceptor to add token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log(`✅ API Request: ${config.method?.toUpperCase()} ${config.url}`);
    } else {
      console.log(`⚠️ API Request: ${config.method?.toUpperCase()} ${config.url} - No auth token`);
    }
    return config;
  },
  (error) => {
    console.error('❌ API Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    console.log(`✅ API Response: ${response.config.url} - Status: ${response.status}`);
    return response;
  },
  (error) => {
    console.error('❌ API Response Error:', error.response?.status, error.response?.data);
    
    if (error.code === 'ERR_NETWORK') {
      console.error('⚠️ Network error - Backend URL:', API_URL);
      console.error('Make sure backend is deployed and CORS is configured');
    }
    
    if (error.response?.status === 401) {
      const isAuthEndpoint = error.config.url?.includes('/auth/');
      
      if (!isAuthEndpoint && !error.config.url?.includes('/verify-token')) {
        console.log('🔐 401 Unauthorized - Clearing auth data');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('userType');
        
        if (!window.location.pathname.includes('/login')) {
          window.location.href = '/login';
        }
      }
    }
    
    return Promise.reject(error);
  }
);

// Session management
export const session = {
  getToken: () => localStorage.getItem('token'),
  getUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },
  getUserType: () => localStorage.getItem('userType'),
  setUser: (user) => localStorage.setItem('user', JSON.stringify(user)),
  setUserType: (userType) => localStorage.setItem('userType', userType),
  clear: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('userType');
  },
  isAuthenticated: () => {
    const token = localStorage.getItem('token');
    return !!token;
  }
};

export default api;