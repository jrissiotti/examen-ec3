<template>
  <Dialog
    :visible="visible"
    @update:visible="$emit('update:visible', $event)"
    :header="`Detalle de Descarga`"
    modal
    :style="{ width: '650px', maxWidth: '90vw' }"
    class="download-dialog"
    :breakpoints="{ '960px': '75vw', '640px': '90vw' }"
  >
    <div v-if="download" class="detail-content">
      <div class="detail-row">
        <span class="label">ID:</span>
        <span class="value mono">{{ download.id }}</span>
      </div>

      <div class="detail-row">
        <span class="label">URL:</span>
        <a :href="download.url" target="_blank" class="value link">{{ download.url }}</a>
      </div>

      <div class="detail-row">
        <span class="label">Tipo:</span>
        <Tag :value="download.tipo.toUpperCase()" severity="info" />
      </div>

      <div class="detail-row">
        <span class="label">Estado:</span>
        <DownloadStatus :status="download.estado as EstadoDescarga" />
      </div>

      <div class="detail-row">
        <span class="label">Progreso:</span>
        <ProgressBar :progress="download.progreso" class="detail-progress" />
      </div>

      <div class="detail-row">
        <span class="label">Intentos:</span>
        <span class="value">{{ download.intentos }}</span>
      </div>

      <div class="detail-row" v-if="download.error">
        <span class="label">Error:</span>
        <span class="value error-text">{{ download.error }}</span>
      </div>

      <div class="detail-row">
        <span class="label">Creada:</span>
        <span class="value">{{ formatFecha(download.fechaCreacion) }}</span>
      </div>
    </div>

    <template #footer>
      <div class="dialog-footer">
        <Button
          v-if="download?.estado === 'FALLIDA'"
          label="Reintentar"
          icon="pi pi-refresh"
          @click="$emit('retry')"
          severity="warning"
        />
        <Button
          label="Cerrar"
          icon="pi pi-times"
          @click="$emit('update:visible', false)"
          text
        />
      </div>
    </template>
  </Dialog>
</template>

<script setup lang="ts">
import Dialog from 'primevue/dialog';
import Button from 'primevue/button';
import Tag from 'primevue/tag';
import DownloadStatus from './DownloadStatus.vue';
import ProgressBar from './ProgressBar.vue';
import type { Download, EstadoDescarga } from '../types';
import { formatFecha } from '../utils/formatters';

interface Props {
  download: Download | null;
  visible: boolean;
}

defineProps<Props>();

defineEmits<{
  (e: 'update:visible', value: boolean): void;
  (e: 'retry'): void;
}>();
</script>

<style>
/* Estilos globales - sin scoped para forzar la aplicacion */
.download-dialog .p-dialog-header {
  padding: 2rem 2.5rem 1.5rem 2.5rem !important;
}

.download-dialog .p-dialog-content {
  padding: 0 2.5rem 2rem 2.5rem !important;
}

.download-dialog .p-dialog-footer {
  padding: 1.5rem 2.5rem 2rem 2.5rem !important;
}
</style>

<style scoped>
.detail-content {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 1rem 0;
}

.detail-row {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  padding: 1rem 0;
  border-bottom: 1px solid var(--surface-200);
}

.detail-row:last-child {
  border-bottom: none;
}

.label {
  min-width: 120px;
  font-weight: 600;
  color: var(--text-color-secondary);
  font-size: 0.95rem;
}

.value {
  flex: 1;
  color: var(--text-color);
  word-break: break-all;
  font-size: 0.95rem;
}

.value.mono {
  font-family: monospace;
  font-size: 0.9rem;
  background: var(--surface-100);
  padding: 0.3rem 0.6rem;
  border-radius: 0.3rem;
}

.value.link {
  color: var(--primary-color);
  text-decoration: none;
}

.value.link:hover {
  text-decoration: underline;
}

.error-text {
  color: var(--red-500);
  font-weight: 500;
}

.detail-progress {
  flex: 1;
  max-width: 300px;
}

.dialog-footer {
  display: flex;
  gap: 0.75rem;
  justify-content: flex-end;
}
</style>