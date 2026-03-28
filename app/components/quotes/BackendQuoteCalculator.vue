<template>
  <section :id="anchorId" :data-calculator-mode="props.mode" :class="['quote-calc-root', compactMode ? 'quote-calc-root-mini' : 'quote-calc-root-max']">
    <div v-if="!compactMode" class="quote-calc-header">
      <p class="quote-console-eyebrow">
        {{ eyebrow }}
      </p>
      <h2 class="quote-calc-title">{{ title }}</h2>
      <p class="quote-calc-description">{{ description }}</p>
    </div>

    <div class="quote-console-shell">
      <div v-if="compactMode" class="quote-calc-header-compact mb-6">
        <p class="quote-console-eyebrow text-[0.65rem] opacity-80">
          {{ eyebrow }}
        </p>
        <h2 class="text-xl font-bold tracking-tight text-[var(--p-text)]">{{ title }}</h2>
        <p class="mt-1 text-sm leading-relaxed text-[var(--p-text-muted)]">{{ description }}</p>
      </div>

      <div class="quote-console-grid">
        <form ref="formRef" class="quote-form-column" @submit.prevent="previewQuote">
        <div v-if="props.mode === 'shop'" class="quote-form-section">
          <p class="quote-field-label">Quote mode</p>
          <div class="quote-toggle-row">
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

        <div v-if="props.mode !== 'hero'" class="quote-form-row quote-form-row-2col">
          <div class="quote-form-cell">
            <label class="quote-field-label">Client / enquirer</label>
            <UInput v-model="contactName" class="quote-console-control" placeholder="Client or company name" />
          </div>
          <div class="quote-form-cell">
            <label class="quote-field-label">Phone / contact</label>
            <UInput v-model="contactPhone" class="quote-console-control" placeholder="+254..." />
          </div>
        </div>

        <div v-if="props.mode === 'shop'" class="quote-form-section">
          <label class="quote-field-label">Email</label>
          <UInput v-model="contactEmail" class="quote-console-control" type="email" placeholder="name@example.com" />
        </div>

        <div class="quote-form-section">
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

        <div v-if="props.mode === 'client' && shopOptions.length > 1" class="quote-form-section">
          <label class="quote-field-label">Send to shops</label>
          <div class="quote-finishing-group quote-finishing-group-selection">
            <div class="quote-finishing-options">
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

        <div class="quote-form-row quote-form-row-2col">
          <div class="quote-form-cell">
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
          <div class="quote-form-cell">
            <label class="quote-field-label">Quantity</label>
            <UInput v-model="quantity" class="quote-console-control" type="number" min="1" />
          </div>
        </div>

        <div v-if="workspaceMode === 'custom'" class="quote-form-section">
          <label class="quote-field-label">Custom brief</label>
          <UTextarea
            v-model="customProductSpec"
            class="quote-console-control quote-console-textarea"
            :rows="3"
            placeholder="Describe the stock, finishing, and special handling."
          />
        </div>

        <div class="quote-form-row quote-form-row-2col">
          <div class="quote-form-cell">
            <label class="quote-field-label">Size</label>
            <UInput
              v-if="workspaceMode !== 'custom'"
              :model-value="sizeDisplayValue"
              class="quote-console-control"
              readonly
              disabled
            />
            <div v-else class="quote-size-split">
              <UInput v-model="customWidthMm" class="quote-console-control" type="number" min="1" placeholder="Width" />
              <UInput v-model="customHeightMm" class="quote-console-control" type="number" min="1" placeholder="Height" />
            </div>
          </div>
          <div class="quote-form-cell">
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

        <div class="quote-form-row quote-form-row-2col">
          <div class="quote-form-cell">
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
          <div class="quote-form-cell">
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

        <div v-if="machineOptions.length > 1 || props.mode === 'shop'" class="quote-form-section">
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

        <div v-if="props.mode === 'shop'" class="quote-form-section">
          <label class="quote-field-label">Turnaround</label>
          <UInput v-model="turnaroundDays" class="quote-console-control" type="number" min="1" placeholder="2 days" />
        </div>

        <div class="quote-form-section">
          <label class="quote-field-label">Finishing services</label>
          <div class="quote-finishing-shell">
            <div
              v-for="group in finishingGroups"
              :key="group.label"
              class="quote-finishing-group"
            >
              <p class="quote-finishing-group-label">{{ group.label }}</p>
              <div class="quote-finishing-options">
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
                class="quote-finishing-select"
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

        <div v-if="props.mode !== 'hero'" class="quote-form-section">
          <label class="quote-field-label">Notes</label>
          <UTextarea
            v-model="notes"
            class="quote-console-control quote-console-textarea"
            :rows="3"
            placeholder="Turnaround, delivery notes, or customer context"
          />
        </div>
      </form>

      <aside class="quote-preview-column">
        <div class="quote-preview-shell">
          <div id="quote-pdf-target" ref="quotePdfTargetRef" class="quote-preview-card">
            <div class="quote-preview-top">
              <p class="quote-preview-eyebrow">Quote Template</p>
              <h3 class="quote-preview-heading">Quote Preview</h3>
            </div>

            <div class="quote-preview-customer">
              <p class="quote-preview-customer-line">Name: <span>{{ contactName || selectedShopName }}</span></p>
              <p class="quote-preview-customer-line">Email: <span>{{ contactEmail || ' ' }}</span></p>
              <p class="quote-preview-customer-line">Phone: <span>{{ contactPhone || ' ' }}</span></p>
            </div>

            <p class="quote-preview-message">Sign in to save your details</p>

            <div class="quote-preview-summary">
              <p class="quote-preview-summary-title">{{ quoteProductLabel }}</p>
              <p class="quote-preview-summary-line">{{ quantitySummary }}</p>
              <p class="quote-preview-summary-line">{{ colorModeLabel }} - {{ sidesLabel }}</p>
              <p class="quote-preview-summary-line">{{ sizeDisplayValue }} - {{ selectedPaperLabel || 'Paper pending' }}</p>
              <p v-if="finishingSummaryLabel !== 'None'" class="quote-preview-summary-line">{{ finishingSummaryLabel }}</p>
            </div>

            <div v-if="selectedFinishings.length" class="quote-preview-breakdown">
              <div
                v-for="line in finishingBreakdownLines"
                :key="line.key"
                class="quote-preview-breakdown-row"
              >
                <span>{{ line.label }}</span>
                <span>{{ line.total }}</span>
              </div>
            </div>

            <div class="quote-preview-pricing">
              <div class="quote-preview-price-row">
                <span>Print subtotal</span>
                <strong>{{ printCostDisplay }}</strong>
              </div>
              <div class="quote-preview-price-row">
                <span>Finishing total</span>
                <strong>{{ finishingTotalDisplay }}</strong>
              </div>
            </div>

            <div class="quote-preview-total-block">
              <p class="quote-total-label">Estimated Total</p>
              <p class="quote-total-amount">{{ totalDisplay }}</p>
              <p class="quote-total-unit">{{ perUnitDisplay }}</p>
              <p class="quote-total-helper">{{ totalHelperLine }}</p>
            </div>
          </div>

          <div v-if="props.mode !== 'hero'" class="quote-insight-grid">
            <div class="quote-summary-tile">
              <p class="quote-summary-label">Turnaround</p>
              <p class="quote-summary-value">{{ turnaroundTileValue }}</p>
            </div>
            <div class="quote-summary-tile">
              <p class="quote-summary-label">{{ statTileLabel }}</p>
              <p class="quote-summary-value quote-summary-accent">{{ statTileValue }}</p>
              <p v-if="statTileNote" class="quote-summary-note">
                {{ statTileNote }}
              </p>
            </div>
          </div>

          <div v-if="props.mode !== 'hero' && outputSummaryLines.length" class="quote-summary-panel">
            <p class="quote-summary-heading">Product summary</p>
            <ul class="quote-summary-list">
              <li v-for="(line, index) in outputSummaryLines" :key="index">{{ line }}</li>
            </ul>
          </div>

          <p v-if="serviceNote && props.mode !== 'hero'" class="quote-helper-text quote-preview-service-note">
            {{ serviceNote }}
          </p>

          <div v-if="props.mode !== 'hero' && showPriceAdvice" class="quote-warning-panel">
            <p class="quote-warning-copy">
              Quantity below 500. Per-unit cost is usually higher at this level.
            </p>
          </div>

          <div :class="['quote-actions', compactMode ? 'quote-actions-stack' : 'quote-actions-row']">
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
      </aside>
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
const quotePdfTargetRef = ref<HTMLElement | null>(null)

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
const finishingOptions = ref<Array<Record<string, unknown>>>([])
const activeShopId = ref<number | null>(null)

const allowShopSelection = computed(() => !props.fixedShopSlug)
const compactMode = computed(() => props.mode === 'hero')
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
  base: 'quote-console-select-base relative min-w-0 w-full min-h-[3.65rem] overflow-hidden px-0 py-0 text-sm',
  trigger: 'flex min-w-0 w-full items-center gap-2 rounded-[1.05rem] bg-transparent px-4 py-3 pe-12 text-sm text-[var(--p-text)]',
  value: 'min-w-0 flex-1 truncate text-[var(--p-text)]',
  placeholder: 'min-w-0 flex-1 truncate text-[var(--p-text-muted)]',
  trailingIcon: 'pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[var(--p-text-muted)]',
  content: 'z-[240] overflow-hidden rounded-[1.1rem] border border-[var(--p-border)] bg-[var(--p-surface-raised)] text-[var(--p-text)] shadow-2xl',
  viewport: 'max-h-72 overflow-y-auto p-1',
  item: 'rounded-lg text-[var(--p-text)] data-highlighted:not-data-disabled:bg-[var(--p-surface-sunken)] data-highlighted:not-data-disabled:text-[var(--p-text)]',
  itemLabel: 'truncate',
  itemDescription: 'text-xs text-[var(--p-text-muted)]',
  empty: 'px-3 py-2 text-sm text-[var(--p-text-muted)]',
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
  const detail = await $publicApiNoAuth<Record<string, unknown>>(API.publicProductOptions(productId))
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

function isLamination(finishing: Record<string, unknown>) {
  const name = `${(finishing.slug as string) || ''} ${(finishing.name as string) || ''}`.toLowerCase()
  return name.includes('lamination') || (
    finishing.billing_basis === 'per_sheet'
    && finishing.side_mode === 'per_selected_side'
  )
}

function _finishingRuleLabel(finishing: Record<string, unknown>) {
  if (isLamination(finishing)) {
    return 'Per sheet per side'
  }

  const billingBasis = normalizeBillingBasis(finishing.billing_basis)
  if (billingBasis) {
    return billingBasisLabel(billingBasis)
  }

  return (finishing.display_unit_label as string) || (finishing.charge_unit as string) || 'Backend rule'
}

function _finishingHelpText(finishing: Record<string, unknown>) {
  if (isLamination(finishing)) {
    return 'Charged on good sheets for the selected side: front = 1, back = 1, both = 2.'
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
  const groups: Array<{ label: string; options: Array<Record<string, unknown>> }> = []
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
  if (!total || total === '0' || total === '0.00') return 'KES 0'
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
    return { label: 'Preview & download PDF', run: printPreview, disabled: !calculatorStore.preview }
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
  if (authStore.isClient) {
    return { label: 'Request this quote', run: sendDraft, disabled: !calculatorStore.preview }
  }
  return { label: 'Sign in to download PDF', run: signInForDraft, disabled: false }
})

const tertiaryAction = computed(() => {
  if (props.mode === 'shop') {
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
