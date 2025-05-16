<template>
  <div class="admin-container">
    <h1 class="admin-title">Управление объектами посещения</h1>
    
    <div class="admin-actions">
      <div class="admin-search">
        <input 
          type="text" 
          v-model="searchQuery" 
          placeholder="Поиск объектов..." 
          class="admin-input"
        />
      </div>
      <button @click="openCreateObjectModal" class="admin-button primary">
        Добавить объект
      </button>
    </div>
    
    <!-- Компонент списка объектов посещения -->
    <VisitObjectList 
      :objects="filteredObjects" 
      @edit="editObject" 
      @delete="confirmDeleteObject"
    />
    
    <!-- Модальное окно для создания/редактирования объекта -->
    <VisitObjectForm 
      v-if="showObjectModal" 
      :visit-object="currentObject" 
      :is-editing="isEditing"
      @save="handleSaveObject" 
      @cancel="showObjectModal = false"
    />
    
    <!-- Модальное окно подтверждения удаления -->
    <DeleteConfirmation 
      v-if="showDeleteConfirmModal"
      :item-name="objectToDelete?.VisitObjectName || 'объект'"
      @confirm="deleteObject"
      @cancel="showDeleteConfirmModal = false"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useVisitObjectStore } from '@/stores/visitObjectStore';
import VisitObjectList from '@/components/admin/VisitObjectList.vue';
import VisitObjectForm from '@/components/admin/VisitObjectForm.vue';
import DeleteConfirmation from '@/components/admin/DeleteConfirmation.vue';

// Инициализация хранилища объектов посещения
const visitObjectStore = useVisitObjectStore();

// Состояния компонента
const searchQuery = ref('');
const showObjectModal = ref(false);
const showDeleteConfirmModal = ref(false);
const isEditing = ref(false);
const currentObject = ref({});
const objectToDelete = ref(null);

// Получение списка объектов из хранилища
const objects = computed(() => visitObjectStore.getAllVisitObjects);

// Фильтрация объектов по поисковому запросу
const filteredObjects = computed(() => {
  if (!searchQuery.value) return objects.value;
  
  const query = searchQuery.value.toLowerCase();
  return objects.value.filter(object => 
    object.VisitObjectName.toLowerCase().includes(query) ||
    (object.Address && object.Address.toLowerCase().includes(query))
  );
});

// Загрузка данных при монтировании компонента
onMounted(async () => {
  try {
    await visitObjectStore.fetchVisitObjects();
  } catch (error) {
    console.error('Ошибка при загрузке объектов посещения:', error);
  }
});

// Функция открытия модального окна создания объекта
function openCreateObjectModal() {
  // Сброс формы перед созданием нового объекта
  currentObject.value = {};
  isEditing.value = false;
  showObjectModal.value = true;
}

// Функция редактирования объекта
function editObject(object) {
  // Устанавливаем текущий объект для редактирования
  currentObject.value = object;
  isEditing.value = true;
  showObjectModal.value = true;
}

function confirmDeleteObject(object) {
  objectToDelete.value = object;
  showDeleteConfirmModal.value = true;
}

// Функция обработки сохранения объекта из компонента VisitObjectForm
async function handleSaveObject(objectData, isEdit) {
  try {
    console.log('Получены данные для сохранения:', objectData, 'Редактирование:', isEdit);
    
    let result;
    if (isEdit) {
      // Обновление существующего объекта через хранилище
      const objectId = objectData.VisitObjectId;
      if (!objectId) {
        throw new Error('Отсутствует ID объекта для обновления');
      }
      result = await visitObjectStore.updateVisitObject(objectId, objectData);
    } else {
      // Создание нового объекта через хранилище
      result = await visitObjectStore.addVisitObject(objectData);
    }
    
    if (result.success) {
      // Закрытие модального окна при успешном сохранении
      showObjectModal.value = false;
      // Обновляем список объектов после успешного сохранения
      await visitObjectStore.fetchVisitObjects();
    } else {
      // Обработка ошибки
      console.error('Ошибка при сохранении объекта:', result.error);
    }
  } catch (error) {
    console.error('Ошибка при сохранении объекта:', error);
  }
}

// Функция удаления объекта
async function deleteObject() {
  if (!objectToDelete.value) return;
  
  try {
    const result = await visitObjectStore.deleteVisitObject(objectToDelete.value.VisitObjectId);
    
    if (result.success) {
      showDeleteConfirmModal.value = false;
      // Обновление списка объектов после удаления
      await visitObjectStore.fetchVisitObjects();
    } else {
      console.error('Ошибка при удалении объекта:', result.error);
    }
  } catch (error) {
    console.error('Ошибка при удалении объекта:', error);
  }
}
</script>

<style scoped>
/* Стили уже определены в глобальных стилях admin.css */
</style>
