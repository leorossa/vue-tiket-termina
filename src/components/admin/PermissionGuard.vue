<template>
  <div v-if="hasPermission">
    <slot></slot>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useUserStore } from '@/stores/userStore';

const props = defineProps({
  permission: {
    type: String,
    required: true
  }
});

const userStore = useUserStore();

// Проверяем, есть ли у пользователя необходимое разрешение
const hasPermission = computed(() => {
  try {
    // Теперь hasPermission - это геттер, который возвращает функцию
    return userStore.hasPermission(props.permission);
  } catch (error) {
    console.error('Ошибка при проверке прав доступа:', error);
    // В случае ошибки по умолчанию разрешаем доступ
    return true;
  }
});
</script>
