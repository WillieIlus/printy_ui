<template>
  <div class="min-h-screen bg-[var(--p-bg)] text-[var(--p-text)]">
    <header class="sticky top-0 z-40 border-b border-[var(--p-border)] bg-[color:color-mix(in_srgb,var(--p-surface)_88%,white_12%)]/95 backdrop-blur">
      <div class="mx-auto flex h-16 max-w-[1600px] items-center gap-4 px-4 sm:px-6 lg:px-8">
        <UButton
          icon="i-lucide-menu"
          color="neutral"
          variant="ghost"
          class="lg:hidden"
          aria-label="Toggle navigation"
          @click="sidebarOpen = true"
        />

        <NuxtLink to="/dashboard" class="flex min-w-0 items-center gap-3">
          <span class="grid h-10 w-10 place-items-center rounded-2xl border border-[var(--p-border)] bg-[var(--p-surface)] shadow-sm">
            <CommonPrintyLogoMark img-class="h-5 w-5" />
          </span>
          <div class="min-w-0">
            <CommonPrintyWordmark img-class="h-5 w-auto max-w-[100px]" />
            <p class="text-[11px] uppercase tracking-[0.24em] text-[var(--p-text-muted)]">Admin Workspace</p>
          </div>
        </NuxtLink>

        <div class="min-w-0 flex-1">
          <p class="truncate text-sm text-[var(--p-text-muted)]">
            {{ headerLine }}
          </p>
        </div>

        <ThemeCycleButton />
      </div>
    </header>

    <div class="mx-auto flex min-h-[calc(100vh-4rem)] max-w-[1600px]">
      <Transition name="fade">
        <div
          v-if="sidebarOpen"
          class="fixed inset-0 z-40 bg-slate-950/35 lg:hidden"
          @click="sidebarOpen = false"
        />
      </Transition>

      <aside
        class="fixed inset-y-0 left-0 z-50 w-[18.5rem] border-r border-[var(--p-border)] bg-[var(--p-surface)] transition-transform duration-200 lg:sticky lg:top-16 lg:z-10 lg:h-[calc(100vh-4rem)] lg:translate-x-0"
        :class="sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'"
      >
        <div class="flex h-full flex-col">
          <div class="border-b border-[var(--p-border)] px-4 py-4">
            <div class="flex items-center justify-between gap-3 lg:hidden">
              <p class="text-sm font-semibold text-[var(--p-text)]">Navigation</p>
              <UButton
                color="neutral"
                variant="ghost"
                icon="i-lucide-x"
                aria-label="Close navigation"
                @click="sidebarOpen = false"
              />
            </div>

            <div class="mt-1 space-y-3 lg:mt-0">
              <div class="rounded-2xl border border-[var(--p-border)] bg-[var(--p-surface-sunken)] p-4">
                <p class="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--p-text-muted)]">Current Shop</p>
                <template v-if="sellerStore.shops.length">
                  <USelectMenu
                    v-model="selectedShopValue"
                    :items="shopOptions"
                    value-key="value"
                    class="mt-3 w-full"
                  />
                  <p class="mt-3 text-sm leading-6 text-[var(--p-text-muted)]">
                    Use one shop workspace at a time. Actions stay inside the page that owns them.
                  </p>
                </template>
                <template v-else>
                  <p class="mt-2 text-sm leading-6 text-[var(--p-text-muted)]">
                    Create your first shop to unlock the full admin workspace.
                  </p>
                  <UButton to="/dashboard/shops/create" color="primary" class="mt-3 w-full justify-center">
                    Create Shop
                  </UButton>
                </template>
              </div>
            </div>
          </div>

          <nav class="flex-1 space-y-6 overflow-y-auto px-4 py-5">
            <section
              v-for="section in navSections"
              :key="section.label"
              :class="section.kind === 'utility' ? 'border-t border-[var(--p-border)] pt-5' : ''"
            >
              <p class="mb-2 px-3 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--p-text-muted)]">
                {{ section.label }}
              </p>
              <div class="space-y-1">
                <template v-for="item in section.items" :key="`${section.label}-${item.label}`">
                  <NuxtLink
                    v-if="item && item.to"
                    :to="item.to"
                    class="flex items-start gap-3 rounded-2xl px-3 py-3 transition"
                    :class="navItemClass(section.kind, item.to, item.label)"
                    @click="handleLinkClick"
                  >
                    <span class="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-[var(--p-border)] bg-[var(--p-surface)]">
                      <UIcon :name="item.icon" class="h-4 w-4" />
                    </span>
                    <span class="min-w-0 flex-1">
                      <span class="flex items-center justify-between gap-3">
                        <span class="truncate text-sm font-medium">{{ item.label }}</span>
                        <CommonBadgeCount :count="item.badgeCount" />
                        <UBadge
                          v-if="item.badge"
                          :color="item.badge === 'Missing' ? 'warning' : 'primary'"
                          variant="soft"
                          size="xs"
                        >
                          {{ item.badge }}
                        </UBadge>
                      </span>
                      <span v-if="item.helper" class="mt-1 block text-xs leading-5 text-[var(--p-text-muted)]">
                        {{ item.helper }}
                      </span>
                    </span>
                  </NuxtLink>
                  <button
                    v-else-if="item"
                    type="button"
                    class="flex items-start gap-3 rounded-2xl px-3 py-3 transition"
                    :class="navItemClass(section.kind, item.to, item.label)"
                    @click="handleNavItemClick(item)"
                  >
                    <span class="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-[var(--p-border)] bg-[var(--p-surface)]">
                      <UIcon :name="item.icon" class="h-4 w-4" />
                    </span>
                    <span class="min-w-0 flex-1">
                      <span class="flex items-center justify-between gap-3">
                        <span class="truncate text-sm font-medium">{{ item.label }}</span>
                        <CommonBadgeCount :count="item.badgeCount" />
                        <UBadge
                          v-if="item.badge"
                          :color="item.badge === 'Missing' ? 'warning' : 'primary'"
                          variant="soft"
                          size="xs"
                        >
                          {{ item.badge }}
                        </UBadge>
                      </span>
                      <span v-if="item.helper" class="mt-1 block text-xs leading-5 text-[var(--p-text-muted)]">
                        {{ item.helper }}
                      </span>
                    </span>
                  </button>
                </template>
              </div>
            </section>
          </nav>
        </div>
      </aside>

      <main class="min-w-0 flex-1 px-4 py-5 sm:px-6 lg:px-8 lg:py-8">
        <div class="mx-auto max-w-6xl">
          <slot />
        </div>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import CommonBadgeCount from '~/components/common/BadgeCount.vue'
import { useSellerStore } from '~/stores/seller'
import { useActivityBadgesStore } from '~/stores/activityBadges'
import { useSetupStatus } from '~/composables/useSetupStatus'
import { useAdminWorkspace } from '~/composables/useAdminWorkspace'

const route = useRoute()
const sellerStore = useSellerStore()
const activityBadgesStore = useActivityBadgesStore()
const { refresh: refreshSetup } = useSetupStatus()
const { navSections, selectedShop, selectedShopSlug } = useAdminWorkspace()

const sidebarOpen = ref(false)

const shopOptions = computed(() =>
  sellerStore.shops.map(shop => ({
    label: shop.name,
    value: shop.slug,
  }))
)

const selectedShopValue = computed({
  get: () => selectedShopSlug.value || sellerStore.shops[0]?.slug || '',
  set: (value: string | { value: string } | null) => {
    const slug = typeof value === 'object' && value ? value.value : value
    if (!slug || slug === selectedShopSlug.value) return
    navigateTo(`/dashboard/shops/${slug}`)
  },
})

const headerLine = computed(() => {
  if (!sellerStore.shops.length) {
    return 'Create a shop, complete setup, and manage all admin work from the left navigation.'
  }
  return selectedShop.value
    ? `${selectedShop.value.name} is active. Open a section from the left to manage setup, quotes, and settings.`
    : 'Select a shop to work on one workspace at a time.'
})

function isActive(to?: string) {
  if (!to) return false
  const [path = '', queryString] = to.split('?')
  if (path === '/dashboard') return route.path === '/dashboard'
  if (!route.path.startsWith(path)) return false
  if (!queryString) return true

  const params = new URLSearchParams(queryString)
  return Array.from(params.entries()).every(([key, value]) => String(route.query[key] ?? '') === value)
}

function navItemClass(sectionKind?: string, to?: string, label?: string) {
  if (isActive(to)) {
    return 'bg-[var(--p-surface-sunken)] text-[var(--p-text)] shadow-sm'
  }

  if (sectionKind === 'utility' && label === 'Sign out') {
    return 'text-red-600 hover:bg-red-500/8 hover:text-red-700 dark:text-red-300 dark:hover:bg-red-500/12 dark:hover:text-red-200'
  }

  if (sectionKind === 'utility') {
    return 'text-[var(--p-text-muted)] hover:bg-[var(--p-surface-sunken)]/70 hover:text-[var(--p-text)]'
  }

  return 'text-[var(--p-text-dim)] hover:bg-[var(--p-surface-sunken)]/70 hover:text-[var(--p-text)]'
}

async function handleNavItemClick(item: { action?: () => void | Promise<void> }) {
  sidebarOpen.value = false
  if (!item.action) return
  await item.action()
}

function handleLinkClick() {
  sidebarOpen.value = false
}

watch(() => route.fullPath, () => {
  sidebarOpen.value = false
})

onMounted(async () => {
  await sellerStore.fetchShops()
  await refreshSetup()
  if (selectedShopSlug.value) {
    await activityBadgesStore.fetchSummary(selectedShopSlug.value)
    activityBadgesStore.startPolling(selectedShopSlug.value)
  }
})

watch(selectedShopSlug, (slug) => {
  if (!slug) {
    activityBadgesStore.stopPolling()
    return
  }
  void activityBadgesStore.fetchSummary(slug)
  activityBadgesStore.startPolling(slug)
})

onBeforeUnmount(() => {
  activityBadgesStore.stopPolling()
})
</script>
