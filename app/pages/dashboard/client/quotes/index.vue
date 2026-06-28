<script setup lang="ts">
import BaseAlert from '~/components/base/BaseAlert.vue'
import DashboardIcon from '~/components/dashboard/Icons.vue'
import DashboardSectionCard from '~/components/dashboard/DashboardSectionCard.vue'
import DashboardStatusBadge from '~/components/dashboard/StatusBadge.vue'
import { getApiErrorMessage } from '~/shared/api'
import { fetchClientQuoteRequests } from '~/services/quotes'
import type { ClientQuoteRow } from '~/types/client'

definePageMeta({ layout: 'dashboard-client' })

type QuoteFilter = 'all' | 'awaiting_review' | 'accepted' | 'expired'

const filters: { key: QuoteFilter, label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'awaiting_review', label: 'Awaiting review' },
  { key: 'accepted', label: 'Accepted' },
  { key: 'expired', label: 'Expired' },
]

const loading = ref(true)
const pageError = ref('')
const activeFilter = ref<QuoteFilter>('all')
const quotes = ref<ClientQuoteRow[]>([])

onMounted(async () => {
  try {
    quotes.value = await fetchClientQuoteRequests() as ClientQuoteRow[]
  } catch (error: unknown) {
    pageError.value = getApiErrorMessage(error, 'Client quotes are unavailable right now.')
  } finally {
    loading.value = false
  }
})

const quoteCards = computed(() => quotes.value.map(quote => ({
  ...quote,
  display_status: displayStatus(quote),
  display_status_label: displayStatusLabel(quote),
  display_request: quoteSummary(quote),
  display_total: formatKes(quote.latest_response?.total),
  display_updated: formatDate(quote.updated_at),
  action_label: isAwaitingReview(quote) ? 'Review quote' : 'Open details',
})))

const filteredQuotes = computed(() => {
  if (activeFilter.value === 'all') {
    return quoteCards.value
  }
  return quoteCards.value.filter(quote => filterCategory(quote) === activeFilter.value)
})

const totalCount = computed(() => quoteCards.value.length)

function filterCount(filter: QuoteFilter) {
  if (filter === 'all') {
    return totalCount.value
  }
  return quoteCards.value.filter(quote => filterCategory(quote) === filter).length
}

function filterCategory(quote: ClientQuoteRow): QuoteFilter | 'other' {
  const status = displayStatus(quote)
  if (['accepted', 'approved', 'paid'].includes(status)) return 'accepted'
  if (['expired'].includes(status)) return 'expired'
  if (isAwaitingReview(quote)) return 'awaiting_review'
  return 'other'
}

function isAwaitingReview(quote: ClientQuoteRow) {
  const status = displayStatus(quote)
  return ['sent', 'revised', 'modified', 'awaiting_review', 'awaiting_response'].includes(status)
}

function displayStatus(quote: ClientQuoteRow) {
  return String(quote.latest_response?.status || quote.status || '').toLowerCase()
}

function displayStatusLabel(quote: ClientQuoteRow) {
  return quote.latest_response?.status_label || quote.status_label || startCase(displayStatus(quote))
}

function quoteSummary(quote: ClientQuoteRow) {
  const snapshot = quote.request_snapshot || {}
  return String(
    snapshot.product_label
    || snapshot.product_type
    || snapshot.product
    || quote.latest_response?.quote_reference
    || 'Print request',
  )
}

function formatKes(value: unknown) {
  const amount = Number(value)
  if (!Number.isFinite(amount) || amount <= 0) {
    return ''
  }
  return `KES ${amount.toLocaleString('en-KE', { maximumFractionDigits: 2 })}`
}

function formatDate(value: unknown) {
  if (!value) return '-'
  const date = new Date(String(value))
  if (Number.isNaN(date.getTime())) return '-'
  return date.toLocaleDateString('en-KE', { day: 'numeric', month: 'short', year: 'numeric' })
}

function startCase(value: unknown) {
  return String(value || 'pending')
    .replace(/[_-]+/g, ' ')
    .replace(/\b\w/g, char => char.toUpperCase())
}
</script>

<template>
  <div class="mx-auto max-w-6xl space-y-6">
    <div class="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <div class="flex items-center gap-2">
          <DashboardIcon name="fileText" class-name="h-5 w-5 text-[#e13515]" />
          <h1 class="text-2xl font-bold text-slate-900">Quotes</h1>
        </div>
        <p class="mt-1 text-sm text-slate-500">Review quote requests, sent quotes, approvals, and quote messages.</p>
      </div>
      <NuxtLink to="/#live-estimate" class="inline-flex items-center gap-2 self-start rounded-xl bg-[#e13515] px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-[#c72f13] sm:self-auto">
        Request a quote
        <span>-></span>
      </NuxtLink>
    </div>

    <BaseAlert v-if="pageError" variant="error" title="Quotes could not load." :message="pageError" />

    <div class="flex flex-wrap gap-2">
      <button
        v-for="filter in filters"
        :key="filter.key"
        type="button"
        :class="['rounded-lg px-4 py-2 text-sm font-medium transition-colors', activeFilter === filter.key ? 'bg-[#e13515] text-white shadow-sm' : 'border border-slate-200 bg-white text-slate-600 hover:bg-slate-50']"
        @click="activeFilter = filter.key"
      >
        {{ filter.label }}
        <span
          v-if="filter.key !== 'all'"
          :class="['ml-1.5 inline-flex h-5 min-w-[1.25rem] items-center justify-center rounded-full px-1 text-[11px] font-semibold', activeFilter === filter.key ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500']"
        >
          {{ filterCount(filter.key) }}
        </span>
      </button>
    </div>

    <DashboardSectionCard v-if="loading">
      <div class="py-12 text-center">
        <DashboardIcon name="fileText" class-name="mx-auto h-10 w-10 text-slate-300" />
        <p class="mt-3 text-sm font-medium text-slate-500">Loading quotes...</p>
      </div>
    </DashboardSectionCard>

    <DashboardSectionCard v-else-if="!pageError && filteredQuotes.length === 0">
      <div class="py-12 text-center">
        <DashboardIcon name="fileText" class-name="mx-auto h-10 w-10 text-slate-300" />
        <p class="mt-3 text-sm font-medium text-slate-500">
          {{ totalCount === 0 ? 'No quote requests yet' : 'No quotes found' }}
        </p>
        <p class="mt-1 text-sm text-slate-400">
          {{ totalCount === 0 ? 'Start a quote from the calculator. Submitted requests and sent quotes will appear here.' : 'Try a different filter.' }}
        </p>
        <NuxtLink
          v-if="totalCount === 0"
          to="/#live-estimate"
          class="mt-4 inline-flex items-center justify-center rounded-xl bg-[#e13515] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#c72f13]"
        >
          Start a quote
        </NuxtLink>
      </div>
    </DashboardSectionCard>

    <div v-else-if="!pageError" class="space-y-3">
      <article
        v-for="quote in filteredQuotes"
        :key="quote.id"
        class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
      >
        <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div class="min-w-0 flex-1">
            <div class="flex flex-wrap items-center gap-2">
              <span class="text-sm font-semibold text-slate-900">{{ quote.reference }}</span>
              <DashboardStatusBadge :status="quote.display_status" :label="quote.display_status_label" dot />
            </div>
            <p class="mt-1 truncate text-sm text-slate-600">{{ quote.display_request }}</p>
            <div class="mt-2 flex flex-wrap items-center gap-4 text-xs text-slate-400">
              <span>Updated {{ quote.display_updated }}</span>
              <span v-if="quote.display_total">{{ quote.display_total }}</span>
              <span v-if="quote.assigned_manager_name">Manager: {{ quote.assigned_manager_name }}</span>
            </div>
          </div>
          <NuxtLink
            :to="`/dashboard/client/quotes/${quote.id}`"
            class="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50"
          >
            {{ quote.action_label }}
          </NuxtLink>
        </div>
      </article>
    </div>
  </div>
</template>
