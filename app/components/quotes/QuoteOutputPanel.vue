<template>
  <div class="rounded-xl border-2 border-emerald-100 dark:border-emerald-900/50 bg-emerald-50/50 dark:bg-emerald-950/20 p-5 space-y-4">
    <!-- Quote Time hint -->
    <p class="text-sm font-medium text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5">
      <UIcon name="i-lucide-zap" class="w-4 h-4" />
      Quote ready instantly
    </p>

    <!-- Suggested Selling Price (dominant) -->
    <div>
      <p class="text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-0.5">
        Suggested Selling Price
      </p>
      <p class="text-2xl font-bold text-emerald-700 dark:text-emerald-400">
        {{ formatKES(suggestedPrice) }}
      </p>
    </div>

    <!-- Override input -->
    <div v-if="showOverride">
      <label class="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Set Customer Price (optional)</label>
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
      <p class="text-xs font-medium text-gray-600 dark:text-gray-400">Total Cost</p>
      <p class="text-lg font-semibold text-gray-900 dark:text-white">
        {{ totalCostConfigured ? formatKES(totalCost) : '—' }}
      </p>
      <p v-if="!totalCostConfigured" class="text-xs text-gray-500 mt-0.5">
        Add buying prices in pricing settings to see cost
      </p>
    </div>

    <!-- Your Profit & Margin -->
    <div class="grid grid-cols-2 gap-3">
      <div>
        <p class="text-xs font-medium text-gray-600 dark:text-gray-400">Your Profit</p>
        <p class="text-lg font-bold text-emerald-600 dark:text-emerald-400">
          {{ profitConfigured ? formatKES(displayProfit) : '—' }}
        </p>
      </div>
      <div>
        <p class="text-xs font-medium text-gray-600 dark:text-gray-400">Profit Margin</p>
        <p class="text-lg font-bold text-emerald-600 dark:text-emerald-400">
          {{ marginConfigured ? `${marginPercent}%` : '—' }}
        </p>
      </div>
    </div>

    <!-- Cost Breakdown Table -->
    <QuotesCostBreakdownTable :rows="costRows" />

    <!-- Slot for actions (Save, PDF, Copy) -->
    <div v-if="$slots.actions" class="pt-2 border-t border-gray-200 dark:border-gray-700">
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
  }>(),
  { overridePrice: null, showOverride: true }
)

defineEmits<{
  'update:overridePrice': [value: string | null]
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
