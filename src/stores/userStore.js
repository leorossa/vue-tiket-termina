// Хранилище для управления пользователями
import { defineStore } from 'pinia';
import { 
  getUsers as fetchUsers, 
  getUserById as fetchUserById, 
  getCurrentUser as fetchCurrentUser,
  isCurrentUserRoot,
  getCurrentUserPermissions,
  getPermissionsList,
  createUser, 
  updateUser as userApiUpdateUser, 
  deleteUser 
} from '@/api/userApi';

export const useUserStore = defineStore('user', {
  state: () => ({
    users: [],
    currentUser: null,
    loading: false,
    error: null,
    permissions: {},
    isRoot: false,
    permissionsList: {},
    
    // Список доступных ролей
    availableRoles: [
      { id: 'ADMIN', name: 'Администратор' },
      { id: 'MANAGER', name: 'Менеджер' },
      { id: 'USER', name: 'Пользователь' },
    ],
    
    // Доступные права пользователей в соответствии с API
    availablePermissions: [
      { id: 'CanManageUsers', name: 'Управление пользователями' },
      { id: 'CanManageServices', name: 'Управление услугами' },
      { id: 'CanManageCategories', name: 'Управление категориями' },
      { id: 'CanManageVisitObjects', name: 'Управление объектами посещения' },
      { id: 'CanViewReports', name: 'Просмотр отчетов' },
      { id: 'CanManageSettings', name: 'Управление настройками' },
      { id: 'CanManageOrders', name: 'Управление заказами' },
      { id: 'CanExportData', name: 'Экспорт данных' },
      { id: 'CanImportData', name: 'Импорт данных' }
    ],
  }),
  
  getters: {
    // Получение всех пользователей
    getAllUsers: (state) => state.users,
    
    // Получение пользователя по ID
    getUserById: (state) => (id) => {
      return state.users.find(user => user.Id === id);
    },
    
    // Получение пользователя по имени пользователя
    getUserByUsername: (state) => (username) => {
      return state.users.find(user => user.UserName === username);
    },
    
    // Получение текущего пользователя
    getCurrentUser: (state) => state.currentUser,
    
    // Проверка, является ли пользователь администратором
    isAdmin: (state) => {
      return state.currentUser && state.currentUser.Role === 'ADMIN';
    },
    
    // Проверка, является ли пользователь root-пользователем
    hasRootAccess: (state) => {
      return state.isRoot || (state.currentUser && state.currentUser.IsRoot);
    },
    
    // Получение прав доступа текущего пользователя
    getUserPermissions: (state) => {
      return state.currentUser?.Permissions || {};
    },
    
    // Проверка наличия права доступа
    hasPermission: (state) => (permission) => {
      // Если пользователь не авторизован
      if (!state.currentUser) return false;
      
      // Если пользователь root, у него есть все права
      if (state.isRoot || state.currentUser.IsRoot) return true;
      
      // Проверяем права доступа из объекта Permissions
      if (state.currentUser.Permissions) {
        return !!state.currentUser.Permissions[permission];
      }
      
      // Если нет объекта Permissions, проверяем в списке прав
      return !!state.permissionsList[permission];
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
    
    // Получение информации о текущем пользователе
    async fetchCurrentUser() {
      this.loading = true;
      this.error = null;
      
      try {
        const user = await fetchCurrentUser();
        this.currentUser = user;
        return user;
      } catch (error) {
        this.error = error.message || 'Ошибка при получении информации о текущем пользователе';
        console.error('Ошибка при получении информации о текущем пользователе:', error);
        return null;
      } finally {
        this.loading = false;
      }
    },
    
    // Проверка, является ли текущий пользователь root-пользователем
    async checkIsRoot() {
      this.loading = true;
      this.error = null;
      
      try {
        const isRootUser = await isCurrentUserRoot();
        // Используем $patch для безопасного обновления состояния
        this.$patch({ isRoot: isRootUser });
        return isRootUser;
      } catch (error) {
        this.error = error.message || 'Ошибка при проверке root-статуса';
        console.error('Ошибка при проверке root-статуса:', error);
        return false;
      } finally {
        this.loading = false;
      }
    },
    
    // Получение прав доступа текущего пользователя
    async fetchUserPermissions() {
      this.loading = true;
      this.error = null;
      
      try {
        const permissions = await getCurrentUserPermissions();
        this.permissions = permissions;
        return permissions;
      } catch (error) {
        this.error = error.message || 'Ошибка при получении прав доступа';
        console.error('Ошибка при получении прав доступа:', error);
        return {};
      } finally {
        this.loading = false;
      }
    },
    
    // Получение списка прав доступа
    async fetchPermissionsList() {
      this.loading = true;
      this.error = null;
      
      try {
        const permissionsList = await getPermissionsList();
        this.permissionsList = permissionsList;
        return permissionsList;
      } catch (error) {
        this.error = error.message || 'Ошибка при получении списка прав доступа';
        console.error('Ошибка при получении списка прав доступа:', error);
        return {};
      } finally {
        this.loading = false;
      }
    },
    
    // Загрузка всех данных пользователя
    async loadUserData() {
      this.loading = true;
      this.error = null;
      
      try {
        // Загружаем все данные параллельно
        await Promise.all([
          this.fetchCurrentUser(),
          this.checkIsRoot(),
          this.fetchUserPermissions(),
          this.fetchPermissionsList(),
          this.fetchUsers()
        ]);
        
        return true;
      } catch (error) {
        this.error = error.message || 'Ошибка при загрузке данных пользователя';
        console.error('Ошибка при загрузке данных пользователя:', error);
        return false;
      } finally {
        this.loading = false;
      }
    },
    
    // Создание нового пользователя
    async createUser(userData) {
      this.loading = true;
      this.error = null;
      
      try {
        // Преобразуем данные в формат API
        const apiUserData = {
          UserName: userData.UserName,
          Password: userData.Password,
          Role: userData.Role,
          FullName: userData.FullName,
          Phone: userData.Phone,
          Email: userData.Email,
          IsRoot: userData.IsRoot || false,
          Permissions: userData.Permissions || {}
        };
        
        console.log('Отправка данных для создания пользователя:', apiUserData);
        const user = await createUser(apiUserData);
        
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
        
        // Подготавливаем данные для API в соответствии с документацией
        const apiUserData = {
          UserName: userData.UserName,
          Role: userData.Role,
          FullName: userData.FullName,
          Phone: userData.Phone,
          Email: userData.Email,
          IsRoot: userData.IsRoot || false,
          Permissions: userData.Permissions || {}
        };
        
        // Добавляем пароль только если он указан
        if (userData.Password && userData.Password.trim() !== '') {
          apiUserData.Password = userData.Password;
        }
        
        console.log(`Обновление пользователя с ID ${id}:`, apiUserData);
        
        // Отправляем запрос на обновление
        const updatedUser = await userApiUpdateUser(id, apiUserData);
        
        // Обновляем пользователя в локальном списке
        const index = this.users.findIndex(user => String(user.Id) === String(id));
        if (index !== -1) {
          this.users[index] = updatedUser;
          
          // Если обновляем текущего пользователя, обновляем и его
          if (this.currentUser && String(this.currentUser.Id) === String(id)) {
            this.currentUser = updatedUser;
          }
        } else {
          // Если пользователь не найден в списке, обновляем весь список
          await this.fetchUsers();
        }
        
        return updatedUser;
      } catch (error) {
        this.error = error.message || `Ошибка при обновлении пользователя с ID ${id}`;
        console.error(`Ошибка при обновлении пользователя с ID ${id}:`, error);
        throw error;
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
        
        // Проверяем, не пытаемся ли удалить root-пользователя без прав
        const userToDelete = this.users.find(user => user.Id === id);
        if (userToDelete && userToDelete.IsRoot && !this.isRoot) {
          throw new Error('Только root-пользователь может удалить другого root-пользователя');
        }
        
        console.log(`Удаление пользователя с ID ${id}`);
        
        // Отправляем запрос на удаление
        await deleteUser(id);
        
        // Удаляем пользователя из локального списка
        const index = this.users.findIndex(user => user.Id === id);
        if (index !== -1) {
          this.users.splice(index, 1);
          console.log(`Пользователь с ID ${id} успешно удален из локального списка`);
        } else {
          // Если пользователь не найден в списке, обновляем весь список
          await this.fetchUsers();
        }
        
        // Если удаляем текущего пользователя, разлогиниваемся
        if (this.currentUser && this.currentUser.Id === id) {
          this.currentUser = null;
          this.isRoot = false;
          this.permissions = {};
          this.permissionsList = {};
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
