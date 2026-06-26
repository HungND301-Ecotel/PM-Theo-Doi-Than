import axios from 'axios';
import { useAuthStore } from '@/modules/auth/stores/auth.store';

const rawBaseUrl = import.meta.env.VITE_API_BASE_URL;

if (!rawBaseUrl && import.meta.env.PROD) {
  throw new Error(
    '[Config Error] VITE_API_BASE_URL is not defined. ' +
      'Set this environment variable before building for production.'
  );
}

const api = axios.create({
  baseURL: rawBaseUrl ?? 'http://localhost:3000',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().accessToken;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().clearAuth();
    }
    return Promise.reject(error);
  }
);

export default api;
