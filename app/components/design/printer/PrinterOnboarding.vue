<script setup lang="ts">
import { getIcon } from '../../../utils/design/icon-registry'
import { cx } from '../../../utils/design/cx'
import DesignSectionLabel from '../ui/SectionLabel.vue'
import DesignStatusPill from '../ui/StatusPill.vue'

export type PrinterOnboardingStepStatus = 'not_started' | 'in_progress' | 'done'

export type PrinterOnboardingStep = {
  id: string
  title: string
  why: string
  cta: string
  href: string
  status: PrinterOnboardingStepStatus
  gate?: boolean
  fields?: string[]
  note?: string
}

export type PrinterOnboardingState = {
  printerName: string
  steps: PrinterOnboardingStep[]
  doneCount: number
  total: number
  chipLabel: string
  chipQuiet: boolean
  visibleToManagers: boolean
  visibilityTitle: string
  visibilityBody: string
  tip: string
  banner: { title: string; body: string; cta: string; href: string } | null
}

const props = defineProps<{ state: PrinterOnboardingState }>()

const STEP_TONE: Record<PrinterOnboardingStepStatus, 'neutral' | 'role' | 'delivered'> = {
  not_started: 'neutral',
  in_progress: 'role',
  done: 'delivered',
}
const STEP_LABEL: Record<PrinterOnboardingStepStatus, string> = {
  not_started: 'Not started',
  in_progress: 'In progress',
  done: 'Done',
}

const pct = computed(() => (props.state.total ? Math.round((props.state.doneCount / props.state.total) * 100) : 0))
</script>

<template>
  <div class="flex flex-col gap-8">
    <header class="flex flex-wrap items-end justify-between gap-4">
      <div>
        <DesignSectionLabel index="GS" tone="brand">Get started</DesignSectionLabel>
        <h1 class="mt-3 text-3xl font-bold tracking-tight text-ink sm:text-4xl">Set up {{ props.state.printerName }}</h1>
        <p class="mt-1.5 max-w-xl text-[15px] font-light text-ink-2">
          {{ props.state.total }} short steps and you are ready for work. Prices are not set here — your rate card is one screen, and saving it once is what makes you visible.
        </p>
      </div>
      <span :class="cx('rounded-full border px-3 py-1.5 font-mono text-[10.5px] font-semibold tracking-[0.1em] uppercase', props.state.chipQuiet ? 'border-line bg-paper text-ink-3' : 'border-brand/40 bg-mint text-brand-deep')">{{ props.state.chipLabel }}</span>
    </header>

    <section :class="cx('flex flex-wrap items-center justify-between gap-4 rounded-2xl border p-5 sm:p-6', props.state.visibleToManagers ? 'border-green/40 bg-green-soft/60' : 'border-amber/45 bg-amber-soft/60')">
      <div class="flex items-start gap-3">
        <span :class="cx('flex h-9 w-9 shrink-0 items-center justify-center rounded-xl', props.state.visibleToManagers ? 'bg-green text-paper' : 'bg-amber text-paper')">
          <component :is="getIcon(props.state.visibleToManagers ? 'CheckCircle2' : 'AlertTriangle')" class="h-5 w-5" />
        </span>
        <div>
          <p :class="cx('text-[15px] font-bold tracking-tight', props.state.visibleToManagers ? 'text-green' : 'text-amber')">{{ props.state.visibilityTitle }}</p>
          <p class="mt-0.5 max-w-lg text-[13px] leading-relaxed text-ink-2">{{ props.state.visibilityBody }}</p>
        </div>
      </div>
      <DesignStatusPill :tone="props.state.visibleToManagers ? 'delivered' : 'atrisk'">{{ props.state.visibleToManagers ? 'Visible' : 'Not visible' }}</DesignStatusPill>
    </section>

    <section>
      <div class="flex items-baseline justify-between">
        <p class="font-mono text-[10.5px] font-semibold tracking-[0.16em] text-ink-3 uppercase">Setup progress</p>
        <p class="tabular font-mono text-[13px] font-semibold">{{ props.state.doneCount }} of {{ props.state.total }} done</p>
      </div>
      <div class="mt-2 h-2.5 overflow-hidden rounded-full bg-paper-3">
        <div class="stage-fill h-full rounded-full bg-brand" :style="{ width: `${pct}%` }" role="progressbar" :aria-valuenow="props.state.doneCount" :aria-valuemin="0" :aria-valuemax="props.state.total" aria-label="Setup progress" />
      </div>
    </section>

    <section class="flex flex-col gap-3">
      <article v-for="(step, index) in props.state.steps" :id="step.id" :key="step.id" :class="cx('rounded-2xl border bg-card p-5 transition-shadow duration-300 hover:shadow-card sm:p-6', step.gate ? 'border-brand shadow-card' : 'border-line')">
        <div class="flex flex-wrap items-start justify-between gap-3">
          <div class="flex items-start gap-3">
            <span :class="cx('tabular flex h-8 w-8 shrink-0 items-center justify-center rounded-lg font-mono text-[13px] font-semibold', step.status === 'done' ? 'bg-green-soft text-green' : step.status === 'in_progress' ? 'bg-mint text-brand-deep' : 'bg-paper-2 text-ink-3')">
              <component :is="getIcon('CheckCircle2')" v-if="step.status === 'done'" class="h-4 w-4" />
              <template v-else>{{ String(index + 1).padStart(2, '0') }}</template>
            </span>
            <div>
              <h3 class="text-[16px] font-bold tracking-tight">{{ step.title }}</h3>
              <p class="mt-1 max-w-lg text-[13px] leading-relaxed text-ink-2">{{ step.why }}</p>
            </div>
          </div>
          <div class="flex flex-col items-end gap-2">
            <DesignStatusPill :tone="STEP_TONE[step.status]">{{ STEP_LABEL[step.status] }}</DesignStatusPill>
            <span v-if="step.gate" class="inline-flex items-center gap-1.5 rounded-full border border-brand/40 bg-mint px-2.5 py-1 font-mono text-[9.5px] font-semibold tracking-[0.1em] text-brand-deep uppercase">
              <component :is="getIcon('Sparkles')" class="h-3 w-3" /> Required to appear to managers
            </span>
          </div>
        </div>
        <ul v-if="step.fields" class="mt-4 flex flex-wrap gap-1.5 pl-11">
          <li v-for="field in step.fields" :key="field" class="rounded-md border border-line bg-paper-2 px-2.5 py-1 font-mono text-[10.5px] text-ink-2">{{ field }}</li>
        </ul>
        <p v-if="step.note" class="mt-3 pl-11 text-[12px] text-ink-3">{{ step.note }}</p>
        <div class="mt-4 pl-0 sm:pl-11">
          <NuxtLink :to="step.href" :class="cx('inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-[13px] font-semibold transition-colors', step.gate ? 'bg-brand text-white shadow-brand hover:bg-brand-deep' : 'border border-line-strong text-ink hover:border-brand hover:text-brand')">
            {{ step.cta }}
            <component :is="getIcon('ArrowRight')" class="h-3.5 w-3.5" />
          </NuxtLink>
        </div>
      </article>

      <article class="rounded-2xl border border-dashed border-line-strong bg-paper p-5 sm:p-6">
        <div class="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h3 class="text-[16px] font-bold tracking-tight">Speed options your shop offers</h3>
            <p class="mt-1 max-w-lg text-[13px] leading-relaxed text-ink-2">Faster, Fastest, and Sunday or holiday work. Optional — it never blocks your setup and never changes what a buyer is quoted until it is agreed.</p>
          </div>
          <span class="rounded-full border border-line-strong bg-paper-2 px-2.5 py-1 font-mono text-[9.5px] font-semibold tracking-[0.1em] text-ink-3 uppercase">Proposed</span>
        </div>
      </article>
    </section>

    <section class="flex items-start gap-4 rounded-2xl border border-brand/35 bg-mint/60 p-5">
      <svg viewBox="0 0 48 48" class="h-12 w-12 shrink-0" aria-hidden="true">
        <rect x="9" y="16" width="30" height="22" rx="6" class="fill-brand" />
        <rect x="14" y="8" width="20" height="10" rx="3" class="fill-paper" />
        <rect x="15" y="34" width="18" height="8" rx="2" class="fill-paper" />
        <circle cx="19" cy="25" r="2.6" class="fill-paper" />
        <circle cx="29" cy="25" r="2.6" class="fill-paper" />
        <path d="M20 30.5q4 3 8 0" stroke="var(--color-paper)" stroke-width="2" stroke-linecap="round" fill="none" />
        <rect x="6" y="20" width="5" height="9" rx="2.5" class="fill-brand-bright" />
        <rect x="37" y="20" width="5" height="9" rx="2.5" class="fill-brand-bright" />
      </svg>
      <div>
        <p class="font-mono text-[10px] font-semibold tracking-[0.16em] text-brand-deep uppercase">Kito — your setup guide</p>
        <p class="mt-1 text-[14.5px] font-medium leading-relaxed text-brand-deep">{{ props.state.tip }}</p>
      </div>
    </section>

    <section v-if="props.state.banner" class="rounded-2xl border border-amber/45 bg-amber-soft/60 p-5">
      <p class="text-[15px] font-bold tracking-tight text-amber">{{ props.state.banner.title }}</p>
      <p class="mt-0.5 max-w-lg text-[13px] leading-relaxed text-ink-2">{{ props.state.banner.body }}</p>
      <NuxtLink :to="props.state.banner.href" class="mt-3 inline-flex items-center gap-2 rounded-xl bg-brand px-4 py-2.5 text-[13px] font-semibold text-white shadow-brand transition-colors hover:bg-brand-deep">
        {{ props.state.banner.cta }} <component :is="getIcon('ArrowRight')" class="h-3.5 w-3.5" />
      </NuxtLink>
    </section>
  </div>
</template>
