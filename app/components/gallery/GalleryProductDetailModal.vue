<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="modelValue"
        class="fixed inset-0 z-50 flex items-center justify-center p-4"
        role="dialog"
        aria-modal="true"
        @keydown.esc="$emit('update:modelValue', false)"
      >
        <div
          class="absolute inset-0 bg-black/50 backdrop-blur-sm"
          @click="$emit('update:modelValue', false)"
        />
        <div
          class="modal-panel relative z-[100010] max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-lg border border-[var(--p-border)] bg-[var(--p-surface-raised)] shadow-lg"
          @click.stop
        >
      <div class="p-5 sm:p-6">
        <!-- Header -->
        <div class="flex items-start justify-between gap-4 mb-4">
          <div class="min-w-0">
            <h2 class="text-lg font-semibold text-[var(--p-text)]">
              {{ product?.name }}
            </h2>
            <p v-if="product?.shop" class="mt-0.5 text-sm text-[var(--p-text-muted)]">
              {{ product.shop.name }}
            </p>
          </div>
          <UButton
            color="neutral"
            variant="ghost"
            icon="i-lucide-x"
            size="sm"
            @click="$emit('update:modelValue', false)"
          />
        </div>

        <!-- Product image -->
        <div
          class="mb-4 aspect-[4/3] overflow-hidden rounded-lg bg-[var(--p-surface-sunken)]"
        >
          <img
            v-if="productImageUrl && !imageError"
            :src="productImageUrl"
            :alt="product?.name ?? ''"
            class="w-full h-full object-cover"
            loading="lazy"
            @error="imageError = true"
          >
          <div
            v-else
            class="h-full w-full"
          >
            <div
              class="flex h-full w-full items-center justify-center"
              :class="productVisual.gradientClass"
            >
              <UIcon
                :name="productVisual.icon"
                class="h-10 w-10 opacity-75"
                :class="productVisual.iconColorClass"
              />
            </div>
          </div>
        </div>

        <!-- Details -->
        <div class="space-y-3 text-sm">
          <p v-if="product?.description" class="text-[var(--p-text-muted)]">
            {{ product.description }}
          </p>
          <div v-if="productCategoryName" class="flex items-center gap-2">
            <UIcon name="i-lucide-tag" class="h-4 w-4 text-[var(--p-text-muted)]" />
            <span>{{ productCategoryName }}</span>
          </div>
          <div v-if="product?.final_size" class="flex items-center gap-2">
            <UIcon name="i-lucide-ruler" class="h-4 w-4 text-[var(--p-text-muted)]" />
            <span>{{ product.final_size }}</span>
          </div>
          <div v-if="product?.imposition_summary" class="flex items-center gap-2">
            <UIcon name="i-lucide-grid-2x2" class="h-4 w-4 text-[var(--p-text-muted)]" />
            <span>Fits on {{ product.imposition_summary }}</span>
          </div>
          <div v-if="product?.min_quantity" class="flex items-center gap-2">
            <UIcon name="i-lucide-hash" class="h-4 w-4 text-[var(--p-text-muted)]" />
            <span>Min {{ product.min_quantity }} pcs</span>
          </div>
          <div v-if="product?.finishing_summary?.length" class="flex flex-wrap gap-1">
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

        <!-- Price -->
        <div class="mt-4 pt-4 border-t border-[var(--p-border)]">
          <template v-if="priceDisplaySummary(product)">
            <div class="text-lg font-bold text-flamingo-600 dark:text-flamingo-400">
              Total: {{ priceDisplaySummary(product)!.totalLine }}
            </div>
            <div class="text-sm text-[var(--p-text-muted)]">
              {{ priceDisplaySummary(product)!.perUnitLine }}
            </div>
          </template>
          <div v-else>
            <div class="text-lg font-bold text-flamingo-600 dark:text-flamingo-400">
              {{ priceDisplay(product) }}
            </div>

            <!-- Missing fields / diagnostics (for owners or all when price on request) -->
            <div
              v-if="priceDiagnostics(product)"
              class="mt-3 rounded-lg border border-amber-300 dark:border-amber-700 bg-amber-50 dark:bg-amber-900/20 p-3"
            >
              <p class="text-sm font-medium text-amber-800 dark:text-amber-200">
                Why can't we show a price?
              </p>
              <p class="mt-1 text-xs text-amber-700 dark:text-amber-300">
                {{ priceDiagnostics(product)!.reason }}
              </p>
              <div v-if="priceDiagnostics(product)!.missingFields?.length" class="mt-2">
                <p class="text-xs font-medium text-amber-800 dark:text-amber-200">Missing:</p>
                <ul class="mt-0.5 list-disc list-inside text-xs text-amber-700 dark:text-amber-300 space-y-0.5">
                  <li
                    v-for="field in missingFieldsLabels(priceDiagnostics(product)!.missingFields!)"
                    :key="field"
                  >
                    {{ field }}
                  </li>
                </ul>
              </div>
              <div v-if="priceDiagnostics(product)!.suggestions?.length" class="mt-2">
                <p class="text-xs font-medium text-amber-800 dark:text-amber-200">What to do:</p>
                <ul class="mt-0.5 space-y-1 text-xs text-amber-700 dark:text-amber-300">
                  <li
                    v-for="(s, i) in priceDiagnostics(product)!.suggestions!"
                    :key="i"
                    class="flex items-start gap-1.5"
                  >
                    <UIcon name="i-lucide-arrow-right" class="h-3 w-3 shrink-0 mt-0.5" />
                    {{ s.message }}
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <!-- Actions -->
        <div class="mt-6 flex flex-wrap gap-2">
          <UButton
            v-if="product?.shop?.slug"
            color="primary"
            @click="onTweak"
          >
            <UIcon name="i-lucide-sliders-horizontal" class="h-4 w-4 mr-2" />
            Tweak & add to quote
          </UButton>
          <UButton
            v-if="product?.is_owner && product?.shop?.slug && priceDiagnostics(product)"
            :to="setupUrl"
            variant="outline"
            color="warning"
          >
            <UIcon name="i-lucide-settings" class="h-4 w-4 mr-2" />
            Fix missing setup
          </UButton>
          <UButton
            v-if="product?.is_owner && product?.shop?.slug"
            :to="editUrl"
            variant="outline"
            color="neutral"
          >
            <UIcon name="i-lucide-pencil" class="h-4 w-4 mr-2" />
            Edit product
          </UButton>
        </div>
      </div>
    </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import type { Product } from '~/shared/types'
import { useProductPriceDisplay } from '~/composables/useProductPriceDisplay'

const props = defineProps<{
  modelValue: boolean
  product: Product | null
  productImageUrl: string | null
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  tweak: []
}>()

const { priceDisplay, priceDisplaySummary, priceDiagnostics } = useProductPriceDisplay()
const imageError = ref(false)

const productCategoryName = computed(() => {
  const p = props.product
  if (!p) return ''
  const c = p.category
  if (typeof c === 'string') return c.trim()
  if (c && typeof c === 'object' && 'name' in c && typeof (c as { name: string }).name === 'string') {
    return (c as { name: string }).name.trim()
  }
  return ''
})

const editUrl = computed(() => {
  const p = props.product
  if (!p?.shop?.slug) return null
  return `/dashboard/shops/${p.shop.slug}/products/${p.id}`
})

const setupUrl = computed(() => {
  const p = props.product
  if (!p?.shop?.slug) return null
  return `/dashboard/shops/${p.shop.slug}/setup`
})

const productVisual = computed(() => {
  const product = props.product
  const category = productCategoryName.value
  const key = `${product?.slug ?? ''} ${product?.name ?? ''} ${category}`.toLowerCase()
  const isBooklet = product?.product_kind === 'BOOKLET' || key.includes('booklet')
  const isLargeFormat = product?.pricing_mode === 'LARGE_FORMAT'

  if (isBooklet || key.includes('brochure')) {
    return {
      icon: 'i-lucide-book-open',
      gradientClass: 'bg-gradient-to-br from-violet-100 to-purple-200 dark:from-violet-950/60 dark:to-purple-900/40',
      iconColorClass: 'text-violet-500 dark:text-violet-400',
    }
  }
  if (key.includes('business')) {
    return {
      icon: 'i-lucide-credit-card',
      gradientClass: 'bg-gradient-to-br from-amber-100 to-orange-200 dark:from-amber-950/60 dark:to-orange-900/40',
      iconColorClass: 'text-amber-600 dark:text-amber-400',
    }
  }
  if (key.includes('flyer') || key.includes('leaflet')) {
    return {
      icon: 'i-lucide-file-text',
      gradientClass: 'bg-gradient-to-br from-sky-100 to-blue-200 dark:from-sky-950/60 dark:to-blue-900/40',
      iconColorClass: 'text-sky-500 dark:text-sky-400',
    }
  }
  if (key.includes('sticker') || key.includes('label')) {
    return {
      icon: 'i-lucide-sticker',
      gradientClass: 'bg-gradient-to-br from-emerald-100 to-green-200 dark:from-emerald-950/60 dark:to-green-900/40',
      iconColorClass: 'text-emerald-500 dark:text-emerald-400',
    }
  }
  if (isLargeFormat || key.includes('banner')) {
    return {
      icon: 'i-lucide-panel-top',
      gradientClass: 'bg-gradient-to-br from-teal-100 to-cyan-200 dark:from-teal-950/60 dark:to-cyan-900/40',
      iconColorClass: 'text-teal-500 dark:text-teal-400',
    }
  }
  if (key.includes('receipt')) {
    return {
      icon: 'i-lucide-receipt',
      gradientClass: 'bg-gradient-to-br from-slate-100 to-gray-200 dark:from-slate-800/60 dark:to-gray-800/40',
      iconColorClass: 'text-slate-500 dark:text-slate-400',
    }
  }
  if (key.includes('poster')) {
    return {
      icon: 'i-lucide-image',
      gradientClass: 'bg-gradient-to-br from-pink-100 to-rose-200 dark:from-pink-950/60 dark:to-rose-900/40',
      iconColorClass: 'text-pink-500 dark:text-pink-400',
    }
  }
  return {
    icon: 'i-lucide-package',
    gradientClass: 'bg-gradient-to-br from-flamingo-100 to-flamingo-200 dark:from-flamingo-950/60 dark:to-flamingo-900/40',
    iconColorClass: 'text-flamingo-500 dark:text-flamingo-400',
  }
})

watch(() => props.productImageUrl, () => {
  imageError.value = false
})

const MISSING_FIELDS_LABELS: Record<string, string> = {
  paper: 'Paper stock (add under Shop → Papers)',
  machine: 'Machine (add under Shop → Machines)',
  printing_rate: 'Printing rates (add under Machine → Printing Rates)',
  dimensions: 'Product dimensions (default_finished_width_mm, default_finished_height_mm)',
  product_rules: 'Product rules (gsm range, allowed sheet sizes)',
}

function missingFieldsLabels(fields: string[]): string[] {
  return fields.map((f) => MISSING_FIELDS_LABELS[f] ?? f)
}

function onTweak() {
  emit('update:modelValue', false)
  emit('tweak')
}
</script>
