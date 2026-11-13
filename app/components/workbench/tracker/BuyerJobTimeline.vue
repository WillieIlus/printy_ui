<template>
  <DesignBuyerSurface>
    <div class="mx-auto flex w-full max-w-[1180px] flex-col gap-6">
      <div class="flex flex-wrap items-center justify-between gap-3">
        <NuxtLink
          to="/app/buyer#jobs"
          class="inline-flex min-h-11 items-center gap-1.5 font-mono text-[10.5px] font-semibold tracking-[0.14em] text-ink-3 uppercase transition-colors hover:text-brand"
        >
          <ArrowLeft :size="13" aria-hidden="true" /> Back to my jobs
        </NuxtLink>
        <NuxtLink
          v-if="publicTrackPath"
          :to="publicTrackPath"
          class="inline-flex min-h-11 items-center gap-1.5 font-mono text-[10.5px] font-semibold tracking-[0.14em] text-ink-3 uppercase transition-colors hover:text-brand"
        >
          Public status page <ArrowUpRight :size="13" aria-hidden="true" />
        </NuxtLink>
      </div>

      <DesignLoading
        v-if="loading && !detail"
        variant="skeleton"
        :rows="3"
        label="Loading your job timeline…"
      />

      <DesignAlert
        v-else-if="error && !detail"
        tone="error"
        title="We couldn't open that job"
        class="mt-2"
      >
        <p>{{ error }}</p>
        <p class="mt-2 text-xs leading-relaxed opacity-80">
          Signed-in timelines only open jobs paid and confirmed under your account. If you
          have a tracking code for another job, you can still
          <NuxtLink to="/track" class="font-semibold underline underline-offset-2">
            look it up in the public tracker
          </NuxtLink>.
        </p>
        <template #actions>
          <button
            type="button"
            class="rounded-xl border border-current/30 px-3 py-2 font-mono text-[10px] font-semibold tracking-[0.12em] uppercase transition-opacity hover:opacity-75"
            @click="load"
          >
            Try again
          </button>
        </template>
      </DesignAlert>

      <template v-else-if="detail">
        <header class="flex flex-col gap-1.5">
          <DesignSectionLabel index="TL" tone="brand">Full timeline</DesignSectionLabel>
          <h1 class="text-3xl font-bold tracking-tight text-ink sm:text-4xl">
            {{ detail.job.title }}
          </h1>
          <p class="text-[13.5px] leading-relaxed text-ink-2">
            <span class="font-mono font-semibold text-ink">{{ detail.job.job_code }}</span>
            <span aria-hidden="true"> · </span>{{ detail.job.stage_note || detail.job.current_stage }}
            <template v-if="lastUpdatedLabel">
              <span aria-hidden="true"> · </span>updated {{ lastUpdatedLabel }}
            </template>
          </p>
        </header>

        <DesignJobCommandCenter v-if="commandJob" :job="commandJob" role="client">
          <template #actions>
            <button
              type="button"
              class="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-line-strong bg-card px-4 py-2.5 font-mono text-[10px] font-semibold tracking-[0.12em] text-brand uppercase transition-colors hover:border-brand disabled:cursor-not-allowed disabled:opacity-50"
              :disabled="loading"
              @click="load"
            >
              <RefreshCw :size="13" :class="{ 'animate-spin': loading }" aria-hidden="true" />
              Refresh timeline
            </button>
          </template>
        </DesignJobCommandCenter>

        <section class="rounded-2xl border border-line bg-card p-6 shadow-card sm:p-7">
          <div class="flex flex-wrap items-end justify-between gap-3">
            <div>
              <DesignSectionLabel index="LT" tone="brand">Full stage log</DesignSectionLabel>
              <p class="mt-1 text-[12.5px] text-ink-2">
                Every stage from payment to delivery, with its own clock.
              </p>
            </div>
            <span v-if="timelineSummaryText" class="font-mono text-[10px] tracking-[0.08em] text-ink-3 uppercase">
              {{ timelineSummaryText }}
            </span>
          </div>

          <ol
            v-if="timelineStages.length"
            class="relative mt-5 before:absolute before:top-4 before:bottom-4 before:left-[6px] before:w-px before:bg-line"
          >
            <li
              v-for="stage in timelineStages"
              :key="stage.key"
              class="relative flex gap-4 py-2.5 pl-6"
            >
              <span
                class="absolute top-[18px] left-0 h-3 w-3 rounded-full border-2"
                :style="{ background: dotColor(stage), borderColor: 'var(--color-card)' }"
                aria-hidden="true"
              />
              <div class="min-w-0 flex-1">
                <div class="flex flex-wrap items-baseline justify-between gap-2">
                  <p class="text-sm font-semibold text-ink">{{ stage.label }}</p>
                  <span
                    class="rounded-full px-2 py-0.5 font-mono text-[9px] font-semibold tracking-[0.1em] uppercase"
                    :class="pillClass(stage)"
                  >
                    {{ stageStateLabel(stage) }}
                  </span>
                </div>
                <p class="mt-0.5 text-[11.5px] leading-relaxed text-ink-3">
                  {{ stageWhen(stage) }}
                  <template v-if="stageDuration(stage)">
                    <span aria-hidden="true"> · </span>{{ stageDuration(stage) }}
                  </template>
                </p>
              </div>
            </li>
          </ol>
          <p v-else class="mt-4 text-sm text-ink-2">
            The stage log will appear as soon as production starts.
          </p>
        </section>

        <section class="rounded-2xl border border-line bg-card p-6 shadow-card sm:p-7">
          <DesignSectionLabel index="PB" tone="brand">Public status</DesignSectionLabel>
          <template v-if="publicTrackPath">
            <p class="mt-3 text-[13px] leading-relaxed text-ink-2">
              You never need a tracking code while you are signed in. To share progress, send
              the public status page:
            </p>
            <div class="mt-4 flex flex-wrap items-center gap-3">
              <span class="rounded-lg border border-line bg-paper-2 px-3 py-2 font-mono text-xs font-semibold text-ink">
                {{ detail.tracking_reference }}
              </span>
              <NuxtLink
                :to="publicTrackPath"
                class="inline-flex min-h-11 items-center gap-1.5 rounded-xl border border-line-strong bg-card px-4 py-2.5 font-mono text-[10px] font-semibold tracking-[0.12em] text-brand uppercase transition-colors hover:border-brand"
              >
                Open public status <ArrowUpRight :size="13" aria-hidden="true" />
              </NuxtLink>
            </div>
            <p class="mt-3 text-[11.5px] leading-relaxed text-ink-3">
              The public page still asks for the email or phone on this job before it shows
              anything. Pricing, files and internal notes stay private.
            </p>
          </template>
          <template v-else>
            <div class="mt-3 rounded-xl border border-dashed border-line-strong bg-paper-2/40 p-4">
              <p class="text-[13px] font-semibold text-ink">No public tracking code yet</p>
              <p class="mt-1 text-[12.5px] leading-relaxed text-ink-2">
                This job does not have a shareable tracking code. Your full timeline above is
                still live while you are signed in. If you have a code for another job, use the
                public tracker's manual lookup.
              </p>
              <NuxtLink
                to="/track"
                class="mt-3 inline-flex min-h-11 items-center gap-1.5 rounded-xl border border-line-strong bg-card px-4 py-2.5 font-mono text-[10px] font-semibold tracking-[0.12em] text-brand uppercase transition-colors hover:border-brand"
              >
                Enter a tracking code <ArrowRight :size="13" aria-hidden="true" />
              </NuxtLink>
            </div>
          </template>
        </section>

        <p v-if="error" class="text-[12px] leading-relaxed text-ink-3">
          We couldn't refresh the timeline. The last loaded stages are still shown above.
          <NuxtLink to="/track" class="font-semibold text-brand underline underline-offset-2">
            Look up a tracking code instead
          </NuxtLink>.
        </p>
      </template>
    </div>
  </DesignBuyerSurface>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { ArrowLeft, ArrowRight, ArrowUpRight, RefreshCw } from 'lucide-vue-next'
import DesignAlert from '~/components/design/ui/Alert.vue'
import DesignLoading from '~/components/design/ui/Loading.vue'
import DesignSectionLabel from '~/components/design/ui/SectionLabel.vue'
import DesignBuyerSurface from '~/components/design/buyer/BuyerSurface.vue'
import DesignJobCommandCenter from '~/components/design/tracker/JobCommandCenter.vue'
import type { DesignJobCommandView } from '~/components/design/tracker/JobCommandCenter.vue'
import { useTrackStageView } from '~/composables/design/useTrackStageView'
import { API } from '~/shared/api-paths'
import { getApiErrorMessage } from '~/shared/api'
import { formatJobDuration, jobRelativeTime } from '~/shared/job-time'
import type { TrackedJob } from '~/shared/types'
import type { StatusTone } from '~/types/design/status-tone'
import { formatWhen } from '~/utils/printy'

/**
 * The signed-in buyer's full timeline. It is resolved by the secure job id and
 * the API scopes the lookup to the buyer's own paid jobs, so no tracking code
 * is needed, typed, or trusted here. The public tracker stays a separate route
 * and is only offered as a share link and a manual-code fallback.
 */
interface BuyerTimelineStage {
  key: string
  label: string
  started_at: string | null
  due_at: string | null
  completed_at: string | null
  time_taken_minutes: number | null
  time_remaining_minutes: number | null
  is_overdue: boolean
  state: string
}

interface BuyerTimeline {
  due_date: string | null
  current_stage: string
  is_late: boolean
  lateness_minutes: number
  time_remaining_minutes: number | null
  total_allowed_minutes: number
  total_taken_minutes: number
  stages: BuyerTimelineStage[]
}

interface BuyerJobDetail {
  role: string
  job: TrackedJob
  timeline: BuyerTimeline
  tracking_reference: string
  tracking_url: string
}

const props = defineProps<{
  jobId: number
}>()

const { api } = useApi()
const detail = ref<BuyerJobDetail | null>(null)
const loading = ref(true)
const error = ref('')

const { toDesignStages } = useTrackStageView()

const publicTrackPath = computed(() => {
  const reference = detail.value?.tracking_reference?.trim()
  return reference ? `/track/${encodeURIComponent(reference)}` : ''
})

const delivered = computed(() => (
  detail.value?.job.state === 'delivered'
  || detail.value?.job.current_stage_key === 'delivered'
))

const isLate = computed(() => Boolean(detail.value?.job.is_late || detail.value?.timeline.is_late))

const statusLabel = computed(() => {
  if (delivered.value) return 'Delivered'
  return isLate.value ? 'Running late' : 'On track'
})

const commandTone = computed<StatusTone>(() => {
  if (delivered.value) return 'delivered'
  return isLate.value ? 'late' : 'ontrack'
})

const lastUpdatedLabel = computed(() => jobRelativeTime(detail.value?.job.last_updated_at))

const leftLabel = computed(() => {
  const job = detail.value?.job
  if (!job) return ''
  if (delivered.value) return 'Delivered'
  if (isLate.value) {
    return job.overdue_minutes > 0
      ? `Overdue by ${formatJobDuration(job.overdue_minutes)}`
      : 'Running late'
  }
  return formatJobDuration(job.estimated_remaining_minutes)
    ? `${formatJobDuration(job.estimated_remaining_minutes)} left`
    : 'Due now'
})

const placedLabel = computed(() => {
  const stamps = (detail.value?.timeline.stages ?? [])
    .map(stage => stage.started_at)
    .filter((value): value is string => Boolean(value))
    .map(value => new Date(value).getTime())
    .filter(value => Number.isFinite(value))
  if (!stamps.length) return ''
  return formatWhen(new Date(Math.min(...stamps)).toISOString())
})

const buyerStageLines = computed(() => (
  (detail.value?.job.stages ?? []).map(stage => ({
    key: stage.key,
    label: stage.label,
    state: stage.status === 'done'
      ? 'completed'
      : stage.status === 'current'
        ? 'current'
        : 'pending',
    is_overdue: false,
    at: stage.completed_at || stage.started_at,
    completed: Boolean(stage.completed_at),
  }))
))

const designStages = computed(() => toDesignStages(buyerStageLines.value, (line) => {
  const relative = jobRelativeTime(line.at)
  if (!relative) return { leftLabel: '' }
  return { leftLabel: `${line.completed ? 'done' : 'started'} ${relative}` }
}))

const commandJob = computed<DesignJobCommandView | null>(() => {
  const data = detail.value
  if (!data || !designStages.value.length) return null
  return {
    code: data.job.job_code,
    specLabel: 'Private buyer timeline',
    currentStageIndex: Math.max(1, data.job.stage_number),
    currentStageLabel: data.job.current_stage,
    stageCount: designStages.value.length,
    tone: commandTone.value,
    statusLabel: statusLabel.value,
    qtyLabel: data.job.stage_note || data.job.current_stage,
    location: 'Your signed-in view — no tracking code needed',
    stages: designStages.value,
    leftLabel: leftLabel.value,
    dueLabel: formatWhen(data.job.due_at) || 'Being confirmed',
    placedLabel: placedLabel.value || 'Being confirmed',
    parties: [
      { label: 'Current stage', value: data.job.current_stage },
      { label: 'Last update', value: lastUpdatedLabel.value || 'Just now' },
    ],
  }
})

const timelineStages = computed(() => detail.value?.timeline.stages ?? [])

const timelineSummaryText = computed(() => {
  const timeline = detail.value?.timeline
  if (!timeline) return ''
  const taken = formatJobDuration(timeline.total_taken_minutes)
  const allowed = formatJobDuration(timeline.total_allowed_minutes)
  if (!taken && !allowed) return ''
  const schedule = timeline.is_late ? 'running late' : 'on schedule'
  return [taken && `${taken} taken`, allowed && `${allowed} allowed`, schedule]
    .filter(Boolean)
    .join(' · ')
})

function stageStateLabel(stage: BuyerTimelineStage): string {
  if (stage.state === 'completed') return 'Done'
  if (stage.state === 'overdue' || stage.is_overdue) return 'Overdue'
  if (stage.state === 'current') return 'In progress'
  return 'Next'
}

function dotColor(stage: BuyerTimelineStage): string {
  if (stage.state === 'completed') return '#2FBF71'
  if (stage.state === 'overdue' || stage.is_overdue) return '#C81E44'
  if (stage.state === 'current') return 'var(--color-brand)'
  return 'var(--color-line-strong)'
}

function pillClass(stage: BuyerTimelineStage): string {
  if (stage.state === 'completed') return 'bg-mint text-brand-deep'
  if (stage.state === 'overdue' || stage.is_overdue) return 'bg-red-soft text-red'
  if (stage.state === 'current') return 'bg-amber-soft text-amber'
  return 'bg-paper-2 text-ink-3'
}

function stageWhen(stage: BuyerTimelineStage): string {
  if (stage.completed_at) return `Completed ${formatWhen(stage.completed_at)}`
  if (stage.state === 'current' || stage.state === 'overdue' || stage.is_overdue) {
    return stage.started_at ? `Started ${formatWhen(stage.started_at)}` : 'In progress'
  }
  return stage.due_at ? `Planned ${formatWhen(stage.due_at)}` : 'Not started yet'
}

function stageDuration(stage: BuyerTimelineStage): string {
  if (stage.state === 'completed') {
    const taken = formatJobDuration(stage.time_taken_minutes)
    return taken ? `${taken} taken` : ''
  }
  if (stage.state === 'current' || stage.state === 'overdue' || stage.is_overdue) {
    const remaining = stage.time_remaining_minutes
    if (remaining !== null && remaining < 0) {
      return `${formatJobDuration(Math.abs(remaining))} overdue`
    }
    const elapsed = formatJobDuration(stage.time_taken_minutes)
    return elapsed ? `${elapsed} elapsed` : ''
  }
  return ''
}

async function load() {
  if (!props.jobId) {
    detail.value = null
    error.value = 'This timeline link is missing a valid job id.'
    loading.value = false
    return
  }
  loading.value = true
  error.value = ''
  try {
    detail.value = await api<BuyerJobDetail>(API.client.trackedJob(props.jobId))
  } catch (caught) {
    const status = (caught as { statusCode?: number; status?: number })?.statusCode
      ?? (caught as { status?: number })?.status
    if (status === 404 || status === 403) {
      // A revoked or foreign job must never keep rendering stale private data.
      detail.value = null
      error.value = 'This job is not available in your workspace. It may belong to another account, or it may not be paid and confirmed yet.'
    } else {
      error.value = getApiErrorMessage(caught) || 'We could not load this job timeline. Please try again.'
    }
  } finally {
    loading.value = false
  }
}

// Load after mount so the authenticated client (not the server render) makes
// the request, and only re-load when the route id actually changes.
onMounted(() => {
  void load()
})
watch(() => props.jobId, () => {
  void load()
})
</script>
