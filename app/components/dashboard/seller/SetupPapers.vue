<template>
  <div class="space-y-4">
    <div class="flex justify-between items-center">
      <p class="text-sm text-[var(--p-text-muted)]">Paper stock by size, GSM and type. Used for SHEET pricing.</p>
      <UButton color="primary" size="sm" @click="openModal()">
        <UIcon name="i-lucide-plus" class="h-4 w-4 mr-2" />
        Add paper
      </UButton>
    </div>

    <CommonLoadingSpinner v-if="loading && !items.length" />
    <div v-else-if="items.length" class="rounded-xl border border-[var(--p-border)] overflow-hidden">
      <table class="min-w-full divide-y divide-[var(--p-border)]">
        <thead class="bg-[var(--p-surface-sunken)]">
          <tr>
            <th class="px-4 py-3 text-left text-xs font-medium text-[var(--p-text-muted)] uppercase">Paper</th>
            <th class="px-4 py-3 text-right text-xs font-medium text-[var(--p-text-muted)] uppercase">In stock</th>
            <th class="px-4 py-3 text-right text-xs font-medium text-[var(--p-text-muted)] uppercase">Buy / Sell</th>
            <th class="px-4 py-3 text-center text-xs font-medium text-[var(--p-text-muted)] uppercase">Status</th>
            <th class="px-4 py-3 text-right text-xs font-medium text-[var(--p-text-muted)] uppercase">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-[var(--p-border-dim)]">
          <tr v-for="p in items" :key="p.id" class="hover:bg-[var(--p-surface-sunken)]/50">
            <td class="px-4 py-3">
              <div class="text-sm font-medium text-[var(--p-text)]">{{ p.sheet_size }} {{ p.gsm }}gsm</div>
              <div class="text-xs text-[var(--p-text-muted)]">{{ p.paper_type }}</div>
            </td>
            <td class="px-4 py-3 text-right text-sm text-[var(--p-text-muted)]">{{ p.quantity_in_stock ?? '-' }}</td>
            <td class="px-4 py-3 text-right text-sm text-[var(--p-text-muted)]">{{ p.buying_price }} / {{ p.selling_price }}</td>
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
    <div v-else class="rounded-xl border border-dashed border-[var(--p-border)] p-8 text-center">
      <UIcon name="i-lucide-file-stack" class="mx-auto h-12 w-12 text-[var(--p-text-muted)]" />
      <p class="mt-2 text-sm font-medium text-[var(--p-text-dim)]">No papers yet</p>
      <p class="mt-1 text-sm text-[var(--p-text-muted)]">Add paper stock for sheet-fed printing.</p>
      <UButton color="primary" class="mt-4" @click="openModal()">Add paper</UButton>
    </div>

    <DashboardModalForm v-model="modalOpen" :title="editing ? 'Edit paper' : 'Add paper'" :description="editing ? 'Update paper stock.' : 'Add paper stock.'">
      <form class="space-y-4" @submit.prevent="onSubmit">
        <p v-if="hasDraft && !editing" class="text-xs text-[var(--p-text-muted)] italic">Draft saved automatically</p>
        <div v-if="submitError" class="rounded-lg border border-red-300 dark:border-red-800 bg-red-50 dark:bg-red-950/30 p-3 text-sm text-red-700 dark:text-red-300">
          {{ submitError }}
        </div>
        <UFormField label="Sheet size" required>
          <USelectMenu v-model="form.sheet_size" :items="sheetSizeOptions" value-key="value" class="rounded-xl" />
        </UFormField>
        <UFormField label="GSM" required>
          <UInput v-model.number="form.gsm" type="number" min="1" required />
        </UFormField>
        <UFormField label="Paper type" required>
          <USelectMenu v-model="form.paper_type" :items="paperTypeOptions" value-key="value" class="rounded-xl" />
        </UFormField>
        <UFormField label="Buying price" required>
          <UInput v-model="form.buying_price" type="text" placeholder="0.00" required />
        </UFormField>
        <UFormField label="Selling price" required>
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
import { useStorage } from '@vueuse/core'
import type { Paper } from '~/services/seller'
import { listPapersBySlug, createPaperBySlug, updatePaperBySlug, deletePaperBySlug } from '~/services/seller'

const props = defineProps<{ shopSlug: string }>()

const toast = useToast()
const items = ref<Paper[]>([])
const loading = ref(true)
const saving = ref(false)
const submitError = ref<string | null>(null)
const modalOpen = ref(false)
const editing = ref<Paper | null>(null)

const DRAFT_KEY = computed(() => `paper-draft-${props.shopSlug}`)
const defaultForm = {
  sheet_size: 'A4',
  gsm: 80,
  paper_type: 'UNCOATED',
  buying_price: '0',
  selling_price: '0',
  quantity_in_stock: null as number | null,
  reorder_level: null as number | null,
  is_active: true,
}
const form = useStorage(DRAFT_KEY.value, { ...defaultForm })
const hasDraft = computed(() => (form.value.buying_price !== '0' || form.value.selling_price !== '0' || (form.value.gsm ?? 0) > 0))

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
  if (!props.shopSlug) return
  loading.value = true
  try {
    items.value = await listPapersBySlug(props.shopSlug)
  } catch {
    items.value = []
  } finally {
    loading.value = false
  }
}

function openModal(p?: Paper) {
  submitError.value = null
  editing.value = p ?? null
  if (p) {
    form.value = {
      sheet_size: p.sheet_size,
      gsm: p.gsm,
      paper_type: p.paper_type,
      buying_price: p.buying_price,
      selling_price: p.selling_price,
      quantity_in_stock: p.quantity_in_stock,
      reorder_level: p.reorder_level,
      is_active: p.is_active,
    }
  } else if (!hasDraft.value) {
    form.value = { ...defaultForm }
  }
  modalOpen.value = true
}

function edit(p: Paper) {
  openModal(p)
}

async function onSubmit() {
  submitError.value = null
  saving.value = true
  try {
    const payload = {
      sheet_size: form.value.sheet_size,
      gsm: form.value.gsm,
      paper_type: form.value.paper_type,
      buying_price: form.value.buying_price,
      selling_price: form.value.selling_price,
      quantity_in_stock: form.value.quantity_in_stock ?? undefined,
      reorder_level: form.value.reorder_level ?? undefined,
      is_active: form.value.is_active,
    }
    if (editing.value) {
      await updatePaperBySlug(props.shopSlug, editing.value.id, payload)
      toast.add({ title: 'Updated', color: 'success' })
    } else {
      await createPaperBySlug(props.shopSlug, payload)
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

async function confirmDelete(p: Paper) {
  if (!confirm(`Delete ${p.sheet_size} ${p.gsm}gsm ${p.paper_type}?`)) return
  try {
    await deletePaperBySlug(props.shopSlug, p.id)
    toast.add({ title: 'Deleted', color: 'success' })
    await load()
  } catch (e) {
    toast.add({ title: 'Error', description: e instanceof Error ? e.message : 'Failed', color: 'error' })
  }
}

watch(() => props.shopSlug, () => load(), { immediate: true })
</script>
