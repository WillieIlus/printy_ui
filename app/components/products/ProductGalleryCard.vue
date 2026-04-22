<template>
  <component
    :is="linkTag"
    v-bind="linkAttrs"
    class="group flex flex-col overflow-hidden rounded-2xl border border-[var(--p-border)] bg-[var(--p-surface)] transition-all duration-200 hover:-translate-y-0.5 hover:border-flamingo-200 hover:shadow-md dark:hover:border-flamingo-800/50"
    :class="{ 'cursor-pointer': interactive, 'cursor-default hover:-translate-y-0 hover:shadow-none': !interactive }"
    @click="onCardClick"
  >
    <div class="relative aspect-[4/3] overflow-hidden bg-[var(--p-surface-sunken)]">
      <img
        v-if="imageSrc && !imageError"
        :src="imageSrc"
        :alt="product.name"
        class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        loading="lazy"
        @error="imageError = true"
      />
      <div
        v-else
        class="flex h-full w-full items-center justify-center transition-transform duration-300 group-hover:scale-105"
        :class="visual.gradientClass"
      >
        <UIcon :name="visual.icon" class="h-10 w-10 opacity-75" :class="visual.iconColorClass" />
      </div>

      <span
        v-if="categoryName"
        class="absolute left-3 top-3 rounded-full bg-black/40 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.08em] text-white backdrop-blur-sm"
      >
        {{ categoryName }}
      </span>

      <div v-if="showShop && product.shop" class="absolute left-3 top-12">
        <span
          class="inline-flex items-center gap-1.5 rounded-full border border-[var(--p-border)] bg-[var(--p-surface)]/90 px-3 py-1 text-xs font-medium text-[var(--p-text-dim)] backdrop-blur-sm"
        >
          <UIcon name="i-lucide-store" class="h-3 w-3 text-flamingo-500" />
          <span class="text-flamingo-500">{{ product.shop.name }}</span>
        </span>
      </div>
    </div>

    <div class="flex flex-1 flex-col p-4 sm:p-5">
      <h3 class="font-bold text-[var(--p-text)] transition-colors group-hover:text-flamingo-600 dark:group-hover:text-flamingo-400">
        {{ product.name }}
      </h3>
      <p v-if="categoryName" class="mt-0.5 text-sm text-[var(--p-text-muted)]">
        {{ categoryName }}
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

      <div class="mt-4 flex items-start justify-between gap-2">
        <div class="min-w-0 flex-1">
          <template v-if="priceSummary">
            <p class="text-base font-bold text-flamingo-600 dark:text-flamingo-400">
              {{ priceSummary.totalLine }}
            </p>
            <p class="mt-0.5 text-xs text-[var(--p-text-muted)]">
              {{ priceSummary.perUnitLine }}
            </p>
          </template>
          <div v-else class="flex items-center gap-1.5">
            <p class="text-base font-bold text-flamingo-600 dark:text-flamingo-400">
              {{ price }}
            </p>
            <UTooltip v-if="diagnosticsText" :text="diagnosticsText" :popper="{ placement: 'top' }">
              <button
                type="button"
                class="inline-flex text-[var(--p-text-muted)] transition-colors hover:text-flamingo-600 dark:hover:text-flamingo-400"
                @click.stop
              >
                <UIcon name="i-lucide-info" class="h-4 w-4" />
              </button>
            </UTooltip>
          </div>
        </div>

        <button
          v-if="resolvedActionLabel"
          type="button"
          class="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-flamingo-500 px-3 py-1.5 text-xs font-semibold text-white transition-colors group-hover:bg-flamingo-400"
          @click.stop="onActionClick"
        >
          <UIcon
            name="i-lucide-sliders-horizontal"
            class="h-3.5 w-3.5 transition-transform duration-200 group-hover:rotate-12 group-hover:scale-110"
          />
          {{ resolvedActionLabel }}
        </button>
      </div>
    </div>
  </component>
</template>

<script setup lang="ts">
import { computed, ref, useAttrs } from 'vue'
import type { Product } from '~/shared/types/base'
import { productCategoryName } from '~/utils/product'
import { productVisual, resolveProductImageUrl } from '~/utils/productVisual'

const props = withDefaults(defineProps<{
  product: Product
  to?: string | null
  actionLabel?: string | null
  showShop?: boolean
}>(), {
  to: null,
  actionLabel: 'Tweak',
  showShop: true,
})

const emit = defineEmits<{
  select: [event: MouseEvent]
  action: [event: MouseEvent]
}>()

const attrs = useAttrs()
const { getMediaUrl } = useApi()
const { priceDisplay, priceDisplaySummary, priceDiagnostics } = useProductPriceDisplay()

const imageError = ref(false)
const linkTag = computed(() => props.to ? 'NuxtLink' : 'div')
const linkAttrs = computed(() => props.to ? { to: props.to } : {})
const interactive = computed(() => Boolean(props.to || attrs.onSelect || attrs.onAction))
const categoryName = computed(() => productCategoryName(props.product) || null)
const resolvedActionLabel = computed(() => props.actionLabel)

const imageSrc = computed(() => resolveProductImageUrl(props.product.primary_image, getMediaUrl))
const price = computed(() => priceDisplay(props.product))
const priceSummary = computed(() => priceDisplaySummary(props.product))
const diagnosticsText = computed(() => {
  const diagnostics = priceDiagnostics(props.product)
  if (!diagnostics) return ''

  const parts: string[] = []
  if (diagnostics.reason) parts.push(diagnostics.reason)
  if (diagnostics.suggestions?.length) {
    parts.push(diagnostics.suggestions.map((item) => item.message).filter(Boolean).join(' '))
  }
  return parts.join(' ')
})

const visual = computed(() =>
  productVisual({
    slug: props.product.slug,
    name: props.product.name,
    category: categoryName.value,
    product_kind: props.product.product_kind,
    pricing_mode: props.product.pricing_mode,
  }),
)

function onCardClick(event: MouseEvent) {
  if (props.to) return
  emit('select', event)
}

function onActionClick(event: MouseEvent) {
  if (props.to) {
    void navigateTo(props.to)
    return
  }
  emit('action', event)
}
</script>
