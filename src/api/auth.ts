import { apiGet, apiPost, apiPatch, apiDelete } from './http'

export interface TokenResponse {
  accessToken: string
  refreshToken: string
  expiresInSeconds: number
  nicknameConfirmed: boolean
}

export interface UserResponse {
  id: number
  email: string
  nickname: string
  role: 'USER' | 'ADMIN'
  nicknameConfirmed: boolean
}

export function register(email: string, password: string, nickname: string) {
  return apiPost<TokenResponse>('/api/auth/register', { email, password, nickname })
}

export function login(email: string, password: string) {
  return apiPost<TokenResponse>('/api/auth/login', { email, password })
}

export function refresh(refreshToken: string) {
  return apiPost<TokenResponse>('/api/auth/refresh', { refreshToken })
}

export function exchangeOAuth2Code(code: string) {
  return apiPost<TokenResponse>('/api/auth/oauth2/exchange', { code })
}

export function fetchMe(accessToken: string) {
  return apiGet<UserResponse>('/api/users/me', { Authorization: `Bearer ${accessToken}` })
}

export function updateNickname(accessToken: string, nickname: string) {
  return apiPatch<UserResponse>('/api/users/me/nickname', { nickname }, { Authorization: `Bearer ${accessToken}` })
}

export function logout(refreshToken: string) {
  return apiPost<void>('/api/auth/logout', { refreshToken })
}

export function withdraw(accessToken: string) {
  return apiDelete<void>('/api/users/me', { Authorization: `Bearer ${accessToken}` })
}

export function checkNicknameAvailable(nickname: string) {
  return apiGet<{ available: boolean }>(`/api/auth/check-nickname?nickname=${encodeURIComponent(nickname)}`)
}

export function kakaoLoginUrl(apiBaseUrl: string) {
  return `${apiBaseUrl}/oauth2/authorization/kakao`
}
