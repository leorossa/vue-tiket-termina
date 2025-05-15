<template>
  <div class="admin-container">
    <h2 class="admin-section-title">Дашборд</h2>
    
    <!-- Карточки с основной статистикой -->
    <div class="admin-form-grid mb-4">
      <div class="admin-card">
        <h3 class="admin-card-title">Продажи за сегодня</h3>
        <div class="admin-stat-value">{{ stats.todaySales }} ₽</div>
        <div class="admin-stat-label">{{ stats.todayTickets }} билетов</div>
      </div>
      
      <div class="admin-card">
        <h3 class="admin-card-title">Продажи за неделю</h3>
        <div class="admin-stat-value">{{ stats.weeklySales }} ₽</div>
        <div class="admin-stat-label">{{ stats.weeklyTickets }} билетов</div>
      </div>
      
      <div class="admin-card">
        <h3 class="admin-card-title">Продажи за месяц</h3>
        <div class="admin-stat-value">{{ stats.monthlySales }} ₽</div>
        <div class="admin-stat-label">{{ stats.monthlyTickets }} билетов</div>
      </div>
      
      <div class="admin-card">
        <h3 class="admin-card-title">Всего услуг</h3>
        <div class="admin-stat-value">{{ stats.totalServices }}</div>
        <div class="admin-stat-label">{{ stats.activeServices }} активных</div>
      </div>
    </div>

    <!-- График продаж -->
    <div class="admin-card mb-4">
      <h3 class="admin-card-title">Динамика продаж</h3>
      <div class="admin-chart-container">
        <div class="admin-chart-placeholder">
          <!-- Здесь будет график продаж (в реальном приложении) -->
          <div class="admin-chart-bars">
            <div v-for="(value, index) in salesData" :key="index" 
                 class="admin-chart-bar" 
                 :style="{ height: `${value}%` }">
              <span class="admin-chart-value">{{ value }}%</span>
            </div>
          </div>
          <div class="admin-chart-labels">
            <div v-for="(day, index) in weekDays" :key="index" class="admin-chart-label">
              {{ day }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Последние продажи -->
    <div class="admin-card mb-4">
      <div class="d-flex justify-content-between align-items-center mb-3">
        <h3 class="admin-card-title">Последние продажи</h3>
        <router-link to="/admin/sales" class="admin-button secondary">
          Все продажи
        </router-link>
      </div>
      
      <div class="admin-table-responsive">
        <table class="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Дата</th>
              <th>Услуга</th>
              <th>Клиент</th>
              <th>Сумма</th>
              <th>Статус</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="sale in recentSales" :key="sale.id">
              <td>{{ sale.id }}</td>
              <td>{{ formatDate(sale.date) }}</td>
              <td>{{ sale.serviceName }}</td>
              <td>{{ sale.clientName }}</td>
              <td>{{ sale.amount }} ₽</td>
              <td>
                <div :class="['admin-badge', getStatusClass(sale.status)]">
                  {{ getStatusName(sale.status) }}
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Популярные услуги -->
    <div class="admin-card">
      <h3 class="admin-card-title">Популярные услуги</h3>
      
      <div class="admin-popular-services">
        <div v-for="service in popularServices" :key="service.id" class="admin-popular-service">
          <div class="admin-popular-service-name">{{ service.name }}</div>
          <div class="admin-popular-service-progress">
            <div class="admin-progress-bar" :style="{ width: `${service.percentage}%` }"></div>
          </div>
          <div class="admin-popular-service-stats">
            <span>{{ service.sales }} продаж</span>
            <span>{{ service.percentage }}%</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

// Статистика
const stats = ref({
  todaySales: '45 600',
  todayTickets: 89,
  weeklySales: '312 450',
  weeklyTickets: 623,
  monthlySales: '1 254 800',
  monthlyTickets: 2541,
  totalServices: 12,
  activeServices: 10
});

// Данные для графика продаж (в процентах)
const salesData = ref([30, 45, 60, 70, 55, 80, 65]);
const weekDays = ref(['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс']);

// Последние продажи
const recentSales = ref([
  {
    id: 1001,
    date: new Date(2025, 4, 15, 14, 30),
    serviceName: 'Входной билет в парк',
    clientName: 'Иванов И.И.',
    amount: 500,
    status: 'completed'
  },
  {
    id: 1000,
    date: new Date(2025, 4, 15, 14, 15),
    serviceName: 'Аттракцион "Американские горки"',
    clientName: 'Петров П.П.',
    amount: 300,
    status: 'completed'
  },
  {
    id: 999,
    date: new Date(2025, 4, 15, 13, 45),
    serviceName: 'Входной билет в парк',
    clientName: 'Сидоров С.С.',
    amount: 500,
    status: 'completed'
  },
  {
    id: 998,
    date: new Date(2025, 4, 15, 13, 30),
    serviceName: 'Комплексный билет',
    clientName: 'Козлов К.К.',
    amount: 1200,
    status: 'refunded'
  },
  {
    id: 997,
    date: new Date(2025, 4, 15, 13, 15),
    serviceName: 'Детская карусель',
    clientName: 'Николаев Н.Н.',
    amount: 200,
    status: 'completed'
  }
]);

// Популярные услуги
const popularServices = ref([
  {
    id: 1,
    name: 'Входной билет в парк',
    sales: 1250,
    percentage: 45
  },
  {
    id: 2,
    name: 'Аттракцион "Американские горки"',
    sales: 850,
    percentage: 30
  },
  {
    id: 3,
    name: 'Детская карусель',
    sales: 420,
    percentage: 15
  },
  {
    id: 4,
    name: 'Комплексный билет',
    sales: 280,
    percentage: 10
  }
]);

// Форматирование даты
function formatDate(date) {
  return new Intl.DateTimeFormat('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
}

// Получение класса для статуса
function getStatusClass(status) {
  const statusClasses = {
    completed: 'success',
    pending: 'warning',
    refunded: 'danger',
    cancelled: 'danger'
  };
  
  return statusClasses[status] || 'primary';
}

// Получение названия статуса
function getStatusName(status) {
  const statusNames = {
    completed: 'Выполнен',
    pending: 'В обработке',
    refunded: 'Возврат',
    cancelled: 'Отменен'
  };
  
  return statusNames[status] || status;
}

onMounted(() => {
  // В реальном приложении здесь будет загрузка данных с сервера
  console.log('Дашборд загружен');
});
</script>

<style>
.admin-card-title {
  font-size: 1.1rem;
  color: var(--admin-text-primary);
  margin-top: 0;
  margin-bottom: 1rem;
}

.admin-stat-value {
  font-size: 1.75rem;
  font-weight: 600;
  color: var(--admin-primary-color);
  margin-bottom: 0.25rem;
}

.admin-stat-label {
  color: var(--admin-text-secondary);
  font-size: 0.875rem;
}

.admin-chart-container {
  height: 300px;
  margin-top: 1rem;
}

.admin-chart-placeholder {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.admin-chart-bars {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  height: 250px;
  padding: 0 1rem;
}

.admin-chart-bar {
  width: 40px;
  background-color: var(--admin-primary-color);
  border-radius: 4px 4px 0 0;
  position: relative;
  margin: 0 0.5rem;
}

.admin-chart-value {
  position: absolute;
  top: -20px;
  left: 0;
  right: 0;
  text-align: center;
  font-size: 0.75rem;
  color: var(--admin-text-secondary);
}

.admin-chart-labels {
  display: flex;
  justify-content: space-between;
  padding: 0.5rem 1rem;
  margin-top: 0.5rem;
}

.admin-chart-label {
  width: 40px;
  text-align: center;
  font-size: 0.875rem;
  color: var(--admin-text-secondary);
  margin: 0 0.5rem;
}

.admin-popular-services {
  margin-top: 1rem;
}

.admin-popular-service {
  margin-bottom: 1rem;
}

.admin-popular-service-name {
  margin-bottom: 0.25rem;
  font-weight: 500;
}

.admin-popular-service-progress {
  height: 8px;
  background-color: var(--admin-bg-tertiary);
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 0.25rem;
}

.admin-progress-bar {
  height: 100%;
  background-color: var(--admin-primary-color);
  border-radius: 4px;
}

.admin-popular-service-stats {
  display: flex;
  justify-content: space-between;
  font-size: 0.75rem;
  color: var(--admin-text-secondary);
}
</style>
