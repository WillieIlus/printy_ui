<template>
  <RoleDashboardFrame
    title="Client Workspace"
    badge="Client"
    :name="displayName"
    :initials="initials"
    subtitle="Quotes, jobs, payments, and reorder handoff"
    breadcrumb-root="Dashboard"
    :nav-items="navItems"
    support-title="Client workspace"
    support-copy="Only client-safe quote, job, and payment data appears here."
    support-action="Overview"
    support-to="/dashboard/client"
    @logout="auth.logout()"
  >
    <BaseAlert v-if="pageError" variant="error" title="Client workspace could not load." :message="pageError" />

    <DashboardSection v-if="section === 'quotes'" title="Client Quotes" subtitle="Track waiting quotes, view responses, and continue to payment.">
      <div class="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div class="inline-flex rounded-2xl border border-[#e4e7ec] bg-white p-1">
          <button
            type="button"
            class="rounded-xl px-4 py-2 text-sm font-semibold transition-colors"
            :class="quoteTab === 'waiting' ? 'bg-[#101828] text-white' : 'text-[#667085] hover:text-[#101828]'"
            @click="quoteTab = 'waiting'"
          >
            Waiting ({{ waitingQuotes.length }})
          </button>
          <button
            type="button"
            class="rounded-xl px-4 py-2 text-sm font-semibold transition-colors"
            :class="quoteTab === 'responded' ? 'bg-[#101828] text-white' : 'text-[#667085] hover:text-[#101828]'"
            @click="quoteTab = 'responded'"
          >
            Responded ({{ respondedQuotes.length }})
          </button>
        </div>
        <BaseButton to="/dashboard/client?pendingQuote=1" variant="primary" size="sm">Open Calculator</BaseButton>
      </div>

      <div v-if="loading" class="grid gap-4">
        <div v-for="index in 3" :key="index" class="h-32 animate-pulse rounded-2xl border border-[#e4e7ec] bg-[#f9fafb]" />
      </div>

      <DashboardEmptyState
        v-else-if="!filteredQuotes.length"
        title="No quote requests yet"
        description="Your quotes will appear here after you request pricing."
        action-label="Use the calculator"
        action-to="/dashboard/client?pendingQuote=1"
      />

      <div v-else class="grid gap-4">
        <article v-for="quote in filteredQuotes" :key="quote.id" class="rounded-2xl border border-[#e4e7ec] bg-white p-5">
          <div class="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p class="text-xs font-semibold uppercase tracking-[0.18em] text-[#98a2b3]">{{ quote.request_reference || quote.reference || `Quote ${quote.id}` }}</p>
              <h3 class="mt-2 text-lg font-semibold text-[#101828]">{{ quoteCardTitle(quote) }}</h3>
              <p class="mt-1 text-sm text-[#667085]">{{ quoteCardMeta(quote) }}</p>
            </div>
            <div class="text-right">
              <span class="inline-flex rounded-full border border-[#fda497] bg-[#fff8f7] px-3 py-1 text-xs font-semibold text-[#c92f13]">
                {{ quoteStatusLabel(quote) }}
              </span>
              <p class="mt-3 text-sm font-semibold text-[#101828]">{{ quotePriceLabel(quote) }}</p>
              <p class="mt-1 text-xs text-[#667085]">{{ quoteTurnaroundLabel(quote) }}</p>
            </div>
          </div>
          <div class="mt-4 flex flex-wrap gap-3">
            <BaseButton :to="clientQuoteActionTarget(quote)" variant="primary" size="sm">
              {{ hasResponse(quote) ? 'View quote' : 'Continue quote' }}
            </BaseButton>
          </div>
        </article>
      </div>
    </DashboardSection>

    <DashboardSection v-else-if="section === 'jobs'" title="Client Jobs" subtitle="Follow progress, pay when due, and reopen specs for a fresh quote.">
      <div v-if="loading" class="grid gap-4">
        <div v-for="index in 3" :key="index" class="h-32 animate-pulse rounded-2xl border border-[#e4e7ec] bg-[#f9fafb]" />
      </div>

      <DashboardEmptyState
        v-else-if="!jobs.length"
        title="No jobs yet"
        description="Accepted quotes and paid jobs will appear here."
        action-label="View quotes"
        action-to="/dashboard/client/quotes"
      />

      <div v-else class="grid gap-4">
        <article v-for="job in jobs" :key="job.id" class="rounded-2xl border border-[#e4e7ec] bg-white p-5">
          <div class="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p class="text-xs font-semibold uppercase tracking-[0.18em] text-[#98a2b3]">{{ job.reference || `Job ${job.id}` }}</p>
              <h3 class="mt-2 text-lg font-semibold text-[#101828]">{{ job.title || 'Managed print job' }}</h3>
              <p class="mt-1 text-sm text-[#667085]">Updated {{ formatDate(job.updated_at) }}</p>
            </div>
            <div class="text-right">
              <p class="text-sm font-semibold text-[#101828]">{{ formatKes(job.pricing?.client_total) }}</p>
              <p class="mt-1 text-xs text-[#667085]">Payment: {{ startCase(job.payment_status || 'pending') }}</p>
              <p class="mt-1 text-xs text-[#667085]">Status: {{ startCase(job.status || 'pending') }}</p>
            </div>
          </div>
          <div class="mt-4 flex flex-wrap gap-3">
            <BaseButton :to="`/dashboard/client/jobs/${job.id}`" variant="primary" size="sm">View job</BaseButton>
            <BaseButton :to="`/dashboard/client/jobs/${job.id}`" variant="secondary" size="sm">
              {{ isPaymentReady(job) ? 'Pay now' : 'Track status' }}
            </BaseButton>
          </div>
        </article>
      </div>
    </DashboardSection>

    <DashboardSection v-else-if="section === 'payments'" title="Payments" subtitle="Client payment prompts and M-Pesa status updates.">
      <div v-if="loading" class="grid gap-4">
        <div v-for="index in 3" :key="index" class="h-28 animate-pulse rounded-2xl border border-[#e4e7ec] bg-[#f9fafb]" />
      </div>

      <DashboardEmptyState
        v-else-if="!payments.length"
        title="No payment prompts yet"
        description="Payment requests will appear here when a managed job is ready for M-Pesa."
        action-label="Open quotes"
        action-to="/dashboard/client/quotes"
      />

      <div v-else class="grid gap-4">
        <article v-for="payment in payments" :key="payment.id" class="rounded-2xl border border-[#e4e7ec] bg-white p-5">
          <div class="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p class="text-xs font-semibold uppercase tracking-[0.18em] text-[#98a2b3]">{{ payment.reference || `Payment ${payment.id}` }}</p>
              <h3 class="mt-2 text-lg font-semibold text-[#101828]">{{ formatKes(payment.amount) }}</h3>
              <p class="mt-1 text-sm text-[#667085]">{{ startCase(payment.channel || 'M-Pesa') }}</p>
            </div>
            <div class="text-right">
              <span class="inline-flex rounded-full border border-[#d0d5dd] bg-[#f9fafb] px-3 py-1 text-xs font-semibold text-[#344054]">
                {{ startCase(payment.payment_status || 'pending') }}
              </span>
            </div>
          </div>
          <div class="mt-4 flex flex-wrap gap-3">
            <BaseButton v-if="payment.managed_job_id" :to="`/dashboard/client/jobs/${payment.managed_job_id}`" variant="primary" size="sm">Open job</BaseButton>
          </div>
        </article>
      </div>
    </DashboardSection>

    <DashboardSection v-else-if="section === 'reorders'" title="Reorders" subtitle="Fresh quotes only. Previous payments and managed jobs are never reused.">
      <DashboardEmptyState
        title="Reorder is coming soon"
        description="Use a completed job or quote detail to copy specs back into the calculator when those specs are available."
        action-label="Open jobs"
        action-to="/dashboard/client/jobs"
      />
    </DashboardSection>

    <DashboardSection v-else :title="sectionTitle" subtitle="Client dashboard section">
      <DashboardEmptyState
        title="Section unavailable"
        description="This client route does not have a dedicated view yet."
        action-label="Back to client dashboard"
        action-to="/dashboard/client"
      />
    </DashboardSection>
  </RoleDashboardFrame>
</template>

<script setup lang="ts">
import BaseAlert from '~/components/base/BaseAlert.vue'
import BaseButton from '~/components/base/BaseButton.vue'
import DashboardEmptyState from '~/components/dashboard/DashboardEmptyState.vue'
import DashboardSection from '~/components/dashboard/DashboardSection.vue'
import RoleDashboardFrame from '~/components/dashboard/RoleDashboardFrame.vue'
import { useDashboardApi } from '~/services/dashboard'
import { fetchClientQuoteRequests } from '~/services/quotes'
import { getApiErrorMessage, normalizeApiList } from '~/shared/api'

definePageMeta({ layout: false, middleware: 'auth' })

const auth = useAuthStore()
const { fetchDashboardSection } = useDashboardApi()
if (!auth.canAccessClientDashboard) {
  await navigateTo(auth.homeRoute)
}

const route = useRoute()
const section = computed(() => String(route.params.section || 'quotes'))
const quoteTab = ref<'waiting' | 'responded'>('waiting')
const displayName = computed(() => auth.user?.name || auth.user?.email || 'Client')
const initials = computed(() => displayName.value.split(' ').map(part => part[0]).join('').slice(0, 2).toUpperCase() || 'CL')
const loading = ref(true)
const pageError = ref('')
const quotes = ref<Array<Record<string, any>>>([])
const jobs = ref<Array<Record<string, any>>>([])
const payments = ref<Array<Record<string, any>>>([])

const sectionTitleMap: Record<string, string> = {
  quotes: 'Client Quotes',
  jobs: 'Client Jobs',
  payments: 'Client Payments',
  reorders: 'Client Reorders',
}
const sectionTitle = computed(() => sectionTitleMap[section.value] || 'Client Section')

async function loadSection() {
  loading.value = true
  pageError.value = ''

  try {
    if (section.value === 'quotes') {
      quotes.value = normalizeApiList(await fetchClientQuoteRequests())
      jobs.value = []
      payments.value = []
    } else if (section.value === 'jobs') {
      const payload = await fetchDashboardSection('client', 'jobs')
      jobs.value = normalizeApiList(payload?.results || [])
      quotes.value = []
      payments.value = []
    } else if (section.value === 'payments') {
      const payload = await fetchDashboardSection('client', 'payments')
      payments.value = normalizeApiList(payload?.results || [])
      quotes.value = []
      jobs.value = []
    } else {
      quotes.value = []
      jobs.value = []
      payments.value = []
    }
  } catch (error: unknown) {
    pageError.value = getApiErrorMessage(error, 'Client dashboard section is unavailable right now.')
  } finally {
    loading.value = false
  }
}

await loadSection()
watch(section, async () => {
  quoteTab.value = 'waiting'
  await loadSection()
})

const waitingQuotes = computed(() => quotes.value.filter(quote => !hasResponse(quote)))
const respondedQuotes = computed(() => quotes.value.filter(quote => hasResponse(quote)))
const filteredQuotes = computed(() => quoteTab.value === 'responded' ? respondedQuotes.value : waitingQuotes.value)

const navItems = computed(() => [
  { label: 'Overview', to: '/dashboard/client' },
  { label: 'Quotes', to: '/dashboard/client/quotes', active: section.value === 'quotes' },
  { label: 'Jobs', to: '/dashboard/client/jobs', active: section.value === 'jobs' },
  { label: 'Payments', to: '/dashboard/client/payments', active: section.value === 'payments' },
  { label: 'Reorders', to: '/dashboard/client/reorders', active: section.value === 'reorders' },
])

function hasResponse(quote: Record<string, any>) {
  return Boolean(quote.latest_response?.id || quote.latest_response?.total || String(quote.status || '').toLowerCase().includes('respond'))
}

function clientQuoteActionTarget(quote: Record<string, any>) {
  if (quote?.id) {
    return `/dashboard/client/quotes/${quote.id}`
  }
  return hasResponse(quote) ? '/dashboard/client/quotes' : '/dashboard/client?pendingQuote=1'
}

function quoteStatusLabel(quote: Record<string, any>) {
  return quote.latest_response?.status_label || startCase(quote.status || 'pending')
}

function quotePriceLabel(quote: Record<string, any>) {
  return formatKes(quote.latest_response?.total)
}

function quoteTurnaroundLabel(quote: Record<string, any>) {
  return quote.latest_response?.turnaround_label || `Requested ${formatDate(quote.created_at)}`
}

function quoteCardTitle(quote: Record<string, any>) {
  const snapshot = normalizeRequestSnapshot(quote.request_snapshot)
  const product = snapshot.product_label || snapshot.product_type || snapshot.product_type_label || 'Print quote'
  const quantity = snapshot.quantity ? `${Number(snapshot.quantity).toLocaleString('en-KE')} pcs` : ''
  return [startCase(product), quantity].filter(Boolean).join(' - ')
}

function quoteCardMeta(quote: Record<string, any>) {
  const snapshot = normalizeRequestSnapshot(quote.request_snapshot)
  const parts = [
    snapshot.finished_size || snapshot.size_label || snapshot.size,
    snapshot.paper_label || snapshot.paper_stock,
    `Requested ${formatDate(quote.created_at)}`,
  ].filter(Boolean)
  return parts.join(' • ')
}

function isPaymentReady(job: Record<string, any>) {
  return ['pending', 'initiated', 'unpaid'].includes(String(job.payment_status || '').toLowerCase())
}

function formatDate(value: unknown) {
  if (!value) {
    return 'recently'
  }
  const date = new Date(String(value))
  if (Number.isNaN(date.getTime())) {
    return 'recently'
  }
  return new Intl.DateTimeFormat('en-KE', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(date)
}

function formatKes(value: unknown) {
  const amount = Number(value)
  if (!Number.isFinite(amount) || amount <= 0) {
    return 'Final price pending'
  }
  return `KES ${amount.toLocaleString('en-KE', { maximumFractionDigits: 2 })}`
}

function startCase(value: unknown) {
  return String(value || 'pending')
    .replace(/[_-]+/g, ' ')
    .replace(/\b\w/g, char => char.toUpperCase())
}

function normalizeRequestSnapshot(snapshot: unknown) {
  if (!snapshot || typeof snapshot !== 'object') {
    return {}
  }
  const value = snapshot as Record<string, any>
  return value.request_snapshot && typeof value.request_snapshot === 'object'
    ? value.request_snapshot
    : value
}
</script>
