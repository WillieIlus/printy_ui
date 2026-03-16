<template>
  <div class="space-y-6">
    <DashboardPageHeader
      title="Staff Quotes"
      subtitle="Create and manage print quotes. Staff only."
    >
      <template #actions>
        <UButton color="primary" to="/dashboard/quotes/create">
          <UIcon name="i-lucide-plus" class="w-4 h-4 mr-2" />
          New Quote
        </UButton>
      </template>
    </DashboardPageHeader>

    <!-- Status filter -->
    <div class="flex flex-wrap items-center gap-2">
      <UButton
        v-for="opt in statusOptions"
        :key="opt.value"
        :variant="statusFilter === opt.value ? 'solid' : 'soft'"
        :color="statusFilter === opt.value ? 'primary' : 'neutral'"
        size="sm"
        @click="statusFilter = opt.value"
      >
        {{ opt.label }}
      </UButton>
    </div>

    <CommonLoadingSpinner v-if="loading" />
    <div v-else-if="error" class="rounded-xl border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20 p-4">
      <p class="text-sm text-red-700 dark:text-red-300">{{ error }}</p>
      <p class="text-xs text-red-600 dark:text-red-400 mt-1">Ensure you have staff access.</p>
    </div>
    <div v-else-if="quotes.length" class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <NuxtLink
        v-for="q in quotes"
        :key="q.id"
        :to="`/dashboard/quotes/${q.id}`"
        class="block rounded-xl border border-[var(--p-border)] bg-[var(--p-surface)] p-4 transition-colors hover:border-flamingo-300 dark:hover:border-flamingo-700 hover:bg-flamingo-50/30 dark:hover:bg-flamingo-900/10"
      >
        <div class="flex justify-between items-start">
          <h3 class="font-semibold text-[var(--p-text)]">#{{ q.id }} {{ q.customer_name || 'No name' }}</h3>
          <UBadge :color="statusColor(q.status)" variant="soft" size="xs">{{ staffQuoteStatusLabel(q.status) }}</UBadge>
        </div>
        <p class="text-sm text-[var(--p-text-muted)] mt-0.5">{{ q.shop_name }}</p>
        <p class="text-lg font-bold text-[var(--p-text)] mt-2">
          {{ q.total ? formatKES(q.total) : '—' }}
        </p>
      </NuxtLink>
    </div>
    <DashboardEmptyState
      v-else
      title="No quotes yet"
      description="Create your first quote or start by calculating your first print job. Send prices to clients in seconds."
      icon="i-lucide-file-text"
    >
      <UButton to="/dashboard/quotes/create" color="primary">New Quote</UButton>
    </DashboardEmptyState>
  </div>
</template>

<script setup lang="ts">
import type { StaffQuote, StaffQuoteStatus } from '~/shared/types'
import { formatKES } from '~/utils/formatters'

definePageMeta({
  layout: 'dashboard',
  middleware: 'auth',
})

const staffQuotes = useStaffQuotes()
const quotes = ref<StaffQuote[]>([])
const loading = ref(false)
const error = ref<string | null>(null)
const statusFilter = ref<string | null>(null)

const statusOptions = [
  { value: null, label: 'All' },
  { value: 'DRAFT', label: 'Draft' },
  { value: 'SENT', label: 'Sent' },
  { value: 'ACCEPTED', label: 'Accepted' },
  { value: 'EXPIRED', label: 'Expired' },
]

function staffQuoteStatusLabel(s: StaffQuoteStatus): string {
  const m: Record<string, string> = {
    DRAFT: 'Draft',
    SENT: 'Sent',
    ACCEPTED: 'Accepted',
    EXPIRED: 'Expired',
    SUBMITTED: 'Submitted',
    PRICED: 'Priced',
    REJECTED: 'Rejected',
  }
  return m[s] ?? s
}

function statusColor(s: StaffQuoteStatus): 'neutral' | 'warning' | 'success' | 'error' {
  const m: Record<string, 'neutral' | 'warning' | 'success' | 'error'> = {
    DRAFT: 'neutral',
    SENT: 'warning',
    ACCEPTED: 'success',
    EXPIRED: 'error',
    SUBMITTED: 'warning',
    PRICED: 'warning',
    REJECTED: 'error',
  }
  return m[s] ?? 'neutral'
}

async function fetchQuotes() {
  loading.value = true
  error.value = null
  try {
    const res = await staffQuotes.list(
      statusFilter.value ? { status: statusFilter.value } : undefined
    )
    quotes.value = res.results
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'Failed to load quotes'
    quotes.value = []
  } finally {
    loading.value = false
  }
}

watch(statusFilter, () => fetchQuotes())
onMounted(() => fetchQuotes())
</script>
