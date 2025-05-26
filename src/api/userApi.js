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
 * Получение информации о текущем пользователе
 * @returns {Promise<Object>} Данные текущего пользователя
 */
export async function getCurrentUser() {
  try {
    const response = await axios.get(`${API_BASE_URL}/Users/Current`, {
      headers: getAuthHeaders()
    });
    return response.data;
  } catch (error) {
    console.error('Ошибка при получении информации о текущем пользователе:', error);
    throw error;
  }
}

/**
 * Проверка, является ли текущий пользователь root-пользователем
 * @returns {Promise<boolean>} Результат проверки
 */
export async function isCurrentUserRoot() {
  try {
    const response = await axios.get(`${API_BASE_URL}/Users/IsRoot`, {
      headers: getAuthHeaders()
    });
    return response.data;
  } catch (error) {
    console.error('Ошибка при проверке root-статуса пользователя:', error);
    throw error;
  }
}

/**
 * Получение прав доступа текущего пользователя
 * @returns {Promise<Object>} Права доступа пользователя
 */
export async function getCurrentUserPermissions() {
  try {
    const response = await axios.get(`${API_BASE_URL}/Permissions/Current`, {
      headers: getAuthHeaders()
    });
    return response.data;
  } catch (error) {
    console.error('Ошибка при получении прав доступа:', error);
    throw error;
  }
}

/**
 * Получение списка прав доступа текущего пользователя
 * @returns {Promise<Object>} Список прав доступа
 */
export async function getPermissionsList() {
  try {
    const response = await axios.get(`${API_BASE_URL}/Permissions/List`, {
      headers: getAuthHeaders()
    });
    return response.data;
  } catch (error) {
    console.error('Ошибка при получении списка прав доступа:', error);
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
    const response = await axios.put(`${API_BASE_URL}/Users/Update/${id}`, userData, {
      headers: getAuthHeaders()
    });
    return response.data;
  } catch (error) {
    console.error(`Ошибка при обновлении пользователя с ID ${id}:`, error.response ? { status: error.response.status, data: error.response.data, headers: error.response.headers } : error.message);
    if (!error.response) console.error('Полный объект ошибки:', error);
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
