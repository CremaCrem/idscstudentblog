import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5050/api/v1';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  timeout: 60000,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    const errorMessage = error.response?.data?.error?.message || 'An unexpected error occurred.';
    const enhancedError = new Error(errorMessage) as any;
    enhancedError.status = error.response?.status;
    enhancedError.code = error.response?.data?.error?.code;
    enhancedError.details = error.response?.data?.error?.details;
    return Promise.reject(enhancedError);
  }
);
