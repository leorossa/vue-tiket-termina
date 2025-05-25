<template>
  <div class="admin-table-container">
    <div v-if="categories.length === 0" class="admin-empty-state">
      <p>Категории посетителей не найдены</p>
    </div>
    <table v-else class="admin-table">
      <thead>
        <tr>
          <!--<th>ID</th>-->
          <th>Название</th>
          <th>Действия</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="category in categories" :key="category.CategoryVisitorId">
          <!--<td>{{ category.CategoryVisitorId }}</td>-->
          <td>{{ category.CategoryVisitorName }}</td>
          <td>
            <div class="admin-button-group">
              <button @click="$emit('edit', category)" class="admin-button secondary">
                Редактировать
              </button>
              <button @click="$emit('delete', category)" class="admin-button danger">
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
  categories: {
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
