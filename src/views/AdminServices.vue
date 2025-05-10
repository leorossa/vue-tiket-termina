<template>
  <div class="admin-container">
    <h2 class="admin-section-title">Управление услугами</h2>
    
    <!-- Форма добавления новой услуги -->
    <div class="admin-card service-form-specific-card">
      <h3 class="admin-section-title">Добавить новую услугу</h3>
      <form @submit.prevent="addService" class="admin-form service-form-grid">
        <div class="admin-form-group">
          <label for="name">Название услуги:</label>
          <input id="name" v-model="newService.name" placeholder="Название услуги" required class="admin-input" />
        </div>
        
        <div class="admin-form-group">
          <label for="description">Описание:</label>
          <textarea id="description" v-model="newService.description" placeholder="Описание услуги" required rows="3" class="admin-textarea"></textarea>
        </div>
        
        <div class="admin-form-group">
          <label for="price">Цена (руб.):</label>
          <input id="price" type="number" v-model.number="newService.price" placeholder="Цена" required min="0" class="admin-input" />
        </div>
        
        <div class="admin-form-group">
          <label for="ageRestriction">Возрастное ограничение:</label>
          <input id="ageRestriction" v-model="newService.ageRestriction" placeholder="Например: 0+, 12+" class="admin-input" />
        </div>
        
        <div class="admin-form-group">
          <label for="serviceDate">Дата:</label>
          <input id="serviceDate" type="date" v-model="newService.date" class="admin-input" />
        </div>
        
        <div class="admin-form-group">
          <label for="image">Изображение:</label>
          <div class="image-upload">
            <input id="image" type="file" @change="onFileChange" accept="image/*" ref="fileInput" class="admin-input" />
            <div v-if="newService.imagePreview" class="image-preview">
              <img :src="newService.imagePreview" alt="Preview" />
              <button type="button" @click="removeImage" class="btn-remove-image admin-button danger icon-only">✗</button>
            </div>
          </div>
        </div>
        
        <button type="submit" class="admin-button">Добавить услугу</button>
      </form>
    </div>
    
    <!-- Список услуг -->
    <div class="admin-card services-list-specific-card">
      <h3 class="admin-section-title">Список услуг</h3>
      <div class="services-list">
        <div v-for="service in services" :key="service.id" class="service-card">
          <!-- Display/Edit Toggle Logic -->
          <div v-if="editId !== service.id" class="service-view-wrapper">
            <!-- Always Visible Header -->
            <div class="service-header" @click="toggleExpand(service.id)">
              <h4 class="service-name-header">{{ service.name }}</h4>
              <span class="price-summary">{{ service.price }} руб.</span>
              <button class="admin-button icon-only btn-expand" :aria-expanded="isExpanded(service.id).toString()" :title="isExpanded(service.id) ? 'Свернуть' : 'Развернуть'">
                {{ isExpanded(service.id) ? '−' : '+' }}
              </button>
            </div>

            <!-- Collapsible Content -->
            <div v-if="isExpanded(service.id)" class="service-collapsible-content">
              <div class="service-image">
                <img v-if="service.imageUrl" :src="service.imageUrl" :alt="service.name" />
                <div v-else class="placeholder-image">Нет фото</div>
              </div>
              <div class="service-details-body">
                <p v-if="service.ageRestriction" class="age-restriction">Возрастное ограничение: {{ service.ageRestriction }}</p>
                <p class="description"><strong>Описание:</strong> {{ service.description }}</p>
                <p v-if="service.date" class="date"><strong>Дата:</strong> {{ formatDate(service.date) }}</p>
              </div>
              <div class="service-actions">
                <button @click="startEdit(service)" class="admin-button icon-only btn-edit" title="Редактировать">✎</button>
                <button @click="removeService(service.id)" class="admin-button danger icon-only btn-remove" title="Удалить">✗</button>
              </div>
            </div>
          </div>
          
          <!-- Форма редактирования -->
          <div v-else class="service-edit-form">
            <div class="admin-form-group">
              <label>Название:</label>
              <input v-model="editService.name" required class="admin-input" />
            </div>
            
            <div class="admin-form-group">
              <label>Описание:</label>
              <textarea v-model="editService.description" required rows="3" class="admin-textarea"></textarea>
            </div>
            
            <div class="admin-form-group">
              <label>Цена (руб.):</label>
              <input type="number" v-model.number="editService.price" required min="0" class="admin-input" />
            </div>
            
            <div class="admin-form-group">
              <label>Возрастное ограничение:</label>
              <input v-model="editService.ageRestriction" class="admin-input" />
            </div>
            
            <div class="admin-form-group">
              <label>Дата:</label>
              <input type="date" v-model="editService.date" class="admin-input" />
            </div>
            
            <div class="admin-form-group">
              <label>Изображение:</label>
              <div class="image-upload">
                <input type="file" @change="onEditFileChange" accept="image/*" class="admin-input" />
                <div v-if="editService.imagePreview || editService.imageUrl" class="image-preview">
                  <img :src="editService.imagePreview || editService.imageUrl" alt="Preview" />
                  <button type="button" @click="removeEditImage" class="btn-remove-image admin-button danger icon-only">✗</button>
                </div>
              </div>
            </div>
            
            <div class="edit-actions">
              <button @click="saveEdit(service.id)" class="admin-button">Сохранить</button>
              <button @click="cancelEdit" class="admin-button secondary">Отмена</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref } from 'vue';
import { mockServices, mockAttractions } from '../mockServiceData.js';

// Combine services and attractions for the admin view
const initialServices = [...mockServices, ...mockAttractions.map(a => ({
  ...a,
  // Convert any attraction-specific fields to match our service structure
}))]; 

const services = ref(JSON.parse(JSON.stringify(initialServices))); // Deep copy for mutable operations

// New service form state
const newService = ref({
  name: '',
  description: '',
  price: 150,
  ageRestriction: '',
  date: new Date().toISOString().split('T')[0],
  imageUrl: null,
  imagePreview: null,
  imageFile: null
});

// Edit form state
const editId = ref(null);
const editService = ref({
  name: '',
  description: '',
  price: 0,
  ageRestriction: '',
  date: '',
  imageUrl: null,
  imagePreview: null,
  imageFile: null
});

const fileInput = ref(null);

// Accordion state
const expandedServiceId = ref(null);

const toggleExpand = (serviceId) => {
  if (expandedServiceId.value === serviceId) {
    expandedServiceId.value = null; // Collapse
  } else {
    expandedServiceId.value = serviceId; // Expand
  }
};

const isExpanded = (serviceId) => {
  return expandedServiceId.value === serviceId;
};

// Format date for display
function formatDate(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('ru-RU');
}

// Handle file upload for new service
function onFileChange(event) {
  const file = event.target.files[0];
  if (!file) return;
  
  newService.value.imageFile = file;
  
  // Create a preview URL
  const reader = new FileReader();
  reader.onload = (e) => {
    newService.value.imagePreview = e.target.result;
  };
  reader.readAsDataURL(file);
}

// Remove image from new service form
function removeImage() {
  newService.value.imagePreview = null;
  newService.value.imageFile = null;
  if (fileInput.value) {
    fileInput.value.value = '';
  }
}

// Handle file upload for edit form
function onEditFileChange(event) {
  const file = event.target.files[0];
  if (!file) return;
  
  editService.value.imageFile = file;
  
  // Create a preview URL
  const reader = new FileReader();
  reader.onload = (e) => {
    editService.value.imagePreview = e.target.result;
  };
  reader.readAsDataURL(file);
}

// Remove image from edit form
function removeEditImage() {
  editService.value.imagePreview = null;
  editService.value.imageFile = null;
  editService.value.imageUrl = null;
}

// Add a new service
function addService() {
  if (!newService.value.name || !newService.value.description) return;
  
  // In a real app, you would upload the image to a server and get a URL back
  // For now, we'll use the data URL as the imageUrl
  const imageUrl = newService.value.imagePreview;
  
  services.value.push({
    id: Date.now(),
    name: newService.value.name,
    description: newService.value.description,
    price: newService.value.price || 0,
    ageRestriction: newService.value.ageRestriction || '',
    date: newService.value.date || new Date().toISOString().split('T')[0],
    imageUrl: imageUrl,
    available: true
  });
  
  // Reset the form
  newService.value = {
    name: '',
    description: '',
    price: 150,
    ageRestriction: '',
    date: new Date().toISOString().split('T')[0],
    imageUrl: null,
    imagePreview: null,
    imageFile: null
  };
  
  if (fileInput.value) {
    fileInput.value.value = '';
  }
}

// Remove a service
function removeService(id) {
  services.value = services.value.filter(s => s.id !== id);
}

// Start editing a service
function startEdit(service) {
  editId.value = service.id;
  editService.value = { 
    ...service,
    imagePreview: null,
    imageFile: null
  };
}

// Save edited service
function saveEdit(id) {
  const idx = services.value.findIndex(s => s.id === id);
  if (idx !== -1) {
    // In a real app, you would upload any new image to a server
    // For now, use the preview URL if available, otherwise keep the existing URL
    const imageUrl = editService.value.imagePreview || editService.value.imageUrl;
    
    services.value[idx] = { 
      ...services.value[idx], 
      ...editService.value,
      imageUrl: imageUrl 
    };
  }
  editId.value = null;
}

// Cancel editing
function cancelEdit() {
  editId.value = null;
}
</script>
<style scoped>
/* Keep specific styles for service form layout, cards, image upload */

.admin-card {
  background: #fff;
  border-radius: 8px;
  padding: 1.5em;
  margin-bottom: 2em;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.service-form-specific-card .admin-section-title,
.services-list-specific-card .admin-section-title {
  /* More specific title styling if needed, e.g., smaller margin */
  margin-top: 0; /* Example: remove top margin for titles within cards */
  padding-bottom: 0.5em;
  font-size: 1.25rem; /* Slightly smaller for card titles */
  border-bottom: 1px solid #eee;
}

.service-form-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1em;
}

/* Image upload styles - slightly adjusted to work with admin-input */
.image-upload {
  margin-top: 0.5em;
}
.image-upload .admin-input[type="file"] {
  /* Basic styling for file input if needed, often browsers handle this */
}

.image-preview {
  margin-top: 1em;
  position: relative;
  width: 120px;
  height: 120px;
  border-radius: 4px;
  overflow: hidden;
  border: 1px solid #ddd;
}

.image-preview img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.btn-remove-image.icon-only {
  position: absolute;
  top: 5px;
  right: 5px;
  width: 28px; /* Slightly larger for better clickability */
  height: 28px;
  padding: 0;
  line-height: 28px;
  font-size: 14px;
  /* background and color are inherited from admin-button.danger */
}

/* Services list specific styles */
.services-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5em;
}

.service-card {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  display: flex; /* Added for better structure */
  flex-direction: column; /* Added for better structure */
}

.service-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.service-view-wrapper {
  /* Container for header and collapsible content */
}

.service-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75em 1em;
  background-color: var(--admin-light-gray, #f3f4f6); /* Use global var */
  border-bottom: 1px solid var(--admin-border-color, #e5e7eb); /* Use global var */
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.service-header:hover {
  background-color: var(--admin-hover-light-gray, #e5e7eb); /* Use global var */
}

.service-name-header {
  margin: 0;
  font-size: 1.1em;
  color: var(--admin-text-primary, #1f2937); /* Use global var */
  flex-grow: 1;
  margin-right: 1em; /* Space before price */
}

.price-summary {
  font-weight: bold;
  color: var(--admin-primary-color, #3b82f6); /* Use global var */
  margin-right: 1em; /* Space before expand button */
  white-space: nowrap;
}

.btn-expand {
  /* admin-button icon-only should cover most of it */
  font-size: 1.1rem; /* Adjust icon size if needed */
  flex-shrink: 0; /* Prevent button from shrinking */
}

.service-collapsible-content {
  /* The existing .service-image, .service-details-body, .service-actions will be nested here */
  /* Padding can be applied directly to child elements or here if needed */
  border-bottom: 1px solid var(--admin-border-color, #e5e7eb);
}

.service-collapsible-content .service-image {
   /* Styles for image within collapsible content, if different from general .service-image */
   /* height: 150px; already defined */
}

.service-collapsible-content .service-details-body {
  padding: 1em;
}

.service-collapsible-content .service-details-body p {
  margin-bottom: 0.5em;
}

.service-collapsible-content .service-actions {
  /* Styles for actions within collapsible content, if different from general .service-actions */
  /* padding: 0.75em 1em; already defined */
  /* background-color: #f9f9f9; already defined */
  /* border-top: 1px solid #eee; already defined */
}

.service-view {
  display: flex;
  flex-direction: column;
  flex-grow: 1; /* Ensure view takes available space */
}

.service-image {
  height: 150px;
  overflow: hidden;
  background-color: #f5f5f5;
}

.service-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.placeholder-image {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #999;
  font-size: 14px;
}

.service-details {
  padding: 1em;
  flex-grow: 1;
}

.service-details h4 {
  margin: 0 0 0.5em 0;
  color: #333;
  font-size: 1.2em;
}

.age-restriction {
  display: inline-block;
  background-color: #2f9f16;
  color: white;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 0.8em;
  margin-bottom: 0.5em;
}

.description {
  color: #666;
  margin: 0.5em 0;
  font-size: 0.9em;
  line-height: 1.4;
}

.price {
  color: #2f9f16;
  font-weight: bold;
  margin: 0.5em 0;
}

.date {
  color: #777;
  font-size: 0.9em;
  margin: 0.5em 0 0 0;
}

.service-actions {
  display: flex;
  justify-content: flex-end;
  padding: 0.75em 1em; /* Adjusted padding */
  background-color: #f9f9f9;
  border-top: 1px solid #eee;
}

.admin-button.icon-only {
  width: 32px; /* Standardized icon button size */
  height: 32px;
  padding: 0;
  font-size: 1rem; /* Ensure icon is visible */
  line-height: 32px; /* Center icon vertically */
}

.admin-button.icon-only + .admin-button.icon-only {
  margin-left: 0.5em;
}

/* Custom styling for edit/remove buttons if admin-button isn't enough */
.btn-edit {
  /* background: #ffd600; /* Example: if admin-button default is not desired */
  /* color: #333; */
}

.btn-remove {
  /* background: #e53935; /* Example if admin-button.danger is not desired */
  /* color: #fff; */
}

/* Edit form styles within the card */
.service-edit-form {
  padding: 1em;
  border-top: 1px solid #eee; /* Add separator if needed */
  background-color: #fdfdfd;
}

.edit-actions {
  display: flex;
  justify-content: space-between; /* Or flex-end for right-aligned buttons */
  margin-top: 1em;
}

.edit-actions .admin-button + .admin-button {
  margin-left: 0.75em; /* Space between save and cancel */
}
</style>
