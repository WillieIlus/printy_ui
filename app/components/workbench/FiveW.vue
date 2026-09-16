<template>
  <div class="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border sm:grid-cols-5" :style="{ borderColor: 'var(--line)', background: 'var(--line)' }">
    <div v-for="(it, i) in items" :key="it.q" class="bg-[var(--panel)] p-3.5">
      <ML>{{ it.q }}</ML>
      <div class="mt-1.5 flex items-center gap-1.5 font-disp text-[13px] font-semibold leading-tight text-[var(--ink)]">
        <Ball v-if="it.ball" :size="7" :color="statusColor" />
        <span class="truncate">{{ it.a }}</span>
      </div>
      <div class="mt-0.5 truncate font-mono2 text-[9.5px] uppercase tracking-[0.12em] text-[var(--sub)]">{{ it.b }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Job } from '~/shared/workflow/printy'
import { STAGES, STATUS_META, nextStage, stIdx } from '~/shared/workflow/printy'

const props = defineProps<{ job: Job }>()

type FiveWItem = { q: string; a: string; b: string; ball?: boolean }

const statusColor = computed(() => STATUS_META[props.job.status].color)

const items = computed<FiveWItem[]>(() => {
  const nx = nextStage(props.job)
  const idx = stIdx(props.job.stage)
  const s = STAGES[idx]!
  return [
    { q: 'What', a: props.job.product, b: `${props.job.qty.toLocaleString()} units` },
    { q: 'Where', a: s.label, b: `stage ${idx + 1} of 10` },
    { q: 'Who', a: props.job.owner.name, b: `${props.job.owner.role} holds the ball`, ball: true },
    { q: 'When', a: `${props.job.owner.waitingHrs}h of ${props.job.owner.slaHrs}h`, b: `ETA ${props.job.eta}` },
    { q: 'Next', a: nx ? nx.label : '—', b: nx ? `${nx.ownerRole} acts next` : 'job closed' },
  ]
})
</script>