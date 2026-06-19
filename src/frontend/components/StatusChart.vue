<template>
  <div class="chart-card">
    <h3>
      <i class="pi pi-chart-pie"></i>
      Distribución de Estados
    </h3>
    <div class="chart-wrapper">
      <Doughnut
        v-if="chartData.labels.length > 0"
        :data="chartData"
        :options="chartOptions"
      />
      <div v-else class="empty-chart">
        <i class="pi pi-chart-pie"></i>
        <p>Sin datos para mostrar</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { Doughnut } from 'vue-chartjs';
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  CategoryScale,
} from 'chart.js';
import type { Download } from '../types';

ChartJS.register(Title, Tooltip, Legend, ArcElement, CategoryScale);

interface Props {
  downloads: Download[];
}

const props = defineProps<Props>();

const chartData = computed(() => {
  const estados = ['PENDIENTE', 'EN_PROGRESO', 'COMPLETADA', 'FALLIDA', 'REINTENTANDO', 'CANCELADA'];
  const counts = estados.map((estado) =>
    props.downloads.filter((d) => d.estado === estado).length
  );
  const labels = estados.map((e) => {
    const map: Record<string, string> = {
      PENDIENTE: 'Pendiente',
      EN_PROGRESO: 'En Progreso',
      COMPLETADA: 'Completada',
      FALLIDA: 'Fallida',
      REINTENTANDO: 'Reintentando',
      CANCELADA: 'Cancelada',
    };
    return map[e];
  });

  return {
    labels,
    datasets: [
      {
        label: 'Descargas',
        data: counts,
        backgroundColor: ['#9e9e9e', '#2196f3', '#4caf50', '#f44336', '#ff9800', '#607d8b'],
        borderWidth: 2,
        borderColor: '#ffffff',
      },
    ],
  };
});

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'bottom' as const,
      labels: {
        padding: 16,
        usePointStyle: true,
      },
    },
  },
};
</script>

<style scoped>
.chart-card {
  background: var(--surface-card);
  border-radius: 1rem;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.chart-card h3 {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.125rem;
  font-weight: 600;
  margin-bottom: 1rem;
}

.chart-card h3 i {
  color: var(--primary-color);
}

.chart-wrapper {
  height: 280px;
  position: relative;
}

.empty-chart {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: var(--text-color-secondary);
}

.empty-chart i {
  font-size: 3rem;
  opacity: 0.3;
  margin-bottom: 0.5rem;
}
</style>
