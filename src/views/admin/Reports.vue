<template>
  <div class="admin-container">
    <h2 class="admin-section-title">Отчеты</h2>

    <div class="admin-card">
      <div class="admin-form-group">
        <label for="reportType">Тип отчета:</label>
        <select id="reportType" v-model="selectedReportType" class="admin-input">
          <option value="daily">Ежедневный отчет</option>
          <option value="weekly">Еженедельный отчет</option>
          <option value="monthly">Ежемесячный отчет</option>
          <option value="custom">Произвольный период</option>
        </select>
      </div>

      <div v-if="selectedReportType === 'custom'" class="admin-form-grid">
        <div class="admin-form-group">
          <label for="startDate">Дата начала:</label>
          <input type="date" id="startDate" v-model="startDate" class="admin-input" />
        </div>
        <div class="admin-form-group">
          <label for="endDate">Дата окончания:</label>
          <input type="date" id="endDate" v-model="endDate" class="admin-input" />
        </div>
      </div>

      <div class="admin-form-group">
        <label for="reportFormat">Формат отчета:</label>
        <select id="reportFormat" v-model="selectedFormat" class="admin-input">
          <!--<option value="pdf">PDF</option>-->
          <option value="excel">Excel</option>
          <!--<option value="csv">CSV</option>-->
        </select>
      </div>

      <button @click="generateReport" class="admin-button primary" :disabled="loading">
        {{ loading ? 'Формирование отчета...' : 'Сформировать отчет' }}
      </button>
    </div>

    <div v-if="reports.length > 0" class="admin-card mt-4">
      <h3 class="subsection-title">История отчетов</h3>
      <div class="admin-table-responsive">
        <table class="admin-table">
          <thead>
            <tr>
              <th>Название отчета</th>
              <th>Тип</th>
              <th>Период</th>
              <th>Дата создания</th>
              <th>Действия</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(report, index) in reports" :key="index">
              <td>{{ report.name }}</td>
              <td>{{ getReportTypeName(report.type) }}</td>
              <td>{{ report.period }}</td>
              <td>{{ formatDate(report.createdAt) }}</td>
              <td>
                <div class="admin-button-group">
                  <button @click="downloadReport(report)" class="admin-button secondary">
                    Скачать
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div v-else-if="!loading" class="admin-card mt-4">
      <p class="text-center">История отчетов пуста</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useUserStore } from '@/stores/userStore';
import { useOrderStore } from '@/stores/orderStore';

// Инициализация хранилищ
const userStore = useUserStore();
const orderStore = useOrderStore();

// Состояния компонента
const loading = ref(false);
const selectedReportType = ref('daily');
const selectedFormat = ref('excel');
const startDate = ref('');
const endDate = ref('');
const reportData = ref([]);

// Список сформированных отчетов (в реальном приложении это будет загружаться с сервера)
const reports = ref([

]);

// Получение названия типа отчета
function getReportTypeName(type) {
  const types = {
    daily: 'Ежедневный',
    weekly: 'Еженедельный',
    monthly: 'Ежемесячный',
    custom: 'Произвольный период'
  };
  return types[type] || type;
}

// Форматирование даты
function formatDate(dateString) {
  if (!dateString) return '-';
  
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch (e) {
    console.error('Ошибка при форматировании даты:', e);
    return dateString;
  }
}

// Генерация отчета
async function generateReport() {
  if (selectedReportType.value === 'custom' && (!startDate.value || !endDate.value)) {
    alert('Пожалуйста, укажите даты начала и окончания периода');
    return;
  }

  loading.value = true;
  
  try {
    // Определяем период для отчета
    const now = new Date();
    let startDateObj, endDateObj;
    let periodText = '';
    
    switch (selectedReportType.value) {
      case 'daily':
        startDateObj = new Date(now.setHours(0, 0, 0, 0));
        endDateObj = new Date(now);
        endDateObj.setHours(23, 59, 59, 999);
        periodText = startDateObj.toLocaleDateString('ru-RU');
        break;
      case 'weekly':
        startDateObj = new Date(now);
        startDateObj.setDate(now.getDate() - now.getDay() + 1);
        startDateObj.setHours(0, 0, 0, 0);
        endDateObj = new Date(startDateObj);
        endDateObj.setDate(startDateObj.getDate() + 6);
        endDateObj.setHours(23, 59, 59, 999);
        periodText = `${startDateObj.toLocaleDateString('ru-RU')} - ${endDateObj.toLocaleDateString('ru-RU')}`;
        break;
      case 'monthly':
        startDateObj = new Date(now.getFullYear(), now.getMonth(), 1);
        startDateObj.setHours(0, 0, 0, 0);
        endDateObj = new Date(now.getFullYear(), now.getMonth() + 1, 0);
        endDateObj.setHours(23, 59, 59, 999);
        periodText = `${startDateObj.toLocaleDateString('ru-RU')} - ${endDateObj.toLocaleDateString('ru-RU')}`;
        break;
      case 'custom':
        startDateObj = new Date(startDate.value);
        startDateObj.setHours(0, 0, 0, 0);
        endDateObj = new Date(endDate.value);
        endDateObj.setHours(23, 59, 59, 999);
        periodText = `${startDateObj.toLocaleDateString('ru-RU')} - ${endDateObj.toLocaleDateString('ru-RU')}`;
        break;
    }
    
    // Форматируем даты для API
    const formattedStartDate = startDateObj.toISOString().split('T')[0];
    const formattedEndDate = endDateObj.toISOString().split('T')[0];
    
    // Получаем данные для отчета (в данном случае заказы)
    await orderStore.fetchOrdersByDateRange(formattedStartDate, formattedEndDate);
    
    // Подготавливаем данные для отчета
    reportData.value = orderStore.orders.map(order => ({
      'ID заказа': order.OrderId,
      'Штрих-код': order.OrderBarcode,
      'Посетитель': order.VisitorName1,
      'Телефон': order.VisitorPhone,
      'Статус': getOrderStatusName(order.OrderStateId),
      'Стоимость': order.Cost,
      'Дата создания': formatDate(order.CreatedAt)
    }));
    
    // Если выбран Excel, генерируем его на фронтенде
    if (selectedFormat.value === 'excel') {
      generateExcel(reportData.value, `Отчет_${selectedReportType.value}_${periodText.replace(/\s/g, '_')}`);
    }
    
    // Добавление нового отчета в список
    reports.value.unshift({
      id: reports.value.length + 1,
      name: `Отчет ${getReportTypeName(selectedReportType.value).toLowerCase()}`,
      type: selectedReportType.value,
      period: periodText,
      createdAt: new Date().toISOString(),
      url: '#',
      format: selectedFormat.value,
      data: reportData.value
    });
    
    alert('Отчет успешно сформирован');
  } catch (error) {
    console.error('Ошибка при формировании отчета:', error);
    alert('Произошла ошибка при формировании отчета');
  } finally {
    loading.value = false;
  }
}

// Получение названия статуса заказа
function getOrderStatusName(statusId) {
  const statuses = {
    0: 'Новый',
    1: 'Оплачен',
    2: 'Отменен',
    3: 'Возвращен',
    4: 'Использован'
  };
  return statuses[statusId] || `Статус ${statusId}`;
}

// Генерация Excel файла на фронтенде
function generateExcel(data, fileName) {
  if (!data || data.length === 0) {
    alert('Нет данных для формирования отчета');
    return;
  }
  
  try {
    // Для корректного открытия CSV в Excel в русской локали используем точку с запятой как разделитель
    // Это предотвращает склеивание всех данных в одну ячейку
    const headers = Object.keys(data[0]);
    let csvContent = headers.join(';') + '\n';
    
    // Добавляем строки данных
    data.forEach(item => {
      const row = headers.map(header => {
        // Экранируем кавычки и оборачиваем значение в кавычки, если оно содержит точку с запятой
        const value = String(item[header] || '');
        const escapedValue = value.replace(/"/g, '""');
        return value.includes(';') ? `"${escapedValue}"` : escapedValue;
      });
      csvContent += row.join(';') + '\n';
    });
    
    // Создаем Blob и ссылку для скачивания
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `${fileName}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error) {
    console.error('Ошибка при генерации Excel:', error);
    alert('Произошла ошибка при генерации Excel файла');
  }
}

// Скачивание отчета
function downloadReport(report) {
  if (report.data && report.format === 'excel') {
    generateExcel(report.data, `Отчет_${report.type}_${report.period.replace(/\s/g, '_')}`);
  } else {
    alert(`Скачивание отчета "${report.name}" в формате ${report.format || 'PDF'}`);
  }
}

// Загрузка данных при монтировании компонента
onMounted(() => {
  // Устанавливаем текущую дату для поля даты окончания
  endDate.value = new Date().toISOString().split('T')[0];
  
  // Устанавливаем дату начала на 30 дней назад
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  startDate.value = thirtyDaysAgo.toISOString().split('T')[0];
});
</script>

<style scoped>
.mt-4 {
  margin-top: 1rem;
}

.text-center {
  text-align: center;
}

.subsection-title {
  font-size: 1.1rem;
  color: var(--admin-text-secondary, #4a5568);
  margin-top: 0;
  margin-bottom: 0.75em;
  padding-bottom: 0.3em;
  border-bottom: 1px solid var(--admin-border-color, #e2e8f0);
}
</style>
