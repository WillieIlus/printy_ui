
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

<template>
  <main class="min-h-screen bg-slate-50 px-6 py-8">
    <section class="mx-auto max-w-6xl rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <p class="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-600">Production</p>
      <h1 class="mt-3 text-2xl font-bold text-slate-900">Messages</h1>
      <p class="mt-2 text-sm text-slate-600">Production messages for {{ displayName }} will appear here.</p>
    </section>
  </main>
</template>
