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
import OrdersManagement from '@/views/admin/OrdersManagement.vue';
import Login from '@/views/Login.vue';

// Импорт хранилищ
import { useAuthStore } from '@/stores/authStore';
import { useUserStore } from '@/stores/userStore';

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
        meta: { 
          requiresAuth: true,
          requiredPermission: 'CanManageServices'
        }
      },
      {
        path: 'users',
        name: 'admin-users',
        component: UsersManagement,
        meta: { 
          requiresAuth: true,
          requiredPermission: 'CanManageUsers'
        }
      },
      {
        path: 'settings',
        name: 'admin-settings',
        component: Settings,
        meta: { 
          requiresAuth: true,
          requiredPermission: 'CanManageSettings'
        }
      },
      {
        path: 'category-visitors',
        name: 'admin-category-visitors',
        component: CategoryVisitorManagement,
        meta: { 
          requiresAuth: true,
          requiredPermission: 'CanManageCategories'
        }
      },
      {
        path: 'visit-objects',
        name: 'admin-visit-objects',
        component: VisitObjectManagement,
        meta: { 
          requiresAuth: true,
          requiredPermission: 'CanManageVisitObjects'
        }
      },
      {
        path: 'reports',
        name: 'admin-reports',
        component: () => import('@/views/admin/Reports.vue'),
        meta: { 
          requiresAuth: true,
          requiredPermission: 'CanViewReports'
        }
      },
      {
        path: 'logs',
        name: 'admin-logs',
        component: LogsManagement,
        meta: { 
          requiresAuth: true,
          requiresRoot: true // Только для root-пользователей
        }
      },
      {
        path: 'orders',
        name: 'admin-orders',
        component: OrdersManagement,
        meta: { 
          requiresAuth: true,
          requiredPermission: 'CanManageOrders'
        }
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

// Защита маршрутов с проверкой аутентификации и прав доступа
router.beforeEach(async (to, from, next) => {
  // Проверяем, требуется ли аутентификация для маршрута
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  
  if (requiresAuth) {
    // Получаем хранилища
    const authStore = useAuthStore();
    const userStore = useUserStore();
    
    // Проверяем состояние аутентификации
    const isAuthenticated = await authStore.checkAuth();
    
    if (isAuthenticated) {
      // Загружаем данные пользователя, если еще не загружены
      if (!userStore.currentUser) {
        await userStore.loadUserData();
      }
      
      // Проверяем, требуется ли root-доступ для маршрута
      const requiresRoot = to.matched.some(record => record.meta.requiresRoot);
      if (requiresRoot && !userStore.hasRootAccess) {
        // Если требуется root-доступ, но пользователь не root, перенаправляем на дашборд
        console.warn('Доступ запрещен: требуется root-доступ');
        next({ path: '/admin/dashboard' });
        return;
      }
      
      // Проверяем, требуется ли определенное разрешение для маршрута
      const routeWithPermission = to.matched.find(record => record.meta.requiredPermission);
      if (routeWithPermission) {
        const requiredPermission = routeWithPermission.meta.requiredPermission;
        
        // Проверяем, есть ли у пользователя необходимое разрешение
        if (!userStore.hasPermission(requiredPermission) && !userStore.hasRootAccess) {
          console.warn(`Доступ запрещен: требуется разрешение ${requiredPermission}`);
          next({ path: '/admin/dashboard' });
          return;
        }
      }
      
      // Если все проверки пройдены, пропускаем пользователя
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
