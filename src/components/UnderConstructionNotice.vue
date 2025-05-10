<template>
  <div class="under-construction-notice">
    <div class="icon">🚧</div>
    <h2>Раздел в разработке</h2>
    <p>Эта функциональность скоро появится. Мы усердно работаем над её созданием!</p>
  </div>
</template>

<script setup>
// No script logic needed for this simple component
</script>

<style scoped>
.under-construction-notice {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 3em 1em;
  border: 2px dashed var(--admin-border-color, #e0e0e0);
  border-radius: var(--admin-border-radius, 8px);
  background-color: var(--admin-light-gray, #f9f9f9);
  color: var(--admin-text-secondary, #555);
  min-height: 300px; /* Ensure it takes some space */
  margin: 1em 0; /* Add some margin if used within other content */
}

.under-construction-notice .icon {
  font-size: 3rem;
  margin-bottom: 0.5em;
}

.under-construction-notice h2 {
  font-size: 1.5rem;
  color: var(--admin-text-primary, #333);
  margin-bottom: 0.5em;
}

.under-construction-notice p {
  font-size: 1rem;
  line-height: 1.6;
  max-width: 400px;
}
</style>
