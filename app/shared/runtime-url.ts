export const DEFAULT_API_BASE_URL = 'https://api.printy.ke'
const warnedApiBaseValues = new Set<string>()

type ApiBaseConfigSource =
  | string
  | null
  | undefined
  | { apiBaseUrl?: unknown }
  | { public?: { apiBaseUrl?: unknown } }

function readApiBaseUrl(source?: ApiBaseConfigSource): string {
  if (typeof source === 'string') return source
  if (!source || typeof source !== 'object') return DEFAULT_API_BASE_URL

  if ('public' in source && source.public && typeof source.public === 'object') {
    const nestedValue = source.public.apiBaseUrl
    return typeof nestedValue === 'string' && nestedValue.trim() ? nestedValue : DEFAULT_API_BASE_URL
  }

  if ('apiBaseUrl' in source) {
    const value = source.apiBaseUrl
    return typeof value === 'string' && value.trim() ? value : DEFAULT_API_BASE_URL
  }

  return DEFAULT_API_BASE_URL
}

function warnApiBaseNormalization(rawValue: string) {
  if (!import.meta.dev || warnedApiBaseValues.has(rawValue)) return

  const trimmed = rawValue.trim()
  const warnings: string[] = []

  if (/\/api\/?$/i.test(trimmed)) {
    warnings.push('must not include /api')
  }

  if (/\/+$/.test(trimmed)) {
    warnings.push('must not end with a trailing slash')
  }

  if (!warnings.length) return

  warnedApiBaseValues.add(rawValue)
  console.warn(
    `[printy] NUXT_PUBLIC_API_BASE_URL ${warnings.join(' and ')}. ` +
    `Received "${trimmed}", normalized to "${normalizeServerRoot(trimmed, false)}".`
  )
}

export function normalizeServerRoot(source?: ApiBaseConfigSource, warn = true): string {
  const rawValue = readApiBaseUrl(source).trim()

  if (warn) {
    warnApiBaseNormalization(rawValue)
  }

  try {
    const url = new URL(rawValue)
    let pathname = url.pathname.replace(/\/+$/, '')

    if (pathname === '/api') {
      pathname = ''
    }

    url.pathname = pathname || '/'
    return url.toString().replace(/\/$/, '')
  } catch {
    return rawValue.replace(/\/+$/, '').replace(/\/api$/i, '') || DEFAULT_API_BASE_URL
  }
}

function joinUrl(base: string, path: string): string {
  const normalizedBase = base.replace(/\/+$/, '')
  const normalizedPath = path.replace(/^\/+/, '')
  return `${normalizedBase}/${normalizedPath}`
}

export function getServerRoot(source?: ApiBaseConfigSource): string {
  return normalizeServerRoot(source)
}

export function getApiBase(source?: ApiBaseConfigSource): string {
  return joinUrl(getServerRoot(source), 'api')
}

export function getMediaBase(source?: ApiBaseConfigSource): string {
  return joinUrl(getServerRoot(source), 'media')
}

export function resolveMediaUrl(path?: string | null, source?: ApiBaseConfigSource): string {
  if (!path) return ''
  if (/^(?:https?:)?\/\//i.test(path) || /^(?:data|blob):/i.test(path)) return path
  const normalizedPath = path.replace(/^\/+/, '').replace(/^media\/+/i, '')
  return joinUrl(getMediaBase(source), normalizedPath)
}
