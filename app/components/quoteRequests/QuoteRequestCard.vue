<template>
  <NuxtLink
    :to="`/quotes/${request.id}`"
    class="block rounded-xl border border-[var(--p-border)] bg-[var(--p-surface)] p-5 transition-colors hover:border-flamingo-300 dark:hover:border-flamingo-700 hover:bg-flamingo-50/30 dark:hover:bg-flamingo-900/10"
  >
    <div class="flex justify-between items-start gap-3">
      <div class="min-w-0 flex-1">
        <h3 class="font-semibold text-[var(--p-text)] truncate">{{ request.shop_name }}</h3>
        <p class="text-sm text-[var(--p-text-muted)] mt-0.5">
          Request #{{ request.id }} · {{ request.items_count ?? request.items?.length ?? 0 }} item(s)
        </p>
        <div class="mt-2 flex items-center gap-2">
          <UBadge :color="statusColor" variant="soft" size="xs">{{ statusLabel }}</UBadge>
          <span
            v-if="request.latest_sent_quote?.total"
            class="text-sm font-semibold text-[var(--p-text)]"
          >
            {{ formatMoney(request.latest_sent_quote.total, request.shop_currency) }}
          </span>
        </div>
      </div>
      <UIcon name="i-lucide-chevron-right" class="h-5 w-5 text-[var(--p-text-muted)] shrink-0" />
    </div>
  </NuxtLink>
</template>

<script setup lang="ts">
import type { QuoteRequest, QuoteRequestStatus } from '~/shared/types/quoteRequest'

const props = defineProps<{ request: QuoteRequest }>()
const { formatMoney } = useCurrencyFormatter(computed(() => props.request.shop_currency ?? null))

const statusLabels: Record<QuoteRequestStatus, string> = {
  draft: 'Draft',
  submitted: 'Submitted',
  awaiting_shop_action: 'Shop preparing quote',
  awaiting_client_reply: 'Awaiting your reply',
  viewed: 'Viewed',
  quoted: 'Quote received',
  accepted: 'Accepted by shop',
  rejected: 'Rejected',
  expired: 'Expired',
  closed: 'Closed',
  cancelled: 'Cancelled',
}

const statusColor = computed((): 'neutral' | 'primary' | 'warning' | 'success' | 'error' => {
  const s = props.request.status
  if (s === 'quoted' || s === 'awaiting_client_reply') return 'warning'
  if (s === 'accepted' || s === 'awaiting_shop_action') return 'primary'
  if (s === 'rejected' || s === 'expired' || s === 'cancelled' || s === 'closed') return 'error'
  return 'neutral'
})

const statusLabel = computed(
  () => statusLabels[props.request.status] ?? props.request.status
)
</script>
