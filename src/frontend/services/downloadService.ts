/**
 * Servicio de descargas - Comunicación con la API REST del backend
 * @module downloadService
 */

import apiClient from './apiClient';
import type {
  DownloadFormData,
  DownloadCreatedResponse,
  DownloadStatusResponse,
  DownloadListResponse,
  RetryResponse,
} from '../types';

/**
 * Crea una nueva descarga
 * @param data - Datos del formulario
 * @returns Respuesta de la API
 */
export async function createDownload(
  data: DownloadFormData
): Promise<DownloadCreatedResponse> {
  const response = await apiClient.post<DownloadCreatedResponse>('/descargas', {
    url: data.url,
    tipo: data.tipo,
    maxReintentos: data.maxReintentos,
  });
  return response.data;
}

/**
 * Obtiene el estado de una descarga
 * @param id - ID de la descarga
 * @returns Estado de la descarga
 */
export async function getDownloadStatus(
  id: string
): Promise<DownloadStatusResponse> {
  const response = await apiClient.get<DownloadStatusResponse>(`/descargas/${id}/estado`);
  return response.data;
}

/**
 * Lista todas las descargas
 * @returns Lista de descargas con estadísticas
 */
export async function listDownloads(): Promise<DownloadListResponse> {
  const response = await apiClient.get<DownloadListResponse>('/descargas');
  return response.data;
}

/**
 * Reintenta una descarga fallida
 * @param id - ID de la descarga
 * @returns Respuesta de reintento
 */
export async function retryDownload(id: string): Promise<RetryResponse> {
  const response = await apiClient.post<RetryResponse>(`/descargas/${id}/reintentar`);
  return response.data;
}
/**
 * Cancela una descarga en curso
 * @param id - ID de la descarga
 * @returns Respuesta de cancelación
 */
export async function cancelDownload(id: string): Promise<{ id: string; estado: string; mensaje: string }> {
  const response = await apiClient.post(`/descargas/${id}/cancelar`);
  return response.data;
}

/** Objeto con todos los métodos del servicio */
export const downloadService = {
  createDownload,
  getDownloadStatus,
  listDownloads,
  retryDownload,
  cancelDownload,
};

export default downloadService;
