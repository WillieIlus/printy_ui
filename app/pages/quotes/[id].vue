<template>
  <div class="min-h-screen bg-amber-50/80 dark:bg-stone-950">
    <div class="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-10">
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <h1 class="text-2xl sm:text-3xl font-bold text-stone-800 dark:text-stone-100 font-[family-name:var(--font-heading)]">
          Quote #{{ id }}
        </h1>
        <UButton to="/quotes" variant="outline" color="neutral">
          <UIcon name="i-lucide-arrow-left" class="mr-2 h-4 w-4" />
          My quotes
        </UButton>
      </div>

      <CommonLoadingSpinner v-if="loading" />
      <template v-else-if="quote">
        <UAlert
          v-if="quote.status === 'SUBMITTED'"
          color="primary"
          variant="soft"
          icon="i-lucide-clock"
          title="Waiting for pricing…"
          description="Your request has been sent to the shop. They will review and send you a priced quote."
          class="mb-6"
        />
        <UAlert
          v-else-if="quote.status === 'PRICED' || quote.status === 'SENT'"
          color="success"
          variant="soft"
          icon="i-lucide-check-circle"
          title="Quote ready"
          description="The shop has priced your quote. Check the details below."
          class="mb-6"
        />
        <UAlert
          v-else-if="quote.status === 'ACCEPTED'"
          color="success"
          variant="soft"
          icon="i-lucide-check-circle"
          title="Accepted"
          description="You've accepted this quote."
          class="mb-6"
        />
        <UAlert
          v-else-if="quote.status === 'REJECTED'"
          color="error"
          variant="soft"
          icon="i-lucide-x-circle"
          title="Rejected"
          description="This quote was rejected."
          class="mb-6"
        />

        <div class="rounded-2xl border border-amber-200/80 dark:border-amber-800/50 bg-white dark:bg-stone-900 shadow-sm overflow-hidden">
          <div class="px-6 py-4 border-b border-amber-200/60 dark:border-amber-800/40">
            <h2 class="font-semibold text-stone-800 dark:text-stone-100">{{ quote.shop_name }}</h2>
            <p class="text-sm text-stone-500 dark:text-stone-400">
              Status: {{ statusLabel }}
            </p>
          </div>
          <ul class="divide-y divide-amber-200/60 dark:divide-amber-800/40">
            <li
              v-for="item in quote.items"
              :key="item.id"
              class="flex items-center justify-between gap-4 px-6 py-4"
            >
              <div class="min-w-0 flex-1">
                <p class="font-medium text-stone-800 dark:text-stone-100">
                  {{ item.title ?? item.product_name ?? 'Product' }}
                </p>
                <p class="text-sm text-stone-500 dark:text-stone-400">
                  Qty: {{ item.quantity }} · {{ item.spec_text || item.pricing_mode || (item.chosen_width_mm && item.chosen_height_mm ? `${item.chosen_width_mm}×${item.chosen_height_mm}mm` : '') }}
                </p>
              </div>
              <div v-if="item.line_total" class="shrink-0 text-sm font-medium text-stone-700 dark:text-stone-300 tabular-nums">
                {{ item.line_total }}
              </div>
            </li>
          </ul>
          <div v-if="quote.totals?.total" class="px-6 py-4 border-t border-amber-200/60 dark:border-amber-800/40 bg-amber-50/50 dark:bg-stone-800/50">
            <div class="flex justify-between font-semibold text-stone-800 dark:text-stone-100">
              <span>Total</span>
              <span class="tabular-nums">{{ quote.totals.total }}</span>
            </div>
          </div>
        </div>
      </template>
      <div v-else class="rounded-2xl border border-amber-200/60 dark:border-amber-800/40 bg-white dark:bg-stone-900 p-12 text-center">
        <UIcon name="i-lucide-file-question" class="mx-auto h-16 w-16 text-amber-200 dark:text-amber-800" />
        <h3 class="mt-4 text-lg font-medium text-stone-700 dark:text-stone-300">Quote not found</h3>
        <p class="mt-2 text-sm text-stone-500 dark:text-stone-400">This quote may have been removed or you don't have access.</p>
        <UButton to="/quotes" class="mt-4">My quotes</UButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { QuoteDraft, QuoteItem } from '~/shared/types'
import { getQuoteRequest } from '~/services/quoteDraft'

definePageMeta({ layout: 'default' })

const route = useRoute()
const id = computed(() => route.params.id as string)

const quote = ref<QuoteDraft | null>(null)
const loading = ref(true)

const statusLabels: Record<string, string> = {
  DRAFT: 'Draft',
  SUBMITTED: 'Submitted',
  PRICED: 'Priced',
  SENT: 'Sent',
  ACCEPTED: 'Accepted',
  REJECTED: 'Rejected',
}
const statusLabel = computed(() => (quote.value ? statusLabels[quote.value.status] ?? quote.value.status : ''))

onMounted(async () => {
  const numId = parseInt(id.value, 10)
  if (isNaN(numId)) {
    loading.value = false
    return
  }
  try {
    quote.value = await getQuoteRequest(numId)
  } catch {
    quote.value = null
  } finally {
    loading.value = false
  }
})
</script>
