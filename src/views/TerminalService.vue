<template>
  <div class="terminal-service">
    <div v-if="!service">Услуга не найдена</div>
    <div v-else>
      <h2>{{ service.name }}</h2>
      <p>{{ service.description }}</p>
      <!-- Здесь можно добавить выбор даты, количества билетов и т.д. -->
      <button @click="addToCart" class="btn">Добавить в корзину</button>
    </div>
  </div>
</template>
<script setup>
import { ref, computed } from 'vue';
import { useRoute } from 'vue-router';
import { mockServices } from '../mockData.js';

const route = useRoute();
const serviceId = Number(route.params.id);
const service = computed(() => mockServices.find(s => s.id === serviceId));

function addToCart() {
  alert('Добавлено в корзину (заглушка)');
}
</script>
<style scoped>
.terminal-service { max-width: 500px; margin: 2em auto; padding: 2em; background: #2f9f16; border-radius: 8px; box-shadow: 0 2px 8px #0001; text-align: center; }
.btn { margin-top: 1.5em; padding: 1em 2em; font-size: 1.2em; border: none; background: #4caf50; color: #fff; border-radius: 5px; cursor: pointer; }
.btn:hover { background: #388e3c; }
</style>
