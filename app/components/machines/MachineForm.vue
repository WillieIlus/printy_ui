<template>
  <form class="space-y-4" @submit.prevent="submitForm">
    <p class="text-xs leading-5 text-[var(--p-text-muted)]">
      Keep this list tight so quoting, sheet fit, and production routing stay accurate.
    </p>

    <DashboardFormSection title="Machine setup" description="Fast production entry for equipment your team actually runs.">
      <div class="grid gap-4 md:grid-cols-2">
        <div class="space-y-2 md:col-span-2">
          <label class="block text-sm font-semibold text-[var(--p-text-dim)]">Name</label>
          <UInput
            v-model="form.name"
            placeholder="Xerox Versant 180 Press"
            size="lg"
            :ui="dashboardInputUi"
          />
          <DashboardInlineError :message="fieldError('name')" />
        </div>

        <div class="space-y-2">
          <label class="block text-sm font-semibold text-[var(--p-text-dim)]">Type</label>
          <USelectMenu
            v-model="form.machine_type"
            :items="typeOptions"
            value-key="value"
            label-key="label"
            placeholder="Select type"
            portal="body"
            size="lg"
            :ui="dashboardSelectUi"
          />
          <DashboardInlineError :message="fieldError('machine_type')" />
        </div>

        <div class="space-y-2">
          <label class="block text-sm font-semibold text-[var(--p-text-dim)]">Status</label>
          <USelectMenu
            v-model="statusValue"
            :items="statusOptions"
            value-key="value"
            label-key="label"
            portal="body"
            size="lg"
            :ui="dashboardSelectUi"
          />
        </div>

        <div class="space-y-2 md:col-span-2">
          <div class="flex items-center justify-between gap-3">
            <label class="block text-sm font-semibold text-[var(--p-text-dim)]">Sheet preset</label>
            <span class="text-[11px] uppercase tracking-[0.16em] text-[var(--p-text-muted)]">Updates width and height</span>
          </div>
          <USelectMenu
            v-model="selectedSheetPreset"
            :items="sheetPresets"
            value-key="value"
            label-key="label"
            portal="body"
            size="lg"
            :ui="dashboardSelectUi"
          />
        </div>

        <div class="space-y-2">
          <label class="block text-sm font-semibold text-[var(--p-text-dim)]">Max width (mm)</label>
          <UInput
            v-model="form.max_width_mm"
            type="number"
            inputmode="numeric"
            min="1"
            placeholder="320"
            size="lg"
            :ui="dashboardInputUi"
          />
          <DashboardInlineError :message="fieldError('max_width_mm')" />
        </div>

        <div class="space-y-2">
          <label class="block text-sm font-semibold text-[var(--p-text-dim)]">Max height (mm)</label>
          <UInput
            v-model="form.max_height_mm"
            type="number"
            inputmode="numeric"
            min="1"
            placeholder="450"
            size="lg"
            :ui="dashboardInputUi"
          />
          <DashboardInlineError :message="fieldError('max_height_mm')" />
        </div>

        <div class="space-y-2">
          <label class="block text-sm font-semibold text-[var(--p-text-dim)]">Min GSM</label>
          <UInput
            v-model="form.min_gsm"
            type="number"
            inputmode="numeric"
            min="0"
            placeholder="80"
            size="lg"
            :ui="dashboardInputUi"
            title="Optional lower stock limit"
          />
          <DashboardInlineError :message="fieldError('min_gsm')" />
        </div>

        <div class="space-y-2">
          <label class="block text-sm font-semibold text-[var(--p-text-dim)]">Max GSM</label>
          <UInput
            v-model="form.max_gsm"
            type="number"
            inputmode="numeric"
            min="0"
            placeholder="350"
            size="lg"
            :ui="dashboardInputUi"
            title="Optional upper stock limit"
          />
          <DashboardInlineError :message="fieldError('max_gsm')" />
        </div>
      </div>

      <details class="group rounded-2xl border border-[var(--p-border)] bg-[var(--p-surface-sunken)]/60 px-4 py-3">
        <summary class="flex cursor-pointer list-none items-center justify-between gap-3 text-sm font-medium text-[var(--p-text)]">
          <span>Advanced settings</span>
          <UIcon name="i-lucide-chevron-down" class="h-4 w-4 text-[var(--p-text-muted)] transition-transform group-open:rotate-180" />
        </summary>

        <div class="mt-3 grid gap-3 border-t border-[var(--p-border)] pt-3 text-sm text-[var(--p-text-muted)]">
          <div class="rounded-xl border border-[var(--p-border)] bg-[var(--p-surface)] px-3 py-2.5">
            <p class="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--p-text-muted)]">Suggested print categories</p>
            <p class="mt-1 text-sm text-[var(--p-text)]">{{ suggestedCategories }}</p>
          </div>
          <p>Use the largest sheet the machine reliably runs. Presets are shortcuts; manual width and height are what get saved.</p>
          <p>Inactive machines stay on record but should not be your current production default.</p>
        </div>
      </details>

      <div class="flex flex-col-reverse gap-2 pt-1 sm:flex-row sm:justify-end">
        <UButton color="neutral" variant="outline" @click="$emit('cancel')">Cancel</UButton>
        <DashboardLoadingButton type="submit" color="primary" :loading="loading" :disabled="!canSubmit">
          {{ machine ? 'Save Machine' : 'Add Machine' }}
        </DashboardLoadingButton>
      </div>
    </DashboardFormSection>
  </form>
</template>

<script setup lang="ts">
import type { Machine } from '~/stores/machine'
import { dashboardInputUi, dashboardSelectUi } from '~/utils/formUi'

const props = defineProps<{
  machine: Machine | null
  loading?: boolean
  canAddPrinting?: boolean
  canAddFinishing?: boolean
  fieldErrors?: Record<string, string>
}>()

const emit = defineEmits<{
  submit: [data: { name: string; machine_type: string; max_width_mm?: number | null; max_height_mm?: number | null; min_gsm?: number | null; max_gsm?: number | null; is_active?: boolean }]
  cancel: []
}>()

const typeOptions = [
  { label: 'Digital Printer', value: 'DIGITAL' },
  { label: 'Large Format', value: 'LARGE_FORMAT' },
  { label: 'Offset Press', value: 'OFFSET' },
  { label: 'Finishing Equipment', value: 'FINISHING' },
].filter((option) => {
  if (option.value === 'FINISHING') return props.canAddFinishing !== false
  return props.canAddPrinting !== false || option.value === 'FINISHING'
})

const sheetPresets = [
  { label: 'A4', value: 'A4', width: 210, height: 297 },
  { label: 'A3', value: 'A3', width: 297, height: 420 },
  { label: 'SRA3', value: 'SRA3', width: 320, height: 450 },
  { label: 'B2', value: 'B2', width: 500, height: 707 },
]

const statusOptions = [
  { label: 'Active', value: true },
  { label: 'Inactive', value: false },
]

const form = reactive({
  name: props.machine?.name ?? '',
  machine_type: props.machine?.machine_type ?? props.machine?.type ?? 'DIGITAL',
  max_width_mm: props.machine?.max_width_mm != null ? String(props.machine.max_width_mm) : '',
  max_height_mm: props.machine?.max_height_mm != null ? String(props.machine.max_height_mm) : '',
  min_gsm: props.machine?.min_gsm != null ? String(props.machine.min_gsm) : '',
  max_gsm: props.machine?.max_gsm != null ? String(props.machine.max_gsm) : '',
  is_active: props.machine?.is_active !== false,
})

const statusValue = computed({
  get: () => form.is_active,
  set: (value: boolean | { value: boolean }) => {
    form.is_active = typeof value === 'object' ? value.value : value
  },
})

const selectedSheetPreset = computed({
  get: () => {
    const match = sheetPresets.find(preset =>
      String(preset.width) === form.max_width_mm && String(preset.height) === form.max_height_mm
    )
    return match?.value ?? null
  },
  set: (value: string | { value: string } | null) => {
    const normalized = typeof value === 'object' && value ? value.value : value
    const preset = sheetPresets.find(item => item.value === normalized)
    if (!preset) return
    form.max_width_mm = String(preset.width)
    form.max_height_mm = String(preset.height)
  },
})

const errors = computed(() => {
  const minGsm = toNullableNumber(form.min_gsm)
  const maxGsm = toNullableNumber(form.max_gsm)
  const maxWidth = toNullableNumber(form.max_width_mm)
  const maxHeight = toNullableNumber(form.max_height_mm)

  return {
    name: form.name.trim() ? null : 'Machine name is required.',
    machine_type: form.machine_type ? null : 'Machine type is required.',
    max_width_mm: maxWidth != null && maxWidth > 0 ? null : 'Choose the largest sheet size this machine can handle.',
    max_height_mm: maxHeight != null && maxHeight > 0 ? null : 'Choose the largest sheet size this machine can handle.',
    min_gsm: minGsm != null && minGsm < 0 ? 'Minimum GSM cannot be negative.' : null,
    max_gsm: maxGsm != null && maxGsm < 0 ? 'Maximum GSM cannot be negative.' : minGsm != null && maxGsm != null && maxGsm < minGsm ? 'Maximum GSM must be greater than or equal to minimum GSM.' : null,
  }
})

const canSubmit = computed(() => Object.values(errors.value).every(value => !value))

const suggestedCategories = computed(() => {
  const map: Record<string, string> = {
    DIGITAL: 'Business cards, flyers, brochures, office print jobs',
    LARGE_FORMAT: 'Banners, roll-up stands, posters, signage',
    OFFSET: 'Long-run brochures, booklets, catalogues, inserts',
    FINISHING: 'Cutting, lamination, folding, binding',
  }
  return map[form.machine_type] ?? 'General print production'
})

function toNullableNumber(value: string | number | null | undefined) {
  if (value == null) return null
  if (typeof value === 'string' && !value.trim()) return null
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : null
}

function fieldError(field: keyof typeof errors.value) {
  return errors.value[field] || props.fieldErrors?.[field] || null
}

function submitForm() {
  if (!canSubmit.value) {
    return
  }

  emit('submit', {
    name: form.name.trim(),
    machine_type: form.machine_type,
    max_width_mm: toNullableNumber(form.max_width_mm),
    max_height_mm: toNullableNumber(form.max_height_mm),
    min_gsm: toNullableNumber(form.min_gsm),
    max_gsm: toNullableNumber(form.max_gsm),
    is_active: form.is_active,
  })
}
</script>
