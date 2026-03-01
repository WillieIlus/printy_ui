<template>
  <div class="space-y-4">
    <div class="flex justify-between items-center">
      <p class="text-sm text-gray-600 dark:text-gray-400">Paper stock by size, GSM and type. Used for SHEET pricing.</p>
      <UButton color="primary" size="sm" @click="openModal()">
        <UIcon name="i-lucide-plus" class="h-4 w-4 mr-2" />
        Add paper
      </UButton>
    </div>

    <CommonLoadingSpinner v-if="loading && !items.length" />
    <div v-else-if="items.length" class="rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
      <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead class="bg-gray-50 dark:bg-gray-800">
          <tr>
            <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Paper</th>
            <th class="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">In stock</th>
            <th class="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Buy / Sell</th>
            <th class="px-4 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Status</th>
            <th class="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
          <tr v-for="p in items" :key="p.id" class="hover:bg-gray-50 dark:hover:bg-gray-800/50">
            <td class="px-4 py-3">
              <div class="text-sm font-medium text-gray-900 dark:text-white">{{ p.sheet_size }} {{ p.gsm }}gsm</div>
              <div class="text-xs text-gray-500 dark:text-gray-400">{{ p.paper_type }}</div>
            </td>
            <td class="px-4 py-3 text-right text-sm text-gray-600 dark:text-gray-400">{{ p.quantity_in_stock ?? '-' }}</td>
            <td class="px-4 py-3 text-right text-sm text-gray-600 dark:text-gray-400">{{ p.buying_price }} / {{ p.selling_price }}</td>
            <td class="px-4 py-3 text-center">
              <UBadge :color="p.is_active ? 'success' : 'neutral'" variant="soft" size="xs">{{ p.is_active ? 'Active' : 'Inactive' }}</UBadge>
            </td>
            <td class="px-4 py-3 text-right">
              <UButton variant="ghost" size="xs" @click="edit(p)">Edit</UButton>
              <UButton variant="ghost" size="xs" color="error" @click="confirmDelete(p)">Delete</UButton>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div v-else class="rounded-xl border border-dashed border-gray-300 dark:border-gray-600 p-8 text-center">
      <UIcon name="i-lucide-file-stack" class="mx-auto h-12 w-12 text-gray-400" />
      <p class="mt-2 text-sm font-medium text-gray-700 dark:text-gray-300">No papers yet</p>
      <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">Add paper stock for sheet-fed printing.</p>
      <UButton color="primary" class="mt-4" @click="openModal()">Add paper</UButton>
    </div>

    <DashboardModalForm v-model="modalOpen" :title="editing ? 'Edit paper' : 'Add paper'" :description="editing ? 'Update paper stock.' : 'Add paper stock.'">
      <form class="space-y-4" @submit.prevent="onSubmit">
        <UFormField label="Sheet size">
          <USelectMenu v-model="form.sheet_size" :items="sheetSizeOptions" value-key="value" />
        </UFormField>
        <UFormField label="GSM">
          <UInput v-model.number="form.gsm" type="number" min="1" required />
        </UFormField>
        <UFormField label="Paper type">
          <USelectMenu v-model="form.paper_type" :items="paperTypeOptions" value-key="value" />
        </UFormField>
        <UFormField label="Buying price">
          <UInput v-model="form.buying_price" type="text" placeholder="0.00" required />
        </UFormField>
        <UFormField label="Selling price">
          <UInput v-model="form.selling_price" type="text" placeholder="0.00" required />
        </UFormField>
        <UFormField label="Quantity in stock">
          <UInput v-model.number="form.quantity_in_stock" type="number" min="0" placeholder="Optional" />
        </UFormField>
        <UFormField label="Reorder level">
          <UInput v-model.number="form.reorder_level" type="number" min="0" placeholder="Optional" />
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
import type { Paper } from '~/services/seller'
import { listPapers, createPaper, updatePaper, deletePaper } from '~/services/seller'

const props = defineProps<{ shopId: number }>()

const toast = useToast()
const items = ref<Paper[]>([])
const loading = ref(true)
const saving = ref(false)
const modalOpen = ref(false)
const editing = ref<Paper | null>(null)

const form = reactive({
  sheet_size: 'A4',
  gsm: 80,
  paper_type: 'UNCOATED',
  buying_price: '0',
  selling_price: '0',
  quantity_in_stock: null as number | null,
  reorder_level: null as number | null,
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

const paperTypeOptions = [
  { value: 'COATED', label: 'Coated' },
  { value: 'UNCOATED', label: 'Uncoated' },
  { value: 'RECYCLED', label: 'Recycled' },
  { value: 'GLOSS', label: 'Gloss' },
  { value: 'MATTE', label: 'Matte' },
  { value: 'OTHER', label: 'Other' },
]

async function load() {
  loading.value = true
  try {
    items.value = await listPapers(props.shopId)
  } catch {
    items.value = []
  } finally {
    loading.value = false
  }
}

function openModal(p?: Paper) {
  editing.value = p ?? null
  if (p) {
    form.sheet_size = p.sheet_size
    form.gsm = p.gsm
    form.paper_type = p.paper_type
    form.buying_price = p.buying_price
    form.selling_price = p.selling_price
    form.quantity_in_stock = p.quantity_in_stock
    form.reorder_level = p.reorder_level
    form.is_active = p.is_active
  } else {
    form.sheet_size = 'A4'
    form.gsm = 80
    form.paper_type = 'UNCOATED'
    form.buying_price = '0'
    form.selling_price = '0'
    form.quantity_in_stock = null
    form.reorder_level = null
    form.is_active = true
  }
  modalOpen.value = true
}

function edit(p: Paper) {
  openModal(p)
}

async function onSubmit() {
  saving.value = true
  try {
    const payload = {
      sheet_size: form.sheet_size,
      gsm: form.gsm,
      paper_type: form.paper_type,
      buying_price: form.buying_price,
      selling_price: form.selling_price,
      quantity_in_stock: form.quantity_in_stock ?? undefined,
      reorder_level: form.reorder_level ?? undefined,
      is_active: form.is_active,
    }
    if (editing.value) {
      await updatePaper(props.shopId, editing.value.id, payload)
      toast.add({ title: 'Updated', color: 'success' })
    } else {
      await createPaper(props.shopId, payload)
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

async function confirmDelete(p: Paper) {
  if (!confirm(`Delete ${p.sheet_size} ${p.gsm}gsm ${p.paper_type}?`)) return
  try {
    await deletePaper(props.shopId, p.id)
    toast.add({ title: 'Deleted', color: 'success' })
    await load()
  } catch (e) {
    toast.add({ title: 'Error', description: e instanceof Error ? e.message : 'Failed', color: 'error' })
  }
}

onMounted(() => load())
</script>
