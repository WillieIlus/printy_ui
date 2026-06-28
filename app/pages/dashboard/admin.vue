
<script setup lang="ts">
import BaseAlert from '~/components/base/BaseAlert.vue'
import BaseBadge from '~/components/base/BaseBadge.vue'
import BaseButton from '~/components/base/BaseButton.vue'
import BaseCard from '~/components/base/BaseCard.vue'
import BaseStatCard from '~/components/base/BaseStatCard.vue'
import BaseTable from '~/components/base/BaseTable.vue'
import DashboardCardGrid from '~/components/dashboard/DashboardCardGrid.vue'
import DashboardPageHeader from '~/components/dashboard/DashboardPageHeader.vue'
import DashboardSection from '~/components/dashboard/DashboardSection.vue'
import RoleDashboardFrame from '~/components/dashboard/RoleDashboardFrame.vue'
import { useDashboardApi } from '~/services/dashboard'
import { getApiErrorMessage } from '~/shared/api'
import type { AdminDashboardResponse, AdminKpiCard } from '~/shared/types'

definePageMeta({
  layout: false,
  middleware: 'auth',
})

useHead({
  title: 'Printy - Super Admin Dashboard',
})

const auth = useAuthStore()
const { fetchAdminDashboard } = useDashboardApi()
if (!auth.canAccessAdminDashboard) {
  await navigateTo(auth.homeRoute)
}

const loading = ref(true)
const pageError = ref('')
const payload = ref<AdminDashboardResponse | null>(null)
const selectedComparison = ref('day')

try {
  payload.value = await fetchAdminDashboard()
} catch (error: unknown) {
  pageError.value = getApiErrorMessage(error, 'Admin dashboard data is unavailable right now.')
} finally {
  loading.value = false
}

const runtimeConfig = useRuntimeConfig()
const displayName = computed(() => auth.user?.name || auth.user?.email || 'Super Admin')
const initials = computed(() => displayName.value.split(' ').map(part => part[0]).join('').slice(0, 2).toUpperCase() || 'SA')
const environmentLabel = computed(() => import.meta.dev ? 'development' : String(runtimeConfig.public?.siteEnv || 'production'))
const headerSubtitle = computed(() => {
  const generatedAt = payload.value?.generated_at ? new Date(payload.value.generated_at) : new Date()
  return `${generatedAt.toLocaleString()} · ${payload.value?.timezone || 'Africa/Nairobi'}`
})

const navItems = computed(() => [
  { label: 'Overview', to: '/dashboard/admin', active: true },
  { label: 'Revenue', to: '/dashboard/admin', disabled: true },
  { label: 'MPESA', to: '/dashboard/admin', disabled: true },
  { label: 'Quotes', to: '/dashboard/admin', disabled: true },
  { label: 'Jobs', to: '/dashboard/admin', disabled: true },
  { label: 'Clients', to: '/dashboard/admin', disabled: true },
  { label: 'Partners', to: '/dashboard/admin', disabled: true },
  { label: 'Production Shops', to: '/dashboard/admin', disabled: true },
  { label: 'Samples', to: '/dashboard/admin', disabled: true },
  { label: 'Pricing', to: '/dashboard/admin', disabled: true },
  { label: 'System Health', to: '/dashboard/admin', disabled: true },
  { label: 'Settings', to: '/dashboard/admin', disabled: true },
])

const comparisonOptions = [
  { key: 'hour', label: 'Hour' },
  { key: 'three_hours', label: '3h' },
  { key: 'six_hours', label: '6h' },
  { key: 'twelve_hours', label: '12h' },
  { key: 'day', label: 'Today' },
  { key: 'week', label: 'Week' },
  { key: 'month', label: 'Month' },
]

function toNumber(value: unknown) {
  if (typeof value === 'number') {
    return value
  }
  if (typeof value === 'string' && value.trim()) {
    const parsed = Number(value)
    return Number.isFinite(parsed) ? parsed : null
  }
  return null
}

function formatCount(value: unknown) {
  const numeric = toNumber(value)
  if (numeric === null) {
    return 'Unavailable'
  }
  return new Intl.NumberFormat('en-KE').format(numeric)
}

function formatKes(value: unknown) {
  const numeric = toNumber(value)
  if (numeric === null) {
    return 'Unavailable'
  }
  return new Intl.NumberFormat('en-KE', {
    style: 'currency',
    currency: 'KES',
    maximumFractionDigits: 2,
  }).format(numeric)
}

function resolveMetricComparison(metricKey: string, comparisonKey: string) {
  return payload.value?.metrics?.[metricKey]?.comparisons?.[comparisonKey]
}

function comparisonBadge(metricKey: string, comparisonKey: string) {
  const comparison = resolveMetricComparison(metricKey, comparisonKey)
  if (!comparison) {
    return 'No comparison'
  }
  if (comparison.percent_change === null || comparison.current_value === null) {
    return 'Unavailable'
  }
  const percent = toNumber(comparison.percent_change)
  if (percent === null) {
    return comparison.helper_text
  }
  const sign = percent > 0 ? '+' : ''
  return `${sign}${percent}%`
}

function metricBadgeVariant(metricKey: string, comparisonKey: string) {
  const trend = resolveMetricComparison(metricKey, comparisonKey)?.trend
  if (trend === 'up') return 'green' as const
  if (trend === 'down') return 'red' as const
  return 'gray' as const
}

const kpiAccentMap: Record<string, 'orange' | 'amber' | 'green' | 'blue' | 'slate'> = {
  gross_client_revenue: 'green',
  confirmed_mpesa_payments: 'blue',
  quote_requests: 'orange',
  active_jobs: 'amber',
  production_shops: 'slate',
  pending_callbacks: 'amber',
  samples_paid: 'slate',
  platform_margin: 'green',
}

const kpiIconMap: Record<string, string> = {
  gross_client_revenue: '<svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 8c-2.21 0-4 1.343-4 3s1.79 3 4 3 4 1.343 4 3-1.79 3-4 3m0-12V5m0 14v-2" /></svg>',
  confirmed_mpesa_payments: '<svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><rect x="2" y="5" width="20" height="14" rx="2" /><path stroke-linecap="round" stroke-linejoin="round" d="M2 10h20" /></svg>',
  quote_requests: '<svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M8 10h8M8 14h6M5 3h14a2 2 0 012 2v14l-4-3H5a2 2 0 01-2-2V5a2 2 0 012-2z" /></svg>',
  active_jobs: '<svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M4 7h16M4 12h16M4 17h10" /></svg>',
  production_shops: '<svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M3 10l9-7 9 7v10a1 1 0 01-1 1h-5v-6H9v6H4a1 1 0 01-1-1V10z" /></svg>',
  pending_callbacks: '<svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9" /><path stroke-linecap="round" stroke-linejoin="round" d="M12 7v5l3 3" /></svg>',
  samples_paid: '<svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M7 7h10v10H7z" /></svg>',
  platform_margin: '<svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M5 12l5 5L20 7" /></svg>',
}

const kpiCards = computed(() => (payload.value?.kpis || []).map((card: AdminKpiCard) => {
  const comparison = resolveMetricComparison(card.metric_key, card.comparison_key || selectedComparison.value) || resolveMetricComparison(card.metric_key, selectedComparison.value)
  const isMoney = card.key.includes('revenue') || card.key.includes('margin')
  return {
    key: card.key,
    label: card.label,
    displayValue: isMoney ? formatKes(card.value) : formatCount(card.value),
    meta: comparison?.helper_text || card.helper_text,
    badge: comparison?.label || comparisonOptions.find(option => option.key === selectedComparison.value)?.label || 'Selected period',
    accent: kpiAccentMap[card.key] || 'slate',
    icon: kpiIconMap[card.key] || '',
  }
}))

const comparisonPanels = computed(() => [
  {
    key: 'users',
    label: 'New signups',
    ...formatComparisonPanel('users'),
  },
  {
    key: 'quote_requests',
    label: 'Quote requests',
    ...formatComparisonPanel('quote_requests'),
  },
  {
    key: 'confirmed_payments',
    label: 'Confirmed payments',
    ...formatComparisonPanel('confirmed_payments'),
  },
])

function formatComparisonPanel(metricKey: string) {
  const comparison = resolveMetricComparison(metricKey, selectedComparison.value)
  if (!comparison) {
    return {
      currentValue: 'Unavailable',
      previousValue: 'Unavailable',
      changeLabel: 'No data',
      helperText: 'No comparison data returned.',
      badgeVariant: 'gray' as const,
    }
  }
  return {
    currentValue: formatCount(comparison.current_value),
    previousValue: formatCount(comparison.previous_value),
    changeLabel: comparisonBadge(metricKey, selectedComparison.value),
    helperText: comparison.helper_text,
    badgeVariant: metricBadgeVariant(metricKey, selectedComparison.value),
  }
}

function statValue(value: unknown, kind: 'count' | 'money' = 'count') {
  return kind === 'money' ? formatKes(value) : formatCount(value)
}

const revenueSummary = computed(() => payload.value?.summaries?.revenue || {})
const revenueCards = computed(() => [
  { label: 'Client revenue', value: statValue(revenueSummary.value.gross_client_revenue, 'money'), meta: 'Gross client totals', accent: 'green' as const },
  { label: 'Production base cost', value: statValue(revenueSummary.value.production_base_cost, 'money'), meta: 'Modeled production totals', accent: 'slate' as const },
  { label: 'Broker margin', value: statValue(revenueSummary.value.broker_margin, 'money'), meta: 'Broker commission fields', accent: 'blue' as const },
  { label: 'Platform fee', value: statValue(revenueSummary.value.platform_service_fee, 'money'), meta: 'Service margin tracked in jobs', accent: 'green' as const },
  { label: 'Unpaid revenue', value: statValue(revenueSummary.value.unpaid_revenue, 'money'), meta: 'Pending or confirmation-pending jobs', accent: 'amber' as const },
  { label: 'Pending amount', value: statValue(revenueSummary.value.pending_amount, 'money'), meta: 'Outstanding payment rows', accent: 'amber' as const },
])

const paymentStatuses = computed(() => payload.value?.payments_monitor?.statuses || {})
const paymentStatusCards = computed(() => [
  { label: 'Initiated', value: statValue(paymentStatuses.value.initiated), meta: 'Created before callback', accent: 'blue' as const },
  { label: 'Pending callback', value: statValue(paymentStatuses.value.pending_callback), meta: 'Awaiting Safaricom callback', accent: 'amber' as const },
  { label: 'Confirmed', value: statValue(paymentStatuses.value.confirmed), meta: 'Confirmed job + subscription payments', accent: 'green' as const },
  { label: 'Failed', value: statValue(paymentStatuses.value.failed), meta: 'Failed payment outcomes', accent: 'orange' as const },
  { label: 'Cancelled', value: statValue(paymentStatuses.value.cancelled), meta: 'Cancelled payment attempts', accent: 'slate' as const },
  { label: 'Timeout', value: statValue(paymentStatuses.value.timeout), meta: 'Billing timeout strings only', accent: 'slate' as const },
])

const funnelRows = computed(() => (payload.value?.summaries?.funnel || []).map((stage) => ({
  key: String(stage.key || stage.label || Math.random()),
  label: String(stage.label || stage.key || 'Stage'),
  value: stage.value === null || stage.value === undefined ? 'Unavailable' : formatCount(stage.value),
  helper: String(stage.unavailable_reason || 'Tracked in the current backend.'),
})))

const productionSummary = computed(() => payload.value?.summaries?.production || {})
const productionCards = computed(() => [
  { label: 'Production shops', value: statValue(productionSummary.value.total_production_shops), meta: 'Total shops in system', accent: 'slate' as const },
  { label: 'Active pricing', value: statValue(productionSummary.value.shops_with_active_pricing), meta: 'Shops marked pricing-ready', accent: 'green' as const },
  { label: 'Missing pricing', value: statValue(productionSummary.value.shops_missing_pricing), meta: 'Needs rate-card attention', accent: 'amber' as const },
  { label: 'Pending jobs', value: statValue(productionSummary.value.shops_with_pending_jobs), meta: 'Shops with active production load', accent: 'blue' as const },
  { label: 'Delayed jobs', value: statValue(productionSummary.value.shops_with_delayed_jobs), meta: 'Assignments past due', accent: 'orange' as const },
  { label: 'Low stock', value: String(productionSummary.value.low_stock_warnings_unavailable_reason || 'Unavailable'), meta: 'No stock model exists yet', accent: 'slate' as const },
])

const partnerSummary = computed(() => payload.value?.summaries?.partners || {})
const partnerCards = computed(() => [
  { label: 'Active partners', value: statValue(partnerSummary.value.active_partners), meta: 'Canonical partner accounts', accent: 'blue' as const },
  { label: 'Quotes handled', value: statValue(partnerSummary.value.quotes_handled), meta: 'Managed jobs with a broker', accent: 'orange' as const },
  { label: 'Broker margin earned', value: statValue(partnerSummary.value.broker_margin_earned, 'money'), meta: 'Summed broker commission', accent: 'green' as const },
  { label: 'Pending broker payouts', value: statValue(partnerSummary.value.pending_broker_payouts), meta: 'Settlement rows still pending', accent: 'amber' as const },
])

const clientSummary = computed(() => payload.value?.summaries?.clients || {})
const clientCards = computed(() => [
  { label: 'New clients', value: statValue(clientSummary.value.new_clients_this_month), meta: 'This month', accent: 'blue' as const },
  { label: 'Returning clients', value: statValue(clientSummary.value.returning_clients), meta: 'Clients with multiple jobs', accent: 'green' as const },
  { label: 'Active quote drafts', value: statValue(clientSummary.value.active_quote_drafts), meta: 'Drafts not yet sent', accent: 'orange' as const },
  { label: 'Repeat orders', value: statValue(clientSummary.value.repeat_orders), meta: 'Clients with multiple managed jobs', accent: 'green' as const },
  { label: 'Abandoned drafts', value: statValue(clientSummary.value.abandoned_quote_drafts), meta: 'Drafts stale for 7+ days', accent: 'amber' as const },
])

const latestPayments = computed(() => payload.value?.tables?.latest_payments || [])
const latestQuotes = computed(() => payload.value?.tables?.latest_quotes || [])
const latestJobs = computed(() => payload.value?.tables?.latest_jobs || [])
const shopsNeedingAttention = computed(() => payload.value?.tables?.shops_needing_attention || [])
const recentUsers = computed(() => payload.value?.tables?.recent_users || [])

const quoteColumns = [
  { key: 'reference', label: 'Reference' },
  { key: 'customer_name', label: 'Client' },
  { key: 'shop_name', label: 'Shop' },
  { key: 'status', label: 'Status' },
]

const jobColumns = [
  { key: 'reference', label: 'Reference' },
  { key: 'assigned_shop_name', label: 'Assigned shop' },
  { key: 'status', label: 'Status' },
  { key: 'payment_status', label: 'Payment' },
]

const paymentColumns = [
  { key: 'reference', label: 'Reference' },
  { key: 'amount', label: 'Amount' },
  { key: 'status', label: 'Status' },
  { key: 'receipt_number', label: 'Receipt' },
  { key: 'phone', label: 'Phone' },
]

const shopColumns = [
  { key: 'name', label: 'Shop' },
  { key: 'pricing_ready', label: 'Pricing ready' },
  { key: 'public_match_ready', label: 'Public match' },
  { key: 'active_jobs', label: 'Active jobs' },
  { key: 'issue', label: 'Issue' },
]

const userColumns = [
  { key: 'name', label: 'User' },
  { key: 'email', label: 'Email' },
  { key: 'primary_role', label: 'Primary role' },
  { key: 'date_joined', label: 'Joined' },
]
</script>

<template>
  <main class="min-h-screen bg-slate-50 px-6 py-8">
    <section class="mx-auto max-w-7xl">
      <div class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <p class="text-sm font-semibold uppercase tracking-[0.2em] text-[#e13515]">Super Admin</p>
        <h1 class="mt-3 text-2xl font-bold text-slate-900">Printy dashboard</h1>
        <p class="mt-2 text-sm text-slate-600">{{ headerSubtitle }}</p>
        <p v-if="pageError" class="mt-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">{{ pageError }}</p>
        <p v-else-if="loading" class="mt-4 text-sm text-slate-500">Loading dashboard data...</p>
      </div>
    </section>
  </main>
</template>
