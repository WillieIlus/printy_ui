<template>
  <div class="min-h-screen bg-[var(--p-surface)]">
    <main class="mx-auto max-w-7xl space-y-8 px-4 py-10 sm:px-6 lg:px-8">
      <QuotesBackendQuoteCalculator
        title="Prepare a quote draft"
        description="This uses the backend preview path directly. Save drafts, send them to selected shops, and keep pricing logic out of the browser."
        eyebrow="Client Drafts"
        mode="client"
        @draft-saved="refreshWorkspace"
        @draft-sent="refreshWorkspace"
      />

      <section class="rounded-lg border border-[var(--p-border)] bg-[var(--p-surface)] p-6 shadow-sm">
        <div class="flex items-start justify-between gap-4">
          <div>
            <p class="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--p-text-muted)]">Saved Drafts</p>
            <h2 class="mt-2 text-2xl font-semibold text-[var(--p-text)]">Draft history</h2>
            <p class="mt-2 text-sm text-[var(--p-text-muted)]">Saved draft records come from the backend calculator draft endpoints.</p>
          </div>
          <UButton variant="soft" :loading="quoteInboxStore.loading" @click="refreshWorkspace">Refresh</UButton>
        </div>

        <div v-if="quoteInboxStore.loading && !quoteInboxStore.drafts.length" class="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          <div v-for="index in 3" :key="index" class="h-36 animate-pulse rounded-2xl bg-[var(--p-surface-sunken)]" />
        </div>

        <div v-else-if="!quoteInboxStore.drafts.length" class="mt-6 rounded-2xl border border-dashed border-[var(--p-border)] bg-[var(--p-surface-sunken)] p-8 text-center text-[var(--p-text-muted)]">
          No drafts yet. Save a draft from the calculator above.
        </div>

        <div v-else class="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          <article
            v-for="draft in quoteInboxStore.drafts"
            :key="draft.id"
            class="rounded-2xl border border-[var(--p-border)] bg-[var(--p-surface-sunken)] p-5"
          >
            <div class="flex items-start justify-between gap-3">
              <div>
                <p class="text-sm font-semibold text-[var(--p-text)]">{{ draft.title || draft.draft_reference || `Draft #${draft.id}` }}</p>
                <p class="mt-1 text-sm text-[var(--p-text-muted)]">{{ draft.request_details_snapshot?.customer_name || 'No customer name yet' }}</p>
              </div>
              <UBadge variant="soft" :color="draftBadgeColor(draft.status)">{{ draft.status }}</UBadge>
            </div>
            <div class="mt-4 grid gap-3 sm:grid-cols-2">
              <div class="rounded-2xl border border-[var(--p-border)] bg-[var(--p-surface)] p-3">
                <p class="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--p-text-muted)]">Shop</p>
                <p class="mt-2 text-sm text-[var(--p-text)]">{{ draft.shop_name || draft.shop_slug || 'Unassigned' }}</p>
              </div>
              <div class="rounded-2xl border border-[var(--p-border)] bg-[var(--p-surface)] p-3">
                <p class="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--p-text-muted)]">Preview total</p>
                <p class="mt-2 text-sm font-semibold text-[var(--p-text)]">{{ draft.pricing_snapshot?.totals?.grand_total || 'Awaiting preview' }}</p>
              </div>
            </div>
          </article>
        </div>
      </section>

      <section class="rounded-lg border border-[var(--p-border)] bg-[var(--p-surface)] p-6 shadow-sm">
        <div class="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p class="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--p-text-muted)]">Sent Requests</p>
            <h2 class="mt-2 text-2xl font-semibold text-[var(--p-text)]">Shop responses</h2>
            <p class="mt-2 text-sm text-[var(--p-text-muted)]">
              Statuses below are derived from backend quote request and quote response endpoints.
            </p>
          </div>
          <div class="flex flex-wrap gap-2">
            <UButton variant="soft" to="/quotes">Open full requests</UButton>
            <UButton variant="soft" :loading="quoteInboxStore.loading" @click="refreshWorkspace">Refresh</UButton>
          </div>
        </div>

        <div class="mt-5 flex flex-wrap gap-2">
          <UButton
            v-for="tab in statusTabs"
            :key="tab.value"
            :variant="statusFilter === tab.value ? 'solid' : 'soft'"
            :color="statusFilter === tab.value ? 'primary' : 'neutral'"
            @click="statusFilter = tab.value"
          >
            {{ tab.label }} <span class="ml-1 opacity-75">{{ tab.count }}</span>
          </UButton>
        </div>

        <div v-if="quoteInboxStore.loading && !quoteInboxStore.clientRequests.length" class="mt-6 grid gap-4 md:grid-cols-2">
          <div v-for="index in 4" :key="index" class="h-40 animate-pulse rounded-2xl bg-[var(--p-surface-sunken)]" />
        </div>

        <div v-else-if="!filteredRequests.length" class="mt-6 rounded-2xl border border-dashed border-[var(--p-border)] bg-[var(--p-surface-sunken)] p-8 text-center text-[var(--p-text-muted)]">
          No requests in this status yet.
        </div>

        <div v-else class="mt-6 grid gap-4 md:grid-cols-2">
          <article
            v-for="request in filteredRequests"
            :key="request.id"
            class="rounded-2xl border border-[var(--p-border)] bg-[var(--p-surface-sunken)] p-5"
          >
            <div class="flex items-start justify-between gap-3">
              <div class="min-w-0">
                <p class="text-sm font-semibold text-[var(--p-text)]">{{ request.shop_name }}</p>
                <p class="mt-1 text-sm text-[var(--p-text-muted)]">{{ request.customer_name || 'No customer name' }}</p>
              </div>
              <UBadge variant="soft" :color="requestBadgeColor(request.response_status)">{{ request.response_status }}</UBadge>
            </div>

            <div class="mt-4 grid gap-3 sm:grid-cols-2">
              <div class="rounded-2xl border border-[var(--p-border)] bg-[var(--p-surface)] p-3">
                <p class="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--p-text-muted)]">Latest total</p>
                <p class="mt-2 text-sm font-semibold text-[var(--p-text)]">{{ request.latest_response?.total || request.latest_sent_quote?.total || 'Awaiting shop response' }}</p>
              </div>
              <div class="rounded-2xl border border-[var(--p-border)] bg-[var(--p-surface)] p-3">
                <p class="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--p-text-muted)]">Turnaround</p>
                <p class="mt-2 text-sm text-[var(--p-text)]">{{ request.latest_sent_quote?.turnaround_days ? `${request.latest_sent_quote.turnaround_days} day(s)` : 'On request' }}</p>
              </div>
            </div>

            <div class="mt-4 flex items-center justify-between gap-3">
              <p class="text-xs uppercase tracking-[0.12em] text-[var(--p-text-muted)]">
                {{ formatRequestDate(request.updated_at || request.created_at) }}
              </p>
              <UButton variant="soft" :to="`/quotes/${request.id}`">Open request</UButton>
            </div>
          </article>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup lang="ts">
import { getPostLoginRedirectPath } from '~/composables/useAuth'
import { useAuthStore } from '~/stores/auth'
import { useQuoteInboxStore } from '~/stores/quoteInbox'

definePageMeta({
  layout: 'default',
  middleware: ['auth'],
})

const authStore = useAuthStore()
const quoteInboxStore = useQuoteInboxStore()
const statusFilter = ref<'pending' | 'modified' | 'accepted' | 'rejected' | 'all'>('pending')

watchEffect(() => {
  if (!authStore.isClient && authStore.isAuthenticated) {
    navigateTo(getPostLoginRedirectPath(authStore.user, false))
  }
})

onMounted(async () => {
  await refreshWorkspace()
})

async function refreshWorkspace() {
  if (!authStore.isClient) return
  await Promise.all([
    quoteInboxStore.fetchDrafts(),
    quoteInboxStore.fetchClientRequests(),
  ])
}

function handleDraftSaved() {
  void refreshWorkspace()
}

function handleDraftSent() {
  void refreshWorkspace()
}

const statusTabs = computed(() => [
  { label: 'Pending', value: 'pending' as const, count: quoteInboxStore.clientRequests.filter(request => request.response_status === 'pending').length },
  { label: 'Modified', value: 'modified' as const, count: quoteInboxStore.clientRequests.filter(request => request.response_status === 'modified').length },
  { label: 'Accepted', value: 'accepted' as const, count: quoteInboxStore.clientRequests.filter(request => request.response_status === 'accepted').length },
  { label: 'Rejected', value: 'rejected' as const, count: quoteInboxStore.clientRequests.filter(request => request.response_status === 'rejected').length },
  { label: 'All', value: 'all' as const, count: quoteInboxStore.clientRequests.length },
])

const filteredRequests = computed(() => {
  if (statusFilter.value === 'all') return quoteInboxStore.clientRequests
  return quoteInboxStore.clientRequests.filter(request => request.response_status === statusFilter.value)
})

function draftBadgeColor(status: string) {
  if (status === 'accepted') return 'success'
  if (status === 'rejected') return 'error'
  if (status === 'modified') return 'warning'
  return 'neutral'
}

function requestBadgeColor(status: string) {
  if (status === 'accepted') return 'success'
  if (status === 'rejected') return 'error'
  if (status === 'modified') return 'warning'
  return 'neutral'
}

function formatRequestDate(value?: string) {
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
