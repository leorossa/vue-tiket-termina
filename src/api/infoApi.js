// API для работы с логами и информацией о системе
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
 * Получение логов системы
 * @returns {Promise<Array>} Массив логов системы
 */
export async function getLogs() {
  try {
    const response = await axios.get(`${API_BASE_URL}/Logs`, {
      headers: getAuthHeaders()
    });
    
    console.log('Получены логи системы:', response.data);
    
    // Проверяем, что данные получены
    if (!response.data) {
      return [];
    }
    
    return response.data;
  } catch (error) {
    console.error('Ошибка при получении логов системы:', error);
    throw error;
  }
}

/**
 * Получение информации о версии системы
 * @returns {Promise<Object>} Информация о версии системы
 */
export async function getVersionInfo() {
  try {
    const response = await axios.get(`${API_BASE_URL}/Version/Info`, {
      headers: getAuthHeaders()
    });
    
    console.log('Получена информация о версии системы:', response.data);
    
    // Проверяем, что данные получены
    if (!response.data) {
      throw new Error('Информация о версии системы не найдена');
    }
    
    return response.data;
  } catch (error) {
    console.error('Ошибка при получении информации о версии системы:', error);
    throw error;
  }
}

/**
 * Получение информации об организации
 * @returns {Promise<Array>} Информация об организации
 */
export async function getOrgInfo() {
  try {
    const response = await axios.get(`${API_BASE_URL}/Info/Org`, {
      headers: getAuthHeaders()
    });
    
    console.log('Получена информация об организации:', response.data);
    
    // Проверяем, что данные получены
    if (!response.data) {
      return [];
    }
    
    return response.data;
  } catch (error) {
    console.error('Ошибка при получении информации об организации:', error);
    throw error;
  }
}
