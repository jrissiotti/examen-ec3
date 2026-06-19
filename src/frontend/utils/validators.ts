/**
 * Utilidades de validación para el formulario de descargas
 * @module validators
 */

import type { DownloadFormData } from '../types';

/** Resultado de validación */
export interface ValidationResult {
  valid: boolean;
  errors: Record<string, string>;
}

/**
 * Valida una URL
 * @param url - URL a validar
 * @returns true si es válida
 */
export function isValidUrl(url: string): boolean {
  if (!url || url.trim().length === 0) return false;
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

/**
 * Valida el formulario de descarga completo
 * @param data - Datos del formulario
 * @returns Resultado de validación
 */
export function validateDownloadForm(data: DownloadFormData): ValidationResult {
  const errors: Record<string, string> = {};

  if (!data.url || data.url.trim().length === 0) {
    errors.url = 'La URL es requerida';
  } else if (!isValidUrl(data.url)) {
    errors.url = 'La URL no es válida (debe incluir http:// o https://)';
  }

  if (!data.tipo) {
    errors.tipo = 'El tipo de descarga es requerido';
  } else if (!['http', 'ftp', 'mock'].includes(data.tipo)) {
    errors.tipo = 'Tipo de descarga no soportado';
  }

  if (data.maxReintentos === undefined || data.maxReintentos === null) {
    errors.maxReintentos = 'El número de reintentos es requerido';
  } else if (data.maxReintentos < 0) {
    errors.maxReintentos = 'Los reintentos no pueden ser negativos';
  } else if (data.maxReintentos > 5) {
    errors.maxReintentos = 'Máximo 5 reintentos permitidos';
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}

/**
 * Valida un campo individual en tiempo real
 * @param field - Nombre del campo
 * @param value - Valor del campo
 * @returns Mensaje de error o null
 */
export function validateField(field: string, value: unknown): string | null {
  switch (field) {
    case 'url': {
      const url = value as string;
      if (!url || url.trim().length === 0) return 'La URL es requerida';
      if (!isValidUrl(url)) return 'URL inválida';
      return null;
    }
    case 'tipo': {
      const tipo = value as string;
      if (!tipo) return 'El tipo es requerido';
      if (!['http', 'ftp', 'mock'].includes(tipo)) return 'Tipo no soportado';
      return null;
    }
    case 'maxReintentos': {
      const retries = value as number;
      if (retries === undefined || retries === null) return 'Requerido';
      if (retries < 0) return 'No negativo';
      if (retries > 5) return 'Máx 5';
      return null;
    }
    default:
      return null;
  }
}
