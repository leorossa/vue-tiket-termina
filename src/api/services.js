// src/api/services.js
import { apiRequest, config } from './base.js';
import { mockServices, mockAttractions } from '../mockServiceData.js';

export const serviceAPI = {
  /**
   * Получить список простых услуг
   */
  getSimpleServices() {
    return config.useCustomAPI 
      ? Promise.resolve({ services: [...mockServices, ...mockAttractions] }) 
      : apiRequest('/Service/Simple');
  },
  
  /**
   * Получить список редактируемых услуг
   */
  getEditableServices() {
    return config.useCustomAPI 
      ? Promise.resolve({ services: [...mockServices, ...mockAttractions] }) 
      : apiRequest('/Service/Editable');
  },
  
  /**
   * Создать новую услугу
   */
  createService(serviceData) {
    return config.useCustomAPI 
      ? Promise.resolve({ id: Date.now(), ...serviceData }) 
      : apiRequest('/Service/Create', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(serviceData),
        });
  },
  
  /**
   * Обновить существующую услугу
   */
  updateService(serviceData) {
    return config.useCustomAPI 
      ? Promise.resolve(serviceData) 
      : apiRequest('/Service/Update', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(serviceData),
        });
  },
  
  /**
   * Удалить услугу
   */
  deleteService(serviceId) {
    return config.useCustomAPI 
      ? Promise.resolve({ success: true }) 
      : apiRequest(`/Service/Delete/${serviceId}`, {
          method: 'DELETE',
        });
  }
};
