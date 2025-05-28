<template>
  <div class="admin-layout">
    <aside class="admin-sidebar">
      <div class="admin-sidebar-header">
        <h2 class="admin-sidebar-title">
          {{ isRootUser ? 'Root-' : (hasAdminAccess ? 'Admin-' : 'User-') }}панель
        </h2>
      </div>
      <nav class="admin-sidebar-menu">
        <!-- Дашборд доступен всем -->
        <router-link to="/admin/dashboard" class="admin-sidebar-item">
          <i class="admin-sidebar-icon">📊</i>
          <span>Дашборд</span>
        </router-link>
        
        <!-- Услуги -->
        <router-link 
          v-if="hasPermission('CanManageServices')" 
          to="/admin/services" 
          class="admin-sidebar-item"
        >
          <i class="admin-sidebar-icon">🎟️</i>
          <span>Услуги</span>
        </router-link>
        
        <!-- Заказы -->
        <router-link 
          v-if="hasPermission('CanManageOrders') || isRootUser" 
          to="/admin/orders" 
          class="admin-sidebar-item"
        >
          <i class="admin-sidebar-icon">📋</i>
          <span>Заказы</span>
        </router-link>
        
        <!-- Категории посетителей -->
        <router-link 
          v-if="hasPermission('CanManageCategories')" 
          to="/admin/category-visitors" 
          class="admin-sidebar-item"
        >
          <i class="admin-sidebar-icon">👪</i>
          <span>Категории посетителей</span>
        </router-link>
        
        <!-- Объекты посещения -->
        <router-link 
          v-if="hasPermission('CanManageVisitObjects')" 
          to="/admin/visit-objects" 
          class="admin-sidebar-item"
        >
          <i class="admin-sidebar-icon">🏢</i>
          <span>Объекты посещения</span>
        </router-link>
        
        <!-- Пользователи -->
        <router-link 
          v-if="hasPermission('CanManageUsers')" 
          to="/admin/users" 
          class="admin-sidebar-item"
        >
          <i class="admin-sidebar-icon">👥</i>
          <span>Пользователи</span>
        </router-link>
        
        <!-- Настройки -->
        <router-link 
          v-if="hasPermission('CanManageSettings')" 
          to="/admin/settings" 
          class="admin-sidebar-item"
        >
          <i class="admin-sidebar-icon">⚙️</i>
          <span>Настройки</span>
        </router-link>
        
        <!-- Отчеты -->
        <router-link 
          v-if="hasPermission('CanViewReports')" 
          to="/admin/reports" 
          class="admin-sidebar-item"
        >
          <i class="admin-sidebar-icon">📈</i>
          <span>Отчеты</span>
        </router-link>
        
        <!-- Логи системы (только для root) -->
        <router-link 
          v-if="isRootUser" 
          to="/admin/logs" 
          class="admin-sidebar-item"
        >
          <i class="admin-sidebar-icon">📋</i>
          <span>Логи системы</span>
        </router-link>
      </nav>
    </aside>
    
    <main class="admin-main">
      <header class="admin-header">
        <div class="admin-header-content">
          <h1 class="admin-header-title">{{ pageTitle }}</h1>
          <div class="admin-terminal-info" v-if="terminalInfo.name || terminalInfo.location">
            <span class="admin-terminal-name terminal-highlight">{{ terminalInfo.name }}</span>
            <span v-if="terminalInfo.location" class="admin-terminal-location terminal-highlight">{{ terminalInfo.location }}</span>
          </div>
        </div>
        <div class="admin-user-menu">
          <div class="admin-user-info">
            <span class="admin-user-name">{{ currentUser.UserName || 'Неизвестный пользователь' }}</span>
            <span v-if="currentUser.Role" class="admin-user-role admin-badge primary">{{ getRoleName(currentUser.Role) }}</span>
            <span v-if="isRootUser" class="admin-user-role admin-badge root">Root</span>
          </div>
          <button class="admin-button secondary" @click="logout">Выйти</button>
        </div>
      </header>
      
      <div class="admin-content">
        <router-view />
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/authStore';
import { useUserStore } from '@/stores/userStore';

// Инициализация хранилищ
const authStore = useAuthStore();
const userStore = useUserStore();
const route = useRoute();
const router = useRouter();

// Получение текущего пользователя из хранилища
const currentUser = computed(() => {
  return userStore.currentUser || { UserName: 'Неизвестный пользователь', Role: '' };
});

// Проверка, является ли пользователь root-пользователем
const isRootUser = computed(() => userStore.hasRootAccess);

// Проверка, имеет ли пользователь права администратора
const hasAdminAccess = computed(() => {
  return currentUser.value && currentUser.value.Role === 'ADMIN';
});

// Функция проверки прав доступа
function hasPermission(permission) {
  return userStore.hasPermission(permission) || isRootUser.value;
}

// Определение заголовка страницы на основе текущего маршрута
const pageTitle = computed(() => {
  const routeTitles = {
    '/admin/dashboard': 'Дашборд',
    '/admin/services': 'Управление услугами',
    '/admin/orders': 'Управление заказами',
    '/admin/category-visitors': 'Управление категориями посетителей',
    '/admin/visit-objects': 'Управление объектами посещения',
    '/admin/users': 'Управление пользователями',
    '/admin/settings': 'Настройки системы',
    '/admin/reports': 'Отчеты',
    '/admin/logs': 'Логи системы'
  };
  
  return routeTitles[route.path] || 'Админ-панель';
});

// Функция выхода из системы
const logout = () => {
  // Выход из системы через хранилище аутентификации
  authStore.logout();
  console.log('Выход из системы');
  router.push('/login');
};

// Получение названия роли пользователя
const getRoleName = (role) => {
  const roleNames = {
    'ADMIN': 'Администратор',
    'MANAGER': 'Менеджер',
    'USER': 'Пользователь'
  };
  
  return roleNames[role] || role;
};

// Информация о терминале
const terminalInfo = ref({
  name: '',
  location: ''
});

// Загрузка информации о терминале
function loadTerminalInfo() {
  try {
    const savedSettings = localStorage.getItem('terminalSettings');
    if (savedSettings) {
      const settings = JSON.parse(savedSettings);
      terminalInfo.value = {
        name: settings.terminalName || '',
        location: settings.location || ''
      };
    }
  } catch (error) {
    console.error('Ошибка при загрузке информации о терминале:', error);
  }
}

// Загрузка данных при монтировании компонента
onMounted(async () => {
  try {
    // Проверка аутентификации
    const isAuthenticated = await authStore.checkAuth();
    
    if (isAuthenticated) {
      // Загрузка данных пользователя, включая права доступа
      await userStore.loadUserData();
    } else {
      // Если пользователь не авторизован, перенаправляем на страницу входа
      router.push('/login');
    }
    
    // Загрузка информации о терминале
    loadTerminalInfo();
  } catch (error) {
    console.error('Ошибка при инициализации компонента:', error);
    router.push('/login');
  }
});

// Прослушивание события обновления информации о терминале
window.addEventListener('storage', (event) => {
  if (event.key === 'terminalSettings') {
    loadTerminalInfo();
  }
});

// Создаем функцию для обновления настроек терминала, которая будет доступна глобально
window.updateTerminalSettings = () => {
  loadTerminalInfo();
};

// Прослушивание пользовательского события
window.addEventListener('terminalSettingsUpdated', () => {
  loadTerminalInfo();
});
</script>

<style scoped>
.admin-layout {
  display: flex;
  height: 100vh;
}

.admin-sidebar {
  width: 250px;
  background-color: var(--admin-bg-secondary, #f8f9fa);
  border-right: 1px solid var(--admin-border-color, #e2e8f0);
  display: flex;
  flex-direction: column;
}

.admin-sidebar-header {
  padding: 1.5rem 1rem;
  border-bottom: 1px solid var(--admin-border-color, #e2e8f0);
}

.admin-sidebar-title {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--admin-text-primary, #2d3748);
}

.admin-sidebar-menu {
  padding: 1rem 0;
  overflow-y: auto;
}

.admin-sidebar-item {
  display: flex;
  align-items: center;
  padding: 0.75rem 1rem;
  color: var(--admin-text-primary, #2d3748);
  text-decoration: none;
  transition: background-color 0.2s;
}

.admin-sidebar-item:hover {
  background-color: var(--admin-hover-bg, rgba(0, 0, 0, 0.05));
}

.admin-sidebar-item.router-link-active {
  background-color: var(--admin-active-bg, rgba(59, 130, 246, 0.1));
  color: var(--admin-primary, #3b82f6);
  font-weight: 500;
}

.admin-sidebar-icon {
  margin-right: 0.75rem;
  font-size: 1.25rem;
}

.admin-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.admin-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem;
  background-color: white;
  border-bottom: 1px solid var(--admin-border-color, #e2e8f0);
}

.admin-header-content {
  display: flex;
  align-items: center;
}

.admin-header-title {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--admin-text-primary, #2d3748);
}

.admin-terminal-info {
  margin-left: 1rem;
  display: flex;
  align-items: center;
}

.terminal-highlight {
  background-color: var(--admin-primary-light, rgba(59, 130, 246, 0.1));
  color: var(--admin-primary, #3b82f6);
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.875rem;
  font-weight: 500;
  margin-right: 0.5rem;
}

.admin-user-menu {
  display: flex;
  align-items: center;
}

.admin-user-info {
  margin-right: 1rem;
  display: flex;
  align-items: center;
}

.admin-user-name {
  font-weight: 500;
  margin-right: 0.5rem;
}

.admin-user-role {
  font-size: 0.75rem;
  margin-left: 0.5rem;
}

.admin-badge {
  display: inline-block;
  padding: 0.25em 0.6em;
  font-size: 0.75em;
  font-weight: 700;
  line-height: 1;
  text-align: center;
  white-space: nowrap;
  vertical-align: baseline;
  border-radius: 0.25rem;
}

.admin-badge.primary {
  background-color: var(--admin-primary, #3b82f6);
  color: white;
}

.admin-badge.root {
  background-color: #dc3545;
  color: white;
}

.admin-content {
  flex: 1;
  padding: 1.5rem;
  overflow-y: auto;
  background-color: var(--admin-bg-primary, #f1f5f9);
}

@media (max-width: 768px) {
  .admin-layout {
    flex-direction: column;
  }
  
  .admin-sidebar {
    width: 100%;
    height: auto;
  }
  
  .admin-sidebar-menu {
    display: flex;
    overflow-x: auto;
    padding: 0.5rem;
  }
  
  .admin-sidebar-item {
    padding: 0.5rem;
    white-space: nowrap;
  }
  
  .admin-header {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .admin-user-menu {
    margin-top: 1rem;
    width: 100%;
    justify-content: space-between;
  }
}
</style>
