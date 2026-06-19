<template>
  <div v-if="hasError" class="error-boundary">
    <i class="pi pi-exclamation-triangle"></i>
    <h3>¡Ups! Algo salió mal</h3>
    <p>{{ errorMessage }}</p>
    <Button
      label="Reintentar"
      icon="pi pi-refresh"
      @click="resetError"
      severity="secondary"
    />
  </div>
  <slot v-else></slot>
</template>

<script setup lang="ts">
import { ref, onErrorCaptured } from 'vue';
import Button from 'primevue/button';

const hasError = ref(false);
const errorMessage = ref('');

onErrorCaptured((err) => {
  hasError.value = true;
  errorMessage.value = err instanceof Error ? err.message : 'Error desconocido';
  console.error('[ErrorBoundary]', err);
  return false;
});

function resetError(): void {
  hasError.value = false;
  errorMessage.value = '';
  window.location.reload();
}
</script>

<style scoped>
.error-boundary {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  text-align: center;
  color: var(--text-color-secondary);
}

.error-boundary i {
  font-size: 4rem;
  color: var(--red-500);
  margin-bottom: 1rem;
}

.error-boundary h3 {
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--text-color);
  margin-bottom: 0.5rem;
}

.error-boundary p {
  margin-bottom: 1.5rem;
  max-width: 400px;
}
</style>
