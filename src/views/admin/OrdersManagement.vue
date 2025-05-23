<template>
  <div class="admin-orders-management">
    <div class="admin-panel-header">
      <h1>Управление заказами</h1>
      <div class="admin-panel-actions">
        <div class="date-range-picker">
          <div class="admin-form-group">
            <label>Начальная дата</label>
            <input 
              type="date" 
              v-model="dateRange.start" 
              class="admin-input"
              :max="dateRange.end"
            />
          </div>
          <div class="admin-form-group">
            <label>Конечная дата</label>
            <input 
              type="date" 
              v-model="dateRange.end" 
              class="admin-input"
              :min="dateRange.start"
            />
          </div>
          <button @click="loadOrders" class="admin-button primary">
            Загрузить заказы
          </button>
        </div>
        <div class="admin-search">
          <input 
            type="text" 
            v-model="searchQuery" 
            placeholder="Поиск по имени, телефону или штрих-коду..." 
            class="admin-input"
          />
        </div>
      </div>
    </div>

    <!-- Состояние загрузки -->
    <div v-if="orderStore.loading" class="admin-loading">
      <div class="admin-spinner"></div>
      <p>Загрузка заказов...</p>
    </div>

    <!-- Сообщение об ошибке -->
    <div v-else-if="orderStore.error" class="admin-error-message">
      <p>{{ orderStore.error }}</p>
      <button @click="loadOrders" class="admin-button primary">
        Попробовать снова
      </button>
    </div>

    <!-- Пустой список заказов -->
    <div v-else-if="filteredOrders.length === 0" class="admin-empty-state">
      <p>Заказы не найдены. Попробуйте изменить диапазон дат или параметры поиска.</p>
    </div>

    <!-- Таблица заказов -->
    <div v-else class="admin-table-container">
      <table class="admin-table">
        <thead>
          <tr>
            <th @click="sortBy('OrderId')" class="sortable">
              ID
              <span v-if="sortColumn === 'OrderId'" class="sort-icon">
                {{ sortDirection === 'asc' ? '▲' : '▼' }}
              </span>
            </th>
            <th @click="sortBy('OrderBarcode')" class="sortable">
              Штрих-код
              <span v-if="sortColumn === 'OrderBarcode'" class="sort-icon">
                {{ sortDirection === 'asc' ? '▲' : '▼' }}
              </span>
            </th>
            <th @click="sortBy('VisitorName1')" class="sortable">
              Посетитель
              <span v-if="sortColumn === 'VisitorName1'" class="sort-icon">
                {{ sortDirection === 'asc' ? '▲' : '▼' }}
              </span>
            </th>
            <th @click="sortBy('VisitorPhone')" class="sortable">
              Телефон
              <span v-if="sortColumn === 'VisitorPhone'" class="sort-icon">
                {{ sortDirection === 'asc' ? '▲' : '▼' }}
              </span>
            </th>
            <th @click="sortBy('OrderStateId')" class="sortable">
              Статус
              <span v-if="sortColumn === 'OrderStateId'" class="sort-icon">
                {{ sortDirection === 'asc' ? '▲' : '▼' }}
              </span>
            </th>
            <th @click="sortBy('Cost')" class="sortable">
              Стоимость
              <span v-if="sortColumn === 'Cost'" class="sort-icon">
                {{ sortDirection === 'asc' ? '▲' : '▼' }}
              </span>
            </th>
            <th>Действия</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="order in filteredOrders" :key="order.OrderId">
            <td>{{ order.OrderId }}</td>
            <td>{{ order.OrderBarcode }}</td>
            <td>
              {{ order.VisitorName1 }}
              <span v-if="order.VisitorName2"> / {{ order.VisitorName2 }}</span>
            </td>
            <td>{{ order.VisitorPhone }}</td>
            <td>
              <span 
                class="status-badge" 
                :class="getStatusClass(order.OrderStateId)"
              >
                {{ orderStore.getStatusName(order.OrderStateId) }}
              </span>
            </td>
            <td>{{ formatCurrency(order.Cost) }}</td>
            <td class="admin-actions">
              <button 
                @click="viewOrderDetails(order)" 
                class="admin-button sm secondary"
                title="Просмотр деталей"
              >
                👁️
              </button>
              <button 
                @click="openStatusModal(order)" 
                class="admin-button sm primary"
                title="Изменить статус (локально)"
              >
                📝
              </button>
              <button 
                @click="confirmCancelOrder(order)" 
                class="admin-button sm danger"
                title="Удалить из списка (локально)"
                :disabled="order.OrderStateId === 2 || order.OrderStateId === 3"
              >
                ❌
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Модальное окно с деталями заказа -->
    <div v-if="showOrderDetailsModal" class="admin-modal-overlay" @click.self="showOrderDetailsModal = false">
      <div class="admin-modal">
        <div class="admin-modal-header">
          <h2>Детали заказа #{{ selectedOrder.OrderId }}</h2>
          <button @click="showOrderDetailsModal = false" class="admin-modal-close">&times;</button>
        </div>
        <div class="admin-modal-body">
          <div class="order-details">
            <div class="order-section">
              <h3>Основная информация</h3>
              <div class="admin-info-list">
                <div class="admin-info-item">
                  <span class="admin-info-label">ID заказа:</span>
                  <span class="admin-info-value">{{ selectedOrder.OrderId }}</span>
                </div>
                <div class="admin-info-item">
                  <span class="admin-info-label">Штрих-код:</span>
                  <span class="admin-info-value">{{ selectedOrder.OrderBarcode }}</span>
                </div>
                <div class="admin-info-item">
                  <span class="admin-info-label">Статус:</span>
                  <span class="admin-info-value">
                    <span 
                      class="status-badge" 
                      :class="getStatusClass(selectedOrder.OrderStateId)"
                    >
                      {{ orderStore.getStatusName(selectedOrder.OrderStateId) }}
                    </span>
                  </span>
                </div>
                <div class="admin-info-item">
                  <span class="admin-info-label">Стоимость:</span>
                  <span class="admin-info-value">{{ formatCurrency(selectedOrder.Cost) }}</span>
                </div>
              </div>
            </div>

            <div class="order-section">
              <h3>Информация о посетителе</h3>
              <div class="admin-info-list">
                <div class="admin-info-item">
                  <span class="admin-info-label">Имя:</span>
                  <span class="admin-info-value">{{ selectedOrder.VisitorName1 }}</span>
                </div>
                <div v-if="selectedOrder.VisitorName2" class="admin-info-item">
                  <span class="admin-info-label">Имя 2:</span>
                  <span class="admin-info-value">{{ selectedOrder.VisitorName2 }}</span>
                </div>
                <div v-if="selectedOrder.VisitorName3" class="admin-info-item">
                  <span class="admin-info-label">Имя 3:</span>
                  <span class="admin-info-value">{{ selectedOrder.VisitorName3 }}</span>
                </div>
                <div class="admin-info-item">
                  <span class="admin-info-label">Телефон:</span>
                  <span class="admin-info-value">{{ selectedOrder.VisitorPhone }}</span>
                </div>
                <div v-if="selectedOrder.VisitorMail" class="admin-info-item">
                  <span class="admin-info-label">Email:</span>
                  <span class="admin-info-value">{{ selectedOrder.VisitorMail }}</span>
                </div>
              </div>
            </div>

            <div class="order-section">
              <h3>Услуги</h3>
              <div v-if="selectedOrder.Service && selectedOrder.Service.length > 0">
                <div v-for="(service, index) in selectedOrder.Service" :key="index" class="service-item">
                  <div class="admin-info-list">
                    <div class="admin-info-item">
                      <span class="admin-info-label">Название услуги:</span>
                      <span class="admin-info-value">{{ service.ServiceName }}</span>
                    </div>
                    <div class="admin-info-item">
                      <span class="admin-info-label">Дата посещения:</span>
                      <span class="admin-info-value">{{ formatDateTime(service.DtVisit) }}</span>
                    </div>
                    <div class="admin-info-item">
                      <span class="admin-info-label">Статус услуги:</span>
                      <span class="admin-info-value">{{ service.ServiceStateName }}</span>
                    </div>
                    <div class="admin-info-item">
                      <span class="admin-info-label">Стоимость:</span>
                      <span class="admin-info-value">{{ formatCurrency(service.Cost) }}</span>
                    </div>
                    <div class="admin-info-item">
                      <span class="admin-info-label">Количество:</span>
                      <span class="admin-info-value">{{ service.ServiceCount }}</span>
                    </div>
                    <div v-if="service.dtDrop" class="admin-info-item">
                      <span class="admin-info-label">Дата отмены:</span>
                      <span class="admin-info-value">{{ formatDateTime(service.dtDrop) }}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div v-else class="empty-services">
                Нет услуг в заказе
              </div>
            </div>
          </div>
        </div>
        <div class="admin-modal-footer">
          <button @click="showOrderDetailsModal = false" class="admin-button primary">
            Закрыть
          </button>
        </div>
      </div>
    </div>

    <!-- Модальное окно изменения статуса -->
    <div v-if="showStatusModal" class="admin-modal-overlay" @click.self="showStatusModal = false">
      <div class="admin-modal">
        <div class="admin-modal-header">
          <h2>Изменение статуса заказа #{{ selectedOrder.OrderId }}</h2>
          <button @click="showStatusModal = false" class="admin-modal-close">&times;</button>
        </div>
        <div class="admin-modal-body">
          <div class="admin-form-group">
            <label>Текущий статус:</label>
            <div>
              <span 
                class="status-badge" 
                :class="getStatusClass(selectedOrder.OrderStateId)"
              >
                {{ orderStore.getStatusName(selectedOrder.OrderStateId) }}
              </span>
            </div>
          </div>
          <div class="admin-form-group">
            <label>Новый статус:</label>
            <select v-model="newStatusId" class="admin-select">
              <option v-for="(name, id) in statusOptions" :key="id" :value="Number(id)">
                {{ name }}
              </option>
            </select>
          </div>
        </div>
        <div class="admin-modal-footer">
          <button @click="showStatusModal = false" class="admin-button secondary">
            Отмена
          </button>
          <button @click="changeStatus" class="admin-button primary">
            Сохранить (локально)
          </button>
        </div>
      </div>
    </div>

    <!-- Модальное окно подтверждения отмены заказа -->
    <div v-if="showCancelConfirmation" class="admin-modal-overlay" @click.self="showCancelConfirmation = false">
      <div class="admin-modal">
        <div class="admin-modal-header">
          <h2>Подтверждение отмены</h2>
          <button @click="showCancelConfirmation = false" class="admin-modal-close">&times;</button>
        </div>
        <div class="admin-modal-body">
          <p class="confirmation-message">
            Вы действительно хотите удалить заказ #{{ selectedOrder.OrderId }} из списка?
          </p>
          <p class="warning-message">
            Это действие удалит заказ только из локального списка, но не из базы данных.
          </p>
        </div>
        <div class="admin-modal-footer">
          <button @click="showCancelConfirmation = false" class="admin-button secondary">
            Нет, оставить
          </button>
          <button @click="removeOrder" class="admin-button danger">
            Да, удалить из списка
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useOrderStore } from '@/stores/orderStore';

// Инициализация хранилища заказов
const orderStore = useOrderStore();

// Состояние компонента
const dateRange = ref({
  start: new Date(new Date().setDate(new Date().getDate() - 30)).toISOString().split('T')[0], // 30 дней назад
  end: new Date().toISOString().split('T')[0] // сегодня
});

const searchQuery = ref('');
const sortColumn = ref('OrderId');
const sortDirection = ref('desc');

// Состояние модальных окон
const showOrderDetailsModal = ref(false);
const showStatusModal = ref(false);
const showCancelConfirmation = ref(false);
const selectedOrder = ref({});
const newStatusId = ref(0);

// Опции статусов заказа
const statusOptions = {
  0: 'Новый',
  1: 'Оплачен',
  2: 'Отменен',
  3: 'Возвращен',
  4: 'Использован'
};

// Загрузка заказов
async function loadOrders() {
  await orderStore.fetchOrdersByDateRange(dateRange.value.start, dateRange.value.end);
}

// Фильтрация и сортировка заказов
const filteredOrders = computed(() => {
  let result = [...orderStore.orders];
  
  // Фильтрация по поисковому запросу
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase();
    result = result.filter(order => 
      (order.VisitorName1 && order.VisitorName1.toLowerCase().includes(query)) ||
      (order.VisitorName2 && order.VisitorName2.toLowerCase().includes(query)) ||
      (order.VisitorName3 && order.VisitorName3.toLowerCase().includes(query)) ||
      (order.VisitorPhone && order.VisitorPhone.toLowerCase().includes(query)) ||
      (order.OrderBarcode && order.OrderBarcode.toLowerCase().includes(query)) ||
      (order.OrderId.toString().includes(query))
    );
  }
  
  // Сортировка
  result.sort((a, b) => {
    let valueA = a[sortColumn.value];
    let valueB = b[sortColumn.value];
    
    // Преобразование строковых значений в нижний регистр для корректного сравнения
    if (typeof valueA === 'string') valueA = valueA.toLowerCase();
    if (typeof valueB === 'string') valueB = valueB.toLowerCase();
    
    if (valueA < valueB) return sortDirection.value === 'asc' ? -1 : 1;
    if (valueA > valueB) return sortDirection.value === 'asc' ? 1 : -1;
    return 0;
  });
  
  return result;
});

// Функция сортировки
function sortBy(column) {
  if (sortColumn.value === column) {
    // Если колонка та же, меняем направление сортировки
    sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc';
  } else {
    // Если колонка новая, устанавливаем её и сортировку по возрастанию
    sortColumn.value = column;
    sortDirection.value = 'asc';
  }
}

// Получение класса для статуса
function getStatusClass(statusId) {
  const statusClasses = {
    0: 'status-new',
    1: 'status-paid',
    2: 'status-canceled',
    3: 'status-returned',
    4: 'status-used'
  };
  
  return statusClasses[statusId] || 'status-unknown';
}

// Форматирование валюты
function formatCurrency(value) {
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB',
    minimumFractionDigits: 2
  }).format(value);
}

// Форматирование даты и времени
function formatDateTime(dateTimeString) {
  if (!dateTimeString) return 'Не указано';
  
  const date = new Date(dateTimeString);
  
  return new Intl.DateTimeFormat('ru-RU', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
}

// Просмотр деталей заказа
function viewOrderDetails(order) {
  selectedOrder.value = { ...order };
  showOrderDetailsModal.value = true;
}

// Открытие модального окна изменения статуса
function openStatusModal(order) {
  selectedOrder.value = { ...order };
  newStatusId.value = order.OrderStateId;
  showStatusModal.value = true;
}

// Изменение статуса заказа (только локально, без API-вызова)
function changeStatus() {
  if (newStatusId.value === selectedOrder.value.OrderStateId) {
    showStatusModal.value = false;
    return;
  }
  
  // Обновляем статус только локально
  orderStore.updateOrderStatusLocally(selectedOrder.value.OrderId, newStatusId.value);
  
  // Обновляем статус в выбранном заказе
  selectedOrder.value.OrderStateId = newStatusId.value;
  
  showStatusModal.value = false;
}

// Открытие модального окна подтверждения удаления заказа из списка
function confirmCancelOrder(order) {
  selectedOrder.value = { ...order };
  showCancelConfirmation.value = true;
}

// Удаление заказа из списка (только локально, без API-вызова)
function removeOrder() {
  // Удаляем заказ только из локального состояния
  orderStore.removeOrderLocally(selectedOrder.value.OrderId);
  showCancelConfirmation.value = false;
}

// Загрузка данных при монтировании компонента
onMounted(() => {
  loadOrders();
});
</script>

<style scoped>
.admin-orders-management {
  width: 100%;
}

.admin-panel-header {
  margin-bottom: 1.5rem;
}

.admin-panel-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-top: 1rem;
}

.date-range-picker {
  display: flex;
  gap: 1rem;
  align-items: flex-end;
}

.admin-search {
  flex: 1;
  min-width: 300px;
}

.admin-loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}

.admin-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid rgba(0, 0, 0, 0.1);
  border-radius: 50%;
  border-top-color: var(--admin-primary, #3b82f6);
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.admin-error-message {
  background-color: #fee2e2;
  color: #b91c1c;
  padding: 1rem;
  border-radius: 4px;
  margin-bottom: 1rem;
  text-align: center;
}

.admin-empty-state {
  background-color: #f3f4f6;
  padding: 2rem;
  border-radius: 4px;
  text-align: center;
  color: #4b5563;
}

.admin-table-container {
  overflow-x: auto;
}

.admin-table {
  width: 100%;
  border-collapse: collapse;
}

.admin-table th {
  background-color: #f8fafc;
  padding: 0.75rem 1rem;
  text-align: left;
  font-weight: 600;
  color: #1e293b;
  border-bottom: 2px solid #e2e8f0;
}

.admin-table th.sortable {
  cursor: pointer;
  position: relative;
}

.admin-table th.sortable:hover {
  background-color: #f1f5f9;
}

.sort-icon {
  margin-left: 0.25rem;
  display: inline-block;
}

.admin-table td {
  padding: 0.75rem 1rem;
  border-bottom: 1px solid #e2e8f0;
}

.admin-table tr:hover {
  background-color: #f8fafc;
}

.admin-actions {
  display: flex;
  gap: 0.5rem;
}

.status-badge {
  display: inline-block;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 500;
}

.status-new {
  background-color: #e0f2fe;
  color: #0369a1;
}

.status-paid {
  background-color: #dcfce7;
  color: #15803d;
}

.status-canceled {
  background-color: #fee2e2;
  color: #b91c1c;
}

.status-returned {
  background-color: #fef3c7;
  color: #92400e;
}

.status-used {
  background-color: #e0e7ff;
  color: #4338ca;
}

.status-unknown {
  background-color: #f3f4f6;
  color: #4b5563;
}

.order-details {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.order-section {
  margin-bottom: 1rem;
}

.order-section h3 {
  margin-top: 0;
  margin-bottom: 0.75rem;
  font-size: 1.1rem;
  color: var(--admin-text-secondary, #4a5568);
  padding-bottom: 0.3rem;
  border-bottom: 1px solid var(--admin-border-color, #e2e8f0);
}

.service-item {
  margin-bottom: 1rem;
  padding-bottom: 1rem;
  border-bottom: 1px dashed var(--admin-border-color, #e2e8f0);
}

.service-item:last-child {
  margin-bottom: 0;
  padding-bottom: 0;
  border-bottom: none;
}

.empty-services {
  padding: 1rem;
  text-align: center;
  color: var(--admin-text-secondary, #718096);
  background-color: var(--admin-bg-secondary, #f7fafc);
  border-radius: var(--admin-border-radius-sm, 4px);
}

.confirmation-message {
  font-size: 1.1rem;
  margin-bottom: 1rem;
  text-align: center;
}

.warning-message {
  color: var(--admin-danger, #e53e3e);
  font-weight: 500;
  text-align: center;
}
</style>
