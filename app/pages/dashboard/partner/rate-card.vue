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
    support-copy="Partner rate-card work stays separate from public shop onboarding."
    support-action="Back to Overview"
    support-to="/dashboard/partner"
    @logout="auth.logout()"
  >
    <DashboardSection title="Partner Rate Card" subtitle="This route replaces the old public `/for-shops` dashboard link.">
      <DashboardEmptyState
        title="Rate-card setup is moving here"
        description="The dashboard route now exists and is role-appropriate. The full partner margin and pricing workflow still needs dedicated implementation."
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
  { label: 'Rate Card', to: '/dashboard/partner/rate-card', active: true },
  { label: 'Messages', to: '/dashboard/partner/messages' },
])
</script>
