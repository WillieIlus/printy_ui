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
        <p class="text-sm text-[var(--p-text-muted)] mt-0.5">
          {{ formatCurrency(quote.total) }}
          <template v-if="quote.turnaround_days != null">
            · {{ quote.turnaround_days }} day{{ quote.turnaround_days !== 1 ? 's' : '' }}
          </template>
          <template v-if="quote.revision_number > 1">
            · Rev {{ quote.revision_number }}
          </template>
        </p>
      </div>
      <SentQuoteStatusBadge :status="quote.status" class="shrink-0" />
    </div>
    <p class="text-xs text-[var(--p-text-muted)] mt-2">
      {{ formatDate(quote.sent_at || quote.created_at) }}
    </p>
  </NuxtLink>
</template>

<script setup lang="ts">
import type { SentQuoteList } from '~/shared/types/sentQuote'
import { formatCurrency, formatDate } from '~/utils/formatters'

defineProps<{
  quote: SentQuoteList
  shopSlug: string
}>()
</script>
