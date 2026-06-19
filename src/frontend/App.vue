<template>
  <ErrorBoundary>
    <Toast />
    <router-view v-slot="{ Component }">
      <transition name="fade" mode="out-in">
        <component :is="Component" />
      </transition>
    </router-view>
  </ErrorBoundary>
</template>

<script setup lang="ts">
import Toast from 'primevue/toast';
import ErrorBoundary from './components/ErrorBoundary.vue';
</script>

<style>
@import 'primevue/resources/themes/lara-light-blue/theme.css';
@import 'primevue/resources/primevue.min.css';
@import 'primeicons/primeicons.css';
@import 'primeflex/primeflex.css';

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  background: var(--surface-ground);
  color: var(--text-color);
  -webkit-font-smoothing: antialiased;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: var(--surface-100);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb {
  background: var(--surface-400);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: var(--surface-500);
}
</style>
