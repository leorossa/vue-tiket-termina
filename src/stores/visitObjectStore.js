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
        // API возвращает массив объектов напрямую, а не объект с полями VisitObject и GroupVisitObject
        this.visitObjects = Array.isArray(response) ? response : [];
        
        // Если нужно загружать группы объектов отдельно, добавьте вызов соответствующего API
        // Временное решение - создаем массив уникальных групп из загруженных объектов
        if (Array.isArray(response)) {
          const groupsMap = new Map();
          response.forEach(obj => {
            if (obj.GroupVisitObjectId) {
              groupsMap.set(obj.GroupVisitObjectId, {
                GroupVisitObjectId: obj.GroupVisitObjectId,
                GroupVisitObjectName: `Группа ${obj.GroupVisitObjectId}` // Замените на реальное название группы, если оно есть в ответе
              });
            }
          });
          this.groupVisitObjects = Array.from(groupsMap.values());
        } else {
          this.groupVisitObjects = [];
        }
        
        console.log('Объекты посещения загружены:', this.visitObjects);
        //console.log('Группы объектов загружены:', this.groupVisitObjects);
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
        
        // Подготавливаем данные для отправки на сервер
        const dataToSend = {
          VisitObjectName: objectData.VisitObjectName,
          IsRequire: objectData.IsRequire || false,
          //GroupVisitObjectId: objectData.GroupVisitObjectId || null,
          CategoryVisitorId: objectData.CategoryVisitorId || null,
          Address: objectData.Address || null,
          Comment: objectData.Comment || null
        };
        
        console.log('Отправляемые данные на сервер:', dataToSend);
        
        // Вызываем API для обновления объекта
        const updatedObject = await updateVisitObject(id, dataToSend);
        console.log('Ответ от сервера при обновлении объекта:', updatedObject);
        
        // Находим индекс обновляемого объекта в массиве
        const index = this.visitObjects.findIndex(obj => obj.VisitObjectId === id);
        
        if (index !== -1) {
          // Обновляем объект в локальном хранилище
          this.visitObjects[index] = { 
            ...this.visitObjects[index],
            ...dataToSend
          };
          console.log('Объект обновлен в хранилище:', this.visitObjects[index]);
        } else {
          console.warn(`Объект с ID ${id} не найден в локальном хранилище, выполняем полную перезагрузку`);
          // Если не нашли объект, обновляем весь список
          await this.fetchVisitObjects();
        }
        
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
