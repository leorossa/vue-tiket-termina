import { createApp } from 'vue'
import { createPinia } from 'pinia'
import './assets/styles/global.css'; 
import './assets/styles/admin.css';   

import App from './App.vue'
import router from './router.js'

// Создание экземпляра Pinia
const pinia = createPinia()

// Создание приложения
const app = createApp(App)

// Использование плагинов
app.use(pinia)
app.use(router)

// Монтирование приложения
app.mount('#app')
