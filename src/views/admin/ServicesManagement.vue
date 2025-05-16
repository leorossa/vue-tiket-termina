<template>
  <div class="admin-container">
    <div class="admin-header">
      <h1 class="admin-title">Управление услугами</h1>
      <button @click="openCreateServiceModal" class="admin-button primary">
        <i class="fas fa-plus"></i> Добавить услугу
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
      <button @click="openCreateServiceModal" class="admin-button primary">
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
          <tr v-for="service in filteredServices" :key="service.ServiceId">
            <td>{{ service.ServiceName }}</td>
            <td>{{ service.Description || 'Нет описания' }}</td>
            <td>{{ service.Cost }} руб.</td>
            <td>
              <span class="admin-badge" v-if="service.VisitObjectCount">
                {{ service.VisitObjectCount }}
              </span>
              <span v-else>Нет</span>
            </td>
            <td>
              <span class="admin-badge" v-if="service.CategoryVisitorCount">
                {{ service.CategoryVisitorCount }}
              </span>
              <span v-else>Нет</span>
            </td>
            <td>
              <div class="admin-actions">
                <button @click="editService(service)" class="admin-button secondary sm">
                  <i class="fas fa-edit"></i>
                </button>
                <button @click="confirmDeleteService(service)" class="admin-button danger sm">
                  <i class="fas fa-trash"></i>
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

// Стор услуг
const serviceStore = useServiceStore();

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

// Открытие модального окна создания услуги
function openCreateServiceModal() {
  currentService.value = {};
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
