<template>
  <NuxtLink
    :to="`/dashboard/shops/${shopSlug}/incoming-requests/${request.id}`"
    class="block rounded-xl border border-[var(--p-border)] bg-[var(--p-surface)] p-4 transition-colors hover:border-flamingo-300 dark:hover:border-flamingo-700 hover:bg-flamingo-50/30 dark:hover:bg-flamingo-900/10"
  >
    <div class="flex justify-between items-start gap-3">
      <div class="min-w-0 flex-1">
        <h3 class="font-semibold text-[var(--p-text)] truncate">
          {{ request.customer_name || 'No name' }}
        </h3>
        <p class="text-sm text-[var(--p-text-muted)] mt-0.5">
          {{ request.items_count }} item{{ request.items_count !== 1 ? 's' : '' }}
          <template v-if="request.delivery_preference">
            · {{ deliveryLabel }}
          </template>
        </p>
      </div>
      <IncomingRequestStatusBadge :status="request.status" class="shrink-0" />
    </div>
    <p class="text-xs text-[var(--p-text-muted)] mt-2">
      {{ formatDate(request.created_at) }}
    </p>
  </NuxtLink>
</template>

<script setup lang="ts">
import type { IncomingRequestList } from '~/shared/types/incomingRequest'
import { formatDate } from '~/utils/formatters'

const props = defineProps<{
  request: IncomingRequestList
  shopSlug: string
}>()

const deliveryLabel = computed(() => {
  const pref = props.request.delivery_preference
  if (pref === 'pickup') return 'Pickup'
  if (pref === 'delivery') return 'Delivery'
  return pref ?? ''
})
</script>
