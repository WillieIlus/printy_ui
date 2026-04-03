<template>
  <nav
    class="fixed bottom-0 left-0 right-0 z-40 flex items-center justify-around gap-1 border-t border-[var(--p-border)] bg-[var(--p-surface)]/95 backdrop-blur-md py-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] md:hidden"
    role="navigation"
    :aria-label="t('common.menu')"
  >
    <NuxtLink
      v-for="item in navItems"
      :key="item.to"
      :to="item.to"
      class="relative flex flex-col items-center justify-center gap-0.5 min-w-0 flex-1 py-2 px-1 text-xs font-medium transition-colors duration-200"
      :class="isActive(item.to)
        ? 'text-flamingo-600 dark:text-flamingo-400'
        : 'text-[var(--p-text-muted)] hover:text-[var(--p-text)]'"
    >
      <span v-if="item.to === '/dashboard/notifications' && notificationsStore.unreadCount > 0" class="absolute top-1 right-1/4 flex h-3.5 min-w-3.5 items-center justify-center rounded-full bg-flamingo-500 px-0.5 text-[9px] font-bold text-white">
        {{ notificationsStore.unreadCount > 9 ? '9+' : notificationsStore.unreadCount }}
      </span>
      <UIcon :name="item.icon" class="w-5 h-5 shrink-0" />
      <span class="truncate w-full text-center">{{ item.label }}</span>
    </NuxtLink>
  </nav>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useNotificationsStore } from '~/stores/notifications'

const route = useRoute()
const { t } = useI18n()

const notificationsStore = useNotificationsStore()

const navItems = computed(() => [
  { to: '/', label: t('common.home'), icon: 'i-lucide-home' },
  { to: '/dashboard', label: t('common.print'), icon: 'i-lucide-layout-dashboard' },
  { to: '/dashboard/notifications', label: t('common.alerts'), icon: 'i-lucide-bell' },
  { to: '/dashboard/shops', label: t('header.nav.shops'), icon: 'i-lucide-store' },
  { to: '/dashboard/quotes', label: t('common.requests'), icon: 'i-lucide-inbox' },
  { to: '/dashboard/profile', label: t('common.settings'), icon: 'i-lucide-settings' },
])

function isActive(to: string) {
  if (to === '/') return route.path === '/'
  if (to === '/dashboard') return route.path === '/dashboard'
  return route.path.startsWith(to)
}
</script>
