<template>
  <div class="min-h-screen bg-[var(--p-surface)] pb-20">
    <section class="border-b border-[var(--p-border)] bg-[var(--p-surface-raised)]/82 backdrop-blur-sm">
      <div class="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div class="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div class="max-w-2xl">
            <span class="text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-[var(--p-primary)]">
              Local Print Experts
            </span>
            <h1 class="mt-4 text-4xl font-extrabold tracking-tight text-[var(--p-text)] sm:text-5xl">
              Expert print partners, locally sourced.
            </h1>
            <p class="mt-4 text-lg leading-8 text-[var(--p-text-muted)]">
              Discover highly rated print shops, browse their specialties, and find the right production partner for business cards, packaging, large format, and more.
            </p>
          </div>

          <div class="w-full max-w-md space-y-4">
            <label class="group relative block">
              <input
                v-model="searchQuery"
                type="text"
                placeholder="Search print shops, products, or capabilities..."
                class="w-full rounded-xl border border-[var(--p-border)] bg-[var(--p-surface-sunken)] py-4 pl-12 pr-4 text-[var(--p-text)] outline-none transition-all focus:border-[var(--p-primary)] focus:ring-2 focus:ring-[var(--p-primary)]/15"
              >
              <UIcon
                name="i-lucide-search"
                class="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[var(--p-text-muted)] transition-colors group-focus-within:text-[var(--p-primary)]"
              />
            </label>

            <div class="flex items-center justify-between gap-3">
              <p class="text-sm text-[var(--p-text-muted)]">
                {{ filteredShops.length }} shop{{ filteredShops.length === 1 ? '' : 's' }} matched
              </p>
              <UButton v-if="authStore.isAuthenticated" to="/me/favorites" variant="outline" color="neutral" size="sm">
                <UIcon name="i-lucide-heart" class="mr-2 h-4 w-4" />
                Saved Shops
              </UButton>
            </div>
          </div>
        </div>

        <div class="mt-8 flex flex-wrap gap-3">
          <button
            v-for="chip in filterChips"
            :key="chip.value"
            type="button"
            class="rounded-full px-5 py-2.5 text-sm font-semibold transition-all"
            :class="activeFilter === chip.value
              ? 'bg-flamingo-500 text-white shadow-lg shadow-flamingo-500/20'
              : 'bg-[var(--p-surface-container)] text-[var(--p-text-muted)] hover:bg-[var(--p-surface-container-high)] hover:text-[var(--p-text)]'"
            @click="activeFilter = chip.value"
          >
            {{ chip.label }}
          </button>
        </div>
      </div>
    </section>

    <section class="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <CommonLoadingSpinner v-if="loading" />

      <div v-else-if="filteredShops.length" class="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3">
        <article
          v-for="shop in filteredShops"
          :key="shop.id"
          class="group overflow-hidden rounded-2xl bg-[var(--p-surface)] shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-[0px_20px_40px_rgba(20,27,44,0.08)]"
        >
          <div class="relative h-64 overflow-hidden">
            <img
              v-if="shop.imageUrl"
              :src="shop.imageUrl"
              :alt="shop.name"
              class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
            >
            <div
              v-else
              class="flex h-full w-full items-center justify-center bg-[radial-gradient(circle_at_top_left,_rgba(225,53,21,0.16),_transparent_55%),linear-gradient(135deg,var(--p-surface-container),var(--p-surface-sunken))]"
            >
              <UIcon name="i-lucide-store" class="h-16 w-16 text-[var(--p-primary)]/65" />
            </div>

            <div
              v-if="shop.rating"
              class="absolute right-4 top-4 flex items-center gap-1 rounded-full border border-[var(--p-border)] bg-[var(--p-surface-raised)]/92 px-3 py-1 shadow-sm backdrop-blur-md"
            >
              <UIcon name="i-lucide-star" class="h-4 w-4 fill-current text-amber-500" />
              <span class="text-xs font-bold text-[var(--p-text)]">{{ shop.rating.average.toFixed(1) }}</span>
              <span class="text-[11px] text-[var(--p-text-muted)]">({{ shop.rating.count }})</span>
            </div>

            <div class="absolute bottom-4 left-4 flex flex-wrap gap-2">
              <span
                v-if="shop.primaryBadge"
                class="rounded-lg bg-[var(--p-primary)] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-white"
              >
                {{ shop.primaryBadge }}
              </span>
              <ShopsShopStatusBadge v-if="shop.status" :status="shop.status" />
            </div>
          </div>

          <div class="flex h-[calc(100%-16rem)] flex-col p-6">
            <div class="flex items-start justify-between gap-3">
              <div class="min-w-0">
                <h2 class="truncate text-xl font-bold text-[var(--p-text)]">{{ shop.name }}</h2>
                <p class="mt-1 text-xs font-medium uppercase tracking-[0.12em] text-[var(--p-text-muted)]">
                  {{ shop.secondaryLine }}
                </p>
              </div>
              <ShopsShopFavoriteToggle
                :shop-id="shop.id"
                :shop-name="shop.name"
                :shop-slug="shop.slug"
              />
            </div>

            <p class="mt-4 line-clamp-2 text-sm leading-6 text-[var(--p-text-muted)]">
              {{ shop.descriptionText }}
            </p>

            <div class="mt-5 flex flex-wrap gap-2">
              <span
                v-for="tag in shop.tags"
                :key="tag"
                class="rounded-md bg-[var(--p-surface-sunken)] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-[var(--p-text-muted)]"
              >
                {{ tag }}
              </span>
            </div>

            <div class="mt-8 flex items-center justify-between border-t border-[var(--p-border)] pt-4">
              <div>
                <p class="text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--p-text-muted)]">Capabilities</p>
                <p class="mt-1 text-sm font-semibold text-[var(--p-text)]">{{ shop.capabilityLine }}</p>
              </div>
              <NuxtLink
                :to="`/shops/${shop.slug}`"
                class="cta-button inline-flex items-center justify-center rounded-xl bg-flamingo-500 px-5 py-3 text-sm font-bold text-white transition-colors group-hover:bg-flamingo-400"
              >
                View Shop
              </NuxtLink>
            </div>
          </div>
        </article>
      </div>

      <div
        v-else
        class="rounded-2xl border border-[var(--p-border)] bg-[var(--p-surface)] p-12 text-center"
      >
        <UIcon name="i-lucide-search-x" class="mx-auto h-14 w-14 text-[var(--p-border)]" />
        <h3 class="mt-4 text-xl font-semibold text-[var(--p-text)]">No shops match this search</h3>
        <p class="mt-2 text-sm text-[var(--p-text-muted)]">
          Try another keyword or remove the current filter chip.
        </p>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import type { Product, ShopPublic } from '~/shared/types'
import { getAllProducts } from '~/shared/api/gallery'
import { listShops } from '~/services/public'
import { getRatingSummary } from '~/services/ratings'
import type { RatingSummary } from '~/services/ratings'
import { useAuthStore } from '~/stores/auth'
import { useAnalyticsTracking } from '~/composables/useAnalyticsTracking'
import { useFavoritesStore } from '~/stores/favorites'
import { safeLogError } from '~/utils/safeLog'

definePageMeta({ layout: 'default' })

type ShopCard = ShopPublic & {
  imageUrl: string | null
  tags: string[]
  searchText: string
  primaryBadge: string | null
  secondaryLine: string
  descriptionText: string
  capabilityLine: string
  rating: RatingSummary | null
}

const authStore = useAuthStore()
const favoritesStore = useFavoritesStore()
const { trackSearch } = useAnalyticsTracking()
const publicApi = usePublicApi()
const { getMediaUrl } = useApi()

const shops = ref<ShopPublic[]>([])
const products = ref<Product[]>([])
const loading = ref(true)
const ratingSummaries = ref<Record<string, RatingSummary>>({})
const searchQuery = ref('')
const activeFilter = ref<'all' | 'sheet' | 'large-format' | 'brochure' | 'business-cards' | 'sticker'>('all')
const lastTrackedSearch = ref('')
let searchTrackTimer: ReturnType<typeof setTimeout> | null = null

const filterChips = [
  { value: 'all' as const, label: 'All Shops' },
  { value: 'sheet' as const, label: 'Digital Print' },
  { value: 'large-format' as const, label: 'Large Format' },
  { value: 'business-cards' as const, label: 'Business Cards' },
  { value: 'brochure' as const, label: 'Brochures' },
  { value: 'sticker' as const, label: 'Stickers & Labels' },
]

const productsByShop = computed<Record<string, Product[]>>(() => {
  return products.value.reduce<Record<string, Product[]>>((acc, product) => {
    const slug = product.shop?.slug
    if (!slug) return acc
    acc[slug] ||= []
    acc[slug].push(product)
    return acc
  }, {})
})

const shopCards = computed<ShopCard[]>(() => {
  return shops.value.map((shop) => {
    const shopProducts = productsByShop.value[shop.slug] ?? []
    const tags = buildTags(shopProducts)
    return {
      ...shop,
      imageUrl: shopImageUrl(shopProducts),
      tags,
      searchText: [
        shop.name,
        shop.slug,
        shop.description ?? '',
        ...shopProducts.map((product) => `${product.name} ${productCategory(product)} ${product.pricing_mode}`),
        ...tags,
      ].join(' ').toLowerCase(),
      primaryBadge: primaryBadge(shopProducts),
      secondaryLine: secondaryLine(shopProducts),
      descriptionText: shop.description?.trim() || fallbackDescription(shopProducts),
      capabilityLine: capabilityLine(shopProducts),
      rating: ratingSummaries.value[shop.slug] ?? null,
    }
  })
})

const filteredShops = computed(() => {
  const query = searchQuery.value.trim().toLowerCase()
  return shopCards.value.filter((shop) => {
    const matchesQuery = !query || shop.searchText.includes(query)
    const matchesFilter = matchesChip(shop, activeFilter.value)
    return matchesQuery && matchesFilter
  })
})

function productCategory(product: Product) {
  const category = product.category
  if (typeof category === 'string') return category
  if (category && typeof category === 'object' && 'name' in category && typeof category.name === 'string') {
    return category.name
  }
  return ''
}

function normalizeTag(value: string) {
  return value.trim().toUpperCase()
}

function buildTags(shopProducts: Product[]) {
  const tags: string[] = []
  for (const product of shopProducts) {
    const category = productCategory(product)
    if (category) tags.push(normalizeTag(category))
    if (product.pricing_mode === 'LARGE_FORMAT') tags.push('LARGE FORMAT')
    if (product.pricing_mode === 'SHEET') tags.push('DIGITAL PRINT')
    if (tags.length >= 6) break
  }
  return [...new Set(tags)].slice(0, 3)
}

function primaryBadge(shopProducts: Product[]) {
  if (shopProducts.some((product) => product.pricing_mode === 'LARGE_FORMAT')) return 'LARGE FORMAT'
  if (shopProducts.some((product) => `${product.name} ${productCategory(product)}`.toLowerCase().includes('business'))) return 'BUSINESS READY'
  if (shopProducts.length >= 6) return 'PRO PREFERRED'
  return null
}

function secondaryLine(shopProducts: Product[]) {
  if (!shopProducts.length) return 'Print partner'
  const categoryCounts = new Map<string, number>()
  for (const product of shopProducts) {
    const category = productCategory(product) || product.pricing_mode
    categoryCounts.set(category, (categoryCounts.get(category) ?? 0) + 1)
  }
  const top = [...categoryCounts.entries()].sort((a, b) => b[1] - a[1])[0]?.[0]
  return top ? `${top} specialist` : 'Print partner'
}

function fallbackDescription(shopProducts: Product[]) {
  if (!shopProducts.length) return 'Browse this shop for quote-ready print work and tailored production support.'
  const names = shopProducts.slice(0, 2).map((product) => product.name).join(', ')
  return `Explore quote-ready work including ${names}${shopProducts.length > 2 ? ' and more' : ''}.`
}

function capabilityLine(shopProducts: Product[]) {
  if (!shopProducts.length) return 'Quote-ready setup available'
  const categories = [...new Set(shopProducts.map((product) => productCategory(product)).filter(Boolean))]
  if (categories.length) return categories.slice(0, 2).join(' • ')
  return `${shopProducts.length} live product${shopProducts.length === 1 ? '' : 's'}`
}

function shopImageUrl(shopProducts: Product[]) {
  const image = shopProducts.find((product) => product.primary_image)?.primary_image
    ?? shopProducts.flatMap((product) => product.images ?? []).find((img) => img.image)?.image
    ?? null
  if (!image) return null
  return image.startsWith('http') ? image : getMediaUrl(image)
}

function matchesChip(shop: ShopCard, chip: typeof activeFilter.value) {
  if (chip === 'all') return true
  if (chip === 'sheet') return shop.searchText.includes('sheet') || shop.searchText.includes('digital')
  if (chip === 'large-format') return shop.searchText.includes('large format')
  if (chip === 'business-cards') return shop.searchText.includes('business')
  if (chip === 'brochure') return shop.searchText.includes('brochure')
  if (chip === 'sticker') return shop.searchText.includes('sticker') || shop.searchText.includes('label')
  return true
}

onMounted(async () => {
  try {
    const [shopList, productList] = await Promise.all([
      listShops(publicApi),
      getAllProducts(publicApi),
    ])
    shops.value = shopList
    products.value = productList

    if (authStore.isAuthenticated) {
      favoritesStore.loadFavorites()
    }

    const summaries = await Promise.all(
      shopList.map(async (shop) => ({ slug: shop.slug, summary: await getRatingSummary(shop.slug, publicApi) }))
    )
    ratingSummaries.value = Object.fromEntries(
      summaries.filter((entry) => entry.summary).map((entry) => [entry.slug, entry.summary!])
    )
  } catch (err) {
    safeLogError(err, 'shops.index')
  } finally {
    loading.value = false
  }
})

watch(searchQuery, (value) => {
  if (searchTrackTimer) {
    clearTimeout(searchTrackTimer)
  }

  const trimmed = value.trim()
  if (trimmed.length < 2) {
    return
  }

  searchTrackTimer = setTimeout(() => {
    const normalized = trimmed.toLowerCase()
    if (normalized === lastTrackedSearch.value) {
      return
    }
    lastTrackedSearch.value = normalized
    void trackSearch(trimmed, {
      source: 'shops_index',
      active_filter: activeFilter.value,
      results_count: filteredShops.value.length,
    })
  }, 500)
})

onUnmounted(() => {
  if (searchTrackTimer) {
    clearTimeout(searchTrackTimer)
  }
})

usePrintySeo({
  title: 'Print Shops',
  description: 'Discover highly rated print shops across Kenya. Compare specialties, browse live products, and request quotes from the right production partner.',
  path: '/shops',
  breadcrumbs: [
    { name: 'Home', path: '/' },
    { name: 'Shops', path: '/shops' },
  ],
})
</script>
