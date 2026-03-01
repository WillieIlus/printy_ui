<template>
  <div class="space-y-4">
    <div class="flex justify-between items-center">
      <p class="text-sm text-[var(--p-text-muted)]">Products in your catalog. Link to papers/materials and finishing options.</p>
      <UButton color="primary" size="sm" @click="openModal()">
        <UIcon name="i-lucide-plus" class="h-4 w-4 mr-2" />
        Add product
      </UButton>
    </div>

    <CommonLoadingSpinner v-if="loading && !items.length" />
    <UAlert
      v-else-if="loadError"
      color="error"
      variant="soft"
      :title="loadError"
      icon="i-lucide-alert-circle"
      description="The products API may be unavailable. Check your connection and try again."
    >
      <template #actions>
        <UButton variant="soft" size="xs" @click="load">Retry</UButton>
      </template>
    </UAlert>
    <div v-else-if="items.length" class="rounded-xl border border-[var(--p-border)] overflow-hidden">
      <table class="min-w-full divide-y divide-[var(--p-border)]">
        <thead class="bg-[var(--p-surface-sunken)]">
          <tr>
            <th class="px-4 py-3 text-left text-xs font-medium text-[var(--p-text-muted)] uppercase">Name</th>
            <th class="px-4 py-3 text-left text-xs font-medium text-[var(--p-text-muted)] uppercase">Mode</th>
            <th class="px-4 py-3 text-left text-xs font-medium text-[var(--p-text-muted)] uppercase">Size (mm)</th>
            <th class="px-4 py-3 text-center text-xs font-medium text-[var(--p-text-muted)] uppercase">Min qty</th>
            <th class="px-4 py-3 text-center text-xs font-medium text-[var(--p-text-muted)] uppercase">Status</th>
            <th class="px-4 py-3 text-right text-xs font-medium text-[var(--p-text-muted)] uppercase">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-[var(--p-border-dim)]">
          <tr v-for="p in items" :key="p.id" class="hover:bg-[var(--p-surface-sunken)]/50">
            <td class="px-4 py-3">
              <div class="text-sm font-medium text-[var(--p-text)]">{{ p.name }}</div>
              <div v-if="p.category" class="text-xs text-[var(--p-text-muted)]">{{ p.category }}</div>
            </td>
            <td class="px-4 py-3 text-sm text-[var(--p-text-muted)]">{{ p.pricing_mode }}</td>
            <td class="px-4 py-3 text-sm text-[var(--p-text-muted)]">{{ p.default_finished_width_mm }} × {{ p.default_finished_height_mm }}</td>
            <td class="px-4 py-3 text-center text-sm text-[var(--p-text-muted)]">{{ p.min_quantity ?? 1 }}</td>
            <td class="px-4 py-3 text-center">
              <UBadge :color="p.is_active ? 'success' : 'neutral'" variant="soft" size="xs">{{ p.is_active ? 'Active' : 'Inactive' }}</UBadge>
            </td>
            <td class="px-4 py-3 text-right">
              <UButton variant="soft" size="xs" @click="edit(p)">Edit</UButton>
              <UButton variant="soft" size="xs" color="error" @click="confirmDelete(p)">Delete</UButton>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div v-else-if="!loadError" class="rounded-xl border border-dashed border-[var(--p-border)] p-8 text-center">
      <UIcon name="i-lucide-package" class="mx-auto h-12 w-12 text-[var(--p-text-muted)]" />
      <p class="mt-2 text-sm font-medium text-[var(--p-text-dim)]">No products yet</p>
      <p class="mt-1 text-sm text-[var(--p-text-muted)]">Add products to your catalog for buyers to quote.</p>
      <UButton color="primary" class="mt-4" @click="openModal()">Add product</UButton>
    </div>

    <DashboardModalForm
      v-model="modalOpen"
      :title="editing ? 'Edit product' : 'Add product'"
      :description="editing ? 'Update product.' : 'Add a product to your catalog.'"
      :ui="{ content: 'w-[calc(100vw-2rem)] max-w-2xl rounded-lg shadow-xl ring ring-default' }"
    >
      <form class="space-y-6" @submit.prevent="onSubmit">
        <div class="space-y-4">
          <p class="text-sm font-medium text-[var(--p-text-dim)]">Basic info</p>
          <UFormField label="Name" description="Display name of the product.">
            <UInput v-model="form.name" placeholder="e.g. Business Cards" required />
          </UFormField>
          <UFormField label="Description" description="Product description.">
            <UTextarea v-model="form.description" placeholder="Optional" :rows="2" />
          </UFormField>
          <UFormField label="Category" description="Product category.">
            <UInput v-model="form.category" placeholder="Optional" />
          </UFormField>
          <UFormField label="Pricing mode" description="Sheet or large format pricing.">
            <USelectMenu v-model="form.pricing_mode" :items="pricingModeOptions" value-key="value" />
          </UFormField>
        </div>

        <div class="space-y-4">
          <p class="text-sm font-medium text-[var(--p-text-dim)]">Dimensions</p>
          <p class="text-xs text-[var(--p-text-muted)]">Bleed is 3mm (used for auto imposition).</p>
          <div class="grid grid-cols-2 gap-4">
            <UFormField label="Default width (mm)" description="Required for price range.">
              <UInput v-model.number="form.default_finished_width_mm" type="number" min="1" required />
            </UFormField>
            <UFormField label="Default height (mm)" description="Required for price range.">
              <UInput v-model.number="form.default_finished_height_mm" type="number" min="1" required />
            </UFormField>
          </div>
          <UFormField label="Bleed (mm)" description="Used for imposition calculation (default 3mm).">
            <UInput v-model.number="form.default_bleed_mm" type="number" min="0" />
          </UFormField>
          <UFormField label="Minimum quantity" description="Minimum order quantity for price range calculation.">
            <UInput v-model.number="form.min_quantity" type="number" min="1" placeholder="1" />
          </UFormField>
          <template v-if="form.pricing_mode === 'LARGE_FORMAT'">
            <UFormField label="Min width (mm)" description="For LARGE_FORMAT price range.">
              <UInput v-model.number="form.min_width_mm" type="number" min="0" placeholder="Optional" />
            </UFormField>
            <UFormField label="Min height (mm)" description="For LARGE_FORMAT price range.">
              <UInput v-model.number="form.min_height_mm" type="number" min="0" placeholder="Optional" />
            </UFormField>
          </template>
          <UFormField label="Default sides" description="Simplex (1-sided) or duplex (2-sided).">
            <USelectMenu v-model="form.default_sides" :items="sidesOptions" value-key="value" />
          </UFormField>
        </div>

        <div class="space-y-4">
          <p class="text-sm font-medium text-[var(--p-text-dim)]">Paper constraints</p>
          <p class="text-xs text-[var(--p-text-muted)]">e.g. business card 250–350 gsm; flyer 130–170 gsm.</p>
          <div class="grid grid-cols-2 gap-4">
            <UFormField label="Min GSM" description="Minimum paper grammage allowed.">
              <UInput v-model.number="form.min_gsm" type="number" min="0" placeholder="Optional" />
            </UFormField>
            <UFormField label="Max GSM" description="Maximum paper grammage allowed.">
              <UInput v-model.number="form.max_gsm" type="number" min="0" placeholder="Optional" />
            </UFormField>
          </div>
        </div>

        <div class="flex items-center gap-2">
          <UCheckbox v-model="form.is_active" />
          <span class="text-sm text-[var(--p-text-dim)]">Active</span>
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
import {
  listProductsBySlug,
  createProductBySlug,
  updateProductBySlug,
  deleteProductBySlug,
} from '~/services/seller'

const props = defineProps<{ shopSlug: string }>()

const toast = useToast()
const items = ref<Product[]>([])
const loadError = ref<string | null>(null)
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
  min_quantity: 1,
  min_width_mm: null as number | null,
  min_height_mm: null as number | null,
  min_gsm: null as number | null,
  max_gsm: null as number | null,
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
  if (!props.shopSlug) return
  loading.value = true
  loadError.value = null
  try {
    items.value = await listProductsBySlug(props.shopSlug)
  } catch (e: unknown) {
    items.value = []
    const err = e as { statusCode?: number; status?: number; message?: string }
    const status = err?.statusCode ?? err?.status
    loadError.value = status === 500
      ? 'Server error (500) — products API may need a backend deploy.'
      : (e instanceof Error ? e.message : 'Failed to load products')
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
    form.min_quantity = p.min_quantity ?? 1
    form.min_width_mm = p.min_width_mm ?? null
    form.min_height_mm = p.min_height_mm ?? null
    form.min_gsm = p.min_gsm ?? null
    form.max_gsm = p.max_gsm ?? null
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
    form.min_quantity = 1
    form.min_width_mm = null
    form.min_height_mm = null
    form.min_gsm = null
    form.max_gsm = null
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
    const payload: Record<string, unknown> = {
      name: form.name.trim(),
      description: form.description?.trim() ?? '',
      category: form.category?.trim() ?? '',
      pricing_mode: form.pricing_mode,
      default_finished_width_mm: Number(form.default_finished_width_mm) || 90,
      default_finished_height_mm: Number(form.default_finished_height_mm) || 54,
      default_bleed_mm: Number(form.default_bleed_mm) ?? 3,
      min_quantity: Math.max(1, Number(form.min_quantity) || 1),
      default_sides: form.default_sides,
      is_active: form.is_active,
    }
    payload.min_width_mm = form.min_width_mm ?? null
    payload.min_height_mm = form.min_height_mm ?? null
    payload.min_gsm = form.min_gsm ?? null
    payload.max_gsm = form.max_gsm ?? null
    if (editing.value) {
      await updateProductBySlug(props.shopSlug, editing.value.id, payload)
      toast.add({ title: 'Updated', color: 'success' })
    } else {
      await createProductBySlug(props.shopSlug, payload)
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
    await deleteProductBySlug(props.shopSlug, p.id)
    toast.add({ title: 'Deleted', color: 'success' })
    await load()
  } catch (e) {
    toast.add({ title: 'Error', description: e instanceof Error ? e.message : 'Failed', color: 'error' })
  }
}

watch(
  () => props.shopSlug,
  (slug) => {
    if (slug) load()
  },
  { immediate: true }
)
</script>
