<template>
  <div class="download-list-card">
    <div class="list-header">
      <h2>
        <i class="pi pi-list"></i>
        Descargas Activas
      </h2>
      <div class="header-actions">
        <Button
          icon="pi pi-refresh"
          :loading="loading"
          @click="$emit('refresh')"
          text
          rounded
          aria-label="Refrescar"
        />
        <span class="badge">{{ downloads.length }}</span>
      </div>
    </div>

    <DataTable
      :value="downloads"
      :loading="loading"
      responsiveLayout="scroll"
      class="p-datatable-sm"
      :paginator="downloads.length > 10"
      :rows="10"
      stripedRows
    >
      <Column field="id" header="ID" sortable>
        <template #body="{ data }">
          <span class="id-cell" :title="data.id">{{ truncateId(data.id) }}</span>
        </template>
      </Column>

      <Column field="url" header="URL" sortable>
        <template #body="{ data }">
          <span class="url-cell" :title="data.url">{{ truncateUrl(data.url) }}</span>
        </template>
      </Column>

      <Column field="tipo" header="Tipo" sortable>
        <template #body="{ data }">
          <Tag :value="data.tipo.toUpperCase()" severity="info" class="tipo-tag" />
        </template>
      </Column>

      <Column field="estado" header="Estado" sortable>
        <template #body="{ data }">
          <DownloadStatus :status="data.estado" />
        </template>
      </Column>

      <Column field="progreso" header="Progreso" style="min-width: 140px">
        <template #body="{ data }">
          <ProgressBar :progress="data.progreso" />
        </template>
      </Column>

      <Column field="intentos" header="Intentos" sortable style="min-width: 80px; text-align: center">
        <template #body="{ data }">
          <span :class="{ 'max-retries': data.intentos >= 5 }">
            {{ data.intentos }}
          </span>
        </template>
      </Column>

      <Column field="fechaCreacion" header="Fecha" sortable>
        <template #body="{ data }">
          {{ formatFecha(data.fechaCreacion) }}
        </template>
      </Column>

      <Column header="Acciones">
        <template #body="{ data }">
          <div class="actions">
            <Button
              v-if="data.estado === 'FALLIDA'"
              icon="pi pi-refresh"
              @click="$emit('retry', data.id)"
              text
              rounded
              severity="warning"
              v-tooltip.top="'Reintentar'"
              aria-label="Reintentar"
            />
            <Button
              icon="pi pi-eye"
              @click="$emit('viewDetails', data.id)"
              text
              rounded
              severity="info"
              v-tooltip.top="'Ver detalles'"
              aria-label="Ver detalles"
            />
            <Button
              v-if="data.estado !== 'COMPLETADA' && data.estado !== 'CANCELADA'"
              icon="pi pi-times"
              class="p-button-danger p-button-sm"
              aria-label="Cancelar"
              @click="handleCancel(data.id)"
              v-tooltip.top="'Cancelar descarga'"
            />
          </div>
        </template>
      </Column>

      <template #empty>
        <div class="empty-state">
          <i class="pi pi-inbox"></i>
          <p>No hay descargas registradas</p>
          <span>Crea una nueva descarga para comenzar</span>
        </div>
      </template>
    </DataTable>
  </div>
</template>

<script setup lang="ts">
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Button from 'primevue/button';
import Tag from 'primevue/tag';
import ProgressBar from './ProgressBar.vue';
import DownloadStatus from './DownloadStatus.vue';
import { useToast } from 'primevue/usetoast';
import type { Download } from '../types';
import { formatFecha } from '../utils/formatters';
import { cancelDownload } from '../services/downloadService';

interface Props {
  downloads: Download[];
  loading?: boolean;
}

const props = defineProps<Props>();
const toast = useToast();

const emit = defineEmits<{
  (e: 'retry', id: string): void;
  (e: 'viewDetails', id: string): void;
  (e: 'cancel', id: string): void;
  (e: 'refresh'): void;
}>();

async function handleCancel(id: string): Promise<void> {
  try {
    await cancelDownload(id);
    toast.add({
      severity: 'success',
      summary: 'Descarga cancelada',
      detail: 'La descarga ha sido cancelada exitosamente',
      life: 3000,
    });
    emit('cancel', id);
  } catch (err: any) {
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: err.error || 'No se pudo cancelar la descarga',
      life: 5000,
    });
  }
}

function truncateId(id: string): string {
  return id.length > 8 ? `${id.slice(0, 8)}...` : id;
}

function truncateUrl(url: string): string {
  return url.length > 35 ? `${url.slice(0, 35)}...` : url;
}
</script>

<style scoped>
.download-list-card {
  background: var(--surface-card);
  border-radius: 1rem;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.list-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.list-header h2 {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.25rem;
  font-weight: 600;
}

.list-header h2 i {
  color: var(--primary-color);
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.badge {
  background: var(--primary-color);
  color: white;
  border-radius: 9999px;
  padding: 0.125rem 0.625rem;
  font-size: 0.875rem;
  font-weight: 600;
}

.id-cell, .url-cell {
  font-family: monospace;
  font-size: 0.875rem;
}

.tipo-tag {
  text-transform: uppercase;
  font-size: 0.75rem;
}

.max-retries {
  color: var(--red-500);
  font-weight: 700;
}

.actions {
  display: flex;
  gap: 0.25rem;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 3rem;
  color: var(--text-color-secondary);
}

.empty-state i {
  font-size: 3rem;
  margin-bottom: 1rem;
  opacity: 0.5;
}

.empty-state p {
  font-size: 1.125rem;
  font-weight: 500;
  margin-bottom: 0.5rem;
}

.empty-state span {
  font-size: 0.875rem;
}

:deep(.p-datatable .p-datatable-tbody > tr > td) {
  padding: 0.75rem 1rem;
}

:deep(.p-datatable .p-datatable-thead > tr > th) {
  padding: 0.75rem 1rem;
}

@media (max-width: 768px) {
  :deep(.p-datatable) {
    font-size: 0.875rem;
  }
}
</style>