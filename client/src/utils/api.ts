// client/src/utils/api.ts (Updated)
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include language in requests
api.interceptors.request.use((config) => {
  // Get current language from localStorage or context
  const currentLanguage = localStorage.getItem('language') || 'en';
  
  // Add language as query parameter
  if (config.params) {
    config.params.lang = currentLanguage;
  } else {
    config.params = { lang: currentLanguage };
  }
  
  // Also add as header
  config.headers['Accept-Language'] = currentLanguage;
  
  return config;
});

export const endpoints = {
  products: '/products/',
  featuredProducts: '/featured-products/',
  categories: '/categories/',
  slider: '/slider/',
  contact: '/contact/',
  filters: '/filters/',
} as const;