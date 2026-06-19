/**
 * Cliente HTTP configurado con Axios para comunicación con el backend
 * @module apiClient
 */

import axios, { AxiosInstance, AxiosError } from 'axios';
import type { ApiError } from '../types';

/** Instancia de Axios configurada */
const apiClient: AxiosInstance = axios.create({
  baseURL: '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

/** Interceptor de request: logging */
apiClient.interceptors.request.use(
  (config) => {
    console.log(`[API] ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => Promise.reject(error)
);

/** Interceptor de response: manejo de errores */
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiError>) => {
    const apiError: ApiError = {
      error: error.response?.data?.error || error.message || 'Error desconocido',
      codigo: error.response?.data?.codigo,
      statusCode: error.response?.status,
    };
    console.error('[API Error]', apiError);
    return Promise.reject(apiError);
  }
);

export default apiClient;
