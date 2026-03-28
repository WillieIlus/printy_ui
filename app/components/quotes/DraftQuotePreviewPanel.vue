<template>
  <section class="overflow-hidden rounded-3xl border border-[var(--p-border)] bg-[linear-gradient(180deg,var(--p-surface-raised)_0%,var(--p-surface)_100%)] shadow-sm">
    <div class="border-b border-[var(--p-border)] bg-[var(--p-surface-sunken)]/70 px-5 py-4">
      <p class="text-xl font-bold tracking-[0.01em] text-[var(--p-text)]">
        {{ shopName || 'Shop quote' }}
      </p>
      <p class="mt-1 text-sm text-[var(--p-text-muted)]">Draft Quote Preview</p>
    </div>

    <div class="grid gap-5 px-5 py-5 lg:grid-cols-[1.05fr_0.95fr]">
      <div class="rounded-2xl border border-[var(--p-border)] bg-[var(--p-surface-sunken)] p-4">
        <p class="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--p-text-muted)]">Job Details</p>
        <dl class="mt-4 space-y-3">
          <div v-for="item in leftColumnItems" :key="item.label" class="flex items-start justify-between gap-4 border-b border-[var(--p-border)]/70 pb-3 last:border-b-0 last:pb-0">
            <dt class="text-sm text-[var(--p-text-muted)]">{{ item.label }}</dt>
            <dd class="max-w-[60%] text-right text-sm font-medium text-[var(--p-text)]">{{ item.value }}</dd>
          </div>
        </dl>
      </div>

      <div class="rounded-2xl border border-[var(--p-border)] bg-[var(--p-surface-sunken)] p-4">
        <p class="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--p-text-muted)]">Price Breakdown</p>
        <dl class="mt-4 space-y-3">
          <div v-for="item in rightColumnItems" :key="item.label" class="flex items-start justify-between gap-4 border-b border-[var(--p-border)]/70 pb-3 last:border-b-0 last:pb-0">
            <dt class="text-sm text-[var(--p-text-muted)]">{{ item.label }}</dt>
            <dd class="text-right text-sm font-semibold text-[var(--p-text)]">{{ item.value }}</dd>
          </div>
        </dl>
      </div>
    </div>

    <div class="flex flex-col gap-3 border-t border-[var(--p-border)] bg-[var(--p-surface-sunken)]/50 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p class="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--p-text-muted)]">Grand Total</p>
        <p class="mt-1 text-2xl font-bold tracking-tight text-[var(--p-text)]">{{ grandTotal }}</p>
      </div>
      <UBadge :color="vatBadgeColor" variant="soft" class="self-start rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em]">
        VAT {{ vatStatusLabel }}
      </UBadge>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { PreviewPriceResponse } from '~/shared/types/buyer'

const props = defineProps<{
  preview: PreviewPriceResponse | null
  shopName: string
  contactName?: string
  productLabel?: string
  quantityLabel?: string
  sizeLabel?: string
  sidesLabel?: string
  colorModeLabel?: string
  paperLabel?: string
  finishingLabel?: string
  turnaroundLabel?: string
  dateLabel?: string
}>()

const leftColumnItems = computed(() => [
  { label: 'Client / Enquirer', value: props.contactName || 'Not provided' },
  { label: 'Product', value: props.productLabel || 'Not selected' },
  { label: 'Quantity', value: props.quantityLabel || 'Not set' },
  { label: 'Size', value: props.sizeLabel || 'Not set' },
  { label: 'Sides', value: props.sidesLabel || 'Not set' },
  { label: 'Colour mode', value: props.colorModeLabel || 'Not set' },
  { label: 'Paper / GSM', value: props.paperLabel || props.preview?.paper?.label || 'Not selected' },
  { label: 'Finishing', value: props.finishingLabel || 'None' },
  { label: 'Turnaround', value: props.turnaroundLabel || 'On request' },
  { label: 'Date', value: props.dateLabel || 'Today' },
])

const rightColumnItems = computed(() => [
  { label: 'Print cost', value: props.preview?.totals?.print_cost || '—' },
  { label: 'Paper cost', value: props.preview?.totals?.paper_cost || '—' },
  { label: 'Finishing total', value: props.preview?.totals?.finishing_total || '—' },
  { label: 'Subtotal', value: props.preview?.totals?.subtotal || '—' },
  { label: 'VAT', value: props.preview?.totals?.vat || props.preview?.totals?.vat_amount || props.preview?.vat?.amount || '—' },
  { label: 'Grand total', value: props.preview?.totals?.grand_total || props.preview?.total || '—' },
])

const grandTotal = computed(() => props.preview?.totals?.grand_total || props.preview?.total || 'Awaiting preview')

const vatStatusLabel = computed(() => {
  if (props.preview?.vat?.mode) {
    return props.preview.vat.mode === 'inclusive' ? 'Inclusive' : 'Exclusive'
  }

  if (typeof props.preview?.vat?.is_inclusive === 'boolean') {
    return props.preview.vat.is_inclusive ? 'Inclusive' : 'Exclusive'
  }

  return 'Not set'
})

const vatBadgeColor = computed(() => {
  if (vatStatusLabel.value === 'Inclusive') return 'success'
  if (vatStatusLabel.value === 'Exclusive') return 'warning'
  return 'neutral'
})
</script>
