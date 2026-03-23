<template>
  <div class="space-y-6">
    <DashboardPageHeader
      :title="machineName ? `${machineName} Rates` : 'Printing Rates'"
      subtitle="Edit machine-specific printing rates in the main workspace instead of a modal."
    >
      <template #actions>
        <UButton :to="backUrl" variant="soft">Back</UButton>
        <UButton color="primary" @click="openPanel()">
          <UIcon name="i-lucide-plus" class="mr-2 h-4 w-4" />
          Add Rate
        </UButton>
      </template>
    </DashboardPageHeader>

    <div class="grid gap-6 xl:grid-cols-[minmax(0,1.4fr)_24rem]">
      <div class="space-y-4">
        <CommonLoadingSpinner v-if="loading && !items.length" />

        <div v-else-if="items.length" class="overflow-hidden rounded-3xl border border-[var(--p-border)] bg-[var(--p-surface)] shadow-sm">
          <table class="min-w-full divide-y divide-[var(--p-border)]">
            <thead class="bg-[var(--p-surface-sunken)]">
              <tr>
                <th class="px-4 py-3 text-left text-xs font-medium uppercase text-[var(--p-text-muted)]">Sheet size</th>
                <th class="px-4 py-3 text-left text-xs font-medium uppercase text-[var(--p-text-muted)]">Color mode</th>
                <th class="px-4 py-3 text-right text-xs font-medium uppercase text-[var(--p-text-muted)]">Single</th>
                <th class="px-4 py-3 text-right text-xs font-medium uppercase text-[var(--p-text-muted)]">Double</th>
                <th class="px-4 py-3 text-center text-xs font-medium uppercase text-[var(--p-text-muted)]">Status</th>
                <th class="px-4 py-3 text-right text-xs font-medium uppercase text-[var(--p-text-muted)]">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-[var(--p-border)]">
              <tr v-for="r in items" :key="r.id">
                <td class="px-4 py-3 text-sm font-medium text-[var(--p-text)]">{{ r.sheet_size }}</td>
                <td class="px-4 py-3 text-sm text-[var(--p-text-muted)]">{{ r.color_mode === 'BW' ? 'Black & White' : 'Color' }}</td>
                <td class="px-4 py-3 text-right text-sm text-[var(--p-text)]">{{ r.single_price }}</td>
                <td class="px-4 py-3 text-right text-sm text-[var(--p-text)]">{{ r.double_price }}</td>
                <td class="px-4 py-3 text-center">
                  <UBadge :color="r.is_active ? 'success' : 'neutral'" variant="soft" size="xs">{{ r.is_active ? 'Active' : 'Inactive' }}</UBadge>
                </td>
                <td class="px-4 py-3">
                  <div class="flex justify-end gap-2">
                    <UButton variant="soft" size="xs" @click="edit(r)">Edit</UButton>
                    <UButton variant="soft" size="xs" color="error" @click="confirmDelete(r)">Delete</UButton>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <DashboardEmptyState
          v-else
          title="No printing rates yet"
          description="Add rates for each sheet size and color mode."
          icon="i-lucide-banknote"
        >
          <UButton color="primary" @click="openPanel()">Add rate</UButton>
        </DashboardEmptyState>
      </div>

      <DashboardAdminWorkspaceFormPanel
        v-if="panelOpen"
        :title="editing ? 'Edit Printing Rate' : 'Add Printing Rate'"
        :description="editing ? 'Update this printing rate.' : 'Create a new printing rate for this machine.'"
        @close="closePanel"
      >
        <form class="space-y-4" @submit.prevent="onSubmit">
          <UAlert
            v-if="formError"
            color="error"
            variant="soft"
            title="Could not save printing rate"
            :description="formError"
            icon="i-lucide-alert-circle"
          />
          <UFormField label="Sheet size">
            <USelectMenu v-model="form.sheet_size" :items="sheetSizeOptions" value-key="value" />
            <DashboardInlineError :message="formFieldErrors.sheet_size" />
          </UFormField>
          <UFormField label="Color mode">
            <USelectMenu v-model="form.color_mode" :items="colorModeOptions" value-key="value" />
            <DashboardInlineError :message="formFieldErrors.color_mode" />
          </UFormField>
          <UFormField label="Single (simplex) price">
            <UInput v-model="form.single_price" type="text" placeholder="0.00" required />
            <DashboardInlineError :message="formFieldErrors.single_price" />
          </UFormField>
          <UFormField label="Double (duplex) price">
            <UInput v-model="form.double_price" type="text" placeholder="0.00" required />
            <DashboardInlineError :message="formFieldErrors.double_price" />
          </UFormField>
          <div class="flex items-center gap-2">
            <UCheckbox v-model="form.is_active" />
            <span class="text-sm">Active</span>
          </div>
          <div class="flex justify-end gap-2 pt-2">
            <UButton variant="ghost" @click="closePanel">Cancel</UButton>
            <UButton color="primary" :loading="saving" type="submit">Save</UButton>
          </div>
        </form>
      </DashboardAdminWorkspaceFormPanel>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { PrintingRate } from '~/services/seller'
import { getMachineBySlug, listPrintingRates, createPrintingRate, updatePrintingRate, deletePrintingRate } from '~/services/seller'
import { extractApiFeedback } from '~/utils/api-feedback'

definePageMeta({
  layout: 'dashboard',
  middleware: 'auth',
})

const route = useRoute()
const machineId = computed(() => parseInt(route.params.id as string, 10))
const shopSlug = computed(() => route.query.shop as string)
const backUrl = computed(() => (shopSlug.value ? `/dashboard/shops/${shopSlug.value}/pricing` : '/dashboard'))

const toast = useToast()
const machineName = ref<string>('')
const items = ref<PrintingRate[]>([])
const loading = ref(true)
const saving = ref(false)
const panelOpen = ref(false)
const editing = ref<PrintingRate | null>(null)
const formError = ref<string | null>(null)
const formFieldErrors = ref<Record<string, string>>({})

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
    if (shopSlug.value) {
      const m = await getMachineBySlug(shopSlug.value, machineId.value)
      machineName.value = m?.name ?? ''
    }
    items.value = await listPrintingRates(machineId.value)
  } catch {
    items.value = []
  } finally {
    loading.value = false
  }
}

function openPanel(rate?: PrintingRate) {
  editing.value = rate ?? null
  formError.value = null
  formFieldErrors.value = {}
  if (rate) {
    form.sheet_size = rate.sheet_size
    form.color_mode = rate.color_mode
    form.single_price = rate.single_price
    form.double_price = rate.double_price
    form.is_active = rate.is_active
  } else {
    form.sheet_size = 'A4'
    form.color_mode = 'BW'
    form.single_price = '0'
    form.double_price = '0'
    form.is_active = true
  }
  panelOpen.value = true
}

function edit(rate: PrintingRate) {
  openPanel(rate)
}

function closePanel() {
  panelOpen.value = false
  editing.value = null
  formError.value = null
  formFieldErrors.value = {}
}

async function onSubmit() {
  saving.value = true
  formError.value = null
  formFieldErrors.value = {}
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
    closePanel()
    await load()
  } catch (e) {
    const feedback = extractApiFeedback(e, 'Failed to save printing rate')
    formError.value = feedback.message
    formFieldErrors.value = feedback.fieldErrors
    if (!Object.keys(feedback.fieldErrors).length) {
      toast.add({ title: 'Error', description: feedback.message, color: 'error' })
    }
  } finally {
    saving.value = false
  }
}

async function confirmDelete(rate: PrintingRate) {
  if (!confirm(`Delete ${rate.sheet_size} ${rate.color_mode} rate?`)) return
  try {
    await deletePrintingRate(machineId.value, rate.id)
    toast.add({ title: 'Deleted', color: 'success' })
    await load()
  } catch (e) {
    toast.add({ title: 'Error', description: e instanceof Error ? e.message : 'Failed', color: 'error' })
  }
}

onMounted(() => load())
</script>
