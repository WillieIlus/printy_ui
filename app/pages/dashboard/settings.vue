<template>
  <div class="space-y-6">
    <DashboardPageHeader
      title="Settings"
      subtitle="Account and workspace settings are grouped here instead of scattered across the dashboard."
    />

    <div class="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      <NuxtLink
        v-for="item in settingsItems"
        :key="item.to"
        :to="item.to"
        class="rounded-3xl border border-[var(--p-border)] bg-[var(--p-surface)] p-5 shadow-sm transition hover:border-orange-300 dark:hover:border-orange-700"
      >
        <div class="flex items-start gap-3">
          <span class="flex h-11 w-11 items-center justify-center rounded-2xl border border-[var(--p-border)] bg-[var(--p-surface-sunken)]">
            <UIcon :name="item.icon" class="h-5 w-5" />
          </span>
          <div>
            <p class="text-sm font-semibold text-[var(--p-text)]">{{ item.label }}</p>
            <p class="mt-1 text-sm leading-6 text-[var(--p-text-muted)]">{{ item.description }}</p>
          </div>
        </div>
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAdminWorkspace } from '~/composables/useAdminWorkspace'

definePageMeta({
  layout: 'dashboard',
  middleware: ['auth'],
})

const { shopRoute } = useAdminWorkspace()

const settingsItems = computed(() => [
  {
    label: 'Profile',
    description: 'Your account details and supported personal settings.',
    to: '/dashboard/profile',
    icon: 'i-lucide-user',
  },
  {
    label: 'Shop Profile',
    description: 'Business details for the active shop workspace.',
    to: shopRoute('/edit'),
    icon: 'i-lucide-store',
  },
  {
    label: 'Notifications',
    description: 'Unread alerts, request activity, and updates.',
    to: '/dashboard/notifications',
    icon: 'i-lucide-bell',
  },
])
</script>
