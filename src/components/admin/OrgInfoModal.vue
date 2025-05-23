<template>
  <div class="admin-modal-overlay" @click.self="$emit('close')">
    <div class="admin-modal">
      <div class="admin-modal-header">
        <h2>Информация об организации</h2>
        <button @click="$emit('close')" class="admin-modal-close">&times;</button>
      </div>
      
      <div class="admin-modal-body">
        <div v-if="orgInfo && orgInfo.length > 0">
          <div v-for="(org, index) in orgInfo" :key="`org-${index}`" class="org-item">
            <div class="admin-info-list">
              <div class="admin-info-item">
                <span class="admin-info-label">Название:</span>
                <span class="admin-info-value">{{ org.Name }}</span>
              </div>
              <div class="admin-info-item">
                <span class="admin-info-label">Город:</span>
                <span class="admin-info-value">{{ org.City }}</span>
              </div>
              <div class="admin-info-item">
                <span class="admin-info-label">Адрес:</span>
                <span class="admin-info-value">{{ org.Address }}</span>
              </div>
              <div class="admin-info-item">
                <span class="admin-info-label">Телефон 1:</span>
                <span class="admin-info-value">{{ org.Phone1 }}</span>
              </div>
              <div class="admin-info-item" v-if="org.Phone2">
                <span class="admin-info-label">Телефон 2:</span>
                <span class="admin-info-value">{{ org.Phone2 }}</span>
              </div>
              <div class="admin-info-item" v-if="org.Fax">
                <span class="admin-info-label">Факс:</span>
                <span class="admin-info-value">{{ org.Fax }}</span>
              </div>
              <div class="admin-info-item">
                <span class="admin-info-label">Период работы:</span>
                <span class="admin-info-value">
                  {{ formatDate(org.DtBegin) }} - {{ formatDate(org.DtEnd) }}
                </span>
              </div>
            </div>
          </div>
        </div>
        <div v-else class="org-empty-state">
          Информация об организации отсутствует
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
  orgInfo: {
    type: Array,
    required: true,
    default: () => []
  }
});

const emit = defineEmits(['close']);

// Форматирование даты
function formatDate(dateString) {
  if (!dateString) return 'Не указано';
  
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return dateString; // Возвращаем исходную строку, если не удалось преобразовать
    }
    
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

// Копирование информации в буфер обмена
function copyToClipboard() {
  try {
    let text = 'ИНФОРМАЦИЯ ОБ ОРГАНИЗАЦИИ\n\n';
    
    if (props.orgInfo && props.orgInfo.length > 0) {
      props.orgInfo.forEach((org, index) => {
        text += `${index + 1}. ${org.Name}\n`;
        text += `   Город: ${org.City}\n`;
        text += `   Адрес: ${org.Address}\n`;
        text += `   Телефон 1: ${org.Phone1}\n`;
        
        if (org.Phone2) {
          text += `   Телефон 2: ${org.Phone2}\n`;
        }
        
        if (org.Fax) {
          text += `   Факс: ${org.Fax}\n`;
        }
        
        text += `   Период работы: ${formatDate(org.DtBegin)} - ${formatDate(org.DtEnd)}\n\n`;
      });
    } else {
      text += 'Информация об организации отсутствует';
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
.org-item {
  margin-bottom: 1rem;
}

.org-item:last-child {
  margin-bottom: 0;
}

.org-empty-state {
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
