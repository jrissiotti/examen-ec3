/**
 * Store Pinia para gestión global del estado de descargas
 * @module downloadStore
 */

import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { Download, DownloadFormData } from '../types';
import {
  createDownload,
  listDownloads,
  retryDownload,
} from '../services/downloadService';

export const useDownloadStore = defineStore('downloads', () => {
  // State
  const downloads = ref<Download[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);
  const activePolling = ref<Set<string>>(new Set());

  // Getters
  const sortedDownloads = computed(() =>
    [...downloads.value].sort((a, b) => (b.tiempoInicio || 0) - (a.tiempoInicio || 0))
  );

  const stats = computed(() => {
    const total = downloads.value.length;
    const pendientes = downloads.value.filter(
      (d) => ['PENDIENTE', 'EN_PROGRESO', 'REINTENTANDO'].includes(d.estado)
    ).length;
    const completadas = downloads.value.filter((d) => d.estado === 'COMPLETADA').length;
    const fallidas = downloads.value.filter((d) => d.estado === 'FALLIDA').length;
    return { total, pendientes, completadas, fallidas };
  });

  // Actions
  async function fetchAll(): Promise<void> {
    loading.value = true;
    error.value = null;
    try {
      const response = await listDownloads();
      downloads.value = response.descargas.map((d) => ({
        id: d.id,
        url: d.url,
        tipo: d.tipo,
        estado: d.estado,
        progreso: d.progreso,
        intentos: d.intentos,
        fechaCreacion: new Date().toISOString(),
      }));
    } catch (err: any) {
      error.value = err.error || 'Error al cargar descargas';
    } finally {
      loading.value = false;
    }
  }

  async function create(data: DownloadFormData): Promise<string> {
    loading.value = true;
    error.value = null;
    try {
      const response = await createDownload(data);
      const newDownload: Download = {
        id: response.id,
        url: response.url,
        tipo: response.tipo,
        estado: response.estado,
        progreso: 0,
        intentos: 0,
        fechaCreacion: new Date().toISOString(),
        tiempoInicio: Date.now(),
      };
      downloads.value.unshift(newDownload);
      return response.id;
    } catch (err: any) {
      error.value = err.error || 'Error al crear descarga';
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function retry(id: string): Promise<void> {
    try {
      await retryDownload(id);
      const idx = downloads.value.findIndex((d) => d.id === id);
      if (idx !== -1) {
        downloads.value[idx].estado = 'PENDIENTE';
        downloads.value[idx].progreso = 0;
      }
    } catch (err: any) {
      error.value = err.error || 'Error al reintentar';
      throw err;
    }
  }

  function updateStatus(id: string, status: Partial<Download>): void {
    const idx = downloads.value.findIndex((d) => d.id === id);
    if (idx !== -1) {
      downloads.value[idx] = { ...downloads.value[idx], ...status };
    }
  }

  function addToPolling(id: string): void {
    activePolling.value.add(id);
  }

  function removeFromPolling(id: string): void {
    activePolling.value.delete(id);
  }

  return {
    downloads: sortedDownloads,
    loading,
    error,
    stats,
    activePolling,
    fetchAll,
    create,
    retry,
    updateStatus,
    addToPolling,
    removeFromPolling,
  };
});
