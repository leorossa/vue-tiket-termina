<template>
  <div class="login-container">
    <div class="login-card">
      <h1 class="login-title">Вход в систему</h1>
      
      <form @submit.prevent="login" class="login-form">
        <div class="form-group">
          <label for="username">Имя пользователя:</label>
          <input 
            id="username" 
            v-model="username" 
            type="text" 
            class="login-input" 
            required 
            autofocus
          />
        </div>
        
        <div class="form-group">
          <label for="password">Пароль:</label>
          <input 
            id="password" 
            v-model="password" 
            type="password" 
            class="login-input" 
            required
          />
        </div>
        
        <div v-if="error" class="login-error">
          {{ error }}
        </div>
        
        <button 
          type="submit" 
          class="login-button" 
          :disabled="loading"
        >
          {{ loading ? 'Вход...' : 'Войти' }}
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/authStore';

// Инициализация хранилища аутентификации
const authStore = useAuthStore();
const router = useRouter();

// Локальное состояние компонента
const username = ref('');
const password = ref('');
const error = ref('');

// Получение состояния загрузки из хранилища
const loading = computed(() => authStore.isLoading);

// Функция входа в систему
async function login() {
  if (!username.value || !password.value) {
    error.value = 'Пожалуйста, введите имя пользователя и пароль';
    return;
  }
  
  try {
    const result = await authStore.login(username.value, password.value);
    
    if (result.success) {
      // Перенаправление на главную страницу админ-панели
      router.push('/admin');
    } else {
      error.value = result.error || 'Ошибка авторизации';
    }
  } catch (err) {
    error.value = 'Произошла ошибка при попытке входа';
    console.error('Ошибка входа:', err);
  }
}
</script>

<style>
.login-container {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background-color: var(--bg-secondary);
}

.login-card {
  width: 100%;
  max-width: 400px;
  padding: 2rem;
  background-color: var(--bg-primary);
  border-radius: var(--border-radius);
  box-shadow: var(--shadow);
}

.login-title {
  font-size: 1.5rem;
  color: var(--text-primary);
  margin-bottom: 1.5rem;
  text-align: center;
}

.login-form {
  display: flex;
  flex-direction: column;
}

.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  color: var(--text-primary);
  font-weight: 500;
}

.login-input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius-sm);
  font-size: 1rem;
  transition: var(--transition);
}

.login-input:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.25);
}

.login-button {
  margin-top: 1rem;
  padding: 0.75rem;
  background-color: var(--primary-color);
  color: white;
  border: none;
  border-radius: var(--border-radius-sm);
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: var(--transition);
}

.login-button:hover {
  background-color: var(--secondary-color);
}

.login-button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.login-error {
  margin-top: 1rem;
  padding: 0.5rem;
  color: var(--danger-color);
  background-color: rgba(239, 68, 68, 0.1);
  border-radius: var(--border-radius-sm);
  text-align: center;
}
</style>
