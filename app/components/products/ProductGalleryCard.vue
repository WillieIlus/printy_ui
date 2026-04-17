<template>
  <NuxtLink
    :to="to"
    class="group flex flex-col overflow-hidden rounded-2xl border border-[var(--p-border)] bg-[var(--p-surface)] transition-all duration-200 hover:-translate-y-0.5 hover:border-flamingo-200 dark:hover:border-flamingo-800/50 hover:shadow-md"
  >
    <!-- ── Image / fallback ──────────────────────────────────────────── -->
    <div class="relative aspect-[4/3] overflow-hidden bg-[var(--p-surface-sunken)]">
      <!--
        Image with error tracking. When the image fails (broken URL, 404,
        CORS), imageError flips to true and the gradient fallback below takes
        over — no broken-image icon ever appears.
      -->
      <img
        v-if="imageSrc && !imageError"
        :src="imageSrc"
        :alt="product.name"
        class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        loading="lazy"
        @error="imageError = true"
      />
      <!--
        Gradient + icon fallback. Product type is inferred from name/slug/
        category so each card has a distinct colour identity even without an
        uploaded image.
      -->
      <div
        v-else
        class="flex h-full w-full items-center justify-center transition-transform duration-300 group-hover:scale-105"
        :class="visual.gradientClass"
      >
        <UIcon :name="visual.icon" class="h-10 w-10 opacity-75" :class="visual.iconColorClass" />
      </div>

      <!-- Category badge overlay (top-left, matches gallery page position) -->
      <span
        v-if="categoryName"
        class="absolute left-3 top-3 rounded-full bg-black/40 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.08em] text-white backdrop-blur-sm"
      >
        {{ categoryName }}
      </span>
    </div>

    <!-- ── Card body ─────────────────────────────────────────────────── -->
    <div class="flex flex-1 flex-col p-4 sm:p-5">

      <!-- Title -->
      <h3 class="font-bold text-[var(--p-text)] transition-colors group-hover:text-flamingo-600 dark:group-hover:text-flamingo-400">
        {{ product.name }}
      </h3>
      <!-- Category as subtitle below name -->
      <p v-if="categoryName" class="mt-0.5 text-sm text-[var(--p-text-muted)]">
        {{ categoryName }}
      </p>

      <!-- ── Metadata rows (mirrors gallery page card structure) ──────── -->
      <div class="mt-3 space-y-1.5">
        <!-- Final finished size, e.g. "90×55mm" -->
        <div v-if="product.final_size" class="flex items-center gap-2 text-xs text-[var(--p-text-muted)]">
          <UIcon name="i-lucide-ruler" class="h-3.5 w-3.5 shrink-0" />
          <span>{{ product.final_size }}</span>
        </div>
        <!-- Sheet imposition, e.g. "SRA3: 10-up" — only for SHEET products -->
        <div v-if="product.imposition_summary" class="flex items-center gap-2 text-xs text-[var(--p-text-muted)]">
          <UIcon name="i-lucide-grid-2x2" class="h-3.5 w-3.5 shrink-0" />
          <span>Fits on {{ product.imposition_summary }}</span>
        </div>
        <!-- Minimum order quantity -->
        <div v-if="product.min_quantity" class="flex items-center gap-2 text-xs text-[var(--p-text-muted)]">
          <UIcon name="i-lucide-hash" class="h-3.5 w-3.5 shrink-0" />
          <span>Min {{ product.min_quantity }} pcs</span>
        </div>
        <!-- Finishing options as UBadge pills -->
        <div v-if="product.finishing_summary?.length" class="mt-1 flex flex-wrap gap-1">
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

      <!-- ── Price + CTA row ──────────────────────────────────────────── -->
      <div class="mt-4 flex items-start justify-between gap-2">
        <div class="min-w-0 flex-1">
          <!--
            Two-tier display when can_calculate === true:
              totalLine  → "KES 5,000 (100 pcs)"  or  "KES 3,500 – 7,000"
              perUnitLine → "KES 50 per item"

            Falls back to a single priceDisplay() string whose priority order is:
              1. price_range_est.price_display   (backend-formatted range)
              2. price_hint.price_display         (backend single price)
              3. From {price_range_est.lowest.total}
              4. From {price_hint.min_price}
              5. "Price on request"  ← only when no pricing signals at all
          -->
          <template v-if="priceSummary">
            <p class="text-base font-bold text-flamingo-600 dark:text-flamingo-400">
              {{ priceSummary.totalLine }}
            </p>
            <p class="mt-0.5 text-xs text-[var(--p-text-muted)]">
              {{ priceSummary.perUnitLine }}
            </p>
          </template>
          <p v-else class="text-base font-bold text-flamingo-600 dark:text-flamingo-400">
            {{ price }}
          </p>
        </div>

        <!--
          CTA pill — flamingo rounded-full, same as gallery page "Tweak" button.
          Because the entire card is a NuxtLink this span navigates to :to
          on click, which is correct for the homepage browse context.
        -->
        <span
          class="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-flamingo-500 px-3 py-1.5 text-xs font-semibold text-white transition-colors group-hover:bg-flamingo-400"
        >
          <UIcon
            name="i-lucide-sliders-horizontal"
            class="h-3.5 w-3.5 transition-transform duration-200 group-hover:rotate-12 group-hover:scale-110"
          />
          Configure quote
        </span>
      </div>

    </div>
  </NuxtLink>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { Product } from '~/shared/types/base'

const props = defineProps<{
  product: Product
  /** Route to navigate to when the card is clicked, e.g. /products/:slug */
  to: string
}>()

const { getMediaUrl } = useApi()
const { priceDisplay, priceDisplaySummary } = useProductPriceDisplay()

/** Flips to true on <img> @error so the gradient fallback is shown instead */
const imageError = ref(false)

/**
 * Resolves the image URL. Absolute URLs (CDN, external storage) are passed
 * through unchanged. Relative paths are resolved through getMediaUrl so they
 * point to the correct API base regardless of environment.
 */
const imageSrc = computed(() => {
  const path = props.product.primary_image
  if (!path) return null
  if (path.startsWith('http')) return path
  return getMediaUrl(path)
})

/** Normalises product.category which can arrive as a plain string or {name} object */
const categoryName = computed((): string | null => {
  const c = props.product.category
  if (typeof c === 'string') return c.trim() || null
  if (c && typeof c === 'object' && 'name' in c) {
    const n = (c as { name: unknown }).name
    return typeof n === 'string' ? n.trim() || null : null
  }
  return null
})

/**
 * Single-line price from the composable.
 * Returns a range, from-price, or "Price on request" — never blank.
 */
const price = computed(() => priceDisplay(props.product))

/**
 * Two-tier breakdown when the backend reports can_calculate === true.
 * null for products not yet fully configured by the shop.
 */
const priceSummary = computed(() => priceDisplaySummary(props.product))

// ── Image fallback visual identity ──────────────────────────────────────────
// Inferred from product type / name keywords so there are no generic placeholders.

type VisualConfig = { icon: string; gradientClass: string; iconColorClass: string }

const visual = computed((): VisualConfig => {
  const p = props.product
  const key = `${p.slug ?? ''} ${p.name} ${categoryName.value ?? ''}`.toLowerCase()
  const isBooklet = p.product_kind === 'BOOKLET' || key.includes('booklet')
  const isLargeFormat = p.pricing_mode === 'LARGE_FORMAT'

  if (isBooklet || key.includes('brochure'))
    return { icon: 'i-lucide-book-open', gradientClass: 'bg-gradient-to-br from-violet-100 to-purple-200 dark:from-violet-950/60 dark:to-purple-900/40', iconColorClass: 'text-violet-500 dark:text-violet-400' }
  if (key.includes('business'))
    return { icon: 'i-lucide-credit-card', gradientClass: 'bg-gradient-to-br from-amber-100 to-orange-200 dark:from-amber-950/60 dark:to-orange-900/40', iconColorClass: 'text-amber-600 dark:text-amber-400' }
  if (key.includes('flyer') || key.includes('leaflet'))
    return { icon: 'i-lucide-file-text', gradientClass: 'bg-gradient-to-br from-sky-100 to-blue-200 dark:from-sky-950/60 dark:to-blue-900/40', iconColorClass: 'text-sky-500 dark:text-sky-400' }
  if (key.includes('sticker') || key.includes('label'))
    return { icon: 'i-lucide-sticker', gradientClass: 'bg-gradient-to-br from-emerald-100 to-green-200 dark:from-emerald-950/60 dark:to-green-900/40', iconColorClass: 'text-emerald-500 dark:text-emerald-400' }
  if (isLargeFormat || key.includes('banner'))
    return { icon: 'i-lucide-panel-top', gradientClass: 'bg-gradient-to-br from-teal-100 to-cyan-200 dark:from-teal-950/60 dark:to-cyan-900/40', iconColorClass: 'text-teal-500 dark:text-teal-400' }
  if (key.includes('receipt'))
    return { icon: 'i-lucide-receipt', gradientClass: 'bg-gradient-to-br from-slate-100 to-gray-200 dark:from-slate-800/60 dark:to-gray-800/40', iconColorClass: 'text-slate-500 dark:text-slate-400' }
  if (key.includes('poster'))
    return { icon: 'i-lucide-image', gradientClass: 'bg-gradient-to-br from-pink-100 to-rose-200 dark:from-pink-950/60 dark:to-rose-900/40', iconColorClass: 'text-pink-500 dark:text-pink-400' }
  return { icon: 'i-lucide-package', gradientClass: 'bg-gradient-to-br from-flamingo-100 to-flamingo-200 dark:from-flamingo-950/60 dark:to-flamingo-900/40', iconColorClass: 'text-flamingo-500 dark:text-flamingo-400' }
})
</script>
