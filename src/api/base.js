// src/api/base.js

// Базовый URL для API. Должен указывать на ваш бэкенд, например, http://localhost:8080
const API_BASE = process.env.VUE_APP_API_BASE_URL || ''; 

export const config = {
  // Флаг для переключения между собственным API и API СБ (или другими моками)
  useCustomAPI: false // Установите false для использования реального API, true для использования моков
};

/**
 * Базовая функция для выполнения API-запросов.
 * Автоматически добавляет заголовок Basic Authorization, если определены
 * VUE_APP_API_USER и VUE_APP_API_PASSWORD в переменных окружения.
 */
export async function apiRequest(path, options = {}) {
  const url = API_BASE + path;
  
  // Подготовка заголовков
  const newOptions = { ...options };
  newOptions.headers = { ...options.headers }; // Копируем существующие заголовки

  // Добавляем Basic Auth, если useCustomAPI выключен и учетные данные есть
  if (!config.useCustomAPI && process.env.VUE_APP_API_USER && process.env.VUE_APP_API_PASSWORD) {
    const username = process.env.VUE_APP_API_USER;
    const password = process.env.VUE_APP_API_PASSWORD;
    const basicAuth = 'Basic ' + btoa(`${username}:${password}`); // btoa для кодирования в Base64
    newOptions.headers['Authorization'] = basicAuth;
  }

  // Убедимся, что Content-Type установлен для POST/PUT, если есть тело и он еще не задан
  if ((newOptions.method === 'POST' || newOptions.method === 'PUT') && newOptions.body && !newOptions.headers['Content-Type']) {
    newOptions.headers['Content-Type'] = 'application/json';
  }

  try {
    const response = await fetch(url, newOptions); // Используем newOptions с возможно добавленным заголовком
    if (!response.ok) {
      // Log more details for server errors
      const errorBody = await response.text();
      console.error(`API error: ${response.status} ${response.statusText} for path ${path}. Body: ${errorBody}`);
      throw new Error(`API error: ${response.status}`);
    }
    // Handle cases where response might be empty (e.g., for DELETE requests)
    const text = await response.text();
    return text ? JSON.parse(text) : {}; // Return empty object for empty successful responses
  } catch (error) {
    // Catch network errors or JSON parsing errors
    if (error instanceof SyntaxError) {
        console.error(`API request error: JSON parsing failed for path ${path}:`, error);
    } else {
        console.error(`API request error for path ${path}:`, error);
    }
    throw error; // Re-throw the error so it can be caught by the caller
  }
}
