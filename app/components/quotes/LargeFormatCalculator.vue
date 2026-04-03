<template>
  <CalculatorShell :anchor-id="anchorId">
    <template #header>
      <CalculatorHeaderBlock :eyebrow="eyebrow" :title="title" :description="description" />
    </template>

    <template #form>
      <CalculatorFormGrid @submit="previewLargeFormat">
        <section class="space-y-4">
          <p class="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--p-text-muted)]">1. Shop & product</p>

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
            <CalculatorFieldGroup label="Large-format subtype">
              <USelectMenu v-model="productSubtype" :items="subtypeOptions" value-key="value" label-key="label" :ui="selectUi" portal="body" class="w-full" />
            </CalculatorFieldGroup>
            <CalculatorFieldGroup label="Quantity">
              <UInput :model-value="quantity" :ui="inputUi" type="number" min="1" @update:model-value="quantity = normalizeInteger($event, 1)" />
            </CalculatorFieldGroup>
          </div>
        </section>

        <section class="space-y-4">
          <p class="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--p-text-muted)]">2. Finished size</p>

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
          <p class="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--p-text-muted)]">3. Material & finishing</p>

          <div class="grid gap-4 md:grid-cols-2">
            <CalculatorFieldGroup label="Material">
              <USelectMenu
                :model-value="selectedMaterialId ?? undefined"
                :items="materialOptions"
                value-key="value"
                label-key="label"
                :ui="selectUi"
                portal="body"
                class="w-full"
                @update:model-value="selectedMaterialId = normalizeNumber($event)"
              />
            </CalculatorFieldGroup>
            <CalculatorFieldGroup label="Optional hardware / stand">
              <USelectMenu
                :model-value="selectedHardwareRateId ?? undefined"
                :items="hardwareOptions"
                value-key="value"
                label-key="label"
                :ui="selectUi"
                portal="body"
                class="w-full"
                @update:model-value="selectedHardwareRateId = normalizeNumber($event)"
              />
            </CalculatorFieldGroup>
          </div>

          <div class="space-y-3">
            <p class="text-sm font-semibold text-[var(--p-text)]">Relevant finishing charges</p>
            <div v-if="finishingOptions.length" class="flex flex-wrap gap-2">
              <button
                v-for="option in finishingOptions"
                :key="option.id"
                type="button"
                class="rounded-full border px-3 py-2 text-sm transition"
                :class="selectedFinishingIds.includes(option.id) ? 'border-flamingo-300 bg-flamingo-50 text-flamingo-700' : 'border-[var(--p-border)] bg-[var(--p-surface)] text-[var(--p-text-muted)]'"
                @click="toggleFinishing(option.id)"
              >
                {{ option.name }}
              </button>
            </div>
            <p v-else class="text-sm text-[var(--p-text-muted)]">No active large-format finishings are configured for this shop yet.</p>
          </div>
        </section>

        <section class="space-y-4">
          <p class="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--p-text-muted)]">4. Turnaround</p>

          <CalculatorFieldGroup label="Turnaround (working hours)">
            <UInput :model-value="turnaroundHours || undefined" :ui="inputUi" type="number" min="1" @update:model-value="turnaroundHours = normalizeNumber($event)" />
          </CalculatorFieldGroup>
        </section>

        <div class="flex flex-wrap gap-3">
          <UButton type="submit" :loading="previewLoading" :disabled="!canPreview">Preview large-format pricing</UButton>
          <UButton variant="soft" :disabled="!preview" :loading="savingDraft" @click="saveDraft">Save to workspace</UButton>
        </div>
      </CalculatorFormGrid>
    </template>

    <template #preview>
      <QuotePreviewPanel>
        <div class="space-y-4">
          <QuotePreviewMeta title="Large-format summary" :lines="summaryLines" placeholder="Choose a shop, subtype, size, and material to unlock the backend preview." />
          <QuotePreviewRequirementsState v-if="missingItems.length" title="Complete these details" :items="missingItems" helper="Large-format pricing uses backend material, print, finishing, and turnaround rules for the selected shop." />

          <div v-else-if="preview" class="space-y-4">
            <div class="grid gap-4 md:grid-cols-2">
              <article class="rounded-2xl border border-[var(--p-border)] bg-[var(--p-surface-sunken)] p-4">
                <p class="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--p-text-muted)]">Total</p>
                <p class="mt-2 text-2xl font-extrabold text-[var(--p-text)]">{{ previewGrandTotal }}</p>
                <p class="mt-1 text-sm text-[var(--p-text-muted)]">{{ preview.human_ready_text || 'Ready time appears after preview.' }}</p>
              </article>
              <article class="rounded-2xl border border-[var(--p-border)] bg-[var(--p-surface-sunken)] p-4">
                <p class="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--p-text-muted)]">Per piece</p>
                <p class="mt-2 text-2xl font-extrabold text-[var(--p-text)]">{{ preview.totals?.total_per_piece || preview.totals?.unit_price || 'Awaiting preview' }}</p>
                <p class="mt-1 text-sm text-[var(--p-text-muted)]">{{ preview.turnaround_text || 'Turnaround on request' }}</p>
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
                <p class="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--p-text-muted)]">Hardware / stand</p>
                <p class="mt-3 text-sm text-[var(--p-text)]">{{ hardwareSummary }}</p>
              </article>
            </div>

            <div class="grid gap-4 lg:grid-cols-2">
              <article class="rounded-2xl border border-[var(--p-border)] bg-[var(--p-surface-sunken)] p-4">
                <p class="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--p-text-muted)]">Area & layout</p>
                <p class="mt-3 text-sm text-[var(--p-text)]">{{ layoutSummary }}</p>
              </article>
              <article class="rounded-2xl border border-[var(--p-border)] bg-[var(--p-surface-sunken)] p-4">
                <p class="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--p-text-muted)]">Turnaround</p>
                <p class="mt-3 text-sm text-[var(--p-text)]">{{ turnaroundSummary }}</p>
              </article>
            </div>

            <div v-if="preview.warnings?.length || preview.assumptions?.length" class="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
              <p class="font-semibold">Large-format notes</p>
              <ul class="mt-2 space-y-1">
                <li v-for="warning in preview.warnings || []" :key="warning">{{ warning }}</li>
                <li v-for="assumption in preview.assumptions || []" :key="assumption">{{ assumption }}</li>
              </ul>
            </div>
          </div>

          <div v-else class="rounded-2xl border border-dashed border-[var(--p-border)] bg-[var(--p-surface-sunken)] p-6 text-sm text-[var(--p-text-muted)]">
            Preview pricing to see the area, material, printing, finishing, total, and turnaround sections.
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
import { getShopCustomOptions, listShops, type ShopCustomOptionsResponse } from '~/services/public'
import { useAuthStore } from '~/stores/auth'
import { getPreviewMoney } from '~/utils/calculationResult'
import { convertInputToMm, convertMmToDisplay, formatSizeSummary, getSizePreset, inferSizePresetLabel, sizePresets, type SizeInputUnit, type SizeMode } from '~/utils/size'

type ShopOption = { value: string; label: string; id: number }
type MaterialOption = { value: number; label: string; printPricePerSqm?: string | null }
type FinishingOption = { id: number; name: string; slug?: string; category?: string | null; price?: string }
type LargeFormatSubtype = 'banner' | 'sticker' | 'roll_up_banner' | 'poster' | 'mounted_board'

const props = withDefaults(defineProps<{
  title: string
  description: string
  eyebrow?: string
  fixedShopSlug?: string | null
  fixedShopName?: string | null
  anchorId?: string
}>(), {
  eyebrow: 'Large Format Calculator',
  fixedShopSlug: null,
  fixedShopName: null,
  anchorId: 'large-format-calculator',
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
const materialOptions = ref<MaterialOption[]>([])
const finishings = ref<FinishingOption[]>([])

const productSubtype = ref<LargeFormatSubtype>('banner')
const sizeMode = ref<SizeMode>('custom')
const sizeLabel = ref('A1')
const inputUnit = ref<SizeInputUnit>('mm')
const widthInput = ref('850')
const heightInput = ref('2000')
const widthMm = ref<number | null>(850)
const heightMm = ref<number | null>(2000)
const quantity = ref(1)
const selectedMaterialId = ref<number | null>(null)
const selectedHardwareRateId = ref<number | null>(null)
const selectedFinishingIds = ref<number[]>([])
const turnaroundHours = ref<number | null>(24)

const preview = ref<PreviewPriceResponse | null>(null)
const previewLoading = ref(false)
const savingDraft = ref(false)

const sizeModeOptions = [{ label: 'Standard size', value: 'standard' }, { label: 'Custom size', value: 'custom' }]
const sizePresetOptions = sizePresets.map((preset) => ({ label: preset.label, value: preset.label }))
const sizeUnitOptions = [{ label: 'mm', value: 'mm' }, { label: 'cm', value: 'cm' }, { label: 'inches', value: 'in' }]
const subtypeOptions = [
  { label: 'Banner', value: 'banner' },
  { label: 'Sticker', value: 'sticker' },
  { label: 'Roll-up Banner', value: 'roll_up_banner' },
  { label: 'Poster', value: 'poster' },
  { label: 'Mounted Board', value: 'mounted_board' },
]

const hardwareOptions = computed(() => {
  const items = finishings.value
    .filter((option) => isHardwareOption(option))
    .map((option) => ({ value: option.id, label: option.name }))
  return [{ value: null, label: 'No hardware / stand' }, ...items]
})

const finishingOptions = computed(() => finishings.value.filter((option) => !isHardwareOption(option)))
const previewGrandTotal = computed(() => getPreviewMoney(preview.value, 'grand_total') || 'Awaiting preview')

const canPreview = computed(() => Boolean(
  selectedShopId.value && selectedMaterialId.value && widthMm.value && heightMm.value && quantity.value > 0
))

const missingItems = computed(() => {
  const items: string[] = []
  if (!selectedShopId.value) items.push('Choose a shop')
  if (!widthMm.value || !heightMm.value) items.push('Set the finished size')
  if (!selectedMaterialId.value) items.push('Choose a material')
  return items
})

const summaryLines = computed(() => [
  { label: 'Shop', value: selectedShopName.value || '' },
  { label: 'Subtype', value: subtypeLabel(productSubtype.value) },
  { label: 'Finished size', value: formatSizeSummary(widthMm.value, heightMm.value, sizeLabel.value || null) || '' },
  { label: 'Quantity', value: `${quantity.value} piece(s)` },
])

const materialSummary = computed(() => {
  const section = preview.value?.breakdown?.material as Record<string, unknown> | undefined
  return `Material: ${String(section?.label || 'Not priced')} | Rate: ${String(section?.rate_per_sqm || '0.00')} per sqm | Total: ${String(section?.total || '0.00')}`
})

const printingSummary = computed(() => {
  const section = preview.value?.breakdown?.printing as Record<string, unknown> | undefined
  return `Print rate: ${String(section?.rate_per_sqm || '0.00')} per sqm | Total: ${String(section?.total || '0.00')} | ${String(section?.explanation || 'Print charge appears after preview.')}`
})

const finishingSummary = computed(() => {
  const lines = (preview.value?.breakdown?.finishings as Array<Record<string, unknown>> | undefined) || []
  if (!lines.length) return 'No extra finishing selected.'
  return lines.map((line) => `${String(line.name || 'Finishing')}: ${String(line.total || '0.00')}`).join(' | ')
})

const hardwareSummary = computed(() => {
  const section = preview.value?.breakdown?.hardware as Record<string, unknown> | null | undefined
  if (!section) return 'No hardware or stand selected.'
  return `${String(section.name || 'Hardware')}: ${String(section.total || '0.00')}`
})

const layoutSummary = computed(() => {
  const dimensions = preview.value?.breakdown?.dimensions as Record<string, unknown> | undefined
  const layout = preview.value?.breakdown?.layout as Record<string, unknown> | null | undefined
  const base = `Area: ${String(dimensions?.area_sqm || '0.0000')} sqm`
  if (!layout) return `${base} | Roll layout details appear when the material has a production roll width.`
  return `${base} | Roll length: ${String(layout.roll_length_mm || 0)} mm | Tiles: ${String(layout.tiles_x || 1)} x ${String(layout.tiles_y || 1)}`
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
  const options = await getShopCustomOptions(shopSlug)
  materialOptions.value = (options.available_materials ?? []).map((material) => ({
    value: material.id,
    label: buildMaterialLabel(material),
    printPricePerSqm: material.print_price_per_sqm ?? null,
  }))
  finishings.value = normalizeFinishings(options)
  if (!selectedMaterialId.value && materialOptions.value.length) selectedMaterialId.value = materialOptions.value[0]!.value
  if (selectedHardwareRateId.value && !finishings.value.some((option) => option.id === selectedHardwareRateId.value)) {
    selectedHardwareRateId.value = null
  }
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

function buildMaterialLabel(material: NonNullable<ShopCustomOptionsResponse['available_materials']>[number]) {
  const base = material.material_type ? `${material.material_type}${material.unit ? ` · ${material.unit}` : ''}` : 'Material'
  if (!material.print_price_per_sqm) return base
  return `${base} · print ${material.print_price_per_sqm}/sqm`
}

function isHardwareOption(option: FinishingOption) {
  const text = `${option.name || ''} ${option.slug || ''} ${option.category || ''}`.toLowerCase()
  return ['stand', 'mount', 'frame', 'hardware', 'base'].some((token) => text.includes(token))
}

function toggleFinishing(id: number) {
  if (selectedFinishingIds.value.includes(id)) {
    selectedFinishingIds.value = selectedFinishingIds.value.filter((value) => value !== id)
    return
  }
  selectedFinishingIds.value = [...selectedFinishingIds.value, id]
}

function subtypeLabel(value: LargeFormatSubtype) {
  return subtypeOptions.find((option) => option.value === value)?.label || 'Banner'
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
  sizeMode.value = (normalizeStringValue(value) as SizeMode | null) ?? 'custom'
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
    const preset = getSizePreset(sizeLabel.value || 'A1')
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
    product_subtype: productSubtype.value,
    quantity: quantity.value,
    material: selectedMaterialId.value,
    finishings: selectedFinishingIds.value.map((id) => ({ finishing_rate: id, selected_side: 'both' })),
    hardware_finishing_rate: selectedHardwareRateId.value,
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

async function previewLargeFormat() {
  if (!canPreview.value) return
  previewLoading.value = true
  try {
    preview.value = await $api<PreviewPriceResponse>(API.calculatorLargeFormatPreview(), {
      method: 'POST',
      body: buildPreviewPayload(),
    })
  } catch (error) {
    toast.add({ title: 'Preview failed', description: error instanceof Error ? error.message : 'Could not price this large-format job yet.', color: 'error' })
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
        title: `Large Format - ${subtypeLabel(productSubtype.value)}`,
        shop: selectedShopId.value,
        calculator_inputs_snapshot: {
          quote_type: 'large_format',
          ...buildPreviewPayload(),
        },
        pricing_snapshot: preview.value,
        custom_product_snapshot: {
          quote_type: 'large_format',
          title: `Large Format ${subtypeLabel(productSubtype.value)}`,
          spec_text: `${widthMm.value}x${heightMm.value}mm, ${quantity.value} piece(s)`,
        },
        request_details_snapshot: {
          source: 'large_format_calculator',
          selected_shop_slug: selectedShopSlug.value,
        },
      },
    })
    toast.add({ title: 'Saved to workspace', description: 'This large-format preview is now stored in your requests and quotes workspace.', color: 'success' })
  } catch (error) {
    toast.add({ title: 'Could not save draft', description: error instanceof Error ? error.message : 'Save failed.', color: 'error' })
  } finally {
    savingDraft.value = false
  }
}
</script>
