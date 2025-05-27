<template>
  <div class="admin-modal-backdrop" @click.self="$emit('close')">
    <div class="admin-modal admin-modal-lg">
      <div class="admin-modal-header">
        <h3 class="admin-modal-title">{{ isEditing ? 'Редактирование услуги' : 'Создание новой услуги' }}</h3>
        <button @click="$emit('close')" class="admin-button secondary icon">✕</button>
      </div>
      <div class="admin-modal-body">
        <div class="admin-tabs">
          <div 
            :class="['admin-tab', { active: activeTab === 'main' }]" 
            @click="activeTab = 'main'"
          >
            Основные данные
          </div>
          <!-- Для простой услуги оставляем все вкладки -->
          <div 
            :class="['admin-tab', { active: activeTab === 'objects' }]" 
            @click="activeTab = 'objects'"
          >
            Объекты посещения
          </div>
          <div 
            :class="['admin-tab', { active: activeTab === 'categories' }]" 
            @click="activeTab = 'categories'"
          >
            Категории посетителей
          </div>
          <div 
            :class="['admin-tab', { active: activeTab === 'prices' }]" 
            @click="activeTab = 'prices'"
          >
            Цены
          </div>
        </div>
        
        <div class="admin-tab-content">
          <!-- Основные данные -->
          <div v-show="activeTab === 'main'">
            <form @submit.prevent="saveService">
              <!-- Основная информация -->
              <div class="admin-form-group">
                <label for="serviceName">Название услуги:</label>
                <input
                  id="serviceName"
                  v-model="formData.serviceName"
                  type="text"
                  required
                  class="admin-input"
                />
              </div>
              
              <div class="admin-form-group">
                <label for="serviceDescription">Описание:</label>
                <textarea
                  id="serviceDescription"
                  v-model="formData.description"
                  class="admin-textarea"
                ></textarea>
              </div>
              
              <div class="admin-form-group">
                <label for="serviceCost">Базовая стоимость:</label>
                <input
                  id="serviceCost"
                  v-model="formData.cost"
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
                <div class="admin-checkbox-grid">
                  <!-- Для простой услуги скрываем чекбокс даты посещения, он всегда включен -->
                  <template v-if="!isSimpleService">
                    <label class="admin-checkbox-item">
                      <input type="checkbox" v-model="formData.isNeedVisitDate" class="admin-checkbox" />
                      <span>Требуется дата посещения</span>
                    </label>
                  </template>
                  <!-- Для простой услуги скрываем остальные настройки -->
                  <template v-if="!isSimpleService">
                    <label class="admin-checkbox-item">
                      <input type="checkbox" v-model="formData.isNeedVisitTime" class="admin-checkbox" />
                      <span>Требуется время посещения</span>
                    </label>
                    <label class="admin-checkbox-item">
                      <input type="checkbox" v-model="formData.isPROCultureChecked" class="admin-checkbox" />
                      <span>Проверено в PRO.Культура</span>
                    </label>
                    <label class="admin-checkbox-item">
                      <input type="checkbox" v-model="formData.isDisableEditVisitObject" class="admin-checkbox" />
                      <span>Запретить редактирование объекта</span>
                    </label>
                    <label class="admin-checkbox-item">
                      <input type="checkbox" v-model="formData.isDisableEditVisitor" class="admin-checkbox" />
                      <span>Запретить редактирование посетителя</span>
                    </label>
                  </template>
                </div>
              </div>

              <!-- Параметры расчета стоимости (скрываем для простой услуги) -->
              <div class="admin-form-group" v-if="!isSimpleService">
                <label>Параметры расчета стоимости:</label>
                <div class="admin-checkbox-grid">
                  <label class="admin-checkbox-item">
                    <input type="checkbox" v-model="formData.isVisitObjectUseForCost" class="admin-checkbox" />
                    <span>Объект влияет на стоимость</span>
                  </label>
                  <label class="admin-checkbox-item">
                    <input type="checkbox" v-model="formData.isCategoryVisitorUseForCost" class="admin-checkbox" />
                    <span>Категория влияет на стоимость</span>
                  </label>
                  <label class="admin-checkbox-item">
                    <input type="checkbox" v-model="formData.isVisitorCountUseForCost" class="admin-checkbox" />
                    <span>Количество влияет на стоимость</span>
                  </label>
                  <label class="admin-checkbox-item">
                    <input type="checkbox" v-model="formData.isUseOneCategory" class="admin-checkbox" />
                    <span>Использовать только одну категорию</span>
                  </label>
                </div>
              </div>

              <!-- Период действия услуги (скрываем для простой услуги) -->
              <div class="admin-form-group" v-if="!isSimpleService">
                <label>Период действия услуги:</label>
                <div class="d-flex gap-2">
                  <div class="flex-grow-1">
                    <label for="dtBegin">Дата начала:</label>
                    <input 
                      id="dtBegin" 
                      v-model="formData.dtBegin" 
                      type="date" 
                      class="admin-input"
                    />
                  </div>
                  <div class="flex-grow-1">
                    <label for="dtEnd">Дата окончания:</label>
                    <input 
                      id="dtEnd" 
                      v-model="formData.dtEnd" 
                      type="date" 
                      class="admin-input"
                    />
                  </div>
                </div>
              </div>

              <!-- PRO.Культура (скрываем для простой услуги) -->
              <div class="admin-form-group" v-if="!isSimpleService">
                <label for="proCultureIdentifier">ID в PRO.Культура:</label>
                <input
                  id="proCultureIdentifier"
                  v-model="formData.proCultureIdentifier"
                  type="number"
                  class="admin-input"
                />
              </div>
            </form>
          </div>
          
          <!-- Объекты посещения -->
          <div v-show="activeTab === 'objects'">
            <VisitObjectSelector v-model="selectedVisitObjects" />
          </div>
          
          <!-- Категории посетителей -->
          <div v-show="activeTab === 'categories'">
            <CategoryVisitorSelector 
              v-model="selectedCategoryVisitors" 
              :is-one-category-mode="formData.isUseOneCategory" 
            />
          </div>
          
          <!-- Цены -->
          <div v-show="activeTab === 'prices'">
            <PriceMatrix 
              v-model="selectedPrices" 
              :visit-objects="selectedVisitObjects" 
              :category-visitors="selectedCategoryVisitors" 
              :base-cost="parseFloat(formData.cost)" 
            />
          </div>
        </div>
      </div>
      <div class="admin-modal-footer">
        <button @click="$emit('close')" class="admin-button secondary">Отмена</button>
        <button @click="saveService" class="admin-button primary">Сохранить</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, watch, onMounted } from 'vue';
import VisitObjectSelector from '@/components/admin/VisitObjectSelector.vue';
import CategoryVisitorSelector from '@/components/admin/CategoryVisitorSelector.vue';
import PriceMatrix from '@/components/admin/PriceMatrix.vue';

// Определение входных параметров
const props = defineProps({
  service: {
    type: Object,
    default: () => ({})
  },
  isEditing: {
    type: Boolean,
    default: false
  }
});

// Проверка, является ли услуга простой
const isSimpleService = computed(() => props.service && props.service.IsSimpleService);

// Определение событий
const emit = defineEmits(['close', 'save']);

// Состояния компонента
const activeTab = ref('main'); // Активная вкладка
const selectedVisitObjects = ref([]); // Выбранные объекты посещения
const selectedCategoryVisitors = ref([]); // Выбранные категории посетителей
const selectedPrices = ref([]); // Выбранные цены

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

// Данные формы
const formData = reactive({
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
  isPROCultureChecked: false,
  isDisableEditVisitObject: false,
  isDisableEditVisitor: false
});

// Наблюдение за изменением входных данных
watch(() => props.service, (newService) => {
  if (newService) {
    console.log('Получены данные услуги для редактирования:', newService);
    
    // Заполняем основные данные услуги
    Object.assign(formData, {
      serviceId: newService.ServiceId,
      serviceName: newService.ServiceName,
      // Используем Description или Comment для обратной совместимости
      description: newService.Description || newService.Comment || '',
      cost: newService.Cost !== undefined ? parseFloat(newService.Cost) : 0,
      activeKindId: newService.ActiveKindId || 1,
      isVisitObjectUseForCost: newService.IsVisitObjectUseForCost || false,
      isCategoryVisitorUseForCost: newService.IsCategoryVisitorUseForCost || false,
      isVisitorCountUseForCost: newService.IsVisitorCountUseForCost || false,
      isUseOneCategory: newService.IsUseOneCategory || false,
      isNeedVisitDate: newService.IsNeedVisitDate || false,
      isNeedVisitTime: newService.IsNeedVisitTime || false,
      dtBegin: formatDateForInput(newService.DtBegin || newService.dtBegin) || '',
      dtEnd: formatDateForInput(newService.DtEnd || newService.dtEnd) || '',
      proCultureIdentifier: newService.ProCultureIdentifier || null,
      isPROCultureChecked: newService.IsPROCultureChecked || newService.ProCultureChecked || false,
      isDisableEditVisitObject: newService.IsDisableEditVisitObject || false,
      isDisableEditVisitor: newService.IsDisableEditVisitor || false
    });
    
    // Заполняем связанные данные
    if (newService.VisitObject) {
      selectedVisitObjects.value = newService.VisitObject;
    }
    
    if (newService.CategoryVisitor) {
      selectedCategoryVisitors.value = newService.CategoryVisitor;
    }
    
    if (newService.Price) {
      selectedPrices.value = newService.Price;
    }
  }
}, { immediate: true, deep: true });

// Функция сохранения услуги
function saveService() {
  try {
    // Подготовка данных для сохранения
    // Создаем объект с учетом структуры DTO на бэкенде
    const serviceData = {
      // Для обновления нужен ID, но он не входит в DTO
      ServiceId: props.isEditing ? formData.serviceId : undefined,
      // Поля из ServiceCreateDto
      ServiceName: formData.serviceName,
      Description: formData.description,
      Cost: parseFloat(formData.cost),
      ActiveKindId: formData.activeKindId,
      // Для простой услуги всегда устанавливаем IsNeedVisitDate = true
      IsNeedVisitDate: isSimpleService.value ? true : formData.isNeedVisitDate,
      IsNeedVisitTime: formData.isNeedVisitTime,
      DtBegin: formData.dtBegin ? new Date(formData.dtBegin).toISOString() : null,
      DtEnd: formData.dtEnd ? new Date(formData.dtEnd).toISOString() : null,
      ProCultureIdentifier: formData.proCultureIdentifier,
      IsPROCultureChecked: formData.isPROCultureChecked,
      IsDisableEditVisitObject: formData.isDisableEditVisitObject,
      IsDisableEditVisitor: formData.isDisableEditVisitor,
      IsVisitObjectUseForCost: formData.isVisitObjectUseForCost,
      IsCategoryVisitorUseForCost: formData.isCategoryVisitorUseForCost,
      IsVisitorCountUseForCost: formData.isVisitorCountUseForCost,
      IsUseOneCategory: formData.isUseOneCategory,
      // Сохраняем флаг простой услуги
      IsSimpleService: isSimpleService.value,
      // Связанные объекты
      VisitObject: selectedVisitObjects.value,
      CategoryVisitor: selectedCategoryVisitors.value,
      Price: selectedPrices.value
    };
    
    console.log('Отправка данных услуги:', serviceData);
    
    // Отправка данных родительскому компоненту
    emit('save', serviceData, props.isEditing);
  } catch (error) {
    console.error('Ошибка при сохранении услуги:', error);
  }
}
</script>

<style scoped>
</style>
