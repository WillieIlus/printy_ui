import type { AuthTokens, AuthUser, SignupCredentials } from '~/shared/types'
import { API } from '~/shared/api-paths'
import { useApi } from '~/shared/api'
import { authCookieStorage } from '~/utils/auth-cookie-storage'

const AUTH_STORAGE_KEY = 'auth'

function extractErrorMessage(err: unknown, rateLimitStatus: number, rateLimitMessage: string): string {
  if (err && typeof err === 'object') {
    const e = err as { statusCode?: number; status?: number; data?: Record<string, unknown>; response?: { _data?: Record<string, unknown> } }
    if (e.statusCode === rateLimitStatus || e.status === rateLimitStatus) return rateLimitMessage
    const data = (e.data ?? e.response?._data) as Record<string, unknown> | undefined
    if (data && typeof data === 'object') {
      if (typeof data.detail === 'string') return data.detail
      // DRF validation errors: { "email": ["..."], "password": ["..."] }
      const first = Object.values(data).flat().find((v): v is string => typeof v === 'string')
      if (first) return first
    }
  }
  return err instanceof Error ? err.message : 'Login failed'
}

export const useAuthStore = defineStore('auth', () => {
  const accessToken = ref<string | null>(null)
  const refreshToken = ref<string | null>(null)
  const user = ref<AuthUser | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)
  const rateLimitUntil = ref<number>(0)
  const rememberMe = ref(true)

  const isAuthenticated = computed(() => !!accessToken.value)

  async function login(email: string, password: string, remember = true) {
    loading.value = true
    error.value = null
    rememberMe.value = remember
    try {
      const api = useApi()
      const response = await api<AuthTokens>(API.auth.token, {
        method: 'POST',
        body: { email, password },
      })
      accessToken.value = response.access
      refreshToken.value = response.refresh
      await fetchMe()
      return { success: true }
    } catch (err: unknown) {
      const e = err as { statusCode?: number; status?: number }
      if (e?.statusCode === 429 || e?.status === 429) rateLimitUntil.value = Date.now() + 60_000
      const message = extractErrorMessage(err, 429, 'Too many requests. Please wait a minute before trying again.')
      error.value = message
      return { success: false, error: message }
    } finally {
      loading.value = false
    }
  }

  async function refresh() {
    if (!refreshToken.value) return false
    try {
      const api = useApi()
      const response = await api<{ access: string; refresh?: string }>(API.auth.tokenRefresh, {
        method: 'POST',
        body: { refresh: refreshToken.value },
      })
      accessToken.value = response.access
      if (response.refresh) refreshToken.value = response.refresh
      return true
    } catch {
      logout()
      return false
    }
  }

  async function fetchMe() {
    if (!accessToken.value) return
    try {
      const api = useApi()
      user.value = await api<AuthUser>(API.auth.me)
    } catch (err) {
      console.error('Failed to fetch user:', err)
    }
  }

  function logout() {
    accessToken.value = null
    refreshToken.value = null
    user.value = null
    navigateTo('/auth/login')
  }

  async function signup(credentials: SignupCredentials) {
    loading.value = true
    error.value = null
    try {
      const api = useApi()
      await api(API.auth.register, {
        method: 'POST',
        body: {
          email: credentials.email,
          password: credentials.password,
          name: `${credentials.first_name} ${credentials.last_name}`.trim(),
        },
      })
      return { success: true, message: 'Registration successful. Please sign in.' }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Signup failed'
      error.value = message
      return { success: false, error: message }
    } finally {
      loading.value = false
    }
  }

  async function requestPasswordReset(email: string) {
    error.value = null
    try {
      const api = useApi()
      await api(API.auth.forgotPassword, { method: 'POST', body: { email } })
      return { success: true }
    } catch (err: unknown) {
      error.value = err instanceof Error ? err.message : 'Request failed'
      return { success: false, error: error.value }
    }
  }

  async function resetPassword(uid: string, token: string, newPassword: string, newPasswordConfirm?: string) {
    error.value = null
    try {
      const api = useApi()
      await api(API.auth.resetConfirm, {
        method: 'POST',
        body: { uid, token, new_password: newPassword, new_password_confirmation: newPasswordConfirm ?? newPassword },
      })
      return { success: true }
    } catch (err: unknown) {
      error.value = err instanceof Error ? err.message : 'Reset failed'
      return { success: false, error: error.value }
    }
  }

  return {
    accessToken,
    refreshToken,
    user,
    loading,
    error,
    rateLimitUntil,
    rememberMe,
    isAuthenticated,
    login,
    refresh,
    fetchMe,
    logout,
    signup,
    requestPasswordReset,
    resetPassword,
  }
}, {
  persist: {
    key: AUTH_STORAGE_KEY,
    storage: authCookieStorage,
    pick: ['accessToken', 'refreshToken', 'rememberMe'],
  },
})
