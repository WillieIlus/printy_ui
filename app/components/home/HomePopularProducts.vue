<template>
  <section class="bg-[var(--p-surface)] py-16 sm:py-24">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div class="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div class="max-w-2xl">
          <span class="text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-[var(--p-primary)]">
            Popular Products
          </span>
          <h2 class="mt-3 text-3xl font-bold tracking-tight text-[var(--p-text)] sm:text-4xl">
            Live catalog products, presented with a cleaner corporate edge
          </h2>
          <p class="mt-3 text-base leading-7 text-[var(--p-text-muted)]">
            This section now pulls from real product and shop data, while staying close to the tonal stitch layout.
          </p>
        </div>
        <NuxtLink
          to="/gallery"
          class="inline-flex items-center gap-2 self-start rounded-xl border border-[var(--p-border)] bg-[var(--p-surface-sunken)] px-4 py-2.5 text-sm font-semibold text-[var(--p-text)] transition-colors hover:bg-[var(--p-surface)]"
        >
          Browse full gallery
          <UIcon name="i-lucide-arrow-right" class="h-4 w-4" />
        </NuxtLink>
      </div>

      <div class="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3">
        <NuxtLink
          v-for="product in productCards"
          :key="`${product.shopSlug}-${product.slug}`"
          :to="product.to"
          class="group relative rounded-2xl bg-[var(--p-surface)] p-1 transition-all duration-300 hover:-translate-y-1 hover:bg-[var(--p-surface-container)]"
        >
          <div class="flex h-full flex-col justify-between rounded-xl bg-[var(--p-surface-sunken)] p-8">
            <div>
              <div class="mb-8 flex h-14 w-14 items-center justify-center rounded-xl bg-white shadow-sm transition-transform duration-300 group-hover:scale-105">
                <UIcon :name="product.icon" class="h-7 w-7 text-[var(--p-primary)]" />
              </div>

              <h3 class="text-2xl font-bold tracking-tight text-[var(--p-text)]">{{ product.title }}</h3>
              <p class="mt-2 text-sm leading-6 text-[var(--p-text-muted)]">{{ product.description }}</p>
              <div class="mt-4 flex items-center gap-3 text-xs text-[var(--p-text-muted)]">
                <span class="font-medium text-[var(--p-text)]">{{ product.shopName }}</span>
                <span v-if="product.ratingLabel" class="inline-flex items-center gap-1 text-amber-600">
                  <UIcon name="i-lucide-star" class="h-3.5 w-3.5 fill-current" />
                  {{ product.ratingLabel }}
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

            <div class="mt-8 flex items-center justify-between border-t border-white/50 pt-4">
              <div>
                <p class="text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--p-text-muted)]">Starting from</p>
                <p class="mt-1 text-xl font-extrabold text-[var(--p-text)]">{{ product.priceLabel }}</p>
                <p class="mt-1 text-xs text-[var(--p-text-muted)]">{{ product.deliveryLabel }}</p>
              </div>
              <span class="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--p-primary)] text-white transition-transform group-hover:translate-x-0.5">
                <UIcon name="i-lucide-arrow-right" class="h-5 w-5" />
              </span>
            </div>
          </div>
        </NuxtLink>

        <div class="overflow-hidden rounded-3xl bg-[var(--p-text)] text-white md:col-span-2 xl:col-span-1">
          <div class="relative h-full p-10">
            <div class="absolute right-0 top-0 h-40 w-40 rounded-full bg-white/10 blur-3xl" />
            <div class="relative z-10 flex h-full flex-col justify-between">
              <div>
                <span class="inline-flex rounded-full bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-white/80">
                  Custom Work
                </span>
                <h3 class="mt-6 text-3xl font-bold tracking-tight text-white">Can&apos;t find what you&apos;re looking for?</h3>
                <p class="mt-4 text-base leading-7 text-slate-300">
                  Request a custom quote for bespoke packaging, specialty finishing, unusual dimensions, or multi-part jobs.
                </p>
              </div>

              <div class="mt-8">
                <NuxtLink
                  to="/quotes/create"
                  class="inline-flex items-center gap-3 rounded-xl bg-white px-6 py-4 text-sm font-bold text-[var(--p-text)] transition-colors hover:bg-slate-100"
                >
                  Request Custom Quote
                  <UIcon name="i-lucide-arrow-right" class="h-4 w-4" />
                </NuxtLink>
              </div>
            </div>
          </div>
        </div>
      </div>

      <section class="mt-20">
        <div class="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div class="max-w-2xl">
            <span class="text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-[var(--p-primary)]">
              Quote-Ready Shops
            </span>
            <h3 class="mt-3 text-3xl font-bold tracking-tight text-[var(--p-text)]">Nearby quote opportunities from active shops</h3>
            <p class="mt-3 text-base leading-7 text-[var(--p-text-muted)]">
              This borrows the stronger quote-card structure from the stitch references, but uses live shop and product records.
            </p>
          </div>
          <NuxtLink
            to="/shops"
            class="inline-flex items-center gap-2 self-start rounded-xl border border-[var(--p-border)] bg-[var(--p-surface-sunken)] px-4 py-2.5 text-sm font-semibold text-[var(--p-text)] transition-colors hover:bg-[var(--p-surface)]"
          >
            View shops
            <UIcon name="i-lucide-arrow-right" class="h-4 w-4" />
          </NuxtLink>
        </div>

        <div class="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div
            v-for="quote in quoteCards"
            :key="`${quote.shopSlug}-${quote.productSlug}`"
            class="rounded-xl border border-[var(--p-border)] bg-[var(--p-surface)] p-6 shadow-[0px_20px_40px_rgba(20,27,44,0.04)] transition-colors hover:bg-[var(--p-surface-sunken)]"
          >
            <div class="mb-6 flex items-start justify-between gap-4">
              <div class="flex h-12 w-12 items-center justify-center rounded-lg bg-[var(--p-surface-container)]">
                <UIcon :name="quote.icon" class="h-6 w-6 text-[var(--p-primary)]" />
              </div>
              <div class="rounded-full bg-[var(--p-surface-sunken)] px-2.5 py-1 text-[12px] font-bold text-[var(--p-text)]">
                {{ quote.badge }}
              </div>
            </div>

            <h4 class="text-xl font-bold text-[var(--p-text)]">{{ quote.shopName }}</h4>
            <p class="mt-1 text-sm text-[var(--p-text-muted)]">{{ quote.productTitle }}</p>
            <div v-if="quote.ratingLabel" class="mt-3 inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-2.5 py-1 text-[12px] font-semibold text-amber-700">
              <UIcon name="i-lucide-star" class="h-4 w-4 fill-current" />
              {{ quote.ratingLabel }}
            </div>

            <div class="mt-5 space-y-3">
              <div class="flex items-center justify-between text-sm">
                <span class="text-[var(--p-text-muted)]">Estimated Price</span>
                <span class="font-bold text-[var(--p-text)]">{{ quote.priceLabel }}</span>
              </div>
              <div class="flex items-center justify-between text-sm">
                <span class="text-[var(--p-text-muted)]">Delivery Time</span>
                <span class="flex items-center gap-1 font-medium text-[var(--p-text)]">
                  <UIcon name="i-lucide-clock-3" class="h-4 w-4" />
                  {{ quote.deliveryLabel }}
                </span>
              </div>
            </div>

            <NuxtLink
              :to="quote.to"
              class="mt-7 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--p-text)] px-4 py-3 text-sm font-bold text-white transition-colors hover:bg-[var(--p-primary)]"
            >
              Request Quote
              <UIcon name="i-lucide-arrow-right" class="h-4 w-4" />
            </NuxtLink>
          </div>

          <div class="overflow-hidden rounded-xl bg-[var(--p-text)] text-white lg:col-span-2">
            <div class="relative h-full">
              <div class="absolute right-0 top-0 h-full w-1/3 opacity-20">
                <div class="absolute inset-0 bg-gradient-to-l from-[var(--p-primary)] to-transparent" />
              </div>
              <div class="relative z-10 flex h-full flex-col gap-8 p-10 md:flex-row md:items-center md:justify-between md:p-14">
                <div class="max-w-xl">
                  <span class="inline-flex rounded-full bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-white/80">
                    Open Request
                  </span>
                  <h3 class="mt-5 text-3xl font-bold tracking-tight text-white">Send one brief and let multiple shops respond</h3>
                  <p class="mt-4 text-base leading-7 text-slate-300">
                    Use a single request for jobs that are too custom for fixed pricing, then compare replies from available print shops.
                  </p>
                  <NuxtLink
                    to="/quotes/create"
                    class="mt-8 inline-flex items-center gap-3 rounded-xl bg-white px-6 py-4 text-sm font-bold text-[var(--p-text)] transition-colors hover:bg-slate-100"
                  >
                    Start Custom Request
                    <UIcon name="i-lucide-arrow-right" class="h-4 w-4" />
                  </NuxtLink>
                </div>

                <div class="hidden w-full max-w-[220px] grid-cols-2 gap-3 md:grid">
                  <div class="aspect-square rounded-lg bg-white/8" />
                  <div class="aspect-square rounded-lg bg-white/12" />
                  <div class="aspect-square rounded-lg bg-white/12" />
                  <div class="aspect-square rounded-lg bg-white/8" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { Product, ShopPublic } from '~/shared/types/base'
import { listShops } from '~/services/public'
import { getRatingSummary, type RatingSummary } from '~/services/ratings'
import { getAllProducts } from '~/shared/api/gallery'

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
  ratingLabel: string | null
}

type QuoteCard = {
  shopSlug: string
  shopName: string
  productSlug: string
  productTitle: string
  priceLabel: string
  deliveryLabel: string
  badge: string
  icon: string
  to: string
  ratingLabel: string | null
}

const { data: productsData } = await useAsyncData('home-public-products', () => getAllProducts())
const { data: shopsData } = await useAsyncData('home-public-shops', () => listShops())
const { data: ratingSummaries } = await useAsyncData('home-rating-summaries', async () => {
  const products = await getAllProducts()
  const slugs = [...new Set(products.map((product) => product.shop?.slug).filter(Boolean) as string[])]
  const summaries = await Promise.all(
    slugs.map(async (slug) => ({ slug, summary: await getRatingSummary(slug) }))
  )
  return Object.fromEntries(
    summaries
      .filter((entry) => entry.summary && entry.summary.count > 0)
      .map((entry) => [entry.slug, entry.summary as RatingSummary])
  )
})

const products = computed(() => productsData.value ?? [])
const shops = computed(() => shopsData.value ?? [])
const ratings = computed<Record<string, RatingSummary>>(() => ratingSummaries.value ?? {})

const productCards = computed<ProductCard[]>(() => {
  return products.value
    .filter((product) => product.slug && product.shop?.slug)
    .slice(0, 5)
    .map((product) => ({
      slug: product.slug!,
      shopSlug: product.shop!.slug,
      to: `/products/${product.slug}`,
      title: product.name,
      description: trimDescription(product.description, productCategoryName(product)),
      icon: iconForProduct(product),
      capsules: capsulesForProduct(product),
      priceLabel: productPriceLabel(product),
      deliveryLabel: turnaroundLabel(product.turnaround_days),
      shopName: product.shop!.name,
      ratingLabel: ratingLabel(product.shop!.slug),
    }))
})

const quoteCards = computed<QuoteCard[]>(() => {
  return products.value
    .filter((product) => product.shop?.slug)
    .slice(0, 3)
    .map((product) => ({
      shopSlug: product.shop!.slug,
      shopName: product.shop!.name,
      productSlug: product.slug ?? String(product.id),
      productTitle: product.name,
      priceLabel: productPriceLabel(product),
      deliveryLabel: turnaroundLabel(product.turnaround_days),
      badge: shopBadge(product.shop, shops.value),
      icon: iconForProduct(product),
      to: `/shops/${product.shop!.slug}`,
      ratingLabel: ratingLabel(product.shop!.slug),
    }))
})

function ratingLabel(shopSlug?: string) {
  if (!shopSlug) return null
  const summary = ratings.value[shopSlug]
  if (!summary?.count) return null
  return `${summary.average.toFixed(1)} (${summary.count})`
}

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
  if (direct) return direct

  const low = product.price_range_est?.lowest?.total
  if (low) return `From KSh ${formatNumber(low)}`

  const hintLow = product.price_hint?.min_price
  if (hintLow != null) return `From KSh ${formatNumber(hintLow)}`

  return 'Price on request'
}

function turnaroundLabel(days?: number | null) {
  if (!days) return 'On request'
  return `${days} business day${days === 1 ? '' : 's'}`
}

function capsulesForProduct(product: Product) {
  const capsules: string[] = []
  const category = productCategoryName(product)
  if (category) capsules.push(category)
  capsules.push(product.pricing_mode === 'LARGE_FORMAT' ? 'Large Format' : 'Sheet Print')
  if (product.min_quantity) capsules.push(`Min ${product.min_quantity}`)
  return capsules.slice(0, 3)
}

function shopBadge(shop: Product['shop'], publicShops: ShopPublic[]) {
  const current = publicShops.find((entry) => entry.slug === shop?.slug)
  if (current?.status === 'opening') return 'Open now'
  if (current?.status === 'closing_soon') return 'Closing soon'
  if (current?.status === 'closed') return 'Offline'
  return 'Quote ready'
}

function formatNumber(value: string | number) {
  const amount = typeof value === 'number' ? value : Number.parseFloat(value)
  if (!Number.isFinite(amount)) return value
  return new Intl.NumberFormat('en-KE', { maximumFractionDigits: 0 }).format(amount)
}

function iconForProduct(product: Product) {
  const key = `${product.slug ?? ''} ${product.name} ${productCategoryName(product)}`.toLowerCase()
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
