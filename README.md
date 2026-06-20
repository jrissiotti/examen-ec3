# EC3: Frontend UI y Testing - Simulador de Descargas Concurrentes

## 📋 Descripción

Implementación de interfaz de usuario (Vue 3 + TypeScript) y suite de tests (integración + E2E) para el sistema de simulador de descargas concurrentes.

## 🛠 Stack Técnico

| Capa | Tecnología |
|------|-----------|
| Framework | Vue 3 (Composition API) |
| Lenguaje | TypeScript (strict) |
| Build Tool | Vite |
| UI Framework | PrimeVue + PrimeFlex |
| Estado | Pinia + Composables |
| HTTP Client | Axios |
| Charts | Chart.js + vue-chartjs |
| Tests Integración | Vitest + jsdom |
| Tests E2E | Playwright |
| Mocking | MSW (Mock Service Worker) |

## 🚀 Instalación y Ejecución

### Prerrequisitos
- Node.js 18+
- Backend corriendo en `http://localhost:3000`

### 1. Instalar dependencias
```bash
npm install
```

### 2. Ejecutar frontend en desarrollo
```bash
npm run dev
# Abre http://localhost:5173
```

### 3. Ejecutar tests de integración (backend)
```bash
npm run test:integration
```

### 4. Ejecutar tests E2E
```bash
npm run test:e2e
# Modo UI interactivo
npm run test:e2e:ui
```

## 📁 Estructura del Proyecto

```
src/
├── frontend/           # Aplicación Vue 3
│   ├── components/     # Componentes reutilizables
│   ├── pages/          # Páginas principales
│   ├── services/       # Cliente HTTP y servicios API
│   ├── composables/    # Lógica reutilizable (hooks)
│   ├── types/          # Tipos TypeScript
│   ├── utils/          # Validadores y formateadores
│   ├── stores/         # Pinia stores
│   ├── __tests__/      # Tests
│   │   ├── integration/# Tests de integración backend
│   │   ├── e2e/       # Tests E2E Playwright
│   │   └── mocks/     # MSW handlers
│   ├── router/         # Vue Router
│   ├── App.vue         # Componente raíz
│   └── main.ts         # Punto de entrada
└── backend/            # Backend existente (EC2)
```

## 🧪 Estrategia de Testing

### Tests de Integración
- Validan que la API REST responde correctamente
- Cubren: creación, listado, estado, reintento, errores 4xx
- Se ejecutan contra el backend real

### Tests E2E (Playwright)
- Automatizan flujos completos del usuario
- Multi-navegador (Chromium, Firefox)
- Validaciones visuales y funcionales
- Manejo de async/polling

## 🔗 API Endpoints Consumidos

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | `/api/descargas` | Crear descarga |
| GET | `/api/descargas` | Listar descargas |
| GET | `/api/descargas/:id/estado` | Estado individual |
| POST | `/api/descargas/:id/reintentar` | Reintentar |

## 👥 Autores

- SIS-113 | Programación Orientada a Objetos
- Universidad Católica Boliviana
