import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { getOrdersByDateRange, getOrderById } from '@/api/orderApi';

export const useOrderStore = defineStore('order', () => {
  // Состояние
  const orders = ref([]);
  const currentOrder = ref(null);
  const loading = ref(false);
  const error = ref(null);

  // Геттеры (вычисляемые свойства)
  const sortedOrders = computed(() => {
    return [...orders.value].sort((a, b) => b.OrderId - a.OrderId);
  });

  const orderStatusMap = {
    1: 'Выдан',
    2: 'Возвращен',
    4: 'Заказан',
    5: 'Оплачен',
  };

  const getStatusName = (statusId) => {
    return orderStatusMap[statusId] || 'Неизвестный статус';
  };

  // Действия
  async function fetchOrdersByDateRange(dtBegin, dtEnd) {
    loading.value = true;
    error.value = null;
    try {
      const response = await getOrdersByDateRange(dtBegin, dtEnd);
      orders.value = response.Order || [];
    } catch (err) {
      console.error('Ошибка при загрузке заказов:', err);
      error.value = 'Не удалось загрузить заказы. Пожалуйста, попробуйте позже.';
    } finally {
      loading.value = false;
    }
  }
  
  // Функция для загрузки заказов по дате создания
  async function fetchOrdersByCreatedAtRange(startDate, endDate) {
    loading.value = true;
    error.value = null;
    try {
      console.log(`Запрос заказов за период: ${startDate} - ${endDate}`);
      
      // Проверяем, является ли это ежедневным отчетом
      const isDaily = startDate === endDate;
      
      // Используем тот же API-метод, но с пометкой, что фильтруем по дате создания
      const response = await getOrdersByDateRange(startDate, endDate, true);
      
      // Получаем заказы из ответа
      let filteredOrders = response.Order || [];
      
      // Дополнительная фильтрация на стороне клиента для ежедневных отчетов
      if (isDaily && filteredOrders.length > 0) {
        console.log('Дополнительная фильтрация для ежедневного отчета');
        
        // Парсим дату отчета
        const reportDate = new Date(startDate);
        const reportDay = reportDate.getDate();
        const reportMonth = reportDate.getMonth();
        const reportYear = reportDate.getFullYear();
        
        // Фильтруем заказы строго по дате создания
        filteredOrders = filteredOrders.filter(order => {
          // Проверяем дату в услугах
          if (order.Service && order.Service.length > 0 && order.Service[0].DtVisit) {
            const orderDateStr = order.Service[0].DtVisit;
            let orderDate;
            
            // Парсим дату с учетом возможных форматов
            try {
              if (orderDateStr.includes(':')) {
                // Формат с временем (2025-05-27 21:07)
                orderDate = new Date(orderDateStr.replace(' ', 'T'));
              } else {
                // Только дата (2025-05-27)
                orderDate = new Date(orderDateStr);
              }
              
              // Проверяем совпадение дня, месяца и года
              const isSameDay = orderDate.getDate() === reportDay && 
                               orderDate.getMonth() === reportMonth && 
                               orderDate.getFullYear() === reportYear;
              
              console.log(`Заказ ID:${order.Id}, Дата:${orderDateStr}, Совпадает с ${startDate}: ${isSameDay}`);
              
              return isSameDay;
            } catch (e) {
              console.error('Ошибка при парсинге даты:', orderDateStr, e);
              return false;
            }
          }
          return false;
        });
      }
      
      orders.value = filteredOrders;
      console.log('Загружены заказы по дате создания:', orders.value.length);
    } catch (err) {
      console.error('Ошибка при загрузке заказов по дате создания:', err);
      error.value = 'Не удалось загрузить заказы. Пожалуйста, попробуйте позже.';
    } finally {
      loading.value = false;
    }
  }

  async function fetchOrderById(orderId) {
    loading.value = true;
    error.value = null;
    try {
      const response = await getOrderById(orderId);
      currentOrder.value = response;
      return response;
    } catch (err) {
      console.error(`Ошибка при загрузке заказа ${orderId}:`, err);
      error.value = 'Не удалось загрузить информацию о заказе. Пожалуйста, попробуйте позже.';
      return null;
    } finally {
      loading.value = false;
    }
  }

  // Обновление статуса заказа в локальном состоянии (без API-вызова, так как эндпоинт недоступен)
  function updateOrderStatusLocally(orderId, newStatusId) {
    // Обновляем статус заказа в локальном массиве
    const orderIndex = orders.value.findIndex(order => order.OrderId === orderId);
    if (orderIndex !== -1) {
      orders.value[orderIndex].OrderStateId = newStatusId;
    }
    
    // Если текущий заказ открыт, обновляем его статус
    if (currentOrder.value && currentOrder.value.OrderId === orderId) {
      currentOrder.value.OrderStateId = newStatusId;
    }
    
    return true;
  }

  // Удаление заказа из локального состояния (без API-вызова, так как эндпоинт недоступен)
  function removeOrderLocally(orderId) {
    // Удаляем заказ из локального массива
    orders.value = orders.value.filter(order => order.OrderId !== orderId);
    
    // Если текущий заказ открыт и это тот, который мы удаляем, сбрасываем его
    if (currentOrder.value && currentOrder.value.OrderId === orderId) {
      currentOrder.value = null;
    }
    
    return true;
  }

  // Сброс состояния хранилища
  function resetState() {
    orders.value = [];
    currentOrder.value = null;
    loading.value = false;
    error.value = null;
  }

  return {
    // Состояние
    orders,
    currentOrder,
    loading,
    error,
    
    // Геттеры
    sortedOrders,
    getStatusName,
    
    // Действия
    fetchOrdersByDateRange,
    fetchOrdersByCreatedAtRange,
    fetchOrderById,
    updateOrderStatusLocally,
    removeOrderLocally,
    resetState
  };
});
