<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { getIcon } from '../../../utils/design/icon-registry'
import DesignStatusPill from '../ui/StatusPill.vue'
import DesignStageTimeline from '../tracker/StageTimeline.vue'
import type { DesignStageView } from '../tracker/StageTimeline.vue'

const DEMO_JOB_CODE = 'SAMPLE-1042'

const WINDOW_LABELS = ['on payment', '2h 30m', '5h 20m', '3h', '1h 20m', '1h 15m', '??']
const STAGE_LINE = [
  { key: 'payment_received', label: 'Payment received' },
  { key: 'artwork_check', label: 'Artwork check' },
  { key: 'printing', label: 'Printing' },
  { key: 'finishing', label: 'Finishing' },
  { key: 'quality_check', label: 'Quality check' },
  { key: 'out_for_delivery', label: 'Out for delivery' },
  { key: 'delivered', label: 'Delivered' },
]

const active = ref(2)
const hold = ref(false)
let interval: ReturnType<typeof setInterval> | null = null
let timeout: ReturnType<typeof setTimeout> | null = null

const reduced = ref(typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches)

onBeforeUnmount(() => {
  if (interval) clearInterval(interval)
  if (timeout) clearTimeout(timeout)
})

function arm() {
  if (reduced.value) return
  interval = setInterval(() => {
    if (active.value >= STAGE_LINE.length - 1) {
      hold.value = true
      if (interval) clearInterval(interval)
      return
    }
    active.value += 1
  }, 1500)
}

function reset() {
  active.value = 0
  hold.value = false
  arm()
}

watch(hold, (value) => {
  if (!value || reduced.value || !import.meta.client) return
  timeout = setTimeout(reset, 2600)
})

onMounted(() => {
  if (import.meta.client) arm()
})

const stages = computed<DesignStageView[]>(() => STAGE_LINE.map((stage, index) => ({
  key: stage.key,
  index,
  label: stage.label,
  state: index < active.value ? 'done' : index === active.value ? (index === STAGE_LINE.length - 1 ? 'done' : 'active') : 'upcoming',
  windowLabel: WINDOW_LABELS[index],
  leftLabel: index === active.value && index === 2 ? '~3h 45m left' : index === active.value ? 'in progress' : undefined,
})))
const remaining = computed(() => Math.max(0, active.value + 1))
const currentStageLabel = computed(() => STAGE_LINE[Math.min(active.value, STAGE_LINE.length - 1)]!.label)
</script>

<template>
  <div class="relative">
    <div class="absolute -top-4 -right-3 z-10">
      <span class="stamp border-brand bg-mint/90 text-brand-deep">Sample job</span>
    </div>
    <div class="overflow-hidden rounded-2xl border border-line bg-card shadow-lift">
      <div class="flex items-center justify-between gap-3 border-b border-line bg-paper-2/60 px-5 py-3.5">
        <div class="flex items-center gap-2.5">
          <span class="font-mono text-sm font-semibold tracking-tight text-ink">{{ DEMO_JOB_CODE }}</span>
          <span class="hidden font-mono text-[10px] tracking-[0.1em] text-ink-3 uppercase sm:inline">Demo - not a real order</span>
        </div>
        <DesignStatusPill :tone="active >= 6 ? 'delivered' : 'ontrack'" :pulse="active < 6">
          {{ active >= 6 ? 'Delivered' : 'On track' }}
        </DesignStatusPill>
      </div>

      <div class="px-5 pt-4 pb-5">
        <p class="text-sm font-medium text-ink">1,000 business cards - matt lamination</p>
        <p class="mt-0.5 font-mono text-[11px] text-ink-3">Placed today - Nairobi delivery</p>
        <div class="mt-4">
          <DesignStageTimeline :stages="stages" compact />
        </div>
      </div>

      <div class="flex items-center justify-between border-t border-line px-5 py-3.5">
        <div>
          <p class="font-mono text-[10px] tracking-[0.14em] text-ink-3 uppercase">
            {{ currentStageLabel }} - {{ Math.min(remaining, 7) }} of 7
          </p>
          <p class="tabular mt-0.5 font-mono text-sm font-semibold text-brand">{{ active >= 6 ? 'Job complete' : '~3h 45m left' }}</p>
        </div>
        <div class="text-right">
          <p class="font-mono text-[10px] tracking-[0.14em] text-ink-3 uppercase">Due</p>
          <p class="tabular font-mono text-sm font-semibold text-ink">Today 4:30 PM</p>
        </div>
      </div>

      <div class="h-1 bg-paper-2">
        <div class="stage-fill h-full bg-brand" :style="{ width: `${((active + 1) / STAGE_LINE.length) * 100}%` }" />
      </div>
    </div>
    <p class="mt-3 text-center font-mono text-[10.5px] tracking-[0.08em] text-ink-3">
      The same seven stages your dashboard tracker uses - auto-playing the whole run.
    </p>
  </div>
</template>
