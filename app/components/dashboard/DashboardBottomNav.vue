<template>
  <nav
    class="fixed bottom-0 left-0 right-0 z-40 flex items-center justify-around gap-1 border-t border-gray-200 dark:border-gray-800 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md py-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] md:hidden"
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
        : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'"
    >
      <UIcon :name="item.icon" class="w-5 h-5 shrink-0" />
      <span class="truncate w-full text-center">{{ item.label }}</span>
    </NuxtLink>
  </nav>
</template>

<script setup lang="ts">
const route = useRoute()

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: 'i-lucide-layout-dashboard' },
  { to: '/dashboard/shops', label: 'Shops', icon: 'i-lucide-store' },
  { to: '/dashboard/quotes', label: 'Quotes', icon: 'i-lucide-file-text' },
  { to: '/dashboard/pricing', label: 'Pricing', icon: 'i-lucide-tag' },
  { to: '/dashboard/profile', label: 'Settings', icon: 'i-lucide-settings' },
]

function isActive(to: string) {
  if (to === '/dashboard') return route.path === '/dashboard'
  if (to === '/dashboard/pricing') return route.path === '/dashboard/pricing' || route.path.includes('/pricing')
  return route.path.startsWith(to)
}
</script>
