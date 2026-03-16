<template>
  <div class="overflow-hidden rounded-xl border border-[var(--p-border)] bg-[var(--p-surface)] shadow-sm">
    <div class="border-b border-[var(--p-border-dim)] px-5 py-4">
      <h3 class="text-sm font-medium text-[var(--p-text-muted)]">Quick Actions</h3>
    </div>
    <div class="grid grid-cols-2 gap-3 p-4 md:grid-cols-4">
      <NuxtLink
        v-for="action in actions"
        :key="action.to"
        :to="action.to"
        class="group flex flex-col items-center gap-3 rounded-xl border border-[var(--p-border-dim)] bg-[var(--p-surface-sunken)] dark:bg-[var(--p-surface-raised)] p-4 transition-all hover:-translate-y-0.5 hover:border-flamingo-200 hover:bg-flamingo-50/50 dark:hover:border-flamingo-800 dark:hover:bg-flamingo-900/20 hover:shadow-md"
      >
        <div
          class="flex h-11 w-11 items-center justify-center rounded-2xl ring-1 ring-inset transition-colors group-hover:ring-flamingo-200 dark:group-hover:ring-flamingo-800"
          :class="action.bgColor"
        >
          <UIcon :name="action.icon" class="h-5 w-5" :class="action.iconColor" />
        </div>
        <span class="text-center text-sm font-medium text-[var(--p-text)]">{{ action.label }}</span>
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
const actions = [
  {
    to: '/dashboard/shops/create',
    icon: 'i-lucide-plus',
    label: 'New Shop',
    bgColor: 'bg-flamingo-50 ring-flamingo-100 dark:bg-flamingo-900/20 dark:ring-flamingo-900/40',
    iconColor: 'text-flamingo-600 dark:text-flamingo-400',
  },
  {
    to: '/dashboard/quotes',
    icon: 'i-lucide-file-text',
    label: 'Incoming Requests',
    bgColor: 'bg-green-50 ring-green-100 dark:bg-green-900/20 dark:ring-green-900/40',
    iconColor: 'text-green-600 dark:text-green-400',
  },
  {
    to: '/dashboard/profile/edit',
    icon: 'i-lucide-user-cog',
    label: 'Edit Profile',
    bgColor: 'bg-purple-50 ring-purple-100 dark:bg-purple-900/20 dark:ring-purple-900/40',
    iconColor: 'text-purple-600 dark:text-purple-400',
  },
  {
    to: '/shops/nearby',
    icon: 'i-lucide-map-pin',
    label: 'Nearby Shops',
    bgColor: 'bg-orange-50 ring-orange-100 dark:bg-orange-900/20 dark:ring-orange-900/40',
    iconColor: 'text-orange-600 dark:text-orange-400',
  },
]
</script>
