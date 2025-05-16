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
    
    return response.data;
  } catch (error) {
    console.error('Ошибка при получении объектов посещения:', error);
    throw error;
  }
};

/**
 * Получение объекта посещения по ID
 * @param {number} visitObjectId - ID объекта посещения
 * @returns {Promise<Object>} Данные объекта посещения
 */
export async function getVisitObjectById(visitObjectId) {
  try {
    const response = await axios.get(`${API_BASE_URL}/VisitObject/${visitObjectId}`, {
      headers: getAuthHeaders()
    });
    return response.data;
  } catch (error) {
    console.error(`Ошибка при получении объекта посещения с ID ${visitObjectId}:`, error);
    throw error;
  }
}

/**
 * Создание нового объекта посещения
 * @param {Object} visitObjectData - Данные для создания объекта посещения
 * @returns {Promise<Object>} Созданный объект посещения
 */
export async function createVisitObject(visitObjectData) {
  try {
    const response = await axios.post(`${API_BASE_URL}/VisitObject/Create`, visitObjectData, {
      headers: getAuthHeaders()
    });
    return response.data;
  } catch (error) {
    console.error('Ошибка при создании объекта посещения:', error);
    throw error;
  }
}

/**
 * Обновление объекта посещения
 * @param {number} visitObjectId - ID объекта посещения
 * @param {Object} visitObjectData - Данные для обновления объекта посещения
 * @returns {Promise<Object>} Обновленный объект посещения
 */
export async function updateVisitObject(visitObjectId, visitObjectData) {
  try {
    const response = await axios.put(`${API_BASE_URL}/VisitObject/Update/${visitObjectId}`, visitObjectData, {
      headers: getAuthHeaders()
    });
    return response.data;
  } catch (error) {
    console.error(`Ошибка при обновлении объекта посещения с ID ${visitObjectId}:`, error);
    throw error;
  }
}

/**
 * Удаление объекта посещения
 * @param {number} visitObjectId - ID объекта посещения для удаления
 * @returns {Promise<Object>} Результат операции
 */
export async function deleteVisitObject(visitObjectId) {
  try {
    const response = await axios.delete(`${API_BASE_URL}/VisitObject/Delete/${visitObjectId}`, {
      headers: getAuthHeaders()
    });
    return response.data;
  } catch (error) {
    console.error(`Ошибка при удалении объекта посещения с ID ${visitObjectId}:`, error);
    throw error;
  }
};
