<template>
  <div class="space-y-4">
    <div class="flex justify-between items-center">
      <p class="text-sm text-[var(--p-text-muted)]">Finishing services (lamination, binding, etc.) with charge units.</p>
      <UButton color="primary" size="sm" @click="openModal()">
        <UIcon name="i-lucide-plus" class="h-4 w-4 mr-2" />
        Add finishing
      </UButton>
    </div>

    <CommonLoadingSpinner v-if="loading && !items.length" />
    <div v-else-if="items.length" class="rounded-xl border border-[var(--p-border)] overflow-hidden">
      <table class="min-w-full divide-y divide-[var(--p-border)]">
        <thead class="bg-[var(--p-surface-sunken)]">
          <tr>
            <th class="px-4 py-3 text-left text-xs font-medium text-[var(--p-text-muted)] uppercase">Name</th>
            <th class="px-4 py-3 text-left text-xs font-medium text-[var(--p-text-muted)] uppercase">Charge</th>
            <th class="px-4 py-3 text-right text-xs font-medium text-[var(--p-text-muted)] uppercase">Price</th>
            <th class="px-4 py-3 text-center text-xs font-medium text-[var(--p-text-muted)] uppercase">Status</th>
            <th class="px-4 py-3 text-right text-xs font-medium text-[var(--p-text-muted)] uppercase">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-[var(--p-border-dim)]">
          <tr v-for="f in items" :key="f.id" class="hover:bg-[var(--p-surface-sunken)]/50">
            <td class="px-4 py-3 text-sm font-medium text-[var(--p-text)]">{{ f.name }}</td>
            <td class="px-4 py-3 text-sm text-[var(--p-text-muted)]">{{ chargeUnitLabel(f.charge_unit) }}</td>
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
      <p class="mt-1 text-sm text-[var(--p-text-muted)]">Add lamination, binding, etc.</p>
      <UButton color="primary" class="mt-4" @click="openModal()">Add finishing</UButton>
    </div>

    <DashboardModalForm v-model="modalOpen" :title="editing ? 'Edit finishing' : 'Add finishing'" :description="editing ? 'Update finishing rate.' : 'Add a finishing service.'">
      <form class="space-y-4" @submit.prevent="onSubmit">
        <UAlert
          v-if="feedback.successMessage"
          color="success"
          variant="soft"
          title="Ready to save"
          :description="feedback.successMessage"
          icon="i-lucide-check-circle"
        />
        <p v-if="hasDraft && !editing" class="text-xs text-[var(--p-text-muted)] italic">Draft saved automatically</p>
        <UAlert v-if="feedback.errorMessage" color="error" variant="soft" title="Could not save finishing rate" :description="feedback.errorMessage" icon="i-lucide-alert-circle" />
        <UFormField label="Name" required>
          <UInput v-model="form.name" placeholder="e.g. Lamination" required />
          <DashboardInlineError :message="fieldError('name')" />
        </UFormField>
        <UFormField label="Charge unit" required>
          <USelectMenu v-model="form.charge_unit" :items="chargeUnitOptions" value-key="value" class="rounded-xl" />
          <DashboardInlineError :message="fieldError('charge_unit')" />
        </UFormField>
        <UFormField label="Price" required>
          <UInput v-model="form.price" type="text" placeholder="0.00" required />
          <DashboardInlineError :message="fieldError('price')" />
        </UFormField>
        <UFormField label="Setup fee">
          <UInput v-model="form.setup_fee" type="text" placeholder="Optional" />
        </UFormField>
        <UFormField label="Min quantity">
          <UInput v-model.number="form.min_qty" type="number" min="0" placeholder="Optional" />
        </UFormField>
        <div class="flex items-center gap-2">
          <UCheckbox v-model="form.is_active" />
          <span class="text-sm">Active</span>
        </div>
      </form>
      <template #footer="{ close }">
        <div class="flex justify-end gap-2">
          <UButton variant="ghost" @click="close">Cancel</UButton>
          <DashboardLoadingButton color="primary" :loading="saving || feedback.submitting" :disabled="!canSubmit" @click="onSubmit">Save</DashboardLoadingButton>
        </div>
      </template>
    </DashboardModalForm>
  </div>
</template>

<script setup lang="ts">
import { useStorage } from '@vueuse/core'
import type { FinishingRate } from '~/services/seller'
import { listFinishingRatesBySlug, createFinishingRateBySlug, updateFinishingRateBySlug, deleteFinishingRateBySlug } from '~/services/seller'

const props = defineProps<{ shopSlug: string }>()

const feedback = useSubmissionFeedback()
const items = ref<FinishingRate[]>([])
const loading = ref(true)
const saving = ref(false)
const modalOpen = ref(false)
const editing = ref<FinishingRate | null>(null)

const DRAFT_KEY = computed(() => `finishing-draft-${props.shopSlug}`)
const defaultForm = {
  name: '',
  charge_unit: 'PER_PIECE',
  price: '0',
  setup_fee: null as string | null,
  min_qty: null as number | null,
  is_active: true,
}
const form = useStorage(DRAFT_KEY.value, { ...defaultForm })
const hasDraft = computed(() => (form.value.name?.trim().length ?? 0) > 0)

const chargeUnitOptions = [
  { value: 'PER_PIECE', label: 'Per piece' },
  { value: 'PER_SIDE', label: 'Per side' },
  { value: 'PER_SHEET', label: 'Per sheet' },
  { value: 'PER_SIDE_PER_SHEET', label: 'Per side per sheet' },
  { value: 'PER_SQM', label: 'Per sqm' },
  { value: 'FLAT', label: 'Flat' },
]

const validationErrors = computed(() => ({
  name: form.value.name?.trim() ? null : 'Name is required.',
  charge_unit: form.value.charge_unit ? null : 'Charge unit is required.',
  price: String(form.value.price).trim() ? null : 'Price is required.',
}))

const canSubmit = computed(() => Object.values(validationErrors.value).every(value => !value))

function fieldError(field: keyof typeof validationErrors.value) {
  return validationErrors.value[field]
}

function chargeUnitLabel(u: string) {
  return chargeUnitOptions.find((o) => o.value === u)?.label ?? u
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
  if (f) {
    form.value = {
      name: f.name,
      charge_unit: f.charge_unit,
      price: f.price,
      setup_fee: f.setup_fee,
      min_qty: f.min_qty,
      is_active: f.is_active,
    }
  } else if (!hasDraft.value) {
    form.value = { ...defaultForm }
  }
  modalOpen.value = true
}

function edit(f: FinishingRate) {
  openModal(f)
}

async function onSubmit() {
  feedback.reset()
  if (!canSubmit.value) {
    feedback.setError('Please correct the highlighted finishing fields.', 'Validation', false)
    return
  }
  saving.value = true
  try {
    const payload = {
      name: form.value.name,
      charge_unit: form.value.charge_unit,
      price: form.value.price,
      setup_fee: form.value.setup_fee || undefined,
      min_qty: form.value.min_qty ?? undefined,
      is_active: form.value.is_active,
    }
    if (editing.value) {
      await updateFinishingRateBySlug(props.shopSlug, editing.value.id, payload)
      feedback.setSuccess('Finishing rate updated successfully.')
    } else {
      await createFinishingRateBySlug(props.shopSlug, payload)
      feedback.setSuccess('Finishing rate added successfully.')
    }
    form.value = { ...defaultForm }
    modalOpen.value = false
    await load()
  } catch (e) {
    feedback.applyApiError(e, 'We could not save this finishing rate right now.')
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

watch(() => props.shopSlug, () => load(), { immediate: true })
</script>
