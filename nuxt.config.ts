import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
  compatibilityDate: '2025-05-16',
  devtools: { enabled: true },
  modules: ['@pinia/nuxt'],
  css: ['./app/assets/css/main.css'],
  vite: {
    plugins: [tailwindcss() as never],
  },
  app: {
    head: {
      title: 'Printy',
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'theme-color', content: '#101828' },
      ],
      link: [
        { rel: 'icon', href: '/assets/favicons/favicon.svg', type: 'image/svg+xml' },
      ],
    },
  },
  runtimeConfig: {
    public: {
      apiBaseUrl:
        process.env.NUXT_PUBLIC_API_BASE_URL
        || process.env.NUXT_PUBLIC_API_BASE
        || (process.env.NODE_ENV === 'production' ? 'https://api.printy.ke/api' : 'http://127.0.0.1:8000/api'),
      siteUrl: process.env.NUXT_PUBLIC_SITE_URL || 'https://printy.ke',
    },
  },
  routeRules: {
    '/track-job/**': { prerender: false },
  },
  typescript: {
    strict: true,
    typeCheck: false,
  },
})
