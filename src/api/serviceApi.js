// API для работы с услугами
import axios from 'axios';
import { useAuthStore } from '@/stores/authStore';

// Базовый URL API
const API_BASE_URL = '/api'; // Будет настроен через прокси в vite.config.js

// Функция для получения заголовков авторизации
const getAuthHeaders = () => {
  const authStore = useAuthStore();
  return authStore.authHeaders;
};

/**
 * Получение списка редактируемых услуг
 * @returns {Promise} Промис с данными услуг
 */
export const getEditableServices = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/Service/Editable`, {
      headers: getAuthHeaders()
    });
    return response.data;
  } catch (error) {
    console.error('Ошибка при получении редактируемых услуг:', error);
    throw error;
  }
};

/**
 * Получение списка простых услуг
 * @returns {Promise} Промис с данными услуг
 */
export const getSimpleServices = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/Service/Simple`, {
      headers: getAuthHeaders()
    });
    return response.data;
  } catch (error) {
    console.error('Ошибка при получении простых услуг:', error);
    throw error;
  }
};

/**
 * Создание новой услуги
 * @param {Object} serviceData Данные услуги
 * @returns {Promise} Промис с результатом операции
 */
export const createService = async (serviceData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/Service/Create`, serviceData, {
      headers: getAuthHeaders()
    });
    return response.data;
  } catch (error) {
    console.error('Ошибка при создании услуги:', error);
    throw error;
  }
};

/**
 * Обновление существующей услуги
 * @param {Number} id ID услуги
 * @param {Object} serviceData Обновленные данные услуги
 * @returns {Promise} Промис с результатом операции
 */
export const updateService = async (id, serviceData) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/Service/Update/${id}`, serviceData, {
      headers: getAuthHeaders()
    });
    return response.data;
  } catch (error) {
    console.error(`Ошибка при обновлении услуги с ID ${id}:`, error);
    throw error;
  }
};
