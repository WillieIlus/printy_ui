<script setup lang="ts">
import { computed } from 'vue'
import { Check } from 'lucide-vue-next'
import { cx } from '../../../utils/design/cx'

export type WorkflowRailStage = {
  key: string
  label: string
  state?: string | null
  status?: string | null
  is_overdue?: boolean | null
  is_current?: boolean | null
  started_at?: string | null
}

type Tone = 'done' | 'current' | 'overdue' | 'upcoming'

/**
 * One workflow rail for every dashboard role. It accepts the stage shape the
 * backend already sends (buyer `status`, printer `state`, manager timeline
 * `state` + `is_overdue`) and normalises it here, so no role renders a
 * different progress design.
 */
const props = withDefaults(defineProps<{
  stages: WorkflowRailStage[]
  currentNote?: string
  currentNumber?: number
  totalStages?: number
  ariaLabel?: string
}>(), {
  currentNote: '',
  currentNumber: 0,
  totalStages: 0,
  ariaLabel: 'Job workflow',
})

function toneOf(stage: WorkflowRailStage): Tone {
  if (stage.is_overdue) return 'overdue'
  const raw = String(stage.state ?? stage.status ?? '').toLowerCase()
  if (raw === 'done' || raw === 'completed' || raw === 'complete') return 'done'
  if (raw === 'current' || raw === 'active' || raw === 'in_progress' || raw === 'in-progress') return 'current'
  if (raw === 'overdue' || raw === 'late') return 'overdue'
  if (stage.is_current) return 'current'
  if (stage.started_at) return 'done'
  return 'upcoming'
}

const normalized = computed(() => props.stages.map(stage => ({ ...stage, tone: toneOf(stage) })))
const doneCount = computed(() => normalized.value.filter(stage => stage.tone === 'done').length)
const currentIndex = computed(() => normalized.value.findIndex(stage => stage.tone === 'current' || stage.tone === 'overdue'))
const total = computed(() => props.totalStages || normalized.value.length || 1)
const position = computed(() => {
  if (props.currentNumber > 0) return Math.min(props.currentNumber, total.value)
  if (currentIndex.value >= 0) return currentIndex.value + 1
  if (doneCount.value >= total.value) return total.value
  return Math.max(doneCount.value, 1)
})
const progressWidth = computed(() => `${Math.round((position.value / total.value) * 100)}%`)
const currentLabel = computed(() => {
  if (props.currentNote) return props.currentNote
  const stage = currentIndex.value >= 0 ? normalized.value[currentIndex.value] : normalized.value[doneCount.value - 1]
  return stage?.label || 'In progress'
})

const barTone: Record<Tone, string> = {
  done: 'bg-green',
  current: 'bg-brand',
  overdue: 'bg-red',
  upcoming: 'bg-line',
}

const dotTone: Record<Tone, string> = {
  done: 'border-green bg-green text-white',
  current: 'border-brand bg-card text-brand ring-4 ring-brand/15',
  overdue: 'border-red bg-card text-red ring-4 ring-red/15',
  upcoming: 'border-line bg-card text-transparent',
}

const labelTone: Record<Tone, string> = {
  done: 'font-bold text-ink',
  current: 'font-bold text-ink',
  overdue: 'font-bold text-red',
  upcoming: 'text-ink-3',
}
</script>

<template>
  <div v-if="normalized.length" class="w-full">
    <ol
      class="ticket-stepper__steps hidden gap-1.5 sm:grid"
      :style="{ gridTemplateColumns: `repeat(${normalized.length}, minmax(0, 1fr))` }"
      :aria-label="props.ariaLabel"
    >
      <li
        v-for="stage in normalized"
        :key="stage.key"
        class="ticket-stepper__step flex min-w-0 flex-col gap-1.5"
        :class="{ 'is-done': stage.tone === 'done', 'is-current': stage.tone === 'current' }"
      >
        <span class="h-1 rounded-full" :class="barTone[stage.tone]" aria-hidden="true" />
        <span
          class="flex h-3.5 w-3.5 items-center justify-center rounded-full border-2"
          :class="dotTone[stage.tone]"
          aria-hidden="true"
        >
          <Check v-if="stage.tone === 'done'" :size="9" :stroke-width="3" />
        </span>
        <span :class="cx('ticket-stepper__label font-mono text-[8.5px] uppercase leading-tight tracking-[0.06em]', labelTone[stage.tone])">
          {{ stage.label }}
        </span>
      </li>
    </ol>

    <div class="ticket-stepper__compact sm:hidden">
      <div class="flex items-baseline justify-between gap-2">
        <span class="ticket-stepper__compact-stage truncate font-mono text-[10px] font-bold uppercase tracking-[0.1em] text-ink">
          {{ currentLabel }}
        </span>
        <span class="ticket-stepper__compact-count shrink-0 font-mono text-[10px] tracking-[0.08em] text-ink-3">
          {{ position }} of {{ total }}
        </span>
      </div>
      <div class="mt-1.5 h-1.5 overflow-hidden rounded-full bg-line" aria-hidden="true">
        <span class="block h-full rounded-full bg-brand transition-all" :style="{ width: progressWidth }" />
      </div>
    </div>
  </div>
</template>
