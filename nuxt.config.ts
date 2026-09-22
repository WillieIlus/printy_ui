import tailwindcss from '@tailwindcss/vite'

const siteUrl = 'https://printy.ke'
const apiUrl = 'https://api.printy.ke'
const defaultApiBase = `${apiUrl}/api`
const previewImage = `${siteUrl}/assets/word-mark/dark/printy-word-mark-03-w1024.png`
const localApiHosts = new Set(['localhost', '127.0.0.1', '0.0.0.0', '::1', '[::1]'])

function normalizeApiBase(value?: string) {
  const fallback = process.env.NODE_ENV === 'production' ? defaultApiBase : 'http://127.0.0.1:8000/api'
  const raw = value?.trim() || fallback
  const trimmed = raw.replace(/\/$/, '')
  const withApi = trimmed.endsWith('/api') ? trimmed : `${trimmed}/api`

  if (process.env.NODE_ENV !== 'production') {
    return withApi
  }

  try {
    const parsed = new URL(withApi)
    return localApiHosts.has(parsed.hostname.toLowerCase()) ? defaultApiBase : withApi
  } catch {
    return defaultApiBase
  }
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
        { name: 'theme-color', content: '#101828' },
        { name: 'color-scheme', content: 'light' },
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
        { property: 'og:image:alt', content: 'Printy wordmark' },
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: 'Printy' },
        {
          name: 'twitter:description',
          content: 'Estimate, quote, pay, and track print jobs through Printy.',
        },
        { name: 'twitter:image', content: previewImage },
      ],
      link: [
        { rel: 'icon', href: '/assets/favicons/favicon.svg', type: 'image/svg+xml' },
        { rel: 'apple-touch-icon', href: '/assets/pwa/dark/apple-touch-icon.png', sizes: '180x180' },
        { rel: 'manifest', href: '/manifest.webmanifest' },
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
                logo: `${siteUrl}/assets/word-mark/dark/printy-word-mark-04.svg`,
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
    '/': { prerender: true },
    '/track': { prerender: false, headers: { 'X-Robots-Tag': 'noindex, nofollow, noarchive' } },
    '/track/**': { prerender: false, headers: { 'X-Robots-Tag': 'noindex, nofollow, noarchive' } },
    '/sign-in': { headers: { 'X-Robots-Tag': 'noindex, nofollow' } },
    '/sign-up': { headers: { 'X-Robots-Tag': 'noindex, nofollow' } },
    '/app/**': { headers: { 'X-Robots-Tag': 'noindex, nofollow' } },
    '/auth/**': { headers: { 'X-Robots-Tag': 'noindex, nofollow' } },
    '/api/**': { headers: { 'X-Robots-Tag': 'noindex, nofollow' } },
  },
  typescript: {
    strict: true,
    typeCheck: false,
  },
})
