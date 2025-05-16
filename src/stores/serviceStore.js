// Хранилище для управления услугами
import { defineStore } from 'pinia';
import { ref } from 'vue';
import { 
  getEditableServices, 
  getServiceById as apiGetServiceById, 
  createService as apiCreateService, 
  updateService as apiUpdateService, 
  deleteService as apiDeleteService 
} from '@/api/serviceApi';

export const useServiceStore = defineStore('service', () => {
  // Состояние хранилища
  const services = ref([]);
  const loading = ref(false);
  const error = ref(null);

  // Действия
  // Загрузка всех услуг
  async function fetchServices() {
    loading.value = true;
    error.value = null;

    try {
      const response = await getEditableServices();
      services.value = response.Service || [];
      return response;
    } catch (err) {
      console.error('Ошибка при загрузке услуг:', err);
      error.value = 'Не удалось загрузить услуги';
      throw err;
    } finally {
      loading.value = false;
    }
  }

  // Получение услуги по ID
  async function getServiceById(serviceId) {
    loading.value = true;
    error.value = null;

    try {
      const data = await apiGetServiceById(serviceId);
      return data;
    } catch (err) {
      console.error(`Ошибка при получении услуги с ID ${serviceId}:`, err);
      error.value = 'Не удалось получить данные услуги';
      throw err;
    } finally {
      loading.value = false;
    }
  }

  // Создание новой услуги
  async function createService(serviceData) {
    loading.value = true;
    error.value = null;

    try {
      const data = await apiCreateService(serviceData);
      await fetchServices(); // Обновляем список услуг после добавления
      return data;
    } catch (err) {
      console.error('Ошибка при создании услуги:', err);
      error.value = 'Не удалось создать услугу';
      throw err;
    } finally {
      loading.value = false;
    }
  }

  // Обновление услуги
  async function updateService(serviceData) {
    loading.value = true;
    error.value = null;

    try {
      const data = await apiUpdateService(serviceData);
      await fetchServices(); // Обновляем список услуг после обновления
      return data;
    } catch (err) {
      console.error(`Ошибка при обновлении услуги с ID ${serviceData.ServiceId}:`, err);
      error.value = 'Не удалось обновить услугу';
      throw err;
    } finally {
      loading.value = false;
    }
  }

  // Удаление услуги
  async function deleteService(serviceId) {
    loading.value = true;
    error.value = null;

    try {
      const data = await apiDeleteService(serviceId);
      // Удаляем услугу из локального списка
      services.value = services.value.filter(service => service.ServiceId !== serviceId);
      return data;
    } catch (err) {
      console.error(`Ошибка при удалении услуги с ID ${serviceId}:`, err);
      error.value = 'Не удалось удалить услугу';
      throw err;
    } finally {
      loading.value = false;
    }
  }

  return {
    // Состояние
    services,
    loading,
    error,
    // Действия
    fetchServices,
    getServiceById,
    createService,
    updateService,
    deleteService
  };
});
