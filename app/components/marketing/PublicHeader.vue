<template>
  <header class="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-[#e4e7ec] shadow-sm">
    <div class="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between gap-4">
      <PrintyLogo variant="full" size="md" to="/" />

      <nav class="hidden md:flex items-center gap-7">
        <a
          v-for="item in primaryNav"
          :key="item.href"
          :href="item.href"
          class="text-sm font-medium text-[#344054] hover:text-[#e13515] transition-colors"
        >
          {{ item.label }}
        </a>
      </nav>

      <div class="flex items-center gap-3">
        <ClientOnly>
          <template v-if="showAuthenticatedActions">
            <NuxtLink
              :to="workspaceLink"
              class="hidden sm:inline-flex text-sm font-semibold text-[#344054] border border-[#d0d5dd] rounded-lg px-4 py-2 hover:bg-[#f9fafb] transition-colors"
            >
              {{ workspaceLabel }}
            </NuxtLink>
            <NuxtLink
              :to="primaryActionLink"
              class="inline-flex items-center gap-2 text-sm font-semibold text-white bg-[#e13515] hover:bg-[#b82c10] rounded-lg px-5 py-2.5 transition-colors shadow-sm"
            >
              {{ primaryActionLabel }}
              <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </NuxtLink>
            <button
              type="button"
              class="hidden sm:inline-flex text-sm font-semibold text-[#344054] border border-[#d0d5dd] rounded-lg px-4 py-2 hover:bg-[#f9fafb] transition-colors"
              @click="logout"
            >
              Sign out
            </button>
          </template>
          <template v-else-if="showGuestActions">
            <NuxtLink
              to="/auth/login"
              class="hidden sm:inline-flex text-sm font-semibold text-[#344054] border border-[#d0d5dd] rounded-lg px-4 py-2 hover:bg-[#f9fafb] transition-colors"
            >
              Sign in
            </NuxtLink>
            <NuxtLink
              to="/#live-estimate"
              class="inline-flex items-center gap-2 text-sm font-semibold text-white bg-[#e13515] hover:bg-[#b82c10] rounded-lg px-5 py-2.5 transition-colors shadow-sm"
            >
              Start with an estimate
              <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </NuxtLink>
          </template>
          <template #fallback>
            <div class="h-[42px] w-[160px] sm:w-[260px]" aria-hidden="true" />
          </template>
        </ClientOnly>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import PrintyLogo from '~/components/printy/PrintyLogo.vue'

const auth = useAuthStore()

const primaryNav = [
  { label: 'Calculator', href: '#live-estimate' },
  { label: 'How It Works', href: '/about' },
  { label: 'Track a Job', href: '/track-job' },
]

const showAuthenticatedActions = computed(() => auth.isInitialized && auth.isAuthenticated)
const showGuestActions = computed(() => auth.isInitialized && !auth.isAuthenticated)
const workspaceLabel = computed(() => auth.canReceiveAssignments ? 'Jobs' : auth.canManageClients ? 'Workspace' : 'Dashboard')
const workspaceLink = computed(() => auth.homeRoute)
const primaryActionLabel = computed(() => auth.canReceiveAssignments ? 'Open workspace' : 'New quote')
const primaryActionLink = computed(() => {
  if (auth.canReceiveAssignments) {
    return auth.homeRoute
  }
  if (auth.canManageClients) {
    return '/dashboard/partner/quotes'
  }
  return '/dashboard/client'
})

function logout() {
  auth.logout()
}
</script>
