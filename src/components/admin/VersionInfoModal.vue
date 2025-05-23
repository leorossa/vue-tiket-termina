<template>
  <div class="admin-modal-overlay" @click.self="$emit('close')">
    <div class="admin-modal">
      <div class="admin-modal-header">
        <h2>Информация о версии системы</h2>
        <button @click="$emit('close')" class="admin-modal-close">&times;</button>
      </div>
      
      <div class="admin-modal-body">
        <!-- Информация о Gate -->
        <div class="version-section">
          <h3 class="version-section-title">Информация о шлюзе</h3>
          <div v-if="versionInfo.Gate && versionInfo.Gate.length > 0">
            <div v-for="(gate, index) in versionInfo.Gate" :key="`gate-${index}`" class="version-item">
              <div class="admin-info-list">
                <div class="admin-info-item">
                  <span class="admin-info-label">Название:</span>
                  <span class="admin-info-value">{{ gate.Name }}</span>
                </div>
                <div class="admin-info-item">
                  <span class="admin-info-label">Версия:</span>
                  <span class="admin-info-value">{{ gate.Version }}</span>
                </div>
                <div class="admin-info-item">
                  <span class="admin-info-label">Сборка:</span>
                  <span class="admin-info-value">{{ gate.Major }}.{{ gate.Minor }}.{{ gate.Release }}.{{ gate.Build }}</span>
                </div>
                <div class="admin-info-item">
                  <span class="admin-info-label">Лицензия до:</span>
                  <span class="admin-info-value">{{ formatDate(gate.DtLicenceFinish) }}</span>
                </div>
              </div>
            </div>
          </div>
          <div v-else class="version-empty-state">
            Информация о шлюзе отсутствует
          </div>
        </div>
        
        <!-- Информация о System -->
        <div class="version-section">
          <h3 class="version-section-title">Информация о системе</h3>
          <div v-if="versionInfo.System && versionInfo.System.length > 0">
            <div v-for="(system, index) in versionInfo.System" :key="`system-${index}`" class="version-item">
              <div class="admin-info-list">
                <div class="admin-info-item">
                  <span class="admin-info-label">Название:</span>
                  <span class="admin-info-value">{{ system.Name }}</span>
                </div>
                <div class="admin-info-item">
                  <span class="admin-info-label">Версия:</span>
                  <span class="admin-info-value">{{ system.Version }}</span>
                </div>
                <div class="admin-info-item">
                  <span class="admin-info-label">Сборка:</span>
                  <span class="admin-info-value">{{ system.Major }}.{{ system.Minor }}.{{ system.Release }}.{{ system.Build }}</span>
                </div>
                <div class="admin-info-item">
                  <span class="admin-info-label">Лицензия до:</span>
                  <span class="admin-info-value">{{ formatDate(system.DtLicenceFinish) }}</span>
                </div>
              </div>
            </div>
          </div>
          <div v-else class="version-empty-state">
            Информация о системе отсутствует
          </div>
        </div>
        
        <!-- Информация о Requisite -->
        <div class="version-section">
          <h3 class="version-section-title">Реквизиты</h3>
          <div v-if="versionInfo.Requisite && versionInfo.Requisite.length > 0">
            <div v-for="(requisite, index) in versionInfo.Requisite" :key="`requisite-${index}`" class="version-item">
              <div class="admin-info-list">
                <div class="admin-info-item">
                  <span class="admin-info-label">Название:</span>
                  <span class="admin-info-value">{{ requisite.Name }}</span>
                </div>
                <div class="admin-info-item">
                  <span class="admin-info-label">Город:</span>
                  <span class="admin-info-value">{{ requisite.City }}</span>
                </div>
                <div class="admin-info-item">
                  <span class="admin-info-label">Адрес:</span>
                  <span class="admin-info-value">{{ requisite.Address }}</span>
                </div>
                <div class="admin-info-item">
                  <span class="admin-info-label">Телефон:</span>
                  <span class="admin-info-value">{{ requisite.Phone1 }}</span>
                </div>
                <div class="admin-info-item">
                  <span class="admin-info-label">Факс:</span>
                  <span class="admin-info-value">{{ requisite.Fax }}</span>
                </div>
                <div class="admin-info-item">
                  <span class="admin-info-label">Время работы:</span>
                  <span class="admin-info-value">
                    {{ formatTime(requisite.DtBegin) }} - {{ formatTime(requisite.DtEnd) }}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div v-else class="version-empty-state">
            Информация о реквизитах отсутствует
          </div>
        </div>
      </div>
      
      <div class="admin-modal-footer">
        <button @click="copyToClipboard" class="admin-button secondary">
          Копировать информацию
        </button>
        <button @click="$emit('close')" class="admin-button primary">
          Закрыть
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';

const props = defineProps({
  versionInfo: {
    type: Object,
    required: true,
    default: () => ({
      Gate: [],
      System: [],
      Requisite: []
    })
  }
});

const emit = defineEmits(['close']);

// Форматирование даты
function formatDate(dateString) {
  if (!dateString) return 'Не указано';
  
  try {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('ru-RU', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    }).format(date);
  } catch (error) {
    console.error('Ошибка форматирования даты:', error);
    return 'Некорректная дата';
  }
}

// Форматирование времени
function formatTime(timeObj) {
  if (!timeObj) return 'Не указано';
  
  try {
    // Проверяем, что объект времени содержит необходимые поля
    if (typeof timeObj === 'object' && 'hour' in timeObj && 'minute' in timeObj) {
      const hour = timeObj.hour.toString().padStart(2, '0');
      const minute = timeObj.minute.toString().padStart(2, '0');
      return `${hour}:${minute}`;
    } else {
      return 'Некорректное время';
    }
  } catch (error) {
    console.error('Ошибка форматирования времени:', error);
    return 'Некорректное время';
  }
}

// Копирование информации в буфер обмена
function copyToClipboard() {
  try {
    let text = 'ИНФОРМАЦИЯ О ВЕРСИИ СИСТЕМЫ\n\n';
    
    // Информация о шлюзе
    if (props.versionInfo.Gate && props.versionInfo.Gate.length > 0) {
      text += 'ИНФОРМАЦИЯ О ШЛЮЗЕ:\n';
      props.versionInfo.Gate.forEach((gate, index) => {
        text += `${index + 1}. ${gate.Name}\n`;
        text += `   Версия: ${gate.Version}\n`;
        text += `   Сборка: ${gate.Major}.${gate.Minor}.${gate.Release}.${gate.Build}\n`;
        text += `   Лицензия до: ${formatDate(gate.DtLicenceFinish)}\n\n`;
      });
    }
    
    // Информация о системе
    if (props.versionInfo.System && props.versionInfo.System.length > 0) {
      text += 'ИНФОРМАЦИЯ О СИСТЕМЕ:\n';
      props.versionInfo.System.forEach((system, index) => {
        text += `${index + 1}. ${system.Name}\n`;
        text += `   Версия: ${system.Version}\n`;
        text += `   Сборка: ${system.Major}.${system.Minor}.${system.Release}.${system.Build}\n`;
        text += `   Лицензия до: ${formatDate(system.DtLicenceFinish)}\n\n`;
      });
    }
    
    // Информация о реквизитах
    if (props.versionInfo.Requisite && props.versionInfo.Requisite.length > 0) {
      text += 'РЕКВИЗИТЫ:\n';
      props.versionInfo.Requisite.forEach((requisite, index) => {
        text += `${index + 1}. ${requisite.Name}\n`;
        text += `   Город: ${requisite.City}\n`;
        text += `   Адрес: ${requisite.Address}\n`;
        text += `   Телефон: ${requisite.Phone1}\n`;
        text += `   Факс: ${requisite.Fax}\n`;
        text += `   Время работы: ${formatTime(requisite.DtBegin)} - ${formatTime(requisite.DtEnd)}\n\n`;
      });
    }
    
    navigator.clipboard.writeText(text)
      .then(() => {
        alert('Информация скопирована в буфер обмена');
      })
      .catch(err => {
        console.error('Ошибка при копировании в буфер обмена:', err);
        alert('Не удалось скопировать информацию в буфер обмена');
      });
  } catch (error) {
    console.error('Ошибка при копировании информации:', error);
    alert('Произошла ошибка при копировании информации');
  }
}
</script>

<style scoped>
.version-section {
  margin-bottom: 1.5rem;
}

.version-section-title {
  font-size: 1.1rem;
  color: var(--admin-text-secondary, #4a5568);
  margin-top: 0;
  margin-bottom: 0.75rem;
  padding-bottom: 0.3rem;
  border-bottom: 1px solid var(--admin-border-color, #e2e8f0);
}

.version-item {
  margin-bottom: 1rem;
}

.version-item:last-child {
  margin-bottom: 0;
}

.version-empty-state {
  padding: 1rem;
  text-align: center;
  color: var(--admin-text-secondary, #718096);
  background-color: var(--admin-bg-secondary, #f7fafc);
  border-radius: var(--admin-border-radius-sm, 4px);
}

.admin-info-list {
  background-color: var(--admin-bg-secondary, #f7fafc);
  border-radius: var(--admin-border-radius-sm, 4px);
  padding: 1rem;
}

.admin-info-item {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid var(--admin-border-color, #e2e8f0);
}

.admin-info-item:last-child {
  margin-bottom: 0;
  padding-bottom: 0;
  border-bottom: none;
}

.admin-info-label {
  color: var(--admin-text-secondary, #718096);
  font-weight: 500;
}

.admin-info-value {
  font-weight: 500;
}
</style>
