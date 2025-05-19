// Хранилище для управления категориями посетителей
import { defineStore } from 'pinia';
import { 
  getCategoryVisitors, 
  createCategoryVisitor, 
  updateCategoryVisitor, 
  deleteCategoryVisitor 
} from '@/api/categoryVisitorApi';

export const useCategoryVisitorStore = defineStore('categoryVisitor', {
  state: () => ({
    categoryVisitors: [],
    groupCategoryVisitors: [],
    loading: false,
    error: null
  }),
  
  getters: {
    // Получение всех категорий посетителей
    getAllCategoryVisitors: (state) => state.categoryVisitors,
    
    // Получение категории по ID
    getCategoryVisitorById: (state) => (id) => {
      return state.categoryVisitors.find(category => category.CategoryVisitorId === id);
    },
    
    // Получение всех групп категорий
    getAllGroupCategoryVisitors: (state) => state.groupCategoryVisitors,
    
    // Проверка загрузки
    isLoading: (state) => state.loading
  },
  
  actions: {
    // Загрузка всех категорий посетителей
    async fetchCategoryVisitors() {
      this.loading = true;
      this.error = null;
      
      try {
        const response = await getCategoryVisitors();
        console.log('Ответ API категорий:', response);
        
        // Сохраняем полученные данные в хранилище
        // API возвращает массив категорий напрямую, а не объект с полями CategoryVisitor и GroupCategoryVisitor
        this.categoryVisitors = Array.isArray(response) ? response : [];
        
        // Если нужно загружать группы категорий отдельно, добавьте вызов соответствующего API
        // Временное решение - создаем массив уникальных групп из загруженных категорий
        if (Array.isArray(response)) {
          const groupsMap = new Map();
          response.forEach(cat => {
            if (cat.GroupCategoryVisitorId && cat.GroupCategoryVisitorName) {
              groupsMap.set(cat.GroupCategoryVisitorId, {
                GroupCategoryVisitorId: cat.GroupCategoryVisitorId,
                GroupCategoryVisitorName: cat.GroupCategoryVisitorName
              });
            }
          });
          this.groupCategoryVisitors = Array.from(groupsMap.values());
        } else {
          this.groupCategoryVisitors = [];
        }
        
        console.log('Категории загружены:', this.categoryVisitors);
        console.log('Группы категорий загружены:', this.groupCategoryVisitors);
      } catch (error) {
        this.error = error.message || 'Ошибка при загрузке категорий';
        console.error('Ошибка при загрузке категорий:', error);
      } finally {
        this.loading = false;
      }
    },
    
    // Создание новой категории
    async addCategoryVisitor(categoryData) {
      this.loading = true;
      this.error = null;
      
      try {
        console.log('Отправка данных для создания категории:', categoryData);
        
        // Удаляем CategoryVisitorId из данных, если он есть, т.к. при создании он не нужен
        const { CategoryVisitorId, ...createData } = categoryData;
        
        await createCategoryVisitor(createData);
        
        // Обновляем список категорий после создания
        await this.fetchCategoryVisitors();
        
        return { success: true };
      } catch (error) {
        this.error = error.message || 'Ошибка при создании категории';
        console.error('Ошибка при создании категории:', error);
        return { success: false, error: this.error };
      } finally {
        this.loading = false;
      }
    },
    
    // Обновление существующей категории
    async updateCategoryVisitor(id, categoryData) {
      this.loading = true;
      this.error = null;
      
      try {
        console.log(`Обновление категории с ID ${id}:`, categoryData);
        
        // Подготавливаем данные для отправки в соответствии с DTO на бэкенде
        // Отправляем только те поля, которые ожидает сервер
        const dataToSend = {
          CategoryVisitorName: categoryData.CategoryVisitorName
        };
        
        // Согласно ошибке, сервер не ожидает GroupCategoryVisitorId в DTO
        // Поэтому не включаем его в запрос
        
        console.log('Отправляемые данные на сервер:', dataToSend);
        
        // Вызываем API для обновления категории
        const updatedCategory = await updateCategoryVisitor(id, dataToSend);
        console.log('Ответ от сервера при обновлении категории:', updatedCategory);
        
        // Находим индекс обновляемой категории в массиве
        const index = this.categoryVisitors.findIndex(cat => cat.CategoryVisitorId === id);
        
        if (index !== -1) {
          // Обновляем категорию в локальном хранилище
          this.categoryVisitors[index] = { 
            ...this.categoryVisitors[index], 
            CategoryVisitorName: dataToSend.CategoryVisitorName,
            GroupCategoryVisitorId: dataToSend.GroupCategoryVisitorId
          };
          console.log('Категория обновлена в хранилище:', this.categoryVisitors[index]);
        } else {
          console.warn(`Категория с ID ${id} не найдена в локальном хранилище, выполняем полную перезагрузку`);
          // Если не нашли категорию, обновляем весь список
          await this.fetchCategoryVisitors();
        }
        
        return { success: true };
      } catch (error) {
        this.error = error.message || 'Ошибка при обновлении категории';
        console.error(`Ошибка при обновлении категории с ID ${id}:`, error);
        return { success: false, error: this.error };
      } finally {
        this.loading = false;
      }
    },
    
    // Удаление категории
    async deleteCategoryVisitor(id) {
      this.loading = true;
      this.error = null;
      
      try {
        console.log(`Удаление категории с ID ${id}`);
        
        await deleteCategoryVisitor(id);
        
        // Обновляем список категорий после удаления
        await this.fetchCategoryVisitors();
        
        return { success: true };
      } catch (error) {
        this.error = error.message || 'Ошибка при удалении категории';
        console.error(`Ошибка при удалении категории с ID ${id}:`, error);
        return { success: false, error: this.error };
      } finally {
        this.loading = false;
      }
    }
  }
});
