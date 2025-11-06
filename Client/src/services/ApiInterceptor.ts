// src/services/users.ts
import axios from 'axios'; 
import type {
  AxiosInstance,
  InternalAxiosRequestConfig,
  AxiosResponse,
  AxiosError,
} from 'axios';
import { navigateTo } from '../utils/navigation';

// Environment Variables
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
const TIMEOUT = Number(import.meta.env.VITE_TIMEOUT) || 10000;

// Create Axios instance with default config
const api: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

if(localStorage.getItem('token')) {
  api.defaults.headers.common['Authorization'] = localStorage.getItem('token');
}

// Request Interceptor
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `${token}`;
    }

    // Log request details in development
    if (import.meta.env.DEV) {
      console.log('➡️ [Request]', config.method?.toUpperCase(), config.url);
    }

    return config;
  },
  (error: AxiosError) => {
    console.error('❌ [Request Error]', error);
    return Promise.reject(error);
  }
);

// Response Interceptor
api.interceptors.response.use(
  (response: AxiosResponse) => {
    if (import.meta.env.DEV) {
      console.log(`✅ [${response.status}] ${response.config.method?.toUpperCase()} ${response.config.url}`);
    }
    return response;
  },
  (error: AxiosError) => {
    // Handle specific error statuses
    if (error.response) {
      const { status } = error.response;
      
      if (status === 401) {
        // Handle unauthorized (e.g., token expired)
        console.warn('⚠️ Unauthorized! Redirecting to login...');
        localStorage.removeItem('token');
        navigateTo('/auth/login', { replace: true });
      } else if (status === 403) {
        console.error('❌ Forbidden: You do not have permission to access this resource');
      } else if (status === 404) {
        console.error('❌ Resource not found');
      } else if (status >= 500) {
        console.error('❌ Server error occurred');
      }
    } else if (error.request) {
      // The request was made but no response was received
      console.error('❌ No response received from server. Please check your network connection.');
    } else {
      // Something happened in setting up the request
      console.error('❌ Request setup error:', error.message);
    }

    return Promise.reject(error);
  }
);

export default api;