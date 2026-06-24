<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const errorMessage = ref('')

onMounted(async () => {
  const code = route.query.code
  if (typeof code !== 'string') {
    errorMessage.value = '잘못된 접근입니다.'
    return
  }

  try {
    await authStore.exchangeOAuth2Code(code)
    router.replace(authStore.needsNicknameSetup ? '/onboarding/nickname' : '/')
  } catch {
    errorMessage.value = '카카오 로그인 처리에 실패했습니다. 다시 시도해 주세요.'
  }
})
</script>

<template>
  <main class="callback-page">
    <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
    <p v-else>로그인 처리 중...</p>
  </main>
</template>

<style scoped>
.callback-page {
  display: flex;
  justify-content: center;
  padding: 4rem 0;
  color: var(--color-text-muted);
}

.error {
  color: var(--color-danger);
}
</style>
