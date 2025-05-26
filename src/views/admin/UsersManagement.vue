<template>
  <div class="admin-container">
    <div class="admin-card">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h2 class="admin-section-title">Управление пользователями</h2>
        <button 
          @click="openCreateUserModal" 
          class="admin-button primary"
          v-if="hasPermission('CanManageUsers')"
        >
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
        <div class="admin-form-group">
          <label for="roleFilter">Роль:</label>
          <select id="roleFilter" v-model="roleFilter" class="admin-select">
            <option value="">Все роли</option>
            <option v-for="role in availableRoles" :key="role.id" :value="role.id">
              {{ role.name }}
            </option>
          </select>
        </div>
        <div class="admin-form-group">
          <label for="typeFilter">Тип:</label>
          <select id="typeFilter" v-model="typeFilter" class="admin-select">
            <option value="">Все типы</option>
            <option value="root">Root-пользователи</option>
            <option value="normal">Обычные пользователи</option>
          </select>
        </div>
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
const typeFilter = ref('');
const loading = computed(() => userStore.loading);
const users = computed(() => userStore.users);
const availableRoles = computed(() => userStore.availableRoles);
const isRoot = computed(() => userStore.isRoot);

const showUserModal = ref(false);
const showDeleteConfirmModal = ref(false);
const selectedUser = ref(null);
const userToDelete = ref(null);
const isEditing = ref(false);

// Проверка прав доступа
function hasPermission(permission) {
  return userStore.hasPermission(permission) || isRoot.value;
}

// Фильтрация пользователей
const filteredUsers = computed(() => {
  return users.value.filter(user => {
    // Фильтр по поисковому запросу
    const matchesSearch = searchQuery.value === '' || 
      (user.UserName && user.UserName.toLowerCase().includes(searchQuery.value.toLowerCase())) || 
      (user.Email && user.Email.toLowerCase().includes(searchQuery.value.toLowerCase())) ||
      (user.FullName && user.FullName.toLowerCase().includes(searchQuery.value.toLowerCase()));
    
    // Фильтр по роли
    const matchesRole = roleFilter.value === '' || user.Role === roleFilter.value;
    
    // Фильтр по типу (root или обычный)
    const matchesType = typeFilter.value === '' || 
      (typeFilter.value === 'root' && user.IsRoot) || 
      (typeFilter.value === 'normal' && !user.IsRoot);
    
    return matchesSearch && matchesRole && matchesType;
  });
});

// Загрузка пользователей при монтировании компонента
onMounted(async () => {
  try {
    // Загружаем все данные пользователя, включая права доступа
    await userStore.loadUserData();
    
    // Проверяем права доступа
    if (!hasPermission('CanManageUsers')) {
      alert('У вас нет прав для управления пользователями');
      // Здесь можно добавить перенаправление на другую страницу
    }
  } catch (error) {
    console.error('Ошибка при загрузке данных пользователя:', error);
  }
});

// Открытие модального окна создания пользователя
function openCreateUserModal() {
  if (!hasPermission('CanManageUsers')) {
    alert('У вас нет прав для создания пользователей');
    return;
  }
  
  selectedUser.value = null;
  isEditing.value = false;
  showUserModal.value = true;
}

// Открытие модального окна редактирования пользователя
function openEditUserModal(user) {
  // Проверяем, можно ли редактировать root-пользователя
  if (user.IsRoot && !isRoot.value) {
    alert('Только root-пользователь может редактировать другого root-пользователя');
    return;
  }
  
  if (!hasPermission('CanManageUsers')) {
    alert('У вас нет прав для редактирования пользователей');
    return;
  }
  
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
  // Проверка прав доступа
  if (!hasPermission('CanManageUsers')) {
    alert('У вас нет прав для удаления пользователей');
    return;
  }
  
  // Проверка на root-пользователя
  if (user.IsRoot && !isRoot.value) {
    alert('Только root-пользователь может удалить другого root-пользователя');
    return;
  }
  
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
      
      // Проверка на root-пользователя при редактировании
      if (selectedUser.value.IsRoot && !isRoot.value) {
        throw new Error('Только root-пользователь может редактировать другого root-пользователя');
      }
      
      // Обновление пользователя
      const result = await userStore.updateUser(selectedUser.value.Id, userData);
      
      if (result) {
        showUserModal.value = false;
      }
    } else {
      // Создание нового пользователя
      // Проверка на создание root-пользователя
      if (userData.IsRoot && !isRoot.value) {
        throw new Error('Только root-пользователь может создать другого root-пользователя');
      }
      
      const result = await userStore.createUser(userData);
      
      if (result) {
        showUserModal.value = false;
      }
    }
  } catch (error) {
    console.error('Ошибка при сохранении пользователя:', error);
    alert(`Ошибка при сохранении пользователя: ${error.message}`);
  }
}

// Удаление пользователя
async function deleteUser() {
  try {
    if (userToDelete.value) {
      // Проверка на root-пользователя при удалении
      if (userToDelete.value.IsRoot && !isRoot.value) {
        throw new Error('Только root-пользователь может удалить другого root-пользователя');
      }
      
      await userStore.deleteUser(userToDelete.value.Id);
      showDeleteConfirmModal.value = false;
      userToDelete.value = null;
    }
  } catch (error) {
    console.error(`Ошибка при удалении пользователя:`, error);
    alert(`Ошибка при удалении пользователя: ${error.message}`);
  }
}
</script>

<style scoped>
.admin-form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 1rem;
}

@media (max-width: 992px) {
  .admin-form-grid {
    grid-template-columns: 1fr 1fr;
  }
}

@media (max-width: 768px) {
  .admin-form-grid {
    grid-template-columns: 1fr;
  }
}

.admin-select {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid var(--admin-border-color, #e2e8f0);
  border-radius: var(--admin-border-radius, 4px);
  background-color: white;
  font-size: 1rem;
}
</style>
