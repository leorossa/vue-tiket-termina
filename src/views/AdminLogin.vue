<template>
  <div class="admin-container admin-login-container">
    <div class="admin-card login-form-card">
      <h2 class="admin-section-title text-center">Вход в панель управления</h2>
      <form @submit.prevent="handleLogin">
        <div class="admin-form-group">
          <label for="username">Имя пользователя или Email:</label>
          <input type="text" id="username" v-model="username" class="admin-input" required placeholder="admin">
        </div>
        <div class="admin-form-group">
          <label for="password">Пароль:</label>
          <input type="password" id="password" v-model="password" class="admin-input" required placeholder="password">
        </div>
        <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
        <button type="submit" class="admin-button primary full-width">Войти</button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const username = ref('');
const password = ref('');
const errorMessage = ref('');
const router = useRouter();

const handleLogin = () => {
  // Mock login logic - в реальном приложении здесь будет вызов API
  if (username.value === 'admin' && password.value === 'password') {
    errorMessage.value = '';
    console.log('Успешный вход');
    // Предполагается, что после успешного входа произойдет редирект
    // Например, с помощью router.push('/admin/dashboard')
    // или будет установлено состояние аутентификации (например, в Pinia/Vuex)
    // localStorage.setItem('authToken', 'mockToken'); // Пример сохранения токена
    router.push({ name: 'AdminDashboard' }); 
  } else {
    errorMessage.value = 'Неверное имя пользователя или пароль.';
  }
};
</script>

<style scoped>
.admin-login-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: calc(100vh - 160px); /* Высота вьюпорта минус предполагаемая высота хедера/футера */
  padding: 2em 1em;
  background-color: var(--admin-bg-light, #f9fafb); /* Светлый фон для всей страницы логина */
}

.login-form-card {
  width: 100%;
  max-width: 420px; /* Оптимальная ширина для формы логина */
  padding: 2em 2.5em; /* Немного больше паддинга для формы */
  box-shadow: var(--admin-shadow-lg, 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05));
}

.admin-section-title.text-center {
  text-align: center;
  margin-bottom: 1.5em;
  font-size: 1.5rem; /* Крупнее заголовок для страницы логина */
}

.admin-form-group {
  margin-bottom: 1.25em;
}

.admin-form-group label {
  display: block;
  margin-bottom: 0.5em;
  font-weight: 500;
  color: var(--admin-text-secondary, #4b5563);
}

.admin-button.full-width {
  width: 100%;
  padding: 0.8em;
  font-size: 1rem;
  margin-top: 1em; /* Отступ перед кнопкой, если есть сообщение об ошибке */
}

.error-message {
  color: var(--admin-danger-text, #991b1b); /* Более темный текст ошибки для контраста */
  background-color: var(--admin-danger-bg-light, #fee2e2);
  border: 1px solid var(--admin-danger-border, #fecaca);
  padding: 0.75em 1em;
  border-radius: var(--admin-border-radius, 6px);
  margin-bottom: 1.25em; /* Отступ снизу, перед кнопкой */
  text-align: center;
  font-size: 0.875rem;
}
</style>
