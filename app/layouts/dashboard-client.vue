<script setup lang="ts">
import RoleDashboardFrame from '~/components/dashboard/RoleDashboardFrame.vue'

const auth = useAuthStore()

const navItems = [
  { label: 'Client Dashboard', path: '/dashboard/client', icon: 'home' },
  { label: 'Quotes', path: '/dashboard/client/quotes', icon: 'fileText' },
  { label: 'Jobs', path: '/dashboard/client/jobs', icon: 'printer' },
  { label: 'Messages', path: '/dashboard/client/messages', icon: 'messageSquare' },
  { label: 'Payments', path: '/dashboard/client/payments', icon: 'creditCard' },
]

const settingsItems = [
  { label: 'Profile', path: '/dashboard/settings/profile', icon: 'user' },
]

const userName = computed(() => auth.user?.name || auth.user?.email || 'Client')
const userEmail = computed(() => auth.user?.email || '')
</script>

<template>
  <RoleDashboardFrame
    :nav-items="navItems"
    :settings-items="settingsItems"
    role-badge="Client"
    :user-name="userName"
    :user-email="userEmail"
  >
    <template #helperCard>
      <div class="rounded-xl border border-slate-200 bg-gradient-to-br from-slate-50 to-slate-100 p-4">
        <p class="text-sm font-semibold text-slate-900">Need help?</p>
        <p class="mt-1 text-xs leading-5 text-slate-500">
          Contact our team for quotes, jobs, or payment support.
        </p>
        <NuxtLink to="/#live-estimate" class="mt-3 inline-flex text-xs font-semibold text-[#e13515] hover:underline">
          Start a quote
        </NuxtLink>
      </div>
    </template>

    <slot />
  </RoleDashboardFrame>
</template>
