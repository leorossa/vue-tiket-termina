<template>
  <div class="admin-modal-backdrop" @click.self="$emit('cancel')">
    <div class="admin-modal admin-modal-sm">
      <div class="admin-modal-header">
        <h3 class="admin-modal-title">Подтверждение удаления</h3>
        <button @click="$emit('cancel')" class="admin-button secondary icon">✕</button>
      </div>
      <div class="admin-modal-body">
        <p>Вы уверены, что хотите удалить {{ itemName }}?</p>
        <p class="text-danger">Это действие нельзя отменить.</p>
      </div>
      <div class="admin-modal-footer">
        <button @click="$emit('cancel')" class="admin-button secondary">Отмена</button>
        <button @click="$emit('confirm')" class="admin-button danger">Удалить</button>
      </div>
    </div>
  </div>
</template>

<script setup>
// Определение входных параметров
const props = defineProps({
  itemName: {
    type: String,
    required: true,
    default: 'элемент'
  }
});

// Определение событий
const emit = defineEmits(['cancel', 'confirm']);
</script>

<style scoped>
.admin-modal-sm {
  max-width: 400px;
}

.text-danger {
  color: #dc3545;
  font-weight: 500;
}
</style>
