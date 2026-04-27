<!-- Purpose: Quote requests table organism – used in both client and shop dashboards. -->
<template>
  <div class="overflow-hidden rounded-[var(--radius-lg)] border border-[var(--p-border)] bg-[var(--p-surface)]">
    <div class="flex items-center justify-between border-b border-[var(--p-border)] px-5 py-4">
      <h3 class="text-sm font-semibold text-[var(--p-text)]">{{ title }}</h3>
      <slot name="actions" />
    </div>

    <div v-if="loading" class="flex items-center justify-center py-12">
      <BaseSpinner size="md" color="muted" />
    </div>

    <div v-else-if="!requests.length" class="py-12 text-center">
      <Icon name="lucide:inbox" class="mx-auto mb-2 size-8 text-[var(--p-text-muted)]" />
      <p class="text-sm text-[var(--p-text-muted)]">No requests yet.</p>
    </div>

    <div v-else class="overflow-x-auto">
      <table class="w-full text-sm">
        <thead class="border-b border-[var(--p-border)] bg-[var(--p-surface-container-low)]">
          <tr>
            <th class="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[var(--p-text-muted)]">Ref</th>
            <th class="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[var(--p-text-muted)]">Job type</th>
            <th class="hidden px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[var(--p-text-muted)] md:table-cell">Date</th>
            <th class="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[var(--p-text-muted)]">Status</th>
            <th class="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wider text-[var(--p-text-muted)]">Total</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-[var(--p-border)]">
          <tr
            v-for="req in requests"
            :key="req.id"
            class="transition-colors hover:bg-[var(--p-surface-container-low)]"
          >
            <td class="px-5 py-3.5 font-mono text-xs text-[var(--p-text-muted)]">{{ req.reference }}</td>
            <td class="px-5 py-3.5 font-medium text-[var(--p-text)]">{{ req.jobType }}</td>
            <td class="hidden px-5 py-3.5 text-[var(--p-text-muted)] md:table-cell">{{ req.createdAt }}</td>
            <td class="px-5 py-3.5">
              <StatusBadge :status="req.status" />
            </td>
            <td class="px-5 py-3.5 text-right">
              <PriceDisplay v-if="req.total" :amount="req.total" size="sm" />
              <span v-else class="text-xs text-[var(--p-text-muted)]">—</span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import BaseSpinner from '~/components/atoms/BaseSpinner.vue'
import PriceDisplay from '~/components/molecules/PriceDisplay.vue'
import StatusBadge from '~/components/molecules/StatusBadge.vue'

type QuoteStatus = 'pending' | 'processing' | 'completed' | 'cancelled' | 'draft' | 'rejected'

export interface QuoteRequest {
  id: string
  reference: string
  jobType: string
  status: QuoteStatus
  createdAt: string
  total?: number
}

withDefaults(defineProps<{
  requests?: QuoteRequest[]
  title?: string
  loading?: boolean
}>(), {
  requests: () => [],
  title: 'Quote requests',
})
</script>
