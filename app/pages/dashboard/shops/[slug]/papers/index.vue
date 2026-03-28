<template>
  <div class="space-y-6">
    <DashboardPageHeader
      title="Paper Stock"
      subtitle="Manage paper stock here. Add and edit paper lines from this page only."
    >
      <template #actions>
        <UButton color="primary" @click="openCreatePanel">
          <UIcon name="i-lucide-plus" class="mr-2 h-4 w-4" />
          Add Paper
        </UButton>
      </template>
    </DashboardPageHeader>

    <div class="grid gap-6 xl:grid-cols-[minmax(0,1.45fr)_24rem]">
      <div class="space-y-4">
        <div class="rounded-3xl border border-[var(--p-border)] bg-[var(--p-surface)] p-6 shadow-sm">
          <div class="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p class="text-sm font-semibold text-[var(--p-text)]">Stock list</p>
              <p class="mt-1 text-sm text-[var(--p-text-muted)]">Paper setup is separate from pricing so stock management has a clear home.</p>
            </div>
            <UBadge :color="items.length ? 'success' : 'warning'" variant="soft">{{ items.length }} paper lines</UBadge>
          </div>
        </div>

        <DashboardSkeletonState v-if="loading" variant="table" :show-header="false" />

        <div v-else-if="items.length" class="overflow-hidden rounded-3xl border border-[var(--p-border)] bg-[var(--p-surface)] shadow-sm">
          <table class="min-w-full divide-y divide-[var(--p-border)]">
            <thead class="bg-[var(--p-surface-sunken)]">
              <tr>
                <th class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.14em] text-[var(--p-text-muted)]">Size</th>
                <th class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.14em] text-[var(--p-text-muted)]">Type</th>
                <th class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.14em] text-[var(--p-text-muted)]">GSM</th>
                <th class="px-4 py-3 text-right text-xs font-semibold uppercase tracking-[0.14em] text-[var(--p-text-muted)]">Selling Price</th>
                <th class="px-4 py-3 text-right text-xs font-semibold uppercase tracking-[0.14em] text-[var(--p-text-muted)]">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-[var(--p-border)]">
              <tr v-for="item in items" :key="item.id" class="bg-[var(--p-surface)]">
                <td class="px-4 py-4 text-sm font-medium text-[var(--p-text)]">{{ item.sheet_size }}</td>
                <td class="px-4 py-4 text-sm text-[var(--p-text-muted)]">{{ item.paper_type }}</td>
                <td class="px-4 py-4 text-sm text-[var(--p-text-muted)]">{{ item.gsm }} gsm</td>
                <td class="px-4 py-4 text-right text-sm text-[var(--p-text)]">KES {{ item.selling_price }}</td>
                <td class="px-4 py-4">
                  <div class="flex justify-end gap-2">
                    <UButton variant="soft" size="sm" @click="editPaper(item)">Edit</UButton>
                    <UButton variant="soft" size="sm" color="error" @click="deletePaper(item.id)">Delete</UButton>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <DashboardEmptyState
          v-else
          title="No paper stock yet"
          description="Add the paper lines you actually keep or price against. This page now owns that workflow."
          icon="i-lucide-file-stack"
        >
          <UButton color="primary" @click="openCreatePanel">Add first paper</UButton>
        </DashboardEmptyState>
      </div>

      <div
        v-if="panelOpen"
        id="paper-form"
        tabindex="-1"
      >
        <DashboardAdminWorkspaceFormPanel
          :title="editingPaper ? 'Edit Paper' : 'Add Paper'"
          :description="editingPaper ? 'Update this paper stock line.' : 'Create a new paper stock line for this shop.'"
          @close="closePanel"
        >
          <PricingPaperPriceForm
            :key="editingPaper?.id ?? 'new-paper'"
            :price="editingPaper"
            :loading="saving"
            :error-message="errorMessage"
            :field-errors="fieldErrors"
            @submit="submitPaper"
            @cancel="closePanel"
          />
        </DashboardAdminWorkspaceFormPanel>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { PaperPrice, PaperPriceForm } from '~/shared/types'
import { usePricingStore } from '~/stores/pricing'
import { extractApiFeedback } from '~/utils/api-feedback'

definePageMeta({
  layout: 'dashboard',
  middleware: ['auth', 'shop-owner'],
})

const route = useRoute()
const pricingStore = usePricingStore()
const toast = useToast()
const { scrollToAnchor } = useAnchoredForm()

const slug = computed(() => route.params.slug as string)
const loading = ref(true)
const panelOpen = ref(false)
const saving = ref(false)
const editingPaper = ref<PaperPrice | null>(null)
const errorMessage = ref<string | null>(null)
const fieldErrors = ref<Record<string, string>>({})
const formHash = '#paper-form'

const items = computed(() => pricingStore.paperPrices)

function openCreatePanel(options?: { updateHash?: boolean }) {
  editingPaper.value = null
  errorMessage.value = null
  fieldErrors.value = {}
  panelOpen.value = true
  if (options?.updateHash !== false) {
    void syncHash(formHash)
  }
}

function editPaper(item: PaperPrice) {
  editingPaper.value = item
  errorMessage.value = null
  fieldErrors.value = {}
  panelOpen.value = true
  void syncHash(formHash)
}

function closePanel() {
  panelOpen.value = false
  editingPaper.value = null
  errorMessage.value = null
  fieldErrors.value = {}
  if (route.hash === formHash) {
    void syncHash('')
  }
}

async function submitPaper(data: PaperPriceForm) {
  saving.value = true
  errorMessage.value = null
  fieldErrors.value = {}
  try {
    if (editingPaper.value) {
      await pricingStore.updatePaperPrice(slug.value, editingPaper.value.id, data)
      toast.add({ title: 'Saved', description: 'Paper updated successfully.', color: 'success' })
    } else {
      await pricingStore.createPaperPrice(slug.value, data)
      toast.add({ title: 'Saved', description: 'Paper added successfully.', color: 'success' })
    }
    closePanel()
  } catch (error) {
    const feedback = extractApiFeedback(error, 'We could not save this paper right now.')
    errorMessage.value = feedback.message
    fieldErrors.value = feedback.fieldErrors
  } finally {
    saving.value = false
  }
}

async function deletePaper(id: number) {
  if (!confirm('Delete this paper stock line?')) return
  try {
    await pricingStore.deletePaperPrice(slug.value, id)
    toast.add({ title: 'Deleted', description: 'Paper removed.', color: 'success' })
  } catch (error) {
    toast.add({ title: 'Error', description: error instanceof Error ? error.message : 'Failed to delete paper.', color: 'error' })
  }
}

onMounted(async () => {
  try {
    await pricingStore.fetchPaperPrices(slug.value)
    if (route.hash === formHash) {
      openCreatePanel({ updateHash: false })
    }
  } finally {
    loading.value = false
  }
})

watch(panelOpen, (open) => {
  if (!open) return
  scrollToAnchor('paper-form', 'input:not([type="hidden"]), textarea, [role="combobox"], button')
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
