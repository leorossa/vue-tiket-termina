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
              <th>Описание</th>
              <th>Стоимость</th>
              <th>Действия</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="service in filteredServices" :key="service.ServiceId">
              <td>{{ service.ServiceId }}</td>
              <td>{{ service.ServiceName }}</td>
              <td>{{ service.Comment || '-' }}</td>
              <td>{{ service.Cost || '-' }}</td>
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
            
            <div class="admin-form-group">
              <label for="serviceCost">Стоимость:</label>
              <input
                id="serviceCost"
                v-model="currentService.cost"
                type="number"
                step="0.01"
                min="0"
                required
                class="admin-input"
              />
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

            <!-- Период действия услуги -->
            <div class="admin-form-group">
              <label>Период действия услуги:</label>
              <div class="d-flex gap-2">
                <div class="flex-grow-1">
                  <label for="dtBegin">Дата начала:</label>
                  <input 
                    id="dtBegin" 
                    v-model="currentService.dtBegin" 
                    type="date" 
                    class="admin-input"
                  />
                </div>
                <div class="flex-grow-1">
                  <label for="dtEnd">Дата окончания:</label>
                  <input 
                    id="dtEnd" 
                    v-model="currentService.dtEnd" 
                    type="date" 
                    class="admin-input"
                  />
                </div>
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

// Инициализация состояния компонента
const searchQuery = ref('');
const showServiceModal = ref(false);
const showDeleteConfirmModal = ref(false);
const isEditing = ref(false);
const serviceToDelete = ref(null);

// Функция форматирования даты для инпута типа date
function formatDateForInput(dateString) {
  if (!dateString) return '';
  
  // Если дата уже в формате YYYY-MM-DD, вернуть как есть
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
    return dateString;
  }
  
  // Попытка преобразовать в формат YYYY-MM-DD
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '';
    
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    
    return `${year}-${month}-${day}`;
  } catch (e) {
    console.error('Ошибка при преобразовании даты:', e);
    return '';
  }
}

// Данные текущей услуги для формы
const currentService = reactive({
  serviceId: null,
  serviceName: '',
  description: '',
  cost: 0,
  activeKindId: 1,
  isVisitObjectUseForCost: true,
  isCategoryVisitorUseForCost: true,
  isVisitorCountUseForCost: true,
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

// Методы для работы с услугами
function openCreateServiceModal() {
  // Сброс формы
  Object.assign(currentService, {
    serviceId: null,
    serviceName: '',
    description: '',
    cost: 0,
    activeKindId: 1,
    isVisitObjectUseForCost: true,
    isCategoryVisitorUseForCost: true,
    isVisitorCountUseForCost: true,
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
    serviceId: service.ServiceId,
    serviceName: service.ServiceName,
    description: service.Comment || '',
    cost: service.Cost || 0,
    activeKindId: service.ActiveKindId || 1,
    isVisitObjectUseForCost: service.IsVisitObjectUseForCost || false,
    isCategoryVisitorUseForCost: service.IsCategoryVisitorUseForCost || false,
    isVisitorCountUseForCost: service.IsVisitorCountUseForCost || false,
    isUseOneCategory: service.IsUseOneCategory || false,
    isNeedVisitDate: service.IsNeedVisitDate || false,
    isNeedVisitTime: service.IsNeedVisitTime || false,
    dtBegin: formatDateForInput(service.dtBegin) || '',
    dtEnd: formatDateForInput(service.dtEnd) || '',
    proCultureIdentifier: service.ProCultureIdentifier || null,
    isPROCultureChecked: service.ProCultureChecked || false
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
  console.log('Подтверждение удаления услуги:', service.ServiceId, service.ServiceName);
}

async function saveService() {
  try {
    // Подготовка данных для сохранения
    const serviceData = {
      ServiceId: currentService.serviceId,
      ServiceName: currentService.serviceName,
      Comment: currentService.description,
      Cost: parseFloat(currentService.cost),
      ActiveKindId: currentService.activeKindId,
      IsVisitObjectUseForCost: currentService.isVisitObjectUseForCost,
      IsCategoryVisitorUseForCost: currentService.isCategoryVisitorUseForCost,
      IsVisitorCountUseForCost: currentService.isVisitorCountUseForCost,
      IsUseOneCategory: currentService.isUseOneCategory,
      IsNeedVisitDate: currentService.isNeedVisitDate,
      IsNeedVisitTime: currentService.isNeedVisitTime,
      dtBegin: currentService.dtBegin,
      dtEnd: currentService.dtEnd,
      ProCultureIdentifier: currentService.proCultureIdentifier,
      ProCultureChecked: currentService.isPROCultureChecked
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
