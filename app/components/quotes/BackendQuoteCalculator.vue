<template>
  <div class="space-y-4">
    <CalculatorShell :anchor-id="anchorId">
      <template #header>
        <CalculatorHeaderBlock
          :eyebrow="eyebrow"
          :title="effectiveTitle"
          :description="description"
          :compact="compactMode"
        />
      </template>

      <template #form>
        <CalculatorFormGrid @submit="previewQuote">
          <div class="grid gap-4 md:grid-cols-2">
            <CalculatorFieldGroup label="Product title">
              <UInput v-model="customProductTitle" :ui="calculatorInputUi" placeholder="Product title" />
            </CalculatorFieldGroup>
            <CalculatorFieldGroup label="Quantity">
              <UInput v-model="quantity" :ui="calculatorInputUi" type="number" min="1" />
            </CalculatorFieldGroup>
          </div>

          <div class="grid gap-4 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
            <CalculatorFieldGroup label="Size mode">
              <USelectMenu
                :model-value="customSizeMode"
                :items="sizeModeOptions"
                value-key="value"
                label-key="label"
                :ui="legacySelectUi"
                portal="body"
                class="w-full"
                @update:model-value="handleCustomSizeModeChange"
              />
            </CalculatorFieldGroup>
            <CalculatorFieldGroup label="Print sides">
              <USelectMenu
                v-model="sides"
                :items="sidesOptions"
                value-key="value"
                label-key="label"
                :ui="legacySelectUi"
                portal="body"
                class="w-full"
              />
            </CalculatorFieldGroup>
          </div>

          <div v-if="customSizeMode === 'standard'" class="grid gap-4 md:grid-cols-1">
            <CalculatorFieldGroup label="Standard size">
              <USelectMenu
                :model-value="customSizeLabel"
                :items="sizePresetOptions"
                value-key="value"
                label-key="label"
                :ui="legacySelectUi"
                portal="body"
                class="w-full"
                @update:model-value="handleCustomSizePresetChange"
              />
            </CalculatorFieldGroup>
          </div>

          <div v-else class="grid gap-4 md:grid-cols-2">
            <CalculatorFieldGroup label="Custom width (mm)">
              <UInput
                :model-value="customWidthInput || undefined"
                :ui="calculatorInputUi"
                type="number"
                min="0.1"
                step="0.01"
                @update:model-value="handleCustomWidthInputChange"
              />
            </CalculatorFieldGroup>
            <CalculatorFieldGroup label="Custom height (mm)">
              <UInput
                :model-value="customHeightInput || undefined"
                :ui="calculatorInputUi"
                type="number"
                min="0.1"
                step="0.01"
                @update:model-value="handleCustomHeightInputChange"
              />
            </CalculatorFieldGroup>
          </div>

          <div class="grid gap-4 md:grid-cols-2">
            <CalculatorFieldGroup label="Color mode">
              <USelectMenu
                v-model="colorMode"
                :items="colorModeOptions"
                value-key="value"
                label-key="label"
                :ui="legacySelectUi"
                portal="body"
                class="w-full"
              />
            </CalculatorFieldGroup>
            <CalculatorFieldGroup label="Turnaround">
              <UInput v-model="turnaroundDays" :ui="calculatorInputUi" type="number" min="1" placeholder="24 working hours" />
            </CalculatorFieldGroup>
          </div>

          <div class="grid gap-4 md:grid-cols-3">
            <CalculatorFieldGroup label="Paper type">
              <USelectMenu
                :model-value="selectedPaperType || undefined"
                :items="paperTypeOptions"
                value-key="value"
                label-key="label"
                :ui="legacySelectUi"
                portal="body"
                class="w-full"
                @update:model-value="selectedPaperType = normalizeSelectValue<string>($event) ?? null"
              />
            </CalculatorFieldGroup>
            <CalculatorFieldGroup label="Sheet size">
              <USelectMenu
                :model-value="selectedSheetSize ?? undefined"
                :items="sheetSizeOptions"
                value-key="value"
                label-key="label"
                :ui="legacySelectUi"
                portal="body"
                class="w-full"
                @update:model-value="selectedSheetSize = normalizeSelectValue<string>($event) ?? null"
              />
            </CalculatorFieldGroup>
            <CalculatorFieldGroup label="Paper gsm">
              <USelectMenu
                :model-value="selectedPaperGsm ?? undefined"
                :items="paperGsmOptions"
                value-key="value"
                label-key="label"
                :ui="legacySelectUi"
                portal="body"
                class="w-full"
                @update:model-value="selectedPaperGsm = normalizeNumberValue($event)"
              />
            </CalculatorFieldGroup>
          </div>

          <CalculatorFieldGroup label="Custom brief">
            <UTextarea
              v-model="customProductSpec"
              :ui="calculatorTextareaUi"
              :rows="3"
              placeholder="Describe the job, artwork, and any special handling."
            />
          </CalculatorFieldGroup>

          <CalculatorFieldGroup label="Finishings" :help="finishingHelperCopy">
            <FinishingSelector
              :groups="finishingGroups"
              :lamination-sides="laminationSides"
              :select-ui="legacySelectUi"
              :is-selected="isFinishingSelected"
              :show-side-selector="isFinishingSideOpen"
              :get-side="selectedFinishingSide"
              @toggle="toggleFinishing"
              @update-side="updateFinishingSide"
            />
          </CalculatorFieldGroup>
        </CalculatorFormGrid>
      </template>

      <template #preview>
        <div class="space-y-4">
          <div id="quote-pdf-target" ref="quotePdfTargetRef">
            <QuotePreviewPanel>
              <div class="space-y-4">
                <div class="border-b border-slate-200 pb-3">
                  <p class="text-[0.68rem] font-extrabold uppercase tracking-[0.18em] text-flamingo-500">
                    {{ previewEyebrow }}
                  </p>
                  <h3 class="mt-1 text-xl font-semibold text-slate-900">
                    {{ previewHeading }}
                  </h3>
                  <p class="mt-1 text-sm text-slate-500">
                    {{ previewIntro }}
                  </p>
                </div>

                <ClientDetailsInlineForm
                  v-if="props.mode === 'hero'"
                  :name="contactName"
                  :phone="contactPhone"
                  :email="contactEmail"
                  :input-ui="lightInputUi"
                  @update:name="contactName = $event"
                  @update:phone="contactPhone = $event"
                  @update:email="contactEmail = $event"
                />
                <div v-if="props.mode === 'hero' && !authStore.isAuthenticated" class="text-xs text-slate-500">
                  <NuxtLink to="/auth/signup?redirect=/quote-draft" class="font-semibold text-flamingo-600 hover:text-flamingo-700">
                    Create a client account
                  </NuxtLink>
                  to save this pricing context in your requests and quotes workspace.
                </div>

                <QuotePreviewMeta title="Active shop" :lines="shopMetaLines" placeholder="Available after shop load" />
                <QuotePreviewMeta v-if="clientMetaLines.length" title="Client" :lines="clientMetaLines" placeholder="Not provided" />
                <QuotePreviewMeta title="Job summary" :lines="jobMetaLines" placeholder="Pending" />
                <QuotePreviewMeta
                  v-if="productionMetaLines.length"
                  title="Production plan"
                  :lines="productionMetaLines"
                />

                <QuotePreviewRequirementsState
                  v-if="!canShowFinalPricing"
                  :title="requirementsTitle"
                  :items="missingRequirements"
                  :helper="requirementsHelper"
                />

                <QuotePreviewPriceState
                  v-else
                  :print-subtotal="printCostDisplay"
                  :finishing-total="finishingTotalDisplay"
                  :total="totalDisplay"
                  :per-unit="perUnitDisplay"
                  :helper="totalHelperLine"
                  :pieces-per-sheet="piecesPerSheetDisplay"
                  :sheets-required="sheetsRequiredDisplay"
                  :cost-lines="priceBreakdownLines"
                />

                <QuotePreviewMeta
                  v-if="selectedFinishings.length"
                  title="Finishing summary"
                  :lines="finishingBreakdownLines.map(line => ({ label: line.label, value: line.total }))"
                />

                <div
                  v-if="props.mode === 'shop' && workspaceMode === 'custom'"
                  class="rounded-2xl border border-slate-200 bg-slate-50 p-4"
                >
                  <div class="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div class="min-w-0">
                      <p class="text-[0.68rem] font-extrabold uppercase tracking-[0.18em] text-flamingo-500">
                        Active quotation
                      </p>
                      <h4 class="mt-1 text-lg font-semibold text-slate-900">
                        {{ activeDraftItemCount }} item{{ activeDraftItemCount === 1 ? '' : 's' }} in progress
                      </h4>
                      <p class="mt-1 text-sm text-slate-500">
                        Add multiple custom products, then keep editing the quotation summary before sending or exporting.
                      </p>
                    </div>
                  </div>

                  <div v-if="activeCustomDraftItems.length" class="mt-4 space-y-3">
                    <article
                      v-for="item in activeCustomDraftItems"
                      :key="item.id"
                      class="rounded-2xl border border-slate-200 bg-white p-3"
                    >
                      <div class="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                        <div class="min-w-0 flex-1">
                          <div class="flex items-start gap-3">
                            <div
                              v-if="item.attachments?.[0]?.file"
                              class="h-14 w-14 shrink-0 overflow-hidden rounded-xl border border-slate-200 bg-slate-100"
                            >
                              <img :src="item.attachments[0].file" :alt="item.attachments[0].name || item.title || 'Reference image'" class="h-full w-full object-cover">
                            </div>
                            <div class="min-w-0">
                              <p class="break-words text-sm font-semibold text-slate-900">{{ item.title || item.product_name || 'Custom item' }}</p>
                              <p class="mt-1 break-words text-sm text-slate-500">{{ item.spec_text || item.special_instructions || formatDraftItemSize(item) }}</p>
                              <div class="mt-2 flex flex-wrap gap-2">
                                <span class="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">Qty {{ item.quantity }}</span>
                                <span class="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">{{ formatDraftItemSize(item) }}</span>
                                <span
                                  class="rounded-full px-2.5 py-1 text-xs font-semibold"
                                  :class="item.needs_review ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'"
                                >
                                  {{ item.needs_review ? 'Manual pricing' : 'Priced' }}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div class="sm:text-right">
                          <p class="text-xs font-semibold uppercase tracking-[0.12em] text-slate-400">Amount</p>
                          <p class="mt-1 text-sm font-semibold text-slate-900">{{ formatDraftItemAmount(item) }}</p>
                        </div>
                      </div>
                      <div class="mt-3 flex flex-wrap gap-2">
                        <button
                          type="button"
                          class="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-50"
                          @click="loadCustomDraftItem(item)"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          class="rounded-full border border-rose-200 bg-rose-50 px-3 py-1.5 text-xs font-semibold text-rose-700 transition-colors hover:bg-rose-100"
                          @click="removeCustomDraftItem(item.id)"
                        >
                          Remove
                        </button>
                      </div>
                    </article>
                  </div>

                  <div v-else class="mt-4 rounded-2xl border border-dashed border-slate-200 bg-white p-4 text-sm text-slate-500">
                    No custom products added yet. Use the custom builder to create the first quote line.
                  </div>
                </div>
              </div>
            </QuotePreviewPanel>
          </div>

          <div v-if="showPriceAdvice" class="rounded-lg border border-amber-300/70 bg-amber-50 px-4 py-3 text-sm text-amber-900">
            Quantity below 500. Per-unit cost is usually higher at this level.
          </div>

          <div :class="compactMode ? 'grid gap-2' : 'grid gap-2 sm:grid-cols-3'">
            <button
              type="button"
              class="rounded-md bg-flamingo-500 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-flamingo-400 disabled:cursor-not-allowed disabled:opacity-50"
              :disabled="primaryAction.disabled"
              @click="runAction(primaryAction.run)"
            >
              {{ primaryAction.label }}
            </button>
            <button
              type="button"
              class="rounded-md border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-900 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
              :disabled="secondaryAction.disabled"
              @click="runAction(secondaryAction.run)"
            >
              {{ secondaryAction.label }}
            </button>
            <button
              v-if="tertiaryAction"
              type="button"
              class="rounded-md border border-white/15 bg-white/5 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50"
              :disabled="tertiaryAction.disabled"
              @click="runAction(tertiaryAction.run)"
            >
              {{ tertiaryAction.label }}
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
import { API } from '~/shared/api-paths'
import type { QuoteDraft, QuoteItem } from '~/shared/types/buyer'
import type { QuoteRequest } from '~/shared/types/quoteRequest'
import CalculatorFieldGroup from '~/components/calculator/CalculatorFieldGroup.vue'
import CalculatorFormGrid from '~/components/calculator/CalculatorFormGrid.vue'
import CalculatorHeaderBlock from '~/components/calculator/CalculatorHeaderBlock.vue'
import CalculatorQuoteModeToggle from '~/components/calculator/CalculatorQuoteModeToggle.vue'
import CalculatorShell from '~/components/calculator/CalculatorShell.vue'
import ClientDetailsInlineForm from '~/components/calculator/ClientDetailsInlineForm.vue'
import FinishingSelector from '~/components/calculator/FinishingSelector.vue'
import QuotePreviewMeta from '~/components/calculator/QuotePreviewMeta.vue'
import QuotePreviewPanel from '~/components/calculator/QuotePreviewPanel.vue'
import QuotePreviewPriceState from '~/components/calculator/QuotePreviewPriceState.vue'
import QuotePreviewRequirementsState from '~/components/calculator/QuotePreviewRequirementsState.vue'
import ShopSelectionChips from '~/components/quotes/ShopSelectionChips.vue'
import { calculatorSelectUi } from '~/components/calculator/CalculatorSelectUi'
import { useAnalyticsTracking } from '~/composables/useAnalyticsTracking'
import { useCalculatorPreviewState } from '~/composables/useCalculatorPreviewState'
import { useQuoteRequestBlast } from '~/composables/useQuoteRequestBlast'
import { removeQuoteItemAttachment, updateItem, uploadQuoteItemAttachment, type AddCustomItemPayload } from '~/services/quoteDraft'
import { buildQuoteRequestSendSummary, getQuoteRequestSendFeedback, getQuoteRequestSendLabel, getQuoteRequestSendToast } from '~/shared/quoteRequestSend'
import { useActivityBadgesStore } from '~/stores/activityBadges'
import { useAuthStore } from '~/stores/auth'
import { useCalculatorStore } from '~/stores/calculator'
import { useMachineStore } from '~/stores/machine'
import { useQuoteInboxStore } from '~/stores/quoteInbox'
import { useQuoteDraftStore } from '~/stores/quoteDraft'
import { useShopStore } from '~/stores/shop'
import { getPreviewMoney } from '~/utils/calculationResult'
import { buildCalculatorPaperCatalog, filterCalculatorPaperGsms, filterCalculatorPaperTypes, findCalculatorPaperRecord, type CalculatorPaperRecord } from '~/utils/calculatorPaperCatalog'
import { extractPerSheetBreakdown } from '~/utils/pricingBreakdown'
import { normalizeNumberValue, normalizeOptionalText, normalizeSelectValue } from '~/utils/payload'
import { createSharedCalculatorRequest, toFlatCalculatorPayload, toFlatCalculatorSnapshot } from '~/utils/sharedCalculatorRequest'
import { convertInputToMm, convertMmToDisplay, formatSizeSummary, getSizePreset, inferSizePresetLabel, sizePresets } from '~/utils/size'

type CalculatorFinishingOption = Record<string, unknown> & { id: number; name: string }

const props = withDefaults(defineProps<{
  title: string
  description: string
  eyebrow?: string
  mode?: 'hero' | 'client' | 'shop'
  fixedShopSlug?: string | null
  anchorId?: string
  prefillRequest?: {
    requestId: number
    itemId: number
    shopSlug: string
    workspaceMode: 'catalog' | 'custom'
    contactName?: string
    contactPhone?: string
    contactEmail?: string
    notes?: string
    customProductTitle?: string
    customProductSpec?: string
    quantity?: number | null
    widthMm?: number | null
    heightMm?: number | null
    turnaroundDays?: number | null
    productId?: number | null
    paperId?: number | null
    machineId?: number | null
    colorMode?: 'BW' | 'COLOR'
    sides?: 'SIMPLEX' | 'DUPLEX'
    finishings?: Array<{ finishing_rate_id: number; selected_side: 'front' | 'back' | 'both' }>
  } | null
}>(), {
  eyebrow: 'Quote Calculator',
  mode: 'client',
  fixedShopSlug: null,
  anchorId: 'quote-calculator',
  prefillRequest: null,
})

const emit = defineEmits<{
  draftSaved: [draft: QuoteDraft]
  draftSent: [requests: QuoteRequest[]]
}>()

const authStore = useAuthStore()
const activityBadgesStore = useActivityBadgesStore()
const shopStore = useShopStore()
const calculatorStore = useCalculatorStore()
const machineStore = useMachineStore()
const quoteDraftStore = useQuoteDraftStore()
const quoteInboxStore = useQuoteInboxStore()
const api = useApi()
const { saveAndSend } = useQuoteRequestBlast()
const { trackQuoteSubmit } = useAnalyticsTracking()
const { scrollToFirstInvalid } = useAnchoredForm()
const toast = useToast()
const formRef = ref<HTMLElement | null>(null)
const quotePdfTargetRef = ref<HTMLElement | null>(null)

const contactName = ref('')
const contactPhone = ref('')
const contactEmail = ref('')
const notes = ref('')
const workspaceMode = ref<'catalog' | 'custom'>(props.mode === 'shop' ? 'catalog' : 'custom')
const customProductTitle = ref('')
const customProductSpec = ref('')
const customSizeMode = ref<'standard' | 'custom'>('custom')
const customSizeLabel = ref('')
const customInputUnit = ref<'mm' | 'cm' | 'in'>('mm')
const customWidthInput = ref('')
const customHeightInput = ref('')
const customWidthMm = ref<number | null>(null)
const customHeightMm = ref<number | null>(null)
const turnaroundDays = ref<number | null>(null)
const selectedShopSlug = ref<string | null>(props.fixedShopSlug ?? null)
const selectedSendShopSlugs = ref<string[]>([])
const selectedProductId = ref<number | null>(null)
const selectedPaperId = ref<number | null>(null)
const selectedMachineId = ref<number | null>(null)
const quantity = ref<number | null>(100)
const colorMode = ref<'BW' | 'COLOR'>('COLOR')
const sides = ref<'SIMPLEX' | 'DUPLEX'>('SIMPLEX')
const duplexSurchargePreference = ref<'auto' | 'on' | 'off'>('auto')
const selectedFinishings = ref<Array<{ finishing_rate_id: number; selected_side: 'front' | 'back' | 'both' }>>([])
const sendingRequest = ref(false)
const lastSentSummary = ref<{ shopCount: number; requestIds: number[] } | null>(null)
const sendError = ref('')
const customItemHasArtwork = ref(false)
const customItemSaving = ref(false)
const customItemError = ref('')
const customItemSuccess = ref('')
const editingCustomItemId = ref<number | null>(null)
const referenceImageInputRef = ref<HTMLInputElement | null>(null)
const referenceImageFile = ref<File | null>(null)
const referenceImagePreviewUrl = ref('')
const removeExistingReferenceImage = ref(false)

const availableShops = ref<Array<{ id: number; slug: string; name: string }>>([])
const shopOptions = ref<Array<{ label: string; value: string }>>([])
const productOptions = ref<Array<{ label: string; value: number }>>([])
const paperOptions = ref<Array<{ label: string; value: number }>>([])
const paperDetails = ref<CalculatorPaperRecord[]>([])
const machineOptions = ref<Array<{ label: string; value: number }>>([])
const finishingOptions = ref<CalculatorFinishingOption[]>([])
const activeShopId = ref<number | null>(null)
const selectedSheetSize = ref<string | null>(null)
const selectedPaperType = ref<string | null>(null)
const selectedPaperGsm = ref<number | null>(null)
const activeShopProfile = ref<{ name: string; business_email?: string | null; phone_number?: string | null }>({
  name: '',
  business_email: null,
  phone_number: null,
})

const allowShopSelection = computed(() => !props.fixedShopSlug)
const compactMode = computed(() => props.mode === 'hero')
const supportsStandaloneCustomPricing = computed(() => props.mode === 'shop')
const showQuoteModeToggle = computed(() => props.mode === 'shop')
const showClientFields = computed(() => props.mode !== 'hero')
const showPreviewShopField = computed(() => props.mode === 'shop')
const quoteModeOptions = [
  { label: 'Catalog product', value: 'catalog' },
  { label: 'Custom product', value: 'custom' },
]
const sidesOptions = [
  { label: 'Front only', value: 'SIMPLEX' },
  { label: 'Both sides', value: 'DUPLEX' },
]
const duplexSurchargeOptions = [
  { label: 'Auto', value: 'auto' },
  { label: 'Apply surcharge', value: 'on' },
  { label: 'No surcharge', value: 'off' },
]
const colorModeOptions = [
  { label: 'Black and white', value: 'BW' },
  { label: 'Full colour', value: 'COLOR' },
]
const sizeModeOptions = [
  { label: 'Standard size', value: 'standard' },
  { label: 'Custom size', value: 'custom' },
]
const sizePresetOptions = sizePresets.map((preset) => ({ label: preset.label, value: preset.label }))
const defaultSizePreset = sizePresets[0]!
const sizeUnitOptions = [
  { label: 'mm', value: 'mm' },
  { label: 'cm', value: 'cm' },
  { label: 'inches', value: 'in' },
]
const sheetSizeOptions = computed(() =>
  buildCalculatorPaperCatalog(paperDetails.value).sheetSizes
)
const paperTypeOptions = computed(() => filterCalculatorPaperTypes(paperDetails.value, selectedSheetSize.value))
const paperGsmOptions = computed(() => filterCalculatorPaperGsms(paperDetails.value, {
  sheetSize: selectedSheetSize.value,
  paperType: selectedPaperType.value,
}))

const laminationSides = [
  { label: 'Front only', value: 'front' },
  { label: 'Back only', value: 'back' },
  { label: 'Both sides', value: 'both' },
]

const legacySelectUi = calculatorSelectUi
const calculatorInputUi = {
  base: 'w-full px-4 text-sm',
}
const calculatorTextareaUi = {
  base: 'w-full px-4 py-2 text-sm min-h-[7rem]',
}
const lightInputUi = {
  base: 'w-full rounded-md border border-slate-200 bg-white px-4 py-2 text-sm text-slate-900 shadow-none focus:border-flamingo-500 focus:ring-2 focus:ring-flamingo-500/12',
}
const appliedPrefillKey = ref<string | null>(null)

watch(selectedShopSlug, async (slug) => {
  if (!slug) return
  await loadShopResources(slug)
}, { immediate: true })

watch(selectedProductId, async (productId) => {
  if (!productId) return
  if (workspaceMode.value !== 'catalog' && supportsStandaloneCustomPricing.value) return
  await loadProductOptions(productId)
}, { immediate: true })

watch(selectedSheetSize, (sheetSize) => {
  if (!sheetSize) return
  const matchingPapers = paperDetails.value.filter((paper) => paper.sheetSize === sheetSize)
  paperOptions.value = matchingPapers.map(({ label, id }) => ({ label, value: id }))
  if (!matchingPapers.some((paper) => paper.paperType === selectedPaperType.value)) {
    selectedPaperType.value = matchingPapers[0]?.paperType ?? null
  }
  if (!matchingPapers.some((paper) => paper.gsm === selectedPaperGsm.value && paper.paperType === selectedPaperType.value)) {
    selectedPaperGsm.value = matchingPapers.find((paper) => !selectedPaperType.value || paper.paperType === selectedPaperType.value)?.gsm ?? matchingPapers[0]?.gsm ?? null
  }
  if (!matchingPapers.some((paper) => paper.id === selectedPaperId.value)) {
    selectedPaperId.value = matchingPapers[0]?.id ?? null
  }
})

watch(selectedPaperType, (paperType) => {
  const match = findCalculatorPaperRecord(paperDetails.value, {
    sheetSize: selectedSheetSize.value,
    paperType,
    gsm: selectedPaperGsm.value,
  })
  if (!match) return
  selectedPaperType.value = match.paperType
  selectedPaperGsm.value = match.gsm
  selectedPaperId.value = match.id
})

watch(selectedPaperGsm, (gsm) => {
  const match = findCalculatorPaperRecord(paperDetails.value, {
    sheetSize: selectedSheetSize.value,
    paperType: selectedPaperType.value,
    gsm,
  })
  if (!match) return
  selectedPaperType.value = match.paperType
  selectedPaperGsm.value = match.gsm
  selectedPaperId.value = match.id
})

watch(selectedPaperId, (paperId) => {
  if (!paperId) return
  const match = paperDetails.value.find((paper) => paper.id === paperId)
  if (match?.sheetSize) {
    selectedSheetSize.value = match.sheetSize
  }
  selectedPaperType.value = match?.paperType ?? selectedPaperType.value
  selectedPaperGsm.value = match?.gsm ?? selectedPaperGsm.value
})

function syncCustomSizeInputsFromCanonical() {
  customWidthInput.value = convertMmToDisplay(customWidthMm.value, customInputUnit.value)
  customHeightInput.value = convertMmToDisplay(customHeightMm.value, customInputUnit.value)
}

function setCustomCanonicalSize(width: number | null, height: number | null, preferPreset = true) {
  customWidthMm.value = normalizeNumberValue(width)
  customHeightMm.value = normalizeNumberValue(height)
  if (preferPreset) {
    const inferredPreset = inferSizePresetLabel(customWidthMm.value, customHeightMm.value)
    if (inferredPreset) {
      customSizeMode.value = 'standard'
      customSizeLabel.value = inferredPreset
    }
  }
  syncCustomSizeInputsFromCanonical()
}

function applyCustomPreset() {
  const preset = getSizePreset(customSizeLabel.value) ?? defaultSizePreset
  customSizeLabel.value = preset.label
  customWidthMm.value = preset.widthMm
  customHeightMm.value = preset.heightMm
  syncCustomSizeInputsFromCanonical()
}

function handleCustomSizeModeChange(value: unknown) {
  customSizeMode.value = normalizeSelectValue<'standard' | 'custom'>(value) ?? 'custom'
  if (customSizeMode.value === 'standard') {
    customSizeLabel.value = customSizeLabel.value || inferSizePresetLabel(customWidthMm.value, customHeightMm.value) || defaultSizePreset.label
    applyCustomPreset()
    return
  }
  syncCustomSizeInputsFromCanonical()
}

function handleCustomSizePresetChange(value: unknown) {
  customSizeLabel.value = String(normalizeSelectValue(value) ?? defaultSizePreset.label)
  applyCustomPreset()
}

function handleCustomInputUnitChange(value: unknown) {
  customInputUnit.value = normalizeSelectValue<'mm' | 'cm' | 'in'>(value) ?? 'mm'
  syncCustomSizeInputsFromCanonical()
}

function handleCustomWidthInputChange(value: unknown) {
  customWidthInput.value = value == null ? '' : String(value)
  customWidthMm.value = convertInputToMm(customWidthInput.value, customInputUnit.value)
}

function handleCustomHeightInputChange(value: unknown) {
  customHeightInput.value = value == null ? '' : String(value)
  customHeightMm.value = convertInputToMm(customHeightInput.value, customInputUnit.value)
}

watch(sides, (value) => {
  if (value !== 'DUPLEX') duplexSurchargePreference.value = 'auto'
})

onMounted(async () => {
  await loadShops()
  if (props.mode === 'shop' && props.fixedShopSlug) {
    await quoteDraftStore.loadDraftForContext(props.fixedShopSlug)
  }
})

watch(
  () => props.prefillRequest,
  async (prefill) => {
    if (!prefill) return
    const key = `${prefill.requestId}:${prefill.itemId}`
    if (appliedPrefillKey.value === key) return

    selectedShopSlug.value = prefill.shopSlug || selectedShopSlug.value
    if (selectedShopSlug.value) {
      await loadShopResources(selectedShopSlug.value)
    }

    workspaceMode.value = prefill.workspaceMode
    contactName.value = prefill.contactName || ''
    contactPhone.value = prefill.contactPhone || ''
    contactEmail.value = prefill.contactEmail || ''
    notes.value = prefill.notes || ''
    customProductTitle.value = prefill.customProductTitle || ''
    customProductSpec.value = prefill.customProductSpec || ''
    quantity.value = normalizeNumberValue(prefill.quantity) ?? quantity.value
    setCustomCanonicalSize(normalizeNumberValue(prefill.widthMm), normalizeNumberValue(prefill.heightMm))
    turnaroundDays.value = normalizeNumberValue(prefill.turnaroundDays) ?? turnaroundDays.value ?? 6
    selectedFinishings.value = prefill.finishings ? [...prefill.finishings] : []
    colorMode.value = prefill.colorMode === 'BW' ? 'BW' : 'COLOR'
    sides.value = prefill.sides === 'DUPLEX' ? 'DUPLEX' : 'SIMPLEX'

    if (prefill.workspaceMode === 'catalog') {
      selectedProductId.value = prefill.productId ?? null
      if (selectedProductId.value) {
        await loadProductOptions(selectedProductId.value)
      }
    } else if (selectedShopSlug.value && supportsStandaloneCustomPricing.value) {
      await loadCustomOptions(selectedShopSlug.value)
      selectedProductId.value = null
    }

    selectedPaperId.value = prefill.paperId ?? selectedPaperId.value
    selectedMachineId.value = prefill.machineId ?? selectedMachineId.value
    appliedPrefillKey.value = key

    await nextTick()
    if (validateForm()) {
      await previewQuote(true)
    }
  },
  { immediate: true },
)

watch(
  () => props.fixedShopSlug,
  async (shopSlug) => {
    if (props.mode !== 'shop' || !shopSlug) return
    await quoteDraftStore.loadDraftForContext(shopSlug)
  },
)

let previewTimer: ReturnType<typeof setTimeout> | null = null

watch(workspaceMode, (mode) => {
  if (mode === 'catalog') {
    resetCustomBuilder()
    if (selectedProductId.value) {
      void loadProductOptions(selectedProductId.value)
    }
    calculatorStore.resetPreview()
    return
  }

  clearCustomItemStatus()
  if (supportsStandaloneCustomPricing.value && selectedShopSlug.value) {
    void loadCustomOptions(selectedShopSlug.value)
  } else if (selectedProductId.value) {
    void loadProductOptions(selectedProductId.value)
  }
  calculatorStore.resetPreview()
})

onUnmounted(() => {
  if (previewTimer) clearTimeout(previewTimer)
  if (referenceImagePreviewUrl.value) {
    URL.revokeObjectURL(referenceImagePreviewUrl.value)
  }
})

watch(
  () => [
    activeShopId.value,
    selectedShopSlug.value,
    JSON.stringify(selectedSendShopSlugs.value),
    selectedProductId.value,
    selectedSheetSize.value,
    selectedPaperId.value,
    selectedMachineId.value,
    quantity.value,
    sides.value,
    colorMode.value,
    workspaceMode.value,
    customWidthMm.value,
    customHeightMm.value,
    turnaroundDays.value,
    contactName.value,
    contactPhone.value,
    contactEmail.value,
    notes.value,
    customProductTitle.value,
    customProductSpec.value,
    JSON.stringify(selectedFinishings.value),
  ],
  () => {
    clearSendState()
    if (previewTimer) clearTimeout(previewTimer)
    if (!validateForm()) {
      calculatorStore.resetPreview()
      return
    }
    previewTimer = setTimeout(() => {
      void previewQuote(true)
    }, 250)
  },
)

function clearSendState() {
  lastSentSummary.value = null
  sendError.value = ''
}

async function loadShops() {
  const { $publicApi } = useNuxtApp()
  if (props.fixedShopSlug) {
    shopOptions.value = [{ label: props.fixedShopSlug, value: props.fixedShopSlug }]
    selectedShopSlug.value = props.fixedShopSlug
    return
  }
  const response = await $publicApi<Array<{ id: number; slug: string; name: string }> | { results?: Array<{ id: number; slug: string; name: string }> }>(API.publicShops())
  const shops = Array.isArray(response) ? response : (response?.results ?? [])
  availableShops.value = shops
  shopOptions.value = shops.map((shop) => ({ label: shop.name, value: shop.slug }))
  if (!selectedShopSlug.value) {
    selectedShopSlug.value = shopStore.selectedShopSlug ?? shopOptions.value[0]?.value ?? null
  }
  if (!selectedSendShopSlugs.value.length && selectedShopSlug.value) {
    selectedSendShopSlugs.value = [selectedShopSlug.value]
  }
}

async function loadShopResources(shopSlug: string) {
  const { $publicApi } = useNuxtApp()
  const catalogResponse = await $publicApi<{ shop: { id: number; slug: string; name: string }; products: Array<{ id: number; name: string }> }>(
    API.publicShopCatalog(shopSlug),
  )
  activeShopId.value = catalogResponse.shop.id
  activeShopProfile.value = {
    name: shopStore.currentShop?.slug === shopSlug ? shopStore.currentShop.name : catalogResponse.shop.name,
    business_email: shopStore.currentShop?.slug === shopSlug ? shopStore.currentShop.business_email : null,
    phone_number: shopStore.currentShop?.slug === shopSlug ? shopStore.currentShop.phone_number : null,
  }
  try {
    const profile = await $publicApi<Record<string, unknown>>(API.publicShopBySlug(shopSlug))
    activeShopProfile.value = {
      name: String(profile.name ?? activeShopProfile.value.name ?? catalogResponse.shop.name),
      business_email: typeof profile.business_email === 'string' ? profile.business_email : activeShopProfile.value.business_email,
      phone_number: typeof profile.phone_number === 'string' ? profile.phone_number : activeShopProfile.value.phone_number,
    }
  } catch {
    // Keep fallback shop metadata from the catalog response or current shop store.
  }
  const existingShopIndex = shopOptions.value.findIndex((shop) => shop.value === shopSlug)
  if (existingShopIndex >= 0) {
    shopOptions.value[existingShopIndex] = { label: catalogResponse.shop.name, value: shopSlug }
  } else {
    shopOptions.value = [...shopOptions.value, { label: catalogResponse.shop.name, value: shopSlug }]
  }
  productOptions.value = catalogResponse.products.map((product) => ({ label: product.name, value: product.id }))
  workspaceMode.value = 'custom'
  selectedProductId.value = null
  await loadCustomOptions(shopSlug)
  if ((props.mode === 'client' || props.mode === 'hero') && !selectedSendShopSlugs.value.includes(shopSlug)) {
    selectedSendShopSlugs.value = [...selectedSendShopSlugs.value, shopSlug]
  }
}

async function loadCustomOptions(shopSlug: string) {
  const { $publicApiNoAuth } = useNuxtApp()
  const detail = await $publicApiNoAuth<Record<string, unknown>>(API.publicShopCustomOptions(shopSlug))
  const availablePapers = Array.isArray(detail.available_papers) ? detail.available_papers as Array<Record<string, unknown>> : []
  paperDetails.value = buildCalculatorPaperCatalog(availablePapers as never[]).records
  const availableSheetSizes = Array.from(new Set(paperDetails.value.map((paper) => paper.sheetSize).filter(Boolean)))
  if (!selectedSheetSize.value || !availableSheetSizes.includes(selectedSheetSize.value)) {
    selectedSheetSize.value = availableSheetSizes[0] ?? null
  }
  const matchingPapers = paperDetails.value.filter((paper) =>
    selectedSheetSize.value ? paper.sheetSize === selectedSheetSize.value : true,
  )
  paperOptions.value = matchingPapers.map(({ label, id }) => ({ label, value: id }))
  finishingOptions.value = Array.isArray(detail.available_finishings) ? detail.available_finishings as CalculatorFinishingOption[] : []
  if (!paperOptions.value.some((paper) => paper.value === selectedPaperId.value)) {
    selectedPaperId.value = paperOptions.value[0]?.value ?? null
  }
  const selectedPaper = paperDetails.value.find((paper) => paper.id === selectedPaperId.value) ?? matchingPapers[0] ?? null
  selectedPaperType.value = selectedPaper?.paperType ?? null
  selectedPaperGsm.value = selectedPaper?.gsm ?? null

  if (props.mode === 'shop') {
    try {
      const machines = await machineStore.fetchMachines(shopSlug)
      machineOptions.value = machines
        .filter(machine => machine.is_active !== false)
        .map(machine => ({ label: machine.name, value: machine.id }))
    } catch {
      machineOptions.value = []
    }
  }

  if (!machineOptions.value.some((machine) => machine.value === selectedMachineId.value)) {
    selectedMachineId.value = machineOptions.value[0]?.value ?? null
  }
}

async function loadProductOptions(productId: number) {
  const { $publicApiNoAuth } = useNuxtApp()
  const detail = await $publicApiNoAuth<Record<string, unknown>>(API.publicProductOptions(productId))
  const availablePapers = Array.isArray(detail.available_papers) ? detail.available_papers as Array<Record<string, unknown>> : []
  const availableMachines = Array.isArray(detail.available_machines) ? detail.available_machines as Array<Record<string, unknown>> : []
  const availableFinishings = Array.isArray(detail.available_finishings) ? detail.available_finishings as CalculatorFinishingOption[] : []
  paperDetails.value = buildCalculatorPaperCatalog(availablePapers as never[]).records
  machineOptions.value = availableMachines.map((machine: Record<string, unknown>) => ({
    label: String(machine.name),
    value: Number(machine.id),
  }))
  const availableSheetSizes = Array.from(new Set(paperDetails.value.map((paper) => paper.sheetSize).filter(Boolean)))
  if (!selectedSheetSize.value || !availableSheetSizes.includes(selectedSheetSize.value)) {
    selectedSheetSize.value = availableSheetSizes[0] ?? null
  }
  const matchingPapers = paperDetails.value.filter((paper) =>
    selectedSheetSize.value ? paper.sheetSize === selectedSheetSize.value : true,
  )
  paperOptions.value = matchingPapers.map(({ label, id }) => ({ label, value: id }))
  finishingOptions.value = availableFinishings
  if (!paperOptions.value.some((paper) => paper.value === selectedPaperId.value)) {
    selectedPaperId.value = paperOptions.value[0]?.value ?? null
  }
  const selectedPaper = paperDetails.value.find((paper) => paper.id === selectedPaperId.value) ?? matchingPapers[0] ?? null
  selectedPaperType.value = selectedPaper?.paperType ?? null
  selectedPaperGsm.value = selectedPaper?.gsm ?? null
  selectedMachineId.value = selectedMachineId.value ?? Number(detail.default_machine ?? machineOptions.value[0]?.value ?? null)
  colorMode.value = detail.default_color_mode === 'BW' ? 'BW' : 'COLOR'
  sides.value = detail.default_sides === 'DUPLEX' ? 'DUPLEX' : 'SIMPLEX'
  if (!customWidthMm.value || !customHeightMm.value) {
    setCustomCanonicalSize(
      customWidthMm.value ?? normalizeNumberValue(detail.default_finished_width_mm) ?? null,
      customHeightMm.value ?? normalizeNumberValue(detail.default_finished_height_mm) ?? null,
    )
  }
  const legacyTurnaroundDays = normalizeNumberValue(detail.turnaround_days)
  turnaroundDays.value = turnaroundDays.value ?? normalizeNumberValue(detail.turnaround_hours) ?? (legacyTurnaroundDays ? legacyTurnaroundDays * 8 : null)
}
function toggleFinishing(finishing: Record<string, unknown>) {
  const finishingId = Number(finishing.id)
  const existing = selectedFinishings.value.find((entry) => entry.finishing_rate_id === finishingId)
  if (existing) {
    selectedFinishings.value = selectedFinishings.value.filter((entry) => entry.finishing_rate_id !== finishingId)
    return
  }
  selectedFinishings.value = [
    ...selectedFinishings.value,
    { finishing_rate_id: finishingId, selected_side: 'both' },
  ]
}

function updateWorkspaceMode(value: string) {
  workspaceMode.value = value === 'custom' ? 'custom' : 'catalog'
}

function toggleSendShop(shopSlug: string, checked: boolean) {
  if (checked) {
    selectedSendShopSlugs.value = Array.from(new Set([...selectedSendShopSlugs.value, shopSlug]))
    selectedShopSlug.value = selectedSendShopSlugs.value[0] ?? shopSlug
    return
  }

  selectedSendShopSlugs.value = selectedSendShopSlugs.value.filter((slug) => slug !== shopSlug)
  selectedShopSlug.value = selectedSendShopSlugs.value[0] ?? selectedShopSlug.value
}

function updateFinishingSide(finishingId: number, value: unknown) {
  const normalized = normalizeSelectValue<'front' | 'back' | 'both'>(value) ?? 'both'
  selectedFinishings.value = selectedFinishings.value.map((entry) =>
    entry.finishing_rate_id === finishingId ? { ...entry, selected_side: normalized } : entry,
  )
}

function selectedFinishingSide(finishingId: number) {
  return selectedFinishings.value.find((entry) => entry.finishing_rate_id === finishingId)?.selected_side ?? 'both'
}

function isFinishingSelected(finishingId: number) {
  return selectedFinishings.value.some((entry) => entry.finishing_rate_id === finishingId)
}

function isFinishingSideOpen(finishingId: number) {
  const option = finishingOptions.value.find((item) => Number(item.id) === finishingId)
  return Boolean(option && isFinishingSelected(finishingId) && isLamination(option))
}

function isLamination(finishing: Record<string, unknown>) {
  const name = `${(finishing.slug as string) || ''} ${(finishing.name as string) || ''}`.toLowerCase()
  return name.includes('lamination') || (
    finishing.billing_basis === 'per_sheet'
    && finishing.side_mode === 'per_selected_side'
  )
}

function _finishingRuleLabel(finishing: Record<string, unknown>) {
  if (isLamination(finishing)) {
    return 'Per sheet'
  }

  const billingBasis = normalizeBillingBasis(finishing.billing_basis)
  if (billingBasis) {
    return billingBasisLabel(billingBasis)
  }

  return (finishing.display_unit_label as string) || (finishing.charge_unit as string) || 'Backend rule'
}

function _finishingHelpText(finishing: Record<string, unknown>) {
  if (isLamination(finishing)) {
    return 'Charged on production sheets. One side uses the base rate, while both sides use 2x or the both-side rate if set.'
  }

  return (finishing.help_text as string) || (finishing.display_unit_label as string) || basisHelpText(finishing.billing_basis) || ''
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

function basisHelpText(billingBasis: unknown) {
  switch (normalizeBillingBasis(billingBasis)) {
    case 'per_sheet':
      return 'Charged against the backend sheet quantity.'
    case 'per_piece':
      return 'Charged against the backend piece quantity.'
    case 'flat_per_job':
      return 'One backend flat charge for the whole job.'
    case 'flat_per_group':
      return 'One backend flat charge for the grouped request.'
    case 'flat_per_line':
      return 'One backend flat charge for this line item.'
    default:
      return ''
  }
}

const activeDraftItems = computed(() => quoteDraftStore.activeDraft?.items ?? [])
const activeCustomDraftItems = computed(() => activeDraftItems.value.filter(item => item.item_type === 'CUSTOM'))
const activeDraftItemCount = computed(() => activeCustomDraftItems.value.length)
const editingCustomItem = computed(() => activeDraftItems.value.find(item => item.id === editingCustomItemId.value) ?? null)
const existingReferenceImage = computed(() => editingCustomItem.value?.attachments?.[0] ?? null)
const selectedReferenceImageUrl = computed(() => referenceImagePreviewUrl.value || existingReferenceImage.value?.file || '')
const customItemActionLabel = computed(() => editingCustomItemId.value ? 'Update product' : '+ Add product')
const customItemActionDescription = computed(() => {
  if (canShowFinalPricing.value && hasBackendTotal.value) {
    return 'Exact price available when required production details are selected.'
  }
  return 'Saved as custom quote request for manual pricing when exact production details are still pending.'
})

function resetReferenceImageSelection() {
  if (referenceImagePreviewUrl.value) {
    URL.revokeObjectURL(referenceImagePreviewUrl.value)
  }
  referenceImagePreviewUrl.value = ''
  referenceImageFile.value = null
  if (referenceImageInputRef.value) referenceImageInputRef.value.value = ''
}

function clearCustomItemStatus() {
  customItemError.value = ''
  customItemSuccess.value = ''
}

function onReferenceImageSelected(event: Event) {
  const input = event.target as HTMLInputElement | null
  const file = input?.files?.[0] ?? null
  resetReferenceImageSelection()
  removeExistingReferenceImage.value = false
  if (!file) return
  referenceImageFile.value = file
  referenceImagePreviewUrl.value = URL.createObjectURL(file)
  customItemHasArtwork.value = true
  clearCustomItemStatus()
}

function removeReferenceImage() {
  resetReferenceImageSelection()
  if (existingReferenceImage.value) removeExistingReferenceImage.value = true
}

function resetCustomBuilder(keepSharedFields = true) {
  editingCustomItemId.value = null
  customProductTitle.value = ''
  customProductSpec.value = ''
  customItemHasArtwork.value = false
  resetReferenceImageSelection()
  removeExistingReferenceImage.value = false
  if (!keepSharedFields) {
    quantity.value = 100
    customSizeMode.value = 'custom'
    customSizeLabel.value = ''
    customInputUnit.value = 'mm'
    customWidthInput.value = ''
    customHeightInput.value = ''
    customWidthMm.value = null
    customHeightMm.value = null
    selectedPaperId.value = null
    selectedMachineId.value = null
    selectedFinishings.value = []
    sides.value = 'SIMPLEX'
    colorMode.value = 'COLOR'
    turnaroundDays.value = null
    notes.value = ''
  }
}

function loadCustomDraftItem(item: QuoteItem) {
  editingCustomItemId.value = item.id
  workspaceMode.value = 'custom'
  customProductTitle.value = item.title || item.product_name || ''
  customProductSpec.value = item.spec_text || ''
  quantity.value = normalizeNumberValue(item.quantity) ?? 1
  selectedPaperId.value = item.paper ?? null
  selectedMachineId.value = item.machine ?? null
  colorMode.value = item.color_mode === 'BW' ? 'BW' : 'COLOR'
  sides.value = item.sides === 'DUPLEX' ? 'DUPLEX' : 'SIMPLEX'
  notes.value = item.special_instructions || ''
  customItemHasArtwork.value = Boolean(item.has_artwork || item.attachments?.length)
  selectedFinishings.value = (item.finishings ?? []).map(finishing => ({
    finishing_rate_id: finishing.finishing_rate,
    selected_side: finishing.selected_side ?? 'both',
  }))
  const width = normalizeNumberValue(item.chosen_width_mm)
  const height = normalizeNumberValue(item.chosen_height_mm)
  if (width && height) {
    setCustomCanonicalSize(width, height)
  } else {
    customSizeMode.value = 'custom'
    customWidthInput.value = ''
    customHeightInput.value = ''
    customWidthMm.value = null
    customHeightMm.value = null
  }
  resetReferenceImageSelection()
  removeExistingReferenceImage.value = false
  clearCustomItemStatus()
}

function formatDraftItemSize(item: QuoteItem) {
  if (item.chosen_width_mm && item.chosen_height_mm) {
    return `${item.chosen_width_mm} x ${item.chosen_height_mm} mm`
  }
  return item.pricing_mode === 'LARGE_FORMAT' ? 'Size pending' : 'Custom size'
}

function formatDraftItemAmount(item: QuoteItem) {
  if (item.line_total) return formatMoney(item.line_total)
  return item.needs_review ? 'Manual pricing' : 'Pending'
}

function buildCustomItemPayload(): AddCustomItemPayload {
  return {
    item_type: 'CUSTOM',
    title: normalizeOptionalText(customProductTitle.value) || 'Custom product',
    spec_text: normalizeOptionalText(customProductSpec.value) || '',
    quantity: normalizeNumberValue(quantity.value) ?? 1,
    pricing_mode: 'SHEET',
    chosen_width_mm: normalizeNumberValue(customWidthMm.value),
    chosen_height_mm: normalizeNumberValue(customHeightMm.value),
    paper: selectedPaperId.value,
    material: null,
    sides: sides.value,
    color_mode: colorMode.value,
    machine: selectedMachineId.value,
    finishings: selectedFinishings.value.map(item => ({
      finishing_rate: item.finishing_rate_id,
      apply_to_sides: item.selected_side === 'both' ? 'BOTH' : 'SINGLE',
      selected_side: item.selected_side,
    })),
    item_spec_snapshot: {
      title: normalizeOptionalText(customProductTitle.value),
      spec_text: normalizeOptionalText(customProductSpec.value),
      size_mode: customSizeMode.value,
      size_label: customSizeLabel.value,
      input_unit: customInputUnit.value,
      width_input: customWidthInput.value,
      height_input: customHeightInput.value,
      width_mm: normalizeNumberValue(customWidthMm.value),
      height_mm: normalizeNumberValue(customHeightMm.value),
      reference_image_name: referenceImageFile.value?.name || existingReferenceImage.value?.name || '',
    },
    has_artwork: customItemHasArtwork.value || Boolean(referenceImageFile.value || existingReferenceImage.value),
    special_instructions: normalizeOptionalText(notes.value) || '',
  }
}

async function syncCustomItemAttachment(draftId: number, itemId: number, existingItem: QuoteItem | null) {
  const existingAttachments = existingItem?.attachments ?? []
  if (removeExistingReferenceImage.value || referenceImageFile.value) {
    for (const attachment of existingAttachments) {
      await removeQuoteItemAttachment(draftId, itemId, attachment.id, api)
    }
  }
  if (referenceImageFile.value) {
    await uploadQuoteItemAttachment(draftId, itemId, referenceImageFile.value, referenceImageFile.value.name, api)
  }
}

async function addOrUpdateCustomDraftItem() {
  if (props.mode !== 'shop' || !props.fixedShopSlug) return
  clearCustomItemStatus()
  customItemSaving.value = true
  try {
    await quoteDraftStore.ensureDraftForShop(props.fixedShopSlug)
    const draft = quoteDraftStore.activeDraft
    if (!draft) throw new Error('Active quotation is not available for this shop.')
    const payload = buildCustomItemPayload()
    let itemId = editingCustomItemId.value
    if (editingCustomItemId.value) {
      await updateItem(draft.id, editingCustomItemId.value, payload, api)
    } else {
      const created = await quoteDraftStore.addCustomToQuote(payload)
      itemId = created?.id ?? null
    }
    if (!itemId) throw new Error('Could not save the custom product.')
    await syncCustomItemAttachment(draft.id, itemId, editingCustomItem.value)
    await quoteDraftStore.refreshDraft()
    customItemSuccess.value = editingCustomItemId.value
      ? 'Custom product updated in the active quotation.'
      : 'Custom product added to the active quotation.'
    resetCustomBuilder()
  } catch (error) {
    customItemError.value = error instanceof Error ? error.message : 'Could not save the custom product.'
  } finally {
    customItemSaving.value = false
  }
}

async function removeCustomDraftItem(itemId: number) {
  clearCustomItemStatus()
  try {
    await quoteDraftStore.removeItemFromDraft(itemId)
    if (editingCustomItemId.value === itemId) {
      resetCustomBuilder()
    }
    customItemSuccess.value = 'Custom product removed from the active quotation.'
  } catch (error) {
    customItemError.value = error instanceof Error ? error.message : 'Could not remove the custom product.'
  }
}

function validateForm() {
  return Boolean(
    activeShopId.value
    && normalizeOptionalText(customProductTitle.value)
    && selectedPaperId.value
    && selectedMachineId.value
    && normalizeNumberValue(quantity.value)
    && normalizeNumberValue(customWidthMm.value)
    && normalizeNumberValue(customHeightMm.value)
    && normalizeNumberValue(turnaroundDays.value),
  )
}

function buildSharedFlatRequest() {
  const request = createSharedCalculatorRequest('flat')
  request.productTitle = normalizeOptionalText(customProductTitle.value) || ''
  request.quantity = normalizeNumberValue(quantity.value) ?? 100
  request.sizeMode = customSizeMode.value
  request.sizeLabel = customSizeLabel.value
  request.inputUnit = customInputUnit.value
  request.widthInput = customWidthInput.value
  request.heightInput = customHeightInput.value
  request.widthMm = normalizeNumberValue(customWidthMm.value)
  request.heightMm = normalizeNumberValue(customHeightMm.value)
  request.turnaroundHours = normalizeNumberValue(turnaroundDays.value)
  request.customBrief = normalizeOptionalText(customProductSpec.value) || ''
  request.flat.printSides = sides.value
  request.flat.colorMode = colorMode.value
  request.flat.paperType = selectedPaperType.value || ''
  request.flat.sheetSize = selectedSheetSize.value || ''
  request.flat.paperGsm = selectedPaperGsm.value
  request.flat.finishings = [...selectedFinishings.value]
  return request
}

async function previewQuote(isLiveUpdate = false) {
  if (!validateForm()) {
    if (!isLiveUpdate) {
      scrollToFirstInvalid(formRef.value)
      toast.add({
        title: 'Incomplete form',
        description: 'Pick a shop basis, paper, machine, quantity, size, and turnaround before previewing.',
        color: 'warning',
      })
    }
    return
  }
  const sharedRequest = buildSharedFlatRequest()
  const flatPayload = toFlatCalculatorPayload(sharedRequest, {
    shop: activeShopId.value,
    paper: selectedPaperId.value,
    machine: selectedMachineId.value,
    applyDuplexSurcharge: duplexSurchargeOverride.value,
  })
  calculatorStore.setContext({
    shopId: activeShopId.value,
    shopSlug: selectedShopSlug.value,
    productId: workspaceMode.value === 'custom' && supportsStandaloneCustomPricing.value ? null : selectedProductId.value,
    quantity: flatPayload.quantity,
    sizeMode: flatPayload.size_mode,
    sizeLabel: flatPayload.size_label,
    inputUnit: flatPayload.input_unit as 'mm' | 'cm' | 'in',
    widthInput: flatPayload.width_input,
    heightInput: flatPayload.height_input,
    widthMm: flatPayload.width_mm,
    heightMm: flatPayload.height_mm,
    turnaroundDays: sharedRequest.turnaroundHours,
    paperId: flatPayload.paper,
    machineId: flatPayload.machine,
    colorMode: flatPayload.color_mode,
    sides: flatPayload.sides,
    applyDuplexSurcharge: flatPayload.apply_duplex_surcharge,
    finishings: flatPayload.finishings,
  })
  try {
    await calculatorStore.fetchPreview()
  } catch (error) {
    if (!isLiveUpdate) {
      toast.add({ title: 'Preview failed', description: error instanceof Error ? error.message : 'Preview failed.', color: 'error' })
    }
  }
}

async function saveDraft() {
  if (!calculatorStore.preview) return
  if (!authStore.isAuthenticated) {
    await navigateTo({ path: '/auth/login', query: { redirect: '/quote-draft' } })
    return
  }
  if (!authStore.isClient) {
    toast.add({ title: 'Preview only', description: 'This backend draft flow is currently client-only.', color: 'warning' })
    return
  }
  const sharedRequest = buildSharedFlatRequest()
  const calculatorSnapshot = toFlatCalculatorSnapshot(sharedRequest, {
    paper: selectedPaperId.value,
    machine: selectedMachineId.value,
    applyDuplexSurcharge: duplexSurchargeOverride.value,
  })
  const draft = await quoteInboxStore.saveDraft({
    title: sharedRequest.productTitle || 'Saved draft',
    shop: activeShopId.value,
    selected_product: null,
    calculator_inputs_snapshot: calculatorSnapshot,
    pricing_snapshot: calculatorStore.preview,
    custom_product_snapshot: {
      title: sharedRequest.productTitle,
      spec_text: sharedRequest.customBrief,
      size_mode: sharedRequest.sizeMode,
      size_label: sharedRequest.sizeLabel,
      input_unit: sharedRequest.inputUnit,
      width_input: sharedRequest.widthInput,
      height_input: sharedRequest.heightInput,
      width_mm: sharedRequest.widthMm,
      height_mm: sharedRequest.heightMm,
    },
    request_details_snapshot: {
      customer_name: normalizeOptionalText(contactName.value),
      customer_phone: normalizeOptionalText(contactPhone.value),
      notes: normalizeOptionalText(notes.value),
    },
  })
  emit('draftSaved', draft)
  toast.add({ title: 'Saved to workspace', description: 'The backend saved this request in your requests and quotes workspace.', color: 'success' })
}

async function sendDraft() {
  if (!calculatorStore.preview) return
  clearSendState()
  if (!authStore.isAuthenticated) {
    await navigateTo({ path: '/auth/login', query: { redirect: '/quote-draft' } })
    return
  }
  if (!authStore.isClient) {
    toast.add({ title: 'Preview only', description: 'Sending backend drafts is currently client-only.', color: 'warning' })
    return
  }
  const selectedShopSlugs = shopOptions.value
    .filter((shop) => selectedSendShopSlugs.value.includes(shop.value))
    .map((shop) => shop.value)
  const selectedShops = selectedShopSlugs.length
    ? selectedShopSlugs.map((slug) => resolveShopIdFromSlug(slug)).filter((value): value is number => typeof value === 'number')
    : (activeShopId.value ? [activeShopId.value] : [])
  if (sendingRequest.value) return

  sendingRequest.value = true
  try {
    const sharedRequest = buildSharedFlatRequest()
    const calculatorSnapshot = {
      ...toFlatCalculatorSnapshot(sharedRequest, {
        paper: selectedPaperId.value,
        machine: selectedMachineId.value,
        applyDuplexSurcharge: duplexSurchargeOverride.value,
      }),
      selected_shop_slugs: selectedShopSlugs,
    }
    const requests = await saveAndSend({
      title: sharedRequest.productTitle || 'Prepared quote',
      shop: activeShopId.value,
      selectedProduct: null,
      calculatorInputsSnapshot: calculatorSnapshot,
      pricingSnapshot: calculatorStore.preview,
      customProductSnapshot: {
        title: sharedRequest.productTitle,
        spec_text: sharedRequest.customBrief,
        size_mode: sharedRequest.sizeMode,
        size_label: sharedRequest.sizeLabel,
        input_unit: sharedRequest.inputUnit,
        width_input: sharedRequest.widthInput,
        height_input: sharedRequest.heightInput,
        width_mm: sharedRequest.widthMm,
        height_mm: sharedRequest.heightMm,
      },
      requestDetailsSnapshot: {
        customer_name: normalizeOptionalText(contactName.value),
        customer_phone: normalizeOptionalText(contactPhone.value),
        notes: normalizeOptionalText(notes.value),
        selected_shop_ids: selectedShops,
        selected_shop_slugs: selectedShopSlugs,
      },
      selectedShopIds: selectedShops,
      loginRedirectPath: '/quote-draft',
    })

    if (requests?.length) {
      lastSentSummary.value = buildQuoteRequestSendSummary(requests)
      emit('draftSent', requests)
      void trackQuoteSubmit({
        source: props.mode === 'hero' ? 'backend_hero_calculator' : 'backend_client_calculator',
        request_ids: lastSentSummary.value.requestIds,
        shop_count: lastSentSummary.value.shopCount,
        selected_shop_slugs: selectedShopSlugs,
        product_name: workspaceMode.value === 'custom' ? normalizeOptionalText(customProductTitle.value) : selectedProductLabel.value || null,
      })
      await activityBadgesStore.fetchSummary()
      const successToast = getQuoteRequestSendToast(lastSentSummary.value)
      toast.add({ title: successToast.title, description: successToast.description, color: 'success' })
    }
  } catch (error) {
    sendError.value = error instanceof Error ? error.message : 'Could not send this request. Please try again.'
    toast.add({ title: 'Request not sent', description: sendError.value, color: 'error' })
  } finally {
    sendingRequest.value = false
  }
}

async function copyPreview() {
  const text = [
    workspaceMode.value === 'custom' ? `Custom product: ${customProductTitle.value || '-'}` : `Product: ${selectedProductLabel.value || '-'}`,
    `Enquirer: ${contactName.value || '-'}`,
    `Phone: ${contactPhone.value || '-'}`,
    props.mode === 'shop' ? `Email: ${contactEmail.value || '-'}` : null,
    props.mode === 'shop' ? `Size: ${sizeSummary.value}` : null,
    `Colour mode: ${colorModeLabel.value}`,
    props.mode === 'shop' ? `Turnaround: ${turnaroundLabel.value}` : null,
    `Total: ${previewGrandTotal.value || ''}`,
    `Paper: ${calculatorStore.preview?.paper?.label || ''}`,
    `Printing: ${calculatorStore.preview?.printing?.machine_name || ''}`,
    customProductSpec.value ? `Brief: ${customProductSpec.value}` : null,
  ].filter(Boolean).join('\n')
  await navigator.clipboard.writeText(text)
  toast.add({ title: 'Copied', description: 'Preview copied to the clipboard.', color: 'success' })
}

function shareWhatsApp() {
  const total = previewGrandTotal.value || ''
  const lines = [
    'Quote preview',
    `Customer: ${contactName.value || '-'}`,
    `Phone: ${contactPhone.value || '-'}`,
    props.mode === 'shop' ? `Email: ${contactEmail.value || '-'}` : null,
    workspaceMode.value === 'custom' ? `Custom product: ${customProductTitle.value || '-'}` : `Product: ${selectedProductLabel.value || '-'}`,
    props.mode === 'shop' ? `Size: ${sizeSummary.value}` : null,
    `Colour mode: ${colorModeLabel.value}`,
    props.mode === 'shop' ? `Turnaround: ${turnaroundLabel.value}` : null,
    `Total: ${total || '-'}`,
    customProductSpec.value ? `Brief: ${customProductSpec.value}` : null,
  ].filter(Boolean)
  const text = encodeURIComponent(lines.join('\n'))
  window.open(`https://wa.me/?text=${text}`, '_blank', 'noopener')
}

async function printPreview() {
  const target = quotePdfTargetRef.value
  if (!target) {
    toast.add({ title: 'Preview unavailable', description: 'Quote preview is not ready for PDF export.', color: 'warning' })
    return
  }

  const printWindow = window.open('', '_blank', 'width=960,height=1280')
  if (!printWindow) {
    toast.add({ title: 'Popup blocked', description: 'Allow popups to open the printable quote preview.', color: 'warning' })
    return
  }

  const styleMarkup = Array.from(document.querySelectorAll('style, link[rel="stylesheet"]'))
    .map((node) => node.outerHTML)
    .join('\n')

  const printStyles = `
    <style>
      :root {
        color-scheme: light;
      }

      * {
        box-sizing: border-box;
      }

      html, body {
        margin: 0;
        padding: 0;
        background: #f4f4f5;
        color: #111827;
        font-family: Inter, "Segoe UI", Arial, sans-serif;
      }

      body {
        padding: 24px;
      }

      .quote-pdf-page {
        max-width: 820px;
        margin: 0 auto;
      }

      #quote-pdf-target {
        border: 1px solid #d4d4d8 !important;
        border-radius: 24px !important;
        background: #ffffff !important;
        box-shadow: none !important;
        overflow: hidden;
      }

      #quote-pdf-target * {
        color: #111827 !important;
      }

      #quote-pdf-target .quote-preview-top {
        background: linear-gradient(135deg, #111827 0%, #1f2937 100%) !important;
      }

      #quote-pdf-target .quote-preview-top *,
      #quote-pdf-target .quote-preview-top .quote-preview-eyebrow,
      #quote-pdf-target .quote-preview-top .quote-preview-heading {
        color: #ffffff !important;
      }

      #quote-pdf-target .quote-preview-message {
        display: none !important;
      }

      @page {
        size: A4;
        margin: 14mm;
      }

      @media print {
        html, body {
          background: #ffffff !important;
        }

        body {
          padding: 0;
        }

        .quote-pdf-page {
          max-width: none;
          margin: 0;
        }
      }
    </style>
  `

  printWindow.document.open()
  printWindow.document.write(`
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Quote Preview PDF</title>
        ${styleMarkup}
        ${printStyles}
      </head>
      <body>
        <main class="quote-pdf-page">
          ${target.outerHTML}
        </main>
      </body>
    </html>
  `)
  printWindow.document.close()

  await new Promise<void>((resolve) => {
    let settled = false
    const finish = () => {
      if (settled) return
      settled = true
      resolve()
    }
    if (printWindow.document.readyState === 'complete') {
      finish()
      return
    }
    printWindow.addEventListener('load', finish, { once: true })
    window.setTimeout(finish, 800)
  })

  printWindow.focus()
  printWindow.onafterprint = () => {
    printWindow.close()
  }
  printWindow.print()
}

function resolveShopIdFromSlug(shopSlug: string) {
  return availableShops.value.find((shop) => shop.slug === shopSlug)?.id ?? null
}

const selectedSendShopIds = computed(() => {
  const mappedShopIds = selectedSendShopSlugs.value
    .map((slug) => resolveShopIdFromSlug(slug))
    .filter((value): value is number => typeof value === 'number')

  if (mappedShopIds.length) return mappedShopIds
  return activeShopId.value ? [activeShopId.value] : []
})

const selectedProductLabel = computed(() =>
  productOptions.value.find((product) => product.value === selectedProductId.value)?.label ?? ''
)

const selectedPaperLabel = computed(() =>
  paperOptions.value.find((paper) => paper.value === selectedPaperId.value)?.label ?? calculatorStore.preview?.paper?.label ?? ''
)

const selectedShopName = computed(() => {
  if (props.fixedShopSlug && shopStore.currentShop?.slug === props.fixedShopSlug) {
    return shopStore.currentShop.name
  }

  const option = shopOptions.value.find((shop) => shop.value === selectedShopSlug.value)
  return option?.label || selectedShopSlug.value || 'Shop'
})

const sendActionLabel = computed(() => {
  const sharedLabel = getQuoteRequestSendLabel(lastSentSummary.value, sendingRequest.value)
  if (sharedLabel) return sharedLabel
  if (!authStore.isAuthenticated) return 'Sign in to send request'
  return selectedSendShopIds.value.length > 1 ? 'Send request to selected shops' : 'Send request to shop'
})

const sendFeedbackTone = computed<'success' | 'error'>(() => lastSentSummary.value ? 'success' : 'error')
const sendFeedback = computed(() => {
  const sharedFeedback = getQuoteRequestSendFeedback(lastSentSummary.value)
  if (sharedFeedback) return sharedFeedback
  return sendError.value
})

const effectiveTitle = computed(() => (
  props.mode === 'shop' && props.title === 'Max Calc' ? 'Admin Page Calculator' : props.title
))

const previewEyebrow = computed(() => props.mode === 'shop' ? 'Active quotation' : 'Quotation summary')

const previewHeading = computed(() => quoteProductLabel.value || 'Live quote summary')

const previewIntro = computed(() => {
  if (props.mode === 'shop') return 'Backend-backed summary for the active shop workspace.'
  if (props.mode === 'client') return 'Save the draft, send it to selected print shops, or continue on WhatsApp.'
  return 'Public-facing pricing preview with client details captured inline.'
})

const quoteProductLabel = computed(() =>
  workspaceMode.value === 'custom'
    ? (customProductTitle.value || 'Custom product')
    : (selectedProductLabel.value || 'Not selected')
)

const activeShopMeta = computed(() => ({
  name: activeShopProfile.value.name || selectedShopName.value || 'Active shop',
  email: (props.mode === 'shop' ? shopStore.currentShop?.business_email : activeShopProfile.value.business_email) || 'Not available',
  phone: (props.mode === 'shop' ? shopStore.currentShop?.phone_number : activeShopProfile.value.phone_number) || 'Not available',
}))

const shopMetaLines = computed(() => [
  { label: 'Shop name', value: activeShopMeta.value.name },
  { label: 'Email', value: activeShopMeta.value.email },
  { label: 'Phone', value: activeShopMeta.value.phone },
])

const clientMetaLines = computed(() => {
  const lines = [
    { label: 'Name', value: contactName.value || '' },
    { label: 'Email', value: contactEmail.value || '' },
    { label: 'Phone', value: contactPhone.value || '' },
  ]
  return lines.filter(line => line.value)
})

const quantitySummary = computed(() => {
  const normalized = normalizeNumberValue(quantity.value)
  return normalized ? `${normalized} pcs` : 'Not set'
})

const sidesLabel = computed(() => (
  sides.value === 'DUPLEX' ? 'Both sides' : 'Front only'
))

const colorModeLabel = computed(() => (
  colorMode.value === 'BW' ? 'Black and white' : 'Full colour'
))

const sizeDisplayValue = computed(() => {
  if (workspaceMode.value === 'custom') {
    return sizeSummary.value
  }

  if (selectedSheetSize.value) return selectedSheetSize.value

  const previewSize = calculatorStore.preview?.paper?.sheet_size
  if (previewSize) return previewSize

  const paperLabel = selectedPaperLabel.value
  if (!paperLabel) return 'Auto from product'
  return paperLabel.split(' · ')[0] || paperLabel
})

const finishingSummaryLabel = computed(() => {
  if (!selectedFinishings.value.length) return 'None'

  return selectedFinishings.value.map((entry) => {
    const finishing = finishingOptions.value.find((item) => Number(item.id) === entry.finishing_rate_id)
    if (!finishing) return 'Finishing'
    if (isLamination(finishing)) {
      const sideLabel = entry.selected_side === 'front' ? 'front only' : entry.selected_side === 'back' ? 'back only' : 'both sides'
      return `${finishing.name} (${sideLabel})`
    }
    return String(finishing.name)
  }).join(', ')
})

const sizeSummary = computed(() => {
  const width = normalizeNumberValue(customWidthMm.value)
  const height = normalizeNumberValue(customHeightMm.value)
  if (!width || !height) return 'Not set'
  return formatSizeSummary(width, height, workspaceMode.value === 'custom' && customSizeMode.value === 'standard' ? customSizeLabel.value : '')
})

const turnaroundLabel = computed(() => {
  const hours = normalizeNumberValue(turnaroundDays.value)
  if (!hours) return 'On request'
  return `${hours} working hour${hours === 1 ? '' : 's'}`
})

const productionMetaLines = computed(() => {
  const lines: Array<{ label: string; value: string }> = []

  if (calculatorStore.preview?.copies_per_sheet != null) {
    lines.unshift({
      label: 'Production plan',
      value: `${calculatorStore.preview.copies_per_sheet}-up on sheet`,
    })
  }

  if (calculatorStore.preview?.good_sheets != null) {
    lines.push({
      label: 'Sheets required',
      value: `${calculatorStore.preview.good_sheets} good sheets`,
    })
  }

  if (calculatorStore.preview?.parent_sheet_name) {
    lines.push({
      label: 'Parent sheet',
      value: calculatorStore.preview.parent_sheet_name,
    })
  }

  if (calculatorStore.preview?.rotated !== null && calculatorStore.preview?.rotated !== undefined) {
    lines.push({
      label: 'Rotated',
      value: calculatorStore.preview.rotated ? 'Yes' : 'No',
    })
  }

  if (calculatorStore.preview?.printing?.machine_name) {
    lines.push({
      label: 'Machine',
      value: calculatorStore.preview.printing.machine_name,
    })
  }

  if (calculatorStore.preview?.reason) {
    lines.push({
      label: 'Backend note',
      value: calculatorStore.preview.reason,
    })
  }

  return lines
})

const jobMetaLines = computed(() => [
  { label: 'Product', value: quoteProductLabel.value },
  { label: 'Quantity', value: quantitySummary.value },
  { label: 'Size', value: sizeDisplayValue.value || 'Pending' },
  { label: 'Paper / GSM', value: selectedPaperLabel.value || 'Pending' },
  { label: 'Print sides', value: sidesLabel.value },
  { label: 'Colour mode', value: colorModeLabel.value },
  { label: 'Finishing', value: finishingSummaryLabel.value === 'None' ? 'None selected' : finishingSummaryLabel.value },
])

const finishingGroups = computed<Array<{ label: string; options: CalculatorFinishingOption[] }>>(() => {
  const lamination = finishingOptions.value.filter((finishing) => isLamination(finishing))
  const other = finishingOptions.value.filter((finishing) => !isLamination(finishing))
  const groups: Array<{ label: string; options: CalculatorFinishingOption[] }> = []
  if (lamination.length) groups.push({ label: 'Lamination', options: lamination })
  if (other.length) groups.push({ label: 'Other finishing', options: other })
  return groups
})

const finishingHelperCopy = computed(() =>
  finishingOptions.value.some((finishing) => isLamination(finishing))
    ? 'Lamination options are exclusive. Pick one lamination finish only when needed.'
    : 'Use backend finishing rules for the selected product.'
)
const previewCurrency = computed(() => calculatorStore.preview?.currency ?? null)
const { formatMoney } = useCurrencyFormatter(previewCurrency)
const previewGrandTotal = computed(() => getPreviewMoney(calculatorStore.preview, 'grand_total'))
const previewUnitPrice = computed(() => getPreviewMoney(calculatorStore.preview, 'unit_price'))
const previewPrintCost = computed(() => getPreviewMoney(calculatorStore.preview, 'print_cost'))
const previewFinishingTotal = computed(() => getPreviewMoney(calculatorStore.preview, 'finishing_total'))

const totalDisplay = computed(() =>
  formatMoney(previewGrandTotal.value, undefined, 'Awaiting preview')
)

const hasBackendTotal = computed(() =>
  Boolean(previewGrandTotal.value)
)

const perUnitDisplay = computed(() => {
  const unit = previewUnitPrice.value
  if (!unit) return 'Per-unit pricing appears after preview'
  return `${formatMoney(unit)} per unit`
})

const totalHelperLine = computed(() => {
  if (calculatorStore.previewLoading) return 'Refreshing backend pricing preview'
  if (!hasBackendTotal.value && calculatorStore.preview?.reason) {
    return `No final amount yet: ${calculatorStore.preview.reason}`
  }
  if (calculatorStore.preview?.vat?.mode) {
    return `VAT ${calculatorStore.preview.vat.mode} from ${selectedShopName.value}`
  }
  return `Live backend preview from ${selectedShopName.value}`
})

const printCostDisplay = computed(() =>
  formatMoney(previewPrintCost.value, undefined, formatMoney(0))
)

const duplexSurchargeOverride = computed<boolean | null>(() => {
  if (duplexSurchargePreference.value === 'on') return true
  if (duplexSurchargePreference.value === 'off') return false
  return null
})

const perSheetBreakdown = computed(() => extractPerSheetBreakdown(calculatorStore.preview))

const priceBreakdownLines = computed(() => {
  const lines: Array<{ label: string; value: string }> = []
  const paperPrice = perSheetBreakdown.value.paperPrice
  const frontPrint = perSheetBreakdown.value.frontPrint
  const backPrint = perSheetBreakdown.value.backPrint
  const duplexSurcharge = perSheetBreakdown.value.duplexSurcharge
  const totalPerSheet = perSheetBreakdown.value.totalPerSheet

  if (paperPrice) lines.push({ label: 'Paper price / sheet', value: formatMoney(paperPrice) })
  if (frontPrint) lines.push({ label: 'Front print', value: formatMoney(frontPrint) })
  if (sides.value === 'DUPLEX' && backPrint && backPrint !== '0' && backPrint !== '0.00') {
    lines.push({ label: 'Back print', value: formatMoney(backPrint) })
  }
  if (sides.value === 'DUPLEX' && duplexSurcharge && duplexSurcharge !== '0' && duplexSurcharge !== '0.00') {
    lines.push({
      label: calculatorStore.preview?.printing?.duplex_surcharge_applied ? 'Duplex surcharge' : 'Duplex surcharge rule',
      value: formatMoney(duplexSurcharge),
    })
  }
  if (totalPerSheet) lines.push({ label: 'Total / sheet', value: formatMoney(totalPerSheet) })
  if (perSheetBreakdown.value.formula) lines.push({ label: 'Formula', value: perSheetBreakdown.value.formula })
  return lines
})

const finishingTotalDisplay = computed(() => {
  const total = previewFinishingTotal.value
  if (!total || total === '0' || total === '0.00') return formatMoney(0)
  return formatMoney(total)
})

const piecesPerSheetDisplay = computed(() => {
  const copiesPerSheet = calculatorStore.preview?.copies_per_sheet
  return copiesPerSheet === null || copiesPerSheet === undefined ? '' : String(copiesPerSheet)
})

const sheetsRequiredDisplay = computed(() => {
  const goodSheets = calculatorStore.preview?.good_sheets
  return goodSheets === null || goodSheets === undefined ? '' : String(goodSheets)
})

const _turnaroundTileValue = computed(() =>
  props.mode === 'shop' ? turnaroundLabel.value : 'Live quote'
)

const _statTileLabel = computed(() => {
  if (props.mode === 'shop') return 'Active shop'
  return 'Shops on Printy'
})

const _statTileValue = computed(() => {
  if (props.mode === 'shop') return selectedShopName.value
  const count = availableShops.value.length || shopOptions.value.length || (selectedShopSlug.value ? 1 : 0)
  return `${count} shops`
})

const _statTileNote = computed(() => {
  if (props.mode === 'shop') return 'pricing console'
  return selectedShopName.value
})

const serviceNote = computed(() => {
  if (calculatorStore.preview?.reason) return calculatorStore.preview.reason
  if (props.mode === 'hero') return 'Most shops on Printy respond fastest during working hours.'
  if (props.mode === 'client') return 'Save the draft first, then send it to one or more selected shops.'
  return 'Use this workspace to prepare a live backend-backed quote before sharing it.'
})

const finishingBreakdownLines = computed(() =>
  (calculatorStore.preview?.finishings ?? []).map((line, index) => ({
    key: `${line.slug || line.name}-${index}`,
    label: line.name,
    total: formatMoney(line.total, undefined, formatMoney(0)),
  }))
)

const _outputSummaryLines = computed(() => {
  if (!calculatorStore.preview && !selectedProductLabel.value && !customProductTitle.value) return []

  const lines: string[] = []
  lines.push(`${quantitySummary.value} ${quoteProductLabel.value}`)
  lines.push(`${colorModeLabel.value} · ${sidesLabel.value}`)
  if (sizeDisplayValue.value) {
    lines.push(`${sizeDisplayValue.value} · ${selectedPaperLabel.value || 'Paper pending'}`)
  }
  if (finishingSummaryLabel.value !== 'None') {
    lines.push(finishingSummaryLabel.value)
  }
  return lines
})

const showPriceAdvice = computed(() => {
  const normalized = normalizeNumberValue(quantity.value)
  return Boolean(normalized && normalized < 500)
})

const { missingRequirements, canShowFinalPricing } = useCalculatorPreviewState({
  workspaceMode,
  hasProduct: computed(() => Boolean(selectedProductId.value)),
  customProductTitle,
  customProductSpec,
  quantity,
  widthMm: customWidthMm,
  heightMm: customHeightMm,
  paperId: selectedPaperId,
  sides,
  colorMode,
  machineId: selectedMachineId,
  turnaroundDays,
  preview: calculatorStore.preview,
})

const requirementsTitle = computed(() => {
  if (workspaceMode.value === 'custom') return 'Exact price needs a few more production details'
  return 'Complete these details to calculate final price'
})

const requirementsHelper = computed(() => {
  if (calculatorStore.previewError) return calculatorStore.previewError
  if (!hasBackendTotal.value && calculatorStore.preview?.reason) {
    return workspaceMode.value === 'custom'
      ? `Exact price available when required production details are selected. ${calculatorStore.preview.reason}`
      : `Backend pricing has not produced a final amount yet: ${calculatorStore.preview.reason}`
  }
  if (workspaceMode.value === 'custom' && !supportsStandaloneCustomPricing.value) {
    return 'This calculator still uses a catalog pricing source for custom jobs on this surface. Select a pricing-source product plus the backend paper, machine, sides, colour mode, and finishing ids to unlock final price.'
  }
  if (missingRequirements.value.length) {
    return workspaceMode.value === 'custom'
      ? `Exact price available when required production details are selected: ${missingRequirements.value.join(', ')}. You can still add this item now for manual pricing.`
      : `Final price appears after the required backend inputs are present: ${missingRequirements.value.join(', ')}.`
  }
  if (!hasBackendTotal.value) {
    return workspaceMode.value === 'custom'
      ? 'Saved as custom quote request for manual pricing when exact production details are still pending.'
      : 'Backend preview did not return a final amount yet. Check the selected machine, paper, and pricing rules for this shop.'
  }
  return serviceNote.value
})

async function signInForDraft() {
  await navigateTo({ path: '/auth/login', query: { redirect: '/quote-draft' } })
}

async function openDashboard() {
  await navigateTo('/dashboard')
}

async function openShopsDirectory() {
  await navigateTo('/shops')
}

async function runAction(handler: (() => Promise<void> | void) | null) {
  if (!handler) return
  await handler()
}

const primaryAction = computed(() => {
  if (props.mode === 'shop') {
    return { label: 'Preview & download PDF', run: printPreview, disabled: !calculatorStore.preview }
  }
  if (props.mode === 'client') {
    return {
      label: sendActionLabel.value,
      run: sendDraft,
      disabled: !calculatorStore.preview || sendingRequest.value || !selectedSendShopIds.value.length || !!lastSentSummary.value,
    }
  }
  if (showDashboardRoute.value) {
    return { label: 'Open dashboard', run: openDashboard, disabled: false }
  }
  return { label: 'Find another print shop', run: openShopsDirectory, disabled: false }
})

const secondaryAction = computed(() => {
  if (props.mode === 'shop') {
    return { label: 'Copy quote', run: copyPreview, disabled: !calculatorStore.preview }
  }
  if (props.mode === 'client') {
    return { label: 'Save draft', run: saveDraft, disabled: !calculatorStore.preview }
  }
  if (authStore.isClient) {
    return {
      label: sendActionLabel.value,
      run: sendDraft,
      disabled: !calculatorStore.preview || sendingRequest.value || !selectedSendShopIds.value.length || !!lastSentSummary.value,
    }
  }
  return { label: 'Sign in to download PDF', run: signInForDraft, disabled: false }
})

const tertiaryAction = computed(() => {
  if (props.mode === 'shop' || props.mode === 'client') {
    return { label: 'Send via WhatsApp', run: shareWhatsApp, disabled: !calculatorStore.preview }
  }
  if (authStore.isClient) {
    return { label: 'Save draft', run: saveDraft, disabled: !calculatorStore.preview }
  }
  return null
})

const showDashboardRoute = computed(() => isHeroMode.value && (authStore.isShopOwner || authStore.isStaffRole))
const isHeroMode = computed(() => props.mode === 'hero')
</script>

<style scoped>
.quote-calc-root {
  display: grid;
  gap: 1.6rem;
  min-width: 0;
}

.quote-calc-header {
  max-width: 52rem;
  min-width: 0;
}

.quote-calc-root-mini .quote-calc-header {
  max-width: 46rem;
}

.quote-console-eyebrow {
  color: var(--color-primary-500);
  font-size: 0.74rem;
  font-weight: 800;
  letter-spacing: 0.18em;
  text-transform: uppercase;
}

.quote-calc-title {
  margin-top: 0.5rem;
  font-size: clamp(2rem, 4vw, 3.15rem);
  font-weight: 800;
  line-height: 0.98;
  color: var(--p-text);
}

.quote-calc-description {
  margin-top: 0.75rem;
  color: var(--p-text-muted);
  font-size: 0.98rem;
  line-height: 1.65;
}

.quote-console-shell {
  border: 1px solid var(--p-border);
  background:
    radial-gradient(circle at top right, var(--color-primary-500) 0%, transparent 20rem),
    radial-gradient(circle at bottom left, var(--p-surface-sunken) 0%, transparent 18rem),
    linear-gradient(180deg, var(--p-surface-container) 0%, var(--p-surface-sunken) 100%);
  border-radius: 2.15rem;
  padding: 1.8rem;
  min-width: 0;
  overflow: clip;
}

.quote-console-grid {
  display: grid;
  grid-template-columns: minmax(0, 1.16fr) minmax(22rem, 0.94fr);
  gap: 1.75rem;
  min-width: 0;
}

.quote-calc-root-mini .quote-console-grid {
  grid-template-columns: minmax(0, 1.55fr) minmax(21rem, 0.9fr);
}

.quote-form-column {
  display: grid;
  gap: 1.15rem;
  align-content: start;
  min-width: 0;
}

.quote-form-section,
.quote-form-cell {
  display: grid;
  gap: 0.55rem;
  min-width: 0;
}

.quote-form-row {
  display: grid;
  gap: 1rem;
}

.quote-form-row-2col,
.quote-size-split {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.quote-toggle-row {
  display: flex;
  flex-wrap: wrap;
  gap: 0.65rem;
}

.quote-preview-column {
  display: flex;
  min-width: 0;
}

.quote-preview-shell {
  width: 100%;
  display: grid;
  gap: 1.15rem;
  align-content: start;
  border-left: 1px solid rgba(123, 140, 172, 0.18);
  padding-left: 1.5rem;
  min-width: 0;
}

.quote-field-label {
  display: block;
  font-size: 0.93rem;
  font-weight: 600;
  color: var(--p-text-dim);
}

.quote-helper-text {
  font-size: 0.75rem;
  line-height: 1.6;
  color: var(--p-text-muted);
}

.quote-finishing-shell {
  display: grid;
  gap: 0.8rem;
  margin-top: 0.35rem;
  border: 1px solid var(--p-border-dim);
  border-radius: 1.45rem;
  background: var(--p-surface-sunken);
  padding: 0.95rem;
}

.quote-form-column :deep(.quote-console-control) {
  border-radius: 1.05rem !important;
  border: 1px solid var(--p-border-dim) !important;
  background: var(--p-surface-container-low) !important;
  box-shadow: none !important;
  min-width: 0;
  overflow: hidden;
}

.quote-form-column :deep(.quote-console-control[data-ui='UInput'] input),
.quote-form-column :deep(.quote-console-control[data-ui='UTextarea'] textarea),
.quote-form-column :deep(.quote-console-control[data-ui='USelectMenu'] [data-slot='base']),
.quote-form-column :deep(.quote-console-control[data-ui='USelectMenu'] [data-slot='trigger']) {
  min-height: 3.65rem !important;
  border-radius: 1.05rem !important;
  border: 0 !important;
  background: transparent !important;
  color: var(--p-text) !important;
  font-size: 0.95rem;
  padding-left: 1.05rem;
  padding-right: 1.05rem;
  box-shadow: none !important;
  min-width: 0;
}

.quote-form-column :deep(.quote-console-control[data-ui='USelectMenu']) {
  position: relative;
}

.quote-form-column :deep(.quote-console-control[data-ui='USelectMenu'] [data-slot='base']) {
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
  min-width: 0;
  background: var(--p-surface-container-low) !important;
}

.quote-form-column :deep(.quote-console-control[data-ui='USelectMenu'] [data-slot='trigger']) {
  display: flex;
  align-items: center;
  width: 100%;
  min-width: 0;
  padding-right: 3.1rem !important;
}

.quote-form-column :deep(.quote-console-control[data-ui='USelectMenu'] [data-slot='value']),
.quote-form-column :deep(.quote-console-control[data-ui='USelectMenu'] [data-slot='placeholder']) {
  min-width: 0;
  padding-right: 0.35rem;
}

.quote-form-column :deep(.quote-console-control[data-ui='USelectMenu'] [data-slot='trailing']) {
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  pointer-events: none;
}

.quote-form-column :deep(.quote-console-control[data-ui='USelectMenu'] [data-slot='trailing-icon']),
.quote-form-column :deep(.quote-console-control[data-ui='USelectMenu'] svg) {
  color: var(--p-text-muted) !important;
}

.quote-form-column :deep(.quote-console-select-base) {
  position: relative;
  width: 100%;
  min-width: 0;
  background: var(--p-surface-container-low) !important;
}

.quote-form-column :deep(.quote-console-control[data-ui='USelectMenu'] [data-slot='content']) {
  background: var(--p-surface-raised) !important;
}

.quote-form-column :deep(.quote-console-control[data-ui='UTextarea'] textarea) {
  min-height: 7.3rem !important;
  padding-top: 1rem;
  padding-bottom: 1rem;
  border-radius: 1.25rem !important;
}

.quote-form-column :deep(.quote-console-control[data-ui='UInput'] input::placeholder),
.quote-form-column :deep(.quote-console-control[data-ui='UTextarea'] textarea::placeholder),
.quote-form-column :deep(.quote-console-control[data-ui='USelectMenu'] [data-slot='placeholder']) {
  color: var(--p-text-muted) !important;
}

.quote-form-column :deep(.quote-console-control[data-ui='UInput']:focus-within),
.quote-form-column :deep(.quote-console-control[data-ui='UTextarea']:focus-within),
.quote-form-column :deep(.quote-console-control[data-ui='USelectMenu']:focus-within) {
  border-color: var(--color-primary-400) !important;
  box-shadow: 0 0 0 3px var(--p-glow) !important;
}

.quote-toggle-chip,
.quote-finishing-chip {
  border: 1px solid var(--p-border);
  background: var(--p-surface-container);
  color: var(--p-text-dim);
  transition: border-color 150ms ease, background-color 150ms ease, color 150ms ease;
}

.quote-toggle-chip {
  border-radius: 999px;
  padding: 0.9rem 1.2rem;
  font-size: 0.84rem;
  font-weight: 700;
}

.quote-toggle-chip-active,
.quote-finishing-chip-active {
  border-color: var(--color-primary-500);
  background: var(--color-primary-50);
  color: var(--color-primary-900);
}

.quote-finishing-group {
  border: 1px solid var(--p-border-dim);
  background: var(--p-surface-container-low);
  border-radius: 1.15rem;
  padding: 1rem;
}

.quote-finishing-group-selection {
  padding: 0.95rem;
}

.quote-finishing-group-label,
.quote-summary-heading,
.quote-preview-eyebrow {
  font-size: 0.73rem;
  font-weight: 800;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--color-primary-500);
}

.quote-finishing-chip {
  border-radius: 999px;
  padding: 0.78rem 1.08rem;
  font-size: 0.82rem;
  font-weight: 700;
}

.quote-finishing-options {
  display: flex;
  flex-wrap: wrap;
  gap: 0.55rem;
  margin-top: 0.7rem;
  min-width: 0;
}

.quote-finishing-select {
  margin-top: 0.75rem;
}

.quote-preview-card,
.quote-summary-panel,
.quote-summary-tile,
.quote-warning-panel {
  border-radius: 1.35rem;
}

.quote-preview-card {
  border: 1px solid var(--p-border-dim);
  background: var(--p-surface-raised);
  padding: 1.6rem;
  color: var(--p-text);
  display: grid;
  gap: 1.05rem;
  min-height: 28rem;
  align-content: start;
  min-width: 0;
}

.quote-calc-root-mini .quote-preview-card {
  min-height: 20rem;
}

.quote-preview-heading {
  font-size: 1.9rem;
  line-height: 1;
  font-weight: 800;
  color: var(--color-primary-500);
}

.quote-preview-customer-line {
  font-size: 0.94rem;
  font-weight: 600;
  color: var(--p-text-dim);
}

.quote-preview-customer-line span,
.quote-preview-message,
.quote-preview-summary-line,
.quote-total-helper,
.quote-summary-note,
.quote-preview-service-note {
  color: var(--p-text-muted);
}

.quote-preview-summary-title {
  font-size: 1.05rem;
  font-weight: 700;
  color: var(--p-text);
}

.quote-preview-summary,
.quote-preview-breakdown {
  display: grid;
  gap: 0.35rem;
}

.quote-preview-breakdown-row,
.quote-preview-price-row {
  display: flex;
  justify-content: space-between;
  gap: 0.75rem;
  font-size: 0.88rem;
}

.quote-preview-breakdown-row span:last-child,
.quote-preview-price-row strong {
  color: var(--p-text);
  font-weight: 700;
}

.quote-preview-pricing,
.quote-preview-total-block {
  border-top: 1px solid var(--p-border-dim);
  padding-top: 1rem;
}

.quote-total-label,
.quote-summary-label {
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--p-text-muted);
}

.quote-total-amount {
  margin-top: 0.5rem;
  font-size: clamp(2.35rem, 5vw, 3.35rem);
  line-height: 0.95;
  font-weight: 900;
  letter-spacing: -0.04em;
  color: var(--color-primary-500);
}

.quote-total-unit {
  margin-top: 0.55rem;
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--p-text-dim);
}

.quote-summary-tile,
.quote-summary-panel {
  border: 1px solid var(--p-border-dim);
  background: var(--p-surface-container-low);
  padding: 1.05rem;
}

.quote-summary-value {
  margin-top: 0.45rem;
  font-size: 1.08rem;
  font-weight: 800;
  color: var(--p-text);
}

.quote-summary-accent {
  color: var(--color-primary-500);
}

.quote-summary-list {
  margin-top: 0.7rem;
  display: grid;
  gap: 0.35rem;
  font-size: 0.83rem;
  color: var(--p-text-dim);
}

.quote-warning-panel {
  border: 1px solid var(--color-primary-400);
  background: var(--color-primary-50);
  padding: 0.9rem 1rem;
}

.quote-warning-copy {
  font-size: 0.79rem;
  font-weight: 700;
  color: var(--color-primary-900);
}

.quote-insight-grid,
.quote-actions {
  display: grid;
  gap: 0.85rem;
  min-width: 0;
}

.quote-insight-grid,
.quote-actions-row {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.quote-actions-stack {
  grid-template-columns: minmax(0, 1fr);
}

.quote-primary-cta,
.quote-secondary-cta,
.quote-tertiary-cta {
  min-height: 3.55rem;
  width: 100%;
  border-radius: 999px;
  padding: 1rem 1.25rem;
  font-size: 0.95rem;
  font-weight: 800;
  transition: background-color 150ms ease, border-color 150ms ease, color 150ms ease, opacity 150ms ease;
}

.quote-primary-cta:disabled,
.quote-secondary-cta:disabled,
.quote-tertiary-cta:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.quote-primary-cta {
  border: 1px solid var(--color-primary-600);
  background: var(--color-primary-600);
  color: #fff;
}

.quote-secondary-cta {
  border: 1px solid var(--p-border);
  background: var(--p-surface-container-low);
  color: var(--p-text);
}

.quote-tertiary-cta {
  grid-column: 1 / -1;
  border: 1px solid var(--p-border-dim);
  background: var(--p-surface-sunken);
  color: var(--p-text-muted);
  font-size: 0.86rem;
}

@media (max-width: 1100px) {
  .quote-console-grid {
    grid-template-columns: minmax(0, 1fr);
  }

  .quote-calc-root-mini .quote-console-grid {
    grid-template-columns: minmax(0, 1fr);
  }

  .quote-preview-shell {
    border-left: 0;
    border-top: 1px solid rgba(123, 140, 172, 0.16);
    padding-left: 0;
    padding-top: 1.35rem;
  }

  .quote-actions-row,
  .quote-insight-grid {
    grid-template-columns: minmax(0, 1fr);
  }

  .quote-preview-card {
    min-height: 0;
  }
}

@media (max-width: 720px) {
  .quote-console-shell {
    border-radius: 1.8rem;
    padding: 1.15rem;
  }

  .quote-form-row-2col,
  .quote-size-split {
    grid-template-columns: minmax(0, 1fr);
  }
}
</style>
