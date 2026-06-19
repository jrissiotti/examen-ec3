<template>
  <div class="dashboard">
    <!-- Header -->
    <header class="dashboard-header">
      <div class="brand">
        <i class="pi pi-cloud-download"></i>
        <h1>Simulador de Descargas Concurrentes</h1>
      </div>
      <div class="stats-bar">
        <div class="stat-item">
          <span class="stat-value">{{ stats.total }}</span>
          <span class="stat-label">Total</span>
        </div>
        <div class="stat-item pending">
          <span class="stat-value">{{ stats.pendientes }}</span>
          <span class="stat-label">Pendientes</span>
        </div>
        <div class="stat-item success">
          <span class="stat-value">{{ stats.completadas }}</span>
          <span class="stat-label">Completadas</span>
        </div>
        <div class="stat-item error">
          <span class="stat-value">{{ stats.fallidas }}</span>
          <span class="stat-label">Fallidas</span>
        </div>
      </div>
    </header>

    <!-- Toast para notificaciones -->
    <Toast position="top-right" />

    <!-- Formulario -->
    <section class="dashboard-section">
      <DownloadForm
        :onSubmit="handleCreate"
        :loading="loading"
      />
    </section>

    <!-- Gráficos: Donut + Línea lado a lado -->
    <section class="charts-section">
      <div class="charts-grid">
        <StatusChart :downloads="downloads" />
        <DownloadsByHourChart :downloads="downloads" />
      </div>
    </section>

    <!-- Tabla de descargas -->
    <section class="dashboard-section">
      <DownloadList
        :downloads="downloads"
        :loading="loading"
        @retry="handleRetry"
        @viewDetails="handleViewDetails"
        @refresh="fetchDownloads"
      />
    </section>

    <!-- Dialog de detalles -->
    <DownloadCard
      :download="selectedDownload"
      v-model:visible="detailsVisible"
      @retry="handleRetry(selectedDownload?.id || '')"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import Toast from 'primevue/toast';
import { useToast } from 'primevue/usetoast';
import DownloadForm from '../components/DownloadForm.vue';
import DownloadList from '../components/DownloadList.vue';
import DownloadCard from '../components/DownloadCard.vue';
import StatusChart from '../components/StatusChart.vue';
import DownloadsByHourChart from '../components/DownloadsByHourChart.vue';
import { useDownloads } from '../composables/useDownloads';
import type { DownloadFormData, Download } from '../types';

const toast = useToast();
const { downloads, loading, stats, fetchDownloads, addDownload, retry } = useDownloads();

const selectedDownload = ref<Download | null>(null);
const detailsVisible = ref(false);

async function handleCreate(data: DownloadFormData): Promise<void> {
  try {
    await addDownload(data);
    toast.add({
      severity: 'success',
      summary: 'Descarga creada',
      detail: `Se inició la descarga de ${data.url}`,
      life: 3000,
    });
  } catch (err: any) {
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: err.error || 'No se pudo crear la descarga',
      life: 5000,
    });
  }
}

async function handleRetry(id: string): Promise<void> {
  try {
    await retry(id);
    toast.add({
      severity: 'info',
      summary: 'Reintentando',
      detail: 'La descarga se ha reencolado',
      life: 3000,
    });
    detailsVisible.value = false;
  } catch (err: any) {
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: err.error || 'No se pudo reintentar',
      life: 5000,
    });
  }
}

function handleViewDetails(id: string): void {
  selectedDownload.value = downloads.value.find((d) => d.id === id) || null;
  detailsVisible.value = true;
}
</script>

<style scoped>
.dashboard {
  max-width: 1400px;
  margin: 0 auto;
  padding: 1.5rem;
  min-height: 100vh;
  background: var(--surface-ground);
}

.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid var(--surface-200);
}

.brand {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.brand i {
  font-size: 2rem;
  color: var(--primary-color);
}

.brand h1 {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--text-color);
}

.stats-bar {
  display: flex;
  gap: 1.5rem;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0.5rem 1rem;
  background: var(--surface-card);
  border-radius: 0.75rem;
  min-width: 80px;
}

.stat-value {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--text-color);
}

.stat-label {
  font-size: 0.75rem;
  color: var(--text-color-secondary);
  text-transform: uppercase;
}

.stat-item.pending .stat-value { color: var(--blue-500); }
.stat-item.success .stat-value { color: var(--green-500); }
.stat-item.error .stat-value { color: var(--red-500); }

.dashboard-section {
  margin-bottom: 1.5rem;
}

/* Sección de gráficos */
.charts-section {
  margin-bottom: 1.5rem;
}

.charts-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
}

@media (max-width: 1024px) {
  .charts-grid {
    grid-template-columns: 1fr;
  }

  .dashboard-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .stats-bar {
    width: 100%;
    justify-content: space-around;
  }
}

@media (max-width: 640px) {
  .dashboard {
    padding: 0.75rem;
  }

  .brand h1 {
    font-size: 1.125rem;
  }

  .stats-bar {
    gap: 0.5rem;
  }

  .stat-item {
    min-width: 60px;
    padding: 0.375rem 0.5rem;
  }
}
</style>