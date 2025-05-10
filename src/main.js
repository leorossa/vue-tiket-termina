import { createApp } from 'vue'
import './style.css'
import './assets/styles/global.css'; // Import global styles
import './assets/styles/terminal.css'; // Import terminal-specific styles
import './assets/styles/admin.css';    // Import admin-specific styles
import App from './App.vue'
import router from './router.js'

createApp(App).use(router).mount('#app')
