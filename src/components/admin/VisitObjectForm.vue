<template>
  <div class="admin-modal-overlay" @click.self="$emit('cancel')">
    <div class="admin-modal">
      <div class="admin-modal-header">
        <h2>{{ isEditing ? 'Редактирование объекта' : 'Создание нового объекта' }}</h2>
        <button @click="$emit('cancel')" class="admin-modal-close">&times;</button>
      </div>
      
      <div class="admin-modal-body">
        <form @submit.prevent="saveObject">
          <div class="admin-form-group">
            <label for="objectName">Название объекта</label>
            <input 
              id="objectName" 
              v-model="formData.visitObjectName" 
              type="text" 
              class="admin-input" 
              required
            />
          </div>
          
          <div class="admin-form-group">
            <label for="address">Адрес</label>
            <input 
              id="address" 
              v-model="formData.address" 
              type="text" 
              class="admin-input"
            />
          </div>
          
          <div class="admin-form-group">
            <label for="comment">Описание</label>
            <textarea 
              id="comment" 
              v-model="formData.comment" 
              class="admin-textarea"
            ></textarea>
          </div>
          
          <!--
          <div class="admin-form-group">
            <label for="groupId">Группа объектов</label>
            <select 
              id="groupId" 
              v-model="formData.groupVisitObjectId" 
              class="admin-select"
            >
              <option value="">Не выбрано</option>
              <option 
                v-for="group in groupVisitObjects" 
                :key="group.GroupVisitObjectId" 
                :value="group.GroupVisitObjectId"
              >
                {{ group.GroupVisitObjectName }}
              </option>
            </select>
          </div>
          -->
          
          <div class="admin-form-group">
            <label for="categoryId">Категория посетителей</label>
            <select 
              id="categoryId" 
              v-model="formData.categoryVisitorId" 
              class="admin-select"
            >
              <option value="">Не выбрано</option>
              <option 
                v-for="category in categoryVisitors" 
                :key="category.CategoryVisitorId" 
                :value="category.CategoryVisitorId"
              >
                {{ category.CategoryVisitorName }}
              </option>
            </select>
          </div>
          
          <div class="admin-modal-footer">
            <button type="button" @click="$emit('cancel')" class="admin-button secondary">
              Отмена
            </button>
            <button type="submit" class="admin-button primary">
              {{ isEditing ? 'Сохранить' : 'Создать' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, watch, computed } from 'vue';
import { useVisitObjectStore } from '@/stores/visitObjectStore';
import { useCategoryVisitorStore } from '@/stores/categoryVisitorStore';

// Получение хранилищ
const visitObjectStore = useVisitObjectStore();
const categoryVisitorStore = useCategoryVisitorStore();

// Определение входных параметров
const props = defineProps({
  visitObject: {
    type: Object,
    required: true
  },
  isEditing: {
    type: Boolean,
    default: false
  }
});

// Определение событий
const emit = defineEmits(['save', 'cancel']);

// Получение групп объектов и категорий из хранилища
const groupVisitObjects = computed(() => visitObjectStore.getAllGroupVisitObjects);
const categoryVisitors = computed(() => categoryVisitorStore.getAllCategoryVisitors);

// Данные формы
const formData = reactive({
  visitObjectId: null,
  visitObjectName: '',
  address: '',
  comment: '',
  groupVisitObjectId: null,
  categoryVisitorId: null
});

// Наблюдение за изменением входных данных
watch(() => props.visitObject, (newObject) => {
  if (newObject) {
    console.log('Получены данные объекта для редактирования:', newObject);
    Object.assign(formData, {
      visitObjectId: newObject.VisitObjectId,
      visitObjectName: newObject.VisitObjectName || '',
      address: newObject.Address || '',
      comment: newObject.Comment || '',
      groupVisitObjectId: newObject.GroupVisitObjectId || null,
      categoryVisitorId: newObject.CategoryVisitorId || null
    });
  }
}, { immediate: true, deep: true });

// Функция сохранения объекта
function saveObject() {
  try {
    // Подготовка данных для сохранения
    // Создаем объект с учетом структуры DTO на бэкенде
    const objectData = {
      // Для обновления нужен ID, но он не входит в DTO
      VisitObjectId: props.isEditing ? formData.visitObjectId : undefined,
      // Поля из VisitObjectCreateDto
      VisitObjectName: formData.visitObjectName,
      Address: formData.address,
      Comment: formData.comment,
      GroupVisitObjectId: formData.groupVisitObjectId,
      CategoryVisitorId: formData.categoryVisitorId
    };
    
    // Отправка данных родительскому компоненту
    emit('save', objectData, props.isEditing);
  } catch (error) {
    console.error('Ошибка при сохранении объекта:', error);
  }
}
</script>

<style scoped>
/* Стили уже определены в глобальных стилях admin.css */
</style>
