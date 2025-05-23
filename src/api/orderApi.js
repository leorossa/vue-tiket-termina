import axios from 'axios';
import { API_BASE_URL } from '@/config';

/**
 * Получение заказов по диапазону дат
 * @param {string} dtBegin - Начальная дата (формат: YYYY-MM-DD)
 * @param {string} dtEnd - Конечная дата (формат: YYYY-MM-DD)
 * @returns {Promise<Object>} - Объект с массивом заказов
 */
export async function getOrdersByDateRange(dtBegin, dtEnd) {
  try {
    const response = await axios.get(`${API_BASE_URL}/Order/Range`, {
      params: {
        dtBegin,
        dtEnd
      }
    });
    return response.data;
  } catch (error) {
    console.error('Ошибка при получении заказов по диапазону дат:', error);
    throw error;
  }
}

/**
 * Получение детальной информации о заказе по ID
 * @param {number} orderId - ID заказа
 * @returns {Promise<Object>} - Детальная информация о заказе
 */
export async function getOrderById(orderId) {
  try {
    const response = await axios.get(`${API_BASE_URL}/Order/${orderId}`);
    return response.data;
  } catch (error) {
    console.error(`Ошибка при получении заказа с ID ${orderId}:`, error);
    throw error;
  }
}
