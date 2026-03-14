/**
 * Sitemap routes from SEO API — used by @nuxtjs/sitemap as a dynamic source.
 * Returns canonical URLs in sitemap format.
 */
interface SeoRoute {
  loc: string
  lastmod: string
}

export default defineEventHandler(async (): Promise<SeoRoute[]> => {
  const config = useRuntimeConfig()
  const apiBase = config.public.apiBase as string

  try {
    const routes = await $fetch<SeoRoute[]>(`${apiBase}/seo/routes/`)
    return routes ?? []
  } catch {
    return [{ loc: '/', lastmod: new Date().toISOString().slice(0, 10) }]
  }
})
