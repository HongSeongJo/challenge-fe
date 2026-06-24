<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { kakaoLoginUrl } from '../api/auth'
import KakaoLoginButton from '../components/KakaoLoginButton.vue'

const email = ref('')
const password = ref('')
const errorMessage = ref('')
const isSubmitting = ref(false)

const authStore = useAuthStore()
const router = useRouter()

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080'

async function onSubmit() {
  errorMessage.value = ''
  isSubmitting.value = true
  try {
    await authStore.login(email.value, password.value)
    router.push('/')
  } catch {
    errorMessage.value = '이메일 또는 비밀번호가 올바르지 않습니다.'
  } finally {
    isSubmitting.value = false
  }
}

function onKakaoLogin() {
  window.location.href = kakaoLoginUrl(apiBaseUrl)
}
</script>

<template>
  <main class="auth-page">
    <div class="auth-card">
      <h1>로그인</h1>
      <form @submit.prevent="onSubmit">
        <input v-model="email" type="email" placeholder="이메일" required />
        <input v-model="password" type="password" placeholder="비밀번호" required />
        <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
        <button class="primary-button" type="submit" :disabled="isSubmitting">로그인</button>
      </form>

      <div class="divider"><span>또는</span></div>

      <KakaoLoginButton @click="onKakaoLogin" />

      <p class="footer-link">
        계정이 없으신가요?
        <RouterLink to="/register">회원가입</RouterLink>
      </p>
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

form {
  display: flex;
  flex-direction: column;
  gap: 0.7rem;
}

input {
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

.divider {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  color: var(--color-text-muted);
  font-size: 0.8rem;
}

.divider::before,
.divider::after {
  content: '';
  flex: 1;
  height: 1px;
  background: var(--color-border);
}

.error {
  color: var(--color-danger);
  font-size: 0.85rem;
}

.footer-link {
  text-align: center;
  font-size: 0.85rem;
  color: var(--color-text-muted);
}
</style>
