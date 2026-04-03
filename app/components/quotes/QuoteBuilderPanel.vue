<template>
  <section class="rounded-3xl border border-[var(--p-border)] bg-[var(--p-surface)] p-6 shadow-sm">
    <div class="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
      <div>
        <p class="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--p-text-muted)]">My Quote</p>
        <h2 class="mt-2 text-2xl font-semibold text-[var(--p-text)]">Quote items grouped by shop</h2>
        <p class="mt-2 max-w-3xl text-sm text-[var(--p-text-muted)]">
          Keep items shop-scoped, update them in place, and submit one shop quote or one item at a time.
        </p>
      </div>
      <div class="flex flex-wrap gap-3">
        <div class="rounded-2xl border border-[var(--p-border)] bg-[var(--p-surface-sunken)] px-4 py-3">
          <p class="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--p-text-muted)]">Quote items</p>
          <p class="mt-1 text-xl font-extrabold text-[var(--p-text)]">{{ quoteInboxStore.quoteBuilderItemCount }}</p>
        </div>
        <UButton variant="soft" :loading="quoteInboxStore.loading" @click="refreshBuilder">Refresh</UButton>
      </div>
    </div>

    <div v-if="quoteInboxStore.draftFiles.length > 1" class="mt-5">
      <USelectMenu
        :model-value="activeFileId"
        :items="fileOptions"
        value-key="value"
        label-key="label"
        class="w-full max-w-xl"
        portal="body"
        @update:model-value="handleFileChange"
      />
    </div>

    <div v-if="quoteInboxStore.loading && !activeFile" class="mt-6 grid gap-4 md:grid-cols-2">
      <div v-for="index in 2" :key="index" class="h-48 animate-pulse rounded-2xl bg-[var(--p-surface-sunken)]" />
    </div>

    <div v-else-if="!activeFile" class="mt-6 rounded-2xl border border-dashed border-[var(--p-border)] bg-[var(--p-surface-sunken)] p-8 text-center text-[var(--p-text-muted)]">
      No quote items yet. Use any calculator or product tweak flow to add items to your quote.
    </div>

    <div v-else class="mt-6 space-y-6">
      <article
        v-for="group in activeFile.shop_groups"
        :key="`${group.shop_slug}-${group.draft_id}`"
        class="rounded-2xl border border-[var(--p-border)] bg-[var(--p-surface-sunken)] p-5"
      >
        <div class="flex flex-col gap-4 border-b border-[var(--p-border)] pb-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <div class="flex flex-wrap items-center gap-3">
              <h3 class="text-xl font-semibold text-[var(--p-text)]">{{ group.shop_name }}</h3>
              <UBadge variant="soft" :color="group.status === 'draft' ? 'warning' : 'neutral'">
                {{ group.status === 'draft' ? 'Open Quote' : group.status }}
              </UBadge>
            </div>
            <p class="mt-2 text-sm text-[var(--p-text-muted)]">
              {{ group.item_count }} item{{ group.item_count === 1 ? '' : 's' }} in this shop quote.
            </p>
          </div>
          <div class="grid gap-3 sm:grid-cols-2">
            <div class="rounded-2xl border border-[var(--p-border)] bg-[var(--p-surface)] px-4 py-3">
              <p class="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--p-text-muted)]">Quote total</p>
              <p class="mt-1 text-lg font-extrabold text-[var(--p-text)]">{{ formatCurrency(group.total || group.subtotal, group.shop_currency) }}</p>
            </div>
            <div class="rounded-2xl border border-[var(--p-border)] bg-[var(--p-surface)] px-4 py-3">
              <p class="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--p-text-muted)]">Latest turnaround</p>
              <p class="mt-1 text-sm font-medium text-[var(--p-text)]">
                {{ group.latest_sent_quote?.human_ready_text || 'Ready time on request' }}
              </p>
            </div>
          </div>
        </div>

        <div class="mt-5 space-y-4">
          <article
            v-for="item in group.items"
            :key="item.id"
            class="rounded-2xl border border-[var(--p-border)] bg-[var(--p-surface)] p-4"
          >
            <div class="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div class="min-w-0">
                <p class="text-base font-semibold text-[var(--p-text)]">{{ item.product_name || item.title || 'Quote item' }}</p>
                <p class="mt-1 text-sm text-[var(--p-text-muted)]">{{ item.spec_text || item.special_instructions || itemSummary(item) }}</p>
                <div class="mt-3 flex flex-wrap gap-2">
                  <UBadge variant="soft" color="neutral">Qty {{ item.quantity }}</UBadge>
                  <UBadge v-if="item.pricing_mode" variant="soft" color="neutral">{{ item.pricing_mode }}</UBadge>
                  <UBadge v-if="item.sides" variant="soft" color="neutral">{{ item.sides }}</UBadge>
                  <UBadge v-if="item.color_mode" variant="soft" color="neutral">{{ item.color_mode }}</UBadge>
                </div>
              </div>
              <div class="text-left lg:text-right">
                <p class="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--p-text-muted)]">Line total</p>
                <p class="mt-1 text-lg font-bold text-[var(--p-text)]">{{ formatCurrency(item.line_total || '0.00', group.shop_currency) }}</p>
              </div>
            </div>

            <div v-if="editingItemId === item.id" class="mt-4 grid gap-4 rounded-2xl border border-[var(--p-border)] bg-[var(--p-surface-sunken)] p-4 md:grid-cols-2">
              <label class="block">
                <span class="mb-2 block text-sm font-medium text-[var(--p-text)]">Quantity</span>
                <UInput v-model="editForm.quantity" type="number" min="1" />
              </label>
              <label v-if="item.sides" class="block">
                <span class="mb-2 block text-sm font-medium text-[var(--p-text)]">Sides</span>
                <USelectMenu v-model="editForm.sides" :items="sidesOptions" value-key="value" label-key="label" portal="body" />
              </label>
              <label v-if="item.color_mode" class="block">
                <span class="mb-2 block text-sm font-medium text-[var(--p-text)]">Colour mode</span>
                <USelectMenu v-model="editForm.color_mode" :items="colorOptions" value-key="value" label-key="label" portal="body" />
              </label>
              <label v-if="item.pricing_mode === 'LARGE_FORMAT'" class="block">
                <span class="mb-2 block text-sm font-medium text-[var(--p-text)]">Width (mm)</span>
                <UInput v-model="editForm.chosen_width_mm" type="number" min="1" />
              </label>
              <label v-if="item.pricing_mode === 'LARGE_FORMAT'" class="block">
                <span class="mb-2 block text-sm font-medium text-[var(--p-text)]">Height (mm)</span>
                <UInput v-model="editForm.chosen_height_mm" type="number" min="1" />
              </label>
              <label class="block md:col-span-2">
                <span class="mb-2 block text-sm font-medium text-[var(--p-text)]">Notes</span>
                <UTextarea v-model="editForm.special_instructions" :rows="3" />
              </label>
              <div class="flex flex-wrap gap-3 md:col-span-2">
                <UButton color="primary" :loading="updatingItemId === item.id" @click="saveItemEdit(group.draft_id, item.id)">Update item</UButton>
                <UButton variant="soft" @click="cancelEdit">Cancel</UButton>
              </div>
            </div>

            <div class="mt-4 flex flex-wrap gap-3">
              <UButton variant="soft" size="sm" @click="startEdit(item)">Edit item</UButton>
              <UButton variant="soft" size="sm" color="error" :loading="removingItemId === item.id" @click="removeQuoteItem(group.draft_id, item.id)">Remove</UButton>
              <UButton
                v-if="group.status === 'draft'"
                size="sm"
                color="primary"
                :loading="sendingItemId === item.id"
                @click="sendSingleItem(group.draft_id, item.id, group.shop_name)"
              >
                Send this item
              </UButton>
            </div>
          </article>
        </div>

        <div class="mt-5 flex flex-wrap gap-3">
          <UButton
            v-if="group.can_submit"
            color="primary"
            :loading="submittingDraftId === group.draft_id"
            @click="submitShopQuote(group)"
          >
            Submit Quote
          </UButton>
          <UButton variant="soft" :to="`/shops/${group.shop_slug}`">Open shop</UButton>
        </div>
      </article>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useToast } from '#imports'
import type { QuoteDraftShopGroup, QuoteItem } from '~/shared/types/buyer'
import { requestQuote, requestQuoteItem, removeItem, updateItem } from '~/services/quoteDraft'
import { useQuoteInboxStore } from '~/stores/quoteInbox'
import { formatCurrency } from '~/utils/formatters'

const api = useApi()
const quoteInboxStore = useQuoteInboxStore()
const toast = useToast()

const updatingItemId = ref<number | null>(null)
const removingItemId = ref<number | null>(null)
const submittingDraftId = ref<number | null>(null)
const sendingItemId = ref<number | null>(null)
const editingItemId = ref<number | null>(null)
const editForm = reactive({
  quantity: '1',
  sides: 'SIMPLEX',
  color_mode: 'COLOR',
  chosen_width_mm: '',
  chosen_height_mm: '',
  special_instructions: '',
})

const activeFile = computed(() => quoteInboxStore.activeDraftFile || quoteInboxStore.draftFiles[0] || null)
const activeFileId = computed(() => activeFile.value?.id)
const fileOptions = computed(() => quoteInboxStore.draftFiles.map((file) => ({
  value: file.id,
  label: `${file.customer_name || file.company_name} (${file.item_count} item${file.item_count === 1 ? '' : 's'})`,
})))

const sidesOptions = [
  { label: 'Simplex', value: 'SIMPLEX' },
  { label: 'Duplex', value: 'DUPLEX' },
]

const colorOptions = [
  { label: 'Colour', value: 'COLOR' },
  { label: 'Black & white', value: 'BW' },
]

onMounted(async () => {
  if (!quoteInboxStore.draftFiles.length) {
    await refreshBuilder()
  }
})

function handleFileChange(value: unknown) {
  const fileId = Number(value)
  const nextFile = quoteInboxStore.draftFiles.find((file) => file.id === fileId) || null
  quoteInboxStore.activeDraftFile = nextFile
}

function itemSummary(item: QuoteItem) {
  if (item.pricing_mode === 'LARGE_FORMAT' && item.chosen_width_mm && item.chosen_height_mm) {
    return `${item.chosen_width_mm} x ${item.chosen_height_mm} mm`
  }
  return 'Saved quote configuration'
}

function startEdit(item: QuoteItem) {
  editingItemId.value = item.id
  editForm.quantity = String(item.quantity || 1)
  editForm.sides = item.sides || 'SIMPLEX'
  editForm.color_mode = item.color_mode || 'COLOR'
  editForm.chosen_width_mm = item.chosen_width_mm ? String(item.chosen_width_mm) : ''
  editForm.chosen_height_mm = item.chosen_height_mm ? String(item.chosen_height_mm) : ''
  editForm.special_instructions = item.special_instructions || item.spec_text || ''
}

function cancelEdit() {
  editingItemId.value = null
}

async function refreshBuilder() {
  await Promise.all([
    quoteInboxStore.fetchDraftFiles('dashboard'),
    quoteInboxStore.fetchClientRequests(),
  ])
}

async function saveItemEdit(draftId: number, itemId: number) {
  updatingItemId.value = itemId
  try {
    await updateItem(draftId, itemId, {
      quantity: Number(editForm.quantity) || 1,
      sides: editForm.sides as 'SIMPLEX' | 'DUPLEX',
      color_mode: editForm.color_mode as 'BW' | 'COLOR',
      chosen_width_mm: editForm.chosen_width_mm ? Number(editForm.chosen_width_mm) : undefined,
      chosen_height_mm: editForm.chosen_height_mm ? Number(editForm.chosen_height_mm) : undefined,
      special_instructions: editForm.special_instructions,
    }, api)
    editingItemId.value = null
    await refreshBuilder()
    toast.add({ title: 'Quote item updated', description: 'Backend totals were refreshed for this shop quote.', color: 'success' })
  } catch (error) {
    toast.add({ title: 'Could not update item', description: error instanceof Error ? error.message : 'Update failed.', color: 'error' })
  } finally {
    updatingItemId.value = null
  }
}

async function removeQuoteItem(draftId: number, itemId: number) {
  removingItemId.value = itemId
  try {
    await removeItem(draftId, itemId, api)
    await refreshBuilder()
    toast.add({ title: 'Quote item removed', description: 'The shop quote total was updated.', color: 'success' })
  } catch (error) {
    toast.add({ title: 'Could not remove item', description: error instanceof Error ? error.message : 'Remove failed.', color: 'error' })
  } finally {
    removingItemId.value = null
  }
}

async function submitShopQuote(group: QuoteDraftShopGroup) {
  submittingDraftId.value = group.draft_id
  try {
    await requestQuote(group.draft_id, api)
    await refreshBuilder()
    toast.add({ title: 'Quote submitted', description: `${group.shop_name} received this quote request.`, color: 'success' })
  } catch (error) {
    toast.add({ title: 'Could not submit quote', description: error instanceof Error ? error.message : 'Submit failed.', color: 'error' })
  } finally {
    submittingDraftId.value = null
  }
}

async function sendSingleItem(draftId: number, itemId: number, shopName: string) {
  sendingItemId.value = itemId
  try {
    await requestQuoteItem(draftId, itemId, api)
    await refreshBuilder()
    toast.add({ title: 'Quote item sent', description: `One item was sent to ${shopName} and removed from your open quote.`, color: 'success' })
  } catch (error) {
    toast.add({ title: 'Could not send item', description: error instanceof Error ? error.message : 'Send failed.', color: 'error' })
  } finally {
    sendingItemId.value = null
  }
}
</script>
