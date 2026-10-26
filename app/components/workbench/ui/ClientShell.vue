<template>
  <div class="flex min-h-screen bg-gray-50">
    <div
      v-if="sidebarOpen"
      class="fixed inset-0 z-40 bg-gray-900/50 lg:hidden"
      @click="sidebarOpen = false"
    />

    <aside
      class="fixed inset-y-0 left-0 z-50 flex w-64 shrink-0 flex-col border-r border-gray-200 bg-white transition-transform duration-200 ease-in-out lg:sticky lg:top-0 lg:z-auto lg:h-screen lg:translate-x-0"
      :class="sidebarOpen ? 'translate-x-0' : '-translate-x-full'"
    >
      <div class="flex h-16 items-center gap-3 bg-gradient-to-r px-5" :class="theme.brand">
        <div class="flex h-8 w-8 items-center justify-center rounded-lg bg-white/20">
          <Printer :size="18" class="text-white" />
        </div>
        <div class="leading-tight">
          <div class="text-sm font-extrabold tracking-tight text-white">Printy</div>
          <div class="text-[9px] font-semibold uppercase tracking-[0.22em]" :class="theme.brandSub">{{ theme.portalLabel }}</div>
        </div>
        <button
          type="button"
          class="ml-auto rounded-lg p-1.5 text-white/70 hover:bg-white/10 hover:text-white lg:hidden"
          @click="sidebarOpen = false"
        >
          <X :size="18" />
        </button>
      </div>

      <nav class="flex-1 space-y-1 overflow-y-auto px-3 py-4">
        <NuxtLink
          v-for="item in navItems"
          :key="item.key"
          :to="item.to"
          class="group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-colors"
          :class="isActive(item) ? theme.active : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'"
          @click="onNav(item)"
        >
          <component
            :is="item.icon"
            :size="18"
            :class="isActive(item) ? theme.activeIcon : 'text-gray-400 group-hover:text-gray-500'"
          />
          <span class="flex-1">{{ item.label }}</span>
          <span
            v-if="badgeFor(item.key) > 0"
            class="flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-[10px] font-bold"
            :class="isActive(item) ? theme.badge : 'bg-amber-100 text-amber-700'"
          >
            {{ badgeFor(item.key) }}
          </span>
        </NuxtLink>
      </nav>

      <div class="border-t border-gray-100 p-3">
        <NuxtLink
          to="/"
          class="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-gray-500 transition-colors hover:bg-gray-50 hover:text-gray-900"
        >
          <LogOut :size="17" class="text-gray-400" />
          Back to site
        </NuxtLink>
      </div>
    </aside>

    <div class="flex min-w-0 flex-1 flex-col">
      <header class="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-gray-200 bg-white px-4 sm:px-6">
        <button
          type="button"
          class="rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700 lg:hidden"
          @click="sidebarOpen = true"
        >
          <Menu :size="20" />
        </button>

        <div class="relative w-full max-w-md">
          <Search :size="16" class="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            v-model="search"
            type="search"
            placeholder="Search jobs, quotes or references..."
            class="h-10 w-full rounded-xl border border-gray-200 bg-gray-50 pl-9 pr-4 text-sm text-gray-900 outline-none transition-all placeholder:text-gray-400 focus:bg-white"
            :class="theme.searchFocus"
          >
        </div>

        <div class="ml-auto flex items-center gap-2">
          <NotificationBell plain />

          <span class="hidden items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-emerald-700 md:flex">
            <span class="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            Live
          </span>

          <div class="relative">
            <button
              type="button"
              class="flex items-center gap-2 rounded-xl px-1.5 py-1.5 transition-colors hover:bg-gray-100"
              @click.stop="profileOpen = !profileOpen"
            >
              <Avatar
                :src="profile.avatarUrl"
                :alt="`Avatar for ${userName}`"
                :name="userName"
                :initials="initials"
                :hue="theme.avatarHue"
                :size="32"
              />
              <span class="hidden text-left leading-tight sm:block">
                <span class="block max-w-[140px] truncate text-xs font-semibold text-gray-900">{{ userName }}</span>
                <span class="block text-[10px] font-medium text-gray-500">{{ theme.roleLabel }}</span>
              </span>
              <ChevronDown :size="14" class="hidden text-gray-400 sm:block" />
            </button>

            <div v-if="profileOpen" class="fixed inset-0 z-40" @click="profileOpen = false" />
            <div
              v-if="profileOpen"
              class="absolute right-0 z-50 mt-2 w-48 overflow-hidden rounded-xl border border-gray-200 bg-white py-1 shadow-lg"
            >
              <NuxtLink
                to="/app/settings"
                class="block px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                @click="profileOpen = false"
              >
                Account settings
              </NuxtLink>
              <NuxtLink
                to="/app/messages"
                class="block px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                @click="profileOpen = false"
              >
                Messages
              </NuxtLink>
              <button
                type="button"
                class="block w-full px-4 py-2 text-left text-sm font-medium text-red-600 hover:bg-red-50"
                @click="signOut"
              >
                Sign out
              </button>
            </div>
          </div>
        </div>
      </header>

      <main class="flex-1 px-4 py-6 lg:px-8 lg:py-8">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import {
  BarChart3, Briefcase, ChevronDown, ClipboardList, CreditCard, FileText, History, LayoutDashboard,
  Layers, LogOut, Menu, MessageSquare, Printer, Search, Settings, Upload, Users, X,
} from 'lucide-vue-next'
import type { Component } from 'vue'
import { useAuthStore } from '~/stores/auth'
import { useAssignmentsStore } from '~/stores/assignments'
import { useClientJobsStore } from '~/stores/client-jobs'
import { useClientResponsesStore } from '~/stores/responses'
import { useManagerStore } from '~/stores/manager'
import { useMessagesStore } from '~/stores/messages'
import { useProfileStore } from '~/stores/profile'
import { needsAttention } from '~/shared/list-sections'

type ShellVariant = 'client' | 'partner' | 'shop'

interface NavItem {
  key: string
  label: string
  to: string
  hash?: string
  icon: Component
}

const props = withDefaults(defineProps<{ variant?: ShellVariant }>(), { variant: 'client' })

const route = useRoute()
const auth = useAuthStore()
const assignments = useAssignmentsStore()
const jobs = useClientJobsStore()
const responses = useClientResponsesStore()
const manager = useManagerStore()
const messages = useMessagesStore()
const profile = useProfileStore()

const isPartner = computed(() => props.variant === 'partner')
const isShop = computed(() => props.variant === 'shop')
const search = useState<string>(
  isPartner.value ? 'partner-search' : isShop.value ? 'printer-search' : 'client-search',
  () => '',
)
const quoteBadge = useState<number>(
  isPartner.value ? 'partner-nav-quote-count' : isShop.value ? 'printer-nav-quote-count' : 'client-nav-quote-count',
  () => 0,
)

const sidebarOpen = ref(false)
const profileOpen = ref(false)

const theme = computed(() => {
  if (isPartner.value) {
    return {
      brand: 'from-emerald-600 to-teal-700',
      brandSub: 'text-emerald-100/80',
      portalLabel: 'Partner portal',
      roleLabel: 'Partner',
      active: 'bg-emerald-50 text-emerald-700',
      activeIcon: 'text-emerald-600',
      badge: 'bg-emerald-600 text-white',
      avatarHue: 160,
      searchFocus: 'focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100',
    }
  }
  if (isShop.value) {
    return {
      brand: 'from-violet-600 to-purple-700',
      brandSub: 'text-violet-100/80',
      portalLabel: 'Print shop',
      roleLabel: 'Print shop',
      active: 'bg-violet-50 text-violet-700',
      activeIcon: 'text-violet-600',
      badge: 'bg-violet-600 text-white',
      avatarHue: 265,
      searchFocus: 'focus:border-violet-400 focus:ring-2 focus:ring-violet-100',
    }
  }
  return {
    brand: 'from-blue-600 to-indigo-700',
    brandSub: 'text-blue-100/80',
    portalLabel: 'Client portal',
    roleLabel: 'Client',
    active: 'bg-blue-50 text-blue-700',
    activeIcon: 'text-blue-600',
    badge: 'bg-blue-600 text-white',
    avatarHue: 220,
    searchFocus: 'focus:border-blue-400 focus:ring-2 focus:ring-blue-100',
  }
})

const clientNavItems: NavItem[] = [
  { key: 'overview', label: 'Overview', to: '/app/buyer', icon: LayoutDashboard },
  { key: 'quotes', label: 'My Quotes', to: '/app/buyer#quotes', hash: '#quotes', icon: FileText },
  { key: 'jobs', label: 'Active Jobs', to: '/app/buyer#jobs', hash: '#jobs', icon: Briefcase },
  { key: 'payments', label: 'Payments', to: '/app/buyer#payments', hash: '#payments', icon: CreditCard },
  { key: 'upload', label: 'Upload Artwork', to: '/app/buyer#upload', hash: '#upload', icon: Upload },
  { key: 'history', label: 'History', to: '/app/buyer#history', hash: '#history', icon: History },
]

const partnerNavItems: NavItem[] = [
  { key: 'overview', label: 'Dashboard', to: '/app/manager', icon: LayoutDashboard },
  { key: 'quotes', label: 'Client Quotes', to: '/app/manager/quotes', icon: FileText },
  { key: 'jobs', label: 'Active Jobs', to: '/app/manager/jobs', icon: Briefcase },
  { key: 'clients', label: 'My Clients', to: '/app/manager/clients', icon: Users },
  { key: 'rates', label: 'Rate Card', to: '/app/manager/rates', icon: CreditCard },
  { key: 'messages', label: 'Messages', to: '/app/messages', icon: MessageSquare },
  { key: 'analytics', label: 'Analytics', to: '/app/manager#analytics', hash: '#analytics', icon: BarChart3 },
]

const shopNavItems: NavItem[] = [
  { key: 'overview', label: 'Overview', to: '/app/printer', icon: LayoutDashboard },
  { key: 'jobs', label: 'Job Queue', to: '/app/printer#jobs', hash: '#jobs', icon: ClipboardList },
  { key: 'production', label: 'Production', to: '/app/printer#production', hash: '#production', icon: Printer },
  { key: 'capacity', label: 'Capacity', to: '/app/printer#machines', hash: '#machines', icon: Layers },
  { key: 'events', label: 'Event Log', to: '/app/printer#events', hash: '#events', icon: FileText },
  { key: 'machines', label: 'Machine Setup', to: '/app/printer/shop', icon: Settings },
  { key: 'rates', label: 'Rate Card', to: '/app/printer/rates', icon: CreditCard },
  { key: 'messages', label: 'Messages', to: '/app/messages', icon: MessageSquare },
]

const navItems = computed(() => (isPartner.value ? partnerNavItems : isShop.value ? shopNavItems : clientNavItems))

const userName = computed(() => auth.user?.name || (isPartner.value ? 'Printy partner' : isShop.value ? 'Printy printer' : 'Printy client'))
const initials = computed(() =>
  userName.value.split(' ').map(part => part[0]).slice(0, 2).join('').toUpperCase(),
)

function isActive(item: NavItem) {
  if (item.hash) {
    return route.hash === item.hash
  }
  if (item.key === 'overview') {
    return route.path === item.to && !route.hash
  }
  return route.path === item.to || route.path.startsWith(`${item.to}/`)
}

function badgeFor(key: string) {
  if (isShop.value) {
    if (key === 'jobs') return assignments.active.length
    if (key === 'messages') return messages.unreadCount
    return 0
  }
  if (isPartner.value) {
    if (key === 'quotes') {
      return Math.max(manager.quotes.filter(needsAttention).length, quoteBadge.value)
    }
    if (key === 'jobs') {
      return manager.dispatchableJobs.length
    }
    if (key === 'messages') {
      return messages.unreadCount
    }
    return 0
  }
  if (key === 'quotes') {
    return Math.max(quoteBadge.value, responses.pending.length)
  }
  if (key === 'jobs') {
    return jobs.needsAction.length
  }
  return 0
}

function onNav(item: NavItem) {
  sidebarOpen.value = false
  if (item.hash && import.meta.client) {
    requestAnimationFrame(() => {
      document.querySelector(item.hash!)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    })
  }
}

onMounted(() => {
  if (auth.isAuthenticated && !profile.profile) {
    profile.fetch().catch(() => {})
  }
})

async function signOut() {
  profileOpen.value = false
  await auth.logout()
  await navigateTo('/')
}
</script>
