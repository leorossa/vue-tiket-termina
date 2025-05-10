<template>
  <div class="admin-container admin-dashboard-layout">
    <h1 class="admin-main-title">Панель управления</h1>

    <!-- Секция статуса и управления -->
    <div class="admin-card status-management-card">
      <h2 class="admin-section-title">Статус системы и управление</h2>
      <div class="api-mode-switcher">
        <span class="api-mode-label">Режим API:</span>
        <div class="api-mode-buttons">
          <button 
            @click="setApiMode('internal')" 
            :class="['admin-button', apiMode === 'internal' ? 'primary' : 'secondary']"
          >
            Внутренний
          </button>
          <button 
            @click="setApiMode('external')" 
            :class="['admin-button', apiMode === 'external' ? 'primary' : 'secondary']"
          >
            Внешний
          </button>
        </div>
      </div>
      <div class="system-stats">
        <p>Общая статистика системы (в разработке)...</p>
      </div>
    </div>

    <!-- Секция основных разделов навигации -->
    <div class="admin-card navigation-links-card">
      <h2 class="admin-section-title">Основные разделы</h2>
      <nav class="dashboard-navigation-grid">
        <router-link v-for="link in adminLinks" :key="link.path" :to="link.path" class="navigation-item-card">
          <div class="nav-item-icon">{{ link.icon }}</div>
          <h3 class="nav-item-title">{{ link.name }}</h3>
          <p class="nav-item-description">{{ link.description }}</p>
        </router-link>
      </nav>
    </div>

    <!-- Секция для новых инструментов -->
    <div class="admin-card new-tools-card">
      <h2 class="admin-section-title">Дополнительные инструменты</h2>
      <p>Место для нового элемента управления (в разработке)...</p>
    </div>

  </div>
</template>

<script setup>
import { ref } from 'vue';

const apiMode = ref('internal'); // 'internal' or 'external'

const setApiMode = (mode) => {
  apiMode.value = mode;
  // Здесь будет логика для фактического переключения режима API
  console.log(`API mode set to: ${mode}`);
};

const adminLinks = ref([
  {
    name: 'Услуги',
    path: '/services', 
    icon: '🛠️',
    description: 'Управление каталогом услуг и аттракционов.'
  },
  {
    name: 'Смены',
    path: '/shifts', 
    icon: '⏳',
    description: 'Открытие, закрытие и просмотр кассовых смен.'
  },
  {
    name: 'Заказы',
    path: '/orders', 
    icon: '🛒',
    description: 'Просмотр и управление заказами клиентов.'
  },
  {
    name: 'Отчеты',
    path: '/reports', 
    icon: '📊',
    description: 'Генерация и просмотр отчетов по продажам.'
  },
  {
    name: 'Настройки',
    path: '/settings', 
    icon: '⚙️',
    description: 'Конфигурация системных параметров терминала.'
  },
  {
    name: 'Запустить Терминал',
    path: '/terminal',
    icon: '🚀',
    description: 'Открыть интерфейс терминала для продажи билетов.'
  },
  {
    name: 'Выход',
    path: '/login', 
    icon: '🚪',
    description: 'Завершить сеанс и выйти из панели управления.'
  }
]);
</script>

<style scoped>
.admin-dashboard-layout {
  padding: 1.5em;
}

.admin-main-title {
  font-size: 1.8rem;
  color: var(--admin-text-primary, #1f2937);
  margin-bottom: 1em;
  text-align: center;
}

.admin-card {
  background-color: var(--admin-card-bg, #ffffff);
  border-radius: var(--admin-border-radius, 8px);
  padding: 1.5em;
  margin-bottom: 1.5em;
  box-shadow: var(--admin-card-shadow, 0 2px 4px rgba(0,0,0,0.05));
}

.admin-section-title {
  font-size: 1.3rem;
  color: var(--admin-text-secondary, #374151);
  padding-bottom: 0.5em;
  margin-top: 0; /* Remove default top margin */
  margin-bottom: 1em;
  border-bottom: 1px solid var(--admin-border-color, #e5e7eb);
}

/* Секция статуса и управления */
.status-management-card {
  /* Specific styles if any */
}

.api-mode-switcher {
  display: flex;
  align-items: center;
  gap: 1em;
  margin-bottom: 1em;
  flex-wrap: wrap;
}

.api-mode-label {
  font-weight: 500;
  color: var(--admin-text-secondary, #4b5563);
}

.api-mode-buttons .admin-button + .admin-button {
  margin-left: 0.5em;
}

.system-stats p {
  color: var(--admin-text-muted, #6b7280);
  font-style: italic;
}

/* Секция навигации */
.navigation-links-card {
  /* Specific styles if any */
}

.dashboard-navigation-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1em;
}

.navigation-item-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 1.2em;
  background-color: var(--admin-light-gray, #f9fafb);
  border-radius: var(--admin-border-radius-sm, 6px);
  border: 1px solid var(--admin-border-color, #e5e7eb);
  text-decoration: none;
  color: var(--admin-text-primary, #1f2937);
  transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
}

.navigation-item-card:hover,
.navigation-item-card.router-link-exact-active {
  transform: translateY(-3px);
  box-shadow: var(--admin-hover-shadow, 0 4px 10px rgba(0,0,0,0.1));
  border-color: var(--admin-primary-color, #3b82f6);
  background-color: #fff;
}

.nav-item-icon {
  font-size: 2rem; /* Bigger icons */
  margin-bottom: 0.5em;
  color: var(--admin-primary-color, #3b82f6);
}

.nav-item-title {
  font-size: 1.1rem;
  font-weight: 600;
  margin-top: 0;
  margin-bottom: 0.3em;
  color: var(--admin-text-primary, #1f2937);
}

.nav-item-description {
  font-size: 0.85rem;
  color: var(--admin-text-secondary, #4b5563);
  line-height: 1.4;
}

/* Секция для новых инструментов */
.new-tools-card p {
  color: var(--admin-text-muted, #6b7280);
  font-style: italic;
}
</style>
