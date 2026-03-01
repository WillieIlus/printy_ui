<template>
  <nav class="sticky top-0 z-50 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-[#0d1320] shadow-sm">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div class="flex h-16 items-center justify-between">
        <!-- Logo + Wordmark -->
        <NuxtLink to="/" class="flex items-center gap-3">
          <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl overflow-hidden" style="background: #e13515;">
            <CommonPrintyLogoMark img-class="h-6 w-6" />
          </div>
          <div class="flex flex-col justify-center">
            <CommonPrintyWordmark img-class="h-5 sm:h-6 w-auto max-w-[100px] sm:max-w-[120px]" />
            <span class="hidden text-[11px] text-gray-500 dark:text-gray-400 sm:block mt-0.5" style="font-family: var(--font-body);">Your Price, Instantly</span>
          </div>
        </NuxtLink>

        <!-- Desktop Nav Links -->
        <div class="hidden items-center gap-1 md:flex">
          <NuxtLink
            v-for="link in navLinks"
            :key="link.label"
            :to="link.to"
            class="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors text-[#243e68] dark:text-gray-200 hover:bg-[#e7edf7] dark:hover:bg-gray-800 hover:text-[#101828] dark:hover:text-white"
          >
            <UIcon v-if="link.icon" :name="link.icon" class="h-4 w-4" />
            {{ link.label }}
          </NuxtLink>
        </div>

        <!-- Right side -->
        <div class="flex items-center gap-3">
          <ThemeCycleButton />

          <!-- User Avatar / Login -->
          <div v-if="authStore.isAuthenticated" class="flex items-center gap-2">
            <UPopover mode="click" :popper="{ placement: 'bottom-end' }">
              <template #default>
                <button class="flex items-center gap-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-1.5 transition-all hover:border-gray-300 dark:hover:border-gray-600 hover:shadow-sm text-[#101828] dark:text-gray-100">
                  <div class="flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold text-white shrink-0" style="background: #e13515;">
                    {{ userInitials }}
                  </div>
                  <span class="hidden text-sm font-medium sm:inline">{{ userName }}</span>
                  <UIcon name="i-lucide-chevron-down" class="h-4 w-4 text-gray-400 dark:text-gray-500" />
                </button>
              </template>
              <template #content>
                <div class="w-48 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 rounded-xl shadow-xl p-2 flex flex-col gap-1">
                  <NuxtLink to="/dashboard" class="rounded-lg px-3 py-2 text-sm font-medium text-[#101828] dark:text-gray-200 hover:bg-[#e7edf7] dark:hover:bg-gray-800 hover:text-[#e13515] dark:hover:text-[#e13515]">Dashboard</NuxtLink>
                  <NuxtLink to="/dashboard/profile" class="rounded-lg px-3 py-2 text-sm font-medium text-[#101828] dark:text-gray-200 hover:bg-[#e7edf7] dark:hover:bg-gray-800 hover:text-[#e13515] dark:hover:text-[#e13515]">Profile</NuxtLink>
                  <NuxtLink to="/dashboard/shops" class="rounded-lg px-3 py-2 text-sm font-medium text-[#101828] dark:text-gray-200 hover:bg-[#e7edf7] dark:hover:bg-gray-800 hover:text-[#e13515] dark:hover:text-[#e13515]">My Shops</NuxtLink>
                  <NuxtLink to="/dashboard/quotes" class="rounded-lg px-3 py-2 text-sm font-medium text-[#101828] dark:text-gray-200 hover:bg-[#e7edf7] dark:hover:bg-gray-800 hover:text-[#e13515] dark:hover:text-[#e13515]">My Quotes</NuxtLink>
                  <button
                    v-if="isCustomer"
                    class="rounded-lg px-3 py-2 text-left text-sm font-medium text-[#e13515] hover:bg-[#e7edf7] dark:hover:bg-gray-800 w-full flex items-center gap-2"
                    :disabled="becomingPrinter"
                    @click="onBecomePrinter"
                  >
                    <UIcon name="i-lucide-store" class="h-4 w-4" />
                    {{ becomingPrinter ? 'Updating...' : 'Become a printer' }}
                  </button>
                  <div class="my-1 border-t border-gray-100 dark:border-gray-800" />
                  <button class="rounded-lg px-3 py-2 text-left text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 w-full" @click="authStore.logout">
                    Log Out
                  </button>
                </div>
              </template>
            </UPopover>
          </div>
          <div v-else class="flex items-center gap-2">
            <NuxtLink to="/auth/login" class="hidden text-sm font-semibold text-[#243e68] dark:text-gray-200 transition-colors hover:text-[#e13515] sm:inline-flex">
              Log In
            </NuxtLink>
            <NuxtLink
              to="/auth/signup"
              class="btn-primary rounded-xl px-5 py-2.5 text-sm font-semibold shadow-lg transition-all hover:shadow-[#e13515]/40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#e13515] focus-visible:outline-offset-2"
            >
              Get Started
            </NuxtLink>
          </div>

          <!-- Mobile Menu Toggle -->
          <button
            class="rounded-lg p-2 text-[#243e68] dark:text-gray-300 hover:bg-[#e7edf7] dark:hover:bg-gray-800 md:hidden"
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
        <div v-if="mobileOpen" class="border-t border-gray-200 dark:border-gray-800 pb-4 pt-3 md:hidden">
          <div class="grid gap-1">
            <NuxtLink
              v-for="link in navLinks"
              :key="link.label"
              :to="link.to"
              class="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-[#101828] dark:text-gray-200 hover:bg-[#e7edf7] dark:hover:bg-gray-800 hover:text-[#e13515] dark:hover:text-[#e13515]"
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
            <NuxtLink to="/auth/login" class="rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-4 py-2.5 text-center text-sm font-semibold text-[#101828] dark:text-gray-200 hover:bg-[#e7edf7] dark:hover:bg-gray-700" @click="mobileOpen = false">
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
const mobileOpen = ref(false)
const becomingPrinter = ref(false)
const notification = useNotification()

const isCustomer = computed(() => {
  const u = authStore.user
  return !u?.role || u.role === 'CUSTOMER'
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
  { label: 'Problem', to: '/#problem', icon: 'i-lucide-alert-circle' },
  { label: 'Pricing Models', to: '/#models', icon: 'i-lucide-pie-chart' },
  { label: 'Products', to: '/gallery', icon: 'i-lucide-package' },
  { label: 'Shops', to: '/shops', icon: 'i-lucide-store' },
  { label: 'Your Quote', to: '/quote-draft', icon: 'i-lucide-shopping-cart' },
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
</script>
