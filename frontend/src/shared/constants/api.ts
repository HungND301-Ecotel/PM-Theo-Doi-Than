// src/shared/constants/api.ts

const rawBaseUrl = import.meta.env.VITE_API_BASE_URL;

if (!rawBaseUrl && import.meta.env.PROD) {
  throw new Error(
    '[Config Error] VITE_API_BASE_URL is not defined. ' +
      'Set this environment variable before building for production.'
  );
}

export const API_BASE_URL = rawBaseUrl ?? 'http://localhost:3000';

export const API_ENDPOINTS = {
  auth: {
    login: '/api/v1/auth/login',
    logout: '/api/v1/auth/logout',
    refresh: '/api/v1/auth/refresh',
  },
  // Thêm các module khác sau
};
