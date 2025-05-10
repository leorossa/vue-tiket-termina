<template>
  <div class="admin-container">
    <UnderConstructionNotice />
  </div>
</template>

<script setup>
import UnderConstructionNotice from '../components/UnderConstructionNotice.vue';
</script>

<style scoped>
/* Стили для admin-container, если они специфичны для этой страницы, 
   иначе они должны быть в глобальных стилях или AdminLayout. */
.admin-container {
  padding: 1em;
}
</style>
