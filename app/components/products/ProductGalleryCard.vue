<template>
  <component
    :is="linkTag"
    v-bind="linkAttrs"
    class="group flex flex-col overflow-hidden rounded-2xl border border-[var(--p-border)] bg-[var(--p-surface)] transition-all duration-200 hover:-translate-y-0.5 hover:border-flamingo-200 dark:hover:border-flamingo-800/50 hover:shadow-md"
    :class="{ 'cursor-default hover:-translate-y-0 hover:shadow-none': !to }"
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
  </component>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { Product } from '~/shared/types/base'
import { productVisual, resolveProductImageUrl } from '~/utils/productVisual'

const props = defineProps<{
  product: Product
  /** Route to navigate to when the card is clicked, e.g. /products/:slug */
  to?: string | null
}>()

const { getMediaUrl } = useApi()
const { priceDisplay, priceDisplaySummary } = useProductPriceDisplay()

/** Flips to true on <img> @error so the gradient fallback is shown instead */
const imageError = ref(false)
const linkTag = computed(() => props.to ? 'NuxtLink' : 'div')
const linkAttrs = computed(() => props.to ? { to: props.to } : {})

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

const imageSrc = computed(() =>
  resolveProductImageUrl(props.product.primary_image, getMediaUrl)
)

const price = computed(() => priceDisplay(props.product))
const priceSummary = computed(() => priceDisplaySummary(props.product))

const visual = computed(() =>
  productVisual({
    slug: props.product.slug,
    name: props.product.name,
    category: categoryName.value,
    product_kind: props.product.product_kind,
    pricing_mode: props.product.pricing_mode,
  })
)
</script>
