<!-- Purpose: Shop dashboard recent request queue preview backed by live data. -->
<template>
  <DashboardSectionCard title="Recent quote requests" description="Newest requests created from the calculator flow." tone="dark">
    <div v-if="items.length" class="space-y-4">
      <div
        v-for="item in items"
        :key="item.id"
        class="flex flex-col gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-4 md:flex-row md:items-center md:justify-between"
      >
        <div class="space-y-1">
          <p class="text-sm font-semibold text-white">{{ item.client }}</p>
          <p class="text-sm text-slate-300">{{ item.job }}</p>
        </div>
        <div class="flex items-center gap-3 text-xs uppercase tracking-[0.18em] text-slate-400">
          <span>{{ item.deadline }}</span>
          <span>{{ item.status }}</span>
        </div>
      </div>
    </div>
    <div v-else class="rounded-2xl border border-dashed border-white/10 px-4 py-10 text-center text-sm text-slate-300">
      No quote requests yet.
    </div>
  </DashboardSectionCard>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import DashboardSectionCard from '~/components/dashboard/shared/DashboardSectionCard.vue'
import { useQuoteInboxStore } from '~/stores/quoteInbox'

const store = useQuoteInboxStore()
const { dashboard } = storeToRefs(store)

onMounted(async () => {
  if (!dashboard.value) {
    await store.fetchDashboard().catch(() => undefined)
  }
})

const items = computed(() => (dashboard.value?.recent_requests ?? []).map((request) => {
  const requestSnapshot = (request.request_snapshot ?? {}) as Record<string, unknown>
  const calculatorInputs = (requestSnapshot.calculator_inputs ?? {}) as Record<string, unknown>
  const productType = typeof calculatorInputs.product_type === 'string'
    ? calculatorInputs.product_type.replace(/_/g, ' ')
    : 'Custom print job'
  const quantity = typeof calculatorInputs.quantity === 'number'
    ? `${calculatorInputs.quantity.toLocaleString()} pcs`
    : ''
  const matchedSpecsValue = requestSnapshot.matched_specs
  const matchedSpecs = Array.isArray(matchedSpecsValue)
    ? matchedSpecsValue.slice(0, 2).map(String)
    : []

  return {
    id: request.id,
    client: request.customer_name || request.customer_email || request.request_reference || `Request #${request.id}`,
    job: [productType, quantity, ...matchedSpecs].filter(Boolean).join(', '),
    deadline: formatRelative(request.created_at),
    status: (request.status || 'new').replace(/_/g, ' '),
  }
}))

function formatRelative(iso?: string) {
  if (!iso) return 'New'
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return 'New'
  const diffHours = Math.floor((Date.now() - date.getTime()) / 3_600_000)
  if (diffHours < 1) return 'Just now'
  if (diffHours < 24) return `${diffHours}h ago`
  const diffDays = Math.floor(diffHours / 24)
  return diffDays < 7 ? `${diffDays}d ago` : date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
}
</script>
