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
      <CalculatorFormGrid @submit="previewBooklet">
        <CalculatorFieldGroup v-if="props.fixedShopSlug" label="Shop">
          <UInput :model-value="selectedShopName" :ui="inputUi" readonly disabled />
        </CalculatorFieldGroup>
        <CalculatorFieldGroup v-else label="Shop">
          <USelectMenu
            v-model="selectedShopSlug"
            :items="shopOptions"
            value-key="value"
            label-key="label"
            :ui="selectUi"
            portal="body"
            class="w-full"
            placeholder="Select a print shop"
          />
        </CalculatorFieldGroup>

        <div class="grid gap-4 md:grid-cols-2">
          <CalculatorFieldGroup label="Product title">
            <UInput v-model="productTitle" :ui="inputUi" placeholder="Product title" />
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
          <CalculatorFieldGroup label="Turnaround">
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
            <USelectMenu :model-value="coverPaperType ?? undefined" :items="coverPaperTypeOptions" value-key="value" label-key="label" :ui="selectUi" portal="body" class="w-full" @update:model-value="coverPaperType = normalizeStringValue($event)" />
          </CalculatorFieldGroup>
          <CalculatorFieldGroup label="Cover print sides">
            <USelectMenu v-model="coverSides" :items="sidesOptions" value-key="value" label-key="label" :ui="selectUi" portal="body" class="w-full" />
          </CalculatorFieldGroup>
        </div>

        <div class="grid gap-4 md:grid-cols-2">
          <CalculatorFieldGroup label="Cover color mode">
            <USelectMenu v-model="coverColorMode" :items="colorModeOptions" value-key="value" label-key="label" :ui="selectUi" portal="body" class="w-full" />
          </CalculatorFieldGroup>
          <CalculatorFieldGroup label="Cover paper gsm">
            <USelectMenu :model-value="coverPaperGsm ?? undefined" :items="coverPaperGsmOptions" value-key="value" label-key="label" :ui="selectUi" portal="body" class="w-full" @update:model-value="coverPaperGsm = normalizeNumber($event)" />
          </CalculatorFieldGroup>
        </div>

        <div class="grid gap-4 md:grid-cols-2">
          <CalculatorFieldGroup label="Cover finishing">
            <USelectMenu v-model="coverLaminationMode" :items="laminationModeOptions" value-key="value" label-key="label" :ui="selectUi" portal="body" class="w-full" />
          </CalculatorFieldGroup>
          <CalculatorFieldGroup label="Inserts color mode">
            <USelectMenu v-model="insertColorMode" :items="colorModeOptions" value-key="value" label-key="label" :ui="selectUi" portal="body" class="w-full" />
          </CalculatorFieldGroup>
        </div>

        <div class="grid gap-4 md:grid-cols-2">
          <CalculatorFieldGroup label="Inserts paper type">
            <USelectMenu :model-value="insertPaperType ?? undefined" :items="insertPaperTypeOptions" value-key="value" label-key="label" :ui="selectUi" portal="body" class="w-full" @update:model-value="insertPaperType = normalizeStringValue($event)" />
          </CalculatorFieldGroup>
          <CalculatorFieldGroup label="Inserts paper gsm">
            <USelectMenu :model-value="insertPaperGsm ?? undefined" :items="insertPaperGsmOptions" value-key="value" label-key="label" :ui="selectUi" portal="body" class="w-full" @update:model-value="insertPaperGsm = normalizeNumber($event)" />
          </CalculatorFieldGroup>
        </div>

        <CalculatorFieldGroup label="Sheet size">
          <USelectMenu :model-value="selectedSheetSize ?? undefined" :items="sheetSizeOptions" value-key="value" label-key="label" :ui="selectUi" portal="body" class="w-full" @update:model-value="selectedSheetSize = normalizeStringValue($event)" />
        </CalculatorFieldGroup>

        <CalculatorFieldGroup label="Custom brief">
          <UTextarea v-model="customBrief" :ui="{ base: 'w-full px-4 py-2 text-sm min-h-[7rem]' }" :rows="3" placeholder="Describe the booklet brief, cover expectations, and delivery notes." />
        </CalculatorFieldGroup>

        <CalculatorFieldGroup label="Final finishings">
          <FinishingSelector
            :groups="finalFinishingGroups"
            :lamination-sides="[{ label: 'Front only', value: 'front' }, { label: 'Back only', value: 'back' }, { label: 'Both sides', value: 'both' }]"
            :select-ui="selectUi"
            :is-selected="isFinalFinishingSelected"
            :show-side-selector="() => false"
            :get-side="selectedFinalFinishingSide"
            @toggle="toggleFinalFinishing"
            @update-side="updateFinalFinishingSide"
          />
        </CalculatorFieldGroup>

        <div class="flex items-center gap-2">
          <button
            type="button"
            class="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-slate-200 transition-colors hover:border-flamingo-300/70 hover:bg-white/[0.08] hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
            :disabled="previewLoading || !canPreview"
            title="Preview booklet pricing"
            aria-label="Preview booklet pricing"
            @click="previewBooklet"
          >
            <UIcon :name="previewLoading ? 'i-lucide-loader-circle' : 'i-lucide-refresh-cw'" :class="previewLoading ? 'h-4 w-4 animate-spin' : 'h-4 w-4'" />
          </button>
          <button
            type="button"
            class="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-slate-200 transition-colors hover:border-white/20 hover:bg-white/[0.08] hover:text-white"
            title="Reset booklet calculator"
            aria-label="Reset booklet calculator"
            @click="resetBookletForm"
          >
            <UIcon name="i-lucide-rotate-ccw" class="h-4 w-4" />
          </button>
          <button
            type="button"
            class="inline-flex min-h-11 flex-1 items-center justify-center rounded-full bg-flamingo-500 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-flamingo-400 disabled:cursor-not-allowed disabled:opacity-50"
            :disabled="!preview || savingDraft"
            @click="saveDraft"
          >
            <UIcon name="i-lucide-arrow-up-right" class="mr-2 h-4 w-4" />
            Save to workspace
          </button>
        </div>
      </CalculatorFormGrid>
    </template>

    <template #preview>
      <div class="space-y-4">
        <div
          v-if="showPreviewSwitcher"
          class="rounded-2xl border border-white/10 bg-white/[0.04] p-2.5 shadow-[0_18px_42px_rgba(0,0,0,0.18)] backdrop-blur-sm"
        >
          <CalculatorTypeSwitcher
            :model-value="calculatorType ?? undefined"
            :options="calculatorTypeOptions"
            size="sm"
            tone="embedded"
            @update:model-value="emit('update:calculatorType', $event)"
          />
        </div>

        <QuotePreviewPanel>
          <div class="space-y-4">
            <QuotePreviewMeta title="Booklet summary" :lines="summaryLines" placeholder="Choose a shop and booklet details to unlock the backend booklet preview." />
            <QuotePreviewRequirementsState v-if="missingItems.length" title="Complete these details" :items="missingItems" helper="Booklet pricing uses shop papers and finishing rates, so the backend needs these inputs first." />

            <div v-else-if="preview" class="space-y-4">
              <div class="grid gap-4 md:grid-cols-2">
                <article class="rounded-2xl border border-[var(--p-border)] bg-[var(--p-surface-sunken)] p-4">
                  <p class="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--p-text-muted)]">Total</p>
                  <p class="mt-2 text-2xl font-extrabold text-[var(--p-text)]">{{ previewGrandTotal }}</p>
                  <p v-if="preview.human_ready_text" class="mt-1 text-sm text-[var(--p-text-muted)]">{{ preview.human_ready_text }}</p>
                </article>
                <article class="rounded-2xl border border-[var(--p-border)] bg-[var(--p-surface-sunken)] p-4">
                  <p class="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--p-text-muted)]">Per booklet</p>
                  <p class="mt-2 text-2xl font-extrabold text-[var(--p-text)]">{{ previewTotalPerBooklet }}</p>
                  <p v-if="preview.turnaround_text" class="mt-1 text-sm text-[var(--p-text-muted)]">{{ preview.turnaround_text }}</p>
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

              <div v-if="preview.warnings?.length || preview.assumptions?.length" class="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
                <p class="font-semibold">Booklet notes</p>
                <ul class="mt-2 space-y-1">
                  <li v-for="warning in preview.warnings || []" :key="warning">{{ warning }}</li>
                  <li v-for="assumption in preview.assumptions || []" :key="assumption">{{ assumption }}</li>
                </ul>
              </div>
            </div>

            <div v-else class="rounded-2xl border border-dashed border-[var(--p-border)] bg-[var(--p-surface-sunken)] p-6 text-sm text-[var(--p-text-muted)]">
              Preview pricing to see the cover, inserts, binding, total, and turnaround sections.
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
import { API } from '~/shared/api-paths'
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
import { getCatalog, getShopCustomOptions, listShops, type ShopCustomOptionsResponse } from '~/services/public'
import { useAuthStore } from '~/stores/auth'
import type { CalculatorType, CalculatorTypeOption } from '~/utils/calculatorTypes'
import { getPreviewMoney } from '~/utils/calculationResult'
import { buildCalculatorPaperCatalog, filterCalculatorPaperGsms, filterCalculatorPaperTypes, findCalculatorPaperRecord, type CalculatorPaperRecord } from '~/utils/calculatorPaperCatalog'
import { createSharedCalculatorRequest, toBookletCalculatorPayload, toBookletCalculatorSnapshot } from '~/utils/sharedCalculatorRequest'
import { convertInputToMm, convertMmToDisplay, formatSizeSummary, getSizePreset, inferSizePresetLabel, sizePresets, type SizeInputUnit, type SizeMode } from '~/utils/size'

type ShopOption = { value: string; label: string; id: number }
type PaperOption = { value: number; label: string }
type FinishingOption = { id: number; name: string; slug?: string; category?: string | null; price?: string }

const props = withDefaults(defineProps<{
  title: string
  description: string
  eyebrow?: string
  fixedShopSlug?: string | null
  fixedShopName?: string | null
  anchorId?: string
  compact?: boolean
  calculatorType?: CalculatorType | null
  calculatorTypeOptions?: CalculatorTypeOption[]
  calculatorSwitcherPlacement?: 'header' | 'preview'
}>(), {
  eyebrow: 'Booklet Calculator',
  fixedShopSlug: null,
  fixedShopName: null,
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
const authStore = useAuthStore()
const toast = useToast()
const { $api } = useNuxtApp()
const showEmbeddedCalculatorTypes = computed(() => Boolean(props.calculatorType && props.calculatorTypeOptions.length))
const showHeaderContent = computed(() => Boolean(props.eyebrow || props.title || props.description))
const showHeaderSwitcher = computed(() => showEmbeddedCalculatorTypes.value && props.calculatorSwitcherPlacement === 'header')
const showPreviewSwitcher = computed(() => showEmbeddedCalculatorTypes.value && props.calculatorSwitcherPlacement === 'preview')

const shopOptions = ref<ShopOption[]>([])
const selectedShopSlug = ref<string | null>(props.fixedShopSlug)
const selectedShopName = ref(props.fixedShopName || '')
const selectedShopId = ref<number | null>(null)
const paperOptions = ref<PaperOption[]>([])
const paperCatalog = ref<CalculatorPaperRecord[]>([])
const finishingOptions = ref<FinishingOption[]>([])
const productTitle = ref('')
const customBrief = ref('')

const sizeMode = ref<SizeMode>('standard')
const sizeLabel = ref('A5')
const inputUnit = ref<SizeInputUnit>('mm')
const widthInput = ref('')
const heightInput = ref('')
const widthMm = ref<number | null>(148)
const heightMm = ref<number | null>(210)
const quantity = ref(100)
const totalPages = ref(12)
const selectedSheetSize = ref<string | null>(null)
const coverPaperType = ref<string | null>(null)
const coverPaperGsm = ref<number | null>(null)
const insertPaperType = ref<string | null>(null)
const insertPaperGsm = ref<number | null>(null)
const selectedCoverPaperId = ref<number | null>(null)
const selectedInsertPaperId = ref<number | null>(null)
const coverSides = ref<'SIMPLEX' | 'DUPLEX'>('DUPLEX')
const coverColorMode = ref<'BW' | 'COLOR'>('COLOR')
const insertColorMode = ref<'BW' | 'COLOR'>('COLOR')
const coverLaminationMode = ref<'none' | 'front' | 'both'>('none')
const bindingType = ref<'saddle_stitch' | 'perfect_bind' | 'wire_o'>('saddle_stitch')
const turnaroundHours = ref<number | null>(24)
const selectedFinalFinishings = ref<Array<{ finishing_rate_id: number; selected_side: 'front' | 'back' | 'both' }>>([])

const preview = ref<PreviewPriceResponse | null>(null)
const previewLoading = ref(false)
const savingDraft = ref(false)

const sizeModeOptions = [{ label: 'Standard size', value: 'standard' }, { label: 'Custom size', value: 'custom' }]
const sizePresetOptions = sizePresets.map((preset) => ({ label: preset.label, value: preset.label }))
const sizeUnitOptions = [{ label: 'mm', value: 'mm' }, { label: 'cm', value: 'cm' }, { label: 'm', value: 'm' }, { label: 'inches', value: 'in' }]
const sidesOptions = [{ label: 'Front only', value: 'SIMPLEX' }, { label: 'Both sides', value: 'DUPLEX' }]
const colorModeOptions = [{ label: 'Black and white', value: 'BW' }, { label: 'Full colour', value: 'COLOR' }]
const laminationModeOptions = [{ label: 'No cover finishing', value: 'none' }, { label: 'Front cover finishing', value: 'front' }, { label: 'Both-side cover finishing', value: 'both' }]
const bindingTypeOptions = [{ label: 'Saddle stitch', value: 'saddle_stitch' }, { label: 'Perfect bind', value: 'perfect_bind' }, { label: 'Wire-O', value: 'wire_o' }]
const sheetSizeOptions = computed(() => buildCalculatorPaperCatalog(paperCatalog.value).sheetSizes)
const coverPaperTypeOptions = computed(() => filterCalculatorPaperTypes(paperCatalog.value, selectedSheetSize.value))
const coverPaperGsmOptions = computed(() => filterCalculatorPaperGsms(paperCatalog.value, {
  sheetSize: selectedSheetSize.value,
  paperType: coverPaperType.value,
}))
const insertPaperTypeOptions = computed(() => filterCalculatorPaperTypes(paperCatalog.value, selectedSheetSize.value))
const insertPaperGsmOptions = computed(() => filterCalculatorPaperGsms(paperCatalog.value, {
  sheetSize: selectedSheetSize.value,
  paperType: insertPaperType.value,
}))

const laminationOptions = computed(() => finishingOptions.value.filter((option) => haystack(option).includes('lamination')))
const bindingOptions = computed(() => finishingOptions.value.filter((option) => {
  const text = haystack(option)
  return text.includes('bind') || text.includes('wire') || text.includes('stitch')
}))
const finalFinishingGroups = computed<Array<{ label: string; options: FinishingOption[] }>>(() => {
  const options = finishingOptions.value.filter((option) => {
    const text = haystack(option)
    return !text.includes('lamination') && !text.includes('bind') && !text.includes('wire') && !text.includes('stitch')
  })
  return options.length ? [{ label: 'Final finishings', options }] : []
})

const selectedLaminationRateId = computed<number | null>(() => {
  if (coverLaminationMode.value === 'none') return null
  return laminationOptions.value[0]?.id ?? null
})

const selectedBindingRateId = computed<number | null>(() => {
  const tokens = {
    saddle_stitch: ['saddle', 'stitch'],
    perfect_bind: ['perfect', 'bind'],
    wire_o: ['wire', 'wire-o', 'wireo'],
  }[bindingType.value]
  return bindingOptions.value.find((option) => tokens.some((token) => haystack(option).includes(token)))?.id ?? null
})

const previewGrandTotal = computed(() => getPreviewMoney(preview.value, 'grand_total') || 'Awaiting preview')

const canPreview = computed(() => Boolean(
  selectedShopId.value && widthMm.value && heightMm.value && quantity.value > 0 && totalPages.value >= 4
  && productTitle.value.trim()
  && selectedCoverPaperId.value && selectedInsertPaperId.value
  && (coverLaminationMode.value === 'none' || selectedLaminationRateId.value)
))

const missingItems = computed(() => {
  const items: string[] = []
  if (!selectedShopId.value) items.push('Select a shop')
  if (!productTitle.value.trim()) items.push('Add a product title')
  if (!widthMm.value || !heightMm.value) items.push('Set the finished size')
  if (!selectedSheetSize.value) items.push('Choose a sheet size')
  if (!selectedCoverPaperId.value) items.push('Choose a cover paper type and gsm')
  if (!selectedInsertPaperId.value) items.push('Choose an inserts paper type and gsm')
  if (coverLaminationMode.value !== 'none' && !selectedLaminationRateId.value) items.push('This shop needs an active lamination rate')
  return items
})

const summaryLines = computed(() => [
  { label: 'Product', value: productTitle.value || '' },
  { label: 'Finished size', value: formatSizeSummary(widthMm.value, heightMm.value, sizeLabel.value || null) || '' },
  { label: 'Quantity', value: `${quantity.value} booklet(s)` },
  { label: 'Total pages', value: `${totalPages.value} total page(s)` },
])

const previewTotalPerBooklet = computed(() => {
  const totals = preview.value?.totals as ({ total_per_booklet?: string; unit_price?: string } & Record<string, unknown>) | undefined
  return totals?.total_per_booklet || totals?.unit_price || 'Awaiting preview'
})

const coverSummary = computed(() => {
  const section = preview.value?.breakdown?.cover as Record<string, unknown> | undefined
  const paper = section?.paper as Record<string, unknown> | undefined
  const totals = section?.totals as Record<string, unknown> | undefined
  return `Stock: ${String(paper?.label || 'Not priced')} | Printing: ${String(totals?.print_cost || '0.00')} | Lamination: ${String(totals?.finishing_total || '0.00')} | Subtotal: ${String(totals?.subtotal || '0.00')}`
})

const insertSummary = computed(() => {
  const section = preview.value?.breakdown?.inserts as Record<string, unknown> | undefined
  const paper = section?.paper as Record<string, unknown> | undefined
  const totals = section?.totals as Record<string, unknown> | undefined
  const booklet = preview.value?.breakdown?.booklet as Record<string, unknown> | undefined
  return `Stock: ${String(paper?.label || 'Not priced')} | Printing: ${String(totals?.print_cost || '0.00')} | ${String(booklet?.insert_sheets_per_booklet || 0)} insert sheet(s) per booklet | Subtotal: ${String(totals?.subtotal || '0.00')}`
})

const bindingSummary = computed(() => {
  const section = preview.value?.breakdown?.binding as Record<string, unknown> | undefined
  return `${String(section?.label || 'Binding')} | Total: ${String(section?.total || '0.00')}`
})

const turnaroundSummary = computed(() => `${preview.value?.turnaround_text || 'On request'} | ${preview.value?.human_ready_text || 'Ready on request'}`)

watch(selectedShopSlug, async (slug) => {
  preview.value = null
  if (!slug) return
  await loadShopContext(slug)
}, { immediate: true })

// Cascade: when sheet size changes, reset paper type + GSM if no longer valid for that size.
watch(selectedSheetSize, () => {
  const validCoverTypes = coverPaperTypeOptions.value.map((o) => o.value)
  if (coverPaperType.value && !validCoverTypes.includes(coverPaperType.value)) {
    coverPaperType.value = validCoverTypes[0] ?? null
  }
  const validInsertTypes = insertPaperTypeOptions.value.map((o) => o.value)
  if (insertPaperType.value && !validInsertTypes.includes(insertPaperType.value)) {
    insertPaperType.value = validInsertTypes[0] ?? null
  }
})

// Cascade: when paper type changes, reset GSM if no longer valid for that type.
watch(coverPaperType, () => {
  const validGsms = coverPaperGsmOptions.value.map((o) => o.value)
  if (coverPaperGsm.value !== null && !validGsms.includes(coverPaperGsm.value)) {
    coverPaperGsm.value = validGsms[0] ?? null
  }
})
watch(insertPaperType, () => {
  const validGsms = insertPaperGsmOptions.value.map((o) => o.value)
  if (insertPaperGsm.value !== null && !validGsms.includes(insertPaperGsm.value)) {
    insertPaperGsm.value = validGsms[0] ?? null
  }
})

watch([selectedSheetSize, coverPaperType, coverPaperGsm], () => {
  selectedCoverPaperId.value = findCalculatorPaperRecord(paperCatalog.value, {
    sheetSize: selectedSheetSize.value,
    paperType: coverPaperType.value,
    gsm: coverPaperGsm.value,
  })?.id ?? null
})

watch([selectedSheetSize, insertPaperType, insertPaperGsm], () => {
  selectedInsertPaperId.value = findCalculatorPaperRecord(paperCatalog.value, {
    sheetSize: selectedSheetSize.value,
    paperType: insertPaperType.value,
    gsm: insertPaperGsm.value,
  })?.id ?? null
})

onMounted(async () => {
  await loadShops()
  syncPresetToInputs()
})

async function loadShops() {
  const shops = await listShops()
  shopOptions.value = shops.map((shop) => ({ value: shop.slug, label: shop.name, id: shop.id }))
  if (props.fixedShopSlug) {
    const fixed = shopOptions.value.find((shop) => shop.value === props.fixedShopSlug)
    selectedShopId.value = fixed?.id ?? null
    selectedShopName.value = props.fixedShopName || fixed?.label || props.fixedShopSlug
    selectedShopSlug.value = props.fixedShopSlug
    return
  }
  if (!selectedShopSlug.value && shopOptions.value.length) selectedShopSlug.value = shopOptions.value[0]!.value
}

async function loadShopContext(shopSlug: string) {
  const shop = shopOptions.value.find((entry) => entry.value === shopSlug)
  selectedShopId.value = shop?.id ?? null
  selectedShopName.value = props.fixedShopName || shop?.label || shopSlug
  const [catalog, options] = await Promise.all([getCatalog(shopSlug), getShopCustomOptions(shopSlug)])
  if (!selectedShopId.value && catalog?.shop?.id) selectedShopId.value = catalog.shop.id
  paperCatalog.value = buildCalculatorPaperCatalog(options.available_papers ?? []).records
  paperOptions.value = paperCatalog.value.map((paper) => ({ value: paper.id, label: paper.label }))
  finishingOptions.value = normalizeFinishings(options)
  const firstPaper = paperCatalog.value[0] ?? null
  selectedSheetSize.value = selectedSheetSize.value || firstPaper?.sheetSize || null
  coverPaperType.value = coverPaperType.value || firstPaper?.paperType || null
  coverPaperGsm.value = coverPaperGsm.value || firstPaper?.gsm || null
  insertPaperType.value = insertPaperType.value || firstPaper?.paperType || null
  insertPaperGsm.value = insertPaperGsm.value || firstPaper?.gsm || null
  selectedCoverPaperId.value = findCalculatorPaperRecord(paperCatalog.value, {
    sheetSize: selectedSheetSize.value,
    paperType: coverPaperType.value,
    gsm: coverPaperGsm.value,
  })?.id ?? null
  selectedInsertPaperId.value = findCalculatorPaperRecord(paperCatalog.value, {
    sheetSize: selectedSheetSize.value,
    paperType: insertPaperType.value,
    gsm: insertPaperGsm.value,
  })?.id ?? null
}

function normalizeFinishings(options: ShopCustomOptionsResponse): FinishingOption[] {
  return (options.available_finishings ?? []).map((finishing) => ({
    id: finishing.id,
    name: finishing.name,
    slug: finishing.slug,
    category: finishing.category,
    price: finishing.price,
  }))
}

function resetBookletForm() {
  productTitle.value = ''
  customBrief.value = ''
  quantity.value = 100
  totalPages.value = 12
  bindingType.value = 'saddle_stitch'
  turnaroundHours.value = 24
  coverSides.value = 'DUPLEX'
  coverColorMode.value = 'COLOR'
  insertColorMode.value = 'COLOR'
  coverLaminationMode.value = 'none'
  sizeMode.value = 'standard'
  sizeLabel.value = 'A5'
  inputUnit.value = 'mm'
  widthMm.value = 148
  heightMm.value = 210
  widthInput.value = ''
  heightInput.value = ''
  syncPresetToInputs()
  selectedSheetSize.value = sheetSizeOptions.value[0]?.value ?? null
  coverPaperType.value = coverPaperTypeOptions.value[0]?.value ?? null
  coverPaperGsm.value = coverPaperGsmOptions.value[0]?.value ?? null
  insertPaperType.value = insertPaperTypeOptions.value[0]?.value ?? null
  insertPaperGsm.value = insertPaperGsmOptions.value[0]?.value ?? null
  selectedFinalFinishings.value = []
  selectedCoverPaperId.value = findCalculatorPaperRecord(paperCatalog.value, { sheetSize: selectedSheetSize.value, paperType: coverPaperType.value, gsm: coverPaperGsm.value })?.id ?? null
  selectedInsertPaperId.value = findCalculatorPaperRecord(paperCatalog.value, { sheetSize: selectedSheetSize.value, paperType: insertPaperType.value, gsm: insertPaperGsm.value })?.id ?? null
  preview.value = null
}

function haystack(option: FinishingOption) {
  return `${option.name || ''} ${option.slug || ''} ${option.category || ''}`.trim().toLowerCase()
}

function isFinalFinishingSelected(finishingId: number) {
  return selectedFinalFinishings.value.some((entry) => entry.finishing_rate_id === finishingId)
}

function selectedFinalFinishingSide(finishingId: number) {
  return selectedFinalFinishings.value.find((entry) => entry.finishing_rate_id === finishingId)?.selected_side ?? 'both'
}

function toggleFinalFinishing(finishing: Record<string, unknown>) {
  const finishingId = Number(finishing.id)
  selectedFinalFinishings.value = isFinalFinishingSelected(finishingId)
    ? selectedFinalFinishings.value.filter((entry) => entry.finishing_rate_id !== finishingId)
    : [...selectedFinalFinishings.value, { finishing_rate_id: finishingId, selected_side: 'both' }]
}

function updateFinalFinishingSide(finishingId: number, value: unknown) {
  const normalized = (typeof value === 'string' ? value : 'both') as 'front' | 'back' | 'both'
  selectedFinalFinishings.value = selectedFinalFinishings.value.map((entry) =>
    entry.finishing_rate_id === finishingId ? { ...entry, selected_side: normalized } : entry,
  )
}

function normalizeNumber(value: unknown, minimum = 0) {
  const parsed = Number(value)
  if (!Number.isFinite(parsed)) return null
  return Math.max(minimum, Math.round(parsed))
}

function normalizeInteger(value: unknown, minimum: number) {
  return normalizeNumber(value, minimum) ?? minimum
}

function normalizeStringValue(value: unknown) {
  if (typeof value === 'string' && value.trim()) return value
  return null
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

function handleInputUnitChange(value: unknown) {
  const normalized = normalizeStringValue(value)
  if (!normalized || !['mm', 'cm', 'm', 'in'].includes(normalized)) return
  inputUnit.value = normalized as SizeInputUnit
  syncPresetToInputs()
}

function handleWidthChange(value: unknown) {
  widthInput.value = value == null ? '' : String(value)
  widthMm.value = convertInputToMm(widthInput.value, inputUnit.value)
}

function handleHeightChange(value: unknown) {
  heightInput.value = value == null ? '' : String(value)
  heightMm.value = convertInputToMm(heightInput.value, inputUnit.value)
}

function syncPresetToInputs() {
  if (sizeMode.value === 'standard') {
    const preset = getSizePreset(sizeLabel.value || 'A5')
    if (preset) {
      widthMm.value = preset.widthMm
      heightMm.value = preset.heightMm
    }
  }
  widthInput.value = convertMmToDisplay(widthMm.value, inputUnit.value)
  heightInput.value = convertMmToDisplay(heightMm.value, inputUnit.value)
  if (sizeMode.value === 'standard') {
    const inferred = inferSizePresetLabel(widthMm.value, heightMm.value)
    if (inferred) sizeLabel.value = inferred
  }
}

function buildSharedBookletRequest() {
  const request = createSharedCalculatorRequest('booklet')
  request.productTitle = productTitle.value.trim()
  request.quantity = quantity.value
  request.sizeMode = sizeMode.value
  request.sizeLabel = sizeLabel.value
  request.inputUnit = inputUnit.value
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

function buildPreviewPayload() {
  const request = buildSharedBookletRequest()
  return toBookletCalculatorPayload(request, {
    shop: selectedShopId.value,
    coverPaper: selectedCoverPaperId.value,
    insertPaper: selectedInsertPaperId.value,
    coverLaminationFinishingRate: selectedLaminationRateId.value,
    bindingFinishingRate: selectedBindingRateId.value,
  })
}

async function previewBooklet() {
  if (!canPreview.value) return
  previewLoading.value = true
  try {
    preview.value = await $api<PreviewPriceResponse>(API.calculatorBookletPreview(), {
      method: 'POST',
      body: buildPreviewPayload(),
    })
  } catch (error) {
    toast.add({ title: 'Preview failed', description: error instanceof Error ? error.message : 'Could not price this booklet yet.', color: 'error' })
  } finally {
    previewLoading.value = false
  }
}

async function saveDraft() {
  if (!preview.value || !selectedShopId.value) return
  if (!authStore.isAuthenticated) {
    await navigateTo({ path: '/auth/login', query: { redirect: '/quote-draft' } })
    return
  }
  savingDraft.value = true
  try {
    const request = buildSharedBookletRequest()
    const calculatorSnapshot = toBookletCalculatorSnapshot(request, {
      shop: selectedShopId.value,
      coverPaper: selectedCoverPaperId.value,
      insertPaper: selectedInsertPaperId.value,
      coverLaminationFinishingRate: selectedLaminationRateId.value,
      bindingFinishingRate: selectedBindingRateId.value,
    })
    await $api(API.calculatorDrafts(), {
      method: 'POST',
      body: {
        title: request.productTitle || `Booklet - ${sizeLabel.value || formatSizeSummary(widthMm.value, heightMm.value, null)}`,
        shop: selectedShopId.value,
        calculator_inputs_snapshot: calculatorSnapshot,
        pricing_snapshot: preview.value,
        custom_product_snapshot: {
          quote_type: 'booklet',
          title: request.productTitle || 'Booklet job',
          spec_text: request.customBrief || `${totalPages.value} pages, ${bindingType.value}`,
        },
        request_details_snapshot: {
          source: 'booklet_calculator',
          selected_shop_slug: selectedShopSlug.value,
        },
      },
    })
    toast.add({ title: 'Saved to workspace', description: 'This booklet preview is now stored in your requests and quotes workspace.', color: 'success' })
  } catch (error) {
    toast.add({ title: 'Could not save draft', description: error instanceof Error ? error.message : 'Save failed.', color: 'error' })
  } finally {
    savingDraft.value = false
  }
}
</script>
