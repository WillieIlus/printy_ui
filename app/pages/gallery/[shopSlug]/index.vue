<script setup lang="ts">
import type { Product } from '~/shared/types'
import type { CatalogResponse } from '~/services/public'
import { getShopCatalog } from '~/shared/api/gallery'
import { formatKES } from '~/utils/formatters'
import { useQuoteDraftStore } from '~/stores/quoteDraft'
import { useAuthStore } from '~/stores/auth'

definePageMeta({ layout: 'default' })

const route = useRoute()
const shopSlug = computed(() => String(route.params.shopSlug))
const quoteDraftStore = useQuoteDraftStore()
const authStore = useAuthStore()
const toast = useToast()
const { getMediaUrl } = useApi()

const catalog = ref<CatalogResponse | null>(null)
const loading = ref(true)
const fetchError = ref<string | null>(null)
const addingProductId = ref<number | null>(null)
const categoryFilter = ref('')

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

async function onAddToQuote(product: Product) {
  addingProductId.value = product.id
  try {
    await quoteDraftStore.addToQuote(product.id, shopSlug.value, product.pricing_mode)
    toast.add({ title: 'Added to Quote', description: `${product.name} added.` })
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
          class="inline-flex items-center gap-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-flamingo-600 dark:hover:text-flamingo-400"
        >
          <UIcon name="i-lucide-arrow-left" class="h-4 w-4" />
          Back to shops
        </NuxtLink>
        <div v-if="catalog?.shop" class="flex items-center gap-2">
          <span class="text-gray-400">·</span>
          <h1 class="text-xl font-bold text-gray-900 dark:text-white">
            {{ catalog.shop.name }}
          </h1>
        </div>
      </div>
      <NuxtLink v-if="catalog?.shop" :to="`/shops/${shopSlug}`" class="text-sm text-flamingo-600 dark:text-flamingo-400 hover:underline">
        Open full shop
      </NuxtLink>
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

    <div v-else-if="!products.length" class="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-12 text-center">
      <UIcon name="i-lucide-package" class="mx-auto h-16 w-16 text-gray-300 dark:text-gray-600" />
      <h3 class="mt-4 text-lg font-medium text-gray-700 dark:text-gray-300">No products yet</h3>
      <p class="mt-2 text-sm text-gray-500 dark:text-gray-400">
        {{ categoryFilter ? 'No products in this category.' : 'This shop has not added any products.' }}
      </p>
    </div>

    <!-- Product grid -->
    <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <article
        v-for="product in products"
        :key="product.id"
        class="group rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 overflow-hidden shadow-sm hover:shadow-md hover:border-flamingo-200 dark:hover:border-flamingo-800/50 transition-all"
      >
        <!-- Product image or placeholder -->
        <div class="relative aspect-[4/3] bg-gray-100 dark:bg-gray-800 overflow-hidden">
          <NuxtImg
            v-if="productImageUrl(product)"
            :src="productImageUrl(product)!"
            :alt="product.name"
            class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div
            v-else
            class="absolute inset-0 flex items-center justify-center"
          >
            <UIcon name="i-lucide-package" class="h-16 w-16 text-gray-300 dark:text-gray-600" />
          </div>
        </div>
        <div class="p-5">
          <h3 class="font-bold text-gray-900 dark:text-white group-hover:text-flamingo-600 dark:group-hover:text-flamingo-400 transition-colors">
            {{ product.name }}
          </h3>
          <p v-if="product.category" class="mt-0.5 text-sm text-gray-500 dark:text-gray-400">
            {{ product.category }}
          </p>
          <p v-if="product.description" class="mt-2 text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
            {{ product.description }}
          </p>
          <div class="mt-4 flex items-center justify-between gap-2">
            <div class="min-w-0">
              <div class="text-lg font-bold text-flamingo-600 dark:text-flamingo-400">
                {{ priceDisplay(product) }}
              </div>
              <p
                v-if="pricingExplanation(product)"
                class="mt-0.5 text-xs text-gray-500 dark:text-gray-400 line-clamp-2"
                :title="pricingExplanation(product)!"
              >
                {{ pricingExplanation(product) }}
              </p>
            </div>
            <UButton
              color="primary"
              variant="soft"
              size="sm"
              :loading="addingProductId === product.id"
              :disabled="!!addingProductId"
              @click="onAddToQuote(product)"
            >
              <UIcon name="i-lucide-plus" class="h-4 w-4 mr-1" />
              Add to Quote
            </UButton>
          </div>
        </div>
      </article>
    </div>
  </div>
</template>
