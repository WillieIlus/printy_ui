export function getMediaUrl(path?: string | null) {
  if (!path) return ''
  if (path.startsWith('http://') || path.startsWith('https://')) return path

  const config = useRuntimeConfig()
  const base = config.public.apiBaseUrl?.replace(/\/$/, '') || ''
  return `${base}${path.startsWith('/') ? path : `/${path}`}`
}