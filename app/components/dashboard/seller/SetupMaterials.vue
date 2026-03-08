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
        <p v-if="hasDraft && !editing" class="text-xs text-[var(--p-text-muted)] italic">Draft saved automatically</p>
        <div v-if="submitError" class="rounded-lg border border-red-300 dark:border-red-800 bg-red-50 dark:bg-red-950/30 p-3 text-sm text-red-700 dark:text-red-300">
          {{ submitError }}
        </div>
        <UFormField label="Material type" required>
          <UInput v-model="form.material_type" placeholder="e.g. Vinyl, Banner" required />
        </UFormField>
        <UFormField label="Unit" required>
          <UInput v-model="form.unit" placeholder="e.g. SQM" required />
        </UFormField>
        <UFormField label="Buying price" required>
          <UInput v-model="form.buying_price" type="text" placeholder="0.00" required />
        </UFormField>
        <UFormField label="Selling price" required>
          <UInput v-model="form.selling_price" type="text" placeholder="0.00" required />
        </UFormField>
        <div class="flex items-center gap-2">
          <UCheckbox v-model="form.is_active" />
          <span class="text-sm">Active</span>
        </div>
      </form>
      <template #footer="{ close }">
        <div class="flex justify-end gap-2">
          <UButton variant="ghost" @click="close">Cancel</UButton>
          <UButton color="primary" :loading="saving" @click="onSubmit">Save</UButton>
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

const toast = useToast()
const items = ref<Material[]>([])
const loading = ref(true)
const saving = ref(false)
const submitError = ref<string | null>(null)
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
  submitError.value = null
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

async function onSubmit() {
  submitError.value = null
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
      toast.add({ title: 'Updated', color: 'success' })
    } else {
      await createMaterialBySlug(props.shopSlug, payload)
      toast.add({ title: 'Added', color: 'success' })
    }
    form.value = { ...defaultForm }
    modalOpen.value = false
    await load()
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Failed'
    submitError.value = msg
    toast.add({ title: 'Error', description: msg, color: 'error' })
  } finally {
    saving.value = false
  }
}

async function confirmDelete(m: Material) {
  if (!confirm(`Delete "${m.material_type}"?`)) return
  try {
    await deleteMaterialBySlug(props.shopSlug, m.id)
    toast.add({ title: 'Deleted', color: 'success' })
    await load()
  } catch (e) {
    toast.add({ title: 'Error', description: e instanceof Error ? e.message : 'Failed', color: 'error' })
  }
}

watch(() => props.shopSlug, () => load(), { immediate: true })
</script>
