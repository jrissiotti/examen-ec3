/**
 * Composable para gestionar descargas con polling
 * @module useDownloads
 */

import { ref, computed, onMounted, onUnmounted } from 'vue';
import type { Download, DownloadFormData } from '../types';
import {
  createDownload,
  getDownloadStatus,
  listDownloads,
  retryDownload,
  cancelDownload,
} from '../services/downloadService';

/** Intervalo de polling en ms */
const POLLING_INTERVAL = 2000;

export function useDownloads() {
  const downloads = ref<Download[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);
  const pollingIds = ref<Set<string>>(new Set());
  const intervals = ref<Map<string, ReturnType<typeof setInterval>>>(new Map());

  /** Descargas ordenadas por fecha (más recientes primero) */
  const sortedDownloads = computed(() => {
    return [...downloads.value].sort((a, b) => {
      const timeA = a.tiempoInicio || 0;
      const timeB = b.tiempoInicio || 0;
      return timeB - timeA;
    });
  });

  /** Estadísticas de descargas */
  const stats = computed(() => {
    const total = downloads.value.length;
    const pendientes = downloads.value.filter(
      (d) => d.estado === 'PENDIENTE' || d.estado === 'EN_PROGRESO' || d.estado === 'REINTENTANDO'
    ).length;
    const completadas = downloads.value.filter((d) => d.estado === 'COMPLETADA').length;
    const fallidas = downloads.value.filter((d) => d.estado === 'FALLIDA').length;
    return { total, pendientes, completadas, fallidas };
  });

  /** Carga todas las descargas */
  async function fetchDownloads(): Promise<void> {
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

  /** Crea una nueva descarga */
  async function addDownload(data: DownloadFormData): Promise<void> {
    loading.value = true;
    error.value = null;
    try {
      const response = await createDownload(data);
      // Agregar a la lista local
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
      // Iniciar polling para esta descarga
      startPolling(response.id);
    } catch (err: any) {
      error.value = err.error || 'Error al crear descarga';
      throw err;
    } finally {
      loading.value = false;
    }
  }

  /** Reintenta una descarga fallida */
  async function retry(id: string): Promise<void> {
    try {
      await retryDownload(id);
      const index = downloads.value.findIndex((d) => d.id === id);
      if (index !== -1) {
        downloads.value[index].estado = 'PENDIENTE';
        downloads.value[index].progreso = 0;
      }
      startPolling(id);
    } catch (err: any) {
      error.value = err.error || 'Error al reintentar descarga';
      throw err;
    }
  }
    /** Cancela una descarga */
  async function cancel(id: string): Promise<void> {
    try {
      await cancelDownload(id);
      const index = downloads.value.findIndex((d) => d.id === id);
      if (index !== -1) {
        downloads.value[index].estado = 'CANCELADA';
        downloads.value[index].progreso = 0;
      }
      stopPolling(id);
    } catch (err: any) {
      error.value = err.error || 'Error al cancelar descarga';
      throw err;
    }
  }

  /** Inicia polling para una descarga */
  function startPolling(id: string): void {
    if (pollingIds.value.has(id)) return;
    pollingIds.value.add(id);

    const poll = async () => {
      if (!pollingIds.value.has(id)) return;
      try {
        const status = await getDownloadStatus(id);
        const index = downloads.value.findIndex((d) => d.id === id);
        if (index !== -1) {
          downloads.value[index] = {
            ...downloads.value[index],
            estado: status.estado,
            progreso: status.progreso,
            intentos: status.intentos,
          };
          // Detener polling si está completada o fallida
          if (status.estado === 'COMPLETADA' || status.estado === 'FALLIDA') {
            stopPolling(id);
          }
        }
      } catch {
        stopPolling(id);
      }
    };

    poll(); // Primera llamada inmediata
    const interval = setInterval(poll, POLLING_INTERVAL);
    intervals.value.set(id, interval);
  }

  /** Detiene polling para una descarga */
  function stopPolling(id: string): void {
    pollingIds.value.delete(id);
    const interval = intervals.value.get(id);
    if (interval) {
      clearInterval(interval);
      intervals.value.delete(id);
    }
  }

  /** Limpia todos los polling */
  function clearAllPolling(): void {
    intervals.value.forEach((interval) => clearInterval(interval));
    intervals.value.clear();
    pollingIds.value.clear();
  }

  onMounted(() => {
    fetchDownloads();
  });

  onUnmounted(() => {
    clearAllPolling();
  });

  return {
    downloads: sortedDownloads,
    loading,
    error,
    stats,
    fetchDownloads,
    addDownload,
    retry,
    cancel,
    startPolling,
    stopPolling,
  };
}
