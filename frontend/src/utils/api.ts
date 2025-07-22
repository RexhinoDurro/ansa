import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const endpoints = {
  products: '/products/',
  featuredProducts: '/featured-products/',
  categories: '/categories/',
  slider: '/slider/',
  contact: '/contact/',
  filters: '/filters/',
} as const;
