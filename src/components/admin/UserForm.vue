<template>
  <div class="admin-modal-backdrop" @click.self="$emit('close')">
    <div class="admin-modal">
      <div class="admin-modal-header">
        <h3 class="admin-modal-title">{{ isEditing ? 'Редактирование пользователя' : 'Создание нового пользователя' }}</h3>
        <button @click="$emit('close')" class="admin-button secondary icon">✕</button>
      </div>
      <div class="admin-modal-body">
        <form @submit.prevent="saveUser">
          <!-- Основная информация -->
          <div class="admin-form-group">
            <label for="userName">Имя пользователя:</label>
            <input
              id="userName"
              v-model="formData.UserName"
              type="text"
              required
              class="admin-input"
            />
          </div>
          
          <div class="admin-form-group">
            <label for="fullName">Полное имя:</label>
            <input
              id="fullName"
              v-model="formData.FullName"
              type="text"
              required
              class="admin-input"
            />
          </div>
          
          <div class="admin-form-group">
            <label for="email">Email:</label>
            <input
              id="email"
              v-model="formData.Email"
              type="email"
              required
              class="admin-input"
            />
          </div>
          
          <div class="admin-form-group">
            <label for="phone">Телефон:</label>
            <input
              id="phone"
              v-model="formData.Phone"
              type="text"
              class="admin-input"
            />
          </div>
          
          <div class="admin-form-group">
            <label for="password">Пароль:</label>
            <input
              id="password"
              v-model="formData.Password"
              type="password"
              :required="!isEditing"
              class="admin-input"
              :placeholder="isEditing ? 'Оставьте пустым, чтобы не менять' : ''"
            />
          </div>
          
          <div class="admin-form-group">
            <label for="role">Роль:</label>
            <select
              id="role"
              v-model="formData.Role"
              required
              class="admin-input"
            >
              <option v-for="role in availableRoles" :key="role.id" :value="role.id">
                {{ role.name }}
              </option>
            </select>
          </div>
          
          <!-- Root-пользователь -->
          <div class="admin-form-group" v-if="canManageRootUsers">
            <label class="admin-checkbox-item">
              <input 
                type="checkbox" 
                v-model="formData.IsRoot" 
                class="admin-checkbox"
                @change="handleRootChange"
              />
              <span>Root-пользователь (имеет все права)</span>
            </label>
          </div>
          
          <!-- Права доступа -->
          <div class="admin-form-group" v-if="!formData.IsRoot">
            <label>Права доступа:</label>
            <div class="admin-checkbox-grid">
              <label 
                v-for="permission in availablePermissions" 
                :key="permission.id" 
                class="admin-checkbox-item"
              >
                <input 
                  type="checkbox" 
                  v-model="formData.Permissions[permission.id]" 
                  class="admin-checkbox" 
                />
                <span>{{ permission.name }}</span>
              </label>
            </div>
          </div>
          
          <div class="admin-form-group" v-else>
            <div class="permissions-info">
              Root-пользователь имеет все права доступа в системе
            </div>
          </div>
        </form>
      </div>
      <div class="admin-modal-footer">
        <button @click="$emit('close')" class="admin-button secondary">Отмена</button>
        <button @click="saveUser" class="admin-button primary">Сохранить</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue';
import { useUserStore } from '@/stores/userStore';

// Определение входных параметров
const props = defineProps({
  user: {
    type: Object,
    default: () => ({})
  },
  isEditing: {
    type: Boolean,
    default: false
  }
});

// Определение событий
const emit = defineEmits(['close', 'save']);

// Инициализация хранилища пользователей
const userStore = useUserStore();

// Доступные роли и права
const availableRoles = computed(() => userStore.availableRoles);
const availablePermissions = computed(() => userStore.availablePermissions);

// Проверка, может ли текущий пользователь управлять root-пользователями
const canManageRootUsers = computed(() => userStore.isRoot);

// Данные формы с учетом новой структуры API
const formData = reactive({
  UserName: '',
  FullName: '',
  Email: '',
  Phone: '',
  Password: '',
  Role: 'USER',
  IsRoot: false,
  Permissions: {}
});

// Обработка изменения статуса root-пользователя
function handleRootChange() {
  if (formData.IsRoot) {
    // Если пользователь стал root, устанавливаем все права
    availablePermissions.value.forEach(permission => {
      formData.Permissions[permission.id] = true;
    });
  }
}

// Инициализация прав доступа
onMounted(() => {
  // Создаем объект с правами доступа
  const permissions = {};
  availablePermissions.value.forEach(permission => {
    permissions[permission.id] = false;
  });
  
  // Устанавливаем начальные значения
  formData.Permissions = permissions;
  
  // Если редактируем пользователя, заполняем форму его данными
  if (props.isEditing && props.user) {
    formData.UserName = props.user.UserName || '';
    formData.FullName = props.user.FullName || '';
    formData.Email = props.user.Email || '';
    formData.Phone = props.user.Phone || '';
    formData.Role = props.user.Role || 'USER';
    formData.IsRoot = props.user.IsRoot || false;
    
    // Если у пользователя есть права, заполняем их
    if (props.user.Permissions) {
      Object.keys(props.user.Permissions).forEach(key => {
        if (formData.Permissions.hasOwnProperty(key)) {
          formData.Permissions[key] = props.user.Permissions[key];
        }
      });
    }
  }
});

// Функция сохранения пользователя
function saveUser() {
  try {
    // Копируем данные формы для отправки
    const userData = { ...formData };
    
    // Удаляем пароль, если он пустой при редактировании
    if (props.isEditing && !userData.Password) {
      delete userData.Password;
    }
    
    console.log('Отправка данных пользователя:', userData);
    
    // Отправка данных родительскому компоненту
    emit('save', userData);
  } catch (error) {
    console.error('Ошибка при сохранении пользователя:', error);
  }
}
</script>

<style scoped>
.admin-checkbox-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 0.5rem;
}

.admin-checkbox-item {
  display: flex;
  align-items: center;
  margin-bottom: 0.5rem;
}

.admin-checkbox-item input {
  margin-right: 0.5rem;
}
</style>
