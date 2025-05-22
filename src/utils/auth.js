// Утилиты для работы с аутентификацией
// Этот файл оставлен для обратной совместимости
// Вся логика авторизации перенесена в authStore.js

import { useAuthStore } from '@/stores/authStore';

/**
 * Получение заголовков авторизации для запросов к API
 * @returns {Object} Объект с заголовками авторизации
 */
export function getAuthHeaders() {
  // Используем геттер из хранилища аутентификации
  const authStore = useAuthStore();
  return authStore.authHeaders;
};

/**
 * Проверка, авторизован ли пользователь
 * @returns {boolean} true, если пользователь авторизован
 */
export function isAuthenticated() {
  const token = localStorage.getItem('auth_token');
  return !!token;
}

/**
 * Сохранение токена аутентификации
 * @param {string} token - Токен для сохранения
 */
export function saveAuthToken(token) {
  localStorage.setItem('auth_token', token);
}

/**
 * Удаление токена аутентификации (выход из системы)
 */
export function removeAuthToken() {
  localStorage.removeItem('auth_token');
}
