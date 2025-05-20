<template>
  <div class="category-visitor-selector">
    <h4 class="admin-section-title">Категории посетителей</h4>
    
    <div v-if="loading" class="text-center p-3">
      <p>Загрузка категорий посетителей...</p>
    </div>
    
    <div v-else-if="categoryVisitors.length === 0" class="text-center p-3">
      <p>Категории посетителей не найдены</p>
    </div>
    
    <div v-else>
      <div class="admin-table-responsive">
        <table class="admin-table">
          <thead>
            <tr>
              <th>Выбрать</th>
              <th>Название</th>
              <th>Группа</th>
              <th>Требуемое количество</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="category in categoryVisitors" :key="category.CategoryVisitorId">
              <td>
                <input 
                  type="checkbox" 
                  :value="category.CategoryVisitorId" 
                  v-model="selectedCategoryIds"
                  @change="updateSelectedCategories"
                  :disabled="isOneCategoryMode && selectedCategoryIds.length > 0 && !selectedCategoryIds.includes(category.CategoryVisitorId)"
                />
              </td>
              <td>{{ category.CategoryVisitorName }}</td>
              <td>{{ category.GroupCategoryVisitorName || '-' }}</td>
              <td>
                <input 
                  type="number" 
                  :disabled="!isCategorySelected(category.CategoryVisitorId)"
                  v-model="category.RequireVisitorCount"
                  min="0"
                  class="admin-input admin-input-sm"
                  @change="updateCategoryRequirement(category)"
                />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useCategoryVisitorStore } from '@/stores/categoryVisitorStore';

// Определение входных параметров
const props = defineProps({
  modelValue: {
    type: Array,
    default: () => []
  },
  isOneCategoryMode: {
    type: Boolean,
    default: false
  }
});

// Определение событий
const emit = defineEmits(['update:modelValue']);

// Инициализация хранилища категорий посетителей
const categoryVisitorStore = useCategoryVisitorStore();

// Состояния компонента
const loading = computed(() => categoryVisitorStore.isLoading);
const categoryVisitors = computed(() => categoryVisitorStore.getAllCategoryVisitors);
const selectedCategoryIds = ref([]);

// Загрузка данных при монтировании компонента
onMounted(async () => {
  if (categoryVisitors.value.length === 0) {
    await categoryVisitorStore.fetchCategoryVisitors();
  }
  
  // Инициализация выбранных категорий из входного значения
  initializeSelectedCategories();
});

// Наблюдение за изменением входного значения
watch(() => props.modelValue, () => {
  initializeSelectedCategories();
}, { deep: true });

// Наблюдение за изменением режима одной категории
watch(() => props.isOneCategoryMode, (newValue) => {
  if (newValue && selectedCategoryIds.value.length > 1) {
    // Если включен режим одной категории, а выбрано несколько - оставляем только первую
    selectedCategoryIds.value = [selectedCategoryIds.value[0]];
    updateSelectedCategories();
  }
}, { immediate: true });

// Инициализация выбранных категорий
function initializeSelectedCategories() {
  console.log('Инициализация выбранных категорий:', props.modelValue);
  selectedCategoryIds.value = props.modelValue.map(cat => cat.CategoryVisitorId);
  
  // Обновляем свойства RequireVisitorCount для выбранных категорий
  if (categoryVisitors.value.length > 0 && props.modelValue.length > 0) {
    // Создаем карту свойств для быстрого поиска
    const selectedPropsMap = new Map();
    props.modelValue.forEach(cat => {
      selectedPropsMap.set(cat.CategoryVisitorId, {
        RequireVisitorCount: cat.RequireVisitorCount || 0,
        GroupCategoryVisitorId: cat.GroupCategoryVisitorId
      });
    });
    
    // Обновляем свойства категорий в списке
    categoryVisitors.value.forEach(cat => {
      if (selectedPropsMap.has(cat.CategoryVisitorId)) {
        const props = selectedPropsMap.get(cat.CategoryVisitorId);
        cat.RequireVisitorCount = props.RequireVisitorCount;
      }
    });
  }
}

// Проверка, выбрана ли категория
function isCategorySelected(id) {
  return selectedCategoryIds.value.includes(id);
}

// Обновление выбранных категорий
function updateSelectedCategories() {
  const selectedCategories = categoryVisitors.value
    .filter(cat => selectedCategoryIds.value.includes(cat.CategoryVisitorId))
    .map(cat => ({
      CategoryVisitorId: cat.CategoryVisitorId,
      CategoryVisitorName: cat.CategoryVisitorName,
      RequireVisitorCount: cat.RequireVisitorCount || 0,
      GroupCategoryVisitorId: cat.GroupCategoryVisitorId
    }));
  
  emit('update:modelValue', selectedCategories);
}

// Обновление требуемого количества посетителей
function updateCategoryRequirement(category) {
  const selectedCategories = props.modelValue.map(cat => {
    if (cat.CategoryVisitorId === category.CategoryVisitorId) {
      return { ...cat, RequireVisitorCount: category.RequireVisitorCount };
    }
    return cat;
  });
  
  emit('update:modelValue', selectedCategories);
}
</script>

<style scoped>
.category-visitor-selector {
  margin-bottom: 1.5rem;
}

.admin-input-sm {
  width: 80px;
  text-align: center;
}
</style>
