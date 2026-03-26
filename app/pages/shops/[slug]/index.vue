<template>
  <div class="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(249,115,22,0.16),transparent_24%),radial-gradient(circle_at_top_right,rgba(59,130,246,0.16),transparent_28%),linear-gradient(180deg,#e9f0fb_0%,#f4f8fd_24%,#eef4fb_56%,#f8fafc_100%)] dark:bg-[#081120]">
    <div class="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <CommonLoadingSpinner v-if="loading" />

      <template v-else-if="catalog?.shop">
        <section class="overflow-hidden rounded-[2rem] border border-sky-200/70 bg-white/80 shadow-[0_32px_90px_-52px_rgba(8,24,52,0.42)] backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950/90">
          <div :style="heroHeaderStyle" class="border-b border-sky-100/80 px-6 py-6 text-white dark:border-slate-800 sm:px-8">
            <div class="grid gap-6 lg:grid-cols-[minmax(0,1.6fr)_minmax(20rem,0.95fr)]">
              <div class="min-w-0">
                <div class="mb-4 flex flex-wrap items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-sky-100/78">
                  <NuxtLink to="/" class="transition-colors hover:text-sky-50">Home</NuxtLink>
                  <span>/</span>
                  <NuxtLink to="/shops" class="transition-colors hover:text-sky-50">Shops</NuxtLink>
                  <span>/</span>
                  <span class="text-white">{{ catalog.shop.name }}</span>
                </div>

                <div class="flex flex-wrap items-start gap-3">
                  <div class="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-white/15 bg-white/10 text-white shadow-[0_16px_32px_-22px_rgba(15,23,42,0.95)]">
                    <UIcon name="i-lucide-store" class="h-7 w-7" />
                  </div>
                  <div class="min-w-0 flex-1">
                    <div class="flex flex-wrap items-center gap-3">
                      <h1 class="font-[family-name:var(--font-heading)] text-3xl font-bold tracking-tight text-white sm:text-4xl">
                        {{ catalog.shop.name }}
                      </h1>
                      <ShopsShopFavoriteToggle
                        :shop-id="catalog.shop.id"
                        :shop-name="catalog.shop.name"
                        :shop-slug="catalog.shop.slug"
                      />
                    </div>
                    <p class="mt-2 max-w-2xl text-sm leading-6 text-sky-50/88">
                      Configure a real product, review pricing signals, and send the job to this shop with the same workflow used elsewhere in Printy.
                    </p>
                  </div>
                </div>

                <div class="mt-4 flex flex-wrap items-center gap-2">
                  <ShopsShopStatusBadge v-if="catalog.shop.status" :status="catalog.shop.status" />
                  <ShopsShopRatingSummary :summary="ratingSummary" />
                  <span class="inline-flex items-center gap-2 rounded-full border border-orange-300/35 bg-orange-500/24 px-3 py-1 text-xs font-medium text-orange-50">
                    <UIcon name="i-lucide-package-search" class="h-3.5 w-3.5" />
                    Ready for configurable quotes
                  </span>
                </div>

                <ShopsShopWorkingHours
                  v-if="catalog.shop.opening_hours?.length"
                  :hours="catalog.shop.opening_hours"
                  class="mt-4"
                />

                <div v-if="catalog.shop.description" class="mt-5 rounded-2xl border border-white/14 bg-slate-950/24 p-4 backdrop-blur-sm">
                  <p class="mb-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-sky-100/78">
                    Shop overview
                  </p>
                  <EditorRichTextDisplay :html="catalog.shop.description" class="text-sm leading-6 text-sky-50/92 prose-a:text-sky-200 prose-strong:text-white prose-headings:text-white" />
                </div>
              </div>

              <div class="space-y-4">
                <div class="rounded-[1.75rem] border border-white/14 bg-slate-950/24 p-5 shadow-[0_24px_50px_-36px_rgba(2,6,23,0.96)] backdrop-blur-md">
                  <p class="text-[11px] font-semibold uppercase tracking-[0.18em] text-sky-100/78">
                    Quick actions
                  </p>
                  <div class="mt-4 space-y-3">
                    <UButton
                      v-if="quoteDraftStore.currentShopSlug === slug && quoteDraftStore.activeDraft?.items?.length"
                      to="/quote-draft"
                      color="primary"
                      class="w-full justify-between rounded-2xl bg-flamingo-500 text-white hover:bg-flamingo-600"
                    >
                      <span class="inline-flex items-center gap-2">
                        <UIcon name="i-lucide-shopping-cart" class="h-4 w-4" />
                        View your draft
                      </span>
                      <span>{{ quoteDraftStore.activeDraft.items.length }}</span>
                    </UButton>
                    <UButton
                      variant="outline"
                      color="neutral"
                      class="w-full justify-between rounded-2xl border-white/18 bg-slate-950/42 text-white hover:bg-slate-950/54"
                      @click="customModalOpen = true"
                    >
                      <span class="inline-flex items-center gap-2">
                        <UIcon name="i-lucide-pen-tool" class="h-4 w-4" />
                        Request custom print
                      </span>
                      <UIcon name="i-lucide-arrow-up-right" class="h-4 w-4" />
                    </UButton>
                    <UButton
                      to="/shops"
                      variant="outline"
                      color="neutral"
                      class="w-full justify-between rounded-2xl border-white/18 bg-slate-950/42 text-white hover:bg-slate-950/54"
                    >
                      <span class="inline-flex items-center gap-2">
                        <UIcon name="i-lucide-arrow-left" class="h-4 w-4" />
                        Back to shops
                      </span>
                      <UIcon name="i-lucide-chevron-right" class="h-4 w-4" />
                    </UButton>
                  </div>
                </div>

                <div class="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
                  <div
                    v-for="stat in shopStats"
                    :key="stat.label"
                    class="rounded-[1.5rem] border border-white/14 bg-slate-950/38 p-4 backdrop-blur-sm"
                  >
                    <div class="flex items-center gap-3">
                      <div class="flex h-10 w-10 items-center justify-center rounded-2xl bg-orange-500 text-white">
                        <UIcon :name="stat.icon" class="h-4.5 w-4.5" />
                      </div>
                      <div>
                        <p class="text-[11px] font-semibold uppercase tracking-[0.16em] text-sky-100/78">{{ stat.label }}</p>
                        <p class="mt-1 text-base font-semibold text-white">{{ stat.value }}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="px-6 py-6 sm:px-8">
            <div class="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p class="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--p-text-muted)]">
                  Catalog
                </p>
                <h2 class="mt-2 text-2xl font-bold tracking-tight text-[var(--p-text)]">
                  Configure a product and send it to this shop
                </h2>
                <p class="mt-2 max-w-2xl text-sm leading-6 text-[var(--p-text-muted)]">
                  Each card carries real product data from the shop. Open one to tweak quantity, paper, finishing, and other quote options.
                </p>
              </div>
              <div class="inline-flex items-center gap-2 rounded-full border border-[var(--p-border)] bg-[var(--p-surface-container-low)] px-4 py-2 text-xs font-medium text-[var(--p-text-dim)]">
                <UIcon name="i-lucide-sparkles" class="h-4 w-4" />
                {{ catalog.products.length }} configured product{{ catalog.products.length === 1 ? '' : 's' }}
              </div>
            </div>

            <div v-if="catalog.products.length" class="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
              <article
                v-for="product in catalog.products"
                :key="product.id"
                class="group overflow-hidden rounded-[1.8rem] border border-[var(--p-border)] bg-[var(--p-surface-raised)] shadow-[0_24px_60px_-40px_rgba(15,23,42,0.28)] transition-all hover:-translate-y-1.5 hover:border-orange-200 hover:shadow-[0_30px_70px_-42px_rgba(249,115,22,0.34)]"
              >
                <button class="block w-full text-left" type="button" @click="openTweak(product)">
                  <div class="relative aspect-[4/3] overflow-hidden bg-[linear-gradient(140deg,#d9e8fb_0%,#eef5ff_40%,#ffe2cb_100%)] dark:bg-[linear-gradient(135deg,#0f172a_0%,#102746_62%,#1c3552_100%)]">
                    <NuxtImg
                      v-if="productImageUrl(product)"
                      :src="productImageUrl(product)!"
                      :alt="product.name"
                      class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                    />
                    <div v-else class="absolute inset-0 flex items-center justify-center">
                      <div class="flex h-16 w-16 items-center justify-center rounded-3xl border border-white/60 bg-white/75 text-sky-900 shadow-sm dark:border-slate-700 dark:bg-slate-900/80 dark:text-slate-100">
                        <UIcon name="i-lucide-package" class="h-8 w-8" />
                      </div>
                    </div>

                    <div class="absolute left-4 top-4 flex flex-wrap gap-2">
                      <span
                        v-if="product.category"
                        class="inline-flex items-center rounded-full border border-white/75 bg-white/88 px-3 py-1 text-[11px] font-semibold text-sky-800 shadow-sm dark:border-slate-700 dark:bg-slate-950/80 dark:text-slate-100"
                      >
                        {{ product.category }}
                      </span>
                      <span
                        v-if="product.turnaround_days"
                        class="inline-flex items-center gap-1 rounded-full border border-orange-200/80 bg-orange-50/92 px-3 py-1 text-[11px] font-semibold text-orange-800 shadow-sm dark:border-orange-700 dark:bg-orange-950/55 dark:text-orange-100"
                      >
                        <UIcon name="i-lucide-timer-reset" class="h-3.5 w-3.5" />
                        {{ turnaroundBadge(product.turnaround_days) }}
                      </span>
                    </div>
                  </div>
                </button>

                <div class="space-y-4 p-5">
                  <div>
                    <h3 class="text-lg font-semibold tracking-tight text-[var(--p-text)]">
                      {{ product.name }}
                    </h3>
                    <p class="mt-2 text-sm leading-6 text-[var(--p-text-muted)]">
                      {{ productCardDescription(product) }}
                    </p>
                  </div>

                  <div class="flex flex-wrap gap-2">
                    <span
                      v-if="priceDisplaySummary(product)"
                      class="inline-flex items-center rounded-full border border-orange-200 bg-orange-50 px-3 py-1 text-xs font-semibold text-orange-800 dark:border-orange-700 dark:bg-orange-950/40 dark:text-orange-200"
                    >
                      {{ priceDisplaySummary(product)!.totalLine }}
                    </span>
                    <span
                      v-if="priceDisplaySummary(product)"
                      class="inline-flex items-center rounded-full border border-sky-200 bg-sky-50 px-3 py-1 text-xs font-medium text-sky-800 dark:border-sky-700 dark:bg-sky-950/40 dark:text-sky-200"
                    >
                      {{ priceDisplaySummary(product)!.perUnitLine }}
                    </span>
                    <span
                      v-else
                      class="inline-flex items-center rounded-full border border-orange-200 bg-orange-50 px-3 py-1 text-xs font-semibold text-orange-800 dark:border-orange-700 dark:bg-orange-950/40 dark:text-orange-200"
                    >
                      {{ priceDisplay(product) }}
                    </span>
                  </div>

                  <div class="grid grid-cols-1 gap-2 text-xs text-[var(--p-text-muted)]">
                    <div v-if="product.final_size" class="flex items-center gap-2 rounded-2xl border border-[var(--p-border)] bg-[var(--p-surface-container-low)] px-3 py-2">
                      <UIcon name="i-lucide-ruler" class="h-3.5 w-3.5 shrink-0" />
                      <span>{{ product.final_size }}</span>
                    </div>
                    <div v-if="product.imposition_summary" class="flex items-center gap-2 rounded-2xl border border-[var(--p-border)] bg-[var(--p-surface-container-low)] px-3 py-2">
                      <UIcon name="i-lucide-grid-2x2" class="h-3.5 w-3.5 shrink-0" />
                      <span>Fits on {{ product.imposition_summary }}</span>
                    </div>
                    <div v-if="product.min_quantity" class="flex items-center gap-2 rounded-2xl border border-[var(--p-border)] bg-[var(--p-surface-container-low)] px-3 py-2">
                      <UIcon name="i-lucide-hash" class="h-3.5 w-3.5 shrink-0" />
                      <span>Minimum {{ product.min_quantity }} pcs</span>
                    </div>
                  </div>

                  <div v-if="product.finishing_summary?.length" class="flex flex-wrap gap-2">
                    <span
                      v-for="finish in product.finishing_summary"
                      :key="finish"
                      class="inline-flex items-center rounded-full border border-[var(--p-border)] bg-[var(--p-surface-container-low)] px-3 py-1 text-[11px] font-medium text-[var(--p-text-dim)]"
                    >
                      {{ finish }}
                    </span>
                  </div>

                  <UButton
                    color="primary"
                    class="w-full justify-between rounded-2xl bg-flamingo-500 text-white hover:bg-flamingo-600 dark:bg-flamingo-500 dark:text-white dark:hover:bg-flamingo-400"
                    block
                    @click="openTweak(product)"
                  >
                    <span class="inline-flex items-center gap-2">
                      <UIcon name="i-lucide-sliders-horizontal" class="h-4 w-4" />
                      Configure quote
                    </span>
                    <UIcon name="i-lucide-arrow-up-right" class="h-4 w-4" />
                  </UButton>
                </div>
              </article>
            </div>

            <div v-else class="mt-6 rounded-[1.8rem] border border-dashed border-[var(--p-border)] bg-[var(--p-surface-container-low)] p-12 text-center">
              <div class="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-white text-sky-900 shadow-sm dark:bg-slate-900 dark:text-slate-100">
                <UIcon name="i-lucide-package" class="h-8 w-8" />
              </div>
              <h3 class="mt-4 text-lg font-semibold text-[var(--p-text)]">No products yet</h3>
              <p class="mt-2 text-sm text-[var(--p-text-muted)]">This shop has not published products to its public catalog yet.</p>
            </div>
          </div>
        </section>

        <section v-if="pricingStore.rateCard" class="mt-8">
          <div class="rounded-[1.8rem] border border-[var(--p-border)] bg-[var(--p-surface-raised)] p-6 shadow-[0_24px_60px_-42px_rgba(15,23,42,0.26)]">
            <PricingRateCardDisplay
              :rate-card="pricingStore.rateCard"
              :shop-name="catalog.shop.name"
            />
          </div>
        </section>

        <section v-if="canRateShop && catalog.shop" class="mt-8">
          <div class="rounded-[1.8rem] border border-[var(--p-border)] bg-[var(--p-surface-raised)] p-6 shadow-[0_24px_60px_-42px_rgba(15,23,42,0.26)]">
            <ShopsShopRateForm :shop-id="catalog.shop.id" />
          </div>
        </section>

        <QuotesCustomPrintModal
          v-model="customModalOpen"
          :shop-slug="slug"
          :paper-options="[]"
        />

        <QuotesProductTweakModal
          v-if="tweakProduct"
          v-model="tweakModalOpen"
          :product="tweakProduct"
          :shop-slug="slug"
          :shop-name="catalog.shop.name"
          @added="onItemAdded"
        />
      </template>

      <div v-else class="rounded-[1.8rem] border border-[var(--p-border)] bg-[var(--p-surface-raised)] p-12 text-center shadow-[0_24px_60px_-42px_rgba(15,23,42,0.26)]">
        <div class="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-sky-100 text-sky-900 dark:bg-slate-800 dark:text-slate-100">
          <UIcon name="i-lucide-store" class="h-8 w-8" />
        </div>
        <h3 class="mt-4 text-lg font-semibold text-[var(--p-text)]">Shop not found</h3>
        <p class="mt-2 text-sm text-[var(--p-text-muted)]">The shop you are looking for does not exist or is inactive.</p>
        <UButton to="/shops" class="mt-5 rounded-2xl bg-flamingo-500 text-white hover:bg-flamingo-600 dark:bg-flamingo-500 dark:text-white dark:hover:bg-flamingo-400">
          Browse shops
        </UButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { CatalogResponse } from '~/services/public'
import type { Product } from '~/shared/types'
import { getCatalog } from '~/services/public'
import { getRatingSummary } from '~/services/ratings'
import type { RatingSummary } from '~/services/ratings'
import { useAnalyticsTracking } from '~/composables/useAnalyticsTracking'
import { useAuthStore } from '~/stores/auth'
import { useFavoritesStore } from '~/stores/favorites'
import { usePricingStore } from '~/stores/pricing'
import { useQuoteDraftStore } from '~/stores/quoteDraft'
import { stripHtmlToText } from '~/utils/richText'
import { safeLogError } from '~/utils/safeLog'

definePageMeta({ layout: 'default' })

const route = useRoute()
const slug = computed(() => route.params.slug as string)
const quoteDraftStore = useQuoteDraftStore()
const authStore = useAuthStore()
const favoritesStore = useFavoritesStore()
const { canRate, load: loadRatable } = useRatableShops()
const toast = useToast()
const { getMediaUrl } = useApi()
const { trackProductView, trackQuoteStart, trackShopView } = useAnalyticsTracking()

const catalog = ref<CatalogResponse | null>(null)
const loading = ref(true)
const customModalOpen = ref(false)
const ratingSummary = ref<RatingSummary | null>(null)
const pricingStore = usePricingStore()
const canRateShop = computed(() => catalog.value?.shop && canRate(catalog.value.shop.id))

const tweakModalOpen = ref(false)
const tweakProduct = ref<Product | null>(null)
const trackedShopSlug = ref<string | null>(null)

const heroHeaderStyle = 'background: linear-gradient(135deg, rgba(8, 24, 52, 0.98) 0%, rgba(13, 37, 73, 0.94) 48%, rgba(16, 64, 116, 0.92) 100%);'

function openTweak(product: Product) {
  tweakProduct.value = product
  void trackProductView({
    source: 'shop_catalog_tweak',
    product_id: product.id,
    product_name: product.name,
    product_slug: product.slug,
    shop_slug: slug.value,
  }, {
    onceKey: `shop-product-view:${slug.value}:${product.id}`,
  })
  void trackQuoteStart({
    source: 'shop_catalog_tweak',
    product_id: product.id,
    product_name: product.name,
    product_slug: product.slug,
    shop_slug: slug.value,
  }, {
    onceKey: `shop-quote-start:${slug.value}:${product.id}`,
  })
  tweakModalOpen.value = true
}

function onItemAdded() {
  toast.add({ title: 'Added to draft', description: `${tweakProduct.value?.name ?? 'Product'} added to your draft.` })
}

onMounted(async () => {
  try {
    quoteDraftStore.setShop(slug.value)
    const [cat, summary] = await Promise.all([
      getCatalog(slug.value),
      getRatingSummary(slug.value),
    ])
    catalog.value = cat
    ratingSummary.value = summary
    try {
      await pricingStore.fetchRateCard(slug.value)
    } catch {
      // Rate card may not be available
    }
    if (authStore.isAuthenticated) {
      favoritesStore.loadFavorites()
      await loadRatable()
    }
  } catch (err) {
    safeLogError(err, 'shops.catalog')
  } finally {
    loading.value = false
  }
})

onUnmounted(() => {
  pricingStore.clearPricing()
})

watch([loading, catalog], ([isLoading, currentCatalog]) => {
  if (isLoading || !currentCatalog?.shop || trackedShopSlug.value === currentCatalog.shop.slug) {
    return
  }

  trackedShopSlug.value = currentCatalog.shop.slug
  void trackShopView({
    source: 'shop_catalog_page',
    shop_id: currentCatalog.shop.id,
    shop_slug: currentCatalog.shop.slug,
    shop_name: currentCatalog.shop.name,
    product_count: currentCatalog.products.length,
  })
}, { immediate: true })

watch(customModalOpen, (open) => {
  if (!open || !catalog.value?.shop) {
    return
  }

  void trackQuoteStart({
    source: 'shop_custom_request_modal',
    shop_id: catalog.value.shop.id,
    shop_slug: catalog.value.shop.slug,
    shop_name: catalog.value.shop.name,
  }, {
    onceKey: `shop-custom-quote-start:${catalog.value.shop.slug}`,
  })
})

function productImageUrl(product: Product): string | null {
  const path = product.primary_image
  if (!path) return null
  if (path.startsWith('http')) return path
  return getMediaUrl(path)
}

function turnaroundBadge(days: number): string {
  return `${days} day${days === 1 ? '' : 's'}`
}

function productCardDescription(product: Product): string {
  const parts: string[] = []
  if (product.category) parts.push(product.category)
  if (product.final_size) parts.push(product.final_size)
  if (product.min_quantity) parts.push(`from ${product.min_quantity} pcs`)
  if (!parts.length) return 'Configured by this shop and ready for live quote adjustments.'
  return `${parts.join(' - ')}. Ready for live quote adjustments.`
}

const { priceDisplay, priceDisplaySummary } = useProductPriceDisplay()

const shopTurnaround = computed(() => {
  const days = (catalog.value?.products ?? [])
    .map((product) => product.turnaround_days)
    .filter((value): value is number => typeof value === 'number' && value > 0)

  if (!days.length) return 'Ask shop'

  const min = Math.min(...days)
  const max = Math.max(...days)
  if (min === max) return turnaroundBadge(min)
  return `${min}-${max} days`
})

const shopStats = computed(() => [
  {
    label: 'Products',
    value: String(catalog.value?.products.length ?? 0),
    icon: 'i-lucide-package-2',
  },
  {
    label: 'Rating',
    value: ratingSummary.value?.average ? `${ratingSummary.value.average.toFixed(1)}/5` : 'New',
    icon: 'i-lucide-star',
  },
  {
    label: 'Turnaround',
    value: shopTurnaround.value,
    icon: 'i-lucide-timer-reset',
  },
])

const config = useRuntimeConfig()
const siteUrl = (config.public.siteUrl as string) || 'https://printy.ke'
const shopNotFound = computed(() => !loading.value && !catalog.value?.shop)

usePrintySeo(() => ({
  title: catalog.value?.shop?.name ?? 'Shop',
  description: (() => {
    const desc = catalog.value?.shop?.description
    if (!desc) return `Browse ${catalog.value?.shop?.name ?? 'print shop'} products. Get instant quotes for business cards, flyers, posters.`
    const plain = stripHtmlToText(desc)
    if (!plain) return `Browse ${catalog.value?.shop?.name ?? 'print shop'} products. Get instant quotes for business cards, flyers, posters.`
    return plain.length > 155 ? `${plain.slice(0, 155)}...` : plain
  })(),
  path: `/shops/${slug.value}`,
  noIndex: shopNotFound.value,
  breadcrumbs: [
    { name: 'Home', path: '/' },
    { name: 'Shops', path: '/shops' },
    { name: catalog.value?.shop?.name ?? 'Shop', path: `/shops/${slug.value}` },
  ],
  schema: catalog.value?.shop
    ? [
        {
          '@context': 'https://schema.org',
          '@type': 'LocalBusiness',
          name: catalog.value.shop.name,
          description: catalog.value.shop.description
            ? stripHtmlToText(catalog.value.shop.description) || undefined
            : undefined,
          url: `${siteUrl}/shops/${slug.value}`,
        },
      ]
    : undefined,
}))
</script>
