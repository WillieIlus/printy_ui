<template>
  <div class="min-h-screen flex flex-col bg-[#f3f6fc] dark:bg-[#101828] text-[#101828] dark:text-gray-100 overflow-x-hidden">
    <!-- Top bar -->
    <header class="sticky top-0 z-40 flex h-14 shrink-0 items-center gap-4 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-[#101828] px-4 sm:px-6">
      <NuxtLink to="/dashboard" class="flex items-center gap-3 shrink-0 group">
        <span class="grid h-8 w-8 place-items-center rounded-xl overflow-hidden shrink-0" style="background: #e13515;">
          <CommonPrintyLogoMark img-class="h-5 w-5" />
        </span>
        <CommonPrintyWordmark img-class="h-5 w-auto max-w-[90px] hidden sm:block" />
      </NuxtLink>
      <div class="flex-1 min-w-0" />
      <ClientOnly>
        <UButton
          :icon="colorMode.value === 'dark' ? 'i-lucide-sun' : 'i-lucide-moon'"
          color="neutral"
          variant="ghost"
          size="sm"
          aria-label="Toggle theme"
          @click="colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'"
        />
      </ClientOnly>
      <slot name="topbar-end" />
    </header>

    <div class="flex flex-1 overflow-hidden min-w-0">
      <!-- Sidebar: hidden on < md, full sidebar on md+ -->
      <aside
        class="hidden md:flex md:flex-col md:shrink-0 md:w-64 border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900"
      >
        <nav class="flex flex-col gap-1 p-4 overflow-y-auto">
          <template v-for="item in navItems" :key="item.to">
            <NuxtLink
              :to="item.to"
              class="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors"
              :class="isActive(item.to)
                ? 'bg-flamingo-50 dark:bg-flamingo-900/20 text-flamingo-600 dark:text-flamingo-400'
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'"
            >
              <UIcon :name="item.icon" class="w-5 h-5 shrink-0" />
              {{ item.label }}
            </NuxtLink>
          </template>
          <div class="my-2 border-t border-gray-200 dark:border-gray-700 pt-2">
            <p class="px-3 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">My Shops</p>
            <ClientOnly>
              <template v-if="sellerStore.shops.length">
                <NuxtLink
                  v-for="shop in sellerStore.shops"
                  :key="shop.id"
                  :to="`/dashboard/shops/${shop.id}/setup`"
                  class="mt-1 flex items-center gap-3 rounded-xl px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                  :class="{ 'bg-flamingo-50 dark:bg-flamingo-900/20 text-flamingo-600 dark:text-flamingo-400': isShopActive(shop.id) }"
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
        <div v-if="$slots['sidebar-footer']" class="mt-auto border-t border-gray-200 dark:border-gray-800 p-4">
          <slot name="sidebar-footer" />
        </div>
        <div class="mt-auto border-t border-gray-200 dark:border-gray-800 p-4">
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

const colorMode = useColorMode()
const route = useRoute()
const sellerStore = useSellerStore()
const feedbackOpen = ref(false)
const userAgent = ref('')
if (import.meta.client) {
  userAgent.value = navigator.userAgent.slice(0, 255)
}

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: 'i-lucide-layout-dashboard' },
  { to: '/dashboard/profile', label: 'Profile', icon: 'i-lucide-user' },
  { to: '/dashboard/shops', label: 'My Shops', icon: 'i-lucide-store' },
  { to: '/dashboard/quotes', label: 'My Quotes', icon: 'i-lucide-file-text' },
  { to: '/dashboard/claims', label: 'Claims', icon: 'i-lucide-shield-check' },
]

function isActive(to: string) {
  if (to === '/dashboard') return route.path === '/dashboard'
  return route.path.startsWith(to)
}

function isShopActive(shopId: number) {
  const id = route.params.id ?? route.params.slug
  return String(shopId) === id
}

onMounted(() => {
  sellerStore.fetchShops()
})
</script>
