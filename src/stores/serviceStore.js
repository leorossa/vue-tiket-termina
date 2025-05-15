// Хранилище для управления услугами
import { defineStore } from 'pinia';
import { getEditableServices, createService, updateService } from '@/api/serviceApi';

export const useServiceStore = defineStore('service', {
  state: () => ({
    services: [],
    visitObjects: [],
    categoryVisitors: [],
    groupVisitObjects: [],
    groupCategoryVisitors: [],
    seanceGrids: [],
    loading: false,
    error: null
  }),
  
  getters: {
    // Получение всех услуг
    getAllServices: (state) => state.services,
    
    // Получение услуги по ID
    getServiceById: (state) => (id) => {
      return state.services.find(service => service.serviceId === id);
    },
    
    // Получение всех объектов посещения
    getAllVisitObjects: (state) => state.visitObjects,
    
    // Получение всех категорий посетителей
    getAllCategoryVisitors: (state) => state.categoryVisitors,
    
    // Проверка загрузки
    isLoading: (state) => state.loading
  },
  
  actions: {
    // Загрузка всех редактируемых услуг
    async fetchServices() {
      this.loading = true;
      this.error = null;
      
      try {
        const response = await getEditableServices();
        console.log('Ответ API:', response);
        
        // Сохраняем полученные данные в хранилище
        // Теперь мы точно знаем структуру ответа API
        this.services = response.Service || [];
        
        // Добавляем пустые массивы для объектов посещения и категорий посетителей к каждой услуге
        if (Array.isArray(this.services)) {
          this.services.forEach(service => {
            // Добавляем пустые массивы, если их нет
            service.visitObjects = service.visitObjects || [];
            service.categoryVisitor = service.categoryVisitor || [];
          });
        }
        
        // Заполняем справочники из ответа API
        this.visitObjects = response.VisitObject || [];
        this.categoryVisitors = response.ObjectCategoryVisitor || [];
        this.groupVisitObjects = response.GroupVisitObject || [];
        this.groupCategoryVisitors = response.GroupCategoryVisitor || [];
        this.seanceGrids = response.SeanceGrid || [];
        
        console.log('Услуги загружены:', this.services);
      } catch (error) {
        this.error = error.message || 'Ошибка при загрузке услуг';
        console.error('Ошибка при загрузке услуг:', error);
      } finally {
        this.loading = false;
      }
    },
    
    // Создание новой услуги
    async addService(serviceData) {
      this.loading = true;
      this.error = null;
      
      try {
        await createService(serviceData);
        
        // Обновляем список услуг после создания
        await this.fetchServices();
        
        return { success: true };
      } catch (error) {
        this.error = error.message || 'Ошибка при создании услуги';
        console.error('Ошибка при создании услуги:', error);
        return { success: false, error: this.error };
      } finally {
        this.loading = false;
      }
    },
    
    // Обновление существующей услуги
    async updateService(id, serviceData) {
      this.loading = true;
      this.error = null;
      
      try {
        await updateService(id, serviceData);
        
        // Обновляем список услуг после обновления
        await this.fetchServices();
        
        return { success: true };
      } catch (error) {
        this.error = error.message || 'Ошибка при обновлении услуги';
        console.error(`Ошибка при обновлении услуги с ID ${id}:`, error);
        return { success: false, error: this.error };
      } finally {
        this.loading = false;
      }
    },
    
    // Удаление услуги (метод для будущей реализации)
    async deleteService(id) {
      // В текущем API нет метода для удаления услуги
      // Этот метод оставлен для будущей реализации
      console.log(`Запрос на удаление услуги с ID ${id}`);
      
      // Временное решение - удаляем услугу из локального состояния
      this.services = this.services.filter(service => service.serviceId !== id);
      
      return { success: true };
    }
  }
});
