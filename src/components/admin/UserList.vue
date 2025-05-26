<template>
  <div class="user-list">
    <div v-if="loading" class="text-center p-3">
      <p>Загрузка пользователей...</p>
    </div>
    
    <div v-else-if="users.length === 0" class="text-center p-3">
      <p>Пользователи не найдены</p>
    </div>
    
    <div v-else class="admin-table-responsive">
      <table class="admin-table">
        <thead>
          <tr>
            <th>Имя пользователя</th>
            <th>Полное имя</th>
            <th>Email</th>
            <th>Телефон</th>
            <th>Роль</th>
            <th>Тип</th>
            <th>Дата создания</th>
            <th>Действия</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in users" :key="user.UserName">
            <td>{{ user.UserName }}</td>
            <td>{{ user.FullName }}</td>
            <td>{{ user.Email }}</td>
            <td>{{ user.Phone || '-' }}</td>
            <td>{{ getRoleName(user.Role) }}</td>
            <td>
              <span v-if="user.IsRoot" class="user-badge root">Рут</span>
              <span v-else class="user-badge normal">Обычный</span>
            </td>
            <td>{{ formatDate(user.CreatedAt) }}</td>
            <td>
              <div class="admin-button-group">
                <button @click="$emit('edit', user)" class="admin-button secondary">
                  Редактировать
                </button>
                <button 
                  @click="confirmDelete(user)" 
                  class="admin-button danger"
                  :disabled="user.IsRoot && !canManageRootUsers"
                  :title="user.IsRoot && !canManageRootUsers ? 'Только root-пользователь может удалить другого root-пользователя' : ''"
                >
                  Удалить
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    
    <!-- Модальное окно подтверждения удаления -->
    <div v-if="showConfirmModal" class="admin-modal-backdrop">
      <div class="admin-modal">
        <div class="admin-modal-header">
          <h3 class="admin-modal-title">Подтверждение удаления</h3>
          <button @click="showConfirmModal = false" class="admin-button secondary icon">✕</button>
        </div>
        <div class="admin-modal-body">
          <p>Вы действительно хотите удалить пользователя "{{ userToDelete?.UserName }}"?</p>
          <p v-if="userToDelete?.IsRoot" class="text-warning">
            <strong>Внимание!</strong> Вы удаляете root-пользователя.
          </p>
          <p class="text-danger">Это действие нельзя отменить.</p>
        </div>
        <div class="admin-modal-footer">
          <button @click="showConfirmModal = false" class="admin-button secondary">Отмена</button>
          <button @click="deleteUser" class="admin-button danger">Удалить</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useUserStore } from '@/stores/userStore';

// Определение событий
const emit = defineEmits(['edit', 'delete']);

// Инициализация хранилища пользователей
const userStore = useUserStore();

// Состояния компонента
const loading = computed(() => userStore.isLoading);
const users = computed(() => userStore.users);
const availableRoles = computed(() => userStore.availableRoles);

// Проверка, является ли текущий пользователь root-пользователем
const canManageRootUsers = computed(() => userStore.isRoot);

// Состояние модального окна подтверждения удаления
const showConfirmModal = ref(false);
const userToDelete = ref(null);

// Получение названия роли по идентификатору
function getRoleName(roleId) {
  const role = availableRoles.value.find(r => r.id === roleId);
  return role ? role.name : roleId;
}

// Форматирование даты
function formatDate(dateString) {
  if (!dateString) return '-';
  
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      // Если дата в формате "YYYY-MM-DD HH:MM", возвращаем как есть
      return dateString;
    }
    
    return date.toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch (e) {
    console.error('Ошибка при форматировании даты:', e);
    return dateString;
  }
}

// Подтверждение удаления пользователя
function confirmDelete(user) {
  // Проверяем, можно ли удалить root-пользователя
  if (user.IsRoot && !canManageRootUsers.value) {
    alert('Только root-пользователь может удалить другого root-пользователя');
    return;
  }
  
  userToDelete.value = user;
  showConfirmModal.value = true;
}

// Удаление пользователя
function deleteUser() {
  if (userToDelete.value) {
    emit('delete', userToDelete.value);
    showConfirmModal.value = false;
    userToDelete.value = null;
  }
}
</script>

<style scoped>
.user-list {
  margin-bottom: 1.5rem;
}

.text-danger {
  color: #dc3545;
}

.text-warning {
  color: #ffc107;
}

.user-badge {
  display: inline-block;
  padding: 0.25em 0.6em;
  font-size: 0.75em;
  font-weight: 700;
  line-height: 1;
  text-align: center;
  white-space: nowrap;
  vertical-align: baseline;
  border-radius: 0.25rem;
}

.user-badge.root {
  background-color: #dc3545;
  color: white;
}

.user-badge.normal {
  background-color: #6c757d;
  color: white;
}

.admin-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
