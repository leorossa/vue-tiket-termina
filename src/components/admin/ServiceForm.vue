<template>
  <div class="admin-modal-backdrop" @click.self="$emit('close')">
    <div class="admin-modal">
      <div class="admin-modal-header">
        <h3 class="admin-modal-title">{{ isEditing ? 'Редактирование услуги' : 'Создание новой услуги' }}</h3>
        <button @click="$emit('close')" class="admin-button secondary icon">✕</button>
      </div>
      <div class="admin-modal-body">
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
            <label for="serviceCost">Стоимость:</label>
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
            <div class="d-flex flex-column">
              <label class="d-flex align-items-center mb-2">
                <input type="checkbox" v-model="formData.isNeedVisitDate" class="admin-checkbox" />
                <span>Требуется дата посещения</span>
              </label>
              <label class="d-flex align-items-center mb-2">
                <input type="checkbox" v-model="formData.isNeedVisitTime" class="admin-checkbox" />
                <span>Требуется время посещения</span>
              </label>
              <label class="d-flex align-items-center mb-2">
                <input type="checkbox" v-model="formData.isVisitObjectUseForCost" class="admin-checkbox" />
                <span>Объект посещения влияет на стоимость</span>
              </label>
              <label class="d-flex align-items-center mb-2">
                <input type="checkbox" v-model="formData.isCategoryVisitorUseForCost" class="admin-checkbox" />
                <span>Категория посетителя влияет на стоимость</span>
              </label>
              <label class="d-flex align-items-center mb-2">
                <input type="checkbox" v-model="formData.isVisitorCountUseForCost" class="admin-checkbox" />
                <span>Количество посетителей влияет на стоимость</span>
              </label>
              <label class="d-flex align-items-center mb-2">
                <input type="checkbox" v-model="formData.isUseOneCategory" class="admin-checkbox" />
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
        </form>
      </div>
      <div class="admin-modal-footer">
        <button @click="$emit('close')" class="admin-button secondary">Отмена</button>
        <button @click="saveService" class="admin-button primary">Сохранить</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, watch } from 'vue';

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

// Определение событий
const emit = defineEmits(['close', 'save']);

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
  isPROCultureChecked: false
});

// Наблюдение за изменением входных данных
watch(() => props.service, (newService) => {
  if (newService) {
    console.log('Получены данные услуги для редактирования:', newService);
    Object.assign(formData, {
      serviceId: newService.ServiceId,
      serviceName: newService.ServiceName,
      description: newService.Comment || '',
      cost: newService.Cost || 0,
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
      isPROCultureChecked: newService.IsPROCultureChecked || newService.ProCultureChecked || false
    });
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
      IsNeedVisitDate: formData.isNeedVisitDate,
      IsNeedVisitTime: formData.isNeedVisitTime,
      DtBegin: formData.dtBegin ? new Date(formData.dtBegin).toISOString() : null,
      DtEnd: formData.dtEnd ? new Date(formData.dtEnd).toISOString() : null,
      ProCultureIdentifier: formData.proCultureIdentifier,
      IsPROCultureChecked: formData.isPROCultureChecked,
      IsDisableEditVisitObject: false, // Значение по умолчанию
      IsDisableEditVisitor: false, // Значение по умолчанию
      IsVisitObjectUseForCost: formData.isVisitObjectUseForCost,
      IsCategoryVisitorUseForCost: formData.isCategoryVisitorUseForCost,
      IsVisitorCountUseForCost: formData.isVisitorCountUseForCost,
      IsUseOneCategory: formData.isUseOneCategory
    };
    
    // Отправка данных родительскому компоненту
    emit('save', serviceData, props.isEditing);
  } catch (error) {
    console.error('Ошибка при сохранении услуги:', error);
  }
}
</script>
