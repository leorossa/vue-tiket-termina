// Хранилище для управления объектами посещения
import { defineStore } from 'pinia';
import { 
  getVisitObjects, 
  createVisitObject, 
  updateVisitObject, 
  deleteVisitObject 
} from '@/api/visitObjectApi';

export const useVisitObjectStore = defineStore('visitObject', {
  state: () => ({
    visitObjects: [],
    groupVisitObjects: [],
    loading: false,
    error: null
  }),
  
  getters: {
    // Получение всех объектов посещения
    getAllVisitObjects: (state) => state.visitObjects,
    
    // Получение объекта по ID
    getVisitObjectById: (state) => (id) => {
      return state.visitObjects.find(object => object.VisitObjectId === id);
    },
    
    // Получение всех групп объектов
    getAllGroupVisitObjects: (state) => state.groupVisitObjects,
    
    // Проверка загрузки
    isLoading: (state) => state.loading
  },
  
  actions: {
    // Загрузка всех объектов посещения
    async fetchVisitObjects() {
      this.loading = true;
      this.error = null;
      
      try {
        const response = await getVisitObjects();
        console.log('Ответ API объектов посещения:', response);
        
        // Сохраняем полученные данные в хранилище
        this.visitObjects = response.VisitObject || [];
        this.groupVisitObjects = response.GroupVisitObject || [];
        
        console.log('Объекты посещения загружены:', this.visitObjects);
      } catch (error) {
        this.error = error.message || 'Ошибка при загрузке объектов посещения';
        console.error('Ошибка при загрузке объектов посещения:', error);
      } finally {
        this.loading = false;
      }
    },
    
    // Создание нового объекта посещения
    async addVisitObject(objectData) {
      this.loading = true;
      this.error = null;
      
      try {
        console.log('Отправка данных для создания объекта посещения:', objectData);
        
        // Удаляем VisitObjectId из данных, если он есть, т.к. при создании он не нужен
        const { VisitObjectId, ...createData } = objectData;
        
        await createVisitObject(createData);
        
        // Обновляем список объектов после создания
        await this.fetchVisitObjects();
        
        return { success: true };
      } catch (error) {
        this.error = error.message || 'Ошибка при создании объекта посещения';
        console.error('Ошибка при создании объекта посещения:', error);
        return { success: false, error: this.error };
      } finally {
        this.loading = false;
      }
    },
    
    // Обновление существующего объекта посещения
    async updateVisitObject(id, objectData) {
      this.loading = true;
      this.error = null;
      
      try {
        console.log(`Обновление объекта посещения с ID ${id}:`, objectData);
        
        await updateVisitObject(id, objectData);
        
        // Обновляем список объектов после обновления
        await this.fetchVisitObjects();
        
        return { success: true };
      } catch (error) {
        this.error = error.message || 'Ошибка при обновлении объекта посещения';
        console.error(`Ошибка при обновлении объекта посещения с ID ${id}:`, error);
        return { success: false, error: this.error };
      } finally {
        this.loading = false;
      }
    },
    
    // Удаление объекта посещения
    async deleteVisitObject(id) {
      this.loading = true;
      this.error = null;
      
      try {
        console.log(`Удаление объекта посещения с ID ${id}`);
        
        await deleteVisitObject(id);
        
        // Обновляем список объектов после удаления
        await this.fetchVisitObjects();
        
        return { success: true };
      } catch (error) {
        this.error = error.message || 'Ошибка при удалении объекта посещения';
        console.error(`Ошибка при удалении объекта посещения с ID ${id}:`, error);
        return { success: false, error: this.error };
      } finally {
        this.loading = false;
      }
    }
  }
});
