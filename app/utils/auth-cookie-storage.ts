import { getBrowserStorage } from '~/utils/browser-storage'

/**
 * Cookie-based storage for auth (no localStorage).
 * - Remember me: cookie expires in 30 days
 * - No remember me: session cookie (expires when browser closes)
 */

const AUTH_COOKIE_NAME = 'printy_auth'
const REMEMBER_ME_DAYS = 30

function getCookie(name: string): string | null {
  if (import.meta.server || typeof document === 'undefined') return null
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'))
  const val = match?.[2]
  return val ? decodeURIComponent(val) : null
}

function setCookie(name: string, value: string, maxAgeDays?: number) {
  if (import.meta.server || typeof document === 'undefined') return
  const maxAge = maxAgeDays != null ? `; max-age=${maxAgeDays * 24 * 60 * 60}` : ''
  document.cookie = `${name}=${encodeURIComponent(value)}; path=/; SameSite=Lax${maxAge}`
}

function removeCookie(name: string) {
  if (import.meta.server || typeof document === 'undefined') return
  document.cookie = `${name}=; path=/; max-age=0`
}

/** Migrate away from old localStorage/sessionStorage - clear once */
function clearLegacyStorage() {
  try {
    getBrowserStorage().removeItem('auth')
    if (import.meta.client && typeof window !== 'undefined' && window.sessionStorage) {
      window.sessionStorage.removeItem('auth')
    }
  } catch {
    /* ignore */
  }
}

/** Storage adapter for Pinia persist - uses cookies instead of localStorage */
export const authCookieStorage = {
  getItem(_key: string): string | null {
    if (import.meta.server || typeof document === 'undefined') return null
    clearLegacyStorage()
    const val = getCookie(AUTH_COOKIE_NAME)
    if (!val) return null
    try {
      JSON.parse(val)
      return val
    } catch {
      return null
    }
  },

  setItem(_key: string, value: string): void {
    try {
      const parsed = JSON.parse(value) as { rememberMe?: boolean }
      const rememberMe = !!parsed.rememberMe
      setCookie(AUTH_COOKIE_NAME, value, rememberMe ? REMEMBER_ME_DAYS : undefined)
    } catch {
      setCookie(AUTH_COOKIE_NAME, value, REMEMBER_ME_DAYS)
    }
  },

  removeItem(_key: string): void {
    removeCookie(AUTH_COOKIE_NAME)
  },
}
