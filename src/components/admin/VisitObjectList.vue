<template>
  <div class="admin-table-container">
    <div v-if="objects.length === 0" class="admin-empty-state">
      <p>Объекты посещения не найдены</p>
    </div>
    <table v-else class="admin-table">
      <thead>
        <tr>
          <th>ID</th>
          <th>Название</th>
          <th>Адрес</th>
          <th>Описание</th>
          <th>Действия</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="object in objects" :key="object.VisitObjectId">
          <td>{{ object.VisitObjectId }}</td>
          <td>{{ object.VisitObjectName }}</td>
          <td>{{ object.Address || '-' }}</td>
          <td>{{ object.Comment || '-' }}</td>
          <td>
            <div class="admin-button-group">
              <button @click="$emit('edit', object)" class="admin-button secondary">
                Редактировать
              </button>
              <button @click="$emit('delete', object)" class="admin-button danger">
                Удалить
              </button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';

// Определение входных параметров
const props = defineProps({
  objects: {
    type: Array,
    required: true
  }
});

// Определение событий
defineEmits(['edit', 'delete']);
</script>

<style scoped>
/* Стили уже определены в глобальных стилях admin.css */
</style>
