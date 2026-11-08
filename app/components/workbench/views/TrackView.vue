<template>
  <main class="paper-noise mx-auto max-w-5xl px-5 py-12 sm:px-8 sm:py-16">
    <div class="mb-8 max-w-2xl">
      <DesignSectionLabel index="TR" tone="brand">Where's my job?</DesignSectionLabel>
      <h1 class="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">Track it. Never call again.</h1>
      <p class="mt-3 text-[16px] leading-relaxed text-ink-2">
        The public tracker shows stages and times only &mdash; money and internal parties stay inside the workspaces.
      </p>
    </div>

    <DesignTrackJobPrompt
      :initial-code="initialCode"
      :fetch-job="fetchPreview"
      @track="onPromptTrack"
    />

    <DesignAlert
      v-if="contactRequired"
      tone="warning"
      title="We need a bit more to find that job"
      class="mt-6"
    >
      <p class="text-xs leading-relaxed text-ink-2">
        Enter the email address or phone number on the job to track it.
      </p>
      <div class="mt-3 grid gap-2 sm:grid-cols-2">
        <input
          v-model="email"
          type="email"
          placeholder="Email on the job"
          class="w-full rounded-xl border border-line-strong bg-card px-3 py-2.5 text-sm text-ink outline-none placeholder:text-ink-3 focus:border-brand"
        />
        <input
          v-model="phone"
          type="tel"
          placeholder="Phone on the job (e.g. 2547... or +254...)"
          class="w-full rounded-xl border border-line-strong bg-card px-3 py-2.5 text-sm text-ink outline-none placeholder:text-ink-3 focus:border-brand"
        />
      </div>
      <button
        type="button"
        class="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-brand px-5 py-2.5 font-mono text-[10px] font-semibold tracking-[0.14em] text-white uppercase shadow-brand transition-colors hover:bg-brand-deep disabled:cursor-not-allowed disabled:opacity-50"
        :disabled="loading || (!email.trim() && !phone.trim())"
        @click="search()"
      >
        <Loader2 v-if="loading" :size="14" class="animate-spin" />
        <template v-else>Find job</template>
      </button>
    </DesignAlert>

    <DesignAlert v-if="error && !notFound" tone="error" class="mt-6">
      {{ error }}
    </DesignAlert>

    <DesignLoading
      v-if="loading"
      variant="inline"
      label="Looking up the live line…"
      class="mt-8 rounded-2xl border border-line bg-card px-5 py-4"
    />

    <DesignEmptyNote
      v-if="notFound"
      icon="SearchX"
      :title="'No job found for “' + lastQuery + '”'"
      hint="Double-check the token and the email or phone you entered. Newly accepted jobs can take a moment to appear."
      class="mt-8"
    >
      <button
        type="button"
        class="inline-flex items-center gap-1.5 font-mono text-[10px] font-semibold tracking-[0.12em] text-brand uppercase"
        @click="resetSearch()"
      >
        <Search :size="13" /> Try another token
      </button>
    </DesignEmptyNote>

    <div v-if="result && commandJob" class="mt-10 flex flex-col gap-5">
      <div v-if="isSample" class="flex justify-end">
        <span class="stamp border-brand bg-mint/90 text-brand-deep">Sample job &mdash; not a real order</span>
      </div>
      <DesignJobCommandCenter :job="commandJob" role="public" />

      <section class="rounded-2xl border border-line bg-card p-6 shadow-card sm:p-7">
        <DesignSectionLabel index="D" tone="brand">Live timing</DesignSectionLabel>

        <div class="mt-4 grid gap-3 sm:grid-cols-3">
          <div v-if="lastActivityRelative" class="rounded-xl border border-line bg-paper-2/60 px-4 py-3">
            <p class="flex items-center gap-1.5 font-mono text-[8.5px] font-semibold tracking-[0.13em] text-ink-3 uppercase">
              <History :size="11" /> Time since update
            </p>
            <p class="mt-1 text-[13px] font-semibold text-ink">{{ lastActivityRelative }}</p>
          </div>
          <div v-if="elapsedLabel" class="rounded-xl border border-line bg-paper-2/60 px-4 py-3">
            <p class="flex items-center gap-1.5 font-mono text-[8.5px] font-semibold tracking-[0.13em] text-ink-3 uppercase">
              <Timer :size="11" /> Time elapsed
            </p>
            <p class="mt-1 text-[13px] font-semibold text-ink">{{ elapsedLabel }}</p>
          </div>
          <div
            v-if="expectedLabel"
            class="rounded-xl border px-4 py-3"
            :class="isLate && !isComplete ? 'border-red/35 bg-red-soft/50' : 'border-line bg-paper-2/60'"
          >
            <p class="flex items-center gap-1.5 font-mono text-[8.5px] font-semibold tracking-[0.13em] text-ink-3 uppercase">
              <CalendarClock :size="11" /> Time expected
            </p>
            <p class="mt-1 text-[13px] font-semibold" :class="isLate && !isComplete ? 'text-red' : 'text-ink'">
              {{ expectedLabel }}
            </p>
          </div>
        </div>

        <div class="mt-5 rounded-xl border border-line bg-paper/60 p-5">
          <p class="mb-3 font-mono text-[9px] font-semibold tracking-[0.16em] text-brand uppercase">Who has the ball</p>
          <div class="grid gap-4 sm:grid-cols-3">
            <div>
              <p class="mb-0.5 text-xs text-ink-3">Current stage</p>
              <p class="text-sm font-bold text-ink">{{ currentLabel }}</p>
              <p v-if="currentStageRelative" class="mt-0.5 text-[10px] text-ink-3">
                {{ currentStage?.state === 'completed' ? 'completed' : 'started' }} {{ currentStageRelative }}
              </p>
            </div>
            <div>
              <p class="mb-0.5 text-xs text-ink-3">Held by</p>
              <span class="inline-flex items-center gap-1.5 rounded-full border border-line-strong bg-card px-2.5 py-1 text-xs font-semibold text-ink">
                <User :size="12" /> {{ ownerLabel(currentOwner) }}
              </span>
            </div>
            <div>
              <p class="mb-0.5 text-xs text-ink-3">Stage SLA / time remaining</p>
              <p class="flex items-center gap-1 text-sm font-bold text-ink">
                <Clock :size="14" class="text-brand" /> {{ slaLabel }}
              </p>
            </div>
          </div>
          <p class="mt-3 text-xs text-ink-2">
            Next action: <strong class="text-ink">{{ nextActionLabel }}</strong>
          </p>
        </div>

        <div class="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-line pt-4">
          <p class="text-xs text-ink-2">
            Due date: <strong class="text-ink">{{ dueDateLabel || 'Being confirmed' }}</strong>
          </p>
          <button
            type="button"
            class="inline-flex items-center gap-1.5 rounded-xl border border-line-strong bg-card px-3.5 py-2 font-mono text-[9.5px] font-semibold tracking-[0.12em] text-brand uppercase transition-colors hover:border-brand disabled:opacity-50"
            :disabled="loading"
            @click="refresh()"
          >
            <RefreshCw :size="12" :class="{ 'animate-spin': loading }" /> Refresh status
          </button>
        </div>

        <p v-if="timelineSummaryText" class="mt-3 text-[11px] font-medium text-ink-3">{{ timelineSummaryText }}</p>
        <p class="mt-3 text-[11px] leading-relaxed text-ink-3">
          Stage SLAs computed from one config in Africa/Nairobi working time; timestamps recorded in UTC. Buyer-caused waiting (e.g. artwork approval time) is never counted against your manager or printshop.
        </p>
        <p class="mt-2 text-[11px] leading-relaxed text-ink-3">
          Public tracking shows status and timing only. Private pricing, files and custody details stay behind your login.
        </p>
      </section>

      <section v-if="eventLog.length" class="rounded-2xl border border-line bg-card p-6 shadow-card sm:p-7">
        <div class="flex items-center gap-3">
          <span class="flex h-9 w-9 items-center justify-center rounded-lg bg-paper-2">
            <FileText :size="16" class="text-brand" />
          </span>
          <div>
            <h3 class="text-sm font-bold text-ink">Job event log</h3>
            <p class="text-[11px] text-ink-2">Append-only stages from the job event log. Timestamps are UTC.</p>
          </div>
        </div>
        <ol class="relative mt-5 space-y-4 before:absolute before:bottom-2 before:left-[13px] before:top-2 before:w-0.5 before:bg-line">
          <li v-for="event in eventLog" :key="event.key" class="relative flex gap-4 pl-9">
            <span
              class="absolute top-1 left-1.5 h-3.5 w-3.5 rounded-full border-2"
              :class="event.dotClass"
              :style="[{ borderColor: 'var(--color-card)' }, event.dotStyle]"
            />
            <div class="min-w-0 flex-1">
              <p class="text-sm font-semibold text-ink">{{ event.title }}</p>
              <p class="mt-0.5 text-xs text-ink-2">
                {{ event.actor }} &middot; {{ event.relative }} &middot;
                <span class="font-mono text-[10px]">{{ event.timestamp }}</span> &middot; Source metadata: system
              </p>
            </div>
          </li>
        </ol>
      </section>
    </div>

    <section
      v-else-if="result"
      class="crop-marks mt-10 rounded-2xl border border-line bg-card p-6 shadow-card sm:p-7"
    >
      <p class="font-mono text-[10px] tracking-[0.16em] text-ink-3 uppercase">Job reference</p>
      <div class="mt-2 flex flex-wrap items-start justify-between gap-4">
        <div class="min-w-0">
          <h2 class="break-words font-mono text-2xl font-bold text-ink">{{ result.tracking_reference }}</h2>
          <p class="mt-1 text-sm text-ink-2">{{ statusSubtitle }}</p>
        </div>
        <DesignStatusPill :tone="isComplete ? 'delivered' : isLate ? 'late' : 'ontrack'">
          {{ statusLabel }}
        </DesignStatusPill>
      </div>
      <div class="mt-5 grid gap-3 sm:grid-cols-2">
        <div class="rounded-xl border border-line bg-paper-2/60 px-4 py-3">
          <p class="font-mono text-[8.5px] font-semibold tracking-[0.13em] text-ink-3 uppercase">Due date:</p>
          <p class="mt-1 text-[13px] font-semibold text-ink">{{ dueDateLabel || 'Being confirmed' }}</p>
        </div>
        <div class="rounded-xl border border-line bg-paper-2/60 px-4 py-3">
          <p class="font-mono text-[8.5px] font-semibold tracking-[0.13em] text-ink-3 uppercase">Next action</p>
          <p class="mt-1 text-[13px] font-semibold text-ink">{{ nextActionLabel }}</p>
        </div>
      </div>
      <button
        type="button"
        class="mt-4 inline-flex items-center gap-1.5 rounded-xl border border-line-strong bg-card px-3.5 py-2 font-mono text-[9.5px] font-semibold tracking-[0.12em] text-brand uppercase transition-colors hover:border-brand disabled:opacity-50"
        :disabled="loading"
        @click="refresh()"
      >
        <RefreshCw :size="12" :class="{ 'animate-spin': loading }" /> Refresh status
      </button>
    </section>

    <aside class="mt-10 rounded-2xl border border-line bg-paper-2 p-6">
      <h3 class="text-sm font-bold text-ink">Can't find your tracking token?</h3>
      <p class="mt-1 text-sm text-ink-2">It was sent by email and SMS when your order was confirmed.</p>
      <div class="mt-4 flex flex-wrap gap-3">
        <a
          href="mailto:support@printy.ke"
          class="inline-flex items-center gap-2 rounded-xl bg-brand px-4 py-2.5 font-mono text-[10px] font-semibold tracking-[0.1em] text-white uppercase shadow-brand transition-colors hover:bg-brand-deep"
        >
          <Mail :size="15" /> Email support@printy.ke
        </a>
        <NuxtLink
          to="/sign-in"
          class="inline-flex items-center gap-2 rounded-xl border border-line-strong bg-card px-4 py-2.5 font-mono text-[10px] font-semibold tracking-[0.1em] text-ink-2 uppercase transition-colors hover:border-brand hover:text-brand"
        >
          <ShieldCheck :size="15" /> Sign in to dashboard
        </NuxtLink>
      </div>
    </aside>
  </main>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import {
  CalendarClock,
  Clock,
  FileText,
  History,
  Loader2,
  Mail,
  RefreshCw,
  Search,
  ShieldCheck,
  Timer,
  User,
} from 'lucide-vue-next'
import DesignAlert from '~/components/design/ui/Alert.vue'
import DesignEmptyNote from '~/components/design/ui/EmptyNote.vue'
import DesignLoading from '~/components/design/ui/Loading.vue'
import DesignSectionLabel from '~/components/design/ui/SectionLabel.vue'
import DesignStatusPill from '~/components/design/ui/StatusPill.vue'
import DesignTrackJobPrompt from '~/components/design/tracker/TrackJobPrompt.vue'
import type { DesignJobView } from '~/components/design/tracker/TrackJobPrompt.vue'
import DesignJobCommandCenter from '~/components/design/tracker/JobCommandCenter.vue'
import type { DesignJobCommandView } from '~/components/design/tracker/JobCommandCenter.vue'
import { useTrackStageView } from '~/composables/design/useTrackStageView'
import { formatJobDuration, jobExpectedTime, jobRelativeTime } from '~/shared/job-time'
import { timelineSummary } from '~/shared/list-sections'
import { API } from '~/shared/api-paths'
import { getApiErrorMessage } from '~/shared/api'
import { useAuthStore } from '~/stores/auth'
import type { JobStageTimeline, JobStageTimelineLine } from '~/shared/types'
import type { StatusTone } from '~/types/design/status-tone'

const props = defineProps<{
  token?: string
}>()

const TOKEN_PATTERN = /^[A-Za-z0-9_-]{8,80}$/
const SAMPLE_JOB_CODE = 'SAMPLE-1042'

interface TrackResult {
  tracking_reference: string
  code?: string
  job_status: string
  estimated_ready: string | null
  next_action: string
  current_stage?: string
  stage_label?: string
  stage_owner?: string
  due_date?: string | null
  is_late?: boolean
  timeline?: JobStageTimeline | null
}

const auth = useAuthStore()
const isAuthed = computed(() => auth.isAuthenticated)
const { api, publicApi } = useApi()

const route = useRoute()
const routeCode = typeof route.query.code === 'string' ? route.query.code : ''
const routeToken = typeof route.query.token === 'string' ? route.query.token : ''
const initialCode = (props.token || routeToken || routeCode).trim()

const query = ref(initialCode)
const lastQuery = ref(initialCode)
const loading = ref(false)
const notFound = ref(false)
const contactRequired = ref(false)
const error = ref('')
const result = ref<TrackResult | null>(null)
const email = ref('')
const phone = ref('')

const stages = computed<JobStageTimelineLine[]>(() => result.value?.timeline?.stages ?? [])

const { toDesignStages } = useTrackStageView()
const designStages = computed(() => toDesignStages(stages.value, (stage) => ({
  leftLabel: [stageMeta(stage), stageRelative(stage)].filter(Boolean).join(' \u00B7 '),
})))

const currentStage = computed<JobStageTimelineLine | null>(() => {
  const lines = stages.value
  if (!lines.length) return null
  return (
    lines.find(stage => stage.state === 'current' || stage.state === 'overdue')
    ?? lines.find(stage => stage.key === result.value?.current_stage)
    ?? lines[lines.length - 1]
    ?? null
  )
})

const currentLabel = computed(() => {
  const label = currentStage.value?.label || result.value?.stage_label || ''
  return label || result.value?.job_status || 'In progress'
})

const currentOwner = computed(() => currentStage.value?.owner || result.value?.stage_owner || '')

const nextActionLabel = computed(() => currentStage.value?.next_action || result.value?.next_action || 'Check back here for the next public status update.')

const isLate = computed(() => Boolean(result.value?.is_late || result.value?.timeline?.is_late))
const isComplete = computed(() => {
  const status = String(result.value?.job_status ?? '').toLowerCase()
  const stage = String(result.value?.timeline?.current_stage ?? result.value?.current_stage ?? '').toLowerCase()
  return status.includes('complete') || status.includes('delivered') || stage.includes('complete')
})

const dueDateLabel = computed(() => formatDateTime(
  result.value?.due_date
  || result.value?.timeline?.due_date
  || result.value?.estimated_ready,
))

const placedLabel = computed(() => {
  const stamps = stages.value
    .map(stage => stage.started_at)
    .filter((value): value is string => Boolean(value))
    .map(value => new Date(value).getTime())
    .filter(value => Number.isFinite(value))
  if (!stamps.length) return '\u2014'
  return formatDateTime(new Date(Math.min(...stamps)).toISOString())
})

const latestActivityAt = computed(() => {
  const stamps = stages.value
    .flatMap(stage => [stage.completed_at, stage.started_at])
    .filter((value): value is string => Boolean(value))
    .map(value => new Date(value).getTime())
    .filter(value => Number.isFinite(value))
  return stamps.length ? new Date(Math.max(...stamps)).toISOString() : ''
})

const lastActivityRelative = computed(() => jobRelativeTime(latestActivityAt.value))
const elapsedLabel = computed(() => {
  const total = result.value?.timeline?.total_taken_minutes
  return total === null || total === undefined ? '' : formatJobDuration(total)
})
const expectedLabel = computed(() => jobExpectedTime(
  result.value?.timeline?.time_remaining_minutes,
  isLate.value,
  isComplete.value,
))
const currentStageRelative = computed(() => {
  const stage = currentStage.value
  if (!stage) return ''
  return jobRelativeTime(stage.completed_at || stage.started_at)
})
const statusLabel = computed(() => isComplete.value ? 'Completed' : isLate.value ? 'Running late' : 'On track')
const isSample = computed(() => (
  String(result.value?.code ?? '').toUpperCase() === SAMPLE_JOB_CODE
  || lastQuery.value.trim().toUpperCase() === SAMPLE_JOB_CODE
))

const statusSubtitle = computed(() => {
  if (!result.value) return ''
  const code = result.value.code
  if (code && code !== result.value.tracking_reference) {
    return `Job ${code} \u00B7 ${result.value.job_status}`
  }
  return result.value.job_status
})

const slaLabel = computed(() => {
  const stage = currentStage.value
  if (!stage) return 'From the job config'
  const allowed = stage.sla_hours === null || stage.sla_hours === undefined || stage.sla_hours === '' ? '' : `~${stage.sla_hours} working hrs`
  const remaining = stage.state === 'completed' ? 'complete' : remainingText(stage)
  return [allowed, remaining].filter(Boolean).join(' \u00B7 ') || 'From the job config'
})

const timelineSummaryText = computed(() => timelineSummary(result.value?.timeline))

const commandJob = computed<DesignJobCommandView | null>(() => {
  const data = result.value
  if (!data || !designStages.value.length) return null
  const done = designStages.value.filter(stage => stage.state === 'done').length
  const active = designStages.value.find(stage => stage.state === 'active') ?? null
  return {
    code: data.code || data.tracking_reference,
    specLabel: data.job_status,
    currentStageIndex: Math.max(1, done + (active ? 1 : 0)),
    currentStageLabel: currentLabel.value,
    stageCount: designStages.value.length,
    tone: commandTone(data),
    statusLabel: statusLabel.value,
    qtyLabel: 'Public status',
    location: 'Stages and times only \u2014 no pricing shown',
    stages: designStages.value,
    leftLabel: expectedLabel.value || 'Being confirmed',
    dueLabel: dueDateLabel.value || 'Being confirmed',
    placedLabel: placedLabel.value,
    parties: [
      { label: 'Current stage', value: currentLabel.value },
      { label: 'Held by', value: ownerLabel(currentOwner.value) },
    ],
  }
})

interface EventLogItem {
  key: string
  title: string
  actor: string
  timestamp: string
  relative: string
  dotClass: string
  dotStyle: { background: string }
}

const eventLog = computed<EventLogItem[]>(() => {
  if (!stages.value.length) return []
  return stages.value
    .filter(stage => stage.state !== 'pending')
    .map((stage) => {
      const completed = stage.state === 'completed'
      const overdue = stage.state === 'overdue' || stage.is_overdue
      const at = completed ? stage.completed_at : stage.started_at
      return {
        key: stage.key,
        title: `${stage.label} - ${completed ? 'completed' : overdue ? 'overdue' : 'in progress'}`,
        actor: ownerLabel(stage.owner),
        timestamp: formatUtc(at),
        relative: jobRelativeTime(at),
        dotClass: !completed && !overdue ? 'animate-pulse' : '',
        dotStyle: { background: completed ? '#2FBF71' : overdue ? '#C81E44' : 'var(--color-brand)' },
      }
    })
})

function commandTone(data: TrackResult): StatusTone {
  const status = String(data.job_status ?? '').toLowerCase()
  const stage = String(data.timeline?.current_stage ?? data.current_stage ?? '').toLowerCase()
  if (status.includes('complete') || status.includes('delivered') || stage.includes('complete')) return 'delivered'
  if (data.is_late || data.timeline?.is_late) return 'late'
  return 'ontrack'
}

function sampleTrackResult(): TrackResult {
  const now = Date.now()
  const at = (minutes: number) => new Date(now + minutes * 60_000).toISOString()
  const due = at(225)
  return {
    tracking_reference: SAMPLE_JOB_CODE,
    code: SAMPLE_JOB_CODE,
    job_status: 'In production',
    estimated_ready: due,
    next_action: 'Printshop is on the press floor; finishing follows next.',
    current_stage: 'printing',
    stage_label: 'Printing',
    stage_owner: 'printer',
    due_date: due,
    is_late: false,
    timeline: {
      due_date: due,
      current_stage: 'printing',
      is_late: false,
      lateness_minutes: 0,
      time_remaining_minutes: 225,
      total_allowed_minutes: 4800,
      total_taken_minutes: 300,
      stages: [
        {
          key: 'payment',
          label: 'Payment received',
          owner: 'buyer',
          next_action: 'Payment secured in escrow',
          sla_hours: '1',
          started_at: at(-360),
          due_at: at(-300),
          completed_at: at(-350),
          time_taken_minutes: 10,
          time_remaining_minutes: null,
          is_overdue: false,
          state: 'completed',
        },
        {
          key: 'artwork',
          label: 'Artwork check',
          owner: 'manager',
          next_action: 'Approve the artwork',
          sla_hours: '2',
          started_at: at(-350),
          due_at: at(-230),
          completed_at: at(-300),
          time_taken_minutes: 50,
          time_remaining_minutes: null,
          is_overdue: false,
          state: 'completed',
        },
        {
          key: 'printing',
          label: 'Printing',
          owner: 'printer',
          next_action: 'Print the job',
          sla_hours: '5',
          started_at: at(-300),
          due_at: due,
          completed_at: null,
          time_taken_minutes: 300,
          time_remaining_minutes: 225,
          is_overdue: false,
          state: 'current',
        },
        {
          key: 'finishing',
          label: 'Finishing',
          owner: 'printer',
          next_action: 'Laminate and trim',
          sla_hours: '3',
          started_at: null,
          due_at: null,
          completed_at: null,
          time_taken_minutes: null,
          time_remaining_minutes: null,
          is_overdue: false,
          state: 'pending',
        },
        {
          key: 'quality',
          label: 'Quality check',
          owner: 'manager',
          next_action: 'Check quality before handoff',
          sla_hours: '1',
          started_at: null,
          due_at: null,
          completed_at: null,
          time_taken_minutes: null,
          time_remaining_minutes: null,
          is_overdue: false,
          state: 'pending',
        },
        {
          key: 'delivery',
          label: 'Out for delivery',
          owner: 'courier',
          next_action: 'Deliver to the buyer',
          sla_hours: '1',
          started_at: null,
          due_at: null,
          completed_at: null,
          time_taken_minutes: null,
          time_remaining_minutes: null,
          is_overdue: false,
          state: 'pending',
        },
        {
          key: 'delivered',
          label: 'Delivered',
          owner: 'buyer',
          next_action: 'Confirm delivery',
          sla_hours: '1',
          started_at: null,
          due_at: null,
          completed_at: null,
          time_taken_minutes: null,
          time_remaining_minutes: null,
          is_overdue: false,
          state: 'pending',
        },
      ],
    },
  }
}

function previewFrom(data: TrackResult): DesignJobView {
  const lines = data.timeline?.stages ?? []
  const design = toDesignStages(lines)
  const active = design.find(stage => stage.state === 'active') ?? null
  const done = design.filter(stage => stage.state === 'done').length
  return {
    code: data.code || data.tracking_reference,
    specLabel: data.job_status,
    currentStageIndex: Math.max(1, done + (active ? 1 : 0)),
    currentStageLabel: active?.label || data.stage_label || data.job_status,
    stageCount: design.length || 1,
    tone: commandTone(data),
    statusLabel: commandTone(data) === 'delivered' ? 'Delivered' : commandTone(data) === 'late' ? 'Running late' : 'On track',
  }
}

function contactParams(): Record<string, string> {
  const params: Record<string, string> = {}
  const trimmedEmail = email.value.trim()
  const trimmedPhone = phone.value.trim()
  if (trimmedEmail) params.email = trimmedEmail
  if (trimmedPhone) params.phone = trimmedPhone
  return params
}

async function fetchPreview(value: string): Promise<DesignJobView> {
  const raw = value.trim()
  if (raw.toUpperCase() === SAMPLE_JOB_CODE) {
    return previewFrom(sampleTrackResult())
  }
  const token = raw.toLowerCase().replace(/\s+/g, '')
  if (!TOKEN_PATTERN.test(token)) {
    throw new Error('Enter a valid job code from your confirmation')
  }
  const request = isAuthed.value ? api : publicApi
  const params = contactParams()
  try {
    const data = await request<TrackResult | { detail?: string }>(
      API.jobs.publicManagedTrack(token),
      {
        auth: isAuthed.value,
        query: Object.keys(params).length ? params : undefined,
      },
    )
    if (data && 'tracking_reference' in data && data.tracking_reference) {
      return previewFrom(data as TrackResult)
    }
    throw new Error('No job matches that code')
  } catch (caught: any) {
    if (caught?.statusCode === 400) {
      throw new Error('Enter the email or phone number on the job to track it')
    }
    if (caught instanceof Error && !('statusCode' in caught)) {
      throw caught
    }
    throw new Error('No job matches that code')
  }
}

function humanise(value: string | null | undefined): string {
  if (!value) return ''
  return value.replace(/[_-]+/g, ' ').replace(/\b\w/g, letter => letter.toUpperCase())
}

function ownerKey(owner: string | null | undefined): string {
  return String(owner ?? '').toLowerCase()
}

function ownerLabel(owner: string | null | undefined): string {
  switch (ownerKey(owner)) {
    case 'buyer': return 'Buyer'
    case 'manager': return 'Print manager'
    case 'printer': return 'Printshop'
    case 'printy': return 'Printy'
    case 'courier': return 'Courier'
    default: return humanise(owner) || 'Printy'
  }
}

function stageMeta(stage: JobStageTimelineLine): string {
  if (stage.state === 'completed') {
    return `${formatJobDuration(stage.time_taken_minutes) || '-'} taken`
  }
  if (stage.state === 'overdue' || stage.is_overdue) {
    const overdueMinutes = Math.abs(stage.time_remaining_minutes ?? stage.time_taken_minutes ?? 0)
    return `Overdue by ${formatJobDuration(overdueMinutes) || '-'}`
  }
  if (stage.state === 'current') {
    return `${formatJobDuration(stage.time_taken_minutes) || '0m'} elapsed`
  }
  return `SLA ${formatSla(stage.sla_hours)}`
}

function stageRelative(stage: JobStageTimelineLine): string {
  const at = stage.completed_at || stage.started_at
  const relative = jobRelativeTime(at)
  if (!relative) return stage.state === 'pending' ? 'not started' : ''
  return stage.completed_at ? `done ${relative}` : `started ${relative}`
}

function remainingText(stage: JobStageTimelineLine): string {
  const minutes = stage.time_remaining_minutes
  if (minutes === null || minutes === undefined) return ''
  if (minutes <= 0) return stage.is_overdue ? 'overdue' : 'due now'
  return `${formatJobDuration(minutes)} left`
}

function formatSla(value: number | string | null | undefined): string {
  if (value === null || value === undefined || value === '') return '-'
  const numeric = Number(value)
  if (!Number.isFinite(numeric)) return String(value)
  if (numeric < 1) return `${Math.round(numeric * 60)}m`
  return `${numeric}h`
}

function formatDateTime(value: string | null | undefined): string {
  if (!value) return ''
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  const text = date.toLocaleString('en-KE', {
    timeZone: 'Africa/Nairobi',
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
  return `${text} EAT`
}

function formatUtc(value: string | null | undefined): string {
  if (!value) return '-'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return `${date.toISOString().slice(0, 16).replace('T', ' ')}Z`
}

async function lookup(value: string) {
  const raw = value.trim()
  if (!raw) return
  lastQuery.value = raw
  loading.value = true
  notFound.value = false
  contactRequired.value = false
  error.value = ''
  result.value = null

  if (!TOKEN_PATTERN.test(raw)) {
    notFound.value = true
    loading.value = false
    return
  }

  if (raw.toUpperCase() === SAMPLE_JOB_CODE) {
    result.value = sampleTrackResult()
    loading.value = false
    return
  }

  const token = raw.toLowerCase().replace(/\s+/g, '')
  try {
    const request = isAuthed.value ? api : publicApi
    const params = contactParams()
    const data = await request<TrackResult | { detail?: string }>(
      API.jobs.publicManagedTrack(token),
      {
        auth: isAuthed.value,
        query: Object.keys(params).length ? params : undefined,
      },
    )
    if (data && 'tracking_reference' in data && data.tracking_reference) {
      result.value = data as TrackResult
      contactRequired.value = false
    } else {
      notFound.value = true
    }
  } catch (caught: any) {
    if (caught?.statusCode === 400) {
      const detail = typeof caught?.data?.detail === 'string' ? caught.data.detail : caught?.message
      if (detail && detail.toLowerCase().includes('email') && detail.toLowerCase().includes('phone')) {
        contactRequired.value = true
        notFound.value = false
        error.value = ''
      } else {
        notFound.value = true
      }
    } else if (caught?.statusCode === 410 || caught?.statusCode === 404) {
      notFound.value = true
    } else {
      error.value = getApiErrorMessage(caught, 'The tracking service could not be reached right now.')
    }
  } finally {
    loading.value = false
  }
}

async function onPromptTrack(value: string) {
  const next = value.trim().toUpperCase()
  if (!next) return
  lastQuery.value = next
  query.value = next
  if (route.path === '/track') {
    await navigateTo({ path: '/track', query: { code: next }, replace: true })
    await lookup(next)
    return
  }
  await navigateTo({ path: '/track', query: { code: next } })
}

function search() {
  return lookup(query.value)
}

function refresh() {
  return lookup(query.value || lastQuery.value)
}

function resetSearch() {
  notFound.value = false
  contactRequired.value = false
  error.value = ''
  result.value = null
  query.value = ''
  email.value = ''
  phone.value = ''
  lastQuery.value = ''
}

watch(() => props.token, (value) => {
  if (!value || value === lastQuery.value) return
  query.value = value
  void lookup(value)
})

watch(() => route.query.code, (value) => {
  if (typeof value !== 'string') return
  const next = value.trim()
  if (!next || next.toUpperCase() === lastQuery.value.toUpperCase()) return
  query.value = next
  void lookup(next)
})

onMounted(() => {
  if (initialCode) {
    query.value = initialCode
    void lookup(initialCode)
  }
})
</script>
