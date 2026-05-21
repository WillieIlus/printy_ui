<template>
  <RoleDashboardFrame
    title="Production Dashboard"
    badge="Production"
    :name="displayName"
    :initials="initials"
    subtitle="Assignments and print queue"
    breadcrumb-root="Dashboard"
    :nav-items="navItems"
    support-title="Production rules"
    support-copy="This workspace is for assignment intake, queue visibility, and payment holds. Client totals and partner margin tools stay off this route."
    support-action="Open Jobs"
    support-to="/dashboard/production/jobs"
    @logout="auth.logout()"
  >
    <BaseAlert v-if="pageError" variant="error" title="Production dashboard could not load." :message="pageError" />

    <DashboardSection v-if="showSetupPrompt" title="Welcome to Printy - let's set up your shop" subtitle="It takes about 5 minutes. You'll be ready to receive jobs once done.">
      <div class="p-6">
        <BaseCard variant="soft" padding="xl" radius="xl" class="space-y-5">
          <div>
            <p class="text-sm font-bold text-slate-950">{{ setupPromptTitle }}</p>
            <p class="mt-2 text-sm text-slate-600">{{ setupPromptCopy }}</p>
          </div>
          <div class="grid gap-3 md:grid-cols-3">
            <div class="rounded-2xl border border-slate-200 bg-white px-4 py-4">
              <p class="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Shop</p>
              <p class="mt-2 text-sm font-bold text-slate-900">{{ setupStatus.hasShop ? 'Created' : 'Missing' }}</p>
            </div>
            <div class="rounded-2xl border border-slate-200 bg-white px-4 py-4">
              <p class="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Papers</p>
              <p class="mt-2 text-sm font-bold text-slate-900">{{ setupStatus.hasPapers ? 'Added' : 'Missing' }}</p>
            </div>
            <div class="rounded-2xl border border-slate-200 bg-white px-4 py-4">
              <p class="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Pricing</p>
              <p class="mt-2 text-sm font-bold text-slate-900">{{ setupStatus.hasPricing ? 'Added' : 'Missing' }}</p>
            </div>
          </div>
          <div class="flex flex-wrap gap-3">
            <BaseButton to="/dashboard/production/onboarding" size="lg">Set up my shop</BaseButton>
            <BaseButton v-if="currentShopSlug" :to="setupShortcutRoute" variant="secondary" size="lg">Continue from current gap</BaseButton>
          </div>
        </BaseCard>
      </div>
    </DashboardSection>

    <template v-else>
    <DashboardPageHeader
      eyebrow="Production Workspace"
      :title="`Production queue for ${firstName}`"
      subtitle="Assignments, payment holds, and production state are isolated here. Partner pricing tools are removed from this route."
    >
      <template #actions>
        <BaseButton to="/dashboard/production/jobs" variant="primary" size="md">Open Assignment Flow</BaseButton>
        <BaseButton to="/dashboard/production/onboarding" variant="secondary" size="md">Update Setup</BaseButton>
        <BaseButton to="/dashboard/production/messages" variant="secondary" size="md">Messages</BaseButton>
      </template>
    </DashboardPageHeader>

    <DashboardCardGrid>
      <BaseStatCard v-for="card in statCards" :key="card.label" :label="card.label" :value="card.value" :meta="card.meta" :accent="card.accent" :icon="card.icon" />
    </DashboardCardGrid>

    <div class="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
      <DashboardSection id="assignments" title="Incoming Assignments" subtitle="Production-only queue actions.">
        <BaseTable :columns="assignmentColumns" :rows="assignments" :loading="loading" empty-text="No production assignments yet." variant="dashboard" :row-action="openAssignment" />
      </DashboardSection>

      <DashboardSection title="Managed Queue" subtitle="Operational status without partner pricing exposure.">
        <BaseTable :columns="queueColumns" :rows="queue" :loading="loading" empty-text="No queued managed jobs yet." variant="dashboard" />
      </DashboardSection>
    </div>

    <DashboardSection title="Payment Holds" subtitle="Production sees readiness, not client checkout actions.">
      <div class="p-6">
        <BaseAlert variant="warning" message="Production can see whether payment is cleared before work starts, but MPESA initiation and client collection actions remain outside this route." />
      </div>
    </DashboardSection>
    </template>
  </RoleDashboardFrame>
</template>

<script setup lang="ts">
import BaseAlert from '~/components/base/BaseAlert.vue'
import BaseButton from '~/components/base/BaseButton.vue'
import BaseCard from '~/components/base/BaseCard.vue'
import BaseStatCard from '~/components/base/BaseStatCard.vue'
import BaseTable from '~/components/base/BaseTable.vue'
import DashboardCardGrid from '~/components/dashboard/DashboardCardGrid.vue'
import DashboardPageHeader from '~/components/dashboard/DashboardPageHeader.vue'
import DashboardSection from '~/components/dashboard/DashboardSection.vue'
import RoleDashboardFrame from '~/components/dashboard/RoleDashboardFrame.vue'
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

const auth = useAuthStore()
const router = useRouter()
const { fetchDashboardHome } = useDashboardApi()
const { fetchMyShops, fetchShopRateCardSetup, listShopPapers } = useShopsApi()
if (!auth.canAccessProductionDashboard) {
  await navigateTo(auth.homeRoute)
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

try {
  const shops = await fetchMyShops()
  const currentShop = shops.find(shop => shop?.is_active !== false) || shops[0] || null
  currentShopSlug.value = currentShop?.slug || ''

  if (currentShopSlug.value) {
    const [setup, papers] = await Promise.all([
      fetchShopRateCardSetup(currentShopSlug.value),
      listShopPapers(currentShopSlug.value),
    ])
    setupStatus.hasShop = true
    setupStatus.hasPapers = papers.some(item => item.is_active !== false)
    setupStatus.hasPricing = hasActivePricingRows(setup)
    setupStatus.completed = Boolean(setup.completed)
  }

  if (!( !setupStatus.completed && (!setupStatus.hasShop || !setupStatus.hasPapers || !setupStatus.hasPricing) )) {
    payload.value = await fetchDashboardHome('production')
  }
} catch (error: unknown) {
  pageError.value = getApiErrorMessage(error, 'Production dashboard data is unavailable right now.')
} finally {
  loading.value = false
}

const displayName = computed(() => auth.user?.name || auth.user?.email || 'Production')
const firstName = computed(() => displayName.value.split(' ')[0] || 'there')
const initials = computed(() => displayName.value.split(' ').map(part => part[0]).join('').slice(0, 2).toUpperCase() || 'PD')
const stats = computed(() => payload.value.stats || {})
const assignments = computed(() => Array.isArray(payload.value.assignments) ? payload.value.assignments : [])
const queue = computed(() => Array.isArray(payload.value.queue) ? payload.value.queue : [])
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

function openAssignment(row: Record<string, any>) {
  const managedJobId = row.managed_job_id || row.id
  if (!managedJobId) {
    return
  }
  router.push(`/dashboard/production/jobs/${managedJobId}`)
}
</script>
