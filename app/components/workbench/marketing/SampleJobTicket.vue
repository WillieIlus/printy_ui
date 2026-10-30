<template>
  <article class="sample" aria-label="Sample job demo">
    <div class="sample__top">
      <span class="sample__note">Demo — not a real order</span>
      <button
        type="button"
        class="sample__play"
        :aria-pressed="!playing"
        @click="togglePlay"
      >
        <Pause v-if="playing" :size="11" aria-hidden="true" />
        <Play v-else :size="11" aria-hidden="true" />
        {{ playing ? 'Pause' : 'Play' }}
      </button>
    </div>

    <div class="sample__job">
      <span class="sample__code">SAMPLE-1042</span>
      <span class="sample__title">1,000 business cards · matt lamination</span>
    </div>

    <TicketStepper
      :stages="stepperStages"
      :current-note="currentNote"
      :current-number="index + 1"
      :total-stages="BUYER_STAGES.length"
    />

    <div class="sample__meta">
      <span class="sample__countdown" :class="{ 'is-done': delivered }">{{ countdownLabel }}</span>
      <span class="sample__due">{{ delivered ? 'Delivered today' : 'Due today 4:30 PM' }}</span>
    </div>

    <p class="sample__hint">
      The same seven stages your dashboard tracker uses — auto-playing so you can see the whole run in ten seconds.
    </p>
  </article>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { Pause, Play } from 'lucide-vue-next'
import TicketStepper from '~/components/workbench/tracker/TicketStepper.vue'
import { BUYER_STAGES } from '~/constants/buyer-stages'
import { formatDuration } from '~/utils/printy'

const START_MINUTES = 225
const STEP_TICKS = 3

const index = ref(2)
const remaining = ref(START_MINUTES)
const playing = ref(true)
const reducedMotion = ref(false)
let timer: ReturnType<typeof setInterval> | null = null
let ticks = 0

const delivered = computed(() => index.value >= BUYER_STAGES.length - 1)
const currentNote = computed(() => BUYER_STAGES[index.value]?.note ?? '')

const stepperStages = computed(() => BUYER_STAGES.map((stage, position) => ({
  key: stage.key,
  label: stage.label,
  status: position < index.value ? 'done' : position === index.value ? 'current' : 'upcoming',
})))

const countdownLabel = computed(() => {
  if (delivered.value) return 'Delivered'
  if (remaining.value <= 0) return 'Due now'
  return `~${formatDuration(remaining.value)} left`
})

function tick() {
  if (!playing.value) return
  ticks += 1
  remaining.value = Math.max(0, remaining.value - 1)
  if (ticks % STEP_TICKS === 0) {
    if (delivered.value) {
      index.value = 0
      remaining.value = START_MINUTES
      ticks = 0
    } else {
      index.value += 1
    }
  }
}

function togglePlay() {
  playing.value = !playing.value
}

/** The three "what people actually ask" lines point at these stages. */
function jumpTo(stageKey: string) {
  const position = BUYER_STAGES.findIndex((stage) => stage.key === stageKey)
  if (position >= 0) {
    index.value = position
    playing.value = false
    ticks = 0
    remaining.value = Math.max(40, START_MINUTES - position * 30)
  }
}

defineExpose({ jumpTo, playing, index })

onMounted(() => {
  reducedMotion.value = Boolean(window.matchMedia?.('(prefers-reduced-motion: reduce)').matches)
  if (reducedMotion.value) {
    playing.value = false
    index.value = 2
    return
  }
  timer = setInterval(tick, 1000)
})

onBeforeUnmount(() => {
  if (timer) clearInterval(timer)
})
</script>

<style scoped>
.sample {
  border: 1px solid var(--line);
  border-radius: 20px;
  background: var(--panel);
  padding: 14px 16px 14px;
  box-shadow: 0 18px 44px -34px rgba(27, 21, 16, 0.4);
}

.sample__top {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 6px 8px;
}

.sample__note {
  font-size: 10.5px;
  color: var(--sub);
}

.sample__play {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  margin-left: auto;
  border: 1px solid var(--line);
  border-radius: 999px;
  padding: 4px 9px;
  font-family: var(--font-mono2, ui-monospace, monospace);
  font-size: 8.5px;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--sub);
  transition: border-color 0.15s, color 0.15s;
}

.sample__play:hover {
  border-color: var(--accent);
  color: var(--accent);
}

.sample__job {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: 4px 10px;
  margin-top: 10px;
}

.sample__code {
  font-family: var(--font-mono2, ui-monospace, monospace);
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.12em;
  color: var(--accent);
}

.sample__title {
  font-family: var(--font-disp, inherit);
  font-size: 15px;
  font-weight: 700;
  color: var(--ink);
}

.sample__meta {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: 4px 10px;
  margin-top: 12px;
}

.sample__countdown {
  font-family: var(--font-disp, inherit);
  font-size: 21px;
  font-weight: 700;
  letter-spacing: -0.01em;
  color: var(--ink);
}

.sample__countdown.is-done {
  color: #0b7a52;
  font-size: 18px;
}

.sample__due {
  font-size: 11px;
  color: var(--sub);
}

.sample__hint {
  margin-top: 8px;
  font-size: 10.5px;
  line-height: 1.5;
  color: var(--sub);
}

@media (prefers-reduced-motion: reduce) {
  .sample__play {
    display: inline-flex;
  }
}
</style>
