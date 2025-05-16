// API для работы с объектами посещения
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
 * Получение списка объектов посещения
 * @returns {Promise} Промис с данными объектов
 */
export const getVisitObjects = async () => {
  try {
    // Используем запрос к сервису объектов посещения согласно инструкции
    const response = await axios.get(`${API_BASE_URL}/VisitObject`, {
      headers: getAuthHeaders()
    });
    
    // Если эндпоинт недоступен, используем запасной вариант
    return response.data;
  } catch (error) {
    console.error('Ошибка при получении объектов посещения:', error);
    throw error;
  }
};

/**
 * Создание нового объекта посещения
 * @param {Object} objectData Данные объекта
 * @returns {Promise} Промис с результатом операции
 */
export const createVisitObject = async (objectData) => {
  try {
    // Используем запрос к сервису создания объекта посещения
    const response = await axios.post(`${API_BASE_URL}/VisitObject/Create`, objectData, {
      headers: getAuthHeaders()
    });
    return response.data;
  } catch (error) {
    console.error('Ошибка при создании объекта посещения:', error);
    throw error;
  }
};

/**
 * Обновление существующего объекта посещения
 * @param {Number} id ID объекта
 * @param {Object} objectData Обновленные данные объекта
 * @returns {Promise} Промис с результатом операции
 */
export const updateVisitObject = async (id, objectData) => {
  try {
    // Используем запрос к сервису обновления объекта посещения
    const response = await axios.put(`${API_BASE_URL}/VisitObject/Update/${id}`, objectData, {
      headers: getAuthHeaders()
    });
    return response.data;
  } catch (error) {
    console.error(`Ошибка при обновлении объекта посещения с ID ${id}:`, error);
    throw error;
  }
};

/**
 * Удаление объекта посещения
 * @param {Number} id ID объекта для удаления
 * @returns {Promise} Промис с результатом операции
 */
export const deleteVisitObject = async (id) => {
  try {
    // Используем запрос к сервису удаления объекта посещения
    const response = await axios.delete(`${API_BASE_URL}/VisitObject/Delete/${id}`, {
      headers: getAuthHeaders()
    });
    return response.data;
  } catch (error) {
    console.error(`Ошибка при удалении объекта посещения с ID ${id}:`, error);
    throw error;
  }
};
