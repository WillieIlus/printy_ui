<template>
  <nav class="sticky top-0 z-50 border-b border-[var(--p-border)] bg-[var(--p-surface)] shadow-sm">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div class="flex h-16 items-center justify-between">
        <!-- Logo + Wordmark -->
        <NuxtLink to="/" class="flex items-center gap-3">
          <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl overflow-hidden" style="background: #e13515;">
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
            class="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors text-[var(--p-text-dim)] hover:bg-[var(--p-surface-sunken)] dark:hover:bg-[var(--p-surface-raised)] hover:text-[var(--p-text)] min-w-0"
          >
            <UIcon v-if="link.icon" :name="link.icon" class="h-4 w-4 shrink-0" />
            <span class="truncate">{{ link.label }}</span>
          </NuxtLink>
        </div>

        <!-- Right side -->
        <div class="flex items-center gap-2 sm:gap-3 min-w-0 shrink-0">
          <ThemeCycleButton />

          <!-- User Avatar / Login (ClientOnly: auth state differs between SSR and client) -->
          <ClientOnly>
          <div v-if="authStore.isAuthenticated" class="flex items-center gap-2">
            <UPopover mode="click" :popper="{ placement: 'bottom-end' }">
              <template #default>
                <button class="flex items-center gap-2 rounded-xl border border-[var(--p-border)] bg-[var(--p-surface)] px-3 py-1.5 transition-all hover:border-[var(--p-text-muted)] hover:shadow-sm text-[var(--p-text)]">
                  <div class="flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold text-white shrink-0" style="background: #e13515;">
                    {{ userInitials }}
                  </div>
                  <span class="hidden text-sm font-medium sm:inline">{{ userName }}</span>
                  <UIcon name="i-lucide-chevron-down" class="h-4 w-4 text-[var(--p-text-muted)]" />
                </button>
              </template>
              <template #content>
                <div class="w-48 border border-[var(--p-border)] bg-[var(--p-surface)] rounded-xl shadow-xl p-2 flex flex-col gap-1">
                  <NuxtLink to="/dashboard" class="rounded-lg px-3 py-2 text-sm font-medium text-[var(--p-text)] hover:bg-[var(--p-surface-sunken)] dark:hover:bg-[var(--p-surface-raised)] hover:text-[#e13515]">Dashboard</NuxtLink>
                  <NuxtLink to="/dashboard/profile" class="rounded-lg px-3 py-2 text-sm font-medium text-[var(--p-text)] hover:bg-[var(--p-surface-sunken)] dark:hover:bg-[var(--p-surface-raised)] hover:text-[#e13515]">Profile</NuxtLink>
                  <NuxtLink to="/dashboard/shops" class="rounded-lg px-3 py-2 text-sm font-medium text-[var(--p-text)] hover:bg-[var(--p-surface-sunken)] dark:hover:bg-[var(--p-surface-raised)] hover:text-[#e13515]">My Shops</NuxtLink>
                  <NuxtLink :to="quoteRequestsLink" class="rounded-lg px-3 py-2 text-sm font-medium text-[var(--p-text)] hover:bg-[var(--p-surface-sunken)] dark:hover:bg-[var(--p-surface-raised)] hover:text-[#e13515]">Quote Requests</NuxtLink>
                  <button
                    v-if="isCustomer"
                    class="rounded-lg px-3 py-2 text-left text-sm font-medium text-[#e13515] hover:bg-[var(--p-surface-sunken)] dark:hover:bg-[var(--p-surface-raised)] w-full flex items-center gap-2"
                    :disabled="becomingPrinter"
                    @click="onBecomePrinter"
                  >
                    <UIcon name="i-lucide-store" class="h-4 w-4" />
                    {{ becomingPrinter ? 'Updating...' : 'Become a printer' }}
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
            <NuxtLink to="/auth/login" class="hidden text-sm font-semibold text-[var(--p-text-dim)] transition-colors hover:text-[#e13515] sm:inline-flex">
              Log In
            </NuxtLink>
            <NuxtLink
              to="/auth/signup"
              class="btn-primary rounded-xl px-5 py-2.5 text-sm font-semibold shadow-lg transition-all hover:shadow-[#e13515]/40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#e13515] focus-visible:outline-offset-2"
            >
              Get Started
            </NuxtLink>
          </div>
          <template #fallback>
            <div class="flex items-center gap-2">
              <NuxtLink to="/auth/login" class="hidden text-sm font-semibold text-[var(--p-text-dim)] transition-colors hover:text-[#e13515] sm:inline-flex">
                Log In
              </NuxtLink>
              <NuxtLink
                to="/auth/signup"
                class="btn-primary rounded-xl px-5 py-2.5 text-sm font-semibold shadow-lg transition-all hover:shadow-[#e13515]/40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#e13515] focus-visible:outline-offset-2"
              >
                Get Started
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
              class="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-[var(--p-text)] hover:bg-[var(--p-surface-sunken)] dark:hover:bg-[var(--p-surface-raised)] hover:text-[#e13515]"
              @click="mobileOpen = false"
            >
              <UIcon v-if="link.icon" :name="link.icon" class="h-4 w-4 shrink-0" />
              {{ link.label }}
            </NuxtLink>
          </div>
          <div v-if="authStore.isAuthenticated && isCustomer" class="mt-3 grid gap-2 px-3">
            <button
              class="btn-primary rounded-xl px-4 py-2.5 text-center text-sm font-semibold flex items-center justify-center gap-2"
              :disabled="becomingPrinter"
              @click="onBecomePrinter(); mobileOpen = false"
            >
              <UIcon name="i-lucide-store" class="h-4 w-4" />
              {{ becomingPrinter ? 'Updating...' : 'Become a printer' }}
            </button>
          </div>
          <div v-if="!authStore.isAuthenticated" class="mt-3 grid gap-2 px-3">
            <NuxtLink to="/auth/login" class="rounded-xl border border-[var(--p-border)] bg-[var(--p-surface)] px-4 py-2.5 text-center text-sm font-semibold text-[var(--p-text)] hover:bg-[var(--p-surface-sunken)] dark:hover:bg-[var(--p-surface-raised)]" @click="mobileOpen = false">
              Log In
            </NuxtLink>
            <NuxtLink to="/auth/signup" class="btn-primary rounded-xl px-4 py-2.5 text-center text-sm font-semibold" @click="mobileOpen = false">
              Get Started
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

const authStore = useAuthStore()
const userStore = useUserStore()
const sellerStore = useSellerStore()
const mobileOpen = ref(false)
const becomingPrinter = ref(false)
const notification = useNotification()

const isCustomer = computed(() => {
  const u = authStore.user
  return !u?.role || u.role === 'CUSTOMER'
})

/** Customers see their requests at /quotes; shop owners/staff see dashboard quotes */
const quoteRequestsLink = computed(() => {
  const u = authStore.user
  const hasShops = (sellerStore.shops?.length ?? 0) > 0
  if (u?.is_staff || u?.role === 'PRINTER' || hasShops) return '/dashboard/quotes'
  return '/quotes'
})

async function onBecomePrinter() {
  if (becomingPrinter.value) return
  becomingPrinter.value = true
  try {
    const result = await userStore.updateMe({ role: 'PRINTER' })
    if (result.success) {
      await authStore.fetchMe()
      await navigateTo('/onboarding/printer')
    } else {
      notification.error(userStore.error ?? 'Failed to update role')
    }
  } finally {
    becomingPrinter.value = false
  }
}

const navLinks = [
  { label: 'How it works', to: '/#how-it-works', icon: 'i-lucide-help-circle' },
  { label: 'Products Gallery', to: '/gallery', icon: 'i-lucide-layout-grid' },
  { label: 'Shops', to: '/shops', icon: 'i-lucide-store' },
  { label: 'Locations', to: '/locations', icon: 'i-lucide-map-pin' },
  { label: 'Quote Draft', to: '/quote-draft', icon: 'i-lucide-shopping-cart' },
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
  if (authStore.isAuthenticated) sellerStore.fetchShops()
})
</script>
