<script setup lang="ts">
/**
 * MINIMAL buyer layout — ONE card (SIDE TASK 6B, S6-04).
 *
 * A signed-out visitor, or a signed-in user acting as a client, sees a single
 * "Instant estimate" card: product, quantity, size, quality tier, colour, sides
 * and an optional needed-by, then a total / per-piece / earliest-delivery bar.
 * Technical stock names, grammages, finishing names, fees, imposition and shop
 * identity never appear here; the buyer chooses a quality tier that writes the
 * real stock + finishing into the SAME calculator store, so the server still
 * prices a real spec.
 *
 * The `*Override` props exist for unit tests only (they replace the store state
 * so a test can render without a network). Pages must not pass them.
 */
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { ArrowRight, BadgeCheck, Loader2, Lock, ShieldCheck } from 'lucide-vue-next'
import DesignCalculatorChoice from '~/components/design/calculator/CalculatorChoice.vue'
import {
  configProduct,
  configProductFirst,
  optionLabel,
  optionValue,
  PUBLIC_CALCULATOR_PRODUCT_KEYS,
  PUBLIC_CALCULATOR_PRODUCT_LABELS,
  type CalculatorConfigField,
  type CalculatorConfig,
  type CalculatorProductConfig,
} from '~/shared/calculator-config'
import { buildPublicPreviewPayload, type CalculatorSpec } from '~/shared/calculator-spec'
import {
  calculatorPerUnitRange,
  calculatorUnitWord,
  formatPerUnitRange,
  pluraliseUnit,
} from '~/shared/calculator-units'
import {
  applyCalculatorTier,
  calculatorTierChoices,
  selectedCalculatorTier,
} from '~/constants/design/calculator-tiers'
import { BUYER_SPEED_OPTIONS } from '~/constants/design/buyer-speed'
import { getApiErrorMessage } from '~/shared/api'
import type { ServerCalculatorPreview } from '~/shared/types'
import { useCalculatorStore } from '~/stores/calculator'
import { formatKSh } from '~/utils/money'

interface PublicPreviewMatch {
  human_ready_text?: string | null
  estimated_ready_at?: string | null
}

const props = withDefaults(defineProps<{
  authed?: boolean
  locked?: boolean
  priceOnly?: boolean
  ctaLabel?: string
  /** Tests only: supply config/spec/preview instead of using the store. */
  configOverride?: CalculatorConfig | null
  specOverride?: CalculatorSpec | null
  previewOverride?: ServerCalculatorPreview | null
  previewStatusOverride?: 'idle' | 'loading' | 'ready' | 'error'
  configStatusOverride?: 'idle' | 'loading' | 'ready' | 'error'
  /** Homepage split layout: question steps left, dark live price panel right. */
  split?: boolean
}>(), {
  authed: false,
  locked: false,
  priceOnly: false,
  split: false,
  ctaLabel: '',
  configOverride: null,
  specOverride: null,
  previewOverride: null,
  previewStatusOverride: undefined,
  configStatusOverride: undefined,
})

const emit = defineEmits<{
  'quote-created': [ref: string, total: number | null]
  unlock: []
}>()

const calcStore = useCalculatorStore()
const usingOverrides = computed(() => Boolean(props.configOverride || props.specOverride))

const config = computed<CalculatorConfig | null>(() => props.configOverride ?? calcStore.config)
const spec = computed<CalculatorSpec | null>(() => props.specOverride ?? calcStore.spec)
const preview = computed<ServerCalculatorPreview | null>(
  () => props.previewOverride ?? calcStore.preview,
)
const previewStatus = computed(() => props.previewStatusOverride ?? calcStore.previewStatus)

const product = computed(() => configProduct(config.value, spec.value?.product_type))

const productChoices = computed(() =>
  (config.value?.products ?? []).filter((candidate) =>
    (PUBLIC_CALCULATOR_PRODUCT_KEYS as readonly string[]).includes(candidate.key),
  ),
)

function productLabel(candidate: CalculatorProductConfig): string {
  return PUBLIC_CALCULATOR_PRODUCT_LABELS[candidate.key] ?? candidate.label
}

const sizeChoices = computed(() => product.value?.sizes ?? product.value?.size_options ?? [])

function fieldOptions(fieldKey: string) {
  const field: CalculatorConfigField | undefined = product.value?.fields?.find(
    (candidate) => candidate.key === fieldKey,
  )
  return field?.options ?? []
}

const colourChoices = computed(() => {
  const list = fieldOptions('color_mode')
  return list.length > 0 ? list : (config.value?.color_modes ?? [])
})

const sideChoices = computed(() => fieldOptions('print_sides'))

/** Design buyer speed options: Standard / Faster +50% / Fastest +100%.
 *  Prices come from the server's `speed_options`; before the first preview (or
 *  if the server omits them) the labels still render without a price. */
const speedChoices = computed(() => {
  const priced = preview.value?.speed_options ?? []
  if (priced.length > 0) {
    return priced.map((option) => ({
      value: option.key,
      label: option.label,
      sub: formatKSh(option.total) || undefined,
    }))
  }
  return BUYER_SPEED_OPTIONS.map((option) => ({
    value: option.id,
    label: option.label,
    sub: undefined,
  }))
})
const selectedBuyerSpeed = computed(() => spec.value?.speed_tier ?? 'standard')

function chooseBuyerSpeed(value: string) {
  const patch: Partial<CalculatorSpec> = { speed_tier: value }
  // The backend buyer estimate prices through the urgency ramp; the design
  // Standard tier maps onto it, while faster/farthest ride the backend speed
  // tier domain (POST /api/pricing/quote-speed/) and stay on the spec.
  if (value === 'standard') {
    patch.urgency_type = 'standard'
  }
  patchSpec(patch)
}

const tierChoices = computed(() => calculatorTierChoices(product.value, config.value))
const activeTier = computed(() => selectedCalculatorTier(tierChoices.value, spec.value))

const qty = computed(() => (typeof spec.value?.quantity === 'number' ? spec.value.quantity : 0))
const quantityPresets = computed(() => {
  const base = qty.value > 0 ? qty.value : 100
  return Array.from(new Set([base, base * 2, base * 5, base * 10]))
})

const unitWord = computed(() => calculatorUnitWord(spec.value?.product_type))

const totalText = computed(() => {
  const current = preview.value
  if (!current?.can_calculate) {
    return ''
  }
  const median = current.market_range?.median
  if (median !== null && median !== undefined && median !== '') {
    return formatKSh(median)
  }
  return current.display_price_text ?? ''
})

const perPieceText = computed(() => {
  const range = preview.value?.market_range
  if (!range) {
    return ''
  }
  const unitRange = calculatorPerUnitRange(
    range.min === null || range.min === '' ? null : Number(range.min),
    range.max === null || range.max === '' ? null : Number(range.max),
    qty.value,
  )
  if (!unitRange) {
    return ''
  }
  return formatPerUnitRange(unitRange, unitWord.value, true)
})

/**
 * Earliest promised delivery, read from the server's per-option ready text.
 * The public response keeps `human_ready_text` / `estimated_ready_at` on each
 * matched option (and nothing about shops or costs).
 */
const earliestDelivery = computed(() => {
  const matches = (preview.value as unknown as { matches?: PublicPreviewMatch[] } | null)?.matches
  if (!Array.isArray(matches) || matches.length === 0) {
    return ''
  }
  const dated = matches
    .map((match) => (match?.estimated_ready_at ? Date.parse(match.estimated_ready_at) : Number.NaN))
    .filter((value) => Number.isFinite(value))
  if (dated.length > 0) {
    const earliest = Math.min(...dated)
    const match = matches.find((candidate) =>
      candidate?.estimated_ready_at ? Date.parse(candidate.estimated_ready_at) === earliest : false,
    )
    if (match?.human_ready_text) {
      return match.human_ready_text
    }
  }
  return matches.find((match) => Boolean(match?.human_ready_text))?.human_ready_text ?? ''
})

const canSubmit = computed(() => Boolean(spec.value) && Boolean(preview.value?.can_calculate))
const ctaText = computed(() => props.ctaLabel || (props.authed ? 'Request this quote' : 'Get a quote'))

/* ── split layout: one-line spec summary + the live price panel ── */
const sizeSummary = computed(() => {
  const current = spec.value
  if (!current) {
    return ''
  }
  if (current.finished_size === 'custom' && current.width_mm && current.height_mm) {
    return `${current.width_mm}×${current.height_mm} mm`
  }
  const size = sizeChoices.value.find((candidate) => candidate.value === current.finished_size)
  if (!size) {
    return ''
  }
  const dimensions = size.width_mm && size.height_mm ? `${size.width_mm}×${size.height_mm} mm` : ''
  return dimensions && !size.label.includes('mm') ? `${size.label} · ${dimensions}` : size.label
})

const sidesSummary = computed(() => {
  const value = spec.value?.print_sides
  if (!value) {
    return ''
  }
  const option = sideChoices.value.find((candidate) => optionValue(candidate) === value)
  return option ? optionLabel(option) : value
})

const colourSummary = computed(() => {
  const value = spec.value?.color_mode
  if (!value) {
    return ''
  }
  const option = colourChoices.value.find((candidate) => optionValue(candidate) === value)
  return option ? optionLabel(option) : value
})

const speedSummary = computed(() =>
  speedChoices.value.find((option) => option.value === selectedBuyerSpeed.value)?.label ?? '',
)

const specSummary = computed(() => {
  const parts: string[] = []
  if (qty.value > 0) {
    parts.push(`${qty.value.toLocaleString('en-KE')} ${pluraliseUnit(unitWord.value, qty.value)}`)
  }
  if (product.value) {
    parts.push(productLabel(product.value))
  }
  for (const part of [sizeSummary.value, sidesSummary.value, colourSummary.value]) {
    if (part) {
      parts.push(part)
    }
  }
  return parts.join(' · ')
})

const priceRange = computed<{ min: number | null; max: number | null } | null>(() => {
  const range = preview.value?.market_range
  if (!range) {
    return null
  }
  const min = range.min === null || range.min === '' ? null : Number(range.min)
  const max = range.max === null || range.max === '' ? null : Number(range.max)
  const safeMin = Number.isFinite(min as number) ? min : null
  const safeMax = Number.isFinite(max as number) ? max : null
  if (safeMin === null && safeMax === null) {
    return null
  }
  return { min: safeMin, max: safeMax }
})

function kes(value: number, decimals?: number): string {
  return formatKSh(value, decimals)
}

const priceRangeText = computed(() => {
  const range = priceRange.value
  if (!range) {
    return ''
  }
  if (range.min !== null && range.max !== null && range.max > range.min) {
    return `${kes(range.min)} – ${kes(range.max)}`
  }
  const single = range.max ?? range.min
  return single === null ? '' : kes(single)
})

const perPieceAboutText = computed(() => {
  const range = priceRange.value
  if (!range || qty.value <= 1) {
    return ''
  }
  const unitRange = calculatorPerUnitRange(range.min, range.max, qty.value)
  if (!unitRange) {
    return ''
  }
  const low = unitRange.min
  const high = unitRange.max
  return high > low
    ? `about ${kes(low, 2)} – ${kes(high, 2)} per ${unitWord.value}`
    : `about ${kes(high, 2)} per ${unitWord.value}`
})

const splitPanelNote = 'Your price covers your selected spec and speed. A verified Printy manager will confirm the final price, and you only pay when you are happy to go ahead.'

/* ── spec edits: always through the shared calculator store ── */
function patchSpec(patch: Partial<CalculatorSpec>) {
  if (!spec.value) {
    return
  }
  calcStore.setSpec({ ...spec.value, ...patch })
}

function pickProduct(key: string) {
  calcStore.setProduct(key, spec.value)
}

function pickSize(value: string) {
  patchSpec({ finished_size: value })
}

function pickTier(tierId: string) {
  const choice = tierChoices.value.find((candidate) => candidate.id === tierId)
  if (!choice || !spec.value) {
    return
  }
  calcStore.setSpec(applyCalculatorTier(spec.value, choice))
}

function setQuantity(value: number) {
  patchSpec({ quantity: Math.max(1, Math.round(value)) })
}

function stepQuantity(delta: number) {
  setQuantity(qty.value + delta)
}

function readQuantity(event: Event) {
  const raw = (event.target as HTMLInputElement).value
  const parsed = Number(raw)
  if (raw === '' || !Number.isFinite(parsed)) {
    return
  }
  setQuantity(parsed)
}

/* ── boot + preview, same store path as the detailed view ── */
const saving = ref(false)
const submitError = ref('')
let previewTimer: ReturnType<typeof setTimeout> | null = null

function schedulePreview() {
  if (usingOverrides.value) {
    return
  }
  if (previewTimer) {
    clearTimeout(previewTimer)
  }
  const target = calcStore.spec
  if (!target || !buildPublicPreviewPayload(target)) {
    return
  }
  previewTimer = setTimeout(() => {
    calcStore.refreshPreview(target).catch(() => {})
  }, 320)
}

async function init() {
  if (usingOverrides.value) {
    return
  }
  if (calcStore.configStatus !== 'ready') {
    try {
      await calcStore.loadConfig()
    } catch {
      /* configError is surfaced by the surrounding surface */
    }
  }
  if (calcStore.config) {
    const restored = calcStore.restore()
    const target = restored ? configProduct(calcStore.config, restored.product_type) : null
    if (restored && target) {
      calcStore.adoptSpec(restored, target.key)
    } else {
      const first = configProductFirst(calcStore.config)
      if (first) {
        calcStore.setProduct(first.key, restored || null)
      }
    }
  }
  schedulePreview()
}

onMounted(init)
watch(spec, schedulePreview, { deep: true })
onBeforeUnmount(() => {
  if (previewTimer) {
    clearTimeout(previewTimer)
  }
})

/* ── actions ── */
async function submit() {
  if (saving.value || !spec.value || props.priceOnly) {
    return
  }
  submitError.value = ''
  saving.value = true
  try {
    if (props.locked) {
      try {
        await calcStore.saveGuestDraft(spec.value, preview.value)
      } catch {
        /* the local spec stays — sign-up re-syncs through the guest session */
      }
      emit('unlock')
      return
    }
    if (props.authed) {
      const draft = await calcStore.createDraft(spec.value, preview.value)
      emit('quote-created', draft.draft_reference, calcStore.previewMedian)
      return
    }
    const draft = await calcStore.saveGuestDraft(spec.value, preview.value)
    emit('quote-created', draft.draft_reference, calcStore.previewMedian)
  } catch (error) {
    submitError.value = getApiErrorMessage(
      error,
      'We could not save your quote. Your spec is still safe on this device.',
    )
  } finally {
    saving.value = false
  }
}
</script>

<template>
  <section
    data-design-calculator-minimal
    :class="split
      ? 'relative'
      : 'crop-marks relative overflow-hidden rounded-2xl border border-line bg-card shadow-card'"
  >
    <header v-if="!split" class="border-b border-line px-5 py-4">
      <div class="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.18em] text-ink-3">
        <span class="inline-block h-1.5 w-1.5 rounded-full bg-brand" aria-hidden="true" />
        Instant estimate
      </div>
      <h3 class="mt-1.5 text-[17px] font-semibold tracking-tight text-ink">Price your print run</h3>
    </header>

    <div :class="split ? 'grid gap-6 lg:grid-cols-12' : 'divide-y divide-line'">
      <div :class="split ? 'flex flex-col gap-3 lg:col-span-7' : ''">
        <div :class="split ? 'rounded-2xl border border-line bg-card px-5 py-4 shadow-card' : 'px-5 py-4'">
          <div :class="split ? 'flex items-center justify-between gap-3' : ''">
            <p class="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.16em] text-ink-3">
              <span v-if="split" class="tabular inline-flex h-6 w-6 items-center justify-center rounded-lg bg-mint font-mono text-[10px] font-bold tracking-normal text-brand-deep">01</span>
              Product
            </p>
            <span v-if="split && product" class="hidden shrink-0 rounded-md bg-paper-2 px-2 py-1 font-mono text-[10.5px] text-ink-2 sm:block">{{ productLabel(product) }}</span>
          </div>
          <div class="mt-2 flex flex-wrap gap-2">
            <DesignCalculatorChoice
              v-for="choice in productChoices"
              :key="choice.key"
              :active="spec?.product_type === choice.key"
              @click="pickProduct(choice.key)"
            >
              {{ productLabel(choice) }}
            </DesignCalculatorChoice>
          </div>
        </div>

        <div :class="split ? 'rounded-2xl border border-line bg-card px-5 py-4 shadow-card' : 'px-5 py-4'">
          <div :class="split ? 'flex items-center justify-between gap-3' : ''">
            <p class="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.16em] text-ink-3">
              <span v-if="split" class="tabular inline-flex h-6 w-6 items-center justify-center rounded-lg bg-mint font-mono text-[10px] font-bold tracking-normal text-brand-deep">02</span>
              Quantity
            </p>
            <span v-if="split" class="tabular hidden shrink-0 rounded-md bg-paper-2 px-2 py-1 font-mono text-[10.5px] text-ink-2 sm:block">{{ qty.toLocaleString('en-KE') }}</span>
          </div>
          <div class="mt-2 flex flex-wrap items-center gap-2">
            <button
              type="button"
              class="press-key flex h-9 w-9 items-center justify-center rounded-xl border border-line bg-paper text-[16px] font-semibold text-ink-2 transition-colors hover:border-line-strong hover:text-ink"
              aria-label="Fewer"
              @click="stepQuantity(-1)"
            >−</button>
            <input
              :value="qty"
              type="number"
              min="1"
              inputmode="numeric"
              aria-label="Quantity"
              class="tabular h-9 w-24 rounded-xl border border-line bg-paper px-3 text-center text-[13px] font-semibold text-ink focus:border-brand"
              @change="readQuantity"
            >
            <button
              type="button"
              class="press-key flex h-9 w-9 items-center justify-center rounded-xl border border-line bg-paper text-[16px] font-semibold text-ink-2 transition-colors hover:border-line-strong hover:text-ink"
              aria-label="More"
              @click="stepQuantity(1)"
            >+</button>
            <DesignCalculatorChoice
              v-for="preset in quantityPresets"
              :key="preset"
              :active="qty === preset"
              @click="setQuantity(preset)"
            >
              {{ preset.toLocaleString('en-KE') }}
            </DesignCalculatorChoice>
          </div>
        </div>

        <div v-if="sizeChoices.length" :class="split ? 'rounded-2xl border border-line bg-card px-5 py-4 shadow-card' : 'px-5 py-4'">
          <div :class="split ? 'flex items-center justify-between gap-3' : ''">
            <p class="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.16em] text-ink-3">
              <span v-if="split" class="tabular inline-flex h-6 w-6 items-center justify-center rounded-lg bg-mint font-mono text-[10px] font-bold tracking-normal text-brand-deep">03</span>
              Size
            </p>
            <span v-if="split && sizeSummary" class="hidden shrink-0 rounded-md bg-paper-2 px-2 py-1 font-mono text-[10.5px] text-ink-2 sm:block">{{ sizeSummary }}</span>
          </div>
          <div class="mt-2 flex flex-wrap gap-2">
            <DesignCalculatorChoice
              v-for="size in sizeChoices"
              :key="size.value"
              :active="spec?.finished_size === size.value"
              @click="pickSize(size.value)"
            >
              {{ size.label }}
            </DesignCalculatorChoice>
          </div>
        </div>

        <div v-if="tierChoices.length" :class="split ? 'rounded-2xl border border-line bg-card px-5 py-4 shadow-card' : 'px-5 py-4'">
          <div :class="split ? 'flex items-center justify-between gap-3' : ''">
            <p class="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.16em] text-ink-3">
              <span v-if="split" class="tabular inline-flex h-6 w-6 items-center justify-center rounded-lg bg-mint font-mono text-[10px] font-bold tracking-normal text-brand-deep">04</span>
              Quality
            </p>
            <span v-if="split && activeTier" class="hidden shrink-0 rounded-md bg-paper-2 px-2 py-1 font-mono text-[10.5px] text-ink-2 sm:block">{{ activeTier.label }}</span>
          </div>
          <div class="mt-2 flex flex-wrap gap-2">
            <DesignCalculatorChoice
              v-for="tier in tierChoices"
              :key="tier.id"
              :active="activeTier?.id === tier.id"
              @click="pickTier(tier.id)"
            >
              {{ tier.label }}
            </DesignCalculatorChoice>
          </div>
          <p v-if="activeTier" class="mt-2 text-[11.5px] leading-relaxed text-ink-3">
            {{ activeTier.hint }}
          </p>
        </div>

        <div v-if="colourChoices.length" :class="split ? 'rounded-2xl border border-line bg-card px-5 py-4 shadow-card' : 'px-5 py-4'">
          <div :class="split ? 'flex items-center justify-between gap-3' : ''">
            <p class="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.16em] text-ink-3">
              <span v-if="split" class="tabular inline-flex h-6 w-6 items-center justify-center rounded-lg bg-mint font-mono text-[10px] font-bold tracking-normal text-brand-deep">05</span>
              Colour
            </p>
            <span v-if="split && colourSummary" class="hidden shrink-0 rounded-md bg-paper-2 px-2 py-1 font-mono text-[10.5px] text-ink-2 sm:block">{{ colourSummary }}</span>
          </div>
          <div class="mt-2 flex flex-wrap gap-2">
            <DesignCalculatorChoice
              v-for="option in colourChoices"
              :key="optionValue(option)"
              :active="spec?.color_mode === optionValue(option)"
              @click="patchSpec({ color_mode: optionValue(option) })"
            >
              {{ optionLabel(option) }}
            </DesignCalculatorChoice>
          </div>
        </div>

        <div v-if="sideChoices.length" :class="split ? 'rounded-2xl border border-line bg-card px-5 py-4 shadow-card' : 'px-5 py-4'">
          <div :class="split ? 'flex items-center justify-between gap-3' : ''">
            <p class="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.16em] text-ink-3">
              <span v-if="split" class="tabular inline-flex h-6 w-6 items-center justify-center rounded-lg bg-mint font-mono text-[10px] font-bold tracking-normal text-brand-deep">06</span>
              Sides
            </p>
            <span v-if="split && sidesSummary" class="hidden shrink-0 rounded-md bg-paper-2 px-2 py-1 font-mono text-[10.5px] text-ink-2 sm:block">{{ sidesSummary }}</span>
          </div>
          <div class="mt-2 flex flex-wrap gap-2">
            <DesignCalculatorChoice
              v-for="option in sideChoices"
              :key="optionValue(option)"
              :active="spec?.print_sides === optionValue(option)"
              @click="patchSpec({ print_sides: optionValue(option) })"
            >
              {{ optionLabel(option) }}
            </DesignCalculatorChoice>
          </div>
        </div>

        <div :class="split ? 'rounded-2xl border border-line bg-card px-5 py-4 shadow-card' : 'px-5 py-4'">
          <div :class="split ? 'flex items-center justify-between gap-3' : ''">
            <p class="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.16em] text-ink-3">
              <span v-if="split" class="tabular inline-flex h-6 w-6 items-center justify-center rounded-lg bg-mint font-mono text-[10px] font-bold tracking-normal text-brand-deep">07</span>
              Speed
            </p>
            <span v-if="split && speedSummary" class="hidden shrink-0 rounded-md bg-paper-2 px-2 py-1 font-mono text-[10.5px] text-ink-2 sm:block">{{ speedSummary }}</span>
          </div>
          <div class="mt-2 flex flex-wrap gap-2">
            <DesignCalculatorChoice
              v-for="option in speedChoices"
              :key="option.value"
              :active="selectedBuyerSpeed === option.value"
              :sub="option.sub"
              @click="chooseBuyerSpeed(option.value)"
            >
              {{ option.label }}
            </DesignCalculatorChoice>
          </div>
          <p v-if="selectedBuyerSpeed && selectedBuyerSpeed !== 'standard'" class="mt-2 text-[11.5px] leading-relaxed text-ink-3">
            Need it faster? The estimate and the ready-by time update together.
          </p>
        </div>
      </div>

      <aside v-if="split" class="lg:col-span-5">
        <div class="lg:sticky lg:top-24">
          <div class="relative overflow-hidden rounded-2xl border border-ink bg-ink p-6 text-paper shadow-lift sm:p-7">
            <div class="halftone absolute -top-8 -right-8 h-36 w-36 rounded-full opacity-25" aria-hidden="true" />
            <div class="flex items-center justify-between">
              <p class="font-mono text-[10.5px] tracking-[0.18em] text-paper/50 uppercase">
                Your price
              </p>
              <Loader2 v-if="previewStatus === 'loading'" class="h-4 w-4 animate-spin text-brand-bright" aria-hidden="true" />
              <BadgeCheck v-else class="h-4 w-4 text-brand-bright" aria-hidden="true" />
            </div>

            <p class="mt-3 text-sm text-paper/60">{{ specSummary || 'Your selected spec' }}</p>

            <p v-if="previewStatus === 'loading'" class="tabular mt-1 inline-flex items-center gap-2 font-mono text-[22px] leading-none font-semibold tracking-tight">
              <Loader2 :size="18" class="animate-spin" aria-hidden="true" /> Pricing…
            </p>
            <p v-else-if="priceRangeText" class="tabular mt-1 font-mono text-[40px] leading-none font-semibold tracking-tight">
              {{ priceRangeText }}
            </p>
            <p v-else class="tabular mt-1 font-mono text-[40px] leading-none font-semibold tracking-tight">—</p>

            <p v-if="perPieceAboutText" class="tabular mt-2 font-mono text-[12.5px] text-paper/60">
              {{ perPieceAboutText }}
            </p>
            <p v-if="earliestDelivery" class="mt-2 font-mono text-[11.5px] text-paper/55">
              Ready {{ earliestDelivery }}
            </p>

            <p class="mt-5 border-t border-paper/15 pt-4 text-[12.5px] leading-relaxed text-paper/55">
              {{ splitPanelNote }}
            </p>

            <NuxtLink
              to="/quote"
              class="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-brand py-3.5 text-[15px] font-semibold text-white shadow-brand transition-all hover:bg-brand-deep"
            >
              Get my exact quote
              <ArrowRight class="h-4 w-4" aria-hidden="true" />
            </NuxtLink>
            <p class="mt-3 flex items-center justify-center gap-1.5 text-center text-[12px] text-paper/45">
              <ShieldCheck class="h-3.5 w-3.5" aria-hidden="true" /> No payment here — build your exact quote next
            </p>
          </div>
        </div>
      </aside>
    </div>

    <footer v-if="!split" class="border-t border-line bg-paper-2/60 px-5 py-4">
      <div class="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p class="font-mono text-[10px] uppercase tracking-[0.16em] text-ink-3">Total</p>
          <p data-minimal-total class="tabular mt-1 text-[26px] font-bold leading-none tracking-tight text-ink">
            <span v-if="previewStatus === 'loading'" class="inline-flex items-center gap-2 text-[15px] font-medium text-ink-2">
              <Loader2 :size="14" class="animate-spin" aria-hidden="true" /> Pricing…
            </span>
            <template v-else>{{ totalText || '—' }}</template>
          </p>
          <p class="mt-2 flex flex-wrap gap-x-4 gap-y-1 font-mono text-[10.5px] uppercase tracking-[0.1em] text-ink-3">
            <span v-if="perPieceText">{{ perPieceText }}</span>
            <span v-if="earliestDelivery">Ready {{ earliestDelivery }}</span>
          </p>
          <p class="mt-2 text-[11.5px] leading-relaxed text-ink-3">
            Estimate only. Your print partner confirms the final price.
          </p>
        </div>
        <button
          v-if="!priceOnly"
          type="button"
          class="press-key inline-flex items-center gap-2 rounded-xl bg-brand-deep px-4 py-2.5 text-[13px] font-semibold text-paper shadow-card transition-opacity hover:opacity-90 disabled:opacity-50"
          :disabled="!canSubmit || saving"
          @click="submit"
        >
          <Loader2 v-if="saving" :size="14" class="animate-spin" aria-hidden="true" />
          <Lock v-else-if="locked" :size="14" aria-hidden="true" />
          {{ ctaText }}
        </button>
      </div>
      <p v-if="submitError" class="mt-2 text-[12px] font-medium text-danger">{{ submitError }}</p>
    </footer>
  </section>
</template>
