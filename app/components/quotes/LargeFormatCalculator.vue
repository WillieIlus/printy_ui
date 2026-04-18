<template>
  <CalculatorShell :anchor-id="anchorId">
    <template v-if="showHeaderContent || showHeaderSwitcher" #header>
      <div :class="compact ? 'space-y-3' : 'space-y-4'">
        <div class="flex flex-col gap-3 xl:flex-row xl:items-start xl:justify-between">
          <CalculatorHeaderBlock :eyebrow="eyebrow" :title="title" :description="description" :compact="compact" />
          <CalculatorTypeSwitcher
            v-if="showHeaderSwitcher"
            :model-value="calculatorType ?? undefined"
            :options="calculatorTypeOptions"
            size="sm"
            tone="embedded"
            @update:model-value="emit('update:calculatorType', $event)"
          />
        </div>
      </div>
    </template>

    <template #form>
      <CalculatorFormGrid @submit="findMatchingShops">
        <div class="grid gap-4 md:grid-cols-2">
          <CalculatorFieldGroup label="Large-format subtype">
            <USelectMenu v-model="productSubtype" :items="subtypeOptions" value-key="value" label-key="label" :ui="selectUi" portal="body" class="w-full" />
          </CalculatorFieldGroup>
          <CalculatorFieldGroup label="Quantity">
            <UInput :model-value="quantity" :ui="inputUi" type="number" min="1" @update:model-value="quantity = normalizeInteger($event, 1)" />
          </CalculatorFieldGroup>
        </div>

        <div class="grid gap-4 md:grid-cols-2">
          <CalculatorFieldGroup label="Material preference">
            <USelectMenu :model-value="materialPreference" :items="materialPreferenceOptions" value-key="value" label-key="label" :ui="selectUi" portal="body" class="w-full" @update:model-value="materialPreference = normalizeStringValue($event) || 'Banner PVC'" />
          </CalculatorFieldGroup>
          <CalculatorFieldGroup label="Turnaround (hours)">
            <UInput :model-value="turnaroundHours || undefined" :ui="inputUi" type="number" min="1" @update:model-value="turnaroundHours = normalizeNumber($event)" />
          </CalculatorFieldGroup>
        </div>

        <div class="grid gap-4 md:grid-cols-2">
          <CalculatorFieldGroup label="Size mode">
            <USelectMenu :model-value="sizeMode" :items="sizeModeOptions" value-key="value" label-key="label" :ui="selectUi" portal="body" class="w-full" @update:model-value="handleSizeModeChange" />
          </CalculatorFieldGroup>
          <CalculatorFieldGroup v-if="sizeMode === 'standard'" label="Standard size">
            <USelectMenu :model-value="sizeLabel" :items="sizePresetOptions" value-key="value" label-key="label" :ui="selectUi" portal="body" class="w-full" @update:model-value="handleSizePresetChange" />
          </CalculatorFieldGroup>
        </div>

        <div v-if="sizeMode === 'custom'" class="grid gap-4 md:grid-cols-2">
          <CalculatorFieldGroup label="Width (mm)">
            <UInput :model-value="widthInput || undefined" :ui="inputUi" type="number" min="0.1" step="0.01" @update:model-value="handleWidthChange" />
          </CalculatorFieldGroup>
          <CalculatorFieldGroup label="Height (mm)">
            <UInput :model-value="heightInput || undefined" :ui="inputUi" type="number" min="0.1" step="0.01" @update:model-value="handleHeightChange" />
          </CalculatorFieldGroup>
        </div>

        <details class="group rounded-2xl border border-white/10 bg-white/[0.03]">
          <summary class="flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-3.5 text-sm font-semibold text-[var(--p-text)] marker:hidden">
            <span class="flex items-center gap-2">
              <UIcon name="i-lucide-scissors" class="h-4 w-4 text-flamingo-400" />
              Finishings
            </span>
            <UIcon name="i-lucide-chevron-down" class="h-4 w-4 text-[var(--p-text-muted)] transition-transform duration-200 group-open:rotate-180" />
          </summary>
          <div class="space-y-4 border-t border-[var(--p-border)] px-4 py-4">
            <div class="rounded-xl border border-[var(--p-border)] bg-[var(--p-surface-sunken)] px-4 py-3 text-sm text-[var(--p-text-muted)]">
              Marketplace matching currently prices subtype, material, size, and turnaround directly. Use the finishing brief for mounting, eyelets, stands, installation, or other shop-specific finishing instructions.
            </div>
            <CalculatorFieldGroup label="Finishing brief">
              <UTextarea v-model="customBrief" :ui="{ base: 'w-full px-4 py-2 text-sm min-h-[7rem]' }" :rows="3" placeholder="Describe mounting, finishing, installation, eyelets, stands, or delivery notes." />
            </CalculatorFieldGroup>
          </div>
        </details>

        <div class="flex items-center gap-2">
          <button type="button" class="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-slate-200 transition-colors hover:border-flamingo-300/70 hover:bg-white/[0.08] hover:text-white disabled:cursor-not-allowed disabled:opacity-50" :disabled="matchingLoading" title="Find matching shops" aria-label="Find matching shops" @click="findMatchingShops">
            <UIcon :name="matchingLoading ? 'i-lucide-loader-circle' : 'i-lucide-search'" :class="matchingLoading ? 'h-4 w-4 animate-spin' : 'h-4 w-4'" />
          </button>
          <button type="button" class="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-slate-200 transition-colors hover:border-white/20 hover:bg-white/[0.08] hover:text-white" title="Reset large-format calculator" aria-label="Reset large-format calculator" @click="resetLargeFormatForm">
            <UIcon name="i-lucide-rotate-ccw" class="h-4 w-4" />
          </button>
          <button type="button" class="inline-flex min-h-11 flex-1 items-center justify-center rounded-full bg-flamingo-500 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-flamingo-400 disabled:cursor-not-allowed disabled:opacity-50" :disabled="!canSendRequest || sendingRequest" @click="sendRequest">
            <UIcon :name="sendingRequest ? 'i-lucide-loader-circle' : 'i-lucide-send'" :class="sendingRequest ? 'mr-2 h-4 w-4 animate-spin' : 'mr-2 h-4 w-4'" />
            {{ sendingRequest ? 'Sending request…' : sendActionLabel }}
          </button>
        </div>

        <div class="space-y-4 border-t border-[var(--p-border)] pt-4">
          <QuotesMatchedShopsPanel :shops="matchedShops" :loading="matchingLoading" :searched="hasSearched" :selected-slug="selectedPreviewShopSlug" @select="selectMatchedShop" />
          <div v-if="matchedShops.length" class="space-y-3">
            <p class="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--p-text-muted)]">Selected shops for request</p>
            <QuotesShopSelectionChips :shops="matchedShops.map(shop => ({ slug: shop.slug, label: shop.name }))" :selected-slugs="selectedSendShopSlugs" @toggle="toggleSendShop" />
          </div>
        </div>
      </CalculatorFormGrid>
    </template>

    <template #preview>
      <div class="space-y-4">
        <div v-if="showPreviewSwitcher" class="rounded-2xl border border-white/10 bg-white/[0.04] p-2.5 shadow-[0_18px_42px_rgba(0,0,0,0.18)] backdrop-blur-sm">
          <CalculatorTypeSwitcher :model-value="calculatorType ?? undefined" :options="calculatorTypeOptions" size="sm" tone="embedded" @update:model-value="emit('update:calculatorType', $event)" />
        </div>

        <QuotePreviewPanel>
          <div class="space-y-4">
            <QuotePreviewMeta title="Large-format summary" :lines="summaryLines" :placeholder="'Set the job details, review the matched shops, then send the request.'" />
            <QuotePreviewMeta title="Selected shops" :lines="selectedShopLines" placeholder="Find matching shops to continue." />
            <QuotePreviewRequirementsState v-if="missingItems.length" title="Complete these details" :items="missingItems" helper="Large-format matching uses the production brief first, then ranks public shops that can price that family." />

            <div v-else-if="preview" class="space-y-4">
              <div class="grid gap-4 md:grid-cols-2">
                <article class="rounded-2xl border border-[var(--p-border)] bg-[var(--p-surface-sunken)] p-4">
                  <p class="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--p-text-muted)]">Preview shop</p>
                  <p class="mt-2 text-lg font-extrabold text-[var(--p-text)]">{{ previewShopName }}</p>
                  <p v-if="preview.human_ready_text" class="mt-1 text-sm text-[var(--p-text-muted)]">{{ preview.human_ready_text }}</p>
                </article>
                <article class="rounded-2xl border border-[var(--p-border)] bg-[var(--p-surface-sunken)] p-4">
                  <p class="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--p-text-muted)]">Total</p>
                  <p class="mt-2 text-2xl font-extrabold text-[var(--p-text)]">{{ previewGrandTotal }}</p>
                  <p class="mt-1 text-sm text-[var(--p-text-muted)]">{{ preview.totals?.total_per_piece || preview.totals?.unit_price || 'Preview pending' }}</p>
                </article>
              </div>

              <div class="grid gap-4 lg:grid-cols-2">
                <article class="rounded-2xl border border-[var(--p-border)] bg-[var(--p-surface-sunken)] p-4">
                  <p class="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--p-text-muted)]">Material</p>
                  <p class="mt-3 text-sm text-[var(--p-text)]">{{ materialSummary }}</p>
                </article>
                <article class="rounded-2xl border border-[var(--p-border)] bg-[var(--p-surface-sunken)] p-4">
                  <p class="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--p-text-muted)]">Printing</p>
                  <p class="mt-3 text-sm text-[var(--p-text)]">{{ printingSummary }}</p>
                </article>
              </div>

              <div class="grid gap-4 lg:grid-cols-2">
                <article class="rounded-2xl border border-[var(--p-border)] bg-[var(--p-surface-sunken)] p-4">
                  <p class="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--p-text-muted)]">Finishing</p>
                  <p class="mt-3 text-sm text-[var(--p-text)]">{{ finishingSummary }}</p>
                </article>
                <article class="rounded-2xl border border-[var(--p-border)] bg-[var(--p-surface-sunken)] p-4">
                  <p class="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--p-text-muted)]">Layout</p>
                  <p class="mt-3 text-sm text-[var(--p-text)]">{{ layoutSummary }}</p>
                </article>
              </div>
            </div>

            <div v-else class="rounded-2xl border border-dashed border-[var(--p-border)] bg-[var(--p-surface-sunken)] p-6 text-sm text-[var(--p-text-muted)]">
              Select one of the matched shops to inspect its live large-format preview.
            </div>
          </div>
        </QuotePreviewPanel>
      </div>
    </template>
  </CalculatorShell>
</template>

<script setup lang="ts">
import { useToast } from '#imports'
import type { PreviewPriceResponse } from '~/shared/types/buyer'
import type { QuoteRequest } from '~/shared/types/quoteRequest'
import { calculatorSelectUi } from '~/components/calculator/CalculatorSelectUi'
import CalculatorTypeSwitcher from '~/components/calculator/CalculatorTypeSwitcher.vue'
import CalculatorFieldGroup from '~/components/calculator/CalculatorFieldGroup.vue'
import CalculatorFormGrid from '~/components/calculator/CalculatorFormGrid.vue'
import CalculatorHeaderBlock from '~/components/calculator/CalculatorHeaderBlock.vue'
import CalculatorShell from '~/components/calculator/CalculatorShell.vue'
import QuotePreviewMeta from '~/components/calculator/QuotePreviewMeta.vue'
import QuotePreviewPanel from '~/components/calculator/QuotePreviewPanel.vue'
import QuotePreviewRequirementsState from '~/components/calculator/QuotePreviewRequirementsState.vue'
import type { MatchedShop } from '~/components/quotes/MatchedShopsPanel.vue'
import { useQuoteRequestBlast } from '~/composables/useQuoteRequestBlast'
import { useAnalyticsTracking } from '~/composables/useAnalyticsTracking'
import { buildQuoteRequestSendSummary, getQuoteRequestSendToast } from '~/shared/quoteRequestSend'
import { useActivityBadgesStore } from '~/stores/activityBadges'
import { matchShops } from '~/services/public'
import type { CalculatorType, CalculatorTypeOption } from '~/utils/calculatorTypes'
import { getPreviewMoney } from '~/utils/calculationResult'
import { createSharedCalculatorRequest, toLargeFormatCalculatorSnapshot } from '~/utils/sharedCalculatorRequest'
import { formatSizeSummary, getSizePreset, inferSizePresetLabel, sizePresets, type SizeMode } from '~/utils/size'

type LargeFormatSubtype = 'banner' | 'sticker' | 'roll_up_banner' | 'poster' | 'mounted_board'

const props = withDefaults(defineProps<{
  title: string
  description: string
  eyebrow?: string
  fixedShopSlug?: string | null
  fixedShopName?: string | null
  mode?: 'marketplace' | 'single-shop'
  anchorId?: string
  compact?: boolean
  calculatorType?: CalculatorType | null
  calculatorTypeOptions?: CalculatorTypeOption[]
  calculatorSwitcherPlacement?: 'header' | 'preview'
}>(), {
  eyebrow: 'Large Format Calculator',
  fixedShopSlug: null,
  fixedShopName: null,
  mode: 'marketplace',
  anchorId: 'large-format-calculator',
  compact: false,
  calculatorType: null,
  calculatorTypeOptions: () => [],
  calculatorSwitcherPlacement: 'header',
})

const emit = defineEmits<{
  'update:calculatorType': [value: CalculatorType]
}>()

const selectUi = calculatorSelectUi
const inputUi = { base: 'w-full px-4 text-sm' }
const toast = useToast()
const activityBadgesStore = useActivityBadgesStore()
const { saveAndSend } = useQuoteRequestBlast()
const { trackQuoteSubmit } = useAnalyticsTracking()
const showEmbeddedCalculatorTypes = computed(() => Boolean(props.calculatorType && props.calculatorTypeOptions.length))
const showHeaderContent = computed(() => Boolean(props.eyebrow || props.title || props.description))
const showHeaderSwitcher = computed(() => showEmbeddedCalculatorTypes.value && props.calculatorSwitcherPlacement === 'header')
const showPreviewSwitcher = computed(() => showEmbeddedCalculatorTypes.value && props.calculatorSwitcherPlacement === 'preview')

const productSubtype = ref<LargeFormatSubtype>('banner')
const quantity = ref(1)
const materialPreference = ref('Banner PVC')
const turnaroundHours = ref<number | null>(24)
const sizeMode = ref<SizeMode>('standard')
const sizeLabel = ref('A1')
const widthMm = ref<number | null>(594)
const heightMm = ref<number | null>(841)
const widthInput = ref('')
const heightInput = ref('')
const customBrief = ref('')

const matchedShops = ref<MatchedShop[]>([])
const selectedPreviewShopSlug = ref<string | null>(null)
const selectedSendShopSlugs = ref<string[]>([])
const matchingLoading = ref(false)
const sendingRequest = ref(false)
const hasSearched = ref(false)
const preview = ref<PreviewPriceResponse | null>(null)

const subtypeOptions = [
  { label: 'Banner', value: 'banner' },
  { label: 'Sticker', value: 'sticker' },
  { label: 'Roll-up Banner', value: 'roll_up_banner' },
  { label: 'Poster', value: 'poster' },
  { label: 'Mounted Board', value: 'mounted_board' },
]
const materialPreferenceOptions = ['Banner PVC', 'Vinyl sticker', 'Mesh banner', 'Photo paper', 'Reflective vinyl', 'Board stock'].map(value => ({ label: value, value }))
const sizeModeOptions = [{ label: 'Standard size', value: 'standard' }, { label: 'Custom size', value: 'custom' }]
const sizePresetOptions = sizePresets.filter(preset => ['A4', 'A3', 'A2', 'A1', 'A0'].includes(preset.label)).map(preset => ({ label: preset.label, value: preset.label }))

const previewShop = computed(() => matchedShops.value.find(shop => shop.slug === selectedPreviewShopSlug.value) ?? null)
const previewShopName = computed(() => previewShop.value?.name || 'Matched shop')
const selectedShopIds = computed(() =>
  selectedSendShopSlugs.value
    .map(slug => matchedShops.value.find(shop => shop.slug === slug)?.id ?? null)
    .filter((value): value is number => typeof value === 'number')
)
const sendActionLabel = computed(() => selectedShopIds.value.length ? `Send request to ${selectedShopIds.value.length} shop${selectedShopIds.value.length === 1 ? '' : 's'}` : 'Select matched shops to send')
const canSendRequest = computed(() => !missingItems.value.length && selectedShopIds.value.length > 0)
const missingItems = computed(() => {
  const items: string[] = []
  if (!widthMm.value || !heightMm.value) items.push('Set the finished size')
  if (!matchedShops.value.length) items.push('Find matching shops')
  if (!selectedShopIds.value.length) items.push('Select matched shops to send')
  return items
})
const summaryLines = computed(() => [
  { label: 'Subtype', value: subtypeOptions.find(option => option.value === productSubtype.value)?.label || 'Banner' },
  { label: 'Material', value: materialPreference.value },
  { label: 'Finished size', value: formatSizeSummary(widthMm.value, heightMm.value, sizeMode.value === 'standard' ? sizeLabel.value : null) || '' },
  { label: 'Quantity', value: `${quantity.value} piece(s)` },
])
const selectedShopLines = computed(() => selectedSendShopSlugs.value.map((slug) => {
  const shop = matchedShops.value.find(entry => entry.slug === slug)
  return { label: shop?.name || slug, value: shop?.total ? `${shop.currency || 'KES'} ${shop.total}` : 'Request for quote' }
}))
const previewGrandTotal = computed(() => getPreviewMoney(preview.value, 'grand_total') || 'Awaiting preview')
const materialSummary = computed(() => {
  const section = preview.value?.breakdown?.material as Record<string, unknown> | undefined
  return `Material: ${String(section?.label || 'Not priced')} | Rate: ${String(section?.rate_per_sqm || '0.00')} per sqm | Total: ${String(section?.total || '0.00')}`
})
const printingSummary = computed(() => {
  const section = preview.value?.breakdown?.printing as Record<string, unknown> | undefined
  return `Print rate: ${String(section?.rate_per_sqm || '0.00')} per sqm | Total: ${String(section?.total || '0.00')}`
})
const finishingSummary = computed(() => {
  const lines = (preview.value?.breakdown?.finishings as Array<Record<string, unknown>> | undefined) || []
  if (!lines.length) return 'No extra finishing selected.'
  return lines.map(line => `${String(line.name || 'Finishing')}: ${String(line.total || '0.00')}`).join(' | ')
})
const layoutSummary = computed(() => {
  const dimensions = preview.value?.breakdown?.dimensions as Record<string, unknown> | undefined
  const layout = preview.value?.breakdown?.layout as Record<string, unknown> | null | undefined
  const base = `Area: ${String(dimensions?.area_sqm || '0.0000')} sqm`
  if (!layout) return base
  return `${base} | Roll length: ${String(layout.roll_length_mm || 0)} mm | Tiles: ${String(layout.tiles_x || 1)} x ${String(layout.tiles_y || 1)}`
})

function normalizeNumber(value: unknown, minimum = 0) {
  const parsed = Number(value)
  if (!Number.isFinite(parsed)) return null
  return Math.max(minimum, Math.round(parsed))
}

function normalizeInteger(value: unknown, minimum: number) {
  return normalizeNumber(value, minimum) ?? minimum
}

function normalizeStringValue(value: unknown) {
  return typeof value === 'string' && value.trim() ? value : null
}

function handleSizeModeChange(value: unknown) {
  sizeMode.value = (normalizeStringValue(value) as SizeMode | null) ?? 'standard'
  if (sizeMode.value === 'standard' && !sizeLabel.value) sizeLabel.value = 'A1'
  syncPresetToInputs()
}

function handleSizePresetChange(value: unknown) {
  sizeLabel.value = normalizeStringValue(value) || 'A1'
  const preset = getSizePreset(sizeLabel.value)
  if (!preset) return
  widthMm.value = preset.widthMm
  heightMm.value = preset.heightMm
  syncPresetToInputs()
}

function handleWidthChange(value: unknown) {
  widthInput.value = value == null ? '' : String(value)
  widthMm.value = normalizeNumber(value, 1)
}

function handleHeightChange(value: unknown) {
  heightInput.value = value == null ? '' : String(value)
  heightMm.value = normalizeNumber(value, 1)
}

function syncPresetToInputs() {
  if (sizeMode.value === 'standard') {
    const preset = getSizePreset(sizeLabel.value || 'A1')
    if (preset) {
      widthMm.value = preset.widthMm
      heightMm.value = preset.heightMm
    }
  } else if (widthMm.value && heightMm.value) {
    const inferred = inferSizePresetLabel(widthMm.value, heightMm.value)
    if (inferred) sizeLabel.value = inferred
  }
  widthInput.value = widthMm.value ? String(widthMm.value) : ''
  heightInput.value = heightMm.value ? String(heightMm.value) : ''
}

function toggleSendShop(slug: string) {
  selectedSendShopSlugs.value = selectedSendShopSlugs.value.includes(slug)
    ? selectedSendShopSlugs.value.filter(value => value !== slug)
    : [...selectedSendShopSlugs.value, slug]
}

function selectMatchedShop(match: MatchedShop) {
  selectedPreviewShopSlug.value = match.slug
  preview.value = match.preview as PreviewPriceResponse | null
  if (!selectedSendShopSlugs.value.includes(match.slug)) {
    selectedSendShopSlugs.value = [...selectedSendShopSlugs.value, match.slug]
  }
}

function buildSharedLargeFormatRequest() {
  const request = createSharedCalculatorRequest('large_format')
  request.productTitle = subtypeOptions.find(option => option.value === productSubtype.value)?.label || 'Large-format request'
  request.quantity = quantity.value
  request.sizeMode = sizeMode.value
  request.sizeLabel = sizeLabel.value
  request.inputUnit = 'mm'
  request.widthInput = widthInput.value
  request.heightInput = heightInput.value
  request.widthMm = widthMm.value
  request.heightMm = heightMm.value
  request.turnaroundHours = turnaroundHours.value
  request.customBrief = customBrief.value.trim()
  request.largeFormat.productSubtype = productSubtype.value
  request.largeFormat.materialType = materialPreference.value
  request.largeFormat.finishings = []
  return request
}

async function findMatchingShops() {
  if (!widthMm.value || !heightMm.value) {
    toast.add({ title: 'Set the finished size', description: 'Width and height are required to find matching shops.', color: 'warning' })
    return
  }
  matchingLoading.value = true
  hasSearched.value = false
  try {
    const response = await matchShops({
      product_family: 'large_format',
      pricing_mode: 'custom',
      product_pricing_mode: 'LARGE_FORMAT',
      quantity: quantity.value,
      width_mm: widthMm.value,
      height_mm: heightMm.value,
      size_mode: sizeMode.value,
      size_label: sizeLabel.value,
      material_type: materialPreference.value,
      turnaround_hours: turnaroundHours.value,
      custom_title: subtypeOptions.find(option => option.value === productSubtype.value)?.label || 'Large-format request',
      custom_brief: customBrief.value.trim(),
    })
    matchedShops.value = (response.matches ?? response.shops ?? []).slice(0, 3) as MatchedShop[]
    selectedPreviewShopSlug.value = matchedShops.value[0]?.slug ?? null
    selectedSendShopSlugs.value = matchedShops.value.map(shop => shop.slug)
    preview.value = matchedShops.value[0]?.preview as PreviewPriceResponse | null
    hasSearched.value = true
    if (!matchedShops.value.length) {
      toast.add({ title: 'No matches yet', description: 'No public shops are ready for this large-format spec yet. Adjust the job details and try again.', color: 'info' })
    }
  } catch (error) {
    toast.add({ title: 'Matching failed', description: error instanceof Error ? error.message : 'Could not find matching shops.', color: 'error' })
  } finally {
    matchingLoading.value = false
  }
}

async function sendRequest() {
  if (!canSendRequest.value || sendingRequest.value) return
  const selectedMatches = matchedShops.value.filter(shop => selectedSendShopSlugs.value.includes(shop.slug))
  const sharedRequest = buildSharedLargeFormatRequest()
  sendingRequest.value = true
  try {
    const requests = await saveAndSend({
      title: sharedRequest.productTitle,
      shop: selectedMatches[0]?.id ?? null,
      selectedProduct: null,
      calculatorInputsSnapshot: {
        ...toLargeFormatCalculatorSnapshot(sharedRequest),
        selected_shop_slugs: selectedMatches.map(shop => shop.slug),
      },
      pricingSnapshot: {
        mode: 'marketplace',
        matches_count: matchedShops.value.length,
        matches: matchedShops.value,
        shops: matchedShops.value,
        selected_shops: selectedMatches,
        fixed_shop_preview: previewShop.value,
      },
      customProductSnapshot: {
        quote_type: 'large_format',
        title: sharedRequest.productTitle,
        custom_brief: sharedRequest.customBrief,
        width_mm: sharedRequest.widthMm,
        height_mm: sharedRequest.heightMm,
        material_type: sharedRequest.largeFormat.materialType,
      },
      requestDetailsSnapshot: {
        notes: sharedRequest.customBrief || undefined,
        selected_shop_ids: selectedShopIds.value,
        selected_shop_slugs: selectedMatches.map(shop => shop.slug),
      },
      selectedShopIds: selectedShopIds.value,
      loginRedirectPath: '/quote-draft',
    })

    if (requests?.length) {
      const summary = buildQuoteRequestSendSummary(requests as QuoteRequest[])
      void trackQuoteSubmit({
        source: 'large_format_marketplace_calculator',
        request_ids: summary.requestIds,
        shop_count: summary.shopCount,
        selected_shop_slugs: selectedMatches.map(shop => shop.slug),
        product_name: sharedRequest.productTitle,
      })
      await activityBadgesStore.fetchSummary()
      const successToast = getQuoteRequestSendToast(summary)
      toast.add({ title: successToast.title, description: successToast.description, color: 'success' })
    }
  } catch (error) {
    toast.add({ title: 'Request not sent', description: error instanceof Error ? error.message : 'Could not send this request.', color: 'error' })
  } finally {
    sendingRequest.value = false
  }
}

function resetLargeFormatForm() {
  productSubtype.value = 'banner'
  quantity.value = 1
  materialPreference.value = 'Banner PVC'
  turnaroundHours.value = 24
  sizeMode.value = 'standard'
  sizeLabel.value = 'A1'
  widthMm.value = 594
  heightMm.value = 841
  widthInput.value = ''
  heightInput.value = ''
  customBrief.value = ''
  matchedShops.value = []
  selectedPreviewShopSlug.value = null
  selectedSendShopSlugs.value = []
  preview.value = null
  hasSearched.value = false
  syncPresetToInputs()
}

onMounted(() => {
  syncPresetToInputs()
})
</script>
