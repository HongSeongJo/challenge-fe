import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import * as authApi from '../api/auth'
import type { UserResponse } from '../api/auth'

const ACCESS_TOKEN_KEY = 'challpot:accessToken'
const REFRESH_TOKEN_KEY = 'challpot:refreshToken'

export const useAuthStore = defineStore('auth', () => {
  const accessToken = ref<string | null>(localStorage.getItem(ACCESS_TOKEN_KEY))
  const refreshToken = ref<string | null>(localStorage.getItem(REFRESH_TOKEN_KEY))
  const user = ref<UserResponse | null>(null)

  const needsNicknameSetup = computed(() => user.value !== null && !user.value.nicknameConfirmed)

  function setTokens(tokens: { accessToken: string; refreshToken: string }) {
    accessToken.value = tokens.accessToken
    refreshToken.value = tokens.refreshToken
    localStorage.setItem(ACCESS_TOKEN_KEY, tokens.accessToken)
    localStorage.setItem(REFRESH_TOKEN_KEY, tokens.refreshToken)
  }

  function clearTokens() {
    accessToken.value = null
    refreshToken.value = null
    user.value = null
    localStorage.removeItem(ACCESS_TOKEN_KEY)
    localStorage.removeItem(REFRESH_TOKEN_KEY)
  }

  async function loadMe() {
    if (!accessToken.value) return
    user.value = await authApi.fetchMe(accessToken.value)
  }

  async function login(email: string, password: string) {
    setTokens(await authApi.login(email, password))
    await loadMe()
  }

  async function register(email: string, password: string, nickname: string) {
    setTokens(await authApi.register(email, password, nickname))
    await loadMe()
  }

  async function exchangeOAuth2Code(code: string) {
    setTokens(await authApi.exchangeOAuth2Code(code))
    await loadMe()
  }

  async function setNickname(nickname: string) {
    if (!accessToken.value) return
    user.value = await authApi.updateNickname(accessToken.value, nickname)
  }

  async function logout() {
    const token = refreshToken.value
    clearTokens()
    if (token) {
      try {
        await authApi.logout(token)
      } catch {
        // refresh token이 이미 만료/무효해도 클라이언트는 어차피 로그아웃 상태이므로 무시한다.
      }
    }
  }

  async function withdraw() {
    if (!accessToken.value) return
    await authApi.withdraw(accessToken.value)
    clearTokens()
  }

  return {
    accessToken,
    refreshToken,
    user,
    needsNicknameSetup,
    login,
    register,
    exchangeOAuth2Code,
    setNickname,
    logout,
    withdraw,
    loadMe,
  }
})
