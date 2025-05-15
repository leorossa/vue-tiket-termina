import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': '/src' // Настройка алиаса для удобного импорта
    }
  },
  server: {
    port: 3000,
    proxy: {
      // Проксирование API-запросов на бэкенд
      '/api': {
        target: 'http://localhost:8181', // Адрес бэкенда
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '/TLMuseumGate/REST') // Замена префикса /api на контекстный путь бэкенда
      }
    }
  }
})
