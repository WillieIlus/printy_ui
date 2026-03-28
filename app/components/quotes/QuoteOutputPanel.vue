<template>
  <div class="softui-panel softui-glow relative space-y-5 rounded-[2rem] p-5 sm:p-6">
    <p class="inline-flex items-center gap-1.5 rounded-full border border-[var(--p-accent)]/20 bg-[var(--p-accent)]/10 px-3 py-1 text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-[var(--p-accent-strong)]">
      <UIcon name="i-lucide-zap" class="w-4 h-4" />
      Quote ready instantly
    </p>

    <div class="softui-card rounded-[1.75rem] p-4">
      <p class="mb-1 text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-[var(--p-text-muted)]">
        Suggested Selling Price
      </p>
      <p class="text-3xl font-semibold tracking-[0.01em] text-[var(--p-accent-strong)] sm:text-[2.1rem]">
        {{ formatKES(suggestedPrice) }}
      </p>
      <p class="mt-2 text-sm text-[var(--p-text-muted)]">Optimized for fast mobile quoting and follow-up.</p>
    </div>

    <div v-if="showOverride">
      <label class="mb-2 block text-xs font-medium uppercase tracking-[0.14em] text-[var(--p-text-dim)]">Set Customer Price</label>
      <UInput
        :model-value="overridePrice"
        type="number"
        step="0.01"
        min="0"
        placeholder="Enter custom price"
        :ui="{ base: 'softui-pill-input w-full px-4' }"
        @update:model-value="$emit('update:overridePrice', $event)"
      />
    </div>

    <UAlert
      v-if="underpricingAmount > 0"
      color="error"
      icon="i-lucide-alert-triangle"
      title="Underpricing Risk"
      :description="`This price reduces your profit by ${formatKES(underpricingAmount)}`"
      class="rounded-[1.25rem] border border-red-400/20 bg-red-500/8"
    />

    <div class="grid grid-cols-2 gap-3">
      <div class="softui-card rounded-[1.5rem] p-4">
        <p class="text-[0.72rem] font-semibold uppercase tracking-[0.14em] text-[var(--p-text-dim)]">Total Cost</p>
        <p class="mt-2 text-lg font-semibold text-[var(--p-text)]">
          {{ totalCostConfigured ? formatKES(totalCost) : '—' }}
        </p>
        <p v-if="!totalCostConfigured" class="mt-1 text-xs text-[var(--p-text-muted)]">
          Add buying prices in pricing settings to see cost
        </p>
      </div>
      <div class="softui-card rounded-[1.5rem] p-4">
        <p class="text-[0.72rem] font-semibold uppercase tracking-[0.14em] text-[var(--p-text-dim)]">Profit Margin</p>
        <p class="mt-2 text-lg font-semibold text-[var(--p-accent-strong)]">
          {{ marginConfigured ? `${marginPercent}%` : '—' }}
        </p>
        <p class="mt-1 text-xs text-[var(--p-text-muted)]">Margin will sharpen once cost inputs are complete.</p>
      </div>
    </div>

    <div class="softui-card rounded-[1.5rem] p-4">
      <p class="text-[0.72rem] font-semibold uppercase tracking-[0.14em] text-[var(--p-text-dim)]">Your Profit</p>
      <p class="mt-2 text-2xl font-semibold text-[var(--p-accent-strong)]">
        {{ profitConfigured ? formatKES(displayProfit) : '—' }}
      </p>
    </div>

    <div class="softui-card rounded-[1.5rem] p-3">
      <QuotesCostBreakdownTable :rows="costRows" />
    </div>

    <div v-if="quoteId" class="border-t border-[var(--p-border)]/50 pt-3">
      <UButton
        variant="outline"
        size="sm"
        block
        :loading="shareLoading"
        :disabled="shareLoading"
        class="softui-pill-input !bg-transparent"
        @click="$emit('share', quoteId)"
      >
        <UIcon name="i-lucide-share-2" class="mr-1.5 h-4 w-4" />
        Share
      </UButton>
    </div>

    <div v-if="$slots.actions" class="border-t border-[var(--p-border)]/50 pt-3">
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

const totalCost = computed(() => {
  if (!props.pricing) return 0
  const p = parseFloat(props.pricing.total_printing)
  const pa = parseFloat(props.pricing.total_paper)
  const f = parseFloat(props.pricing.total_finishing)
  return p + pa + f
})

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
