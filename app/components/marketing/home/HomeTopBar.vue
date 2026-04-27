<!-- Purpose: Full-width public top bar — sticky, theme-aware, auth-aware. -->
<template>
  <header class="sticky top-0 z-50 w-full border-b border-[var(--p-border)] bg-[var(--p-bg)]/95 backdrop-blur-md">
    <div class="mx-auto flex h-[72px] max-w-6xl items-center justify-between px-4 md:px-6">
      <!-- Logo lockup -->
      <NuxtLink to="/" class="flex items-center gap-2 transition-opacity hover:opacity-90" aria-label="Printy home">
        <div class="flex h-8 w-8 items-center justify-center overflow-hidden rounded-lg bg-[#e13515] sm:h-9 sm:w-9">
          <ClientOnly>
            <img
              :src="isDark
                ? '/assets/logo-mark/dark/printy-logo-mark-01.svg'
                : '/assets/logo-mark/light/printy-logo-mark-01.svg'"
              alt=""
              class="h-full w-full object-cover"
            />
            <template #fallback>
              <img src="/assets/logo-mark/light/printy-logo-mark-01.svg" alt="" class="h-full w-full object-cover" />
            </template>
          </ClientOnly>
        </div>
        <ClientOnly>
          <img
            :src="isDark
              ? '/assets/word-mark/light/printy-word-mark-03.svg'
              : '/assets/word-mark/dark/printy-word-mark-03.svg'"
            alt="Printy"
            class="hidden h-4 w-auto sm:block sm:h-5"
          />
          <template #fallback>
            <img src="/assets/word-mark/dark/printy-word-mark-03.svg" alt="Printy" class="hidden h-4 w-auto sm:block sm:h-5" />
          </template>
        </ClientOnly>
      </NuxtLink>

      <!-- Nav links -->
      <div class="flex items-center gap-1.5 sm:gap-4">
        <div class="hidden md:block">
          <ThemeModeToggle />
        </div>
        <div class="flex items-center gap-1 sm:gap-2">
          <ClientOnly>
            <template v-if="isAuthenticated">
              <BaseButton :to="dashboardPath" variant="ghost" size="sm" class="px-2 sm:px-3">Dashboard</BaseButton>
              <BaseButton variant="secondary" size="sm" class="px-2 sm:px-3" @click="handleLogout">Log out</BaseButton>
            </template>
            <template v-else>
              <BaseButton to="/auth/login" variant="ghost" size="sm" class="px-2 sm:px-3">Log in</BaseButton>
              <BaseButton to="/auth/signup?type=client" variant="ghost" size="sm" class="hidden px-2 sm:px-3 md:inline-flex">
                Get quotes
              </BaseButton>
              <BaseButton to="/auth/signup?type=shop" variant="primary" size="sm" class="px-3 font-medium sm:px-4">
                <span class="hidden sm:inline">List your printshop</span>
                <span class="sm:hidden">List shop</span>
              </BaseButton>
            </template>
            <template #fallback>
              <BaseButton to="/auth/login" variant="ghost" size="sm" class="px-2 sm:px-3">Log in</BaseButton>
            </template>
          </ClientOnly>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import ThemeModeToggle from '~/components/molecules/ThemeModeToggle.vue'
import BaseButton from '~/components/ui/BaseButton.vue'
import { useAuthStore } from '~/stores/auth'

const colorMode = useColorMode()
const isDark = computed(() => colorMode.value === 'dark')

const authStore = useAuthStore()
const isAuthenticated = computed(() => authStore.isAuthenticated)
const dashboardPath = computed(() => {
  if (authStore.isShopOwner || authStore.isStaffRole) return '/dashboard'
  return '/dashboard/client'
})

function handleLogout() {
  authStore.logout()
  navigateTo('/')
}
</script>
