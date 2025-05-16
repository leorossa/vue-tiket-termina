// Утилиты для работы с аутентификацией

/**
 * Получение заголовков авторизации для запросов к API
 * @returns {Object} Объект с заголовками авторизации
 */
export function getAuthHeaders() {
  // Получаем токен из localStorage или другого хранилища
  const token = localStorage.getItem('auth_token');
  
  // Если токен есть, добавляем его в заголовки
  if (token) {
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
  }
  
  // Если токена нет, возвращаем только Content-Type
  return {
    'Content-Type': 'application/json'
  };
}

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
