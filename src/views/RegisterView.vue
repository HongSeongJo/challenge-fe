<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { useNicknameAvailability } from '../composables/useNicknameAvailability'
import { useEmailAvailability } from '../composables/useEmailAvailability'
import * as authApi from '../api/auth'

const email = ref('')
const password = ref('')
const nickname = ref('')
const errorMessage = ref('')
const isSubmitting = ref(false)

const emailCode = ref('')
const isEmailVerified = ref(false)
const isSendingCode = ref(false)
const isVerifyingCode = ref(false)
const codeSent = ref(false)
const emailCodeError = ref('')

const authStore = useAuthStore()
const router = useRouter()
const { status: nicknameStatus, checkNow: checkNicknameNow } = useNicknameAvailability(nickname)
const { status: emailStatus, checkNow: checkEmailNow } = useEmailAvailability(email)

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

const emailHint = computed(() => {
  switch (emailStatus.value) {
    case 'checking':
      return { text: '확인 중...', className: 'hint-muted' }
    case 'available':
      return { text: '사용 가능한 이메일입니다.', className: 'hint-ok' }
    case 'taken':
      return { text: '이미 가입된 이메일입니다.', className: 'hint-error' }
    default:
      return null
  }
})

function onEmailChange() {
  isEmailVerified.value = false
  codeSent.value = false
  emailCode.value = ''
  emailCodeError.value = ''
}

async function onSendCode() {
  if (!email.value || emailStatus.value === 'taken') return

  emailCodeError.value = ''
  codeSent.value = true
  isSendingCode.value = true
  try {
    await authApi.sendEmailCode(email.value)
  } catch {
    codeSent.value = false
    emailCodeError.value = '인증 코드 발송에 실패했습니다. 이메일을 확인해 주세요.'
  } finally {
    isSendingCode.value = false
  }
}

async function onVerifyCode() {
  emailCodeError.value = ''
  isVerifyingCode.value = true
  try {
    await authApi.verifyEmailCode(email.value, emailCode.value)
    isEmailVerified.value = true
  } catch {
    emailCodeError.value = '인증 코드가 올바르지 않거나 만료되었습니다.'
  } finally {
    isVerifyingCode.value = false
  }
}

async function onSubmit() {
  if (nicknameStatus.value !== 'available' || !isEmailVerified.value) return

  errorMessage.value = ''
  isSubmitting.value = true
  try {
    await authStore.register(email.value, password.value, nickname.value)
    router.push('/')
  } catch {
    errorMessage.value = '회원가입에 실패했습니다. 이미 가입된 이메일/닉네임인지 확인해 주세요.'
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <main class="auth-page">
    <div class="auth-card">
      <h1>회원가입</h1>
      <form @submit.prevent="onSubmit">
        <div>
          <div class="email-row">
            <input
              v-model="email"
              type="email"
              placeholder="이메일"
              :disabled="isEmailVerified"
              required
              @input="onEmailChange"
              @blur="checkEmailNow"
            />
            <button
              class="ghost-button"
              :class="{ 'verified-button': isEmailVerified }"
              type="button"
              :disabled="!email || isEmailVerified || isSendingCode || emailStatus === 'taken'"
              @click="onSendCode"
            >
              {{ isEmailVerified ? '인증 완료' : '인증하기' }}
            </button>
          </div>
          <p v-if="emailHint && !codeSent" :class="emailHint.className">{{ emailHint.text }}</p>
        </div>

        <div v-if="isEmailVerified" class="verified-banner">✓ 이메일 인증이 완료되었습니다.</div>
        <div v-else-if="codeSent">
          <div class="email-row">
            <input v-model="emailCode" type="text" placeholder="인증 코드 6자리" maxlength="6" />
            <button class="ghost-button" type="button" :disabled="!emailCode || isVerifyingCode" @click="onVerifyCode">
              확인
            </button>
          </div>
          <p class="hint-muted">{{ isSendingCode ? '인증 코드 발송 중...' : '메일로 받은 6자리 코드를 입력해 주세요.' }}</p>
        </div>
        <p v-if="emailCodeError" class="error">{{ emailCodeError }}</p>

        <input v-model="password" type="password" placeholder="비밀번호 (8자 이상)" minlength="8" required />
        <div>
          <div class="email-row">
            <input v-model="nickname" type="text" placeholder="닉네임" required />
            <button class="ghost-button" type="button" :disabled="!nickname" @click="checkNicknameNow">중복확인</button>
          </div>
          <p v-if="nicknameHint" :class="nicknameHint.className">{{ nicknameHint.text }}</p>
        </div>
        <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
        <button class="primary-button" type="submit" :disabled="isSubmitting || !isEmailVerified || nicknameStatus !== 'available'">가입하기</button>
      </form>

      <p class="footer-link">
        이미 계정이 있으신가요?
        <RouterLink to="/login">로그인</RouterLink>
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
  width: 100%;
  background: var(--color-bg-mute);
  border: 1px solid var(--color-border);
  border-radius: 8px;
  padding: 0.7rem 0.9rem;
  color: var(--color-text);
  font-size: 0.95rem;
}

input:disabled {
  opacity: 0.6;
}

input:focus {
  outline: none;
  border-color: var(--color-accent);
}

.email-row {
  display: flex;
  gap: 0.5rem;
}

.email-row input {
  flex: 1;
}

.ghost-button {
  flex-shrink: 0;
  border: 1px solid var(--color-border);
  background: transparent;
  color: var(--color-text);
  padding: 0 0.9rem;
  border-radius: 8px;
  font-size: 0.85rem;
  white-space: nowrap;
}

.ghost-button:hover:not(:disabled) {
  border-color: var(--color-accent);
  color: var(--color-accent);
}

.ghost-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.verified-button:disabled {
  opacity: 1;
  border-color: var(--color-accent);
  color: var(--color-accent);
  background: var(--color-accent-soft);
}

.verified-banner {
  color: var(--color-accent);
  font-size: 0.85rem;
  background: var(--color-accent-soft);
  border: 1px solid var(--color-accent);
  border-radius: 8px;
  padding: 0.6rem 0.8rem;
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

.primary-button:hover:not(:disabled) {
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

.footer-link {
  text-align: center;
  font-size: 0.85rem;
  color: var(--color-text-muted);
}
</style>
