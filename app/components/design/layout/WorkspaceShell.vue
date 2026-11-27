<script setup lang="ts">
import { computed } from 'vue'
import { getIcon } from '../../../utils/design/icon-registry'
import { cx } from '../../../utils/design/cx'
import DesignAccountMenu from './AccountMenu.vue'
import DesignJobCodeSearch from './JobCodeSearch.vue'
import DesignNavChip from '../ui/NavChip.vue'
import DesignWordmark from './Wordmark.vue'
import type { DesignNavItem, DesignNavSection, DesignNavChipKey, DesignWorkspaceRole } from '../../../utils/design/nav'

const props = withDefaults(defineProps<{
  role?: DesignWorkspaceRole
  sections?: DesignNavSection[]
  navChips?: Partial<Record<DesignNavChipKey, { label: string; quiet?: boolean }>>
  currentPath?: string
  account?: {
    name: string
    roleLabel: string
    workspaceLabel?: string
    extraLinks?: { href: string; label: string }[]
    signOut?: () => void | Promise<void>
  } | null
}>(), {
  role: 'client',
  sections: () => [],
  navChips: () => ({}),
  currentPath: '/',
  account: null,
})

const ICONS: Record<string, string> = {
  dashboard: 'LayoutDashboard',
  sparkle: 'Sparkles',
  jobs: 'Briefcase',
  quotes: 'ReceiptText',
  clients: 'Users',
  rates: 'BadgePercent',
  messages: 'MessageSquare',
  bell: 'Bell',
  settings: 'Settings',
  track: 'Radar',
  quote: 'Calculator',
  shield: 'ShieldCheck',
  ledger: 'BookOpenText',
  escrow: 'Landmark',
  shops: 'Store',
  shop: 'Store',
  payouts: 'Banknote',
  flag: 'AlertTriangle',
}

const currentPath = computed(() => props.currentPath ?? '/')
const sections = computed(() => props.sections ?? [])
const account = computed(() => props.account)
const flatItems = computed<DesignNavItem[]>(() => sections.value.flatMap(section => section.items))

const arrow = getIcon('ArrowUpRight')

function isActive(href: string) {
  const [path] = href.split('#')
  if (!path) return false
  if (href.includes('#')) return currentPath.value === path
  return currentPath.value === path || currentPath.value.startsWith(`${path}/`)
}

function iconFor(item: DesignNavItem) {
  const iconName = ICONS[item.icon ?? ''] ?? 'CircleDot'
  return getIcon(iconName as never)
}
</script>

<template>
  <div :data-role="props.role" class="paper-noise min-h-screen bg-paper">
    <header data-test="workspace-topbar" class="sticky top-0 z-40 hidden border-b border-line bg-paper/92 backdrop-blur-md lg:block">
      <div class="mx-auto flex min-h-16 max-w-6xl flex-wrap items-center gap-3 px-5 py-2 sm:px-8">
        <DesignWordmark />
        <div class="hidden min-w-0 border-l border-line pl-4 xl:block">
          <p class="truncate font-mono text-[9px] tracking-[0.18em] text-ink-3 uppercase">{{ account?.workspaceLabel ?? 'Workspace' }}</p>
          <p class="truncate text-[13px] font-bold tracking-tight">{{ account?.roleLabel ?? String(props.role) }}</p>
        </div>
        <div class="order-3 w-full md:order-none md:ml-4 md:max-w-md md:flex-1">
          <DesignJobCodeSearch :role="props.role" />
        </div>
        <div class="ml-auto w-60 shrink-0">
          <DesignAccountMenu
            :name="account?.name ?? 'Printy user'"
            :role-label="account?.roleLabel ?? String(props.role)"
            :extra-links="account?.extraLinks ?? []"
            :sign-out="account?.signOut"
            align="down"
          />
        </div>
      </div>

      <nav aria-label="Workspace" class="mx-auto flex max-w-6xl gap-1.5 overflow-x-auto px-5 pb-2.5 sm:px-8">
        <NuxtLink
          v-for="item in flatItems"
          :key="item.href"
          :to="item.href"
          :aria-current="isActive(item.href) ? 'page' : undefined"
          :class="cx(
            'flex min-h-9 shrink-0 items-center gap-1.5 rounded-full border px-3.5 py-1.5 font-mono text-[10.5px] font-semibold tracking-[0.06em] uppercase transition-colors',
            isActive(item.href)
              ? 'border-brand bg-brand text-white'
              : 'border-line bg-card text-ink-2 hover:border-line-strong hover:text-ink',
          )"
        >
          <component :is="iconFor(item)" class="h-3 w-3 shrink-0" :stroke-width="2" aria-hidden="true" />
          <span class="truncate">{{ item.label }}</span>
          <DesignNavChip v-if="item.chipKey && navChips?.[item.chipKey]" :quiet="navChips?.[item.chipKey]?.quiet">
            {{ navChips?.[item.chipKey]?.label }}
          </DesignNavChip>
        </NuxtLink>
      </nav>
    </header>

    <div data-test="workspace-mobilebar" class="sticky top-0 z-40 border-b border-line bg-paper/92 backdrop-blur-md lg:hidden">
      <div class="flex h-14 items-center justify-between gap-3 px-4">
        <DesignWordmark />
        <div class="flex items-center gap-2">
          <span class="rounded-full bg-mint px-2.5 py-1 font-mono text-[9.5px] font-semibold tracking-[0.12em] text-brand-deep uppercase">{{ account?.roleLabel ?? String(props.role) }}</span>
          <div class="w-40">
            <DesignAccountMenu :name="account?.name ?? 'Printy user'" :role-label="account?.roleLabel ?? String(props.role)" :extra-links="account?.extraLinks ?? []" :sign-out="account?.signOut" align="down" />
          </div>
        </div>
      </div>
      <div class="px-3 pb-2">
        <DesignJobCodeSearch :role="props.role" />
      </div>
      <div class="flex gap-1 overflow-x-auto px-3 pb-2">
        <NuxtLink
          v-for="item in flatItems"
          :key="item.href"
          :to="item.href"
          :aria-current="isActive(item.href) ? 'page' : undefined"
          class="flex min-h-11 shrink-0 items-center gap-1.5 rounded-full border px-3 py-2.5 font-mono text-[10.5px] font-medium tracking-[0.04em]"
          :class="isActive(item.href) ? 'border-brand bg-mint text-brand-deep' : 'border-line bg-card text-ink-2'"
        >
          <component :is="iconFor(item)" class="h-3 w-3" />
          {{ item.label }}
        </NuxtLink>
      </div>
    </div>

    <main class="relative z-10">
      <div class="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:py-10"><slot /></div>
    </main>

    <div class="design-skip-link">
      <NuxtLink to="/">Printy home</NuxtLink>
      <NuxtLink to="/terms">Terms</NuxtLink>
      <NuxtLink to="/privacy">Privacy</NuxtLink>
      <NuxtLink to="/help">Help</NuxtLink>
      <component :is="arrow" class="h-4 w-4" />
    </div>
  </div>
</template>
