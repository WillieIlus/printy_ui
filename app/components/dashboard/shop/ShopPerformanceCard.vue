<template>
  <DashboardSectionCard title="Readiness snapshot" description="Live shop-readiness signals instead of placeholder performance metrics." tone="dark">
    <div class="grid gap-3 md:grid-cols-3">
      <div v-for="item in items" :key="item.label" class="rounded-2xl border border-white/10 bg-white/5 px-4 py-4">
        <p class="text-xs uppercase tracking-[0.18em] text-slate-400">{{ item.label }}</p>
        <p class="mt-2 text-2xl font-semibold text-white">{{ item.value }}</p>
        <p class="mt-1 text-sm text-slate-300">{{ item.helper }}</p>
      </div>
    </div>
  </DashboardSectionCard>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import DashboardSectionCard from '~/components/dashboard/shared/DashboardSectionCard.vue'
import { useQuoteInboxStore } from '~/stores/quoteInbox'
import { useSetupStatusStore } from '~/stores/setupStatus'

const setupStatusStore = useSetupStatusStore()
const quoteInboxStore = useQuoteInboxStore()
const { status } = storeToRefs(setupStatusStore)
const { dashboard } = storeToRefs(quoteInboxStore)

const emptyInsightMessage = 'Performance insights will appear after you respond to quote requests.'

function formatResponseTime(hours?: number | null) {
  if (hours == null) return 'Waiting for data'
  if (hours < 1) return `${Math.round(hours * 60)} min`
  if (hours < 24) return `${hours.toFixed(hours < 10 ? 1 : 0)}h`
  const days = hours / 24
  return `${days.toFixed(days < 10 ? 1 : 0)}d`
}

const items = computed(() => {
  const readiness = status.value
  const summary = dashboard.value
  const hasResponseInsights = (summary?.responded_requests_count ?? 0) > 0

  return [
    {
      label: 'Average response time',
      value: hasResponseInsights ? formatResponseTime(summary?.average_response_hours) : 'Waiting for data',
      helper: hasResponseInsights
        ? 'Calculated from real request and response timestamps.'
        : emptyInsightMessage,
    },
    {
      label: 'Automatic pricing',
      value: readiness?.can_price_requests ? 'Ready' : 'Needs setup',
      helper: readiness?.can_price_requests
        ? 'Printy can price rate-card requests from your current setup.'
        : 'Complete more rate-card setup to price more jobs automatically.',
    },
    {
      label: 'Accepted quotes',
      value: String(summary?.accepted_quotes_count ?? 0),
      helper: (summary?.accepted_quotes_count ?? 0) > 0
        ? 'Accepted quotes based on real request outcomes.'
        : emptyInsightMessage,
    },
  ]
})
</script>
