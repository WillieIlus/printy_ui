// nuxt.config.ts  — drop these blocks inside `defineNuxtConfig({ ... })`
// Covers: <html lang>, default meta, OG/Twitter, canonical, manifest,
// preconnect, theme-color, and per-route overrides via useSeoMeta().

export default {
  // 1) Make every prerendered page render with <html lang="en">
  app: {
    head: {
      htmlAttrs: { lang: 'en', 'data-theme': 'light' },
      titleTemplate: (title?: string) =>
        title && title !== 'Printy'
          ? `${title} | Printy`
          : 'Printy — Instant Print Prices. Tracked Jobs. Trusted Production.',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1, viewport-fit=cover' },

        // Primary SEO
        {
          name: 'description',
          content:
            "Kenya's print operating system. Get a real KES price in seconds, approve the quote, pay through Printy, and track your job from prepress to delivery.",
        },
        { name: 'keywords', content: 'printing Kenya, business cards Nairobi, print quote Kenya, flyers Nairobi, online printing Kenya, print management' },
        { name: 'author', content: 'Printy' },
        { name: 'robots', content: 'index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1' },
        { name: 'theme-color', content: '#101828', media: '(prefers-color-scheme: dark)'  },
        { name: 'theme-color', content: '#ffffff', media: '(prefers-color-scheme: light)' },
        { name: 'color-scheme', content: 'light dark' },
        { name: 'format-detection', content: 'telephone=no' },

        // Geo (helps local SEO signals)
        { name: 'geo.region',     content: 'KE-30' },     // Nairobi
        { name: 'geo.placename',  content: 'Nairobi' },
        { name: 'geo.position',   content: '-1.2921;36.8219' },
        { name: 'ICBM',           content: '-1.2921, 36.8219' },

        // Open Graph
        { property: 'og:site_name',   content: 'Printy' },
        { property: 'og:type',        content: 'website' },
        { property: 'og:locale',      content: 'en_KE' },
        { property: 'og:title',       content: 'Printy — Instant Print Prices. Tracked Jobs. Trusted Production.' },
        { property: 'og:description', content: 'Real KES print prices before you call a printer. Approve a quote, pay through Printy, track every stage of the job.' },
        { property: 'og:url',         content: 'https://printy.ke/' },
        { property: 'og:image',       content: 'https://printy.ke/assets/og/printy-og-default.jpg' },
        { property: 'og:image:secure_url', content: 'https://printy.ke/assets/og/printy-og-default.jpg' },
        { property: 'og:image:type',  content: 'image/jpeg' },
        { property: 'og:image:width', content: '1200' },
        { property: 'og:image:height',content: '630' },
        { property: 'og:image:alt',   content: 'Printy — get a real print price in KES before you call a printer.' },

        // Twitter / X
        { name: 'twitter:card',        content: 'summary_large_image' },
        { name: 'twitter:site',        content: '@printy_ke' },
        { name: 'twitter:creator',     content: '@printy_ke' },
        { name: 'twitter:title',       content: 'Printy — Instant Print Prices. Tracked Jobs. Trusted Production.' },
        { name: 'twitter:description', content: 'Real KES print prices before you call a printer. Approve, pay, track — all on Printy.' },
        { name: 'twitter:image',       content: 'https://printy.ke/assets/og/printy-og-default.jpg' },
        { name: 'twitter:image:alt',   content: 'Printy — Kenya\'s print operating system.' },

        // PWA / mobile
        { name: 'apple-mobile-web-app-capable',          content: 'yes' },
        { name: 'apple-mobile-web-app-status-bar-style', content: 'black-translucent' },
        { name: 'apple-mobile-web-app-title',            content: 'Printy' },
      ],

      link: [
        { rel: 'canonical',       href: 'https://printy.ke/' },
        { rel: 'icon',            href: '/assets/favicons/favicon.svg', type: 'image/svg+xml' },
        { rel: 'icon',            href: '/assets/favicons/favicon-32.png', sizes: '32x32', type: 'image/png' },
        { rel: 'apple-touch-icon',href: '/assets/favicons/apple-touch-icon.png', sizes: '180x180' },
        { rel: 'mask-icon',       href: '/assets/favicons/safari-pinned-tab.svg', color: '#e13515' },
        { rel: 'manifest',        href: '/manifest.webmanifest' },
        // Trim first-paint round-trips to the API + fonts
        { rel: 'preconnect', href: 'https://api.printy.ke', crossorigin: '' },
        { rel: 'dns-prefetch', href: 'https://api.printy.ke' },
      ],

      script: [
        // Organization + WebSite + SearchAction structured data
        {
          type: 'application/ld+json',
          innerHTML: JSON.stringify({
            '@context': 'https://schema.org',
            '@graph': [
              {
                '@type': 'Organization',
                '@id': 'https://printy.ke/#org',
                name: 'Printy',
                url: 'https://printy.ke/',
                logo: 'https://printy.ke/assets/word-mark/dark/printy-word-mark-03.svg',
                sameAs: [
                  'https://x.com/printy_ke',
                  'https://www.linkedin.com/company/printy-ke',
                  'https://www.instagram.com/printy.ke',
                ],
                contactPoint: [{
                  '@type': 'ContactPoint',
                  contactType: 'customer support',
                  email: 'support@printy.ke',
                  telephone: '+254-700-000000',
                  areaServed: 'KE',
                  availableLanguage: ['en', 'sw'],
                }],
                address: {
                  '@type': 'PostalAddress',
                  addressCountry: 'KE',
                  addressLocality: 'Nairobi',
                },
              },
              {
                '@type': 'WebSite',
                '@id': 'https://printy.ke/#website',
                url: 'https://printy.ke/',
                name: 'Printy',
                publisher: { '@id': 'https://printy.ke/#org' },
                inLanguage: 'en-KE',
                potentialAction: {
                  '@type': 'SearchAction',
                  target: 'https://printy.ke/?q={search_term_string}',
                  'query-input': 'required name=search_term_string',
                },
              },
              {
                '@type': 'WebApplication',
                name: 'Printy',
                applicationCategory: 'BusinessApplication',
                operatingSystem: 'Web',
                url: 'https://printy.ke/',
                offers: { '@type': 'Offer', priceCurrency: 'KES', price: '0' },
              },
            ],
          }),
        },
      ],
    },
  },

  // 2) Per-route SSR rules: keep auth / dashboards out of the index.
  routeRules: {
    '/':                  { prerender: true },
    '/track-job':         { prerender: true },
    '/for/**':            { prerender: true },
    '/products/**':       { prerender: true },
    '/legal/**':          { prerender: true },
    '/faq':               { prerender: true },
    '/about':             { prerender: true },
    '/contact':           { prerender: true },

    '/auth/**':           { robots: 'noindex,nofollow', headers: { 'X-Robots-Tag': 'noindex, nofollow' } },
    '/dashboard/**':      { robots: 'noindex,nofollow', headers: { 'X-Robots-Tag': 'noindex, nofollow' } },
    '/partner/**':        { robots: 'noindex,nofollow', headers: { 'X-Robots-Tag': 'noindex, nofollow' } },
    '/production/**':     { robots: 'noindex,nofollow', headers: { 'X-Robots-Tag': 'noindex, nofollow' } },
    '/admin/**':          { robots: 'noindex,nofollow', headers: { 'X-Robots-Tag': 'noindex, nofollow' } },
  },
}

/* ─────────────────────────────────────────────────────────────
 *  Per-page override example — drop inside any pages/*.vue
 * ─────────────────────────────────────────────────────────────
 *
 *  <script setup lang="ts">
 *  useSeoMeta({
 *    title: 'Business card printing in Nairobi',
 *    description:
 *      'Get a real KES price for business cards in Nairobi in seconds — '
 *      + 'standard or Euro card, matt or gloss, single or double sided.',
 *    ogImage: 'https://printy.ke/assets/og/business-cards.jpg',
 *    ogUrl:   'https://printy.ke/products/business-cards',
 *    twitterImage: 'https://printy.ke/assets/og/business-cards.jpg',
 *  })
 *  useHead({ link: [{ rel: 'canonical', href: 'https://printy.ke/products/business-cards' }] })
 *  </script>
 */
