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
          <CalculatorFieldGroup label="Product title">
            <UInput v-model="productTitle" :ui="inputUi" placeholder="Magazine, booklet, annual report..." />
          </CalculatorFieldGroup>
          <CalculatorFieldGroup label="Quantity">
            <UInput :model-value="quantity" :ui="inputUi" type="number" min="1" @update:model-value="quantity = normalizeInteger($event, 1)" />
          </CalculatorFieldGroup>
        </div>

        <div class="grid gap-4 md:grid-cols-2">
          <CalculatorFieldGroup label="Total pages">
            <UInput :model-value="totalPages" :ui="inputUi" type="number" min="4" @update:model-value="totalPages = normalizeInteger($event, 4)" />
          </CalculatorFieldGroup>
          <CalculatorFieldGroup label="Binding type">
            <USelectMenu v-model="bindingType" :items="bindingTypeOptions" value-key="value" label-key="label" :ui="selectUi" portal="body" class="w-full" />
          </CalculatorFieldGroup>
        </div>

        <div class="grid gap-4 md:grid-cols-2">
          <CalculatorFieldGroup label="Turnaround (hours)">
            <UInput :model-value="turnaroundHours || undefined" :ui="inputUi" type="number" min="1" @update:model-value="turnaroundHours = normalizeNumber($event)" />
          </CalculatorFieldGroup>
          <CalculatorFieldGroup label="Booklet size">
            <UInput :model-value="formatSizeSummary(widthMm, heightMm, sizeMode === 'standard' ? sizeLabel : null)" :ui="inputUi" readonly />
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
          <CalculatorFieldGroup label="Custom width (mm)">
            <UInput :model-value="widthInput || undefined" :ui="inputUi" type="number" min="0.1" step="0.01" @update:model-value="handleWidthChange" />
          </CalculatorFieldGroup>
          <CalculatorFieldGroup label="Custom height (mm)">
            <UInput :model-value="heightInput || undefined" :ui="inputUi" type="number" min="0.1" step="0.01" @update:model-value="handleHeightChange" />
          </CalculatorFieldGroup>
        </div>

        <div class="grid gap-4 md:grid-cols-2">
          <CalculatorFieldGroup label="Cover paper type">
            <USelectMenu :model-value="coverPaperType ?? undefined" :items="paperTypeOptions" value-key="value" label-key="label" :ui="selectUi" portal="body" class="w-full" @update:model-value="coverPaperType = normalizeStringValue($event)" />
          </CalculatorFieldGroup>
          <CalculatorFieldGroup label="Cover paper gsm">
            <USelectMenu :model-value="coverPaperGsm ?? undefined" :items="paperGsmOptions" value-key="value" label-key="label" :ui="selectUi" portal="body" class="w-full" @update:model-value="coverPaperGsm = normalizeNumber($event)" />
          </CalculatorFieldGroup>
        </div>

        <div class="grid gap-4 md:grid-cols-2">
          <CalculatorFieldGroup label="Cover print sides">
            <USelectMenu v-model="coverSides" :items="sidesOptions" value-key="value" label-key="label" :ui="selectUi" portal="body" class="w-full" />
          </CalculatorFieldGroup>
          <CalculatorFieldGroup label="Cover colour mode">
            <USelectMenu v-model="coverColorMode" :items="colorModeOptions" value-key="value" label-key="label" :ui="selectUi" portal="body" class="w-full" />
          </CalculatorFieldGroup>
        </div>

        <div class="grid gap-4 md:grid-cols-2">
          <CalculatorFieldGroup label="Insert paper type">
            <USelectMenu :model-value="insertPaperType ?? undefined" :items="paperTypeOptions" value-key="value" label-key="label" :ui="selectUi" portal="body" class="w-full" @update:model-value="insertPaperType = normalizeStringValue($event)" />
          </CalculatorFieldGroup>
          <CalculatorFieldGroup label="Insert paper gsm">
            <USelectMenu :model-value="insertPaperGsm ?? undefined" :items="paperGsmOptions" value-key="value" label-key="label" :ui="selectUi" portal="body" class="w-full" @update:model-value="insertPaperGsm = normalizeNumber($event)" />
          </CalculatorFieldGroup>
        </div>

        <div class="grid gap-4 md:grid-cols-2">
          <CalculatorFieldGroup label="Insert colour mode">
            <USelectMenu v-model="insertColorMode" :items="colorModeOptions" value-key="value" label-key="label" :ui="selectUi" portal="body" class="w-full" />
          </CalculatorFieldGroup>
          <CalculatorFieldGroup label="Sheet size">
            <USelectMenu :model-value="selectedSheetSize ?? undefined" :items="sheetSizeOptions" value-key="value" label-key="label" :ui="selectUi" portal="body" class="w-full" @update:model-value="selectedSheetSize = normalizeStringValue($event)" />
          </CalculatorFieldGroup>
        </div>

        <CalculatorFieldGroup label="Cover finishing">
          <USelectMenu v-model="coverLaminationMode" :items="laminationModeOptions" value-key="value" label-key="label" :ui="selectUi" portal="body" class="w-full" />
        </CalculatorFieldGroup>

        <CalculatorFieldGroup label="Final finishings">
          <FinishingSelector
            :groups="finalFinishingGroups"
            :lamination-sides="finishingSideOptions"
            :select-ui="selectUi"
            :is-selected="isFinalFinishingSelected"
            :show-side-selector="() => false"
            :get-side="selectedFinalFinishingSide"
            @toggle="toggleFinalFinishing"
            @update-side="updateFinalFinishingSide"
          />
        </CalculatorFieldGroup>

        <CalculatorFieldGroup label="Custom brief">
          <UTextarea v-model="customBrief" :ui="{ base: 'w-full px-4 py-2 text-sm min-h-[7rem]' }" :rows="3" placeholder="Describe cover expectations, inserts, binding notes, and delivery details." />
        </CalculatorFieldGroup>

        <div class="flex items-center gap-2">
          <button type="button" class="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-slate-200 transition-colors hover:border-flamingo-300/70 hover:bg-white/[0.08] hover:text-white disabled:cursor-not-allowed disabled:opacity-50" :disabled="matchingLoading" title="Find matching shops" aria-label="Find matching shops" @click="findMatchingShops">
            <UIcon :name="matchingLoading ? 'i-lucide-loader-circle' : 'i-lucide-search'" :class="matchingLoading ? 'h-4 w-4 animate-spin' : 'h-4 w-4'" />
          </button>
          <button type="button" class="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-slate-200 transition-colors hover:border-white/20 hover:bg-white/[0.08] hover:text-white" title="Reset booklet calculator" aria-label="Reset booklet calculator" @click="resetBookletForm">
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
            <QuotePreviewMeta title="Booklet summary" :lines="summaryLines" :placeholder="'Fill in the booklet details, review the matched shops, then send the request.'" />
            <QuotePreviewMeta title="Selected shops" :lines="selectedShopLines" placeholder="Find matching shops to continue." />
            <QuotePreviewRequirementsState v-if="missingItems.length" title="Complete these details" :items="missingItems" helper="Booklet matching uses your job spec first, then ranks public shops that are ready for booklet work." />

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
                  <p class="mt-1 text-sm text-[var(--p-text-muted)]">{{ previewTotalPerBooklet }}</p>
                </article>
              </div>

              <div class="grid gap-4 lg:grid-cols-2">
                <article class="rounded-2xl border border-[var(--p-border)] bg-[var(--p-surface-sunken)] p-4">
                  <p class="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--p-text-muted)]">Cover</p>
                  <p class="mt-3 text-sm text-[var(--p-text)]">{{ coverSummary }}</p>
                </article>
                <article class="rounded-2xl border border-[var(--p-border)] bg-[var(--p-surface-sunken)] p-4">
                  <p class="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--p-text-muted)]">Inserts</p>
                  <p class="mt-3 text-sm text-[var(--p-text)]">{{ insertSummary }}</p>
                </article>
              </div>

              <div class="grid gap-4 lg:grid-cols-2">
                <article class="rounded-2xl border border-[var(--p-border)] bg-[var(--p-surface-sunken)] p-4">
                  <p class="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--p-text-muted)]">Binding</p>
                  <p class="mt-3 text-sm text-[var(--p-text)]">{{ bindingSummary }}</p>
                </article>
                <article class="rounded-2xl border border-[var(--p-border)] bg-[var(--p-surface-sunken)] p-4">
                  <p class="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--p-text-muted)]">Turnaround</p>
                  <p class="mt-3 text-sm text-[var(--p-text)]">{{ turnaroundSummary }}</p>
                </article>
              </div>
            </div>

            <div v-else class="rounded-2xl border border-dashed border-[var(--p-border)] bg-[var(--p-surface-sunken)] p-6 text-sm text-[var(--p-text-muted)]">
              Select one of the matched shops to inspect its live booklet preview.
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
import FinishingSelector from '~/components/calculator/FinishingSelector.vue'
import QuotePreviewMeta from '~/components/calculator/QuotePreviewMeta.vue'
import QuotePreviewPanel from '~/components/calculator/QuotePreviewPanel.vue'
import QuotePreviewRequirementsState from '~/components/calculator/QuotePreviewRequirementsState.vue'
import type { MatchedShop } from '~/components/quotes/MatchedShopsPanel.vue'
import { useQuoteRequestBlast } from '~/composables/useQuoteRequestBlast'
import { buildQuoteRequestSendSummary, getQuoteRequestSendToast } from '~/shared/quoteRequestSend'
import { useActivityBadgesStore } from '~/stores/activityBadges'
import { useAnalyticsTracking } from '~/composables/useAnalyticsTracking'
import { matchBookletShops } from '~/services/public'
import type { CalculatorType, CalculatorTypeOption } from '~/utils/calculatorTypes'
import { getPreviewMoney } from '~/utils/calculationResult'
import { createSharedCalculatorRequest, toBookletCalculatorSnapshot } from '~/utils/sharedCalculatorRequest'
import { formatSizeSummary, getSizePreset, inferSizePresetLabel, sizePresets, type SizeMode } from '~/utils/size'

type FinishingOption = { id: number; name: string; slug?: string; category?: string | null }

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
  eyebrow: 'Booklet Calculator',
  fixedShopSlug: null,
  fixedShopName: null,
  mode: 'marketplace',
  anchorId: 'booklet-calculator',
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

const productTitle = ref('')
const customBrief = ref('')
const quantity = ref(100)
const totalPages = ref(12)
const bindingType = ref<'saddle_stitch' | 'perfect_bind' | 'wire_o'>('saddle_stitch')
const turnaroundHours = ref<number | null>(24)
const sizeMode = ref<SizeMode>('standard')
const sizeLabel = ref('A5')
const widthMm = ref<number | null>(148)
const heightMm = ref<number | null>(210)
const widthInput = ref('')
const heightInput = ref('')
const coverPaperType = ref<string | null>('Art card')
const coverPaperGsm = ref<number | null>(300)
const insertPaperType = ref<string | null>('Art paper')
const insertPaperGsm = ref<number | null>(128)
const coverSides = ref<'SIMPLEX' | 'DUPLEX'>('DUPLEX')
const coverColorMode = ref<'BW' | 'COLOR'>('COLOR')
const insertColorMode = ref<'BW' | 'COLOR'>('COLOR')
const coverLaminationMode = ref<'none' | 'front' | 'both'>('none')
const selectedSheetSize = ref<string | null>('SRA3')
const selectedFinalFinishings = ref<Array<{ finishing_rate_id: number; selected_side: 'front' | 'back' | 'both' }>>([])

const matchedShops = ref<MatchedShop[]>([])
const selectedPreviewShopSlug = ref<string | null>(null)
const selectedSendShopSlugs = ref<string[]>([])
const matchingLoading = ref(false)
const sendingRequest = ref(false)
const hasSearched = ref(false)
const preview = ref<PreviewPriceResponse | null>(null)

const bindingTypeOptions = [
  { label: 'Saddle stitch', value: 'saddle_stitch' },
  { label: 'Perfect bind', value: 'perfect_bind' },
  { label: 'Wire-O', value: 'wire_o' },
]
const sizeModeOptions = [{ label: 'Standard size', value: 'standard' }, { label: 'Custom size', value: 'custom' }]
const sizePresetOptions = sizePresets.map((preset) => ({ label: preset.label, value: preset.label }))
const paperTypeOptions = ['Art card', 'Art paper', 'Bond', 'Matt', 'Offset'].map(value => ({ label: value, value }))
const paperGsmOptions = [80, 100, 115, 128, 150, 170, 200, 250, 300, 350].map(value => ({ label: `${value} gsm`, value }))
const sidesOptions = [{ label: 'Single-sided', value: 'SIMPLEX' }, { label: 'Double-sided', value: 'DUPLEX' }]
const colorModeOptions = [{ label: 'Black & white', value: 'BW' }, { label: 'Colour', value: 'COLOR' }]
const laminationModeOptions = [{ label: 'No lamination', value: 'none' }, { label: 'Front only', value: 'front' }, { label: 'Both sides', value: 'both' }]
const sheetSizeOptions = ['SRA3', 'A3', 'A4'].map(value => ({ label: value, value }))
const finishingSideOptions = [{ label: 'Front only', value: 'front' }, { label: 'Back only', value: 'back' }, { label: 'Both sides', value: 'both' }]
const finalFinishingGroups = computed(() => {
  const finishings: FinishingOption[] = [
    { id: 9001, name: 'Trim & pack', slug: 'trim-pack', category: 'finishing' },
    { id: 9002, name: 'Shrink wrap', slug: 'shrink-wrap', category: 'finishing' },
  ]
  return [{ key: 'final', label: 'Final finishings', options: finishings }]
})

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
  if (!quantity.value || quantity.value < 1) items.push('Enter quantity')
  if (totalPages.value < 4) items.push('Set at least 4 pages')
  if (!matchedShops.value.length) items.push('Find matching shops')
  if (!selectedShopIds.value.length) items.push('Select matched shops to send')
  return items
})

const summaryLines = computed(() => [
  ...(productTitle.value ? [{ label: 'Product', value: productTitle.value }] : []),
  { label: 'Finished size', value: formatSizeSummary(widthMm.value, heightMm.value, sizeMode.value === 'standard' ? sizeLabel.value : null) || '' },
  { label: 'Quantity', value: `${quantity.value} booklet(s)` },
  { label: 'Pages', value: `${totalPages.value}` },
  { label: 'Binding', value: bindingTypeOptions.find(option => option.value === bindingType.value)?.label || bindingType.value },
])
const selectedShopLines = computed(() => selectedSendShopSlugs.value.map((slug) => {
  const shop = matchedShops.value.find(entry => entry.slug === slug)
  return { label: shop?.name || slug, value: shop?.total ? `${shop.currency || 'KES'} ${shop.total}` : 'Request for quote' }
}))
const previewGrandTotal = computed(() => getPreviewMoney(preview.value, 'grand_total') || 'Awaiting preview')
const previewTotalPerBooklet = computed(() => {
  const totals = preview.value?.totals as ({ total_per_booklet?: string; unit_price?: string } & Record<string, unknown>) | undefined
  return totals?.total_per_booklet || totals?.unit_price || 'Preview pending'
})
const coverSummary = computed(() => {
  const section = preview.value?.breakdown?.cover as Record<string, unknown> | undefined
  const paper = section?.paper as Record<string, unknown> | undefined
  const totals = section?.totals as Record<string, unknown> | undefined
  return `Stock: ${String(paper?.label || 'Not priced')} | Printing: ${String(totals?.print_cost || '0.00')} | Subtotal: ${String(totals?.subtotal || '0.00')}`
})
const insertSummary = computed(() => {
  const section = preview.value?.breakdown?.inserts as Record<string, unknown> | undefined
  const paper = section?.paper as Record<string, unknown> | undefined
  const totals = section?.totals as Record<string, unknown> | undefined
  return `Stock: ${String(paper?.label || 'Not priced')} | Printing: ${String(totals?.print_cost || '0.00')} | Subtotal: ${String(totals?.subtotal || '0.00')}`
})
const bindingSummary = computed(() => {
  const section = preview.value?.breakdown?.binding as Record<string, unknown> | undefined
  return `${String(section?.label || 'Binding')} | Total: ${String(section?.total || '0.00')}`
})
const turnaroundSummary = computed(() => `${preview.value?.turnaround_text || 'On request'} | ${preview.value?.human_ready_text || 'Ready on request'}`)

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
  if (sizeMode.value === 'standard' && !sizeLabel.value) sizeLabel.value = 'A5'
  syncPresetToInputs()
}

function handleSizePresetChange(value: unknown) {
  sizeLabel.value = normalizeStringValue(value) || 'A5'
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
    const preset = getSizePreset(sizeLabel.value || 'A5')
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

function isFinalFinishingSelected(finishingId: number) {
  return selectedFinalFinishings.value.some(entry => entry.finishing_rate_id === finishingId)
}

function selectedFinalFinishingSide(finishingId: number) {
  return selectedFinalFinishings.value.find(entry => entry.finishing_rate_id === finishingId)?.selected_side ?? 'both'
}

function toggleFinalFinishing(finishing: Record<string, unknown>) {
  const finishingId = Number(finishing.id)
  selectedFinalFinishings.value = isFinalFinishingSelected(finishingId)
    ? selectedFinalFinishings.value.filter(entry => entry.finishing_rate_id !== finishingId)
    : [...selectedFinalFinishings.value, { finishing_rate_id: finishingId, selected_side: 'both' }]
}

function updateFinalFinishingSide(finishingId: number, value: unknown) {
  const normalized = (typeof value === 'string' ? value : 'both') as 'front' | 'back' | 'both'
  selectedFinalFinishings.value = selectedFinalFinishings.value.map(entry =>
    entry.finishing_rate_id === finishingId ? { ...entry, selected_side: normalized } : entry,
  )
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

function buildSharedBookletRequest() {
  const request = createSharedCalculatorRequest('booklet')
  request.productTitle = productTitle.value.trim()
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
  request.booklet.totalPages = totalPages.value
  request.booklet.bindingType = bindingType.value
  request.booklet.bookletSize = formatSizeSummary(widthMm.value, heightMm.value, sizeMode.value === 'standard' ? sizeLabel.value : null) || ''
  request.booklet.coverPaperType = coverPaperType.value || ''
  request.booklet.coverPrintSides = coverSides.value
  request.booklet.coverColorMode = coverColorMode.value
  request.booklet.coverPaperGsm = coverPaperGsm.value
  request.booklet.coverFinishingMode = coverLaminationMode.value
  request.booklet.insertsColorMode = insertColorMode.value
  request.booklet.insertsPaperType = insertPaperType.value || ''
  request.booklet.insertsPaperGsm = insertPaperGsm.value
  request.booklet.sheetSize = selectedSheetSize.value || ''
  request.booklet.finalFinishings = [...selectedFinalFinishings.value]
  return request
}

async function findMatchingShops() {
  if (!widthMm.value || !heightMm.value) {
    toast.add({ title: 'Set the finished size', description: 'Booklet width and height are required to find matching shops.', color: 'warning' })
    return
  }
  matchingLoading.value = true
  hasSearched.value = false
  try {
    const response = await matchBookletShops({
      product_family: 'booklet',
      quantity: quantity.value,
      total_pages: totalPages.value,
      binding_type: bindingType.value,
      cover_paper_type: coverPaperType.value || '',
      cover_paper_gsm: coverPaperGsm.value,
      insert_paper_type: insertPaperType.value || '',
      insert_paper_gsm: insertPaperGsm.value,
      sheet_size: selectedSheetSize.value || '',
      cover_sides: coverSides.value,
      insert_sides: 'DUPLEX',
      cover_color_mode: coverColorMode.value,
      insert_color_mode: insertColorMode.value,
      cover_lamination_mode: coverLaminationMode.value,
      width_mm: widthMm.value,
      height_mm: heightMm.value,
      turnaround_hours: turnaroundHours.value,
    })
    matchedShops.value = (response.matches ?? response.shops ?? []).slice(0, 3) as MatchedShop[]
    selectedPreviewShopSlug.value = matchedShops.value[0]?.slug ?? null
    selectedSendShopSlugs.value = matchedShops.value.map(shop => shop.slug)
    preview.value = matchedShops.value[0]?.preview as PreviewPriceResponse | null
    hasSearched.value = true
    if (!matchedShops.value.length) {
      toast.add({ title: 'No matches yet', description: 'No public shops are ready for this booklet spec yet. Adjust the job details and try again.', color: 'neutral' })
    }
  } catch (error) {
    toast.add({ title: 'Matching failed', description: error instanceof Error ? error.message : 'Could not find matching shops.', color: 'error' })
  } finally {
    matchingLoading.value = false
  }
}

async function sendRequest() {
  if (!canSendRequest.value || sendingRequest.value) return
  const sharedRequest = buildSharedBookletRequest()
  const selectedMatches = matchedShops.value.filter(shop => selectedSendShopSlugs.value.includes(shop.slug))
  sendingRequest.value = true
  try {
    const requests = await saveAndSend({
      title: sharedRequest.productTitle || 'Booklet request',
      shop: selectedMatches[0]?.id ?? null,
      selectedProduct: null,
      calculatorInputsSnapshot: {
        quote_type: 'booklet',
        product_family: 'booklet',
        ...toBookletCalculatorSnapshot(sharedRequest, {
          shop: selectedMatches[0]?.id ?? null,
          coverPaper: null,
          insertPaper: null,
          coverLaminationFinishingRate: null,
          bindingFinishingRate: null,
        }),
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
        quote_type: 'booklet',
        title: sharedRequest.productTitle || 'Booklet job',
        custom_title: sharedRequest.productTitle || 'Booklet job',
        custom_brief: sharedRequest.customBrief,
        width_mm: sharedRequest.widthMm,
        height_mm: sharedRequest.heightMm,
        total_pages: totalPages.value,
        binding_type: bindingType.value,
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
        source: 'booklet_marketplace_calculator',
        request_ids: summary.requestIds,
        shop_count: summary.shopCount,
        selected_shop_slugs: selectedMatches.map(shop => shop.slug),
        product_name: sharedRequest.productTitle || 'Booklet request',
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

function resetBookletForm() {
  productTitle.value = ''
  customBrief.value = ''
  quantity.value = 100
  totalPages.value = 12
  bindingType.value = 'saddle_stitch'
  turnaroundHours.value = 24
  sizeMode.value = 'standard'
  sizeLabel.value = 'A5'
  widthMm.value = 148
  heightMm.value = 210
  widthInput.value = ''
  heightInput.value = ''
  coverPaperType.value = 'Art card'
  coverPaperGsm.value = 300
  insertPaperType.value = 'Art paper'
  insertPaperGsm.value = 128
  coverSides.value = 'DUPLEX'
  coverColorMode.value = 'COLOR'
  insertColorMode.value = 'COLOR'
  coverLaminationMode.value = 'none'
  selectedSheetSize.value = 'SRA3'
  selectedFinalFinishings.value = []
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
