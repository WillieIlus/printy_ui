<template>
  <div class="min-h-screen bg-amber-50/80 dark:bg-stone-950">
    <div class="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-10">
      <CommonLoadingSpinner v-if="loading" />
      <template v-else-if="catalog?.shop">
        <!-- Shop header -->
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-10">
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
            <div class="flex items-center gap-3 mt-1">
              <ShopsShopRatingSummary :summary="ratingSummary" />
              <p class="text-stone-600 dark:text-stone-400">Browse products and add to your quote</p>
            </div>
          </div>
          <div class="flex gap-2 shrink-0 flex-wrap">
            <UButton v-if="quoteDraftStore.currentShopSlug === slug && quoteDraftStore.activeDraft?.items?.length" to="/quote-draft" color="primary" variant="outline">
              <UIcon name="i-lucide-shopping-cart" class="mr-2 h-4 w-4" />
              View your quote ({{ quoteDraftStore.activeDraft.items.length }})
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
            class="rounded-2xl border border-amber-200/80 dark:border-amber-800/50 bg-white dark:bg-stone-900 shadow-sm overflow-hidden hover:shadow-lg transition-all"
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
              <div class="mt-1">
                <p class="text-sm font-medium text-amber-700 dark:text-amber-300">
                  {{ priceDisplay(product) }}
                </p>
                <p
                  v-if="pricingExplanation(product)"
                  class="mt-0.5 text-xs text-stone-500 dark:text-stone-400 line-clamp-2"
                  :title="pricingExplanation(product)!"
                >
                  {{ pricingExplanation(product) }}
                </p>
              </div>
              <p v-if="product.description" class="mt-2 text-sm text-stone-500 dark:text-stone-400 line-clamp-2">
                {{ product.description }}
              </p>
              <UButton
                color="primary"
                variant="solid"
                class="mt-4 w-full"
                block
                :loading="addingProductId === product.id"
                :disabled="!!addingProductId"
                @click="onAddToQuote(product)"
              >
                <UIcon name="i-lucide-plus" class="mr-2 h-4 w-4" />
                Add to Quote
              </UButton>
            </div>
          </div>
        </div>
        <div v-else class="rounded-2xl border border-amber-200/60 dark:border-amber-800/40 bg-white dark:bg-stone-900 p-12 text-center">
          <UIcon name="i-lucide-package" class="mx-auto h-16 w-16 text-amber-200 dark:text-amber-800" />
          <h3 class="mt-4 text-lg font-medium text-stone-700 dark:text-stone-300">No products yet</h3>
          <p class="mt-2 text-sm text-stone-500 dark:text-stone-400">This shop hasn't added any products.</p>
        </div>

        <div v-if="canRateShop && catalog.shop" class="mt-8">
          <ShopsShopRateForm :shop-id="catalog.shop.id" />
        </div>

        <QuotesCustomPrintModal
          v-model="customModalOpen"
          :shop-slug="slug"
          :paper-options="[]"
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
import { formatKES } from '~/utils/formatters'
import { getRatingSummary } from '~/services/ratings'
import type { RatingSummary } from '~/services/ratings'
import { useAuthStore } from '~/stores/auth'
import { useFavoritesStore } from '~/stores/favorites'
import { useQuoteDraftStore } from '~/stores/quoteDraft'

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
const addingProductId = ref<number | null>(null)
const customModalOpen = ref(false)
const ratingSummary = ref<RatingSummary | null>(null)
const canRateShop = computed(() => catalog.value?.shop && canRate(catalog.value.shop.id))

onMounted(async () => {
  try {
    quoteDraftStore.setShop(slug.value)
    const [cat, summary] = await Promise.all([
      getCatalog(slug.value),
      getRatingSummary(slug.value),
    ])
    catalog.value = cat
    ratingSummary.value = summary
    if (authStore.isAuthenticated) {
      favoritesStore.loadFavorites()
      await loadRatable()
    }
  } catch (err) {
    console.error('Failed to load catalog:', err)
  } finally {
    loading.value = false
  }
})

function productImageUrl(product: Product): string | null {
  const path = product.primary_image
  if (!path) return null
  if (path.startsWith('http')) return path
  return getMediaUrl(path)
}

function priceDisplay(product: Product): string {
  const est = product.price_range_est
  const hint = product.price_hint
  if (est?.price_display) return est.price_display
  if (hint?.price_display) return hint.price_display
  if (est?.lowest?.total) return `From ${formatKES(est.lowest.total)}`
  if (hint?.min_price != null) return `From ${formatKES(hint.min_price)}`
  return 'Price on request'
}

function pricingExplanation(product: Product): string | null {
  return product.price_range_est?.pricing_mode_explanation
    ?? product.price_hint?.pricing_mode_explanation
    ?? null
}

function openCustomModal() {
  customModalOpen.value = true
}

async function onAddToQuote(product: Product) {
  addingProductId.value = product.id
  try {
    await quoteDraftStore.addToQuote(product.id, slug.value, product.pricing_mode)
    toast.add({ title: 'Added to Quote Draft', description: `${product.name} added.` })
  } catch (err) {
    toast.add({
      title: 'Could not add',
      description: err instanceof Error ? err.message : 'Please sign in to add to your quote.',
      color: 'error',
    })
  } finally {
    addingProductId.value = null
  }
}
</script>
