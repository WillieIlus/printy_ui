export const DEFAULT_API_BASE = 'https://api.printy.ke/api'

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
