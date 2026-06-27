import { ref, watch, type Ref } from 'vue'
import { checkNicknameAvailable } from '../api/auth'

const DEBOUNCE_MS = 400

export type AvailabilityStatus = 'idle' | 'checking' | 'available' | 'taken'

interface AvailabilityOptions {
  /**
   * true면 입력하는 동안 자동으로(디바운스) 체크한다. 한글처럼 IME 조합 중에는
   * v-model 값이 늦게 갱신될 수 있어 false로 두고 버튼/blur 등 명시적 호출(checkNow)에만 의존하는 게 안전하다.
   */
  live?: boolean
}

export function useAvailabilityCheck(
  value: Ref<string>,
  check: (value: string) => Promise<{ available: boolean }>,
  options: AvailabilityOptions = {},
) {
  const { live = true } = options
  const status = ref<AvailabilityStatus>('idle')
  let timer: ReturnType<typeof setTimeout> | undefined

  async function runCheck(trimmed: string) {
    const requested = trimmed
    try {
      const { available } = await check(requested)
      // 응답이 도착했을 때 입력값이 이미 바뀌어 있으면(타이핑 중 더 빠른/느린 응답이 뒤섞이는 레이스 컨디션) 버린다.
      if (value.value.trim() !== requested) return
      status.value = available ? 'available' : 'taken'
    } catch {
      if (value.value.trim() === requested) {
        status.value = 'idle'
      }
    }
  }

  watch(value, (next) => {
    clearTimeout(timer)
    const trimmed = next.trim()

    if (!trimmed) {
      status.value = 'idle'
      return
    }

    if (!live) {
      // 값이 바뀌었으니 이전 체크 결과는 더 이상 유효하지 않다. 다시 명시적으로 확인해야 한다.
      status.value = 'idle'
      return
    }

    status.value = 'checking'
    timer = setTimeout(() => runCheck(trimmed), DEBOUNCE_MS)
  })

  function checkNow() {
    clearTimeout(timer)
    const trimmed = value.value.trim()
    if (!trimmed) {
      status.value = 'idle'
      return
    }
    status.value = 'checking'
    runCheck(trimmed)
  }

  return { status, checkNow }
}

export function useNicknameAvailability(nickname: Ref<string>) {
  return useAvailabilityCheck(nickname, checkNicknameAvailable, { live: false })
}
