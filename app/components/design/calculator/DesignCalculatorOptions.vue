<script setup lang="ts">
/**
 * One card per production option (SIDE TASK 6B, S6-06, card 2).
 *
 * Built only from what `POST /calculator/preview/` actually returns for the
 * viewer. The public endpoint scrubs identity and cost lines for every caller
 * (see migration/BACKEND_HEALTH_REPORT.md → "Calculator visibility"), so a row
 * shows the partner name the API gave us, its price range and its readiness;
 * itemised cost lines are rendered only when the response carries them. No
 * price is computed here — `price_range` and `human_ready_text` are verbatim.
 */
import { computed } from 'vue'
import { Calculator, Clock3, ShoppingBag } from 'lucide-vue-next'
import { useCalculatorStore } from '~/stores/calculator'
import type { ServerCalculatorPreview } from '~/shared/types'

interface PreviewLine {
  label?: string
  amount?: number | string | null
  currency?: string
}

interface PreviewMatch {
  id?: number
  name?: string
  shop_name?: string
  can_calculate?: boolean
  can_price_now?: boolean
  currency?: string
  price_range?: { min?: number | string | null; max?: number | string | null } | null
  human_ready_text?: string | null
  turnaround_label?: string | null
  summary?: string | null
  reason?: string | null
  preview?: {
    matched_stock?: string | null
    pricing_lines?: PreviewLine[] | null
    lines?: PreviewLine[] | null
  } | null
  lines?: PreviewLine[] | null
}

const props = withDefaults(defineProps<{
  /** Tests only: render this preview instead of the store's. */
  previewOverride?: ServerCalculatorPreview | null
}>(), {
  previewOverride: null,
})

const calcStore = useCalculatorStore()
const preview = computed(() => props.previewOverride ?? calcStore.preview)

const matches = computed<PreviewMatch[]>(() => {
  const raw = (preview.value as unknown as { matches?: PreviewMatch[] } | null)?.matches
  return Array.isArray(raw) ? raw : []
})

function money(value: number | string | null | undefined, currency = 'KES'): string {
  if (value === null || value === undefined || value === '') {
    return ''
  }
  const numeric = Number(value)
  if (!Number.isFinite(numeric)) {
    return String(value)
  }
  return `${currency} ${new Intl.NumberFormat('en-KE', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(numeric)}`
}

function rangeLabel(match: PreviewMatch): string {
  const range = match.price_range
  if (!range) {
    return ''
  }
  const low = money(range.min, match.currency || 'KES')
  const high = money(range.max, match.currency || 'KES')
  if (low && high && low !== high) {
    return `${low} – ${high}`
  }
  return low || high
}

function lines(match: PreviewMatch): PreviewLine[] {
  const candidates = [
    match.lines,
    match.preview?.pricing_lines,
    match.preview?.lines,
  ]
  for (const candidate of candidates) {
    if (Array.isArray(candidate) && candidate.length > 0) {
      return candidate
    }
  }
  return []
}

function partnerName(match: PreviewMatch): string {
  return match.name || match.shop_name || 'Print partner'
}
</script>

<template>
  <div v-if="matches.length" data-design-calculator-options class="grid gap-4 md:grid-cols-2">
    <section
      v-for="(match, index) in matches"
      :key="match.id ?? index"
      class="flex flex-col rounded-2xl border border-line bg-card p-5 shadow-card"
    >
      <div class="flex items-start justify-between gap-3">
        <div class="flex items-center gap-2">
          <ShoppingBag :size="14" class="text-brand" aria-hidden="true" />
          <h3 class="text-[14px] font-semibold tracking-tight text-ink">{{ partnerName(match) }}</h3>
        </div>
        <span
          v-if="match.can_price_now"
          class="rounded-full bg-mint px-2 py-[2px] font-mono text-[9px] uppercase tracking-[0.1em] text-brand-deep"
        >live</span>
      </div>

      <p v-if="rangeLabel(match)" class="tabular mt-2 text-[18px] font-bold leading-none text-ink">
        {{ rangeLabel(match) }}
      </p>
      <p class="mt-1.5 flex flex-wrap gap-x-3 gap-y-1 font-mono text-[10px] uppercase tracking-[0.1em] text-ink-3">
        <span v-if="match.human_ready_text" class="inline-flex items-center gap-1">
          <Clock3 :size="11" aria-hidden="true" /> {{ match.human_ready_text }}
        </span>
        <span v-else-if="match.turnaround_label">{{ match.turnaround_label }}</span>
        <span v-if="match.preview?.matched_stock" class="inline-flex items-center gap-1">
          <Calculator :size="11" aria-hidden="true" /> {{ match.preview.matched_stock }}
        </span>
      </p>
      <p v-if="match.summary" class="mt-2 text-[12px] leading-relaxed text-ink-2">{{ match.summary }}</p>

      <ul v-if="lines(match).length" class="mt-3 divide-y divide-line border-t border-line pt-2">
        <li
          v-for="(line, lineIndex) in lines(match)"
          :key="lineIndex"
          class="flex items-baseline justify-between gap-3 py-1 font-mono text-[11px] text-ink-2"
        >
          <span>{{ line.label }}</span>
          <span class="tabular font-semibold text-ink">{{ money(line.amount, line.currency || match.currency || 'KES') }}</span>
        </li>
      </ul>
      <p v-else class="mt-3 border-t border-line pt-2 text-[11.5px] leading-relaxed text-ink-3">
        Line detail is released by the partner's own quote.
      </p>
    </section>
  </div>
</template>
