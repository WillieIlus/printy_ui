<script setup lang="ts">
import { callWithNuxt } from '#app'
import BaseButton from '~/components/base/BaseButton.vue'
import DashboardEmptyState from '~/components/dashboard/DashboardEmptyState.vue'
import DashboardPageHeader from '~/components/dashboard/DashboardPageHeader.vue'
import DashboardSection from '~/components/dashboard/DashboardSection.vue'
import RoleDashboardFrame from '~/components/dashboard/RoleDashboardFrame.vue'

definePageMeta({ layout: false, middleware: 'auth' })

const nuxtApp = useNuxtApp()
const auth = useAuthStore()
if (!auth.canAccessProductionDashboard) {
  await callWithNuxt(nuxtApp, navigateTo, [auth.homeRoute])
}

const displayName = computed(() => auth.user?.name || auth.user?.email || 'Production')
const initials = computed(() => displayName.value.split(' ').map(p => p[0]).join('').slice(0, 2).toUpperCase() || 'PD')
const navItems = computed(() => [
  { label: 'Assignments', to: '/dashboard/production/assignments', active: true },
])
</script>

<template>
  <main class="min-h-screen bg-slate-50 px-6 py-8">
    <section class="mx-auto max-w-6xl rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <p class="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-600">Production</p>
      <h1 class="mt-3 text-2xl font-bold text-slate-900">Production job</h1>
      <p class="mt-2 text-sm text-slate-600">Assignment details for {{ displayName }}.</p>
      <NuxtLink to="/dashboard/production/assignments" class="mt-5 inline-flex rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white">
        Back to assignments
      </NuxtLink>
    </section>
  </main>
</template>
