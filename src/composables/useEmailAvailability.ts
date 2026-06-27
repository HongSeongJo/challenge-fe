import type { Ref } from 'vue'
import { checkEmailAvailable } from '../api/auth'
import { useAvailabilityCheck } from './useNicknameAvailability'

export function useEmailAvailability(email: Ref<string>) {
  return useAvailabilityCheck(email, checkEmailAvailable)
}
