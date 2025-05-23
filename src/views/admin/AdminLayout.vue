<template>
  <div class="admin-layout">
    <aside class="admin-sidebar">
      <div class="admin-sidebar-header">
        <h2 class="admin-sidebar-title">Админ-панель</h2>
      </div>
      <nav class="admin-sidebar-menu">
        <router-link to="/admin/dashboard" class="admin-sidebar-item">
          <i class="admin-sidebar-icon">📊</i>
          <span>Дашборд</span>
        </router-link>
        <router-link to="/admin/services" class="admin-sidebar-item">
          <i class="admin-sidebar-icon">🎫</i>
          <span>Услуги</span>
        </router-link>
        <router-link to="/admin/category-visitors" class="admin-sidebar-item">
          <i class="admin-sidebar-icon">👪</i>
          <span>Категории посетителей</span>
        </router-link>
        <router-link to="/admin/visit-objects" class="admin-sidebar-item">
          <i class="admin-sidebar-icon">🏢</i>
          <span>Объекты посещения</span>
        </router-link>
        <router-link to="/admin/users" class="admin-sidebar-item">
          <i class="admin-sidebar-icon">👥</i>
          <span>Пользователи</span>
        </router-link>
        <router-link to="/admin/settings" class="admin-sidebar-item">
          <i class="admin-sidebar-icon">⚙️</i>
          <span>Настройки</span>
        </router-link>
        <!-- Ссылка на логи системы, видна только администраторам -->
        <router-link 
          v-if="isAdmin" 
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
            <span class="admin-user-name">{{ currentUser.username }}</span>
            <span v-if="currentUser.role" class="admin-user-role admin-badge primary">{{ getRoleName(currentUser.role) }}</span>
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

// Инициализация хранилища аутентификации
const authStore = useAuthStore();
const route = useRoute();
const router = useRouter();

// Получение текущего пользователя из хранилища
const currentUser = computed(() => {
  return authStore.currentUser || { username: 'Неизвестный пользователь', role: '' };
});

// Проверка, является ли пользователь администратором
const isAdmin = computed(() => {
  const role = currentUser.value.role;
  return role === 'admin' || role === 'root';
});

// Определение заголовка страницы на основе текущего маршрута
const pageTitle = computed(() => {
  const routeTitles = {
    '/admin/dashboard': 'Дашборд',
    '/admin/services': 'Управление услугами',
    '/admin/category-visitors': 'Управление категориями посетителей',
    '/admin/visit-objects': 'Управление объектами посещения',
    '/admin/users': 'Управление пользователями',
    '/admin/settings': 'Настройки системы',
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
    'admin': 'Администратор',
    'manager': 'Менеджер',
    'cashier': 'Кассир'
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
onMounted(() => {
  // Проверка аутентификации
  authStore.checkAuth();
  
  // Загрузка информации о терминале
  loadTerminalInfo();
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
  flex: 1;
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
  background-color: var(--admin-bg-hover, #edf2f7);
}

.admin-sidebar-item.router-link-active {
  background-color: var(--admin-primary-light, #ebf4ff);
  color: var(--admin-primary, #3b82f6);
  font-weight: 500;
}

.admin-sidebar-icon {
  margin-right: 0.75rem;
  font-style: normal;
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
  border-bottom: 1px solid var(--admin-border-color, #e2e8f0);
  background-color: #fff;
}

.admin-header-content {
  display: flex;
  flex-direction: column;
}

.admin-header-title {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--admin-text-primary, #2d3748);
}

.admin-terminal-info {
  display: flex;
  margin-top: 0.5rem;
  font-size: 0.875rem;
  color: var(--admin-text-secondary, #718096);
}

.terminal-highlight {
  color: var(--admin-danger, #e53e3e);
  font-weight: 600;
}

.admin-terminal-name {
  font-weight: 500;
  margin-right: 0.5rem;
}

.admin-terminal-name::after {
  content: '•';
  margin-left: 0.5rem;
}

.admin-user-menu {
  display: flex;
  align-items: center;
}

.admin-user-info {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  margin-right: 1rem;
}

.admin-user-name {
  font-weight: 500;
  color: var(--admin-text-primary, #2d3748);
}

.admin-user-role {
  margin-top: 0.25rem;
  font-size: 0.75rem;
}

.admin-content {
  flex: 1;
  padding: 1.5rem;
  overflow-y: auto;
  background-color: var(--admin-bg-primary, #f1f5f9);
}
</style>
