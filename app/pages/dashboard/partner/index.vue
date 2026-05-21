<template>
  <RoleDashboardFrame
    title="Partner Dashboard"
    badge="Partner"
    :name="displayName"
    :initials="initials"
    subtitle="Client portfolio and quoting"
    breadcrumb-root="Dashboard"
    :nav-items="navItems"
    support-title="Need printer pricing?"
    support-copy="This workspace exposes client-facing totals, quoting lanes, and managed client jobs. Production execution remains separate."
    support-action="Open Rate Card"
    support-to="/dashboard/partner/rate-card"
    @logout="auth.logout()"
  >
    <BaseAlert v-if="pageError" variant="error" title="Partner dashboard could not load." :message="pageError" />

    <DashboardPageHeader
      eyebrow="Partner Workspace"
      :title="`Partner pipeline for ${firstName}`"
      subtitle="This workspace can manage clients and see client-facing totals, but it cannot trigger production-only assignment actions."
    >
      <template #actions>
        <BaseButton to="/dashboard/partner/quotes" variant="primary" size="md">Create Quote</BaseButton>
        <BaseButton to="/dashboard/partner/rate-card" variant="secondary" size="md">Margin Setup</BaseButton>
      </template>
    </DashboardPageHeader>

    <DashboardCardGrid>
      <BaseStatCard v-for="card in statCards" :key="card.label" :label="card.label" :value="card.value" :meta="card.meta" :accent="card.accent" :icon="card.icon" />
    </DashboardCardGrid>

    <div class="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
      <DashboardSection title="Managed Client Jobs" subtitle="Partner-visible jobs with client-facing totals.">
        <BaseTable :columns="jobColumns" :rows="jobs" :loading="loading" empty-text="No managed partner jobs yet." variant="dashboard" />
      </DashboardSection>

      <DashboardSection title="Quote Requests" subtitle="Commercial intake owned by the partner workspace.">
        <BaseTable :columns="quoteColumns" :rows="quoteRequests" :loading="loading" empty-text="No partner quote requests yet." variant="dashboard" />
      </DashboardSection>
    </div>

    <DashboardSection title="Pricing Visibility" subtitle="Partner sees client totals; production does not.">
      <div class="p-6">
        <BaseAlert variant="default" message="Client-facing totals and payment state are visible here for quoting and coordination. Raw production assignment actions are intentionally not exposed on this route." />
      </div>
    </DashboardSection>
  </RoleDashboardFrame>
</template>

<script setup lang="ts">
import BaseAlert from '~/components/base/BaseAlert.vue'
import BaseButton from '~/components/base/BaseButton.vue'
import BaseStatCard from '~/components/base/BaseStatCard.vue'
import BaseTable from '~/components/base/BaseTable.vue'
import DashboardCardGrid from '~/components/dashboard/DashboardCardGrid.vue'
import DashboardPageHeader from '~/components/dashboard/DashboardPageHeader.vue'
import DashboardSection from '~/components/dashboard/DashboardSection.vue'
import RoleDashboardFrame from '~/components/dashboard/RoleDashboardFrame.vue'
import { getApiErrorMessage } from '~/shared/api'
import { useDashboardApi } from '~/services/dashboard'

definePageMeta({
  layout: false,
  middleware: 'auth',
})

useHead({
  title: 'Printy - Partner Dashboard',
})

const auth = useAuthStore()
const { fetchDashboardHome } = useDashboardApi()
if (!auth.canAccessPartnerDashboard) {
  await navigateTo(auth.homeRoute)
}

const loading = ref(true)
const pageError = ref('')
const payload = ref<Record<string, any>>({})

try {
  payload.value = await fetchDashboardHome('partner')
} catch (error: unknown) {
  pageError.value = getApiErrorMessage(error, 'Partner dashboard data is unavailable right now.')
} finally {
  loading.value = false
}

const displayName = computed(() => auth.user?.name || auth.user?.email || 'Partner')
const firstName = computed(() => displayName.value.split(' ')[0] || 'there')
const initials = computed(() => displayName.value.split(' ').map(part => part[0]).join('').slice(0, 2).toUpperCase() || 'PT')
const stats = computed(() => payload.value.stats || {})
const jobs = computed(() => Array.isArray(payload.value.recent_jobs) ? payload.value.recent_jobs : [])
const quoteRequests = computed(() => Array.isArray(payload.value.quote_requests) ? payload.value.quote_requests : [])

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
</script>
