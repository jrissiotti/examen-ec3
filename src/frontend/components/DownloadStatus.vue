<template>
  <Tag
    :value="formattedStatus"
    :severity="severity"
    :icon="icon"
    class="status-tag"
  />
</template>

<script setup lang="ts">
import { computed } from 'vue';
import Tag from 'primevue/tag';
import type { EstadoDescarga } from '../types';
import { formatEstado, getEstadoSeverity } from '../utils/formatters';

interface Props {
  status: EstadoDescarga;
}

const props = defineProps<Props>();

const formattedStatus = computed(() => formatEstado(props.status));
const severity = computed(() => getEstadoSeverity(props.status));

const icon = computed(() => {
  const map: Record<EstadoDescarga, string> = {
    PENDIENTE: 'pi pi-clock',
    EN_PROGRESO: 'pi pi-spin pi-spinner',
    COMPLETADA: 'pi pi-check-circle',
    FALLIDA: 'pi pi-times-circle',
    REINTENTANDO: 'pi pi-refresh',
    CANCELADA: 'pi pi-ban',
  };
  return map[props.status] || 'pi pi-question-circle';
});
</script>

<style scoped>
.status-tag {
  font-size: 0.875rem;
  font-weight: 600;
  padding: 0.25rem 0.75rem;
}
</style>
