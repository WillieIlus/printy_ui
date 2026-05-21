<template>
  <RoleDashboardFrame
    title="Partner Workspace"
    badge="Partner"
    :name="displayName"
    :initials="initials"
    subtitle="Role-specific partner flows"
    breadcrumb-root="Dashboard"
    :nav-items="navItems"
    support-title="Partner workspace"
    support-copy="Message routes now land on a real dashboard page instead of a missing route."
    support-action="Back to Overview"
    support-to="/dashboard/partner"
    @logout="auth.logout()"
  >
    <DashboardSection title="Partner Messages" subtitle="Inbox wiring still needs a dedicated conversation UI.">
      <DashboardEmptyState
        title="Messages route is live"
        description="The broken dashboard link is fixed. Backend message endpoints exist, but this page is currently a stub until the inbox workflow is built."
        action-label="Open Quotes"
        action-to="/dashboard/partner/quotes"
      />
    </DashboardSection>
  </RoleDashboardFrame>
</template>

<script setup lang="ts">
import DashboardEmptyState from '~/components/dashboard/DashboardEmptyState.vue'
import DashboardSection from '~/components/dashboard/DashboardSection.vue'
import RoleDashboardFrame from '~/components/dashboard/RoleDashboardFrame.vue'

definePageMeta({ layout: false, middleware: 'auth' })

const auth = useAuthStore()
if (!auth.canAccessPartnerDashboard) {
  await navigateTo(auth.homeRoute)
}

const displayName = computed(() => auth.user?.name || auth.user?.email || 'Partner')
const initials = computed(() => displayName.value.split(' ').map(part => part[0]).join('').slice(0, 2).toUpperCase() || 'PT')
const navItems = computed(() => [
  { label: 'Overview', to: '/dashboard/partner' },
  { label: 'Quotes', to: '/dashboard/partner/quotes' },
  { label: 'Jobs', to: '/dashboard/partner/jobs' },
  { label: 'Clients', to: '/dashboard/partner/clients' },
  { label: 'Shops', to: '/dashboard/partner/production-shops' },
  { label: 'Rate Card', to: '/dashboard/partner/rate-card' },
  { label: 'Messages', to: '/dashboard/partner/messages', active: true },
])
</script>
