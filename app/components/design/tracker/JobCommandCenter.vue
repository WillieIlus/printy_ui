<script setup lang="ts">
import { computed } from 'vue'
import { getIcon } from '../../../utils/design/icon-registry'
import { cx } from '../../../utils/design/cx'
import type { LedgerRow } from '../../../types/design/ledger-row'
import type { DesignStageView } from './StageTimeline.vue'
import type { DesignJobView } from './TrackJobPrompt.vue'
import DesignLedgerRows from '../ui/LedgerRows.vue'
import DesignSectionLabel from '../ui/SectionLabel.vue'
import DesignStatusPill from '../ui/StatusPill.vue'
import DesignStageTimeline from './StageTimeline.vue'

export type DesignJobCommandView = DesignJobView & {
  qtyLabel: string
  location: string
  stages: DesignStageView[]
  leftLabel?: string
  dueLabel?: string
  placedLabel?: string
  parties?: { label: string; value: string }[]
  ledger?: LedgerRow[]
  escrowNote?: string
}

const props = withDefaults(defineProps<{
  job: DesignJobCommandView
  role: string
}>(), {
  role: 'public',
})

const doneCount = computed(() => props.job.stages.filter((stage) => stage.state === 'done').length)
const activeStage = computed(() => props.job.stages.find((stage) => stage.state === 'active') ?? null)
const nextStage = computed(() => {
  const activeIndex = activeStage.value?.index ?? 0
  return props.job.stages.find((stage) => stage.index === activeIndex + 1) ?? null
})
const stageCount = computed(() => props.job.stages.length)
const sections = [
  { letter: 'A', label: 'The line - live stages' },
  { letter: 'B', label: 'Time' },
  { letter: 'C', label: 'Who has it' },
  { letter: 'D', label: `Money - ${props.role === 'client' ? 'your view' : 'cleared for your role'}` },
]
</script>

<template>
  <div class="flex flex-col gap-5">
    <div class="crop-marks relative overflow-hidden rounded-2xl border border-ink bg-ink text-paper shadow-lift">
      <div class="halftone absolute -top-10 -right-10 h-44 w-44 rounded-full opacity-25" aria-hidden="true" />
      <div class="relative flex flex-wrap items-start justify-between gap-5 p-6 sm:p-8">
        <div>
          <p class="font-mono text-[10px] tracking-[0.22em] text-paper/45 uppercase">Printy job ticket</p>
          <h1 class="tabular mt-2 font-mono text-4xl font-semibold tracking-tight sm:text-5xl">{{ props.job.code }}</h1>
          <p class="mt-2 max-w-md text-[15px] text-paper/70">{{ props.job.qtyLabel }} - {{ props.job.specLabel }}</p>
          <p class="mt-1 flex items-center gap-1.5 font-mono text-[11px] text-paper/45">
            <component :is="getIcon('MapPin')" class="h-3.5 w-3.5" />
            {{ props.job.location }}
          </p>
        </div>
        <div class="flex flex-col items-end gap-3">
          <DesignStatusPill :tone="props.job.tone" :pulse="props.job.tone === 'ontrack'">{{ props.job.statusLabel }}</DesignStatusPill>
          <span v-if="props.job.escrowNote && props.job.statusLabel !== 'Delivered'" class="stamp border-brand-bright text-brand-bright">Escrow held</span>
        </div>
      </div>
      <div class="relative flex items-center justify-between border-t border-paper/15 px-6 py-3 sm:px-8">
        <span class="font-mono text-[10.5px] tracking-[0.14em] text-paper/50 uppercase">
          Stage {{ Math.min(doneCount + (activeStage ? 1 : 0), stageCount) }} of {{ stageCount }} - {{ props.job.currentStageLabel }}
        </span>
        <span class="tabular font-mono text-[10.5px] tracking-[0.14em] text-paper/50 uppercase">Placed {{ props.job.placedLabel }}</span>
      </div>
      <div class="h-1 bg-paper/10">
        <div class="stage-fill h-full bg-brand-bright" :style="{ width: `${((doneCount + (activeStage ? 0.5 : 0)) / stageCount) * 100}%` }" />
      </div>
    </div>

    <div class="grid items-start gap-5 lg:grid-cols-12">
      <section class="rounded-2xl border border-line bg-card p-6 shadow-card sm:p-7 lg:col-span-7">
        <DesignSectionLabel index="A" tone="brand">{{ sections[0]!.label }}</DesignSectionLabel>
        <div class="mt-5">
          <DesignStageTimeline :stages="props.job.stages" />
        </div>
        <div v-if="nextStage" class="mt-5 flex items-center gap-2.5 rounded-xl border border-dashed border-line-strong bg-paper/60 px-4 py-3">
          <component :is="getIcon('MoveRight')" class="h-4 w-4 shrink-0 text-brand" />
          <p class="text-[13px] text-ink-2">
            Next up: <span class="font-semibold text-ink">{{ nextStage.label }}</span> - planned block {{ nextStage.windowLabel }}
          </p>
        </div>
      </section>

      <div class="flex flex-col gap-5 lg:col-span-5">
        <section class="rounded-2xl border border-line bg-card p-6 shadow-card">
          <DesignSectionLabel index="B">Time</DesignSectionLabel>
          <div class="mt-4 grid grid-cols-2 gap-5">
            <div>
              <p class="flex items-center gap-1.5 font-mono text-[10px] tracking-[0.14em] text-ink-3 uppercase">
                <component :is="getIcon('Clock3')" class="h-3.5 w-3.5" /> Remaining
              </p>
              <p class="tabular mt-1.5 font-mono text-2xl font-semibold text-brand">{{ props.job.leftLabel }}</p>
            </div>
            <div>
              <p class="flex items-center gap-1.5 font-mono text-[10px] tracking-[0.14em] text-ink-3 uppercase">
                <component :is="getIcon('CalendarClock')" class="h-3.5 w-3.5" /> Due
              </p>
              <p class="tabular mt-1.5 font-mono text-[15px] leading-7 font-semibold text-ink">{{ props.job.dueLabel }}</p>
            </div>
          </div>
        </section>

        <section v-if="props.job.parties && props.job.parties.length" class="rounded-2xl border border-line bg-card p-6 shadow-card">
          <DesignSectionLabel index="C">Who has it</DesignSectionLabel>
          <dl class="mt-4 space-y-3">
            <div v-for="party in props.job.parties" :key="party.label" class="flex items-baseline justify-between gap-4">
              <dt class="font-mono text-[10.5px] tracking-[0.14em] text-ink-3 uppercase">{{ party.label }}</dt>
              <dd class="text-right text-sm font-semibold">{{ party.value }}</dd>
            </div>
          </dl>
        </section>

        <section v-if="props.job.ledger" class="rounded-2xl border border-line bg-card p-6 shadow-card">
          <DesignSectionLabel index="D">Money</DesignSectionLabel>
          <div class="mt-3">
            <DesignLedgerRows :rows="props.job.ledger" />
          </div>
          <p v-if="props.role !== 'super_admin'" class="mt-3 font-mono text-[10px] tracking-[0.06em] text-ink-3">
            Internal layers are hidden by the server for your role.
          </p>
        </section>

        <div v-if="props.job.escrowNote" class="flex items-start gap-3 rounded-2xl border border-brand/30 bg-mint/50 p-5">
          <component :is="getIcon('ShieldCheck')" class="mt-0.5 h-5 w-5 shrink-0 text-brand" />
          <p class="text-[13.5px] leading-relaxed text-brand-deep">{{ props.job.escrowNote }}</p>
        </div>

        <slot name="actions" />
      </div>
    </div>
  </div>
</template>
