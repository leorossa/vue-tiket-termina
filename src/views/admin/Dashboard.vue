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
        <router-link to="/admin/orders" class="admin-button secondary">
          Все заказы
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
import { ref, computed, onMounted } from 'vue';
import { useOrderStore } from '@/stores/orderStore';
import { getOrdersByDateRange } from '@/api/orderApi';

// Инициализация хранилища заказов
const orderStore = useOrderStore();

// Состояние загрузки
const loading = ref(false);
const error = ref(null);

// Статистика
const stats = ref({
  todaySales: '0',
  todayTickets: 0,
  weeklySales: '0',
  weeklyTickets: 0,
  monthlySales: '0',
  monthlyTickets: 0,
  totalServices: 0,
  activeServices: 0
});

// Данные для графика продаж (в процентах)
const salesData = ref([0, 0, 0, 0, 0, 0, 0]);
const weekDays = ref(['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс']);

// Последние продажи
const recentSales = ref([]);

// Преобразование данных заказов для отображения в таблице
const formatOrdersForDisplay = (orders, parseDate) => {
  return orders.map(order => {
    // Используем дату посещения из первой услуги, если она есть
    let date = new Date();
    if (order.Service && order.Service.length > 0 && order.Service[0].DtVisit) {
      date = parseDate(order.Service[0].DtVisit);
    }
    
    // Формируем имя клиента из доступных полей
    let clientName = order.VisitorName1 || 'Неизвестный клиент';
    if (order.VisitorName2) {
      clientName += ` / ${order.VisitorName2}`;
    }
    
    return {
      id: order.OrderId,
      date: date,
      serviceName: order.Service && order.Service.length > 0 ? order.Service[0].ServiceName : 'Неизвестная услуга',
      clientName: clientName,
      amount: order.Cost,
      status: mapOrderStatusToDisplay(order.OrderStateId)
    };
  });
};

// Преобразование статуса заказа в формат для отображения
const mapOrderStatusToDisplay = (statusId) => {
  const statusMap = {
    0: 'pending',   // Новый
    1: 'completed', // Оплачен
    2: 'cancelled', // Отменен
    3: 'refunded',  // Возвращен
    4: 'completed'  // Использован
  };
  
  return statusMap[statusId] || 'pending';
};

// Популярные услуги
const popularServices = ref([]);

// Функция для расчета популярных услуг на основе заказов
const calculatePopularServices = (orders) => {
  // Создаем объект для подсчета количества продаж каждой услуги
  const serviceCounts = {};
  let totalSales = 0;
  
  // Проходим по всем заказам и их услугам
  orders.forEach(order => {
    if (order.Service && order.Service.length > 0) {
      order.Service.forEach(service => {
        const serviceId = service.ServiceId;
        const serviceName = service.ServiceName;
        const serviceCount = service.ServiceCount || 1;
        
        if (!serviceCounts[serviceId]) {
          serviceCounts[serviceId] = {
            id: serviceId,
            name: serviceName,
            sales: 0
          };
        }
        
        serviceCounts[serviceId].sales += serviceCount;
        totalSales += serviceCount;
      });
    }
  });
  
  // Преобразуем объект в массив и сортируем по количеству продаж
  const servicesArray = Object.values(serviceCounts).sort((a, b) => b.sales - a.sales);
  
  // Вычисляем процент для каждой услуги и берем только топ-4
  return servicesArray.slice(0, 4).map(service => ({
    ...service,
    percentage: totalSales > 0 ? Math.round((service.sales / totalSales) * 100) : 0
  }));
};

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

// Загрузка данных о заказах
async function loadOrderData() {
  loading.value = true;
  error.value = null;
  
  try {
    // Получаем текущую дату
    const today = new Date();
    
    // Получаем дату месяц назад
    const monthAgo = new Date();
    monthAgo.setMonth(monthAgo.getMonth() - 1);
    
    // Форматируем даты для API в формате YYYY-MM-DD
    const formatDate = (date) => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    };
    
    const dtEnd = formatDate(today);
    const dtBegin = formatDate(monthAgo);
    
    // Загружаем заказы за последний месяц
    const response = await getOrdersByDateRange(dtBegin, dtEnd);
    const orders = response.Order || [];
    
    console.log('Загружены заказы:', orders);
    
    // Обновляем данные в хранилище
    orderStore.orders = orders;
    
    // Обрабатываем полученные данные
    processOrderData(orders);
  } catch (err) {
    console.error('Ошибка при загрузке данных о заказах:', err);
    error.value = 'Не удалось загрузить данные о заказах';
  } finally {
    loading.value = false;
  }
}

// Обработка данных о заказах
function processOrderData(orders) {
  if (!orders || orders.length === 0) return;
  
  console.log('Обрабатываем заказы:', orders);
  
  // Получаем текущую дату
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  // Получаем дату неделю назад
  const weekAgo = new Date(today);
  weekAgo.setDate(weekAgo.getDate() - 7);
  
  // Получаем дату месяц назад
  const monthAgo = new Date(today);
  monthAgo.setMonth(monthAgo.getMonth() - 1);
  
  // Функция для преобразования строки даты в объект Date
  const parseDate = (dateString) => {
    // Проверяем формат даты (YYYY-MM-DD HH:MM)
    if (typeof dateString !== 'string') return new Date();
    
    const parts = dateString.split(' ');
    if (parts.length !== 2) return new Date();
    
    const dateParts = parts[0].split('-');
    const timeParts = parts[1].split(':');
    
    if (dateParts.length !== 3 || timeParts.length !== 2) return new Date();
    
    const year = parseInt(dateParts[0]);
    const month = parseInt(dateParts[1]) - 1; // Месяцы в JavaScript начинаются с 0
    const day = parseInt(dateParts[2]);
    const hour = parseInt(timeParts[0]);
    const minute = parseInt(timeParts[1]);
    
    return new Date(year, month, day, hour, minute);
  };
  
  // Фильтруем заказы по датам
  const todayOrders = orders.filter(order => {
    if (!order.Service || order.Service.length === 0) return false;
    const visitDate = parseDate(order.Service[0].DtVisit);
    return visitDate >= today;
  });
  
  const weekOrders = orders.filter(order => {
    if (!order.Service || order.Service.length === 0) return false;
    const visitDate = parseDate(order.Service[0].DtVisit);
    return visitDate >= weekAgo;
  });
  
  const monthOrders = orders; // Все заказы за месяц
  
  // Рассчитываем статистику
  const todaySalesAmount = todayOrders.reduce((sum, order) => sum + order.Cost, 0);
  const weeklySalesAmount = weekOrders.reduce((sum, order) => sum + order.Cost, 0);
  const monthlySalesAmount = monthOrders.reduce((sum, order) => sum + order.Cost, 0);
  
  // Обновляем статистику
  stats.value = {
    todaySales: formatCurrency(todaySalesAmount),
    todayTickets: todayOrders.length,
    weeklySales: formatCurrency(weeklySalesAmount),
    weeklyTickets: weekOrders.length,
    monthlySales: formatCurrency(monthlySalesAmount),
    monthlyTickets: monthOrders.length,
    totalServices: calculateTotalServices(orders),
    activeServices: calculateActiveServices(orders)
  };
  
  // Обновляем данные для графика продаж
  updateSalesChart(orders, parseDate);
  
  // Обновляем список последних продаж
  recentSales.value = formatOrdersForDisplay(orders.slice(0, 5), parseDate);
  
  // Обновляем список популярных услуг
  popularServices.value = calculatePopularServices(orders);
}

// Рассчитываем общее количество уникальных услуг
function calculateTotalServices(orders) {
  const uniqueServices = new Set();
  
  orders.forEach(order => {
    if (order.Service && order.Service.length > 0) {
      order.Service.forEach(service => {
        uniqueServices.add(service.ServiceId);
      });
    }
  });
  
  return uniqueServices.size;
}

// Рассчитываем количество активных услуг (не отмененных)
function calculateActiveServices(orders) {
  const activeServices = new Set();
  
  orders.forEach(order => {
    if (order.Service && order.Service.length > 0) {
      order.Service.forEach(service => {
        // Если услуга не отменена (нет даты отмены)
        if (!service.dtDrop) {
          activeServices.add(service.ServiceId);
        }
      });
    }
  });
  
  return activeServices.size;
}

// Обновляем данные для графика продаж
function updateSalesChart(orders, parseDate) {
  // Получаем текущую дату
  const today = new Date();
  
  // Определяем день недели (0 - воскресенье, 1 - понедельник, ...)
  const currentDayOfWeek = today.getDay();
  
  // Создаем массив с данными продаж за каждый день недели
  const salesByDay = [0, 0, 0, 0, 0, 0, 0];
  
  // Проходим по всем заказам
  orders.forEach(order => {
    if (!order.Service || order.Service.length === 0 || !order.Service[0].DtVisit) return;
    
    // Используем функцию parseDate для корректного преобразования даты
    const visitDate = parseDate(order.Service[0].DtVisit);
    const dayOfWeek = visitDate.getDay();
    
    // Проверяем, что дата посещения находится в пределах текущей недели
    const dayDiff = Math.floor((today - visitDate) / (1000 * 60 * 60 * 24));
    
    // Для демонстрации распределим все заказы по дням недели
    // Преобразуем день недели из формата JavaScript (0-6, где 0 - воскресенье)
    // в формат нашего массива (0-6, где 0 - понедельник)
    const adjustedDayIndex = (dayOfWeek === 0) ? 6 : dayOfWeek - 1;
    salesByDay[adjustedDayIndex] += order.Cost;
  });
  
  console.log('Продажи по дням:', salesByDay);
  
  // Находим максимальное значение продаж за день
  const maxSales = Math.max(...salesByDay);
  
  // Преобразуем абсолютные значения в проценты для графика
  salesData.value = salesByDay.map(sales => {
    if (maxSales === 0) return 0;
    return Math.round((sales / maxSales) * 100);
  });
}

// Форматирование валюты
function formatCurrency(value) {
  return new Intl.NumberFormat('ru-RU', {
    style: 'decimal',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value);
}

onMounted(() => {
  // Загружаем данные о заказах при монтировании компонента
  loadOrderData();
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
