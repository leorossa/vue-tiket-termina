<template>
  <div class="admin-container">
    <h2 class="admin-section-title">Настройки системы</h2>

    <div class="admin-card settings-section">
      <!-- Общие настройки -->
      <h3 class="subsection-title">Общие настройки</h3>
      <div class="admin-form-grid">
        <div class="admin-form-group">
          <label for="terminalName">Название терминала:</label>
          <input id="terminalName" type="text" v-model="generalSettings.terminalName" class="admin-input" />
        </div>
        <div class="admin-form-group">
          <label for="location">Местоположение:</label>
          <input id="location" type="text" v-model="generalSettings.location" class="admin-input" />
        </div>
      </div>
      <button @click="saveGeneralSettings" class="admin-button primary">Сохранить общие</button>
    </div>

    <!--Настройки API 
    <div class="admin-card settings-section">
       
      <h3 class="subsection-title">Настройки API</h3>
      <div class="admin-form-group">
        <label for="apiEndpoint">Конечная точка API:</label>
        <input id="apiEndpoint" type="text" v-model="apiSettings.endpoint" class="admin-input" />
      </div>
      <div class="admin-form-group">
        <label for="apiKey">Ключ API:</label>
        <input id="apiKey" type="password" v-model="apiSettings.key" class="admin-input" />
      </div>
      <button @click="saveApiSettings" class="admin-button primary">Сохранить API</button>
    </div>
    -->

    <!-- Настройки видеозаставки
    <div class="admin-card settings-section"> 
      <h3 class="subsection-title">Настройки видеозаставки</h3>
      <div class="admin-form-group">
        <label for="videoUrl">URL видеозаставки:</label>
        <input id="videoUrl" type="text" v-model="videoSettings.videoUrl" class="admin-input" placeholder="https://example.com/video.mp4" />
      </div>
      <div class="admin-form-group">
        <label for="videoEnabled">Статус видеозаставки:</label>
        <div class="d-flex align-items-center">
          <input id="videoEnabled" type="checkbox" v-model="videoSettings.enabled" class="admin-checkbox" />
          <span class="ml-2">Включить видеозаставку</span>
        </div>
      </div>
      <div class="admin-form-group">
        <label for="videoTimeout">Время до показа заставки (секунды):</label>
        <input id="videoTimeout" type="number" v-model="videoSettings.timeout" min="10" class="admin-input" />
      </div>
      <button @click="saveVideoSettings" class="admin-button primary">Сохранить настройки видео</button>
    </div>
    -->

    <!-- Настройки печати билетов 
    <div class="admin-card settings-section">
      <h3 class="subsection-title">Настройки печати билетов</h3>
      <div class="admin-form-group">
        <label for="printerName">Имя принтера:</label>
        <input id="printerName" type="text" v-model="printSettings.printerName" class="admin-input" />
      </div>
      <div class="admin-form-group">
        <label for="paperSize">Размер бумаги:</label>
        <select id="paperSize" v-model="printSettings.paperSize" class="admin-select">
          <option value="80mm">80мм (стандартный чековый)</option>
          <option value="58mm">58мм (узкий чековый)</option>
          <option value="A4">A4 (стандартный лист)</option>
        </select>
      </div>
      <div class="admin-form-group">
        <label>Элементы билета:</label>
        <div class="d-flex flex-column">
          <label class="d-flex align-items-center mb-2">
            <input type="checkbox" v-model="printSettings.showLogo" class="admin-checkbox" />
            <span>Показывать логотип</span>
          </label>
          <label class="d-flex align-items-center mb-2">
            <input type="checkbox" v-model="printSettings.showQR" class="admin-checkbox" />
            <span>Показывать QR-код</span>
          </label>
          <label class="d-flex align-items-center mb-2">
            <input type="checkbox" v-model="printSettings.showBarcode" class="admin-checkbox" />
            <span>Показывать штрих-код</span>
          </label>
          <label class="d-flex align-items-center">
            <input type="checkbox" v-model="printSettings.showFooter" class="admin-checkbox" />
            <span>Показывать подвал с контактами</span>
          </label>
        </div>
      </div>
      <button @click="savePrintSettings" class="admin-button primary">Сохранить настройки печати</button>
    </div>
    -->
    
    <!-- Настройки смены 
    <div class="admin-card settings-section">
      <h3 class="subsection-title">Настройки смены</h3>
      <div class="admin-form-group">
        <label>Текущий статус смены:</label>
        <div class="d-flex align-items-center">
          <div :class="['admin-badge', shiftSettings.isOpen ? 'success' : 'danger']">
            {{ shiftSettings.isOpen ? 'Смена открыта' : 'Смена закрыта' }}
          </div>
          <button 
            @click="toggleShift" 
            :class="['admin-button ml-3', shiftSettings.isOpen ? 'danger' : 'success']"
          >
            {{ shiftSettings.isOpen ? 'Закрыть смену' : 'Открыть смену' }}
          </button>
        </div>
      </div>
      <div v-if="shiftSettings.isOpen" class="admin-form-group">
        <label>Информация о текущей смене:</label>
        <div class="admin-info-list">
          <div class="admin-info-item">
            <span class="admin-info-label">Открыта:</span>
            <span class="admin-info-value">{{ formatDate(shiftSettings.openedAt) }}</span>
          </div>
          <div class="admin-info-item">
            <span class="admin-info-label">Кассир:</span>
            <span class="admin-info-value">{{ shiftSettings.cashierName }}</span>
          </div>
          <div class="admin-info-item">
            <span class="admin-info-label">Продажи за смену:</span>
            <span class="admin-info-value">{{ shiftSettings.salesCount }} билетов</span>
          </div>
          <div class="admin-info-item">
            <span class="admin-info-label">Сумма продаж:</span>
            <span class="admin-info-value">{{ shiftSettings.salesAmount }} ₽</span>
          </div>
        </div>
      </div>
      <div v-if="!shiftSettings.isOpen && shiftSettings.lastShift" class="admin-form-group">
        <label>Информация о последней смене:</label>
        <div class="admin-info-list">
          <div class="admin-info-item">
            <span class="admin-info-label">Открыта:</span>
            <span class="admin-info-value">{{ formatDate(shiftSettings.lastShift.openedAt) }}</span>
          </div>
          <div class="admin-info-item">
            <span class="admin-info-label">Закрыта:</span>
            <span class="admin-info-value">{{ formatDate(shiftSettings.lastShift.closedAt) }}</span>
          </div>
          <div class="admin-info-item">
            <span class="admin-info-label">Кассир:</span>
            <span class="admin-info-value">{{ shiftSettings.lastShift.cashierName }}</span>
          </div>
          <div class="admin-info-item">
            <span class="admin-info-label">Продажи за смену:</span>
            <span class="admin-info-value">{{ shiftSettings.lastShift.salesCount }} билетов</span>
          </div>
          <div class="admin-info-item">
            <span class="admin-info-label">Сумма продаж:</span>
            <span class="admin-info-value">{{ shiftSettings.lastShift.salesAmount }} ₽</span>
          </div>
        </div>
      </div>
    </div>
    -->
    
    <!-- Раздел информации о системе -->
    <div class="admin-card settings-section">
      <h3 class="subsection-title">Информация о системе</h3>
      <div class="admin-form-group">
        <button @click="showVersionInfo" class="admin-button secondary mb-2 w-100">
          Просмотреть информацию о версии системы
        </button>
        <button @click="showOrgInfo" class="admin-button secondary w-100">
          Просмотреть информацию об организации
        </button>
      </div>
    </div>
    
    <!-- Модальные окна для отображения информации -->
    <VersionInfoModal 
      v-if="isVersionInfoModalVisible" 
      :versionInfo="versionInfo" 
      @close="isVersionInfoModalVisible = false" 
      @edit="handleEditVersion"
    />
    
    <EditVersionInfoModal
      v-if="isEditVersionInfoModalVisible"
      :versionInfo="versionInfo"
      @close="isEditVersionInfoModalVisible = false"
      @save="saveVersionInfo"
    />
    
    <OrgInfoModal 
      v-if="isOrgInfoModalVisible" 
      :orgInfo="orgInfo" 
      @close="isOrgInfoModalVisible = false" 
    />
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { getVersionInfo, getOrgInfo, updateVersionInfo } from '@/api/infoApi';
import VersionInfoModal from '@/components/admin/VersionInfoModal.vue';
import EditVersionInfoModal from '@/components/admin/EditVersionInfoModal.vue';
import OrgInfoModal from '@/components/admin/OrgInfoModal.vue';

// Общие настройки
const generalSettings = reactive({
  terminalName: 'Терминал #1',
  location: 'Центральный парк'
});

// Загрузка сохраненных настроек терминала
function loadTerminalSettings() {
  try {
    const savedSettings = localStorage.getItem('terminalSettings');
    if (savedSettings) {
      const settings = JSON.parse(savedSettings);
      if (settings.terminalName) {
        generalSettings.terminalName = settings.terminalName;
      }
      if (settings.location) {
        generalSettings.location = settings.location;
      }
    }
  } catch (error) {
    console.error('Ошибка при загрузке настроек терминала:', error);
  }
}

// Загрузка настроек при монтировании компонента
onMounted(() => {
  loadTerminalSettings();
});

// Настройки API
const apiSettings = reactive({
  endpoint: 'https://api.example.com/v1',
  key: '**********'
});

// Настройки видеозаставки
const videoSettings = reactive({
  videoUrl: '',
  enabled: false,
  timeout: 60
});

// Настройки печати
const printSettings = reactive({
  printerName: 'Thermal Printer',
  paperSize: '80mm',
  showLogo: true,
  showQR: true,
  showBarcode: false,
  showFooter: true
});

// Настройки смены
const shiftSettings = reactive({
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
});

// Сохранение общих настроек
const saveGeneralSettings = () => {
  console.log('Общие настройки сохранены:', generalSettings);
  
  try {
    localStorage.setItem('terminalSettings', JSON.stringify(generalSettings));
    
    // Обновляем информацию о терминале в шапке
    if (window.updateTerminalSettings) {
      window.updateTerminalSettings();
    }
    
    // Создаем и диспетчеризируем событие обновления настроек
    const event = new Event('terminalSettingsUpdated');
    window.dispatchEvent(event);
    
    alert('Общие настройки успешно сохранены');
  } catch (error) {
    console.error('Ошибка при сохранении общих настроек:', error);
    alert('Ошибка при сохранении настроек');
  }
};

// Сохранение настроек API
const saveApiSettings = () => {
  console.log('Настройки API сохранены:', apiSettings);
  // В реальном приложении здесь будет вызов API
  alert('Настройки API сохранены!');
};

// Сохранение настроек видеозаставки
const saveVideoSettings = () => {
  console.log('Настройки видеозаставки сохранены:', videoSettings);
  // В реальном приложении здесь будет вызов API
  alert('Настройки видеозаставки сохранены!');
};

// Сохранение настроек печати
const savePrintSettings = () => {
  console.log('Настройки печати сохранены:', printSettings);
  // В реальном приложении здесь будет вызов API
  alert('Настройки печати сохранены!');
};

// Переключение статуса смены
const toggleShift = () => {
  if (shiftSettings.isOpen) {
    // Закрытие смены
    shiftSettings.lastShift = {
      openedAt: shiftSettings.openedAt,
      closedAt: new Date(),
      cashierName: shiftSettings.cashierName,
      salesCount: shiftSettings.salesCount,
      salesAmount: shiftSettings.salesAmount
    };
    shiftSettings.isOpen = false;
    shiftSettings.openedAt = null;
    shiftSettings.cashierName = '';
    shiftSettings.salesCount = 0;
    shiftSettings.salesAmount = 0;
    
    console.log('Смена закрыта:', shiftSettings.lastShift);
    alert('Смена успешно закрыта!');
  } else {
    // Открытие смены
    shiftSettings.isOpen = true;
    shiftSettings.openedAt = new Date();
    shiftSettings.cashierName = 'Администратор'; // В реальном приложении - текущий пользователь
    
    console.log('Смена открыта:', shiftSettings);
    alert('Смена успешно открыта!');
  }
};

// Форматирование даты
const formatDate = (date) => {
  if (!date) return '';
  
  return new Intl.DateTimeFormat('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
};

// Информация о версии и организации
const versionInfo = ref({});
const orgInfo = ref([]);
const isVersionInfoModalVisible = ref(false);
const isEditVersionInfoModalVisible = ref(false);
const isOrgInfoModalVisible = ref(false);

// Обработка события редактирования информации о версии
function handleEditVersion(data) {
  // Сохраняем данные для редактирования
  versionInfo.value = { ...data };
  
  // Закрываем модальное окно просмотра
  isVersionInfoModalVisible.value = false;
  
  // Открываем модальное окно редактирования
  isEditVersionInfoModalVisible.value = true;
}

// Сохранение отредактированной информации о версии
function saveVersionInfo(data) {
  // Обновляем данные
  versionInfo.value = { ...data };
  
  // Закрываем модальное окно редактирования
  isEditVersionInfoModalVisible.value = false;
  
  // Вызываем функцию обновления на сервере
  updateVersion();
}

// Обновление информации о версии на сервере
async function updateVersion() {
  try {
    // Подготавливаем данные для отправки
    const dataToUpdate = {
      Gate: versionInfo.value.Gate,
      System: versionInfo.value.System,
      Requisite: versionInfo.value.Requisite
    };
    
    // Отправляем запрос на обновление
    const response = await updateVersionInfo(dataToUpdate);
    console.log('Информация о разработчике обновлена:', response);
    
    // Показываем уведомление об успехе
    alert('Информация о разработчике успешно обновлена');
    
    // Обновляем информацию о версии
    await fetchVersionInfo();
  } catch (error) {
    console.error('Ошибка при обновлении информации о разработчике:', error);
    alert('Не удалось обновить информацию о разработчике: ' + (error.message || 'Неизвестная ошибка'));
  }
}

// Загрузка информации о версии
async function fetchVersionInfo() {
  try {
    const response = await getVersionInfo();
    versionInfo.value = response;
    console.log('Получена информация о версии:', response);
  } catch (error) {
    console.error('Ошибка при загрузке информации о версии:', error);
    alert('Не удалось загрузить информацию о версии системы');
  }
}

// Загрузка информации об организации
async function fetchOrgInfo() {
  try {
    const response = await getOrgInfo();
    orgInfo.value = response;
    console.log('Получена информация об организации:', response);
  } catch (error) {
    console.error('Ошибка при загрузке информации об организации:', error);
    alert('Не удалось загрузить информацию об организации');
  }
}

// Показать модальное окно с информацией о версии
async function showVersionInfo() {
  await fetchVersionInfo();
  isVersionInfoModalVisible.value = true;
}

// Показать модальное окно с информацией об организации
async function showOrgInfo() {
  await fetchOrgInfo();
  isOrgInfoModalVisible.value = true;
}
</script>

<style scoped>
.settings-section {
  margin-bottom: 2em;
}

.mb-2 {
  margin-bottom: 0.5rem;
}

.w-100 {
  width: 100%;
}

.subsection-title {
  font-size: 1.1rem;
  color: var(--admin-text-secondary);
  margin-top: 0;
  margin-bottom: 0.75em;
  padding-bottom: 0.3em;
  border-bottom: 1px solid var(--admin-border-color);
}

.admin-info-list {
  background-color: var(--admin-bg-secondary);
  border-radius: var(--admin-border-radius-sm);
  padding: 1rem;
}

.admin-info-item {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid var(--admin-border-color);
}

.admin-info-item:last-child {
  margin-bottom: 0;
  padding-bottom: 0;
  border-bottom: none;
}

.admin-info-label {
  color: var(--admin-text-secondary);
  font-weight: 500;
}

.admin-info-value {
  font-weight: 500;
}
</style>
