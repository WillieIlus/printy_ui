<template>
  <section :id="anchorId" :data-calculator-mode="props.mode" class="quote-console-shell overflow-hidden rounded-[1.7rem] p-5 sm:p-6">
    <p class="quote-console-eyebrow">
      {{ eyebrow }}
    </p>

    <div class="mt-4 grid grid-cols-1 gap-6 md:grid-cols-2">
      <form ref="formRef" class="quote-form-column space-y-4" @submit.prevent="previewQuote">
        <div v-if="props.mode === 'shop'" class="space-y-2">
          <p class="quote-field-label">Quote mode</p>
          <div class="flex flex-wrap gap-2">
            <button
              type="button"
              :class="['quote-toggle-chip', workspaceMode === 'catalog' ? 'quote-toggle-chip-active' : '']"
              @click="workspaceMode = 'catalog'"
            >
              Catalog product
            </button>
            <button
              type="button"
              :class="['quote-toggle-chip', workspaceMode === 'custom' ? 'quote-toggle-chip-active' : '']"
              @click="workspaceMode = 'custom'"
            >
              Custom product
            </button>
          </div>
        </div>

        <div v-if="props.mode !== 'hero'" class="grid grid-cols-2 gap-3.5">
          <div class="space-y-2">
            <label class="quote-field-label">Client / enquirer</label>
            <UInput v-model="contactName" class="quote-console-control" placeholder="Client or company name" />
          </div>
          <div class="space-y-2">
            <label class="quote-field-label">Phone / contact</label>
            <UInput v-model="contactPhone" class="quote-console-control" placeholder="+254..." />
          </div>
        </div>

        <div v-if="props.mode === 'shop'" class="space-y-2">
          <label class="quote-field-label">Email</label>
          <UInput v-model="contactEmail" class="quote-console-control" type="email" placeholder="name@example.com" />
        </div>

        <div class="space-y-2">
          <label class="quote-field-label">{{ allowShopSelection ? 'Print shop' : 'Active shop' }}</label>
          <USelectMenu
            v-if="allowShopSelection"
            v-model="selectedShopSlug"
            :items="shopOptions"
            value-key="value"
            label-key="label"
            :ui="legacySelectUi"
            portal="body"
            class="w-full quote-console-control"
          />
          <UInput
            v-else
            :model-value="selectedShopName"
            class="quote-console-control"
            readonly
            disabled
          />
        </div>

        <div v-if="props.mode === 'client' && shopOptions.length > 1" class="space-y-2">
          <label class="quote-field-label">Send to shops</label>
          <div class="quote-finishing-group rounded-[0.95rem] border px-3.5 py-3">
            <div class="flex flex-wrap gap-1.5">
              <button
                v-for="shop in shopOptions"
                :key="shop.value"
                type="button"
                :class="[
                  'quote-finishing-chip',
                  selectedSendShopSlugs.includes(shop.value) ? 'quote-finishing-chip-active' : '',
                ]"
                @click="toggleSendShop(shop.value, !selectedSendShopSlugs.includes(shop.value))"
              >
                {{ shop.label }}
              </button>
            </div>
          </div>
          <p class="quote-helper-text">
            Preview against one shop above, then send the draft to one or more selected shops.
          </p>
        </div>

        <div class="grid grid-cols-2 gap-3.5">
          <div class="space-y-2">
            <label class="quote-field-label">{{ workspaceMode === 'custom' ? 'Custom product' : 'Product' }}</label>
            <UInput
              v-if="workspaceMode === 'custom'"
              v-model="customProductTitle"
              class="quote-console-control"
              placeholder="Custom product title"
            />
            <USelectMenu
              v-else
              v-model="selectedProductId"
              :items="productOptions"
              value-key="value"
              label-key="label"
              :ui="legacySelectUi"
              portal="body"
              class="w-full quote-console-control"
            />
          </div>
          <div class="space-y-2">
            <label class="quote-field-label">Quantity</label>
            <UInput v-model="quantity" class="quote-console-control" type="number" min="1" />
          </div>
        </div>

        <div v-if="workspaceMode === 'custom'" class="space-y-2">
          <label class="quote-field-label">Custom brief</label>
          <UTextarea
            v-model="customProductSpec"
            class="quote-console-control quote-console-textarea"
            :rows="3"
            placeholder="Describe the stock, finishing, and special handling."
          />
        </div>

        <div class="grid grid-cols-2 gap-3.5">
          <div class="space-y-2">
            <label class="quote-field-label">Size</label>
            <UInput
              v-if="workspaceMode !== 'custom'"
              :model-value="sizeDisplayValue"
              class="quote-console-control"
              readonly
              disabled
            />
            <div v-else class="grid grid-cols-2 gap-3">
              <UInput v-model="customWidthMm" class="quote-console-control" type="number" min="1" placeholder="Width" />
              <UInput v-model="customHeightMm" class="quote-console-control" type="number" min="1" placeholder="Height" />
            </div>
          </div>
          <div class="space-y-2">
            <label class="quote-field-label">Print sides</label>
            <USelectMenu
              v-model="sides"
              :items="sidesOptions"
              value-key="value"
              label-key="label"
              :ui="legacySelectUi"
              portal="body"
              class="w-full quote-console-control"
            />
          </div>
        </div>

        <div class="grid grid-cols-2 gap-3.5">
          <div class="space-y-2">
            <label class="quote-field-label">Paper / GSM</label>
            <USelectMenu
              v-model="selectedPaperId"
              :items="paperOptions"
              value-key="value"
              label-key="label"
              :ui="legacySelectUi"
              portal="body"
              class="w-full quote-console-control"
            />
          </div>
          <div class="space-y-2">
            <label class="quote-field-label">Colour mode</label>
            <USelectMenu
              v-model="colorMode"
              :items="colorModeOptions"
              value-key="value"
              label-key="label"
              :ui="legacySelectUi"
              portal="body"
              class="w-full quote-console-control"
            />
          </div>
        </div>

        <div v-if="machineOptions.length > 1 || props.mode === 'shop'" class="space-y-2">
          <label class="quote-field-label">Machine</label>
          <USelectMenu
            v-model="selectedMachineId"
            :items="machineOptions"
            value-key="value"
            label-key="label"
            :ui="legacySelectUi"
            portal="body"
            class="w-full quote-console-control"
          />
        </div>

        <div v-if="props.mode === 'shop'" class="space-y-2">
          <label class="quote-field-label">Turnaround</label>
          <UInput v-model="turnaroundDays" class="quote-console-control" type="number" min="1" placeholder="2 days" />
        </div>

        <div>
          <label class="quote-field-label">Finishing services</label>
          <div class="mt-2 space-y-3">
            <div
              v-for="group in finishingGroups"
              :key="group.label"
              class="quote-finishing-group rounded-[0.95rem] border px-3.5 py-3"
            >
              <p class="quote-finishing-group-label">{{ group.label }}</p>
              <div class="mt-2 flex flex-wrap gap-1.5">
                <button
                  v-for="option in group.options"
                  :key="option.id"
                  type="button"
                  :class="[
                    'quote-finishing-chip',
                    selectedFinishings.some((entry) => entry.finishing_rate_id === Number(option.id))
                      ? 'quote-finishing-chip-active'
                      : '',
                  ]"
                  @click="toggleFinishing(option)"
                >
                  {{ option.name }}
                </button>
              </div>
              <div
                v-for="option in group.options.filter(item => selectedFinishings.some(entry => entry.finishing_rate_id === Number(item.id)) && isLamination(item))"
                :key="`lamination-side-${option.id}`"
                class="mt-2"
              >
                <USelectMenu
                  :model-value="selectedFinishingSide(Number(option.id))"
                  :items="laminationSides"
                  value-key="value"
                  label-key="label"
                  :ui="legacySelectUi"
                  portal="body"
                  class="w-full quote-console-control"
                  @update:model-value="updateFinishingSide(Number(option.id), $event)"
                />
              </div>
            </div>
          </div>
          <p class="quote-helper-text mt-2">
            {{ finishingHelperCopy }}
          </p>
        </div>

        <div v-if="props.mode !== 'hero'" class="space-y-2">
          <label class="quote-field-label">Notes</label>
          <UTextarea
            v-model="notes"
            class="quote-console-control quote-console-textarea"
            :rows="3"
            placeholder="Turnaround, delivery notes, or customer context"
          />
        </div>
      </form>

      <div class="flex flex-col justify-between">
        <div>
          <div class="quote-total-panel mb-3 rounded-xl border p-4">
            <p class="quote-total-label mb-1">Estimated total</p>
            <p class="quote-total-amount">{{ totalDisplay }}</p>
            <p class="quote-total-unit mt-1">{{ perUnitDisplay }}</p>
            <p class="quote-total-helper mt-1.5">{{ totalHelperLine }}</p>
          </div>

          <div class="mb-3 grid grid-cols-2 gap-2">
            <div class="quote-summary-tile rounded-lg border p-3">
              <p class="quote-summary-label mb-1">Print cost</p>
              <p class="quote-summary-value">{{ printCostDisplay }}</p>
            </div>
            <div class="quote-summary-tile rounded-lg border p-3">
              <p class="quote-summary-label mb-1">Finishing total</p>
              <p class="quote-summary-value">{{ finishingTotalDisplay }}</p>
            </div>
          </div>

          <div v-if="selectedFinishings.length" class="quote-summary-panel mb-3 rounded-lg border p-3">
            <p class="quote-summary-heading mb-2">Finishing breakdown</p>
            <div class="space-y-1">
              <div
                v-for="line in finishingBreakdownLines"
                :key="line.key"
                class="flex items-center justify-between text-xs"
              >
                <span class="text-[rgba(208,214,224,0.74)]">{{ line.label }}</span>
                <span class="font-medium text-[rgba(244,248,255,0.92)]">{{ line.total }}</span>
              </div>
            </div>
          </div>

          <div class="mb-3 grid grid-cols-2 gap-2">
            <div class="quote-summary-tile rounded-lg border p-3">
              <p class="quote-summary-label mb-1">Turnaround</p>
              <p class="quote-summary-value">{{ turnaroundTileValue }}</p>
            </div>
            <div class="quote-summary-tile rounded-lg border p-3">
              <p class="quote-summary-label mb-1">{{ statTileLabel }}</p>
              <p class="quote-summary-value quote-summary-accent">{{ statTileValue }}</p>
              <p v-if="statTileNote" class="quote-summary-note mt-0.5">
                {{ statTileNote }}
              </p>
            </div>
          </div>

          <p v-if="serviceNote" class="quote-helper-text mb-3">
            {{ serviceNote }}
          </p>

          <div v-if="outputSummaryLines.length" class="quote-summary-panel mb-3 rounded-lg border p-3">
            <p class="quote-summary-heading mb-2">Your draft</p>
            <ul class="space-y-0.5 text-xs text-[rgba(221,228,239,0.86)]">
              <li v-for="(line, index) in outputSummaryLines" :key="index">{{ line }}</li>
            </ul>
          </div>

          <div v-if="showPriceAdvice" class="quote-warning-panel mb-3 rounded-lg border px-3 py-2">
            <p class="text-xs font-medium text-[rgba(255,212,197,0.96)]">
              Quantity below 500. Per-unit cost is usually higher at this level.
            </p>
          </div>
        </div>

        <div class="mt-4 flex flex-col gap-3">
          <button
            type="button"
            class="quote-primary-cta"
            :disabled="primaryAction.disabled"
            @click="runAction(primaryAction.run)"
          >
            {{ primaryAction.label }}
          </button>
          <button
            type="button"
            class="quote-secondary-cta"
            :disabled="secondaryAction.disabled"
            @click="runAction(secondaryAction.run)"
          >
            {{ secondaryAction.label }}
          </button>
          <button
            v-if="tertiaryAction"
            type="button"
            class="quote-tertiary-cta"
            :disabled="tertiaryAction.disabled"
            @click="runAction(tertiaryAction.run)"
          >
            {{ tertiaryAction.label }}
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { API } from '~/shared/api-paths'
import type { QuoteDraft } from '~/shared/types/buyer'
import { useAuthStore } from '~/stores/auth'
import { useCalculatorStore } from '~/stores/calculator'
import { useQuoteInboxStore } from '~/stores/quoteInbox'
import { useShopStore } from '~/stores/shop'
import { normalizeNumberValue, normalizeOptionalText, normalizeSelectValue } from '~/utils/payload'

const props = withDefaults(defineProps<{
  title: string
  description: string
  eyebrow?: string
  mode?: 'hero' | 'client' | 'shop'
  fixedShopSlug?: string | null
  anchorId?: string
}>(), {
  eyebrow: 'Quote Calculator',
  mode: 'client',
  fixedShopSlug: null,
  anchorId: 'quote-calculator',
})

const emit = defineEmits<{
  draftSaved: [draft: QuoteDraft]
  draftSent: [requests: QuoteDraft[]]
}>()

const authStore = useAuthStore()
const shopStore = useShopStore()
const calculatorStore = useCalculatorStore()
const quoteInboxStore = useQuoteInboxStore()
const { scrollToFirstInvalid } = useAnchoredForm()
const toast = useToast()
const formRef = ref<HTMLElement | null>(null)

const contactName = ref('')
const contactPhone = ref('')
const contactEmail = ref('')
const notes = ref('')
const workspaceMode = ref<'catalog' | 'custom'>('catalog')
const customProductTitle = ref('')
const customProductSpec = ref('')
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
const selectedFinishings = ref<Array<{ finishing_rate_id: number; selected_side: 'front' | 'back' | 'both' }>>([])

const availableShops = ref<Array<{ id: number; slug: string; name: string }>>([])
const shopOptions = ref<Array<{ label: string; value: string }>>([])
const productOptions = ref<Array<{ label: string; value: number }>>([])
const paperOptions = ref<Array<{ label: string; value: number }>>([])
const machineOptions = ref<Array<{ label: string; value: number }>>([])
const finishingOptions = ref<Array<Record<string, any>>>([])
const activeShopId = ref<number | null>(null)

const allowShopSelection = computed(() => !props.fixedShopSlug)
const sidesOptions = [
  { label: 'Front only', value: 'SIMPLEX' },
  { label: 'Both sides', value: 'DUPLEX' },
]
const colorModeOptions = [
  { label: 'Black and white', value: 'BW' },
  { label: 'Full colour', value: 'COLOR' },
]

const laminationSides = [
  { label: 'Front only', value: 'front' },
  { label: 'Back only', value: 'back' },
  { label: 'Both sides', value: 'both' },
]

const legacySelectUi = {
  base: 'quote-console-select-base relative w-full min-h-[3rem] px-3 py-2 text-sm',
  trigger: 'flex min-w-0 w-full items-center gap-2 py-1 pe-8 text-sm text-[rgba(244,248,255,0.96)]',
  value: 'min-w-0 flex-1 truncate text-[rgba(244,248,255,0.96)]',
  placeholder: 'min-w-0 flex-1 truncate text-[rgba(203,212,225,0.7)]',
  trailingIcon: 'pointer-events-none absolute end-3 top-1/2 -translate-y-1/2 text-[rgba(203,212,225,0.72)]',
  content: 'z-[240] overflow-hidden rounded-xl border border-white/10 bg-[#151d2d] text-white shadow-2xl',
  viewport: 'max-h-72 overflow-y-auto p-1',
  item: 'rounded-lg text-white data-highlighted:not-data-disabled:bg-white/10 data-highlighted:not-data-disabled:text-white',
  itemLabel: 'truncate',
  itemDescription: 'text-xs text-[rgba(203,212,225,0.7)]',
  empty: 'px-3 py-2 text-sm text-[rgba(203,212,225,0.7)]',
}

watch(selectedShopSlug, async (slug) => {
  if (!slug) return
  await loadShopResources(slug)
}, { immediate: true })

watch(selectedProductId, async (productId) => {
  if (!productId || workspaceMode.value !== 'catalog') return
  await loadProductOptions(productId)
}, { immediate: true })

onMounted(async () => {
  await loadShops()
})

let previewTimer: ReturnType<typeof setTimeout> | null = null

watch(workspaceMode, (mode) => {
  if (mode === 'catalog') {
    if (selectedProductId.value) {
      void loadProductOptions(selectedProductId.value)
    }
    return
  }

  calculatorStore.resetPreview()
})

onUnmounted(() => {
  if (previewTimer) clearTimeout(previewTimer)
})

watch(
  () => [
    activeShopId.value,
    selectedShopSlug.value,
    selectedProductId.value,
    selectedPaperId.value,
    selectedMachineId.value,
    quantity.value,
    sides.value,
    colorMode.value,
    workspaceMode.value,
    JSON.stringify(selectedFinishings.value),
  ],
  () => {
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
  const existingShopIndex = shopOptions.value.findIndex((shop) => shop.value === shopSlug)
  if (existingShopIndex >= 0) {
    shopOptions.value[existingShopIndex] = { label: catalogResponse.shop.name, value: shopSlug }
  } else {
    shopOptions.value = [...shopOptions.value, { label: catalogResponse.shop.name, value: shopSlug }]
  }
  productOptions.value = catalogResponse.products.map((product) => ({ label: product.name, value: product.id }))
  if (!selectedProductId.value) {
    selectedProductId.value = productOptions.value[0]?.value ?? null
  }
  if (props.mode === 'client' && !selectedSendShopSlugs.value.includes(shopSlug)) {
    selectedSendShopSlugs.value = [...selectedSendShopSlugs.value, shopSlug]
  }
}

async function loadProductOptions(productId: number) {
  const { $publicApiNoAuth } = useNuxtApp()
  const detail = await $publicApiNoAuth<any>(API.publicProductOptions(productId))
  paperOptions.value = (detail.available_papers ?? []).map((paper: Record<string, unknown>) => ({
    label: `${paper.sheet_size} · ${paper.gsm}gsm · ${paper.paper_type}`,
    value: Number(paper.id),
  }))
  machineOptions.value = (detail.available_machines ?? []).map((machine: Record<string, unknown>) => ({
    label: String(machine.name),
    value: Number(machine.id),
  }))
  finishingOptions.value = detail.available_finishings ?? []
  selectedPaperId.value = selectedPaperId.value ?? paperOptions.value[0]?.value ?? null
  selectedMachineId.value = selectedMachineId.value ?? Number(detail.default_machine ?? machineOptions.value[0]?.value ?? null)
  colorMode.value = detail.default_color_mode === 'BW' ? 'BW' : 'COLOR'
  sides.value = detail.default_sides === 'DUPLEX' ? 'DUPLEX' : 'SIMPLEX'
  customWidthMm.value = customWidthMm.value ?? normalizeNumberValue(detail.default_finished_width_mm) ?? null
  customHeightMm.value = customHeightMm.value ?? normalizeNumberValue(detail.default_finished_height_mm) ?? null
  turnaroundDays.value = turnaroundDays.value ?? normalizeNumberValue(detail.turnaround_days) ?? null
}

function toggleFinishing(finishing: Record<string, any>) {
  const existing = selectedFinishings.value.find((entry) => entry.finishing_rate_id === finishing.id)
  if (existing) {
    selectedFinishings.value = selectedFinishings.value.filter((entry) => entry.finishing_rate_id !== finishing.id)
    return
  }
  selectedFinishings.value = [
    ...selectedFinishings.value,
    {
      finishing_rate_id: Number(finishing.id),
      selected_side: isLamination(finishing) ? 'both' : 'both',
    },
  ]
}

function toggleSendShop(shopSlug: string, checked: boolean) {
  if (checked) {
    selectedSendShopSlugs.value = Array.from(new Set([...selectedSendShopSlugs.value, shopSlug]))
    return
  }

  selectedSendShopSlugs.value = selectedSendShopSlugs.value.filter((slug) => slug !== shopSlug)
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

function isLamination(finishing: Record<string, any>) {
  const name = `${finishing.slug || ''} ${finishing.name || ''}`.toLowerCase()
  return name.includes('lamination') || (
    finishing.billing_basis === 'per_sheet'
    && finishing.side_mode === 'per_selected_side'
  )
}

function finishingRuleLabel(finishing: Record<string, any>) {
  if (isLamination(finishing)) {
    return 'Per sheet per side'
  }

  const billingBasis = normalizeBillingBasis(finishing.billing_basis)
  if (billingBasis) {
    return billingBasisLabel(billingBasis)
  }

  return finishing.display_unit_label || finishing.charge_unit || 'Backend rule'
}

function finishingHelpText(finishing: Record<string, any>) {
  if (isLamination(finishing)) {
    return 'Charged on good sheets for the selected side: front = 1, back = 1, both = 2.'
  }

  return finishing.help_text || finishing.display_unit_label || basisHelpText(finishing.billing_basis) || ''
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

function validateForm() {
  if (workspaceMode.value === 'custom') {
    return false
  }
  return Boolean(activeShopId.value && selectedProductId.value && selectedPaperId.value && selectedMachineId.value && normalizeNumberValue(quantity.value))
}

async function previewQuote(isLiveUpdate = false) {
  if (!validateForm()) {
    if (!isLiveUpdate) {
      scrollToFirstInvalid(formRef.value)
      toast.add({
        title: workspaceMode.value === 'custom' ? 'Catalog product required' : 'Incomplete form',
        description: workspaceMode.value === 'custom'
          ? 'Backend preview pricing still requires a catalog product. Switch back to Catalog product to preview.'
          : 'Pick a shop, product, paper, machine, and quantity before previewing.',
        color: 'warning',
      })
    }
    return
  }
  calculatorStore.setContext({
    shopId: activeShopId.value,
    shopSlug: selectedShopSlug.value,
    productId: selectedProductId.value,
    quantity: normalizeNumberValue(quantity.value) ?? 100,
    paperId: selectedPaperId.value,
    machineId: selectedMachineId.value,
    colorMode: colorMode.value,
    sides: sides.value,
    finishings: selectedFinishings.value,
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
  const draft = await quoteInboxStore.saveDraft({
    title: contactName.value || 'Saved draft',
    shop: activeShopId.value,
    selected_product: selectedProductId.value,
    calculator_inputs_snapshot: {
      quantity: normalizeNumberValue(quantity.value),
      paper: selectedPaperId.value,
      machine: selectedMachineId.value,
      color_mode: colorMode.value,
      sides: sides.value,
      finishings: selectedFinishings.value,
      notes: notes.value,
    },
    pricing_snapshot: calculatorStore.preview,
    request_details_snapshot: {
      customer_name: normalizeOptionalText(contactName.value),
      customer_phone: normalizeOptionalText(contactPhone.value),
      notes: normalizeOptionalText(notes.value),
    },
  })
  emit('draftSaved', draft)
  toast.add({ title: 'Draft saved', description: 'The backend stored this quote draft.', color: 'success' })
}

async function sendDraft() {
  if (!calculatorStore.preview) return
  if (!authStore.isAuthenticated) {
    await navigateTo({ path: '/auth/login', query: { redirect: '/quote-draft' } })
    return
  }
  if (!authStore.isClient) {
    toast.add({ title: 'Preview only', description: 'Sending backend drafts is currently client-only.', color: 'warning' })
    return
  }
  const draft = await quoteInboxStore.saveDraft({
    title: contactName.value || 'Prepared quote',
    shop: activeShopId.value,
    selected_product: selectedProductId.value,
    calculator_inputs_snapshot: {
      quantity: normalizeNumberValue(quantity.value),
      paper: selectedPaperId.value,
      machine: selectedMachineId.value,
      color_mode: colorMode.value,
      sides: sides.value,
      finishings: selectedFinishings.value,
      notes: notes.value,
    },
    pricing_snapshot: calculatorStore.preview,
    request_details_snapshot: {
      customer_name: normalizeOptionalText(contactName.value),
      customer_phone: normalizeOptionalText(contactPhone.value),
      notes: normalizeOptionalText(notes.value),
    },
  })
  const selectedShopIds = shopOptions.value
    .filter((shop) => selectedSendShopSlugs.value.includes(shop.value))
    .map((shop) => shop.value)
  const selectedShops = selectedShopIds.length
    ? selectedShopIds.map((slug) => resolveShopIdFromSlug(slug)).filter((value): value is number => typeof value === 'number')
    : (activeShopId.value ? [activeShopId.value] : [])
  const requests = await quoteInboxStore.sendDraft(draft.id, selectedShops, {
    customer_name: normalizeOptionalText(contactName.value),
    customer_phone: normalizeOptionalText(contactPhone.value),
    notes: normalizeOptionalText(notes.value),
  })
  emit('draftSent', requests)
  toast.add({ title: 'Quote request sent', description: 'The backend created quote requests from this draft.', color: 'success' })
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
    `Total: ${calculatorStore.preview?.totals?.grand_total || calculatorStore.preview?.total || ''}`,
    `Paper: ${calculatorStore.preview?.paper?.label || ''}`,
    `Printing: ${calculatorStore.preview?.printing?.machine_name || ''}`,
    customProductSpec.value ? `Brief: ${customProductSpec.value}` : null,
  ].filter(Boolean).join('\n')
  await navigator.clipboard.writeText(text)
  toast.add({ title: 'Copied', description: 'Preview copied to the clipboard.', color: 'success' })
}

function shareWhatsApp() {
  const total = calculatorStore.preview?.totals?.grand_total || calculatorStore.preview?.total || ''
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

function printPreview() {
  window.print()
}

function resolveShopIdFromSlug(shopSlug: string) {
  return availableShops.value.find((shop) => shop.slug === shopSlug)?.id ?? null
}

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

const quoteProductLabel = computed(() =>
  workspaceMode.value === 'custom'
    ? (customProductTitle.value || 'Custom product')
    : (selectedProductLabel.value || 'Not selected')
)

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

const quoteDateLabel = computed(() =>
  new Intl.DateTimeFormat('en-KE', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(new Date())
)

const sizeSummary = computed(() => {
  const width = normalizeNumberValue(customWidthMm.value)
  const height = normalizeNumberValue(customHeightMm.value)
  if (!width || !height) return 'Not set'
  return `${width} x ${height} mm`
})

const turnaroundLabel = computed(() => {
  const days = normalizeNumberValue(turnaroundDays.value)
  if (!days) return 'On request'
  return `${days} day${days === 1 ? '' : 's'}`
})

const finishingGroups = computed(() => {
  const lamination = finishingOptions.value.filter((finishing) => isLamination(finishing))
  const other = finishingOptions.value.filter((finishing) => !isLamination(finishing))
  const groups: Array<{ label: string; options: Array<Record<string, any>> }> = []
  if (lamination.length) groups.push({ label: 'Lamination', options: lamination })
  if (other.length) groups.push({ label: 'Other finishing', options: other })
  return groups
})

const finishingHelperCopy = computed(() =>
  finishingOptions.value.some((finishing) => isLamination(finishing))
    ? 'Lamination options are exclusive. Pick one lamination finish only when needed.'
    : 'Use backend finishing rules for the selected product.'
)

function formatMoney(value: unknown, fallback = 'Awaiting preview') {
  if (typeof value === 'string') {
    const trimmed = value.trim()
    if (!trimmed) return fallback
    if (/^[A-Z]{3}\s/.test(trimmed)) return trimmed
    const parsed = Number(trimmed.replace(/,/g, ''))
    if (Number.isFinite(parsed)) {
      return `${calculatorStore.preview?.currency || 'KES'} ${Math.round(parsed).toLocaleString('en-KE')}`
    }
    return trimmed
  }
  if (typeof value === 'number' && Number.isFinite(value)) {
    return `${calculatorStore.preview?.currency || 'KES'} ${Math.round(value).toLocaleString('en-KE')}`
  }
  return fallback
}

const totalDisplay = computed(() =>
  formatMoney(calculatorStore.preview?.totals?.grand_total || calculatorStore.preview?.total)
)

const perUnitDisplay = computed(() => {
  const unit = calculatorStore.preview?.totals?.unit_price
  if (!unit) return 'Per-unit pricing appears after preview'
  return `${formatMoney(unit, '')} per unit`
})

const totalHelperLine = computed(() => {
  if (calculatorStore.previewLoading) return 'Refreshing backend pricing preview'
  if (calculatorStore.preview?.vat?.mode) {
    return `VAT ${calculatorStore.preview.vat.mode} from ${selectedShopName.value}`
  }
  return `Live backend preview from ${selectedShopName.value}`
})

const printCostDisplay = computed(() =>
  formatMoney(calculatorStore.preview?.totals?.print_cost, 'KES 0')
)

const finishingTotalDisplay = computed(() => {
  const total = calculatorStore.preview?.totals?.finishing_total
  if (!total || total === '0' || total === '0.00') return 'None'
  return formatMoney(total)
})

const turnaroundTileValue = computed(() =>
  props.mode === 'shop' ? turnaroundLabel.value : 'Live quote'
)

const statTileLabel = computed(() => {
  if (props.mode === 'shop') return 'Active shop'
  return 'Shops on Printy'
})

const statTileValue = computed(() => {
  if (props.mode === 'shop') return selectedShopName.value
  const count = availableShops.value.length || shopOptions.value.length || (selectedShopSlug.value ? 1 : 0)
  return `${count} shops`
})

const statTileNote = computed(() => {
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
    total: formatMoney(line.total, 'KES 0'),
  }))
)

const outputSummaryLines = computed(() => {
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
    return { label: 'Copy quote', run: copyPreview, disabled: !calculatorStore.preview }
  }
  if (showDashboardRoute.value) {
    return { label: 'Open dashboard', run: openDashboard, disabled: false }
  }
  if (authStore.isClient) {
    return { label: 'Save draft', run: saveDraft, disabled: !calculatorStore.preview }
  }
  return { label: 'Find a print shop', run: openShopsDirectory, disabled: false }
})

const secondaryAction = computed(() => {
  if (props.mode === 'shop') {
    return { label: 'Send via WhatsApp', run: shareWhatsApp, disabled: !calculatorStore.preview }
  }
  if (authStore.isClient) {
    return { label: 'Request this quote', run: sendDraft, disabled: !calculatorStore.preview }
  }
  return { label: 'Sign in to save draft', run: signInForDraft, disabled: false }
})

const tertiaryAction = computed(() => {
  if (props.mode === 'shop') {
    return { label: 'Download PDF', run: printPreview, disabled: !calculatorStore.preview }
  }
  return { label: 'Compare print shops', run: openShopsDirectory, disabled: false }
})

const canSaveDraft = computed(() => props.mode !== 'shop' && (!isHeroMode.value || !authStore.isShopOwner))
const canSendDraft = computed(() => props.mode !== 'shop' && (!isHeroMode.value || !authStore.isShopOwner))
const showDashboardRoute = computed(() => isHeroMode.value && (authStore.isShopOwner || authStore.isStaffRole))
const isHeroMode = computed(() => props.mode === 'hero')
</script>

<style scoped>
.quote-console-shell {
  --quote-control-radius: 0.95rem;
  --quote-control-height: 3rem;
  --quote-control-border: rgb(255 255 255 / 0.2);
  --quote-control-border-strong: rgb(255 255 255 / 0.28);
  --quote-control-surface: rgb(255 255 255 / 0.06);
  --quote-control-surface-focus: rgb(255 255 255 / 0.075);
}

.quote-console-shell {
  border: 1px solid rgb(255 255 255 / 0.1);
  background: rgb(255 255 255 / 0.05);
  box-shadow: 0 24px 56px rgb(3 8 20 / 0.34);
  backdrop-filter: blur(18px);
  -webkit-backdrop-filter: blur(18px);
}

.quote-console-eyebrow {
  color: rgb(253 186 116 / 0.98);
  font-size: 0.74rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.quote-field-label {
  display: block;
  font-size: 0.78rem;
  font-weight: 600;
  color: rgb(192 201 215 / 0.94);
}

.quote-helper-text {
  font-size: 0.69rem;
  line-height: 1.45;
  color: rgb(107 114 128 / 0.94);
}

.quote-form-column :deep(.quote-console-control) {
  border-radius: var(--quote-control-radius) !important;
}

.quote-form-column :deep(.quote-console-control[data-ui='UInput']),
.quote-form-column :deep(.quote-console-control[data-ui='UTextarea']),
.quote-form-column :deep(.quote-console-control[data-ui='USelectMenu']) {
  border-radius: var(--quote-control-radius) !important;
  border-color: var(--quote-control-border) !important;
  background: var(--quote-control-surface) !important;
  box-shadow: none;
}

.quote-form-column :deep(.quote-console-control[data-ui='UInput'] input),
.quote-form-column :deep(.quote-console-control[data-ui='UTextarea'] textarea),
.quote-form-column :deep(.quote-console-control[data-ui='USelectMenu'] [data-slot='base']),
.quote-form-column :deep(.quote-console-control[data-ui='USelectMenu'] [data-slot='trigger']) {
  min-height: var(--quote-control-height) !important;
  border-radius: var(--quote-control-radius) !important;
  border-color: var(--quote-control-border-strong) !important;
  background: var(--quote-control-surface) !important;
  color: white !important;
  font-size: 0.92rem;
  line-height: 1.35rem;
  padding-left: 0.9rem;
  padding-right: 0.9rem;
  box-shadow: none !important;
}

.quote-form-column :deep(.quote-console-control[data-ui='USelectMenu'] [data-slot='trigger']) {
  padding-top: 0.7rem;
  padding-bottom: 0.7rem;
}

.quote-form-column :deep(.quote-console-control[data-ui='USelectMenu'] [data-slot='value']),
.quote-form-column :deep(.quote-console-control[data-ui='USelectMenu'] [data-slot='placeholder']) {
  color: white !important;
}

.quote-form-column :deep(.quote-console-control[data-ui='USelectMenu'] [data-slot='placeholder']) {
  color: rgb(203 213 225 / 0.7) !important;
}

.quote-form-column :deep(.quote-console-control[data-ui='UInput'] input::placeholder),
.quote-form-column :deep(.quote-console-control[data-ui='UTextarea'] textarea::placeholder) {
  color: rgb(203 213 225 / 0.7) !important;
}

.quote-form-column :deep(.quote-console-control[data-ui='UInput'] input:disabled),
.quote-form-column :deep(.quote-console-control[data-ui='UTextarea'] textarea:disabled),
.quote-form-column :deep(.quote-console-control[data-ui='USelectMenu'][data-disabled]) {
  opacity: 1;
  color: rgb(226 232 240 / 0.92) !important;
  -webkit-text-fill-color: rgb(226 232 240 / 0.92);
}

.quote-form-column :deep(.quote-console-control[data-ui='UTextarea'] textarea) {
  min-height: 6rem;
  border-radius: var(--quote-control-radius);
  padding-top: 0.85rem;
  padding-bottom: 0.85rem;
}

.quote-form-column :deep(.quote-console-control[data-ui='UInput']:hover),
.quote-form-column :deep(.quote-console-control[data-ui='UTextarea']:hover),
.quote-form-column :deep(.quote-console-control[data-ui='USelectMenu']:hover) {
  border-color: var(--quote-control-border-strong) !important;
}

.quote-form-column :deep(.quote-console-control[data-ui='UInput']:focus-within),
.quote-form-column :deep(.quote-console-control[data-ui='UTextarea']:focus-within),
.quote-form-column :deep(.quote-console-control[data-ui='USelectMenu']:focus-within) {
  border-color: rgb(251 146 60 / 0.42);
  background: var(--quote-control-surface-focus) !important;
  box-shadow: 0 0 0 2px rgb(251 146 60 / 0.12) !important;
}

.quote-toggle-chip,
.quote-finishing-chip {
  border: 1px solid rgb(255 255 255 / 0.1);
  background: rgb(255 255 255 / 0.05);
  color: rgb(156 163 175 / 0.96);
  transition: border-color 150ms ease, background-color 150ms ease, color 150ms ease;
}

.quote-toggle-chip {
  border-radius: 0.7rem;
  padding: 0.45rem 0.8rem;
  font-size: 0.75rem;
  font-weight: 600;
}

.quote-toggle-chip-active {
  border-color: rgb(249 115 22 / 0.45);
  background: rgb(249 115 22 / 0.16);
  color: rgb(255 237 213 / 0.98);
}

.quote-finishing-group {
  border-radius: var(--quote-control-radius);
  border-color: var(--quote-control-border);
  background: var(--quote-control-surface);
}

.quote-finishing-group-label,
.quote-summary-heading {
  font-size: 0.64rem;
  font-weight: 500;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: rgb(107 114 128 / 0.96);
}

.quote-finishing-chip {
  border-radius: 0.55rem;
  padding: 0.34rem 0.7rem;
  font-size: 0.76rem;
  font-weight: 500;
}

.quote-finishing-chip-active {
  border-color: rgb(249 115 22 / 0.42);
  background: rgb(249 115 22 / 0.18);
  color: rgb(254 215 170 / 0.98);
}

.quote-total-panel {
  border-color: rgb(249 115 22 / 0.28);
  background: rgb(249 115 22 / 0.1);
}

.quote-total-label,
.quote-summary-label {
  font-size: 0.76rem;
  color: rgb(156 163 175 / 0.96);
}

.quote-total-amount {
  font-size: 2rem;
  line-height: 1.1;
  font-weight: 700;
  color: rgb(251 146 60 / 0.98);
}

.quote-total-unit {
  font-size: 0.82rem;
  color: rgb(148 163 184 / 0.95);
}

.quote-total-helper,
.quote-summary-note {
  font-size: 0.69rem;
  line-height: 1.45;
  color: rgb(107 114 128 / 0.94);
}

.quote-summary-tile,
.quote-summary-panel {
  border-color: rgb(255 255 255 / 0.1);
  background: rgb(255 255 255 / 0.05);
}

.quote-summary-value {
  font-size: 1.1rem;
  line-height: 1.25;
  font-weight: 700;
  color: rgb(255 255 255 / 0.98);
}

.quote-summary-accent {
  color: rgb(251 146 60 / 0.98);
}

.quote-warning-panel {
  border-color: rgb(249 115 22 / 0.3);
  background: rgb(249 115 22 / 0.1);
}

.quote-primary-cta,
.quote-secondary-cta,
.quote-tertiary-cta {
  width: 100%;
  border-radius: 0.95rem;
  transition: background-color 150ms ease, border-color 150ms ease, color 150ms ease, opacity 150ms ease;
}

.quote-primary-cta:disabled,
.quote-secondary-cta:disabled,
.quote-tertiary-cta:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.quote-primary-cta {
  background: rgb(249 115 22 / 1);
  padding: 0.95rem 1rem;
  font-size: 0.94rem;
  font-weight: 700;
  color: white;
}

.quote-secondary-cta {
  border: 1px solid rgb(255 255 255 / 0.28);
  background: rgb(255 255 255 / 0.05);
  padding: 0.8rem 1rem;
  font-size: 0.92rem;
  font-weight: 600;
  color: white;
}

.quote-tertiary-cta {
  background: transparent;
  padding: 0.1rem;
  font-size: 0.78rem;
  color: rgb(156 163 175 / 0.96);
}

@media (max-width: 639px) {
  .quote-total-amount {
    font-size: 1.8rem;
  }
}
</style>
