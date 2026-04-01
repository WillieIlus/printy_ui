<template>
  <div class="space-y-4">
    <div class="flex items-center justify-between">
      <p class="text-sm text-[var(--p-text-muted)]">Set up finishing services with simple billing. Lamination uses per-sheet pricing with one-side or both-side selection.</p>
      <UButton color="primary" size="sm" @click="openModal()">
        <UIcon name="i-lucide-plus" class="mr-2 h-4 w-4" />
        Add finishing
      </UButton>
    </div>

    <CommonLoadingSpinner v-if="loading && !items.length" />
    <div v-else-if="items.length" class="overflow-hidden rounded-xl border border-[var(--p-border)]">
      <table class="min-w-full divide-y divide-[var(--p-border)]">
        <thead class="bg-[var(--p-surface-sunken)]">
          <tr>
            <th class="px-4 py-3 text-left text-xs font-medium uppercase text-[var(--p-text-muted)]">Name</th>
            <th class="px-4 py-3 text-left text-xs font-medium uppercase text-[var(--p-text-muted)]">Charge</th>
            <th class="px-4 py-3 text-right text-xs font-medium uppercase text-[var(--p-text-muted)]">Price</th>
            <th class="px-4 py-3 text-center text-xs font-medium uppercase text-[var(--p-text-muted)]">Status</th>
            <th class="px-4 py-3 text-right text-xs font-medium uppercase text-[var(--p-text-muted)]">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-[var(--p-border-dim)]">
          <tr v-for="f in items" :key="f.id" class="hover:bg-[var(--p-surface-sunken)]/50">
            <td class="px-4 py-3 text-sm font-medium text-[var(--p-text)]">{{ f.name }}</td>
            <td class="px-4 py-3 text-sm text-[var(--p-text-muted)]">{{ humanChargeSummary(f) }}</td>
            <td class="px-4 py-3 text-right text-sm text-[var(--p-text-muted)]">{{ f.price }}{{ f.setup_fee ? ` + ${f.setup_fee} setup` : '' }}</td>
            <td class="px-4 py-3 text-center">
              <UBadge :color="f.is_active ? 'success' : 'neutral'" variant="soft" size="xs">{{ f.is_active ? 'Active' : 'Inactive' }}</UBadge>
            </td>
            <td class="px-4 py-3 text-right">
              <UButton variant="soft" size="xs" @click="edit(f)">Edit</UButton>
              <UButton variant="soft" size="xs" color="error" @click="confirmDelete(f)">Delete</UButton>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div v-else class="rounded-xl border border-dashed border-[var(--p-border)] p-8 text-center">
      <UIcon name="i-lucide-scissors" class="mx-auto h-12 w-12 text-[var(--p-text-muted)]" />
      <p class="mt-2 text-sm font-medium text-[var(--p-text-dim)]">No finishing rates yet</p>
      <p class="mt-1 text-sm text-[var(--p-text-muted)]">Add lamination, binding, and other post-press services with simple per-sheet or per-piece pricing.</p>
      <UButton color="primary" class="mt-4" @click="openModal()">Add finishing</UButton>
    </div>

    <DashboardModalForm v-model="modalOpen" :title="editing ? 'Edit finishing' : 'Add finishing'" :description="editing ? 'Update finishing rate.' : 'Add a finishing service.'">
      <form class="space-y-4" @submit.prevent="onSubmit">
        <UAlert
          :color="statusNotice.color"
          variant="soft"
          :title="statusNotice.title"
          :description="statusNotice.description"
          :icon="statusNotice.icon"
        />

        <UFormField label="Name" required :ui="dashboardFormFieldUi">
          <UInput v-model="form.name" placeholder="e.g. Lamination" required :ui="dashboardInputUi" />
          <DashboardInlineError :message="fieldError('name')" />
        </UFormField>
        <div
          v-if="isLaminationDraft"
          class="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900"
        >
          <p class="font-semibold">Lamination uses the simplified setup.</p>
          <p class="mt-1">Billing is per sheet. One side uses the main rate, and both sides can use either 2x the main rate or the optional both-side rate.</p>
        </div>
        <template v-else>
          <UFormField label="Charge unit" required :ui="dashboardFormFieldUi">
            <USelectMenu v-model="form.charge_unit" :items="chargeUnitOptions" value-key="value" portal="body" :ui="dashboardSelectUi" />
            <DashboardInlineError :message="fieldError('charge_unit')" />
          </UFormField>
          <UFormField label="Billing basis" required :ui="dashboardFormFieldUi">
            <USelectMenu v-model="form.billing_basis" :items="billingBasisOptions" value-key="value" portal="body" :ui="dashboardSelectUi" />
            <DashboardInlineError :message="fieldError('billing_basis')" />
          </UFormField>
          <UFormField label="Side mode" required :ui="dashboardFormFieldUi">
            <USelectMenu v-model="form.side_mode" :items="sideModeOptions" value-key="value" portal="body" :ui="dashboardSelectUi" />
            <DashboardInlineError :message="fieldError('side_mode')" />
          </UFormField>
        </template>
        <UFormField :label="isLaminationDraft ? 'Rate per sheet' : 'Price'" required :ui="dashboardFormFieldUi">
          <UInput v-model="form.price" type="text" placeholder="0.00" required :ui="dashboardInputUi" />
          <DashboardInlineError :message="fieldError('price')" />
        </UFormField>
        <UFormField v-if="isLaminationDraft" label="Both-side rate" :ui="dashboardFormFieldUi">
          <UInput v-model="form.double_side_price" type="text" placeholder="Optional override" :ui="dashboardInputUi" />
        </UFormField>
        <UFormField label="Setup fee" :ui="dashboardFormFieldUi">
          <UInput v-model="form.setup_fee" type="text" placeholder="Optional" :ui="dashboardInputUi" />
        </UFormField>
        <UFormField label="Min quantity" :ui="dashboardFormFieldUi">
          <UInput v-model.number="form.min_qty" type="number" min="0" placeholder="Optional" :ui="dashboardInputUi" />
        </UFormField>
        <div class="flex items-center gap-2">
          <UCheckbox v-model="form.is_active" />
          <span :class="dashboardCheckboxLabelClass">Active</span>
        </div>
      </form>
      <template #footer="{ close }">
        <div class="flex justify-end gap-2">
          <UButton variant="ghost" @click="close">Cancel</UButton>
          <DashboardLoadingButton color="primary" :loading="saving" :disabled="!canSubmit" @click="onSubmit">
            {{ editing ? 'Save Changes' : 'Save Finishing' }}
          </DashboardLoadingButton>
        </div>
      </template>
    </DashboardModalForm>
  </div>
</template>

<script setup lang="ts">
import { useStorage } from '@vueuse/core'
import type { FinishingRate } from '~/services/seller'
import { createFinishingRateBySlug, deleteFinishingRateBySlug, listFinishingRatesBySlug, updateFinishingRateBySlug } from '~/services/seller'
import { dashboardCheckboxLabelClass, dashboardFormFieldUi, dashboardInputUi, dashboardSelectUi } from '~/utils/formUi'

const props = defineProps<{ shopSlug: string }>()

type FinishingForm = {
  name: string
  charge_unit: string
  billing_basis: string
  side_mode: string
  price: string
  double_side_price: string | null
  setup_fee: string | null
  min_qty: number | null
  is_active: boolean
}

const feedback = useSubmissionFeedback()
const items = ref<FinishingRate[]>([])
const loading = ref(true)
const saving = ref(false)
const modalOpen = ref(false)
const editing = ref<FinishingRate | null>(null)
const hasUnsavedChanges = ref(false)
const hydratingForm = ref(false)

const DRAFT_KEY = computed(() => `finishing-draft-${props.shopSlug}`)
const defaultForm: FinishingForm = {
  name: '',
  charge_unit: 'PER_PIECE',
  billing_basis: 'per_piece',
  side_mode: 'ignore_sides',
  price: '0',
  double_side_price: null,
  setup_fee: null,
  min_qty: null,
  is_active: true,
}

const draft = useStorage<FinishingForm>(DRAFT_KEY, { ...defaultForm })
const form = ref<FinishingForm>({ ...defaultForm })

const hasDraft = computed(() => {
  const value = draft.value
  return value.name !== defaultForm.name
    || value.charge_unit !== defaultForm.charge_unit
    || value.billing_basis !== defaultForm.billing_basis
    || value.side_mode !== defaultForm.side_mode
    || value.price !== defaultForm.price
    || value.double_side_price !== defaultForm.double_side_price
    || value.setup_fee !== defaultForm.setup_fee
    || value.min_qty !== defaultForm.min_qty
    || value.is_active !== defaultForm.is_active
  })

const isLaminationDraft = computed(() => isLaminationName(form.value.name))

const statusNotice = computed(() => {
  if (saving.value) {
    return {
      color: 'info' as const,
      title: 'Saving to server',
      description: editing.value ? 'Updating this finishing service in your shop now.' : 'Creating this finishing service in your shop now.',
      icon: 'i-lucide-loader-circle',
    }
  }
  if (feedback.errorMessage.value) {
    return {
      color: 'error' as const,
      title: 'Save failed',
      description: feedback.errorMessage.value,
      icon: 'i-lucide-alert-circle',
    }
  }
  if (feedback.successMessage.value) {
    return {
      color: 'success' as const,
      title: 'Saved successfully',
      description: feedback.successMessage.value,
      icon: 'i-lucide-check-circle',
    }
  }
  if (editing.value && hasUnsavedChanges.value) {
    return {
      color: 'warning' as const,
      title: 'Unsaved changes',
      description: 'These edits are only in this form until you click Save Changes.',
      icon: 'i-lucide-pencil',
    }
  }
  if (!editing.value && hasUnsavedChanges.value) {
    return {
      color: 'warning' as const,
      title: 'Unsaved changes',
      description: 'These changes are stored only as a local draft on this device until you click Save Finishing.',
      icon: 'i-lucide-pencil',
    }
  }
  if (!editing.value && hasDraft.value) {
    return {
      color: 'info' as const,
      title: 'Local draft saved',
      description: 'A finishing draft is stored on this device. Click Save Finishing to send it to your shop.',
      icon: 'i-lucide-save',
    }
  }
  return {
    color: 'neutral' as const,
    title: 'Ready to save',
    description: editing.value ? 'Review the finishing details, then click Save Changes.' : 'Complete the finishing details, then click Save Finishing.',
    icon: 'i-lucide-check',
  }
})

const chargeUnitOptions = [
  { value: 'PER_PIECE', label: 'Per piece' },
  { value: 'PER_SIDE', label: 'Per side' },
  { value: 'PER_SHEET', label: 'Per sheet' },
  { value: 'PER_SIDE_PER_SHEET', label: 'Per sheet (legacy)' },
  { value: 'PER_SQM', label: 'Per sqm' },
  { value: 'FLAT', label: 'Flat' },
]
const billingBasisOptions = [
  { value: 'per_sheet', label: 'Per sheet' },
  { value: 'per_piece', label: 'Per piece' },
  { value: 'flat_per_job', label: 'Flat per job' },
  { value: 'flat_per_group', label: 'Flat per group' },
  { value: 'flat_per_line', label: 'Flat per line' },
]
const sideModeOptions = [
  { value: 'ignore_sides', label: 'Ignore sides' },
  { value: 'per_selected_side', label: 'Per selected side' },
]

const validationErrors = computed(() => ({
  name: form.value.name?.trim() ? null : 'Name is required.',
  charge_unit: form.value.charge_unit ? null : 'Charge unit is required.',
  billing_basis: form.value.billing_basis ? null : 'Billing basis is required.',
  side_mode: form.value.side_mode ? null : 'Side mode is required.',
  price: String(form.value.price).trim() ? null : 'Price is required.',
}))

const canSubmit = computed(() => Object.values(validationErrors.value).every(value => !value))

function cloneForm(source: FinishingForm): FinishingForm {
  return {
    name: source.name,
    charge_unit: source.charge_unit,
    billing_basis: source.billing_basis,
    side_mode: source.side_mode,
    price: source.price,
    double_side_price: source.double_side_price,
    setup_fee: source.setup_fee,
    min_qty: source.min_qty,
    is_active: source.is_active,
  }
}

function setForm(source: FinishingForm) {
  hydratingForm.value = true
  form.value = cloneForm(source)
  nextTick(() => {
    hydratingForm.value = false
  })
}

function fieldError(field: keyof typeof validationErrors.value) {
  return validationErrors.value[field] || feedback.errorFor(field)
}

function isLaminationName(value: unknown) {
  return String(value ?? '').trim().toLowerCase().includes('lamination')
}

function isLaminationRate(rate: Pick<FinishingRate, 'name' | 'billing_basis' | 'side_mode'>) {
  return isLaminationName(rate.name) || (
    rate.billing_basis === 'per_sheet'
    && rate.side_mode === 'per_selected_side'
  )
}

function chargeUnitLabel(u: string) {
  return chargeUnitOptions.find((o) => o.value === u)?.label ?? u
}

function billingBasisLabel(value: string) {
  return billingBasisOptions.find(option => option.value === value)?.label ?? value
}

function sideModeLabel(value: string) {
  return sideModeOptions.find(option => option.value === value)?.label ?? value
}

function chargeSummary(rate: FinishingRate) {
  return `${chargeUnitLabel(rate.charge_unit)} · ${billingBasisLabel(rate.billing_basis)} · ${sideModeLabel(rate.side_mode)}`
}

function humanChargeSummary(rate: FinishingRate) {
  if (isLaminationRate(rate)) {
    return rate.double_side_price
      ? 'Per sheet · one side or both-side rate'
      : 'Per sheet · one side or both sides'
  }
  return `${chargeUnitLabel(rate.charge_unit)} · ${billingBasisLabel(rate.billing_basis)} · ${sideModeLabel(rate.side_mode)}`
}

async function load() {
  if (!props.shopSlug) return
  loading.value = true
  try {
    items.value = await listFinishingRatesBySlug(props.shopSlug)
  } catch {
    items.value = []
  } finally {
    loading.value = false
  }
}

function openModal(f?: FinishingRate) {
  feedback.reset()
  editing.value = f ?? null
  hasUnsavedChanges.value = false

  if (f) {
    setForm({
      name: f.name,
      charge_unit: f.charge_unit,
      billing_basis: f.billing_basis,
      side_mode: f.side_mode,
      price: f.price,
      double_side_price: f.double_side_price,
      setup_fee: f.setup_fee,
      min_qty: f.min_qty,
      is_active: f.is_active,
    })
  } else if (hasDraft.value) {
    setForm(draft.value)
  } else {
    setForm(defaultForm)
  }

  modalOpen.value = true
}

function edit(f: FinishingRate) {
  openModal(f)
}

function clearDraft() {
  draft.value = cloneForm(defaultForm)
  if (!editing.value) {
    setForm(defaultForm)
    hasUnsavedChanges.value = false
    feedback.reset()
  }
}

async function onSubmit() {
  feedback.reset()
  if (!canSubmit.value) {
    feedback.setError('Please correct the highlighted finishing fields.', 'Validation', false)
    return
  }

  saving.value = true
  try {
    const normalizedLamination = isLaminationDraft.value
    const payload = {
      name: form.value.name,
      charge_unit: normalizedLamination ? 'PER_SHEET' : form.value.charge_unit,
      billing_basis: normalizedLamination ? 'per_sheet' : form.value.billing_basis,
      side_mode: normalizedLamination ? 'per_selected_side' : form.value.side_mode,
      price: form.value.price,
      double_side_price: normalizedLamination ? (form.value.double_side_price || undefined) : undefined,
      setup_fee: form.value.setup_fee || undefined,
      min_qty: form.value.min_qty ?? undefined,
      is_active: form.value.is_active,
    }

    if (editing.value) {
      await updateFinishingRateBySlug(props.shopSlug, editing.value.id, payload)
      feedback.setSuccess('Finishing service saved to your shop successfully.', 'Saved', false)
    } else {
      await createFinishingRateBySlug(props.shopSlug, payload)
      feedback.setSuccess('Finishing service saved to your shop successfully.', 'Saved', false)
      clearDraft()
    }

    hasUnsavedChanges.value = false
    modalOpen.value = false
    await load()
  } catch (e) {
    feedback.applyApiError(e, 'We could not save this finishing service to your shop right now.', 'Save failed', false)
  } finally {
    saving.value = false
  }
}

async function confirmDelete(f: FinishingRate) {
  if (!confirm(`Delete "${f.name}"?`)) return
  try {
    await deleteFinishingRateBySlug(props.shopSlug, f.id)
    feedback.setSuccess('Finishing rate deleted successfully.')
    await load()
  } catch (e) {
    feedback.applyApiError(e, 'We could not delete this finishing rate right now.')
  }
}

watch(() => props.shopSlug, () => {
  draft.value = cloneForm(defaultForm)
  setForm(defaultForm)
  void load()
}, { immediate: true })

watch(form, (value) => {
  if (!modalOpen.value || hydratingForm.value) return
  hasUnsavedChanges.value = true
  if (!editing.value) {
    draft.value = cloneForm(value)
  }
}, { deep: true })
</script>
