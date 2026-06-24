<script setup lang="ts">
import { useAuthStore } from '../stores/auth'

const authStore = useAuthStore()
</script>

<template>
  <main class="home">
    <h1>Challpot</h1>
    <p v-if="authStore.user" class="subtitle">
      {{ authStore.user.nickname }}님, 오늘 챌린지 인증하셨나요?
    </p>
    <p v-else class="subtitle">매일 인증샷으로 함께 완주하는 챌린지</p>
  </main>
</template>

<style scoped>
.home {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.8rem;
  padding: 4rem 0;
  text-align: center;
}

h1 {
  font-size: 2rem;
  color: var(--color-accent);
}

.subtitle {
  color: var(--color-text-muted);
}
</style>
