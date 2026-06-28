export const DEFAULT_API_BASE = 'https://api.printy.ke/api'

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
