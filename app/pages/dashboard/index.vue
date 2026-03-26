<template>
  <div class="space-y-6">
    <DashboardPageHeader
      title="Shop desk"
      subtitle="Use backend setup status, backend pricing previews, and backend quote request states as the operating surface."
    />

    <div v-if="quoteInboxStore.dashboard" class="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      <article
        v-for="metric in metrics"
        :key="metric.label"
        class="rounded-3xl border border-[var(--p-border)] bg-[var(--p-surface)] p-5 shadow-sm"
      >
        <p class="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--p-text-muted)]">{{ metric.label }}</p>
        <p class="mt-3 text-3xl font-semibold text-[var(--p-text)]">{{ metric.value }}</p>
        <p class="mt-2 text-sm text-[var(--p-text-muted)]">{{ metric.note }}</p>
      </article>
    </div>

    <QuotesBackendQuoteCalculator
      v-if="shopStore.selectedShopSlug"
      :fixed-shop-slug="shopStore.selectedShopSlug"
      eyebrow="Dashboard Calculator"
      title="Semi-open quick calculator"
      description="Preview the backend price first, then use the inbox below to open, revise, accept, or reject requests."
      mode="shop"
      @draft-saved="refreshDashboard"
      @draft-sent="refreshDashboard"
    />

    <section class="rounded-3xl border border-[var(--p-border)] bg-[var(--p-surface)] p-6 shadow-sm">
      <div class="flex items-start justify-between gap-4">
        <div>
          <p class="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--p-text-muted)]">Quote Inbox</p>
          <h2 class="mt-2 text-2xl font-semibold text-[var(--p-text)]">Live request desk</h2>
        </div>
        <UButton variant="soft" @click="refreshDashboard">Refresh</UButton>
      </div>

      <div class="mt-5 flex flex-wrap gap-2">
        <UButton
          v-for="tab in tabs"
          :key="tab.value"
          :variant="activeTab === tab.value ? 'solid' : 'soft'"
          :color="activeTab === tab.value ? 'primary' : 'neutral'"
          @click="activeTab = tab.value"
        >
          {{ tab.label }}
        </UButton>
      </div>

      <div v-if="filteredRequests.length" class="mt-6 grid gap-4">
        <article
          v-for="request in filteredRequests"
          :key="request.id"
          class="rounded-2xl border border-[var(--p-border)] bg-[var(--p-surface-sunken)] p-5"
        >
          <div class="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <div class="flex flex-wrap items-center gap-3">
                <p class="text-base font-semibold text-[var(--p-text)]">{{ request.request_snapshot?.request_details?.customer_name || request.customer_name || 'Enquirer' }}</p>
                <UBadge variant="soft" :color="badgeColor(request.status)">{{ request.status }}</UBadge>
              </div>
              <p class="mt-2 text-sm text-[var(--p-text-muted)]">
                {{ request.request_snapshot?.pricing_snapshot?.totals?.grand_total || 'Awaiting response total' }}
              </p>
            </div>
            <div class="flex flex-wrap gap-2">
              <UButton variant="soft" :to="`/dashboard/shops/${shopStore.selectedShopSlug}/incoming-requests`">Open</UButton>
              <UButton variant="soft">Revise</UButton>
              <UButton variant="soft">Accept</UButton>
              <UButton variant="soft">Reject</UButton>
            </div>
          </div>
        </article>
      </div>

      <div v-else class="mt-6 rounded-2xl border border-dashed border-[var(--p-border)] bg-[var(--p-surface-sunken)] p-8 text-center text-[var(--p-text-muted)]">
        No requests in this tab yet.
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '~/stores/auth'
import { useShopStore } from '~/stores/shop'
import { useQuoteInboxStore } from '~/stores/quoteInbox'
import { useSetupStatusStore } from '~/stores/setupStatus'

definePageMeta({
  layout: 'dashboard',
  middleware: ['auth', 'setup-guard'],
})

const authStore = useAuthStore()
const shopStore = useShopStore()
const quoteInboxStore = useQuoteInboxStore()
const setupStore = useSetupStatusStore()
const activeTab = ref<'pending' | 'modified' | 'accepted' | 'rejected' | 'all'>('pending')

watchEffect(() => {
  if (authStore.isClient) {
    navigateTo('/quote-draft')
  }
})

onMounted(async () => {
  await shopStore.fetchMyShops()
  await shopStore.ensureActiveShop()
  await refreshDashboard()
})

async function refreshDashboard() {
  await Promise.all([
    quoteInboxStore.fetchDashboard(),
    setupStore.fetchStatus(shopStore.selectedShopSlug),
  ])
}

const metrics = computed(() => [
  {
    label: 'Requests',
    value: quoteInboxStore.dashboard?.received_quote_requests ?? 0,
    note: 'Backend count of received quote requests.',
  },
  {
    label: 'Pending',
    value: quoteInboxStore.dashboard?.status_counts?.pending ?? 0,
    note: 'Requests awaiting action.',
  },
  {
    label: 'Accepted',
    value: quoteInboxStore.dashboard?.status_counts?.accepted ?? 0,
    note: 'Responses marked accepted by the backend.',
  },
  {
    label: 'Next setup',
    value: setupStore.status?.next_step ?? 'complete',
    note: setupStore.status?.next_url ?? 'Setup complete.',
  },
])

const tabs: Array<{ label: string; value: 'pending' | 'modified' | 'accepted' | 'rejected' | 'all' }> = [
  { label: 'Pending', value: 'pending' },
  { label: 'Modified', value: 'modified' },
  { label: 'Accepted', value: 'accepted' },
  { label: 'Rejected', value: 'rejected' },
  { label: 'All', value: 'all' },
]

const filteredRequests = computed(() => {
  const requests = quoteInboxStore.dashboard?.recent_requests ?? []
  if (activeTab.value === 'all') return requests
  if (activeTab.value === 'pending') {
    return requests.filter((request: { status: string }) => ['submitted', 'viewed', 'pending'].includes(request.status))
  }
  return requests.filter((request: { status: string }) => request.status === activeTab.value)
})

function badgeColor(status: string) {
  if (status === 'accepted') return 'success'
  if (status === 'rejected') return 'error'
  if (status === 'modified') return 'warning'
  return 'neutral'
}
</script>
