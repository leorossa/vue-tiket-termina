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
        this.categoryVisitors = response.CategoryVisitor || [];
        this.groupCategoryVisitors = response.GroupCategoryVisitor || [];
        
        console.log('Категории загружены:', this.categoryVisitors);
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
        
        await updateCategoryVisitor(id, categoryData);
        
        // Обновляем список категорий после обновления
        await this.fetchCategoryVisitors();
        
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
