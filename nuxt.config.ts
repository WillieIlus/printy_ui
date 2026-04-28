export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },

  future: {
    compatibilityVersion: 4,
  },

  modules: [
    '@nuxt/ui',
    '@nuxt/icon',
    '@nuxt/image',
    '@pinia/nuxt',
    '@pinia-plugin-persistedstate/nuxt',
    '@vee-validate/nuxt',
    '@nuxtjs/seo',
    '@nuxt/eslint',
  ],

  site: {
    url: process.env.NUXT_PUBLIC_SITE_URL || 'https://printy.ke',
    name: 'Printy',
    // Set NUXT_SITE_ENV=production in your deploy env to allow indexing; defaults to development to be safe
    env: process.env.NUXT_SITE_ENV || 'development',
    defaultLocale: 'en',
  },

  sitemap: {
    sources: ['/api/sitemap-routes'],
  },

  robots: {
    disallow: ['/api/', '/dashboard/', '/auth/'],
    sitemap: '/sitemap.xml',
  },

  ui: {
    fonts: false,
  },

  css: ['~/assets/css/main.css'],

  runtimeConfig: {
    public: {
      // Single source of truth for frontend API requests. Include /api and omit a trailing slash.
      apiBase: process.env.NUXT_PUBLIC_API_BASE || process.env.NUXT_PUBLIC_API_BASE_URL || 'https://api.printy.ke',
      apiBaseUrl: process.env.NUXT_PUBLIC_API_BASE_URL || process.env.NUXT_PUBLIC_API_BASE || 'https://printy.ke',
      siteUrl: process.env.NUXT_PUBLIC_SITE_URL || 'https://api.printy.ke',
      googleMapsApiKey: process.env.NUXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
    },
  },

  pinia: {
    storesDirs: ['./app/stores/**'],
  },

  veeValidate: {
    autoImports: true,
    componentNames: {
      Form: 'VeeForm',
      Field: 'VeeField',
      FieldArray: 'VeeFieldArray',
      ErrorMessage: 'VeeErrorMessage',
    },
  },

  image: {
    domains: ['printy.ke', 'api.printy.ke'],
  },

  icon: {
    provider: 'none',
    fallbackToApi: false,
    clientBundle: {
      scan: {
        globInclude: [
          'app/**/*.{vue,js,ts}',
          'node_modules/@nuxt/ui/dist/**/*.{js,mjs,ts,vue}',
        ],
        globExclude: ['node_modules/**', '.nuxt/**', 'dist/**'],
      },
    },
  },

  typescript: {
    strict: true,
    typeCheck: false,
  },

  colorMode: {
    preference: 'system',
    fallback: 'light',
    classSuffix: '',
    storageKey: 'printy-color-mode',
    storage: 'localStorage',
  },

  // Force unhead to be bundled (fixes ERR_MODULE_NOT_FOUND on Netlify serverless)
  nitro: {
    externals: {
      inline: ['unhead', '@unhead/vue', '@unhead/addons', '@unhead/schema-org'],
    },
    prerender: {
      // Don't fail the entire build if a single prerendered route throws.
      // Public pages handle their own API errors gracefully; "/" must not 500
      // the whole generate step when the backend is unreachable at build time.
      failOnError: false,
    },
  },

  // CSR only for private app; public pages use SSR for SEO
  routeRules: {
    '/auth/**': { ssr: false },
    '/dashboard/**': { ssr: false },
    '/onboarding/**': { ssr: false },
    '/account/**': { ssr: false },
    '/quote-draft': { ssr: false },
    '/products/gallery': { redirect: '/gallery' },
  },

  app: {
    pageTransition: { name: 'page', mode: 'out-in' },
    layoutTransition: { name: 'layout', mode: 'out-in' },
    head: {
      title: 'Printy - Instant Printing Quotes',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1, viewport-fit=cover' },
        { name: 'description', content: 'Get instant printing quotes for business cards, flyers, posters, and more. Browse templates and request quotes from trusted print shops in Kenya.' },
        { property: 'og:type', content: 'website' },
        { property: 'og:site_name', content: 'Printy' },
        { property: 'og:image', content: 'https://printy.ke/og-default.png' },
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:site', content: '@printy_ke' },
      ],
      link: [
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800;900&display=swap',
        },
        { rel: 'icon', type: 'image/svg+xml', href: '/assets/favicons/favicon.svg' },
      ],
      htmlAttrs: {
        lang: 'en',
        class: 'scroll-smooth',
      },
    },
  },
})
