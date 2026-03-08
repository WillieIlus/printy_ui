<template>
  <div class="space-y-4">
    <div class="flex justify-between items-center">
      <p class="text-sm text-[var(--p-text-muted)]">Add printers and equipment. Set printing rates per machine.</p>
      <UButton color="primary" size="sm" @click="openModal()">
        <UIcon name="i-lucide-plus" class="h-4 w-4 mr-2" />
        Add machine
      </UButton>
    </div>

    <CommonLoadingSpinner v-if="loading && !items.length" />
    <div v-else-if="items.length" class="rounded-xl border border-[var(--p-border)] overflow-hidden">
      <table class="min-w-full divide-y divide-[var(--p-border)]">
        <thead class="bg-[var(--p-surface-sunken)]">
          <tr>
            <th class="px-4 py-3 text-left text-xs font-medium text-[var(--p-text-muted)] uppercase">Name</th>
            <th class="px-4 py-3 text-left text-xs font-medium text-[var(--p-text-muted)] uppercase">Type</th>
            <th class="px-4 py-3 text-left text-xs font-medium text-[var(--p-text-muted)] uppercase">Size (mm)</th>
            <th class="px-4 py-3 text-center text-xs font-medium text-[var(--p-text-muted)] uppercase">Status</th>
            <th class="px-4 py-3 text-right text-xs font-medium text-[var(--p-text-muted)] uppercase">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-[var(--p-border-dim)]">
          <tr v-for="m in items" :key="m.id" class="hover:bg-[var(--p-surface-sunken)]/50">
            <td class="px-4 py-3 text-sm font-medium text-[var(--p-text)]">{{ m.name }}</td>
            <td class="px-4 py-3 text-sm text-[var(--p-text-muted)]">{{ machineTypeLabel(m.machine_type) }}</td>
            <td class="px-4 py-3 text-sm text-[var(--p-text-muted)]">{{ m.max_width_mm }} × {{ m.max_height_mm }}</td>
            <td class="px-4 py-3 text-center">
              <UBadge :color="m.is_active ? 'success' : 'neutral'" variant="soft" size="xs">{{ m.is_active ? 'Active' : 'Inactive' }}</UBadge>
            </td>
            <td class="px-4 py-3 text-right space-x-2">
              <UButton variant="soft" size="xs" :to="`/dashboard/machines/${m.id}/rates?shop=${props.shopSlug}`">
                Rates
              </UButton>
              <UButton variant="soft" size="xs" @click="edit(m)">Edit</UButton>
              <UButton variant="soft" size="xs" color="error" @click="confirmDelete(m)">Delete</UButton>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div v-else class="rounded-xl border border-dashed border-[var(--p-border)] p-8 text-center">
      <UIcon name="i-lucide-printer" class="mx-auto h-12 w-12 text-[var(--p-text-muted)]" />
      <p class="mt-2 text-sm font-medium text-[var(--p-text-dim)]">No machines yet</p>
      <p class="mt-1 text-sm text-[var(--p-text-muted)]">Add your first printer to set printing rates.</p>
      <UButton color="primary" class="mt-4" @click="openModal()">Add machine</UButton>
    </div>

    <DashboardModalForm
      v-model="modalOpen"
      :title="editing ? 'Edit machine' : 'Add machine'"
      :description="editing ? 'Update printer details.' : 'Add a printer or equipment.'"
    >
      <form class="space-y-4" @submit.prevent="onSubmit">
        <p v-if="hasDraft && !editing" class="text-xs text-[var(--p-text-muted)] italic">Draft saved automatically</p>
        <div v-if="submitError" class="rounded-lg border border-red-300 dark:border-red-800 bg-red-50 dark:bg-red-950/30 p-3 text-sm text-red-700 dark:text-red-300">
          {{ submitError }}
        </div>
        <UFormField label="Name" required>
          <UInput v-model="form.name" placeholder="e.g. HP Indigo" required />
        </UFormField>
        <UFormField label="Type" required>
          <USelectMenu
            v-model="form.machine_type"
            :items="machineTypeOptions"
            value-key="value"
            class="rounded-xl"
          />
        </UFormField>
        <UFormField label="Max width (mm)" required>
          <UInput v-model.number="form.max_width_mm" type="number" min="1" required />
        </UFormField>
        <UFormField label="Max height (mm)" required>
          <UInput v-model.number="form.max_height_mm" type="number" min="1" required />
        </UFormField>
        <UFormField label="Min GSM">
          <UInput v-model.number="form.min_gsm" type="number" min="0" placeholder="Optional" />
        </UFormField>
        <UFormField label="Max GSM">
          <UInput v-model.number="form.max_gsm" type="number" min="0" placeholder="Optional" />
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
import type { Machine } from '~/services/seller'
import { listMachinesBySlug, createMachineBySlug, updateMachineBySlug, deleteMachineBySlug } from '~/services/seller'

const props = defineProps<{ shopSlug: string }>()

const toast = useToast()
const items = ref<Machine[]>([])
const loading = ref(true)
const saving = ref(false)
const submitError = ref<string | null>(null)
const modalOpen = ref(false)
const editing = ref<Machine | null>(null)

const DRAFT_KEY = computed(() => `machine-draft-${props.shopSlug}`)
const defaultForm = {
  name: '',
  machine_type: 'DIGITAL',
  max_width_mm: 297,
  max_height_mm: 420,
  min_gsm: null as number | null,
  max_gsm: null as number | null,
  is_active: true,
}
const form = useStorage(DRAFT_KEY.value, { ...defaultForm })
const hasDraft = computed(() => (form.value.name?.trim().length ?? 0) > 0)

const machineTypeOptions = [
  { value: 'OFFSET', label: 'Offset' },
  { value: 'DIGITAL', label: 'Digital' },
  { value: 'LARGE_FORMAT', label: 'Large Format' },
]

function machineTypeLabel(t: string) {
  return machineTypeOptions.find((o) => o.value === t)?.label ?? t
}

async function load() {
  if (!props.shopSlug) return
  loading.value = true
  try {
    items.value = await listMachinesBySlug(props.shopSlug)
  } catch {
    items.value = []
  } finally {
    loading.value = false
  }
}

function openModal(m?: Machine) {
  submitError.value = null
  editing.value = m ?? null
  if (m) {
    form.value = {
      name: m.name,
      machine_type: m.machine_type,
      max_width_mm: m.max_width_mm,
      max_height_mm: m.max_height_mm,
      min_gsm: m.min_gsm,
      max_gsm: m.max_gsm,
      is_active: m.is_active,
    }
  } else if (!form.value.name?.trim()) {
    form.value = { ...defaultForm }
  }
  modalOpen.value = true
}

function edit(m: Machine) {
  openModal(m)
}

async function onSubmit() {
  submitError.value = null
  saving.value = true
  try {
    const payload = {
      name: form.value.name,
      machine_type: form.value.machine_type,
      max_width_mm: form.value.max_width_mm,
      max_height_mm: form.value.max_height_mm,
      min_gsm: form.value.min_gsm ?? undefined,
      max_gsm: form.value.max_gsm ?? undefined,
      is_active: form.value.is_active,
    }
    if (editing.value) {
      await updateMachineBySlug(props.shopSlug, editing.value.id, payload)
      toast.add({ title: 'Updated', color: 'success' })
    } else {
      await createMachineBySlug(props.shopSlug, payload)
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

async function confirmDelete(m: Machine) {
  if (!confirm(`Delete "${m.name}"?`)) return
  try {
    await deleteMachineBySlug(props.shopSlug, m.id)
    toast.add({ title: 'Deleted', color: 'success' })
    await load()
  } catch (e) {
    toast.add({ title: 'Error', description: e instanceof Error ? e.message : 'Failed', color: 'error' })
  }
}

watch(() => props.shopSlug, () => load(), { immediate: true })
</script>
