import { defineConfig, loadEnv } from 'vite';
import vue from '@vitejs/plugin-vue';
import fs from 'fs';
import yaml from 'js-yaml';
import path from 'path';

// Загружаем конфиг из YAML
const loadConfig = () => {
  try {
    const configFile = fs.readFileSync(path.resolve(__dirname, 'config.yml'), 'utf8');
    const config = yaml.load(configFile);
    const env = process.env.NODE_ENV || 'development';
    return {
      ...config[env],
      env
    };
  } catch (e) {
    console.error('Ошибка загрузки конфигурации:', e);
    return {
      api: {
        baseUrl: 'http://localhost:8181',
        basePath: '/TLMuseumGate/REST'
      },
      env: 'development'
    };
  }
};

const config = loadConfig();

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  const isProd = mode === 'production';
  const apiBaseUrl = isProd ? '' : (env.VITE_API_BASE_URL || config.api.baseUrl);
  const apiBasePath = env.VITE_API_BASE_PATH || config.api.basePath;

  return {
    base: './',
    plugins: [vue()],
    resolve: { alias: { '@': '/src' } },
    server: {
      port: 3000,
      proxy: {
        '/api': {
          target: apiBaseUrl || 'http://localhost:8181',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, apiBasePath)
        }
      }
    },
    define: {
      'import.meta.env.APP_CONFIG': JSON.stringify(config),
      'import.meta.env.VITE_API_BASE_URL': JSON.stringify(apiBaseUrl),
      'import.meta.env.VITE_API_BASE_PATH': JSON.stringify(apiBasePath)
    }
  };
});