<template>
  <NuxtLink
    :to="`/dashboard/shops/${shopSlug}/sent-quotes/${quote.id}`"
    class="block rounded-xl border border-[var(--p-border)] bg-[var(--p-surface)] p-4 transition-colors hover:border-emerald-300 dark:hover:border-emerald-700 hover:bg-emerald-50/30 dark:hover:bg-emerald-900/10"
  >
    <div class="flex justify-between items-start gap-3">
      <div class="min-w-0 flex-1">
        <h3 class="font-semibold text-[var(--p-text)] truncate">
          {{ quote.customer_name || `Request #${quote.quote_request_id}` }}
        </h3>
        <p class="mt-0.5 text-sm text-[var(--p-text-muted)]">
          {{ formatMoney(quote.total) }}
          <template v-if="quote.turnaround_hours != null">
            | {{ quote.turnaround_hours }} working hour{{ quote.turnaround_hours !== 1 ? 's' : '' }}
          </template>
          <template v-if="quote.revision_number > 1">
            | Rev {{ quote.revision_number }}
          </template>
        </p>
      </div>
      <SentQuoteStatusBadge :status="quote.status" class="shrink-0" />
    </div>
    <p class="mt-2 text-xs text-[var(--p-text-muted)]">
      {{ formatDate(quote.sent_at || quote.created_at) }}
    </p>
  </NuxtLink>
</template>

<script setup lang="ts">
import type { SentQuoteList } from '~/shared/types/sentQuote'
import { useSellerStore } from '~/stores/seller'
import { formatDate } from '~/utils/formatters'

const props = defineProps<{
  quote: SentQuoteList
  shopSlug: string
}>()

const sellerStore = useSellerStore()
const shopCurrency = computed(() => sellerStore.getShopBySlug(props.shopSlug)?.currency ?? props.quote.shop_currency ?? null)
const { formatMoney } = useCurrencyFormatter(shopCurrency)
</script>
