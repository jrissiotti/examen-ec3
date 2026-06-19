/**
 * Tipos TypeScript para el Simulador de Descargas Concurrentes
 * @module types
 */

/** Estados posibles de una descarga */
export type EstadoDescarga = 'PENDIENTE' | 'EN_PROGRESO' | 'COMPLETADA' | 'FALLIDA' | 'REINTENTANDO' | 'CANCELADA';

/** Tipos de descargador soportados */
export type TipoDescargador = 'http' | 'ftp' | 'mock';

/** Datos del formulario de nueva descarga */
export interface DownloadFormData {
  url: string;
  tipo: TipoDescargador;
  maxReintentos: number;
}

/** Entidad Descarga completa - usa string para compatibilidad con API */
export interface Download {
  id: string;
  url: string;
  tipo: string;
  estado: string;
  progreso: number;
  intentos: number;
  fechaCreacion?: string;
  tiempoInicio?: number;
  tiempoFin?: number;
  error?: string;
}

/** Respuesta de la API al crear descarga */
export interface DownloadCreatedResponse {
  id: string;
  url: string;
  tipo: string;
  estado: string;
  mensaje: string;
}

/** Respuesta de estado de descarga */
export interface DownloadStatusResponse {
  id: string;
  url: string;
  tipo: string;
  estado: string;
  progreso: number;
  intentos: number;
}

/** Respuesta de listado de descargas */
export interface DownloadListResponse {
  descargas: DownloadStatusResponse[];
  total: number;
  completadas: number;
  pendientes: number;
  fallidas: number;
}

/** Respuesta de reintento */
export interface RetryResponse {
  id: string;
  estado: string;
  mensaje: string;
}

/** Error de la API */
export interface ApiError {
  error: string;
  codigo?: string;
  statusCode?: number;
}

/** Props para DownloadForm */
export interface DownloadFormProps {
  onSubmit: (data: DownloadFormData) => void;
  loading?: boolean;
}

/** Props para DownloadList */
export interface DownloadListProps {
  downloads: Download[];
  onRetry: (id: string) => void;
  onViewDetails: (id: string) => void;
  onCancel?: (id: string) => void;
}

/** Props para DownloadStatus */
export interface DownloadStatusProps {
  status: string;
}

/** Props para DownloadCard */
export interface DownloadCardProps {
  download: Download;
  onRetry?: () => void;
  onViewDetails?: () => void;
}

/** Props para ProgressBar */
export interface ProgressBarProps {
  progress: number;
  showLabel?: boolean;
}

/** Props para ErrorBoundary */
export interface ErrorBoundaryProps {
  children: unknown;
}

/** Datos para gráficos */
export interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor?: string[];
    borderColor?: string;
    borderWidth?: number;
  }[];
}

/** Filtros de búsqueda */
export interface DownloadFilters {
  estado?: string;
  tipo?: string;
  search?: string;
}
