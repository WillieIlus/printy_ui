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

<template>
  <main class="min-h-screen bg-slate-50 px-6 py-8">
    <section class="mx-auto max-w-6xl rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <p class="text-sm font-semibold uppercase tracking-[0.2em] text-purple-600">Partner</p>
      <h1 class="mt-3 text-2xl font-bold text-slate-900">Messages</h1>
      <p class="mt-2 text-sm text-slate-600">Messages for {{ displayName }} will appear here.</p>
    </section>
  </main>
</template>
