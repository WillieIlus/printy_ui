<script setup lang="ts">
import { computed } from 'vue'
import { getIcon } from '~/utils/design/icon-registry'
import { cx } from '~/utils/design/cx'
import DesignStatusPill from '../ui/StatusPill.vue'
import type { Manager } from '~/shared/workflow/printy'

interface ManagerStats {
  active: number
  risk: number
  disputed: number
}

const props = withDefaults(defineProps<{
  manager: Manager
  stats: ManagerStats
  needsHelp?: boolean
}>(), {
  needsHelp: false,
})

const emit = defineEmits<{ open: [manager: Manager] }>()

const onTimeClass = computed(() => {
  if (props.manager.onTime >= 92) return 'bg-ontrack'
  if (props.manager.onTime >= 87) return 'bg-amber'
  return 'bg-red'
})
const exposure = computed(() => props.stats.risk + props.stats.disputed)
const helpText = computed(() => (exposure.value ? `${exposure.value} need help` : 'clear desk'))
const helpClass = computed(() => (exposure.value ? 'text-red' : 'text-ink-3'))
</script>

<template>
  <button
    type="button"
    data-test="admin-manager-row"
    :class="cx(
      'group flex w-full items-center gap-3.5 rounded-xl border bg-card p-3.5 text-left transition-colors hover:border-line-strong',
      props.needsHelp ? 'border-red/45' : 'border-line',
    )"
    @click="emit('open', props.manager)"
  >
    <span class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-mint font-mono text-[11px] font-bold text-brand-deep">
      {{ props.manager.initials }}
    </span>
    <div class="min-w-0 flex-1">
      <div class="flex flex-wrap items-center gap-2">
        <span class="truncate text-[14.5px] font-semibold tracking-tight text-ink">{{ props.manager.name }}</span>
        <DesignStatusPill v-if="props.stats.disputed > 0" tone="late">Disputed</DesignStatusPill>
      </div>
      <div class="truncate font-mono text-[9.5px] tracking-[0.1em] text-ink-3 uppercase">{{ props.manager.tag }}</div>
    </div>

    <div class="hidden w-[110px] sm:block">
      <div class="mb-1 flex justify-between font-mono text-[8.5px] tracking-[0.08em] text-ink-3 uppercase">
        <span>on-time</span><span>{{ props.manager.onTime }}%</span>
      </div>
      <div class="h-1 w-full overflow-hidden rounded-full bg-paper-2">
        <div :class="cx('h-full rounded-full', onTimeClass)" :style="{ width: `${props.manager.onTime}%` }" />
      </div>
    </div>

    <div class="text-right">
      <div class="font-mono text-[15px] font-semibold text-ink">{{ props.stats.active }}<span class="text-[11px] text-ink-3"> live</span></div>
      <div :class="cx('font-mono text-[8.5px] tracking-[0.08em] uppercase', helpClass)">{{ helpText }}</div>
    </div>

    <component :is="getIcon('ChevronRight')" class="h-4 w-4 shrink-0 text-ink-3 transition-transform group-hover:translate-x-0.5" :stroke-width="1.9" />
  </button>
</template>
