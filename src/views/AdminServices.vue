<template>
  <div class="admin-services">
    <h2>Управление услугами</h2>
    <form @submit.prevent="addService" class="service-form">
      <input v-model="newService.name" placeholder="Название услуги" required />
      <input v-model="newService.description" placeholder="Описание" required />
      <button type="submit" class="btn">Добавить услугу</button>
    </form>
    <ul class="services-list">
      <li v-for="service in services" :key="service.id" class="service-item">
        <div v-if="editId !== service.id">
          <strong>{{ service.name }}</strong> — {{ service.description }}
          <button @click="startEdit(service)" class="btn-edit">✎</button>
          <button @click="removeService(service.id)" class="btn-remove">✗</button>
        </div>
        <div v-else>
          <input v-model="editService.name" />
          <input v-model="editService.description" />
          <button @click="saveEdit(service.id)" class="btn">Сохранить</button>
          <button @click="cancelEdit" class="btn-remove">Отмена</button>
        </div>
      </li>
    </ul>
  </div>
</template>
<script setup>
import { ref } from 'vue';
import { mockServices } from '../mockData.js';

const services = ref([...mockServices]);
const newService = ref({ name: '', description: '' });
const editId = ref(null);
const editService = ref({ name: '', description: '' });

function addService() {
  if (!newService.value.name || !newService.value.description) return;
  services.value.push({
    id: Date.now(),
    name: newService.value.name,
    description: newService.value.description
  });
  newService.value = { name: '', description: '' };
}
function removeService(id) {
  services.value = services.value.filter(s => s.id !== id);
}
function startEdit(service) {
  editId.value = service.id;
  editService.value = { name: service.name, description: service.description };
}
function saveEdit(id) {
  const idx = services.value.findIndex(s => s.id === id);
  if (idx !== -1) {
    services.value[idx] = { ...services.value[idx], ...editService.value };
  }
  editId.value = null;
}
function cancelEdit() {
  editId.value = null;
}
</script>
<style scoped>
.admin-services { max-width: 700px; margin: 2em auto; padding: 2em; background: #f7fafc; border-radius: 8px; box-shadow: 0 2px 8px #0001; color: #222; }
.admin-services h2, .admin-services li, .admin-services input, .admin-services button { color: #222; }
.service-form { display: flex; gap: 0.5em; margin-bottom: 1.5em; }
.services-list { list-style: none; padding: 0; }
.service-item { display: flex; align-items: center; gap: 1em; margin-bottom: 1em; background: #fff; border-radius: 4px; padding: 0.7em 1em; box-shadow: 0 1px 4px #0001; }
.btn, .btn-edit, .btn-remove { margin-left: 0.5em; border: none; border-radius: 4px; padding: 0.3em 0.8em; cursor: pointer; }
.btn { background: #1976d2; color: #fff; }
.btn-edit { background: #ffd600; color: #333; }
.btn-remove { background: #e53935; color: #fff; }
.btn:hover { background: #1565c0; }
.btn-edit:hover { background: #ffc107; }
.btn-remove:hover { background: #b71c1c; }
input { padding: 0.5em; border-radius: 4px; border: 1px solid #ccc; color: #222; }
</style>
