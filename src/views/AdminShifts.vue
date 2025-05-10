<template>
  <div class="admin-container">
    <h2 class="admin-section-title">Управление сменами</h2>
    
    <!-- Текущая смена -->
    <div class="admin-card current-shift-card">
      <div v-if="currentShift" class="current-shift-block active">
        <h3 class="admin-section-title subsection-title">Текущая смена</h3>
        <div class="shift-info">
          <p><strong>Статус:</strong> {{ currentShift.status }}</p>
          <p><strong>Открыта:</strong> {{ formatDateTime(currentShift.openTime) }}</p>
          <p><strong>Кассир:</strong> {{ currentShift.cashier }}</p>
          <p><strong>Заказов:</strong> {{ currentShift.totalOrders }}</p>
          <p><strong>Сумма:</strong> {{ currentShift.totalAmount }} руб.</p>
        </div>
        <div class="shift-actions">
          <button @click="closeShift" class="admin-button danger">Закрыть смену</button>
          <button @click="printReport" class="admin-button">Печать отчета</button>
          <button @click="printLastReceipt" class="admin-button">Печать последнего чека</button>
        </div>
      </div>
      
      <div v-else class="current-shift-block inactive">
        <h3 class="admin-section-title subsection-title">Нет активной смены</h3>
        <p>Для начала работы необходимо открыть смену</p>
        <button @click="openShift" class="admin-button primary large-button">Открыть смену</button>
      </div>
    </div>
    
    <!-- История смен -->
    <div class="admin-card shifts-history-card">
      <h3 class="admin-section-title">История смен</h3>
      
      <div class="filters">
        <div class="admin-form-group filter-item">
          <label for="date-from">С:</label>
          <input type="date" id="date-from" v-model="filters.dateFrom" class="admin-input">
        </div>
        
        <div class="admin-form-group filter-item">
          <label for="date-to">По:</label>
          <input type="date" id="date-to" v-model="filters.dateTo" class="admin-input">
        </div>
        
        <button @click="applyFilters" class="admin-button filter-button">Применить</button>
      </div>
      
      <div class="table-container">
        <table class="admin-table shifts-table-custom">
          <thead>
            <tr>
              <th>№</th>
              <th>Дата открытия</th>
              <th>Дата закрытия</th>
              <th>Кассир</th>
              <th>Заказов</th>
              <th>Сумма (руб.)</th>
              <th>Статус</th>
              <th>Действия</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="shift in filteredShifts" :key="shift.id">
              <td>{{ shift.id }}</td>
              <td>{{ formatDateTime(shift.openTime) }}</td>
              <td>{{ shift.closeTime ? formatDateTime(shift.closeTime) : '-' }}</td>
              <td>{{ shift.cashier }}</td>
              <td>{{ shift.totalOrders }}</td>
              <td>{{ shift.totalAmount }}</td>
              <td>
                <span :class="'status-badge ' + shift.status.toLowerCase().replace(' ', '-')">{{ shift.status }}</span>
              </td>
              <td class="actions-cell">
                <button @click="viewShiftDetails(shift)" class="admin-button icon-only small" title="Просмотр деталей">👁️</button>
                <button @click="printShiftReport(shift)" class="admin-button icon-only small" title="Печать отчета">🖨️</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    
    <!-- Модальное окно с деталями смены -->
    <div v-if="showModal" class="modal">
      <div class="modal-content admin-card">
        <span class="close-modal-button" @click="closeModal">&times;</span>
        <h3 class="admin-section-title">Детали смены #{{ selectedShift.id }}</h3>
        
        <div class="shift-details-modal-grid">
          <div class="shift-info-modal">
            <p><strong>Дата открытия:</strong> {{ formatDateTime(selectedShift.openTime) }}</p>
            <p><strong>Дата закрытия:</strong> {{ selectedShift.closeTime ? formatDateTime(selectedShift.closeTime) : '-' }}</p>
            <p><strong>Кассир:</strong> {{ selectedShift.cashier }}</p>
            <p><strong>Всего заказов:</strong> {{ selectedShift.totalOrders }}</p>
            <p><strong>Общая сумма:</strong> {{ selectedShift.totalAmount }} руб.</p>
          </div>
          
          <div class="shift-orders-modal">
            <h4 class="admin-section-title subsection-title">Заказы за смену</h4>
            <div class="table-container modal-table-container">
              <table class="admin-table orders-table-custom">
                <thead>
                  <tr>
                    <th>№</th>
                    <th>Услуга</th>
                    <th>Кол-во</th>
                    <th>Сумма</th>
                    <th>Статус</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="order in selectedShift.orders" :key="order.id">
                    <td>{{ order.id }}</td>
                    <td>{{ order.serviceName }}</td>
                    <td>{{ order.quantity }}</td>
                    <td>{{ order.amount }} руб.</td>
                    <td>
                      <span :class="'status-badge ' + order.status.toLowerCase().replace(' ', '-')">{{ order.status }}</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
        
        <div class="modal-actions">
          <button @click="printShiftReport(selectedShift)" class="admin-button">Печать отчета</button>
          <button @click="closeModal" class="admin-button secondary">Закрыть</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { mockShifts, mockOrders } from '../mockServiceData.js';

// Состояние смены
const currentShift = ref(null);
const shifts = ref([...mockShifts]);
const showModal = ref(false);
const selectedShift = ref({});
const shiftOrders = ref([]);

// Фильтры для истории смен
const filters = ref({
  dateFrom: new Date().toISOString().split('T')[0],
  dateTo: new Date().toISOString().split('T')[0]
});

// Отфильтрованные смены
const filteredShifts = computed(() => {
  return shifts.value.filter(shift => {
    const shiftDate = new Date(shift.openTime).toISOString().split('T')[0];
    return shiftDate >= filters.value.dateFrom && shiftDate <= filters.value.dateTo;
  }).sort((a, b) => new Date(b.openTime) - new Date(a.openTime));
});

// Проверка наличия активной смены при загрузке компонента
onMounted(() => {
  // В реальном приложении здесь был бы запрос к API
  // Для демонстрации используем локальное хранилище
  const savedShift = localStorage.getItem('currentShift');
  if (savedShift) {
    currentShift.value = JSON.parse(savedShift);
  }
});

// Открытие смены
function openShift() {
  const newShift = {
    id: Date.now(),
    openTime: new Date().toISOString(),
    status: 'открыта',
    cashier: 'Оператор',
    totalOrders: 0,
    totalAmount: 0
  };
  
  currentShift.value = newShift;
  localStorage.setItem('currentShift', JSON.stringify(newShift));
  
  // Добавляем в историю смен
  shifts.value.unshift(newShift);
}

// Закрытие смены
function closeShift() {
  if (!currentShift.value) return;
  
  currentShift.value.closeTime = new Date().toISOString();
  currentShift.value.status = 'закрыта';
  
  // Обновляем в истории смен
  const index = shifts.value.findIndex(s => s.id === currentShift.value.id);
  if (index !== -1) {
    shifts.value[index] = { ...currentShift.value };
  }
  
  localStorage.removeItem('currentShift');
  currentShift.value = null;
}

// Печать отчета по текущей смене
function printReport() {
  if (!currentShift.value) return;
  
  // В реальном приложении здесь был бы код для печати отчета
  alert('Печать отчета по текущей смене');
}

// Печать последнего чека
function printLastReceipt() {
  // В реальном приложении здесь был бы код для печати последнего чека
  alert('Печать последнего чека');
}

// Применение фильтров к истории смен
function applyFilters() {
  // Фильтрация происходит автоматически через computed-свойство
}

// Просмотр деталей смены
function viewShiftDetails(shift) {
  selectedShift.value = shift;
  
  // Получаем заказы за эту смену
  // В реальном приложении здесь был бы запрос к API
  const shiftDate = new Date(shift.openTime).toISOString().split('T')[0];
  shiftOrders.value = mockOrders.filter(order => order.date === shiftDate);
  
  showModal.value = true;
}

// Печать отчета по выбранной смене
function printShiftReport(shift) {
  // В реальном приложении здесь был бы код для печати отчета
  alert(`Печать отчета по смене #${shift.id}`);
}

// Закрытие модального окна
function closeModal() {
  showModal.value = false;
}

// Форматирование даты и времени
function formatDateTime(dateTimeString) {
  if (!dateTimeString) return '';
  
  const date = new Date(dateTimeString);
  return date.toLocaleString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}
</script>

<style scoped>
/* Current Shift Specific Styles */
.current-shift-card .subsection-title {
  margin-top: 0;
  margin-bottom: 1em;
  font-size: 1.15rem;
  border-bottom: none;
}

.current-shift-block {
  padding: 1em;
  border-radius: 6px; /* Slightly smaller radius than admin-card for nested elements */
}

.current-shift-block.active {
  background-color: #f0f9ff; /* Light blue */
  border-left: 4px solid var(--admin-primary-color, #3b82f6);
}

.current-shift-block.inactive {
  background-color: #fff5f5; /* Light red */
  border-left: 4px solid var(--admin-danger-color, #ef4444);
  text-align: center;
}

.shift-info {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 0.75em 1.5em;
  margin-bottom: 1.5em;
}

.shift-info p {
  margin: 0;
  color: #4b5563; /* Tailwind gray-600 */
}

.shift-actions {
  display: flex;
  gap: 0.75em;
  justify-content: flex-end;
  flex-wrap: wrap; /* Allow buttons to wrap on smaller screens */
}

.admin-button.large-button {
    padding: 0.75em 1.5em;
    font-size: 1rem;
    margin-top: 1em;
}

/* Filters Specific Styles */
.shifts-history-card .admin-section-title {
    margin-bottom: 1em;
}

.filters {
  display: flex;
  flex-wrap: wrap; /* Allow filters to wrap */
  gap: 1em;
  margin-bottom: 1.5em;
  align-items: flex-end; /* Align items to bottom for better appearance with varying label heights */
}

.filter-item {
  display: flex;
  flex-direction: column; /* Stack label and input */
  gap: 0.3em; /* Space between label and input */
  flex-grow: 1; /* Allow items to grow */
  min-width: 180px; /* Minimum width for filter items */
}

.filter-item label {
  font-size: 0.875rem; /* Smaller label */
  color: #4b5563; /* Tailwind gray-600 */
  font-weight: 500; /* Match admin-form-group label */
}

.filter-button {
  /* Adjust if needed, or rely on admin-button */
  align-self: flex-end; /* Align with bottom of inputs */
}

/* Table Specific Styles */
.table-container {
  overflow-x: auto; /* Ensures table is scrollable on small screens */
}

.shifts-table-custom th,
.shifts-table-custom td,
.orders-table-custom th,
.orders-table-custom td {
  padding: 0.75em 1em; /* Consistent padding with other admin table elements */
  white-space: nowrap; /* Prevent text wrapping in cells for better readability */
}

.actions-cell {
  text-align: right; /* Align action buttons to the right */
  white-space: nowrap;
}

.actions-cell .admin-button.icon-only + .admin-button.icon-only {
  margin-left: 0.5em;
}

/* Status Badges - Kept locally as they are very specific */
.status-badge {
  display: inline-block;
  padding: 0.25em 0.6em;
  border-radius: 0.25rem; /* 4px */
  font-size: 0.75rem; /* 12px */
  font-weight: 500;
  line-height: 1.2;
  text-transform: capitalize;
}

.status-badge.открыта {
  background-color: #e0f2fe; /* Tailwind sky-100 */
  color: #0ea5e9; /* Tailwind sky-600 */
}

.status-badge.закрыта {
  background-color: #fee2e2; /* Tailwind red-100 */
  color: #dc2626; /* Tailwind red-600 */
}

.status-badge.оплачен {
  background-color: #dcfce7; /* Tailwind green-100 */
  color: #16a34a; /* Tailwind green-600 */
}

.status-badge.забронирован {
  background-color: #fefce8; /* Tailwind yellow-50 */
  color: #ca8a04; /* Tailwind yellow-600 */
}

.status-badge.ошибка {
  background-color: #fee2e2; /* Tailwind red-100 */
  color: #ef4444; /* Tailwind red-500 */
}

.status-badge.возвращен {
  background-color: #eff6ff; /* Tailwind blue-50 */
  color: #3b82f6; /* Tailwind blue-500 */
}

/* Modal Specific Styles */
.modal {
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
}

.modal-content {
  /* .admin-card styling is applied directly in template */
  width: 100%;
  max-width: 900px;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
  display: flex;
  flex-direction: column;
}

.close-modal-button {
  position: absolute;
  top: 0.75rem;
  right: 1rem;
  font-size: 1.75rem;
  font-weight: bold;
  color: #6b7280; /* Tailwind gray-500 */
  cursor: pointer;
  line-height: 1;
}

.close-modal-button:hover {
  color: #111827; /* Tailwind gray-900 */
}

.modal-content .admin-section-title {
    margin-bottom: 1em;
}

.modal-content .subsection-title {
    font-size: 1.1rem;
    margin-top: 0;
    margin-bottom: 0.75em;
    border-bottom: 1px solid #e5e7eb;
    padding-bottom: 0.4em;
}

.shift-details-modal-grid {
  display: grid;
  gap: 1.5em;
  margin-top: 1em;
  flex-grow: 1; /* Allow grid to take available space */
  overflow-y: auto; /* Allow content within grid to scroll if needed */
}

@media (min-width: 768px) {
  .shift-details-modal-grid {
    grid-template-columns: 1fr 2fr; /* Two columns on larger screens */
  }
}

.shift-info-modal p {
  margin-bottom: 0.5em;
  color: #374151; /* Tailwind gray-700 */
}

.shift-orders-modal {
  /* Styles for orders section within modal */
}

.modal-table-container {
    max-height: 400px; /* Example max height for scrollable table in modal */
    overflow-y: auto;
}

.modal-actions {
  margin-top: 1.5em;
  display: flex;
  justify-content: flex-end;
  gap: 0.75em;
  padding-top: 1em;
  border-top: 1px solid #e5e7eb; /* Separator for actions */
}

/* Responsive Adjustments */
@media (max-width: 768px) {
  .shift-info {
    grid-template-columns: 1fr; /* Stack info items on small screens */
  }
  
  .filters {
    flex-direction: column;
    align-items: stretch; /* Stretch filter items */
  }

  .filter-item {
    min-width: 0; /* Allow filter items to shrink */
  }
  
  .modal-content {
    padding: 1rem;
  }

  .modal-content .admin-section-title {
    font-size: 1.25rem;
  }
}
</style>
