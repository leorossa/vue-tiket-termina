import axios from 'axios';
import { API_BASE_URL } from '@/config';
import { getAuthHeaders } from '@/utils/auth';

/**
 * Получение списка всех пользователей
 * @returns {Promise<Array>} Список пользователей
 */
export async function getUsers() {
  try {
    const response = await axios.get(`${API_BASE_URL}/Users`, {
      headers: getAuthHeaders()
    });
    return response.data;
  } catch (error) {
    console.error('Ошибка при получении списка пользователей:', error);
    throw error;
  }
}

/**
 * Получение пользователя по ID
 * @param {string} id - ID пользователя
 * @returns {Promise<Object>} Данные пользователя
 */
export async function getUserById(id) {
  try {
    const response = await axios.get(`${API_BASE_URL}/Users/FindById/${id}`, {
      headers: getAuthHeaders()
    });
    return response.data;
  } catch (error) {
    console.error(`Ошибка при получении пользователя с ID ${id}:`, error);
    throw error;
  }
}

/**
 * Создание нового пользователя
 * @param {Object} userData - Данные пользователя
 * @returns {Promise<Object>} Созданный пользователь
 */
export async function createUser(userData) {
  try {
    const response = await axios.post(`${API_BASE_URL}/Users/Create`, userData, {
      headers: getAuthHeaders()
    });
    return response.data;
  } catch (error) {
    console.error('Ошибка при создании пользователя:', error);
    throw error;
  }
}

/**
 * Обновление пользователя
 * @param {string} id - ID пользователя
 * @param {Object} userData - Данные для обновления
 * @returns {Promise<Object>} Обновленный пользователь
 */
export async function updateUser(id, userData) {
  try {
    // Согласно документации API, путь должен быть /Users/Update/{id}
    console.log(`Отправка запроса на обновление пользователя с ID ${id}:`, userData);
    const response = await axios.put(`${API_BASE_URL}/Users/Update/${id}`, userData, {
      headers: getAuthHeaders()
    });
    return response.data;
  } catch (error) {
    console.error(`Ошибка при обновлении пользователя с ID ${id}:`, error);
    throw error;
  }
}

/**
 * Удаление пользователя
 * @param {string} id - ID пользователя
 * @returns {Promise<Object>} Результат удаления
 */
export async function deleteUser(id) {
  try {
    const response = await axios.delete(`${API_BASE_URL}/Users/Delete/${id}`, {
      headers: getAuthHeaders()
    });
    return response.data;
  } catch (error) {
    console.error(`Ошибка при удалении пользователя с ID ${id}:`, error);
    throw error;
  }
}
