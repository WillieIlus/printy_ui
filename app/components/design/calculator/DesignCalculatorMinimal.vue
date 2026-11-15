<script setup lang="ts">
/**
 * THE universal calculator presentation.
 *
 * General public, buyers, managers and printers all mount this same layout:
 * the same numbered workflow cards on the left and the same dark live-price
 * panel on the right. Role-specific information (production options and
 * imposition) is an extra section gated by `showProductionDetails`; it never
 * changes the calculator design.
 *
 * Technical stock names, grammages, finishing names, fees and shop identity
 * stay out of the buyer view; buyers choose a quality tier that writes the real
 * stock + finishing into the SAME calculator store, so the server still prices
 * a real spec. The `*Override` props exist for unit tests only.
 */
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { ArrowRight, Loader2, Lock } from 'lucide-vue-next'
import DesignCalculatorChoice from '~/components/design/calculator/CalculatorChoice.vue'
import DesignCalculatorWorkflowCard from '~/components/design/calculator/CalculatorWorkflowCard.vue'
import DesignCalculatorSpeedOptions from '~/components/design/calculator/CalculatorSpeedOptions.vue'
import DesignCalculatorPricePanel from '~/components/design/calculator/CalculatorPricePanel.vue'
import DesignCalculatorRoleBreakdown from '~/components/design/calculator/DesignCalculatorRoleBreakdown.vue'
import DesignCalculatorFinishing from '~/components/design/calculator/DesignCalculatorFinishing.vue'
import DesignCalculatorOptions from '~/components/design/calculator/DesignCalculatorOptions.vue'
import DesignRecommendedManagers from '~/components/design/marketing/RecommendedManagers.vue'
import ImpositionSheet from '~/components/workbench/calculator/ImpositionSheet.vue'
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
  pluraliseUnit,
} from '~/shared/calculator-units'
import {
  applyCalculatorTier,
  calculatorTierChoices,
  selectedCalculatorTier,
  type CalculatorTierChoice,
} from '~/constants/design/calculator-tiers'
import { speedPriceOptions } from '~/shared/calculator-speed-pricing'
import { buyerSpeedChoice } from '~/constants/design/buyer-speed'
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
  /** Kept for page compatibility; the universal layout is always split. */
  split?: boolean
  /** Manager/admin role capability: show production options + imposition. */
  showProductionDetails?: boolean
  compact?: boolean
  embedded?: boolean
  stacked?: boolean
}>(), {
  authed: false,
  locked: false,
  priceOnly: false,
  split: false,
  showProductionDetails: false,
  compact: false,
  embedded: false,
  stacked: false,
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
/** The spec the visible preview was priced for, not merely the current spec. */
const previewSpec = computed<CalculatorSpec | null>(
  () => props.specOverride ?? calcStore.previewSpec ?? spec.value,
)

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

/**
 * Speed cards share the summary's base range. `previewSpec` keeps the tier the
 * visible preview was priced for, so the base range stays stable while a newer
 * spec debounces and every option is the same range × its own multiplier.
 */
const speedChoices = computed(() => {
  const pricedSpeed = previewSpec.value?.speed_tier ?? 'standard'
  return speedPriceOptions(preview.value, pricedSpeed)
})
const selectedBuyerSpeed = computed(() => buyerSpeedChoice(spec.value?.speed_tier)?.id ?? 'standard')

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

/** Production-only GSM detail under a quality chip (e.g. "250gsm"). */
function tierGsm(choice: CalculatorTierChoice): number | null {
  const entry = Object.entries(choice.patch).find(
    ([key, value]) => key.endsWith('_gsm') && typeof value === 'number',
  )
  if (!entry) {
    return null
  }
  const gsm = Number(entry[1])
  return Number.isFinite(gsm) && gsm > 0 ? gsm : null
}

function tierSubLabel(choice: CalculatorTierChoice): string {
  const gsm = tierGsm(choice)
  return gsm === null ? '' : `${gsm}gsm`
}

function paperCategoryLabel(value: unknown): string {
  const raw = String(value ?? '')
  const option = (config.value?.paper_categories ?? []).find(
    (candidate) => optionValue(candidate) === raw,
  )
  return option ? optionLabel(option) : raw
}

/** Production-only stock summary for the selected quality tier. */
const activeTierStock = computed(() => {
  const choice = activeTier.value
  if (!choice) {
    return ''
  }
  const entries = Object.entries(choice.patch)
  const stock = entries.find(([key]) => key.endsWith('paper_category'))
  const gsm = entries.find(([key]) => key.endsWith('_gsm'))
  return [
    stock ? paperCategoryLabel(stock[1]) : '',
    gsm ? `${gsm[1]}gsm` : '',
  ].filter(Boolean).join(' · ')
})

const qty = computed(() => (typeof spec.value?.quantity === 'number' ? spec.value.quantity : 0))
const quantityPresets = computed(() => {
  const base = qty.value > 0 ? qty.value : 100
  return Array.from(new Set([base, base * 2, base * 5, base * 10]))
})

const unitWord = computed(() => calculatorUnitWord(spec.value?.product_type))

const productionPreview = computed(() => preview.value?.production_preview ?? null)

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
  speedChoices.value.find((option) => option.key === selectedBuyerSpeed.value)?.label ?? '',
)

/**
 * The recommendation endpoint derives the rush tiers from the standard
 * turnaround. A preview without a turnaround lets the server use its stage-SLA
 * fallback, exactly like the marketing speed strip.
 */
const standardTurnaround = computed(() => {
  const standard = speedChoices.value.find((option) => option.key === 'standard')
  return typeof standard?.turnaroundHours === 'number' ? standard.turnaroundHours : null
})

/**
 * Production desk only: how many configured prices the server matched for this
 * exact spec. A zero is still information — it says the desk has no active
 * price row for the selection yet.
 */
const configuredPriceText = computed(() => {
  const count = preview.value?.matches_count
  if (typeof count !== 'number' || !Number.isFinite(count)) {
    return ''
  }
  const safe = Math.max(0, Math.trunc(count))
  return `${safe} configured price${safe === 1 ? '' : 's'}`
})

/* ── "Get my exact quote" reveals the managers who can take the job ── */
const managersRevealed = ref(false)
const managersPayload = computed(() => buildPublicPreviewPayload(previewSpec.value))

function revealManagers() {
  managersRevealed.value = true
}

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

/* ── canonical role economics (manager/printer only) ── */
const roleEconomics = computed(() => preview.value?.role_economics ?? null)
const isPrinterRole = computed(() => roleEconomics.value?.role === 'printer')

/** A printer prices production, not the buyer's client-facing range. */
const panelPriceText = computed(() => {
  if (!isPrinterRole.value) {
    return priceRangeText.value
  }
  const total = Number(roleEconomics.value?.production_total)
  return Number.isFinite(total) ? kes(total) : ''
})

const panelPerPieceText = computed(() => {
  if (!isPrinterRole.value) {
    return perPieceAboutText.value
  }
  const total = Number(roleEconomics.value?.production_total)
  if (!Number.isFinite(total) || qty.value <= 1) {
    return ''
  }
  return `about ${kes(total / qty.value, 2)} per ${unitWord.value}`
})

const panelNote = computed(() => {
  if (roleEconomics.value?.role === 'printer') {
    return 'Your production cost for this exact spec from the Printy rate card. Line detail and payout are below.'
  }
  if (roleEconomics.value?.role === 'manager') {
    return 'Printer cost, your markup and the client-inclusive price below all come from the same server calculation.'
  }
  return splitPanelNote
})

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
  patchSpec({
    finished_size: value,
    // A standard size must never leave stale custom dimensions in the payload.
    width_mm: undefined,
    height_mm: undefined,
  })
}

/** Custom size is available to every viewer, not just production desks. */
function pickCustomSize() {
  const selected = sizeChoices.value.find(
    (candidate) => candidate.value === spec.value?.finished_size,
  )
  const fallback = sizeChoices.value[0]
  patchSpec({
    finished_size: 'custom',
    width_mm: spec.value?.width_mm ?? selected?.width_mm ?? fallback?.width_mm ?? 85,
    height_mm: spec.value?.height_mm ?? selected?.height_mm ?? fallback?.height_mm ?? 55,
  })
}

function readCustomDimension(key: 'width_mm' | 'height_mm', event: Event) {
  const raw = (event.target as HTMLInputElement).value
  const parsed = Number(raw)
  const value = raw !== '' && Number.isFinite(parsed) && parsed > 0 ? parsed : undefined
  patchSpec({ finished_size: 'custom', [key]: value })
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
/**
 * Auth-only CTA markup is deferred until after hydration, matching the public
 * header. Server-rendered public pages may not know the session, while the
 * client restores it from cookies, so rendering the signed-in button during
 * hydration would mismatch the server's guest link.
 */
const authCtaReady = ref(false)
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

onMounted(() => {
  authCtaReady.value = true
  init()
})
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
      const total = calcStore.previewMedian
      const { draft, quoteRequests } = await calcStore.requestQuote(spec.value, preview.value)
      const submitted = quoteRequests[0]
      emit('quote-created', submitted?.request_reference || draft.draft_reference, total)
      return
    }
    const draft = await calcStore.saveGuestDraft(spec.value, preview.value)
    emit('quote-created', draft.draft_reference, calcStore.previewMedian)
  } catch (error) {
    submitError.value = getApiErrorMessage(
      error,
      props.authed
        ? 'We could not send your quote request. Your spec is still safe on this device.'
        : 'We could not save your quote. Your spec is still safe on this device.',
    )
  } finally {
    saving.value = false
  }
}
</script>

<template>
  <section data-design-calculator-minimal class="relative">
    <div class="grid gap-6 lg:grid-cols-12">
      <div :class="['flex flex-col lg:col-span-7', props.compact ? 'gap-2' : 'gap-3']">
        <DesignCalculatorWorkflowCard n="01" label="Product" :value="product ? productLabel(product) : ''">
          <div class="flex flex-wrap gap-2">
            <DesignCalculatorChoice
              v-for="choice in productChoices"
              :key="choice.key"
              :active="spec?.product_type === choice.key"
              @click="pickProduct(choice.key)"
            >
              {{ productLabel(choice) }}
            </DesignCalculatorChoice>
          </div>
        </DesignCalculatorWorkflowCard>

        <DesignCalculatorWorkflowCard n="02" label="Quantity" :value="qty.toLocaleString('en-KE')">
          <div class="flex flex-wrap items-center gap-2">
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
        </DesignCalculatorWorkflowCard>

        <DesignCalculatorWorkflowCard v-if="sizeChoices.length" n="03" label="Size" :value="sizeSummary">
          <div class="flex flex-wrap gap-2">
            <DesignCalculatorChoice
              v-for="size in sizeChoices"
              :key="size.value"
              :active="spec?.finished_size === size.value"
              @click="pickSize(size.value)"
            >
              {{ size.label }}
            </DesignCalculatorChoice>
            <DesignCalculatorChoice
              :active="spec?.finished_size === 'custom'"
              @click="pickCustomSize"
            >
              Custom
            </DesignCalculatorChoice>
          </div>
          <div v-if="spec?.finished_size === 'custom'" class="mt-2 flex flex-wrap items-center gap-2">
            <label class="flex items-center gap-1.5 text-[11px] font-medium text-ink-2">
              <span class="font-mono text-[9.5px] tracking-[0.1em] text-ink-3 uppercase">Width</span>
              <input
                :value="spec?.width_mm ?? ''"
                type="number"
                min="1"
                step="0.1"
                inputmode="decimal"
                aria-label="Custom width in millimetres"
                class="tabular h-9 w-20 rounded-xl border border-line bg-paper px-2 text-center text-[13px] font-semibold text-ink focus:border-brand"
                @input="readCustomDimension('width_mm', $event)"
              >
              <span class="font-mono text-[9.5px] text-ink-3">mm</span>
            </label>
            <label class="flex items-center gap-1.5 text-[11px] font-medium text-ink-2">
              <span class="font-mono text-[9.5px] tracking-[0.1em] text-ink-3 uppercase">Length</span>
              <input
                :value="spec?.height_mm ?? ''"
                type="number"
                min="1"
                step="0.1"
                inputmode="decimal"
                aria-label="Custom length in millimetres"
                class="tabular h-9 w-20 rounded-xl border border-line bg-paper px-2 text-center text-[13px] font-semibold text-ink focus:border-brand"
                @input="readCustomDimension('height_mm', $event)"
              >
              <span class="font-mono text-[9.5px] text-ink-3">mm</span>
            </label>
          </div>
        </DesignCalculatorWorkflowCard>

        <DesignCalculatorWorkflowCard v-if="tierChoices.length" n="04" label="Quality" :value="activeTier?.label">
          <div class="flex flex-wrap gap-2">
            <DesignCalculatorChoice
              v-for="tier in tierChoices"
              :key="tier.id"
              :active="activeTier?.id === tier.id"
              :sub="props.showProductionDetails ? tierSubLabel(tier) : undefined"
              @click="pickTier(tier.id)"
            >
              {{ tier.label }}
            </DesignCalculatorChoice>
          </div>
          <p v-if="activeTier" class="mt-2 text-[11.5px] leading-relaxed text-ink-3">
            {{ activeTier.hint }}
          </p>
          <p
            v-if="props.showProductionDetails && activeTierStock"
            class="mt-1 font-mono text-[10px] tracking-[0.1em] text-ink-3 uppercase"
          >
            Stock: {{ activeTierStock }}
          </p>
        </DesignCalculatorWorkflowCard>

        <DesignCalculatorWorkflowCard v-if="colourChoices.length" n="05" label="Colour" :value="colourSummary">
          <div class="flex flex-wrap gap-2">
            <DesignCalculatorChoice
              v-for="option in colourChoices"
              :key="optionValue(option)"
              :active="spec?.color_mode === optionValue(option)"
              @click="patchSpec({ color_mode: optionValue(option) })"
            >
              {{ optionLabel(option) }}
            </DesignCalculatorChoice>
          </div>
        </DesignCalculatorWorkflowCard>

        <DesignCalculatorWorkflowCard v-if="sideChoices.length" n="06" label="Sides" :value="sidesSummary">
          <div class="flex flex-wrap gap-2">
            <DesignCalculatorChoice
              v-for="option in sideChoices"
              :key="optionValue(option)"
              :active="spec?.print_sides === optionValue(option)"
              @click="patchSpec({ print_sides: optionValue(option) })"
            >
              {{ optionLabel(option) }}
            </DesignCalculatorChoice>
          </div>
        </DesignCalculatorWorkflowCard>

        <DesignCalculatorWorkflowCard v-if="!isPrinterRole" n="07" label="Speed" :value="speedSummary">
          <DesignCalculatorSpeedOptions
            :options="speedChoices"
            :selected="selectedBuyerSpeed"
            :loading="previewStatus === 'loading'"
            @select="chooseBuyerSpeed"
          />
          <p v-if="selectedBuyerSpeed && selectedBuyerSpeed !== 'standard'" class="mt-2 text-[11.5px] leading-relaxed text-ink-3">
            Need it faster? The estimate and the ready-by time update together.
          </p>
        </DesignCalculatorWorkflowCard>

        <template v-if="props.showProductionDetails">
          <DesignCalculatorFinishing :product="product" :spec="spec" @patch="patchSpec" />
          <DesignCalculatorOptions />
          <DesignCalculatorWorkflowCard
            v-if="productionPreview"
            n="IM"
            label="Imposition"
            hint="The sheet layout this price is built from, straight from the pricing engine."
          >
            <ImpositionSheet :imposition="productionPreview" />
          </DesignCalculatorWorkflowCard>
        </template>
      </div>

      <aside class="lg:col-span-5">
        <div class="lg:sticky lg:top-24">
          <DesignCalculatorPricePanel
            :price-text="panelPriceText"
            :loading="previewStatus === 'loading'"
            :spec-summary="specSummary"
            :per-piece-text="panelPerPieceText"
            :delivery-text="earliestDelivery"
            :count-text="props.showProductionDetails ? configuredPriceText : ''"
            :note="panelNote"
            :detail-slot-note="props.priceOnly ? '' : 'No payment here — build your exact quote next'"
          >
            <DesignCalculatorRoleBreakdown v-if="roleEconomics" :economics="roleEconomics" />
            <button
              v-if="props.locked"
              type="button"
              class="flex w-full items-center justify-center gap-2 rounded-xl bg-brand py-3.5 text-[15px] font-semibold text-white shadow-brand transition-all hover:bg-brand-deep"
              :disabled="saving"
              @click="submit"
            >
              <Loader2 v-if="saving" :size="15" class="animate-spin" aria-hidden="true" />
              <Lock v-else :size="15" aria-hidden="true" />
              {{ ctaText }}
            </button>
            <button
              v-else-if="authCtaReady && props.authed && !props.priceOnly"
              type="button"
              class="flex w-full items-center justify-center gap-2 rounded-xl bg-brand py-3.5 text-[15px] font-semibold text-white shadow-brand transition-all hover:bg-brand-deep disabled:cursor-not-allowed disabled:opacity-50"
              :disabled="!canSubmit || saving"
              @click="submit"
            >
              <Loader2 v-if="saving" :size="15" class="animate-spin" aria-hidden="true" />
              {{ ctaText }}
            </button>
            <button
              v-else-if="!props.priceOnly"
              type="button"
              class="flex w-full items-center justify-center gap-2 rounded-xl bg-brand py-3.5 text-[15px] font-semibold text-white shadow-brand transition-all hover:bg-brand-deep"
              :aria-expanded="managersRevealed"
              @click="revealManagers"
            >
              Get my exact quote
              <ArrowRight class="h-4 w-4" aria-hidden="true" />
            </button>
            <p v-if="submitError" class="mt-2 text-center text-[12px] font-medium text-[#ffb4b4]">
              {{ submitError }}
            </p>
          </DesignCalculatorPricePanel>
        </div>
      </aside>
    </div>

    <DesignRecommendedManagers
      v-if="managersRevealed && managersPayload"
      data-calculator-managers
      :speed-id="selectedBuyerSpeed"
      :speed-label="speedSummary || 'Standard'"
      :total-label="priceRangeText"
      :per-piece-label="perPieceAboutText"
      :payload="managersPayload"
      :turnaround-hours="standardTurnaround"
      @select-speed="chooseBuyerSpeed"
    />
  </section>
</template>
