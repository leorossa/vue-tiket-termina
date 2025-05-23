import axios from 'axios';

/**
 * Получение заказов по диапазону дат
 * @param {string} dtBegin - Начальная дата (формат: YYYY-MM-DD)
 * @param {string} dtEnd - Конечная дата (формат: YYYY-MM-DD)
 * @returns {Promise<Object>} - Объект с массивом заказов
 */
export async function getOrdersByDateRange(dtBegin, dtEnd) {
  try {
    const response = await axios.get(`/Order/Range`, {
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
    const response = await axios.get(`/Order/${orderId}`);
    return response.data;
  } catch (error) {
    console.error(`Ошибка при получении заказа с ID ${orderId}:`, error);
    throw error;
  }
}

/**
 * Изменение статуса заказа
 * @param {number} orderId - ID заказа
 * @param {number} newStatusId - ID нового статуса
 * @returns {Promise<Object>} - Результат операции
 */
export async function updateOrderStatus(orderId, newStatusId) {
  try {
    const response = await axios.put(`/Order/${orderId}/Status`, {
      statusId: newStatusId
    });
    return response.data;
  } catch (error) {
    console.error(`Ошибка при обновлении статуса заказа ${orderId}:`, error);
    throw error;
  }
}

/**
 * Отмена заказа
 * @param {number} orderId - ID заказа
 * @returns {Promise<Object>} - Результат операции
 */
export async function cancelOrder(orderId) {
  try {
    const response = await axios.delete(`/Order/${orderId}`);
    return response.data;
  } catch (error) {
    console.error(`Ошибка при отмене заказа ${orderId}:`, error);
    throw error;
  }
}
