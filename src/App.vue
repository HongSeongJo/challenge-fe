<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import { useAuthStore } from './stores/auth'
import challpotIcon from '@/assets/challpot-icon.png'

const authStore = useAuthStore()
</script>

<template>
  <header class="app-header">
    <RouterLink to="/" class="brand">
      <img :src="challpotIcon" alt="Challpot" class="brand-icon" />
      <span class="brand-name">Challpot</span>
    </RouterLink>

    <nav>
      <template v-if="authStore.accessToken">
        <RouterLink to="/settings" class="user-email">{{ authStore.user?.nickname ?? authStore.user?.email }}</RouterLink>
        <button class="ghost-button" type="button" @click="authStore.logout">로그아웃</button>
      </template>
      <RouterLink v-else to="/login" class="ghost-button">로그인</RouterLink>
    </nav>
  </header>

  <RouterView />
</template>

<style scoped>
.app-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 0 2rem;
  border-bottom: 1px solid var(--color-border);
  margin-bottom: 2rem;
}

.brand {
  display: flex;
  align-items: center;
  gap: 0.6rem;
}

.brand-icon {
  width: 36px;
  height: 36px;
  border-radius: 10px;
}

.brand-name {
  font-size: 1.2rem;
  font-weight: 700;
  color: var(--color-text);
}

nav {
  display: flex;
  align-items: center;
  gap: 0.8rem;
}

.user-email {
  color: var(--color-text-muted) !important;
  font-size: 0.9rem;
}

.user-email:hover {
  color: var(--color-accent) !important;
}

.ghost-button {
  border: 1px solid var(--color-border);
  background: transparent;
  color: var(--color-text);
  padding: 0.45rem 0.9rem;
  border-radius: 8px;
  font-size: 0.9rem;
}

.ghost-button:hover {
  border-color: var(--color-accent);
  color: var(--color-accent);
}
</style>
