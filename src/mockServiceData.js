// Мок-данные для услуг на основе реального JSON-ответа

// Услуги
export const mockServices = [
  {
    id: 135,
    name: "Входной билет скидка 10%",
    description: "Входной билет со скидкой 10% для всех категорий посетителей",
    ageRestriction: "0+",
    price: 450,
    imageUrl: null,
    available: true,
    date: new Date().toISOString().split('T')[0],
    vatName: "НДС 20%",
    producerName: "Тестовая организация ООО Тонлайн"
  },
  {
    id: 875,
    name: "Билет к экскурсии сборной на 3 чел",
    description: "Билет для группы из 3 человек на сборную экскурсию",
    ageRestriction: "0+",
    price: 300,
    imageUrl: null,
    available: true,
    date: new Date().toISOString().split('T')[0],
    vatName: "НДС 20%",
    producerName: "Тестовая организация ООО Тонлайн"
  },
  {
    id: 964,
    name: "ШЛЮЗ = Входной билет Сложный",
    description: "Комплексный входной билет с доступом ко всем экспозициям",
    ageRestriction: "0+",
    price: 301,
    imageUrl: null,
    available: true,
    date: new Date().toISOString().split('T')[0],
    vatName: "НДС 20%",
    producerName: "Тестовая организация ООО Тонлайн"
  },
  {
    id: 1028,
    name: "Входной билет к Экскурсии",
    description: "Стандартный входной билет с возможностью посещения экскурсии",
    ageRestriction: "0+",
    price: 600,
    imageUrl: null,
    available: true,
    date: new Date().toISOString().split('T')[0],
    vatName: "НДС 20%",
    producerName: "Тестовая организация ООО Тонлайн"
  },
  {
    id: 1029,
    name: "Входной билет скидка 20%",
    description: "Входной билет со скидкой 20% для всех категорий посетителей",
    ageRestriction: "0+",
    price: 400,
    imageUrl: null,
    available: true,
    date: new Date().toISOString().split('T')[0],
    vatName: "НДС 20%",
    producerName: "Тестовая организация ООО Тонлайн"
  }
];

// Аттракционы
export const mockAttractions = [
  {
    id: 1051,
    name: "КАРУСЕЛЬ",
    description: "Поездка на карусели для всех возрастов",
    ageRestriction: "0+",
    price: 150,
    imageUrl: null,
    available: true,
    date: new Date().toISOString().split('T')[0],
    vatName: "НДС 20%",
    producerName: "Тестовая организация ООО Тонлайн"
  },
  {
    id: 1099,
    name: "ВЕСЕЛЫЙ ПОЕЗД",
    description: "Поездка на поезде по территории парка",
    ageRestriction: "0+",
    price: 150,
    imageUrl: null,
    available: true,
    date: new Date().toISOString().split('T')[0],
    vatName: "НДС 20%",
    producerName: "Тестовая организация ООО Тонлайн"
  },
  {
    id: 1100,
    name: "РУССКИЕ ГОРКИ",
    description: "Захватывающие русские горки для любителей острых ощущений",
    ageRestriction: "12+",
    price: 500,
    imageUrl: null,
    available: true,
    date: new Date().toISOString().split('T')[0],
    vatName: "НДС 20%",
    producerName: "Тестовая организация ООО Тонлайн"
  },
  {
    id: 1102,
    name: "ДАРТС",
    description: "Детский дартс для развития меткости и координации",
    ageRestriction: "0+",
    price: 150,
    imageUrl: null,
    available: true,
    date: new Date().toISOString().split('T')[0],
    vatName: "НДС 20%",
    producerName: "Тестовая организация ООО Тонлайн"
  },
  {
    id: 1104,
    name: "КАЧЕЛИ",
    description: "Качели для подростков и взрослых",
    ageRestriction: "13+",
    price: 150,
    imageUrl: null,
    available: true,
    date: new Date().toISOString().split('T')[0],
    vatName: "НДС 20%",
    producerName: "Тестовая организация ООО Тонлайн"
  },
  {
    id: 1106,
    name: "САМОЛЕТЫ",
    description: "Поездка на карусели Самолеты",
    ageRestriction: "5+",
    price: 150,
    imageUrl: null,
    available: true,
    date: new Date().toISOString().split('T')[0],
    vatName: "НДС 20%",
    producerName: "Тестовая организация ООО Тонлайн"
  }
];

// Категории посетителей
export const visitorCategories = [
  { id: 1, name: "Взрослые", group: "Взрослые", isPROCulture: false },
  { id: 2, name: "Дети", group: "Льготные", isPROCulture: false },
  { id: 4, name: "Инвалиды", group: "Бесплатные", isPROCulture: false },
  { id: 6, name: "Студенты", group: "Льготные", isPROCulture: true },
  { id: 31, name: "Льготные", group: "Льготные", isPROCulture: false },
  { id: 32, name: "Бесплатные", group: "Бесплатные", isPROCulture: false },
  { id: 34, name: "Школьники", group: "Льготные", isPROCulture: true }
];

// Объекты посещения
export const visitObjects = [
  { 
    id: 1, 
    name: "Домик Пушкина", 
    group: "Объекты посещений", 
    address: "Адрес такой тут: Домик Пушкина, строение 1", 
    comment: "Часы работы: круглосуточно" 
  },
  { 
    id: 2, 
    name: "Дворик Пушкина", 
    group: "Объекты посещений", 
    address: "sadfasdfadsfasd sdfad 345q435 3q45 3q4" 
  },
  { 
    id: 8, 
    name: "Музей", 
    group: "Объекты посещений", 
    address: "l;kgdfl;gjgl;jkldsff;dklfdjgkgjf['sadopdfopg" 
  },
  { 
    id: 18, 
    name: "Историческая экспозиция", 
    group: "Объекты посещений", 
    address: "sadfasdfadsfasd sdfad 345q435 3q45 3q4" 
  }
];

// Заказы
export const mockOrders = [
  { 
    id: 1001, 
    service: "Входной билет скидка 10%", 
    status: "оплачен", 
    amount: 2, 
    total: 900, 
    date: "2025-05-10",
    ticketNumber: "TK-1001-001",
    visitorCategory: "Взрослые",
    visitObject: "Музей"
  },
  { 
    id: 1002, 
    service: "Билет к экскурсии сборной на 3 чел", 
    status: "забронирован", 
    amount: 1, 
    total: 300, 
    date: "2025-05-10",
    ticketNumber: "TK-1002-001",
    visitorCategory: "Льготные",
    visitObject: "Музей"
  },
  { 
    id: 1003, 
    service: "КАРУСЕЛЬ", 
    status: "оплачен", 
    amount: 3, 
    total: 450, 
    date: "2025-05-10",
    ticketNumber: "TK-1003-001",
    visitorCategory: "Дети",
    visitObject: "Историческая экспозиция"
  },
  { 
    id: 1004, 
    service: "РУССКИЕ ГОРКИ", 
    status: "ошибка", 
    amount: 2, 
    total: 1000, 
    date: "2025-05-09",
    ticketNumber: "TK-1004-001",
    visitorCategory: "Взрослые",
    visitObject: "Музей"
  },
  { 
    id: 1005, 
    service: "Входной билет скидка 20%", 
    status: "возвращен", 
    amount: 1, 
    total: 400, 
    date: "2025-05-08",
    ticketNumber: "TK-1005-001",
    visitorCategory: "Взрослые",
    visitObject: "Домик Пушкина"
  }
];

// Скидки
export const discounts = [
  { id: 1, name: "Промо20", percent: 20.0 },
  { id: 2, name: "Промо15", percent: 15.0 }
];

// Смены
export const mockShifts = [
  { 
    id: 101, 
    openTime: "2025-05-10T09:00:00", 
    closeTime: "2025-05-10T18:00:00", 
    status: "закрыта",
    cashier: "Иванов И.И.",
    totalOrders: 15,
    totalAmount: 12500
  },
  { 
    id: 102, 
    openTime: "2025-05-09T09:00:00", 
    closeTime: "2025-05-09T18:00:00", 
    status: "закрыта",
    cashier: "Петров П.П.",
    totalOrders: 12,
    totalAmount: 9800
  },
  { 
    id: 103, 
    openTime: "2025-05-08T09:00:00", 
    closeTime: "2025-05-08T18:00:00", 
    status: "закрыта",
    cashier: "Сидоров С.С.",
    totalOrders: 18,
    totalAmount: 15200
  }
];
