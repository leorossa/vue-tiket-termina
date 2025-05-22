// Хранилище для управления пользователями
import { defineStore } from 'pinia';
import { getUsers as fetchUsers, getUserById as fetchUserById, createUser, updateUser as userApiUpdateUser, deleteUser } from '@/api/userApi';

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
        const response = await fetchUsers();
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
        const user = await fetchUserById(id);
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
    async updateUser(id, userDataFromForm) { 
      this.loading = true;
      this.error = null;
      
      try {
        // Проверяем, что ID не пустой
        if (!id) {
          throw new Error('Не указан ID пользователя');
        }
        
        console.log(`Обновление пользователя с ID: ${id}. Данные из формы:`, userDataFromForm);

        // Подготавливаем данные для отправки на сервер согласно предоставленному Swagger (без permissions в теле)
        const payloadForApi = {
          UserName: userDataFromForm.UserName,
          Role: userDataFromForm.Role,
          FullName: userDataFromForm.FullName,
          Phone: userDataFromForm.Phone,
          Email: userDataFromForm.Email,
        };
        if (userDataFromForm.Password && userDataFromForm.Password.trim() !== '') {
          payloadForApi.Password = userDataFromForm.Password;
        }
        console.log('Данные для отправки в API (payloadForApi):', payloadForApi);

        let responseFromApi = null;
        try {
        console.log(`[userStore.js] updateUser: Вызов userApiUpdateUser с ID=${id} и payloadForApi:`, JSON.parse(JSON.stringify(payloadForApi)));
        responseFromApi = await userApiUpdateUser(id, payloadForApi);
        console.log(`[userStore.js] updateUser: Ответ от userApiUpdateUser (responseFromApi):`, JSON.parse(JSON.stringify(responseFromApi)));
          console.log('Успешный ответ от API:', responseFromApi);

          // API Успех: Обновляем локальное состояние данными от сервера
      console.log('[userStore.js] updateUser: API вызов успешен. Обновляем локальное состояние.');
      const index = this.users.findIndex(user => String(user.Id) === String(id));
          if (index !== -1) {
            const updatedUserFromServer = {
              Id: parseInt(id), // ID точно есть
              UserName: responseFromApi.UserName !== undefined ? responseFromApi.UserName : this.users[index].UserName,
              FullName: responseFromApi.FullName !== undefined ? responseFromApi.FullName : this.users[index].FullName,
              Email: responseFromApi.Email !== undefined ? responseFromApi.Email : this.users[index].Email,
              Phone: responseFromApi.Phone !== undefined ? responseFromApi.Phone : this.users[index].Phone,
              Role: responseFromApi.Role !== undefined ? responseFromApi.Role : this.users[index].Role,
              permissions: responseFromApi.permissions !== undefined ? responseFromApi.permissions : this.users[index].permissions,
            };

            this.users[index] = updatedUserFromServer;
            if (this.currentUser && String(this.currentUser.Id) === String(id)) {
              this.currentUser = updatedUserFromServer;
            }
            console.log(`[userStore.js] updateUser: Пользователь с ID ${id} обновлен в локальном списке данными от API. Результат:`, JSON.parse(JSON.stringify(updatedUserFromServer)));
            return updatedUserFromServer; // Возвращаем обновленного пользователя
          } else {
            console.warn(`Пользователь с ID ${id} не найден в локальном списке после успешного API-запроса.`);
            return responseFromApi; // Возвращаем то, что пришло от API
          }

        } catch (apiError) {
          this.error = apiError.message || 'Ошибка при обновлении пользователя через API';
      console.error(`[userStore.js] updateUser: Ошибка API при обновлении пользователя ID ${id}. Объект ошибки:`, apiError);
      // Попытка вывести больше деталей, если это Axios ошибка
      if (apiError.response) {
        console.error(`[userStore.js] updateUser: Ошибка API - Статус: ${apiError.response.status}, Данные:`, apiError.response.data);
      }

          // API Ошибка: Обновляем локальное состояние "визуально" данными из формы
          const index = this.users.findIndex(user => String(user.Id) === String(id));
          if (index !== -1) {
            const visuallyUpdatedUser = {
              ...this.users[index], // Начинаем с существующих данных пользователя
              UserName: userDataFromForm.UserName,
              FullName: userDataFromForm.FullName,
              Email: userDataFromForm.Email,
              Phone: userDataFromForm.Phone,
              Role: userDataFromForm.Role,
              permissions: userDataFromForm.permissions || this.users[index].permissions, // Используем permissions из формы
            };
            this.users[index] = visuallyUpdatedUser;

            if (this.currentUser && String(this.currentUser.Id) === String(id)) {
              this.currentUser = visuallyUpdatedUser;
            }
            console.log(`Пользователь с ID ${id} обновлен локально (визуально) после ошибки API.`);
          }
          throw apiError; // Пробрасываем ошибку, чтобы компонент мог ее обработать
        }
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
    
    // Обновление существующего пользователя (локально)
    updateUserLocal(id, userData) {
      try {
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
