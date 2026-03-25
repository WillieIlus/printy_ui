export function getMediaUrl(path?: string | null, baseUrl = '') {
  if (!path) return ''
  if (path.startsWith('http://') || path.startsWith('https://')) return path

  const normalizedBase = baseUrl.replace(/\/$/, '')
  return `${normalizedBase}${path.startsWith('/') ? path : `/${path}`}`
}

export function useMediaUrl() {
  const config = useRuntimeConfig()
  const baseUrl = config.public.apiBaseUrl?.replace(/\/$/, '') || ''
  return (path?: string | null) => getMediaUrl(path, baseUrl)
}
