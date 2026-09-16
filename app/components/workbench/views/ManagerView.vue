<template>
  <div class="mx-auto w-full max-w-[1180px] px-4 pb-24 pt-6 sm:px-6">
    <div class="flex flex-wrap items-center gap-x-5 gap-y-2">
      <h1 class="font-disp text-[26px] font-bold tracking-tight">Control room</h1>
      <span class="font-mono2 text-[10px] uppercase tracking-[0.18em] text-[var(--sub)]">{{ p.onTrack + p.atRisk + p.overdue + p.disputed }} live jobs</span>
      <div class="ml-auto flex flex-wrap gap-2">
        <span
          v-for="[l, n, c] in pulseChips"
          :key="l"
          class="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 font-mono2 text-[10px] uppercase tracking-[0.14em]"
          :style="{ background: `${c}18`, color: c, boxShadow: `inset 0 0 0 1px ${c}30` }"
        >
          <span class="h-1.5 w-1.5 rounded-full" :style="{ background: c }" /> {{ n }} {{ l }}
        </span>
      </div>
    </div>

    <section class="mt-6">
      <div class="flex items-center gap-2">
        <Flame :size="13" :style="{ color: '#FF6B4A' }" />
        <ML class="!text-[11px]">What needs my attention</ML>
      </div>
      <div class="mt-3 grid gap-3 md:grid-cols-3">
        <button
          v-for="j in attention"
          :key="j.id"
          class="group relative overflow-hidden rounded-2xl border p-4 text-left transition-transform hover:-translate-y-0.5"
          :class="{ hazard: j.status === 'disputed' }"
          :style="{ borderColor: `${RISK_GLOW[j.status]}55`, background: 'var(--panel)' }"
          @click="w.act('open-job', j)"
        >
          <div class="absolute inset-x-0 top-0 h-[3px]" :style="{ background: RISK_GLOW[j.status] }" />
          <div class="flex items-center justify-between gap-2">
            <span class="font-mono2 text-[10px] font-semibold tracking-[0.14em] text-[var(--accent)]">{{ j.code }}</span>
            <StatusPill :status="j.status" size="sm" />
          </div>
          <div class="mt-2 font-disp text-[15px] font-bold leading-snug tracking-tight">{{ j.title }}</div>
          <div class="mt-2.5 space-y-1.5">
            <div class="flex items-center gap-2 text-[12px] text-[var(--sub)]">
              <Ball :size="7" :color="RISK_GLOW[j.status]" />
              <span class="truncate"><span class="font-semibold text-[var(--ink)]">{{ j.owner.name }}</span> — {{ j.owner.action }}</span>
            </div>
            <div class="flex items-center gap-2">
              <Meter :value="Math.min(slaRatio(j), 1)" :color="RISK_GLOW[j.status]" :h="3" />
              <span class="shrink-0 font-mono2 text-[9.5px]" :style="{ color: RISK_GLOW[j.status] }">{{ j.owner.waitingHrs }}/{{ j.owner.slaHrs }}h</span>
            </div>
          </div>
          <div class="mt-3 flex items-center gap-1.5 font-mono2 text-[9.5px] uppercase tracking-[0.16em] text-[var(--sub)] transition-colors group-hover:text-[var(--accent)]">
            Open command center <ChevronRight :size="11" />
          </div>
        </button>
      </div>
    </section>

    <div class="mt-8 flex items-center justify-between">
      <ML class="!text-[11px]">All jobs · one workflow</ML>
      <div class="ms-auto flex gap-1 rounded-full border p-1" :style="{ borderColor: 'var(--line)', background: 'var(--panel)' }">
        <button
          v-for="[k, Icon, l] in managerTabs"
          :key="k"
          class="relative flex items-center gap-1.5 rounded-full px-3.5 py-1.5 font-mono2 text-[10px] uppercase tracking-[0.14em] transition-colors"
          :style="{ color: w.managerTab === k ? 'var(--accentInk)' : 'var(--sub)' }"
          @click="w.managerTab = k"
        >
          <span v-if="w.managerTab === k" class="absolute inset-0 rounded-full" :style="{ background: 'var(--accent)' }" />
          <Icon :size="12" class="relative" />
          <span class="relative hidden sm:inline">{{ l }}</span>
        </button>
      </div>
    </div>

    <div v-if="w.managerTab === 'list'" class="mt-4 space-y-2.5">
      <div
        v-for="j in sorted"
        :key="j.id"
        class="overflow-hidden rounded-2xl border transition-colors hover:border-[var(--accent)]"
        :style="{ borderColor: 'var(--line)', background: 'var(--panel)' }"
      >
        <div class="flex cursor-pointer flex-wrap items-center gap-x-5 gap-y-3 p-4" @click="w.act('open-job', j)">
          <div class="w-[120px] shrink-0">
            <StatusPill :status="j.status" size="sm" />
            <div class="mt-1.5 font-mono2 text-[10px] tracking-[0.12em] text-[var(--sub)]">{{ j.code }}</div>
          </div>
          <div class="min-w-[190px] flex-1">
            <div class="truncate font-disp text-[15px] font-bold tracking-tight">{{ j.title }}</div>
            <div class="mt-1 flex items-center gap-2">
              <StageDots :job="j" />
              <span class="font-mono2 text-[9.5px] uppercase tracking-[0.12em]" :style="{ color: STATUS_META[j.status].color }">{{ STAGES[stIdx(j.stage)]!.label }}</span>
            </div>
          </div>
          <div class="min-w-[210px] flex-1">
            <div class="flex items-center gap-2 text-[12.5px]">
              <Ball :size="7" :color="toneColor(j)" />
              <span class="truncate font-semibold">{{ j.owner.name }}</span>
              <span class="font-mono2 text-[9px] uppercase tracking-[0.12em] text-[var(--sub)]">{{ j.owner.role }}</span>
            </div>
            <div class="mt-1 truncate pl-[15px] text-[11.5px] text-[var(--sub)]">{{ j.owner.action }}</div>
          </div>
          <div class="w-[130px] shrink-0">
            <div class="mb-1 flex justify-between font-mono2 text-[9px] uppercase tracking-[0.12em] text-[var(--sub)]">
              <span>holding</span><span :style="{ color: toneColor(j) }">{{ j.owner.waitingHrs }}/{{ j.owner.slaHrs }}h</span>
            </div>
            <Meter :value="Math.min(slaRatio(j), 1)" :color="toneColor(j)" :h="4" />
          </div>
          <div class="flex shrink-0 gap-1.5" @click.stop>
            <button
              v-if="needsAssign(j)"
              class="press-key inline-flex items-center gap-1 rounded-lg px-3 py-2 font-mono2 text-[10px] font-semibold uppercase tracking-[0.14em]"
              :style="{ background: 'var(--accent)', color: 'var(--accentInk)' }"
              @click="w.pickFor = w.pickFor === j.id ? null : j.id"
            >
              Assign <ArrowRight :size="11" />
            </button>
            <button
              v-else-if="j.status === 'disputed' && !j.dispute?.resolved"
              class="press-key inline-flex items-center gap-1 rounded-lg px-3 py-2 font-mono2 text-[10px] font-semibold uppercase tracking-[0.14em]"
              :style="{ background: 'rgba(251,77,109,.15)', color: '#FB4D6D', boxShadow: 'inset 0 0 0 1px rgba(251,77,109,.4)' }"
              @click="w.act('resolve-dispute', j)"
            >
              <Flag :size="11" /> Resolve
            </button>
            <button
              v-else-if="j.status !== 'completed'"
              class="press-key inline-flex items-center gap-1 rounded-lg border px-3 py-2 font-mono2 text-[10px] font-semibold uppercase tracking-[0.14em]"
              :style="{ borderColor: 'var(--line)', color: 'var(--sub)' }"
              @click="w.act('nudge', j)"
            >
              <BellRing :size="11" /> Nudge
            </button>
            <span v-else class="inline-flex items-center gap-1 px-3 py-2 font-mono2 text-[10px] uppercase tracking-[0.14em] text-[var(--sub)]">
              <CircleDot :size="11" /> archived
            </span>
          </div>
        </div>

        <div v-if="w.pickFor === j.id && needsAssign(j)" class="border-t px-4" :style="{ borderColor: 'var(--line)' }">
          <div class="py-3">
            <ML>Pick a print partner — ball passes to their floor</ML>
            <PrinterPicker :job="j" @done="w.pickFor = null" />
          </div>
        </div>

        <div
          v-if="printer(j)"
          class="flex items-center justify-between border-t px-4 py-2 font-mono2 text-[9px] uppercase tracking-[0.14em] text-[var(--sub)]"
          :style="{ borderColor: 'var(--line)' }"
        >
          <span>on press: {{ printer(j)?.name }} · {{ printer(j)?.city }}</span>
          <span>{{ money(j.value) }} · custody {{ j.custody }}</span>
        </div>
      </div>
    </div>

    <div v-else-if="w.managerTab === 'board'" class="mt-4 flex gap-3 overflow-x-auto pb-4">
      <div v-for="g in boardCols" :key="g.label" class="w-[230px] shrink-0">
        <div class="flex items-center justify-between px-1 pb-2">
          <ML>{{ g.label }}</ML>
          <span class="rounded-full px-1.5 font-mono2 text-[9px]" :style="{ background: 'var(--panel2)', color: 'var(--sub)' }">{{ g.jobs.length }}</span>
        </div>
        <div class="space-y-2 rounded-2xl border p-2" :style="{ borderColor: 'var(--line)', background: 'var(--panel)' }">
          <div v-if="g.jobs.length === 0" class="p-3 text-center font-mono2 text-[9px] uppercase tracking-[0.14em] text-[var(--sub)] opacity-60">empty</div>
          <button
            v-for="j in g.jobs"
            :key="j.id"
            class="w-full rounded-xl border p-3 text-left transition-transform hover:-translate-y-0.5"
            :class="{ hazard: j.status === 'disputed' }"
            :style="{ borderColor: RISK_GLOW[j.status] ? `${RISK_GLOW[j.status]}55` : 'var(--line)', background: 'var(--panel2)' }"
            @click="w.act('open-job', j)"
          >
            <div class="flex items-center justify-between">
              <span class="font-mono2 text-[9px] tracking-[0.12em] text-[var(--accent)]">{{ j.code }}</span>
              <StatusPill :status="j.status" size="sm" />
            </div>
            <div class="mt-1.5 line-clamp-2 font-disp text-[13px] font-bold leading-snug">{{ j.title }}</div>
            <div class="mt-2"><StageDots :job="j" /></div>
            <div class="mt-2 flex items-center gap-1.5 text-[10.5px] text-[var(--sub)]">
              <Ball :size="6" :color="RISK_GLOW[j.status] ?? 'var(--accent)'" />
              <span class="truncate">{{ j.owner.name }}</span>
            </div>
          </button>
        </div>
      </div>
    </div>

    <div v-else class="mt-4 rounded-2xl border p-5" :style="{ borderColor: 'var(--line)', background: 'var(--panel)' }">
      <ML>The whole floor — live activity</ML>
      <div class="mt-4">
        <button v-for="(f, i) in feed" :key="i" class="group flex w-full gap-4 text-left" @click="w.act('open-job', f.job)">
          <div class="flex w-[86px] shrink-0 justify-end pt-0.5 font-mono2 text-[9.5px] text-[var(--sub)]">{{ f.at }}</div>
          <div class="flex flex-col items-center">
            <span class="mt-1 h-2 w-2 rounded-full" :style="{ background: i === 0 ? 'var(--accent)' : 'var(--line)', boxShadow: i === 0 ? '0 0 8px var(--accent)' : 'none' }" />
            <span v-if="i < feed.length - 1" class="w-px flex-1" :style="{ background: 'var(--line)' }" />
          </div>
          <div class="min-w-0 flex-1 pb-5">
            <div class="text-[13px] leading-snug">
              <span class="font-semibold text-[var(--ink)]">{{ f.who }}</span> <span class="text-[var(--sub)]">{{ f.text }}</span>
            </div>
            <span class="mt-1 inline-block rounded-md px-1.5 py-[1px] font-mono2 text-[9px] tracking-[0.12em] text-[var(--accent)] transition-colors group-hover:bg-[var(--panel2)]">{{ f.jobCode }}</span>
          </div>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, type Component } from 'vue'
import {
  Activity, ArrowRight, BellRing, ChevronRight, CircleDot, Columns3, Flag,
  Flame, LayoutList,
} from 'lucide-vue-next'
import {
  STAGES, STATUS_META, money, prn, pulse, slaRatio, slaTone, stIdx,
  type Job,
} from '~/shared/workflow/printy'
import { useWorkflowStore } from '~/stores/workflow'

const w = useWorkflowStore()

onMounted(() => {
  w.syncFromApi()
})

const sev = (j: Job) => ({ disputed: 0, overdue: 1, 'at-risk': 2, 'on-track': 3, completed: 4 })[j.status]!
const RISK_GLOW: Record<string, string> = { disputed: '#FB4D6D', overdue: '#FF6B4A', 'at-risk': '#F5A623' }

const BOARD_GROUPS: { label: string; stages: string[] }[] = [
  { label: 'Brief & Artwork', stages: ['quote', 'artwork'] },
  { label: 'Approval', stages: ['approval'] },
  { label: 'Payment', stages: ['payment'] },
  { label: 'Production queue', stages: ['production'] },
  { label: 'On press', stages: ['printing', 'finishing', 'qc'] },
  { label: 'Delivery', stages: ['delivery'] },
  { label: 'Done', stages: ['completed'] },
]

const managerTabs: Array<['list' | 'board' | 'timeline', Component, string]> = [
  ['list', LayoutList, 'List'],
  ['board', Columns3, 'Board'],
  ['timeline', Activity, 'Timeline'],
]

const p = computed(() => pulse(w.jobs))
const pulseChips = computed<Array<[string, number, string]>>(() => [
  ['on track', p.value.onTrack, '#2FBF71'],
  ['at risk', p.value.atRisk, '#F5A623'],
  ['overdue', p.value.overdue, '#FF6B4A'],
  ['disputed', p.value.disputed, '#FB4D6D'],
])
const attention = computed(() => [...w.jobs].filter((j) => j.status !== 'completed' && sev(j) <= 2).sort((a, b) => sev(a) - sev(b)))
const sorted = computed(() => [...w.jobs].sort((a, b) => sev(a) - sev(b) || slaRatio(b) - slaRatio(a)))
const feed = computed(() => w.jobs.flatMap((j) => j.feed.map((f) => ({ ...f, job: j }))).slice(0, 14))
const boardCols = computed(() =>
  BOARD_GROUPS.map((g) => ({ label: g.label, stages: g.stages, jobs: w.jobs.filter((j) => g.stages.includes(j.stage)) })),
)

const toneColor = (j: Job) => {
  const tone = slaTone(j)
  return j.status === 'disputed' ? '#FB4D6D' : tone === 'breach' ? '#FB4D6D' : tone === 'tight' ? '#F5A623' : '#2FBF71'
}
const needsAssign = (j: Job) => j.stage === 'production' && !j.printerId
const printer = (j: Job) => prn(j.printerId)
</script>