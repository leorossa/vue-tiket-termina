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
  { path: '/terminal', name: 'TerminalHome', component: TerminalHome },
  { path: '/terminal/service/:id', name: 'TerminalService', component: TerminalService },
  { path: '/terminal/cart', name: 'TerminalCart', component: TerminalCart },
  { path: '/terminal/success', name: 'TerminalSuccess', component: TerminalSuccess },
  // Админка
  { path: '/login', name: 'AdminLogin', component: AdminLogin },
  { path: '/', name: 'AdminDashboard', component: AdminDashboard },
  { path: '/services', name: 'AdminServices', component: AdminServices },
  { path: '/shifts', name: 'AdminShifts', component: AdminShifts },
  { path: '/orders', name: 'AdminOrders', component: AdminOrders },
  { path: '/reports', name: 'AdminReports', component: AdminReports },
  { path: '/settings', name: 'AdminSettings', component: AdminSettings },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
