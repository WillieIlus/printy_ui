<script setup lang="ts">
import type { Product } from '~/shared/types'
import { useAnalyticsTracking } from '~/composables/useAnalyticsTracking'
import { productCategoryName } from '~/utils/product'
import { resolveProductImageUrl } from '~/utils/productVisual'

definePageMeta({ layout: 'default' })

const { getMediaUrl } = useApi()
const toast = useToast()
const { trackProductView, trackQuoteStart } = useAnalyticsTracking()
const {
  data: products,
  pending: loading,
  error,
  refresh,
  publicProducts,
  categories,
} = await usePublicProducts({ key: 'gallery-public-products' })

const categoryFilter = ref('')
const tweakModalOpen = ref(false)
const tweakProduct = ref<Product | null>(null)
const tweakShopSlug = ref('')
const detailsModalOpen = ref(false)
const detailsProduct = ref<Product | null>(null)

const filteredProducts = computed(() => {
  if (!categoryFilter.value) return publicProducts.value
  return publicProducts.value.filter((product) =>
    productCategoryName(product).toLowerCase() === categoryFilter.value.toLowerCase(),
  )
})

const detailsProductImageUrl = computed(() =>
  detailsProduct.value ? resolveProductImageUrl(detailsProduct.value.primary_image, getMediaUrl) : null,
)

function openDetails(product: Product, event?: Event) {
  if (event) event.stopPropagation()
  detailsProduct.value = product
  detailsModalOpen.value = true
  void trackProductView({
    source: 'gallery_details_modal',
    product_id: product.id,
    product_name: product.name,
    product_slug: product.slug,
    shop_slug: product.shop?.slug,
  }, {
    onceKey: `gallery-product-view:${product.id}`,
  })
}

function openTweak(product: Product, event?: Event) {
  if (event) {
    event.stopPropagation()
    event.preventDefault()
  }
  if (!product.shop?.slug) {
    toast.add({ title: 'No shop', description: 'This product is not linked to a shop.', color: 'error' })
    return
  }

  tweakProduct.value = product
  tweakShopSlug.value = product.shop.slug

  void trackProductView({
    source: 'gallery_tweak_entry',
    product_id: product.id,
    product_name: product.name,
    product_slug: product.slug,
    shop_slug: product.shop.slug,
  }, {
    onceKey: `gallery-product-view:${product.id}`,
  })

  void trackQuoteStart({
    source: 'gallery_tweak',
    product_id: product.id,
    product_name: product.name,
    product_slug: product.slug,
    shop_slug: product.shop.slug,
  }, {
    onceKey: `gallery-quote-start:${product.id}`,
  })

  nextTick(() => {
    tweakModalOpen.value = true
  })
}

function onDetailsTweak() {
  if (!detailsProduct.value?.shop?.slug) return

  detailsModalOpen.value = false
  tweakProduct.value = detailsProduct.value
  tweakShopSlug.value = detailsProduct.value.shop.slug

  nextTick(() => {
    tweakModalOpen.value = true
  })
}

function onItemAdded() {
  toast.add({ title: 'Added to draft', description: `${tweakProduct.value?.name ?? 'Product'} added to your draft.` })
}

usePrintySeo({
  title: 'Products',
  description: 'Browse print products from shops across Kenya, open the shared calculator when needed, then customize and add to your quote.',
  path: '/gallery',
  breadcrumbs: [
    { name: 'Home', path: '/' },
    { name: 'Products', path: '/gallery' },
  ],
})
</script>

<template>
  <div class="py-8 sm:py-12">
    <div class="mb-8">
      <h1 class="text-3xl font-extrabold tracking-tight text-[var(--p-text)] sm:text-4xl">Products</h1>
      <p class="mt-2 text-lg text-[var(--p-text-muted)]">
        Browse products from print shops across Kenya. Open the shared calculator when you need a live estimate, then customize any product into your quote flow.
      </p>
    </div>

    <div class="mb-8">
      <details class="group overflow-hidden rounded-3xl border border-[var(--p-border)] bg-[var(--p-surface)] shadow-sm">
        <summary class="flex cursor-pointer list-none items-center justify-between gap-4 px-6 py-5 marker:hidden">
          <div>
            <p class="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--p-text-muted)]">Shared calculator</p>
            <p class="mt-2 text-lg font-semibold text-[var(--p-text)]">Open pricing workspace</p>
            <p class="mt-1 text-sm text-[var(--p-text-muted)]">Same calculator logic as the homepage, kept collapsed here to preserve a cleaner products surface.</p>
          </div>
          <span class="inline-flex shrink-0 items-center gap-1.5 rounded-xl border border-flamingo-500 bg-flamingo-500 px-4 py-2 text-sm font-semibold text-white transition-colors hover:border-flamingo-400 hover:bg-flamingo-400 group-open:border-[var(--p-border)] group-open:bg-transparent group-open:text-[var(--p-text-muted)] group-open:hover:bg-[var(--p-surface)]">
            <span class="group-open:hidden">Open calculator</span>
            <span class="hidden group-open:inline">Collapse</span>
            <UIcon name="i-lucide-chevron-down" class="h-4 w-4 shrink-0 transition-transform duration-200 group-open:rotate-180" />
          </span>
        </summary>
        <div class="border-t border-[var(--p-border)] px-6 py-6">
          <QuotesCalculatorHub>
            <template #flat>
              <QuotesPublicCalculator
                anchor-id="gallery-marketplace-calculator"
                title="Products calculator"
                description="Run the same shared pricing flow from the homepage here, then jump into tweak flows from any product card."
                eyebrow="Products Calculator"
                mode="marketplace"
              />
            </template>
            <template #booklet>
              <QuotesBookletCalculator
                anchor-id="gallery-marketplace-calculator"
                title="Products booklet calculator"
                description="Run the shared booklet preview here, then continue into tweak flows from any product card."
                eyebrow="Products Booklet"
              />
            </template>
            <template #large_format>
              <QuotesLargeFormatCalculator
                anchor-id="gallery-marketplace-calculator"
                title="Products large-format calculator"
                description="Run the shared large-format preview here, then continue into tweak flows from any product card."
                eyebrow="Products Large Format"
              />
            </template>
          </QuotesCalculatorHub>
        </div>
      </details>
    </div>

    <div v-if="categories.length" class="mb-6 flex flex-wrap gap-2">
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
        v-for="category in categories"
        :key="category"
        :variant="categoryFilter === category ? 'solid' : 'outline'"
        :color="categoryFilter === category ? 'primary' : 'neutral'"
        size="sm"
        class="rounded-full"
        @click="categoryFilter = category"
      >
        {{ category }}
      </UButton>
    </div>

    <CommonLoadingSpinner v-if="loading" />

    <CommonEmptyState
      v-else-if="error || !publicProducts.length"
      :title="error ? 'Could not load products' : 'No public products available yet'"
      :description="error ? 'Something went wrong while loading products.' : 'Check back later for new products.'"
      icon="i-lucide-package"
    >
      <UButton v-if="error" color="primary" @click="() => refresh()">Try again</UButton>
    </CommonEmptyState>

    <div v-else class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      <ProductsProductGalleryCard
        v-for="product in filteredProducts"
        :key="product.id"
        :product="product"
        action-label="Tweak"
        @select="openDetails(product, $event)"
        @action="openTweak(product, $event)"
      />
    </div>

    <div
      v-if="!loading && filteredProducts.length"
      class="mt-10 overflow-hidden rounded-3xl border border-mirage-800/60 bg-mirage-950 text-white shadow-[0_24px_60px_rgba(16,24,40,0.28)]"
    >
      <div class="relative p-8 sm:p-10">
        <div class="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-flamingo-500/18 blur-3xl" />
        <div class="absolute bottom-0 left-0 h-28 w-28 rounded-full bg-mirage-500/18 blur-3xl" />

        <div class="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div class="max-w-2xl">
            <span class="inline-flex rounded-full bg-flamingo-500/12 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-flamingo-400">
              Custom sourcing
            </span>
            <h2 class="mt-5 text-3xl font-extrabold tracking-tight sm:text-4xl">
              Can&apos;t find what you&apos;re looking for?
            </h2>
            <p class="mt-4 text-base leading-7 text-slate-300">
              Send a custom request through the same shared request flow and get competitive bids from matching vendors within minutes.
            </p>
          </div>

          <NuxtLink
            to="/gallery#gallery-marketplace-calculator"
            class="cta-button inline-flex items-center justify-center gap-2 rounded-2xl bg-flamingo-500 px-6 py-4 text-sm font-bold text-white transition-colors hover:bg-flamingo-400"
          >
            Send custom request
            <UIcon name="i-lucide-send" class="h-4 w-4" />
          </NuxtLink>
        </div>
      </div>
    </div>

    <GalleryProductDetailModal
      v-model="detailsModalOpen"
      :product="detailsProduct"
      :product-image-url="detailsProductImageUrl"
      @tweak="onDetailsTweak"
    />

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
