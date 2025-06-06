<template>
  <div class="price-matrix">
    <h4 class="admin-section-title">Матрица цен</h4>
    
    <div v-if="selectedVisitObjects.length === 0 || selectedCategoryVisitors.length === 0" class="text-center p-3">
      <p>Для настройки цен необходимо выбрать хотя бы один объект посещения и одну категорию посетителей</p>
    </div>
    
    <div v-else class="admin-table-responsive">
      <table class="admin-table">
        <thead>
          <tr>
            <th>Объект / Категория</th>
            <th v-for="category in selectedCategoryVisitors" :key="category.CategoryVisitorId">
              {{ category.CategoryVisitorName }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="object in selectedVisitObjects" :key="object.VisitObjectId">
            <td>{{ object.VisitObjectName }}</td>
            <td v-for="category in selectedCategoryVisitors" :key="category.CategoryVisitorId">
              <input 
                type="number" 
                v-model="priceMatrix[getPriceKey(object.VisitObjectId, category.CategoryVisitorId)]"
                min="0"
                step="0.01"
                class="admin-input admin-input-sm"
                @change="updatePrice(object.VisitObjectId, category.CategoryVisitorId)"
              />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue';

// Определение входных параметров
const props = defineProps({
  visitObjects: {
    type: Array,
    default: () => []
  },
  categoryVisitors: {
    type: Array,
    default: () => []
  },
  modelValue: {
    type: Array,
    default: () => []
  },
  baseCost: {
    type: Number,
    default: 0
  }
});

// Определение событий
const emit = defineEmits(['update:modelValue']);

// Выбранные объекты и категории
const selectedVisitObjects = computed(() => props.visitObjects);
const selectedCategoryVisitors = computed(() => props.categoryVisitors);

// Матрица цен (объект для хранения цен)
const priceMatrix = ref({});

// Инициализация матрицы цен при монтировании
onMounted(() => {
  initializePriceMatrix();
});

// Наблюдение за изменением входных данных
watch([() => props.visitObjects.length, () => props.categoryVisitors.length], () => {
  console.log('Изменилось количество объектов или категорий');
  initializePriceMatrix();
});

// Наблюдение за изменением модели цен
watch(() => props.modelValue.length, () => {
  console.log('Изменилось количество цен');
  // Инициализируем матрицу только если она пустая
  if (Object.keys(priceMatrix.value).length === 0) {
    initializePriceMatrix();
  }
});

// Отдельное наблюдение за изменением базовой стоимости
watch(() => props.baseCost, (newCost) => {
  console.log('Изменена базовая стоимость:', newCost);
  
  // Если нет выбранных объектов или категорий, не обновляем матрицу
  if (selectedVisitObjects.value.length === 0 || selectedCategoryVisitors.value.length === 0) {
    return;
  }
  
  // Обновляем цены в матрице
  selectedVisitObjects.value.forEach(object => {
    selectedCategoryVisitors.value.forEach(category => {
      const key = getPriceKey(object.VisitObjectId, category.CategoryVisitorId);
      
      // Ищем существующую цену в массиве цен
      const existingPrice = props.modelValue.find(
        price => price.VisitObjectId === object.VisitObjectId && 
                price.CategoryVisitorId === category.CategoryVisitorId
      );
      
      // Если цены еще нет или она равна предыдущей базовой стоимости, обновляем её
      if (!existingPrice || !existingPrice.Cost) {
        priceMatrix.value[key] = newCost;
      }
    });
  });
  
  // Обновляем все цены
  updateAllPrices();
});

// Инициализация матрицы цен
function initializePriceMatrix() {
  // Создаем новую матрицу цен
  const newMatrix = {};
  
  // Заполняем матрицу ценами из входного значения или базовой стоимостью
  selectedVisitObjects.value.forEach(object => {
    selectedCategoryVisitors.value.forEach(category => {
      const key = getPriceKey(object.VisitObjectId, category.CategoryVisitorId);
      
      // Ищем существующую цену в массиве цен
      const existingPrice = props.modelValue.find(
        price => price.VisitObjectId === object.VisitObjectId && 
                price.CategoryVisitorId === category.CategoryVisitorId
      );
      
      // Устанавливаем цену из существующей или базовую
      newMatrix[key] = existingPrice ? existingPrice.Cost : props.baseCost;
    });
  });
  
  priceMatrix.value = newMatrix;
  
  // Если матрица изменилась, обновляем цены в модели
  updateAllPrices();
}

// Получение ключа для матрицы цен
function getPriceKey(objectId, categoryId) {
  return `${objectId}_${categoryId}`;
}

// Обновление цены
function updatePrice(objectId, categoryId) {
  const key = getPriceKey(objectId, categoryId);
  const cost = parseFloat(priceMatrix.value[key]);
  
  // Создаем новый массив цен
  const updatedPrices = [...props.modelValue];
  
  // Ищем существующую цену
  const existingPriceIndex = updatedPrices.findIndex(
    price => price.VisitObjectId === objectId && price.CategoryVisitorId === categoryId
  );
  
  if (existingPriceIndex >= 0) {
    // Обновляем существующую цену
    updatedPrices[existingPriceIndex] = {
      ...updatedPrices[existingPriceIndex],
      Cost: cost
    };
  } else {
    // Добавляем новую цену
    updatedPrices.push({
      VisitObjectId: objectId,
      CategoryVisitorId: categoryId,
      Cost: cost,
      ServiceId: null // Будет установлен на сервере
    });
  }
  
  // Отправляем обновленный массив цен
  emit('update:modelValue', updatedPrices);
}

// Обновление всех цен при изменении базовой стоимости
function updateAllPrices() {
  // Проверяем, есть ли объекты и категории
  if (selectedVisitObjects.value.length === 0 || selectedCategoryVisitors.value.length === 0) {
    return;
  }
  
  // Создаем новый массив цен
  const updatedPrices = [];
  
  // Создаем карту существующих цен для быстрого поиска
  const existingPricesMap = {};
  props.modelValue.forEach(price => {
    const key = getPriceKey(price.VisitObjectId, price.CategoryVisitorId);
    existingPricesMap[key] = price;
  });
  
  // Проходим по всем объектам и категориям
  selectedVisitObjects.value.forEach(object => {
    selectedCategoryVisitors.value.forEach(category => {
      const objectId = object.VisitObjectId;
      const categoryId = category.CategoryVisitorId;
      const key = getPriceKey(objectId, categoryId);
      const cost = parseFloat(priceMatrix.value[key]);
      
      // Ищем существующую цену
      const existingPrice = existingPricesMap[key];
      
      if (existingPrice) {
        // Обновляем существующую цену
        updatedPrices.push({
          ...existingPrice,
          Cost: cost
        });
      } else {
        // Добавляем новую цену
        updatedPrices.push({
          VisitObjectId: objectId,
          CategoryVisitorId: categoryId,
          Cost: cost,
          ServiceId: null
        });
      }
    });
  });
  
  // Отправляем обновленный массив цен только если он отличается
  if (JSON.stringify(updatedPrices) !== JSON.stringify(props.modelValue)) {
    emit('update:modelValue', updatedPrices);
  }
}
</script>

<style scoped>
.price-matrix {
  margin-bottom: 1.5rem;
}

.admin-input-sm {
  width: 80px;
  text-align: right;
}
</style>
