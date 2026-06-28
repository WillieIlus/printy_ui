<script setup lang="ts">
import { callWithNuxt } from '#app'
import BaseAlert from '~/components/base/BaseAlert.vue'
import BaseBadge from '~/components/base/BaseBadge.vue'
import BaseButton from '~/components/base/BaseButton.vue'
import BaseCard from '~/components/base/BaseCard.vue'
import BaseStatCard from '~/components/base/BaseStatCard.vue'
import BaseTable from '~/components/base/BaseTable.vue'
import DashboardCardGrid from '~/components/dashboard/DashboardCardGrid.vue'
import DashboardEmptyState from '~/components/dashboard/DashboardEmptyState.vue'
import DashboardPageHeader from '~/components/dashboard/DashboardPageHeader.vue'
import DashboardSection from '~/components/dashboard/DashboardSection.vue'
import StatusBadge from '~/components/dashboard/StatusBadge.vue'
import RoleDashboardFrame from '~/components/dashboard/RoleDashboardFrame.vue'
import { printyDueStatus, printyStatusBadgeVariant, printyStatusLabel, type PrintyBadgeVariant } from '~/constants/design'
import { getApiErrorMessage } from '~/shared/api'
import { useDashboardApi } from '~/services/dashboard'
import { useShopsApi } from '~/services/shops'

definePageMeta({
  layout: false,
  middleware: 'auth',
})

useHead({
  title: 'Printy - Production Dashboard',
})

const nuxtApp = useNuxtApp()
const auth = useAuthStore()
const router = useRouter()
const { fetchDashboardHome } = useDashboardApi()
const { fetchMyShops, fetchShopPricingSetup, listShopPapers } = useShopsApi()
if (!auth.canAccessProductionDashboard) {
  await callWithNuxt(nuxtApp, navigateTo, [auth.homeRoute])
}

const loading = ref(true)
const pageError = ref('')
const payload = ref<Record<string, any>>({})
const setupStatus = reactive({
  hasShop: false,
  hasPapers: false,
  hasPricing: false,
  completed: false,
})
const currentShopSlug = ref('')

function hasActivePricingRows(setup: Record<string, any> | null) {
  const paperRows = Array.isArray(setup?.paper_rows) ? setup.paper_rows : []
  const summary = setup?.summary as Record<string, any> | null | undefined
  return paperRows.some((row: Record<string, any>) => Boolean(row?.active))
    || Number(summary?.paper_rows_added ?? 0) > 0
    || Number(summary?.pricing_items_added ?? 0) > 0
    || Number(summary?.products_unlocked ?? 0) > 0
}

onMounted(async () => {
  try {
    const shops = await fetchMyShops()
    const currentShop = shops.find(shop => shop?.is_active !== false) || shops[0] || null
    currentShopSlug.value = currentShop?.slug || ''

    if (currentShopSlug.value) {
      const [setup, papers] = await Promise.all([
        fetchShopPricingSetup(currentShopSlug.value),
        listShopPapers(currentShopSlug.value),
      ])
      setupStatus.hasShop = true
      setupStatus.hasPapers = papers.some(item => item.is_active !== false)
      setupStatus.hasPricing = hasActivePricingRows(setup)
      setupStatus.completed = Boolean(setup.completed)
    }

    if (!(!setupStatus.completed && (!setupStatus.hasShop || !setupStatus.hasPapers || !setupStatus.hasPricing))) {
      payload.value = await fetchDashboardHome('production')
    }
  } catch (error: unknown) {
    pageError.value = getApiErrorMessage(error, 'Production dashboard data is unavailable right now.')
  } finally {
    loading.value = false
  }
})

const displayName = computed(() => auth.user?.name || auth.user?.email || 'Production')
const firstName = computed(() => displayName.value.split(' ')[0] || 'there')
const initials = computed(() => displayName.value.split(' ').map(part => part[0]).join('').slice(0, 2).toUpperCase() || 'PD')
const stats = computed(() => payload.value.stats || {})
const assignments = computed(() => Array.isArray(payload.value.assignments) ? payload.value.assignments : [])
const queue = computed(() => Array.isArray(payload.value.queue) ? payload.value.queue : [])
const queueItems = computed(() => assignments.value.map(buildQueueItem))
const hasQueueItems = computed(() => queueGroups.value.some(group => group.items.length > 0))
const queueGroups = computed(() => [
  {
    key: 'needs-attention',
    title: 'Needs Attention',
    subtitle: 'Proof rejected, files missing, or shop action required.',
    badgeVariant: 'red' as PrintyBadgeVariant,
    items: queueItems.value.filter(item => item.stage === 'needs-attention'),
  },
  {
    key: 'ready-to-print',
    title: 'Ready to Print',
    subtitle: 'Paid work with files available and no production block.',
    badgeVariant: 'yellow' as PrintyBadgeVariant,
    items: queueItems.value.filter(item => item.stage === 'ready-to-print'),
  },
  {
    key: 'in-progress',
    title: 'In Progress',
    subtitle: 'Jobs actively being printed or finished.',
    badgeVariant: 'blue' as PrintyBadgeVariant,
    items: queueItems.value.filter(item => item.stage === 'in-progress'),
  },
  {
    key: 'incoming',
    title: 'Incoming',
    subtitle: 'Dispatched to your shop but not started yet.',
    badgeVariant: 'default' as PrintyBadgeVariant,
    items: queueItems.value.filter(item => item.stage === 'incoming'),
  },
  {
    key: 'completed',
    title: 'Completed',
    subtitle: 'Finished jobs from the recent production queue.',
    badgeVariant: 'green' as PrintyBadgeVariant,
    items: queueItems.value.filter(item => item.stage === 'completed').slice(0, 7),
  },
].filter(group => group.items.length > 0))
const showSetupPrompt = computed(() => !setupStatus.completed && (!setupStatus.hasShop || !setupStatus.hasPapers || !setupStatus.hasPricing))
const setupPromptTitle = computed(() => {
  if (!setupStatus.hasShop) return 'Your print shop is not set up yet.'
  if (!setupStatus.hasPapers) return 'Add your first paper stock.'
  if (!setupStatus.hasPricing) return 'Add your printing prices.'
  return 'Your setup is still incomplete.'
})
const setupPromptCopy = computed(() => {
  if (!setupStatus.hasShop) return 'Create your shop profile first so Printy can attach stock, pricing, and finishing rules to a real production account.'
  if (!setupStatus.hasPapers) return 'Paper stock is still empty. Add at least one active stock row so Printy knows what your shop can physically produce.'
  if (!setupStatus.hasPricing) return 'Production pricing is still missing. Add your raw shop prices so Printy can calculate downstream market/client totals.'
  return 'Finish your setup to unlock capability preview and job readiness.'
})
const setupShortcutRoute = computed(() => {
  if (!setupStatus.hasShop) return '/dashboard/production/onboarding?step=shop'
  if (!setupStatus.hasPapers) return '/dashboard/production/onboarding?step=paper-stock'
  if (!setupStatus.hasPricing) return '/dashboard/production/onboarding?step=pricing'
  return '/dashboard/production/onboarding'
})

const navItems = computed(() => [
  { label: 'Production Dashboard', to: '/dashboard/production', active: true },
  { label: 'Onboarding', to: '/dashboard/production/onboarding' },
  { label: 'Assignments', to: '/dashboard/production/jobs' },
  { label: 'Paper', to: '/dashboard/production/paper-stock' },
  { label: 'Pricing', to: '/dashboard/production/pricing' },
  { label: 'Finishings', to: '/dashboard/production/finishings' },
  { label: 'Messages', to: '/dashboard/production/messages' },
])

const statCards = computed(() => [
  {
    label: 'Incoming Assignments',
    value: stats.value.incoming_assignments ?? 0,
    meta: 'Need acceptance or review',
    accent: 'orange' as const,
    icon: '<svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M8 7V3m8 4V3m-9 8h10m-12 9h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v11a2 2 0 002 2z" /></svg>',
  },
  {
    label: 'In Production',
    value: stats.value.in_production ?? 0,
    meta: 'Active print floor work',
    accent: 'green' as const,
    icon: '<svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M6 9V3h12v6M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2M6 14h12v7H6v-7z" /></svg>',
  },
  {
    label: 'Payment Holds',
    value: stats.value.payment_holds ?? 0,
    meta: 'Work blocked until payment clears',
    accent: 'amber' as const,
    icon: '<svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3m0 4h.01M10.29 3.86l-7.17 12.42A2 2 0 004.83 19h14.34a2 2 0 001.71-2.72L13.71 3.86a2 2 0 00-3.42 0z" /></svg>',
  },
])

const assignmentColumns = [
  { key: 'reference', label: 'Reference' },
  { key: 'status', label: 'Assignment' },
  { key: 'managed_job_status', label: 'Job Status' },
  { key: 'payment_status', label: 'Payment' },
  { key: 'priority', label: 'Priority' },
]

const queueColumns = [
  { key: 'reference', label: 'Reference' },
  { key: 'title', label: 'Job' },
  { key: 'status', label: 'Status' },
  { key: 'payment_status', label: 'Payment' },
  { key: 'assignment_status', label: 'Assignment' },
]

function buildQueueItem(row: Record<string, any>) {
  const status = normalizedStatus(row.status || row.assignment_status)
  const proofStatus = normalizedStatus(row.latest_proof_status || row.proof_status)
  const fileMissing = row.artwork_available === false || row.files_available === false || row.artwork_missing === true
  const completed = ['ready', 'completed', 'delivered'].includes(status)
  const stage = queueStage(status, proofStatus, fileMissing, row)
  const urgency = printyDueStatus(row.requested_deadline || row.due_at || row.deadline)
  return {
    id: row.id || row.managed_job_id || row.reference,
    reference: row.reference || row.managed_reference || `Assignment ${row.id || ''}`.trim(),
    title: row.title || row.job_title || row.product_label || 'Production job',
    specSummary: specSummary(row),
    dueLabel: urgency.label,
    urgencyClass: urgency.className,
    fileLabel: fileMissing ? 'Files missing' : 'Files available',
    proofLabel: printyStatusLabel(proofStatus || 'needed', 'proof'),
    statusLabel: printyStatusLabel(row.status || row.assignment_status || stage, 'production'),
    statusVariant: printyStatusBadgeVariant(row.status || row.assignment_status || stage, 'production'),
    nextAction: nextActionLabel(status, proofStatus, fileMissing),
    secondary: row.priority ? `Priority: ${printyStatusLabel(row.priority)}` : 'Production-safe details only',
    completed,
    stage,
    to: `/dashboard/production/assignments/${row.id}`,
  }
}

function queueStage(status: string, proofStatus: string, fileMissing: boolean, row: Record<string, any>) {
  if (proofStatus === 'revision_requested' || fileMissing || row.action_required) return 'needs-attention'
  if (['in_production', 'finishing'].includes(status)) return 'in-progress'
  if (['ready', 'completed', 'delivered'].includes(status)) return 'completed'
  if (['accepted'].includes(status) && row.payment_confirmed !== false) return 'ready-to-print'
  return 'incoming'
}

function normalizedStatus(value: unknown) {
  return String(value || '').toLowerCase().replace(/[\s-]+/g, '_')
}

function nextActionLabel(status: string, proofStatus: string, fileMissing: boolean) {
  if (fileMissing) return 'Review files'
  if (proofStatus === 'revision_requested') return 'Upload revised proof'
  if (status === 'pending' || status === 'assigned') return 'Review assignment'
  if (status === 'accepted') return 'Start production'
  if (status === 'in_production') return 'Upload proof'
  if (status === 'finishing') return 'Mark ready'
  return 'View details'
}

function specSummary(row: Record<string, any>) {
  const quantity = row.quantity || row.specs?.quantity
  const product = row.product_label || row.title || row.specs?.product || row.specs?.product_type
  const paper = row.paper_label || row.specs?.paper || row.paper
  return [quantity ? `${Number(quantity).toLocaleString('en-KE')} qty` : '', product, paper].filter(Boolean).join(' / ') || 'Specs in assignment'
}


function openAssignment(row: Record<string, any>) {
  const managedJobId = row.managed_job_id || row.id
  if (!managedJobId) {
    return
  }
  router.push(`/dashboard/production/jobs/${managedJobId}`)
}
</script>

<template>
  <main class="min-h-screen bg-slate-50 px-6 py-8">
    <section class="mx-auto max-w-7xl rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <p class="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-600">Production dashboard</p>
      <h1 class="mt-3 text-2xl font-bold text-slate-900">Welcome, {{ firstName }}</h1>
      <p v-if="pageError" class="mt-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">{{ pageError }}</p>
      <p v-else-if="loading" class="mt-4 text-sm text-slate-500">Loading production dashboard...</p>
      <p v-else class="mt-4 text-sm text-slate-600">Production workspace is ready.</p>
    </section>
  </main>
</template>
