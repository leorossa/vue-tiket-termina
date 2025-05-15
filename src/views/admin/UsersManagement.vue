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
        <div class="admin-form-group">
          <label for="roleFilter">Роль:</label>
          <select id="roleFilter" v-model="roleFilter" class="admin-select">
            <option value="">Все роли</option>
            <option value="admin">Администратор</option>
            <option value="manager">Менеджер</option>
            <option value="cashier">Кассир</option>
          </select>
        </div>
      </div>

      <!-- Таблица пользователей -->
      <div v-if="loading" class="text-center p-4">
        <p>Загрузка данных...</p>
      </div>
      <div v-else class="admin-table-responsive">
        <table class="admin-table" v-if="filteredUsers.length > 0">
          <thead>
            <tr>
              <th>ID</th>
              <th>Имя</th>
              <th>Email</th>
              <th>Роль</th>
              <th>Статус</th>
              <th>Действия</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="user in filteredUsers" :key="user.id">
              <td>{{ user.id }}</td>
              <td>{{ user.name }}</td>
              <td>{{ user.email }}</td>
              <td>
                <div class="admin-badge primary">
                  {{ getRoleName(user.role) }}
                </div>
              </td>
              <td>
                <div :class="['admin-badge', user.active ? 'success' : 'danger']">
                  {{ user.active ? 'Активен' : 'Заблокирован' }}
                </div>
              </td>
              <td>
                <div class="admin-button-group">
                  <button @click="editUser(user)" class="admin-button secondary">
                    Редактировать
                  </button>
                  <button 
                    @click="toggleUserStatus(user)" 
                    :class="['admin-button', user.active ? 'danger' : 'success']"
                  >
                    {{ user.active ? 'Заблокировать' : 'Активировать' }}
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
        <div v-else class="text-center p-4">
          <p>Пользователи не найдены. Создайте нового пользователя.</p>
        </div>
      </div>
    </div>

    <!-- Модальное окно создания/редактирования пользователя -->
    <div v-if="showUserModal" class="admin-modal-backdrop" @click.self="showUserModal = false">
      <div class="admin-modal">
        <div class="admin-modal-header">
          <h3 class="admin-modal-title">{{ isEditing ? 'Редактирование пользователя' : 'Создание нового пользователя' }}</h3>
          <button @click="showUserModal = false" class="admin-button secondary icon">✕</button>
        </div>
        <div class="admin-modal-body">
          <form @submit.prevent="saveUser">
            <!-- Основная информация -->
            <div class="admin-form-group">
              <label for="userName">Имя пользователя:</label>
              <input
                id="userName"
                v-model="currentUser.name"
                type="text"
                required
                class="admin-input"
              />
            </div>
            
            <div class="admin-form-group">
              <label for="userEmail">Email:</label>
              <input
                id="userEmail"
                v-model="currentUser.email"
                type="email"
                required
                class="admin-input"
              />
            </div>

            <div class="admin-form-group">
              <label for="userPassword">Пароль:</label>
              <input
                id="userPassword"
                v-model="currentUser.password"
                type="password"
                :required="!isEditing"
                class="admin-input"
                :placeholder="isEditing ? 'Оставьте пустым, чтобы не менять' : 'Введите пароль'"
              />
            </div>

            <div class="admin-form-group">
              <label for="userRole">Роль:</label>
              <select id="userRole" v-model="currentUser.role" required class="admin-select">
                <option value="admin">Администратор</option>
                <option value="manager">Менеджер</option>
                <option value="cashier">Кассир</option>
              </select>
            </div>

            <!-- Права доступа -->
            <div class="admin-form-group">
              <label>Права доступа:</label>
              <div class="admin-card">
                <div class="d-flex flex-column">
                  <label class="d-flex align-items-center mb-2">
                    <input type="checkbox" v-model="currentUser.permissions.canManageUsers" class="admin-checkbox" />
                    <span>Управление пользователями</span>
                  </label>
                  <label class="d-flex align-items-center mb-2">
                    <input type="checkbox" v-model="currentUser.permissions.canManageServices" class="admin-checkbox" />
                    <span>Управление услугами</span>
                  </label>
                  <label class="d-flex align-items-center mb-2">
                    <input type="checkbox" v-model="currentUser.permissions.canViewReports" class="admin-checkbox" />
                    <span>Просмотр отчетов</span>
                  </label>
                  <label class="d-flex align-items-center mb-2">
                    <input type="checkbox" v-model="currentUser.permissions.canManageSettings" class="admin-checkbox" />
                    <span>Управление настройками</span>
                  </label>
                  <label class="d-flex align-items-center">
                    <input type="checkbox" v-model="currentUser.permissions.canSellTickets" class="admin-checkbox" />
                    <span>Продажа билетов</span>
                  </label>
                </div>
              </div>
            </div>
          </form>
        </div>
        <div class="admin-modal-footer">
          <button @click="showUserModal = false" class="admin-button secondary">Отмена</button>
          <button @click="saveUser" class="admin-button primary">Сохранить</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, reactive } from 'vue';

// Состояние компонента
const users = ref([
  {
    id: 1,
    name: 'Администратор',
    email: 'admin@example.com',
    role: 'admin',
    active: true,
    permissions: {
      canManageUsers: true,
      canManageServices: true,
      canViewReports: true,
      canManageSettings: true,
      canSellTickets: true
    }
  },
  {
    id: 2,
    name: 'Менеджер',
    email: 'manager@example.com',
    role: 'manager',
    active: true,
    permissions: {
      canManageUsers: false,
      canManageServices: true,
      canViewReports: true,
      canManageSettings: false,
      canSellTickets: true
    }
  },
  {
    id: 3,
    name: 'Кассир',
    email: 'cashier@example.com',
    role: 'cashier',
    active: true,
    permissions: {
      canManageUsers: false,
      canManageServices: false,
      canViewReports: false,
      canManageSettings: false,
      canSellTickets: true
    }
  }
]);

const searchQuery = ref('');
const roleFilter = ref('');
const showUserModal = ref(false);
const isEditing = ref(false);
const loading = ref(false);

// Текущий редактируемый пользователь
const currentUser = reactive({
  id: null,
  name: '',
  email: '',
  password: '',
  role: 'cashier',
  active: true,
  permissions: {
    canManageUsers: false,
    canManageServices: false,
    canViewReports: false,
    canManageSettings: false,
    canSellTickets: true
  }
});

// Отфильтрованные пользователи
const filteredUsers = computed(() => {
  let result = users.value;
  
  // Фильтрация по поисковому запросу
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    result = result.filter(user => 
      user.name.toLowerCase().includes(query) || 
      user.email.toLowerCase().includes(query)
    );
  }
  
  // Фильтрация по роли
  if (roleFilter.value) {
    result = result.filter(user => user.role === roleFilter.value);
  }
  
  return result;
});

// Получение названия роли
function getRoleName(role) {
  const roleNames = {
    admin: 'Администратор',
    manager: 'Менеджер',
    cashier: 'Кассир'
  };
  
  return roleNames[role] || role;
}

// Методы для работы с пользователями
function openCreateUserModal() {
  // Сброс формы
  Object.assign(currentUser, {
    id: null,
    name: '',
    email: '',
    password: '',
    role: 'cashier',
    active: true,
    permissions: {
      canManageUsers: false,
      canManageServices: false,
      canViewReports: false,
      canManageSettings: false,
      canSellTickets: true
    }
  });
  
  isEditing.value = false;
  showUserModal.value = true;
}

function editUser(user) {
  // Копирование данных пользователя в форму
  Object.assign(currentUser, {
    id: user.id,
    name: user.name,
    email: user.email,
    password: '', // Пароль не отображаем
    role: user.role,
    active: user.active,
    permissions: { ...user.permissions }
  });
  
  isEditing.value = true;
  showUserModal.value = true;
}

function toggleUserStatus(user) {
  // Изменение статуса пользователя
  user.active = !user.active;
  console.log(`Статус пользователя ${user.name} изменен на ${user.active ? 'активен' : 'заблокирован'}`);
}

function saveUser() {
  try {
    if (isEditing.value) {
      // Обновление существующего пользователя
      const index = users.value.findIndex(u => u.id === currentUser.id);
      if (index !== -1) {
        // Если пароль не указан, не обновляем его
        const updatedUser = {
          ...currentUser,
          password: currentUser.password ? currentUser.password : users.value[index].password
        };
        users.value[index] = updatedUser;
      }
      
      console.log('Пользователь обновлен:', currentUser);
    } else {
      // Создание нового пользователя
      const newUser = {
        ...currentUser,
        id: Math.max(0, ...users.value.map(u => u.id)) + 1
      };
      
      users.value.push(newUser);
      
      console.log('Новый пользователь создан:', newUser);
    }
    
    // Закрытие модального окна
    showUserModal.value = false;
  } catch (error) {
    console.error('Ошибка при сохранении пользователя:', error);
  }
}

// Загрузка данных при монтировании компонента
onMounted(() => {
  // В реальном приложении здесь будет загрузка пользователей с сервера
  console.log('Компонент управления пользователями загружен');
});
</script>
