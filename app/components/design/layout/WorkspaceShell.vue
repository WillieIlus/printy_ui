<script setup lang="ts">
import { computed } from 'vue'
import { getIcon } from '../../../utils/design/icon-registry'
import { cx } from '../../../utils/design/cx'
import DesignAccountMenu from './AccountMenu.vue'
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
  return !href.includes('#') && currentPath.value === href.split('#')[0]
}

function iconFor(item: DesignNavItem) {
  const iconName = ICONS[item.icon ?? ''] ?? 'CircleDot'
  return getIcon(iconName as never)
}
</script>

<template>
  <div :data-role="props.role" class="paper-noise min-h-screen bg-paper">
    <aside class="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col border-r border-line bg-paper/90 backdrop-blur-sm lg:flex">
      <div class="flex h-16 items-center justify-between border-b border-line px-5">
        <DesignWordmark />
      </div>
      <div class="border-b border-line px-5 py-4">
        <p class="font-mono text-[9.5px] tracking-[0.2em] text-ink-3 uppercase">{{ account?.workspaceLabel ?? 'Workspace' }}</p>
        <p class="mt-1 text-[15px] font-bold tracking-tight">{{ account?.roleLabel ?? String(props.role) }}</p>
        <span class="stamp mt-2 border-brand text-brand">Escrow protected</span>
      </div>
      <div class="flex-1 overflow-y-auto px-3 py-5">
        <nav class="flex flex-col gap-6" aria-label="Workspace">
          <div v-for="section in sections" :key="section.label">
            <p class="px-3 font-mono text-[9.5px] font-semibold tracking-[0.2em] text-ink-3 uppercase">{{ section.label }}</p>
            <ul class="mt-2 space-y-0.5">
              <li v-for="item in section.items" :key="item.href">
                <NuxtLink
                  :to="item.href"
                  :aria-current="isActive(item.href) ? 'page' : undefined"
                  :class="cx('flex items-center gap-3 rounded-lg px-3 py-2 text-[13.5px] font-medium tracking-tight transition-colors', isActive(item.href) ? 'bg-mint text-brand-deep' : 'text-ink-2 hover:bg-paper-2 hover:text-ink')"
                >
                  <component :is="iconFor(item)" :class="cx('h-4 w-4 shrink-0', isActive(item.href) ? 'text-brand' : 'text-ink-3')" :stroke-width="1.9" />
                  <span class="truncate">{{ item.label }}</span>
                  <DesignNavChip v-if="item.chipKey && navChips?.[item.chipKey]" :quiet="navChips?.[item.chipKey]?.quiet">
                    {{ navChips?.[item.chipKey]?.label }}
                  </DesignNavChip>
                </NuxtLink>
              </li>
            </ul>
          </div>
        </nav>
      </div>
      <div class="border-t border-line p-3">
        <DesignAccountMenu
          :name="account?.name ?? 'Printy user'"
          :role-label="account?.roleLabel ?? String(props.role)"
          :extra-links="account?.extraLinks ?? []"
          :sign-out="account?.signOut"
        />
      </div>
    </aside>

    <div class="sticky top-0 z-40 border-b border-line bg-paper/92 backdrop-blur-md lg:hidden">
      <div class="flex h-14 items-center justify-between gap-3 px-4">
        <DesignWordmark />
        <div class="flex items-center gap-2">
          <span class="rounded-full bg-mint px-2.5 py-1 font-mono text-[9.5px] font-semibold tracking-[0.12em] text-brand-deep uppercase">{{ account?.roleLabel ?? String(props.role) }}</span>
          <div class="w-40">
            <DesignAccountMenu :name="account?.name ?? 'Printy user'" :role-label="account?.roleLabel ?? String(props.role)" :extra-links="account?.extraLinks ?? []" :sign-out="account?.signOut" align="down" />
          </div>
        </div>
      </div>
      <div class="flex gap-1 overflow-x-auto px-3 pb-2">
        <NuxtLink
          v-for="item in flatItems"
          :key="item.href"
          :to="item.href"
          class="flex min-h-11 shrink-0 items-center gap-1.5 rounded-full border px-3 py-2.5 font-mono text-[10.5px] font-medium tracking-[0.04em]"
          :class="isActive(item.href) ? 'border-brand bg-mint text-brand-deep' : 'border-line bg-card text-ink-2'"
        >
          <component :is="iconFor(item)" class="h-3 w-3" />
          {{ item.label }}
        </NuxtLink>
      </div>
    </div>

    <main class="relative z-10 lg:pl-64">
      <div class="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:py-10"><slot /></div>
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
