<template>
  <section class="relative overflow-hidden" style="background: var(--bg)">
    <div class="pointer-events-none absolute inset-0">
      <div class="absolute -right-20 -top-40 h-96 w-96 rounded-full blur-3xl" style="background: color-mix(in srgb, var(--accent) 8%, transparent)" />
    </div>

    <div class="relative mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8 lg:py-20">
      <div class="mb-6 inline-flex items-center gap-2 rounded-full border px-4 py-1.5" style="border-color: var(--line); background: var(--panel)">
        <Search :size="14" style="color: var(--accent)" />
        <span class="font-mono2 text-[10px] font-semibold uppercase tracking-[0.18em]" style="color: var(--accent)">Job tracker</span>
      </div>

      <h1 class="font-disp text-4xl font-bold leading-[1.05] tracking-tight text-[var(--ink)] sm:text-5xl">
        Who has your job<br />right now <span style="color: var(--accent)">&mdash; exactly.</span>
      </h1>

      <p class="mt-5 max-w-2xl text-[15px] leading-relaxed text-[var(--sub)]">
        Paste your tracking token to see the current stage, who holds it, the next action, and time remaining &mdash; plus your acknowledged due date and full handoff timing.
      </p>

      <form class="mt-10 rounded-3xl border p-6 sm:p-8" style="border-color: var(--line); background: var(--panel); box-shadow: 0 10px 44px -24px rgba(27,21,16,.35)" novalidate @submit.prevent="search()">
        <div class="mb-6 flex items-center gap-3">
          <div class="flex h-10 w-10 items-center justify-center rounded-xl" style="background: var(--panel2)">
            <Package :size="20" style="color: var(--accent)" />
          </div>
          <div>
            <h2 class="font-disp text-[17px] font-bold text-[var(--ink)]">Enter tracking token</h2>
            <p class="font-mono2 text-[9px] uppercase tracking-[0.12em] text-[var(--sub)]">From your order confirmation</p>
          </div>
        </div>

        <div class="space-y-4">
          <div>
            <input
              v-model="query"
              type="text"
              placeholder="Paste your tracking token here"
              autocomplete="off"
              autocapitalize="off"
              spellcheck="false"
              class="w-full rounded-xl border border-[var(--line)] bg-[var(--panel2)] px-4 py-3.5 text-sm text-[var(--ink)] outline-none transition-all placeholder:text-[var(--sub)] focus:border-[var(--accent)]"
            />
            <p v-if="query !== '' && !tokenIsValid" class="mt-1.5 flex items-center gap-1.5 text-xs" style="color: #B4243F">
              <AlertCircle :size="12" /> Enter a valid token from your confirmation message.
            </p>
          </div>

          <button
            type="submit"
            :disabled="!canSubmit"
            class="press-key inline-flex w-full items-center justify-center gap-2 rounded-xl px-6 py-3.5 font-mono2 text-[11px] font-semibold uppercase tracking-[0.14em] transition-all disabled:cursor-not-allowed disabled:opacity-50"
            :style="{ background: 'var(--accent)', color: 'var(--accentInk)' }"
          >
            <template v-if="loading">
              <Loader2 :size="16" class="animate-spin" /> Looking up...
            </template>
            <template v-else>
              Track this job <ArrowRight :size="16" />
            </template>
          </button>
        </div>

        <div v-if="error && !notFound" class="surface-danger mt-4 flex items-start gap-2 rounded-xl border p-3">
          <AlertCircle :size="16" class="mt-0.5 shrink-0" style="color: #B4243F" />
          <p class="text-sm" style="color: #B4243F">{{ error }}</p>
        </div>

        <div v-if="contactRequired" class="surface-warn mt-4 rounded-2xl border p-4">
          <div class="text-sm font-bold text-[var(--ink)]">We need a bit more to find that job</div>
          <p class="mt-1 text-xs leading-relaxed text-[var(--sub)]">
            Enter the email address or phone number on the job to track it.
          </p>
          <div class="mt-3 grid gap-2 sm:grid-cols-2">
            <input
              v-model="email"
              type="email"
              placeholder="Email on the job"
              class="w-full rounded-xl border border-[var(--line)] bg-[var(--panel)] px-3 py-2.5 text-sm text-[var(--ink)] outline-none placeholder:text-[var(--sub)] focus:border-[var(--accent)]"
            />
            <input
              v-model="phone"
              type="tel"
              placeholder="Phone on the job (e.g. 2547... or +254...)"
              class="w-full rounded-xl border border-[var(--line)] bg-[var(--panel)] px-3 py-2.5 text-sm text-[var(--ink)] outline-none placeholder:text-[var(--sub)] focus:border-[var(--accent)]"
            />
          </div>
          <button
            type="button"
            class="press-key mt-3 inline-flex w-full items-center justify-center gap-2 rounded-xl px-5 py-2.5 font-mono2 text-[10px] font-semibold uppercase tracking-[0.14em] disabled:cursor-not-allowed disabled:opacity-50"
            :style="{ background: 'var(--accent)', color: 'var(--accentInk)' }"
            :disabled="loading || (!email.trim() && !phone.trim())"
            @click="search()"
          >
            <Loader2 v-if="loading" :size="14" class="animate-spin" />
            <template v-else>Find job</template>
          </button>
        </div>

        <p class="mt-4 flex items-center gap-2 font-mono2 text-[9px] uppercase tracking-[0.1em] text-[var(--sub)]">
          <Shield :size="12" /> Token-only access &middot; No guessable job numbers &middot; Secure lookup
        </p>
      </form>

      <div v-if="notFound" class="surface-danger mt-6 flex items-start gap-3 rounded-2xl border p-5">
        <CircleDashed :size="20" class="mt-0.5 shrink-0" style="color: #B4243F" />
        <div class="min-w-0 flex-1">
          <h2 class="text-sm font-bold text-[var(--ink)]">No job found for "{{ lastQuery }}"</h2>
          <p class="mt-1 text-sm leading-relaxed text-[var(--sub)]">
            Double-check the token and the email or phone you entered. Newly accepted jobs can take a moment to appear.
          </p>
          <button type="button" class="mt-3 inline-flex items-center gap-1.5 font-mono2 text-[10px] font-semibold uppercase tracking-[0.12em]" style="color: var(--accent)" @click="resetSearch()">
            <Search :size="13" /> Try another token
          </button>
        </div>
      </div>

      <section v-if="result" class="mt-6 space-y-6">
        <div class="rounded-3xl border p-6 sm:p-8" style="border-color: var(--line); background: var(--panel); box-shadow: 0 10px 44px -24px rgba(27,21,16,.3)">
          <div class="mb-6 flex flex-wrap items-start justify-between gap-4">
            <div class="min-w-0">
              <p class="mb-1 font-mono2 text-[9px] font-semibold uppercase tracking-[0.16em] text-[var(--sub)]">Job reference</p>
              <h2 class="break-words font-mono2 text-2xl font-bold text-[var(--ink)]">{{ result.tracking_reference }}</h2>
              <p class="mt-1 text-sm text-[var(--sub)]">{{ statusSubtitle }}</p>
            </div>
            <div class="flex flex-col items-start gap-2 sm:items-end">
              <span
                class="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 font-mono2 text-[9.5px] font-semibold uppercase tracking-[0.12em]"
                :class="isLate && !isComplete ? 'tone-danger' : 'tone-success'"
              >
                <CheckCircle2 v-if="isComplete" :size="12" />
                <Clock v-else :size="12" /> {{ statusLabel }}
              </span>
              <p class="text-xs text-[var(--sub)]">
                Due date: <strong class="text-[var(--ink)]">{{ dueDateLabel || 'Being confirmed' }}</strong>
              </p>
              <button
                type="button"
                class="inline-flex items-center gap-1.5 font-mono2 text-[9.5px] font-semibold uppercase tracking-[0.12em] disabled:opacity-50"
                style="color: var(--accent)"
                :disabled="loading"
                @click="refresh()"
              >
                <RefreshCw :size="12" :class="{ 'animate-spin': loading }" /> Refresh status
              </button>
            </div>
          </div>

          <div class="mt-5 grid gap-2 sm:grid-cols-3">
            <div v-if="lastActivityRelative" class="rounded-2xl border px-3 py-2.5" style="border-color: var(--line); background: var(--panel2)">
              <p class="flex items-center gap-1.5 font-mono2 text-[8.5px] font-semibold uppercase tracking-[0.13em] text-[var(--sub)]"><History :size="11" /> Time since update</p>
              <p class="mt-1 text-[12.5px] font-semibold text-[var(--ink)]">{{ lastActivityRelative }}</p>
            </div>
            <div v-if="elapsedLabel" class="rounded-2xl border px-3 py-2.5" style="border-color: var(--line); background: var(--panel2)">
              <p class="flex items-center gap-1.5 font-mono2 text-[8.5px] font-semibold uppercase tracking-[0.13em] text-[var(--sub)]"><Timer :size="11" /> Time elapsed</p>
              <p class="mt-1 text-[12.5px] font-semibold text-[var(--ink)]">{{ elapsedLabel }}</p>
            </div>
            <div v-if="expectedLabel" class="rounded-2xl border px-3 py-2.5" :class="isLate && !isComplete ? 'surface-danger border' : ''" :style="isLate && !isComplete ? {} : { borderColor: 'var(--line)', background: 'var(--panel2)' }">
              <p class="flex items-center gap-1.5 font-mono2 text-[8.5px] font-semibold uppercase tracking-[0.13em] text-[var(--sub)]"><CalendarClock :size="11" /> Time expected</p>
              <p class="mt-1 text-[12.5px] font-semibold" :style="isLate && !isComplete ? { color: '#B4243F' } : { color: 'var(--ink)' }">{{ expectedLabel }}</p>
            </div>
          </div>

          <div class="mt-6 rounded-2xl border p-5" style="border-color: var(--line); background: color-mix(in srgb, var(--accent) 5%, var(--panel))">
            <p class="mb-3 font-mono2 text-[9px] font-semibold uppercase tracking-[0.16em]" style="color: var(--accent)">Who has the ball</p>
            <div class="grid gap-4 sm:grid-cols-3">
              <div>
                <p class="mb-0.5 text-xs text-[var(--sub)]">Current stage</p>
                <p class="text-sm font-bold text-[var(--ink)]">{{ currentLabel }}</p>
                <p v-if="currentStageRelative" class="mt-0.5 text-[10px] text-[var(--sub)]">{{ currentStage?.state === 'completed' ? 'completed' : 'started' }} {{ currentStageRelative }}</p>
              </div>
              <div>
                <p class="mb-0.5 text-xs text-[var(--sub)]">Held by</p>
                <span class="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold" :class="ownerBadge(currentOwner)">
                  <User :size="12" /> {{ ownerLabel(currentOwner) }}
                </span>
              </div>
              <div>
                <p class="mb-0.5 text-xs text-[var(--sub)]">Stage SLA / time remaining</p>
                <p class="flex items-center gap-1 text-sm font-bold text-[var(--ink)]">
                  <Clock :size="14" style="color: var(--accent)" /> {{ slaLabel }}
                </p>
              </div>
            </div>
            <p class="mt-3 text-xs text-[var(--sub)]">
              Next action: <strong class="text-[var(--ink)]">{{ nextActionLabel }}</strong>
            </p>
          </div>

          <div v-if="stages.length" class="mt-5 grid gap-2" :class="stages.length > 5 ? 'sm:grid-cols-3 lg:grid-cols-5' : 'sm:grid-cols-5'">
            <div v-for="stage in stages" :key="stage.key" class="rounded-xl border p-3 text-center" :style="stageCardStyle(stage)">
              <div class="mx-auto mb-1.5 flex h-7 w-7 items-center justify-center rounded-lg" :style="stageIconStyle(stage)">
                <component :is="stageIcon(stage.key)" :size="14" />
              </div>
              <p class="text-xs font-bold" :style="{ color: stageLabelColor(stage) }">{{ stage.label }}</p>
              <span class="mt-1 inline-block rounded px-1.5 py-0.5 font-mono2 text-[8.5px] font-semibold uppercase tracking-[0.1em]" :class="stageBadgeClass(stage)">
                {{ stageBadgeText(stage) }}
              </span>
              <p class="mt-1 text-[9.5px] font-medium leading-tight text-[var(--sub)]">{{ stageMeta(stage) }}</p>
              <p v-if="stageRelative(stage)" class="mt-0.5 text-[9px] leading-tight text-[var(--sub)]">{{ stageRelative(stage) }}</p>
            </div>
          </div>

          <p v-if="timelineSummaryText" class="mt-3 text-[11px] font-medium text-[var(--sub)]">{{ timelineSummaryText }}</p>
          <p class="mt-3 text-[11px] leading-relaxed text-[var(--sub)]">
            Stage SLAs computed from one config in Africa/Nairobi working time; timestamps recorded in UTC. Buyer-caused waiting (e.g. artwork approval time) is never counted against your manager or printshop.
          </p>
          <p class="mt-2 text-[11px] leading-relaxed text-[var(--sub)]">
            Public tracking shows status and timing only. Private pricing, files and custody details stay behind your login.
          </p>
        </div>

        <div v-if="eventLog.length" class="rounded-3xl border p-6 sm:p-8" style="border-color: var(--line); background: var(--panel); box-shadow: 0 10px 44px -24px rgba(27,21,16,.3)">
          <div class="mb-5 flex items-center gap-3">
            <div class="flex h-9 w-9 items-center justify-center rounded-lg" style="background: var(--panel2)">
              <FileText :size="16" style="color: var(--accent)" />
            </div>
            <div>
              <h3 class="font-disp text-sm font-bold text-[var(--ink)]">Job event log</h3>
              <p class="text-[11px] text-[var(--sub)]">Append-only stages from the job event log. Timestamps are UTC.</p>
            </div>
          </div>
          <ol class="relative space-y-4 before:absolute before:bottom-2 before:left-[13px] before:top-2 before:w-0.5 before:bg-[var(--line)]">
            <li v-for="event in eventLog" :key="event.key" class="relative flex gap-4 pl-9">
              <span class="absolute left-1.5 top-1 h-3.5 w-3.5 rounded-full border-2 shadow" :class="event.dotClass" :style="[{ borderColor: 'var(--panel)' }, event.dotStyle]" />
              <div class="min-w-0 flex-1">
                <p class="text-sm font-semibold text-[var(--ink)]">{{ event.title }}</p>
                <p class="mt-0.5 text-xs text-[var(--sub)]">
                  {{ event.actor }} &middot; {{ event.relative }} &middot; <span class="font-mono2 text-[10px]">{{ event.timestamp }}</span> &middot; Source metadata: system
                </p>
              </div>
            </li>
          </ol>
        </div>
      </section>

      <aside class="mt-8 rounded-2xl border p-6" style="border-color: var(--line); background: var(--panel2)">
        <h3 class="mb-3 font-disp text-sm font-bold text-[var(--ink)]">Can't find your tracking token?</h3>
        <p class="mb-4 text-sm text-[var(--sub)]">It was sent by email and SMS when your order was confirmed.</p>
        <div class="flex flex-wrap gap-3">
          <a href="mailto:support@printy.ke" class="press-key inline-flex items-center gap-2 rounded-xl px-4 py-2.5 font-mono2 text-[10px] font-semibold uppercase tracking-[0.1em] transition-colors" style="background: var(--accent); color: var(--accentInk)">
            <Mail :size="16" /> Email support@printy.ke
          </a>
          <NuxtLink to="/sign-in" class="inline-flex items-center gap-2 rounded-xl border px-4 py-2.5 font-mono2 text-[10px] font-semibold uppercase tracking-[0.1em] text-[var(--sub)] transition-colors hover:bg-[var(--panel)]" style="border-color: var(--line)">
            <ShieldCheck :size="16" /> Sign in to dashboard
          </NuxtLink>
        </div>
      </aside>
    </div>
  </section>
</template>

<script setup lang="ts">
import {
  AlertCircle,
  ArrowRight,
  CalendarClock,
  CheckCircle2,
  CircleDashed,
  ClipboardCheck,
  Clock,
  FileText,
  History,
  Loader2,
  Mail,
  Package,
  Paintbrush,
  RefreshCw,
  Search,
  Shield,
  ShieldCheck,
  Timer,
  Truck,
  User,
} from 'lucide-vue-next'
import type { Component } from 'vue'
import { formatJobDuration, jobExpectedTime, jobRelativeTime } from '~/shared/job-time'
import { timelineSummary } from '~/shared/list-sections'
import { API } from '~/shared/api-paths'
import { getApiErrorMessage } from '~/shared/api'
import { useAuthStore } from '~/stores/auth'
import type { JobStageTimeline, JobStageTimelineLine } from '~/shared/types'

const props = defineProps<{
  token?: string
}>()

const TOKEN_PATTERN = /^[A-Za-z0-9_-]{8,80}$/

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
const routeToken = typeof route.query.token === 'string' ? route.query.token : ''
const initialToken = props.token ?? routeToken

const query = ref(initialToken)
const lastQuery = ref(initialToken)
const loading = ref(false)
const notFound = ref(false)
const contactRequired = ref(false)
const error = ref('')
const result = ref<TrackResult | null>(null)
const email = ref('')
const phone = ref('')

const tokenIsValid = computed(() => TOKEN_PATTERN.test(query.value.trim()))
const canSubmit = computed(() => tokenIsValid.value && !loading.value)

const stages = computed<JobStageTimelineLine[]>(() => result.value?.timeline?.stages ?? [])

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
        dotStyle: { background: completed ? '#2FBF71' : overdue ? '#C81E44' : 'var(--accent)' },
      }
    })
})

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

function ownerBadge(owner: string | null | undefined): string {
  switch (ownerKey(owner)) {
    case 'buyer': return 'tone-accent'
    case 'manager': return 'tone-success'
    case 'printer': return 'tone-warn'
    case 'printy': return 'tone-warn'
    case 'courier': return 'tone-neutral'
    default: return 'tone-neutral'
  }
}

function stageIcon(key: string): Component {
  switch (key) {
    case 'quote_accepted': return ClipboardCheck
    case 'artwork_approval': return Paintbrush
    case 'production': return Package
    case 'qc': return CheckCircle2
    case 'delivery': return Truck
    default: return CircleDashed
  }
}

function stageCardStyle(stage: JobStageTimelineLine): Record<string, string> {
  if (stage.state === 'overdue' || stage.is_overdue) {
    return { borderColor: 'rgba(200,30,68,.4)', background: 'rgba(200,30,68,.06)' }
  }
  if (stage.state === 'current') {
    return { borderColor: 'var(--accent)', background: 'color-mix(in srgb, var(--accent) 7%, transparent)' }
  }
  if (stage.state === 'completed') {
    return { borderColor: 'color-mix(in srgb, #2FBF71 35%, transparent)', background: 'color-mix(in srgb, #2FBF71 7%, transparent)' }
  }
  return { borderColor: 'var(--line)', background: 'var(--panel)' }
}

function stageIconStyle(stage: JobStageTimelineLine): Record<string, string> {
  if (stage.state === 'overdue' || stage.is_overdue) return { background: '#C81E44', color: '#fff' }
  if (stage.state === 'current') return { background: 'var(--accent)', color: 'var(--accentInk)' }
  if (stage.state === 'completed') return { background: '#2FBF71', color: '#fff' }
  return { background: 'var(--panel2)', color: 'var(--sub)' }
}

function stageLabelColor(stage: JobStageTimelineLine): string {
  if (stage.state === 'overdue' || stage.is_overdue) return '#C81E44'
  if (stage.state === 'current') return 'var(--accent)'
  if (stage.state === 'completed') return '#0B7A52'
  return 'var(--sub)'
}

function stageBadgeClass(stage: JobStageTimelineLine): string {
  if (stage.state === 'pending') return 'tone-neutral'
  if (stage.state === 'completed') return 'tone-success'
  return ownerBadge(stage.owner)
}

function stageBadgeText(stage: JobStageTimelineLine): string {
  return stage.state === 'completed' ? 'done' : ownerLabel(stage.owner)
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
  if (!TOKEN_PATTERN.test(raw)) return
  const token = raw.toLowerCase().replace(/\s+/g, '')
  lastQuery.value = raw
  loading.value = true
  notFound.value = false
  contactRequired.value = false
  error.value = ''
  result.value = null
  try {
    const queryParams: Record<string, string> = {}
    const trimmedEmail = email.value.trim()
    const trimmedPhone = phone.value.trim()
    if (trimmedEmail) queryParams.email = trimmedEmail
    if (trimmedPhone) queryParams.phone = trimmedPhone
    const request = isAuthed.value ? api : publicApi
    const data = await request<TrackResult | { detail?: string }>(
      API.jobs.publicManagedTrack(token),
      {
        auth: isAuthed.value,
        query: Object.keys(queryParams).length ? queryParams : undefined,
      },
    )
    if (data && 'tracking_reference' in data && data.tracking_reference) {
      result.value = data as TrackResult
      contactRequired.value = false
    } else {
      notFound.value = true
    }
  } catch (e: any) {
    if (e?.statusCode === 400) {
      const detail = typeof e?.data?.detail === 'string' ? e.data.detail : e?.message
      if (detail && detail.toLowerCase().includes('email') && detail.toLowerCase().includes('phone')) {
        contactRequired.value = true
        notFound.value = false
        error.value = ''
      } else {
        notFound.value = true
      }
    } else if (e?.statusCode === 410 || e?.statusCode === 404) {
      notFound.value = true
    } else {
      error.value = getApiErrorMessage(e, 'The tracking service could not be reached right now.')
    }
  } finally {
    loading.value = false
  }
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

onMounted(() => {
  if (initialToken) {
    query.value = initialToken
    void lookup(initialToken)
  }
})
</script>
