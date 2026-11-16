<script setup lang="ts">
/**
 * Marketing speed strip — design adoption.
 *
 * Shows the three buyer speed choices (Standard / Faster +50% / Fastest +100%)
 * with the totals the server actually prices for the displayed default job.
 * Nothing here computes a price: one config load and one public preview supply
 * every figure. If the pricing network is unavailable the strip falls back to
 * the CTA only so the marketing page never blocks or invents numbers.
 *
 * On the homepage (`show-managers`) the cards are selectable and the source's
 * recommended-manager section sits directly below the total bar. That section
 * asks the real recommendation endpoint who can meet the selected speed using
 * the exact payload priced here; it never falls back to a sample roster.
 */
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { Check, Loader2 } from 'lucide-vue-next'
import DesignSectionHead from './SectionHead.vue'
import DesignButtonLink from '../ui/ButtonLink.vue'
import DesignRecommendedManagers from './RecommendedManagers.vue'
import { API } from '~/shared/api-paths'
import { configProductFirst, type CalculatorConfig } from '~/shared/calculator-config'
import { buildPublicPreviewPayload, makeDefaultSpec } from '~/shared/calculator-spec'
import type { CalculatorSpec } from '~/shared/calculator-spec'
import { useBuyerJourney } from '~/composables/useBuyerJourney'
import { calculatorPerUnitRange, calculatorUnitWord, formatPerUnitRange } from '~/shared/calculator-units'
import { speedPriceOptions, type SpeedPriceOption } from '~/shared/calculator-speed-pricing'
import type { ServerCalculatorPreview } from '~/shared/types'

const props = withDefaults(defineProps<{
  eyebrow?: string
  title?: string
  copy?: string
  ctaLabel?: string
  ctaHref?: string
  showManagers?: boolean
  /** The buyer's current calculator spec, supplied by the page. */
  liveSpec?: CalculatorSpec | null
  /** The server preview already priced for that exact spec. */
  livePreview?: ServerCalculatorPreview | null
}>(), {
  eyebrow: 'Speed options',
  title: 'Same job. Pick how fast.',
  copy: 'Choose a speed and the ready-by time and total update together. These are live server prices for the spec shown; your exact, locked price comes with your quote.',
  ctaLabel: 'Get my exact quote',
  ctaHref: '/',
  showManagers: false,
  liveSpec: null,
  livePreview: null,
})

const ctaHref = computed(() => props.ctaHref)
const { api } = useApi()

const preview = ref<ServerCalculatorPreview | null>(null)
const previewPayload = ref<Record<string, unknown> | null>(null)
const configRef = ref<CalculatorConfig | null>(null)
const sampleSpec = ref<CalculatorSpec | null>(null)
const sampleLabel = ref('')
const sampleQuantity = ref(0)
const sampleUnit = ref('unit')
const status = ref<'idle' | 'loading' | 'ready' | 'error'>('idle')
const selectedSpeed = ref('')
const updating = ref(false)
let updateTimer: ReturnType<typeof setTimeout> | null = null

/** Every sample speed card shares the sample's base range, exactly like the live calculator. */
const pricedOptions = computed(() =>
  speedPriceOptions(preview.value, 'standard').filter((option) => Boolean(option.text)),
)

const selectedOption = computed(() =>
  pricedOptions.value.find((option) => option.key === selectedSpeed.value) ?? pricedOptions.value[0],
)

/**
 * The recommendation endpoint derives the rush tiers from the standard
 * turnaround. A marketing preview has no turnaround target, so this is null
 * and the server uses its stage-SLA fallback; when the calculator does return
 * one we pass it through unchanged.
 */
const standardTurnaround = computed(() => {
  const standard = pricedOptions.value.find((option) => option.key === 'standard')
  return typeof standard?.turnaroundHours === 'number' ? standard.turnaroundHours : null
})

function liveSpecLabel(spec: CalculatorSpec, config: CalculatorConfig | null, fallbackLabel?: string): string {
  const product = config?.products?.find(item => item.key === spec.product_type)
  const label = product?.label || fallbackLabel || 'Print job'
  const quantity = typeof spec.quantity === 'number' ? spec.quantity.toLocaleString('en-KE') : ''
  const unit = calculatorUnitWord(spec.product_type)
  const size = spec.finished_size ? String(spec.finished_size) : ''
  return [label, quantity ? `${quantity} ${unit}${quantity === '1' ? '' : 's'}` : '', size]
    .filter(Boolean)
    .join(' · ')
}

function applyLiveSpec(spec: CalculatorSpec, config: CalculatorConfig | null, livePreview: ServerCalculatorPreview | null) {
  previewPayload.value = buildPublicPreviewPayload(spec)
  sampleSpec.value = spec
  sampleQuantity.value = typeof spec.quantity === 'number' ? spec.quantity : 0
  sampleUnit.value = calculatorUnitWord(spec.product_type)
  sampleLabel.value = liveSpecLabel(spec, config, configProductFirst(config)?.label)
  if (livePreview) preview.value = livePreview
}

async function loadSpeedOptions() {
  status.value = 'loading'
  try {
    const config = configRef.value ?? await api<CalculatorConfig>(API.calculator.config, { auth: false })
    configRef.value = config
    const spec = props.liveSpec ?? makeDefaultSpec(configProductFirst(config), config)
    const payload = buildPublicPreviewPayload(spec)
    if (!payload) {
      throw new Error('Calculator configuration has no priceable product')
    }
    const cached = props.liveSpec && props.livePreview ? props.livePreview : null
    const livePreview = cached ?? await api<ServerCalculatorPreview>(API.calculator.publicPreview, {
      method: 'POST',
      auth: false,
      body: payload,
    })
    if (!Array.isArray(livePreview?.speed_options) || livePreview.speed_options.length === 0) {
      status.value = 'error'
      return
    }
    applyLiveSpec(spec, config, livePreview)
    selectedSpeed.value = pricedOptions.value[0]?.key ?? ''
    status.value = 'ready'
  } catch {
    // Marketing must never break on a failed fetch: fall back to the CTA only.
    preview.value = null
    previewPayload.value = null
    sampleLabel.value = ''
    status.value = 'error'
  }
}

/**
 * The strip is on the same page as the calculator, so it must always price the
 * buyer's current spec ("Same job"). The page passes the shared calculator
 * spec/preview in as props and this watches them.
 */
watch(
  [() => props.liveSpec, () => props.livePreview],
  async ([spec, storePreview]) => {
    if (!spec || status.value === 'loading') return
    const payload = buildPublicPreviewPayload(spec)
    if (!payload) return
    try {
      let livePreview = storePreview ?? null
      if (!livePreview) {
        livePreview = await api<ServerCalculatorPreview>(
          API.calculator.publicPreview,
          { method: 'POST', auth: false, body: payload },
        )
      }
      if (!livePreview || !Array.isArray(livePreview.speed_options) || livePreview.speed_options.length === 0) {
        return
      }
      if (!configRef.value) {
        try {
          configRef.value = await api<CalculatorConfig>(API.calculator.config, { auth: false })
        } catch {
          /* label falls back to the spec's product key */
        }
      }
      applyLiveSpec(spec, configRef.value, livePreview)
      selectedSpeed.value = pricedOptions.value[0]?.key ?? ''
      status.value = 'ready'
    } catch {
      /* keep the last live price rather than inventing one */
    }
  },
  { deep: true },
)

/**
 * The strip is on the same page as the calculator, so it must always price the
 * buyer's current spec ("Same job"). The page passes the shared calculator
 * spec/preview in as props and the watcher above re-prices on every change.
 */

function chooseSpeed(key: string) {
  selectedSpeed.value = key
  updating.value = true
  if (updateTimer) {
    clearTimeout(updateTimer)
  }
  updateTimer = setTimeout(() => {
    updating.value = false
  }, 480)
}

function readyLabel(option: SpeedPriceOption, index: number): string {
  if (typeof option.turnaroundHours === 'number' && option.turnaroundHours > 0) {
    return `Ready in about ${option.turnaroundHours}h · Estimated`
  }
  return index === 0 ? 'Standard turnaround · Estimated' : 'Same job · faster turnaround · Estimated'
}

function perPieceLabel(option: SpeedPriceOption | undefined): string {
  if (!option?.range || !sampleQuantity.value) {
    return ''
  }
  const perPiece = calculatorPerUnitRange(option.range.min, option.range.max, sampleQuantity.value)
  return perPiece ? formatPerUnitRange(perPiece, sampleUnit.value, true) : ''
}

const buyerJourney = useBuyerJourney()

/** Signed-out manager pick on the marketing strip starts the real buyer journey. */
async function chooseManager(selection: { publicId: string; name: string }) {
  if (!sampleSpec.value) {
    return
  }
  try {
    await buyerJourney.startBuyerRequest(sampleSpec.value, preview.value, {
      publicId: selection.publicId,
      name: selection.name,
    })
  } catch {
    return
  }
  await navigateTo('/sign-up?mode=buyer')
}

onMounted(loadSpeedOptions)
onBeforeUnmount(() => {
  if (updateTimer) {
    clearTimeout(updateTimer)
  }
})
</script>

<template>
  <section id="speed" class="scroll-mt-20 border-y border-line bg-paper-2/60">
    <div class="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-20">
      <DesignSectionHead
        :eyebrow="props.eyebrow"
        :copy="props.copy"
      >
        <template #title>Same job. <span class="text-brand">Pick how fast.</span></template>
      </DesignSectionHead>
      <div v-if="pricedOptions.length > 0" class="mt-8">
        <p v-if="sampleLabel" class="mb-4 font-mono text-[10.5px] uppercase tracking-[0.14em] text-ink-3">
          Live pricing · {{ sampleLabel }}
        </p>

        <template v-if="props.showManagers">
          <div class="grid gap-3 sm:grid-cols-3">
            <button
              v-for="(option, index) in pricedOptions"
              :key="option.key"
              type="button"
              :aria-pressed="selectedOption?.key === option.key"
              class="group relative flex w-full cursor-pointer flex-col rounded-xl border p-4 text-left transition-all duration-300"
              :class="selectedOption?.key === option.key
                ? 'border-brand bg-mint/60 shadow-card'
                : 'border-line bg-card hover:border-line-strong hover:shadow-card'"
              @click="chooseSpeed(option.key)"
            >
              <span class="flex items-center gap-2">
                <span
                  class="flex h-4.5 w-4.5 shrink-0 items-center justify-center rounded-full border transition-colors"
                  :class="selectedOption?.key === option.key ? 'border-brand bg-brand text-white' : 'border-line-strong bg-paper'"
                >
                  <Check v-if="selectedOption?.key === option.key" class="h-3 w-3" :stroke-width="3.5" />
                </span>
                <span class="text-[14.5px] font-semibold tracking-tight">{{ option.label }}</span>
              </span>
              <span class="mt-2 block pl-6.5 sm:mt-3 sm:pl-0">
                <span class="block font-mono text-[11.5px] text-ink-2">{{ readyLabel(option, index) }}</span>
                <span class="tabular mt-1 block font-mono text-xl font-semibold text-ink">{{ option.text }}</span>
                <span class="tabular block font-mono text-[11px] text-ink-3">{{ perPieceLabel(option) }}</span>
              </span>
            </button>
          </div>

          <div class="mt-5 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-ink bg-ink px-6 py-5 text-paper">
            <div>
              <p class="font-mono text-[10.5px] tracking-[0.16em] text-paper/50 uppercase">
                Your total · {{ selectedOption?.label }}
              </p>
              <p class="tabular mt-1 font-mono text-3xl font-semibold tracking-tight">
                {{ selectedOption?.text }}
                <span class="tabular ml-2 font-mono text-[12px] font-medium text-paper/50">{{ perPieceLabel(selectedOption) }}</span>
              </p>
              <p class="mt-1 font-mono text-[11.5px] text-paper/55">{{ selectedOption ? readyLabel(selectedOption, pricedOptions.indexOf(selectedOption)) : '' }}</p>
            </div>
            <DesignButtonLink :href="ctaHref" tone="primary" size="md">
              {{ props.ctaLabel }}
            </DesignButtonLink>
          </div>

          <p class="mt-4 text-[12.5px] text-ink-2">Price and date are locked once you accept and pay.</p>

          <DesignRecommendedManagers
            v-if="selectedOption"
            :speed-id="selectedOption.key"
            :speed-label="selectedOption.label"
            :total-label="selectedOption.text"
            :per-piece-label="perPieceLabel(selectedOption)"
            :payload="previewPayload"
            :turnaround-hours="standardTurnaround"
            :updating="updating"
            @select-speed="chooseSpeed"
            @select-manager="chooseManager"
          />
        </template>

        <template v-else>
          <div class="grid gap-3 sm:grid-cols-3">
            <article
              v-for="(option, index) in pricedOptions"
              :key="option.key"
              class="crop-marks relative rounded-2xl border border-line bg-card p-5 shadow-card"
            >
              <p class="flex items-center justify-between gap-3">
                <span class="text-[14.5px] font-semibold tracking-tight text-ink">{{ option.label }}</span>
                <span
                  v-if="index === 0"
                  class="rounded-md border border-line bg-paper-2 px-2 py-0.5 font-mono text-[9px] font-semibold uppercase tracking-[0.1em] text-ink-3"
                >
                  Included
                </span>
              </p>
              <p class="tabular mt-4 font-mono text-2xl font-semibold tracking-tight text-ink">
                {{ option.text }}
              </p>
              <p v-if="option.turnaroundHours" class="mt-1 font-mono text-[11px] text-ink-3">
                Ready in about {{ option.turnaroundHours }}h
              </p>
              <p v-else-if="index > 0" class="mt-1 font-mono text-[11px] text-ink-3">
                Same job · faster turnaround
              </p>
              <p v-else class="mt-1 font-mono text-[11px] text-ink-3">
                Standard turnaround
              </p>
            </article>
          </div>
          <p class="mt-4 max-w-2xl text-[12.5px] leading-relaxed text-ink-2">
            These are live server prices for the spec above. Build your own spec to lock the exact total.
          </p>
          <div class="mt-8">
            <DesignButtonLink :href="ctaHref" tone="primary" size="lg">
              {{ props.ctaLabel }}
            </DesignButtonLink>
          </div>
        </template>
      </div>
      <div v-else-if="status === 'loading'" class="mt-8 flex items-center gap-2 text-[13px] text-ink-2">
        <Loader2 :size="14" class="animate-spin" aria-hidden="true" /> Loading live speed prices…
      </div>
      <div v-else-if="status === 'error'" class="mt-8">
        <p class="max-w-2xl text-[13px] leading-relaxed text-ink-2">
          Live speed pricing is unavailable right now. Build your own spec and the server will price it.
        </p>
        <DesignButtonLink :href="ctaHref" tone="primary" size="lg" class="mt-4">
          {{ props.ctaLabel }}
        </DesignButtonLink>
      </div>
    </div>
  </section>
</template>
