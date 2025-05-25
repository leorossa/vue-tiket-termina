<template>
  <div class="admin-container">
    <div class="admin-card">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h2 class="admin-section-title">Управление пользователями</h2>
        <button @click="openCreateUserModal" class="admin-button primary">
          Добавить пользователя
        </button>
      </div>

      <!-- Фильтры и поиск -->
      <div class="admin-form-grid mb-4">
        <div class="admin-form-group">
          <label for="searchUser">Поиск:</label>
          <input
            id="searchUser"
            v-model="searchQuery"
            type="text"
            placeholder="Введите имя или email пользователя"
            class="admin-input"
          />
        </div>
        <!--<div class="admin-form-group">
          <label for="roleFilter">Роль:</label>
          <select id="roleFilter" v-model="roleFilter" class="admin-select">
            <option value="">Все роли</option>
            <option v-for="role in availableRoles" :key="role.id" :value="role.id">
              {{ role.name }}
            </option>
          </select>
        </div>-->
      </div>

      <!-- Список пользователей -->
      <UserList 
        :users="filteredUsers" 
        :loading="loading" 
        @edit="openEditUserModal" 
        @delete="confirmDeleteUser"
      />

      <!-- Форма создания/редактирования пользователя -->
      <UserForm 
        v-if="showUserModal" 
        :user="selectedUser" 
        :is-editing="isEditing" 
        @close="closeUserModal" 
        @save="saveUser"
      />

      <!-- Модальное окно подтверждения удаления -->
      <DeleteConfirmation
        v-if="showDeleteConfirmModal"
        :item-name="userToDelete ? userToDelete.UserName : ''"
        :item-type="'пользователя'"
        @confirm="deleteUser"
        @cancel="cancelDelete"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useUserStore } from '@/stores/userStore';
import UserList from '@/components/admin/UserList.vue';
import UserForm from '@/components/admin/UserForm.vue';
import DeleteConfirmation from '@/components/admin/DeleteConfirmation.vue';

// Инициализация хранилища пользователей
const userStore = useUserStore();

// Состояния компонента
const searchQuery = ref('');
const roleFilter = ref('');
const loading = computed(() => userStore.loading);
const users = computed(() => userStore.users);
const availableRoles = computed(() => userStore.availableRoles);

const showUserModal = ref(false);
const showDeleteConfirmModal = ref(false);
const selectedUser = ref(null);
const userToDelete = ref(null);
const isEditing = ref(false);

// Фильтрация пользователей
const filteredUsers = computed(() => {
  return users.value.filter(user => {
    const matchesSearch = searchQuery.value === '' || 
      (user.UserName && user.UserName.toLowerCase().includes(searchQuery.value.toLowerCase())) || 
      (user.Email && user.Email.toLowerCase().includes(searchQuery.value.toLowerCase())) ||
      (user.FullName && user.FullName.toLowerCase().includes(searchQuery.value.toLowerCase()));
    
    const matchesRole = roleFilter.value === '' || user.Role === roleFilter.value;
    
    return matchesSearch && matchesRole;
  });
});

// Загрузка пользователей при монтировании компонента
onMounted(async () => {
  try {
    await userStore.fetchUsers();
  } catch (error) {
    console.error('Ошибка при загрузке пользователей:', error);
  }
});

// Открытие модального окна создания пользователя
function openCreateUserModal() {
  selectedUser.value = null;
  isEditing.value = false;
  showUserModal.value = true;
}

// Открытие модального окна редактирования пользователя
function openEditUserModal(user) {
  selectedUser.value = { ...user };
  isEditing.value = true;
  showUserModal.value = true;
}

// Закрытие модального окна
function closeUserModal() {
  showUserModal.value = false;
}

// Подтверждение удаления пользователя
function confirmDeleteUser(user) {
  userToDelete.value = user;
  showDeleteConfirmModal.value = true;
}

// Отмена удаления
function cancelDelete() {
  showDeleteConfirmModal.value = false;
  userToDelete.value = null;
}

// Сохранение пользователя
async function saveUser(userData) {
  try {
    if (isEditing.value) {
      console.log(`Обновление пользователя с ID: ${selectedUser.value.Id}`, userData);
      // Обновление пользователя - используем Id
      const result = await userStore.updateUser(selectedUser.value.Id, userData);
      
      if (result) {
        showUserModal.value = false;
      }
    } else {
      // Создание нового пользователя
      const result = await userStore.createUser(userData);
      
      if (result) {
        showUserModal.value = false;
      }
    }
  } catch (error) {
    console.error('Ошибка при сохранении пользователя:', error);

  }
}

// Удаление пользователя
async function deleteUser() {
  try {
    if (userToDelete.value) {
      await userStore.deleteUser(userToDelete.value.Id);
      showDeleteConfirmModal.value = false;
      userToDelete.value = null;
    }
  } catch (error) {
    console.error(`Ошибка при удалении пользователя:`, error);
    // Здесь можно добавить отображение ошибки пользователю
  }
}
</script>

<style scoped>
.admin-form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

@media (max-width: 768px) {
  .admin-form-grid {
    grid-template-columns: 1fr;
  }
}
</style>
