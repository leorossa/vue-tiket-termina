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
        <router-link to="/admin/users" class="admin-sidebar-item">
          <i class="admin-sidebar-icon">👥</i>
          <span>Пользователи</span>
        </router-link>
        <router-link to="/admin/settings" class="admin-sidebar-item">
          <i class="admin-sidebar-icon">⚙️</i>
          <span>Настройки</span>
        </router-link>
      </nav>
    </aside>
    
    <main class="admin-main">
      <header class="admin-header">
        <h1 class="admin-header-title">{{ pageTitle }}</h1>
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
import { ref, computed, watch } from 'vue';
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

// Определение заголовка страницы на основе текущего маршрута
const pageTitle = computed(() => {
  const routeTitles = {
    '/admin/dashboard': 'Дашборд',
    '/admin/services': 'Управление услугами',
    '/admin/users': 'Управление пользователями',
    '/admin/settings': 'Настройки системы'
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

// Проверка аутентификации при загрузке компонента
authStore.checkAuth();
</script>
