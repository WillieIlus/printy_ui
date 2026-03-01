<template>
  <div class="space-y-4">
    <div class="flex justify-between items-center">
      <p class="text-sm text-gray-600 dark:text-gray-400">Products in your catalog. Link to papers/materials and finishing options.</p>
      <UButton color="primary" size="sm" @click="openModal()">
        <UIcon name="i-lucide-plus" class="h-4 w-4 mr-2" />
        Add product
      </UButton>
    </div>

    <CommonLoadingSpinner v-if="loading && !items.length" />
    <div v-else-if="items.length" class="rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
      <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead class="bg-gray-50 dark:bg-gray-800">
          <tr>
            <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Name</th>
            <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Mode</th>
            <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Size (mm)</th>
            <th class="px-4 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Status</th>
            <th class="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
          <tr v-for="p in items" :key="p.id" class="hover:bg-gray-50 dark:hover:bg-gray-800/50">
            <td class="px-4 py-3">
              <div class="text-sm font-medium text-gray-900 dark:text-white">{{ p.name }}</div>
              <div v-if="p.category" class="text-xs text-gray-500 dark:text-gray-400">{{ p.category }}</div>
            </td>
            <td class="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">{{ p.pricing_mode }}</td>
            <td class="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">{{ p.default_finished_width_mm }} × {{ p.default_finished_height_mm }}</td>
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
      <UIcon name="i-lucide-package" class="mx-auto h-12 w-12 text-gray-400" />
      <p class="mt-2 text-sm font-medium text-gray-700 dark:text-gray-300">No products yet</p>
      <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">Add products to your catalog for buyers to quote.</p>
      <UButton color="primary" class="mt-4" @click="openModal()">Add product</UButton>
    </div>

    <DashboardModalForm v-model="modalOpen" :title="editing ? 'Edit product' : 'Add product'" :description="editing ? 'Update product.' : 'Add a product to your catalog.'">
      <form class="space-y-4" @submit.prevent="onSubmit">
        <UFormField label="Name">
          <UInput v-model="form.name" placeholder="e.g. Business Cards" required />
        </UFormField>
        <UFormField label="Description">
          <UTextarea v-model="form.description" placeholder="Optional" :rows="2" />
        </UFormField>
        <UFormField label="Category">
          <UInput v-model="form.category" placeholder="Optional" />
        </UFormField>
        <UFormField label="Pricing mode">
          <USelectMenu v-model="form.pricing_mode" :items="pricingModeOptions" value-key="value" />
        </UFormField>
        <UFormField label="Default width (mm)">
          <UInput v-model.number="form.default_finished_width_mm" type="number" min="1" required />
        </UFormField>
        <UFormField label="Default height (mm)">
          <UInput v-model.number="form.default_finished_height_mm" type="number" min="1" required />
        </UFormField>
        <UFormField label="Bleed (mm)">
          <UInput v-model.number="form.default_bleed_mm" type="number" min="0" />
        </UFormField>
        <UFormField label="Default sides">
          <USelectMenu v-model="form.default_sides" :items="sidesOptions" value-key="value" />
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
import type { Product } from '~/services/seller'
import { listProducts, createProduct, updateProduct, deleteProduct } from '~/services/seller'

const props = defineProps<{ shopId: number }>()

const toast = useToast()
const items = ref<Product[]>([])
const loading = ref(true)
const saving = ref(false)
const modalOpen = ref(false)
const editing = ref<Product | null>(null)

const form = reactive({
  name: '',
  description: '',
  category: '',
  pricing_mode: 'SHEET',
  default_finished_width_mm: 90,
  default_finished_height_mm: 54,
  default_bleed_mm: 3,
  default_sides: 'SIMPLEX',
  is_active: true,
})

const pricingModeOptions = [
  { value: 'SHEET', label: 'Sheet' },
  { value: 'LARGE_FORMAT', label: 'Large Format' },
]

const sidesOptions = [
  { value: 'SIMPLEX', label: 'Simplex (1-sided)' },
  { value: 'DUPLEX', label: 'Duplex (2-sided)' },
]

async function load() {
  loading.value = true
  try {
    items.value = await listProducts(props.shopId)
  } catch {
    items.value = []
  } finally {
    loading.value = false
  }
}

function openModal(p?: Product) {
  editing.value = p ?? null
  if (p) {
    form.name = p.name
    form.description = p.description ?? ''
    form.category = p.category ?? ''
    form.pricing_mode = p.pricing_mode
    form.default_finished_width_mm = p.default_finished_width_mm
    form.default_finished_height_mm = p.default_finished_height_mm
    form.default_bleed_mm = p.default_bleed_mm
    form.default_sides = p.default_sides
    form.is_active = p.is_active
  } else {
    form.name = ''
    form.description = ''
    form.category = ''
    form.pricing_mode = 'SHEET'
    form.default_finished_width_mm = 90
    form.default_finished_height_mm = 54
    form.default_bleed_mm = 3
    form.default_sides = 'SIMPLEX'
    form.is_active = true
  }
  modalOpen.value = true
}

function edit(p: Product) {
  openModal(p)
}

async function onSubmit() {
  saving.value = true
  try {
    const payload = {
      name: form.name,
      description: form.description || undefined,
      category: form.category || undefined,
      pricing_mode: form.pricing_mode,
      default_finished_width_mm: form.default_finished_width_mm,
      default_finished_height_mm: form.default_finished_height_mm,
      default_bleed_mm: form.default_bleed_mm,
      default_sides: form.default_sides,
      is_active: form.is_active,
    }
    if (editing.value) {
      await updateProduct(props.shopId, editing.value.id, payload)
      toast.add({ title: 'Updated', color: 'success' })
    } else {
      await createProduct(props.shopId, payload)
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

async function confirmDelete(p: Product) {
  if (!confirm(`Delete "${p.name}"?`)) return
  try {
    await deleteProduct(props.shopId, p.id)
    toast.add({ title: 'Deleted', color: 'success' })
    await load()
  } catch (e) {
    toast.add({ title: 'Error', description: e instanceof Error ? e.message : 'Failed', color: 'error' })
  }
}

onMounted(() => load())
</script>
