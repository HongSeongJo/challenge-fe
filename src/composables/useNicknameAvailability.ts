import { ref, watch, type Ref } from 'vue'
import { checkNicknameAvailable } from '../api/auth'

const DEBOUNCE_MS = 400

export function useNicknameAvailability(nickname: Ref<string>) {
  const status = ref<'idle' | 'checking' | 'available' | 'taken'>('idle')
  let timer: ReturnType<typeof setTimeout> | undefined

  watch(nickname, (value) => {
    clearTimeout(timer)
    const trimmed = value.trim()

    if (!trimmed) {
      status.value = 'idle'
      return
    }

    status.value = 'checking'
    timer = setTimeout(async () => {
      try {
        const { available } = await checkNicknameAvailable(trimmed)
        status.value = available ? 'available' : 'taken'
      } catch {
        status.value = 'idle'
      }
    }, DEBOUNCE_MS)
  })

  return { status }
}
