<script setup lang="ts">
import { getIcon } from '../../../utils/design/icon-registry'
import { cx } from '../../../utils/design/cx'

export type DesignStageView = {
  key: string
  index?: number
  label: string
  state: 'done' | 'active' | 'upcoming' | string
  windowLabel?: string
  leftLabel?: string
}

const props = withDefaults(defineProps<{
  stages: DesignStageView[]
  compact?: boolean
  showWindows?: boolean
  onDark?: boolean
}>(), {
  compact: false,
  showWindows: true,
  onDark: false,
})

const check = getIcon('Check')
</script>

<template>
  <ol :class="cx('relative flex flex-col', props.compact ? 'gap-0' : 'gap-0')">
    <li v-for="(stage, i) in props.stages" :key="stage.key" class="relative flex gap-3.5">
      <div class="flex w-6 flex-col items-center">
        <span
          :class="cx(
            'z-10 flex shrink-0 items-center justify-center rounded-full border transition-colors duration-500',
            props.compact ? 'h-4.5 w-4.5' : 'h-5 w-5',
            stage.state === 'done' && (props.onDark ? 'border-brand-bright bg-brand-bright text-brand-deep' : 'border-brand bg-brand text-paper'),
            stage.state === 'active' && (props.onDark ? 'border-brand-bright bg-brand-deep' : 'border-brand bg-mint'),
            stage.state !== 'done' && stage.state !== 'active' && (props.onDark ? 'border-paper/25 bg-transparent' : 'border-line-strong bg-paper'),
          )"
        >
          <component :is="check" v-if="stage.state === 'done'" :class="props.compact ? 'h-2.5 w-2.5' : 'h-3 w-3'" :stroke-width="3.5" />
          <span
            v-else-if="stage.state === 'active'"
            :class="cx('pulse-dot inline-block rounded-full', props.compact ? 'h-1.5 w-1.5' : 'h-2 w-2', props.onDark ? 'bg-brand-bright' : 'bg-brand')"
          />
        </span>
        <span
          v-if="i !== props.stages.length - 1"
          :class="cx('w-[2px] flex-1', props.compact ? 'min-h-4' : 'min-h-5', stage.state === 'done' ? (props.onDark ? 'bg-brand-bright' : 'bg-brand') : props.onDark ? 'bg-paper/15' : 'bg-line')"
        />
      </div>

      <div :class="cx('flex flex-1 items-baseline justify-between gap-3', props.compact ? 'pb-3' : 'pb-4', i === props.stages.length - 1 && 'pb-0')">
        <div class="flex items-baseline gap-2.5">
          <span :class="cx('tabular font-mono text-[10px] font-medium', props.onDark ? 'text-paper/40' : 'text-ink-3')">
            {{ String(i + 1).padStart(2, '0') }}
          </span>
          <span
            :class="cx(
              'tracking-tight',
              props.compact ? 'text-[13px]' : 'text-sm',
              stage.state === 'done' && (props.onDark ? 'text-paper/70' : 'text-ink-2'),
              stage.state === 'active' && 'font-semibold ' + (props.onDark ? 'text-paper' : 'text-ink'),
              stage.state !== 'done' && stage.state !== 'active' && (props.onDark ? 'text-paper/40' : 'text-ink-3'),
            )"
          >{{ stage.label }}</span>
        </div>
        <span
          v-if="props.showWindows"
          :class="cx(
            'tabular font-mono text-[10.5px] whitespace-nowrap',
            stage.state === 'active' ? props.onDark ? 'text-brand-bright' : 'text-brand font-semibold' : props.onDark ? 'text-paper/35' : 'text-ink-3',
          )"
        >{{ stage.leftLabel ?? stage.windowLabel }}</span>
      </div>
    </li>
  </ol>
</template>
