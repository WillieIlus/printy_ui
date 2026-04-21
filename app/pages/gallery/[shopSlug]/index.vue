<script setup lang="ts">
import type { Product } from '~/shared/types'
import type { CatalogResponse } from '~/services/public'
import { getShopCatalog } from '~/shared/api/gallery'
import { useQuoteDraftStore } from '~/stores/quoteDraft'
import { isProductPublic } from '~/utils/product'

definePageMeta({ layout: 'default' })

const route = useRoute()
const shopSlug = computed(() => String(route.params.shopSlug))
const quoteDraftStore = useQuoteDraftStore()
const toast = useToast()
const { getMediaUrl } = useApi()

const catalog = ref<CatalogResponse | null>(null)
const loading = ref(true)
const fetchError = ref<string | null>(null)
const categoryFilter = ref('')

const tweakModalOpen = ref(false)
const tweakProduct = ref<Product | null>(null)
const detailsModalOpen = ref(false)
const detailsProduct = ref<Product | null>(null)
const imageErrorIds = ref<number[]>([])

function productCategoryName(p: Product): string {
  const c = p.category
  if (typeof c === 'string') return c.trim()
  if (c && typeof c === 'object' && 'name' in c && typeof (c as { name: string }).name === 'string') {
    return (c as { name: string }).name.trim()
  }
  return ''
}

const products = computed(() => {
  // Client-side guard (public API already filters server-side; this is defensive).
  const list = (catalog.value?.products ?? []).filter(isProductPublic)
  if (!categoryFilter.value) return list
  return list.filter((p) => productCategoryName(p).toLowerCase() === categoryFilter.value.toLowerCase())
})

const categories = computed(() => {
  const cats = new Set<string>()
  for (const p of catalog.value?.products ?? []) {
    const name = productCategoryName(p)
    if (name) cats.add(name)
  }
  return Array.from(cats).sort()
})

async function fetchData() {
  if (!shopSlug.value) return
  loading.value = true
  fetchError.value = null
  try {
    catalog.value = await getShopCatalog(shopSlug.value)
    if (!catalog.value) fetchError.value = 'Failed to load catalog'
  } catch (err) {
    catalog.value = null
    fetchError.value = err instanceof Error ? err.message : 'Failed to load products'
  } finally {
    loading.value = false
  }
}

function productImageUrl(product: Product): string | null {
  const path = product.primary_image
  if (!path) return null
  if (path.startsWith('http')) return path
  return getMediaUrl(path)
}

function hasImageError(productId: number): boolean {
  return imageErrorIds.value.includes(productId)
}

function markImageError(productId: number) {
  if (!hasImageError(productId)) {
    imageErrorIds.value = [...imageErrorIds.value, productId]
  }
}

function productVisual(product: Product) {
  const category = productCategoryName(product)
  const key = `${product.slug ?? ''} ${product.name} ${category}`.toLowerCase()
  const isBooklet = product.product_kind === 'BOOKLET' || key.includes('booklet')
  const isLargeFormat = product.pricing_mode === 'LARGE_FORMAT'

  if (isBooklet || key.includes('brochure')) {
    return {
      icon: 'i-lucide-book-open',
      gradientClass: 'bg-gradient-to-br from-violet-100 to-purple-200 dark:from-violet-950/60 dark:to-purple-900/40',
      iconColorClass: 'text-violet-500 dark:text-violet-400',
    }
  }
  if (key.includes('business')) {
    return {
      icon: 'i-lucide-credit-card',
      gradientClass: 'bg-gradient-to-br from-amber-100 to-orange-200 dark:from-amber-950/60 dark:to-orange-900/40',
      iconColorClass: 'text-amber-600 dark:text-amber-400',
    }
  }
  if (key.includes('flyer') || key.includes('leaflet')) {
    return {
      icon: 'i-lucide-file-text',
      gradientClass: 'bg-gradient-to-br from-sky-100 to-blue-200 dark:from-sky-950/60 dark:to-blue-900/40',
      iconColorClass: 'text-sky-500 dark:text-sky-400',
    }
  }
  if (key.includes('sticker') || key.includes('label')) {
    return {
      icon: 'i-lucide-sticker',
      gradientClass: 'bg-gradient-to-br from-emerald-100 to-green-200 dark:from-emerald-950/60 dark:to-green-900/40',
      iconColorClass: 'text-emerald-500 dark:text-emerald-400',
    }
  }
  if (isLargeFormat || key.includes('banner')) {
    return {
      icon: 'i-lucide-panel-top',
      gradientClass: 'bg-gradient-to-br from-teal-100 to-cyan-200 dark:from-teal-950/60 dark:to-cyan-900/40',
      iconColorClass: 'text-teal-500 dark:text-teal-400',
    }
  }
  if (key.includes('receipt')) {
    return {
      icon: 'i-lucide-receipt',
      gradientClass: 'bg-gradient-to-br from-slate-100 to-gray-200 dark:from-slate-800/60 dark:to-gray-800/40',
      iconColorClass: 'text-slate-500 dark:text-slate-400',
    }
  }
  if (key.includes('poster')) {
    return {
      icon: 'i-lucide-image',
      gradientClass: 'bg-gradient-to-br from-pink-100 to-rose-200 dark:from-pink-950/60 dark:to-rose-900/40',
      iconColorClass: 'text-pink-500 dark:text-pink-400',
    }
  }
  return {
    icon: 'i-lucide-package',
    gradientClass: 'bg-gradient-to-br from-flamingo-100 to-flamingo-200 dark:from-flamingo-950/60 dark:to-flamingo-900/40',
    iconColorClass: 'text-flamingo-500 dark:text-flamingo-400',
  }
}

function openDetails(product: Product, event?: Event) {
  if (event) event.stopPropagation()
  detailsProduct.value = product
  detailsModalOpen.value = true
}

function openTweak(product: Product, event?: Event) {
  if (event) {
    event.stopPropagation()
    event.preventDefault()
  }
  tweakProduct.value = product
  nextTick(() => {
    tweakModalOpen.value = true
  })
}

function onDetailsTweak() {
  if (detailsProduct.value) {
    tweakProduct.value = detailsProduct.value
    tweakModalOpen.value = true
  }
}

function onItemAdded() {
  toast.add({ title: 'Added to draft', description: `${tweakProduct.value?.name ?? 'Product'} added to your draft.` })
}

const { priceDisplay, priceDisplaySummary, priceDiagnostics } = useProductPriceDisplay()

function priceDiagnosticsText(product: Product): string {
  const d = priceDiagnostics(product)
  if (!d) return ''
  const parts: string[] = []
  if (d.reason) parts.push(d.reason)
  if (d.suggestions?.length) {
    parts.push(d.suggestions.map((s) => s.message).filter(Boolean).join(' '))
  }
  return parts.join(' ')
}

watch(shopSlug, () => {
  quoteDraftStore.setShop(shopSlug.value)
  fetchData()
}, { immediate: true })
</script>

<template>
  <div class="py-8 sm:py-12">
    <!-- Back + Shop info -->
    <div class="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div class="flex items-center gap-4">
        <NuxtLink
          to="/gallery"
          class="inline-flex items-center gap-2 text-sm font-medium text-[var(--p-text-muted)] hover:text-flamingo-600 dark:hover:text-flamingo-400"
        >
          <UIcon name="i-lucide-arrow-left" class="h-4 w-4" />
          Back to gallery
        </NuxtLink>
        <div v-if="catalog?.shop" class="flex items-center gap-2">
          <span class="text-[var(--p-border)]">&middot;</span>
          <h1 class="text-xl font-bold text-[var(--p-text)]">
            {{ catalog.shop.name }}
          </h1>
        </div>
      </div>
    </div>

    <!-- Category filter -->
    <div v-if="categories.length" class="flex flex-wrap gap-2 mb-6">
      <UButton
        :variant="!categoryFilter ? 'solid' : 'outline'"
        :color="!categoryFilter ? 'primary' : 'neutral'"
        size="sm"
        class="rounded-full"
        @click="categoryFilter = ''"
      >
        All
      </UButton>
      <UButton
        v-for="cat in categories"
        :key="cat"
        :variant="categoryFilter === cat ? 'solid' : 'outline'"
        :color="categoryFilter === cat ? 'primary' : 'neutral'"
        size="sm"
        class="rounded-full"
        @click="categoryFilter = cat"
      >
        {{ cat }}
      </UButton>
    </div>

    <CommonLoadingSpinner v-if="loading" />

    <CommonEmptyState
      v-else-if="fetchError || !catalog?.shop"
      :title="fetchError ? 'Could not load products' : 'Shop not found'"
      :description="fetchError ? 'Something went wrong. Please try again.' : 'This shop does not exist or is inactive.'"
      icon="i-lucide-package"
    />

    <div v-else-if="!products.length" class="rounded-2xl border border-[var(--p-border)] bg-[var(--p-surface)] p-12 text-center">
      <UIcon name="i-lucide-package" class="mx-auto h-16 w-16 text-[var(--p-border)]" />
      <h3 class="mt-4 text-lg font-medium text-[var(--p-text-dim)]">No products yet</h3>
      <p class="mt-2 text-sm text-[var(--p-text-muted)]">
        {{ categoryFilter ? 'No products in this category.' : 'This shop has not added any products.' }}
      </p>
    </div>

    <!-- Product grid -->
    <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <article
        v-for="product in products"
        :key="product.id"
        class="group rounded-2xl border border-[var(--p-border)] bg-[var(--p-surface)] overflow-hidden hover:border-flamingo-200 dark:hover:border-flamingo-800/50 transition-all cursor-pointer"
        @click="openDetails(product)"
      >
        <div class="relative aspect-[4/3] bg-[var(--p-surface-sunken)] overflow-hidden">
          <img
            v-if="productImageUrl(product) && !hasImageError(product.id)"
            :src="productImageUrl(product)!"
            :alt="product.name"
            class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
            @error="markImageError(product.id)"
          >
          <div
            v-else
            class="flex h-full w-full items-center justify-center transition-transform duration-300 group-hover:scale-105"
            :class="productVisual(product).gradientClass"
          >
            <UIcon
              :name="productVisual(product).icon"
              class="h-10 w-10 opacity-75"
              :class="productVisual(product).iconColorClass"
            />
          </div>
        </div>
        <div class="p-5">
          <h3
            class="font-bold text-[var(--p-text)] group-hover:text-flamingo-600 dark:group-hover:text-flamingo-400 transition-colors cursor-pointer"
            @click="openDetails(product, $event)"
          >
            {{ product.name }}
          </h3>
          <p v-if="productCategoryName(product)" class="mt-0.5 text-sm text-[var(--p-text-muted)]">
            {{ productCategoryName(product) }}
          </p>
          <div class="mt-3 space-y-1.5">
            <div v-if="product.final_size" class="flex items-center gap-2 text-xs text-[var(--p-text-muted)]">
              <UIcon name="i-lucide-ruler" class="h-3.5 w-3.5 shrink-0" />
              <span>{{ product.final_size }}</span>
            </div>
            <div v-if="product.imposition_summary" class="flex items-center gap-2 text-xs text-[var(--p-text-muted)]">
              <UIcon name="i-lucide-grid-2x2" class="h-3.5 w-3.5 shrink-0" />
              <span>Fits on {{ product.imposition_summary }}</span>
            </div>
            <div v-if="product.min_quantity" class="flex items-center gap-2 text-xs text-[var(--p-text-muted)]">
              <UIcon name="i-lucide-hash" class="h-3.5 w-3.5 shrink-0" />
              <span>Min {{ product.min_quantity }} pcs</span>
            </div>
            <div v-if="product.finishing_summary?.length" class="flex flex-wrap gap-1 mt-1">
              <UBadge v-for="finish in product.finishing_summary" :key="finish" variant="soft" color="neutral" size="xs">{{ finish }}</UBadge>
            </div>
          </div>
          <div class="mt-4 flex items-start justify-between gap-2">
            <div class="min-w-0 flex-1">
              <template v-if="priceDisplaySummary(product)">
                <div class="text-lg font-bold text-flamingo-600 dark:text-flamingo-400">
                  Total: {{ priceDisplaySummary(product)!.totalLine }}
                </div>
                <div class="text-sm text-[var(--p-text-muted)]">
                  {{ priceDisplaySummary(product)!.perUnitLine }}
                </div>
              </template>
              <div v-else class="flex items-center gap-1.5">
                <span class="text-lg font-bold text-flamingo-600 dark:text-flamingo-400">
                  {{ priceDisplay(product) }}
                </span>
                <UTooltip
                  v-if="priceDiagnostics(product)"
                  :text="priceDiagnosticsText(product)"
                  :popper="{ placement: 'top' }"
                >
                  <button
                    type="button"
                    class="inline-flex text-[var(--p-text-muted)] hover:text-flamingo-600 dark:hover:text-flamingo-400 transition-colors"
                    @click.stop
                  >
                    <UIcon name="i-lucide-info" class="h-4 w-4" />
                  </button>
                </UTooltip>
              </div>
            </div>
            <UButton
              color="primary"
              variant="soft"
              size="sm"
              @click.stop="openTweak(product, $event)"
            >
              <UIcon name="i-lucide-sliders-horizontal" class="h-4 w-4 mr-1" />
              Tweak
            </UButton>
          </div>
        </div>
      </article>
    </div>

    <!-- Details Modal -->
    <GalleryProductDetailModal
      v-model="detailsModalOpen"
      :product="detailsProduct"
      :product-image-url="detailsProduct ? productImageUrl(detailsProduct) : null"
      @tweak="onDetailsTweak"
    />

    <!-- Tweak Modal -->
    <QuotesProductTweakModal
      v-if="tweakProduct"
      v-model="tweakModalOpen"
      :product="tweakProduct"
      :shop-slug="shopSlug"
      :shop-name="catalog?.shop?.name"
      @added="onItemAdded"
    />
  </div>
</template>
