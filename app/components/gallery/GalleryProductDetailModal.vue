<template>
  <UModal
    :model-value="modelValue"
    :ui="{ width: 'sm:max-w-lg' }"
    @update:model-value="$emit('update:modelValue', $event)"
  >
    <template #content>
      <div class="p-6">
        <!-- Header -->
        <div class="flex items-start justify-between gap-4 mb-4">
          <div class="min-w-0">
            <h2 class="text-xl font-bold text-[var(--p-text)]">
              {{ product?.name }}
            </h2>
            <p v-if="product?.shop" class="mt-0.5 text-sm text-[var(--p-text-muted)]">
              {{ product.shop.name }}
            </p>
          </div>
          <UButton
            v-if="modelValue"
            color="neutral"
            variant="ghost"
            icon="i-lucide-x"
            size="sm"
            @click="$emit('update:modelValue', false)"
          />
        </div>

        <!-- Product image -->
        <div
          v-if="productImageUrl"
          class="rounded-xl overflow-hidden bg-[var(--p-surface-sunken)] aspect-[4/3] mb-4"
        >
          <NuxtImg
            :src="productImageUrl"
            :alt="product?.name ?? ''"
            class="w-full h-full object-cover"
          />
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
    </template>
  </UModal>
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
