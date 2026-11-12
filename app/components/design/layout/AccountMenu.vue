<script setup lang="ts">
import { computed } from 'vue'
import { getIcon } from '../../../utils/design/icon-registry'
import { cx } from '../../../utils/design/cx'

const props = withDefaults(defineProps<{
  name: string
  roleLabel: string
  extraLinks?: { href: string; label: string; onSelect?: () => void }[]
  align?: 'up' | 'down'
  signOut?: () => void | Promise<void>
}>(), {
  extraLinks: () => [],
  align: 'up',
  signOut: undefined,
})

const legalLinks = [
  { href: '/terms', label: 'Terms' },
  { href: '/privacy', label: 'Privacy' },
  { href: '/help', label: 'Help' },
] as const

const initials = computed(() => props.name.split(' ').map(word => word[0]).slice(0, 2).join(''))
const arrow = getIcon('ArrowUpRight')
const chevron = getIcon('ChevronDown')
const authed = computed(() => typeof props.signOut === 'function')
</script>

<template>
  <details class="group relative">
    <summary class="flex w-full cursor-pointer list-none items-center gap-3 rounded-xl border border-line bg-card px-3 py-2.5 transition-colors hover:border-line-strong">
      <span class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-mint font-mono text-[11px] font-bold text-brand-deep">
        {{ initials }}
      </span>
      <span class="min-w-0 flex-1 text-left">
        <span class="block truncate text-[13px] font-semibold">{{ props.name }}</span>
        <span class="block font-mono text-[9.5px] tracking-[0.12em] text-ink-3 uppercase">{{ props.roleLabel }}</span>
      </span>
      <component :is="chevron" class="h-4 w-4 shrink-0 text-ink-3 transition-transform duration-300 group-open:rotate-180" />
    </summary>
    <div
      :class="cx('absolute z-50 w-full min-w-52 overflow-hidden rounded-xl border border-line bg-card shadow-lift', props.align === 'up' ? 'bottom-[calc(100%+8px)]' : 'right-0 top-[calc(100%+8px)]')"
    >
      <template v-for="link in props.extraLinks" :key="link.href + link.label">
        <button
          v-if="link.onSelect"
          type="button"
          class="flex w-full items-center justify-between px-4 py-2.5 text-[13px] font-medium text-ink transition-colors hover:bg-paper-2"
          @click="link.onSelect?.()"
        >
          {{ link.label }}
          <component :is="arrow" class="h-3.5 w-3.5 text-ink-3" />
        </button>
        <NuxtLink
          v-else
          :to="link.href"
          class="flex items-center justify-between px-4 py-2.5 text-[13px] font-medium text-ink transition-colors hover:bg-paper-2"
        >
          {{ link.label }}
          <component :is="arrow" class="h-3.5 w-3.5 text-ink-3" />
        </NuxtLink>
      </template>
      <div class="ticket-divider" />
      <div class="flex items-center gap-2.5 px-4 py-2.5">
        <span v-for="(link, i) in legalLinks" :key="link.href" class="flex items-center gap-2.5">
          <span v-if="i > 0" aria-hidden="true" class="text-[10px] text-ink-3">·</span>
          <NuxtLink :to="link.href" class="font-mono text-[10px] font-medium tracking-[0.1em] text-ink-3 uppercase transition-colors hover:text-brand">
            {{ link.label }}
          </NuxtLink>
        </span>
      </div>
      <div v-if="authed" class="border-t border-line">
        <button
          type="button"
          class="flex w-full items-center justify-between px-4 py-2.5 text-[13px] font-medium text-ink transition-colors hover:bg-paper-2"
          @click="props.signOut?.()"
        >
          Sign out
          <component :is="arrow" class="h-3.5 w-3.5 text-ink-3" />
        </button>
      </div>
    </div>
  </details>
</template>
