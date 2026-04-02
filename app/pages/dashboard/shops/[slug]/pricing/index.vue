<template>
  <div class="relative space-y-6">
    <div class="pointer-events-none absolute inset-x-0 top-0 -z-10 h-72 bg-[radial-gradient(circle_at_top_left,rgba(103,232,249,0.16),transparent_38%),radial-gradient(circle_at_top_right,rgba(96,165,250,0.14),transparent_30%)] blur-2xl" />
    <DashboardPageHeader
      title="Pricing"
      subtitle="Manage printing rates, material pricing, and discounts here. Paper stock and finishings now have their own pages."
    >
      <template #actions>
        <UButton variant="soft" class="softui-pill-input !bg-transparent px-4" :to="`/dashboard/shops/${slug}/papers`">Paper Stock</UButton>
        <UButton variant="soft" class="softui-pill-input !bg-transparent px-4" :to="`/dashboard/shops/${slug}/finishing`">Finishings</UButton>
        <UButton color="primary" class="softui-pill-input border-0 !bg-cyan-300/14 px-4 text-cyan-100" @click="openCreatePanel">
          <UIcon name="i-lucide-plus" class="mr-2 h-4 w-4" />
          {{ createLabel }}
        </UButton>
      </template>
    </DashboardPageHeader>

    <div
      v-if="!loading && !pricingStore.hasPricing"
      class="softui-card rounded-[1.9rem] p-5 text-amber-50"
    >
      <div class="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p class="text-sm font-semibold text-amber-100">Setup incomplete</p>
          <p class="mt-1 text-sm leading-6 text-amber-50/80">
            Pricing is still missing. You can load starter defaults, then refine them section by section.
          </p>
        </div>
        <UButton :loading="seedLoading" color="primary" class="softui-pill-input border-0 !bg-amber-300/18 px-4 text-amber-50" @click="loadStarterDefaults">
          Load starter defaults
        </UButton>
      </div>
    </div>

    <div class="grid gap-6 xl:grid-cols-[minmax(0,1.45fr)_24rem]">
      <div class="space-y-4">
        <div class="softui-segment flex flex-wrap gap-2 rounded-[1.75rem] p-2">
          <button
            v-for="tab in tabs"
            :key="tab.id"
            type="button"
            class="rounded-full px-4 py-3 text-sm font-semibold transition-all"
            :class="activeTab === tab.id
              ? 'bg-cyan-300/14 text-cyan-100 shadow-[0_14px_28px_rgba(6,182,212,0.18)] ring-1 ring-cyan-200/20'
              : 'text-[var(--p-text-muted)] hover:bg-white/4 hover:text-[var(--p-text-dim)]'"
            @click="activeTab = tab.id"
          >
            {{ tab.name }}
          </button>
        </div>

        <div class="grid gap-4 md:grid-cols-3">
          <article
            v-for="card in summaryCards"
            :key="card.label"
            class="softui-card rounded-[1.85rem] p-5"
          >
            <p class="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--p-text-muted)]">{{ card.label }}</p>
            <p class="mt-3 text-3xl font-semibold text-[var(--p-text)]">{{ card.value }}</p>
            <p class="mt-2 text-sm text-[var(--p-text-muted)]">{{ card.note }}</p>
          </article>
        </div>

        <DashboardSkeletonState v-if="loading" variant="table" :show-header="false" />

        <div v-else-if="activeTab === 'printing'" class="softui-panel overflow-hidden rounded-[2rem]">
          <table class="min-w-full divide-y divide-white/8">
            <thead class="bg-white/4">
              <tr>
                <th class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.14em] text-[var(--p-text-muted)]">Machine</th>
                <th class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.14em] text-[var(--p-text-muted)]">Size</th>
                <th class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.14em] text-[var(--p-text-muted)]">Color</th>
                <th class="px-4 py-3 text-right text-xs font-semibold uppercase tracking-[0.14em] text-[var(--p-text-muted)]">Sell / Side</th>
                <th class="px-4 py-3 text-right text-xs font-semibold uppercase tracking-[0.14em] text-[var(--p-text-muted)]">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-white/6">
              <tr v-for="price in pricingStore.printingPrices" :key="price.id">
                <td class="px-4 py-4 text-sm text-[var(--p-text)]">{{ machineName(price.machine) }}</td>
                <td class="px-4 py-4 text-sm text-[var(--p-text-muted)]">{{ price.sheet_size }}</td>
                <td class="px-4 py-4 text-sm text-[var(--p-text-muted)]">{{ price.color_mode }}</td>
                <td class="px-4 py-4 text-right text-sm text-[var(--p-text)]">{{ formatMoney(price.selling_price_per_side) }}</td>
                <td class="px-4 py-4">
                  <div class="flex justify-end gap-2">
                    <UButton variant="soft" size="sm" class="softui-pill-input !bg-transparent px-3" @click="editPrinting(price)">Edit</UButton>
                    <UButton variant="soft" size="sm" color="error" class="softui-pill-input !bg-transparent px-3" @click="deletePrinting(price.id)">Delete</UButton>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
          <DashboardEmptyState
            v-if="!pricingStore.printingPrices.length"
            title="No printing rates yet"
            description="Add machine-specific printing rates from this page."
            icon="i-lucide-banknote"
          >
            <UButton color="primary" class="softui-pill-input border-0 !bg-cyan-300/14 px-4 text-cyan-100" :disabled="!machineStore.machines.length" @click="openCreatePanel">Add pricing</UButton>
          </DashboardEmptyState>
        </div>

        <div v-else-if="activeTab === 'materials'" class="grid gap-4 md:grid-cols-2">
          <article
            v-for="material in pricingStore.materialPrices"
            :key="material.id"
            class="softui-card rounded-[1.85rem] p-5"
          >
            <p class="text-base font-semibold text-[var(--p-text)]">{{ material.material_name }}</p>
            <p class="mt-1 text-sm text-[var(--p-text-muted)]">{{ material.unit }}</p>
            <p class="mt-4 text-lg font-semibold text-[var(--p-text)]">{{ formatMoney(material.selling_price) }}</p>
            <div class="mt-4 flex gap-2">
              <UButton variant="soft" size="sm" class="softui-pill-input !bg-transparent px-3" @click="editMaterial(material)">Edit</UButton>
              <UButton variant="soft" size="sm" color="error" class="softui-pill-input !bg-transparent px-3" @click="deleteMaterial(material.id)">Delete</UButton>
            </div>
          </article>
          <DashboardEmptyState
            v-if="!pricingStore.materialPrices.length"
            title="No material prices yet"
            description="Add large-format or material pricing from this page."
            icon="i-lucide-layers"
          >
            <UButton color="primary" class="softui-pill-input border-0 !bg-cyan-300/14 px-4 text-cyan-100" @click="openCreatePanel">Add material price</UButton>
          </DashboardEmptyState>
        </div>

        <div v-else class="grid gap-4 md:grid-cols-2">
          <article
            v-for="discount in pricingStore.volumeDiscounts"
            :key="discount.id"
            class="softui-card rounded-[1.85rem] p-5"
          >
            <p class="text-base font-semibold text-[var(--p-text)]">{{ discount.name }}</p>
            <p class="mt-2 text-3xl font-semibold text-[var(--p-text)]">{{ discount.discount_percent }}%</p>
            <p class="mt-1 text-sm text-[var(--p-text-muted)]">Min quantity: {{ discount.min_quantity }}</p>
            <div class="mt-4 flex gap-2">
              <UButton variant="soft" size="sm" class="softui-pill-input !bg-transparent px-3" @click="editDiscount(discount)">Edit</UButton>
              <UButton variant="soft" size="sm" color="error" class="softui-pill-input !bg-transparent px-3" @click="deleteDiscount(discount.id)">Delete</UButton>
            </div>
          </article>
          <DashboardEmptyState
            v-if="!pricingStore.volumeDiscounts.length"
            title="No discounts yet"
            description="Add volume discounts when the offer is ready."
            icon="i-lucide-percent"
          >
            <UButton color="primary" class="softui-pill-input border-0 !bg-cyan-300/14 px-4 text-cyan-100" @click="openCreatePanel">Add discount</UButton>
          </DashboardEmptyState>
        </div>
      </div>

      <DashboardAdminWorkspaceFormPanel
        v-if="panelOpen"
        :title="panelTitle"
        :description="panelDescription"
        @close="closePanel"
      >
        <PricingPrintingPriceForm
          v-if="activeTab === 'printing'"
          :key="editingPrinting?.id ?? 'new-printing'"
          :price="editingPrinting"
          :machine-options="machineOptions"
          :loading="saving"
          :error-message="errorMessage"
          :field-errors="fieldErrors"
          @submit="submitPrinting"
          @cancel="closePanel"
        />
        <PricingMaterialPriceForm
          v-else-if="activeTab === 'materials'"
          :key="editingMaterial?.id ?? 'new-material'"
          :price="editingMaterial"
          :loading="saving"
          @submit="submitMaterial"
          @cancel="closePanel"
        />
        <PricingVolumeDiscountForm
          v-else
          :key="editingDiscount?.id ?? 'new-discount'"
          :discount="editingDiscount"
          :loading="saving"
          :error-message="errorMessage"
          :field-errors="fieldErrors"
          @submit="submitDiscount"
          @cancel="closePanel"
        />
      </DashboardAdminWorkspaceFormPanel>
    </div>
  </div>
</template>

<script setup lang="ts">
import type {
  MaterialPrice,
  MaterialPriceForm,
  PrintingPrice,
  PrintingPriceForm,
  VolumeDiscount,
  VolumeDiscountForm,
} from '~/shared/types'
import { usePricingStore } from '~/stores/pricing'
import { useMachineStore } from '~/stores/machine'
import { useSellerStore } from '~/stores/seller'
import { extractApiFeedback } from '~/utils/api-feedback'
import { safeLogError } from '~/utils/safeLog'

type TabId = 'printing' | 'materials' | 'discounts'

definePageMeta({
  layout: 'dashboard',
  middleware: ['auth', 'shop-owner', 'shop-setup-step'],
})

const route = useRoute()
const pricingStore = usePricingStore()
const machineStore = useMachineStore()
const sellerStore = useSellerStore()
const toast = useToast()

const slug = computed(() => route.params.slug as string)
const { formatMoney } = useCurrencyFormatter(computed(() => sellerStore.getShopBySlug(slug.value)?.currency ?? null))
const tabs = [
  { id: 'printing' as TabId, name: 'Printing Rates' },
  { id: 'materials' as TabId, name: 'Materials' },
  { id: 'discounts' as TabId, name: 'Discounts' },
]

const activeTab = ref<TabId>('printing')
const loading = ref(true)
const panelOpen = ref(false)
const saving = ref(false)
const seedLoading = ref(false)
const errorMessage = ref<string | null>(null)
const fieldErrors = ref<Record<string, string>>({})

const editingPrinting = ref<PrintingPrice | null>(null)
const editingMaterial = ref<MaterialPrice | null>(null)
const editingDiscount = ref<VolumeDiscount | null>(null)

const machineOptions = computed(() => machineStore.machineOptions)

const createLabel = computed(() => {
  if (activeTab.value === 'printing') return 'Add Pricing'
  if (activeTab.value === 'materials') return 'Add Material Price'
  return 'Add Discount'
})

const panelTitle = computed(() => {
  if (activeTab.value === 'printing') return editingPrinting.value ? 'Edit Printing Rate' : 'Add Printing Rate'
  if (activeTab.value === 'materials') return editingMaterial.value ? 'Edit Material Price' : 'Add Material Price'
  return editingDiscount.value ? 'Edit Volume Discount' : 'Add Volume Discount'
})

const panelDescription = computed(() => {
  if (activeTab.value === 'printing') return 'Printing rate forms now open in the page workspace instead of a modal.'
  if (activeTab.value === 'materials') return 'Manage material pricing inside the pricing workspace.'
  return 'Discount rules now live in the page workspace instead of a modal.'
})

const summaryCards = computed(() => [
  {
    label: 'Printing Rates',
    value: pricingStore.printingPrices.length,
    note: 'Machine-specific pricing rows.',
  },
  {
    label: 'Material Prices',
    value: pricingStore.materialPrices.length,
    note: 'Large-format and material charges.',
  },
  {
    label: 'Discount Rules',
    value: pricingStore.volumeDiscounts.length,
    note: 'Volume discounts available.',
  },
])

function machineName(machineId: number) {
  return machineStore.machines.find(machine => machine.id === machineId)?.name ?? `Machine #${machineId}`
}

function resetErrors() {
  errorMessage.value = null
  fieldErrors.value = {}
}

function closePanel() {
  panelOpen.value = false
  editingPrinting.value = null
  editingMaterial.value = null
  editingDiscount.value = null
  resetErrors()
}

function openCreatePanel() {
  editingPrinting.value = null
  editingMaterial.value = null
  editingDiscount.value = null
  resetErrors()
  panelOpen.value = true
}

function editPrinting(price: PrintingPrice) {
  activeTab.value = 'printing'
  editingPrinting.value = price
  editingMaterial.value = null
  editingDiscount.value = null
  resetErrors()
  panelOpen.value = true
}

function editMaterial(price: MaterialPrice) {
  activeTab.value = 'materials'
  editingMaterial.value = price
  editingPrinting.value = null
  editingDiscount.value = null
  resetErrors()
  panelOpen.value = true
}

function editDiscount(discount: VolumeDiscount) {
  activeTab.value = 'discounts'
  editingDiscount.value = discount
  editingPrinting.value = null
  editingMaterial.value = null
  resetErrors()
  panelOpen.value = true
}

async function submitPrinting(data: PrintingPriceForm) {
  saving.value = true
  resetErrors()
  try {
    if (editingPrinting.value) {
      await pricingStore.updatePrintingPrice(slug.value, editingPrinting.value.id, data)
      toast.add({ title: 'Saved', description: 'Printing rate updated.', color: 'success' })
    } else {
      await pricingStore.createPrintingPrice(slug.value, data)
      toast.add({ title: 'Saved', description: 'Printing rate added.', color: 'success' })
    }
    closePanel()
    await pricingStore.fetchPrintingPrices(slug.value)
  } catch (error) {
    const feedback = extractApiFeedback(error, 'We could not save this printing rate right now.')
    errorMessage.value = feedback.message
    fieldErrors.value = feedback.fieldErrors
  } finally {
    saving.value = false
  }
}

async function submitMaterial(data: MaterialPriceForm) {
  saving.value = true
  try {
    if (editingMaterial.value) {
      await pricingStore.updateMaterialPrice(slug.value, editingMaterial.value.id, data)
      toast.add({ title: 'Saved', description: 'Material price updated.', color: 'success' })
    } else {
      await pricingStore.createMaterialPrice(slug.value, data)
      toast.add({ title: 'Saved', description: 'Material price added.', color: 'success' })
    }
    closePanel()
    await pricingStore.fetchMaterialPrices(slug.value)
  } catch (error) {
    toast.add({ title: 'Error', description: error instanceof Error ? error.message : 'Failed to save material price.', color: 'error' })
  } finally {
    saving.value = false
  }
}

async function submitDiscount(data: VolumeDiscountForm) {
  saving.value = true
  resetErrors()
  try {
    if (editingDiscount.value) {
      await pricingStore.updateVolumeDiscount(slug.value, editingDiscount.value.id, data)
      toast.add({ title: 'Saved', description: 'Discount updated.', color: 'success' })
    } else {
      await pricingStore.createVolumeDiscount(slug.value, data)
      toast.add({ title: 'Saved', description: 'Discount added.', color: 'success' })
    }
    closePanel()
    await pricingStore.fetchVolumeDiscounts(slug.value)
  } catch (error) {
    const feedback = extractApiFeedback(error, 'We could not save this discount right now.')
    errorMessage.value = feedback.message
    fieldErrors.value = feedback.fieldErrors
  } finally {
    saving.value = false
  }
}

async function deletePrinting(id: number) {
  if (!confirm('Delete this printing rate?')) return
  try {
    await pricingStore.deletePrintingPrice(slug.value, id)
    toast.add({ title: 'Deleted', description: 'Printing rate removed.', color: 'success' })
  } catch (error) {
    toast.add({ title: 'Error', description: error instanceof Error ? error.message : 'Failed to delete printing rate.', color: 'error' })
  }
}

async function deleteMaterial(id: number) {
  if (!confirm('Delete this material price?')) return
  try {
    await pricingStore.deleteMaterialPrice(slug.value, id)
    toast.add({ title: 'Deleted', description: 'Material price removed.', color: 'success' })
  } catch (error) {
    toast.add({ title: 'Error', description: error instanceof Error ? error.message : 'Failed to delete material price.', color: 'error' })
  }
}

async function deleteDiscount(id: number) {
  if (!confirm('Delete this discount?')) return
  try {
    await pricingStore.deleteVolumeDiscount(slug.value, id)
    toast.add({ title: 'Deleted', description: 'Discount removed.', color: 'success' })
  } catch (error) {
    toast.add({ title: 'Error', description: error instanceof Error ? error.message : 'Failed to delete discount.', color: 'error' })
  }
}

async function loadStarterDefaults() {
  seedLoading.value = true
  try {
    await pricingStore.seedShopDefaults(slug.value)
    toast.add({ title: 'Loaded', description: 'Starter defaults have been added to this shop.', color: 'success' })
  } catch (error) {
    toast.add({ title: 'Error', description: error instanceof Error ? error.message : 'Failed to load starter defaults.', color: 'error' })
  } finally {
    seedLoading.value = false
  }
}

onMounted(async () => {
  pricingStore.error = null
  try {
    await Promise.all([
      sellerStore.fetchShops(),
      pricingStore.fetchPrintingPrices(slug.value),
      pricingStore.fetchMaterialPrices(slug.value),
      pricingStore.fetchVolumeDiscounts(slug.value),
      machineStore.fetchMachines(slug.value),
    ])
  } catch (error) {
    safeLogError(error, 'pricing.workspace.fetch')
  } finally {
    loading.value = false
  }
})
</script>
