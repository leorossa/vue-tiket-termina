// src/api/shifts.js
// Локальная реализация, т.к. в бэкенде нет соответствующего API

// Helper to get shifts from localStorage safely
const getStoredShifts = () => JSON.parse(localStorage.getItem('shifts') || '[]');
const getStoredCurrentShift = () => JSON.parse(localStorage.getItem('currentShift') || 'null');

export const shiftAPI = {
  /**
   * Открыть смену
   */
  openShift(cashierName = 'Не указан') { // Added cashierName parameter for mock
    const currentShift = getStoredCurrentShift();
    if (currentShift) {
      return Promise.reject(new Error('Смена уже открыта'));
    }
    
    const newShift = {
      id: Date.now(),
      openTime: new Date().toISOString(),
      closeTime: null,
      status: 'открыта',
      cashier: cashierName, 
      orders: [], // To store order IDs or simplified order data for the shift report
      totalOrders: 0,
      totalAmount: 0
    };
    
    const shifts = getStoredShifts();
    shifts.push(newShift);
    localStorage.setItem('shifts', JSON.stringify(shifts));
    localStorage.setItem('currentShift', JSON.stringify(newShift));
    
    return Promise.resolve(newShift);
  },
  
  /**
   * Закрыть смену
   */
  closeShift() {
    const currentShift = getStoredCurrentShift();
    
    if (!currentShift) {
      return Promise.reject(new Error('Нет открытой смены'));
    }
    
    currentShift.closeTime = new Date().toISOString();
    currentShift.status = 'закрыта';
    // In a real app, totalOrders and totalAmount would be calculated from actual orders
    // For mock, this could be updated if orders were added to currentShift.orders during the shift
    
    const shifts = getStoredShifts();
    const updatedShifts = shifts.map(s => s.id === currentShift.id ? currentShift : s);
    
    localStorage.setItem('shifts', JSON.stringify(updatedShifts));
    localStorage.removeItem('currentShift');
    
    return Promise.resolve(currentShift);
  },
  
  /**
   * Получить текущую смену
   */
  getCurrentShift() {
    const currentShift = getStoredCurrentShift();
    return Promise.resolve(currentShift);
  },
  
  /**
   * Получить историю смен
   */
  getShiftsHistory() {
    const shifts = getStoredShifts();
    return Promise.resolve(shifts.sort((a, b) => new Date(b.openTime) - new Date(a.openTime))); // Sort by most recent
  },
  
  /**
   * Получить отчет по продажам за текущую смену
   */
  getCurrentShiftReport() {
    const currentShift = getStoredCurrentShift();
    
    if (!currentShift) {
      return Promise.reject(new Error('Нет открытой смены для отчета'));
    }
    
    // Mock report based on data stored in currentShift
    return Promise.resolve({
      shiftId: currentShift.id,
      openTime: currentShift.openTime,
      closeTime: currentShift.closeTime,
      cashier: currentShift.cashier,
      totalOrders: currentShift.totalOrders,
      totalAmount: currentShift.totalAmount,
      // orders: currentShift.orders // Could include list of orders if stored
    });
  },

  /**
   * (Mock helper) Добавить заказ к текущей смене (для симуляции продаж)
   */
  _addOrderToCurrentShiftMock(order) {
    const currentShift = getStoredCurrentShift();
    if (currentShift && currentShift.status === 'открыта') {
      currentShift.orders.push({ id: order.id, total: order.total });
      currentShift.totalOrders = currentShift.orders.length;
      currentShift.totalAmount = currentShift.orders.reduce((sum, o) => sum + o.total, 0);
      localStorage.setItem('currentShift', JSON.stringify(currentShift));
      return Promise.resolve(currentShift);
    }
    return Promise.reject(new Error('Нет открытой смены или заказ невалиден'));
  }
};
