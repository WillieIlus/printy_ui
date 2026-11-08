<script setup lang="ts">
import { computed } from 'vue'
import { getIcon } from '../../../utils/design/icon-registry'
import { cx } from '../../../utils/design/cx'
import type { StatusTone } from '../../../types/design/status-tone'

const props = withDefaults(defineProps<{
  tone?: StatusTone
  pulse?: boolean
  icon?: keyof typeof import('../../../utils/design/icon-registry').iconRegistry
  class?: string
}>(), {
  tone: 'neutral',
  pulse: false,
  icon: undefined,
  class: undefined,
})

const tones: Record<StatusTone, string> = {
  ontrack: 'bg-ontrack-soft text-ontrack border-ontrack/40',
  atrisk: 'bg-amber-soft text-amber border-amber/45',
  late: 'bg-red-soft text-red border-red/40',
  delivered: 'bg-green-soft text-green border-green/40',
  neutral: 'bg-paper-2 text-ink-2 border-line-strong',
  role: 'bg-mint text-brand-deep border-brand/35',
}

const pillIcons = {
  ontrack: 'Gauge',
  atrisk: 'Clock3',
  late: 'AlertTriangle',
  delivered: 'CheckCircle2',
  neutral: 'CircleDot',
  role: 'BadgeCheck',
} as const

const icon = computed(() => getIcon(props.icon ?? pillIcons[props.tone]))
</script>

<template>
  <span :class="cx('inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 font-mono text-[10.5px] font-semibold tracking-[0.06em] uppercase whitespace-nowrap', tones[props.tone], props.class)">
    <span v-if="props.pulse" class="pulse-dot inline-block h-2 w-2 rounded-full bg-current" />
    <component :is="icon" v-else class="h-3 w-3 shrink-0" :stroke-width="2.4" aria-hidden="true" />
    <slot />
  </span>
</template>
