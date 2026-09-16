export const DEFAULT_API_BASE = 'https://api.printy.ke/api'

const LOCAL_API_HOSTS = new Set(['localhost', '127.0.0.1', '0.0.0.0', '::1', '[::1]'])

export function getApiBase(input?: Record<string, unknown> | string | null) {
  const normalize = (value: string) => {
    const trimmed = value.trim().replace(/\/$/, '')
    return trimmed.endsWith('/api') ? trimmed : `${trimmed}/api`
  }

  if (typeof input === 'string') {
    return normalize(input)
  }

  if (input && typeof input === 'object') {
    const value = input.apiBaseUrl || input.apiBase
    if (typeof value === 'string' && value.trim()) {
      return normalize(value)
    }
  }

  return DEFAULT_API_BASE
}

export function ensureValidApiBase(apiBase: string) {
  if (!apiBase.startsWith('http://') && !apiBase.startsWith('https://')) {
    return DEFAULT_API_BASE
  }

  try {
    const parsed = new URL(apiBase)
    if (!import.meta.dev && LOCAL_API_HOSTS.has(parsed.hostname.toLowerCase())) {
      return DEFAULT_API_BASE
    }
  } catch {
    return DEFAULT_API_BASE
  }

  return apiBase
}

export function getSafeApiBase(input?: Record<string, unknown> | string | null) {
  return ensureValidApiBase(getApiBase(input))
}

export function resolveMediaUrl(path?: string | null) {
  if (!path) {
    return ''
  }

  if (/^https?:\/\//i.test(path)) {
    return path
  }

  const config = useRuntimeConfig()
  const origin = getSafeApiBase(config.public).replace(/\/api$/, '')
  return `${origin}${path.startsWith('/') ? path : `/${path}`}`
}
