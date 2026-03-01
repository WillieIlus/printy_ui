<!-- AppNavbar.vue — Sticky top bar with flamingo (#F05224) primary color -->
<template>
  <nav class="sticky top-0 z-50 border-b border-gray-200/70 bg-white/90 backdrop-blur-md">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div class="flex h-16 items-center justify-between">
        <!-- Logo -->
        <NuxtLink to="/" class="flex items-center gap-2.5">
          <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-flamingo-500 to-flamingo-700 shadow-lg shadow-flamingo-500/25">
            <svg class="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
            </svg>
          </div>
          <div class="leading-tight">
            <div class="text-lg font-bold tracking-tight text-gray-900">Printy</div>
            <div class="hidden text-[11px] text-gray-500 sm:block">Quoting & Pricing Engine</div>
          </div>
        </NuxtLink>

        <!-- Desktop Nav Links -->
        <div class="hidden items-center gap-1 md:flex">
          <NuxtLink
            v-for="link in navLinks"
            :key="link.label"
            :to="link.to"
            class="rounded-lg px-3 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-flamingo-50 hover:text-flamingo-600"
            active-class="!bg-flamingo-50 !text-flamingo-600 !font-semibold"
          >
            {{ link.label }}
          </NuxtLink>
        </div>

        <!-- Right side: Search + User + CTA -->
        <div class="flex items-center gap-3">
          <!-- Search Button -->
          <button class="hidden rounded-lg p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700 sm:inline-flex">
            <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>

          <!-- Notifications -->
          <button class="relative hidden rounded-lg p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700 sm:inline-flex">
            <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            <span class="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-flamingo-500 ring-2 ring-white"></span>
          </button>

          <!-- User Avatar / Login -->
          <div v-if="isLoggedIn" class="flex items-center gap-2">
            <button class="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 py-1.5 transition-all hover:border-gray-300 hover:shadow-sm">
              <div class="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-flamingo-400 to-flamingo-600 text-xs font-bold text-white">
                {{ userInitials }}
              </div>
              <span class="hidden text-sm font-medium text-gray-700 sm:inline">{{ userName }}</span>
              <svg class="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>
          <div v-else class="flex items-center gap-2">
            <NuxtLink to="/login" class="hidden text-sm font-semibold text-gray-600 transition-colors hover:text-flamingo-600 sm:inline-flex">
              Log In
            </NuxtLink>
            <NuxtLink
              to="/signup"
              class="rounded-xl bg-flamingo-500 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-flamingo-500/25 transition-all hover:bg-flamingo-600 hover:shadow-flamingo-500/40"
            >
              Get Started
            </NuxtLink>
          </div>

          <!-- Mobile Menu Toggle -->
          <button
            class="rounded-lg p-2 text-gray-500 hover:bg-gray-100 md:hidden"
            @click="mobileOpen = !mobileOpen"
          >
            <svg v-if="!mobileOpen" class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
            <svg v-else class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
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
        <div v-if="mobileOpen" class="border-t border-gray-200 pb-4 pt-3 md:hidden">
          <div class="grid gap-1">
            <NuxtLink
              v-for="link in navLinks"
              :key="link.label"
              :to="link.to"
              class="rounded-lg px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-flamingo-50 hover:text-flamingo-600"
              @click="mobileOpen = false"
            >
              {{ link.label }}
            </NuxtLink>
          </div>
          <div v-if="!isLoggedIn" class="mt-3 grid gap-2 px-3">
            <NuxtLink to="/login" class="rounded-xl bg-gray-100 px-4 py-2.5 text-center text-sm font-semibold text-gray-800 hover:bg-gray-200" @click="mobileOpen = false">
              Log In
            </NuxtLink>
            <NuxtLink to="/signup" class="rounded-xl bg-flamingo-500 px-4 py-2.5 text-center text-sm font-semibold text-white hover:bg-flamingo-600" @click="mobileOpen = false">
              Get Started
            </NuxtLink>
          </div>
        </div>
      </Transition>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { ref } from 'vue'

interface Props {
  isLoggedIn?: boolean
  userName?: string
  userInitials?: string
}

const props = withDefaults(defineProps<Props>(), {
  isLoggedIn: false,
  userName: 'John D.',
  userInitials: 'JD',
})

const mobileOpen = ref(false)

const navLinks = [
  { label: 'Dashboard', to: '/dashboard' },
  { label: 'Shops', to: '/shops' },
  { label: 'Templates', to: '/templates' },
  { label: 'Quotes', to: '/quotes' },
]
</script>
