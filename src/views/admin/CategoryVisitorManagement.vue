<template>
  <div class="admin-container">
    <h1 class="admin-title">Управление категориями посетителей</h1>
    
    <div class="admin-actions">
      <div class="admin-search">
        <input 
          type="text" 
          v-model="searchQuery" 
          placeholder="Поиск категорий..." 
          class="admin-input"
        />
      </div>
      <button @click="openCreateCategoryModal" class="admin-button primary">
        Добавить категорию
      </button>
    </div>
    
    <!-- Компонент списка категорий -->
    <CategoryVisitorList 
      :categories="filteredCategories" 
      @edit="editCategory" 
      @delete="confirmDeleteCategory"
    />
    
    <!-- Модальное окно для создания/редактирования категории -->
    <CategoryVisitorForm 
      v-if="showCategoryModal" 
      :category="currentCategory" 
      :is-editing="isEditing"
      @save="handleSaveCategory" 
      @cancel="showCategoryModal = false"
    />
    
    <!-- Модальное окно подтверждения удаления -->
    <DeleteConfirmation 
      v-if="showDeleteConfirmModal"
      :item-name="categoryToDelete?.CategoryVisitorName || 'категорию'"
      @confirm="deleteCategory"
      @cancel="showDeleteConfirmModal = false"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useCategoryVisitorStore } from '@/stores/categoryVisitorStore';
import CategoryVisitorList from '@/components/admin/CategoryVisitorList.vue';
import CategoryVisitorForm from '@/components/admin/CategoryVisitorForm.vue';
import DeleteConfirmation from '@/components/admin/DeleteConfirmation.vue';

// Инициализация хранилища категорий
const categoryVisitorStore = useCategoryVisitorStore();

// Состояния компонента
const searchQuery = ref('');
const showCategoryModal = ref(false);
const showDeleteConfirmModal = ref(false);
const isEditing = ref(false);
const currentCategory = ref({});
const categoryToDelete = ref(null);

// Получение списка категорий из хранилища
const categories = computed(() => categoryVisitorStore.getAllCategoryVisitors);

// Фильтрация категорий по поисковому запросу
const filteredCategories = computed(() => {
  if (!searchQuery.value) return categories.value;
  
  const query = searchQuery.value.toLowerCase();
  return categories.value.filter(category => 
    category.CategoryVisitorName.toLowerCase().includes(query)
  );
});

// Загрузка данных при монтировании компонента
onMounted(async () => {
  try {
    await categoryVisitorStore.fetchCategoryVisitors();
  } catch (error) {
    console.error('Ошибка при загрузке категорий посетителей:', error);
  }
});

// Функция открытия модального окна создания категории
function openCreateCategoryModal() {
  // Сброс формы перед созданием новой категории
  currentCategory.value = {};
  isEditing.value = false;
  showCategoryModal.value = true;
}

// Функция редактирования категории
function editCategory(category) {
  // Устанавливаем текущую категорию для редактирования
  currentCategory.value = category;
  isEditing.value = true;
  showCategoryModal.value = true;
}

function confirmDeleteCategory(category) {
  categoryToDelete.value = category;
  showDeleteConfirmModal.value = true;
}

// Функция обработки сохранения категории из компонента CategoryVisitorForm
async function handleSaveCategory(categoryData, isEdit) {
  try {
    console.log('Получены данные для сохранения:', categoryData, 'Редактирование:', isEdit);
    
    if (isEdit) {
      // Обновление существующей категории через хранилище
      const categoryId = categoryData.CategoryVisitorId;
      if (!categoryId) {
        throw new Error('Отсутствует ID категории для обновления');
      }
      
      // Удаляем CategoryVisitorId из данных для отправки, если он не нужен в теле запроса
      const { CategoryVisitorId, ...dataToSend } = categoryData;
      
      const result = await categoryVisitorStore.updateCategoryVisitor(categoryId, dataToSend);
      
      if (result.success) {
        console.log('Категория успешно обновлена');
        showCategoryModal.value = false;
      } else {
        // Обработка ошибки
        console.error('Ошибка при обновлении категории:', result.error);
      }
    } else {
      // Создание новой категории через хранилище
      const result = await categoryVisitorStore.addCategoryVisitor(categoryData);
      
      if (result.success) {
        console.log('Категория успешно создана');
        showCategoryModal.value = false;
      } else {
        // Обработка ошибки
        console.error('Ошибка при создании категории:', result.error);
      }
    }
  } catch (error) {
    console.error('Ошибка при сохранении категории:', error);
  }
}

// Функция удаления категории
async function deleteCategory() {
  if (!categoryToDelete.value) return;
  
  try {
    const result = await categoryVisitorStore.deleteCategoryVisitor(categoryToDelete.value.CategoryVisitorId);
    
    if (result.success) {
      showDeleteConfirmModal.value = false;
      // Обновление списка категорий после удаления
      await categoryVisitorStore.fetchCategoryVisitors();
    } else {
      console.error('Ошибка при удалении категории:', result.error);
    }
  } catch (error) {
    console.error('Ошибка при удалении категории:', error);
  }
}
</script>

<style scoped>
/* Стили уже определены в глобальных стилях admin.css */
</style>
