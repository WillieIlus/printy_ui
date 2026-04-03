<template>
  <div class="relative space-y-6">
    <div class="pointer-events-none absolute inset-x-0 top-0 -z-10 h-72 bg-[radial-gradient(circle_at_top_left,rgba(243,115,68,0.16),transparent_38%),radial-gradient(circle_at_top_right,rgba(251,146,60,0.12),transparent_30%)] blur-2xl" />
    <DashboardPageHeader
      title="Pricing"
      subtitle="Manage per-side printing rates, duplex surcharge rules, material pricing, and discounts here. Paper stock and finishings now have their own pages."
    >
      <template #actions>
        <UButton variant="soft" class="softui-pill-input !bg-transparent px-4" :to="`/dashboard/shops/${slug}/papers`">Paper Stock</UButton>
        <UButton variant="soft" class="softui-pill-input !bg-transparent px-4" :to="`/dashboard/shops/${slug}/finishing`">Finishings</UButton>
        <UButton color="primary" class="softui-pill-input border-0 !bg-[var(--color-primary-600)] px-4 !text-white shadow-[0_12px_24px_rgba(225,53,21,0.18)] hover:!bg-[var(--color-primary-700)]" @click="openCreatePanel">
          <UIcon name="i-lucide-plus" class="mr-2 h-4 w-4" />
          {{ createLabel }}
        </UButton>
      </template>
    </DashboardPageHeader>

    <div
      v-if="!loading && !pricingStore.hasPricing"
      class="softui-card group relative overflow-hidden rounded-[1.9rem] border-[color:color-mix(in_srgb,var(--p-border)_58%,rgb(245_158_11)_42%)] bg-[linear-gradient(135deg,color-mix(in_srgb,var(--p-surface-raised)_84%,rgb(251_191_36)_16%),color-mix(in_srgb,var(--p-surface-container)_78%,rgb(249_115_22)_22%))] p-5 shadow-[var(--shadow-panel),0_0_0_1px_rgb(245_158_11_/_0.08)] transition-[border-color,box-shadow,transform] duration-200 hover:border-[color:color-mix(in_srgb,var(--p-border)_42%,rgb(245_158_11)_58%)] hover:shadow-[var(--shadow-modal),0_0_0_1px_rgb(245_158_11_/_0.14)] focus-within:border-[color:color-mix(in_srgb,var(--p-border)_38%,rgb(245_158_11)_62%)] focus-within:shadow-[var(--shadow-modal),0_0_0_1px_rgb(245_158_11_/_0.16)]"
    >
      <div class="pointer-events-none absolute inset-y-0 right-0 w-40 bg-[radial-gradient(circle_at_top_right,rgba(251,191,36,0.22),transparent_68%)] opacity-80" />
      <div class="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div class="flex items-start gap-3">
          <span class="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-[color:color-mix(in_srgb,var(--p-border)_44%,rgb(245_158_11)_56%)] bg-[color:color-mix(in_srgb,var(--p-surface)_58%,rgb(245_158_11)_42%)] text-[color:color-mix(in_srgb,var(--p-text)_68%,rgb(180_83_9)_32%)] shadow-sm">
            <UIcon name="i-lucide-triangle-alert" class="h-4.5 w-4.5" />
          </span>
          <div class="relative">
            <p class="text-base font-semibold tracking-[0.01em] text-[var(--p-text)]">Setup incomplete</p>
            <p class="mt-1 text-sm leading-6 text-[color:color-mix(in_srgb,var(--p-text)_82%,rgb(120_53_15)_18%)]">
            Pricing is still missing. You can load starter defaults, then refine them section by section.
            </p>
          </div>
        </div>
        <UButton
          :loading="seedLoading"
          color="primary"
          class="softui-pill-input border-0 !bg-[var(--color-primary-600)] px-4 !text-white shadow-[0_12px_24px_rgba(225,53,21,0.24)] transition-[transform,box-shadow,background-color] duration-200 hover:-translate-y-0.5 hover:!bg-[var(--color-primary-700)] hover:shadow-[0_16px_32px_rgba(225,53,21,0.28)] focus-visible:!outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary-400)]/55 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--p-surface)]"
          @click="loadStarterDefaults"
        >
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
              ? 'bg-flamingo-50 text-flamingo-700 shadow-[0_14px_28px_rgba(225,53,21,0.12)] ring-1 ring-flamingo-200/70 dark:bg-flamingo-500/14 dark:text-flamingo-100 dark:ring-flamingo-400/20'
              : 'text-[var(--p-text-muted)] hover:bg-flamingo-50/55 hover:text-[var(--p-text)] dark:hover:bg-flamingo-900/20'"
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
                <th class="px-4 py-3 text-right text-xs font-semibold uppercase tracking-[0.14em] text-[var(--p-text-muted)]">Per Side</th>
                <th class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.14em] text-[var(--p-text-muted)]">Duplex Rule</th>
                <th class="px-4 py-3 text-right text-xs font-semibold uppercase tracking-[0.14em] text-[var(--p-text-muted)]">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-white/6">
              <tr v-for="price in pricingStore.printingPrices" :key="price.id">
                <td class="px-4 py-4 text-sm text-[var(--p-text)]">{{ machineName(price.machine) }}</td>
                <td class="px-4 py-4 text-sm text-[var(--p-text-muted)]">{{ price.sheet_size }}</td>
                <td class="px-4 py-4 text-sm text-[var(--p-text-muted)]">{{ price.color_mode }}</td>
                <td class="px-4 py-4 text-right text-sm text-[var(--p-text)]">{{ formatMoney(price.selling_price_per_side) }}</td>
                <td class="px-4 py-4 text-sm text-[var(--p-text-muted)]">
                  <span v-if="price.selling_price_duplex_per_sheet">
                    Override {{ formatMoney(price.selling_price_duplex_per_sheet) }}
                  </span>
                  <span v-else-if="price.duplex_surcharge_enabled && price.duplex_surcharge && price.duplex_surcharge !== '0' && price.duplex_surcharge !== '0.00'">
                    +{{ formatMoney(price.duplex_surcharge) }}<span v-if="price.duplex_surcharge_min_gsm"> from {{ price.duplex_surcharge_min_gsm }}gsm</span>
                  </span>
                  <span v-else>2 sides, no surcharge</span>
                </td>
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
            <UButton color="primary" class="softui-pill-input border-0 !bg-[var(--color-primary-600)] px-4 !text-white shadow-[0_10px_20px_rgba(225,53,21,0.16)] hover:!bg-[var(--color-primary-700)] disabled:!bg-[var(--p-border)] disabled:!text-[var(--p-text-muted)]" :disabled="!machineStore.machines.length" @click="openCreatePanel">Add pricing</UButton>
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
            <UButton color="primary" class="softui-pill-input border-0 !bg-[var(--color-primary-600)] px-4 !text-white shadow-[0_10px_20px_rgba(225,53,21,0.16)] hover:!bg-[var(--color-primary-700)]" @click="openCreatePanel">Add material price</UButton>
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
            <UButton color="primary" class="softui-pill-input border-0 !bg-[var(--color-primary-600)] px-4 !text-white shadow-[0_10px_20px_rgba(225,53,21,0.16)] hover:!bg-[var(--color-primary-700)]" @click="openCreatePanel">Add discount</UButton>
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
