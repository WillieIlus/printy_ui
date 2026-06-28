<template>
  <!--
    Guardrail: role dashboard pages currently own their shell through RoleDashboardFrame.
    Any page that renders RoleDashboardFrame must use `layout: false`; combining
    `layout: 'dashboard'` with RoleDashboardFrame can create duplicate sidebars/topbars.
    Use this layout only for pages that do not render their own dashboard shell.
  -->
  <DashboardShell variant="dashboard">
    <template #sidebar>
      <DashboardSidebar tone="dark">
        <div class="border-b border-white/10 px-5 py-5">
          <p class="text-xs font-semibold uppercase tracking-[0.2em] text-[#f7a37a]">{{ eyebrow }}</p>
          <p class="mt-2 text-lg font-black text-white">Printy</p>
          <p class="mt-1 text-sm text-slate-400">{{ subtitle }}</p>
        </div>
        <nav class="flex-1 space-y-1 px-3 py-5">
          <NuxtLink
            v-for="item in items"
            :key="item.to"
            :to="item.to"
            class="flex items-center justify-between rounded-2xl px-4 py-3 text-sm font-semibold transition"
            :class="route.path === item.to ? 'bg-white/10 text-white' : 'text-slate-400 hover:bg-white/5 hover:text-white'"
          >
            <span>{{ item.label }}</span>
            <span v-if="item.badge" class="rounded-full bg-[#e13515] px-2 py-0.5 text-[10px] font-bold text-white">{{ item.badge }}</span>
          </NuxtLink>
        </nav>
        <div class="border-t border-white/10 p-4">
          <div class="rounded-2xl border border-white/10 bg-white/5 px-4 py-4">
            <p class="text-sm font-semibold text-white">Navigation sanity</p>
            <p class="mt-1 text-sm leading-6 text-slate-400">Primary routes stay visible here so pages do not collapse into isolated raw content.</p>
          </div>
        </div>
      </DashboardSidebar>
    </template>
    <template #topbar>
      <DashboardTopbar tone="light">
        <div>
          <p class="text-sm font-semibold uppercase tracking-[0.16em] text-slate-500">{{ eyebrow }}</p>
          <h1 class="mt-1 text-2xl font-black tracking-tight text-slate-950">{{ title }}</h1>
        </div>
        <div class="ml-auto flex items-center gap-3">
          <UiBadge tone="neutral">{{ auth.user?.email || 'Signed out' }}</UiBadge>
          <UiButton variant="secondary" @click="auth.logout()">Log out</UiButton>
        </div>
      </DashboardTopbar>
    </template>
    <slot />
  </DashboardShell>
</template>

<script setup lang="ts">
import DashboardShell from '~/components/layout/DashboardShell.vue'
import DashboardSidebar from '~/components/layout/DashboardSidebar.vue'
import DashboardTopbar from '~/components/layout/DashboardTopbar.vue'
import UiBadge from '~/components/ui/UiBadge.vue'
import UiButton from '~/components/ui/UiButton.vue'

const route = useRoute()
const auth = useAuthStore()

const title = computed(() => String(route.meta.dashboardTitle || 'Workspace'))
const eyebrow = computed(() => String(route.meta.dashboardEyebrow || 'Printy workspace'))
const subtitle = computed(() => auth.dashboardRole === 'production'
  ? 'Production workspace'
  : auth.dashboardRole === 'super_admin'
    ? 'Super admin workspace'
  : auth.dashboardRole === 'partner'
    ? 'Partner workspace'
    : 'Client workspace')
const items = computed<Array<{ label: string; to: string; badge?: string | number }>>(() => {
  if (auth.dashboardRole === 'super_admin') {
    return [
      { label: 'Admin', to: '/dashboard/admin' },
      { label: 'Quotes', to: '/dashboard/client/quotes' },
      { label: 'For shops', to: '/for-shops' },
    ]
  }
  if (auth.dashboardRole === 'production') {
    return [
      { label: 'Production', to: '/dashboard/production' },
      { label: 'Track Job', to: '/track-job' },
      { label: 'For shops', to: '/for-shops' },
    ]
  }
  if (auth.dashboardRole === 'partner') {
    return [
      { label: 'Partner', to: '/dashboard/partner' },
      { label: 'Quotes', to: '/dashboard/partner/quotes' },
      { label: 'For shops', to: '/for-shops' },
    ]
  }
  return [
    { label: 'Client', to: '/dashboard/client' },
    { label: 'Track Job', to: '/track-job' },
    { label: 'Quotes', to: '/dashboard/client/quotes' },
  ]
})
</script>
