<template>
  <div class="space-y-4">
    <div class="flex justify-between items-center">
      <p class="text-sm text-gray-600 dark:text-gray-400">Add printers and equipment. Set printing rates per machine.</p>
      <UButton color="primary" size="sm" @click="openModal()">
        <UIcon name="i-lucide-plus" class="h-4 w-4 mr-2" />
        Add machine
      </UButton>
    </div>

    <CommonLoadingSpinner v-if="loading && !items.length" />
    <div v-else-if="items.length" class="rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
      <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead class="bg-gray-50 dark:bg-gray-800">
          <tr>
            <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Name</th>
            <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Type</th>
            <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Size (mm)</th>
            <th class="px-4 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Status</th>
            <th class="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
          <tr v-for="m in items" :key="m.id" class="hover:bg-gray-50 dark:hover:bg-gray-800/50">
            <td class="px-4 py-3 text-sm font-medium text-gray-900 dark:text-white">{{ m.name }}</td>
            <td class="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">{{ machineTypeLabel(m.machine_type) }}</td>
            <td class="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">{{ m.max_width_mm }} × {{ m.max_height_mm }}</td>
            <td class="px-4 py-3 text-center">
              <UBadge :color="m.is_active ? 'success' : 'neutral'" variant="soft" size="xs">{{ m.is_active ? 'Active' : 'Inactive' }}</UBadge>
            </td>
            <td class="px-4 py-3 text-right space-x-2">
              <UButton variant="ghost" size="xs" :to="`/dashboard/machines/${m.id}/rates?shop=${props.shopId}`">
                Rates
              </UButton>
              <UButton variant="ghost" size="xs" @click="edit(m)">Edit</UButton>
              <UButton variant="ghost" size="xs" color="error" @click="confirmDelete(m)">Delete</UButton>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div v-else class="rounded-xl border border-dashed border-gray-300 dark:border-gray-600 p-8 text-center">
      <UIcon name="i-lucide-printer" class="mx-auto h-12 w-12 text-gray-400" />
      <p class="mt-2 text-sm font-medium text-gray-700 dark:text-gray-300">No machines yet</p>
      <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">Add your first printer to set printing rates.</p>
      <UButton color="primary" class="mt-4" @click="openModal()">Add machine</UButton>
    </div>

    <DashboardModalForm
      v-model="modalOpen"
      :title="editing ? 'Edit machine' : 'Add machine'"
      :description="editing ? 'Update printer details.' : 'Add a printer or equipment.'"
    >
      <form class="space-y-4" @submit.prevent="onSubmit">
        <UFormField label="Name">
          <UInput v-model="form.name" placeholder="e.g. HP Indigo" required />
        </UFormField>
        <UFormField label="Type">
          <USelectMenu
            v-model="form.machine_type"
            :items="machineTypeOptions"
            value-key="value"
          />
        </UFormField>
        <UFormField label="Max width (mm)">
          <UInput v-model.number="form.max_width_mm" type="number" min="1" required />
        </UFormField>
        <UFormField label="Max height (mm)">
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
import type { Machine } from '~/services/seller'
import { listMachines, createMachine, updateMachine, deleteMachine } from '~/services/seller'

const props = defineProps<{ shopId: number }>()

const toast = useToast()
const items = ref<Machine[]>([])
const loading = ref(true)
const saving = ref(false)
const modalOpen = ref(false)
const editing = ref<Machine | null>(null)

const form = reactive({
  name: '',
  machine_type: 'DIGITAL',
  max_width_mm: 297,
  max_height_mm: 420,
  min_gsm: null as number | null,
  max_gsm: null as number | null,
  is_active: true,
})

const machineTypeOptions = [
  { value: 'OFFSET', label: 'Offset' },
  { value: 'DIGITAL', label: 'Digital' },
  { value: 'LARGE_FORMAT', label: 'Large Format' },
]

function machineTypeLabel(t: string) {
  return machineTypeOptions.find((o) => o.value === t)?.label ?? t
}

async function load() {
  loading.value = true
  try {
    items.value = await listMachines(props.shopId)
  } catch {
    items.value = []
  } finally {
    loading.value = false
  }
}

function openModal(m?: Machine) {
  editing.value = m ?? null
  if (m) {
    form.name = m.name
    form.machine_type = m.machine_type
    form.max_width_mm = m.max_width_mm
    form.max_height_mm = m.max_height_mm
    form.min_gsm = m.min_gsm
    form.max_gsm = m.max_gsm
    form.is_active = m.is_active
  } else {
    form.name = ''
    form.machine_type = 'DIGITAL'
    form.max_width_mm = 297
    form.max_height_mm = 420
    form.min_gsm = null
    form.max_gsm = null
    form.is_active = true
  }
  modalOpen.value = true
}

function edit(m: Machine) {
  openModal(m)
}

async function onSubmit() {
  saving.value = true
  try {
    const payload = {
      name: form.name,
      machine_type: form.machine_type,
      max_width_mm: form.max_width_mm,
      max_height_mm: form.max_height_mm,
      min_gsm: form.min_gsm ?? undefined,
      max_gsm: form.max_gsm ?? undefined,
      is_active: form.is_active,
    }
    if (editing.value) {
      await updateMachine(props.shopId, editing.value.id, payload)
      toast.add({ title: 'Updated', color: 'success' })
    } else {
      await createMachine(props.shopId, payload)
      toast.add({ title: 'Added', color: 'success' })
    }
    modalOpen.value = false
    await load()
  } catch (e) {
    toast.add({ title: 'Error', description: e instanceof Error ? e.message : 'Failed', color: 'error' })
  } finally {
    saving.value = false
  }
}

async function confirmDelete(m: Machine) {
  if (!confirm(`Delete "${m.name}"?`)) return
  try {
    await deleteMachine(props.shopId, m.id)
    toast.add({ title: 'Deleted', color: 'success' })
    await load()
  } catch (e) {
    toast.add({ title: 'Error', description: e instanceof Error ? e.message : 'Failed', color: 'error' })
  }
}

onMounted(() => load())
</script>
