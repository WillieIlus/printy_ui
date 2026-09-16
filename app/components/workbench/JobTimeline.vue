<template>
  <div class="relative">
    <div v-for="s in stages" :key="s.key" class="relative flex gap-4">
      <div class="flex w-[26px] flex-col items-center">
        <div
          class="flex h-[26px] w-[26px] shrink-0 items-center justify-center rounded-full"
          :style="{
            background: s.done ? 'var(--accent)' : 'transparent',
            boxShadow: s.done ? '0 0 12px var(--glow)' : s.now ? `inset 0 0 0 2px ${nowColor}` : 'inset 0 0 0 2px var(--line)',
          }"
        >
          <Check v-if="s.done" :size="13" :stroke-width="3.5" style="color: var(--accentInk)" />
          <Ball v-else-if="s.now" :color="nowColor" :size="10" />
          <CircleDashed v-else :size="11" style="color: var(--sub)" />
        </div>
        <div
          v-if="s.i < STAGES.length - 1"
          class="w-[2px] flex-1"
          :style="{ background: s.done ? 'var(--accent)' : 'var(--line)', opacity: s.done ? 0.65 : 1 }"
        />
      </div>

      <div class="min-w-0 flex-1 -mt-[1px]" :class="s.i === STAGES.length - 1 ? 'pb-0' : s.now ? 'pb-7' : 'pb-6'">
        <div class="flex items-center gap-2">
          <span
            class="font-disp text-[14px] font-semibold tracking-tight"
            :style="{ color: s.now ? statusColor : s.done ? 'var(--ink)' : 'var(--sub)' }"
          >
            {{ s.label }}
          </span>
          <span
            v-if="s.now"
            class="rounded-full px-2 py-[2px] font-mono2 text-[9px] font-semibold uppercase tracking-[0.18em]"
            :style="{ background: `${statusColor}22`, color: statusColor, boxShadow: `inset 0 0 0 1px ${statusColor}44` }"
          >
            Ball here
          </span>
          <span v-if="s.isNext && !compact" class="font-mono2 text-[9px] uppercase tracking-[0.18em] text-[var(--sub)]">· up next</span>
        </div>

        <div v-if="s.entry && !s.now" class="mt-1 text-[12px] leading-snug text-[var(--sub)]">
          <span class="text-[var(--ink)] opacity-80">{{ s.entry.actor }}</span> · {{ s.entry.actorRole }} · {{ s.entry.at }}
          <div v-if="s.entry.note && !compact" class="mt-0.5 font-mono2 text-[10.5px] opacity-75">{{ s.entry.note }}</div>
        </div>

        <div
          v-if="s.now"
          class="mt-2.5 rounded-2xl border p-3"
          :class="{ hazard: job.status === 'disputed' }"
          :style="{
            borderColor: `${statusColor}55`,
            background: job.status === 'disputed' ? 'rgba(251,77,109,.06)' : 'var(--panel2)',
          }"
        >
          <div class="flex items-center gap-3">
            <SlaRing :job="job" :size="compact ? 40 : 48" />
            <div class="min-w-0">
              <div class="truncate font-disp text-[13.5px] font-semibold text-[var(--ink)]">{{ job.owner.name }}</div>
              <div class="font-mono2 text-[9.5px] uppercase tracking-[0.18em]" :style="{ color: statusColor }">
                {{ job.owner.role }} · must act
              </div>
              <div v-if="!compact" class="mt-1 text-[12px] leading-snug text-[var(--sub)]">{{ job.owner.action }}</div>
            </div>
          </div>
          <div
            v-if="!compact"
            class="mt-2.5 flex items-center gap-2 border-t pt-2 font-mono2 text-[9.5px] uppercase tracking-[0.14em] text-[var(--sub)]"
            :style="{ borderColor: 'var(--line)' }"
          >
            <span>Holding {{ job.owner.waitingHrs }}h / {{ job.owner.slaHrs }}h SLA</span>
            <span v-if="job.status === 'disputed'" class="ml-auto inline-flex items-center gap-1 text-[#FB4D6D]"><Flag :size="10" /> disputed</span>
          </div>
        </div>

        <div v-if="s.now && s.entry" class="mt-2 font-mono2 text-[9.5px] uppercase tracking-[0.14em] text-[#F5A623]">
          Reopened — previously completed {{ s.entry.at }}
        </div>

        <div v-if="!s.done && !s.now && !compact" class="mt-1 font-mono2 text-[10px] uppercase tracking-[0.16em] text-[var(--sub)] opacity-70">
          {{ s.ownerRole !== '—' ? `${s.ownerRole} acts` : 'auto' }} · SLA {{ s.sla }}h
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Check, CircleDashed, Flag } from 'lucide-vue-next'
import type { Job } from '~/shared/workflow/printy'
import { STAGES, STATUS_META, nextStage, slaTone, stIdx } from '~/shared/workflow/printy'

const props = withDefaults(defineProps<{ job: Job; compact?: boolean }>(), { compact: false })

const cur = computed(() => stIdx(props.job.stage))
const closed = computed(() => cur.value === STAGES.length - 1)
const next = computed(() => nextStage(props.job))
const statusColor = computed(() => STATUS_META[props.job.status].color)
const nowColor = computed(() => {
  const tone = slaTone(props.job)
  return props.job.status === 'disputed' ? '#FB4D6D' : tone === 'breach' ? '#FB4D6D' : tone === 'tight' ? '#F5A623' : 'var(--accent)'
})

const stages = computed(() =>
  STAGES.map((s, i) => {
    const done = closed.value || i < cur.value
    const now = !closed.value && i === cur.value
    const entry = props.job.history.filter((h) => h.stage === s.key).slice(-1)[0] ?? null
    const isNext = next.value?.key === s.key
    return { ...s, i, done, now, entry, isNext }
  }),
)
</script>