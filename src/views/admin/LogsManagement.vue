<template>
  <div class="admin-container">
    <h2 class="admin-section-title">Логи системы</h2>
    
    <div class="admin-card">
      <div class="admin-toolbar">
        <div class="admin-search-container">
          <input 
            type="text" 
            v-model="searchQuery" 
            placeholder="Поиск по логам..." 
            class="admin-search-input"
            @input="filterLogs"
          />
        </div>
        
        <div class="admin-filter-container">
          <select v-model="sortField" @change="sortLogs" class="admin-select">
            <option value="CreatedAt">Сортировать по дате</option>
            <option value="ActorName">Сортировать по имени пользователя</option>
            <option value="ActionType">Сортировать по типу действия</option>
          </select>
          
          <button 
            @click="toggleSortDirection" 
            class="admin-button secondary ml-2"
            :title="sortDirection === 'desc' ? 'По убыванию' : 'По возрастанию'"
          >
            <span v-if="sortDirection === 'desc'">↓</span>
            <span v-else>↑</span>
          </button>
          
          <button @click="fetchLogs" class="admin-button primary ml-2" title="Обновить">
            <span>⟳</span>
          </button>
        </div>
      </div>
      
      <div v-if="loading" class="admin-loading">
        Загрузка логов...
      </div>
      
      <div v-else-if="error" class="admin-error">
        <p>Загрузить логи:</p>
        <p>{{ error }}</p>
        <button @click="fetchLogs" class="admin-button primary">Загрузить</button>
      </div>
      
      <div v-else-if="filteredLogs.length === 0" class="admin-empty-state">
        <p>Логи не найдены</p>
      </div>
      
      <div v-else class="admin-table-container">
        <table class="admin-table logs-table">
          <thead>
            <tr>
              <th @click="setSortField('ActionType')" class="sortable">
                Тип действия
                <span v-if="sortField === 'ActionType'" class="sort-indicator">
                  {{ sortDirection === 'desc' ? '↓' : '↑' }}
                </span>
              </th>
              <th @click="setSortField('Description')" class="sortable">
                Описание
                <span v-if="sortField === 'Description'" class="sort-indicator">
                  {{ sortDirection === 'desc' ? '↓' : '↑' }}
                </span>
              </th>
              <th @click="setSortField('ActorName')" class="sortable">
                Пользователь
                <span v-if="sortField === 'ActorName'" class="sort-indicator">
                  {{ sortDirection === 'desc' ? '↓' : '↑' }}
                </span>
              </th>
              <th @click="setSortField('CreatedAt')" class="sortable">
                Дата и время
                <span v-if="sortField === 'CreatedAt'" class="sort-indicator">
                  {{ sortDirection === 'desc' ? '↓' : '↑' }}
                </span>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(log, index) in filteredLogs" :key="index">
              <td>{{ log.ActionType }}</td>
              <td>{{ log.Description }}</td>
              <td>{{ log.ActorName }}</td>
              <td>{{ formatDate(log.CreatedAt) }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useAuthStore } from '@/stores/authStore';
import { getLogs } from '@/api/infoApi';

// Проверка прав доступа
const authStore = useAuthStore();
const userHasAccess = computed(() => {
  const role = authStore.userRole;
  return role === 'admin' || role === 'root';
});

// Состояние компонента
const logs = ref([]);
const filteredLogs = ref([]);
const loading = ref(false);
const error = ref(null);
const searchQuery = ref('');
const sortField = ref('CreatedAt');
const sortDirection = ref('desc');

// Загрузка логов при монтировании компонента
onMounted(async () => {
  if (userHasAccess.value) {
    await fetchLogs();
  } else {
    error.value = '----';
  }
});

// Получение логов с сервера
async function fetchLogs() {
  loading.value = true;
  error.value = null;
  
  try {
    const response = await getLogs();
    logs.value = response;
    filterLogs();
  } catch (err) {
    console.error('Ошибка при загрузке логов:', err);
    error.value = err.message || 'Ошибка при загрузке логов';
  } finally {
    loading.value = false;
  }
}

// Фильтрация логов по поисковому запросу
function filterLogs() {
  if (!searchQuery.value.trim()) {
    filteredLogs.value = [...logs.value];
  } else {
    const query = searchQuery.value.toLowerCase();
    filteredLogs.value = logs.value.filter(log => 
      log.ActionType.toLowerCase().includes(query) ||
      log.Description.toLowerCase().includes(query) ||
      log.ActorName.toLowerCase().includes(query)
    );
  }
  
  sortLogs();
}

// Сортировка логов
function sortLogs() {
  filteredLogs.value.sort((a, b) => {
    let valueA = a[sortField.value];
    let valueB = b[sortField.value];
    
    // Для дат преобразуем строки в объекты Date
    if (sortField.value === 'CreatedAt') {
      valueA = new Date(valueA);
      valueB = new Date(valueB);
    } else {
      // Для строк приводим к нижнему регистру
      valueA = String(valueA).toLowerCase();
      valueB = String(valueB).toLowerCase();
    }
    
    if (valueA < valueB) return sortDirection.value === 'asc' ? -1 : 1;
    if (valueA > valueB) return sortDirection.value === 'asc' ? 1 : -1;
    return 0;
  });
}

// Изменение поля сортировки
function setSortField(field) {
  if (sortField.value === field) {
    toggleSortDirection();
  } else {
    sortField.value = field;
    sortDirection.value = 'desc'; // По умолчанию сортируем по убыванию
    sortLogs();
  }
}

// Изменение направления сортировки
function toggleSortDirection() {
  sortDirection.value = sortDirection.value === 'desc' ? 'asc' : 'desc';
  sortLogs();
}

// Форматирование даты
function formatDate(dateString) {
  if (!dateString) return '';
  
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('ru-RU', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  }).format(date);
}
</script>

<style scoped>
.admin-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  flex-wrap: wrap;
  gap: 1rem;
}

.admin-search-container {
  flex: 1;
  min-width: 250px;
}

.admin-filter-container {
  display: flex;
  align-items: center;
}

.logs-table th {
  cursor: pointer;
  position: relative;
}

.logs-table th.sortable:hover {
  background-color: var(--admin-bg-hover);
}

.sort-indicator {
  margin-left: 0.5rem;
  display: inline-block;
}

.admin-loading,
.admin-error,
.admin-empty-state {
  padding: 2rem;
  text-align: center;
  color: var(--admin-text-secondary);
}

.admin-error {
  color: var(--admin-color-danger);
}

.ml-2 {
  margin-left: 0.5rem;
}
</style>
