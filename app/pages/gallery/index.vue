<script setup lang="ts">
import type { Product } from '~/shared/types'
import { getAllProducts } from '~/shared/api/gallery'
import { formatKES } from '~/utils/formatters'
import { useQuoteDraftStore } from '~/stores/quoteDraft'
import { useAuthStore } from '~/stores/auth'

definePageMeta({ layout: 'default' })

const { getMediaUrl } = useApi()
const quoteDraftStore = useQuoteDraftStore()
const authStore = useAuthStore()
const toast = useToast()

const products = ref<Product[]>([])
const loading = ref(true)
const fetchError = ref<string | null>(null)
const categoryFilter = ref('')
const addingProductId = ref<number | null>(null)

const filteredProducts = computed(() => {
  if (!categoryFilter.value) return products.value
  return products.value.filter((p) => p.category?.toLowerCase() === categoryFilter.value.toLowerCase())
})

const categories = computed(() => {
  const cats = new Set<string>()
  for (const p of products.value) {
    if (p.category?.trim()) cats.add(p.category.trim())
  }
  return Array.from(cats).sort()
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

async function onAddToQuote(product: Product) {
  if (!product.shop?.slug) return
  addingProductId.value = product.id
  try {
    await quoteDraftStore.addToQuote(product.id, product.shop.slug, product.pricing_mode)
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

async function fetchProducts() {
  loading.value = true
  fetchError.value = null
  try {
    products.value = await getAllProducts()
  } catch {
    products.value = []
    fetchError.value = 'Failed to load products'
  } finally {
    loading.value = false
  }
}

onMounted(fetchProducts)
</script>

<template>
  <div class="py-8 sm:py-12">
    <div class="mb-8">
      <h1 class="text-3xl font-extrabold tracking-tight text-[var(--p-text)] sm:text-4xl">
        Product Gallery
      </h1>
      <p class="mt-2 text-lg text-[var(--p-text-muted)]">
        Browse products from print shops across Kenya.
      </p>
    </div>

    <!-- Category pills -->
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
      v-else-if="fetchError || !products.length"
      :title="fetchError ? 'Could not load products' : 'No products available yet'"
      :description="fetchError ? 'Something went wrong. Please try again later.' : 'Check back later for new products.'"
      icon="i-lucide-package"
    />

    <!-- Product grid -->
    <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <article
        v-for="product in filteredProducts"
        :key="product.id"
        class="group rounded-2xl border border-[var(--p-border)] bg-[var(--p-surface)] overflow-hidden hover:border-flamingo-200 dark:hover:border-flamingo-800/50 transition-all"
      >
        <!-- Product image or placeholder -->
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
          <!-- Shop label -->
          <div v-if="product.shop" class="absolute top-3 left-3">
            <NuxtLink
              :to="`/gallery/${product.shop.slug}`"
              class="inline-flex items-center gap-1.5 rounded-full bg-[var(--p-surface)]/90 backdrop-blur-sm border border-[var(--p-border)] px-3 py-1 text-xs font-medium text-[var(--p-text-dim)] hover:text-flamingo-600 transition-colors"
            >
              <UIcon name="i-lucide-store" class="h-3 w-3" />
              {{ product.shop.name }}
            </NuxtLink>
          </div>
        </div>
        <div class="p-5">
          <h3 class="font-bold text-[var(--p-text)] group-hover:text-flamingo-600 dark:group-hover:text-flamingo-400 transition-colors">
            {{ product.name }}
          </h3>
          <p v-if="product.category" class="mt-0.5 text-sm text-[var(--p-text-muted)]">
            {{ product.category }}
          </p>
          <p v-if="product.description" class="mt-2 text-sm text-[var(--p-text-muted)] line-clamp-2">
            {{ product.description }}
          </p>
          <div class="mt-4 flex items-center justify-between gap-2">
            <div class="text-lg font-bold text-flamingo-600 dark:text-flamingo-400">
              {{ priceDisplay(product) }}
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
              Quote
            </UButton>
          </div>
        </div>
      </article>
    </div>
  </div>
</template>
