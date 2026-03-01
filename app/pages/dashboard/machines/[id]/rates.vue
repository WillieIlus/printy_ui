<template>
  <div class="col-span-12 space-y-6">
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
          {{ machineName ? `${machineName} — Printing rates` : 'Printing rates' }}
        </h1>
        <p class="text-gray-600 dark:text-gray-400 mt-1">
          Set prices per sheet by size and color. Single = simplex (1-sided), Double = duplex (2-sided).
        </p>
      </div>
      <UButton :to="backUrl" variant="ghost" size="sm">
        <UIcon name="i-lucide-arrow-left" class="mr-2 h-4 w-4" />
        Back to setup
      </UButton>
    </div>

    <CommonLoadingSpinner v-if="loading && !items.length" />
    <div v-else class="space-y-4">
      <div class="flex justify-end">
        <UButton color="primary" size="sm" @click="openModal()">
          <UIcon name="i-lucide-plus" class="h-4 w-4 mr-2" />
          Add rate
        </UButton>
      </div>

      <div v-if="items.length" class="rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead class="bg-gray-50 dark:bg-gray-800">
            <tr>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Sheet size</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Color mode</th>
              <th class="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Single</th>
              <th class="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Double</th>
              <th class="px-4 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Status</th>
              <th class="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
            <tr v-for="r in items" :key="r.id" class="hover:bg-gray-50 dark:hover:bg-gray-800/50">
              <td class="px-4 py-3 text-sm font-medium text-gray-900 dark:text-white">{{ r.sheet_size }}</td>
              <td class="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">{{ r.color_mode === 'BW' ? 'Black & White' : 'Color' }}</td>
              <td class="px-4 py-2 text-right">
                <span
                  v-if="editingCell !== `${r.id}-single`"
                  class="inline-block min-w-[4rem] px-2 py-1 rounded cursor-pointer hover:bg-amber-100 dark:hover:bg-amber-900/30 text-sm tabular-nums"
                  @click="startEdit(r, 'single')"
                >
                  {{ r.single_price }}
                </span>
                <UInput
                  v-else
                  v-model="editValue"
                  type="text"
                  size="xs"
                  class="w-20 text-right tabular-nums"
                  placeholder="0.00"
                  @blur="saveCell(r, 'single')"
                  @keydown.enter="saveCell(r, 'single')"
                />
              </td>
              <td class="px-4 py-2 text-right">
                <span
                  v-if="editingCell !== `${r.id}-double`"
                  class="inline-block min-w-[4rem] px-2 py-1 rounded cursor-pointer hover:bg-amber-100 dark:hover:bg-amber-900/30 text-sm tabular-nums"
                  @click="startEdit(r, 'double')"
                >
                  {{ r.double_price }}
                </span>
                <UInput
                  v-else
                  v-model="editValue"
                  type="text"
                  size="xs"
                  class="w-20 text-right tabular-nums"
                  placeholder="0.00"
                  @blur="saveCell(r, 'double')"
                  @keydown.enter="saveCell(r, 'double')"
                />
              </td>
              <td class="px-4 py-3 text-center">
                <UBadge :color="r.is_active ? 'success' : 'neutral'" variant="soft" size="xs">{{ r.is_active ? 'Active' : 'Inactive' }}</UBadge>
              </td>
              <td class="px-4 py-3 text-right">
                <UButton variant="ghost" size="xs" @click="edit(r)">Edit</UButton>
                <UButton variant="ghost" size="xs" color="error" @click="confirmDelete(r)">Delete</UButton>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div v-else class="rounded-xl border border-dashed border-gray-300 dark:border-gray-600 p-8 text-center">
        <UIcon name="i-lucide-printer" class="mx-auto h-12 w-12 text-gray-400" />
        <p class="mt-2 text-sm font-medium text-gray-700 dark:text-gray-300">No printing rates yet</p>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">Add rates for each sheet size and color mode.</p>
        <UButton color="primary" class="mt-4" @click="openModal()">Add rate</UButton>
      </div>
    </div>

    <DashboardModalForm v-model="modalOpen" :title="editing ? 'Edit printing rate' : 'Add printing rate'" :description="editing ? 'Update rate.' : 'Add a printing rate.'">
      <form class="space-y-4" @submit.prevent="onSubmit">
        <UFormField label="Sheet size">
          <USelectMenu v-model="form.sheet_size" :items="sheetSizeOptions" value-key="value" />
        </UFormField>
        <UFormField label="Color mode">
          <USelectMenu v-model="form.color_mode" :items="colorModeOptions" value-key="value" />
        </UFormField>
        <UFormField label="Single (simplex) price">
          <UInput v-model="form.single_price" type="text" placeholder="0.00" required />
        </UFormField>
        <UFormField label="Double (duplex) price">
          <UInput v-model="form.double_price" type="text" placeholder="0.00" required />
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
import type { Machine, PrintingRate } from '~/services/seller'
import { getMachine, listPrintingRates, createPrintingRate, updatePrintingRate, deletePrintingRate } from '~/services/seller'

definePageMeta({
  layout: 'dashboard',
  middleware: 'auth',
})

const route = useRoute()
const machineId = computed(() => parseInt(route.params.id as string, 10))
const shopId = computed(() => route.query.shop as string)
const backUrl = computed(() => (shopId.value ? `/dashboard/shops/${shopId.value}/setup` : '/dashboard'))

const toast = useToast()
const machineName = ref<string>('')
const items = ref<PrintingRate[]>([])
const loading = ref(true)
const saving = ref(false)
const modalOpen = ref(false)
const editing = ref<PrintingRate | null>(null)
const editingCell = ref<string | null>(null)
const editValue = ref('')

const form = reactive({
  sheet_size: 'A4',
  color_mode: 'BW',
  single_price: '0',
  double_price: '0',
  is_active: true,
})

const sheetSizeOptions = [
  { value: 'A4', label: 'A4' },
  { value: 'A3', label: 'A3' },
  { value: 'SRA3', label: 'SRA3' },
  { value: 'A2', label: 'A2' },
  { value: 'A1', label: 'A1' },
  { value: 'A0', label: 'A0' },
  { value: 'CUSTOM', label: 'Custom' },
]

const colorModeOptions = [
  { value: 'BW', label: 'Black & White' },
  { value: 'COLOR', label: 'Color' },
]

async function load() {
  if (Number.isNaN(machineId.value)) return
  loading.value = true
  try {
    const shopIdNum = shopId.value ? parseInt(shopId.value, 10) : NaN
    if (!Number.isNaN(shopIdNum)) {
      const m = await getMachine(shopIdNum, machineId.value)
      machineName.value = m?.name ?? ''
    }
    items.value = await listPrintingRates(machineId.value)
  } catch {
    items.value = []
  } finally {
    loading.value = false
  }
}

function startEdit(r: PrintingRate, field: 'single' | 'double') {
  editingCell.value = `${r.id}-${field}`
  editValue.value = field === 'single' ? r.single_price : r.double_price
  nextTick(() => {
    const inputs = document.querySelectorAll<HTMLInputElement>('input[type="text"].tabular-nums')
    const last = inputs[inputs.length - 1]
    last?.focus()
  })
}

async function saveCell(r: PrintingRate, field: 'single' | 'double') {
  if (editingCell.value !== `${r.id}-${field}`) return
  const val = editValue.value.trim()
  if (!val) {
    editingCell.value = null
    return
  }
  const payload = field === 'single'
    ? { single_price: val }
    : { double_price: val }
  try {
    const updated = await updatePrintingRate(machineId.value, r.id, payload)
    const idx = items.value.findIndex((i) => i.id === r.id)
    if (idx >= 0) items.value[idx] = updated
    toast.add({ title: 'Updated', color: 'success' })
  } catch (e) {
    toast.add({ title: 'Error', description: e instanceof Error ? e.message : 'Failed', color: 'error' })
  }
  editingCell.value = null
}

function openModal(r?: PrintingRate) {
  editing.value = r ?? null
  if (r) {
    form.sheet_size = r.sheet_size
    form.color_mode = r.color_mode
    form.single_price = r.single_price
    form.double_price = r.double_price
    form.is_active = r.is_active
  } else {
    form.sheet_size = 'A4'
    form.color_mode = 'BW'
    form.single_price = '0'
    form.double_price = '0'
    form.is_active = true
  }
  modalOpen.value = true
}

function edit(r: PrintingRate) {
  openModal(r)
}

async function onSubmit() {
  saving.value = true
  try {
    const payload = {
      sheet_size: form.sheet_size,
      color_mode: form.color_mode,
      single_price: form.single_price,
      double_price: form.double_price,
      is_active: form.is_active,
    }
    if (editing.value) {
      await updatePrintingRate(machineId.value, editing.value.id, payload)
      toast.add({ title: 'Updated', color: 'success' })
    } else {
      await createPrintingRate(machineId.value, payload)
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

async function confirmDelete(r: PrintingRate) {
  if (!confirm(`Delete ${r.sheet_size} ${r.color_mode} rate?`)) return
  try {
    await deletePrintingRate(machineId.value, r.id)
    toast.add({ title: 'Deleted', color: 'success' })
    await load()
  } catch (e) {
    toast.add({ title: 'Error', description: e instanceof Error ? e.message : 'Failed', color: 'error' })
  }
}

onMounted(() => load())
</script>
