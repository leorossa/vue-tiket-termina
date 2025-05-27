<template>
  <div class="admin-modal-overlay" @click.self="$emit('close')">
    <div class="admin-modal">
      <div class="admin-modal-header">
        <h3>Редактирование информации о версии</h3>
        <button @click="$emit('close')" class="admin-modal-close">&times;</button>
      </div>
      
      <div class="admin-modal-body">
        <!-- Секция Gate -->
        <div class="version-section">
          <h4>Информация о шлюзе (Gate)</h4>
          <div class="admin-form-group" v-for="(item, index) in formData.Gate" :key="`gate-${index}`">
            <div class="version-item-edit">
              <div>
                <label>Название:</label>
                <input type="text" v-model="item.Name" class="admin-input" />
              </div>
              <div>
                <label>Версия:</label>
                <input type="text" v-model="item.Version" class="admin-input" />
              </div>
              <div>
                <label>Срок лицензии:</label>
                <input type="date" v-model="item.DtLicenceFinish" class="admin-input" />
              </div>
            </div>
          </div>
        </div>
        
        <!-- Секция System -->
        <div class="version-section">
          <h4>Информация о системе (System)</h4>
          <div class="admin-form-group" v-for="(item, index) in formData.System" :key="`system-${index}`">
            <div class="version-item-edit">
              <div>
                <label>Название:</label>
                <input type="text" v-model="item.Name" class="admin-input" />
              </div>
              <div>
                <label>Версия:</label>
                <input type="text" v-model="item.Version" class="admin-input" />
              </div>
              <div>
                <label>Срок лицензии:</label>
                <input type="date" v-model="item.DtLicenceFinish" class="admin-input" />
              </div>
            </div>
          </div>
        </div>
        
        <!-- Секция Requisite -->
        <div class="version-section">
          <h4>Реквизиты (Requisite)</h4>
          <div class="admin-form-group" v-for="(item, index) in formData.Requisite" :key="`requisite-${index}`">
            <div class="version-item-edit">
              <div>
                <label>Название:</label>
                <input type="text" v-model="item.Name" class="admin-input" />
              </div>
              <div>
                <label>Город:</label>
                <input type="text" v-model="item.City" class="admin-input" />
              </div>
              <div>
                <label>Адрес:</label>
                <input type="text" v-model="item.Address" class="admin-input" />
              </div>
              <div>
                <label>Телефон:</label>
                <input type="text" v-model="item.Phone1" class="admin-input" />
              </div>
              <div>
                <label>Факс:</label>
                <input type="text" v-model="item.Fax" class="admin-input" />
              </div>
              <div>
                <label>Время начала:</label>
                <input type="time" v-model="item.DtBegin" class="admin-input" />
              </div>
              <div>
                <label>Время окончания:</label>
                <input type="time" v-model="item.DtEnd" class="admin-input" />
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div class="admin-modal-footer">
        <button @click="$emit('close')" class="admin-button secondary">
          Отмена
        </button>
        <button @click="saveChanges" class="admin-button primary">
          Сохранить
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits, reactive, onMounted } from 'vue';

const props = defineProps({
  versionInfo: {
    type: Object,
    required: true,
    default: () => ({
      Gate: [],
      System: [],
      Requisite: []
    })
  }
});

const emit = defineEmits(['close', 'save']);

// Создаем реактивную копию данных для редактирования
const formData = reactive({
  Gate: [],
  System: [],
  Requisite: []
});

// При монтировании компонента копируем данные из props в formData
onMounted(() => {
  if (props.versionInfo.Gate) {
    formData.Gate = JSON.parse(JSON.stringify(props.versionInfo.Gate));
  }
  if (props.versionInfo.System) {
    formData.System = JSON.parse(JSON.stringify(props.versionInfo.System));
  }
  if (props.versionInfo.Requisite) {
    formData.Requisite = JSON.parse(JSON.stringify(props.versionInfo.Requisite));
  }
});

// Форматирование даты для инпута типа date
function formatDateForInput(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toISOString().split('T')[0];
}

// Сохранение изменений
function saveChanges() {
  // Создаем копию данных для отправки
  const dataToSave = {
    Gate: formData.Gate,
    System: formData.System,
    Requisite: formData.Requisite
  };
  
  // Отправляем данные родительскому компоненту
  emit('save', dataToSave);
}
</script>

<style scoped>
.version-section {
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--admin-border-color, #e2e8f0);
}

.version-section h4 {
  margin-top: 0;
  margin-bottom: 1rem;
  color: var(--admin-text-secondary, #4a5568);
  font-size: 1rem;
}

.version-item-edit {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 1rem;
  margin-bottom: 0.75rem;
}

.version-item-edit div {
  display: flex;
  flex-direction: column;
}

.version-item-edit label {
  margin-bottom: 0.25rem;
  font-size: 0.875rem;
  color: var(--admin-text-secondary, #4a5568);
}

@media (max-width: 768px) {
  .version-item-edit {
    grid-template-columns: 1fr;
  }
}
</style>
