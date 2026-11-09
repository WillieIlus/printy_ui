<script setup lang="ts">
/**
 * DETAILED layout — MANY cards (SIDE TASK 6B, S6-06).
 *
 * Manager / printer / admin presentation. It keeps the existing calculator
 * (spec cards + totals rail, unchanged) and adds the production cards the
 * manager desk relies on: one card per production option and the imposition
 * card when the response actually carries a `production_preview`.
 *
 * The wiring is the same calculator store and the same preview call as the
 * minimal card — this component adds no pricing of its own.
 */
import { computed } from 'vue'
import CalculatorView from '~/components/workbench/views/CalculatorView.vue'
import ImpositionSheet from '~/components/workbench/calculator/ImpositionSheet.vue'
import DesignCalculatorOptions from '~/components/design/calculator/DesignCalculatorOptions.vue'
import { useCalculatorStore } from '~/stores/calculator'

withDefaults(defineProps<{
  locked?: boolean
  embedded?: boolean
  authed?: boolean
  stacked?: boolean
  compact?: boolean
  showManagerCards?: boolean
  ctaLabel?: string
  priceOnly?: boolean
}>(), {
  locked: false,
  embedded: false,
  authed: false,
  stacked: false,
  compact: false,
  showManagerCards: false,
  ctaLabel: '',
  priceOnly: false,
})

const emit = defineEmits<{
  'quote-created': [ref: string, total: number | null]
  unlock: []
}>()

const calcStore = useCalculatorStore()
const productionPreview = computed(() => calcStore.preview?.production_preview ?? null)
</script>

<template>
  <div data-design-calculator-detailed class="flex flex-col gap-6">
    <CalculatorView
      :locked="locked"
      :embedded="embedded"
      :authed="authed"
      :stacked="stacked"
      :compact="compact"
      :show-manager-cards="showManagerCards"
      :cta-label="ctaLabel"
      :price-only="priceOnly"
      @quote-created="(ref: string, total: number | null) => emit('quote-created', ref, total)"
      @unlock="emit('unlock')"
    />

    <DesignCalculatorOptions />

    <section
      v-if="productionPreview"
      data-design-calculator-imposition
      class="rounded-2xl border border-line bg-card p-5 shadow-card"
    >
      <div class="flex flex-wrap items-baseline gap-3">
        <span class="tabular flex h-7 min-w-7 items-center justify-center rounded-lg bg-mint px-2 font-mono text-[11px] font-bold text-brand-deep">
          IM
        </span>
        <h3 class="text-[15px] font-semibold tracking-tight text-ink">Imposition</h3>
      </div>
      <p class="mt-1.5 text-[12.5px] leading-relaxed text-ink-2">
        The sheet layout this price is built from, straight from the pricing engine.
      </p>
      <div class="mt-4">
        <ImpositionSheet :imposition="productionPreview" />
      </div>
    </section>
  </div>
</template>
