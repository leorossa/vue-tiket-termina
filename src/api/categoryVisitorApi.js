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
    // Используем запрос к сервису редактируемых услуг, так как он возвращает все необходимые данные
    const response = await axios.get(`${API_BASE_URL}/Service/Editable`, {
      headers: getAuthHeaders()
    });
    // Возвращаем только категории посетителей и их группы
    return {
      CategoryVisitor: response.data.ObjectCategoryVisitor || [],
      GroupCategoryVisitor: response.data.GroupCategoryVisitor || []
    };
  } catch (error) {
    console.error('Ошибка при получении категорий посетителей:', error);
    throw error;
  }
};

/**
 * Создание новой категории посетителей
 * @param {Object} categoryData Данные категории
 * @returns {Promise} Промис с результатом операции
 */
export const createCategoryVisitor = async (categoryData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/CategoryVisitor/Create`, categoryData, {
      headers: getAuthHeaders()
    });
    return response.data;
  } catch (error) {
    console.error('Ошибка при создании категории посетителей:', error);
    throw error;
  }
};

/**
 * Обновление существующей категории посетителей
 * @param {Number} id ID категории
 * @param {Object} categoryData Обновленные данные категории
 * @returns {Promise} Промис с результатом операции
 */
export const updateCategoryVisitor = async (id, categoryData) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/CategoryVisitor/Update/${id}`, categoryData, {
      headers: getAuthHeaders()
    });
    return response.data;
  } catch (error) {
    console.error(`Ошибка при обновлении категории посетителей с ID ${id}:`, error);
    throw error;
  }
};

/**
 * Удаление категории посетителей
 * @param {Number} id ID категории для удаления
 * @returns {Promise} Промис с результатом операции
 */
export const deleteCategoryVisitor = async (id) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/CategoryVisitor/Delete/${id}`, {
      headers: getAuthHeaders()
    });
    return response.data;
  } catch (error) {
    console.error(`Ошибка при удалении категории посетителей с ID ${id}:`, error);
    throw error;
  }
};
