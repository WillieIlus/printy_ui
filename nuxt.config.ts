import tailwindcss from '@tailwindcss/vite'
import { BRAND_ASSETS, BRAND_ASSET_VERSION, BRAND_COLOURS } from './app/shared/brand'

const siteUrl = 'https://printy.ke'
const apiUrl = 'https://api.printy.ke'
const defaultApiBase = `${apiUrl}/api`
const previewImage = `${siteUrl}${BRAND_ASSETS.socialPreview}`
const brandLogoUrl = `${siteUrl}${BRAND_ASSETS.logo}`
const brandQuery = `v=${BRAND_ASSET_VERSION}`
const localApiHosts = new Set(['localhost', '127.0.0.1', '0.0.0.0', '::1', '[::1]'])
const isDevBuild = process.env.NODE_ENV !== 'production'
const devApiProxyTarget = (process.env.NUXT_PROXY_TARGET || 'http://127.0.0.1:8000').trim().replace(/\/+$/, '')

function normalizeApiBase(value?: string) {
  const raw = value?.trim()

  if (!raw) {
    // In development there is no silent hardcoded localhost URL: without an
    // explicit NUXT_PUBLIC_API_BASE_URL the browser talks to the same-origin
    // Nitro dev proxy (/api/**), which forwards to the Django server. This
    // removes browser CORS from the local development path entirely.
    return isDevBuild ? '/api' : defaultApiBase
  }

  const trimmed = raw.replace(/\/$/, '')
  const withApi = trimmed.endsWith('/api') ? trimmed : `${trimmed}/api`

  if (!isDevBuild) {
    try {
      const parsed = new URL(withApi)
      return localApiHosts.has(parsed.hostname.toLowerCase()) ? defaultApiBase : withApi
    } catch {
      return defaultApiBase
    }
  }

  return withApi
}
export default defineNuxtConfig({
  compatibilityDate: '2025-05-16',
  devtools: { enabled: false },
  modules: ['@pinia/nuxt'],
  css: ['./app/assets/css/main.css'],
  components: [
    { path: '~/components/workbench', pathPrefix: false },
    '~/components',
  ],
  vite: {
    plugins: [tailwindcss() as never],
  },
  app: {
    head: {
      htmlAttrs: { lang: 'en-KE' },
      titleTemplate: (title?: string) => title && title !== 'Printy' ? `${title} | Printy` : 'Printy',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1, viewport-fit=cover' },
        {
          name: 'description',
          content: 'Printy helps Kenyan print buyers estimate jobs, review quotes, pay, and track production in one workflow.',
        },
        { name: 'robots', content: 'index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1' },
        { name: 'theme-color', content: BRAND_COLOURS.theme },
        { name: 'color-scheme', content: 'light' },
        { name: 'application-name', content: 'Printy' },
        { name: 'apple-mobile-web-app-title', content: 'Printy' },
        { name: 'apple-mobile-web-app-capable', content: 'yes' },
        { name: 'mobile-web-app-capable', content: 'yes' },
        { name: 'apple-mobile-web-app-status-bar-style', content: 'black-translucent' },
        { property: 'og:site_name', content: 'Printy' },
        { property: 'og:type', content: 'website' },
        { property: 'og:locale', content: 'en_KE' },
        { property: 'og:title', content: 'Printy' },
        {
          property: 'og:description',
          content: 'Estimate, quote, pay, and track print jobs through Printy.',
        },
        { property: 'og:url', content: `${siteUrl}/` },
        { property: 'og:image', content: previewImage },
        { property: 'og:image:alt', content: 'Printy' },
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: 'Printy' },
        {
          name: 'twitter:description',
          content: 'Estimate, quote, pay, and track print jobs through Printy.',
        },
        { name: 'twitter:image', content: previewImage },
      ],
      link: [
        // Official Printy favicon set: SVG first, PNG fallbacks, then the ICO
        // that browsers and Windows shortcuts request by name.
        { rel: 'icon', href: `/favicon.svg?${brandQuery}`, type: 'image/svg+xml' },
        { rel: 'icon', href: `/favicon/favicon-32.png?${brandQuery}`, type: 'image/png', sizes: '32x32' },
        { rel: 'icon', href: `/favicon/favicon-16.png?${brandQuery}`, type: 'image/png', sizes: '16x16' },
        { rel: 'icon', href: `/favicon/favicon-48.png?${brandQuery}`, type: 'image/png', sizes: '48x48' },
        { rel: 'icon', href: `/favicon.ico?${brandQuery}`, sizes: 'any' },
        { rel: 'mask-icon', href: `/favicon.svg?${brandQuery}`, color: BRAND_COLOURS.orange },
        { rel: 'apple-touch-icon', href: `/icons/apple-touch-icon-180.png?${brandQuery}`, sizes: '180x180' },
        { rel: 'apple-touch-icon', href: `/icons/apple-touch-icon-167.png?${brandQuery}`, sizes: '167x167' },
        { rel: 'apple-touch-icon', href: `/icons/apple-touch-icon-152.png?${brandQuery}`, sizes: '152x152' },
        { rel: 'manifest', href: `/manifest.webmanifest?${brandQuery}` },
        { rel: 'canonical', href: `${siteUrl}/` },
        { rel: 'preconnect', href: apiUrl },
        { rel: 'dns-prefetch', href: apiUrl },
      ],
      script: [
        {
          type: 'application/ld+json',
          innerHTML: JSON.stringify({
            '@context': 'https://schema.org',
            '@graph': [
              {
                '@type': 'Organization',
                '@id': `${siteUrl}/#organization`,
                name: 'Printy',
                url: `${siteUrl}/`,
                logo: brandLogoUrl,
                email: 'support@printy.ke',
                address: {
                  '@type': 'PostalAddress',
                  addressCountry: 'KE',
                  addressLocality: 'Nairobi',
                },
              },
              {
                '@type': 'WebSite',
                '@id': `${siteUrl}/#website`,
                url: `${siteUrl}/`,
                name: 'Printy',
                publisher: { '@id': `${siteUrl}/#organization` },
                inLanguage: 'en-KE',
              },
              {
                '@type': 'WebApplication',
                name: 'Printy',
                applicationCategory: 'BusinessApplication',
                operatingSystem: 'Web',
                url: `${siteUrl}/`,
              },
            ],
          }),
        },
      ],
    },
  },
  runtimeConfig: {
    public: {
      apiBaseUrl:
        normalizeApiBase(
          process.env.NUXT_PUBLIC_API_BASE_URL
          || process.env.NUXT_PUBLIC_API_BASE
          || process.env.NEXT_PUBLIC_API_URL
          || process.env.VITE_API_URL
        ),
      siteUrl: process.env.NUXT_PUBLIC_SITE_URL || 'https://printy.ke',
    },
  },
  routeRules: {
    // Official brand art is addressed with a ?v= query string, so the files
    // themselves can be cached hard. A new logo ships under a new version and
    // returning visitors never keep a stale mark.
    '/branding/**': { headers: { 'cache-control': 'public, max-age=31536000, immutable' } },
    '/favicon/**': { headers: { 'cache-control': 'public, max-age=31536000, immutable' } },
    '/icons/**': { headers: { 'cache-control': 'public, max-age=31536000, immutable' } },
    '/favicon.ico': { headers: { 'cache-control': 'public, max-age=604800' } },
    '/favicon.svg': { headers: { 'cache-control': 'public, max-age=604800' } },
    // The manifest is re-fetched by installed apps; keep it short-lived so a
    // rebrand reaches installed PWAs instead of a year-long cached copy.
    '/manifest.webmanifest': { headers: { 'cache-control': 'public, max-age=300, must-revalidate' } },
    '/': { prerender: true },
    '/track': { prerender: false, headers: { 'X-Robots-Tag': 'noindex, nofollow, noarchive' } },
    '/track/**': { prerender: false, headers: { 'X-Robots-Tag': 'noindex, nofollow, noarchive' } },
    '/sign-in': { headers: { 'X-Robots-Tag': 'noindex, nofollow' } },
    '/sign-up': { headers: { 'X-Robots-Tag': 'noindex, nofollow' } },
    '/app/**': { headers: { 'X-Robots-Tag': 'noindex, nofollow' } },
    '/auth/**': { headers: { 'X-Robots-Tag': 'noindex, nofollow' } },
    // Development only: same-origin proxy to Django so local requests never
    // cross browser origins (no CORS) and never fall back to a hardcoded
    // localhost URL. Production talks directly to https://api.printy.ke.
    '/api/**': isDevBuild
      ? {
          headers: { 'X-Robots-Tag': 'noindex, nofollow' },
          proxy: { to: `${devApiProxyTarget}/api/**` },
        }
      : { headers: { 'X-Robots-Tag': 'noindex, nofollow' } },
    ...(isDevBuild
      ? { '/media/**': { proxy: { to: `${devApiProxyTarget}/media/**` } } }
      : {}),
  },
  typescript: {
    strict: true,
    typeCheck: false,
  },
})
