// API для работы с услугами
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
 * Получение списка редактируемых услуг
 * @returns {Promise} Промис с данными услуг
 */
export const getEditableServices = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/Service/Editable`, {
      headers: getAuthHeaders()
    });
    return response.data;
  } catch (error) {
    console.error('Ошибка при получении редактируемых услуг:', error);
    throw error;
  }
};

/**
 * Получение простых услуг
 * @returns {Promise<Object>} Объект с данными простых услуг
 */
export async function getSimpleServices() {
  try {
    const response = await axios.get(`${API_BASE_URL}/Service/Simple`, {
      headers: getAuthHeaders()
    });
    return response.data;
  } catch (error) {
    console.error('Ошибка при получении простых услуг:', error);
    throw error;
  }
}

/**
 * Получение услуги по ID с полной информацией
 * @param {number} serviceId - ID услуги
 * @returns {Promise<Object>} Данные услуги
 */
export async function getServiceById(serviceId) {
  try {
    const response = await axios.get(`${API_BASE_URL}/Service/${serviceId}`, {
      headers: getAuthHeaders()
    });
    return response.data;
  } catch (error) {
    console.error(`Ошибка при получении услуги с ID ${serviceId}:`, error);
    throw error;
  }
}

/**
 * Создание новой услуги
 * @param {Object} serviceData - Данные для создания услуги
 * @returns {Promise<Object>} Созданная услуга
 */
export async function createService(serviceData) {
  try {
    // Подготовка данных для отправки
    const serviceDto = prepareServiceDto(serviceData);
    
    // Отправка запроса на создание услуги
    const response = await axios.post(`${API_BASE_URL}/Service/Create`, serviceDto, {
      headers: getAuthHeaders()
    });
    
    // Если услуга создана успешно и есть связанные объекты, обновляем их
    if (response.data && response.data.ServiceId) {
      const serviceId = response.data.ServiceId;
      
      // Обновляем связи с объектами посещения
      if (serviceData.VisitObject && serviceData.VisitObject.length > 0) {
        await updateServiceVisitObjects(serviceId, serviceData.VisitObject);
      }
      
      // Обновляем связи с категориями посетителей
      if (serviceData.CategoryVisitor && serviceData.CategoryVisitor.length > 0) {
        await updateServiceCategoryVisitors(serviceId, serviceData.CategoryVisitor);
      }
      
      // Обновляем цены
      if (serviceData.Price && serviceData.Price.length > 0) {
        await updateServicePrices(serviceId, serviceData.Price);
      }
    }
    
    return response.data;
  } catch (error) {
    console.error('Ошибка при создании услуги:', error);
    throw error;
  }
}

/**
 * Обновление услуги
 * @param {Object} serviceData - Данные для обновления услуги
 * @returns {Promise<Object>} Обновленная услуга
 */
export async function updateService(serviceData) {
  try {
    // Подготовка данных для отправки
    const serviceDto = prepareServiceDto(serviceData);
    
    // Отправка запроса на обновление услуги
    const response = await axios.put(`${API_BASE_URL}/Service/Update`, serviceDto, {
      headers: getAuthHeaders()
    });
    
    // Если услуга обновлена успешно, обновляем связанные объекты
    if (response.data) {
      const serviceId = serviceData.ServiceId;
      
      // Обновляем связи с объектами посещения
      if (serviceData.VisitObject && serviceData.VisitObject.length > 0) {
        await updateServiceVisitObjects(serviceId, serviceData.VisitObject);
      }
      
      // Обновляем связи с категориями посетителей
      if (serviceData.CategoryVisitor && serviceData.CategoryVisitor.length > 0) {
        await updateServiceCategoryVisitors(serviceId, serviceData.CategoryVisitor);
      }
      
      // Обновляем цены
      if (serviceData.Price && serviceData.Price.length > 0) {
        await updateServicePrices(serviceId, serviceData.Price);
      }
    }
    
    return response.data;
  } catch (error) {
    console.error(`Ошибка при обновлении услуги с ID ${serviceData.ServiceId}:`, error);
    throw error;
  }
}

/**
 * Удаление услуги
 * @param {number} serviceId - ID услуги для удаления
 * @returns {Promise<Object>} Результат операции
 */
export async function deleteService(serviceId) {
  try {
    const response = await axios.delete(`${API_BASE_URL}/Service/Delete/${serviceId}`, {
      headers: getAuthHeaders()
    });
    return response.data;
  } catch (error) {
    console.error(`Ошибка при удалении услуги с ID ${serviceId}:`, error);
    throw error;
  }
}

/**
 * Подготовка DTO услуги для отправки на сервер
 * @param {Object} serviceData - Данные услуги
 * @returns {Object} DTO услуги для отправки
 */
function prepareServiceDto(serviceData) {
  // Создаем копию объекта без связанных данных
  const { VisitObject, CategoryVisitor, Price, ...serviceDto } = serviceData;
  return serviceDto;
}

/**
 * Обновление связей услуги с объектами посещения
 * @param {number} serviceId - ID услуги
 * @param {Array} visitObjects - Массив объектов посещения
 * @returns {Promise<Object>} Результат операции
 */
async function updateServiceVisitObjects(serviceId, visitObjects) {
  try {
    // Подготавливаем массив ID объектов посещения
    const visitObjectIds = visitObjects.map(obj => obj.VisitObjectId);
    
    // Отправляем запрос на обновление связей
    const response = await axios.post(`${API_BASE_URL}/Service/${serviceId}/VisitObjects`, visitObjectIds, {
      headers: getAuthHeaders()
    });
    
    return response.data;
  } catch (error) {
    console.error(`Ошибка при обновлении объектов посещения для услуги ${serviceId}:`, error);
    throw error;
  }
}

/**
 * Обновление связей услуги с категориями посетителей
 * @param {number} serviceId - ID услуги
 * @param {Array} categoryVisitors - Массив категорий посетителей
 * @returns {Promise<Object>} Результат операции
 */
async function updateServiceCategoryVisitors(serviceId, categoryVisitors) {
  try {
    // Подготавливаем массив ID категорий посетителей
    const categoryVisitorIds = categoryVisitors.map(cat => cat.CategoryVisitorId);
    
    // Отправляем запрос на обновление связей
    const response = await axios.post(`${API_BASE_URL}/Service/${serviceId}/CategoryVisitors`, categoryVisitorIds, {
      headers: getAuthHeaders()
    });
    
    return response.data;
  } catch (error) {
    console.error(`Ошибка при обновлении категорий посетителей для услуги ${serviceId}:`, error);
    throw error;
  }
}

/**
 * Обновление цен услуги
 * @param {number} serviceId - ID услуги
 * @param {Array} prices - Массив цен
 * @returns {Promise<Object>} Результат операции
 */
async function updateServicePrices(serviceId, prices) {
  try {
    // Подготавливаем цены, добавляя ServiceId если его нет
    const preparedPrices = prices.map(price => ({
      ...price,
      ServiceId: serviceId
    }));
    
    // Отправляем запрос на обновление цен
    const response = await axios.post(`${API_BASE_URL}/Service/${serviceId}/Prices`, preparedPrices, {
      headers: getAuthHeaders()
    });
    
    return response.data;
  } catch (error) {
    console.error(`Ошибка при обновлении цен для услуги ${serviceId}:`, error);
    throw error;
  }
};
