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
              v-model="formData.userName"
              type="text"
              required
              class="admin-input"
            />
          </div>
          
          <div class="admin-form-group">
            <label for="fullName">Полное имя:</label>
            <input
              id="fullName"
              v-model="formData.fullName"
              type="text"
              required
              class="admin-input"
            />
          </div>
          
          <div class="admin-form-group">
            <label for="email">Email:</label>
            <input
              id="email"
              v-model="formData.email"
              type="email"
              required
              class="admin-input"
            />
          </div>
          
          <div class="admin-form-group">
            <label for="phone">Телефон:</label>
            <input
              id="phone"
              v-model="formData.phone"
              type="text"
              class="admin-input"
            />
          </div>
          
          <div class="admin-form-group">
            <label for="password">Пароль:</label>
            <input
              id="password"
              v-model="formData.password"
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
              v-model="formData.role"
              required
              class="admin-input"
            >
              <option v-for="role in availableRoles" :key="role.id" :value="role.id">
                {{ role.name }}
              </option>
            </select>
          </div>
          
          <!-- Права доступа -->
          <div class="admin-form-group">
            <label>Права доступа:</label>
            <div class="admin-checkbox-grid">
              <label 
                v-for="permission in availablePermissions" 
                :key="permission.id" 
                class="admin-checkbox-item"
              >
                <input 
                  type="checkbox" 
                  v-model="formData.permissions[permission.id]" 
                  class="admin-checkbox" 
                />
                <span>{{ permission.name }}</span>
              </label>
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

// Данные формы
const formData = reactive({
  userName: '',
  fullName: '',
  email: '',
  phone: '',
  password: '',
  role: 'USER',
  permissions: {}
});

// Инициализация прав доступа
onMounted(() => {
  // Создаем объект с правами доступа
  const permissions = {};
  availablePermissions.value.forEach(permission => {
    permissions[permission.id] = false;
  });
  
  // Устанавливаем начальные значения
  formData.permissions = permissions;
  
  // Если редактируем пользователя, заполняем форму его данными
  if (props.isEditing && props.user) {
    formData.userName = props.user.UserName || '';
    formData.fullName = props.user.FullName || '';
    formData.email = props.user.Email || '';
    formData.phone = props.user.Phone || '';
    formData.role = props.user.Role || 'USER';
    
    // Если у пользователя есть права, заполняем их
    if (props.user.permissions) {
      Object.keys(props.user.permissions).forEach(key => {
        if (formData.permissions.hasOwnProperty(key)) {
          formData.permissions[key] = props.user.permissions[key];
        }
      });
    }
  }
});

// Функция сохранения пользователя
function saveUser() {
  try {
    // Подготовка данных для сохранения
    const userData = {
      UserName: formData.userName,
      FullName: formData.fullName,
      Email: formData.email,
      Phone: formData.phone,
      Role: formData.role
    };
    
    // Добавляем пароль только если он указан
    if (formData.password) {
      userData.Password = formData.password;
    }
    
    // Добавляем права доступа
    userData.permissions = formData.permissions;
    
    console.log('Отправка данных пользователя:', userData);
    
    // Отправка данных родительскому компоненту
    emit('save', userData, props.isEditing);
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
