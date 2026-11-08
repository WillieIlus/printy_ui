<script setup lang="ts">
import { getIcon } from '~/utils/design/icon-registry'
import { cx } from '~/utils/design/cx'

type PeekTone = 'brand' | 'amber' | 'red' | 'ontrack'

const props = defineProps<{
  to: string
  title: string
  emptyCopy: string
  rows: Array<{ key: string; lead: string; trail: string; value: string; tone: PeekTone }>
}>()

const DOT_TONES: Record<PeekTone, string> = {
  brand: 'bg-brand',
  amber: 'bg-amber',
  red: 'bg-red',
  ontrack: 'bg-ontrack',
}

const TEXT_TONES: Record<PeekTone, string> = {
  brand: 'text-brand',
  amber: 'text-amber',
  red: 'text-red',
  ontrack: 'text-ontrack',
}
</script>

<template>
  <NuxtLink
    :to="props.to"
    class="group flex flex-col rounded-2xl border border-line bg-card p-4 transition-colors hover:border-line-strong"
  >
    <div class="flex items-center justify-between gap-2">
      <span class="font-mono text-[10px] font-medium tracking-[0.16em] text-ink-3 uppercase">{{ props.title }}</span>
      <span class="rounded-full border border-line bg-paper-2 px-2 py-0.5 font-mono text-[9px] font-bold text-ink-2">
        {{ props.rows.length }}
      </span>
    </div>

    <div v-if="props.rows.length" class="mt-2.5 space-y-1.5">
      <div v-for="row in props.rows.slice(0, 4)" :key="row.key" class="flex items-center gap-2.5">
        <span :class="cx('mt-[5px] h-1 w-1 shrink-0 rounded-full', DOT_TONES[row.tone])" />
        <span class="min-w-0 flex-1">
          <span class="block truncate text-[12.5px] font-semibold text-ink">{{ row.lead }}</span>
          <span class="block truncate font-mono text-[8.5px] tracking-[0.1em] text-ink-3 uppercase">{{ row.trail }}</span>
        </span>
        <span :class="cx('shrink-0 font-mono text-[9px] tracking-[0.08em] uppercase', TEXT_TONES[row.tone])">{{ row.value }}</span>
      </div>
      <p v-if="props.rows.length > 4" class="font-mono text-[9px] tracking-[0.12em] text-ink-3 uppercase">
        + {{ props.rows.length - 4 }} more
      </p>
    </div>

    <p v-else class="mt-2.5 text-[12px] text-ink-2">{{ props.emptyCopy }}</p>

    <div class="mt-3 flex items-center gap-1.5 border-t border-line pt-2.5 font-mono text-[9px] tracking-[0.12em] text-ink-3 uppercase transition-colors group-hover:text-brand">
      Open list
      <component :is="getIcon('ChevronRight')" class="h-3 w-3" :stroke-width="1.9" />
    </div>
  </NuxtLink>
</template>
