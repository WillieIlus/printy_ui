<template>
  <div class="min-h-screen bg-amber-50/80 dark:bg-stone-950">
    <div class="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-10">
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <h1 class="text-2xl sm:text-3xl font-bold text-stone-800 dark:text-stone-100 font-[family-name:var(--font-heading)]">
          Your Quote
        </h1>
        <UButton to="/shops" variant="outline" color="neutral">
          <UIcon name="i-lucide-store" class="mr-2 h-4 w-4" />
          Browse shops
        </UButton>
      </div>

      <CommonLoadingSpinner v-if="quoteDraftStore.isLoading && !quoteDraftStore.activeDraft" />
      <template v-else-if="draft">
        <div class="rounded-2xl border border-amber-200/80 dark:border-amber-800/50 bg-white dark:bg-stone-900 shadow-sm overflow-hidden">
          <div class="px-6 py-4 border-b border-amber-200/60 dark:border-amber-800/40">
            <h2 class="font-semibold text-stone-800 dark:text-stone-100">{{ draft.shop_name }}</h2>
            <p class="text-sm text-stone-500 dark:text-stone-400">
              {{ canEdit ? 'Items in your quote' : 'Quote is locked' }}
            </p>
          </div>
          <ul class="divide-y divide-amber-200/60 dark:divide-amber-800/40">
            <li
              v-for="item in draft.items"
              :key="item.id"
              class="flex items-center justify-between gap-4 px-6 py-4"
            >
              <div class="min-w-0 flex-1">
                <p class="font-medium text-stone-800 dark:text-stone-100">
                  {{ item.item_type === 'CUSTOM' ? item.title : (item.product_name ?? 'Product') }}
                </p>
                <p class="text-sm text-stone-500 dark:text-stone-400">
                  {{ item.item_type === 'CUSTOM' ? (item.spec_text || `${item.chosen_width_mm}×${item.chosen_height_mm}mm`) : (item.pricing_mode ?? '') }}
                </p>
              </div>
              <div class="flex items-center gap-3 shrink-0">
                <div class="flex items-center gap-1 rounded-lg border border-amber-200/80 dark:border-amber-700/50">
                  <UButton
                    :disabled="!canEdit"
                    :loading="mutatingItemId === item.id && mutatingAction === 'qty'"
                    variant="ghost"
                    size="xs"
                    color="neutral"
                    icon="i-lucide-minus"
                    class="rounded-r-none"
                    @click="onQtyChange(item, -1)"
                  />
                  <span class="min-w-[2rem] text-center text-sm font-medium text-stone-700 dark:text-stone-300">
                    {{ item.quantity }}
                  </span>
                  <UButton
                    :disabled="!canEdit"
                    :loading="mutatingItemId === item.id && mutatingAction === 'qty'"
                    variant="ghost"
                    size="xs"
                    color="neutral"
                    icon="i-lucide-plus"
                    class="rounded-l-none"
                    @click="onQtyChange(item, 1)"
                  />
                </div>
                <UButton
                  :disabled="!canEdit"
                  :loading="mutatingItemId === item.id && mutatingAction === 'remove'"
                  variant="ghost"
                  size="xs"
                  color="error"
                  icon="i-lucide-trash-2"
                  @click="onRemove(item)"
                />
              </div>
            </li>
          </ul>
          <div class="px-6 py-4 border-t border-amber-200/60 dark:border-amber-800/40 bg-amber-50/50 dark:bg-stone-800/50">
            <div class="flex justify-between text-sm text-stone-600 dark:text-stone-400">
              <span>Subtotal</span>
              <span>{{ draft.totals?.subtotal ?? '—' }}</span>
            </div>
            <div class="mt-2 flex justify-between font-semibold text-stone-800 dark:text-stone-100">
              <span>Total</span>
              <span>{{ draft.totals?.total ?? '—' }}</span>
            </div>
          </div>
        </div>

        <div class="mt-8">
          <QuotesQuotePreviewPrice
            :draft-id="draft.id"
            :has-items="(draft.items?.length ?? 0) > 0"
          />
        </div>

        <div v-if="canEdit && (draft.items?.length ?? 0) > 0" class="mt-8">
          <UButton
            color="primary"
            size="lg"
            block
            :loading="submitting"
            @click="onRequestQuote"
          >
            <UIcon name="i-lucide-send" class="mr-2 h-4 w-4" />
            Request Quote
          </UButton>
        </div>
      </template>
      <div v-else class="rounded-2xl border border-amber-200/60 dark:border-amber-800/40 bg-white dark:bg-stone-900 p-12 text-center">
        <UIcon name="i-lucide-shopping-cart" class="mx-auto h-16 w-16 text-amber-200 dark:text-amber-800" />
        <h3 class="mt-4 text-lg font-medium text-stone-700 dark:text-stone-300">No items in your quote</h3>
        <p class="mt-2 text-sm text-stone-500 dark:text-stone-400">Browse shops, add products, or request a custom print to get a quote.</p>
        <UButton to="/shops" color="primary" class="mt-4">Browse shops</UButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { QuoteItem } from '~/shared/types'
import { useQuoteDraftStore } from '~/stores/quoteDraft'

definePageMeta({ layout: 'default' })

const quoteDraftStore = useQuoteDraftStore()

onMounted(async () => {
  if (quoteDraftStore.currentShopSlug && !quoteDraftStore.activeDraft) {
    await quoteDraftStore.loadActiveDraft()
  }
})
const toast = useToast()
const draft = computed(() => quoteDraftStore.activeDraft)
const canEdit = computed(() => draft.value?.status === 'DRAFT')

const mutatingItemId = ref<number | null>(null)
const mutatingAction = ref<'qty' | 'remove'>('qty')
const submitting = ref(false)

async function onRequestQuote() {
  if (!draft.value || !canEdit.value) return
  submitting.value = true
  try {
    const updated = await quoteDraftStore.submitDraft()
    if (updated) {
      toast.add({ title: 'Request sent to the shop', description: 'The shop will review and get back to you.' })
      await navigateTo(`/quotes/${updated.id}`)
    }
  } catch (err) {
    toast.add({ title: 'Error', description: err instanceof Error ? err.message : 'Failed to submit', color: 'error' })
  } finally {
    submitting.value = false
  }
}

async function onQtyChange(item: QuoteItem, delta: number) {
  if (!canEdit.value) return
  const newQty = item.quantity + delta
  mutatingItemId.value = item.id
  mutatingAction.value = 'qty'
  try {
    if (newQty < 1) {
      await quoteDraftStore.removeItemFromDraft(item.id)
    } else {
      await quoteDraftStore.updateItemQty(item.id, newQty)
    }
  } catch (err) {
    toast.add({ title: 'Error', description: err instanceof Error ? err.message : 'Failed to update', color: 'error' })
  } finally {
    mutatingItemId.value = null
  }
}

async function onRemove(item: QuoteItem) {
  if (!canEdit.value) return
  mutatingItemId.value = item.id
  mutatingAction.value = 'remove'
  try {
    await quoteDraftStore.removeItemFromDraft(item.id)
  } catch (err) {
    toast.add({ title: 'Error', description: err instanceof Error ? err.message : 'Failed to remove', color: 'error' })
  } finally {
    mutatingItemId.value = null
  }
}
</script>
