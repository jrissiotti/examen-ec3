<template>
  <div class="chart-card">
    <h3>
      <i class="pi pi-chart-line"></i>
      Descargas Completadas por Hora
    </h3>
    <div class="chart-wrapper">
      <Line
        v-if="chartData.labels.length > 0"
        :data="chartData"
        :options="chartOptions"
      />
      <div v-else class="empty-chart">
        <i class="pi pi-chart-line"></i>
        <p>Sin datos para mostrar</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { Line } from 'vue-chartjs';
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Filler,
} from 'chart.js';
import type { Download } from '../types';

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Filler
);

interface Props {
  downloads: Download[];
}

const props = defineProps<Props>();

/**
 * Agrupa las descargas completadas por hora del día actual.
 * Genera un array con 24 slots (00:00 a 23:00).
 */
const chartData = computed(() => {
  const hoy = new Date();
  const fechaHoy = hoy.toISOString().split('T')[0];

  // Inicializar contadores para cada hora (0-23)
  const counts = new Array(24).fill(0);

  props.downloads.forEach((d) => {
    if (d.estado !== 'COMPLETADA' || !d.fechaCreacion) return;

    const fecha = new Date(d.fechaCreacion);
    const fechaDescarga = fecha.toISOString().split('T')[0];

    // Solo contar descargas de hoy
    if (fechaDescarga === fechaHoy) {
      const hora = fecha.getHours();
      counts[hora]++;
    }
  });

  // Generar labels de horas (00:00, 01:00, ..., 23:00)
  const labels = Array.from({ length: 24 }, (_, i) =>
    `${i.toString().padStart(2, '0')}:00`
  );

  return {
    labels,
    datasets: [
      {
        label: 'Descargas Completadas',
        data: counts,
        borderColor: '#4caf50',
        backgroundColor: 'rgba(76, 175, 80, 0.15)',
        borderWidth: 2,
        pointBackgroundColor: '#4caf50',
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
        tension: 0.4,
        fill: true,
      },
    ],
  };
});

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: true,
      position: 'bottom' as const,
      labels: {
        padding: 16,
        usePointStyle: true,
      },
    },
    tooltip: {
      mode: 'index' as const,
      intersect: false,
      callbacks: {
        title: (items: any[]) => {
          return `Hora: ${items[0].label}`;
        },
        label: (item: any) => {
          return `${item.raw} descarga${item.raw !== 1 ? 's' : ''} completada${item.raw !== 1 ? 's' : ''}`;
        },
      },
    },
  },
  scales: {
    x: {
      grid: {
        display: false,
      },
      ticks: {
        maxTicksLimit: 12,
        maxRotation: 0,
      },
    },
    y: {
      beginAtZero: true,
      ticks: {
        stepSize: 1,
        precision: 0,
      },
      grid: {
        color: 'rgba(0, 0, 0, 0.05)',
      },
    },
  },
  interaction: {
    mode: 'nearest' as const,
    axis: 'x' as const,
    intersect: false,
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