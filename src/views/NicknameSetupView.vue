<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { useNicknameAvailability } from '../composables/useNicknameAvailability'

const nickname = ref('')
const errorMessage = ref('')
const isSubmitting = ref(false)

const authStore = useAuthStore()
const router = useRouter()
const { status: nicknameStatus, checkNow: checkNicknameNow } = useNicknameAvailability(nickname)

const nicknameHint = computed(() => {
  switch (nicknameStatus.value) {
    case 'checking':
      return { text: '확인 중...', className: 'hint-muted' }
    case 'available':
      return { text: '사용 가능한 닉네임입니다.', className: 'hint-ok' }
    case 'taken':
      return { text: '이미 사용 중인 닉네임입니다.', className: 'hint-error' }
    default:
      return null
  }
})

async function onSubmit() {
  if (nicknameStatus.value === 'taken') return

  errorMessage.value = ''
  isSubmitting.value = true
  try {
    await authStore.setNickname(nickname.value)
    router.push('/')
  } catch {
    errorMessage.value = '닉네임 설정에 실패했습니다. 다른 닉네임을 입력해 주세요.'
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <main class="auth-page">
    <div class="auth-card">
      <h1>닉네임을 정해주세요</h1>
      <p class="description">챌린지에서 사용할 닉네임이에요. 나중에 바꿀 수 없으니 신중하게 골라주세요.</p>
      <form @submit.prevent="onSubmit">
        <div>
          <div class="nickname-row">
            <input v-model="nickname" type="text" placeholder="닉네임" required />
            <button class="ghost-button" type="button" :disabled="!nickname" @click="checkNicknameNow">중복확인</button>
          </div>
          <p v-if="nicknameHint" :class="nicknameHint.className">{{ nicknameHint.text }}</p>
        </div>
        <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
        <button class="primary-button" type="submit" :disabled="isSubmitting">시작하기</button>
      </form>
    </div>
  </main>
</template>

<style scoped>
.auth-page {
  display: flex;
  justify-content: center;
  padding: 3rem 1rem;
}

.auth-card {
  width: 100%;
  max-width: 360px;
  background: var(--color-bg-soft);
  border: 1px solid var(--color-border);
  border-radius: 16px;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
}

h1 {
  font-size: 1.4rem;
  text-align: center;
}

.description {
  color: var(--color-text-muted);
  font-size: 0.85rem;
  text-align: center;
}

form {
  display: flex;
  flex-direction: column;
  gap: 0.7rem;
}

input {
  width: 100%;
  background: var(--color-bg-mute);
  border: 1px solid var(--color-border);
  border-radius: 8px;
  padding: 0.7rem 0.9rem;
  color: var(--color-text);
  font-size: 0.95rem;
}

input:focus {
  outline: none;
  border-color: var(--color-accent);
}

.primary-button {
  background: var(--color-accent);
  color: #0c1410;
  font-weight: 700;
  border: none;
  border-radius: 8px;
  padding: 0.75rem;
  font-size: 0.95rem;
}

.primary-button:hover {
  background: var(--color-accent-strong);
}

.primary-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.error {
  color: var(--color-danger);
  font-size: 0.85rem;
}

.hint-muted {
  color: var(--color-text-muted);
  font-size: 0.8rem;
  margin-top: 0.3rem;
}

.hint-ok {
  color: var(--color-accent);
  font-size: 0.8rem;
  margin-top: 0.3rem;
}

.hint-error {
  color: var(--color-danger);
  font-size: 0.8rem;
  margin-top: 0.3rem;
}
</style>
