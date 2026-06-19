<template>
  <div class="download-form-card">
    <h2 class="form-title">
      <i class="pi pi-cloud-download"></i>
      Nueva Descarga
    </h2>

    <form @submit.prevent="handleSubmit" class="form-grid">
      <!-- URL -->
      <div class="field-group">
        <label for="url">
          URL <span class="required">*</span>
        </label>
        <InputText
          id="url"
          v-model="form.url"
          type="url"
          placeholder="https://ejemplo.com/archivo.pdf"
          :class="{ 'p-invalid': errors.url }"
          @blur="touched.url = true"
          class="w-full"
        />
        <small v-if="errors.url" class="p-error">{{ errors.url }}</small>
      </div>

      <!-- Tipo -->
      <div class="field-group">
        <label for="tipo">
          Tipo <span class="required">*</span>
        </label>
        <Dropdown
          id="tipo"
          v-model="form.tipo"
          :options="tipoOptions"
          optionLabel="label"
          optionValue="value"
          placeholder="Seleccione tipo"
          :class="{ 'p-invalid': errors.tipo }"
          class="w-full"
        />
        <small v-if="errors.tipo" class="p-error">{{ errors.tipo }}</small>
      </div>

      <!-- Reintentos -->
      <div class="field-group">
        <label for="reintentos">
          Máx. Reintentos <span class="required">*</span>
        </label>
        <InputNumber
          id="reintentos"
          v-model="form.maxReintentos"
          :min="0"
          :max="5"
          showButtons
          :class="{ 'p-invalid': errors.maxReintentos }"
          class="w-full"
        />
        <small v-if="errors.maxReintentos" class="p-error">{{ errors.maxReintentos }}</small>
      </div>

      <!-- Submit -->
      <div class="field-group submit-group">
        <Button
          type="submit"
          label="Iniciar Descarga"
          icon="pi pi-play"
          :loading="loading"
          :disabled="!isValid || loading"
          class="w-full p-button-primary"
        />
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { reactive, computed } from 'vue';
import InputText from 'primevue/inputtext';
import Dropdown from 'primevue/dropdown';
import InputNumber from 'primevue/inputnumber';
import Button from 'primevue/button';
import type { DownloadFormData, TipoDescargador } from '../types';
import { validateDownloadForm } from '../utils/validators';

interface Props {
  onSubmit: (data: DownloadFormData) => void;
  loading?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
});

const tipoOptions = [
  { label: 'HTTP', value: 'http' as TipoDescargador },
  { label: 'FTP', value: 'ftp' as TipoDescargador },
  { label: 'Mock (Simulación)', value: 'mock' as TipoDescargador },
];

const form = reactive<DownloadFormData>({
  url: '',
  tipo: 'http',
  maxReintentos: 3,
});

const touched = reactive<Record<string, boolean>>({
  url: false,
  tipo: false,
  maxReintentos: false,
});

const errors = computed(() => {
  const result = validateDownloadForm(form);
  const visible: Record<string, string> = {};
  for (const [key, err] of Object.entries(result.errors)) {
    if (touched[key]) visible[key] = err;
  }
  return visible;
});

const isValid = computed(() => validateDownloadForm(form).valid);

function handleSubmit(): void {
  Object.keys(touched).forEach((k) => (touched[k] = true));
  if (!isValid.value) return;
  props.onSubmit({ ...form });
  // Reset parcial
  form.url = '';
  touched.url = false;
}
</script>

<style scoped>
.download-form-card {
  background: var(--surface-card);
  border-radius: 1rem;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.form-title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
  color: var(--text-color);
}

.form-title i {
  color: var(--primary-color);
}

.form-grid {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr auto;
  gap: 1rem;
  align-items: end;
}

.field-group {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.field-group label {
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--text-color-secondary);
}

.required {
  color: var(--red-500);
}

.submit-group {
  min-width: 160px;
}

.p-error {
  font-size: 0.75rem;
}

@media (max-width: 1024px) {
  .form-grid {
    grid-template-columns: 1fr 1fr;
  }
  .submit-group {
    grid-column: span 2;
  }
}

@media (max-width: 640px) {
  .form-grid {
    grid-template-columns: 1fr;
  }
  .submit-group {
    grid-column: span 1;
  }
}
</style>
