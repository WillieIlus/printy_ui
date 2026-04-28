// Purpose: Runtime URL helpers restored for API and media URL normalization.
export const DEFAULT_API_BASE = 'http://localhost:8000/api'

export type RuntimeLike = string | Record<string, unknown> | null | undefined

function trimTrailingSlash(value: string) {
  return value.replace(/\/+$/, '')
}

function ensureApiSuffix(value: string) {
  const trimmed = trimTrailingSlash(value)
  if (!trimmed) return trimmed
  return /\/api$/i.test(trimmed) ? trimmed : `${trimmed}/api`
}

function apiOriginFromBase(value: string) {
  return trimTrailingSlash(value).replace(/\/api$/i, '')
}

export function getApiBase(config?: RuntimeLike): string {
  if (typeof config === 'string') {
    return ensureApiSuffix(config)
  }

  const obj = (config ?? {}) as Record<string, unknown>
  const value = obj.apiBase
    ?? obj.publicApiBase
    ?? obj.apiBaseUrl
    ?? obj.publicApiBaseUrl
    ?? obj.NUXT_PUBLIC_API_BASE_URL
    ?? obj.NUXT_PUBLIC_API_BASE
    ?? DEFAULT_API_BASE

  return ensureApiSuffix(String(value))
}

export function resolveMediaUrl(path: string, config?: RuntimeLike): string {
  if (!path) return path
  if (/^https?:\/\//i.test(path)) return path

  const base = typeof config === 'string'
    ? apiOriginFromBase(ensureApiSuffix(config))
    : trimTrailingSlash(
        String(
          ((config ?? {}) as Record<string, unknown>).mediaBase
          ?? ((config ?? {}) as Record<string, unknown>).publicMediaBase
          ?? ((config ?? {}) as Record<string, unknown>).NUXT_PUBLIC_MEDIA_BASE
          ?? `${apiOriginFromBase(getApiBase(config))}/media`,
        ),
      )

  return `${base}/${String(path).replace(/^\/+/, '')}`
}
