/**
 * Sitemap routes from SEO API — used by @nuxtjs/sitemap as a dynamic source.
 * Returns canonical URLs in sitemap format.
 */
import { getApiBase } from '~/shared/runtime-url'

interface SeoRoute {
  loc: string
  lastmod: string
}

export default defineEventHandler(async (): Promise<SeoRoute[]> => {
  const config = useRuntimeConfig()
  const apiBase = getApiBase(config.public)
  const fallbackRoutes: SeoRoute[] = [
    { loc: '/', lastmod: new Date().toISOString().slice(0, 10) },
    { loc: '/for-shops', lastmod: new Date().toISOString().slice(0, 10) },
    { loc: '/products', lastmod: new Date().toISOString().slice(0, 10) },
    { loc: '/shops', lastmod: new Date().toISOString().slice(0, 10) },
  ]

  try {
    const routes = await $fetch<SeoRoute[]>(`${apiBase}/seo/routes/`)
    if (!routes?.length) return fallbackRoutes
    return routes
  } catch {
    return fallbackRoutes
  }
})
