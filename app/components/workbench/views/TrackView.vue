<template>
  <section class="relative overflow-hidden bg-gradient-to-b from-printy-bg-soft via-white to-white">
    <div class="pointer-events-none absolute inset-0">
      <div class="absolute -right-20 -top-40 h-96 w-96 rounded-full bg-printy/5 blur-3xl" />
    </div>

    <div class="relative mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
      <div class="mb-6 inline-flex items-center gap-2 rounded-full border border-printy/10 bg-printy-bg px-4 py-1.5">
        <Search :size="14" class="text-printy" />
        <span class="text-xs font-semibold tracking-wide text-printy">JOB TRACKER</span>
      </div>

      <h1 class="text-4xl font-extrabold leading-[1.1] tracking-tight text-ink sm:text-5xl">
        Who has your job<br />right now — <span class="text-printy">exactly.</span>
      </h1>

      <p class="mt-5 max-w-2xl text-lg leading-relaxed text-ink-muted">
        Paste your tracking token to see the current stage, who holds it, the next action, and time remaining — plus your acknowledged due date and full handoff timing.
      </p>

      <form class="mt-10 rounded-2xl border border-border bg-white p-6 shadow-xl shadow-black/5 sm:p-8" novalidate @submit.prevent="search()">
        <div class="mb-6 flex items-center gap-3">
          <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-printy-bg">
            <Package :size="20" class="text-printy" />
          </div>
          <div>
            <h2 class="text-base font-bold text-ink">Enter tracking token</h2>
            <p class="text-xs text-ink-subtle">From your order confirmation</p>
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
              class="w-full rounded-xl border border-border bg-surface px-4 py-3.5 text-sm text-ink outline-none transition-all placeholder:text-ink-subtle focus:border-printy focus:ring-2 focus:ring-printy/20"
            />
            <p v-if="query !== '' && !tokenIsValid" class="mt-1.5 flex items-center gap-1.5 text-xs text-red-500">
              <AlertCircle :size="12" /> Enter a valid token from your confirmation message.
            </p>
          </div>

          <button
            type="submit"
            :disabled="!canSubmit"
            class="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-printy to-printy-dark px-6 py-3.5 font-semibold text-white shadow-lg shadow-printy/25 transition-all hover:scale-[1.01] hover:shadow-xl active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100"
          >
            <template v-if="loading">
              <Loader2 :size="16" class="animate-spin" /> Looking up…
            </template>
            <template v-else>
              Track this job <ArrowRight :size="16" />
            </template>
          </button>
        </div>

        <div v-if="error && !notFound" class="mt-4 flex items-start gap-2 rounded-lg border border-red-100 bg-red-50 p-3">
          <AlertCircle :size="16" class="mt-0.5 shrink-0 text-red-500" />
          <p class="text-sm text-red-600">{{ error }}</p>
        </div>

        <div v-if="contactRequired" class="mt-4 rounded-xl border border-blue-200 bg-blue-50 p-4">
          <div class="text-sm font-bold text-ink">We need a bit more to find that job</div>
          <p class="mt-1 text-xs leading-relaxed text-ink-muted">
            Enter the email address or phone number on the job to track it.
          </p>
          <div class="mt-3 grid gap-2 sm:grid-cols-2">
            <input
              v-model="email"
              type="email"
              placeholder="Email on the job"
              class="w-full rounded-xl border border-blue-200 bg-white px-3 py-2.5 text-sm text-ink outline-none placeholder:text-ink-subtle focus:border-printy focus:ring-2 focus:ring-printy/20"
            />
            <input
              v-model="phone"
              type="tel"
              placeholder="Phone on the job (e.g. 2547... or +254...)"
              class="w-full rounded-xl border border-blue-200 bg-white px-3 py-2.5 text-sm text-ink outline-none placeholder:text-ink-subtle focus:border-printy focus:ring-2 focus:ring-printy/20"
            />
          </div>
          <button
            type="button"
            class="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-printy px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-printy-dark disabled:cursor-not-allowed disabled:opacity-50"
            :disabled="loading || (!email.trim() && !phone.trim())"
            @click="search()"
          >
            <Loader2 v-if="loading" :size="14" class="animate-spin" />
            <template v-else>Find job</template>
          </button>
        </div>

        <p class="mt-4 flex items-center gap-2 text-xs text-ink-subtle">
          <Shield :size="12" /> Token-only access · No guessable job numbers · Secure lookup
        </p>
      </form>

      <div v-if="notFound" class="mt-6 flex items-start gap-3 rounded-2xl border border-red-100 bg-red-50 p-5">
        <CircleDashed :size="20" class="mt-0.5 shrink-0 text-red-500" />
        <div class="min-w-0 flex-1">
          <h2 class="text-sm font-bold text-ink">No job found for "{{ lastQuery }}"</h2>
          <p class="mt-1 text-sm leading-relaxed text-ink-muted">
            Double-check the token and the email or phone you entered. Newly accepted jobs can take a moment to appear.
          </p>
          <button type="button" class="mt-3 inline-flex items-center gap-1.5 text-sm font-bold text-printy hover:text-printy-dark" @click="resetSearch()">
            <Search :size="13" /> Try another token
          </button>
        </div>
      </div>

      <section v-if="result" class="mt-6 space-y-6">
        <div class="rounded-2xl border border-border bg-white p-6 shadow-xl shadow-black/5 sm:p-8">
          <div class="mb-6 flex flex-wrap items-start justify-between gap-4">
            <div class="min-w-0">
              <p class="mb-1 text-xs font-semibold uppercase tracking-wider text-ink-subtle">Job reference</p>
              <h2 class="break-words text-2xl font-extrabold text-ink">{{ result.tracking_reference }}</h2>
              <p class="mt-1 text-sm text-ink-muted">{{ statusSubtitle }}</p>
            </div>
            <div class="flex flex-col items-start gap-2 sm:items-end">
              <span
                class="inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-bold"
                :class="isLate ? 'border-red-200 bg-red-50 text-red-700' : 'border-emerald-200 bg-emerald-50 text-emerald-700'"
              >
                <Clock :size="12" /> {{ isLate ? 'Running late' : 'On track' }}
              </span>
              <p class="text-xs text-ink-subtle">
                Due date: <strong class="text-ink">{{ dueDateLabel || 'Being confirmed' }}</strong>
              </p>
              <button
                type="button"
                class="inline-flex items-center gap-1.5 text-xs font-bold text-printy hover:text-printy-dark disabled:opacity-50"
                :disabled="loading"
                @click="refresh()"
              >
                <RefreshCw :size="12" :class="{ 'animate-spin': loading }" /> Refresh status
              </button>
            </div>
          </div>

          <div class="mb-6 rounded-xl border border-blue-200/60 bg-gradient-to-r from-blue-50 to-indigo-50/50 p-5">
            <p class="mb-3 text-[10px] font-bold uppercase tracking-widest text-blue-600">Who has the ball</p>
            <div class="grid gap-4 sm:grid-cols-3">
              <div>
                <p class="mb-0.5 text-xs text-ink-subtle">Current stage</p>
                <p class="text-sm font-bold text-ink">{{ currentLabel }}</p>
              </div>
              <div>
                <p class="mb-0.5 text-xs text-ink-subtle">Held by</p>
                <span class="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold" :class="ownerBadge(currentOwner)">
                  <User :size="12" /> {{ ownerLabel(currentOwner) }}
                </span>
              </div>
              <div>
                <p class="mb-0.5 text-xs text-ink-subtle">Stage SLA / time remaining</p>
                <p class="flex items-center gap-1 text-sm font-bold text-ink">
                  <Clock :size="14" class="text-blue-600" /> {{ slaLabel }}
                </p>
              </div>
            </div>
            <p class="mt-3 text-xs text-ink-muted">
              Next action: <strong class="text-ink">{{ nextActionLabel }}</strong>
            </p>
          </div>

          <div v-if="stages.length" class="grid gap-2" :class="stages.length > 5 ? 'sm:grid-cols-3 lg:grid-cols-5' : 'sm:grid-cols-5'">
            <div v-for="stage in stages" :key="stage.key" class="rounded-xl border p-3 text-center" :class="stageCardClass(stage)">
              <div class="mx-auto mb-1.5 flex h-7 w-7 items-center justify-center rounded-lg" :class="stageIconClass(stage)">
                <component :is="stageIcon(stage.key)" :size="14" />
              </div>
              <p class="text-xs font-bold" :class="stageLabelClass(stage)">{{ stage.label }}</p>
              <span class="mt-1 inline-block rounded px-1.5 py-0.5 text-[9px] font-bold" :class="stageBadgeClass(stage)">
                {{ stageBadgeText(stage) }}
              </span>
              <p class="mt-1 text-[9.5px] font-medium leading-tight text-ink-muted">{{ stageMeta(stage) }}</p>
            </div>
          </div>

          <p v-if="timelineSummaryText" class="mt-3 text-[11px] font-medium text-ink-muted">{{ timelineSummaryText }}</p>
          <p class="mt-3 text-[11px] text-ink-subtle">
            Stage SLAs computed from one config in Africa/Nairobi working time; timestamps recorded in UTC. Buyer-caused waiting (e.g. artwork approval time) is never counted against your manager or printshop.
          </p>
          <p class="mt-2 text-[11px] text-ink-subtle">
            Public tracking shows status and timing only. Private pricing, files and custody details stay behind your login.
          </p>
        </div>

        <div v-if="eventLog.length" class="rounded-2xl border border-border bg-white p-6 shadow-xl shadow-black/5 sm:p-8">
          <div class="mb-5 flex items-center gap-3">
            <div class="flex h-9 w-9 items-center justify-center rounded-lg bg-printy-bg">
              <FileText :size="16" class="text-printy" />
            </div>
            <div>
              <h3 class="text-sm font-bold text-ink">Job event log</h3>
              <p class="text-[11px] text-ink-subtle">Append-only stages from the job event log. Timestamps are UTC.</p>
            </div>
          </div>
          <ol class="relative space-y-4 before:absolute before:bottom-2 before:left-[13px] before:top-2 before:w-0.5 before:bg-slate-100">
            <li v-for="event in eventLog" :key="event.key" class="relative flex gap-4 pl-9">
              <span class="absolute left-1.5 top-1 h-3.5 w-3.5 rounded-full border-2 border-white shadow" :class="event.dotClass" />
              <div class="min-w-0 flex-1">
                <p class="text-sm font-semibold text-ink">{{ event.title }}</p>
                <p class="mt-0.5 text-xs text-ink-subtle">
                  {{ event.actor }} · <span class="font-mono text-[10px]">{{ event.timestamp }}</span> · Source metadata: system
                </p>
              </div>
            </li>
          </ol>
        </div>
      </section>

      <aside class="mt-8 rounded-2xl border border-border-light bg-surface p-6">
        <h3 class="mb-3 text-sm font-bold text-ink">Can't find your tracking token?</h3>
        <p class="mb-4 text-sm text-ink-muted">It was sent by email and SMS when your order was confirmed.</p>
        <div class="flex flex-wrap gap-3">
          <a href="mailto:support@printy.ke" class="inline-flex items-center gap-2 rounded-xl bg-printy-bg px-4 py-2.5 text-sm font-semibold text-printy transition-colors hover:bg-printy/10">
            <Mail :size="16" /> Email support@printy.ke
          </a>
          <NuxtLink to="/sign-in" class="inline-flex items-center gap-2 rounded-xl border border-border px-4 py-2.5 text-sm font-semibold text-ink-muted transition-colors hover:bg-white">
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
  CheckCircle2,
  CircleDashed,
  ClipboardCheck,
  Clock,
  FileText,
  Loader2,
  Mail,
  Package,
  Paintbrush,
  RefreshCw,
  Search,
  Shield,
  ShieldCheck,
  Truck,
  User,
} from 'lucide-vue-next'
import type { Component } from 'vue'
import { formatMinutes, timelineSummary } from '~/shared/list-sections'
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

const dueDateLabel = computed(() => formatDateTime(
  result.value?.due_date
  || result.value?.timeline?.due_date
  || result.value?.estimated_ready,
))

const statusSubtitle = computed(() => {
  if (!result.value) return ''
  const code = result.value.code
  if (code && code !== result.value.tracking_reference) {
    return `Job ${code} · ${result.value.job_status}`
  }
  return result.value.job_status
})

const slaLabel = computed(() => {
  const stage = currentStage.value
  if (!stage) return 'From the job config'
  const allowed = stage.sla_hours === null || stage.sla_hours === undefined || stage.sla_hours === '' ? '' : `~${stage.sla_hours} working hrs`
  const remaining = stage.state === 'completed' ? 'complete' : remainingText(stage)
  return [allowed, remaining].filter(Boolean).join(' · ') || 'From the job config'
})

const timelineSummaryText = computed(() => timelineSummary(result.value?.timeline))

interface EventLogItem {
  key: string
  title: string
  actor: string
  timestamp: string
  dotClass: string
}

const eventLog = computed<EventLogItem[]>(() => {
  if (!stages.value.length) return []
  return stages.value
    .filter(stage => stage.state !== 'pending')
    .map((stage) => {
      const completed = stage.state === 'completed'
      const overdue = stage.state === 'overdue' || stage.is_overdue
      return {
        key: stage.key,
        title: `${stage.label} — ${completed ? 'completed' : overdue ? 'overdue' : 'in progress'}`,
        actor: ownerLabel(stage.owner),
        timestamp: formatUtc(completed ? stage.completed_at : stage.started_at),
        dotClass: completed ? 'bg-emerald-500' : overdue ? 'bg-red-500' : 'animate-pulse bg-printy',
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
    case 'buyer': return 'bg-blue-100 text-blue-700'
    case 'manager': return 'bg-emerald-100 text-emerald-700'
    case 'printer': return 'bg-purple-100 text-purple-700'
    case 'printy': return 'bg-orange-100 text-orange-700'
    default: return 'bg-slate-100 text-slate-700'
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

function stageCardClass(stage: JobStageTimelineLine): string {
  if (stage.state === 'overdue' || stage.is_overdue) return 'border-red-200 bg-red-50'
  if (stage.state === 'current') return 'border-printy bg-printy-bg shadow-sm'
  if (stage.state === 'completed') return 'border-emerald-200 bg-emerald-50'
  return 'border-border-light bg-surface'
}

function stageIconClass(stage: JobStageTimelineLine): string {
  if (stage.state === 'overdue' || stage.is_overdue) return 'bg-red-500 text-white'
  if (stage.state === 'current') return 'bg-printy text-white'
  if (stage.state === 'completed') return 'bg-emerald-500 text-white'
  return 'bg-gray-200 text-gray-400'
}

function stageLabelClass(stage: JobStageTimelineLine): string {
  if (stage.state === 'overdue' || stage.is_overdue) return 'text-red-700'
  if (stage.state === 'current') return 'text-printy'
  if (stage.state === 'completed') return 'text-emerald-700'
  return 'text-ink-subtle'
}

function stageBadgeClass(stage: JobStageTimelineLine): string {
  if (stage.state === 'pending') return 'bg-slate-100 text-slate-500'
  return ownerBadge(stage.owner)
}

function stageBadgeText(stage: JobStageTimelineLine): string {
  return stage.state === 'completed' ? 'done' : ownerLabel(stage.owner)
}

function stageMeta(stage: JobStageTimelineLine): string {
  if (stage.state === 'completed') {
    return `${formatMinutes(stage.time_taken_minutes) || '—'} taken`
  }
  if (stage.state === 'overdue' || stage.is_overdue) {
    const overdueMinutes = Math.abs(stage.time_remaining_minutes ?? stage.time_taken_minutes ?? 0)
    return `overdue by ${formatMinutes(overdueMinutes) || '—'}`
  }
  if (stage.state === 'current') {
    return `${formatMinutes(stage.time_taken_minutes) || '0m'} elapsed`
  }
  return `SLA ${formatSla(stage.sla_hours)}`
}

function remainingText(stage: JobStageTimelineLine): string {
  const minutes = stage.time_remaining_minutes
  if (minutes === null || minutes === undefined) return ''
  if (minutes <= 0) return stage.is_overdue ? 'overdue' : 'due now'
  return `${formatMinutes(minutes)} left`
}

function formatSla(value: number | string | null | undefined): string {
  if (value === null || value === undefined || value === '') return '—'
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
  if (!value) return '—'
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
