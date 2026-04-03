<template>
  <div class="min-h-screen bg-[var(--p-bg)] relative overflow-hidden">
    <!-- Theme-aware background gradients -->
    <div class="pointer-events-none absolute inset-0 -z-10">
      <div class="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,var(--p-surface-sunken),transparent_45%),linear-gradient(180deg,var(--p-surface-container-low)_0%,var(--p-bg)_52%,var(--p-bg)_100%)]" />
      <div class="absolute right-[5%] top-[10%] h-[32rem] w-[32rem] rounded-full bg-[radial-gradient(circle,var(--color-primary-500)/0.04_0%,transparent_70%)] blur-3xl" />
      <div class="absolute left-[2%] top-[15%] h-[28rem] w-[28rem] rounded-full bg-[radial-gradient(circle,var(--color-mirage-500)/0.05_0%,transparent_70%)] blur-3xl" />
    </div>

    <div class="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <CommonLoadingSpinner v-if="loading" />

      <template v-else-if="catalog?.shop">
        <section class="overflow-hidden rounded-[2.5rem] border border-[var(--p-border)] bg-[var(--p-surface)] shadow-[var(--p-soft-shadow)] backdrop-blur-xl">
          <div :style="heroHeaderStyle" class="border-b border-white/10 px-6 py-8 text-white sm:px-10 sm:py-10">
            <div class="grid gap-8 lg:grid-cols-[minmax(0,1.6fr)_minmax(20rem,0.95fr)]">
              <div class="min-w-0">
                <div class="mb-4 flex flex-wrap items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/60">
                  <NuxtLink to="/" class="transition-colors hover:text-white">{{ t('shop.breadcrumbs.home') }}</NuxtLink>
                  <span>/</span>
                  <NuxtLink to="/shops" class="transition-colors hover:text-white">{{ t('shop.breadcrumbs.shops') }}</NuxtLink>
                  <span>/</span>
                  <span class="text-white">{{ catalog.shop.name }}</span>
                </div>

                <div class="flex flex-wrap items-start gap-4">
                  <div class="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-white/5 text-white shadow-lg backdrop-blur-md">
                    <NuxtImg
                      v-if="catalog.shop.logo"
                      :src="getMediaUrl(catalog.shop.logo) || ''"
                      :alt="catalog.shop.name"
                      class="h-full w-full object-cover"
                    />
                    <UIcon v-else name="i-lucide-store" class="h-8 w-8" />
                  </div>
                  <div class="min-w-0 flex-1">
                    <div class="flex flex-wrap items-center gap-4">
                      <h1 class="font-[family-name:var(--font-heading)] text-3xl font-bold tracking-tight text-white sm:text-4xl">
                        {{ catalog.shop.name }}
                      </h1>
                      <ShopsShopFavoriteToggle
                        :shop-id="catalog.shop.id"
                        :shop-name="catalog.shop.name"
                        :shop-slug="catalog.shop.slug"
                      />
                    </div>
                    <p class="mt-3 max-w-2xl text-base leading-relaxed text-white/80">{{ t('shop.heroDescription') }}</p>
                  </div>
                </div>

                <div class="mt-6 flex flex-wrap items-center gap-3">
                  <ShopsShopStatusBadge v-if="catalog.shop.status" :status="catalog.shop.status" />
                  <ShopsShopRatingSummary :summary="ratingSummary" />
                  <span class="inline-flex items-center gap-2 rounded-full border border-[var(--color-primary-400)]/20 bg-[var(--color-primary-500)]/10 px-3.5 py-1.5 text-xs font-semibold text-[var(--color-primary-100)]">
                    <UIcon name="i-lucide-package-search" class="h-4 w-4" />
                    {{ t('shop.readyForQuotes') }}
                  </span>
                </div>

                <ShopsShopWorkingHours
                  v-if="catalog.shop.opening_hours?.length"
                  :hours="catalog.shop.opening_hours"
                  class="mt-6"
                />

                <div v-if="catalog.shop.description" class="mt-6 rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-md">
                  <p class="mb-2.5 text-[11px] font-bold uppercase tracking-[0.2em] text-white/50">
                    {{ t('shop.overview') }}
                  </p>
                  <EditorRichTextDisplay :html="catalog.shop.description" class="text-sm leading-relaxed text-white/90 prose-a:text-[var(--color-primary-300)] prose-strong:text-white prose-headings:text-white" />
                </div>
              </div>

              <div class="space-y-4">
                <div class="rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur-md">
                  <p class="text-[11px] font-bold uppercase tracking-[0.2em] text-white/50">
                    {{ t('shop.quickActions') }}
                  </p>
                  <div class="mt-5 space-y-3.5">
                    <UButton
                      v-if="quoteDraftStore.currentShopSlug === slug && quoteDraftStore.activeDraft?.items?.length"
                      to="/quote-draft"
                      class="btn-primary w-full justify-between rounded-xl px-5 py-3"
                    >
                      <span class="inline-flex items-center gap-2.5">
                        <UIcon name="i-lucide-shopping-cart" class="h-5 w-5" />
                        {{ t('shop.openRequestsWorkspace') }}
                      </span>
                      <span class="rounded-full bg-white/20 px-2.5 py-0.5 text-xs font-bold">{{ quoteDraftStore.activeDraft.items.length }}</span>
                    </UButton>
                    <UButton
                      variant="outline"
                      class="w-full justify-between rounded-xl border-white/15 bg-white/5 px-5 py-3 text-white hover:bg-white/10"
                      @click="customModalOpen = true"
                    >
                      <span class="inline-flex items-center gap-2.5">
                        <UIcon name="i-lucide-pen-tool" class="h-5 w-5" />
                        {{ t('shop.requestCustomPrint') }}
                      </span>
                      <UIcon name="i-lucide-arrow-up-right" class="h-4 w-4" />
                    </UButton>
                    <UButton
                      to="/shops"
                      variant="outline"
                      class="w-full justify-between rounded-xl border-white/15 bg-white/5 px-5 py-3 text-white hover:bg-white/10"
                    >
                      <span class="inline-flex items-center gap-2.5">
                        <UIcon name="i-lucide-arrow-left" class="h-5 w-5" />
                        {{ t('shop.backToShops') }}
                      </span>
                      <UIcon name="i-lucide-chevron-right" class="h-4 w-4" />
                    </UButton>
                  </div>
                </div>

                <div class="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
                  <div
                    v-for="stat in shopStats"
                    :key="stat.label"
                    class="rounded-[1.5rem] border border-white/10 bg-white/5 p-4.5 backdrop-blur-md"
                  >
                    <div class="flex items-center gap-4">
                      <div class="flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--color-primary-500)] text-white shadow-lg shadow-[var(--color-primary-500)]/20">
                        <UIcon :name="stat.icon" class="h-5 w-5" />
                      </div>
                      <div>
                        <p class="text-[11px] font-bold uppercase tracking-[0.15em] text-white/50">{{ stat.label }}</p>
                        <p class="mt-0.5 text-lg font-bold text-white tracking-tight">{{ stat.value }}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="px-6 py-6 sm:px-8">
            <ShopsShopSocialLinks
              v-if="catalog.shop.social_links?.length"
              :links="catalog.shop.social_links"
              class="mb-8"
            />

            <div class="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p class="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--p-text-muted)]">
                  {{ t('shop.catalog') }}
                </p>
                <h2 class="mt-2 text-2xl font-bold tracking-tight text-[var(--p-text)]">
                  {{ t('shop.catalogTitle') }}
                </h2>
                <p class="mt-2 max-w-2xl text-sm leading-6 text-[var(--p-text-muted)]">
                  {{ t('shop.catalogDescription') }}
                </p>
              </div>
              <div class="inline-flex items-center gap-2 rounded-full border border-[var(--p-border)] bg-[var(--p-surface-container-low)] px-4 py-2 text-xs font-medium text-[var(--p-text-dim)]">
                <UIcon name="i-lucide-sparkles" class="h-4 w-4" />
                {{ t(`shop.configuredProducts_${catalog.products.length === 1 ? 'one' : 'other'}`, { count: catalog.products.length }) }}
              </div>
            </div>

            <div v-if="catalog.products.length" class="mt-8 grid grid-cols-1 gap-8 sm:grid-cols-2 xl:grid-cols-3">
              <article
                v-for="product in catalog.products"
                :key="product.id"
                class="group overflow-hidden rounded-[2rem] border border-[var(--p-border)] bg-[var(--p-surface-raised)] shadow-sm transition-all duration-300 hover:-translate-y-2 hover:border-[var(--color-primary-300)] hover:shadow-2xl hover:shadow-[var(--color-primary-500)]/10"
              >
                <button class="block w-full text-left" type="button" @click="openTweak(product)">
                  <div class="relative aspect-[4/3] overflow-hidden bg-[var(--p-surface-sunken)]">
                    <NuxtImg
                      v-if="productImageUrl(product)"
                      :src="productImageUrl(product)!"
                      :alt="product.name"
                      class="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div v-else class="absolute inset-0 flex items-center justify-center">
                      <div class="flex h-16 w-16 items-center justify-center rounded-3xl border border-[var(--p-border)] bg-[var(--p-surface)] text-[var(--p-text-muted)] shadow-sm">
                        <UIcon name="i-lucide-package" class="h-8 w-8" />
                      </div>
                    </div>

                    <div class="absolute left-4 top-4 flex flex-wrap gap-2">
                      <span
                        v-if="product.category"
                        class="inline-flex items-center rounded-full border border-[var(--p-border)] bg-[var(--p-surface)]/90 px-3 py-1 text-[11px] font-bold text-[var(--p-text)] shadow-sm backdrop-blur-md"
                      >
                        {{ product.category }}
                      </span>
                      <span
                        v-if="product.turnaround_hours || product.turnaround_days"
                        class="inline-flex items-center gap-1.5 rounded-full border border-[var(--color-primary-200)]/30 bg-[var(--color-primary-500)]/10 px-3 py-1 text-[11px] font-bold text-[var(--color-primary-700)] dark:text-[var(--color-primary-300)] shadow-sm backdrop-blur-md"
                      >
                        <UIcon name="i-lucide-timer-reset" class="h-3.5 w-3.5" />
                        {{ turnaroundBadge(product) }}
                      </span>
                    </div>
                  </div>
                </button>

                <div class="space-y-5 p-6">
                  <div>
                    <h3 class="text-xl font-bold tracking-tight text-[var(--p-text)] group-hover:text-[var(--color-primary-600)] transition-colors">
                      {{ product.name }}
                    </h3>
                    <p class="mt-2.5 text-sm leading-relaxed text-[var(--p-text-muted)] line-clamp-2">
                      {{ productCardDescription(product) }}
                    </p>
                  </div>

                  <div class="flex flex-wrap gap-2.5">
                    <span
                      v-if="priceDisplaySummary(product)"
                      class="inline-flex items-center rounded-lg border border-[var(--color-primary-200)] bg-[var(--color-primary-50)] dark:bg-[var(--color-primary-950)]/30 px-3 py-1.5 text-xs font-bold text-[var(--color-primary-700)] dark:text-[var(--color-primary-300)]"
                    >
                      {{ priceDisplaySummary(product)!.totalLine }}
                    </span>
                    <span
                      v-if="priceDisplaySummary(product)"
                      class="inline-flex items-center rounded-lg border border-[var(--p-border)] bg-[var(--p-surface-container-low)] px-3 py-1.5 text-xs font-bold text-[var(--p-text-dim)]"
                    >
                      {{ priceDisplaySummary(product)!.perUnitLine }}
                    </span>
                    <span
                      v-else
                      class="inline-flex items-center rounded-lg border border-[var(--color-primary-200)] bg-[var(--color-primary-50)] dark:bg-[var(--color-primary-950)]/30 px-3 py-1.5 text-xs font-bold text-[var(--color-primary-700)] dark:text-[var(--color-primary-300)]"
                    >
                      {{ priceDisplay(product) }}
                    </span>
                  </div>

                  <div class="grid grid-cols-1 gap-2.5 text-xs text-[var(--p-text-muted)]">
                    <div v-if="product.final_size" class="flex items-center gap-2.5 rounded-xl border border-[var(--p-border)] bg-[var(--p-surface-container-low)] px-3.5 py-2.5">
                      <UIcon name="i-lucide-ruler" class="h-4 w-4 shrink-0 text-[var(--p-text-muted)]" />
                      <span>{{ product.final_size }}</span>
                    </div>
                    <div v-if="product.imposition_summary" class="flex items-center gap-2.5 rounded-xl border border-[var(--p-border)] bg-[var(--p-surface-container-low)] px-3.5 py-2.5">
                      <UIcon name="i-lucide-grid-2x2" class="h-4 w-4 shrink-0 text-[var(--p-text-muted)]" />
                      <span>{{ t('shop.fitsOn', { value: product.imposition_summary }) }}</span>
                    </div>
                    <div v-if="product.min_quantity" class="flex items-center gap-2.5 rounded-xl border border-[var(--p-border)] bg-[var(--p-surface-container-low)] px-3.5 py-2.5">
                      <UIcon name="i-lucide-hash" class="h-4 w-4 shrink-0 text-[var(--p-text-muted)]" />
                      <span>{{ t('shop.minimumPieces', { count: product.min_quantity }) }}</span>
                    </div>
                    <div v-if="product.human_ready_text || product.turnaround_hours" class="flex items-center gap-2.5 rounded-xl border border-[var(--p-border)] bg-[var(--p-surface-container-low)] px-3.5 py-2.5">
                      <UIcon name="i-lucide-clock-3" class="h-4 w-4 shrink-0 text-[var(--p-text-muted)]" />
                      <span>{{ formatReadySummary(product.turnaround_hours, product.human_ready_text) }}</span>
                    </div>
                  </div>

                  <div v-if="product.finishing_summary?.length" class="flex flex-wrap gap-2">
                    <span
                      v-for="finish in product.finishing_summary"
                      :key="finish"
                      class="inline-flex items-center rounded-md border border-[var(--p-border)] bg-[var(--p-surface-container-low)] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-[var(--p-text-muted)]"
                    >
                      {{ finish }}
                    </span>
                  </div>

                  <UButton
                    class="btn-primary w-full justify-between rounded-xl px-5 py-3.5"
                    @click="openTweak(product)"
                  >
                    <span class="inline-flex items-center gap-2.5">
                      <UIcon name="i-lucide-sliders-horizontal" class="h-5 w-5" />
                      {{ t('shop.configureQuote') }}
                    </span>
                    <UIcon name="i-lucide-arrow-up-right" class="h-4 w-4" />
                  </UButton>
                </div>
              </article>
            </div>

            <div v-else class="mt-12 rounded-[2.5rem] border border-dashed border-[var(--p-border)] bg-[var(--p-surface-container-low)] p-16 text-center">
              <div class="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-[var(--p-surface)] text-[var(--p-text-muted)] shadow-sm">
                <UIcon name="i-lucide-package" class="h-10 w-10" />
              </div>
              <h3 class="mt-6 text-xl font-bold text-[var(--p-text)]">{{ t('shop.noProductsTitle') }}</h3>
              <p class="mt-2 text-base text-[var(--p-text-muted)]">{{ t('shop.noProductsDescription') }}</p>
            </div>
          </div>
        </section>

        <section v-if="pricingStore.rateCard" class="mt-10">
          <div class="rounded-[2.5rem] border border-[var(--p-border)] bg-[var(--p-surface)] p-8 shadow-[var(--p-soft-shadow)]">
            <PricingRateCardDisplay
              :rate-card="pricingStore.rateCard"
              :shop-name="catalog.shop.name"
            />
          </div>
        </section>

        <section v-if="canRateShop && catalog.shop" class="mt-10">
          <div class="rounded-[2.5rem] border border-[var(--p-border)] bg-[var(--p-surface)] p-8 shadow-[var(--p-soft-shadow)]">
            <ShopsShopRateForm :shop-id="catalog.shop.id" />
          </div>
        </section>

        <QuotesCustomPrintModal
          v-model="customModalOpen"
          :shop-slug="slug"
          :fixed-shop-name="catalog.shop.name"
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

      <div v-else class="rounded-[2.5rem] border border-[var(--p-border)] bg-[var(--p-surface)] p-16 text-center shadow-[var(--p-soft-shadow)]">
        <div class="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-[var(--p-surface-sunken)] text-[var(--p-text-muted)]">
          <UIcon name="i-lucide-store" class="h-10 w-10" />
        </div>
        <h3 class="mt-6 text-xl font-bold text-[var(--p-text)]">{{ t('shop.shopNotFoundTitle') }}</h3>
        <p class="mt-2 text-base text-[var(--p-text-muted)]">{{ t('shop.shopNotFoundDescription') }}</p>
        <UButton to="/shops" class="btn-primary mt-8 rounded-xl px-8 py-3.5">
          {{ t('shop.browseShops') }}
        </UButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
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
import { formatReadySummary, formatTurnaroundBadge, formatWorkingHours } from '~/utils/turnaround'

definePageMeta({ layout: 'default' })

const route = useRoute()
const { t } = useI18n()
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

const heroHeaderStyle = 'background: linear-gradient(135deg, var(--color-mirage-950) 0%, var(--color-mirage-900) 48%, var(--color-mirage-800) 100%);'

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
  toast.add({
    title: t('shop.addedToDraftTitle'),
    description: t('shop.addedToDraftDescription', {
      name: tweakProduct.value?.name ?? t('shop.products'),
    }),
  })
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

function turnaroundBadge(product: Product): string {
  return formatTurnaroundBadge(
    product.turnaround_hours ?? (product.turnaround_days ? product.turnaround_days * 8 : null),
    product.turnaround_label,
  )
}

function productCardDescription(product: Product): string {
  const parts: string[] = []
  if (product.category) parts.push(product.category)
  if (product.final_size) parts.push(product.final_size)
  if (product.min_quantity) parts.push(t('shop.minimumPieces', { count: product.min_quantity }))
  if (!parts.length) return t('shop.productCardFallback')
  return `${parts.join(' - ')}. ${t('shop.productCardReadySuffix')}`
}

const { priceDisplay, priceDisplaySummary } = useProductPriceDisplay()

const shopTurnaround = computed(() => {
  const hours = (catalog.value?.products ?? [])
    .map((product) => product.turnaround_hours ?? (product.turnaround_days ? product.turnaround_days * 8 : null))
    .filter((value): value is number => typeof value === 'number' && value > 0)

  if (!hours.length) return t('shop.askShop')

  const min = Math.min(...hours)
  const max = Math.max(...hours)
  if (min === max) return formatWorkingHours(min)
  return t('turnaround.workingHoursRange', { min, max })
})

const shopStats = computed(() => [
  {
    label: t('shop.products'),
    value: String(catalog.value?.products.length ?? 0),
    icon: 'i-lucide-package-2',
  },
  {
    label: t('shop.rating'),
    value: ratingSummary.value?.average ? `${ratingSummary.value.average.toFixed(1)}/5` : t('shop.new'),
    icon: 'i-lucide-star',
  },
  {
    label: t('shop.turnaround'),
    value: shopTurnaround.value,
    icon: 'i-lucide-timer-reset',
  },
])

const config = useRuntimeConfig()
const siteUrl = (config.public.siteUrl as string) || 'https://printy.ke'
const shopNotFound = computed(() => !loading.value && !catalog.value?.shop)

usePrintySeo(() => ({
  title: catalog.value?.shop?.name ?? t('shop.breadcrumbs.shop'),
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
    { name: t('shop.breadcrumbs.home'), path: '/' },
    { name: t('shop.breadcrumbs.shops'), path: '/shops' },
    { name: catalog.value?.shop?.name ?? t('shop.breadcrumbs.shop'), path: `/shops/${slug.value}` },
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
