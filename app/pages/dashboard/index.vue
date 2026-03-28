<template>
  <div class="space-y-6">
    <DashboardPageHeader
      title="Quote Workspace"
      subtitle="Use backend pricing preview at the top, then work the received request queue below."
    />

    <section class="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      <article
        v-for="metric in metrics"
        :key="metric.label"
        class="rounded-3xl border border-[var(--p-border)] bg-[var(--p-surface)] p-5 shadow-sm"
      >
        <p class="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--p-text-muted)]">{{ metric.label }}</p>
        <p class="mt-3 text-3xl font-semibold text-[var(--p-text)]">{{ metric.value }}</p>
        <p class="mt-2 text-sm text-[var(--p-text-muted)]">{{ metric.note }}</p>
      </article>
    </section>

    <QuotesBackendQuoteCalculator
      v-if="shopStore.selectedShopSlug"
      :fixed-shop-slug="shopStore.selectedShopSlug"
      eyebrow="Shop-owner Desk"
      title="Semi-open quote calculator"
      description="Capture the enquirer, product or custom brief, quantity, size, stock, finishing, and turnaround in one place. Backend preview remains the pricing source of truth."
      mode="shop"
      anchor-id="dashboard-quote-workspace"
    />

    <section class="rounded-3xl border border-[var(--p-border)] bg-[var(--p-surface)] p-6 shadow-sm">
      <div class="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p class="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--p-text-muted)]">Received Quotes</p>
          <h2 class="mt-2 text-2xl font-semibold text-[var(--p-text)]">Main request queue</h2>
          <p class="mt-2 text-sm text-[var(--p-text-muted)]">
            Tabs and counts come from the backend dashboard summary endpoint for the active shop.
          </p>
        </div>
        <div class="flex flex-wrap gap-2">
          <UButton v-if="shopStore.selectedShopSlug" variant="soft" :to="`/dashboard/shops/${shopStore.selectedShopSlug}/incoming-requests`">
            Open full inbox
          </UButton>
          <UButton variant="soft" :loading="quoteInboxStore.loading" @click="refreshDashboard">Refresh</UButton>
        </div>
      </div>

      <div class="mt-5 flex flex-wrap gap-2">
        <UButton
          v-for="tab in tabs"
          :key="tab.value"
          :variant="activeTab === tab.value ? 'solid' : 'soft'"
          :color="activeTab === tab.value ? 'primary' : 'neutral'"
          @click="activeTab = tab.value"
        >
          {{ tab.label }} <span class="ml-1 opacity-75">{{ tab.count }}</span>
        </UButton>
      </div>

      <div v-if="quoteInboxStore.loading && !quoteInboxStore.dashboard" class="mt-6">
        <DashboardSkeletonState variant="cards" :card-count="3" :show-header="false" />
      </div>

      <div v-else-if="filteredRequests.length" class="mt-6 grid gap-4">
        <article
          v-for="request in filteredRequests"
          :key="request.id"
          class="rounded-2xl border border-[var(--p-border)] bg-[var(--p-surface-sunken)] p-5"
        >
          <div class="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div class="min-w-0">
              <div class="flex flex-wrap items-center gap-3">
                <p class="text-base font-semibold text-[var(--p-text)]">{{ request.customer_name || 'Enquirer' }}</p>
                <UBadge variant="soft" :color="responseBadgeColor(request.latest_response?.status)">
                  {{ request.latest_response?.status || 'pending' }}
                </UBadge>
                <span v-if="request.request_reference" class="text-xs uppercase tracking-[0.12em] text-[var(--p-text-muted)]">
                  {{ request.request_reference }}
                </span>
              </div>

              <div class="mt-3 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                <div class="rounded-2xl border border-[var(--p-border)] bg-[var(--p-surface)] p-3">
                  <p class="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--p-text-muted)]">Contact</p>
                  <p class="mt-2 text-sm text-[var(--p-text)]">{{ request.customer_phone || request.customer_email || 'No contact provided' }}</p>
                </div>
                <div class="rounded-2xl border border-[var(--p-border)] bg-[var(--p-surface)] p-3">
                  <p class="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--p-text-muted)]">Latest total</p>
                  <p class="mt-2 text-sm font-semibold text-[var(--p-text)]">{{ request.latest_response?.total || 'Awaiting quote' }}</p>
                </div>
                <div class="rounded-2xl border border-[var(--p-border)] bg-[var(--p-surface)] p-3">
                  <p class="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--p-text-muted)]">Updated</p>
                  <p class="mt-2 text-sm text-[var(--p-text)]">{{ formatDashboardDate(request.updated_at || request.created_at) }}</p>
                </div>
                <div class="rounded-2xl border border-[var(--p-border)] bg-[var(--p-surface)] p-3">
                  <p class="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--p-text-muted)]">Source draft</p>
                  <p class="mt-2 text-sm text-[var(--p-text)]">{{ request.source_draft_reference || 'Direct request' }}</p>
                </div>
              </div>
            </div>

            <div class="flex shrink-0 flex-wrap gap-2">
              <UButton
                v-if="shopStore.selectedShopSlug"
                variant="soft"
                :to="`/dashboard/shops/${shopStore.selectedShopSlug}/incoming-requests/${request.id}`"
              >
                Open request
              </UButton>
            </div>
          </div>
        </article>
      </div>

      <div v-else class="mt-6 rounded-2xl border border-dashed border-[var(--p-border)] bg-[var(--p-surface-sunken)] p-8 text-center">
        <p class="text-sm font-medium text-[var(--p-text)]">No requests in this tab yet</p>
        <p class="mt-2 text-sm text-[var(--p-text-muted)]">Try another status filter or open the full inbox.</p>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { getPostLoginRedirectPath } from '~/composables/useAuth'
import { useAuthStore } from '~/stores/auth'
import { useQuoteInboxStore } from '~/stores/quoteInbox'
import { useSetupStatusStore } from '~/stores/setupStatus'
import { useShopStore } from '~/stores/shop'

definePageMeta({
  layout: 'dashboard',
  middleware: ['auth', 'setup-guard'],
})

const authStore = useAuthStore()
const quoteInboxStore = useQuoteInboxStore()
const setupStore = useSetupStatusStore()
const shopStore = useShopStore()

const activeTab = ref<'pending' | 'modified' | 'accepted' | 'rejected' | 'all'>('pending')

watchEffect(() => {
  if (authStore.isClient) {
    navigateTo(getPostLoginRedirectPath(authStore.user, false))
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
    label: 'Received requests',
    value: quoteInboxStore.dashboard?.received_quote_requests ?? 0,
    note: 'Backend request count for the active shop.',
  },
  {
    label: 'Pending',
    value: quoteInboxStore.dashboard?.status_counts?.pending ?? 0,
    note: 'Waiting for the next shop action.',
  },
  {
    label: 'Modified',
    value: quoteInboxStore.dashboard?.status_counts?.modified ?? 0,
    note: 'Replied with a revised quote.',
  },
  {
    label: 'Next setup',
    value: setupStore.status?.next_step ?? 'complete',
    note: setupStore.status?.next_url ?? 'Setup complete.',
  },
])

const tabs = computed(() => [
  { label: 'Pending', value: 'pending' as const, count: quoteInboxStore.dashboard?.status_counts?.pending ?? 0 },
  { label: 'Modified', value: 'modified' as const, count: quoteInboxStore.dashboard?.status_counts?.modified ?? 0 },
  { label: 'Accepted', value: 'accepted' as const, count: quoteInboxStore.dashboard?.status_counts?.accepted ?? 0 },
  { label: 'Rejected', value: 'rejected' as const, count: quoteInboxStore.dashboard?.status_counts?.rejected ?? 0 },
  { label: 'All', value: 'all' as const, count: quoteInboxStore.dashboard?.received_quote_requests ?? 0 },
])

const filteredRequests = computed(() => {
  const requests = quoteInboxStore.dashboard?.recent_requests ?? []
  if (activeTab.value === 'all') return requests
  return requests.filter(request => (request.latest_response?.status || 'pending') === activeTab.value)
})

function responseBadgeColor(status?: string | null) {
  if (status === 'accepted') return 'success'
  if (status === 'rejected') return 'error'
  if (status === 'modified') return 'warning'
  return 'neutral'
}

function formatDashboardDate(value?: string) {
  if (!value) return 'Recently'
  try {
    return new Intl.DateTimeFormat('en-KE', {
      day: 'numeric',
      month: 'short',
      hour: 'numeric',
      minute: '2-digit',
    }).format(new Date(value))
  } catch {
    return value
  }
}
</script>
