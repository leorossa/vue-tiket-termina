// API для работы с категориями посетителей
import axios from 'axios';
import { useAuthStore } from '@/stores/authStore';

// Базовый URL API
const API_BASE_URL = '/api';

// Функция для получения заголовков авторизации
const getAuthHeaders = () => {
  const authStore = useAuthStore();
  return authStore.authHeaders;
};

/**
 * Получение списка категорий посетителей
 * @returns {Promise} Промис с данными категорий
 */
export const getCategoryVisitors = async () => {
  try {
    // Используем запрос к сервису категорий посетителей
    const response = await axios.get(`${API_BASE_URL}/CategoryVisitors`, {
      headers: getAuthHeaders()
    });
    
    return response.data;
  } catch (error) {
    console.error('Ошибка при получении категорий посетителей:', error);
    throw error;
  }
};

/**
 * Получение категории посетителей по ID
 * @param {number} id - ID категории посетителей
 * @returns {Promise<Object>} Данные категории посетителей
 */
export async function getCategoryVisitorById(id) {
  try {
    const response = await axios.get(`${API_BASE_URL}/CategoryVisitors/${id}`, {
      headers: getAuthHeaders()
    });
    return response.data;
  } catch (error) {
    console.error(`Ошибка при получении категории посетителей с ID ${id}:`, error);
    throw error;
  }
}

/**
 * Создание новой категории посетителей
 * @param {Object} categoryData - Данные для создания категории
 * @returns {Promise<Object>} Созданная категория
 */
export async function createCategoryVisitor(categoryData) {
  try {
    const response = await axios.post(`${API_BASE_URL}/CategoryVisitors/Create`, categoryData, {
      headers: getAuthHeaders()
    });
    return response.data;
  } catch (error) {
    console.error('Ошибка при создании категории посетителей:', error);
    throw error;
  }
}

/**
 * Обновление категории посетителей
 * @param {number} id - ID категории
 * @param {Object} categoryData - Данные для обновления категории
 * @returns {Promise<Object>} Обновленная категория
 */
export async function updateCategoryVisitor(id, categoryData) {
  try {
    const response = await axios.put(`${API_BASE_URL}/CategoryVisitors/Update/${id}`, categoryData, {
      headers: getAuthHeaders()
    });
    return response.data;
  } catch (error) {
    console.error(`Ошибка при обновлении категории посетителей с ID ${id}:`, error);
    throw error;
  }
}

/**
 * Удаление категории посетителей
 * @param {number} id - ID категории для удаления
 * @returns {Promise<Object>} Результат операции
 */
export async function deleteCategoryVisitor(id) {
  try {
    const response = await axios.delete(`${API_BASE_URL}/CategoryVisitors/Delete/${id}`, {
      headers: getAuthHeaders()
    });
    return response.data;
  } catch (error) {
    console.error(`Ошибка при удалении категории посетителей с ID ${id}:`, error);
    throw error;
  }
}
