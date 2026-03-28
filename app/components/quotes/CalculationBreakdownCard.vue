<template>
  <section
    :data-preview-mode="mode"
    :class="[
      'rounded-3xl border p-5',
      mode === 'hero'
        ? 'bg-[linear-gradient(180deg,rgba(15,23,38,0.98),rgba(10,17,29,0.98))] shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]'
        : 'bg-[var(--p-surface)] shadow-sm',
      'border-[var(--p-border)]',
    ]"
  >
    <div class="flex items-start justify-between gap-4">
      <div>
        <p class="text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-[var(--p-text-muted)]">Backend Preview</p>
        <h3 class="mt-2 text-[1.2rem] font-semibold tracking-[-0.02em] text-[var(--p-text)] sm:text-[1.35rem]">
          {{ totalLabel }}
        </h3>
        <p v-if="preview?.reason" class="mt-2 text-[0.875rem] leading-5 text-[var(--p-text-muted)]">{{ preview.reason }}</p>
      </div>
      <UBadge :color="preview?.can_calculate === false ? 'warning' : 'success'" variant="soft">
        {{ preview?.can_calculate === false ? 'Needs attention' : 'Ready' }}
      </UBadge>
    </div>

    <div v-if="preview?.paper || preview?.printing || preview?.totals" class="mt-5 grid gap-3 md:grid-cols-3">
      <article class="rounded-2xl border border-[var(--p-border)] bg-[var(--p-surface-sunken)] p-4">
        <p class="text-[0.68rem] font-semibold uppercase tracking-[0.12em] text-[var(--p-text-muted)]">Paper</p>
        <p class="mt-2 text-[0.9rem] font-semibold text-[var(--p-text)]">{{ preview?.paper?.label || 'Not selected' }}</p>
        <p class="mt-1 text-[0.875rem] text-[var(--p-text-muted)]">{{ preview?.totals?.paper_cost || '0' }}</p>
      </article>
      <article class="rounded-2xl border border-[var(--p-border)] bg-[var(--p-surface-sunken)] p-4">
        <p class="text-[0.68rem] font-semibold uppercase tracking-[0.12em] text-[var(--p-text-muted)]">Printing</p>
        <p class="mt-2 text-[0.9rem] font-semibold text-[var(--p-text)]">{{ preview?.printing?.machine_name || 'Not selected' }}</p>
        <p class="mt-1 text-[0.875rem] text-[var(--p-text-muted)]">{{ preview?.totals?.print_cost || '0' }}</p>
      </article>
      <article class="rounded-2xl border border-[var(--p-border)] bg-[var(--p-surface-sunken)] p-4">
        <p class="text-[0.68rem] font-semibold uppercase tracking-[0.12em] text-[var(--p-text-muted)]">Imposition</p>
        <p class="mt-2 text-[0.9rem] font-semibold text-[var(--p-text)]">{{ preview?.copies_per_sheet ?? 0 }} up</p>
        <p class="mt-1 text-[0.875rem] text-[var(--p-text-muted)]">{{ preview?.good_sheets ?? 0 }} good sheets</p>
      </article>
    </div>

    <div v-if="preview?.finishings?.length" class="mt-5 space-y-3">
      <h4 class="text-[0.9rem] font-semibold text-[var(--p-text)]">Finishing Breakdown</h4>
      <article
        v-for="line in preview.finishings"
        :key="`${line.slug || line.name}-${line.selected_side || 'both'}`"
        class="rounded-2xl border border-[var(--p-border)] bg-[var(--p-surface-sunken)] p-4"
      >
        <div class="flex items-start justify-between gap-3">
          <div>
            <p class="text-[0.9rem] font-semibold text-[var(--p-text)]">{{ line.name }}</p>
            <p class="mt-1 text-[0.68rem] uppercase tracking-[0.12em] text-[var(--p-text-muted)]">
              {{ finishingMetaLabel(line) }}
            </p>
            <p class="mt-2 text-[0.875rem] leading-5 text-[var(--p-text-muted)]">
              {{ isLamination(line) ? laminationSummary(line) : finishingSummary(line) }}
            </p>
            <p v-if="line.explanation" class="mt-2 text-[0.78rem] leading-5 text-[var(--p-text-muted)]">
              {{ line.explanation }}
            </p>
          </div>
          <p class="text-[0.9rem] font-semibold text-[var(--p-text)]">{{ line.total }}</p>
        </div>
      </article>
    </div>

    <div v-if="preview?.suggestions?.length" class="mt-5 rounded-2xl border border-[var(--p-border)] bg-[var(--p-surface-sunken)] p-4">
      <p class="text-[0.9rem] font-semibold text-[var(--p-text)]">Suggestions</p>
      <p
        v-for="suggestion in preview.suggestions"
        :key="suggestion.code || suggestion.message"
        class="mt-2 text-[0.875rem] leading-5 text-[var(--p-text-muted)]"
      >
        {{ suggestion.message }}
      </p>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { PreviewPriceResponse } from '~/shared/types/buyer'

const props = defineProps<{
  preview: PreviewPriceResponse | null
  mode?: 'hero' | 'client' | 'shop'
}>()

const mode = computed(() => props.mode || 'client')

const totalLabel = computed(() => props.preview?.totals?.grand_total || props.preview?.total || 'Awaiting preview')

function isLamination(line: NonNullable<PreviewPriceResponse['finishings']>[number]) {
  const name = `${line.slug || ''} ${line.name || ''}`.toLowerCase()
  return name.includes('lamination') || (
    line.billing_basis === 'per_sheet'
    && line.side_mode === 'per_selected_side'
  )
}

function finishingMetaLabel(line: NonNullable<PreviewPriceResponse['finishings']>[number]) {
  if (isLamination(line)) {
    return 'Per sheet per side'
  }

  const billingBasis = normalizeBillingBasis(line.billing_basis)
  const meta = [billingBasis ? billingBasisLabel(billingBasis) : null, line.side_mode].filter(Boolean)
  return meta.join(' · ') || 'Backend rule'
}

function laminationSummary(line: NonNullable<PreviewPriceResponse['finishings']>[number]) {
  if (line.calculation_basis) {
    return `${line.calculation_basis} · per sheet per side`
  }

  const goodSheets = line.good_sheets ?? props.preview?.good_sheets ?? 0
  const rate = line.rate || '0'
  const sideCount = line.side_count ?? 1
  return `${goodSheets} good sheets × ${rate} × ${sideCount} side(s) · per sheet per side`
}

function finishingSummary(line: NonNullable<PreviewPriceResponse['finishings']>[number]) {
  if (line.calculation_basis) {
    return line.calculation_basis
  }

  const billingBasis = normalizeBillingBasis(line.billing_basis)
  if (billingBasis === 'flat_per_job') {
    return 'Backend flat charge for the full job'
  }
  if (billingBasis === 'flat_per_group') {
    return 'Backend flat charge for the grouped request'
  }
  if (billingBasis === 'flat_per_line') {
    return 'Backend flat charge for this line item'
  }

  const units = line.units_count ?? line.units ?? 1
  const unitsLabel = billingBasis === 'per_sheet' ? 'sheet(s)' : billingBasis === 'per_piece' ? 'piece(s)' : 'unit(s)'
  return `${units} ${unitsLabel} × ${line.rate || '0'}`
}

function normalizeBillingBasis(value: unknown) {
  if (typeof value !== 'string') return null
  const normalized = value.trim().toLowerCase()
  return normalized || null
}

function billingBasisLabel(billingBasis: string) {
  switch (billingBasis) {
    case 'per_sheet':
      return 'Per sheet'
    case 'per_piece':
      return 'Per piece'
    case 'flat_per_job':
      return 'Flat per job'
    case 'flat_per_group':
      return 'Flat per group'
    case 'flat_per_line':
      return 'Flat per line'
    default:
      return billingBasis.replaceAll('_', ' ')
  }
}
</script>
