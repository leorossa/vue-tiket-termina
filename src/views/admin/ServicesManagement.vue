<template>
  <div class="admin-container">
    <div class="admin-card">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h2 class="admin-section-title">Управление услугами</h2>
        <button @click="openCreateServiceModal" class="admin-button primary">
          Добавить услугу
        </button>
      </div>

      <!-- Фильтры и поиск -->
      <div class="admin-form-grid mb-4">
        <div class="admin-form-group">
          <label for="searchService">Поиск:</label>
          <input
            id="searchService"
            v-model="searchQuery"
            type="text"
            placeholder="Введите название услуги"
            class="admin-input"
          />
        </div>
      </div>

      <!-- Список услуг -->
      <ServiceList 
        :services="filteredServices" 
        :loading="loading" 
        @edit="editService" 
        @delete="confirmDeleteService"
      />

    </div>

    <!-- Модальное окно создания/редактирования услуги -->
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
import { ref, reactive, computed, onMounted } from 'vue';
import { useServiceStore } from '@/stores/serviceStore';
import ServiceList from '@/components/admin/ServiceList.vue';
import ServiceForm from '@/components/admin/ServiceForm.vue';
import DeleteConfirmation from '@/components/admin/DeleteConfirmation.vue';

// Инициализация хранилища услуг
const serviceStore = useServiceStore();

// Инициализация состояния компонента
const searchQuery = ref('');
const showServiceModal = ref(false);
const showDeleteConfirmModal = ref(false);
const isEditing = ref(false);
const serviceToDelete = ref(null);

// Данные текущей услуги для формы
const currentService = ref(null);

// Получение данных из хранилища
const services = computed(() => serviceStore.getAllServices);
const loading = computed(() => serviceStore.isLoading);

// Отфильтрованные услуги
const filteredServices = computed(() => {
  if (!searchQuery.value) return services.value;
  
  const query = searchQuery.value.toLowerCase();
  return services.value.filter(service => 
    service.ServiceName.toLowerCase().includes(query)
  );
});

// Загрузка данных при монтировании компонента
onMounted(async () => {
  try {
    await serviceStore.fetchServices();
  } catch (error) {
    console.error('Ошибка при загрузке данных:', error);
  }
});

// Функция открытия модального окна создания услуги
function openCreateServiceModal() {
  // Сброс формы перед созданием новой услуги
  currentService.value = {};
  isEditing.value = false;
  showServiceModal.value = true;
}

// Функция редактирования услуги
function editService(service) {
  // Устанавливаем текущую услугу для редактирования
  currentService.value = service;
  isEditing.value = true;
  showServiceModal.value = true;
}

function confirmDeleteService(service) {
  serviceToDelete.value = service;
  showDeleteConfirmModal.value = true;
}

// Функция обработки сохранения услуги из компонента ServiceForm
async function handleSaveService(serviceData, isEdit) {
  try {
    console.log('Получены данные для сохранения:', serviceData, 'Редактирование:', isEdit);
    
    let result;
    if (isEdit) {
      // Обновление существующей услуги через хранилище
      const serviceId = serviceData.ServiceId;
      if (!serviceId) {
        throw new Error('Отсутствует ID услуги для обновления');
      }
      result = await serviceStore.updateService(serviceId, serviceData);
    } else {
      // Создание новой услуги через хранилище
      result = await serviceStore.addService(serviceData);
    }
    
    if (result.success) {
      // Закрытие модального окна при успешном сохранении
      showServiceModal.value = false;
      // Обновляем список услуг после успешного сохранения
      await serviceStore.fetchServices();
    } else {
      // Обработка ошибки
      console.error('Ошибка при сохранении услуги:', result.error);
    }
  } catch (error) {
    console.error('Ошибка при сохранении услуги:', error);
  }
}

async function deleteService() {
  try {
    if (!serviceToDelete.value) return;
    
    // Удаление услуги через хранилище
    const result = await serviceStore.deleteService(serviceToDelete.value.ServiceId);
    
    if (result.success) {
      // Закрытие модального окна при успешном удалении
      showDeleteConfirmModal.value = false;
      serviceToDelete.value = null;
    } else {
      // Обработка ошибки
      console.error('Ошибка при удалении услуги:', result.error);
      // Здесь можно добавить отображение уведомления об ошибке
    }
  } catch (error) {
    console.error('Ошибка при удалении услуги:', error);
  }
}
</script>
