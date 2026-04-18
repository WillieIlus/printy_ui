import { resolveMediaUrl } from '~/shared/runtime-url'

export function getMediaUrl(path?: string | null, source: string | { apiBaseUrl?: unknown } | { public?: { apiBaseUrl?: unknown } } = '') {
  return resolveMediaUrl(path, source)
}

export function useMediaUrl() {
  const config = useRuntimeConfig()
  return (path?: string | null) => getMediaUrl(path, config.public)
}
