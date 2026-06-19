/**
 * Composable para gestionar el formulario de descargas
 * @module useDownloadForm
 */

import { reactive, computed, ref } from 'vue';
import type { DownloadFormData } from '../types';
import { validateDownloadForm } from '../utils/validators';

const DEFAULT_FORM: DownloadFormData = {
  url: '',
  tipo: 'http',
  maxReintentos: 3,
};

export function useDownloadForm() {
  const form = reactive<DownloadFormData>({ ...DEFAULT_FORM });
  const touched = reactive<Record<string, boolean>>({});
  const submitting = ref(false);

  /** Errores de validación */
  const errors = computed(() => {
    const result = validateDownloadForm(form);
    const visible: Record<string, string> = {};
    for (const [key, err] of Object.entries(result.errors)) {
      if (touched[key]) visible[key] = err;
    }
    return visible;
  });

  /** Si el formulario es válido */
  const isValid = computed(() => {
    return validateDownloadForm(form).valid;
  });

  /** Actualiza un campo */
  function updateField<K extends keyof DownloadFormData>(
    field: K,
    value: DownloadFormData[K]
  ): void {
    form[field] = value;
    touched[field] = true;
  }

  /** Marca todos los campos como tocados */
  function touchAll(): void {
    touched.url = true;
    touched.tipo = true;
    touched.maxReintentos = true;
  }

  /** Resetea el formulario */
  function reset(): void {
    Object.assign(form, DEFAULT_FORM);
    Object.keys(touched).forEach((k) => delete (touched as any)[k]);
  }

  return {
    form,
    errors,
    isValid,
    submitting,
    updateField,
    touchAll,
    reset,
  };
}
