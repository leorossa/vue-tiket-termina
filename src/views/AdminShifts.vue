<template>
  <div class="admin-shifts">
    <h2>Смены</h2>
    <div class="shift-controls">
      <button @click="openShift" class="btn">Открыть смену</button>
      <button @click="closeShift" class="btn">Закрыть смену</button>
    </div>
    <div class="shift-log">
      <h3>История смен (mock)</h3>
      <ul>
        <li v-for="shift in shifts" :key="shift.id">
          {{ shift.date }} — {{ shift.status }}
        </li>
      </ul>
    </div>
  </div>
</template>
<script setup>
import { ref } from 'vue';

const shifts = ref([
  { id: 1, date: '2025-04-24', status: 'открыта' },
  { id: 2, date: '2025-04-23', status: 'закрыта' },
]);

function openShift() {
  shifts.value.unshift({ id: Date.now(), date: new Date().toISOString().slice(0, 10), status: 'открыта' });
}
function closeShift() {
  shifts.value.unshift({ id: Date.now(), date: new Date().toISOString().slice(0, 10), status: 'закрыта' });
}
</script>
<style scoped>
.admin-shifts { max-width: 600px; margin: 2em auto; padding: 2em; background: #f7fafc; border-radius: 8px; box-shadow: 0 2px 8px #0001; color: #222; }
.admin-shifts h2, .admin-shifts h3 { color: #222; }
.shift-controls { display: flex; gap: 1em; margin-bottom: 1.5em; }
.btn { padding: 0.7em 1.5em; font-size: 1em; border: none; background: #1976d2; color: #fff; border-radius: 5px; cursor: pointer; }
.btn:hover { background: #1565c0; }
.shift-log ul { list-style: none; padding: 0; }
.shift-log li { margin: 0.5em 0; color: #222; }
</style>
