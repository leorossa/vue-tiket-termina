// Хранилище для управления аутентификацией
import { defineStore } from 'pinia';
import axios from 'axios';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    token: localStorage.getItem('auth_token') || null,
    loading: false,
    error: null
  }),
  
  getters: {
    // Проверка, авторизован ли пользователь
    isAuthenticated: (state) => !!state.token,
    
    // Получение текущего пользователя
    currentUser: (state) => state.user,
    
    // Получение токена авторизации
    authToken: (state) => state.token,
    
    // Получение заголовков авторизации для запросов
    authHeaders: (state) => {
      if (!state.token) return {};
      
      // Для базовой авторизации используем Base64-кодирование
      return {
        'Authorization': `Basic ${state.token}`
      };
    },
    
    // Проверка загрузки
    isLoading: (state) => state.loading
  },
  
  actions: {
    // Вход в систему
    async login(username, password) {
      this.loading = true;
      this.error = null;
      
      try {
        // Создаем токен для базовой авторизации (Base64-кодирование)
        const token = btoa(`${username}:${password}`);
        
        // Проверяем авторизацию через запрос к API
        const response = await axios.get('/api/Service/Editable', {
          headers: {
            'Authorization': `Basic ${token}`
          }
        });
        
        // Если запрос успешен, сохраняем токен и информацию о пользователе
        this.token = token;
        this.user = {
          username,
          role: 'admin' // В реальном приложении роль должна приходить с сервера
        };
        
        // Сохраняем токен в localStorage для сохранения сессии
        localStorage.setItem('auth_token', token);
        
        // Устанавливаем заголовок авторизации по умолчанию для всех запросов
        axios.defaults.headers.common['Authorization'] = `Basic ${token}`;
        
        return { success: true, user: this.user };
      } catch (error) {
        this.error = error.response?.data?.message || 'Ошибка авторизации';
        console.error('Ошибка авторизации:', error);
        return { success: false, error: this.error };
      } finally {
        this.loading = false;
      }
    },
    
    // Выход из системы
    logout() {
      this.user = null;
      this.token = null;
      
      // Удаляем токен из localStorage
      localStorage.removeItem('auth_token');
      
      // Удаляем заголовок авторизации из запросов по умолчанию
      delete axios.defaults.headers.common['Authorization'];
    },
    
    // Проверка состояния аутентификации
    async checkAuth() {
      if (!this.token) return false;
      
      try {
        // Проверяем валидность токена через запрос к API
        await axios.get('/api/Service/Editable', {
          headers: {
            'Authorization': `Basic ${this.token}`
          }
        });
        
        // Если запрос успешен, устанавливаем заголовок авторизации по умолчанию
        axios.defaults.headers.common['Authorization'] = `Basic ${this.token}`;
        
        // Получаем информацию о пользователе из токена
        const [username] = atob(this.token).split(':');
        this.user = {
          username,
          role: 'admin' // В реальном приложении роль должна приходить с сервера
        };
        
        return true;
      } catch (error) {
        // Если токен недействителен, выполняем выход
        this.logout();
        return false;
      }
    }
  }
});
