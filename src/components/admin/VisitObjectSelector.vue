<template>
  <div class="visit-object-selector">
    <h4 class="admin-section-title">Объекты посещения</h4>
    
    <div v-if="loading" class="text-center p-3">
      <p>Загрузка объектов посещения...</p>
    </div>
    
    <div v-else-if="visitObjects.length === 0" class="text-center p-3">
      <p>Объекты посещения не найдены</p>
    </div>
    
    <div v-else>
      <div class="admin-table-responsive">
        <table class="admin-table">
          <thead>
            <tr>
              <th>Выбрать</th>
              <th>Название</th>
              <th>Адрес</th>
              <th>Обязательный</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="object in visitObjects" :key="object.VisitObjectId">
              <td>
                <input 
                  type="checkbox" 
                  :value="object.VisitObjectId" 
                  v-model="selectedObjectIds"
                  @change="updateSelectedObjects"
                />
              </td>
              <td>{{ object.VisitObjectName }}</td>
              <td>{{ object.Address || '-' }}</td>
              <td>
                <input 
                  type="checkbox" 
                  :disabled="!isObjectSelected(object.VisitObjectId)"
                  v-model="object.IsRequire"
                  @change="updateObjectRequirement(object)"
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
import { useVisitObjectStore } from '@/stores/visitObjectStore';

// Определение входных параметров
const props = defineProps({
  modelValue: {
    type: Array,
    default: () => []
  }
});

// Определение событий
const emit = defineEmits(['update:modelValue']);

// Инициализация хранилища объектов посещения
const visitObjectStore = useVisitObjectStore();

// Состояния компонента
const loading = computed(() => visitObjectStore.isLoading);
const visitObjects = computed(() => visitObjectStore.getAllVisitObjects);
const selectedObjectIds = ref([]);

// Загрузка данных при монтировании компонента
onMounted(async () => {
  if (visitObjects.value.length === 0) {
    await visitObjectStore.fetchVisitObjects();
  }
  
  // Инициализация выбранных объектов из входного значения
  initializeSelectedObjects();
});

// Наблюдение за изменением входного значения
watch(() => props.modelValue, () => {
  initializeSelectedObjects();
}, { deep: true });

// Инициализация выбранных объектов
function initializeSelectedObjects() {
  console.log('Инициализация выбранных объектов:', props.modelValue);
  selectedObjectIds.value = props.modelValue.map(obj => obj.VisitObjectId);
  
  // Обновляем свойства IsRequire для выбранных объектов
  if (visitObjects.value.length > 0 && props.modelValue.length > 0) {
    // Создаем карту свойств для быстрого поиска
    const selectedPropsMap = new Map();
    props.modelValue.forEach(obj => {
      selectedPropsMap.set(obj.VisitObjectId, {
        IsRequire: obj.IsRequire || false,
        GroupVisitObjectId: obj.GroupVisitObjectId,
        CategoryVisitorId: obj.CategoryVisitorId,
        Address: obj.Address,
        Comment: obj.Comment
      });
    });
    
    // Обновляем свойства объектов в списке
    visitObjects.value.forEach(obj => {
      if (selectedPropsMap.has(obj.VisitObjectId)) {
        const props = selectedPropsMap.get(obj.VisitObjectId);
        obj.IsRequire = props.IsRequire;
      }
    });
  }
}

// Проверка, выбран ли объект
function isObjectSelected(id) {
  return selectedObjectIds.value.includes(id);
}

// Обновление выбранных объектов
function updateSelectedObjects() {
  const selectedObjects = visitObjects.value
    .filter(obj => selectedObjectIds.value.includes(obj.VisitObjectId))
    .map(obj => ({
      VisitObjectId: obj.VisitObjectId,
      VisitObjectName: obj.VisitObjectName,
      IsRequire: obj.IsRequire || false,
      GroupVisitObjectId: obj.GroupVisitObjectId,
      CategoryVisitorId: obj.CategoryVisitorId,
      Address: obj.Address,
      Comment: obj.Comment
    }));
  
  emit('update:modelValue', selectedObjects);
}

// Обновление обязательности объекта
function updateObjectRequirement(object) {
  const selectedObjects = props.modelValue.map(obj => {
    if (obj.VisitObjectId === object.VisitObjectId) {
      return { ...obj, IsRequire: object.IsRequire };
    }
    return obj;
  });
  
  emit('update:modelValue', selectedObjects);
}
</script>

<style scoped>
.visit-object-selector {
  margin-bottom: 1.5rem;
}
</style>
