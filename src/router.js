import { createRouter, createWebHistory } from 'vue-router';
import TerminalHome from './views/TerminalHome.vue';
import TerminalService from './views/TerminalService.vue';
import TerminalCart from './views/TerminalCart.vue';
import TerminalSuccess from './views/TerminalSuccess.vue';
import AdminLogin from './views/AdminLogin.vue';
import AdminDashboard from './views/AdminDashboard.vue';
import AdminServices from './views/AdminServices.vue';
import AdminOrders from './views/AdminOrders.vue';
import AdminReports from './views/AdminReports.vue';
import AdminSettings from './views/AdminSettings.vue';
import AdminShifts from './views/AdminShifts.vue';

const routes = [
  // Терминал
  { path: '/', name: 'TerminalHome', component: TerminalHome },
  { path: '/service/:id', name: 'TerminalService', component: TerminalService },
  { path: '/cart', name: 'TerminalCart', component: TerminalCart },
  { path: '/success', name: 'TerminalSuccess', component: TerminalSuccess },
  // Админка
  { path: '/admin/login', name: 'AdminLogin', component: AdminLogin },
  { path: '/admin', name: 'AdminDashboard', component: AdminDashboard },
  { path: '/admin/services', name: 'AdminServices', component: AdminServices },
  { path: '/admin/shifts', name: 'AdminShifts', component: AdminShifts },
  { path: '/admin/orders', name: 'AdminOrders', component: AdminOrders },
  { path: '/admin/reports', name: 'AdminReports', component: AdminReports },
  { path: '/admin/settings', name: 'AdminSettings', component: AdminSettings },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
