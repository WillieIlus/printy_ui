/**
 * Global SEO plugin — injects WebSite and Organization JSON-LD on every page.
 * Runs server-side for SSR and crawler visibility.
 */
export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig()
  const siteUrl = (config.public.siteUrl as string) || 'https://printy.ke'

  const webSiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Printy',
    url: siteUrl,
    description: 'Get instant printing quotes for business cards, flyers, posters, and more. Browse templates and request quotes from trusted print shops in Kenya.',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${siteUrl}/gallery?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  }

  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Printy',
    url: siteUrl,
    logo: `${siteUrl}/printy-brand-assets-ready/logo-mark/light/printy-logo-mark-01.svg`,
    description: 'Printy connects buyers with print shops across Kenya. Get instant quotes for business cards, flyers, posters, and more.',
    sameAs: [],
  }

  useHead({
    script: [
      { type: 'application/ld+json', innerHTML: JSON.stringify(webSiteSchema) },
      { type: 'application/ld+json', innerHTML: JSON.stringify(organizationSchema) },
    ],
  })
})
