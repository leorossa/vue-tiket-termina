<template>
  <div class="admin-container">
    <h2 class="admin-section-title">Настройки системы</h2>

    <div class="admin-card settings-section">
      <h3 class="admin-section-title subsection-title">Общие настройки</h3>
      <form @submit.prevent="saveGeneralSettings">
        <div class="admin-form-group">
          <label for="terminalName">Название терминала:</label>
          <input type="text" id="terminalName" v-model="generalSettings.terminalName" class="admin-input" placeholder="Мой Терминал">
        </div>
        <div class="admin-form-group">
          <label for="terminalLanguage">Язык интерфейса:</label>
          <select id="terminalLanguage" v-model="generalSettings.language" class="admin-input">
            <option value="ru">Русский</option>
            <option value="en">English</option>
          </select>
        </div>
        <button type="submit" class="admin-button primary">Сохранить общие настройки</button>
      </form>
    </div>

    <div class="admin-card settings-section">
      <h3 class="admin-section-title subsection-title">Настройки отображения</h3>
      <form @submit.prevent="saveDisplaySettings">
        <div class="admin-form-group">
          <label for="logoUpload">Логотип (PNG, JPG, SVG):</label>
          <input type="file" id="logoUpload" @change="handleLogoUpload" accept=".png, .jpg, .jpeg, .svg" class="admin-input">
          <div v-if="displaySettings.logoPreview" class="logo-preview-container">
            <p>Предпросмотр:</p>
            <img :src="displaySettings.logoPreview" alt="Предпросмотр логотипа" class="logo-preview">
          </div>
        </div>
        <div class="admin-form-group">
          <label for="screensaverUrl">URL видеозаставки (MP4, WebM):</label>
          <input type="url" id="screensaverUrl" v-model="displaySettings.screensaverUrl" class="admin-input" placeholder="https://example.com/video.mp4">
        </div>
        <button type="submit" class="admin-button primary">Сохранить настройки отображения</button>
      </form>
    </div>

  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';

const generalSettings = reactive({
  terminalName: 'Терминал Тикет-Мастер',
  language: 'ru',
});

const displaySettings = reactive({
  logoFile: null,
  logoPreview: null, // URL.createObjectURL() или base64
  screensaverUrl: '',
});

const handleLogoUpload = (event) => {
  const file = event.target.files[0];
  if (file) {
    displaySettings.logoFile = file;
    // Создаем URL для предпросмотра
    displaySettings.logoPreview = URL.createObjectURL(file);
    // При реальной загрузке, нужно будет отозвать этот URL через URL.revokeObjectURL(displaySettings.logoPreview)
    // когда компонент уничтожается или загружается новый файл, чтобы избежать утечек памяти.
  }
};

const saveGeneralSettings = () => {
  console.log('Сохранение общих настроек:', generalSettings);
  // Здесь будет логика отправки данных на сервер
  alert('Общие настройки сохранены (демо)!');
};

const saveDisplaySettings = () => {
  console.log('Сохранение настроек отображения:', displaySettings);
  // Здесь будет логика отправки данных на сервер, возможно, с загрузкой файла
  alert('Настройки отображения сохранены (демо)!');
};

// TODO: Не забыть URL.revokeObjectURL(displaySettings.logoPreview) в onBeforeUnmount или при смене файла
</script>

<style scoped>
.admin-container {
  /* Дополнительные стили для контейнера настроек, если нужны */
}

.settings-section {
  margin-bottom: 2em;
}

.subsection-title {
  font-size: 1.2rem;
  margin-bottom: 1em;
  padding-bottom: 0.5em;
  border-bottom: 1px solid var(--admin-border-color, #e5e7eb);
}

.admin-form-group {
  margin-bottom: 1.5em;
}

.admin-form-group label {
  display: block;
  margin-bottom: 0.5em;
  font-weight: 500;
  color: var(--admin-text-secondary, #4b5563);
}

/* Стили для input[type="file"] могут быть кастомизированы дальше, если стандартные admin-input не подходят */
/* или можно создать специальный класс .admin-file-input в admin.css */

.logo-preview-container {
  margin-top: 1em;
}

.logo-preview-container p {
  font-size: 0.9em;
  color: var(--admin-text-secondary, #4b5563);
  margin-bottom: 0.5em;
}

.logo-preview {
  max-width: 200px;
  max-height: 100px;
  border: 1px solid var(--admin-border-color, #e5e7eb);
  border-radius: var(--admin-border-radius, 6px);
  padding: 0.5em;
  object-fit: contain;
}

.admin-button {
  /* Можно добавить специфичные отступы для кнопок сохранения в секциях */
  margin-top: 0.5em;
}
</style>
