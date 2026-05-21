<template>
  <RoleDashboardFrame
    title="Production Workspace"
    badge="Production"
    :name="displayName"
    :initials="initials"
    subtitle="Role-specific production flows"
    breadcrumb-root="Dashboard"
    :nav-items="navItems"
    support-title="Production workspace"
    support-copy="Production links now land on a dashboard route instead of `/quotes`."
    support-action="Back to Overview"
    support-to="/dashboard/production"
    @logout="auth.logout()"
  >
    <DashboardSection title="Production Messages" subtitle="This page prevents the old messages CTA from resolving to a 404.">
      <DashboardEmptyState
        title="Messages route is live"
        description="A dedicated production inbox still needs real message threading and assignment context. For now, the route is stable and role-correct."
        action-label="Open Jobs"
        action-to="/dashboard/production/jobs"
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
if (!auth.canAccessProductionDashboard) {
  await navigateTo(auth.homeRoute)
}

const displayName = computed(() => auth.user?.name || auth.user?.email || 'Production')
const initials = computed(() => displayName.value.split(' ').map(part => part[0]).join('').slice(0, 2).toUpperCase() || 'PD')
const navItems = computed(() => [
  { label: 'Overview', to: '/dashboard/production' },
  { label: 'Jobs', to: '/dashboard/production/jobs' },
  { label: 'Pricing', to: '/dashboard/production/pricing' },
  { label: 'Paper', to: '/dashboard/production/paper-stock' },
  { label: 'Finishings', to: '/dashboard/production/finishings' },
  { label: 'Messages', to: '/dashboard/production/messages', active: true },
])
</script>
