<template>
  <div class="space-y-4 rounded-xl border border-emerald-500/20 bg-[var(--p-surface-container-low)] p-5">
    <!-- Quote Time hint -->
    <p class="flex items-center gap-1.5 text-sm font-medium text-emerald-600 dark:text-emerald-300">
      <UIcon name="i-lucide-zap" class="w-4 h-4" />
      Quote ready instantly
    </p>

    <!-- Suggested Selling Price (dominant) -->
    <div>
      <p class="mb-0.5 text-xs font-medium uppercase tracking-wider text-[var(--p-text-muted)]">
        Suggested Selling Price
      </p>
      <p class="text-2xl font-bold text-emerald-600 dark:text-emerald-300">
        {{ formatKES(suggestedPrice) }}
      </p>
    </div>

    <!-- Override input -->
    <div v-if="showOverride">
      <label class="mb-1 block text-xs font-medium text-[var(--p-text-dim)]">Set Customer Price (optional)</label>
      <UInput
        :model-value="overridePrice"
        type="number"
        step="0.01"
        min="0"
        placeholder="Enter custom price"
        :ui="{ base: 'w-full' }"
        @update:model-value="$emit('update:overridePrice', $event)"
      />
    </div>

    <!-- Underpricing Warning -->
    <UAlert
      v-if="underpricingAmount > 0"
      color="error"
      icon="i-lucide-alert-triangle"
      title="Underpricing Risk"
      :description="`This price reduces your profit by ${formatKES(underpricingAmount)}`"
      class="rounded-lg"
    />

    <!-- Total Cost -->
    <div>
      <p class="text-xs font-medium text-[var(--p-text-dim)]">Total Cost</p>
      <p class="text-lg font-semibold text-[var(--p-text)]">
        {{ totalCostConfigured ? formatKES(totalCost) : '—' }}
      </p>
      <p v-if="!totalCostConfigured" class="mt-0.5 text-xs text-[var(--p-text-muted)]">
        Add buying prices in pricing settings to see cost
      </p>
    </div>

    <!-- Your Profit & Margin -->
    <div class="grid grid-cols-2 gap-3">
      <div>
        <p class="text-xs font-medium text-[var(--p-text-dim)]">Your Profit</p>
        <p class="text-lg font-bold text-emerald-600 dark:text-emerald-300">
          {{ profitConfigured ? formatKES(displayProfit) : '—' }}
        </p>
      </div>
      <div>
        <p class="text-xs font-medium text-[var(--p-text-dim)]">Profit Margin</p>
        <p class="text-lg font-bold text-emerald-600 dark:text-emerald-300">
          {{ marginConfigured ? `${marginPercent}%` : '—' }}
        </p>
      </div>
    </div>

    <!-- Cost Breakdown Table -->
    <QuotesCostBreakdownTable :rows="costRows" />

    <!-- Share button (when quoteId provided) -->
    <div v-if="quoteId" class="border-t border-[var(--p-border)] pt-2">
      <UButton
        variant="outline"
        size="sm"
        block
        :loading="shareLoading"
        :disabled="shareLoading"
        @click="$emit('share', quoteId)"
      >
        <UIcon name="i-lucide-share-2" class="w-4 h-4 mr-1.5" />
        Share
      </UButton>
    </div>

    <!-- Slot for actions (Save, PDF, Copy) -->
    <div v-if="$slots.actions" class="border-t border-[var(--p-border)] pt-2">
      <slot name="actions" />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { PriceCalculationResult } from '~/shared/types'
import type { CostRow } from './CostBreakdownTable.vue'
import { formatKES } from '~/utils/formatters'

const props = withDefaults(
  defineProps<{
    pricing: PriceCalculationResult | null
    overridePrice?: string | null
    showOverride?: boolean
    /** When set, shows Share button. Emits share(quoteId) on click. */
    quoteId?: number | null
    shareLoading?: boolean
  }>(),
  { overridePrice: null, showOverride: true, quoteId: null, shareLoading: false }
)

defineEmits<{
  'update:overridePrice': [value: string | null]
  share: [quoteId: number]
}>()

const suggestedPrice = computed(() => {
  if (props.overridePrice && props.overridePrice !== '') {
    const n = parseFloat(props.overridePrice)
    if (!Number.isNaN(n)) return n
  }
  return props.pricing ? parseFloat(props.pricing.grand_total) : 0
})

// Backend returns selling prices; buying costs come from pricing config (not in calc API yet)
const totalCost = computed(() => {
  if (!props.pricing) return 0
  const p = parseFloat(props.pricing.total_printing)
  const pa = parseFloat(props.pricing.total_paper)
  const f = parseFloat(props.pricing.total_finishing)
  return p + pa + f
})

// Backend calculate-price returns selling prices only; buying costs not exposed yet
const totalCostConfigured = computed(() => false)
const profitConfigured = computed(() => false)
const marginConfigured = computed(() => false)

const displayProfit = computed(() => {
  const cost = totalCost.value
  const selling = suggestedPrice.value
  return Math.max(0, selling - cost)
})

const marginPercent = computed(() => {
  const selling = suggestedPrice.value
  if (selling <= 0) return 0
  const profit = displayProfit.value
  return Math.round((profit / selling) * 100)
})

const apiSuggestedPrice = computed(() =>
  props.pricing ? parseFloat(props.pricing.grand_total) : 0
)

const underpricingAmount = computed(() => {
  if (!props.pricing || !props.overridePrice || props.overridePrice === '') return 0
  const suggested = apiSuggestedPrice.value
  const override = parseFloat(props.overridePrice)
  if (Number.isNaN(override) || override >= suggested) return 0
  return suggested - override
})

const costRows = computed((): CostRow[] => {
  if (!props.pricing) return []
  const p = props.pricing
  return [
    { label: 'Paper', amount: p.total_paper, configured: parseFloat(p.total_paper) > 0 },
    { label: 'Printing', amount: p.total_printing, configured: parseFloat(p.total_printing) > 0 },
    { label: 'Finishing', amount: p.total_finishing, configured: parseFloat(p.total_finishing) > 0 },
    { label: 'Wastage', amount: '0', configured: false },
    { label: 'Machine / Labor', amount: '0', configured: false },
    { label: 'Other', amount: '0', configured: false },
  ]
})
</script>
