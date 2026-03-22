<template>
  <div class="space-y-4">
    <div class="flex justify-between items-center">
      <p class="text-sm text-[var(--p-text-muted)]">Large-format materials (vinyl, banner, etc.) sold by area. Used for LARGE_FORMAT pricing.</p>
      <UButton color="primary" size="sm" @click="openModal()">
        <UIcon name="i-lucide-plus" class="h-4 w-4 mr-2" />
        Add material
      </UButton>
    </div>

    <CommonLoadingSpinner v-if="loading && !items.length" />
    <div v-else-if="items.length" class="rounded-xl border border-[var(--p-border)] overflow-hidden">
      <table class="min-w-full divide-y divide-[var(--p-border)]">
        <thead class="bg-[var(--p-surface-sunken)]">
          <tr>
            <th class="px-4 py-3 text-left text-xs font-medium text-[var(--p-text-muted)] uppercase">Material</th>
            <th class="px-4 py-3 text-left text-xs font-medium text-[var(--p-text-muted)] uppercase">Unit</th>
            <th class="px-4 py-3 text-right text-xs font-medium text-[var(--p-text-muted)] uppercase">Buy / Sell</th>
            <th class="px-4 py-3 text-center text-xs font-medium text-[var(--p-text-muted)] uppercase">Status</th>
            <th class="px-4 py-3 text-right text-xs font-medium text-[var(--p-text-muted)] uppercase">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-[var(--p-border-dim)]">
          <tr v-for="m in items" :key="m.id" class="hover:bg-[var(--p-surface-sunken)]/50">
            <td class="px-4 py-3 text-sm font-medium text-[var(--p-text)]">{{ m.material_type }}</td>
            <td class="px-4 py-3 text-sm text-[var(--p-text-muted)]">{{ m.unit }}</td>
            <td class="px-4 py-3 text-right text-sm text-[var(--p-text-muted)]">{{ m.buying_price }} / {{ m.selling_price }}</td>
            <td class="px-4 py-3 text-center">
              <UBadge :color="m.is_active ? 'success' : 'neutral'" variant="soft" size="xs">{{ m.is_active ? 'Active' : 'Inactive' }}</UBadge>
            </td>
            <td class="px-4 py-3 text-right">
              <UButton variant="soft" size="xs" @click="edit(m)">Edit</UButton>
              <UButton variant="soft" size="xs" color="error" @click="confirmDelete(m)">Delete</UButton>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div v-else class="rounded-xl border border-dashed border-[var(--p-border)] p-8 text-center">
      <UIcon name="i-lucide-layers" class="mx-auto h-12 w-12 text-[var(--p-text-muted)]" />
      <p class="mt-2 text-sm font-medium text-[var(--p-text-dim)]">No materials yet</p>
      <p class="mt-1 text-sm text-[var(--p-text-muted)]">Add vinyl, banner, etc. for large-format printing.</p>
      <UButton color="primary" class="mt-4" @click="openModal()">Add material</UButton>
    </div>

    <DashboardModalForm v-model="modalOpen" :title="editing ? 'Edit material' : 'Add material'" :description="editing ? 'Update material.' : 'Add large-format material.'">
      <form class="space-y-4" @submit.prevent="onSubmit">
        <DashboardLocalDraftNotice
          v-if="hasDraft && !editing"
          entity-label="material"
          :show-clear="true"
          @clear="clearDraft"
        />
        <UAlert v-if="feedback.errorMessage" color="error" variant="soft" title="Could not save material" :description="feedback.errorMessage" icon="i-lucide-alert-circle" />
        <UFormField label="Material type" required>
          <UInput v-model="form.material_type" placeholder="e.g. Vinyl, Banner" required />
          <DashboardInlineError :message="fieldError('material_type')" />
        </UFormField>
        <UFormField label="Unit" required>
          <UInput v-model="form.unit" placeholder="e.g. SQM" required />
          <DashboardInlineError :message="fieldError('unit')" />
        </UFormField>
        <UFormField label="Buying price" required>
          <UInput v-model="form.buying_price" type="text" placeholder="0.00" required />
          <DashboardInlineError :message="fieldError('buying_price')" />
        </UFormField>
        <UFormField label="Selling price" required>
          <UInput v-model="form.selling_price" type="text" placeholder="0.00" required />
          <DashboardInlineError :message="fieldError('selling_price')" />
        </UFormField>
        <div class="flex items-center gap-2">
          <UCheckbox v-model="form.is_active" />
          <span class="text-sm">Active</span>
        </div>
      </form>
      <template #footer="{ close }">
        <div class="flex justify-end gap-2">
          <UButton variant="ghost" @click="close">Cancel</UButton>
          <DashboardLoadingButton color="primary" :loading="saving || feedback.submitting" :disabled="!canSubmit" @click="onSubmit">{{ editing ? 'Save Changes' : 'Save Material' }}</DashboardLoadingButton>
        </div>
      </template>
    </DashboardModalForm>
  </div>
</template>

<script setup lang="ts">
import { useStorage } from '@vueuse/core'
import type { Material } from '~/services/seller'
import { listMaterialsBySlug, createMaterialBySlug, updateMaterialBySlug, deleteMaterialBySlug } from '~/services/seller'

const props = defineProps<{ shopSlug: string }>()

const feedback = useSubmissionFeedback()
const items = ref<Material[]>([])
const loading = ref(true)
const saving = ref(false)
const modalOpen = ref(false)
const editing = ref<Material | null>(null)

const DRAFT_KEY = computed(() => `material-draft-${props.shopSlug}`)
const defaultForm = {
  material_type: '',
  unit: 'SQM',
  buying_price: '0',
  selling_price: '0',
  is_active: true,
}
const form = useStorage(DRAFT_KEY.value, { ...defaultForm })
const hasDraft = computed(() => (form.value.material_type?.trim().length ?? 0) > 0)

const validationErrors = computed(() => ({
  material_type: form.value.material_type?.trim() ? null : 'Material type is required.',
  unit: form.value.unit?.trim() ? null : 'Unit is required.',
  buying_price: String(form.value.buying_price).trim() ? null : 'Buying price is required.',
  selling_price: String(form.value.selling_price).trim() ? null : 'Selling price is required.',
}))

const canSubmit = computed(() => Object.values(validationErrors.value).every(value => !value))

function fieldError(field: keyof typeof validationErrors.value) {
  return validationErrors.value[field]
}

async function load() {
  if (!props.shopSlug) return
  loading.value = true
  try {
    items.value = await listMaterialsBySlug(props.shopSlug)
  } catch {
    items.value = []
  } finally {
    loading.value = false
  }
}

function openModal(m?: Material) {
  feedback.reset()
  editing.value = m ?? null
  if (m) {
    form.value = {
      material_type: m.material_type,
      unit: m.unit,
      buying_price: m.buying_price,
      selling_price: m.selling_price,
      is_active: m.is_active,
    }
  } else if (!hasDraft.value) {
    form.value = { ...defaultForm }
  }
  modalOpen.value = true
}

function edit(m: Material) {
  openModal(m)
}

function clearDraft() {
  form.value = { ...defaultForm }
}

async function onSubmit() {
  feedback.reset()
  if (!canSubmit.value) {
    feedback.setError('Please correct the highlighted material fields.', 'Validation', false)
    return
  }
  saving.value = true
  try {
    const payload = {
      material_type: form.value.material_type,
      unit: form.value.unit,
      buying_price: form.value.buying_price,
      selling_price: form.value.selling_price,
      is_active: form.value.is_active,
    }
    if (editing.value) {
      await updateMaterialBySlug(props.shopSlug, editing.value.id, payload)
      feedback.setSuccess('Material saved successfully.')
    } else {
      await createMaterialBySlug(props.shopSlug, payload)
      feedback.setSuccess('Material saved successfully.')
    }
    clearDraft()
    modalOpen.value = false
    await load()
  } catch (e) {
    feedback.applyApiError(e, 'We could not save this material right now.')
  } finally {
    saving.value = false
  }
}

async function confirmDelete(m: Material) {
  if (!confirm(`Delete "${m.material_type}"?`)) return
  try {
    await deleteMaterialBySlug(props.shopSlug, m.id)
    feedback.setSuccess('Material deleted successfully.')
    await load()
  } catch (e) {
    feedback.applyApiError(e, 'We could not delete this material right now.')
  }
}

watch(() => props.shopSlug, () => load(), { immediate: true })
</script>
