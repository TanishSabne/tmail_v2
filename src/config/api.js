import axios from 'axios';
import { APP_CONFIG } from './constants.js';

// Create axios instance with enhanced configuration
const api = axios.create({
  baseURL: APP_CONFIG.API.BASE_URL,
  timeout: APP_CONFIG.API.TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Request interceptor for logging and authentication
api.interceptors.request.use(
  (config) => {
    // Add timestamp to prevent caching
    config.params = {
      ...config.params,
      _t: Date.now()
    };
    
    // Log requests in development
    if (import.meta.env.DEV) {
      console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`);
    }
    
    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling and logging
api.interceptors.response.use(
  (response) => {
    // Log successful responses in development
    if (import.meta.env.DEV) {
      console.log(`API Response: ${response.status} ${response.config.url}`);
    }
    
    return response;
  },
  (error) => {
    // Log errors in development
    if (import.meta.env.DEV) {
      console.error('API Error:', {
        url: error.config?.url,
        method: error.config?.method,
        status: error.response?.status,
        message: error.message
      });
    }
    
    // Add custom error properties
    if (error.response) {
      error.isApiError = true;
      error.statusCode = error.response.status;
    } else if (error.request) {
      error.isNetworkError = true;
    }
    
    return Promise.reject(error);
  }
);

export default api;