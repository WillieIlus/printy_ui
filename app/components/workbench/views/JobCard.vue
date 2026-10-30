<template>
  <article
    class="jobcard"
    :class="{
      'jobcard--attention': assignment.needs_attention && !finished,
      'jobcard--late': assignment.timing?.is_late && !finished,
      'jobcard--finished': finished,
      'jobcard--queued': Boolean(queued),
      'jobcard--sending': Boolean(optimistic),
    }"
    :aria-label="`Job ${code}, ${stageLabel}`"
  >
    <header class="jobcard__head">
      <div class="jobcard__code">{{ code }}</div>
      <h2 class="jobcard__title">{{ title }}</h2>
      <div class="jobcard__stage-row">
        <span class="jobcard__stage">{{ stageLabel }}</span>
        <span v-if="assignment.needs_attention && !finished" class="jobcard__flag">Needs you</span>
        <span v-if="finished" class="jobcard__flag jobcard__flag--done">Finished</span>
      </div>
      <div class="jobcard__time" :class="{ 'is-late': assignment.timing?.is_late && !finished }">
        {{ timeLeft }}
        <span v-if="dueLabel" class="jobcard__due">· due {{ dueLabel }}</span>
      </div>
    </header>

    <div v-if="timingChips.length || totalTaken" class="jobcard__timing" aria-label="Time taken">
      <span v-for="chip in timingChips" :key="chip" class="jobcard__chip">{{ chip }}</span>
      <span v-if="totalTaken" class="jobcard__chip jobcard__chip--total">Total {{ totalTaken }}</span>
    </div>

    <button
      type="button"
      class="job-action"
      :class="{ 'job-action--queued': Boolean(queued) }"
      :disabled="!actionEnabled"
      :aria-busy="Boolean(optimistic)"
      @click="$emit('advance', assignment)"
    >
      <Loader2 v-if="optimistic" :size="18" class="animate-spin" aria-hidden="true" />
      <Send v-else-if="queued" :size="18" aria-hidden="true" />
      <span>{{ buttonLabel }}</span>
    </button>

    <p v-if="queued" class="jobcard__pending" role="status">
      Not sent yet — we'll retry automatically. Nothing was lost.
    </p>

    <details v-if="briefRows.length" class="jobcard__brief">
      <summary>Job details <span class="jobcard__brief-note">spec, sheets, payout</span></summary>
      <dl class="jobcard__brief-grid">
        <div v-for="row in briefRows" :key="row.label">
          <dt>{{ row.label }}</dt>
          <dd>{{ row.value }}</dd>
        </div>
      </dl>
    </details>
  </article>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Loader2, Send } from 'lucide-vue-next'
import type { JobAssignment } from '~/shared/types'
import { usePrinterJobsStore } from '~/stores/printer-jobs'
import { formatDuration, formatKES, formatLeft, formatWhen } from '~/utils/printy'

const props = withDefaults(
  defineProps<{
    assignment: JobAssignment
    now?: number
  }>(),
  { now: 0 },
)
defineEmits<{ advance: [assignment: JobAssignment] }>()

const store = usePrinterJobsStore()

const code = computed(() => props.assignment.code || props.assignment.managed_reference || props.assignment.job_reference)
const finished = computed(() => Boolean(props.assignment.muted) || String(props.assignment.status) === 'completed')
const action = computed(() => props.assignment.printer_action ?? null)
const workflow = computed(() => props.assignment.printer_workflow ?? null)
const optimistic = computed(() => store.optimisticFor(props.assignment.id))
const queued = computed(() => Boolean(store.queuedFor(props.assignment.id)) && !store.isBusy(props.assignment.id))

const spec = computed<Record<string, unknown>>(() => {
  const summary = props.assignment.canonical?.spec_summary
  return summary && typeof summary === 'object' ? summary : {}
})

const title = computed(() => {
  const explicit = String(props.assignment.title ?? '').trim()
  if (explicit) return explicit
  const product = String(spec.value.product_type ?? spec.value.product ?? spec.value.product_label ?? '').trim()
  const quantity = Number(props.assignment.canonical?.quantity ?? 0)
  if (product && quantity) return `${quantity.toLocaleString()} ${product.toLowerCase()}`
  if (product) return product
  return 'Print job'
})

const stageLabel = computed(() => {
  if (optimistic.value) return optimistic.value.stageLabel
  return (
    workflow.value?.current_note
    || workflow.value?.current_stage_label
    || props.assignment.production_stage_label
    || 'In progress'
  )
})

const timeLeft = computed(() => {
  if (finished.value) return 'Done'
  const timing = props.assignment.timing
  if (timing?.is_late) {
    const over = Number(timing.lateness_minutes ?? 0)
    return over > 0 ? `Running late by ${formatDuration(over)}` : 'Running late'
  }
  const remaining = timing?.time_remaining_minutes
  if (remaining === null || remaining === undefined) return 'No SLA'
  if (remaining <= 0) return 'Due now'
  return formatLeft(remaining)
})

const dueLabel = computed(() => {
  const due = props.assignment.timing?.due_date || props.assignment.due_at
  if (!due) return ''
  return formatWhen(due, props.now ? new Date(props.now) : new Date())
})

const timingChips = computed(() => {
  const stages = workflow.value?.stages ?? []
  return stages
    .filter((stage) => stage.time_taken_minutes !== null && stage.time_taken_minutes !== undefined && stage.time_taken_minutes > 0)
    .map((stage) => `${stage.label} ${formatDuration(stage.time_taken_minutes)}`)
})

const totalTaken = computed(() => {
  const minutes = workflow.value?.time_taken_minutes
  return minutes && minutes > 0 ? formatDuration(minutes) : ''
})

const buttonLabel = computed(() => {
  if (optimistic.value) return `${optimistic.value.actionLabel}…`
  if (queued.value) return 'Not sent yet'
  const label = action.value?.label
  if (!label || action.value?.kind === 'none') return 'All steps complete'
  return label
})

const actionEnabled = computed(() => {
  if (finished.value || queued.value || optimistic.value) return false
  if (!action.value?.label || action.value.kind === 'none') return false
  return true
})

const briefRows = computed(() => {
  const rows: Array<{ label: string; value: string }> = []
  const push = (label: string, value: unknown) => {
    const text = String(value ?? '').trim()
    if (text) rows.push({ label, value: text })
  }
  push('Spec', spec.value.paper || spec.value.stock || spec.value.spec || spec.value.product_type)
  push('Quantity', props.assignment.canonical?.quantity ? Number(props.assignment.canonical.quantity).toLocaleString() : '')
  push('Press sheet', props.assignment.canonical?.press_sheet)
  push('Ups', props.assignment.canonical?.ups ? `${props.assignment.canonical.ups} per sheet` : '')
  push('Good sheets', props.assignment.canonical?.good_sheets)
  push('Sheets billed', props.assignment.canonical?.sheets_billed)
  push('Spoilage', props.assignment.canonical?.spoilage?.waste_sheets_added ? `${props.assignment.canonical.spoilage.waste_sheets_added} sheets` : '')
  push('Machine', props.assignment.canonical?.method?.machine_name)
  push('Your payout', props.assignment.payout_amount ? formatKES(props.assignment.payout_amount) : '')
  return rows
})
</script>

<style scoped>
.jobcard {
  position: relative;
  display: flex;
  flex-direction: column;
  border: 1px solid var(--line);
  border-radius: 18px;
  background: var(--panel);
  padding: 16px;
  transition: border-color 0.2s, box-shadow 0.2s, opacity 0.2s;
}

.jobcard--attention {
  border-color: var(--accent);
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--accent) 10%, transparent);
}

.jobcard--late {
  border-color: #ff6b4a;
  box-shadow: inset 3px 0 0 #ff6b4a;
}

.jobcard--finished {
  opacity: 0.62;
  border-color: var(--line);
  box-shadow: none;
}

.jobcard--queued {
  border-style: dashed;
}

.jobcard__head {
  min-width: 0;
}

.jobcard__code {
  font-family: var(--font-mono2, ui-monospace, monospace);
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--accent);
}

.jobcard__title {
  margin-top: 4px;
  font-family: var(--font-disp, inherit);
  font-size: 21px;
  font-weight: 700;
  line-height: 1.15;
  letter-spacing: -0.01em;
  color: var(--ink);
}

.jobcard__stage-row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 6px;
  margin-top: 7px;
}

.jobcard__stage {
  font-family: var(--font-mono2, ui-monospace, monospace);
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--ink);
}

.jobcard__flag {
  border-radius: 999px;
  background: color-mix(in srgb, var(--accent) 14%, transparent);
  padding: 2px 7px;
  font-family: var(--font-mono2, ui-monospace, monospace);
  font-size: 8px;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--accent);
}

.jobcard__flag--done {
  background: var(--panel2);
  color: var(--sub);
}

.jobcard__time {
  margin-top: 5px;
  font-family: var(--font-mono2, ui-monospace, monospace);
  font-size: 12px;
  font-weight: 600;
  color: var(--sub);
}

.jobcard__time.is-late {
  color: #b23a1f;
}

.jobcard__due {
  font-weight: 400;
}

.jobcard__timing {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  margin-top: 10px;
}

.jobcard__chip {
  border-radius: 999px;
  background: var(--panel2);
  padding: 3px 7px;
  font-family: var(--font-mono2, ui-monospace, monospace);
  font-size: 8.5px;
  letter-spacing: 0.04em;
  color: var(--sub);
}

.jobcard__chip--total {
  background: color-mix(in srgb, var(--accent) 10%, transparent);
  color: var(--accent);
  font-weight: 700;
}

.job-action {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
  min-height: 56px;
  margin-top: 14px;
  border-radius: 12px;
  background: var(--accent);
  padding: 0 18px;
  font-family: var(--font-disp, inherit);
  font-size: 16px;
  font-weight: 700;
  color: var(--accentInk);
  transition: filter 0.15s, transform 0.05s;
}

.job-action:hover:not(:disabled) {
  filter: brightness(1.06);
}

.job-action:active:not(:disabled) {
  transform: scale(0.99);
}

.job-action:disabled {
  cursor: not-allowed;
  opacity: 0.55;
}

.job-action--queued {
  background: color-mix(in srgb, #f5a623 30%, var(--panel2));
  color: var(--ink);
  opacity: 1;
}

.jobcard__pending {
  margin-top: 7px;
  font-family: var(--font-mono2, ui-monospace, monospace);
  font-size: 9.5px;
  line-height: 1.4;
  color: #8a5a00;
}

.jobcard__brief {
  margin-top: 10px;
  border-top: 1px solid var(--line);
  padding-top: 8px;
}

.jobcard__brief summary {
  cursor: pointer;
  font-family: var(--font-mono2, ui-monospace, monospace);
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--sub);
}

.jobcard__brief-note {
  margin-left: 5px;
  font-weight: 400;
  letter-spacing: 0.04em;
  text-transform: none;
}

.jobcard__brief-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 6px 12px;
  margin-top: 8px;
}

.jobcard__brief-grid dt {
  font-family: var(--font-mono2, ui-monospace, monospace);
  font-size: 8px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--sub);
}

.jobcard__brief-grid dd {
  margin: 1px 0 0;
  font-size: 11.5px;
  font-weight: 600;
  color: var(--ink);
}

@media (min-width: 640px) {
  .job-action {
    width: auto;
    min-width: 240px;
    align-self: flex-start;
  }
}
</style>
