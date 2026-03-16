<template>
  <div class="min-h-screen flex flex-col bg-[var(--p-bg)] text-[var(--p-text)] overflow-x-hidden">
    <!-- Top bar -->
    <header class="sticky top-0 z-40 flex h-14 shrink-0 items-center gap-4 border-b border-[var(--p-border)] bg-[var(--p-surface)] px-4 sm:px-6">
      <NuxtLink to="/dashboard" class="flex items-center gap-3 shrink-0 group">
        <span class="grid h-8 w-8 place-items-center rounded-xl overflow-hidden shrink-0" style="background: #e13515;">
          <CommonPrintyLogoMark img-class="h-5 w-5" />
        </span>
        <CommonPrintyWordmark img-class="h-5 w-auto max-w-[90px] hidden sm:block" />
      </NuxtLink>
      <div class="flex-1 min-w-0" />
      <ThemeCycleButton />
      <slot name="topbar-end" />
    </header>

    <div class="flex flex-1 overflow-hidden min-w-0">
      <!-- Sidebar: hidden on < md, full sidebar on md+ -->
      <aside
        class="hidden md:flex md:flex-col md:shrink-0 md:w-64 border-r border-[var(--p-border)] bg-[var(--p-surface)]"
      >
        <nav class="flex flex-col gap-1 p-4 overflow-y-auto">
          <!-- Homepage link -->
          <NuxtLink
            to="/"
            class="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors text-[var(--p-text-dim)] hover:bg-[var(--p-surface-sunken)] dark:hover:bg-[var(--p-surface-raised)]"
          >
            <UIcon name="i-lucide-home" class="w-5 h-5 shrink-0" />
            Homepage
          </NuxtLink>

          <template v-for="item in navItems" :key="item.to">
            <NuxtLink
              :to="item.to"
              class="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors"
              :class="isActive(item.to)
                ? 'bg-flamingo-50 dark:bg-flamingo-900/20 text-flamingo-600 dark:text-flamingo-400'
                : 'text-[var(--p-text-dim)] hover:bg-[var(--p-surface-sunken)] dark:hover:bg-[var(--p-surface-raised)]'"
            >
              <span class="relative">
                <UIcon :name="item.icon" class="w-5 h-5 shrink-0" />
                <span
                  v-if="item.to === '/dashboard/notifications' && notificationsStore.unreadCount > 0"
                  class="absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-flamingo-500 px-1 text-[10px] font-bold text-white"
                >
                  {{ notificationsStore.unreadCount > 99 ? '99+' : notificationsStore.unreadCount }}
                </span>
              </span>
              {{ item.label }}
            </NuxtLink>
          </template>

          <!-- Shop dropdown -->
          <div class="my-2 border-t border-[var(--p-border-dim)] pt-2">
            <button
              class="w-full flex items-center justify-between rounded-xl px-3 py-2.5 text-sm font-medium transition-colors text-[var(--p-text-dim)] hover:bg-[var(--p-surface-sunken)] dark:hover:bg-[var(--p-surface-raised)]"
              :class="{ 'bg-flamingo-50 dark:bg-flamingo-900/20 text-flamingo-600 dark:text-flamingo-400': isShopSectionActive }"
              @click="shopDropdownOpen = !shopDropdownOpen"
            >
              <span class="flex items-center gap-3">
                <UIcon name="i-lucide-shopping-bag" class="w-5 h-5 shrink-0" />
                Shop
              </span>
              <UIcon
                :name="shopDropdownOpen ? 'i-lucide-chevron-up' : 'i-lucide-chevron-down'"
                class="w-4 h-4 shrink-0 transition-transform"
              />
            </button>
            <div v-show="shopDropdownOpen" class="ml-4 mt-1 flex flex-col gap-0.5">
              <NuxtLink
                v-for="item in shopSubItems"
                :key="item.to"
                :to="item.to"
                class="flex items-center gap-3 rounded-xl px-3 py-2 text-sm transition-colors"
                :class="isActive(item.to)
                  ? 'bg-flamingo-50 dark:bg-flamingo-900/20 text-flamingo-600 dark:text-flamingo-400 font-medium'
                  : 'text-[var(--p-text-dim)] hover:bg-[var(--p-surface-sunken)] dark:hover:bg-[var(--p-surface-raised)]'"
              >
                <UIcon :name="item.icon" class="w-4 h-4 shrink-0" />
                {{ item.label }}
              </NuxtLink>
            </div>
          </div>

          <!-- My Shops -->
          <div class="my-2 border-t border-[var(--p-border-dim)] pt-2">
            <p class="px-3 text-xs font-semibold uppercase tracking-wider text-[var(--p-text-muted)]">My Shops</p>
            <ClientOnly>
              <template v-if="sellerStore.shops.length">
                <NuxtLink
                  v-for="shop in sellerStore.shops"
                  :key="shop.id"
                  :to="`/dashboard/shops/${shop.slug}`"
                  class="mt-1 flex items-center gap-3 rounded-xl px-3 py-2 text-sm text-[var(--p-text-dim)] hover:bg-[var(--p-surface-sunken)] dark:hover:bg-[var(--p-surface-raised)]"
                  :class="{ 'bg-flamingo-50 dark:bg-flamingo-900/20 text-flamingo-600 dark:text-flamingo-400': isShopActive(shop.slug) }"
                >
                  <UIcon name="i-lucide-store" class="w-4 h-4 shrink-0" />
                  <span class="truncate">{{ shop.name }}</span>
                </NuxtLink>
              </template>
            </ClientOnly>
            <NuxtLink
              to="/dashboard/shops/create"
              class="mt-2 flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium text-flamingo-600 dark:text-flamingo-400 hover:bg-flamingo-50 dark:hover:bg-flamingo-900/20"
            >
              <UIcon name="i-lucide-plus" class="w-4 h-4 shrink-0" />
              Add shop
            </NuxtLink>
          </div>
        </nav>
        <div v-if="$slots['sidebar-footer']" class="mt-auto border-t border-[var(--p-border)] p-4">
          <slot name="sidebar-footer" />
        </div>
        <div class="mt-auto border-t border-[var(--p-border)] p-4">
          <UButton
            color="neutral"
            variant="outline"
            size="sm"
            icon="i-lucide-message-square-plus"
            class="w-full justify-start"
            @click="feedbackOpen = true"
          >
            Send Feedback
          </UButton>
        </div>
      </aside>

      <!-- Bottom nav: mobile only (< md) -->
      <DashboardBottomNav />

      <!-- Floating feedback button: mobile only -->
      <div class="fixed bottom-20 right-4 z-30 md:hidden">
        <UButton
          color="primary"
          size="lg"
          icon="i-lucide-message-square-plus"
          aria-label="Send feedback"
          class="rounded-full shadow-lg"
          @click="feedbackOpen = true"
        />
      </div>

      <main class="flex-1 min-w-0 overflow-auto p-4 sm:p-6 lg:p-8 pb-20 md:pb-6 lg:pb-8">
        <DashboardSetupChecklistBanner class="mb-4" />
        <div v-if="$slots.title || $slots.actions" class="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div v-if="$slots.title"><slot name="title" /></div>
          <div v-if="$slots.actions" class="shrink-0"><slot name="actions" /></div>
        </div>
        <slot />
      </main>
    </div>

    <DashboardBetaFeedbackModal
      :open="feedbackOpen"
      :page="route.path"
      :user-agent="userAgent"
      @update:open="feedbackOpen = $event"
    />
  </div>
</template>

<script setup lang="ts">
import { useSellerStore } from '~/stores/seller'
import { useSetupStatus } from '~/composables/useSetupStatus'

const route = useRoute()
const sellerStore = useSellerStore()
const notificationsStore = useNotificationsStore()
const { refresh: refreshSetup } = useSetupStatus()
const feedbackOpen = ref(false)
const shopDropdownOpen = ref(true)
const userAgent = ref('')
if (import.meta.client) {
  userAgent.value = navigator.userAgent.slice(0, 255)
}

const navItems = [
  { to: '/dashboard', label: 'Print Dashboard', icon: 'i-lucide-layout-dashboard' },
  { to: '/dashboard/notifications', label: 'Notifications', icon: 'i-lucide-bell' },
  { to: '/dashboard/profile', label: 'Profile', icon: 'i-lucide-user' },
  { to: '/dashboard/shops', label: 'My Shops', icon: 'i-lucide-store' },
  { to: '/dashboard/quotes', label: 'Staff Quotes', icon: 'i-lucide-file-text' },
  { to: '/dashboard/claims', label: 'Claims', icon: 'i-lucide-shield-check' },
  { to: '/dashboard/jobs', label: 'Jobs', icon: 'i-lucide-briefcase' },
]

const shopSubItems = [
  { to: '/dashboard/machines', label: 'Machines', icon: 'i-lucide-printer' },
  { to: '/dashboard/papers', label: 'Papers', icon: 'i-lucide-file-stack' },
  { to: '/dashboard/finishing', label: 'Finishing', icon: 'i-lucide-scissors' },
  { to: '/dashboard/materials', label: 'Materials', icon: 'i-lucide-layers' },
  { to: '/dashboard/pricing', label: 'Pricing', icon: 'i-lucide-banknote' },
  { to: '/dashboard/products', label: 'Products', icon: 'i-lucide-package' },
]

const isShopSectionActive = computed(() => {
  return shopSubItems.some(item => route.path.startsWith(item.to))
})

function isActive(to: string) {
  if (to === '/dashboard') return route.path === '/dashboard'
  return route.path.startsWith(to)
}

function isShopActive(slug: string) {
  return route.params.slug === slug
}

watch(() => route.path, () => {
  if (isShopSectionActive.value) {
    shopDropdownOpen.value = true
  }
}, { immediate: true })

onMounted(() => {
  sellerStore.fetchShops()
  refreshSetup()
  notificationsStore.fetchUnreadCount()
})
</script>
