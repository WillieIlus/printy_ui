<template>
  <nav class="sticky top-0 z-50 border-b border-[var(--p-border)] bg-[var(--p-surface)] shadow-sm">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div class="flex h-16 items-center justify-between">
        <!-- Logo + Wordmark -->
        <NuxtLink to="/" class="flex items-center gap-3">
          <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl overflow-hidden" style="background: var(--color-primary-600);">
            <CommonPrintyLogoMark img-class="h-6 w-6" />
          </div>
          <div class="flex flex-col justify-center">
            <CommonPrintyWordmark img-class="h-5 sm:h-6 w-auto max-w-[100px] sm:max-w-[120px]" />
            <span class="hidden text-[11px] text-[var(--p-text-muted)] sm:block mt-0.5" style="font-family: var(--font-body);">{{ t('header.tagline') }}</span>
          </div>
        </NuxtLink>

        <!-- Desktop Nav Links -->
        <div class="hidden items-center gap-2 md:flex">
          <NuxtLink
            v-for="link in navLinks"
            :key="link.label"
            :to="link.to"
            class="rounded-lg px-3 py-2 text-sm font-medium transition-colors text-[var(--p-text-dim)] hover:bg-[var(--p-surface-sunken)] dark:hover:bg-[var(--p-surface-raised)] hover:text-[var(--p-text)] min-w-0"
          >
            <span class="flex items-center gap-2 truncate">
              <span class="truncate">{{ link.label }}</span>
              <CommonBadgeCount :count="link.badgeCount" />
            </span>
          </NuxtLink>
        </div>

        <!-- Right side -->
        <div class="flex items-center gap-2 sm:gap-3 min-w-0 shrink-0">
          <ClientOnly>
            <div class="hidden sm:flex items-center rounded-full border border-[var(--p-border)] bg-[var(--p-surface)] p-1 shadow-sm">
              <button
                v-for="option in languageOptions"
                :key="option.value"
                type="button"
                class="rounded-full px-2.5 py-1 text-[0.75rem] font-semibold transition-colors"
                :class="locale === option.value
                  ? 'bg-[var(--p-surface-sunken)] text-[var(--p-text)]'
                  : 'text-[var(--p-text-muted)] hover:text-[var(--p-text)]'"
                :disabled="languageLoading"
                @click="setLanguage(option.value)"
              >
                {{ option.shortLabel }}
              </button>
            </div>
            <template #fallback>
              <div class="hidden sm:flex items-center rounded-full border border-[var(--p-border)] bg-[var(--p-surface)] p-1 shadow-sm">
                <span class="px-2.5 py-1 text-[0.75rem] font-semibold text-[var(--p-text)]">EN</span>
              </div>
            </template>
          </ClientOnly>

          <ThemeCycleButton />

          <!-- User Avatar / Login (ClientOnly: auth state differs between SSR and client) -->
          <ClientOnly>
          <div v-if="authStore.isAuthenticated" class="flex items-center gap-2">
            <UPopover mode="click" :popper="{ placement: 'bottom-end' }">
              <template #default>
                <button class="flex items-center gap-2 rounded-xl border border-[var(--p-border)] bg-[var(--p-surface)] px-3 py-1.5 transition-all hover:border-[var(--p-text-muted)] hover:shadow-sm text-[var(--p-text)]">
                  <CommonAppUserAvatar
                    :src="avatarImage"
                    :alt="userName"
                    :initials="userInitials"
                    :badge-count="headerActivityBadgeCount"
                    size="sm"
                  />
                  <span class="hidden text-sm font-medium sm:inline">{{ userName }}</span>
                  <UIcon name="i-lucide-chevron-down" class="h-4 w-4 text-[var(--p-text-muted)]" />
                </button>
              </template>
              <template #content>
                <div class="w-72 border border-[var(--p-border)] bg-[var(--p-surface)] rounded-xl shadow-xl p-2 flex flex-col gap-1">
                  <div class="mb-1 rounded-xl border border-[var(--p-border)] bg-[var(--p-surface-sunken)] p-3">
                    <div class="flex items-center gap-3">
                      <CommonAppUserAvatar
                        :src="avatarImage"
                        :alt="userName"
                        :initials="userInitials"
                        :badge-count="headerActivityBadgeCount"
                      />
                      <div class="min-w-0">
                        <p class="truncate text-sm font-semibold text-[var(--p-text)]">{{ userName }}</p>
                        <p class="truncate text-xs text-[var(--p-text-muted)]">{{ authStore.user?.email }}</p>
                        <p v-if="activeShopName" class="mt-1 truncate text-xs text-[var(--p-text-muted)]">
                          {{ t('header.account.shop') }}: {{ activeShopName }}
                        </p>
                      </div>
                    </div>
                  </div>
                  <NuxtLink to="/dashboard" class="rounded-lg px-3 py-2 text-sm font-medium text-[var(--p-text)] hover:bg-[var(--p-surface-sunken)] dark:hover:bg-[var(--p-surface-raised)] hover:text-[var(--color-primary-600)]">{{ t('common.dashboard') }}</NuxtLink>
                  <NuxtLink to="/dashboard/profile" class="rounded-lg px-3 py-2 text-sm font-medium text-[var(--p-text)] hover:bg-[var(--p-surface-sunken)] dark:hover:bg-[var(--p-surface-raised)] hover:text-[var(--color-primary-600)]">{{ t('common.profile') }}</NuxtLink>
                  <NuxtLink to="/dashboard/shops" class="rounded-lg px-3 py-2 text-sm font-medium text-[var(--p-text)] hover:bg-[var(--p-surface-sunken)] dark:hover:bg-[var(--p-surface-raised)] hover:text-[var(--color-primary-600)]">{{ t('common.myShops') }}</NuxtLink>
                  <NuxtLink
                    v-if="isSuperuser"
                    to="/super-admin/analytics"
                    class="rounded-lg px-3 py-2 text-sm font-medium text-[var(--p-text)] hover:bg-[var(--p-surface-sunken)] dark:hover:bg-[var(--p-surface-raised)] hover:text-[var(--color-primary-600)]"
                  >
                    {{ t('common.metrics') }}
                  </NuxtLink>
                  <NuxtLink :to="quoteRequestsLink" class="rounded-lg px-3 py-2 text-sm font-medium text-[var(--p-text)] hover:bg-[var(--p-surface-sunken)] dark:hover:bg-[var(--p-surface-raised)] hover:text-[var(--color-primary-600)]">
                    <span class="flex items-center justify-between gap-3">
                      <span>{{ t('header.nav.requestsQuotes') }}</span>
                      <CommonBadgeCount :count="clientRequestBadgeCount" />
                    </span>
                  </NuxtLink>
                  <div v-if="shopInboxItems.length || clientInboxItems.length" class="my-1 border-t border-[var(--p-border-dim)]" />
                  <NuxtLink
                    v-for="item in shopInboxItems"
                    :key="item.key"
                    :to="item.to"
                    class="rounded-lg px-3 py-2 text-sm font-medium text-[var(--p-text)] hover:bg-[var(--p-surface-sunken)] dark:hover:bg-[var(--p-surface-raised)] hover:text-[var(--color-primary-600)]"
                  >
                    <span class="flex items-center justify-between gap-3">
                      <span>{{ item.label }}</span>
                      <CommonBadgeCount :count="item.count" />
                    </span>
                  </NuxtLink>
                  <NuxtLink
                    v-for="item in clientInboxItems"
                    :key="item.key"
                    :to="item.to"
                    class="rounded-lg px-3 py-2 text-sm font-medium text-[var(--p-text)] hover:bg-[var(--p-surface-sunken)] dark:hover:bg-[var(--p-surface-raised)] hover:text-[var(--color-primary-600)]"
                  >
                    <span class="flex items-center justify-between gap-3">
                      <span>{{ item.label }}</span>
                      <CommonBadgeCount :count="item.count" />
                    </span>
                  </NuxtLink>
                  <button
                    v-if="isClient"
                    class="rounded-lg px-3 py-2 text-left text-sm font-medium text-[var(--color-primary-600)] hover:bg-[var(--p-surface-sunken)] dark:hover:bg-[var(--p-surface-raised)] w-full flex items-center gap-2"
                    :disabled="becomingShopOwner"
                    @click="onBecomeShopOwner"
                  >
                    <UIcon name="i-lucide-store" class="h-4 w-4" />
                    {{ becomingShopOwner ? t('header.account.updating') : t('header.account.becomeShopOwner') }}
                  </button>
                  <div class="my-1 border-t border-[var(--p-border-dim)]" />
                  <button class="rounded-lg px-3 py-2 text-left text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 w-full" @click="authStore.logout">
                    {{ t('common.logout') }}
                  </button>
                </div>
              </template>
            </UPopover>
          </div>
          <div v-else class="flex items-center gap-2">
            <NuxtLink to="/auth/login" class="hidden text-sm font-semibold text-[var(--p-text-dim)] transition-colors hover:text-[var(--color-primary-600)] sm:inline-flex">
              {{ t('common.login') }}
            </NuxtLink>
            <NuxtLink
              to="/auth/signup"
              class="cta-button group inline-flex items-center gap-2 rounded-xl bg-flamingo-500 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-flamingo-500/25 transition-all hover:bg-flamingo-400 hover:shadow-flamingo-500/40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-flamingo-500 focus-visible:outline-offset-2"
            >
              {{ t('common.getStarted') }}
              <UIcon name="i-lucide-arrow-right" class="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
            </NuxtLink>
          </div>
          <template #fallback>
            <div class="flex items-center gap-2">
              <NuxtLink to="/auth/login" class="hidden text-sm font-semibold text-[var(--p-text-dim)] transition-colors hover:text-[var(--color-primary-600)] sm:inline-flex">
                {{ t('common.login') }}
              </NuxtLink>
              <NuxtLink
                to="/auth/signup"
                class="cta-button group inline-flex items-center gap-2 rounded-xl bg-flamingo-500 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-flamingo-500/25 transition-all hover:bg-flamingo-400 hover:shadow-flamingo-500/40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-flamingo-500 focus-visible:outline-offset-2"
              >
                {{ t('common.getStarted') }}
                <UIcon name="i-lucide-arrow-right" class="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
              </NuxtLink>
            </div>
          </template>
          </ClientOnly>

          <!-- Mobile Menu Toggle -->
          <button
            class="rounded-lg p-2 text-[var(--p-text-dim)] hover:bg-[var(--p-surface-sunken)] dark:hover:bg-[var(--p-surface-raised)] md:hidden"
            aria-label="Menu"
            @click="mobileOpen = !mobileOpen"
          >
            <UIcon :name="mobileOpen ? 'i-lucide-x' : 'i-lucide-menu'" class="h-6 w-6" />
          </button>
        </div>
      </div>

      <!-- Mobile Menu -->
      <Transition
        enter-active-class="transition duration-200 ease-out"
        enter-from-class="opacity-0 -translate-y-2"
        enter-to-class="opacity-100 translate-y-0"
        leave-active-class="transition duration-150 ease-in"
        leave-from-class="opacity-100 translate-y-0"
        leave-to-class="opacity-0 -translate-y-2"
      >
        <div v-if="mobileOpen" class="border-t border-[var(--p-border)] pb-4 pt-3 md:hidden">
          <div class="grid gap-1">
            <NuxtLink
              v-for="link in navLinks"
              :key="link.label"
              :to="link.to"
              class="rounded-lg px-3 py-2.5 text-sm font-medium text-[var(--p-text)] hover:bg-[var(--p-surface-sunken)] dark:hover:bg-[var(--p-surface-raised)] hover:text-[var(--color-primary-600)]"
              @click="mobileOpen = false"
            >
              <span class="flex items-center justify-between gap-3">
                <span>{{ link.label }}</span>
                <CommonBadgeCount :count="link.badgeCount" />
              </span>
            </NuxtLink>
          </div>
          <div class="mt-3 grid gap-2 px-3 sm:hidden">
            <div class="rounded-xl border border-[var(--p-border)] bg-[var(--p-surface)] p-1">
              <button
                v-for="option in languageOptions"
                :key="option.value"
                type="button"
                class="w-full rounded-lg px-3 py-2 text-left text-sm font-medium transition-colors"
                :class="locale === option.value
                  ? 'bg-[var(--p-surface-sunken)] text-[var(--p-text)]'
                  : 'text-[var(--p-text-muted)] hover:text-[var(--p-text)]'"
                :disabled="languageLoading"
                @click="setLanguage(option.value); mobileOpen = false"
              >
                {{ option.label }}
              </button>
            </div>
          </div>
          <div v-if="authStore.isAuthenticated && isClient" class="mt-3 grid gap-2 px-3">
            <button
              class="btn-primary cta-button flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-center text-sm font-semibold"
              :disabled="becomingShopOwner"
              @click="onBecomeShopOwner(); mobileOpen = false"
            >
              <UIcon name="i-lucide-store" class="h-4 w-4" />
              {{ becomingShopOwner ? t('header.account.updating') : t('header.account.becomeShopOwner') }}
            </button>
          </div>
          <div v-if="!authStore.isAuthenticated" class="mt-3 grid gap-2 px-3">
            <NuxtLink to="/auth/login" class="rounded-xl border border-[var(--p-border)] bg-[var(--p-surface)] px-4 py-2.5 text-center text-sm font-semibold text-[var(--p-text)] hover:bg-[var(--p-surface-sunken)] dark:hover:bg-[var(--p-surface-raised)]" @click="mobileOpen = false">
              {{ t('common.login') }}
            </NuxtLink>
            <NuxtLink to="/auth/signup" class="cta-button group inline-flex items-center justify-center gap-2 rounded-xl bg-flamingo-500 px-4 py-2.5 text-center text-sm font-semibold text-white transition-colors hover:bg-flamingo-400" @click="mobileOpen = false">
              {{ t('common.getStarted') }}
              <UIcon name="i-lucide-arrow-right" class="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
            </NuxtLink>
          </div>
        </div>
      </Transition>
    </div>
  </nav>
</template>

<script setup lang="ts">
import CommonBadgeCount from '~/components/common/BadgeCount.vue'
import CommonAppUserAvatar from '~/components/common/AppUserAvatar.vue'
import { useI18n } from 'vue-i18n'
import { useAuthStore } from '~/stores/auth'
import { useActivityBadgesStore } from '~/stores/activityBadges'
import { useUserStore } from '~/stores/user'
import { useSellerStore } from '~/stores/seller'
import { useShopStore } from '~/stores/shop'
import { useLanguagePreference } from '~/composables/useLanguagePreference'

const authStore = useAuthStore()
const activityBadgesStore = useActivityBadgesStore()
const userStore = useUserStore()
const sellerStore = useSellerStore()
const shopStore = useShopStore()
const { locale, loading: languageLoading, options: languageOptions, setLanguage, initializeLanguage } = useLanguagePreference()
const { t } = useI18n()
const mobileOpen = ref(false)
const becomingShopOwner = ref(false)
const notification = useNotification()

const isClient = computed(() => authStore.normalizedRole === 'client' || !authStore.user?.role)
const isSuperuser = computed(() => Boolean(authStore.user?.is_superuser))
const activeShopSlug = computed(() => shopStore.currentShop?.slug || shopStore.selectedShopSlug || shopStore.myShops[0]?.slug || null)
const activeShop = computed(() => {
  const slug = activeShopSlug.value
  if (!slug) return null
  return shopStore.currentShop?.slug === slug
    ? shopStore.currentShop
    : shopStore.myShops.find(shop => shop.slug === slug) ?? null
})
const activeShopName = computed(() => activeShop.value?.name || null)
const avatarImage = computed(() => activeShop.value?.logo || authStore.user?.avatar || userStore.currentUser?.avatar || null)
const shopRequestBadgeCount = computed(() =>
  activityBadgesStore.summary.shop.incoming_requests
  + activityBadgesStore.summary.shop.messages_replies
  + activityBadgesStore.summary.shop.pending_quote_actions
)
const clientRequestBadgeCount = computed(() => authStore.isAuthenticated && !authStore.isShopOwner ? activityBadgesStore.clientTotal : 0)
const headerActivityBadgeCount = computed(() => {
  const roleCount = (authStore.isShopOwner || authStore.isStaffRole || (shopStore.myShops?.length ?? 0) > 0)
    ? shopRequestBadgeCount.value
    : clientRequestBadgeCount.value
  return Math.max(roleCount, activityBadgesStore.summary.notifications.unread_total)
})

/** Customers land in the client request workspace; shop owners/staff go to dashboard routes. */
const quoteRequestsLink = computed(() => {
  if (authStore.isShopOwner || authStore.isStaffRole || (shopStore.myShops?.length ?? 0) > 0) return '/dashboard'
  return '/quote-draft'
})

async function onBecomeShopOwner() {
  if (becomingShopOwner.value) return
  becomingShopOwner.value = true
  try {
    const result = await userStore.updateMe({ role: 'shop_owner' })
    if (result.success) {
      await authStore.fetchMe()
      await shopStore.fetchMyShops()
      await navigateTo(shopStore.myShops.length ? '/dashboard' : '/dashboard/shops/create')
    } else {
      notification.error(userStore.error ?? 'Failed to update role')
    }
  } finally {
    becomingShopOwner.value = false
  }
}

const navLinks = computed(() => [
  { label: t('common.home'), to: '/', badgeCount: 0 },
  { label: t('header.nav.gallery'), to: '/gallery', badgeCount: 0 },
  { label: t('header.nav.shops'), to: '/shops', badgeCount: 0 },
  { label: t('header.nav.locations'), to: '/locations', badgeCount: 0 },
  { label: t('header.nav.requestsQuotes'), to: '/quote-draft', badgeCount: clientRequestBadgeCount.value },
])

const shopInboxItems = computed(() => {
  if (!(authStore.isShopOwner || authStore.isStaffRole || (shopStore.myShops?.length ?? 0) > 0) || !activeShopSlug.value) {
    return []
  }

  return [
    { key: 'incoming', label: t('header.inbox.shopIncoming'), count: activityBadgesStore.summary.shop.incoming_requests, to: `/dashboard/shops/${activeShopSlug.value}/incoming-requests?view=new` },
    { key: 'messages', label: t('header.inbox.shopMessages'), count: activityBadgesStore.summary.shop.messages_replies, to: `/dashboard/shops/${activeShopSlug.value}/incoming-requests?view=messages` },
    { key: 'actions', label: t('header.inbox.shopActions'), count: activityBadgesStore.summary.shop.pending_quote_actions, to: `/dashboard/shops/${activeShopSlug.value}/incoming-requests?view=actions` },
  ]
})

const clientInboxItems = computed(() => {
  if (!authStore.isAuthenticated || (authStore.isShopOwner && !isClient.value)) return []

  return [
    { key: 'quotes', label: t('header.inbox.clientQuotes'), count: activityBadgesStore.summary.client.new_quotes, to: '/quote-draft' },
    { key: 'replies', label: t('header.inbox.clientReplies'), count: activityBadgesStore.summary.client.shop_replies, to: '/quote-draft' },
    { key: 'updates', label: t('header.inbox.clientUpdates'), count: activityBadgesStore.summary.client.request_updates, to: '/quote-draft' },
  ]
})

const userName = computed(() => {
  const u = authStore.user
  if (!u) return 'User'
  return [u.first_name, u.last_name].filter(Boolean).join(' ') || u.email?.split('@')[0] || 'User'
})

const userInitials = computed(() => {
  const u = authStore.user
  if (!u) return 'U'
  if (u.first_name && u.last_name) return `${u.first_name[0]}${u.last_name[0]}`.toUpperCase()
  if (u.first_name) return u.first_name.slice(0, 2).toUpperCase()
  if (u.email) return u.email[0]?.toUpperCase() ?? 'U'
  return 'U'
})

onMounted(() => {
  void initializeLanguage()
  if (authStore.isAuthenticated) {
    sellerStore.fetchShops()
    shopStore.fetchMyShops()
    void activityBadgesStore.fetchSummary(activeShopSlug.value)
    activityBadgesStore.startPolling(activeShopSlug.value)
  }
})

watch(() => authStore.isAuthenticated, (isAuthenticated) => {
  if (!isAuthenticated) {
    activityBadgesStore.stopPolling()
    return
  }
  void activityBadgesStore.fetchSummary(activeShopSlug.value)
  activityBadgesStore.startPolling(activeShopSlug.value)
})

watch(activeShopSlug, (shopSlug) => {
  if (!authStore.isAuthenticated) return
  void activityBadgesStore.fetchSummary(shopSlug)
  activityBadgesStore.startPolling(shopSlug)
})

onBeforeUnmount(() => {
  activityBadgesStore.stopPolling()
})
</script>
