<template>
  <form class="space-y-6" @submit.prevent="submitForm">
    <DashboardInfoCard
      title="Why machines matter"
      description="Machines tell Printy which jobs your shop can run, which parent sheets make sense, and whether a product can be produced without manual guesswork."
      icon="i-lucide-printer"
      tone="orange"
    />

    <DashboardFormSection title="Machine Profile" description="Capture the production details you rely on when choosing equipment for a job.">
      <div class="grid gap-5 md:grid-cols-2">
        <div class="space-y-2 md:col-span-2">
          <label class="block text-sm font-semibold text-[var(--p-text-dim)]">Machine Name</label>
          <UInput v-model="form.name" placeholder="Xerox Versant 180 Press" size="xl" :ui="dashboardInputUi" />
          <DashboardFieldHint text="Use the machine name your operators already recognize on the floor." />
          <DashboardInlineError :message="fieldError('name')" />
        </div>

        <div class="space-y-2">
          <label class="block text-sm font-semibold text-[var(--p-text-dim)]">Machine Type</label>
          <USelectMenu
            v-model="form.machine_type"
            :items="typeOptions"
            value-key="value"
            label-key="label"
            placeholder="Select machine type"
            portal="body"
            size="xl"
            :ui="dashboardSelectUi"
          />
          <DashboardFieldHint text="Type shapes what products and paper setups this machine should handle first." />
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
            size="xl"
            :ui="dashboardSelectUi"
          />
          <DashboardFieldHint text="Inactive machines stay on record but should not be used as your current production default." />
        </div>

        <div class="space-y-2">
          <label class="block text-sm font-semibold text-[var(--p-text-dim)]">Max Sheet Size</label>
          <USelectMenu
            v-model="selectedSheetPreset"
            :items="sheetPresets"
            value-key="value"
            label-key="label"
            portal="body"
            size="xl"
            :ui="dashboardSelectUi"
          />
          <DashboardFieldHint text="Pick the largest parent sheet this machine comfortably accepts." />
          <DashboardInlineError :message="fieldError('max_width_mm') || fieldError('max_height_mm')" />
        </div>

        <div class="space-y-2">
          <label class="block text-sm font-semibold text-[var(--p-text-dim)]">Suggested Print Categories</label>
          <UInput :model-value="suggestedCategories" readonly size="xl" :ui="dashboardInputUi" />
          <DashboardFieldHint text="This is guidance only. Detailed category support still needs backend rules if you want it enforced automatically." />
        </div>

        <div class="space-y-2">
          <label class="block text-sm font-semibold text-[var(--p-text-dim)]">Minimum GSM</label>
          <UInput v-model="form.min_gsm" type="number" placeholder="80" size="xl" :ui="dashboardInputUi" />
          <DashboardFieldHint text="Useful when a machine should avoid very light or specialty stocks." />
          <DashboardInlineError :message="fieldError('min_gsm')" />
        </div>

        <div class="space-y-2">
          <label class="block text-sm font-semibold text-[var(--p-text-dim)]">Maximum GSM</label>
          <UInput v-model="form.max_gsm" type="number" placeholder="350" size="xl" :ui="dashboardInputUi" />
          <DashboardFieldHint text="Helps products stay within the paper range your machine can really print." />
          <DashboardInlineError :message="fieldError('max_gsm')" />
        </div>
      </div>
    </DashboardFormSection>

    <DashboardFormSection title="Operational Guidance" description="Use the machine list to make product eligibility and imposition more believable.">
      <div class="grid gap-3">
        <div class="rounded-2xl border border-[var(--p-border)] bg-[var(--p-surface-sunken)] p-4">
          <p class="text-sm font-semibold text-[var(--p-text)]">Production planning</p>
          <p class="mt-1 text-sm leading-6 text-[var(--p-text-muted)]">
            Machine setup helps staff choose the right press before quoting or accepting a job.
          </p>
        </div>
        <div class="rounded-2xl border border-[var(--p-border)] bg-[var(--p-surface-sunken)] p-4">
          <p class="text-sm font-semibold text-[var(--p-text)]">Paper size compatibility</p>
          <p class="mt-1 text-sm leading-6 text-[var(--p-text-muted)]">
            Matching max sheet size with stock papers reduces invalid assumptions during costing and imposition.
          </p>
        </div>
        <div class="rounded-2xl border border-[var(--p-border)] bg-[var(--p-surface-sunken)] p-4">
          <p class="text-sm font-semibold text-[var(--p-text)]">Imposition feasibility</p>
          <p class="mt-1 text-sm leading-6 text-[var(--p-text-muted)]">
            If a product assumes SRA3 but your machine only runs A3, Printy should surface that early.
          </p>
        </div>
      </div>

      <div class="flex flex-col-reverse gap-3 pt-1 sm:flex-row sm:justify-end">
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
