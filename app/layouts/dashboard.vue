<template>
  <div class="min-h-screen overflow-x-hidden bg-[var(--p-bg)] text-[var(--p-text)]">
    <div class="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_top_left,rgba(240,82,36,0.12),transparent_24%),radial-gradient(circle_at_bottom_right,rgba(59,130,246,0.1),transparent_28%)]" />

    <header class="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-4 border-b border-white/10 bg-slate-950/70 px-4 backdrop-blur-xl sm:px-6">
      <NuxtLink to="/dashboard" class="flex items-center gap-3 shrink-0 group">
        <span class="grid h-10 w-10 place-items-center rounded-2xl overflow-hidden shrink-0 border border-white/10 shadow-[0_10px_30px_rgba(225,53,21,0.25)]" style="background: linear-gradient(135deg, #f05224, #e13515);">
          <CommonPrintyLogoMark img-class="h-5 w-5" />
        </span>
        <div class="hidden sm:block">
          <CommonPrintyWordmark img-class="h-5 w-auto max-w-[90px]" />
          <p class="mt-1 text-[10px] uppercase tracking-[0.24em] text-slate-400">Print Operations</p>
        </div>
      </NuxtLink>
      <div class="min-w-0 flex-1">
        <div class="hidden lg:flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs text-slate-300">
          <UIcon name="i-lucide-sparkles" class="h-4 w-4 text-orange-300" />
          <span>{{ assistantLine }}</span>
        </div>
      </div>
      <ThemeCycleButton />
      <slot name="topbar-end" />
    </header>

    <div class="flex min-h-[calc(100vh-4rem)] flex-1 overflow-hidden min-w-0">
      <aside
        class="hidden border-r border-white/10 bg-slate-950/65 backdrop-blur-xl md:flex md:w-[19rem] md:shrink-0 md:flex-col"
      >
        <nav class="flex flex-1 flex-col gap-6 overflow-y-auto p-4">
          <div class="overflow-hidden rounded-[30px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.08),rgba(255,255,255,0.03))] shadow-[0_20px_60px_rgba(15,23,42,0.45)]">
            <div class="border-b border-white/10 bg-[radial-gradient(circle_at_top_right,rgba(240,82,36,0.2),transparent_45%)] p-4">
              <div class="flex items-start justify-between gap-3">
                <div>
                  <p class="text-[11px] uppercase tracking-[0.28em] text-slate-400">Current Shop</p>
                  <p class="mt-2 text-xs leading-5 text-slate-300">
                    Machines, paper compatibility, and product setup all flow from the active shop workspace.
                  </p>
                </div>
                <span class="inline-flex items-center gap-1 rounded-full border border-orange-400/20 bg-orange-500/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-orange-200">
                  <UIcon name="i-lucide-orbit" class="h-3.5 w-3.5" />
                  Live
                </span>
              </div>
            </div>

            <div class="p-4">
            <template v-if="activeShop">
              <div class="flex items-start gap-3">
                <div class="flex h-11 w-11 items-center justify-center rounded-2xl border border-orange-400/20 bg-orange-500/10">
                  <UIcon name="i-lucide-store" class="h-5 w-5 text-orange-300" />
                </div>
                <div class="min-w-0 flex-1">
                  <p class="truncate text-sm font-semibold text-white">{{ activeShop.name }}</p>
                  <p class="truncate text-xs text-slate-400">/{{ activeShop.slug }}</p>
                  <p class="mt-2 text-xs leading-5 text-slate-300">{{ shopContextLine }}</p>
                </div>
              </div>
              <div class="mt-4 grid grid-cols-2 gap-2">
                <NuxtLink
                  v-for="link in shopContextLinks"
                  :key="link.to"
                  :to="link.to"
                  class="flex items-center gap-2 rounded-2xl border px-3 py-2.5 text-xs font-medium transition"
                  :class="isActive(link.to)
                    ? 'border-orange-400/25 bg-orange-500/14 text-orange-100'
                    : 'border-white/10 bg-white/5 text-slate-200 hover:border-white/15 hover:bg-white/8'"
                >
                  <UIcon :name="link.icon" class="h-4 w-4 shrink-0" />
                  <span class="truncate">{{ link.label }}</span>
                </NuxtLink>
              </div>
              <NuxtLink
                :to="`/dashboard/shops/${activeShop.slug}`"
                class="mt-4 flex items-center justify-between rounded-2xl border border-orange-400/20 bg-orange-500/12 px-3 py-2.5 text-sm text-orange-100 transition hover:bg-orange-500/18"
              >
                <span>Open shop workspace</span>
                <UIcon name="i-lucide-arrow-up-right" class="h-4 w-4 text-orange-300" />
              </NuxtLink>
            </template>
            <template v-else>
              <p class="text-sm leading-6 text-slate-300">
                Start by registering your first print shop, then add machines, parent sheets, and products.
              </p>
              <UButton to="/dashboard/shops/create" color="primary" class="mt-4 w-full justify-center">
                Register New Shop
              </UButton>
            </template>
            </div>
          </div>

          <div class="space-y-3">
            <div class="flex items-center justify-between px-2">
              <p class="text-[11px] font-semibold uppercase tracking-[0.28em] text-slate-500">Quick Actions</p>
              <span class="text-[10px] uppercase tracking-[0.2em] text-slate-600">Fast path</span>
            </div>
            <div class="grid grid-cols-1 gap-2">
              <NuxtLink
                v-for="shortcut in shortcuts"
                :key="shortcut.label"
                :to="shortcut.to"
                class="flex items-center gap-3 rounded-2xl border px-3 py-3 text-sm transition"
                :class="shortcut.emphasis
                  ? 'border-orange-400/30 bg-orange-500/12 text-orange-100 shadow-[0_12px_30px_rgba(240,82,36,0.12)] hover:bg-orange-500/18'
                  : 'border-white/10 bg-white/5 text-slate-200 hover:bg-white/10'"
              >
                <span class="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-black/20">
                  <UIcon :name="shortcut.icon" class="h-4 w-4 shrink-0" />
                </span>
                <div class="min-w-0 flex-1">
                  <p class="truncate font-medium">{{ shortcut.label }}</p>
                  <p class="truncate text-xs text-slate-400">{{ shortcut.description }}</p>
                </div>
                <UIcon name="i-lucide-arrow-up-right" class="h-4 w-4 shrink-0" />
              </NuxtLink>
            </div>
          </div>

          <div class="space-y-4">
            <template v-for="group in navGroups" :key="group.label">
              <div class="rounded-[26px] border border-white/10 bg-white/[0.04] p-3 shadow-[0_12px_40px_rgba(15,23,42,0.22)]">
                <div class="flex items-start gap-3 px-1 pb-3">
                  <span class="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-black/20">
                    <UIcon :name="group.icon" class="h-4 w-4 text-slate-200" />
                  </span>
                  <div class="min-w-0">
                    <p class="text-[11px] font-semibold uppercase tracking-[0.28em] text-slate-500">{{ group.label }}</p>
                    <p class="mt-1 text-xs leading-5 text-slate-400">{{ group.helper }}</p>
                  </div>
                </div>
                <NuxtLink
                  v-for="item in group.items"
                  :key="`${group.label}-${item.label}`"
                  :to="item.to"
                  class="mt-1 flex items-center justify-between rounded-2xl px-3 py-2.5 text-sm transition"
                  :class="isActive(item.to)
                    ? 'border border-orange-400/25 bg-orange-500/12 text-orange-100 shadow-[0_12px_30px_rgba(240,82,36,0.12)]'
                    : 'border border-transparent text-slate-300 hover:border-white/10 hover:bg-white/6'"
                >
                  <span class="flex min-w-0 items-center gap-3">
                    <span class="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-black/20">
                      <UIcon :name="item.icon" class="h-4 w-4 shrink-0" />
                      <span
                        v-if="item.to === '/dashboard/notifications' && notificationsStore.unreadCount > 0"
                        class="absolute -right-1.5 -top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-orange-500 px-1 text-[10px] font-bold text-white"
                      >
                        {{ notificationsStore.unreadCount > 99 ? '99+' : notificationsStore.unreadCount }}
                      </span>
                    </span>
                    <span class="min-w-0">
                      <span class="block truncate font-medium">{{ item.label }}</span>
                      <span class="block truncate text-xs text-slate-500">{{ item.description }}</span>
                    </span>
                  </span>
                  <UIcon name="i-lucide-chevron-right" class="h-4 w-4 text-slate-500" />
                </NuxtLink>
              </div>
            </template>
          </div>

          <div class="space-y-3">
            <div class="flex items-center justify-between px-2">
              <p class="text-[11px] font-semibold uppercase tracking-[0.28em] text-slate-500">My Shops</p>
              <NuxtLink to="/dashboard/shops" class="text-[11px] font-medium text-orange-300 transition hover:text-orange-200">
                View all
              </NuxtLink>
            </div>
            <ClientOnly>
              <div v-if="sellerStore.shops.length" class="space-y-2">
                <NuxtLink
                  v-for="shop in sellerStore.shops"
                  :key="shop.id"
                  :to="`/dashboard/shops/${shop.slug}`"
                  class="flex items-center gap-3 rounded-2xl border px-3 py-2.5 text-sm transition"
                  :class="isShopActive(shop.slug)
                    ? 'border-orange-400/25 bg-orange-500/10 text-orange-100'
                    : 'border-white/10 bg-white/5 text-slate-300 hover:bg-white/10'"
                >
                  <span class="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-black/20">
                    <UIcon name="i-lucide-store" class="h-4 w-4 shrink-0" />
                  </span>
                  <div class="min-w-0 flex-1">
                    <span class="block truncate font-medium">{{ shop.name }}</span>
                    <span class="block truncate text-xs text-slate-500">/{{ shop.slug }}</span>
                  </div>
                  <UIcon name="i-lucide-chevron-right" class="h-4 w-4 text-slate-500" />
                </NuxtLink>
              </div>
              <div v-else class="rounded-2xl border border-dashed border-white/10 bg-white/[0.03] p-4 text-sm text-slate-400">
                No shops yet. Create one to unlock machine setup, paper sizing, and product pricing.
              </div>
            </ClientOnly>
          </div>
        </nav>

        <div v-if="$slots['sidebar-footer']" class="border-t border-white/10 p-4">
          <slot name="sidebar-footer" />
        </div>

        <div class="border-t border-white/10 p-4">
          <UButton color="neutral" variant="outline" size="sm" icon="i-lucide-message-square-plus" class="w-full justify-start" @click="feedbackOpen = true">
            Send Feedback
          </UButton>
        </div>
      </aside>

      <DashboardBottomNav />

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

      <main class="flex-1 min-w-0 overflow-auto px-4 pb-20 pt-4 sm:px-6 sm:pt-6 lg:px-8 lg:pt-8 md:pb-6 lg:pb-8">
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
      :page="route?.path"
      :user-agent="userAgent"
      @update:open="feedbackOpen = $event"
    />
  </div>
</template>

<script setup lang="ts">
import { useSellerStore } from '~/stores/seller'
import { useNotificationsStore } from '~/stores/notifications'
import { useSetupStatus } from '~/composables/useSetupStatus'

const route = useRoute()
const sellerStore = useSellerStore()
const notificationsStore = useNotificationsStore()
const { refresh: refreshSetup } = useSetupStatus()
const feedbackOpen = ref(false)
const userAgent = ref('')
if (import.meta.client) {
  userAgent.value = navigator.userAgent.slice(0, 255)
}

const navGroups = [
  {
    label: 'Overview',
    icon: 'i-lucide-panel-left-open',
    helper: 'High-level workspace access and account surfaces.',
    items: [
      { to: '/dashboard', label: 'Dashboard Home', icon: 'i-lucide-layout-dashboard', description: 'Track setup readiness and daily operations.' },
      { to: '/dashboard/shops', label: 'Shops', icon: 'i-lucide-store', description: 'Move between print locations and shop workspaces.' },
      { to: '/dashboard/profile', label: 'Profile', icon: 'i-lucide-user', description: 'Manage account details and personal preferences.' },
      { to: '/dashboard/notifications', label: 'Notifications', icon: 'i-lucide-bell', description: 'Review unread updates, requests, and alerts.' },
    ],
  },
  {
    label: 'Production',
    icon: 'i-lucide-printer',
    helper: 'Configure products around machine limits, stock, and costing.',
    items: [
      { to: '/dashboard/machines', label: 'Machines', icon: 'i-lucide-printer', description: 'Define print capacity, sheet fit, and imposition constraints.' },
      { to: '/dashboard/products', label: 'Products', icon: 'i-lucide-package', description: 'Map sellable print products to operational setup.' },
      { to: '/dashboard/papers', label: 'Papers & Sizes', icon: 'i-lucide-file-stack', description: 'Manage stock sheets, paper sizes, and availability.' },
      { to: '/dashboard/pricing', label: 'Pricing', icon: 'i-lucide-wallet', description: 'Keep rates aligned to production reality.' },
      { to: '/dashboard/materials', label: 'Materials', icon: 'i-lucide-layers', description: 'Track substrates and consumables used in jobs.' },
      { to: '/dashboard/finishing', label: 'Finishing', icon: 'i-lucide-scissors', description: 'Set post-press operations and finishing coverage.' },
    ],
  },
  {
    label: 'Jobs & Sales',
    icon: 'i-lucide-briefcase-business',
    helper: 'Run quoting, order intake, and production work from one shell.',
    items: [
      { to: '/dashboard/quotes', label: 'Quotes', icon: 'i-lucide-file-text', description: 'Create and track customer pricing responses.' },
      { to: '/dashboard/jobs', label: 'Jobs', icon: 'i-lucide-briefcase', description: 'Follow live production work and delivery flow.' },
      { to: '/dashboard/claims', label: 'Claims', icon: 'i-lucide-shield-check', description: 'Handle issues, disputes, and service recovery.' },
    ],
  },
]

const activeShop = computed(() => {
  const slug = typeof route.params.slug === 'string' ? route.params.slug : ''
  return sellerStore.shops.find(shop => shop.slug === slug) ?? sellerStore.shops[0] ?? null
})

const shortcuts = computed(() => {
  const slug = activeShop.value?.slug
  return [
    {
      label: 'Register New Shop',
      to: '/dashboard/shops/create',
      icon: 'i-lucide-store',
      description: 'Open a new print workspace.',
      emphasis: true,
    },
    {
      label: 'Add Machine',
      to: slug ? `/dashboard/shops/${slug}/machines` : '/dashboard/machines',
      icon: 'i-lucide-plus-circle',
      description: 'Capture press size and production capacity.',
      emphasis: true,
    },
    {
      label: 'Create Product',
      to: slug ? `/dashboard/shops/${slug}/products/create` : '/dashboard/products',
      icon: 'i-lucide-package-plus',
      description: 'Launch a sellable print product.',
      emphasis: false,
    },
  ]
})

const shopContextLinks = computed(() => {
  const slug = activeShop.value?.slug
  if (!slug) return []

  return [
    { label: 'Machines', to: `/dashboard/shops/${slug}/machines`, icon: 'i-lucide-printer' },
    { label: 'Products', to: `/dashboard/shops/${slug}/products`, icon: 'i-lucide-package' },
    { label: 'Pricing', to: `/dashboard/shops/${slug}/pricing`, icon: 'i-lucide-wallet' },
    { label: 'Setup', to: `/dashboard/shops/${slug}/setup`, icon: 'i-lucide-list-checks' },
  ]
})

const shopContextLine = computed(() => {
  if (!activeShop.value) {
    return 'Choose a shop to review capacity, setup gaps, and product readiness.'
  }

  return 'Use this workspace to align machines, paper fit, and pricing before products go live.'
})

const assistantLine = computed(() => {
  if (!sellerStore.shops.length) {
    return 'Register your first shop to start pricing jobs, managing stock papers, and planning imposition.'
  }
  if (!activeShop.value) {
    return 'Choose a shop to review machine readiness, product setup, and pricing coverage.'
  }
  return `You are managing ${activeShop.value.name}. Keep machines, papers, and products aligned so costing stays accurate.`
})

function isActive(to: string) {
  if (to === '/dashboard') return route?.path === '/dashboard'
  return route?.path.startsWith(to)
}

function isShopActive(slug: string) {
  return route.params.slug === slug
}

onMounted(() => {
  sellerStore.fetchShops()
  refreshSetup()
  notificationsStore.fetchUnreadCount()
})
</script>
