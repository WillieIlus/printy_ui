<template>
  <div class="min-h-screen bg-[var(--p-bg)]">
    <div class="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 sm:py-16">
      <nav class="mb-8 flex flex-wrap items-center gap-2 text-sm text-[var(--p-text-muted)]">
        <NuxtLink to="/" class="hover:text-[var(--p-text)]">Home</NuxtLink>
        <UIcon name="i-lucide-chevron-right" class="h-4 w-4 shrink-0" />
        <NuxtLink to="/shops" class="hover:text-[var(--p-text)]">Shops</NuxtLink>
        <UIcon name="i-lucide-chevron-right" class="h-4 w-4 shrink-0" />
        <span class="text-[var(--p-text)]">{{ location?.name }}</span>
      </nav>

      <CommonLoadingSpinner v-if="loading" />

      <CommonEmptyState
        v-else-if="!location"
        title="Location not found"
        description="This location does not exist or is no longer active."
        icon="i-lucide-map-pin"
      >
        <NuxtLink to="/shops" class="btn-primary mt-4 inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-bold">
          Browse all shops
          <UIcon name="i-lucide-arrow-right" class="h-4 w-4" />
        </NuxtLink>
      </CommonEmptyState>

      <template v-else>
        <header class="max-w-4xl">
          <h1 class="text-3xl font-bold text-[var(--p-text)] sm:text-5xl">
            Print shops in {{ location.name }}
          </h1>
          <p class="mt-4 text-lg leading-8 text-[var(--p-text-muted)]">
            {{ locationSummary }}
          </p>
        </header>

        <section class="mt-12 grid gap-8 xl:grid-cols-[minmax(0,1.08fr)_25rem]">
          <div class="space-y-8">
            <div
              v-if="featuredShop"
              class="overflow-hidden rounded-[2rem] border border-[var(--p-border)] bg-[var(--p-surface)] shadow-[0_20px_45px_rgba(16,24,40,0.08)]"
            >
              <div class="border-b border-[var(--p-border)] bg-[linear-gradient(135deg,rgba(240,82,36,0.12),rgba(243,246,252,0.1))] p-6 sm:p-8">
                <div class="flex flex-wrap items-center gap-3">
                  <span class="inline-flex items-center gap-1.5 rounded-full bg-flamingo-500 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.12em] text-white">
                    <UIcon name="i-lucide-badge-check" class="h-3.5 w-3.5" />
                    Top rated region
                  </span>
                  <span class="text-sm font-medium text-[var(--p-text-muted)]">{{ featuredShopTagline }}</span>
                </div>
              </div>

              <div class="p-6 sm:p-8">
                <div class="flex items-start gap-4">
                  <div class="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-mirage-950 text-xl font-bold text-white">
                    {{ featuredShopInitials }}
                  </div>
                  <div class="min-w-0 flex-1">
                    <h2 class="text-2xl font-bold text-[var(--p-text)]">{{ featuredShop.name }}</h2>
                    <div class="mt-3 flex flex-wrap items-center gap-3">
                      <div class="flex items-center gap-1 text-amber-500">
                        <UIcon
                          v-for="star in featuredStarIcons"
                          :key="`${featuredShop.slug}-${star}`"
                          :name="star"
                          class="h-4 w-4"
                        />
                      </div>
                      <span class="text-sm font-semibold text-[var(--p-text)]">{{ featuredRatingLabel }}</span>
                    </div>
                  </div>
                </div>

                <div class="mt-6 flex flex-wrap gap-2">
                  <span
                    v-for="service in featuredServices"
                    :key="service"
                    class="rounded-full bg-[var(--p-surface-sunken)] px-3 py-1 text-[11px] font-bold uppercase tracking-[0.12em] text-flamingo-500"
                  >
                    {{ service }}
                  </span>
                </div>

                <p class="mt-6 text-base leading-7 text-[var(--p-text-muted)]">
                  {{ featuredDescription }}
                </p>

                <div class="mt-8 flex flex-wrap gap-3">
                  <NuxtLink
                    :to="`/shops/${featuredShop.slug}`"
                    class="inline-flex items-center gap-2 rounded-xl bg-flamingo-500 px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-flamingo-400"
                  >
                    View catalog & get quote
                    <UIcon name="i-lucide-arrow-right" class="h-4 w-4" />
                  </NuxtLink>
                  <NuxtLink
                    :to="`/shops/${featuredShop.slug}/request-quote`"
                    class="inline-flex items-center gap-2 rounded-xl border border-[var(--p-border)] bg-[var(--p-surface)] px-5 py-3 text-sm font-semibold text-[var(--p-text)] transition-colors hover:bg-[var(--p-surface-sunken)]"
                  >
                    Message Shop
                  </NuxtLink>
                </div>
              </div>
            </div>

            <section v-if="productsInLocation.length">
              <h2 class="text-2xl font-semibold text-[var(--p-text)]">Popular products in {{ location.name }}</h2>
              <div class="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                <NuxtLink
                  v-for="product in productCards"
                  :key="product.slug"
                  :to="`/locations/${slug}/products/${product.slug}`"
                  class="group rounded-[1.6rem] border border-[var(--p-border)] bg-[var(--p-surface)] p-5 transition-all hover:-translate-y-1 hover:border-flamingo-200 hover:shadow-[0_18px_40px_rgba(16,24,40,0.08)]"
                >
                  <div class="flex h-12 w-12 items-center justify-center rounded-2xl bg-flamingo-500/12">
                    <UIcon :name="product.icon" class="h-6 w-6 text-flamingo-500" />
                  </div>
                  <h3 class="mt-4 text-lg font-bold text-[var(--p-text)]">{{ product.name }}</h3>
                  <p class="mt-2 text-sm leading-6 text-[var(--p-text-muted)]">{{ product.detail }}</p>
                  <div class="mt-5 flex items-center justify-between border-t border-[var(--p-border)] pt-4">
                    <span class="text-sm font-semibold text-flamingo-500">{{ product.priceLine }}</span>
                    <UIcon name="i-lucide-chevron-right" class="h-5 w-5 text-[var(--p-text-muted)] transition-transform group-hover:translate-x-0.5 group-hover:text-flamingo-500" />
                  </div>
                </NuxtLink>
              </div>
            </section>

            <section v-if="nearbyLocations.length">
              <h2 class="text-2xl font-semibold text-[var(--p-text)]">Other locations</h2>
              <div class="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                <NuxtLink
                  v-for="loc in nearbyLocationCards"
                  :key="loc.slug"
                  :to="`/locations/${loc.slug}`"
                  class="flex items-center justify-between rounded-2xl border border-[var(--p-border)] bg-[var(--p-surface)] px-4 py-3 text-sm font-medium text-[var(--p-text)] transition-all hover:border-flamingo-200 hover:bg-[var(--p-surface-sunken)]"
                >
                  <span class="flex items-center gap-2">
                    <UIcon name="i-lucide-map-pin" class="h-4 w-4 text-flamingo-500" />
                    {{ loc.name }}
                  </span>
                  <UIcon name="i-lucide-arrow-up-right" class="h-4 w-4 text-[var(--p-text-muted)]" />
                </NuxtLink>
              </div>
            </section>

            <section class="overflow-hidden rounded-[2rem] border border-mirage-800/60 bg-mirage-950 text-white shadow-[0_24px_60px_rgba(16,24,40,0.22)]">
              <div class="relative p-6 sm:p-8">
                <div class="absolute -right-10 -top-10 h-36 w-36 rounded-full bg-flamingo-500/18 blur-3xl" />
                <p class="text-[11px] font-semibold uppercase tracking-[0.18em] text-flamingo-400">Pro feature</p>
                <h2 class="mt-4 text-2xl font-bold">Are you a shop owner?</h2>
                <p class="mt-3 max-w-2xl text-sm leading-7 text-slate-300">
                  Join the Precision Press network and reach thousands of customers in {{ location.name }}.
                </p>
                <NuxtLink
                  to="/auth/signup"
                  class="mt-6 inline-flex items-center gap-2 rounded-xl bg-flamingo-500 px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-flamingo-400"
                >
                  Register your shop
                </NuxtLink>
              </div>
            </section>
          </div>

          <aside class="space-y-6 xl:sticky xl:top-24 xl:self-start">
            <section class="overflow-hidden rounded-[2rem] border border-[var(--p-border)] bg-[var(--p-surface)] shadow-[0_20px_45px_rgba(16,24,40,0.08)]">
              <div class="border-b border-[var(--p-border)] p-6">
                <h2 class="text-2xl font-semibold text-[var(--p-text)]">Map of {{ location.name }}</h2>
                <div class="mt-4 flex items-center gap-3 text-sm text-[var(--p-text-muted)]">
                  <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-flamingo-500/12">
                    <UIcon name="i-lucide-map-pinned" class="h-5 w-5 text-flamingo-500" />
                  </div>
                  <div>
                    <p class="font-semibold text-[var(--p-text)]">{{ locationMapLabel }}</p>
                    <p>{{ location.shops?.length ?? 0 }} Print Shop{{ (location.shops?.length ?? 0) === 1 ? '' : 's' }} nearby</p>
                  </div>
                </div>
              </div>
              <div class="p-4">
                <div class="overflow-hidden rounded-[1.5rem] border border-[var(--p-border)] bg-mirage-950">
                  <iframe
                    :src="locationMapEmbedUrl"
                    title="Google map of location"
                    class="h-[22rem] w-full border-0"
                    loading="lazy"
                    referrerpolicy="no-referrer-when-downgrade"
                    allowfullscreen
                  />
                </div>
              </div>
            </section>

            <section class="overflow-hidden rounded-[2rem] border border-[var(--p-border)] bg-[var(--p-surface)] p-6 shadow-[0_20px_45px_rgba(16,24,40,0.08)]">
              <h2 class="text-xl font-semibold text-[var(--p-text)]">Print shops in {{ location.name }}</h2>
              <p class="mt-1 text-sm text-[var(--p-text-muted)]">
                {{ location.shops?.length ?? 0 }} shop{{ (location.shops?.length ?? 0) === 1 ? '' : 's' }} available
              </p>
              <div v-if="location.shops?.length" class="mt-6 space-y-3">
                <NuxtLink
                  v-for="shop in location.shops"
                  :key="shop.slug"
                  :to="`/shops/${shop.slug}`"
                  class="flex items-center gap-3 rounded-2xl border border-[var(--p-border)] bg-[var(--p-surface-sunken)] px-4 py-3 text-sm transition hover:border-flamingo-200"
                >
                  <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-flamingo-500/12 text-sm font-bold text-flamingo-500">
                    {{ initials(shop.name) }}
                  </div>
                  <div class="min-w-0 flex-1">
                    <p class="truncate font-semibold text-[var(--p-text)]">{{ shop.name }}</p>
                    <p class="truncate text-xs text-[var(--p-text-muted)]">View catalog & get quote</p>
                  </div>
                  <UIcon name="i-lucide-arrow-right" class="h-4 w-4 text-[var(--p-text-muted)]" />
                </NuxtLink>
              </div>
            </section>
          </aside>
        </section>

        <section class="mt-16">
          <LocationsLocationFaq
            :location-name="location.name"
            :shop-count="location.shops?.length ?? 0"
          />
        </section>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { fetchSEOLocationDetail, fetchSEOLocationProducts, fetchSEOLocations } from '~/services/seo'
import { getRatingSummary, type RatingSummary } from '~/services/ratings'
import type { SEOLocationDetail, SEOLocation } from '~/services/seo'

definePageMeta({ layout: 'default' })

type ProductCard = {
  slug: string
  name: string
  icon: string
  detail: string
  priceLine: string
}

const route = useRoute()
const slug = computed(() => route.params.slug as string)

const location = ref<SEOLocationDetail | null>(null)
const productsInLocation = ref<{ slug: string; name: string }[]>([])
const nearbyLocations = ref<SEOLocation[]>([])
const ratingSummaries = ref<Record<string, RatingSummary | null>>({})
const loading = ref(true)

const locationMeta: Record<string, { hub: string; shopTagline: string }> = {
  westlands: { hub: 'Central Westlands Hub', shopTagline: 'Modern printing facility' },
  nairobi: { hub: 'Capital Region Hub', shopTagline: 'High-volume production cluster' },
  mombasa: { hub: 'Coastal Logistics', shopTagline: 'Fast-moving hospitality print network' },
  kisumu: { hub: 'Lakeside Trade Hub', shopTagline: 'Regional retail and education demand' },
  cbd: { hub: 'Central Business District', shopTagline: 'Express business print corridor' },
  kilimani: { hub: 'Creative Studio Cluster', shopTagline: 'Short-run design and event production' },
  'industrial-area': { hub: 'Industrial Production Zone', shopTagline: 'Large-format and packaging capacity' },
}

const featuredShop = computed(() => location.value?.shops?.[0] ?? null)

const featuredShopInitials = computed(() => initials(featuredShop.value?.name))

const featuredShopTagline = computed(() => {
  return locationMeta[slug.value]?.shopTagline ?? 'Trusted local print partner'
})

const featuredRating = computed(() => {
  if (!featuredShop.value) return null
  return ratingSummaries.value[featuredShop.value.slug] ?? null
})

const featuredRatingLabel = computed(() => {
  if (!featuredRating.value?.count) return 'Top rated local shop'
  return `${featuredRating.value.average.toFixed(1)} (${featuredRating.value.count} reviews)`
})

const featuredStarIcons = computed(() => {
  const average = featuredRating.value?.average ?? 4.5
  return Array.from({ length: 5 }, (_, index) => {
    const starNumber = index + 1
    if (average >= starNumber) return 'i-lucide-star'
    if (average >= starNumber - 0.5) return 'i-lucide-star-half'
    return 'i-lucide-star'
  })
})

const featuredServices = computed(() => {
  const services = productsInLocation.value
    .slice(0, 3)
    .map((product) => product.name.toUpperCase())
  if (!services.length) return ['BUSINESS CARDS', 'LARGE FORMAT', 'LAMINATING']
  return services
})

const featuredDescription = computed(() => {
  const place = location.value?.name ?? 'this area'
  return `Specializing in high-precision offset and digital printing. Known for rapid turnaround times in ${place} and strong coverage across business stationery, display work, and premium finishing.`
})

const locationSummary = computed(() => {
  const place = location.value?.name ?? ''
  return `Find trusted print shops in ${place}. Compare prices for business cards, flyers, posters, and more. Get instant quotes, customize paper and finishing, and request formal quotes all in one place.`
})

const locationMapLabel = computed(() => {
  return locationMeta[slug.value]?.hub ?? `${location.value?.name ?? 'Regional'} print hub`
})

const locationMapEmbedUrl = computed(() => {
  const place = location.value?.name ?? slug.value
  const shopNames = location.value?.shops?.slice(0, 3).map((shop) => shop.name).join(' ') ?? ''
  return `https://www.google.com/maps?q=${encodeURIComponent(`${place} Kenya print shops ${shopNames}`)}&z=13&output=embed`
})

const productCards = computed<ProductCard[]>(() => {
  return productsInLocation.value.slice(0, 6).map((product) => ({
    slug: product.slug,
    name: product.name,
    icon: iconForProduct(product.name),
    detail: detailForProduct(product.name),
    priceLine: priceLineForProduct(product.name),
  }))
})

const nearbyLocationCards = computed(() => nearbyLocations.value.slice(0, 6))

function initials(name?: string | null) {
  if (!name) return 'PS'
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map(part => part[0]?.toUpperCase() ?? '')
    .join('')
}

function iconForProduct(name: string) {
  const key = name.toLowerCase()
  if (key.includes('business')) return 'i-lucide-credit-card'
  if (key.includes('flyer')) return 'i-lucide-file-text'
  if (key.includes('banner')) return 'i-lucide-flag'
  if (key.includes('sticker') || key.includes('label')) return 'i-lucide-sticker'
  if (key.includes('brochure')) return 'i-lucide-book-open'
  return 'i-lucide-package'
}

function priceLineForProduct(name: string) {
  const key = name.toLowerCase()
  if (key.includes('business')) return 'Starts from KES 1,500 / 100pcs'
  if (key.includes('flyer')) return 'A5 single sided'
  if (key.includes('banner')) return 'Weather resistant'
  if (key.includes('sticker')) return 'Cut to size'
  if (key.includes('brochure')) return 'Folded marketing set'
  return 'Quote-ready setup'
}

function detailForProduct(name: string) {
  const key = name.toLowerCase()
  if (key.includes('business')) return 'Popular for walk-in corporate stationery and quick reorders.'
  if (key.includes('flyer')) return 'Built for promotions, menus, campaigns, and event distribution.'
  if (key.includes('banner')) return 'Suitable for outdoor promos, retail activations, and events.'
  if (key.includes('sticker')) return 'Used for packaging, branding labels, and product finishing.'
  if (key.includes('brochure')) return 'Strong fit for premium folded collateral and company profiles.'
  return 'Frequently requested print product in this location.'
}

async function load() {
  loading.value = true
  try {
    const [detail, products, allLocations] = await Promise.all([
      fetchSEOLocationDetail(slug.value),
      fetchSEOLocationProducts(slug.value),
      fetchSEOLocations(),
    ])

    location.value = detail
    productsInLocation.value = products
    nearbyLocations.value = (allLocations ?? []).filter((l) => l.slug !== slug.value).slice(0, 8)

    if (detail?.shops?.length) {
      const ratingEntries = await Promise.all(
        detail.shops.slice(0, 6).map(async (shop) => [shop.slug, await getRatingSummary(shop.slug)] as const)
      )
      ratingSummaries.value = Object.fromEntries(ratingEntries)
    } else {
      ratingSummaries.value = {}
    }
  } catch {
    location.value = null
    productsInLocation.value = []
    nearbyLocations.value = []
    ratingSummaries.value = {}
  } finally {
    loading.value = false
  }
}

onMounted(load)
watch(slug, load)

const faqSchema = computed(() => {
  if (!location.value) return undefined
  const name = location.value.name
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: `How do I get a printing quote in ${name}?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `Browse our list of print shops in ${name}, pick a shop, and add products to your quote. You can customize paper, quantity, and finishing options. Most shops provide instant pricing for standard items like business cards and flyers.`,
        },
      },
      {
        '@type': 'Question',
        name: 'What can I print?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: `Print shops in ${name} typically offer business cards, flyers, posters, brochures, stickers, and more. Each shop has its own catalog. Browse their products to see available sizes, paper stocks, and finishing options.`,
        },
      },
      {
        '@type': 'Question',
        name: 'How long does printing take?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Turnaround varies by shop and product. Simple jobs like business cards can often be ready in 1 to 3 days. Larger orders or custom work may take longer. Contact the shop directly for specific timelines.',
        },
      },
      {
        '@type': 'Question',
        name: 'Can I compare prices between shops?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes. Add the same or similar products from different shops to get quotes. Printy shows you pricing as you customize, so you can compare before requesting a formal quote.',
        },
      },
    ],
  }
})

usePrintySeo(() => ({
  title: location.value ? `Print Shops in ${location.value.name}` : 'Location',
  description: location.value
    ? `Find print shops in ${location.value.name}. Compare business cards, flyers, posters, and get quotes.`
    : 'Print shops by location',
  path: `/locations/${slug.value}`,
  noIndex: !loading.value && !location.value,
  breadcrumbs: [
    { name: 'Home', path: '/' },
    { name: 'Shops', path: '/shops' },
    { name: location.value?.name ?? slug.value, path: `/locations/${slug.value}` },
  ],
  schema: location.value && faqSchema.value ? [faqSchema.value] : undefined,
}))
</script>
