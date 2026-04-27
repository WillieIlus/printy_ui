import type { AuthTokens, AuthUser, SignupCredentials } from '~/shared/types'
import { API } from '~/shared/api-paths'
import { useApi } from '~/shared/api'
import { authCookieStorage } from '~/utils/auth-cookie-storage'
import { extractApiFeedback } from '~/utils/api-feedback'
import { normalizeLoginError } from '~/utils/auth-error'
import { safeLogError } from '~/utils/safeLog'

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
  const api = useApi()
  const accessToken = ref<string | null>(null)
  const refreshToken = ref<string | null>(null)
  const user = ref<AuthUser | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)
  const rateLimitUntil = ref<number>(0)
  const rememberMe = ref(true)
  const initialized = ref(import.meta.server)
  const initializing = ref(false)

  let initializationPromise: Promise<void> | null = null

  const isAuthenticated = computed(() => !!accessToken.value)
  const normalizedRole = computed(() => {
    const role = user.value?.role
    if (role === 'PRINTER') return 'shop_owner'
    if (role === 'CUSTOMER') return 'client'
    return role ?? null
  })
  const isClient = computed(() => normalizedRole.value === 'client')
  const isShopOwner = computed(() => normalizedRole.value === 'shop_owner')
  const isStaffRole = computed(() => normalizedRole.value === 'staff')

  function clearSession() {
    accessToken.value = null
    refreshToken.value = null
    user.value = null
  }

  async function initialize() {
    if (initialized.value) return
    if (initializationPromise) {
      await initializationPromise
      return
    }

    initializing.value = true
    initializationPromise = (async () => {
      try {
        if (refreshToken.value) {
          await refresh()
        }

        if (isAuthenticated.value && !user.value) {
          await fetchMe()
        }
      } catch (err) {
        safeLogError(err, 'auth.initialize')
      } finally {
        initialized.value = true
        initializing.value = false
      }
    })()

    await initializationPromise
  }

  async function login(email: string, password: string, remember = true) {
    loading.value = true
    error.value = null
    rememberMe.value = remember
    try {
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
      safeLogError(err, 'auth.login')
      const loginFeedback = e?.statusCode === 429 || e?.status === 429
        ? { code: 'rate_limited' as const, message: extractErrorMessage(err, 429, 'Too many requests. Please wait a minute before trying again.') }
        : normalizeLoginError(err)
      error.value = loginFeedback.message
      return {
        success: false,
        error: loginFeedback.message,
        code: loginFeedback.code,
        email: loginFeedback.code === 'email_not_verified' ? email : undefined,
      }
    } finally {
      loading.value = false
    }
  }

  async function refresh() {
    if (!refreshToken.value) return false
    try {
      const response = await api<{ access: string; refresh?: string }>(API.auth.tokenRefresh, {
        method: 'POST',
        body: { refresh: refreshToken.value },
      })
      accessToken.value = response.access
      if (response.refresh) refreshToken.value = response.refresh
      return true
    } catch {
      clearSession()
      return false
    }
  }

  async function fetchMe() {
    if (!accessToken.value) return
    try {
      user.value = await api<AuthUser>(API.auth.me)
    } catch (err) {
      safeLogError(err, 'auth.fetchMe')
    }
  }

  function logout(message?: string) {
    clearSession()
    if (import.meta.client && message) {
      const toast = useToast()
      toast.add({
        title: 'Session expired',
        description: message,
        color: 'warning',
        icon: 'i-lucide-shield-alert',
      })
    }

    const route = useRoute()
    if (route.path !== '/auth/login') {
      navigateTo('/auth/login')
    }
  }

  async function signup(credentials: SignupCredentials) {
    loading.value = true
    error.value = null
    try {
      await api(API.auth.register, {
        method: 'POST',
        body: {
          email: credentials.email,
          password: credentials.password,
          first_name: credentials.first_name,
          last_name: credentials.last_name,
          name: `${credentials.first_name} ${credentials.last_name}`.trim(),
          ...(credentials.role ? { role: credentials.role } : {}),
        },
      })
      return { success: true, message: 'Registration successful. Check your email for a verification link.' }
    } catch (err: unknown) {
      const feedback = extractApiFeedback(err, 'We could not create your account right now.')
      error.value = feedback.message
      return { success: false, error: feedback.message, fieldErrors: feedback.fieldErrors }
    } finally {
      loading.value = false
    }
  }

  async function requestPasswordReset(email: string) {
    error.value = null
    try {
      await api(API.auth.forgotPassword, { method: 'POST', body: { email } })
      return { success: true }
    } catch (err: unknown) {
      error.value = extractApiFeedback(err, 'We could not send a reset link right now.').message
      return { success: false, error: error.value }
    }
  }

  async function resetPassword(uid: string, token: string, newPassword: string, newPasswordConfirm?: string) {
    error.value = null
    try {
      await api(API.auth.resetConfirm, {
        method: 'POST',
        body: { uid, token, new_password: newPassword, new_password_confirmation: newPasswordConfirm ?? newPassword },
      })
      return { success: true }
    } catch (err: unknown) {
      error.value = extractApiFeedback(err, 'We could not reset your password right now.').message
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
    initialized,
    initializing,
    isAuthenticated,
    normalizedRole,
    isClient,
    isShopOwner,
    isStaffRole,
    initialize,
    login,
    refresh,
    fetchMe,
    logout,
    signup,
    resendVerificationEmail: async (email: string) => {
      error.value = null
      try {
        const response = await api<{ detail?: string; sent?: boolean }>(API.auth.emailResend, {
          method: 'POST',
          body: { email },
        })
        return {
          success: true,
          message: response.detail ?? 'If that address exists and is unverified, a new confirmation email has been sent.',
          sent: response.sent ?? false,
        }
      } catch (err: unknown) {
        const feedback = extractApiFeedback(err, 'We could not resend the verification email right now.')
        error.value = feedback.message
        return { success: false, error: feedback.message, sent: false }
      }
    },
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
