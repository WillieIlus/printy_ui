<script setup lang="ts">
import type { Product } from '~/shared/types'
import { getAllProducts } from '~/shared/api/gallery'
definePageMeta({ layout: 'default' })

const { getMediaUrl } = useApi()
const toast = useToast()

const products = ref<Product[]>([])
const loading = ref(true)
const fetchError = ref<string | null>(null)
const categoryFilter = ref('')

const tweakModalOpen = ref(false)
const tweakProduct = ref<Product | null>(null)
const tweakShopSlug = ref('')
const detailsModalOpen = ref(false)
const detailsProduct = ref<Product | null>(null)

function productCategoryName(p: Product): string {
  const c = p.category
  if (typeof c === 'string') return c.trim()
  if (c && typeof c === 'object' && 'name' in c && typeof (c as { name: string }).name === 'string') {
    return (c as { name: string }).name.trim()
  }
  return ''
}

const filteredProducts = computed(() => {
  if (!categoryFilter.value) return products.value
  return products.value.filter((p) => productCategoryName(p).toLowerCase() === categoryFilter.value.toLowerCase())
})

const categories = computed(() => {
  const cats = new Set<string>()
  for (const p of products.value) {
    const name = productCategoryName(p)
    if (name) cats.add(name)
  }
  return Array.from(cats).sort()
})

function productImageUrl(product: Product): string | null {
  const path = product.primary_image
  if (!path) return null
  if (path.startsWith('http')) return path
  return getMediaUrl(path)
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

function openDetails(product: Product, event?: Event) {
  if (event) event.stopPropagation()
  detailsProduct.value = product
  detailsModalOpen.value = true
}

function openTweak(product: Product, event?: Event) {
  if (event) event.stopPropagation()
  if (!product.shop?.slug) {
    toast.add({ title: 'No shop', description: 'This product is not linked to a shop.', color: 'error' })
    return
  }
  tweakProduct.value = product
  tweakShopSlug.value = product.shop.slug
  tweakModalOpen.value = true
}

function onDetailsTweak() {
  if (detailsProduct.value?.shop?.slug) {
    tweakProduct.value = detailsProduct.value
    tweakShopSlug.value = detailsProduct.value.shop.slug
    tweakModalOpen.value = true
  }
}

function onItemAdded() {
  toast.add({ title: 'Added to Quote', description: `${tweakProduct.value?.name ?? 'Product'} added to your quote draft.` })
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
        Browse products from print shops across Kenya. Click any product to customize and add to your quote.
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
        class="group rounded-2xl border border-[var(--p-border)] bg-[var(--p-surface)] overflow-hidden hover:border-flamingo-200 dark:hover:border-flamingo-800/50 transition-all cursor-pointer"
        @click="openDetails(product)"
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
            <span
              class="inline-flex items-center gap-1.5 rounded-full bg-[var(--p-surface)]/90 backdrop-blur-sm border border-[var(--p-border)] px-3 py-1 text-xs font-medium text-[var(--p-text-dim)]"
            >
              <UIcon name="i-lucide-store" class="h-3 w-3" />
              {{ product.shop.name }}
            </span>
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

          <!-- Quote breakdown details -->
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
              <UBadge
                v-for="finish in product.finishing_summary"
                :key="finish"
                variant="soft"
                color="neutral"
                size="xs"
              >
                {{ finish }}
              </UBadge>
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
      :shop-slug="tweakShopSlug"
      :shop-name="tweakProduct?.shop?.name"
      @added="onItemAdded"
    />
  </div>
</template>
