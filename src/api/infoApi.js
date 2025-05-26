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
 * Удаление логов за последние 120 дней
 * @returns {Promise<boolean>} Результат удаления
 */
export async function deleteLogs() {
  try {
    const response = await axios.delete(`${API_BASE_URL}/Logs/Delete`, {
      headers: getAuthHeaders()
    });
    
    console.log('Логи удалены:', response.data);
    
    return response.data;
  } catch (error) {
    console.error('Ошибка при удалении логов:', error);
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

/**
 * Редкатирование информации о разработчике
 * @param {Object} data - Данные для редактирования
 * @returns {Promise<Object>} Результат редактирования
 */
export async function updateVersionInfo(data) {
  try {
    const response = await axios.post(`${API_BASE_URL}/Version/Update`, data, {
      headers: getAuthHeaders()
    });
    
    console.log('Информация о разработчике обновлена:', response.data);
    
    return response.data;
  } catch (error) {
    console.error('Ошибка при редактировании информации о разработчике:', error);
    throw error;
  }
}
