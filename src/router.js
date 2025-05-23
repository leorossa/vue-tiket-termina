import { createRouter, createWebHistory } from 'vue-router';

// Импорт компонентов админ-панели
import AdminLayout from '@/views/admin/AdminLayout.vue';
import ServicesManagement from '@/views/admin/ServicesManagement.vue';
import UsersManagement from '@/views/admin/UsersManagement.vue';
import Dashboard from '@/views/admin/Dashboard.vue';
import Settings from '@/views/admin/Settings.vue';
import CategoryVisitorManagement from '@/views/admin/CategoryVisitorManagement.vue';
import VisitObjectManagement from '@/views/admin/VisitObjectManagement.vue';
import LogsManagement from '@/views/admin/LogsManagement.vue';
import Login from '@/views/Login.vue';

// Импорт хранилища аутентификации
import { useAuthStore } from '@/stores/authStore';

// Определение маршрутов
const routes = [
  // Маршрут для страницы входа
  {
    path: '/login',
    name: 'login',
    component: Login,
    meta: { requiresAuth: false }
  },
  
  // Маршруты админ-панели
  {
    path: '/admin',
    component: AdminLayout,
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        redirect: '/admin/dashboard'
      },
      {
        path: 'dashboard',
        name: 'admin-dashboard',
        component: Dashboard,
        meta: { requiresAuth: true }
      },
      {
        path: 'services',
        name: 'admin-services',
        component: ServicesManagement,
        meta: { requiresAuth: true }
      },
      {
        path: 'users',
        name: 'admin-users',
        component: UsersManagement,
        meta: { requiresAuth: true }
      },
      {
        path: 'settings',
        name: 'admin-settings',
        component: Settings,
        meta: { requiresAuth: true }
      },
      {
        path: 'category-visitors',
        name: 'admin-category-visitors',
        component: CategoryVisitorManagement,
        meta: { requiresAuth: true }
      },
      {
        path: 'visit-objects',
        name: 'admin-visit-objects',
        component: VisitObjectManagement,
        meta: { requiresAuth: true }
      },
      {
        path: 'logs',
        name: 'admin-logs',
        component: LogsManagement,
        meta: { requiresAuth: true, requiresAdminRole: true }
      }
      // Здесь будут другие маршруты админ-панели
    ]
  },
  // Перенаправление на админ-панель по умолчанию
  {
    path: '/',
    redirect: '/admin'
  },
  
  // Перенаправление на страницу входа для всех несуществующих маршрутов
  {
    path: '/:pathMatch(.*)*',
    redirect: '/login'
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Защита маршрутов с проверкой аутентификации
router.beforeEach(async (to, from, next) => {
  // Проверяем, требуется ли аутентификация для маршрута
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  
  if (requiresAuth) {
    // Получаем хранилище аутентификации
    const authStore = useAuthStore();
    
    // Проверяем состояние аутентификации
    const isAuthenticated = await authStore.checkAuth();
    
    if (isAuthenticated) {
      // Если пользователь авторизован, пропускаем его
      next();
    } else {
      // Если не авторизован, перенаправляем на страницу входа
      next({ path: '/login', query: { redirect: to.fullPath } });
    }
  } else {
    // Если маршрут не требует аутентификации, пропускаем
    next();
  }
});

export default router;
