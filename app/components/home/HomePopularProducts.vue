<template>
  <section class="bg-[var(--p-surface)] py-16 sm:py-24">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div class="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div class="max-w-2xl">
          <span class="text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-flamingo-500">
            Popular Products
          </span>
          <h2 class="mt-3 text-3xl font-bold tracking-tight text-[var(--p-text)] sm:text-4xl">
            Start with products people request most often
          </h2>
          <p class="mt-3 text-base leading-7 text-[var(--p-text-muted)]">
            Browse common print jobs first, see entry pricing quickly, and jump into a product page with fewer decisions upfront.
          </p>
        </div>

        <NuxtLink
          to="/gallery"
          class="inline-flex items-center gap-2 self-start rounded-xl border border-flamingo-500/30 bg-flamingo-500/12 px-4 py-2.5 text-sm font-semibold text-flamingo-500 transition-colors hover:bg-flamingo-500/18"
        >
          Browse full gallery
          <UIcon name="i-lucide-arrow-right" class="h-4 w-4 text-flamingo-500" />
        </NuxtLink>
      </div>

      <div class="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
        <NuxtLink
          v-for="product in productCards"
          :key="`${product.shopSlug}-${product.slug}`"
          :to="product.to"
          class="group rounded-2xl border border-[var(--p-border)] bg-[var(--p-surface)] p-1 transition-all duration-300 hover:-translate-y-1 hover:border-flamingo-300/40 hover:bg-[var(--p-surface-container)] dark:hover:border-flamingo-700/40"
        >
          <div class="flex h-full flex-col justify-between rounded-xl bg-[var(--p-surface-sunken)] p-7">
            <div>
              <div class="flex items-start justify-between gap-4">
                <div class="flex h-14 w-14 items-center justify-center rounded-xl bg-flamingo-500/12 shadow-sm transition-transform duration-300 group-hover:scale-105">
                  <UIcon :name="product.icon" class="h-7 w-7 text-flamingo-500" />
                </div>
                <span class="rounded-full bg-[var(--p-surface-container)] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-[var(--p-text-muted)]">
                  {{ product.minQuantityLabel }}
                </span>
              </div>

              <h3 class="mt-7 text-2xl font-bold tracking-tight text-[var(--p-text)]">
                {{ product.title }}
              </h3>
              <p class="mt-2 text-sm leading-6 text-[var(--p-text-muted)]">
                {{ product.description }}
              </p>

              <div class="mt-4 flex flex-wrap items-center gap-3 text-xs text-[var(--p-text-muted)]">
                <span class="font-medium text-[var(--p-text)]">{{ product.shopName }}</span>
                <span class="inline-flex items-center gap-1">
                  <UIcon name="i-lucide-clock-3" class="h-3.5 w-3.5 text-flamingo-500" />
                  {{ product.deliveryLabel }}
                </span>
              </div>

              <div class="mt-6 flex flex-wrap gap-2">
                <span
                  v-for="capsule in product.capsules"
                  :key="capsule"
                  class="rounded-full bg-[var(--p-surface-container)] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-[var(--p-text-muted)]"
                >
                  {{ capsule }}
                </span>
              </div>
            </div>

            <div class="mt-8 flex items-end justify-between border-t border-[var(--p-border)] pt-4">
              <div>
                <p class="text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--p-text-muted)]">
                  From price
                </p>
                <p class="mt-1 text-xl font-extrabold text-flamingo-500">{{ product.priceLabel }}</p>
                <p class="mt-1 text-xs text-[var(--p-text-muted)]">{{ product.minQuantityLabel }}</p>
              </div>

              <span class="flex h-12 w-12 items-center justify-center rounded-full bg-flamingo-500 text-white transition-transform group-hover:translate-x-0.5">
                <UIcon name="i-lucide-arrow-right" class="h-5 w-5" />
              </span>
            </div>
          </div>
        </NuxtLink>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { Product } from '~/shared/types/base'
import { getAllProducts } from '~/shared/api/gallery'
import { formatTurnaroundBadge } from '~/utils/turnaround'

type ProductCard = {
  slug: string
  shopSlug: string
  to: string
  title: string
  description: string
  icon: string
  capsules: string[]
  priceLabel: string
  deliveryLabel: string
  shopName: string
  minQuantityLabel: string
}

const { data: productsData } = await useAsyncData('home-public-products', () => getAllProducts())

const products = computed(() => productsData.value ?? [])

const productCards = computed<ProductCard[]>(() => {
  return products.value
    .filter((product) => product.slug && product.shop?.slug)
    .slice(0, 6)
    .map((product) => ({
      slug: product.slug!,
      shopSlug: product.shop!.slug,
      to: `/products/${product.slug}`,
      title: product.name,
      description: trimDescription(product.description, productCategoryName(product)),
      icon: iconForProduct(product),
      capsules: capsulesForProduct(product),
      priceLabel: productPriceLabel(product),
      deliveryLabel: formatTurnaroundBadge(
        product.turnaround_hours ?? (product.turnaround_days ? product.turnaround_days * 8 : null),
        product.turnaround_label,
      ),
      shopName: product.shop!.name,
      minQuantityLabel: minimumQuantityLabel(product.min_quantity),
    }))
})

function productCategoryName(product: Product) {
  const category = product.category
  if (typeof category === 'string') return category.trim()
  if (category && typeof category === 'object' && 'name' in category && typeof category.name === 'string') {
    return category.name.trim()
  }
  return ''
}

function trimDescription(description?: string, category?: string) {
  const text = (description || '').trim()
  if (text) return text.length > 110 ? `${text.slice(0, 107)}...` : text
  if (category) return `${category} print product with live pricing signals and quote-ready setup.`
  return 'Live product listing with quote-ready setup and clear pricing cues.'
}

function productPriceLabel(product: Product) {
  const direct = product.price_hint?.price_display
  if (direct) return direct.replace(/\bKSh\b/gi, 'KES')

  const low = product.price_range_est?.lowest?.total
  const high = product.price_range_est?.highest?.total
  if (low && high && Number(high) > Number(low)) {
    return `KES ${formatNumber(low)} - ${formatNumber(high)}`
  }
  if (low) return `KES ${formatNumber(low)}`

  const hintLow = product.price_hint?.min_price
  const hintHigh = product.price_hint?.max_price
  if (hintLow != null && hintHigh != null && Number(hintHigh) > Number(hintLow)) {
    return `KES ${formatNumber(hintLow)} - ${formatNumber(hintHigh)}`
  }
  if (hintLow != null) return `KES ${formatNumber(hintLow)}`

  return 'Price on request'
}

function minimumQuantityLabel(quantity?: number | null) {
  if (!quantity) return 'Minimum on request'
  return `Min ${formatNumber(quantity)}`
}

function capsulesForProduct(product: Product) {
  const capsules: string[] = []
  const category = productCategoryName(product)
  if (category) capsules.push(category)
  capsules.push(modeLabelForProduct(product))
  if (product.min_quantity) capsules.push(`Min ${formatNumber(product.min_quantity)}`)
  return capsules.slice(0, 3)
}

function modeLabelForProduct(product: Product) {
  if (product.pricing_mode === 'LARGE_FORMAT') return 'Large Format'
  if (product.product_kind === 'BOOKLET') return 'Booklet'
  return 'Sheet Print'
}

function formatNumber(value: string | number) {
  const amount = typeof value === 'number' ? value : Number.parseFloat(value)
  if (!Number.isFinite(amount)) return value
  return new Intl.NumberFormat('en-KE', { maximumFractionDigits: 0 }).format(amount)
}

function iconForProduct(product: Product) {
  const key = `${product.slug ?? ''} ${product.name} ${productCategoryName(product)}`.toLowerCase()
  if (product.product_kind === 'BOOKLET' || key.includes('booklet')) return 'i-lucide-book-open'
  if (key.includes('business')) return 'i-lucide-credit-card'
  if (key.includes('flyer')) return 'i-lucide-file-text'
  if (key.includes('brochure')) return 'i-lucide-book-open'
  if (key.includes('sticker') || key.includes('label')) return 'i-lucide-sticker'
  if (key.includes('banner')) return 'i-lucide-panel-top'
  if (key.includes('receipt')) return 'i-lucide-receipt'
  if (key.includes('poster')) return 'i-lucide-image'
  return 'i-lucide-package'
}
</script>
