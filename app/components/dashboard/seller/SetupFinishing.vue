<template>
  <div class="space-y-4">
    <div class="flex justify-between items-center">
      <p class="text-sm text-gray-600 dark:text-gray-400">Finishing services (lamination, binding, etc.) with charge units.</p>
      <UButton color="primary" size="sm" @click="openModal()">
        <UIcon name="i-lucide-plus" class="h-4 w-4 mr-2" />
        Add finishing
      </UButton>
    </div>

    <CommonLoadingSpinner v-if="loading && !items.length" />
    <div v-else-if="items.length" class="rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
      <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead class="bg-gray-50 dark:bg-gray-800">
          <tr>
            <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Name</th>
            <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Charge</th>
            <th class="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Price</th>
            <th class="px-4 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Status</th>
            <th class="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
          <tr v-for="f in items" :key="f.id" class="hover:bg-gray-50 dark:hover:bg-gray-800/50">
            <td class="px-4 py-3 text-sm font-medium text-gray-900 dark:text-white">{{ f.name }}</td>
            <td class="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">{{ chargeUnitLabel(f.charge_unit) }}</td>
            <td class="px-4 py-3 text-right text-sm text-gray-600 dark:text-gray-400">{{ f.price }}{{ f.setup_fee ? ` + ${f.setup_fee} setup` : '' }}</td>
            <td class="px-4 py-3 text-center">
              <UBadge :color="f.is_active ? 'success' : 'neutral'" variant="soft" size="xs">{{ f.is_active ? 'Active' : 'Inactive' }}</UBadge>
            </td>
            <td class="px-4 py-3 text-right">
              <UButton variant="ghost" size="xs" @click="edit(f)">Edit</UButton>
              <UButton variant="ghost" size="xs" color="error" @click="confirmDelete(f)">Delete</UButton>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div v-else class="rounded-xl border border-dashed border-gray-300 dark:border-gray-600 p-8 text-center">
      <UIcon name="i-lucide-scissors" class="mx-auto h-12 w-12 text-gray-400" />
      <p class="mt-2 text-sm font-medium text-gray-700 dark:text-gray-300">No finishing rates yet</p>
      <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">Add lamination, binding, etc.</p>
      <UButton color="primary" class="mt-4" @click="openModal()">Add finishing</UButton>
    </div>

    <DashboardModalForm v-model="modalOpen" :title="editing ? 'Edit finishing' : 'Add finishing'" :description="editing ? 'Update finishing rate.' : 'Add a finishing service.'">
      <form class="space-y-4" @submit.prevent="onSubmit">
        <UFormField label="Name">
          <UInput v-model="form.name" placeholder="e.g. Lamination" required />
        </UFormField>
        <UFormField label="Charge unit">
          <USelectMenu v-model="form.charge_unit" :items="chargeUnitOptions" value-key="value" />
        </UFormField>
        <UFormField label="Price">
          <UInput v-model="form.price" type="text" placeholder="0.00" required />
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
          <UButton color="primary" :loading="saving" @click="onSubmit">Save</UButton>
        </div>
      </template>
    </DashboardModalForm>
  </div>
</template>

<script setup lang="ts">
import type { FinishingRate } from '~/services/seller'
import { listFinishingRates, createFinishingRate, updateFinishingRate, deleteFinishingRate } from '~/services/seller'

const props = defineProps<{ shopId: number }>()

const toast = useToast()
const items = ref<FinishingRate[]>([])
const loading = ref(true)
const saving = ref(false)
const modalOpen = ref(false)
const editing = ref<FinishingRate | null>(null)

const form = reactive({
  name: '',
  charge_unit: 'PER_PIECE',
  price: '0',
  setup_fee: null as string | null,
  min_qty: null as number | null,
  is_active: true,
})

const chargeUnitOptions = [
  { value: 'PER_PIECE', label: 'Per piece' },
  { value: 'PER_SIDE', label: 'Per side' },
  { value: 'PER_SQM', label: 'Per sqm' },
  { value: 'FLAT', label: 'Flat' },
]

function chargeUnitLabel(u: string) {
  return chargeUnitOptions.find((o) => o.value === u)?.label ?? u
}

async function load() {
  loading.value = true
  try {
    items.value = await listFinishingRates(props.shopId)
  } catch {
    items.value = []
  } finally {
    loading.value = false
  }
}

function openModal(f?: FinishingRate) {
  editing.value = f ?? null
  if (f) {
    form.name = f.name
    form.charge_unit = f.charge_unit
    form.price = f.price
    form.setup_fee = f.setup_fee
    form.min_qty = f.min_qty
    form.is_active = f.is_active
  } else {
    form.name = ''
    form.charge_unit = 'PER_PIECE'
    form.price = '0'
    form.setup_fee = null
    form.min_qty = null
    form.is_active = true
  }
  modalOpen.value = true
}

function edit(f: FinishingRate) {
  openModal(f)
}

async function onSubmit() {
  saving.value = true
  try {
    const payload = {
      name: form.name,
      charge_unit: form.charge_unit,
      price: form.price,
      setup_fee: form.setup_fee || undefined,
      min_qty: form.min_qty ?? undefined,
      is_active: form.is_active,
    }
    if (editing.value) {
      await updateFinishingRate(props.shopId, editing.value.id, payload)
      toast.add({ title: 'Updated', color: 'success' })
    } else {
      await createFinishingRate(props.shopId, payload)
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

async function confirmDelete(f: FinishingRate) {
  if (!confirm(`Delete "${f.name}"?`)) return
  try {
    await deleteFinishingRate(props.shopId, f.id)
    toast.add({ title: 'Deleted', color: 'success' })
    await load()
  } catch (e) {
    toast.add({ title: 'Error', description: e instanceof Error ? e.message : 'Failed', color: 'error' })
  }
}

onMounted(() => load())
</script>
