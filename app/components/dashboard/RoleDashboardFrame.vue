<script setup lang="ts">
import DashboardIcon from '~/components/dashboard/Icons.vue'

interface NavItem {
  label: string
  path?: string
  to?: string
  icon?: string
  badge?: number | string
  active?: boolean
  disabled?: boolean
}

interface NormalizedNavItem {
  label: string
  path: string
  icon: string
  badge?: number | string
  active?: boolean
  disabled?: boolean
}

const props = withDefaults(defineProps<{
  navItems: NavItem[]
  settingsItems?: NavItem[]
  roleBadge?: string
  userName?: string
  userEmail?: string
  notificationCount?: number | string
  title?: string
  badge?: string
  name?: string
  initials?: string
  subtitle?: string
  breadcrumbRoot?: string
  supportTitle?: string
  supportCopy?: string
  supportAction?: string
  supportTo?: string
}>(), {
  settingsItems: () => [],
  notificationCount: 0,
})

const slots = useSlots()
const sidebarOpen = ref(false)
const route = useRoute()

const normalizedNavItems = computed(() => normalizeNavItems(props.navItems))
const normalizedSettingsItems = computed(() => normalizeNavItems(props.settingsItems))
const roleBadgeText = computed(() => props.roleBadge || props.badge || props.title || 'Dashboard')
const userDisplayName = computed(() => props.userName || props.name || props.userEmail || 'User')
const userSubtitle = computed(() => props.userEmail || props.subtitle || '')
const userInitials = computed(() => {
  if (props.userName) {
    return initialsFromName(props.userName)
  }
  return props.initials || initialsFromName(userDisplayName.value)
})
const hasHelperCardSlot = computed(() => Boolean(slots.helperCard))
const hasSupportCard = computed(() => Boolean(props.supportTitle || props.supportCopy || props.supportAction))

function normalizeNavItems(items: NavItem[] = []): NormalizedNavItem[] {
  return items
    .map((item) => ({
      label: item.label,
      path: item.path || item.to || route.path,
      icon: item.icon || 'home',
      badge: item.badge,
      active: item.active,
      disabled: item.disabled,
    }))
    .filter(item => item.label && item.path)
}

function initialsFromName(value: string) {
  return value
    .split(' ')
    .map(part => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase() || 'U'
}

function isActive(item: NormalizedNavItem) {
  if (item.active) {
    return true
  }
  return route.path === item.path || (item.path !== '/dashboard/client' && route.path.startsWith(item.path))
}
</script>

<template>
  <div class="min-h-screen bg-[#f2f4f7]">
    <aside
      :class="[
        'fixed inset-y-0 left-0 z-40 w-72 transform bg-white border-r border-[#e4e7ec] transition-transform lg:translate-x-0',
        sidebarOpen ? 'translate-x-0' : '-translate-x-full',
      ]"
    >
      <div class="flex h-full flex-col">
        <div class="flex h-16 items-center gap-2 border-b border-[#e4e7ec] px-5">
          <NuxtLink to="/" class="inline-flex items-center gap-2">
            <div class="flex h-9 w-9 items-center justify-center rounded-xl bg-[#e13515]">
              <span class="text-base font-bold text-white">P</span>
            </div>
            <span class="text-xl font-bold text-[#101828]">Printy</span>
          </NuxtLink>
        </div>

        <nav class="flex-1 space-y-1 px-3 py-5">
          <NuxtLink
            v-for="item in normalizedNavItems"
            :key="item.path"
            :to="item.disabled ? route.path : item.path"
            :class="[
              'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors',
              item.disabled
                ? 'cursor-not-allowed text-[#98a2b3] opacity-70'
                : isActive(item)
                ? 'bg-[#fdf1ee] text-[#e13515]'
                : 'text-[#667085] hover:bg-[#f9fafb] hover:text-[#101828]',
            ]"
            @click="sidebarOpen = false"
          >
            <DashboardIcon :name="item.icon" class-name="h-5 w-5" />
            <span class="flex-1">{{ item.label }}</span>
            <span
              v-if="item.badge"
              class="flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-[#e13515] px-1.5 text-[11px] font-semibold text-white"
            >
              {{ item.badge }}
            </span>
          </NuxtLink>

          <div v-if="settingsItems.length" class="pt-5">
            <p class="px-3 pb-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#98a2b3]">Settings</p>
            <NuxtLink
              v-for="item in normalizedSettingsItems"
              :key="item.path"
              :to="item.disabled ? route.path : item.path"
              :class="[
                'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors',
                item.disabled
                  ? 'cursor-not-allowed text-[#98a2b3] opacity-70'
                  : isActive(item)
                  ? 'bg-[#fdf1ee] text-[#e13515]'
                  : 'text-[#667085] hover:bg-[#f9fafb] hover:text-[#101828]',
              ]"
              @click="sidebarOpen = false"
            >
              <DashboardIcon :name="item.icon" class-name="h-5 w-5" />
              <span class="flex-1">{{ item.label }}</span>
            </NuxtLink>
          </div>
        </nav>

        <div class="border-t border-[#e4e7ec] p-4">
          <slot name="helperCard" />
          <div v-if="!hasHelperCardSlot && hasSupportCard" class="rounded-xl border border-slate-200 bg-gradient-to-br from-slate-50 to-slate-100 p-4">
            <p v-if="supportTitle" class="text-sm font-semibold text-slate-900">{{ supportTitle }}</p>
            <p v-if="supportCopy" class="mt-1 text-xs leading-5 text-slate-500">{{ supportCopy }}</p>
            <NuxtLink v-if="supportAction && supportTo" :to="supportTo" class="mt-3 inline-flex text-xs font-semibold text-[#e13515] hover:underline">
              {{ supportAction }}
            </NuxtLink>
          </div>
        </div>
      </div>
    </aside>

    <div v-if="sidebarOpen" class="fixed inset-0 z-30 bg-[#101828]/40 lg:hidden" @click="sidebarOpen = false" />

    <div class="lg:pl-72">
      <header class="sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-[#e4e7ec] bg-white/90 px-4 backdrop-blur-md lg:px-6">
        <button
          type="button"
          class="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-[#d0d5dd] bg-white text-[#344054] lg:hidden"
          @click="sidebarOpen = true"
        >
          <DashboardIcon name="menu" class-name="h-5 w-5" />
        </button>

        <div class="hidden items-center gap-2 lg:flex">
          <span class="inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-semibold bg-[#fdf1ee] text-[#e13515] border-[#fcd5cc]">
            {{ roleBadgeText }}
          </span>
        </div>

        <div class="ml-auto flex items-center gap-3">
          <button type="button" class="relative inline-flex h-10 w-10 items-center justify-center rounded-xl border border-[#d0d5dd] bg-white text-[#344054]">
            <DashboardIcon name="bell" class-name="h-5 w-5" />
            <span
              v-if="notificationCount"
              class="absolute -right-1 -top-1 flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-[#e13515] px-1.5 text-[11px] font-semibold text-white"
            >
              {{ notificationCount }}
            </span>
          </button>

          <div class="hidden items-center gap-3 sm:flex">
            <div class="flex h-9 w-9 items-center justify-center rounded-full bg-[#fdf1ee] text-sm font-bold text-[#e13515]">
              {{ userInitials }}
            </div>
            <div>
              <p class="text-sm font-semibold text-[#101828]">{{ userDisplayName }}</p>
              <p class="text-xs text-[#667085]">{{ userSubtitle }}</p>
            </div>
          </div>
        </div>
      </header>

      <main class="p-4 lg:p-6">
        <div class="mx-auto max-w-6xl space-y-6">
          <slot />
        </div>
      </main>
    </div>
  </div>
</template>
