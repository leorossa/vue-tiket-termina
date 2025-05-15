// Хранилище для управления пользователями
import { defineStore } from 'pinia';

export const useUserStore = defineStore('user', {
  state: () => ({
    users: [
      {
        id: 1,
        name: 'Администратор',
        email: 'admin@example.com',
        role: 'admin',
        active: true,
        permissions: {
          canManageUsers: true,
          canManageServices: true,
          canViewReports: true,
          canManageSettings: true,
          canSellTickets: true
        }
      },
      {
        id: 2,
        name: 'Менеджер',
        email: 'manager@example.com',
        role: 'manager',
        active: true,
        permissions: {
          canManageUsers: false,
          canManageServices: true,
          canViewReports: true,
          canManageSettings: false,
          canSellTickets: true
        }
      },
      {
        id: 3,
        name: 'Кассир',
        email: 'cashier@example.com',
        role: 'cashier',
        active: true,
        permissions: {
          canManageUsers: false,
          canManageServices: false,
          canViewReports: false,
          canManageSettings: false,
          canSellTickets: true
        }
      }
    ],
    currentUser: null,
    loading: false,
    error: null
  }),
  
  getters: {
    // Получение всех пользователей
    getAllUsers: (state) => state.users,
    
    // Получение пользователя по ID
    getUserById: (state) => (id) => {
      return state.users.find(user => user.id === id);
    },
    
    // Получение текущего пользователя
    getCurrentUser: (state) => state.currentUser,
    
    // Проверка, является ли пользователь администратором
    isAdmin: (state) => {
      return state.currentUser && state.currentUser.role === 'admin';
    },
    
    // Проверка прав доступа пользователя
    hasPermission: (state) => (permission) => {
      return state.currentUser && state.currentUser.permissions[permission];
    },
    
    // Проверка загрузки
    isLoading: (state) => state.loading
  },
  
  actions: {
    // Вход в систему
    async login(email, password) {
      this.loading = true;
      this.error = null;
      
      try {
        // В реальном приложении здесь будет запрос к API
        // Временное решение - поиск пользователя по email
        const user = this.users.find(u => u.email === email);
        
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
        const index = this.users.findIndex(u => u.id === id);
        
        if (index !== -1) {
          // Если пароль не указан, сохраняем старый
          if (!userData.password) {
            userData.password = this.users[index].password;
          }
          
          this.users[index] = { ...this.users[index], ...userData };
          
          // Если обновляется текущий пользователь, обновляем и его
          if (this.currentUser && this.currentUser.id === id) {
            this.currentUser = this.users[index];
            localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
          }
          
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
        const index = this.users.findIndex(u => u.id === id);
        
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
    }
  }
});
