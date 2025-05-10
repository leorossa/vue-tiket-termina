<template>
  <div class="terminal-container">
    <h1>Добро пожаловать!</h1>
    <p>Выберите аттракцион или услугу</p>
    <div v-if="loading">Загрузка...</div>
    <div v-else-if="error" class="terminal-error-message">Ошибка: {{ error }}</div>
    
    <div class="terminal-grid terminal-grid-cols-auto-fill-300 attractions-specific-margin">
      <div v-for="attraction in attractions" :key="attraction.id" @click="goToService(attraction)">
        <AttractionCard :attraction="attraction" />
      </div>
    </div>
    
    <h2 class="terminal-section-title">Другие услуги</h2>
    <ul class="terminal-grid terminal-grid-cols-auto-fill-250 services-list-specific-styles">
      <li v-for="service in services" :key="service.id" class="service-item" @click="goToService(service)">
        <h3>{{ service.name }}</h3>
        <p>{{ service.description }}</p>
      </li>
    </ul>
  </div>
</template>
<script setup>
import { ref, onMounted } from 'vue';
import { mockServices, mockAttractions } from '../mockServiceData.js';
import { useRouter } from 'vue-router';
import AttractionCard from '../components/AttractionCard.vue';

const services = ref(mockServices);
const attractions = ref(mockAttractions);
const loading = ref(false);
const error = ref(null);
const router = useRouter();

function goToService(service) {
  router.push({ name: 'TerminalService', params: { id: service.id } });
}
</script>
<style scoped>
.attractions-specific-margin {
  margin-top: 30px;
}

.services-list-specific-styles {
  list-style: none; 
  padding: 0;
  /* gap и display:grid уже есть от terminal-grid */
}

.service-item { 
  margin: 0; 
  padding: 1em; 
  background: #2f9f16; 
  border-radius: 8px; 
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  color: white;
  text-align: left; /* Ensuring text inside items is left-aligned if parent is centered */
}

.service-item:hover {
  transform: translateY(-3px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

/* .error class is removed as terminal-error-message is used */
</style>
