<script setup lang="ts">
import { Check, ArrowRight } from 'lucide-vue-next'
import { cx } from '../../../utils/design/cx'
import JobStageMessages from './JobStageMessages.vue'

export type WorkflowRowState = 'done' | 'current' | 'upcoming'
export type WorkflowTone = 'ontrack' | 'atrisk' | 'late' | 'delivered' | 'neutral' | 'role'

export type WorkflowRow = {
  label: string
  state: WorkflowRowState
  right: string
}

export type WorkflowPhase = {
  name: string
  rows: WorkflowRow[]
}

export type WorkflowPanelData = {
  code: string
  title: string
  subline: string
  sample: boolean
  badge: { label: string; tone: WorkflowTone }
  phases: WorkflowPhase[]
  footer: {
    stageLabel: string
    stageCount: number
    stageIndex: number
    leftLabel: string
    dueLabel: string
  }
  progress: number
  nextAction?: {
    label: string
    target: string | null
    is_mine: boolean
    owner_role: string
    overdue_level: string
    waiting_label: string | null
  } | null
}

const props = defineProps<{
  data: WorkflowPanelData
  jobId?: number | null
  messages?: boolean
}>()

const toneClasses: Record<WorkflowTone, string> = {
  ontrack: 'bg-ontrack-soft text-ontrack border-ontrack/40',
  atrisk: 'bg-amber-soft text-amber border-amber/45',
  late: 'bg-red-soft text-red border-red/40',
  delivered: 'bg-green-soft text-green border-green/40',
  neutral: 'bg-paper-2 text-ink-2 border-line-strong',
  role: 'bg-mint text-brand-deep border-brand/35',
}

const badge = computed(() => props.data.badge)
const lastProduction = computed(() => {
  const production = props.data.phases[1]
  return production?.rows[production.rows.length - 1]
})
</script>

<template>
  <div class="crop-marks relative">
    <span
      v-if="props.data.sample"
      class="absolute -top-4 right-6 z-20 -rotate-3 rounded border border-dashed border-red/50 bg-red-soft/50 px-3 py-1 font-mono text-[10px] font-semibold tracking-[0.22em] text-red/80 uppercase"
    >
      Sample job
    </span>

    <div class="overflow-hidden rounded-[24px] border border-line bg-card shadow-card">
      <div class="flex items-center justify-between gap-3 border-b border-line bg-paper-2 px-5 py-4 sm:px-6">
        <h3 class="text-[19px] font-bold tracking-tight">{{ props.data.code }}</h3>
        <span
          class="inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 font-mono text-[10.5px] font-semibold tracking-[0.06em] uppercase whitespace-nowrap"
          :class="toneClasses[badge.tone]"
        >
          <span v-if="badge.tone === 'ontrack'" class="pulse-dot inline-block h-2 w-2 rounded-full bg-current" />
          <template v-else>
            <Check v-if="badge.tone === 'delivered'" class="h-3 w-3 shrink-0" :stroke-width="2.4" aria-hidden="true" />
            <span v-else class="h-2 w-2 rounded-full bg-current" aria-hidden="true" />
          </template>
          {{ badge.label }}
        </span>
      </div>

      <div class="px-5 py-5 sm:px-6">
        <p class="text-[16px] font-semibold tracking-tight text-ink">{{ props.data.title }}</p>
        <p class="mt-0.5 text-[13px] text-ink-3">{{ props.data.subline }}</p>

        <div
          v-for="(phase, pi) in props.data.phases"
          :key="phase.name"
          :class="cx(pi > 0 && 'mt-5')"
        >
          <p class="mb-1.5 font-mono text-[9.5px] font-semibold tracking-[0.18em] text-ink-3 uppercase">
            {{ phase.name }}
          </p>
          <ul>
            <li
              v-for="(row, i) in phase.rows"
              :key="`${phase.name}-${row.label}`"
              class="contents"
            >
              <div v-if="phase.name.startsWith('Phase 2')" class="relative flex items-center gap-3.5 py-[9px]">
                <span class="relative flex w-[22px] shrink-0 justify-center">
                  <span
                    class="z-10 flex h-[22px] w-[22px] items-center justify-center rounded-full border transition-colors"
                    :class="[
                      row.state === 'done' && 'border-brand bg-brand text-white',
                      row.state === 'current' && 'border-brand bg-card shadow-[0_0_0_4px_color-mix(in_srgb,var(--color-brand)_18%,transparent)]',
                      row.state !== 'done' && row.state !== 'current' && 'border-line-strong bg-paper-2',
                    ]"
                  >
                    <Check v-if="row.state === 'done'" class="h-3 w-3" :stroke-width="3.5" />
                    <span v-else-if="row.state === 'current'" class="pulse-dot h-2 w-2 rounded-full bg-brand" />
                  </span>
                  <span
                    class="absolute top-[26px] bottom-[-13px] left-1/2 w-[2px] -translate-x-1/2"
                    :class="row.state === 'done' ? 'bg-brand' : 'bg-line'"
                    aria-hidden="true"
                  />
                </span>
                <span class="tabular w-6 shrink-0 font-mono text-[11px] text-ink-3">
                  {{ String(i + 1).padStart(2, '0') }}
                </span>
                <span
                  class="min-w-0 flex-1 truncate text-[14px]"
                  :class="row.state === 'current' ? 'font-bold text-ink' : row.state === 'done' ? 'text-ink-2' : 'text-ink-3'"
                >
                  {{ row.label }}
                </span>
                <span
                  class="tabular shrink-0 font-mono text-[11.5px]"
                  :class="row.state === 'current' ? 'font-semibold text-brand' : row.state === 'done' ? 'text-ink-3' : 'text-ink-3'"
                >
                  {{ row.right }}
                </span>
              </div>
              <div v-else class="relative flex items-center gap-3.5 py-[7px] pl-[30px]">
                <span
                  class="h-1.5 w-1.5 shrink-0 rounded-full"
                  :class="row.state === 'done' ? 'bg-brand' : row.state === 'current' ? 'pulse-dot bg-brand' : 'bg-line-strong'"
                />
                <span
                  class="min-w-0 flex-1 truncate text-[13px]"
                  :class="row.state === 'current' ? 'font-bold text-ink' : row.state === 'done' ? 'text-ink-2' : 'text-ink-3'"
                >
                  {{ row.label }}
                </span>
                <span
                  class="tabular shrink-0 font-mono text-[11px]"
                  :class="row.state === 'current' ? 'font-semibold text-brand' : 'text-ink-3'"
                >
                  {{ row.right }}
                </span>
              </div>
            </li>
          </ul>
        </div>
      </div>

      <div v-if="props.data.nextAction" class="flex flex-wrap items-center justify-between gap-3 border-t border-line bg-paper-2/40 px-5 py-3.5 sm:px-6">
        <div class="min-w-0">
          <p class="font-mono text-[9.5px] font-semibold tracking-[0.18em] text-ink-3 uppercase">Next action</p>
          <p class="mt-0.5 text-[13.5px] font-bold tracking-tight text-ink">{{ props.data.nextAction.label }}</p>
          <p class="mt-0.5 font-mono text-[9.5px] uppercase tracking-[0.08em] text-ink-3">
            {{ props.data.nextAction.is_mine ? 'Waiting on you' : (props.data.nextAction.waiting_label || `Waiting on the ${props.data.nextAction.owner_role}`) }}
          </p>
        </div>
        <NuxtLink
          v-if="props.data.nextAction.is_mine && props.data.nextAction.target"
          :to="props.data.nextAction.target"
          class="inline-flex min-h-[40px] shrink-0 items-center gap-1.5 rounded-xl bg-brand px-4 text-[12px] font-bold text-white transition-colors hover:bg-brand-deep"
        >
          {{ props.data.nextAction.label }} <ArrowRight class="h-3.5 w-3.5" />
        </NuxtLink>
      </div>

      <div class="flex items-end justify-between gap-4 border-t border-line px-5 py-4 sm:px-6">
        <div>
          <p class="font-mono text-[10px] font-semibold tracking-[0.18em] text-ink-3 uppercase">
            {{ props.data.footer.stageLabel }} — {{ props.data.footer.stageIndex }} of {{ props.data.footer.stageCount }}
          </p>
          <p class="mt-1 text-[17px] font-bold tracking-tight text-brand">
            {{ props.data.footer.leftLabel }}
          </p>
        </div>
        <div class="text-right">
          <p class="font-mono text-[10px] font-semibold tracking-[0.18em] text-ink-3 uppercase">
            Due
          </p>
          <p class="tabular mt-1 font-mono text-[15px] font-bold text-ink">
            {{ props.data.footer.dueLabel }}
          </p>
        </div>
      </div>

      <JobStageMessages v-if="props.jobId" :job-id="props.jobId" />

      <div class="h-[5px] bg-paper-3">
        <div
          class="stage-fill h-full bg-brand"
          :style="{ width: `${Math.round(props.data.progress * 100)}%` }"
          role="progressbar"
          :aria-valuenow="Math.round(props.data.progress * 100)"
          aria-valuemin="0"
          aria-valuemax="100"
          :aria-label="`${lastProduction?.label ?? 'production'} progress`"
        />
      </div>
    </div>
  </div>
</template>
