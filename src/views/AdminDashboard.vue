<template>
  <div class="admin-dashboard">
    <h2>Панель управления</h2>
    <nav class="admin-menu">
      <router-link to="/admin/services">Услуги</router-link>
      <router-link to="/admin/shifts">Смены</router-link>
      <router-link to="/admin/orders">Продажи и возвраты</router-link>
      <router-link to="/admin/reports">Отчёты</router-link>
      <router-link to="/admin/settings">Настройки</router-link>
    </nav>
    <div class="admin-content">
      <p>Выберите раздел для управления.</p>
    </div>
  </div>
</template>
<script setup>
</script>
<style scoped>
.admin-dashboard { max-width: 700px; margin: 2em auto; padding: 2em; background: #f7fafc; border-radius: 8px; box-shadow: 0 2px 8px #0001; color: #222; }
.admin-dashboard h2, .admin-dashboard nav, .admin-dashboard p { color: #222; }
.admin-menu { display: flex; gap: 1em; justify-content: center; margin-bottom: 2em; }
.admin-menu a { padding: 0.5em 1.2em; border-radius: 4px; background: #e3f2fd; color: #1565c0; text-decoration: none; font-weight: 500; transition: background 0.2s; }
.admin-menu a.router-link-exact-active, .admin-menu a:hover { background: #1976d2; color: #fff; }
</style>
