/**
 * Router de Vue para la aplicación
 * @module router
 */

import { createRouter, createWebHistory } from 'vue-router';
import DashboardPage from '../pages/DashboardPage.vue';

const routes = [
  {
    path: '/',
    name: 'Dashboard',
    component: DashboardPage,
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/',
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
