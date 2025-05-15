<template>
  <div>
    <!-- Таблица услуг -->
    <div v-if="loading" class="text-center p-4">
      <p>Загрузка данных...</p>
    </div>
    <div v-else class="admin-table-responsive">
      <table class="admin-table" v-if="services.length > 0">
        <thead>
          <tr>
            <th>ID</th>
            <th>Название</th>
            <th>Описание</th>
            <th>Стоимость</th>
            <th>Действия</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="service in services" :key="service.ServiceId">
            <td>{{ service.ServiceId }}</td>
            <td>{{ service.ServiceName }}</td>
            <td>{{ service.Description || service.Comment || '-' }}</td>
            <td>{{ service.Cost !== undefined ? service.Cost : '-' }} ₽</td>
            <td>
              <div class="admin-button-group">
                <button @click="$emit('edit', service)" class="admin-button secondary">
                  Редактировать
                </button>
                <button @click="$emit('delete', service)" class="admin-button danger">
                  Удалить
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
      <div v-else class="text-center p-4">
        <p>Услуги не найдены. Создайте новую услугу.</p>
      </div>
    </div>
  </div>
</template>

<script setup>
// Определение входных параметров
const props = defineProps({
  services: {
    type: Array,
    default: () => []
  },
  loading: {
    type: Boolean,
    default: false
  }
});

// Определение событий
const emit = defineEmits(['edit', 'delete']);
</script>
