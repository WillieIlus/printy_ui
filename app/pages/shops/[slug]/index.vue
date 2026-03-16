<template>
  <div class="min-h-screen bg-amber-50/80 dark:bg-stone-950">
    <div class="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-10">
      <CommonLoadingSpinner v-if="loading" />
      <template v-else-if="catalog?.shop">
        <!-- Shop header -->
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-3 flex-wrap">
              <h1 class="text-2xl sm:text-3xl font-bold text-stone-800 dark:text-stone-100 font-[family-name:var(--font-heading)]">
                {{ catalog.shop.name }}
              </h1>
              <ShopsShopFavoriteToggle
                :shop-id="catalog.shop.id"
                :shop-name="catalog.shop.name"
                :shop-slug="catalog.shop.slug"
              />
            </div>
            <div class="flex items-center gap-3 mt-1 flex-wrap">
              <ShopsShopStatusBadge v-if="catalog?.shop?.status" :status="catalog.shop.status" />
              <ShopsShopRatingSummary :summary="ratingSummary" />
              <p class="text-stone-600 dark:text-stone-400">Click a product to customize and quote</p>
            </div>
            <ShopsShopWorkingHours v-if="catalog?.shop?.opening_hours?.length" :hours="catalog.shop.opening_hours" class="mt-2" />
            <div v-if="catalog?.shop?.description" class="mt-4 rounded-xl border border-amber-200/60 dark:border-amber-800/40 bg-white/50 dark:bg-stone-900/50 px-4 py-3">
              <h2 class="text-sm font-semibold text-stone-600 dark:text-stone-400 mb-2">About</h2>
              <EditorRichTextDisplay :html="catalog.shop.description" class="text-stone-700 dark:text-stone-300" />
            </div>
          </div>
          <div class="flex gap-2 shrink-0 flex-wrap">
            <UButton v-if="quoteDraftStore.currentShopSlug === slug && quoteDraftStore.activeDraft?.items?.length" to="/quote-draft" color="primary" variant="outline">
              <UIcon name="i-lucide-shopping-cart" class="mr-2 h-4 w-4" />
              View your draft ({{ quoteDraftStore.activeDraft.items.length }})
            </UButton>
            <UButton variant="outline" color="neutral" @click="customModalOpen = true">
              <UIcon name="i-lucide-pen-tool" class="mr-2 h-4 w-4" />
              Request Custom Print
            </UButton>
            <UButton to="/shops" variant="outline" color="neutral">
              <UIcon name="i-lucide-arrow-left" class="mr-2 h-4 w-4" />
              Back to shops
            </UButton>
          </div>
        </div>

        <!-- Product catalog -->
        <div v-if="catalog.products.length" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div
            v-for="product in catalog.products"
            :key="product.id"
            class="rounded-2xl border border-amber-200/80 dark:border-amber-800/50 bg-white dark:bg-stone-900 shadow-sm overflow-hidden hover:shadow-lg transition-all cursor-pointer"
            @click="openTweak(product)"
          >
            <!-- Product image or placeholder -->
            <div class="relative aspect-[4/3] bg-amber-50 dark:bg-stone-800 overflow-hidden">
              <NuxtImg
                v-if="productImageUrl(product)"
                :src="productImageUrl(product)!"
                :alt="product.name"
                class="w-full h-full object-cover"
              />
              <div
                v-else
                class="absolute inset-0 flex items-center justify-center"
              >
                <UIcon name="i-lucide-package" class="h-16 w-16 text-amber-200 dark:text-amber-800" />
              </div>
            </div>
            <div class="p-6">
              <h3 class="font-semibold text-stone-800 dark:text-stone-100 truncate">
                {{ product.name }}
              </h3>
              <p v-if="product.category" class="mt-0.5 text-sm text-amber-600 dark:text-amber-400">
                {{ product.category }}
              </p>
              <div class="mt-1 space-y-0.5">
                <template v-if="priceDisplaySummary(product)">
                  <p class="text-sm font-medium text-amber-700 dark:text-amber-300">
                    Total: {{ priceDisplaySummary(product)!.totalLine }}
                  </p>
                  <p class="text-xs text-stone-500 dark:text-stone-400">
                    {{ priceDisplaySummary(product)!.perUnitLine }}
                  </p>
                </template>
                <p v-else class="text-sm font-medium text-amber-700 dark:text-amber-300">
                  {{ priceDisplay(product) }}
                </p>
              </div>
              <!-- Quote breakdown details -->
              <div class="mt-2 space-y-1">
                <div v-if="product.final_size" class="flex items-center gap-2 text-xs text-stone-500 dark:text-stone-400">
                  <UIcon name="i-lucide-ruler" class="h-3.5 w-3.5 shrink-0" />
                  <span>{{ product.final_size }}</span>
                </div>
                <div v-if="product.imposition_summary" class="flex items-center gap-2 text-xs text-stone-500 dark:text-stone-400">
                  <UIcon name="i-lucide-grid-2x2" class="h-3.5 w-3.5 shrink-0" />
                  <span>Fits on {{ product.imposition_summary }}</span>
                </div>
                <div v-if="product.min_quantity" class="flex items-center gap-2 text-xs text-stone-500 dark:text-stone-400">
                  <UIcon name="i-lucide-hash" class="h-3.5 w-3.5 shrink-0" />
                  <span>Min {{ product.min_quantity }} pcs</span>
                </div>
                <div v-if="product.finishing_summary?.length" class="flex flex-wrap gap-1 mt-1">
                  <UBadge v-for="finish in product.finishing_summary" :key="finish" variant="soft" color="neutral" size="xs">{{ finish }}</UBadge>
                </div>
              </div>
              <UButton
                color="primary"
                variant="soft"
                class="mt-4 w-full"
                block
                @click.stop="openTweak(product)"
              >
                <UIcon name="i-lucide-sliders-horizontal" class="mr-2 h-4 w-4" />
                Tweak Quote
              </UButton>
            </div>
          </div>
        </div>
        <div v-else class="rounded-2xl border border-amber-200/60 dark:border-amber-800/40 bg-white dark:bg-stone-900 p-12 text-center">
          <UIcon name="i-lucide-package" class="mx-auto h-16 w-16 text-amber-200 dark:text-amber-800" />
          <h3 class="mt-4 text-lg font-medium text-stone-700 dark:text-stone-300">No products yet</h3>
          <p class="mt-2 text-sm text-stone-500 dark:text-stone-400">This shop hasn't added any products.</p>
        </div>

        <!-- Rate card / pricing -->
        <section v-if="pricingStore.rateCard" class="mt-12">
          <PricingRateCardDisplay
            :rate-card="pricingStore.rateCard"
            :shop-name="catalog?.shop?.name"
          />
        </section>

        <div v-if="canRateShop && catalog.shop" class="mt-8">
          <ShopsShopRateForm :shop-id="catalog.shop.id" />
        </div>

        <QuotesCustomPrintModal
          v-model="customModalOpen"
          :shop-slug="slug"
          :paper-options="[]"
        />

        <!-- Tweak Modal -->
        <QuotesProductTweakModal
          v-if="tweakProduct"
          v-model="tweakModalOpen"
          :product="tweakProduct"
          :shop-slug="slug"
          :shop-name="catalog?.shop?.name"
          @added="onItemAdded"
        />
      </template>
      <div v-else class="rounded-2xl border border-amber-200/60 dark:border-amber-800/40 bg-white dark:bg-stone-900 p-12 text-center">
        <UIcon name="i-lucide-store" class="mx-auto h-16 w-16 text-amber-200 dark:text-amber-800" />
        <h3 class="mt-4 text-lg font-medium text-stone-700 dark:text-stone-300">Shop not found</h3>
        <p class="mt-2 text-sm text-stone-500 dark:text-stone-400">The shop you're looking for doesn't exist or is inactive.</p>
        <UButton to="/shops" class="mt-4">Browse shops</UButton>
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

const catalog = ref<CatalogResponse | null>(null)
const loading = ref(true)
const customModalOpen = ref(false)
const ratingSummary = ref<RatingSummary | null>(null)
const pricingStore = usePricingStore()
const canRateShop = computed(() => catalog.value?.shop && canRate(catalog.value.shop.id))

const tweakModalOpen = ref(false)
const tweakProduct = ref<Product | null>(null)

function openTweak(product: Product) {
  tweakProduct.value = product
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

function productImageUrl(product: Product): string | null {
  const path = product.primary_image
  if (!path) return null
  if (path.startsWith('http')) return path
  return getMediaUrl(path)
}

const { priceDisplay, priceDisplaySummary } = useProductPriceDisplay()

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
    return plain.length > 155 ? `${plain.slice(0, 155)}…` : plain
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
