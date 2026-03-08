<template>
  <nav
    class="fixed bottom-0 left-0 right-0 z-40 flex items-center justify-around gap-1 border-t border-[var(--p-border)] bg-[var(--p-surface)]/95 backdrop-blur-md py-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] md:hidden"
    role="navigation"
    aria-label="Main navigation"
  >
    <NuxtLink
      v-for="item in navItems"
      :key="item.to"
      :to="item.to"
      class="flex flex-col items-center justify-center gap-0.5 min-w-0 flex-1 py-2 px-1 text-xs font-medium transition-colors duration-200"
      :class="isActive(item.to)
        ? 'text-flamingo-600 dark:text-flamingo-400'
        : 'text-[var(--p-text-muted)] hover:text-[var(--p-text)]'"
    >
      <UIcon :name="item.icon" class="w-5 h-5 shrink-0" />
      <span class="truncate w-full text-center">{{ item.label }}</span>
    </NuxtLink>
  </nav>
</template>

<script setup lang="ts">
const route = useRoute()

const navItems = [
  { to: '/', label: 'Home', icon: 'i-lucide-home' },
  { to: '/dashboard', label: 'Dashboard', icon: 'i-lucide-layout-dashboard' },
  { to: '/dashboard/shops', label: 'Shops', icon: 'i-lucide-store' },
  { to: '/dashboard/pricing', label: 'Pricing', icon: 'i-lucide-banknote' },
  { to: '/dashboard/quotes', label: 'Quotes', icon: 'i-lucide-file-text' },
  { to: '/dashboard/profile', label: 'Settings', icon: 'i-lucide-settings' },
]

function isActive(to: string) {
  if (to === '/') return route.path === '/'
  if (to === '/dashboard') return route.path === '/dashboard'
  return route.path.startsWith(to)
}
</script>
