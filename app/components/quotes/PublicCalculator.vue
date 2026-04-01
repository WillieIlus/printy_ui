
<template>
  <div class="space-y-4">
    <CalculatorShell :anchor-id="anchorId">
      <template #header>
        <CalculatorHeaderBlock :eyebrow="eyebrow" :title="title" :description="description" :compact="compact" />
      </template>

      <template #form>
        <CalculatorFormGrid @submit="handlePrimaryAction">
          <CalculatorFieldGroup v-if="isSingleShop" label="Shop">
            <UInput :model-value="fixedShopDisplayName" :ui="inputUi" readonly disabled />
          </CalculatorFieldGroup>

          <CalculatorFieldGroup v-if="isProductMode" label="Product">
            <UInput :model-value="product?.name ?? ''" :ui="inputUi" readonly disabled />
          </CalculatorFieldGroup>

          <div v-if="!isProductMode" class="grid gap-4 md:grid-cols-2">
            <CalculatorFieldGroup label="Product title">
              <UInput v-model="customTitle" :ui="inputUi" placeholder="Business cards, flyers, stickers..." />
            </CalculatorFieldGroup>
            <CalculatorFieldGroup label="Quantity">
              <UInput :model-value="quantity ?? undefined" :ui="inputUi" type="number" min="1" @update:model-value="quantity = normalizeNumberValue($event)" />
            </CalculatorFieldGroup>
          </div>

          <CalculatorFieldGroup v-else label="Quantity">
            <UInput :model-value="quantity ?? undefined" :ui="inputUi" type="number" :min="minimumQuantity" @update:model-value="quantity = normalizeNumberValue($event)" />
          </CalculatorFieldGroup>

          <CalculatorFieldGroup v-if="!isProductMode" label="Custom brief">
            <UTextarea v-model="customBrief" :ui="textareaUi" :rows="3" placeholder="Describe artwork, stock, finishing, delivery, or special handling." />
          </CalculatorFieldGroup>

          <div v-if="!isProductMode" class="grid gap-4 md:grid-cols-2">
            <CalculatorFieldGroup label="Width (mm)">
              <UInput :model-value="widthMm ?? undefined" :ui="inputUi" type="number" min="1" placeholder="90" @update:model-value="widthMm = normalizeNumberValue($event)" />
            </CalculatorFieldGroup>
            <CalculatorFieldGroup label="Height (mm)">
              <UInput :model-value="heightMm ?? undefined" :ui="inputUi" type="number" min="1" placeholder="50" @update:model-value="heightMm = normalizeNumberValue($event)" />
            </CalculatorFieldGroup>
          </div>

          <CalculatorFieldGroup v-else-if="sizeSummary" label="Finished size">
            <UInput :model-value="sizeSummary" :ui="inputUi" readonly disabled />
          </CalculatorFieldGroup>

          <div class="grid gap-4 md:grid-cols-2">
            <CalculatorFieldGroup label="Print sides">
              <USelectMenu v-model="sides" :items="sidesOptions" value-key="value" label-key="label" :ui="selectUi" portal="body" class="w-full" />
            </CalculatorFieldGroup>
            <CalculatorFieldGroup label="Colour mode">
              <USelectMenu v-model="colorMode" :items="colorModeOptions" value-key="value" label-key="label" :ui="selectUi" portal="body" class="w-full" />
            </CalculatorFieldGroup>
          </div>

          <div v-if="isSheetMode" class="grid gap-4 md:grid-cols-2">
            <CalculatorFieldGroup :label="isMarketplace ? 'Paper type' : 'Paper / GSM'">
              <USelectMenu
                v-if="paperOptions.length"
                :model-value="selectedPaperId ?? undefined"
                :items="paperOptions"
                value-key="value"
                label-key="label"
                :ui="selectUi"
                portal="body"
                class="w-full"
                @update:model-value="selectedPaperId = normalizeNumberValue($event)"
              />
              <UInput v-else v-model="marketplacePaperType" :ui="inputUi" placeholder="Art card, matte, bond..." />
            </CalculatorFieldGroup>
            <CalculatorFieldGroup :label="isMarketplace ? 'Sheet size' : 'Sheet support'">
              <USelectMenu v-if="isMarketplace" v-model="marketplaceSheetSize" :items="sheetSizeOptions" value-key="value" label-key="label" :ui="selectUi" portal="body" class="w-full" />
              <UInput v-else :model-value="selectedPaperSupport" :ui="inputUi" readonly disabled />
            </CalculatorFieldGroup>
          </div>

          <CalculatorFieldGroup v-if="isMarketplace && isSheetMode" label="Paper GSM">
            <UInput :model-value="marketplacePaperGsm ?? undefined" :ui="inputUi" type="number" min="1" placeholder="300" @update:model-value="marketplacePaperGsm = normalizeNumberValue($event)" />
          </CalculatorFieldGroup>

          <CalculatorFieldGroup v-if="isLargeFormatMode && materialOptions.length" label="Material">
            <USelectMenu
              :model-value="selectedMaterialId ?? undefined"
              :items="materialOptions"
              value-key="value"
              label-key="label"
              :ui="selectUi"
              portal="body"
              class="w-full"
              @update:model-value="selectedMaterialId = normalizeNumberValue($event)"
            />
          </CalculatorFieldGroup>

          <CalculatorFieldGroup v-if="finishingGroups.length" label="Finishing services">
            <FinishingSelector
              :groups="finishingGroups"
              :lamination-sides="laminationSides"
              :select-ui="selectUi"
              :is-selected="isFinishingSelected"
              :show-side-selector="isFinishingSideOpen"
              :get-side="selectedFinishingSide"
              @toggle="toggleFinishing"
              @update-side="updateFinishingSide"
            />
          </CalculatorFieldGroup>

          <CalculatorFieldGroup v-if="!isProductMode" label="Turnaround (days)">
            <UInput :model-value="turnaroundDays ?? undefined" :ui="inputUi" type="number" min="1" placeholder="2" @update:model-value="turnaroundDays = normalizeNumberValue($event)" />
          </CalculatorFieldGroup>
        </CalculatorFormGrid>
      </template>

      <template #preview>
        <div class="space-y-4">
          <QuotePreviewPanel>
            <div class="space-y-4">
              <QuotePreviewMeta :title="isMarketplace ? 'Selected shops' : 'Selected shop'" :lines="shopSummaryLines" :placeholder="shopSummaryPlaceholder" />
              <QuotePreviewMeta title="Job summary" :lines="jobSummaryLines" placeholder="Pending" />
              <QuotePreviewMeta title="Production plan" :lines="productionSummaryLines" placeholder="Pending" />

              <QuotePreviewRequirementsState v-if="missingRequirements.length" title="Complete these details" :items="missingRequirements" :helper="requirementsHelper" />

              <div v-else class="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <div
                  v-if="piecesPerSheet || sheetsRequired"
                  class="mb-4 grid gap-3 sm:grid-cols-2"
                >
                  <div class="rounded-xl border border-flamingo-200 bg-white p-4 shadow-sm">
                    <p class="text-[0.68rem] font-extrabold uppercase tracking-[0.16em] text-slate-500">Pcs per sheet</p>
                    <p class="mt-2 text-2xl font-extrabold tracking-tight text-slate-900">{{ piecesPerSheet || 'â€”' }}</p>
                  </div>
                  <div class="rounded-xl border border-flamingo-200 bg-white p-4 shadow-sm">
                    <p class="text-[0.68rem] font-extrabold uppercase tracking-[0.16em] text-slate-500">Sheets required</p>
                    <p class="mt-2 text-2xl font-extrabold tracking-tight text-flamingo-600">{{ sheetsRequired || 'â€”' }}</p>
                  </div>
                </div>
                <div class="flex items-baseline justify-between gap-4">
                  <span class="text-sm font-semibold text-slate-700">{{ priceLabel }}</span>
                  <span class="text-lg font-bold text-slate-900">{{ priceLine }}</span>
                </div>
                <div v-if="priceHelper" class="mt-1 text-sm text-slate-500">{{ priceHelper }}</div>
                <div v-if="backendMissingRequirements.length" class="mt-3 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800">
                  Missing backend requirements: {{ backendMissingRequirements.join(', ') }}
                </div>
              </div>
            </div>
          </QuotePreviewPanel>

          <div v-if="isMarketplace && visibleMatches.length" class="rounded-lg border border-white/10 bg-white/5 p-4">
            <div class="flex items-center justify-between gap-3">
              <p class="text-sm font-semibold text-white">Top matching shops</p>
              <span class="text-xs text-slate-300">Showing {{ visibleMatches.length }} of {{ matchResponse?.matches_count ?? visibleMatches.length }}</span>
            </div>
            <div class="mt-3">
              <ShopSelectionChips
                :shops="visibleMatches.map(shop => ({ slug: shop.slug, label: shop.name }))"
                :selected-slugs="selectedMatchShopSlugs"
                @toggle="toggleMatchedShop"
              />
            </div>
          </div>

          <div :class="compact ? 'grid gap-2' : 'grid gap-2 sm:grid-cols-3'">
            <button type="button" class="rounded-md bg-flamingo-500 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-flamingo-400 disabled:cursor-not-allowed disabled:opacity-50" :disabled="missingRequirements.length > 0 || loading" @click="handlePrimaryAction">
              {{ primaryLabel }}
            </button>
            <button
              type="button"
              class="rounded-md border border-flamingo-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-900 transition-colors hover:bg-flamingo-50 disabled:cursor-not-allowed disabled:opacity-50"
              :disabled="!canSendRequest"
              @click="handleSendRequest"
            >
              {{ sendActionLabel }}
            </button>
            <button type="button" class="rounded-md border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-900 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50" :disabled="loading" @click="resetForm">
              {{ isMarketplace ? 'Clear' : 'Reset' }}
            </button>
          </div>

          <div v-if="sendFeedback" :class="sendFeedbackTone === 'success' ? 'rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800' : 'rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800'">
            {{ sendFeedback }}
          </div>
        </div>
      </template>
    </CalculatorShell>
  </div>
</template>

<script setup lang="ts">
import type { AddCustomItemPayload, AddProductItemPayload } from '~/services/quoteDraft'
import type { Product } from '~/shared/types'
import type { PublicCalculatorPayload, PublicMatchShop, PublicMatchShopsResponse } from '~/services/public'
import { useDebounceFn } from '@vueuse/core'
import CalculatorFieldGroup from '~/components/calculator/CalculatorFieldGroup.vue'
import CalculatorFormGrid from '~/components/calculator/CalculatorFormGrid.vue'
import CalculatorHeaderBlock from '~/components/calculator/CalculatorHeaderBlock.vue'
import CalculatorShell from '~/components/calculator/CalculatorShell.vue'
import FinishingSelector from '~/components/calculator/FinishingSelector.vue'
import QuotePreviewMeta from '~/components/calculator/QuotePreviewMeta.vue'
import QuotePreviewPanel from '~/components/calculator/QuotePreviewPanel.vue'
import QuotePreviewRequirementsState from '~/components/calculator/QuotePreviewRequirementsState.vue'
import { useAnalyticsTracking } from '~/composables/useAnalyticsTracking'
import ShopSelectionChips from '~/components/quotes/ShopSelectionChips.vue'
import { calculatorSelectUi } from '~/components/calculator/CalculatorSelectUi'
import { useQuoteRequestBlast } from '~/composables/useQuoteRequestBlast'
import { getGalleryProductOptions } from '~/shared/api/gallery'
import { usePublicApiNoAuth } from '~/shared/api'
import { API } from '~/shared/api-paths'
import { buildQuoteRequestSendSummary, getQuoteRequestSendFeedback, getQuoteRequestSendLabel, getQuoteRequestSendToast } from '~/shared/quoteRequestSend'
import { getCatalog, matchShops, previewShopCalculator } from '~/services/public'
import { useAuthStore } from '~/stores/auth'
import { useActivityBadgesStore } from '~/stores/activityBadges'
import { normalizeNumberValue, normalizeSelectValue } from '~/utils/payload'
import { extractProductionDetails } from '~/utils/productionDetails'

type PublicCalculatorMode = 'marketplace' | 'single-shop' | 'tweak' | 'tweak-and-quote'
type MatchShop = { id: number; name: string; slug: string }
type FinishingOption = Record<string, unknown> & { id: number; name: string }
type FinishingSelection = { finishing_rate_id: number; selected_side: 'front' | 'back' | 'both' }
type CustomOptionsResponse = {
  available_papers?: Array<{ id: number; sheet_size: string; gsm: number; paper_type: string }>
  available_materials?: Array<{ id: number; material_type?: string; unit?: string }>
  available_finishings?: Array<{ id: number; name: string; charge_unit?: string; billing_basis?: string; side_mode?: string; display_unit_label?: string }>
}

const props = withDefaults(defineProps<{
  title: string
  description: string
  eyebrow?: string
  mode: PublicCalculatorMode
  anchorId?: string
  compact?: boolean
  fixedShopSlug?: string | null
  fixedShopName?: string | null
  product?: Product | null
}>(), {
  eyebrow: 'Public Calculator',
  anchorId: 'public-calculator',
  compact: false,
  fixedShopSlug: null,
  fixedShopName: null,
  product: null,
})

const emit = defineEmits<{
  submit: [payload: AddCustomItemPayload | AddProductItemPayload, context: { matchingShops: MatchShop[]; selectedShops: MatchShop[]; minPrice: string | null; maxPrice: string | null; fixedShopPreview: MatchShop | null }]
}>()

const authStore = useAuthStore()
const activityBadgesStore = useActivityBadgesStore()
const route = useRoute()
const toast = useToast()
const publicApiNoAuth = usePublicApiNoAuth()
const { saveAndSend } = useQuoteRequestBlast()
const { trackQuoteSubmit } = useAnalyticsTracking()
const selectUi = calculatorSelectUi
const inputUi = { base: 'w-full px-4 text-sm' }
const textareaUi = { base: 'w-full px-4 py-2 text-sm min-h-[7rem]' }
const laminationSides = [{ label: 'Front only', value: 'front' }, { label: 'Back only', value: 'back' }, { label: 'Both sides', value: 'both' }]
const sidesOptions = [{ label: 'Front only', value: 'SIMPLEX' }, { label: 'Both sides', value: 'DUPLEX' }]
const colorModeOptions = [{ label: 'Black and white', value: 'BW' }, { label: 'Full colour', value: 'COLOR' }]
const sheetSizeOptions = [{ label: 'SRA3', value: 'SRA3' }, { label: 'A3', value: 'A3' }, { label: 'A4', value: 'A4' }, { label: 'A5', value: 'A5' }]

const isMarketplace = computed(() => props.mode === 'marketplace')
const isProductMode = computed(() => props.mode === 'tweak' || props.mode === 'tweak-and-quote')
const isSingleShop = computed(() => props.mode === 'single-shop' || isProductMode.value)
const isSheetMode = computed(() => (props.product?.pricing_mode ?? 'SHEET') === 'SHEET')
const isLargeFormatMode = computed(() => (props.product?.pricing_mode ?? 'SHEET') === 'LARGE_FORMAT')
const minimumQuantity = computed(() => props.product?.min_quantity ?? 1)

const customTitle = ref('Custom print job')
const customBrief = ref('')
const quantity = ref<number | null>(100)
const widthMm = ref<number | null>(null)
const heightMm = ref<number | null>(null)
const sides = ref<'SIMPLEX' | 'DUPLEX'>('SIMPLEX')
const colorMode = ref<'BW' | 'COLOR'>('COLOR')
const turnaroundDays = ref<number | null>(2)
const selectedPaperId = ref<number | null>(null)
const selectedMaterialId = ref<number | null>(null)
const hiddenMachineId = ref<number | null>(null)
const marketplaceSheetSize = ref('SRA3')
const marketplacePaperGsm = ref<number | null>(300)
const marketplacePaperType = ref('Art card')
const selectedFinishings = ref<FinishingSelection[]>([])
const paperDetails = ref<Array<{ id: number; label: string; sheet_size?: string }>>([])
const materialDetails = ref<Array<{ id: number; label: string }>>([])
const finishingOptions = ref<FinishingOption[]>([])
const fixedShopPreview = ref<PublicMatchShop | null>(null)
const fixedShopIdentity = ref<MatchShop | null>(null)
const matchResponse = ref<PublicMatchShopsResponse | null>(null)
const selectedMatchShopSlugs = ref<string[]>([])
const loading = ref(false)
const sendingRequest = ref(false)
const lastSentSummary = ref<{ shopCount: number; requestIds: number[] } | null>(null)
const sendError = ref('')
const previewCurrency = computed(() => fixedShopPreview.value?.currency ?? matchResponse.value?.currency ?? null)
const { formatMoney, formatMoneyRange } = useCurrencyFormatter(previewCurrency)

const paperOptions = computed(() => paperDetails.value.map(paper => ({ label: paper.label, value: paper.id })))
const materialOptions = computed(() => materialDetails.value.map(material => ({ label: material.label, value: material.id })))
const selectedPaperDetail = computed(() => paperDetails.value.find(paper => paper.id === selectedPaperId.value) ?? null)
const selectedPaperSupport = computed(() => selectedPaperDetail.value?.sheet_size ?? 'Based on selected stock')
const visibleMatches = computed(() => (matchResponse.value?.selected_shops ?? matchResponse.value?.shops ?? []).slice(0, 6))
const selectedShops = computed(() => visibleMatches.value.filter(shop => selectedMatchShopSlugs.value.includes(shop.slug)).map(asMatchShop))
const fixedShopDisplayName = computed(() => props.fixedShopName ?? fixedShopPreview.value?.name ?? fixedShopIdentity.value?.name ?? props.fixedShopSlug ?? 'Selected shop')
const sizeSummary = computed(() => {
  const width = normalizeNumberValue(widthMm.value ?? props.product?.default_finished_width_mm ?? null)
  const height = normalizeNumberValue(heightMm.value ?? props.product?.default_finished_height_mm ?? null)
  return width && height ? `${width} x ${height} mm` : ''
})
const finishingGroups = computed<Array<{ label: string; options: FinishingOption[] }>>(() => {
  const groups = new Map<string, FinishingOption[]>()
  for (const item of finishingOptions.value) {
    const key = String(item.category_name ?? item.category ?? 'Finishing')
    groups.set(key, [...(groups.get(key) ?? []), item])
  }
  return Array.from(groups.entries()).map(([label, options]) => ({ label, options }))
})
const shopSummaryLines = computed(() => {
  if (isMarketplace.value) {
    return selectedShops.value.map(shop => ({ label: shop.name, value: shop.slug }))
  }
  const shop = fixedShopPreview.value ?? fixedShopIdentity.value
  return shop ? [{ label: shop.name, value: shop.slug }] : []
})
const shopSummaryPlaceholder = computed(() => isMarketplace.value ? 'Matching shops will appear here' : 'Shop not loaded yet')
const jobSummaryLines = computed(() => [
  { label: 'Product', value: isProductMode.value ? (props.product?.name ?? 'Selected product') : customTitle.value.trim() || 'Custom job' },
  { label: 'Quantity', value: quantity.value ? `${quantity.value} pcs` : '' },
  { label: 'Size', value: sizeSummary.value },
  { label: 'Sides', value: sides.value === 'DUPLEX' ? 'Both sides' : 'Front only' },
  { label: 'Colour mode', value: colorMode.value === 'BW' ? 'Black & White' : 'Full colour' },
].filter(item => item.value))
const productionSummaryLines = computed(() => {
  const lines: Array<{ label: string; value: string }> = []
  if (isSheetMode.value) {
    lines.push({
      label: 'Paper',
      value: selectedPaperDetail.value?.label ?? (isMarketplace.value ? `${marketplaceSheetSize.value}${marketplacePaperGsm.value ? ` · ${marketplacePaperGsm.value}gsm` : ''}${marketplacePaperType.value ? ` · ${marketplacePaperType.value}` : ''}` : ''),
    })
  }
  if (isLargeFormatMode.value && selectedMaterialId.value) {
    lines.push({ label: 'Material', value: materialDetails.value.find(item => item.id === selectedMaterialId.value)?.label ?? '' })
  }
  if (!isProductMode.value) {
    lines.push({ label: 'Turnaround', value: turnaroundDays.value ? `${turnaroundDays.value} day(s)` : '' })
  }
  if (selectedFinishings.value.length) {
    lines.push({ label: 'Finishings', value: selectedFinishings.value.map(entry => finishingOptions.value.find(option => Number(option.id) === entry.finishing_rate_id)?.name).filter(Boolean).join(', ') })
  }
  if (!isProductMode.value && customBrief.value.trim()) {
    lines.push({ label: 'Brief', value: customBrief.value.trim() })
  }
  if (productionDetails.value.parentSheetName) {
    lines.push({ label: 'Parent sheet', value: productionDetails.value.parentSheetName })
  }
  if (productionDetails.value.rotated) {
    lines.push({ label: 'Rotated', value: productionDetails.value.rotated })
  }
  return lines.filter(item => item.value)
})
const missingRequirements = computed(() => {
  const items: string[] = []
  if (!normalizeNumberValue(quantity.value) || (quantity.value ?? 0) < minimumQuantity.value) items.push(`Set quantity${minimumQuantity.value > 1 ? ` (${minimumQuantity.value}+ minimum)` : ''}`)
  if (isProductMode.value) {
    if (isSheetMode.value && paperDetails.value.length && !selectedPaperId.value) items.push('Choose paper / GSM')
    if (isLargeFormatMode.value && materialDetails.value.length && !selectedMaterialId.value) items.push('Choose material')
    return items
  }
  if (!customTitle.value.trim()) items.push('Add a product title')
  if (!customBrief.value.trim()) items.push('Add a custom brief')
  if (!normalizeNumberValue(widthMm.value) || !normalizeNumberValue(heightMm.value)) items.push('Enter the finished size')
  if (isSingleShop.value && isSheetMode.value && paperDetails.value.length && !selectedPaperId.value) items.push('Choose paper / GSM')
  if (isSingleShop.value && isLargeFormatMode.value && materialDetails.value.length && !selectedMaterialId.value) items.push('Choose material')
  if (!normalizeNumberValue(turnaroundDays.value)) items.push('Set turnaround')
  return items
})
const backendMissingRequirements = computed(() => {
  const rows = isMarketplace.value ? visibleMatches.value : fixedShopPreview.value ? [fixedShopPreview.value] : []
  return Array.from(new Set(rows.flatMap(row => row.missing_fields ?? []))).filter(Boolean)
})
const marketplaceRange = computed(() => {
  if (!matchResponse.value?.min_price) return null
  return formatMoneyRange(matchResponse.value.min_price, matchResponse.value.max_price, matchResponse.value.currency)
})
const singleShopTotal = computed(() => {
  const total = fixedShopPreview.value?.total ?? null
  return total ? formatMoney(total, fixedShopPreview.value?.currency ?? null) : null
})
const fixedShopPreviewRecord = computed<Record<string, unknown> | null>(() =>
  fixedShopPreview.value?.preview && typeof fixedShopPreview.value.preview === 'object'
    ? fixedShopPreview.value.preview as Record<string, unknown>
    : null
)
const selectedPreviewShop = computed(() => {
  if (!isMarketplace.value) return fixedShopPreview.value
  return selectedShops.value
    .map(shop => visibleMatches.value.find(match => match.slug === shop.slug) ?? null)
    .find(Boolean)
    ?? visibleMatches.value[0]
    ?? null
})
const selectedPreviewRecord = computed<Record<string, unknown> | null>(() =>
  selectedPreviewShop.value?.preview && typeof selectedPreviewShop.value.preview === 'object'
    ? selectedPreviewShop.value.preview as Record<string, unknown>
    : fixedShopPreviewRecord.value
)
const productionDetails = computed(() => extractProductionDetails(selectedPreviewRecord.value))
const piecesPerSheet = computed(() => productionDetails.value.piecesPerSheet)
const sheetsRequired = computed(() => productionDetails.value.sheetsNeeded)
const priceLabel = computed(() => isMarketplace.value ? 'Marketplace price range' : 'Shop preview total')
const priceLine = computed(() => {
  if (loading.value) return 'Refreshing...'
  if (isMarketplace.value) return marketplaceRange.value ?? 'No backend price range yet'
  return singleShopTotal.value ?? 'Awaiting backend preview'
})
const priceHelper = computed(() => {
  if (missingRequirements.value.length) return ''
  if (isMarketplace.value) return matchResponse.value?.summary || 'Public calculators now use backend min/max pricing from matched shops.'
  if (fixedShopPreview.value?.can_calculate) {
    const unitLine = getUnitPriceLine(fixedShopPreview.value.preview, fixedShopPreview.value.currency)
    return unitLine ? `${fixedShopPreview.value.reason}. ${unitLine}` : fixedShopPreview.value.reason
  }
  return fixedShopPreview.value?.reason || matchResponse.value?.summary || 'Complete the production details to get a shop preview.'
})
const requirementsHelper = computed(() => isMarketplace.value ? 'Complete the marketplace brief to match shops.' : isProductMode.value ? 'Select the required production inputs before adding this tweaked item.' : 'Complete the single-shop brief before sending it into the quote draft flow.')
const primaryLabel = computed(() => isMarketplace.value ? 'Refresh matches' : props.mode === 'tweak-and-quote' ? 'Add and continue' : props.mode === 'tweak' ? 'Add to Draft' : 'Add to Quote Draft')
const canSendRequest = computed(() =>
  !loading.value
  && !sendingRequest.value
  && !lastSentSummary.value
  && !missingRequirements.value.length
  && (
    (isMarketplace.value && selectedShops.value.length > 0)
    || (!isMarketplace.value && Boolean(selectedPreviewShop.value?.id ?? fixedShopIdentity.value?.id))
  )
)
const sendActionLabel = computed(() => {
  const sharedLabel = getQuoteRequestSendLabel(lastSentSummary.value, sendingRequest.value)
  if (sharedLabel) return sharedLabel
  if (!authStore.isAuthenticated) return 'Sign in to send request'
  return isMarketplace.value ? 'Send request to selected shops' : 'Send request to shop'
})
const sendFeedbackTone = computed<'success' | 'error'>(() => lastSentSummary.value ? 'success' : 'error')
const sendFeedback = computed(() => {
  const sharedFeedback = getQuoteRequestSendFeedback(lastSentSummary.value)
  if (sharedFeedback) return sharedFeedback
  return sendError.value
})
const selectedShopIds = computed(() => {
  if (isMarketplace.value) return selectedShops.value.map(shop => shop.id).filter(Boolean)
  return [selectedPreviewShop.value?.id ?? fixedShopIdentity.value?.id].filter((value): value is number => typeof value === 'number' && value > 0)
})

function clearSendState() {
  lastSentSummary.value = null
  sendError.value = ''
}

watch(() => [props.product, props.fixedShopSlug, props.mode], () => {
  resetForm()
  void initialize()
}, { immediate: true })

watch(() => [
  customTitle.value,
  customBrief.value,
  quantity.value,
  widthMm.value,
  heightMm.value,
  sides.value,
  colorMode.value,
  turnaroundDays.value,
  selectedPaperId.value,
  selectedMaterialId.value,
  marketplaceSheetSize.value,
  marketplacePaperGsm.value,
  marketplacePaperType.value,
  JSON.stringify(selectedFinishings.value),
], () => {
  clearSendState()
  if (missingRequirements.value.length) {
    if (isMarketplace.value) {
      matchResponse.value = null
      selectedMatchShopSlugs.value = []
    } else {
      fixedShopPreview.value = null
      matchResponse.value = null
    }
    return
  }
  if (isMarketplace.value) {
    void debouncedRefreshMarketplaceMatches()
    return
  }
  if (isSingleShop.value && props.fixedShopSlug) {
    void debouncedRefreshSingleShopPreview()
  }
})

const debouncedRefreshMarketplaceMatches = useDebounceFn(refreshMarketplaceMatches, 300)
const debouncedRefreshSingleShopPreview = useDebounceFn(refreshSingleShopPreview, 300)

async function initialize() {
  await hydrateFixedShopIdentity()
  if (isProductMode.value && props.product?.id) {
    await loadProductOptions(props.product.id)
  } else if (props.mode === 'single-shop' && props.fixedShopSlug) {
    await loadSingleShopCustomOptions(props.fixedShopSlug)
  }

  if (!missingRequirements.value.length) {
    if (isMarketplace.value) await refreshMarketplaceMatches()
    else if (isSingleShop.value && props.fixedShopSlug) await refreshSingleShopPreview()
  }
}

async function hydrateFixedShopIdentity() {
  fixedShopPreview.value = null
  fixedShopIdentity.value = props.fixedShopSlug ? { id: 0, slug: props.fixedShopSlug, name: props.fixedShopName ?? props.fixedShopSlug } : null
  if (!props.fixedShopSlug) return
  const catalog = await getCatalog(props.fixedShopSlug)
  if (catalog?.shop) {
    fixedShopIdentity.value = {
      id: catalog.shop.id,
      slug: catalog.shop.slug,
      name: props.fixedShopName ?? catalog.shop.name,
    }
  }
}

async function loadSingleShopCustomOptions(shopSlug: string) {
  loading.value = true
  try {
    const data = await publicApiNoAuth<CustomOptionsResponse>(API.publicShopCustomOptions(shopSlug))
    paperDetails.value = (data.available_papers ?? []).map(paper => ({
      id: paper.id,
      label: `${paper.sheet_size} · ${paper.gsm}gsm · ${paper.paper_type}`,
      sheet_size: paper.sheet_size,
    }))
    materialDetails.value = (data.available_materials ?? []).map(material => ({
      id: material.id,
      label: material.material_type ? `${material.material_type}${material.unit ? ` · ${material.unit}` : ''}` : 'Material',
    }))
    finishingOptions.value = (data.available_finishings ?? []).map(finishing => ({
      ...finishing,
      billing_basis: resolveFinishingBillingBasis(finishing),
      side_mode: resolveFinishingSideMode(finishing),
    }))
    if (!selectedPaperId.value) selectedPaperId.value = paperDetails.value[0]?.id ?? null
    if (!selectedMaterialId.value) selectedMaterialId.value = materialDetails.value[0]?.id ?? null
  } finally {
    loading.value = false
  }
}

async function loadProductOptions(productId: number) {
  loading.value = true
  try {
    const options = await getGalleryProductOptions(productId)
    paperDetails.value = (options?.available_papers ?? []).map(paper => ({
      id: paper.id,
      label: `${paper.sheet_size} · ${paper.gsm}gsm · ${paper.paper_type}`,
      sheet_size: paper.sheet_size,
    }))
    materialDetails.value = (options?.available_materials ?? []).map(material => ({
      id: material.id,
      label: material.material_type ? `${material.material_type}${material.unit ? ` · ${material.unit}` : ''}` : 'Material',
    }))
    finishingOptions.value = (options?.available_finishings ?? []).map(finishing => ({
      ...finishing,
      billing_basis: resolveFinishingBillingBasis(finishing),
      side_mode: resolveFinishingSideMode(finishing),
    }))
    hiddenMachineId.value = normalizeNumberValue((options as Record<string, unknown> | null)?.default_machine ?? null)
      ?? normalizeNumberValue((options as Record<string, unknown> | null)?.default_machine_id ?? null)
      ?? normalizeNumberValue(options?.available_machines?.[0]?.id ?? null)
      ?? null
    if (!selectedPaperId.value) selectedPaperId.value = paperDetails.value[0]?.id ?? null
    if (!selectedMaterialId.value) selectedMaterialId.value = materialDetails.value[0]?.id ?? null
    widthMm.value = normalizeNumberValue(props.product?.default_finished_width_mm ?? null)
    heightMm.value = normalizeNumberValue(props.product?.default_finished_height_mm ?? null)
    sides.value = props.product?.default_sides === 'DUPLEX' ? 'DUPLEX' : 'SIMPLEX'
    quantity.value = props.product?.min_quantity ?? 100
  } finally {
    loading.value = false
  }
}

function buildPreviewPayload(): PublicCalculatorPayload {
  return {
    calculator_mode: props.mode,
    shop_scope: isMarketplace.value ? 'marketplace' : props.mode === 'single-shop' ? 'single_shop' : 'tweak',
    pricing_mode: isProductMode.value ? 'catalog' : 'custom',
    product_pricing_mode: props.product?.pricing_mode ?? (selectedMaterialId.value ? 'LARGE_FORMAT' : 'SHEET'),
    product_id: isProductMode.value ? (props.product?.id ?? null) : null,
    template_id: isProductMode.value ? (props.product?.id ?? null) : null,
    width_mm: normalizeNumberValue(widthMm.value ?? props.product?.default_finished_width_mm ?? null),
    height_mm: normalizeNumberValue(heightMm.value ?? props.product?.default_finished_height_mm ?? null),
    quantity: normalizeNumberValue(quantity.value) ?? minimumQuantity.value,
    print_sides: sides.value,
    colour_mode: colorMode.value,
    paper_id: selectedPaperId.value,
    material_id: selectedMaterialId.value,
    sheet_size: isMarketplace.value && isSheetMode.value ? marketplaceSheetSize.value : undefined,
    paper_gsm: isMarketplace.value && isSheetMode.value ? normalizeNumberValue(marketplacePaperGsm.value) : undefined,
    paper_type: isMarketplace.value && isSheetMode.value ? marketplacePaperType.value.trim() : undefined,
    finishing_ids: selectedFinishings.value.map(entry => entry.finishing_rate_id),
    finishings: selectedFinishings.value.map(entry => ({
      finishing_rate_id: entry.finishing_rate_id,
      selected_side: entry.selected_side,
    })),
    turnaround_days: !isProductMode.value ? normalizeNumberValue(turnaroundDays.value) : undefined,
    custom_title: !isProductMode.value ? customTitle.value.trim() : undefined,
    custom_brief: !isProductMode.value ? customBrief.value.trim() : undefined,
    fixed_shop_slug: props.fixedShopSlug ?? undefined,
  }
}

async function refreshMarketplaceMatches() {
  if (!isMarketplace.value || missingRequirements.value.length) return
  loading.value = true
  try {
    const result = await matchShops(buildPreviewPayload())
    matchResponse.value = result
    selectedMatchShopSlugs.value = (result.selected_shops ?? result.shops ?? []).slice(0, 6).map(shop => shop.slug)
  } catch (error) {
    matchResponse.value = null
    selectedMatchShopSlugs.value = []
    toast.add({ title: 'Could not match shops', description: error instanceof Error ? error.message : 'Please try again.', color: 'error' })
  } finally {
    loading.value = false
  }
}

async function refreshSingleShopPreview() {
  if (!isSingleShop.value || !props.fixedShopSlug || missingRequirements.value.length) return
  loading.value = true
  try {
    const result = await previewShopCalculator(props.fixedShopSlug, buildPreviewPayload())
    matchResponse.value = result
    fixedShopPreview.value = result.fixed_shop_preview ?? result.selected_shops?.[0] ?? result.shops?.[0] ?? null
    selectedMatchShopSlugs.value = fixedShopPreview.value?.slug ? [fixedShopPreview.value.slug] : []
    hiddenMachineId.value = normalizeNumberValue(fixedShopPreview.value?.selection?.machine_id ?? hiddenMachineId.value)
    if (!selectedPaperId.value && fixedShopPreview.value?.selection?.paper_id) selectedPaperId.value = fixedShopPreview.value.selection.paper_id
    if (!selectedMaterialId.value && fixedShopPreview.value?.selection?.material_id) selectedMaterialId.value = fixedShopPreview.value.selection.material_id
  } catch (error) {
    fixedShopPreview.value = null
    matchResponse.value = null
    toast.add({ title: 'Could not refresh shop preview', description: error instanceof Error ? error.message : 'Please try again.', color: 'error' })
  } finally {
    loading.value = false
  }
}

function buildSubmitPayload(): AddCustomItemPayload | AddProductItemPayload {
  if (isProductMode.value && props.product) {
    return {
      item_type: 'PRODUCT',
      product: props.product.id,
      quantity: normalizeNumberValue(quantity.value) ?? minimumQuantity.value,
      pricing_mode: props.product.pricing_mode,
      paper: selectedPaperId.value ?? undefined,
      material: selectedMaterialId.value ?? undefined,
      machine: hiddenMachineId.value ?? undefined,
      sides: sides.value,
      color_mode: colorMode.value,
      finishings: selectedFinishings.value.length
        ? selectedFinishings.value.map(entry => ({
          finishing_rate: entry.finishing_rate_id,
          apply_to_sides: entry.selected_side === 'both' ? 'BOTH' : 'SINGLE',
        }))
        : undefined,
    } satisfies AddProductItemPayload
  }
  return {
    item_type: 'CUSTOM',
    title: customTitle.value.trim(),
    spec_text: customBrief.value.trim(),
    quantity: normalizeNumberValue(quantity.value) ?? 1,
    pricing_mode: selectedMaterialId.value ? 'LARGE_FORMAT' : 'SHEET',
    chosen_width_mm: normalizeNumberValue(widthMm.value) ?? 0,
    chosen_height_mm: normalizeNumberValue(heightMm.value) ?? 0,
    paper: selectedPaperId.value ?? undefined,
    material: selectedMaterialId.value ?? undefined,
    sides: sides.value,
    color_mode: colorMode.value,
    finishings: selectedFinishings.value.length
      ? selectedFinishings.value.map(entry => ({
        finishing_rate: entry.finishing_rate_id,
        apply_to_sides: entry.selected_side === 'both' ? 'BOTH' : 'SINGLE',
        selected_side: entry.selected_side,
      }))
      : undefined,
    item_spec_snapshot: {
      pricing_mode: selectedMaterialId.value ? 'LARGE_FORMAT' : 'SHEET',
      width_mm: normalizeNumberValue(widthMm.value) ?? 0,
      height_mm: normalizeNumberValue(heightMm.value) ?? 0,
      paper_id: selectedPaperId.value ?? null,
      material_id: selectedMaterialId.value ?? null,
      print_sides: sides.value,
      colour_mode: colorMode.value,
      turnaround_days: normalizeNumberValue(turnaroundDays.value),
      finishings: selectedFinishings.value.map(entry => ({
        finishing_rate_id: entry.finishing_rate_id,
        selected_side: entry.selected_side,
      })),
    },
    has_artwork: true,
  } satisfies AddCustomItemPayload
}

async function handlePrimaryAction() {
  if (isMarketplace.value) {
    await refreshMarketplaceMatches()
    return
  }
  if (missingRequirements.value.length) {
    toast.add({ title: 'Incomplete form', description: missingRequirements.value[0] ?? 'Fill the required fields first.', color: 'warning' })
    return
  }
  if (isSingleShop.value && props.fixedShopSlug && !fixedShopPreview.value) {
    await refreshSingleShopPreview()
  }
  emit('submit', buildSubmitPayload(), {
    matchingShops: (matchResponse.value?.shops ?? []).map(asMatchShop),
    selectedShops: isMarketplace.value ? selectedShops.value : (fixedShopPreview.value ? [asMatchShop(fixedShopPreview.value)] : []),
    minPrice: matchResponse.value?.min_price ?? null,
    maxPrice: matchResponse.value?.max_price ?? null,
    fixedShopPreview: fixedShopPreview.value ? asMatchShop(fixedShopPreview.value) : fixedShopIdentity.value,
  })
}

async function handleSendRequest() {
  clearSendState()
  if (missingRequirements.value.length) {
    toast.add({ title: 'Incomplete form', description: missingRequirements.value[0] ?? 'Fill the required fields first.', color: 'warning' })
    return
  }

  if (!isMarketplace.value && isSingleShop.value && props.fixedShopSlug && !fixedShopPreview.value) {
    await refreshSingleShopPreview()
  }

  if (!selectedShopIds.value.length) {
    toast.add({ title: 'No shops selected', description: 'Select at least one shop before sending.', color: 'warning' })
    return
  }

  if (sendingRequest.value) {
    return
  }

  const payload = buildPreviewPayload()
  const pricingSnapshot = isMarketplace.value
    ? {
      ...matchResponse.value,
      selected_shops: selectedShops.value.map(shop => visibleMatches.value.find(match => match.slug === shop.slug)).filter(Boolean),
      copies_per_sheet: productionDetails.value.piecesPerSheet || null,
      good_sheets: productionDetails.value.sheetsNeeded || null,
      parent_sheet_name: productionDetails.value.parentSheetName || null,
      rotated: productionDetails.value.rotated === 'Yes' ? true : productionDetails.value.rotated === 'No' ? false : null,
      production_details: productionDetails.value,
    }
    : {
      ...selectedPreviewRecord.value,
      copies_per_sheet: productionDetails.value.piecesPerSheet || null,
      good_sheets: productionDetails.value.sheetsNeeded || null,
      parent_sheet_name: productionDetails.value.parentSheetName || null,
      rotated: productionDetails.value.rotated === 'Yes' ? true : productionDetails.value.rotated === 'No' ? false : null,
      production_details: productionDetails.value,
    }

  sendingRequest.value = true

  try {
    const requests = await saveAndSend({
      title: isProductMode.value ? (props.product?.name ?? 'Prepared request') : (customTitle.value.trim() || 'Prepared request'),
      shop: selectedShopIds.value[0] ?? null,
      selectedProduct: props.product?.id ?? null,
      calculatorInputsSnapshot: {
        ...payload,
        selected_shop_ids: selectedShopIds.value,
        selected_shop_slugs: isMarketplace.value ? selectedShops.value.map(shop => shop.slug) : [selectedPreviewShop.value?.slug ?? props.fixedShopSlug].filter(Boolean),
      },
      pricingSnapshot: pricingSnapshot as Record<string, unknown>,
      customProductSnapshot: !isProductMode.value
        ? {
          custom_title: customTitle.value.trim(),
          custom_brief: customBrief.value.trim(),
          width_mm: normalizeNumberValue(widthMm.value),
          height_mm: normalizeNumberValue(heightMm.value),
        }
        : null,
      requestDetailsSnapshot: {
        notes: customBrief.value.trim() || undefined,
        selected_shop_ids: selectedShopIds.value,
        selected_shop_slugs: isMarketplace.value ? selectedShops.value.map(shop => shop.slug) : [selectedPreviewShop.value?.slug ?? props.fixedShopSlug].filter(Boolean),
      },
      selectedShopIds: selectedShopIds.value,
      loginRedirectPath: route.fullPath,
    })

    if (requests?.length) {
      lastSentSummary.value = buildQuoteRequestSendSummary(requests)
      void trackQuoteSubmit({
        source: isMarketplace.value ? 'public_marketplace_calculator' : 'public_single_shop_calculator',
        request_ids: requests.map(request => request.id),
        shop_count: requests.length,
        selected_shop_slugs: isMarketplace.value ? selectedShops.value.map(shop => shop.slug) : [selectedPreviewShop.value?.slug ?? props.fixedShopSlug].filter(Boolean),
        product_name: isProductMode.value ? (props.product?.name ?? null) : customTitle.value.trim(),
      })
      await activityBadgesStore.fetchSummary()
      const successToast = getQuoteRequestSendToast(lastSentSummary.value)
      toast.add({
        title: successToast.title,
        description: successToast.description,
        color: 'success',
      })
    }
  } catch (error) {
    sendError.value = error instanceof Error ? error.message : 'Could not send your request. Please try again.'
    toast.add({
      title: 'Request not sent',
      description: sendError.value,
      color: 'error',
    })
  } finally {
    sendingRequest.value = false
  }
}

function resetForm() {
  clearSendState()
  customTitle.value = 'Custom print job'
  customBrief.value = ''
  quantity.value = props.product?.min_quantity ?? 100
  widthMm.value = normalizeNumberValue(props.product?.default_finished_width_mm ?? null)
  heightMm.value = normalizeNumberValue(props.product?.default_finished_height_mm ?? null)
  sides.value = props.product?.default_sides === 'DUPLEX' ? 'DUPLEX' : 'SIMPLEX'
  colorMode.value = 'COLOR'
  turnaroundDays.value = props.product?.turnaround_days ?? 2
  selectedPaperId.value = paperDetails.value[0]?.id ?? null
  selectedMaterialId.value = materialDetails.value[0]?.id ?? null
  selectedFinishings.value = []
  marketplaceSheetSize.value = props.product?.default_sheet_size ?? 'SRA3'
  marketplacePaperGsm.value = props.product?.min_gsm ?? 300
  marketplacePaperType.value = 'Art card'
  matchResponse.value = null
  fixedShopPreview.value = null
  selectedMatchShopSlugs.value = []
}

function toggleMatchedShop(shopSlug: string) {
  selectedMatchShopSlugs.value = selectedMatchShopSlugs.value.includes(shopSlug)
    ? selectedMatchShopSlugs.value.filter(slug => slug !== shopSlug)
    : [...selectedMatchShopSlugs.value, shopSlug]
}
function toggleFinishing(finishing: Record<string, unknown>) {
  const id = Number(finishing.id)
  selectedFinishings.value = isFinishingSelected(id)
    ? selectedFinishings.value.filter(entry => entry.finishing_rate_id !== id)
    : [...selectedFinishings.value, { finishing_rate_id: id, selected_side: 'both' }]
}
function updateFinishingSide(finishingId: number, value: unknown) {
  const normalized = normalizeSelectValue<'front' | 'back' | 'both'>(value) ?? 'both'
  selectedFinishings.value = selectedFinishings.value.map(entry => entry.finishing_rate_id === finishingId ? { ...entry, selected_side: normalized } : entry)
}
function selectedFinishingSide(finishingId: number) { return selectedFinishings.value.find(entry => entry.finishing_rate_id === finishingId)?.selected_side ?? 'both' }
function isFinishingSelected(finishingId: number) { return selectedFinishings.value.some(entry => entry.finishing_rate_id === finishingId) }
function isFinishingSideOpen(finishingId: number) {
  const option = finishingOptions.value.find(item => Number(item.id) === finishingId)
  return Boolean(option && isFinishingSelected(finishingId) && isLamination(option))
}
function isLamination(finishing: Record<string, unknown> | undefined) {
  return Boolean(finishing && (`${String(finishing.slug ?? '')} ${String(finishing.name ?? '')}`.toLowerCase().includes('lamination') || (finishing.billing_basis === 'per_sheet' && finishing.side_mode === 'per_selected_side')))
}
function asMatchShop(shop: Pick<PublicMatchShop, 'id' | 'name' | 'slug'>): MatchShop {
  return { id: shop.id, name: shop.name, slug: shop.slug }
}
function resolveFinishingBillingBasis(finishing: { charge_unit?: string; billing_basis?: string; name?: string }) {
  if (finishing.billing_basis) return finishing.billing_basis
  return isLegacyOrNamedLamination(finishing) ? 'per_sheet' : 'per_piece'
}
function resolveFinishingSideMode(finishing: { charge_unit?: string; side_mode?: string; name?: string }) {
  if (finishing.side_mode) return finishing.side_mode
  return isLegacyOrNamedLamination(finishing) ? 'per_selected_side' : 'ignore_sides'
}
function isLegacyOrNamedLamination(finishing: { charge_unit?: string; name?: string }) {
  return finishing.charge_unit === 'PER_SIDE_PER_SHEET' || String(finishing.name ?? '').toLowerCase().includes('lamination')
}
function getUnitPriceLine(preview: Record<string, unknown> | null | undefined, currency?: string | null) {
  const totals = preview && typeof preview === 'object' ? (preview.totals as Record<string, unknown> | undefined) : undefined
  const unitPrice = totals?.unit_price
  return typeof unitPrice === 'string' || typeof unitPrice === 'number'
    ? `${formatMoney(String(unitPrice), currency)} per item`
    : ''
}
</script>
