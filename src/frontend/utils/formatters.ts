/**
 * Utilidades de formateo para la UI
 * @module formatters
 */

/**
 * Formatea un estado de descarga para mostrar
 * @param estado - Estado de descarga
 * @returns Texto formateado
 */
export function formatEstado(estado: string): string {
  const map: Record<string, string> = {
    PENDIENTE: 'Pendiente',
    EN_PROGRESO: 'En Progreso',
    COMPLETADA: 'Completada',
    FALLIDA: 'Fallida',
    REINTENTANDO: 'Reintentando',
    CANCELADA: 'Cancelada',
  };
  return map[estado] || estado;
}

/**
 * Devuelve la severidad de PrimeVue para un estado
 * @param estado - Estado de descarga
 * @returns Severidad del tag
 */
export function getEstadoSeverity(estado: string): 'success' | 'info' | 'warn' | 'danger' | 'secondary' | 'contrast' {
  const map: Record<string, 'success' | 'info' | 'warn' | 'danger' | 'secondary' | 'contrast'> = {
    PENDIENTE: 'secondary',
    EN_PROGRESO: 'info',
    COMPLETADA: 'success',
    FALLIDA: 'danger',
    REINTENTANDO: 'warn',
    CANCELADA: 'contrast',
  };
  return map[estado] || 'secondary';
}

/**
 * Devuelve el color CSS para un estado
 * @param estado - Estado de descarga
 * @returns Color CSS
 */
export function getEstadoColor(estado: string): string {
  const map: Record<string, string> = {
    PENDIENTE: '#9e9e9e',
    EN_PROGRESO: '#2196f3',
    COMPLETADA: '#4caf50',
    FALLIDA: '#f44336',
    REINTENTANDO: '#ff9800',
    CANCELADA: '#607d8b',
  };
  return map[estado] || '#9e9e9e';
}

/**
 * Formatea un número de bytes
 * @param bytes - Bytes
 * @returns Texto formateado
 */
export function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}

/**
 * Formatea una fecha ISO
 * @param fecha - Fecha en formato ISO
 * @returns Texto formateado
 */
export function formatFecha(fecha: string | undefined): string {
  if (!fecha) return '-';
  return new Date(fecha).toLocaleString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/**
 * Formatea milisegundos a tiempo legible
 * @param ms - Milisegundos
 * @returns Texto formateado
 */
export function formatDuration(ms: number): string {
  if (ms < 1000) return `${ms}ms`;
  const seconds = Math.floor(ms / 1000);
  if (seconds < 60) return `${seconds}s`;
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}m ${remainingSeconds}s`;
}
