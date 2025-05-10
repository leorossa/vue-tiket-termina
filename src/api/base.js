// src/api/base.js

const API_BASE = ''; // Базовый URL для API

export const config = {
  // Флаг для переключения между собственным API и API СБ
  useCustomAPI: true
};

/**
 * Базовая функция для выполнения API-запросов
 */
export async function apiRequest(path, options = {}) {
  const url = API_BASE + path;
  
  try {
    const response = await fetch(url, options);
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
