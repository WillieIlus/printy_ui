const DEV_FALLBACK_API_BASE = 'http://127.0.0.1:8000/api'
const PROD_FALLBACK_API_BASE = 'https://api.printy.ke/api'

function getDefaultApiBase() {
  return import.meta.dev ? DEV_FALLBACK_API_BASE : PROD_FALLBACK_API_BASE
}

export const DEFAULT_API_BASE = getDefaultApiBase()

export function getApiBase(input?: Record<string, unknown> | string | null) {
  if (typeof input === 'string') {
    return input.trim().replace(/\/$/, '')
  }

  if (input && typeof input === 'object') {
    const value = input.apiBaseUrl || input.apiBase
    if (typeof value === 'string' && value.trim()) {
      return value.trim().replace(/\/$/, '')
    }
  }

  return DEFAULT_API_BASE
}

export function resolveMediaUrl(path?: string | null) {
  if (!path) {
    return ''
  }

  if (/^https?:\/\//i.test(path)) {
    return path
  }

  const config = useRuntimeConfig()
  const origin = getApiBase(config.public).replace(/\/api$/, '')
  return `${origin}${path.startsWith('/') ? path : `/${path}`}`
}
