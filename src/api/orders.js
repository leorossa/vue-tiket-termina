// src/api/orders.js
import { apiRequest, config } from './base.js';
import { mockOrders } from '../mockServiceData.js'; // Убедитесь, что mockOrders соответствует ожидаемым структурам DTO или обновлен

export const orderAPI = {
  /**
   * Получить заказ по ID.
   * Бэкенд: GET /Order/{orderId}
   * Возвращает: OrderDto
   */
  getOrderById(orderId) {
    return config.useCustomAPI 
      ? Promise.resolve(mockOrders.find(o => o.id === orderId) || { id: orderId, status: 'не найден', message: 'Заказ не найден в мок-данных' }) // Расширенный мок
      : apiRequest(`/Order/${orderId}`);
  },
  
  /**
   * Получить список заказов по диапазону дат.
   * Бэкенд: GET /Order/Range?dtBegin=YYYY-MM-DD&dtEnd=YYYY-MM-DD
   * Возвращает: OrderResponseDto (содержащий список OrderDto)
   */
  getOrdersByDateRange(dtBegin, dtEnd) {
    const filteredOrders = mockOrders.filter(order => {
        const orderDate = new Date(order.date); // Убедитесь, что в mockOrders есть поле 'date'
        return (!dtBegin || orderDate >= new Date(dtBegin)) && (!dtEnd || orderDate <= new Date(dtEnd));
    });
    return config.useCustomAPI 
      ? Promise.resolve({ orders: filteredOrders.length > 0 ? filteredOrders : mockOrders, message: 'Фильтрация по дате для мок-данных' }) // Улучшенный мок
      : apiRequest(`/Order/Range?dtBegin=${dtBegin}&dtEnd=${dtEnd}`);
  },
  
  /**
   * Создать простой заказ.
   * Бэкенд: POST /Order/Create
   * Принимает: SimpleOrderRequestDto
   * Возвращает: OrderCreateResponseDto
   */
  createSimpleOrder(orderData) { // orderData должен соответствовать SimpleOrderRequestDto
    return config.useCustomAPI 
      ? Promise.resolve({ orderId: Date.now(), ...orderData, status: 'создан (мок)', message: 'Простой заказ успешно создан в мок-режиме' }) // Расширенный мок
      : apiRequest('/Order/Create', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(orderData),
        });
  },
  
  /**
   * Создать редактируемый заказ.
   * Бэкенд: POST /Order/CreateEditable
   * Принимает: EditableOrderRequestDto
   * Возвращает: OrderCreateResponseDto
   */
  createEditableOrder(orderData) { // orderData должен соответствовать EditableOrderRequestDto
    return config.useCustomAPI 
      ? Promise.resolve({ orderId: Date.now(), ...orderData, status: 'создан (мок)', message: 'Редактируемый заказ успешно создан в мок-режиме' }) // Расширенный мок
      : apiRequest('/Order/CreateEditable', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(orderData),
        });
  },
  
  /**
   * Отменить заказ.
   * Бэкенд: POST /Order/Cancel
   * Принимает: OrderCancelDto (например, { orderId: 123, reason: "Причина отмены" })
   * Возвращает: OrderDto (обновленный заказ со статусом отмены)
   */
  cancelOrder(cancelData) { // cancelData должен соответствовать OrderCancelDto
    return config.useCustomAPI 
      ? Promise.resolve({ id: cancelData.orderId || Date.now(), status: 'отменен (мок)', message: 'Заказ отменен в мок-режиме' })
      : apiRequest('/Order/Cancel', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(cancelData),
        });
  },

  /**
   * Рассчитать стоимость заказа.
   * Бэкенд: POST /Order/Cost
   * Принимает: CostCalculationDto
   * Возвращает: CostResponseDto
   */
  calculateOrderCost(costData) { // costData должен соответствовать CostCalculationDto
    const mockTotalCost = costData.items?.reduce((sum, item) => sum + (item.price * item.quantity), 0) || 0;
    return config.useCustomAPI 
      ? Promise.resolve({ totalCost: mockTotalCost, currency: 'RUB', message: 'Стоимость рассчитана (мок)' })
      : apiRequest('/Order/Cost', { // Исправлен эндпоинт с /Calculate на /Cost
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(costData),
        });
  },

  /**
   * Оплатить заказ.
   * Бэкенд: POST /Order/Sold
   * Принимает: SoldOrderRequestDto
   * Возвращает: SoldOrderResponseDto
   */
  processSoldOrder(soldData) { // soldData должен соответствовать SoldOrderRequestDto
    return config.useCustomAPI 
      ? Promise.resolve({ transactionId: `mock_txn_${Date.now()}`, id: soldData.orderId || Date.now(), status: 'оплачен (мок)', message: 'Заказ успешно оплачен в мок-режиме' })
      : apiRequest('/Order/Sold', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(soldData),
        });
  },

  /**
   * Возврат по заказу.
   * Бэкенд: POST /Order/Refund
   * Принимает: OrderRefundDto
   * Возвращает: OrderDto (обновленный заказ со статусом возврата)
   */
  refundOrder(refundData) { // refundData должен соответствовать OrderRefundDto
    return config.useCustomAPI 
      ? Promise.resolve({ id: refundData.orderId || Date.now(), status: 'возвращен (мок)', message: 'Возврат по заказу оформлен в мок-режиме' })
      : apiRequest('/Order/Refund', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(refundData),
        });
  }
  // Примечание по "редактированию" заказа:
  // Бэкенд не предоставляет явного эндпоинта PUT /Order/{id} для общего редактирования.
  // Редактирование обычно включает:
  // 1. Если заказ не финализирован: изменение данных на клиенте и повторное создание через createSimpleOrder/createEditableOrder.
  // 2. Если заказ финализирован: отмена (cancelOrder), возможно возврат (refundOrder), и затем создание нового заказа с измененными данными.
};
