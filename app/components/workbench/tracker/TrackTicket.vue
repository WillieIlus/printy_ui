<template>
  <article
    class="tracket"
    :class="{
      'tracket--late': job.is_late && !delivered,
      'tracket--delivered': delivered,
      'tracket--changed': changed,
    }"
  >
    <header class="tracket__head">
      <div class="tracket__id">
        <NuxtLink :to="trackPath" class="tracket__code" :aria-label="`Track job ${job.job_code}`">
          {{ job.job_code }}
        </NuxtLink>
        <h3 class="tracket__title">{{ job.title }}</h3>
      </div>
      <span v-if="delivered" class="tracket__badge tracket__badge--done">
        <Check :size="12" aria-hidden="true" /> Delivered
      </span>
      <span v-else-if="job.is_late" class="tracket__badge tracket__badge--late">Running late</span>
    </header>

    <TicketStepper
      :stages="job.stages"
      :current-note="job.stage_note || job.current_stage"
      :current-number="job.stage_number"
      :total-stages="job.stage_count"
    />

    <div class="tracket__meta">
      <div class="tracket__countdown" :class="{ 'is-late': job.is_late && !delivered }">
        {{ countdown }}
      </div>
      <div v-if="job.due_at" class="tracket__due">Due {{ formatWhen(job.due_at, nowDate) }}</div>
    </div>

    <ul v-if="finishingSteps.length && finishingVisible" class="tracket__substeps" aria-label="Finishing steps">
      <li
        v-for="step in finishingSteps"
        :key="step.key"
        class="tracket__substep"
        :class="{ 'is-done': step.status === 'done' }"
      >
        {{ step.label }}
      </li>
    </ul>

    <footer class="tracket__foot">
      <span class="tracket__updated">
        <Clock :size="11" aria-hidden="true" /> Last updated {{ updatedLabel }}
      </span>
      <NuxtLink :to="trackPath" class="tracket__link">
        Full timeline <ArrowRight :size="12" aria-hidden="true" />
      </NuxtLink>
    </footer>
  </article>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { ArrowRight, Check, Clock } from 'lucide-vue-next'
import TicketStepper from '~/components/workbench/tracker/TicketStepper.vue'
import type { TrackedJob } from '~/shared/types'
import { formatLeft, formatWhen, timeAgo } from '~/utils/printy'

const props = withDefaults(
  defineProps<{
    job: TrackedJob
    now?: number
    changed?: boolean
  }>(),
  { now: 0, changed: false },
)

const delivered = computed(() => props.job.state === 'delivered' || props.job.current_stage_key === 'delivered')
const trackPath = computed(() => `/track/${encodeURIComponent(props.job.job_code)}`)
const nowDate = computed(() => (props.now ? new Date(props.now) : new Date()))

const finishingSteps = computed(() => props.job.finishing_steps ?? props.job.finishing_substeps ?? [])
const finishingVisible = computed(() => ['finishing', 'quality_check', 'out_for_delivery', 'delivered'].includes(props.job.current_stage_key))

const countdown = computed(() => {
  if (delivered.value) return 'Delivered'
  if (props.job.is_late) {
    const overdue = props.job.overdue_minutes ?? props.job.lateness_minutes ?? 0
    return overdue > 0 ? `Running late by ${formatLeft(overdue).replace('~', '').replace(' left', '')}` : 'Running late'
  }
  if (!props.job.estimated_remaining_minutes || props.job.estimated_remaining_minutes <= 0) return 'Due now'
  return formatLeft(props.job.estimated_remaining_minutes)
})

const updatedLabel = computed(() => (props.now ? timeAgo(props.job.last_updated_at, props.now) : 'recently'))
</script>

<style scoped>
.tracket {
  border: 1px solid var(--line);
  border-radius: 18px;
  background: var(--panel);
  padding: 16px 18px 14px;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.tracket--late {
  border-color: #ff6b4a;
  box-shadow: inset 3px 0 0 #ff6b4a;
}

.tracket--delivered {
  border-color: color-mix(in srgb, #2fbf71 45%, var(--line));
  background: color-mix(in srgb, #2fbf71 6%, var(--panel));
}

.tracket--changed {
  animation: tracket-flash 1.4s ease;
}

@keyframes tracket-flash {
  0% { box-shadow: 0 0 0 0 color-mix(in srgb, var(--accent) 55%, transparent); }
  40% { box-shadow: 0 0 0 6px color-mix(in srgb, var(--accent) 18%, transparent); }
  100% { box-shadow: 0 0 0 0 transparent; }
}

@media (prefers-reduced-motion: reduce) {
  .tracket--changed { animation: none; }
}

.tracket__head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
}

.tracket__id {
  min-width: 0;
}

.tracket__code {
  display: inline-block;
  font-family: var(--font-mono2, ui-monospace, monospace);
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--accent);
  text-underline-offset: 3px;
}

.tracket__code:hover {
  text-decoration: underline;
}

.tracket__title {
  margin-top: 2px;
  font-family: var(--font-disp, inherit);
  font-size: 16px;
  font-weight: 700;
  letter-spacing: -0.01em;
  color: var(--ink);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.tracket__badge {
  display: inline-flex;
  flex-shrink: 0;
  align-items: center;
  gap: 4px;
  border-radius: 999px;
  padding: 4px 9px;
  font-family: var(--font-mono2, ui-monospace, monospace);
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

.tracket__badge--done {
  background: color-mix(in srgb, #2fbf71 16%, transparent);
  color: #0b7a52;
}

.tracket__badge--late {
  background: color-mix(in srgb, #ff6b4a 16%, transparent);
  color: #b23a1f;
}

/* --- countdown --- */
.tracket__meta {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: 4px 12px;
  margin-top: 14px;
}

.tracket__countdown {
  font-family: var(--font-disp, inherit);
  font-size: 22px;
  font-weight: 700;
  letter-spacing: -0.01em;
  color: var(--ink);
}

.tracket__countdown.is-late {
  color: #b23a1f;
}

.tracket__due {
  font-size: 11.5px;
  color: var(--sub);
}

.tracket--delivered .tracket__countdown {
  color: #0b7a52;
  font-size: 18px;
}

/* --- finishing chips --- */
.tracket__substeps {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
  margin: 10px 0 0;
  padding: 0;
  list-style: none;
}

.tracket__substep {
  border-radius: 999px;
  background: var(--panel2);
  padding: 3px 8px;
  font-size: 10.5px;
  color: var(--sub);
}

.tracket__substep.is-done {
  background: color-mix(in srgb, #2fbf71 14%, transparent);
  color: #0b7a52;
}

/* --- foot --- */
.tracket__foot {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  margin-top: 12px;
  border-top: 1px solid var(--line);
  padding-top: 10px;
}

.tracket__updated {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 10.5px;
  color: var(--sub);
}

.tracket__link {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-family: var(--font-mono2, ui-monospace, monospace);
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--accent);
}

@media (max-width: 640px) {
  .tracket {
    padding: 14px 14px 12px;
  }

  .tracket__countdown {
    font-size: 20px;
  }
}
</style>
