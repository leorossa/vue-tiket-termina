// src/api.js
// Сервис для работы с REST API терминала

const API_BASE = '';

async function apiRequest(path, options = {}) {
  const url = API_BASE + path;
  const response = await fetch(url, options);
  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }
  return response.json();
}

// Получить версию API
export function getVersion() {
  return apiRequest('/REST/Version');
}

// Получить информацию об организации
export function getOrg() {
  return apiRequest('/REST/Org');
}

// Получить список простых услуг
export function getSimpleServices() {
  return apiRequest('/REST/Service/Simple');
}

// Получить список редактируемых услуг
export function getEditableServices() {
  return apiRequest('/REST/Service/Editable');
}

// Создать заказ из простых услуг
export function createOrderSimple(data) {
  return apiRequest('/REST/Order/Create', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
}

// Создать заказ из редактируемых услуг
export function createOrderEditable(data) {
  return apiRequest('/REST/Order/Create', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
}

// Продать заказ
export function sellOrder(data) {
  return apiRequest('/REST/Order/Sold', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
}

// Отменить неоплаченный заказ
export function cancelOrder(data) {
  return apiRequest('/REST/Order/Cancel', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
}

// Возврат оплаты заказа
export function refundOrder(data) {
  return apiRequest('/REST/Order/Refund', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
}

// Получить заказ по ID
export function getOrderById(orderId) {
  return apiRequest(`/REST/Order?OrderId=${orderId}`);
}

// Получить список заказов по дате
export function getOrdersByDate(dtBegin, dtEnd) {
  return apiRequest(`/REST/Order?dtBegin=${dtBegin}&dtEnd=${dtEnd}`);
}

// Получить стоимость заказа
export function getOrderCost(data) {
  return apiRequest('/REST/Order/Cost', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
}

// Получить список экскурсий
export function getExcursions() {
  return apiRequest('/REST/Excursion');
}

// Создать экскурсию
export function createExcursion(data) {
  return apiRequest('/REST/Excursion', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
}

// Установить PROCultureGUID
export function setPROCultureGUID(data) {
  return apiRequest('/REST/SetPROCultureGUID', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
}
