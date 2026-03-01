<template>
  <div class="space-y-4">
    <div class="flex justify-between items-center">
      <p class="text-sm text-gray-600 dark:text-gray-400">Large-format materials (vinyl, banner, etc.) sold by area. Used for LARGE_FORMAT pricing.</p>
      <UButton color="primary" size="sm" @click="openModal()">
        <UIcon name="i-lucide-plus" class="h-4 w-4 mr-2" />
        Add material
      </UButton>
    </div>

    <CommonLoadingSpinner v-if="loading && !items.length" />
    <div v-else-if="items.length" class="rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
      <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead class="bg-gray-50 dark:bg-gray-800">
          <tr>
            <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Material</th>
            <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Unit</th>
            <th class="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Buy / Sell</th>
            <th class="px-4 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Status</th>
            <th class="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
          <tr v-for="m in items" :key="m.id" class="hover:bg-gray-50 dark:hover:bg-gray-800/50">
            <td class="px-4 py-3 text-sm font-medium text-gray-900 dark:text-white">{{ m.material_type }}</td>
            <td class="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">{{ m.unit }}</td>
            <td class="px-4 py-3 text-right text-sm text-gray-600 dark:text-gray-400">{{ m.buying_price }} / {{ m.selling_price }}</td>
            <td class="px-4 py-3 text-center">
              <UBadge :color="m.is_active ? 'success' : 'neutral'" variant="soft" size="xs">{{ m.is_active ? 'Active' : 'Inactive' }}</UBadge>
            </td>
            <td class="px-4 py-3 text-right">
              <UButton variant="ghost" size="xs" @click="edit(m)">Edit</UButton>
              <UButton variant="ghost" size="xs" color="error" @click="confirmDelete(m)">Delete</UButton>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div v-else class="rounded-xl border border-dashed border-gray-300 dark:border-gray-600 p-8 text-center">
      <UIcon name="i-lucide-layers" class="mx-auto h-12 w-12 text-gray-400" />
      <p class="mt-2 text-sm font-medium text-gray-700 dark:text-gray-300">No materials yet</p>
      <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">Add vinyl, banner, etc. for large-format printing.</p>
      <UButton color="primary" class="mt-4" @click="openModal()">Add material</UButton>
    </div>

    <DashboardModalForm v-model="modalOpen" :title="editing ? 'Edit material' : 'Add material'" :description="editing ? 'Update material.' : 'Add large-format material.'">
      <form class="space-y-4" @submit.prevent="onSubmit">
        <UFormField label="Material type">
          <UInput v-model="form.material_type" placeholder="e.g. Vinyl, Banner" required />
        </UFormField>
        <UFormField label="Unit">
          <UInput v-model="form.unit" placeholder="e.g. SQM" required />
        </UFormField>
        <UFormField label="Buying price">
          <UInput v-model="form.buying_price" type="text" placeholder="0.00" required />
        </UFormField>
        <UFormField label="Selling price">
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
import type { Material } from '~/services/seller'
import { listMaterials, createMaterial, updateMaterial, deleteMaterial } from '~/services/seller'

const props = defineProps<{ shopId: number }>()

const toast = useToast()
const items = ref<Material[]>([])
const loading = ref(true)
const saving = ref(false)
const modalOpen = ref(false)
const editing = ref<Material | null>(null)

const form = reactive({
  material_type: '',
  unit: 'SQM',
  buying_price: '0',
  selling_price: '0',
  is_active: true,
})

async function load() {
  loading.value = true
  try {
    items.value = await listMaterials(props.shopId)
  } catch {
    items.value = []
  } finally {
    loading.value = false
  }
}

function openModal(m?: Material) {
  editing.value = m ?? null
  if (m) {
    form.material_type = m.material_type
    form.unit = m.unit
    form.buying_price = m.buying_price
    form.selling_price = m.selling_price
    form.is_active = m.is_active
  } else {
    form.material_type = ''
    form.unit = 'SQM'
    form.buying_price = '0'
    form.selling_price = '0'
    form.is_active = true
  }
  modalOpen.value = true
}

function edit(m: Material) {
  openModal(m)
}

async function onSubmit() {
  saving.value = true
  try {
    const payload = {
      material_type: form.material_type,
      unit: form.unit,
      buying_price: form.buying_price,
      selling_price: form.selling_price,
      is_active: form.is_active,
    }
    if (editing.value) {
      await updateMaterial(props.shopId, editing.value.id, payload)
      toast.add({ title: 'Updated', color: 'success' })
    } else {
      await createMaterial(props.shopId, payload)
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

async function confirmDelete(m: Material) {
  if (!confirm(`Delete "${m.material_type}"?`)) return
  try {
    await deleteMaterial(props.shopId, m.id)
    toast.add({ title: 'Deleted', color: 'success' })
    await load()
  } catch (e) {
    toast.add({ title: 'Error', description: e instanceof Error ? e.message : 'Failed', color: 'error' })
  }
}

onMounted(() => load())
</script>
