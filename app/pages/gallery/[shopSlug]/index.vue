<script setup lang="ts">
import type { Product } from '~/shared/types'
import type { CatalogResponse } from '~/services/public'
import { getShopCatalog } from '~/shared/api/gallery'
import { formatKES } from '~/utils/formatters'
import { useQuoteDraftStore } from '~/stores/quoteDraft'

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

const products = computed(() => {
  const list = catalog.value?.products ?? []
  if (!categoryFilter.value) return list
  return list.filter((p) => p.category?.toLowerCase() === categoryFilter.value.toLowerCase())
})

const categories = computed(() => {
  const cats = new Set<string>()
  for (const p of catalog.value?.products ?? []) {
    if (p.category?.trim()) cats.add(p.category.trim())
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
  } catch {
    catalog.value = null
    fetchError.value = 'Failed to load products'
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

function openTweak(product: Product) {
  tweakProduct.value = product
  tweakModalOpen.value = true
}

function onItemAdded() {
  toast.add({ title: 'Added to Quote', description: `${tweakProduct.value?.name ?? 'Product'} added to your quote draft.` })
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
        @click="openTweak(product)"
      >
        <div class="relative aspect-[4/3] bg-[var(--p-surface-sunken)] overflow-hidden">
          <NuxtImg
            v-if="productImageUrl(product)"
            :src="productImageUrl(product)!"
            :alt="product.name"
            class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div v-else class="absolute inset-0 flex items-center justify-center">
            <UIcon name="i-lucide-package" class="h-16 w-16 text-[var(--p-border)]" />
          </div>
        </div>
        <div class="p-5">
          <h3 class="font-bold text-[var(--p-text)] group-hover:text-flamingo-600 dark:group-hover:text-flamingo-400 transition-colors">
            {{ product.name }}
          </h3>
          <p v-if="product.category" class="mt-0.5 text-sm text-[var(--p-text-muted)]">
            {{ product.category }}
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
          <div class="mt-4 flex items-center justify-between gap-2">
            <div class="text-lg font-bold text-flamingo-600 dark:text-flamingo-400">
              {{ priceDisplay(product) }}
            </div>
            <UButton
              color="primary"
              variant="soft"
              size="sm"
              @click.stop="openTweak(product)"
            >
              <UIcon name="i-lucide-sliders-horizontal" class="h-4 w-4 mr-1" />
              Tweak
            </UButton>
          </div>
        </div>
      </article>
    </div>

    <!-- Tweak Modal -->
    <QuotesProductTweakModal
      v-if="tweakProduct"
      v-model="tweakModalOpen"
      :product="tweakProduct"
      :shop-slug="shopSlug"
      @added="onItemAdded"
    />
  </div>
</template>
