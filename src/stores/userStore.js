// Хранилище для управления пользователями
import { defineStore } from 'pinia';
import { getUsers, getUserById, createUser, updateUser, deleteUser } from '@/api/userApi';

export const useUserStore = defineStore('user', {
  state: () => ({
    users: [],
    currentUser: null,
    loading: false,
    error: null,
    permissions: {},
    
    // Список доступных ролей
    availableRoles: [
      { id: 'ROOT', name: 'Root (Суперадминистратор)' },
      { id: 'ADMIN', name: 'Admin (Администратор)' },
      { id: 'MANAGER', name: 'Manager (Менеджер)' },
      { id: 'USER', name: 'User (Пользователь)' }
    ],
    
    // Доступные права пользователей
    availablePermissions: [
      { id: 'canManageUsers', name: 'Управление пользователями' },
      { id: 'canManageServices', name: 'Управление услугами' },
      { id: 'canManageCategories', name: 'Управление категориями' },
      { id: 'canManageVisitObjects', name: 'Управление объектами посещения' },
      { id: 'canViewReports', name: 'Просмотр отчетов' },
      { id: 'canManageSettings', name: 'Управление настройками' },
      { id: 'canSellTickets', name: 'Продажа билетов' },
      { id: 'canManageOrders', name: 'Управление заказами' },
      { id: 'canExportData', name: 'Экспорт данных' },
      { id: 'canImportData', name: 'Импорт данных' }
    ],
    error: null
  }),
  
  getters: {
    // Получение всех пользователей
    getAllUsers: (state) => state.users,
    
    // Получение пользователя по ID
    getUserById: (state) => (id) => {
      return state.users.find(user => user.Id === id);
    },
    
    // Получение пользователя по имени пользователя (для обратной совместимости)
    getUserByUsername: (state) => (username) => {
      return state.users.find(user => user.UserName === username);
    },
    
    // Получение текущего пользователя
    getCurrentUser: (state) => state.currentUser,
    
    // Проверка, является ли пользователь администратором
    isAdmin: (state) => {
      return state.currentUser && state.currentUser.role === 'admin';
    },
    
    // Проверка наличия права доступа
    hasPermission: (state) => (permission) => {
      // Получаем текущего пользователя
      const user = state.currentUser;
      if (!user) return false;
      
      // Если пользователь ROOT, у него есть все права
      if (user.Role === 'ROOT') return true;
      
      // Если пользователь ADMIN, у него есть большинство прав, кроме супер-администраторских
      if (user.Role === 'ADMIN') {
        // Права, которых нет у администратора
        const restrictedPermissions = ['canManageRootSettings'];
        return !restrictedPermissions.includes(permission);
      }
      
      // Если пользователь MANAGER, у него есть ограниченный набор прав
      if (user.Role === 'MANAGER') {
        const managerPermissions = [
          'canViewReports',
          'canSellTickets',
          'canManageOrders',
          'canViewServices'
        ];
        return managerPermissions.includes(permission);
      }
      
      // Для обычных пользователей
      if (user.Role === 'USER') {
        const userPermissions = [
          'canSellTickets',
          'canViewServices'
        ];
        return userPermissions.includes(permission);
      }
      
      return false;
    },
    

    
    // Проверка загрузки
    isLoading: (state) => state.loading
  },
  
  actions: {
    // Загрузка всех пользователей
    async fetchUsers() {
      this.loading = true;
      this.error = null;
      
      try {
        const response = await getUsers();
        console.log('Получены пользователи:', response);
        this.users = response || [];
        return this.users;
      } catch (error) {
        this.error = error.message || 'Ошибка при загрузке пользователей';
        console.error('Ошибка при загрузке пользователей:', error);
        return [];
      } finally {
        this.loading = false;
      }
    },
    
    // Получение пользователя по ID с сервера
    async fetchUserById(id) {
      this.loading = true;
      this.error = null;
      
      try {
        const user = await getUserById(id);
        return user;
      } catch (error) {
        this.error = error.message || `Ошибка при получении пользователя с ID ${id}`;
        console.error(`Ошибка при получении пользователя с ID ${id}:`, error);
        return null;
      } finally {
        this.loading = false;
      }
    },
    
    // Создание нового пользователя
    async createUser(userData) {
      this.loading = true;
      this.error = null;
      
      try {
        console.log('Отправка данных для создания пользователя:', userData);
        const user = await createUser(userData);
        
        // Обновляем список пользователей
        await this.fetchUsers();
        
        return user;
      } catch (error) {
        this.error = error.message || 'Ошибка при создании пользователя';
        console.error('Ошибка при создании пользователя:', error);
        throw error;
      } finally {
        this.loading = false;
      }
    },
    
    // Обновление пользователя
    async updateUser(id, userData) {
      this.loading = true;
      this.error = null;
      
      try {
        // Проверяем, что ID не пустой
        if (!id) {
          throw new Error('Не указан ID пользователя');
        }
        
        console.log(`Обновление пользователя с ID: ${id}`, userData);
        
        // Подготавливаем данные для отправки на сервер
        // Важно: API ожидает, что ID будет в теле запроса
        const dataToSend = {
          ...userData,
          Id: parseInt(id) // Преобразуем ID в число, так как API ожидает числовой ID
        };
        
        console.log('Данные для отправки:', dataToSend);
        
        let updatedUser = null;
        let apiSuccess = false;
        
        try {
          // Пытаемся обновить через API
          updatedUser = await updateUser(id, dataToSend);
          apiSuccess = true;
          console.log('Успешный ответ от API:', updatedUser);
        } catch (apiError) {
          console.warn(`Ошибка при обращении к API:`, apiError);
          // Не выбрасываем исключение здесь, продолжаем выполнение
        }
        
        // Если API-запрос не удался, обновляем пользователя локально
        if (!apiSuccess) {
          console.log('Обновляем пользователя локально после ошибки API');
          
          // Находим пользователя в локальном списке
          const index = this.users.findIndex(user => parseInt(user.Id) === parseInt(id));
          
          if (index !== -1) {
            // Создаем обновленного пользователя, сохраняя существующие поля
            updatedUser = {
              ...this.users[index],
              ...dataToSend
            };
            
            // Обновляем пользователя в локальном списке
            this.users[index] = updatedUser;
            console.log(`Пользователь с ID ${id} обновлен локально:`, updatedUser);
          } else {
            // Если пользователя нет в списке, добавляем его
            updatedUser = dataToSend;
            this.users.push(updatedUser);
            console.log(`Пользователь с ID ${id} добавлен в локальный список:`, updatedUser);
          }
        } else {
          // Если API-запрос успешен, обновляем пользователя в локальном списке
          const index = this.users.findIndex(user => parseInt(user.Id) === parseInt(id));
          
          if (index !== -1) {
            // Обновляем существующего пользователя
            this.users[index] = updatedUser;
            console.log(`Пользователь с ID ${id} обновлен в локальном списке после успешного API-запроса`);
          } else {
            // Если пользователя нет в списке, добавляем его
            this.users.push(updatedUser);
            console.log(`Пользователь с ID ${id} добавлен в локальный список после успешного API-запроса`);
          }
        }
        
        // Обновляем текущего пользователя, если обновляем его
        if (this.currentUser && parseInt(this.currentUser.Id) === parseInt(id)) {
          this.currentUser = updatedUser;
          localStorage.setItem('currentUser', JSON.stringify(updatedUser));
          console.log(`Обновлен текущий пользователь`);
        }
        
        return updatedUser;
      } catch (error) {
        this.error = error.message || `Ошибка при обновлении пользователя`;
        console.error(`Ошибка при обновлении пользователя с ID ${id}:`, error);
        throw error; // Пробрасываем ошибку дальше для обработки в компоненте
      } finally {
        this.loading = false;
      }
    },
    
    // Удаление пользователя
    async deleteUser(id) {
      this.loading = true;
      this.error = null;
      
      try {
        // Проверяем, что ID не пустой
        if (!id) {
          throw new Error('Не указан ID пользователя');
        }
        
        console.log(`Удаление пользователя с ID ${id}`);
        
        // Проверяем, существует ли пользователь в локальном списке
        const userExists = this.users.some(user => user.Id === id);
        if (!userExists) {
          console.warn(`Пользователь с ID ${id} не найден в локальном списке, продолжаем запрос к API`);
        }
        
        // Отправляем запрос на удаление
        await deleteUser(id);
        
        // Удаляем пользователя из локального списка
        const index = this.users.findIndex(user => user.Id === id);
        if (index !== -1) {
          this.users.splice(index, 1);
          console.log(`Пользователь с ID ${id} успешно удален из локального списка`);
        } else {
          console.warn(`Пользователь с ID ${id} не найден в локальном списке после удаления`);
        }
        
        // Если удаляем текущего пользователя, разлогиниваемся
        if (this.currentUser && this.currentUser.Id === id) {
          this.currentUser = null;
          localStorage.removeItem('currentUser');
          console.log(`Текущий пользователь удален, выполнен выход из системы`);
        }
        
        return { success: true };
      } catch (error) {
        this.error = error.message || `Ошибка при удалении пользователя с ID ${id}`;
        console.error(`Ошибка при удалении пользователя с ID ${id}:`, error);
        return { success: false, error: this.error };
      } finally {
        this.loading = false;
      }
    },
    

    
    // Вход в систему
    async login(email, password) {
      this.loading = true;
      this.error = null;
      
      try {
        // Загружаем список пользователей, если еще не загружен
        if (this.users.length === 0) {
          await this.fetchUsers();
        }
        
        // Поиск пользователя по email
        const user = this.users.find(u => u.Email === email);
        
        if (user) {
          // В реальном приложении здесь будет проверка пароля
          this.currentUser = user;
          localStorage.setItem('currentUser', JSON.stringify(user));
          return { success: true, user };
        } else {
          throw new Error('Неверный email или пароль');
        }
      } catch (error) {
        this.error = error.message || 'Ошибка при входе в систему';
        console.error('Ошибка при входе в систему:', error);
        return { success: false, error: this.error };
      } finally {
        this.loading = false;
      }
    },
    
    // Выход из системы
    logout() {
      this.currentUser = null;
      localStorage.removeItem('currentUser');
    },
    
    // Проверка состояния аутентификации
    checkAuth() {
      const savedUser = localStorage.getItem('currentUser');
      if (savedUser) {
        this.currentUser = JSON.parse(savedUser);
      }
    },
    
    // Создание нового пользователя
    addUser(userData) {
      try {
        // В реальном приложении здесь будет запрос к API
        const newUser = {
          ...userData,
          id: Math.max(0, ...this.users.map(u => u.id)) + 1
        };
        
        this.users.push(newUser);
        return { success: true, user: newUser };
      } catch (error) {
        this.error = error.message || 'Ошибка при создании пользователя';
        console.error('Ошибка при создании пользователя:', error);
        return { success: false, error: this.error };
      }
    },
    
    // Обновление существующего пользователя
    updateUser(id, userData) {
      try {
        // В реальном приложении здесь будет запрос к API
        const index = this.users.findIndex(u => u.Id === id);
        
        if (index !== -1) {
          // Если пароль не указан, сохраняем старый
          if (!userData.password) {
            userData.password = this.users[index].password;
          }
          
          // Обновляем пользователя
          this.users[index] = { ...this.users[index], ...userData };
          
          // Обновляем в localStorage
          localStorage.setItem('users', JSON.stringify(this.users));
          
          return { success: true, user: this.users[index] };
        } else {
          throw new Error('Пользователь не найден');
        }
      } catch (error) {
        this.error = error.message || 'Ошибка при обновлении пользователя';
        console.error(`Ошибка при обновлении пользователя с ID ${id}:`, error);
        return { success: false, error: this.error };
      }
    },
    
    // Изменение статуса пользователя (активация/блокировка)
    toggleUserStatus(id) {
      try {
        // В реальном приложении здесь будет запрос к API
        const index = this.users.findIndex(u => u.Id === id);
        
        if (index !== -1) {
          this.users[index].active = !this.users[index].active;
          return { success: true, user: this.users[index] };
        } else {
          throw new Error('Пользователь не найден');
        }
      } catch (error) {
        this.error = error.message || 'Ошибка при изменении статуса пользователя';
        console.error(`Ошибка при изменении статуса пользователя с ID ${id}:`, error);
        return { success: false, error: this.error };
      }
    },
    

  }
});
