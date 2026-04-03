<template>
  <div class="space-y-6">
    <DashboardPageHeader
      title="Finishings"
      subtitle="Manage finishing services here. Keep post-press setup separate from pricing and product pages."
    >
      <template #actions>
        <UButton color="primary" @click="() => openCreatePanel()">
          <UIcon name="i-lucide-plus" class="mr-2 h-4 w-4" />
          Add Finishing
        </UButton>
      </template>
    </DashboardPageHeader>

    <div class="grid gap-6 xl:grid-cols-[minmax(0,1.45fr)_24rem]">
      <div class="space-y-4">
        <div class="rounded-3xl border border-[var(--p-border)] bg-[var(--p-surface)] p-6 shadow-sm">
          <div class="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p class="text-sm font-semibold text-[var(--p-text)]">Finishing services</p>
              <p class="mt-1 text-sm text-[var(--p-text-muted)]">Lamination, binding, cutting, and similar services now have a dedicated section.</p>
            </div>
            <UBadge :color="items.length ? 'success' : 'warning'" variant="soft">{{ items.length }} services</UBadge>
          </div>
        </div>

        <DashboardSkeletonState v-if="loading" variant="cards" :card-count="4" />

        <div v-else-if="items.length" class="grid gap-4 md:grid-cols-2">
          <article
            v-for="item in items"
            :key="item.id"
            class="rounded-3xl border border-[var(--p-border)] bg-[var(--p-surface)] p-5 shadow-sm"
          >
            <div class="flex items-start justify-between gap-3">
              <div>
                <p class="text-base font-semibold text-[var(--p-text)]">{{ item.name }}</p>
                <p class="mt-1 text-sm text-[var(--p-text-muted)]">{{ item.category }}</p>
              </div>
              <UBadge variant="soft" :color="item.is_active ? 'success' : 'neutral'">
                {{ item.is_active ? 'Active' : 'Inactive' }}
              </UBadge>
            </div>
            <div class="mt-4 rounded-2xl border border-[var(--p-border)] bg-[var(--p-surface-sunken)] p-4">
              <p class="text-sm text-[var(--p-text-muted)]">Pricing rule</p>
              <p class="mt-1 text-sm font-medium text-[var(--p-text)]">{{ finishingRuleLabel(item) }}</p>
              <p class="mt-3 text-sm text-[var(--p-text-muted)]">Price</p>
              <p class="mt-1 text-lg font-semibold text-[var(--p-text)]">{{ formatMoney(item.price) }}</p>
              <p v-if="item.double_side_price && isLamination(item)" class="mt-2 text-sm text-[var(--p-text-muted)]">
                Both-side rate: {{ formatMoney(item.double_side_price) }}
              </p>
            </div>
            <div class="mt-4 flex gap-2">
              <UButton variant="soft" size="sm" @click="editFinishing(item)">Edit</UButton>
              <UButton variant="soft" size="sm" color="error" @click="deleteFinishing(item.id)">Delete</UButton>
            </div>
          </article>
        </div>

        <DashboardEmptyState
          v-else
          title="No finishing services yet"
          description="Add the post-press services your team actually offers."
          icon="i-lucide-scissors"
        >
          <UButton color="primary" @click="() => openCreatePanel()">Add first finishing</UButton>
        </DashboardEmptyState>
      </div>

      <div
        v-if="panelOpen"
        id="finishing-form"
        tabindex="-1"
      >
        <DashboardAdminWorkspaceFormPanel
          :title="editingFinishing ? 'Edit Finishing' : 'Add Finishing'"
          :description="editingFinishing ? 'Update this finishing service.' : 'Create a finishing service for this shop.'"
          @close="closePanel"
        >
          <PricingFinishingServiceForm
            :key="editingFinishing?.id ?? 'new-finishing'"
            :service="editingFinishing"
            :loading="saving"
            :error-message="errorMessage"
            :field-errors="fieldErrors"
            @submit="submitFinishing"
            @cancel="closePanel"
          />
        </DashboardAdminWorkspaceFormPanel>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { FinishingService, FinishingServiceForm } from '~/shared/types'
import { usePricingStore } from '~/stores/pricing'
import { useSellerStore } from '~/stores/seller'
import { extractApiFeedback } from '~/utils/api-feedback'

definePageMeta({
  layout: 'dashboard',
  middleware: ['auth', 'shop-owner', 'shop-setup-step'],
})

const route = useRoute()
const pricingStore = usePricingStore()
const sellerStore = useSellerStore()
const toast = useToast()
const { scrollToAnchor } = useAnchoredForm()

const slug = computed(() => route.params.slug as string)
const { formatMoney } = useCurrencyFormatter(computed(() => sellerStore.getShopBySlug(slug.value)?.currency ?? null))
const loading = ref(true)
const panelOpen = ref(false)
const saving = ref(false)
const editingFinishing = ref<FinishingService | null>(null)
const errorMessage = ref<string | null>(null)
const fieldErrors = ref<Record<string, string>>({})
const formHash = '#finishing-form'

const items = computed(() => pricingStore.finishingServices)

function isLamination(item: FinishingService) {
  return item.category === 'LAMINATION' || (
    item.billing_basis === 'per_sheet'
    && item.side_mode === 'per_selected_side'
  )
}

function finishingRuleLabel(item: FinishingService) {
  if (isLamination(item)) {
    return item.double_side_price ? 'Per sheet · one side or both-side rate' : 'Per sheet · one side or both sides'
  }

  switch (item.billing_basis) {
    case 'per_sheet':
      return 'Per sheet'
    case 'per_piece':
      return 'Per piece'
    case 'flat_per_job':
      return 'Flat per job'
    case 'flat_per_group':
      return 'Flat per group'
    case 'flat_per_line':
      return 'Flat per line'
    default:
      return item.display_unit_label || item.charge_unit
  }
}

function openCreatePanel(options?: { updateHash?: boolean }) {
  editingFinishing.value = null
  errorMessage.value = null
  fieldErrors.value = {}
  panelOpen.value = true
  if (options?.updateHash !== false) {
    void syncHash(formHash)
  }
}

function editFinishing(item: FinishingService) {
  editingFinishing.value = item
  errorMessage.value = null
  fieldErrors.value = {}
  panelOpen.value = true
  void syncHash(formHash)
}

function closePanel() {
  panelOpen.value = false
  editingFinishing.value = null
  errorMessage.value = null
  fieldErrors.value = {}
  if (route.hash === formHash) {
    void syncHash('')
  }
}

async function submitFinishing(data: FinishingServiceForm) {
  saving.value = true
  errorMessage.value = null
  fieldErrors.value = {}
  try {
    if (editingFinishing.value) {
      await pricingStore.updateFinishingService(slug.value, editingFinishing.value.id, data)
      toast.add({ title: 'Saved', description: 'Finishing updated successfully.', color: 'success' })
    } else {
      await pricingStore.createFinishingService(slug.value, data)
      toast.add({ title: 'Saved', description: 'Finishing added successfully.', color: 'success' })
    }
    closePanel()
  } catch (error) {
    const feedback = extractApiFeedback(error, 'We could not save this finishing service right now.')
    errorMessage.value = feedback.message
    fieldErrors.value = feedback.fieldErrors
  } finally {
    saving.value = false
  }
}

async function deleteFinishing(id: number) {
  if (!confirm('Delete this finishing service?')) return
  try {
    await pricingStore.deleteFinishingService(slug.value, id)
    toast.add({ title: 'Deleted', description: 'Finishing removed.', color: 'success' })
  } catch (error) {
    toast.add({ title: 'Error', description: error instanceof Error ? error.message : 'Failed to delete finishing.', color: 'error' })
  }
}

onMounted(async () => {
  try {
    await Promise.all([
      sellerStore.fetchShops(),
      pricingStore.fetchFinishingServices(slug.value),
    ])
    if (route.hash === formHash) {
      openCreatePanel({ updateHash: false })
    }
  } finally {
    loading.value = false
  }
})

watch(panelOpen, (open) => {
  if (!open) return
  scrollToAnchor('finishing-form', 'input:not([type="hidden"]), textarea, [role="combobox"], button')
})

watch(() => route.hash, (hash) => {
  if (hash === formHash && !panelOpen.value) {
    openCreatePanel({ updateHash: false })
    return
  }

  if (!hash && panelOpen.value) {
    closePanel()
  }
})

function syncHash(hash: string) {
  return navigateTo({
    path: route.path,
    query: route.query,
    hash: hash || undefined,
  }, { replace: true })
}
</script>
