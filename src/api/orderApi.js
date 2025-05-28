import axios from 'axios';
import { API_BASE_URL } from '@/config';

/**
 * Получение заказов по диапазону дат
 * @param {string} dtBegin - Начальная дата (формат: YYYY-MM-DD)
 * @param {string} dtEnd - Конечная дата (формат: YYYY-MM-DD)
 * @param {boolean} [filterByCreatedAt=false] - Флаг, указывающий на фильтрацию по дате создания заказа
 * @returns {Promise<Object>} - Объект с массивом заказов
 */
export async function getOrdersByDateRange(dtBegin, dtEnd, filterByCreatedAt = false) {
  try {
    // Формируем параметры запроса
    const params = {
      dtBegin,
      dtEnd
    };
    
    // Если нужно фильтровать по дате создания, добавляем соответствующий параметр
    if (filterByCreatedAt) {
      params.filterByCreatedAt = true;
    }
    
    const response = await axios.get(`${API_BASE_URL}/Order/Range`, {
      params
    });
    
    // Если фильтруем по дате создания, дополнительно фильтруем данные на стороне клиента
    if (filterByCreatedAt && response.data && response.data.Order) {
      // Преобразуем даты в объекты Date для сравнения
      const startDate = new Date(dtBegin);
      startDate.setHours(0, 0, 0, 0);
      
      const endDate = new Date(dtEnd);
      endDate.setHours(23, 59, 59, 999);
      
      // Фильтруем заказы по дате создания из поля DtVisit в услугах
      console.log('Диапазон дат для фильтрации:', startDate.toISOString(), '-', endDate.toISOString());
      
      // Дополнительно проверяем все заказы для отладки
      response.data.Order.forEach(order => {
        const orderDate = order.Service && order.Service.length > 0 ? new Date(order.Service[0].DtVisit) : null;
        console.log('Заказ ID:', order.Id, 'Дата услуги:', orderDate ? orderDate.toISOString() : 'N/A');
      });
      
      // Проверяем, является ли это ежедневным отчетом (когда начальная и конечная даты совпадают)
      const isDaily = dtBegin === dtEnd;
      console.log('Тип отчета:', isDaily ? 'Ежедневный' : 'Периодический', 'Даты:', dtBegin, dtEnd);
      
      // Парсим даты диапазона для сравнения
      const beginDateParts = dtBegin.split('-');
      const endDateParts = dtEnd.split('-');
      
      // Фильтруем заказы строго по дате создания из поля DtVisit
      response.data.Order = response.data.Order.filter(order => {
        // Если есть услуги, используем дату из первой услуги
        if (order.Service && order.Service.length > 0 && order.Service[0].DtVisit) {
          const orderDateStr = order.Service[0].DtVisit;
          
          try {
            // Извлекаем только дату без времени (YYYY-MM-DD)
            let orderDateOnly;
            
            if (orderDateStr.includes(' ')) {
              // Если дата в формате "2025-05-27 21:07"
              orderDateOnly = orderDateStr.split(' ')[0];
            } else if (orderDateStr.includes('T')) {
              // Если дата в формате ISO "2025-05-27T21:07:00"
              orderDateOnly = orderDateStr.split('T')[0];
            } else {
              // Если дата уже в формате "2025-05-27"
              orderDateOnly = orderDateStr;
            }
            
            // Проверяем формат даты
            if (!orderDateOnly.match(/^\d{4}-\d{2}-\d{2}$/)) {
              console.error('Некорректный формат даты:', orderDateStr);
              return false;
            }
            
            // Для ежедневного отчета проверяем точное совпадение даты
            if (isDaily) {
              const isSameDay = orderDateOnly === dtBegin;
              console.log(`Заказ ID:${order.Id}, Дата:${orderDateOnly}, Совпадает с ${dtBegin}: ${isSameDay}`);
              return isSameDay;
            } 
            // Для периодических отчетов проверяем вхождение в диапазон
            else {
              // Сравниваем строки дат лексикографически
              const isInRange = orderDateOnly >= dtBegin && orderDateOnly <= dtEnd;
              console.log(`Заказ ID:${order.Id}, Дата:${orderDateOnly}, Входит в диапазон ${dtBegin}-${dtEnd}: ${isInRange}`);
              return isInRange;
            }
          } catch (error) {
            console.error('Ошибка при обработке даты:', orderDateStr, error);
            return false;
          }
        }
        
        // Если услуг нет, возвращаем false
        return false;
      });
      
      console.log('Отфильтровано заказов:', response.data.Order.length);
    }
    
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
