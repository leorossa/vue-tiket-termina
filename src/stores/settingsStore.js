// Хранилище для управления настройками системы
import { defineStore } from 'pinia';

export const useSettingsStore = defineStore('settings', {
  state: () => ({
    // Общие настройки
    generalSettings: {
      terminalName: 'Терминал #1',
      location: 'Центральный парк'
    },
    
    // Настройки API
    apiSettings: {
      endpoint: 'https://api.example.com/v1',
      key: '**********'
    },
    
    // Настройки видеозаставки
    videoSettings: {
      videoUrl: '',
      enabled: false,
      timeout: 60
    },
    
    // Настройки печати
    printSettings: {
      printerName: 'Thermal Printer',
      paperSize: '80mm',
      showLogo: true,
      showQR: true,
      showBarcode: false,
      showFooter: true
    },
    
    // Настройки смены
    shiftSettings: {
      isOpen: false,
      openedAt: null,
      cashierName: '',
      salesCount: 0,
      salesAmount: 0,
      lastShift: {
        openedAt: new Date(2025, 4, 14, 9, 0),
        closedAt: new Date(2025, 4, 14, 18, 0),
        cashierName: 'Иванов И.И.',
        salesCount: 156,
        salesAmount: 78500
      }
    },
    
    loading: false,
    error: null
  }),
  
  getters: {
    // Получение общих настроек
    getGeneralSettings: (state) => state.generalSettings,
    
    // Получение настроек API
    getApiSettings: (state) => state.apiSettings,
    
    // Получение настроек видеозаставки
    getVideoSettings: (state) => state.videoSettings,
    
    // Получение настроек печати
    getPrintSettings: (state) => state.printSettings,
    
    // Получение настроек смены
    getShiftSettings: (state) => state.shiftSettings,
    
    // Проверка, открыта ли смена
    isShiftOpen: (state) => state.shiftSettings.isOpen,
    
    // Проверка загрузки
    isLoading: (state) => state.loading
  },
  
  actions: {
    // Загрузка настроек
    async loadSettings() {
      this.loading = true;
      this.error = null;
      
      try {
        // В реальном приложении здесь будет запрос к API
        // Временно используем локальные данные из localStorage
        const savedSettings = localStorage.getItem('terminalSettings');
        
        if (savedSettings) {
          const settings = JSON.parse(savedSettings);
          
          // Обновляем настройки из сохраненных данных
          if (settings.generalSettings) this.generalSettings = settings.generalSettings;
          if (settings.apiSettings) this.apiSettings = settings.apiSettings;
          if (settings.videoSettings) this.videoSettings = settings.videoSettings;
          if (settings.printSettings) this.printSettings = settings.printSettings;
          if (settings.shiftSettings) {
            // Преобразуем строковые даты обратно в объекты Date
            if (settings.shiftSettings.openedAt) {
              settings.shiftSettings.openedAt = new Date(settings.shiftSettings.openedAt);
            }
            
            if (settings.shiftSettings.lastShift) {
              if (settings.shiftSettings.lastShift.openedAt) {
                settings.shiftSettings.lastShift.openedAt = new Date(settings.shiftSettings.lastShift.openedAt);
              }
              if (settings.shiftSettings.lastShift.closedAt) {
                settings.shiftSettings.lastShift.closedAt = new Date(settings.shiftSettings.lastShift.closedAt);
              }
            }
            
            this.shiftSettings = settings.shiftSettings;
          }
        }
        
        console.log('Настройки загружены');
        return { success: true };
      } catch (error) {
        this.error = error.message || 'Ошибка при загрузке настроек';
        console.error('Ошибка при загрузке настроек:', error);
        return { success: false, error: this.error };
      } finally {
        this.loading = false;
      }
    },
    
    // Сохранение настроек
    async saveSettings() {
      this.loading = true;
      this.error = null;
      
      try {
        // В реальном приложении здесь будет запрос к API
        // Временно сохраняем в localStorage
        localStorage.setItem('terminalSettings', JSON.stringify({
          generalSettings: this.generalSettings,
          apiSettings: this.apiSettings,
          videoSettings: this.videoSettings,
          printSettings: this.printSettings,
          shiftSettings: this.shiftSettings
        }));
        
        console.log('Настройки сохранены');
        return { success: true };
      } catch (error) {
        this.error = error.message || 'Ошибка при сохранении настроек';
        console.error('Ошибка при сохранении настроек:', error);
        return { success: false, error: this.error };
      } finally {
        this.loading = false;
      }
    },
    
    // Обновление общих настроек
    updateGeneralSettings(settings) {
      this.generalSettings = { ...this.generalSettings, ...settings };
      this.saveSettings();
    },
    
    // Обновление настроек API
    updateApiSettings(settings) {
      this.apiSettings = { ...this.apiSettings, ...settings };
      this.saveSettings();
    },
    
    // Обновление настроек видеозаставки
    updateVideoSettings(settings) {
      this.videoSettings = { ...this.videoSettings, ...settings };
      this.saveSettings();
    },
    
    // Обновление настроек печати
    updatePrintSettings(settings) {
      this.printSettings = { ...this.printSettings, ...settings };
      this.saveSettings();
    },
    
    // Открытие смены
    openShift(cashierName) {
      this.shiftSettings.isOpen = true;
      this.shiftSettings.openedAt = new Date();
      this.shiftSettings.cashierName = cashierName || 'Неизвестный кассир';
      this.shiftSettings.salesCount = 0;
      this.shiftSettings.salesAmount = 0;
      
      this.saveSettings();
      return { success: true };
    },
    
    // Закрытие смены
    closeShift() {
      if (!this.shiftSettings.isOpen) {
        return { success: false, error: 'Смена не открыта' };
      }
      
      this.shiftSettings.lastShift = {
        openedAt: this.shiftSettings.openedAt,
        closedAt: new Date(),
        cashierName: this.shiftSettings.cashierName,
        salesCount: this.shiftSettings.salesCount,
        salesAmount: this.shiftSettings.salesAmount
      };
      
      this.shiftSettings.isOpen = false;
      this.shiftSettings.openedAt = null;
      this.shiftSettings.cashierName = '';
      this.shiftSettings.salesCount = 0;
      this.shiftSettings.salesAmount = 0;
      
      this.saveSettings();
      return { success: true };
    },
    
    // Обновление данных о продажах в текущей смене
    updateShiftSales(count, amount) {
      if (!this.shiftSettings.isOpen) {
        return { success: false, error: 'Смена не открыта' };
      }
      
      this.shiftSettings.salesCount += count;
      this.shiftSettings.salesAmount += amount;
      
      this.saveSettings();
      return { success: true };
    }
  }
});
