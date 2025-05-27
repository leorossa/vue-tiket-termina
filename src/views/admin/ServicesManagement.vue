<template>
  <div class="admin-container">
    <div class="admin-header">
      <h1 class="admin-title">Управление услугами</h1>
      <!-- Кнопка добавления простой услуги (доступна всем) -->
      <button @click="openCreateSimpleServiceModal" class="admin-button primary" style="margin-right: 10px;">
        <i class="fas fa-plus"></i> Добавить простую услугу
      </button>
      <!-- Кнопка добавления расширенной услуги (только для root) -->
      <button v-if="userStore.hasRootAccess" @click="openCreateServiceModal" class="admin-button primary">
        <i class="fas fa-plus"></i> Добавить расширенную услугу
      </button>
    </div>

    <div v-if="loading" class="admin-loading">
      <div class="spinner"></div>
      <p>Загрузка данных...</p>
    </div>

    <div v-else-if="error" class="admin-error">
      <p>{{ error }}</p>
      <button @click="fetchServices" class="admin-button primary">Попробовать снова</button>
    </div>

    <div v-else-if="services.length === 0" class="admin-empty">
      <p>Услуги не найдены</p>
      <button @click="openCreateSimpleServiceModal" class="admin-button primary">
        Добавить первую услугу
      </button>
    </div>

    <div v-else class="admin-table-responsive">
      <table class="admin-table">
        <thead>
          <tr>
            <th>Название</th>
            <th>Описание</th>
            <th>Стоимость</th>
            <th>Объекты</th>
            <th>Категории</th>
            <th>Действия</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="service in filteredServices" :key="service.ServiceId" @click="editService(service)" class="service-row">
            <td>{{ service.ServiceName }}</td>
            <td class="description-cell">
              <div class="truncated-text">{{ service.Comment || 'Нет описания' }}</div>
            </td>
            <td>
              <div class="price-info">
                <div v-if="service.Price && service.Price.length">
                  <div v-for="(price, index) in service.Price" :key="index" class="price-item">
                    {{ price.Cost }} руб.
                  </div>
                </div>
                <div v-else>{{ service.Cost || 'Не указана' }} руб.</div>
              </div>
            </td>
            <td>
              <div class="objects-info">
                <div v-if="service.VisitObject && service.VisitObject.length">
                  <div v-for="(obj, index) in service.VisitObject" :key="index" class="object-item">
                    {{ obj.VisitObjectName }}
                  </div>
                </div>
                <div v-else-if="service.VisitObjectCount">
                  <span class="admin-badge">{{ service.VisitObjectCount }}</span>
                </div>
                <div v-else>Нет</div>
              </div>
            </td>
            <td>
              <div class="categories-info">
                <div v-if="service.CategoryVisitor && service.CategoryVisitor.length">
                  <div v-for="(cat, index) in service.CategoryVisitor" :key="index" class="category-item">
                    {{ cat.CategoryVisitorName }}
                  </div>
                </div>
                <div v-else-if="service.CategoryVisitorCount">
                  <span class="admin-badge">{{ service.CategoryVisitorCount }}</span>
                </div>
                <div v-else>Нет</div>
              </div>
            </td>
            <td>
              <div class="admin-actions">
                <button @click="editService(service)" class="admin-button secondary sm">
                  <i class="fas fa-edit"></i> Редактировать
                </button>
                <button @click="confirmDeleteService(service)" class="admin-button danger sm">
                  <i class="fas fa-trash"></i> Удалить
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Модальное окно для создания/редактирования услуги -->
    <ServiceForm
      v-if="showServiceModal"
      :service="currentService"
      :is-editing="isEditing"
      @close="showServiceModal = false"
      @save="handleSaveService"
    />

    <!-- Модальное окно подтверждения удаления -->
    <DeleteConfirmation
      v-if="showDeleteConfirmModal"
      :item-name="`услугу &quot;${serviceToDelete?.ServiceName || ''}&quot;`"
      @cancel="showDeleteConfirmModal = false"
      @confirm="deleteService"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import ServiceForm from '@/components/admin/ServiceForm.vue';
import DeleteConfirmation from '@/components/admin/DeleteConfirmation.vue';
import { useServiceStore } from '@/stores/serviceStore';
import { useUserStore } from '@/stores/userStore';

// Сторы
const serviceStore = useServiceStore();
const userStore = useUserStore();

// Состояния компонента
const searchQuery = ref('');
const showServiceModal = ref(false);
const showDeleteConfirmModal = ref(false);
const isEditing = ref(false);
const currentService = ref(null);
const serviceToDelete = ref(null);
const error = ref(null);

// Вычисляемые свойства
const loading = computed(() => serviceStore.loading);
const services = computed(() => serviceStore.services);

// Фильтрация услуг по поисковому запросу
const filteredServices = computed(() => {
  if (!searchQuery.value) {
    return services.value;
  }
  
  const query = searchQuery.value.toLowerCase();
  return services.value.filter(service => 
    service.ServiceName.toLowerCase().includes(query) || 
    (service.Description && service.Description.toLowerCase().includes(query))
  );
});

// Загрузка данных при монтировании компонента
onMounted(async () => {
  try {
    await serviceStore.fetchServices();
  } catch (err) {
    error.value = 'Ошибка при загрузке услуг. Пожалуйста, попробуйте позже.';
    console.error('Ошибка при загрузке услуг:', err);
  }
});

// Повторная загрузка услуг
async function fetchServices() {
  error.value = null;
  try {
    await serviceStore.fetchServices();
  } catch (err) {
    error.value = 'Ошибка при загрузке услуг. Пожалуйста, попробуйте позже.';
    console.error('Ошибка при загрузке услуг:', err);
  }
}

// Открытие модального окна создания расширенной услуги
function openCreateServiceModal() {
  currentService.value = {};
  isEditing.value = false;
  showServiceModal.value = true;
}

// Открытие модального окна создания простой услуги
function openCreateSimpleServiceModal() {
  // Создаем простую услугу с предустановленными параметрами
  currentService.value = {
    // Предустановленный флаг "Требуется дата посещения"
    IsNeedVisitDate: true,
    // Скрываем остальные флаги и поля
    IsNeedVisitTime: false,
    // Устанавливаем тип услуги как простая
    IsSimpleService: true
  };
  isEditing.value = false;
  showServiceModal.value = true;
}

// Редактирование услуги
async function editService(service) {
  try {
    // Загружаем полные данные услуги перед редактированием
    const fullService = await serviceStore.getServiceById(service.ServiceId);
    currentService.value = fullService;
    isEditing.value = true;
    showServiceModal.value = true;
  } catch (err) {
    console.error('Ошибка при загрузке данных услуги для редактирования:', err);
    alert('Не удалось загрузить данные услуги для редактирования. Пожалуйста, попробуйте позже.');
  }
}

// Подтверждение удаления услуги
function confirmDeleteService(service) {
  serviceToDelete.value = service;
  showDeleteConfirmModal.value = true;
}

// Обработка сохранения услуги
async function handleSaveService(serviceData, isEdit) {
  try {
    if (isEdit) {
      await serviceStore.updateService(serviceData);
    } else {
      await serviceStore.createService(serviceData);
    }
    showServiceModal.value = false;
  } catch (error) {
    console.error('Ошибка при сохранении услуги:', error);
    alert('Не удалось сохранить услугу. Пожалуйста, проверьте введенные данные и попробуйте снова.');
  }
}

// Удаление услуги
async function deleteService() {
  if (!serviceToDelete.value) return;
  
  try {
    // Удаление услуги через хранилище
    await serviceStore.deleteService(serviceToDelete.value.ServiceId);
    
    // Закрытие модального окна при успешном удалении
    showDeleteConfirmModal.value = false;
    serviceToDelete.value = null;
  } catch (error) {
    console.error('Ошибка при удалении услуги:', error);
    alert('Не удалось удалить услугу. Пожалуйста, попробуйте позже.');
  }
}
</script>

<style scoped>
/* Стили для строк таблицы */
.service-row {
  cursor: pointer;
  transition: background-color 0.2s;
}

.service-row:hover {
  background-color: var(--admin-bg-hover, #f0f4f8);
}

/* Стили для ячейки с описанием */
.description-cell {
  max-width: 250px;
}

.truncated-text {
  max-height: 60px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  line-height: 1.4;
}

/* Стили для информации о ценах */
.price-info, .objects-info, .categories-info {
  max-height: 120px;
  overflow-y: auto;
}

.price-item, .object-item, .category-item {
  padding: 2px 0;
  border-bottom: 1px dashed var(--admin-border-color, #e2e8f0);
}

.price-item:last-child, .object-item:last-child, .category-item:last-child {
  border-bottom: none;
}
</style>
