// src/api/orders.js
import { apiRequest, config } from './base.js';
import { mockOrders } from '../mockServiceData.js';

export const orderAPI = {
  /**
   * Получить заказ по ID
   */
  getOrderById(orderId) {
    return config.useCustomAPI 
      ? Promise.resolve(mockOrders.find(o => o.id === orderId) || { id: orderId, status: 'не найден' }) // Improved mock
      : apiRequest(`/Order/${orderId}`);
  },
  
  /**
   * Получить список заказов по дате
   */
  getOrdersByDateRange(dtBegin, dtEnd) {
    // Mock should filter by date range if possible, or return all if complex
    const filteredOrders = mockOrders.filter(order => {
        const orderDate = new Date(order.date);
        return (!dtBegin || orderDate >= new Date(dtBegin)) && (!dtEnd || orderDate <= new Date(dtEnd));
    });
    return config.useCustomAPI 
      ? Promise.resolve({ orders: filteredOrders.length > 0 ? filteredOrders : mockOrders }) // Fallback to all if filter is empty to mimic some data
      : apiRequest(`/Order/Range?dtBegin=${dtBegin}&dtEnd=${dtEnd}`);
  },
  
  /**
   * Создать простой заказ
   */
  createSimpleOrder(orderData) {
    return config.useCustomAPI 
      ? Promise.resolve({ id: Date.now(), ...orderData, status: 'создан' }) // Improved mock
      : apiRequest('/Order/Create', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(orderData),
        });
  },
  
  /**
   * Создать редактируемый заказ
   */
  createEditableOrder(orderData) {
    return config.useCustomAPI 
      ? Promise.resolve({ id: Date.now(), ...orderData, status: 'создан' }) // Improved mock
      : apiRequest('/Order/CreateEditable', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(orderData),
        });
  },
  
  /**
   * Отменить заказ
   */
  cancelOrder(orderData) { // orderData might be just an ID or more complex
    return config.useCustomAPI 
      ? Promise.resolve({ id: orderData.id || Date.now(), status: 'отменен' }) // Improved mock
      : apiRequest('/Order/Cancel', { // Endpoint might vary, assuming POST with body
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(orderData),
        });
  },

  /**
   * Рассчитать стоимость заказа
   */
  calculateOrderCost(costData) {
    // A very basic mock, real calculation would be complex
    const totalCost = costData.items?.reduce((sum, item) => sum + (item.price * item.quantity), 0) || 0;
    return config.useCustomAPI 
      ? Promise.resolve({ totalCost })
      : apiRequest('/Order/Calculate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(costData),
        });
  },

  /**
   * Оплатить заказ
   */
  processSoldOrder(orderData) {
    return config.useCustomAPI 
      ? Promise.resolve({ id: orderData.id || Date.now(), status: 'оплачен' })
      : apiRequest('/Order/Sold', { // Endpoint might vary
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(orderData),
        });
  },

  /**
   * Возврат по заказу
   */
  refundOrder(refundData) {
    return config.useCustomAPI 
      ? Promise.resolve({ id: refundData.orderId || Date.now(), status: 'возвращен' })
      : apiRequest('/Order/Refund', { // Endpoint might vary
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(refundData),
        });
  }
};
