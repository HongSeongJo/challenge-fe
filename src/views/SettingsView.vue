<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const authStore = useAuthStore()
const router = useRouter()
const errorMessage = ref('')
const isWithdrawing = ref(false)

async function onWithdraw() {
  if (!confirm('정말 탈퇴하시겠어요? 카카오로 가입했다면 카카오 연동도 함께 해제됩니다.')) return

  errorMessage.value = ''
  isWithdrawing.value = true
  try {
    await authStore.withdraw()
    router.push('/login')
  } catch {
    errorMessage.value = '탈퇴 처리에 실패했습니다. 잠시 후 다시 시도해 주세요.'
  } finally {
    isWithdrawing.value = false
  }
}
</script>

<template>
  <main class="settings-page">
    <div class="settings-card">
      <h1>설정</h1>
      <p class="info">{{ authStore.user?.nickname }}님 ({{ authStore.user?.email }})</p>

      <button class="danger-button" type="button" :disabled="isWithdrawing" @click="onWithdraw">
        회원탈퇴
      </button>
      <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
    </div>
  </main>
</template>

<style scoped>
.settings-page {
  display: flex;
  justify-content: center;
  padding: 3rem 1rem;
}

.settings-card {
  width: 100%;
  max-width: 360px;
  background: var(--color-bg-soft);
  border: 1px solid var(--color-border);
  border-radius: 16px;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

h1 {
  font-size: 1.4rem;
  text-align: center;
}

.info {
  color: var(--color-text-muted);
  font-size: 0.9rem;
  text-align: center;
}

.danger-button {
  background: transparent;
  border: 1px solid var(--color-danger);
  color: var(--color-danger);
  border-radius: 8px;
  padding: 0.75rem;
  font-size: 0.95rem;
}

.danger-button:hover {
  background: var(--color-danger);
  color: #1a0a0a;
}

.danger-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.error {
  color: var(--color-danger);
  font-size: 0.85rem;
  text-align: center;
}
</style>
