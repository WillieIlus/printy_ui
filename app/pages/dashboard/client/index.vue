<template>
  <RoleDashboardFrame
    title="Client Dashboard"
    badge="Client"
    :name="displayName"
    :initials="initials"
    subtitle="Orders, approvals, and payments"
    breadcrumb-root="Dashboard"
    :nav-items="navItems"
    support-title="Need a quote?"
    support-copy="Open a quote thread, review production updates, and pay only when your job is ready."
    support-action="Open Quotes"
    support-to="/dashboard/client/quotes"
    @logout="auth.logout()"
  >
    <BaseAlert v-if="pageError" variant="error" title="Client dashboard could not load." :message="pageError" />

    <DashboardPageHeader
      eyebrow="Client Workspace"
      :title="`Welcome back, ${firstName}`"
      subtitle="This workspace only shows your own jobs, payment prompts, and approval actions."
    >
      <template #actions>
        <BaseButton to="/dashboard/client/quotes" variant="primary" size="md">Request Quote</BaseButton>
        <BaseButton to="/dashboard/client/jobs" variant="secondary" size="md">View Jobs</BaseButton>
      </template>
    </DashboardPageHeader>

    <DashboardSection
      v-if="hasPendingQuote"
      title="Unsent Calculator Draft"
      subtitle="We saved your estimate. Continue from here."
    >
      <div class="rounded-2xl border border-[#fda497] bg-[#fff8f7] p-5">
        <p class="text-sm font-semibold text-[#101828]">We saved your estimate. Continue from here.</p>
        <p class="mt-1 text-sm text-[#667085]">Your product, quantity, paper, size, sides, colour mode, and finishing are ready in the inline calculator below.</p>
        <div class="mt-4 flex flex-wrap gap-3">
          <BaseButton variant="primary" size="sm" @click="openCalculatorPanel">Continue Quote</BaseButton>
          <BaseButton to="/dashboard/client/quotes" variant="secondary" size="sm">View Quotes</BaseButton>
        </div>
      </div>
    </DashboardSection>

    <DashboardSection title="Get a New Quote" subtitle="Calculate price & request a quote without leaving the dashboard.">
      <div class="space-y-4">
        <BaseButton :variant="showCalculatorPanel ? 'secondary' : 'primary'" size="sm" @click="toggleCalculatorPanel">
          {{ showCalculatorPanel ? 'Hide Calculator' : 'Calculate Price & Request a Quote' }}
        </BaseButton>
        <div v-if="showCalculatorPanel" class="overflow-hidden rounded-2xl border border-[#e4e7ec] bg-white">
          <HomeHeroCalculator embedded />
        </div>
      </div>
    </DashboardSection>

    <DashboardCardGrid>
      <BaseStatCard v-for="card in statCards" :key="card.label" :label="card.label" :value="card.value" :meta="card.meta" :accent="card.accent" :icon="card.icon" />
    </DashboardCardGrid>

    <div class="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
      <DashboardSection title="Recent Jobs" subtitle="Your current print jobs only.">
        <BaseTable :columns="jobColumns" :rows="jobs" :loading="loading" empty-text="No client jobs yet." variant="dashboard" />
      </DashboardSection>

      <DashboardSection id="payments" title="Payments & MPESA" subtitle="Client-side payment actions stay here.">
        <div class="p-6 space-y-4">
          <BaseAlert variant="default" message="Only client accounts can trigger MPESA/STK payment actions. Partner and production workspaces are read-only for payment collection." />
          <BaseTable :columns="paymentColumns" :rows="payments" :loading="loading" empty-text="No payment prompts yet." variant="dashboard" />
          <DashboardEmptyState
            v-if="!loading && payments.length === 0"
            title="No pending client payments"
            description="When a managed job reaches payment collection, the MPESA action will appear here or inside the job detail flow."
            action-label="Open Quotes"
            action-to="/dashboard/client/quotes"
          />
        </div>
      </DashboardSection>
    </div>
  </RoleDashboardFrame>
</template>

<script setup lang="ts">
import BaseAlert from '~/components/base/BaseAlert.vue'
import BaseButton from '~/components/base/BaseButton.vue'
import BaseStatCard from '~/components/base/BaseStatCard.vue'
import BaseTable from '~/components/base/BaseTable.vue'
import HomeHeroCalculator from '~/components/marketing/HomeHeroCalculator.vue'
import DashboardCardGrid from '~/components/dashboard/DashboardCardGrid.vue'
import DashboardEmptyState from '~/components/dashboard/DashboardEmptyState.vue'
import DashboardPageHeader from '~/components/dashboard/DashboardPageHeader.vue'
import DashboardSection from '~/components/dashboard/DashboardSection.vue'
import RoleDashboardFrame from '~/components/dashboard/RoleDashboardFrame.vue'
import { usePendingClientQuote } from '~/composables/usePendingClientQuote'
import { getApiErrorMessage } from '~/shared/api'
import { useDashboardApi } from '~/services/dashboard'

definePageMeta({
  layout: false,
  middleware: 'auth',
})

useHead({
  title: 'Printy - Client Dashboard',
})

const auth = useAuthStore()
const { fetchDashboardHome } = useDashboardApi()
if (!auth.canAccessClientDashboard) {
  await navigateTo(auth.homeRoute)
}

const route = useRoute()
const loading = ref(true)
const pageError = ref('')
const payload = ref<Record<string, any>>({})
const showCalculatorPanel = ref(false)
const pendingClientQuote = usePendingClientQuote()

try {
  payload.value = await fetchDashboardHome('client')
} catch (error: unknown) {
  pageError.value = getApiErrorMessage(error, 'Client dashboard data is unavailable right now.')
} finally {
  loading.value = false
}

const displayName = computed(() => auth.user?.name || auth.user?.email || 'Client')
const firstName = computed(() => displayName.value.split(' ')[0] || 'there')
const initials = computed(() => displayName.value.split(' ').map(part => part[0]).join('').slice(0, 2).toUpperCase() || 'CL')
const stats = computed(() => payload.value.stats || {})
const jobs = computed(() => Array.isArray(payload.value.recent_jobs) ? payload.value.recent_jobs : [])
const payments = computed(() => Array.isArray(payload.value.payments) ? payload.value.payments : [])
const hasPendingQuote = computed(() => pendingClientQuote.hasPendingQuote.value)

function openCalculatorPanel() {
  pendingClientQuote.load()
  showCalculatorPanel.value = true
}

function toggleCalculatorPanel() {
  if (!showCalculatorPanel.value) {
    openCalculatorPanel()
    return
  }
  showCalculatorPanel.value = false
}

watch(
  () => route.query.pendingQuote,
  () => {
    pendingClientQuote.load()
    if (route.query.pendingQuote === '1' || pendingClientQuote.hasPendingQuote.value) {
      showCalculatorPanel.value = true
    }
  },
  { immediate: true },
)

watch(
  () => pendingClientQuote.hasPendingQuote.value,
  (hasPendingQuoteValue) => {
    if (hasPendingQuoteValue) {
      showCalculatorPanel.value = true
    }
  },
)

onMounted(() => {
  if (route.query.pendingQuote === '1' || pendingClientQuote.load()) {
    showCalculatorPanel.value = true
  }
})

const navItems = computed(() => [
  { label: 'Client Dashboard', to: '/dashboard/client', active: true },
  { label: 'Quotes', to: '/dashboard/client/quotes' },
  { label: 'Jobs', to: '/dashboard/client/jobs' },
  { label: 'Payments', to: '/dashboard/client/payments' },
])

const statCards = computed(() => [
  {
    label: 'Open Jobs',
    value: stats.value.open_jobs ?? 0,
    meta: 'Only your active jobs',
    accent: 'orange' as const,
    icon: '<svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M3 7h18M6 11h12M9 15h6M5 3h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2z" /></svg>',
  },
  {
    label: 'Awaiting Payment',
    value: stats.value.awaiting_payment ?? 0,
    meta: 'Client-only MPESA prompts',
    accent: 'amber' as const,
    icon: '<svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><rect x="2" y="5" width="20" height="14" rx="2" /><path stroke-linecap="round" stroke-linejoin="round" d="M2 10h20" /></svg>',
  },
  {
    label: 'In Production',
    value: stats.value.in_production ?? 0,
    meta: 'Jobs currently moving through print',
    accent: 'green' as const,
    icon: '<svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 17v-6h13v6M9 7V5a2 2 0 012-2h9a2 2 0 012 2v2M5 11h.01M5 17h.01M5 5h.01" /></svg>',
  },
])

const jobColumns = [
  { key: 'reference', label: 'Reference' },
  { key: 'title', label: 'Job' },
  { key: 'status', label: 'Status' },
  { key: 'payment_status', label: 'Payment' },
]

const paymentColumns = [
  { key: 'reference', label: 'Reference' },
  { key: 'amount', label: 'Amount' },
  { key: 'payment_status', label: 'Status' },
  { key: 'channel', label: 'Channel' },
]
</script>
