<template>
  <div class="min-h-screen flex flex-col bg-[var(--p-bg)] text-[var(--p-text)]">
    <!-- Top bar -->
    <header class="sticky top-0 z-40 flex h-14 shrink-0 items-center gap-4 border-b border-[var(--p-border)] bg-[var(--p-surface)] px-4 sm:px-6">
      <UButton
        icon="i-lucide-menu"
        color="neutral"
        variant="soft"
        size="sm"
        aria-label="Toggle sidebar"
        class="lg:hidden"
        @click="sidebarOpen = !sidebarOpen"
      />
      <NuxtLink to="/admin" class="flex items-center gap-2 shrink-0">
        <span class="grid h-8 w-8 place-items-center rounded-lg bg-gray-900 dark:bg-white text-white dark:text-gray-900">
          <UIcon name="i-lucide-shield-check" class="w-4 h-4" />
        </span>
        <span class="font-semibold text-[var(--p-text)] hidden sm:inline">Admin</span>
      </NuxtLink>
      <div class="flex-1 min-w-0" />
      <ThemeCycleButton />
      <slot name="topbar-end" />
    </header>

    <div class="flex flex-1 overflow-hidden">
      <!-- Sidebar -->
      <aside
        class="fixed inset-y-0 left-0 z-30 w-64 transform border-r border-[var(--p-border)] bg-[var(--p-surface)] pt-14 transition-transform duration-200 ease-out lg:static lg:translate-x-0 lg:pt-0"
        :class="sidebarOpen ? 'translate-x-0' : '-translate-x-full'"
      >
        <nav class="flex flex-col gap-1 p-4">
          <template v-for="item in navItems" :key="item.to">
            <NuxtLink
              :to="item.to"
              class="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors"
              :class="isActive(item.to)
                ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400'
                : 'text-[var(--p-text-dim)] hover:bg-[var(--p-surface-sunken)] dark:hover:bg-[var(--p-surface-raised)]'"
            >
              <UIcon :name="item.icon" class="w-5 h-5 shrink-0" />
              {{ item.label }}
            </NuxtLink>
          </template>
        </nav>
        <div v-if="$slots['sidebar-footer']" class="mt-auto border-t border-[var(--p-border)] p-4">
          <slot name="sidebar-footer" />
        </div>
      </aside>

      <!-- Overlay when sidebar open on mobile -->
      <div
        v-if="sidebarOpen"
        class="fixed inset-0 z-20 bg-black/50 lg:hidden"
        aria-hidden
        @click="sidebarOpen = false"
      />

      <!-- Main content -->
      <main class="flex-1 overflow-auto p-4 sm:p-6 lg:p-8">
        <div v-if="$slots.title || $slots.actions" class="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div v-if="$slots.title">
            <slot name="title" />
          </div>
          <div v-if="$slots.actions" class="shrink-0">
            <slot name="actions" />
          </div>
        </div>
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const sidebarOpen = ref(false)

const navItems = [
  { to: '/admin', label: 'Overview', icon: 'i-lucide-layout-dashboard' },
  { to: '/admin/users', label: 'Users', icon: 'i-lucide-users' },
  { to: '/admin/shops', label: 'Shops', icon: 'i-lucide-store' },
  { to: '/admin/claims', label: 'Claims', icon: 'i-lucide-shield-check' },
  { to: '/admin/settings', label: 'Settings', icon: 'i-lucide-settings' },
]

function isActive(to: string) {
  if (to === '/admin') return route.path === '/admin'
  return route.path.startsWith(to)
}
</script>
