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

      <!-- Таблица услуг -->
      <div v-if="loading" class="text-center p-4">
        <p>Загрузка данных...</p>
      </div>
      <div v-else class="admin-table-responsive">
        <table class="admin-table" v-if="filteredServices.length > 0">
          <thead>
            <tr>
              <th>ID</th>
              <th>Название</th>
              <th>Объекты посещения</th>
              <th>Категории посетителей</th>
              <th>Действия</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="service in filteredServices" :key="service.serviceId">
              <td>{{ service.serviceId }}</td>
              <td>{{ service.serviceName }}</td>
              <td>
                <div class="admin-badge primary" v-for="obj in (service.visitObjects || []).filter(o => o.isRequire)" :key="obj.visitObjectId">
                  {{ obj.visitObjectName }}
                </div>
                <span v-if="!(service.visitObjects || []).some(o => o.isRequire)">-</span>
              </td>
              <td>
                <div class="admin-badge primary" v-for="category in (service.categoryVisitor || [])" :key="category.categoryVisitorId">
                  {{ category.categoryVisitorName }}
                </div>
              </td>
              <td>
                <div class="admin-button-group">
                  <button @click="editService(service)" class="admin-button secondary">
                    Редактировать
                  </button>
                  <button @click="confirmDeleteService(service)" class="admin-button danger">
                    Удалить
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
        <div v-else class="text-center p-4">
          <p>Услуги не найдены. Создайте новую услугу.</p>
        </div>
      </div>
    </div>

    <!-- Модальное окно создания/редактирования услуги -->
    <div v-if="showServiceModal" class="admin-modal-backdrop" @click.self="showServiceModal = false">
      <div class="admin-modal">
        <div class="admin-modal-header">
          <h3 class="admin-modal-title">{{ isEditing ? 'Редактирование услуги' : 'Создание новой услуги' }}</h3>
          <button @click="showServiceModal = false" class="admin-button secondary icon">✕</button>
        </div>
        <div class="admin-modal-body">
          <form @submit.prevent="saveService">
            <!-- Основная информация -->
            <div class="admin-form-group">
              <label for="serviceName">Название услуги:</label>
              <input
                id="serviceName"
                v-model="currentService.serviceName"
                type="text"
                required
                class="admin-input"
              />
            </div>
            
            <div class="admin-form-group">
              <label for="serviceDescription">Описание:</label>
              <textarea
                id="serviceDescription"
                v-model="currentService.description"
                class="admin-textarea"
              ></textarea>
            </div>

            <!-- Настройки услуги -->
            <div class="admin-form-group">
              <label>Настройки услуги:</label>
              <div class="d-flex flex-column">
                <label class="d-flex align-items-center mb-2">
                  <input type="checkbox" v-model="currentService.isNeedVisitDate" class="admin-checkbox" />
                  <span>Требуется дата посещения</span>
                </label>
                <label class="d-flex align-items-center mb-2">
                  <input type="checkbox" v-model="currentService.isNeedVisitTime" class="admin-checkbox" />
                  <span>Требуется время посещения</span>
                </label>
                <label class="d-flex align-items-center mb-2">
                  <input type="checkbox" v-model="currentService.isVisitObjectUseForCost" class="admin-checkbox" />
                  <span>Объект посещения влияет на стоимость</span>
                </label>
                <label class="d-flex align-items-center mb-2">
                  <input type="checkbox" v-model="currentService.isCategoryVisitorUseForCost" class="admin-checkbox" />
                  <span>Категория посетителя влияет на стоимость</span>
                </label>
                <label class="d-flex align-items-center mb-2">
                  <input type="checkbox" v-model="currentService.isVisitorCountUseForCost" class="admin-checkbox" />
                  <span>Количество посетителей влияет на стоимость</span>
                </label>
                <label class="d-flex align-items-center">
                  <input type="checkbox" v-model="currentService.isUseOneCategory" class="admin-checkbox" />
                  <span>Использовать только одну категорию</span>
                </label>
              </div>
            </div>

            <!-- Объекты посещения -->
            <div class="admin-form-group">
              <label>Объекты посещения:</label>
              <div v-if="availableData.visitObjects && availableData.visitObjects.length > 0" class="admin-card">
                <div v-for="obj in availableData.visitObjects" :key="obj.visitObjectId" class="d-flex align-items-center mb-2">
                  <input
                    type="checkbox"
                    :id="`visitObject_${obj.visitObjectId}`"
                    :value="obj.visitObjectId"
                    v-model="selectedVisitObjects"
                    class="admin-checkbox"
                  />
                  <label :for="`visitObject_${obj.visitObjectId}`" class="ml-2">{{ obj.visitObjectName }}</label>
                </div>
              </div>
              <div v-else class="text-center p-3">
                <p>Нет доступных объектов посещения</p>
              </div>
            </div>

            <!-- Категории посетителей и цены -->
            <div class="admin-form-group">
              <label>Категории посетителей и цены:</label>
              <div v-if="availableData.categoryVisitor && availableData.categoryVisitor.length > 0" class="admin-card">
                <div v-for="category in availableData.categoryVisitor" :key="category.categoryVisitorId" class="mb-3 p-2 border-bottom">
                  <div class="d-flex align-items-center mb-2">
                    <input
                      type="checkbox"
                      :id="`category_${category.categoryVisitorId}`"
                      :value="category.categoryVisitorId"
                      v-model="selectedCategories"
                      class="admin-checkbox"
                    />
                    <label :for="`category_${category.categoryVisitorId}`" class="ml-2">{{ category.categoryVisitorName }}</label>
                  </div>
                  <div v-if="selectedCategories.includes(category.categoryVisitorId)" class="admin-form-group ml-4">
                    <label :for="`price_${category.categoryVisitorId}`">Цена:</label>
                    <input
                      :id="`price_${category.categoryVisitorId}`"
                      type="number"
                      min="0"
                      v-model="categoryPrices[category.categoryVisitorId]"
                      class="admin-input"
                    />
                  </div>
                </div>
              </div>
              <div v-else class="text-center p-3">
                <p>Нет доступных категорий посетителей</p>
              </div>
            </div>

            <!-- Период действия -->
            <div class="admin-form-group">
              <label>Период действия:</label>
              <div class="admin-form-grid">
                <div class="admin-form-group">
                  <label for="dtBegin">Дата начала:</label>
                  <input
                    id="dtBegin"
                    type="datetime-local"
                    v-model="currentService.dtBegin"
                    class="admin-input"
                  />
                </div>
                <div class="admin-form-group">
                  <label for="dtEnd">Дата окончания:</label>
                  <input
                    id="dtEnd"
                    type="datetime-local"
                    v-model="currentService.dtEnd"
                    class="admin-input"
                  />
                </div>
              </div>
            </div>
          </form>
        </div>
        <div class="admin-modal-footer">
          <button @click="showServiceModal = false" class="admin-button secondary">Отмена</button>
          <button @click="saveService" class="admin-button primary">Сохранить</button>
        </div>
      </div>
    </div>

    <!-- Модальное окно подтверждения удаления -->
    <div v-if="showDeleteConfirmModal" class="admin-modal-backdrop" @click.self="showDeleteConfirmModal = false">
      <div class="admin-modal">
        <div class="admin-modal-header">
          <h3 class="admin-modal-title">Подтверждение удаления</h3>
          <button @click="showDeleteConfirmModal = false" class="admin-button secondary icon">✕</button>
        </div>
        <div class="admin-modal-body">
          <p>Вы уверены, что хотите удалить услугу "{{ serviceToDelete?.serviceName }}"?</p>
          <p class="text-danger">Это действие нельзя отменить.</p>
        </div>
        <div class="admin-modal-footer">
          <button @click="showDeleteConfirmModal = false" class="admin-button secondary">Отмена</button>
          <button @click="deleteService" class="admin-button danger">Удалить</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, reactive } from 'vue';
import { useServiceStore } from '@/stores/serviceStore';

// Инициализация хранилища услуг
const serviceStore = useServiceStore();

// Локальное состояние компонента
const searchQuery = ref('');
const showServiceModal = ref(false);
const showDeleteConfirmModal = ref(false);
const isEditing = ref(false);
const serviceToDelete = ref(null);

// Текущая редактируемая услуга
const currentService = reactive({
  serviceId: null,
  serviceName: '',
  description: '',
  cost: 0,
  activeKindId: 1, // Значение по умолчанию
  isDisableEditVisitObject: false,
  isDisableEditVisitor: false,
  isVisitObjectUseForCost: false,
  isCategoryVisitorUseForCost: false,
  isVisitorCountUseForCost: false,
  isUseOneCategory: false,
  isNeedVisitDate: false,
  isNeedVisitTime: false,
  dtBegin: '',
  dtEnd: '',
  proCultureIdentifier: null,
  isPROCultureChecked: false
});

// Выбранные объекты и категории
const selectedVisitObjects = ref([]);
const selectedCategories = ref([]);
const categoryPrices = ref({});

// Получение данных из хранилища
const services = computed(() => serviceStore.getAllServices);
const loading = computed(() => serviceStore.isLoading);

// Доступные данные для форм
const availableData = computed(() => ({
  visitObjects: serviceStore.visitObjects,
  categoryVisitor: serviceStore.categoryVisitors,
  groupVisitObject: serviceStore.groupVisitObjects,
  groupCategoryVisitor: serviceStore.groupCategoryVisitors,
  seanceGrid: serviceStore.seanceGrids
}));

// Отфильтрованные услуги
const filteredServices = computed(() => {
  if (!searchQuery.value) return services.value;
  
  const query = searchQuery.value.toLowerCase();
  return services.value.filter(service => 
    service.serviceName.toLowerCase().includes(query)
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

// Методы для работы с услугами
function openCreateServiceModal() {
  // Сброс формы
  Object.assign(currentService, {
    serviceId: null,
    serviceName: '',
    description: '',
    cost: 0,
    activeKindId: 1,
    isDisableEditVisitObject: false,
    isDisableEditVisitor: false,
    isVisitObjectUseForCost: false,
    isCategoryVisitorUseForCost: false,
    isVisitorCountUseForCost: false,
    isUseOneCategory: false,
    isNeedVisitDate: false,
    isNeedVisitTime: false,
    dtBegin: '',
    dtEnd: '',
    proCultureIdentifier: null,
    isPROCultureChecked: false
  });
  
  selectedVisitObjects.value = [];
  selectedCategories.value = [];
  categoryPrices.value = {};
  
  isEditing.value = false;
  showServiceModal.value = true;
}

function editService(service) {
  // Копирование данных услуги в форму
  Object.assign(currentService, {
    serviceId: service.serviceId,
    serviceName: service.serviceName,
    description: service.description || '',
    cost: service.cost || 0,
    activeKindId: service.activeKindId || 1,
    isDisableEditVisitObject: service.isDisableEditVisitObject || false,
    isDisableEditVisitor: service.isDisableEditVisitor || false,
    isVisitObjectUseForCost: service.isVisitObjectUseForCost || false,
    isCategoryVisitorUseForCost: service.isCategoryVisitorUseForCost || false,
    isVisitorCountUseForCost: service.isVisitorCountUseForCost || false,
    isUseOneCategory: service.isUseOneCategory || false,
    isNeedVisitDate: service.isNeedVisitDate || false,
    isNeedVisitTime: service.isNeedVisitTime || false,
    dtBegin: service.dtBegin || '',
    dtEnd: service.dtEnd || '',
    proCultureIdentifier: service.proCultureIdentifier || null,
    isPROCultureChecked: service.isPROCultureChecked || false
  });
  
  // Заполнение выбранных объектов посещения
  selectedVisitObjects.value = service.visitObjects
    .filter(obj => obj.isRequire)
    .map(obj => obj.visitObjectId);
  
  // Заполнение выбранных категорий и цен
  selectedCategories.value = service.categoryVisitor.map(cat => cat.categoryVisitorId);
  
  // Заполнение цен для категорий
  categoryPrices.value = {};
  if (service.prices && service.prices.length > 0) {
    service.prices.forEach(price => {
      categoryPrices.value[price.categoryVisitorId] = price.price;
    });
  }
  
  isEditing.value = true;
  showServiceModal.value = true;
}

function confirmDeleteService(service) {
  serviceToDelete.value = service;
  showDeleteConfirmModal.value = true;
}

async function saveService() {
  try {
    // Подготовка данных для сохранения
    const serviceData = {
      ...currentService,
      // Преобразуем выбранные объекты и категории в формат, ожидаемый API
      visitObjects: availableData.value.visitObjects
        .filter(obj => selectedVisitObjects.value.includes(obj.visitObjectId))
        .map(obj => ({
          visitObjectId: obj.visitObjectId,
          isRequire: true
        })),
      categoryVisitor: availableData.value.categoryVisitor
        .filter(cat => selectedCategories.value.includes(cat.categoryVisitorId))
        .map(cat => ({
          categoryVisitorId: cat.categoryVisitorId,
          categoryVisitorName: cat.categoryVisitorName
        })),
      prices: selectedCategories.value.map(catId => ({
        categoryVisitorId: catId,
        price: parseFloat(categoryPrices.value[catId] || 0)
      }))
    };
    
    let result;
    if (isEditing.value) {
      // Обновление существующей услуги через хранилище
      result = await serviceStore.updateService(currentService.serviceId, serviceData);
    } else {
      // Создание новой услуги через хранилище
      result = await serviceStore.addService(serviceData);
    }
    
    if (result.success) {
      // Закрытие модального окна при успешном сохранении
      showServiceModal.value = false;
    } else {
      // Обработка ошибки
      console.error('Ошибка при сохранении услуги:', result.error);
      // Здесь можно добавить отображение уведомления об ошибке
    }
  } catch (error) {
    console.error('Ошибка при сохранении услуги:', error);
  }
}

async function deleteService() {
  try {
    if (!serviceToDelete.value) return;
    
    // Удаление услуги через хранилище
    const result = await serviceStore.deleteService(serviceToDelete.value.serviceId);
    
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
