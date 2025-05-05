<template>
  <div class="terminal-home">
    <h1>Добро пожаловать!</h1>
    <p>Выберите услугу или экскурсию</p>
    <div v-if="loading">Загрузка...</div>
    <div v-else-if="error" class="error">Ошибка: {{ error }}</div>
    <ul v-else class="services-list">
      <li v-for="service in services" :key="service.id" class="service-item" @click="goToService(service)" style="cursor:pointer">
        <h3>{{ service.name }}</h3>
        <p>{{ service.description }}</p>
      </li>
    </ul>
  </div>
</template>
<script setup>
import { ref, onMounted } from 'vue';
import { mockServices } from '../mockData.js';
import { useRouter } from 'vue-router';

const services = ref(mockServices);
const loading = ref(false);
const error = ref(null);
const router = useRouter();

function goToService(service) {
  router.push({ name: 'TerminalService', params: { id: service.id } });
}
</script>
<style scoped>
.terminal-home { text-align: center; }
.services-list { list-style: none; padding: 0; }
.service-item { margin: 1.5em 0; padding: 1em; background: #2f9f16; border-radius: 8px; box-shadow: 0 2px 8px #0001; }
.error { color: #c00; margin: 1em 0; }
</style>
