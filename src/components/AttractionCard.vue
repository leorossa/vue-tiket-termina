<template>
  <div class="attraction-card">
    <div class="attraction-image">
      <img v-if="attraction.imageUrl" :src="attraction.imageUrl" :alt="attraction.name" />
      <div v-else class="placeholder-image">Фото</div>
    </div>
    <div class="attraction-info">
      <h3 class="attraction-name">{{ attraction.name }}</h3>
      <p class="attraction-age">{{ attraction.ageRestriction }}</p>
      <p class="attraction-description">{{ attraction.description }}</p>
      <p class="attraction-price">{{ attraction.price }} руб.</p>
    </div>
  </div>
</template>

<script setup>
defineProps({
  attraction: {
    type: Object,
    required: true
  }
});
</script>

<style scoped>
.attraction-card {
  display: flex;
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
  overflow: hidden;
  width: 100%;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  cursor: pointer;
}

.attraction-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.attraction-image {
  width: 120px;
  height: 120px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f0f0f0;
}

.attraction-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.placeholder-image {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  background-color: #e0e0e0;
  color: #666;
  font-size: 14px;
}

.attraction-info {
  flex: 1;
  padding: 15px;
  display: flex;
  flex-direction: column;
}

.attraction-name {
  margin: 0 0 5px 0;
  font-size: 18px;
  font-weight: bold;
  color: #333;
}

.attraction-age {
  margin: 0 0 5px 0;
  font-size: 14px;
  color: #666;
  font-weight: bold;
}

.attraction-description {
  margin: 0 0 10px 0;
  font-size: 14px;
  color: #555;
  flex-grow: 1;
}

.attraction-price {
  margin: 0;
  font-size: 16px;
  font-weight: bold;
  color: #2f9f16;
  align-self: flex-end;
}
</style>
