<template>
  <div class="space-y-6">
    <section class="rounded-3xl border border-[var(--p-border)] bg-[var(--p-surface)] p-6 shadow-sm">
      <div class="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p class="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--p-text-muted)]">Inbox</p>
          <h1 class="mt-2 text-2xl font-semibold text-[var(--p-text)]">Messages and quote updates</h1>
          <p class="mt-2 text-sm text-[var(--p-text-muted)]">
            Follow shop replies, fresh quotes, and request changes without entering the shop dashboard flow.
          </p>
        </div>
        <div class="flex flex-wrap gap-3">
          <div class="rounded-2xl border border-[var(--p-border)] bg-[var(--p-surface-sunken)] px-4 py-3">
            <p class="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--p-text-muted)]">New Quotes</p>
            <p class="mt-1 text-xl font-extrabold text-[var(--p-text)]">{{ activityBadgesStore.summary.client.new_quotes }}</p>
          </div>
          <div class="rounded-2xl border border-[var(--p-border)] bg-[var(--p-surface-sunken)] px-4 py-3">
            <p class="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--p-text-muted)]">Replies</p>
            <p class="mt-1 text-xl font-extrabold text-[var(--p-text)]">{{ activityBadgesStore.summary.client.shop_replies }}</p>
          </div>
          <UButton variant="soft" :loading="quoteInboxStore.loading" @click="refreshInbox">Refresh</UButton>
        </div>
      </div>

      <div class="mt-5 flex flex-wrap gap-2">
        <UButton
          v-for="tab in tabs"
          :key="tab.value"
          :variant="statusFilter === tab.value ? 'solid' : 'soft'"
          :color="statusFilter === tab.value ? 'primary' : 'neutral'"
          @click="statusFilter = tab.value"
        >
          {{ tab.label }} <span class="ml-1 opacity-75">{{ tab.count }}</span>
        </UButton>
      </div>

      <div v-if="quoteInboxStore.loading && !quoteInboxStore.clientRequests.length" class="mt-6 grid gap-4 md:grid-cols-2">
        <div v-for="index in 4" :key="index" class="h-36 animate-pulse rounded-2xl bg-[var(--p-surface-sunken)]" />
      </div>

      <div
        v-else-if="!filteredRequests.length"
        class="mt-6 rounded-2xl border border-dashed border-[var(--p-border)] bg-[var(--p-surface-sunken)] p-8 text-center text-[var(--p-text-muted)]"
      >
        No inbox items in this view yet.
      </div>

      <div v-else class="mt-6 grid gap-4 md:grid-cols-2">
        <article
          v-for="request in filteredRequests"
          :key="request.id"
          class="rounded-2xl border border-[var(--p-border)] bg-[var(--p-surface-sunken)] p-5"
        >
          <div class="flex items-start justify-between gap-3">
            <div class="min-w-0">
              <p class="truncate text-base font-semibold text-[var(--p-text)]">{{ request.shop_name }}</p>
              <p class="mt-1 text-sm text-[var(--p-text-muted)]">{{ request.customer_name || 'No customer name' }}</p>
            </div>
            <UBadge variant="soft" :color="requestBadgeColor(request.response_status)">{{ request.response_status }}</UBadge>
          </div>

          <div class="mt-4 grid gap-3 sm:grid-cols-2">
            <div class="rounded-2xl border border-[var(--p-border)] bg-[var(--p-surface)] p-3">
              <p class="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--p-text-muted)]">Latest total</p>
              <p class="mt-2 text-sm font-semibold text-[var(--p-text)]">
                {{ request.latest_response?.total || request.latest_sent_quote?.total || 'Awaiting shop response' }}
              </p>
            </div>
            <div class="rounded-2xl border border-[var(--p-border)] bg-[var(--p-surface)] p-3">
              <p class="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--p-text-muted)]">Turnaround</p>
              <p class="mt-2 text-sm text-[var(--p-text)]">
                {{ request.latest_sent_quote?.human_ready_text || (request.latest_sent_quote?.turnaround_hours ? `${request.latest_sent_quote.turnaround_hours} working hour(s)` : 'On request') }}
              </p>
            </div>
          </div>

          <div class="mt-4 flex items-center justify-between gap-3">
            <p class="text-xs uppercase tracking-[0.12em] text-[var(--p-text-muted)]">{{ formatRequestDate(request.updated_at || request.created_at) }}</p>
            <UButton variant="soft" :to="`/quotes/${request.id}`">Open thread</UButton>
          </div>
        </article>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { useActivityBadgesStore } from '~/stores/activityBadges'
import { useQuoteInboxStore } from '~/stores/quoteInbox'

definePageMeta({
  layout: 'workspace',
  middleware: 'auth',
})

const activityBadgesStore = useActivityBadgesStore()
const quoteInboxStore = useQuoteInboxStore()
const statusFilter = ref<'pending' | 'modified' | 'accepted' | 'rejected' | 'all'>('pending')

const tabs = computed(() => [
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

async function refreshInbox() {
  await Promise.all([
    quoteInboxStore.fetchClientRequests(),
    activityBadgesStore.fetchSummary(),
  ])
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

onMounted(async () => {
  await refreshInbox()
})
</script>
