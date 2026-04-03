<template>
  <CalculatorShell :anchor-id="anchorId">
    <template #header>
      <CalculatorHeaderBlock :eyebrow="eyebrow" :title="title" :description="description" />
    </template>

    <template #form>
      <CalculatorFormGrid @submit="previewBooklet">
        <section class="space-y-4">
          <p class="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--p-text-muted)]">1. Shop & size</p>

          <CalculatorFieldGroup label="Print shop">
            <USelectMenu
              v-if="!fixedShopSlug"
              :model-value="selectedShopSlug || undefined"
              :items="shopOptions"
              value-key="value"
              label-key="label"
              :ui="selectUi"
              portal="body"
              class="w-full"
              @update:model-value="selectedShopSlug = normalizeStringValue($event)"
            />
            <UInput v-else :model-value="selectedShopName" :ui="inputUi" readonly disabled />
          </CalculatorFieldGroup>

          <div class="grid gap-4 md:grid-cols-2">
            <CalculatorFieldGroup label="Finished size mode">
              <USelectMenu
                :model-value="sizeMode"
                :items="sizeModeOptions"
                value-key="value"
                label-key="label"
                :ui="selectUi"
                portal="body"
                class="w-full"
                @update:model-value="handleSizeModeChange"
              />
            </CalculatorFieldGroup>
            <CalculatorFieldGroup :label="sizeMode === 'standard' ? 'Standard size' : 'Input unit'">
              <USelectMenu
                v-if="sizeMode === 'standard'"
                :model-value="sizeLabel"
                :items="sizePresetOptions"
                value-key="value"
                label-key="label"
                :ui="selectUi"
                portal="body"
                class="w-full"
                @update:model-value="handleSizePresetChange"
              />
              <USelectMenu
                v-else
                :model-value="inputUnit"
                :items="sizeUnitOptions"
                value-key="value"
                label-key="label"
                :ui="selectUi"
                portal="body"
                class="w-full"
                @update:model-value="handleInputUnitChange"
              />
            </CalculatorFieldGroup>
          </div>

          <div class="grid gap-4" :class="sizeMode === 'standard' ? 'md:grid-cols-3' : 'md:grid-cols-2'">
            <CalculatorFieldGroup v-if="sizeMode === 'standard'" label="Display unit">
              <USelectMenu
                :model-value="inputUnit"
                :items="sizeUnitOptions"
                value-key="value"
                label-key="label"
                :ui="selectUi"
                portal="body"
                class="w-full"
                @update:model-value="handleInputUnitChange"
              />
            </CalculatorFieldGroup>
            <CalculatorFieldGroup :label="`Width (${inputUnit})`">
              <UInput
                :model-value="widthInput || undefined"
                :ui="inputUi"
                type="number"
                min="0.1"
                step="0.01"
                :readonly="sizeMode === 'standard'"
                :disabled="sizeMode === 'standard'"
                @update:model-value="handleWidthChange"
              />
            </CalculatorFieldGroup>
            <CalculatorFieldGroup :label="`Height (${inputUnit})`">
              <UInput
                :model-value="heightInput || undefined"
                :ui="inputUi"
                type="number"
                min="0.1"
                step="0.01"
                :readonly="sizeMode === 'standard'"
                :disabled="sizeMode === 'standard'"
                @update:model-value="handleHeightChange"
              />
            </CalculatorFieldGroup>
          </div>
        </section>

        <section class="space-y-4">
          <p class="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--p-text-muted)]">2. Booklet structure</p>

          <div class="grid gap-4 md:grid-cols-2">
            <CalculatorFieldGroup label="Quantity">
              <UInput :model-value="quantity" :ui="inputUi" type="number" min="1" @update:model-value="quantity = normalizeInteger($event, 1)" />
            </CalculatorFieldGroup>
            <CalculatorFieldGroup label="Total pages">
              <UInput :model-value="totalPages" :ui="inputUi" type="number" min="4" @update:model-value="totalPages = normalizeInteger($event, 4)" />
            </CalculatorFieldGroup>
          </div>

          <div class="grid gap-4 md:grid-cols-2">
            <CalculatorFieldGroup label="Binding type">
              <USelectMenu v-model="bindingType" :items="bindingTypeOptions" value-key="value" label-key="label" :ui="selectUi" portal="body" class="w-full" />
            </CalculatorFieldGroup>
            <CalculatorFieldGroup label="Turnaround (working hours)">
              <UInput :model-value="turnaroundHours || undefined" :ui="inputUi" type="number" min="1" @update:model-value="turnaroundHours = normalizeNumber($event)" />
            </CalculatorFieldGroup>
          </div>
        </section>

        <section class="space-y-4">
          <p class="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--p-text-muted)]">3. Cover & inserts</p>

          <div class="grid gap-4 md:grid-cols-2">
            <CalculatorFieldGroup label="Cover stock">
              <USelectMenu :model-value="selectedCoverPaperId ?? undefined" :items="paperOptions" value-key="value" label-key="label" :ui="selectUi" portal="body" class="w-full" @update:model-value="selectedCoverPaperId = normalizeNumber($event)" />
            </CalculatorFieldGroup>
            <CalculatorFieldGroup label="Insert stock">
              <USelectMenu :model-value="selectedInsertPaperId ?? undefined" :items="paperOptions" value-key="value" label-key="label" :ui="selectUi" portal="body" class="w-full" @update:model-value="selectedInsertPaperId = normalizeNumber($event)" />
            </CalculatorFieldGroup>
          </div>

          <div class="grid gap-4 md:grid-cols-2">
            <CalculatorFieldGroup label="Cover print sides">
              <USelectMenu v-model="coverSides" :items="sidesOptions" value-key="value" label-key="label" :ui="selectUi" portal="body" class="w-full" />
            </CalculatorFieldGroup>
            <CalculatorFieldGroup label="Insert print sides">
              <USelectMenu v-model="insertSides" :items="sidesOptions" value-key="value" label-key="label" :ui="selectUi" portal="body" class="w-full" />
            </CalculatorFieldGroup>
          </div>

          <div class="grid gap-4 md:grid-cols-2">
            <CalculatorFieldGroup label="Cover lamination">
              <USelectMenu v-model="coverLaminationMode" :items="laminationModeOptions" value-key="value" label-key="label" :ui="selectUi" portal="body" class="w-full" />
            </CalculatorFieldGroup>
            <CalculatorFieldGroup label="Cover colour mode">
              <USelectMenu v-model="coverColorMode" :items="colorModeOptions" value-key="value" label-key="label" :ui="selectUi" portal="body" class="w-full" />
            </CalculatorFieldGroup>
          </div>

          <CalculatorFieldGroup label="Insert colour mode">
            <USelectMenu v-model="insertColorMode" :items="colorModeOptions" value-key="value" label-key="label" :ui="selectUi" portal="body" class="w-full" />
          </CalculatorFieldGroup>
        </section>

        <div class="flex flex-wrap gap-3">
          <UButton type="submit" :loading="previewLoading" :disabled="!canPreview">Preview booklet pricing</UButton>
          <UButton variant="soft" :disabled="!preview" :loading="savingDraft" @click="saveDraft">Save to workspace</UButton>
        </div>
      </CalculatorFormGrid>
    </template>

    <template #preview>
      <QuotePreviewPanel>
        <div class="space-y-4">
          <QuotePreviewMeta title="Booklet summary" :lines="summaryLines" placeholder="Choose a shop and booklet details to unlock the backend booklet preview." />
          <QuotePreviewRequirementsState v-if="missingItems.length" title="Complete these details" :items="missingItems" helper="Booklet pricing uses shop papers and finishing rates, so the backend needs these inputs first." />

          <div v-else-if="preview" class="space-y-4">
            <div class="grid gap-4 md:grid-cols-2">
              <article class="rounded-2xl border border-[var(--p-border)] bg-[var(--p-surface-sunken)] p-4">
                <p class="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--p-text-muted)]">Total</p>
                <p class="mt-2 text-2xl font-extrabold text-[var(--p-text)]">{{ previewGrandTotal }}</p>
                <p class="mt-1 text-sm text-[var(--p-text-muted)]">{{ preview.human_ready_text || 'Ready time appears after preview.' }}</p>
              </article>
              <article class="rounded-2xl border border-[var(--p-border)] bg-[var(--p-surface-sunken)] p-4">
                <p class="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--p-text-muted)]">Per booklet</p>
                <p class="mt-2 text-2xl font-extrabold text-[var(--p-text)]">{{ previewTotalPerBooklet }}</p>
                <p class="mt-1 text-sm text-[var(--p-text-muted)]">{{ preview.turnaround_text || 'Turnaround on request' }}</p>
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
    </template>
  </CalculatorShell>
</template>

<script setup lang="ts">
import { useToast } from '#imports'
import type { PreviewPriceResponse } from '~/shared/types/buyer'
import { API } from '~/shared/api-paths'
import { calculatorSelectUi } from '~/components/calculator/CalculatorSelectUi'
import CalculatorFieldGroup from '~/components/calculator/CalculatorFieldGroup.vue'
import CalculatorFormGrid from '~/components/calculator/CalculatorFormGrid.vue'
import CalculatorHeaderBlock from '~/components/calculator/CalculatorHeaderBlock.vue'
import CalculatorShell from '~/components/calculator/CalculatorShell.vue'
import QuotePreviewMeta from '~/components/calculator/QuotePreviewMeta.vue'
import QuotePreviewPanel from '~/components/calculator/QuotePreviewPanel.vue'
import QuotePreviewRequirementsState from '~/components/calculator/QuotePreviewRequirementsState.vue'
import { getCatalog, getShopCustomOptions, listShops, type ShopCustomOptionsResponse } from '~/services/public'
import { useAuthStore } from '~/stores/auth'
import { getPreviewMoney } from '~/utils/calculationResult'
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
}>(), {
  eyebrow: 'Booklet Calculator',
  fixedShopSlug: null,
  fixedShopName: null,
  anchorId: 'booklet-calculator',
})

const selectUi = calculatorSelectUi
const inputUi = { base: 'w-full px-4 text-sm' }
const authStore = useAuthStore()
const toast = useToast()
const { $api } = useNuxtApp()

const shopOptions = ref<ShopOption[]>([])
const selectedShopSlug = ref<string | null>(props.fixedShopSlug)
const selectedShopName = ref(props.fixedShopName || '')
const selectedShopId = ref<number | null>(null)
const paperOptions = ref<PaperOption[]>([])
const finishingOptions = ref<FinishingOption[]>([])

const sizeMode = ref<SizeMode>('standard')
const sizeLabel = ref('A5')
const inputUnit = ref<SizeInputUnit>('mm')
const widthInput = ref('')
const heightInput = ref('')
const widthMm = ref<number | null>(148)
const heightMm = ref<number | null>(210)
const quantity = ref(100)
const totalPages = ref(12)
const selectedCoverPaperId = ref<number | null>(null)
const selectedInsertPaperId = ref<number | null>(null)
const coverSides = ref<'SIMPLEX' | 'DUPLEX'>('DUPLEX')
const insertSides = ref<'SIMPLEX' | 'DUPLEX'>('DUPLEX')
const coverColorMode = ref<'BW' | 'COLOR'>('COLOR')
const insertColorMode = ref<'BW' | 'COLOR'>('COLOR')
const coverLaminationMode = ref<'none' | 'front' | 'both'>('none')
const bindingType = ref<'saddle_stitch' | 'perfect_bind' | 'wire_o'>('saddle_stitch')
const turnaroundHours = ref<number | null>(24)

const preview = ref<PreviewPriceResponse | null>(null)
const previewLoading = ref(false)
const savingDraft = ref(false)

const sizeModeOptions = [{ label: 'Standard size', value: 'standard' }, { label: 'Custom size', value: 'custom' }]
const sizePresetOptions = sizePresets.map((preset) => ({ label: preset.label, value: preset.label }))
const sizeUnitOptions = [{ label: 'mm', value: 'mm' }, { label: 'cm', value: 'cm' }, { label: 'inches', value: 'in' }]
const sidesOptions = [{ label: 'Front only', value: 'SIMPLEX' }, { label: 'Both sides', value: 'DUPLEX' }]
const colorModeOptions = [{ label: 'Black and white', value: 'BW' }, { label: 'Full colour', value: 'COLOR' }]
const laminationModeOptions = [{ label: 'No lamination', value: 'none' }, { label: 'Front only', value: 'front' }, { label: 'Both sides', value: 'both' }]
const bindingTypeOptions = [{ label: 'Saddle stitch', value: 'saddle_stitch' }, { label: 'Perfect bind', value: 'perfect_bind' }, { label: 'Wire-O', value: 'wire_o' }]

const laminationOptions = computed(() => finishingOptions.value.filter((option) => haystack(option).includes('lamination')))
const bindingOptions = computed(() => finishingOptions.value.filter((option) => {
  const text = haystack(option)
  return text.includes('bind') || text.includes('wire') || text.includes('stitch')
}))

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
  && selectedCoverPaperId.value && selectedInsertPaperId.value && selectedBindingRateId.value
  && (coverLaminationMode.value === 'none' || selectedLaminationRateId.value)
))

const missingItems = computed(() => {
  const items: string[] = []
  if (!selectedShopId.value) items.push('Choose a shop')
  if (!widthMm.value || !heightMm.value) items.push('Set the finished size')
  if (!selectedCoverPaperId.value) items.push('Choose a cover stock')
  if (!selectedInsertPaperId.value) items.push('Choose an insert stock')
  if (!selectedBindingRateId.value) items.push('This shop needs a binding rate for the selected binding type')
  if (coverLaminationMode.value !== 'none' && !selectedLaminationRateId.value) items.push('This shop needs an active lamination rate')
  return items
})

const summaryLines = computed(() => [
  { label: 'Shop', value: selectedShopName.value || '' },
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

const turnaroundSummary = computed(() => `${preview.value?.turnaround_text || 'On request'} | ${preview.value?.human_ready_text || 'Ready time on request'}`)

watch(selectedShopSlug, async (slug) => {
  preview.value = null
  if (!slug) return
  await loadShopContext(slug)
}, { immediate: true })

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
  paperOptions.value = (options.available_papers ?? []).map((paper) => ({ value: paper.id, label: `${paper.sheet_size} ${paper.gsm}gsm ${paper.paper_type}` }))
  finishingOptions.value = normalizeFinishings(options)
  if (!selectedCoverPaperId.value && paperOptions.value.length) selectedCoverPaperId.value = paperOptions.value[0]!.value
  if (!selectedInsertPaperId.value && paperOptions.value.length) selectedInsertPaperId.value = paperOptions.value[0]!.value
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

function haystack(option: FinishingOption) {
  return `${option.name || ''} ${option.slug || ''} ${option.category || ''}`.trim().toLowerCase()
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
  if (!normalized || !['mm', 'cm', 'in'].includes(normalized)) return
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

function buildPreviewPayload() {
  return {
    shop: selectedShopId.value,
    quantity: quantity.value,
    total_pages: totalPages.value,
    binding_type: bindingType.value,
    cover_paper: selectedCoverPaperId.value,
    insert_paper: selectedInsertPaperId.value,
    cover_sides: coverSides.value,
    insert_sides: insertSides.value,
    cover_color_mode: coverColorMode.value,
    insert_color_mode: insertColorMode.value,
    cover_lamination_mode: coverLaminationMode.value,
    cover_lamination_finishing_rate: selectedLaminationRateId.value,
    binding_finishing_rate: selectedBindingRateId.value,
    turnaround_hours: turnaroundHours.value,
    size_mode: sizeMode.value,
    size_label: sizeLabel.value,
    input_unit: inputUnit.value,
    width_input: widthInput.value,
    height_input: heightInput.value,
    width_mm: widthMm.value,
    height_mm: heightMm.value,
  }
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
    await $api(API.calculatorDrafts(), {
      method: 'POST',
      body: {
        title: `Booklet - ${sizeLabel.value || formatSizeSummary(widthMm.value, heightMm.value, null)}`,
        shop: selectedShopId.value,
        calculator_inputs_snapshot: {
          quote_type: 'booklet',
          ...buildPreviewPayload(),
        },
        pricing_snapshot: preview.value,
        custom_product_snapshot: {
          quote_type: 'booklet',
          title: 'Booklet job',
          spec_text: `${totalPages.value} pages, ${bindingType.value}`,
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
