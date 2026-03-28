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
            <span class="hidden text-[11px] text-[var(--p-text-muted)] sm:block mt-0.5" style="font-family: var(--font-body);">Your Price, Instantly</span>
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
            <span class="truncate">{{ link.label }}</span>
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
                  <div class="flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold text-white shrink-0" style="background: var(--color-primary-600);">
                    {{ userInitials }}
                  </div>
                  <span class="hidden text-sm font-medium sm:inline">{{ userName }}</span>
                  <UIcon name="i-lucide-chevron-down" class="h-4 w-4 text-[var(--p-text-muted)]" />
                </button>
              </template>
              <template #content>
                <div class="w-48 border border-[var(--p-border)] bg-[var(--p-surface)] rounded-xl shadow-xl p-2 flex flex-col gap-1">
                  <NuxtLink to="/dashboard" class="rounded-lg px-3 py-2 text-sm font-medium text-[var(--p-text)] hover:bg-[var(--p-surface-sunken)] dark:hover:bg-[var(--p-surface-raised)] hover:text-[var(--color-primary-600)]">Dashboard</NuxtLink>
                  <NuxtLink to="/dashboard/profile" class="rounded-lg px-3 py-2 text-sm font-medium text-[var(--p-text)] hover:bg-[var(--p-surface-sunken)] dark:hover:bg-[var(--p-surface-raised)] hover:text-[var(--color-primary-600)]">Profile</NuxtLink>
                  <NuxtLink to="/dashboard/shops" class="rounded-lg px-3 py-2 text-sm font-medium text-[var(--p-text)] hover:bg-[var(--p-surface-sunken)] dark:hover:bg-[var(--p-surface-raised)] hover:text-[var(--color-primary-600)]">My Shops</NuxtLink>
                  <NuxtLink :to="quoteRequestsLink" class="rounded-lg px-3 py-2 text-sm font-medium text-[var(--p-text)] hover:bg-[var(--p-surface-sunken)] dark:hover:bg-[var(--p-surface-raised)] hover:text-[var(--color-primary-600)]">Quote Requests</NuxtLink>
                  <button
                    v-if="isClient"
                    class="rounded-lg px-3 py-2 text-left text-sm font-medium text-[var(--color-primary-600)] hover:bg-[var(--p-surface-sunken)] dark:hover:bg-[var(--p-surface-raised)] w-full flex items-center gap-2"
                    :disabled="becomingShopOwner"
                    @click="onBecomeShopOwner"
                  >
                    <UIcon name="i-lucide-store" class="h-4 w-4" />
                    {{ becomingShopOwner ? 'Updating...' : 'Become a shop owner' }}
                  </button>
                  <div class="my-1 border-t border-[var(--p-border-dim)]" />
                  <button class="rounded-lg px-3 py-2 text-left text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 w-full" @click="authStore.logout">
                    Log Out
                  </button>
                </div>
              </template>
            </UPopover>
          </div>
          <div v-else class="flex items-center gap-2">
            <NuxtLink to="/auth/login" class="hidden text-sm font-semibold text-[var(--p-text-dim)] transition-colors hover:text-[var(--color-primary-600)] sm:inline-flex">
              Log In
            </NuxtLink>
            <NuxtLink
              to="/auth/signup"
              class="cta-button group inline-flex items-center gap-2 rounded-xl bg-flamingo-500 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-flamingo-500/25 transition-all hover:bg-flamingo-400 hover:shadow-flamingo-500/40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-flamingo-500 focus-visible:outline-offset-2"
            >
              Get Started
              <UIcon name="i-lucide-arrow-right" class="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
            </NuxtLink>
          </div>
          <template #fallback>
            <div class="flex items-center gap-2">
              <NuxtLink to="/auth/login" class="hidden text-sm font-semibold text-[var(--p-text-dim)] transition-colors hover:text-[var(--color-primary-600)] sm:inline-flex">
                Log In
              </NuxtLink>
              <NuxtLink
                to="/auth/signup"
                class="cta-button group inline-flex items-center gap-2 rounded-xl bg-flamingo-500 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-flamingo-500/25 transition-all hover:bg-flamingo-400 hover:shadow-flamingo-500/40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-flamingo-500 focus-visible:outline-offset-2"
              >
                Get Started
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
              {{ link.label }}
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
              {{ becomingShopOwner ? 'Updating...' : 'Become a shop owner' }}
            </button>
          </div>
          <div v-if="!authStore.isAuthenticated" class="mt-3 grid gap-2 px-3">
            <NuxtLink to="/auth/login" class="rounded-xl border border-[var(--p-border)] bg-[var(--p-surface)] px-4 py-2.5 text-center text-sm font-semibold text-[var(--p-text)] hover:bg-[var(--p-surface-sunken)] dark:hover:bg-[var(--p-surface-raised)]" @click="mobileOpen = false">
              Log In
            </NuxtLink>
            <NuxtLink to="/auth/signup" class="cta-button group inline-flex items-center justify-center gap-2 rounded-xl bg-flamingo-500 px-4 py-2.5 text-center text-sm font-semibold text-white transition-colors hover:bg-flamingo-400" @click="mobileOpen = false">
              Get Started
              <UIcon name="i-lucide-arrow-right" class="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
            </NuxtLink>
          </div>
        </div>
      </Transition>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { useAuthStore } from '~/stores/auth'
import { useUserStore } from '~/stores/user'
import { useSellerStore } from '~/stores/seller'
import { useShopStore } from '~/stores/shop'
import { useLanguagePreference } from '~/composables/useLanguagePreference'

const authStore = useAuthStore()
const userStore = useUserStore()
const sellerStore = useSellerStore()
const shopStore = useShopStore()
const { locale, loading: languageLoading, options: languageOptions, setLanguage, initializeLanguage } = useLanguagePreference()
const mobileOpen = ref(false)
const becomingShopOwner = ref(false)
const notification = useNotification()

const isClient = computed(() => authStore.normalizedRole === 'client' || !authStore.user?.role)

/** Customers see their requests at /quotes; shop owners/staff see dashboard quotes */
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

const navLinks = [
  { label: 'Home', to: '/' },
  { label: 'Products Gallery', to: '/gallery' },
  { label: 'Shops', to: '/shops' },
  { label: 'Locations', to: '/locations' },
  { label: 'Quote Draft', to: '/quote-draft' },
]

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
  }
})
</script>
