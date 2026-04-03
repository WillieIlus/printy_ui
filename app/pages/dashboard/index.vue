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

    <QuotesCalculatorHub v-if="shopStore.selectedShopSlug">
      <template #flat>
        <QuotesBackendQuoteCalculator
          :fixed-shop-slug="shopStore.selectedShopSlug"
          eyebrow="Admin Page Calculator"
          title="Admin Page Calculator"
          description="Capture the enquirer, product or custom brief, quantity, size, stock, finishing, and turnaround in one premium workspace. Backend preview remains the pricing source of truth."
          mode="shop"
          anchor-id="dashboard-quote-workspace"
        />
      </template>
    </QuotesCalculatorHub>

    <section class="rounded-lg border border-[var(--p-border)] bg-[var(--p-surface)] p-6 shadow-sm">
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
          v-for="request in styledRequests"
          :key="request.id"
          class="overflow-hidden rounded-lg border shadow-sm transition-all duration-200 hover:shadow-md"
          :class="request.cardClass"
        >
          <div class="flex">
            <div class="w-1.5 shrink-0" :class="request.accentClass" />

            <div class="flex min-w-0 flex-1 flex-col gap-5 p-5 lg:flex-row lg:items-start lg:justify-between">
              <div class="min-w-0 flex-1">
                <div class="flex flex-wrap items-start justify-between gap-4">
                  <div class="min-w-0">
                    <div class="flex flex-wrap items-center gap-3">
                      <span
                        v-if="request.showUnreadDot"
                        class="h-2.5 w-2.5 rounded-full shadow-[0_0_0_4px_color-mix(in_oklab,var(--dot-glow)_15%,transparent)]"
                        :class="request.dotClass"
                        :style="{ '--dot-glow': request.dotGlow }"
                      />
                      <p class="truncate text-base font-semibold text-[var(--p-text)]">{{ request.customer_name || 'Enquirer' }}</p>
                      <UBadge variant="soft" :color="request.badgeColor" class="rounded-md px-2.5 py-1">
                        <UIcon :name="request.badgeIcon" class="mr-1.5 h-3.5 w-3.5" />
                        {{ request.badgeLabel }}
                      </UBadge>
                      <span
                        v-if="request.request_reference"
                        class="rounded-md border border-[color:color-mix(in_oklab,var(--p-border)_82%,transparent)] bg-[color:color-mix(in_oklab,var(--p-surface)_84%,transparent)] px-2 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--p-text-muted)]"
                      >
                        {{ request.request_reference }}
                      </span>
                    </div>

                    <p v-if="request.helperText" class="mt-2 text-sm text-[var(--p-text-muted)]">
                      {{ request.helperText }}
                    </p>

                    <div class="mt-3 flex flex-wrap items-center gap-2 text-xs text-[var(--p-text-muted)]">
                      <span class="rounded-md px-2 py-1" :class="request.metaPillClass">
                        {{ request.timeToneLabel }}
                      </span>
                      <span v-if="request.updatedRelative">{{ request.updatedRelative }}</span>
                      <span v-if="request.updatedRelative && request.updatedLabel" aria-hidden="true">&middot;</span>
                      <span>{{ request.updatedLabel }}</span>
                    </div>
                  </div>

                  <div class="flex shrink-0 flex-wrap gap-2">
                    <UButton
                      v-if="shopStore.selectedShopSlug"
                      :variant="request.primaryActionVariant"
                      :color="request.primaryActionColor"
                      class="rounded-md"
                      :to="`/dashboard/shops/${shopStore.selectedShopSlug}/incoming-requests/${request.id}`"
                    >
                      <UIcon :name="request.primaryActionIcon" class="mr-2 h-4 w-4" />
                      {{ request.primaryActionLabel }}
                    </UButton>
                  </div>
                </div>

                <div class="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)_minmax(0,0.8fr)_minmax(0,0.9fr)]">
                  <div class="rounded-md border p-3" :class="request.panelClass">
                    <p class="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--p-text-muted)]">Contact</p>
                    <p class="mt-2 text-sm text-[var(--p-text)]">{{ request.contactLabel }}</p>
                    <p v-if="request.contactMeta" class="mt-1 text-xs text-[var(--p-text-muted)]">{{ request.contactMeta }}</p>
                  </div>

                  <div class="rounded-md border p-3" :class="request.panelClass">
                    <p class="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--p-text-muted)]">Latest total</p>
                    <p class="mt-2 text-sm font-semibold text-[var(--p-text)]">{{ request.totalLabel }}</p>
                    <p v-if="request.totalMeta" class="mt-1 text-xs text-[var(--p-text-muted)]">{{ request.totalMeta }}</p>
                  </div>

                  <div class="rounded-md border p-3" :class="request.panelClass">
                    <p class="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--p-text-muted)]">{{ request.sourceLabel }}</p>
                    <p class="mt-2 text-sm text-[var(--p-text)]">{{ request.sourceValue }}</p>
                    <p v-if="request.sourceMeta" class="mt-1 text-xs text-[var(--p-text-muted)]">{{ request.sourceMeta }}</p>
                  </div>

                  <div class="rounded-md border p-3" :class="request.summaryPanelClass">
                    <p class="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--p-text-muted)]">Workspace summary</p>
                    <p class="mt-2 text-sm text-[var(--p-text)]">{{ request.summaryLine }}</p>
                    <p v-if="request.summaryMeta" class="mt-1 text-xs text-[var(--p-text-muted)]">{{ request.summaryMeta }}</p>
                  </div>
                </div>
              </div>
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

const styledRequests = computed(() => filteredRequests.value.map(request => {
  const state = deriveRequestVisualState(request)
  const contactLabel = request.customer_phone || request.customer_email || 'No contact provided'
  const contactMeta = request.customer_phone && request.customer_email ? request.customer_email : ''
  const totalLabel = request.latest_response?.total || (state.kind === 'quoted' ? 'Quote total pending sync' : 'Awaiting quote')
  const sourceLabel = request.source_draft_reference ? 'Source draft' : 'Source'
  const sourceValue = request.source_draft_reference || 'Direct request'
  const updatedValue = request.updated_at || request.created_at

  return {
    ...request,
    ...state,
    contactLabel,
    contactMeta,
    totalLabel,
    totalMeta: state.totalMeta,
    updatedLabel: formatDashboardDate(updatedValue),
    updatedRelative: formatRelativeTime(updatedValue),
    timeToneLabel: formatTimeTone(updatedValue, state.kind),
    sourceLabel,
    sourceValue,
    sourceMeta: request.request_reference ? `Request ${request.request_reference}` : 'No custom request reference',
    summaryLine: state.summaryLine,
    summaryMeta: state.summaryMeta,
  }
}))

function deriveRequestVisualState(request: NonNullable<typeof filteredRequests.value[number]>) {
  const requestStatus = request.status || 'submitted'
  const responseStatus = request.latest_response?.status || null

  if (responseStatus === 'accepted') {
    return {
      kind: 'accepted' as const,
      badgeLabel: 'Accepted',
      badgeColor: 'success' as const,
      helperText: 'Customer accepted the latest quote.',
      summaryLine: 'Approved request ready for production follow-through.',
      summaryMeta: 'Latest customer decision is final unless the request changes again.',
      totalMeta: 'Accepted quote total',
      cardClass: 'border-emerald-200/80 bg-[color:color-mix(in_oklab,var(--p-surface)_82%,rgb(16_185_129)_8%)] dark:border-emerald-900/60 dark:bg-[color:color-mix(in_oklab,var(--p-surface)_88%,rgb(16_185_129)_10%)]',
      accentClass: 'bg-emerald-500/80 dark:bg-emerald-500/70',
      panelClass: 'border-emerald-200/70 bg-[color:color-mix(in_oklab,var(--p-surface)_90%,rgb(16_185_129)_4%)] dark:border-emerald-900/60 dark:bg-[color:color-mix(in_oklab,var(--p-surface-raised)_88%,rgb(16_185_129)_8%)]',
      summaryPanelClass: 'border-emerald-300/80 bg-[color:color-mix(in_oklab,var(--p-surface)_86%,rgb(16_185_129)_8%)] dark:border-emerald-800/80 dark:bg-[color:color-mix(in_oklab,var(--p-surface-raised)_84%,rgb(16_185_129)_12%)]',
      metaPillClass: 'border border-emerald-200/80 bg-emerald-50/80 text-emerald-700 dark:border-emerald-900/70 dark:bg-emerald-950/40 dark:text-emerald-300',
      dotClass: 'bg-emerald-500',
      dotGlow: 'rgb(16 185 129)',
      showUnreadDot: false,
      badgeIcon: 'i-lucide-badge-check',
      primaryActionLabel: 'View quote',
      primaryActionIcon: 'i-lucide-file-check-2',
      primaryActionVariant: 'soft' as const,
      primaryActionColor: 'success' as const,
    }
  }

  if (responseStatus === 'rejected') {
    return {
      kind: 'rejected' as const,
      badgeLabel: 'Rejected',
      badgeColor: 'error' as const,
      helperText: 'Customer declined the last quote response.',
      summaryLine: 'Closed out for now after the latest quote was declined.',
      summaryMeta: 'Keep the brief available in case the customer asks to reopen it.',
      totalMeta: 'Last quoted amount',
      cardClass: 'border-rose-200/80 bg-[color:color-mix(in_oklab,var(--p-surface)_84%,rgb(244_63_94)_7%)] dark:border-rose-900/60 dark:bg-[color:color-mix(in_oklab,var(--p-surface)_88%,rgb(244_63_94)_10%)]',
      accentClass: 'bg-rose-500/75 dark:bg-rose-500/70',
      panelClass: 'border-rose-200/70 bg-[color:color-mix(in_oklab,var(--p-surface)_90%,rgb(244_63_94)_3%)] dark:border-rose-900/60 dark:bg-[color:color-mix(in_oklab,var(--p-surface-raised)_88%,rgb(244_63_94)_7%)]',
      summaryPanelClass: 'border-rose-300/80 bg-[color:color-mix(in_oklab,var(--p-surface)_86%,rgb(244_63_94)_7%)] dark:border-rose-800/80 dark:bg-[color:color-mix(in_oklab,var(--p-surface-raised)_84%,rgb(244_63_94)_11%)]',
      metaPillClass: 'border border-rose-200/80 bg-rose-50/80 text-rose-700 dark:border-rose-900/70 dark:bg-rose-950/40 dark:text-rose-300',
      dotClass: 'bg-rose-500',
      dotGlow: 'rgb(244 63 94)',
      showUnreadDot: false,
      badgeIcon: 'i-lucide-circle-x',
      primaryActionLabel: 'View request',
      primaryActionIcon: 'i-lucide-file-search',
      primaryActionVariant: 'soft' as const,
      primaryActionColor: 'error' as const,
    }
  }

  if (responseStatus === 'modified') {
    return {
      kind: 'modified' as const,
      badgeLabel: 'Modified',
      badgeColor: 'warning' as const,
      helperText: 'Changes need review before the next action.',
      summaryLine: 'Customer feedback changed the brief after your last response.',
      summaryMeta: 'Re-check pricing, specs, and delivery assumptions before replying again.',
      totalMeta: 'Last revision amount',
      cardClass: 'border-amber-200/80 bg-[color:color-mix(in_oklab,var(--p-surface)_80%,rgb(245_158_11)_10%)] dark:border-amber-900/60 dark:bg-[color:color-mix(in_oklab,var(--p-surface)_86%,rgb(245_158_11)_12%)]',
      accentClass: 'bg-amber-500/85 dark:bg-amber-500/75',
      panelClass: 'border-amber-200/70 bg-[color:color-mix(in_oklab,var(--p-surface)_90%,rgb(245_158_11)_4%)] dark:border-amber-900/60 dark:bg-[color:color-mix(in_oklab,var(--p-surface-raised)_88%,rgb(245_158_11)_8%)]',
      summaryPanelClass: 'border-amber-300/80 bg-[color:color-mix(in_oklab,var(--p-surface)_84%,rgb(245_158_11)_10%)] dark:border-amber-800/80 dark:bg-[color:color-mix(in_oklab,var(--p-surface-raised)_82%,rgb(245_158_11)_14%)]',
      metaPillClass: 'border border-amber-200/80 bg-amber-50/80 text-amber-700 dark:border-amber-900/70 dark:bg-amber-950/40 dark:text-amber-300',
      dotClass: 'bg-amber-500',
      dotGlow: 'rgb(245 158 11)',
      showUnreadDot: true,
      badgeIcon: 'i-lucide-file-warning',
      primaryActionLabel: 'Review changes',
      primaryActionIcon: 'i-lucide-refresh-cw',
      primaryActionVariant: 'solid' as const,
      primaryActionColor: 'warning' as const,
    }
  }

  if (requestStatus === 'quoted' || responseStatus === 'pending') {
    return {
      kind: 'quoted' as const,
      badgeLabel: 'Quote sent',
      badgeColor: 'primary' as const,
      helperText: 'Quote sent and waiting for customer response.',
      summaryLine: 'Latest quote is out with the customer for review.',
      summaryMeta: 'Track response timing and be ready if they ask for a revision.',
      totalMeta: 'Most recent quoted total',
      cardClass: 'border-sky-200/80 bg-[color:color-mix(in_oklab,var(--p-surface)_82%,rgb(14_165_233)_8%)] dark:border-sky-900/60 dark:bg-[color:color-mix(in_oklab,var(--p-surface)_88%,rgb(14_165_233)_10%)]',
      accentClass: 'bg-sky-500/80 dark:bg-sky-500/70',
      panelClass: 'border-sky-200/70 bg-[color:color-mix(in_oklab,var(--p-surface)_90%,rgb(14_165_233)_4%)] dark:border-sky-900/60 dark:bg-[color:color-mix(in_oklab,var(--p-surface-raised)_88%,rgb(14_165_233)_8%)]',
      summaryPanelClass: 'border-sky-300/80 bg-[color:color-mix(in_oklab,var(--p-surface)_86%,rgb(14_165_233)_8%)] dark:border-sky-800/80 dark:bg-[color:color-mix(in_oklab,var(--p-surface-raised)_84%,rgb(14_165_233)_11%)]',
      metaPillClass: 'border border-sky-200/80 bg-sky-50/80 text-sky-700 dark:border-sky-900/70 dark:bg-sky-950/40 dark:text-sky-300',
      dotClass: 'bg-sky-500',
      dotGlow: 'rgb(14 165 233)',
      showUnreadDot: false,
      badgeIcon: 'i-lucide-send',
      primaryActionLabel: 'View quote',
      primaryActionIcon: 'i-lucide-arrow-up-right',
      primaryActionVariant: 'soft' as const,
      primaryActionColor: 'primary' as const,
    }
  }

  if (requestStatus === 'viewed') {
    return {
      kind: 'opened' as const,
      badgeLabel: 'Opened',
      badgeColor: 'neutral' as const,
      helperText: 'Opened by the shop and awaiting a quote.',
      summaryLine: 'Already reviewed once, but no quote has been sent yet.',
      summaryMeta: 'Continue from the existing brief instead of starting over.',
      totalMeta: 'Quote not sent yet',
      cardClass: 'border-[color:color-mix(in_oklab,var(--p-border)_92%,transparent)] bg-[color:color-mix(in_oklab,var(--p-surface)_92%,var(--p-surface-sunken)_8%)]',
      accentClass: 'bg-slate-400/70 dark:bg-slate-500/70',
      panelClass: 'border-[color:color-mix(in_oklab,var(--p-border)_88%,transparent)] bg-[color:color-mix(in_oklab,var(--p-surface)_94%,var(--p-surface-sunken)_6%)]',
      summaryPanelClass: 'border-[color:color-mix(in_oklab,var(--p-border)_94%,transparent)] bg-[color:color-mix(in_oklab,var(--p-surface-sunken)_88%,transparent)]',
      metaPillClass: 'border border-[color:color-mix(in_oklab,var(--p-border)_86%,transparent)] bg-[var(--p-surface)] text-[var(--p-text-muted)]',
      dotClass: 'bg-slate-400',
      dotGlow: 'rgb(148 163 184)',
      showUnreadDot: false,
      badgeIcon: 'i-lucide-eye',
      primaryActionLabel: 'Continue',
      primaryActionIcon: 'i-lucide-arrow-right',
      primaryActionVariant: 'soft' as const,
      primaryActionColor: 'neutral' as const,
    }
  }

  return {
    kind: 'new' as const,
    badgeLabel: 'New',
    badgeColor: 'warning' as const,
    helperText: 'Unseen request awaiting your first review.',
    summaryLine: 'Fresh request at the top of the inbox flow.',
    summaryMeta: 'Open quickly to capture urgency and respond while the brief is fresh.',
    totalMeta: 'No quote sent yet',
    cardClass: 'border-flamingo-200/80 bg-[color:color-mix(in_oklab,var(--p-surface)_78%,rgb(251_113_133)_10%)] dark:border-flamingo-900/60 dark:bg-[color:color-mix(in_oklab,var(--p-surface)_84%,rgb(251_113_133)_12%)]',
    accentClass: 'bg-flamingo-500/85 dark:bg-flamingo-500/75',
    panelClass: 'border-flamingo-200/70 bg-[color:color-mix(in_oklab,var(--p-surface)_89%,rgb(251_113_133)_4%)] dark:border-flamingo-900/60 dark:bg-[color:color-mix(in_oklab,var(--p-surface-raised)_88%,rgb(251_113_133)_8%)]',
    summaryPanelClass: 'border-flamingo-300/80 bg-[color:color-mix(in_oklab,var(--p-surface)_82%,rgb(251_113_133)_12%)] dark:border-flamingo-800/80 dark:bg-[color:color-mix(in_oklab,var(--p-surface-raised)_80%,rgb(251_113_133)_15%)]',
    metaPillClass: 'border border-flamingo-200/80 bg-flamingo-50/80 text-flamingo-700 dark:border-flamingo-900/70 dark:bg-flamingo-950/40 dark:text-flamingo-300',
    dotClass: 'bg-flamingo-500',
    dotGlow: 'rgb(251 113 133)',
    showUnreadDot: true,
    badgeIcon: 'i-lucide-bell-dot',
    primaryActionLabel: 'Review now',
    primaryActionIcon: 'i-lucide-scan-search',
    primaryActionVariant: 'solid' as const,
    primaryActionColor: 'primary' as const,
  }
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

function formatRelativeTime(value?: string) {
  if (!value) return ''
  const date = new Date(value)
  const diffMs = Date.now() - date.getTime()
  if (!Number.isFinite(diffMs)) return ''
  const minutes = Math.round(diffMs / 60000)
  if (minutes < 1) return 'Just now'
  if (minutes < 60) return `${minutes} min ago`
  const hours = Math.round(minutes / 60)
  if (hours < 24) return `${hours} hr${hours === 1 ? '' : 's'} ago`
  const days = Math.round(hours / 24)
  if (days < 7) return `${days} day${days === 1 ? '' : 's'} ago`
  return ''
}

function formatTimeTone(value: string | undefined, kind: 'new' | 'opened' | 'quoted' | 'modified' | 'accepted' | 'rejected') {
  if (!value) return kind === 'new' ? 'New arrival' : 'In queue'

  const date = new Date(value)
  const diffMs = Date.now() - date.getTime()
  if (!Number.isFinite(diffMs)) return kind === 'new' ? 'Needs review' : 'In queue'

  const minutes = diffMs / 60000
  if (kind === 'new') {
    if (minutes < 15) return 'Just arrived'
    if (minutes < 180) return 'New today'
    return 'Awaiting first review'
  }
  if (kind === 'modified') {
    if (minutes < 60) return 'Recently changed'
    return 'Revision waiting'
  }
  if (kind === 'quoted') return 'Waiting on customer'
  if (kind === 'accepted') return 'Approved'
  if (kind === 'rejected') return 'Closed outcome'
  return 'Opened'
}
</script>
