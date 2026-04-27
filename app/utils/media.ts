import { resolveMediaUrl } from '~/shared/runtime-url'

export function getMediaUrl(path?: string | null, source: string | { apiBase?: unknown, apiBaseUrl?: unknown } | { public?: { apiBase?: unknown, apiBaseUrl?: unknown } } = '') {
  if (!path) return path ?? null
  return resolveMediaUrl(path, source)
}

export function useMediaUrl() {
  const config = useRuntimeConfig()
  return (path?: string | null) => getMediaUrl(path, config.public)
}
