/**
 * Composable for structured SEO metadata (title, description, OG tags).
 * Use on public pages for search and social sharing.
 * Wraps Nuxt's useHead and useSeoMeta.
 */
const SITE_URL = 'https://printy.ke'
const DEFAULT_TITLE = 'Printy - Instant Printing Quotes'
const DEFAULT_DESCRIPTION = 'Get instant printing quotes for business cards, flyers, posters, and more. Browse templates, compare prices, and request quotes from trusted print shops in Kenya.'

export function usePrintySeo(options: {
  title?: string
  description?: string
  image?: string
  path?: string
  noIndex?: boolean
}) {
  const title = options.title ? `${options.title} | Printy` : DEFAULT_TITLE
  const description = options.description ?? DEFAULT_DESCRIPTION
  const path = options.path ?? useRoute().path
  const url = `${SITE_URL}${path.startsWith('/') ? path : `/${path}`}`
  // OG images work best as PNG/JPG; add /og-default.png to public for social previews
  const image = options.image ? (options.image.startsWith('http') ? options.image : `${SITE_URL}${options.image}`) : `${SITE_URL}/og-default.png`

  useHead({
    title,
    meta: [
      { name: 'description', content: description },
      ...(options.noIndex ? [{ name: 'robots', content: 'noindex, nofollow' }] : []),
    ],
  })

  useSeoMeta({
    title,
    description,
    ogTitle: title,
    ogDescription: description,
    ogImage: image,
    ogUrl: url,
    ogType: 'website',
    twitterCard: 'summary_large_image',
    twitterTitle: title,
    twitterDescription: description,
    twitterImage: image,
  })

  return { title, description, url, image }
}
