<script setup lang="ts">
defineProps<{ label?: string }>()
const emit = defineEmits<{ click: [] }>()
</script>

<template>
  <button type="button" class="kakao-button" @click="emit('click')">
    <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
      <path
        fill="#191919"
        d="M12 3C6.477 3 2 6.59 2 11c0 2.78 1.78 5.22 4.46 6.64-.2.72-.72 2.6-.83 3a.3.3 0 0 0 .45.34c.4-.27 3.1-2.1 4.36-2.96.5.07 1.02.1 1.56.1 5.523 0 10-3.59 10-8s-4.477-8-10-8Z"
      />
    </svg>
    <span>{{ label ?? '카카오로 로그인' }}</span>
  </button>
</template>

<style scoped>
.kakao-button {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  background-color: #fee500;
  color: #191919;
  border: none;
  border-radius: 999px;
  padding: 0.85rem 1rem;
  font-weight: 700;
  font-size: 0.95rem;
}

.kakao-button:hover {
  background-color: #f5dc00;
}
</style>
