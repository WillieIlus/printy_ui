<script setup lang="ts">
import { callWithNuxt } from '#app'
import BaseAlert from '~/components/base/BaseAlert.vue'
import BaseBadge from '~/components/base/BaseBadge.vue'
import BaseButton from '~/components/base/BaseButton.vue'
import BaseStatCard from '~/components/base/BaseStatCard.vue'
import BaseTable from '~/components/base/BaseTable.vue'
import DashboardCardGrid from '~/components/dashboard/DashboardCardGrid.vue'
import DashboardEmptyState from '~/components/dashboard/DashboardEmptyState.vue'
import DashboardPageHeader from '~/components/dashboard/DashboardPageHeader.vue'
import DashboardSection from '~/components/dashboard/DashboardSection.vue'
import StatusBadge from '~/components/dashboard/StatusBadge.vue'
import RoleDashboardFrame from '~/components/dashboard/RoleDashboardFrame.vue'
import { printyStatusLabel, type PrintyBadgeVariant } from '~/constants/design'
import { getApiErrorMessage } from '~/shared/api'
import { useDashboardApi } from '~/services/dashboard'

definePageMeta({
  layout: false,
  middleware: 'auth',
})

useHead({
  title: 'Printy - Partner Dashboard',
})

const nuxtApp = useNuxtApp()
const auth = useAuthStore()
const { fetchDashboardHome } = useDashboardApi()
if (!auth.canAccessPartnerDashboard) {
  await callWithNuxt(nuxtApp, navigateTo, [auth.homeRoute])
}

const loading = ref(true)
const pageError = ref('')
const payload = ref<Record<string, any>>({})

onMounted(async () => {
  try {
    payload.value = await fetchDashboardHome('partner')
  } catch (error: unknown) {
    pageError.value = getApiErrorMessage(error, 'Partner dashboard data is unavailable right now.')
  } finally {
    loading.value = false
  }
})

const displayName = computed(() => auth.user?.name || auth.user?.email || 'Partner')
const firstName = computed(() => displayName.value.split(' ')[0] || 'there')
const initials = computed(() => displayName.value.split(' ').map(part => part[0]).join('').slice(0, 2).toUpperCase() || 'PT')
const stats = computed(() => payload.value.stats || {})
const jobs = computed(() => Array.isArray(payload.value.recent_jobs) ? payload.value.recent_jobs : [])
const quoteRequests = computed(() => Array.isArray(payload.value.quote_requests) ? payload.value.quote_requests : [])
const hasTaskQueueItems = computed(() => taskGroups.value.some(group => group.items.length > 0))

const taskGroups = computed(() => [
  {
    key: 'action-required',
    title: 'Action required',
    subtitle: 'New requests and paid work that can move now.',
    items: [
      ...quoteRequests.value
        .filter(row => isNewQuoteRequest(row))
        .map(row => taskFromQuote(row, 'Needs quote', 'Prepare quote', 'yellow')),
      ...jobs.value
        .filter(row => isPaidAwaitingDispatch(row))
        .map(row => taskFromJob(row, 'Paid - dispatch now', 'Confirm dispatch', 'green')),
      ...jobs.value
        .filter(row => isProofAwaitingApproval(row))
        .map(row => taskFromJob(row, 'Proof needs approval', 'Review proof', 'yellow')),
    ],
  },
  {
    key: 'waiting-client',
    title: 'Waiting on client',
    subtitle: 'Sent quotes, accepted quotes, or payment follow-up.',
    items: quoteRequests.value
      .filter(row => isWaitingOnClient(row))
      .map(row => taskFromQuote(row, quoteStatusLabel(row), 'Follow up', 'default')),
  },
  {
    key: 'in-production',
    title: 'In production',
    subtitle: 'Paid jobs already with the production workflow.',
    items: jobs.value
      .filter(row => isInProduction(row))
      .map(row => taskFromJob(row, 'In production', 'Track job', 'blue')),
  },
  {
    key: 'recently-completed',
    title: 'Recently completed',
    subtitle: 'Closed work from the last few days when timestamps are available.',
    items: jobs.value
      .filter(row => isRecentlyCompleted(row))
      .slice(0, 7)
      .map(row => taskFromJob(row, 'Completed', 'View job', 'green')),
  },
].filter(group => group.items.length > 0))

const navItems = computed(() => [
  { label: 'Partner Dashboard', to: '/dashboard/partner', active: true },
  { label: 'Quotes', to: '/dashboard/partner/quotes' },
  { label: 'Rate Card', to: '/dashboard/partner/rate-card' },
  { label: 'Messages', to: '/dashboard/partner/messages' },
])

const statCards = computed(() => [
  {
    label: 'Active Clients',
    value: stats.value.active_clients ?? 0,
    meta: 'Distinct client portfolio',
    accent: 'orange' as const,
    icon: '<svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2m10 2v-2M12 12a5 5 0 100-10 5 5 0 000 10z" /></svg>',
  },
  {
    label: 'Managed Jobs',
    value: stats.value.managed_jobs ?? 0,
    meta: 'Partner-owned commercial jobs',
    accent: 'blue' as const,
    icon: '<svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M4 7h16M4 12h16M4 17h10" /></svg>',
  },
  {
    label: 'Awaiting Client Payment',
    value: stats.value.awaiting_client_payment ?? 0,
    meta: 'Read-only payment follow-up',
    accent: 'amber' as const,
    icon: '<svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 8c-2.21 0-4 1.343-4 3s1.79 3 4 3 4 1.343 4 3-1.79 3-4 3m0-12V5m0 14v-2" /></svg>',
  },
])

const jobColumns = [
  { key: 'reference', label: 'Reference' },
  { key: 'client_name', label: 'Client' },
  { key: 'client_total', label: 'Client Total' },
  { key: 'payment_status', label: 'Payment' },
  { key: 'assigned_shop_name', label: 'Assigned Shop' },
]

const quoteColumns = [
  { key: 'reference', label: 'Reference' },
  { key: 'customer_name', label: 'Client' },
  { key: 'shop_name', label: 'Shop' },
  { key: 'status', label: 'Status' },
]

function taskFromQuote(row: Record<string, any>, status: string, action: string, badgeVariant: PrintyBadgeVariant) {
  const id = row.quote_request_id || row.id
  return {
    id: id || row.reference || row.request_reference,
    title: row.reference || row.request_reference || `Quote request #${id}`,
    meta: row.customer_name || row.client_name || 'Client not named yet',
    detail: row.shop_name || productLabel(row) || 'Production source pending',
    status,
    action,
    badgeVariant,
    to: id ? `/dashboard/partner/quotes/${id}` : '/dashboard/partner/quotes',
  }
}

function taskFromJob(row: Record<string, any>, status: string, action: string, badgeVariant: PrintyBadgeVariant) {
  const quoteId = row.quote_request_id || row.quote_id
  return {
    id: row.id || quoteId || row.reference,
    title: row.reference || row.job_reference || `Job #${row.id || quoteId}`,
    meta: row.client_name || row.customer_name || 'Client job',
    detail: row.assigned_shop_name || row.shop_name || printyStatusLabel(row.payment_status || row.status || 'active'),
    status,
    action,
    badgeVariant,
    to: quoteId ? `/dashboard/partner/quotes/${quoteId}` : '/dashboard/partner/jobs',
  }
}

function productLabel(row: Record<string, any>) {
  const snapshot = row.request_snapshot || row.latest_response?.response_snapshot || {}
  return snapshot.product_label || snapshot.product_type || row.product || ''
}

function normalizedStatus(value: unknown) {
  return String(value || '').toLowerCase().replace(/\s+/g, '_')
}

function isNewQuoteRequest(row: Record<string, any>) {
  const status = normalizedStatus(row.status)
  return !row.latest_response?.id || ['new', 'submitted', 'draft', 'pending', 'assigned'].includes(status)
}

function isWaitingOnClient(row: Record<string, any>) {
  const status = normalizedStatus(row.status)
  return ['sent', 'awaiting_response', 'accepted', 'approved', 'awaiting_payment'].includes(status) || Boolean(row.latest_response?.id && !row.managed_job?.id)
}

function isPaidAwaitingDispatch(row: Record<string, any>) {
  const payment = normalizedStatus(row.payment_status)
  const assignment = normalizedStatus(row.assignment_status)
  const jobStatus = normalizedStatus(row.status)
  return ['confirmed', 'release_ready', 'paid'].includes(payment)
    && !row.dispatched_at
    && !['assignment_pending', 'assigned', 'accepted'].includes(assignment)
    && !['completed', 'delivered'].includes(jobStatus)
}

function isProofAwaitingApproval(row: Record<string, any>) {
  return ['manager_review', 'proof_uploaded'].includes(normalizedStatus(row.latest_proof_status || row.proof_status))
}

function isInProduction(row: Record<string, any>) {
  const assignment = normalizedStatus(row.assignment_status)
  const jobStatus = normalizedStatus(row.status)
  return Boolean(row.dispatched_at)
    || ['assignment_pending', 'assigned', 'accepted'].includes(assignment)
    || ['in_production', 'printing', 'proofing'].includes(jobStatus)
}

function isRecentlyCompleted(row: Record<string, any>) {
  const jobStatus = normalizedStatus(row.status)
  if (!['completed', 'delivered'].includes(jobStatus)) return false
  const completedAt = row.completed_at || row.delivered_at || row.updated_at
  if (!completedAt) return true
  const completedTime = new Date(String(completedAt)).getTime()
  if (Number.isNaN(completedTime)) return true
  return Date.now() - completedTime <= 7 * 24 * 60 * 60 * 1000
}

function quoteStatusLabel(row: Record<string, any>) {
  const status = normalizedStatus(row.status)
  if (['accepted', 'approved'].includes(status)) return 'Accepted - awaiting payment'
  if (status === 'awaiting_payment') return printyStatusLabel('awaiting_payment', 'payment')
  return printyStatusLabel(row.status || 'sent', 'quote')
}

</script>

<template>
  <main class="min-h-screen bg-slate-50 px-6 py-8">
    <section class="mx-auto max-w-7xl rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <p class="text-sm font-semibold uppercase tracking-[0.2em] text-purple-600">Partner dashboard</p>
      <h1 class="mt-3 text-2xl font-bold text-slate-900">Welcome, {{ firstName }}</h1>
      <p v-if="pageError" class="mt-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">{{ pageError }}</p>
      <p v-else-if="loading" class="mt-4 text-sm text-slate-500">Loading partner dashboard...</p>
      <p v-else class="mt-4 text-sm text-slate-600">You have {{ jobs.length }} recent jobs and {{ quoteRequests.length }} quote requests.</p>
    </section>
  </main>
</template>
