<template>
  <div class="terminal-service">
    <button @click="goBack" class="back-btn">&larr; Назад</button>
    
    <div v-if="!item" class="not-found">Услуга не найдена</div>
    
    <div v-else class="service-details">
      <div class="service-header">
        <div v-if="isAttraction && item.imageUrl" class="service-image">
          <img :src="item.imageUrl" :alt="item.name">
        </div>
        <div v-else-if="isAttraction" class="service-image placeholder-image">
          <span>Фото</span>
        </div>
        
        <div class="service-title">
          <h2>{{ item.name }}</h2>
          <p v-if="isAttraction" class="age-restriction">{{ item.ageRestriction }}</p>
        </div>
      </div>
      
      <div class="service-info">
        <p class="description">{{ item.description }}</p>
        <p class="price">{{ item.price }} руб.</p>
      </div>
      
      <div class="ticket-options">
        <div class="quantity-selector">
          <label for="quantity">Количество билетов:</label>
          <div class="quantity-controls">
            <button @click="decreaseQuantity" :disabled="quantity <= 1" class="quantity-btn">-</button>
            <input type="number" id="quantity" v-model.number="quantity" min="1" max="10" class="quantity-input">
            <button @click="increaseQuantity" :disabled="quantity >= 10" class="quantity-btn">+</button>
          </div>
        </div>
        
        <div class="date-selector" v-if="isAttraction">
          <label for="date">Дата:</label>
          <input type="date" id="date" v-model="selectedDate" :min="today" class="date-input">
        </div>
      </div>
      
      <div class="total-section">
        <p class="total">Итого: {{ totalPrice }} руб.</p>
        <button @click="addToCart" class="add-btn">Добавить в корзину</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { mockServices, mockAttractions } from '../mockServiceData.js';

const route = useRoute();
const router = useRouter();
const serviceId = Number(route.params.id);

// Find the item in either services or attractions
const service = computed(() => mockServices.find(s => s.id === serviceId));
const attraction = computed(() => mockAttractions.find(a => a.id === serviceId));
const item = computed(() => service.value || attraction.value);
const isAttraction = computed(() => attraction.value !== undefined);

// Form state
const quantity = ref(1);
const selectedDate = ref(new Date().toISOString().split('T')[0]); // Today's date as default
const today = new Date().toISOString().split('T')[0]; // Minimum date for the date picker

// Calculate total price
const totalPrice = computed(() => {
  if (!item.value) return 0;
  return item.value.price * quantity.value;
});

function increaseQuantity() {
  if (quantity.value < 10) {
    quantity.value++;
  }
}

function decreaseQuantity() {
  if (quantity.value > 1) {
    quantity.value--;
  }
}

function addToCart() {
  // Here you would add the item to the cart
  // For now, we'll just show an alert
  alert(`Добавлено в корзину: ${item.value.name} x${quantity.value}, Итого: ${totalPrice.value} руб.`);
  
  // In a real application, you would store this in a cart state or localStorage
  // and then navigate to the cart page or show a confirmation
}

function goBack() {
  router.push('/');
}
</script>

<style scoped>
.terminal-service {
  max-width: 800px;
  margin: 2em auto;
  padding: 2em;
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  position: relative;
}

.back-btn {
  position: absolute;
  top: 20px;
  left: 20px;
  background: none;
  border: none;
  font-size: 1.2em;
  cursor: pointer;
  color: #555;
}

.not-found {
  text-align: center;
  padding: 2em;
  color: #e53935;
  font-size: 1.2em;
}

.service-header {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}

.service-image {
  width: 120px;
  height: 120px;
  border-radius: 8px;
  overflow: hidden;
  margin-right: 20px;
}

.service-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.placeholder-image {
  background-color: #f0f0f0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #999;
}

.service-title h2 {
  margin: 0 0 10px 0;
  color: #333;
}

.age-restriction {
  display: inline-block;
  background-color: #2f9f16;
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-weight: bold;
  margin: 0;
}

.service-info {
  margin-bottom: 30px;
}

.description {
  color: #555;
  line-height: 1.6;
  margin-bottom: 15px;
}

.price {
  font-size: 1.4em;
  font-weight: bold;
  color: #2f9f16;
  margin: 10px 0;
}

.ticket-options {
  background-color: #f9f9f9;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 20px;
}

.quantity-selector, .date-selector {
  margin-bottom: 15px;
}

label {
  display: block;
  margin-bottom: 8px;
  color: #555;
  font-weight: bold;
}

.quantity-controls {
  display: flex;
  align-items: center;
}

.quantity-btn {
  width: 40px;
  height: 40px;
  border: 1px solid #ddd;
  background-color: #f5f5f5;
  font-size: 1.2em;
  cursor: pointer;
}

.quantity-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.quantity-input {
  width: 60px;
  height: 40px;
  border: 1px solid #ddd;
  text-align: center;
  font-size: 1.1em;
  margin: 0 5px;
}

.date-input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1em;
}

.total-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 30px;
}

.total {
  font-size: 1.6em;
  font-weight: bold;
  color: #333;
  margin: 0;
}

.add-btn {
  padding: 12px 24px;
  font-size: 1.1em;
  border: none;
  background: #2f9f16;
  color: white;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.2s ease;
}

.add-btn:hover {
  background: #248f0d;
}
</style>
