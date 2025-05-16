<template>
  <div class="admin-modal-overlay" @click.self="$emit('cancel')">
    <div class="admin-modal">
      <div class="admin-modal-header">
        <h2>{{ isEditing ? 'Редактирование категории' : 'Создание новой категории' }}</h2>
        <button @click="$emit('cancel')" class="admin-modal-close">&times;</button>
      </div>
      
      <div class="admin-modal-body">
        <form @submit.prevent="saveCategory">
          <div class="admin-form-group">
            <label for="categoryName">Название категории</label>
            <input 
              id="categoryName" 
              v-model="formData.categoryVisitorName" 
              type="text" 
              class="admin-input" 
              required
            />
          </div>
          
          <div class="admin-form-group">
            <label for="description">Описание</label>
            <textarea 
              id="description" 
              v-model="formData.description" 
              class="admin-textarea"
            ></textarea>
          </div>
          
          <div class="admin-form-group">
            <label for="groupId">Группа категорий</label>
            <select 
              id="groupId" 
              v-model="formData.groupCategoryVisitorId" 
              class="admin-select"
            >
              <option value="">Не выбрано</option>
              <option 
                v-for="group in groupCategoryVisitors" 
                :key="group.GroupCategoryVisitorId" 
                :value="group.GroupCategoryVisitorId"
              >
                {{ group.GroupCategoryVisitorName }}
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
import { useCategoryVisitorStore } from '@/stores/categoryVisitorStore';

// Получение хранилища категорий
const categoryVisitorStore = useCategoryVisitorStore();

// Определение входных параметров
const props = defineProps({
  category: {
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

// Получение групп категорий из хранилища
const groupCategoryVisitors = computed(() => categoryVisitorStore.getAllGroupCategoryVisitors);

// Данные формы
const formData = reactive({
  categoryVisitorId: null,
  categoryVisitorName: '',
  description: '',
  groupCategoryVisitorId: null
});

// Наблюдение за изменением входных данных
watch(() => props.category, (newCategory) => {
  if (newCategory) {
    console.log('Получены данные категории для редактирования:', newCategory);
    Object.assign(formData, {
      categoryVisitorId: newCategory.CategoryVisitorId,
      categoryVisitorName: newCategory.CategoryVisitorName || '',
      description: newCategory.Description || '',
      groupCategoryVisitorId: newCategory.GroupCategoryVisitorId || null
    });
  }
}, { immediate: true, deep: true });

// Функция сохранения категории
function saveCategory() {
  try {
    // Подготовка данных для сохранения
    // Создаем объект с учетом структуры DTO на бэкенде
    const categoryData = {
      // Для обновления нужен ID, но он не входит в DTO
      CategoryVisitorId: props.isEditing ? formData.categoryVisitorId : undefined,
      // Поля из CategoryVisitorCreateDto
      CategoryVisitorName: formData.categoryVisitorName,
      Description: formData.description,
      GroupCategoryVisitorId: formData.groupCategoryVisitorId
    };
    
    // Отправка данных родительскому компоненту
    emit('save', categoryData, props.isEditing);
  } catch (error) {
    console.error('Ошибка при сохранении категории:', error);
  }
}
</script>

<style scoped>
/* Стили уже определены в глобальных стилях admin.css */
</style>
