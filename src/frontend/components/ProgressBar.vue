<template>
  <div class="progress-container">
    <ProgressBar
      :value="clampedProgress"
      :showValue="showLabel"
      :class="progressClass"
    />
    <span v-if="showLabel && clampedProgress < 100" class="progress-text">
      {{ clampedProgress }}%
    </span>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import ProgressBar from 'primevue/progressbar';

interface Props {
  progress: number;
  showLabel?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  showLabel: true,
});

const clampedProgress = computed(() => Math.min(100, Math.max(0, props.progress)));

const progressClass = computed(() => {
  if (clampedProgress.value >= 100) return 'progress-success';
  if (clampedProgress.value > 0) return 'progress-active';
  return 'progress-idle';
});
</script>

<style scoped>
.progress-container {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  min-width: 120px;
}

.progress-text {
  font-size: 0.875rem;
  color: var(--text-color-secondary);
  min-width: 2.5rem;
}

:deep(.p-progressbar) {
  height: 0.75rem;
  flex: 1;
  border-radius: 0.375rem;
  overflow: hidden;
}

:deep(.p-progressbar-value) {
  background: linear-gradient(90deg, var(--primary-color), var(--primary-400));
  transition: width 0.3s ease;
}

.progress-success :deep(.p-progressbar-value) {
  background: var(--green-500);
}

.progress-active :deep(.p-progressbar-value) {
  background: linear-gradient(90deg, var(--blue-500), var(--cyan-400));
}
</style>
