<template>
  <div class="mx-auto w-full max-w-[1100px] px-4 pb-28 pt-8 sm:px-6">
    <NuxtLink
      to="/app/manager"
      class="mb-3 inline-flex items-center gap-1.5 font-mono2 text-[10px] uppercase tracking-[0.16em] text-[var(--sub)] transition-colors hover:text-[var(--accent)]"
    >
      <ArrowLeft :size="12" /> Back to the control room
    </NuxtLink>
    <div class="flex items-center gap-2 font-mono2 text-[10px] uppercase tracking-[0.22em] text-[var(--sub)]">
      <Rocket :size="12" style="color: var(--accent)" /> production follow-up
    </div>
    <h1 class="mt-2 font-disp text-[30px] font-bold leading-tight tracking-tight sm:text-[36px]">
      Paid jobs, sent to the floor.<span class="block text-[var(--sub)]">Dispatch waits on payment round-tripping.</span>
    </h1>
    <p class="mt-2 max-w-[62ch] text-[13.5px] leading-relaxed text-[var(--sub)]">
      Once a client's payment confirms, dispatch the job to the production shop. Dispatch requires payment, confirmed
      specs, uploaded artwork and an approved artwork confirmation.
    </p>

    <div v-if="m.loading && !m.hasJobs" class="mt-14 flex flex-col items-center gap-3 text-[var(--sub)]">
      <Loader2 :size="22" class="animate-spin" :style="{ color: 'var(--accent)' }" />
      <span class="font-mono2 text-[10px] uppercase tracking-[0.18em]">Loading jobs in progress…</span>
    </div>

    <div v-else-if="m.error && !m.hasJobs" class="mt-14 flex flex-col items-center gap-3 rounded-2xl border p-8 text-center" :style="{ borderColor: 'var(--line)', background: 'var(--panel)' }">
      <AlertTriangle :size="22" style="color: #C81E44" />
      <p class="max-w-[44ch] text-[13px] leading-relaxed text-[var(--sub)]">{{ m.error }}</p>
      <button class="press-key mt-1 inline-flex items-center gap-2 rounded-xl px-4 py-2 font-mono2 text-[10px] font-semibold uppercase tracking-[0.14em]" :style="{ background: 'var(--accent)', color: 'var(--accentInk)' }" @click="m.fetchJobs()">
        <RefreshCw :size="12" /> Try again
      </button>
    </div>

    <div v-else-if="!m.hasJobs" class="mt-14 rounded-2xl border p-8 text-center" :style="{ borderColor: 'var(--line)', background: 'var(--panel)' }">
      <Inbox :size="22" class="mx-auto" style="color: var(--accent)" />
      <p class="mt-3 text-[13px] text-[var(--sub)]">No jobs in progress you can dispatch yet.</p>
    </div>

    <div v-else class="mt-6 space-y-5">
      <div class="mb-1 flex flex-wrap items-center gap-2 pl-1">
        <ML>All jobs · {{ m.jobs.length }}</ML>
        <span class="rounded-full px-2.5 py-[3px] font-mono2 text-[9px] uppercase tracking-[0.12em]" :style="{ background: 'rgba(47,191,113,.12)', color: '#0E7A45' }">
          {{ m.dispatchableJobs.length }} ready to dispatch
        </span>
      </div>

      <div v-for="section in jobSections" :key="section.key" class="space-y-2.5">
        <div class="flex items-center gap-2 pl-1">
          <h3 class="font-mono2 text-[10px] font-semibold uppercase tracking-[0.18em]" :style="{ color: section.muted ? 'var(--sub)' : 'var(--ink)' }">{{ section.label }}</h3>
          <span class="rounded-full px-2 py-[1px] font-mono2 text-[9px] font-semibold" :style="{ background: 'var(--panel2)', color: 'var(--sub)' }">{{ section.items.length }}</span>
        </div>

      <article
        v-for="job in section.items"
        :key="job.id"
        class="overflow-hidden rounded-2xl border transition-colors hover:border-[var(--accent)]"
        :class="[isMuted(job) ? 'opacity-60' : '', needsAttention(job) ? 'ring-2' : '']"
        :style="{ borderColor: openId === job.id ? 'var(--accent)' : 'var(--line)', background: 'var(--panel)' }"
      >
        <div class="flex cursor-pointer flex-wrap items-center gap-x-5 gap-y-3 p-4" @click="toggle(job.id)">
          <div class="w-[130px] shrink-0">
            <span class="rounded-full px-2.5 py-[3px] font-mono2 text-[9px] font-semibold uppercase tracking-[0.12em]" :style="statusStyle(job.status)">
              {{ job.status.replace(/_/g, ' ') }}
            </span>
            <div class="mt-1.5 font-mono2 text-[10px] tracking-[0.12em] text-[var(--accent)]">{{ job.job_reference || job.reference }}</div>
          </div>
          <div class="min-w-[190px] flex-1">
            <div class="truncate font-disp text-[15px] font-bold tracking-tight">{{ job.title }}</div>
            <div class="mt-1 truncate text-[11.5px] text-[var(--sub)]">
              {{ job.client_name || 'Client' }}<span v-if="job.assigned_shop_name && job.assigned_shop_name !== 'Awaiting assignment'"> · {{ job.assigned_shop_name }}</span>
            </div>
          </div>
          <div class="min-w-[170px] flex-1">
            <div class="grid grid-cols-2 gap-x-4 gap-y-1">
              <div>
                <div class="font-mono2 text-[8.5px] uppercase tracking-[0.12em] text-[var(--sub)]">payment</div>
                <div class="text-[12.5px]" :style="paymentTone(job)">{{ job.payment_status.replace(/_/g, ' ') }}</div>
              </div>
              <div>
                <div class="font-mono2 text-[8.5px] uppercase tracking-[0.12em] text-[var(--sub)]">assignment</div>
                <div class="text-[12.5px] text-[var(--ink)]">{{ job.assignment_status.replace(/_/g, ' ') }}</div>
              </div>
              <div>
                <div class="font-mono2 text-[8.5px] uppercase tracking-[0.12em] text-[var(--sub)]">artwork</div>
                <div class="text-[12.5px] text-[var(--ink)]">{{ job.artwork_status_label || (job.artwork_uploaded ? 'uploaded' : 'missing') }}</div>
              </div>
              <div>
                <div class="font-mono2 text-[8.5px] uppercase tracking-[0.12em] text-[var(--sub)]">updated</div>
                <div class="text-[12.5px] text-[var(--ink)]">{{ shortDate(job.updated_at) }}</div>
              </div>
              <div v-if="job.timing?.due_date">
                <div class="font-mono2 text-[8.5px] uppercase tracking-[0.12em] text-[var(--sub)]">due</div>
                <div class="text-[12.5px]" :style="job.timing.is_late ? { color: '#C81E44' } : { color: 'var(--ink)' }">{{ shortDate(job.timing.due_date) }}</div>
              </div>
              <div v-if="job.timing?.stage_label">
                <div class="font-mono2 text-[8.5px] uppercase tracking-[0.12em] text-[var(--sub)]">stage</div>
                <div class="text-[12.5px] text-[var(--ink)]">{{ job.timing.stage_label }}</div>
              </div>
            </div>
          </div>
          <div class="flex shrink-0 items-center gap-2">
            <span v-if="job.dispatched_at" class="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 font-mono2 text-[10px] font-semibold uppercase tracking-[0.12em]" :style="{ background: 'rgba(47,191,113,.12)', color: '#0E7A45' }">
              <Check :size="11" /> dispatched
            </span>
            <button
              v-else
              class="press-key inline-flex items-center gap-1.5 rounded-lg px-3 py-2 font-mono2 text-[10px] font-bold uppercase tracking-[0.12em] disabled:opacity-40"
              :style="job.payment_confirmed ? { background: 'var(--accent)', color: 'var(--accentInk)' } : { border: '1px solid var(--line)', color: 'var(--sub)' }"
              :disabled="!job.payment_confirmed || m.saving"
              @click.stop="dispatch(job)"
            >
              <Loader2 v-if="m.saving && dispatchingId === job.id" :size="11" class="animate-spin" />
              <Rocket v-else :size="11" />
              {{ job.payment_confirmed ? 'Dispatch' : 'Awaiting payment' }}
            </button>
            <ChevronDown :size="16" class="text-[var(--sub)]" :style="openId === job.id ? { transform: 'rotate(180deg)' } : {}" />
          </div>
        </div>

        <div v-if="openId === job.id" class="border-t px-4 py-4" :style="{ borderColor: 'var(--line)' }">
          <div class="grid gap-4 sm:grid-cols-2">
            <div class="space-y-2.5">
              <div class="flex items-center gap-2">
                <ML>Job facts</ML>
                <RefreshCw v-if="m.detailLoading" :size="11" class="animate-spin" style="color: var(--accent)" />
              </div>
              <dl v-if="jobFacts(job).length" class="space-y-1.5">
                <div v-for="fact in jobFacts(job)" :key="fact.label" class="flex justify-between gap-4 text-[12px]">
                  <dt class="text-[var(--sub)]">{{ fact.label }}</dt>
                  <dd class="text-right font-medium text-[var(--ink)]">{{ fact.value }}</dd>
                </div>
              </dl>
            </div>
            <div class="space-y-2.5">
              <ML>Settlement split</ML>
              <div v-if="settlementRows.length" class="space-y-1.5">
                <div v-for="row in settlementRows" :key="row.label" class="flex justify-between gap-4 text-[12px]">
                  <dt class="text-[var(--sub)]">{{ row.label }}</dt>
                  <dd class="text-right font-semibold" :style="row.strong ? { color: 'var(--accent)' } : { color: 'var(--ink)' }">{{ row.value }}</dd>
                </div>
              </div>
              <div v-else-if="m.activeJob?.id === job.id" class="text-[12px] text-[var(--sub)]">
                {{ m.activeJobSettlement ? 'No settleable lines yet.' : 'Open the job to see the settlement split.' }}
              </div>
            </div>
          </div>

          <div v-if="activeCanonical" class="mt-4 grid gap-4 sm:grid-cols-2">
            <div class="space-y-2.5">
              <ML>Production sheet</ML>
              <dl v-if="productionRows(activeCanonical).length" class="space-y-1.5">
                <div v-for="row in productionRows(activeCanonical)" :key="row.label" class="flex justify-between gap-4 text-[12px]">
                  <dt class="text-[var(--sub)]">{{ row.label }}</dt>
                  <dd class="text-right font-medium text-[var(--ink)]">{{ row.value }}</dd>
                </div>
              </dl>
              <p v-else class="text-[12px] text-[var(--sub)]">No production figures on this job yet.</p>
            </div>
            <div class="space-y-2.5">
              <ML>Costs &amp; margin</ML>
              <dl class="space-y-1.5">
                <div v-for="row in financeRows(activeCanonical)" :key="row.label" class="flex justify-between gap-4 text-[12px]">
                  <dt class="text-[var(--sub)]">{{ row.label }}</dt>
                  <dd class="text-right font-semibold" :style="row.strong ? { color: 'var(--accent)' } : { color: 'var(--ink)' }">{{ row.value }}</dd>
                </div>
              </dl>
              <dl v-if="costRows(activeCanonical).length" class="space-y-1.5 border-t pt-2" :style="{ borderColor: 'var(--line)' }">
                <div v-for="row in costRows(activeCanonical)" :key="row.label" class="flex justify-between gap-4 text-[11.5px]">
                  <dt class="text-[var(--sub)]">{{ row.label }}</dt>
                  <dd class="text-right text-[var(--ink)]">{{ row.value }}</dd>
                </div>
              </dl>
            </div>
          </div>

          <div v-if="job.timing" class="mt-4 rounded-xl border p-4" :style="{ borderColor: 'var(--line)', background: 'var(--panel2)' }">
            <div class="flex flex-wrap items-center justify-between gap-2">
              <ML>Schedule &amp; SLA</ML>
              <span v-if="job.timing.is_late" class="rounded-full px-2 py-[2px] font-mono2 text-[9px] uppercase tracking-[0.12em]" style="background: rgba(251,77,109,.14); color: #C81E44">
                overdue{{ job.timing.lateness_minutes ? ` by ${formatMinutes(job.timing.lateness_minutes)}` : '' }}
              </span>
            </div>
            <dl class="mt-2 space-y-1.5">
              <div v-for="row in scheduleHeadline(job.timing)" :key="row.label" class="flex justify-between gap-4 text-[12px]">
                <dt class="text-[var(--sub)]">{{ row.label }}</dt>
                <dd class="text-right font-medium text-[var(--ink)]">{{ row.value }}</dd>
              </div>
            </dl>
            <div v-if="job.timing.stage_timestamps?.stages?.length" class="mt-3 overflow-hidden rounded-lg border" :style="{ borderColor: 'var(--line)' }">
              <div
                v-for="stage in job.timing.stage_timestamps.stages"
                :key="stage.stage"
                class="flex flex-wrap items-center justify-between gap-2 border-b px-3 py-2 text-[11.5px] last:border-b-0"
                :style="{ borderColor: 'var(--line)', background: stage.is_current ? 'color-mix(in srgb, var(--accent) 7%, transparent)' : 'transparent' }"
              >
                <span class="font-semibold" :style="stage.is_current ? { color: 'var(--accent)' } : { color: 'var(--ink)' }">{{ stage.label }}</span>
                <span class="font-mono2 text-[9px] uppercase tracking-[0.1em] text-[var(--sub)]">SLA {{ stage.sla_hours }}h · {{ stage.owner }}</span>
                <span class="font-mono2 text-[9.5px] text-[var(--sub)]">{{ shortDate(stage.started_at) }} → {{ shortDate(stage.due_at) }}</span>
              </div>
            </div>
            <p v-if="job.timing.revision_count" class="mt-2 font-mono2 text-[9px] uppercase tracking-[0.1em] text-[var(--sub)]">
              {{ job.timing.revision_count }} date revision{{ job.timing.revision_count === 1 ? '' : 's' }} on this job
            </p>
          </div>

          <div v-if="activeCanonical" class="mt-4 rounded-xl border p-4" :style="{ borderColor: 'var(--line)', background: 'var(--panel2)' }">
            <div class="flex items-center gap-2">
              <ML>Adjust this job</ML>
            </div>
            <p class="mt-1 text-[11.5px] leading-relaxed text-[var(--sub)]">
              Adjust spoilage, paper, markup or sheet count. Preview the buyer-facing price impact before saving; the
              adjustment is recorded on the job.
            </p>
            <div class="mt-3 flex flex-wrap items-end gap-2">
              <label class="flex flex-col gap-1">
                <span class="font-mono2 text-[9px] uppercase tracking-[0.12em] text-[var(--sub)]">Field</span>
                <select
                  v-model="overrideField"
                  class="rounded-lg border bg-transparent px-2 py-1.5 text-[12px]"
                  :style="{ borderColor: 'var(--line)', color: 'var(--ink)' }"
                  @change="resetPreview()"
                >
                  <option value="spoilage">Spoilage</option>
                  <option value="paper_substitution">Paper</option>
                  <option value="markup">Markup</option>
                  <option value="sheet_count">Sheet count</option>
                </select>
              </label>
              <label class="flex flex-col gap-1">
                <span class="font-mono2 text-[9px] uppercase tracking-[0.12em] text-[var(--sub)]">Value</span>
                <input
                  v-model="overrideValue"
                  :placeholder="overridePlaceholder"
                  class="w-[160px] rounded-lg border bg-transparent px-2 py-1.5 text-[12px]"
                  :style="{ borderColor: 'var(--line)', color: 'var(--ink)' }"
                  @input="resetPreview()"
                >
              </label>
              <button
                class="press-key inline-flex items-center gap-2 rounded-xl px-4 py-2 font-mono2 text-[10px] font-bold uppercase tracking-[0.12em] disabled:opacity-40"
                :style="{ border: '1px solid var(--line)', color: 'var(--ink)' }"
                :disabled="m.saving"
                @click="previewAdjustment(job.id)"
              >
                <Loader2 v-if="m.saving && previewingJobId === job.id" :size="11" class="animate-spin" />
                <Eye v-else :size="11" />
                Preview impact
              </button>
              <button
                class="press-key inline-flex items-center gap-2 rounded-xl px-4 py-2 font-mono2 text-[10px] font-bold uppercase tracking-[0.12em] disabled:opacity-40"
                :style="{ background: 'var(--accent)', color: 'var(--accentInk)' }"
                :disabled="m.saving || !previewResult"
                @click="saveAdjustment(job.id)"
              >
                <Loader2 v-if="m.saving && savingJobId === job.id" :size="11" class="animate-spin" />
                <Check v-else :size="11" />
                Save adjustment
              </button>
            </div>
            <div v-if="previewResult" class="mt-3 flex flex-wrap items-center gap-2 text-[12px]">
              <span class="text-[var(--sub)]">Buyer price</span>
              <span class="font-semibold text-[var(--ink)]">{{ money(previewResult.buyer_price_impact.old_total) }}</span>
              <span class="text-[var(--sub)]">→</span>
              <span class="font-semibold" :style="{ color: previewResult.buyer_price_impact.changed ? 'var(--accent)' : 'var(--ink)' }">
                {{ money(previewResult.buyer_price_impact.new_total) }}
              </span>
              <span
                class="rounded-full px-2 py-[2px] font-mono2 text-[9px] uppercase tracking-[0.12em]"
                :style="previewResult.buyer_price_impact.changed ? { background: 'rgba(245,166,35,.16)', color: '#B45309' } : { background: 'var(--panel)', color: 'var(--sub)' }"
              >
                {{ previewResult.buyer_price_impact.changed ? 'buyer price changes' : 'no buyer price change' }}
              </span>
            </div>
            <div v-if="overrideError" class="mt-3 rounded-xl border px-4 py-3 text-[12.5px]" :style="{ borderColor: 'rgba(251,77,109,.4)', background: 'rgba(251,77,109,.08)', color: '#C81E44' }">
              {{ overrideError }}
            </div>
            <div v-if="overrideNote" class="mt-3 flex items-center gap-2 rounded-xl border px-4 py-3 text-[12.5px]" :style="{ borderColor: 'rgba(47,191,113,.4)', background: 'rgba(47,191,113,.08)', color: '#0E7A45' }">
              <Check :size="13" /> {{ overrideNote }}
            </div>
          </div>

          <div v-if="dispatchError && errorJobId === job.id" class="mt-3 rounded-xl border px-4 py-3 text-[12.5px]" :style="{ borderColor: 'rgba(251,77,109,.4)', background: 'rgba(251,77,109,.08)', color: '#C81E44' }">
            {{ dispatchError }}
          </div>
          <div v-if="dispatchNote && noteJobId === job.id" class="mt-3 flex items-center gap-2 rounded-xl border px-4 py-3 text-[12.5px]" :style="{ borderColor: 'rgba(47,191,113,.4)', background: 'rgba(47,191,113,.08)', color: '#0E7A45' }">
            <Check :size="13" /> {{ dispatchNote }}
          </div>

          <div class="mt-3 flex flex-wrap gap-2">
            <button
              v-if="!job.dispatched_at"
              class="press-key inline-flex items-center gap-2 rounded-xl px-5 py-2.5 font-mono2 text-[10.5px] font-bold uppercase tracking-[0.14em] disabled:opacity-40"
              :style="job.payment_confirmed ? { background: 'var(--accent)', color: 'var(--accentInk)' } : { border: '1px solid var(--line)', color: 'var(--sub)' }"
              :disabled="!job.payment_confirmed || m.saving"
              @click="dispatch(job)"
            >
              <Loader2 v-if="m.saving && dispatchingId === job.id" :size="12" class="animate-spin" />
              <Rocket v-else :size="12" />
              {{ job.payment_confirmed ? 'Confirm dispatch to shop' : 'Payment not confirmed yet' }}
            </button>
          </div>
        </div>
      </article>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { AlertTriangle, ArrowLeft, Check, ChevronDown, Eye, Inbox, Loader2, RefreshCw, Rocket } from 'lucide-vue-next'
import { useManagerStore } from '~/stores/manager'
import { isMuted, needsAttention, sectionsFromServer } from '~/shared/list-sections'
import type { CanonicalJobResult, CanonicalLayout, CanonicalMethod, CanonicalSpoilage, JobOverrideRequest, JobOverrideResult, JobTiming, ManagerJobRow } from '~/shared/types'

const m = useManagerStore()

const jobSections = computed(() => sectionsFromServer(m.jobs))

const openId = ref<number | null>(null)
const dispatchingId = ref<number | null>(null)
const dispatchError = ref('')
const dispatchNote = ref('')
const errorJobId = ref<number | null>(null)
const noteJobId = ref<number | null>(null)

const overrideField = ref('spoilage')
const overrideValue = ref('')
const previewResult = ref<JobOverrideResult | null>(null)
const overrideError = ref('')
const overrideNote = ref('')
const previewingJobId = ref<number | null>(null)
const savingJobId = ref<number | null>(null)

const activeCanonical = computed<CanonicalJobResult | null>(() =>
  m.activeJob && m.activeJob.id === openId.value ? m.activeJobCanonical : null,
)

const overridePlaceholder = computed(() => {
  switch (overrideField.value) {
    case 'markup':
      return 'e.g. 250 (KES)'
    case 'paper_substitution':
      return 'e.g. Silk 300gsm'
    case 'sheet_count':
      return 'e.g. 12 (sheets billed)'
    default:
      return 'e.g. 3 (sheets added)'
  }
})

const settlementRows = computed(() => {
  const s = m.activeJobSettlement as Record<string, unknown> | null
  if (!s) return []
  const entries = [
    ['client_total', 'Client total'],
    ['partner_commission', 'Your commission'],
    ['printy_fee', 'Printy fee'],
    ['shop_payout', 'Shop payout'],
    ['production_cost', 'Production cost'],
  ] as const
  return entries
    .map(([key, label]) => ({ label, value: moneyish(s[key]), strong: key === 'client_total' }))
    .filter((row) => row.value !== '—')
})

function moneyish(value: unknown) {
  const n = Number(value)
  if (value === null || value === undefined || !Number.isFinite(n)) return '—'
  return formatKSh(n, 2)
}

function tokenise(input: string) {
  const cleaned = input.replace(/_/g, ' ')
  return cleaned.replace(/\b\w/g, (char) => char.toUpperCase())
}

function shortDate(value: string | null | undefined) {
  if (!value) return '—'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return '—'
  return date.toLocaleDateString('en-KE', { day: 'numeric', month: 'short' })
}

function formatMinutes(value: number | null | undefined) {
  if (value === null || value === undefined) return ''
  const hours = Math.floor(value / 60)
  const minutes = value % 60
  if (hours <= 0) return `${minutes}m`
  return minutes ? `${hours}h ${minutes}m` : `${hours}h`
}

function scheduleHeadline(timing: JobTiming) {
  const remaining = timing.time_remaining_minutes
  const remainingLabel = remaining === null || remaining === undefined
    ? ''
    : remaining <= 0
      ? 'Overdue'
      : `${formatMinutes(remaining)} left`
  return [
    { label: 'Due date', value: shortDate(timing.due_date) },
    { label: 'Current stage', value: timing.stage_label },
    { label: 'With', value: timing.stage_owner },
    { label: 'Next action', value: timing.next_action || '' },
    { label: 'Stage SLA', value: timing.stage_sla_hours !== null && timing.stage_sla_hours !== undefined ? `${timing.stage_sla_hours}h` : '' },
    { label: 'Time remaining', value: remainingLabel },
  ].filter((row) => row.value)
}

function statusStyle(raw: string) {
  const s = (raw || '').toLowerCase()
  if (s.includes('complete') || s.includes('delivered') || s.includes('released')) return { background: 'rgba(47,191,113,.16)', color: '#0E7A45' }
  if (s.includes('print') || s.includes('produc') || s.includes('active')) return { background: 'rgba(47,191,113,.12)', color: '#0E7A45' }
  if (s.includes('issue') || s.includes('overdue') || s.includes('reject')) return { background: 'rgba(251,77,109,.14)', color: '#C81E44' }
  if (s.includes('payment')) return { background: 'rgba(245,166,35,.14)', color: '#B45309' }
  return { background: 'var(--panel2)', color: 'var(--sub)' }
}

function paymentTone(job: ManagerJobRow) {
  const s = String(job.payment_status || '').toLowerCase()
  if (job.payment_confirmed || ['confirmed', 'release_ready', 'released', 'paid'].includes(s)) {
    return { color: '#0E7A45' }
  }
  if (['pending', 'processing'].includes(s)) return { color: '#B45309' }
  if (['failed', 'cancelled'].includes(s)) return { color: '#C81E44' }
  return { color: 'var(--ink)' }
}

function jobFacts(job: ManagerJobRow) {
  return [
    { label: 'Quote request', value: job.quote_request_reference || '—' },
    { label: 'Quote', value: job.quote_reference || '—' },
    { label: 'Assignment', value: job.production_assignment_reference || '—' },
    { label: 'Client', value: job.client_name || '—' },
    { label: 'Production shop', value: job.assigned_shop_name && job.assigned_shop_name !== 'Awaiting assignment' ? job.assigned_shop_name : '—' },
    { label: 'Artwork', value: job.artwork_status_label || (job.artwork_uploaded ? 'Uploaded' : 'Missing') },
    { label: 'Artwork confirmation', value: tokenise(job.artwork_confirmation?.state || 'not_required') },
  ]
}

function toggle(id: number) {
  if (openId.value === id) {
    openId.value = null
    return
  }
  openId.value = id
  dispatchError.value = ''
  dispatchNote.value = ''
  resetPreview()
  m.fetchJob(id)
}

function num(value: unknown): number | null {
  if (value === null || value === undefined || value === '') return null
  const n = Number(value)
  return Number.isFinite(n) ? n : null
}

function money(value: unknown) {
  const n = num(value)
  return n === null ? '—' : formatKSh(n, 2)
}

function count(value: unknown) {
  const n = num(value)
  return n === null ? '—' : String(n)
}

function layoutLabel(layout: CanonicalLayout | null | undefined) {
  if (!layout) return '—'
  const dims = layout.cols && layout.rows ? `${layout.cols} × ${layout.rows}` : null
  const orientation = layout.orientation ? tokenise(String(layout.orientation)).toLowerCase() : null
  return [dims, orientation].filter(Boolean).join(' · ') || '—'
}

function spoilageLabel(spoilage: CanonicalSpoilage | null | undefined) {
  if (!spoilage) return '—'
  const added = num(spoilage.waste_sheets_added) ?? num(spoilage.variable_waste_sheets)
  const capped = spoilage.spoilage_capped ? ' (capped)' : ''
  if (added === null) return spoilage.spoilage_capped ? 'Capped' : '—'
  return `${added} sheet${added === 1 ? '' : 's'} added${capped}`
}

function methodLabel(method: CanonicalMethod | null | undefined) {
  if (!method) return '—'
  const parts = [
    method.machine_name,
    method.color_mode ? tokenise(String(method.color_mode)).toLowerCase() : null,
    method.sides ? tokenise(String(method.sides)).toLowerCase() : null,
  ].filter(Boolean)
  if (parts.length) return String(method.material_label ? `${method.material_label} · ` : '') + parts.join(' · ')
  return method.material_label || (method.pricing_mode ? tokenise(String(method.pricing_mode)) : '—')
}

function productionRows(canonical: CanonicalJobResult | null) {
  if (!canonical) return []
  const rows: { label: string; value: string }[] = []
  if (canonical.press_sheet) rows.push({ label: 'Press sheet', value: String(canonical.press_sheet) })
  if (canonical.layout) rows.push({ label: 'Layout', value: layoutLabel(canonical.layout) })
  if (num(canonical.ups) !== null) rows.push({ label: 'Ups', value: count(canonical.ups) })
  if (num(canonical.good_sheets) !== null) rows.push({ label: 'Good sheets', value: count(canonical.good_sheets) })
  if (canonical.spoilage) rows.push({ label: 'Spoilage', value: spoilageLabel(canonical.spoilage) })
  if (num(canonical.sheets_billed) !== null) rows.push({ label: 'Sheets billed', value: count(canonical.sheets_billed) })
  if (canonical.method) rows.push({ label: 'Method', value: methodLabel(canonical.method) })
  return rows
}

function financeRows(canonical: CanonicalJobResult | null) {
  const rows: { label: string; value: string; strong?: boolean }[] = []
  if (!canonical) return rows
  if (canonical.price !== undefined) rows.push({ label: 'Buyer price', value: money(canonical.price), strong: true })
  if (canonical.per_piece !== undefined) rows.push({ label: 'Per piece', value: money(canonical.per_piece) })
  if (canonical.manager_margin !== undefined) rows.push({ label: 'Your margin', value: money(canonical.manager_margin) })
  if (canonical.fee_tier !== undefined) {
    const tier = num(canonical.fee_tier)
    rows.push({ label: 'Fee tier', value: tier === null ? String(canonical.fee_tier) : `${tier}` })
  }
  if (canonical.printer_payout !== undefined) rows.push({ label: 'Printer payout', value: money(canonical.printer_payout) })
  if (canonical.printer_side_fee !== undefined) rows.push({ label: 'Printer-side fee', value: money(canonical.printer_side_fee) })
  return rows
}

function costRows(canonical: CanonicalJobResult | null) {
  const rows: { label: string; value: string }[] = []
  const breakdown = canonical?.cost_breakdown as Record<string, any> | null | undefined
  if (!breakdown) return rows
  const paper = breakdown.paper as Record<string, any> | undefined
  if (num(paper?.total) !== null) rows.push({ label: 'Paper', value: money(paper?.total) })
  const printing = breakdown.printing as Record<string, any> | null | undefined
  if (num(printing?.total) !== null) rows.push({ label: 'Printing', value: money(printing?.total) })
  const material = breakdown.material as Record<string, any> | null | undefined
  if (num(material?.total) !== null) rows.push({ label: 'Material', value: money(material?.total) })
  const finishings = Array.isArray(breakdown.finishings) ? breakdown.finishings : []
  for (const line of finishings) {
    if (num(line?.total) !== null) rows.push({ label: String(line.label || 'Finishing'), value: money(line.total) })
  }
  return rows
}

function buildOverridePayload(): JobOverrideRequest | null {
  overrideError.value = ''
  const field = overrideField.value
  const raw = overrideValue.value.trim()
  if (!raw) {
    overrideError.value = 'Enter a value for the adjustment.'
    return null
  }
  if (overrideField.value === 'markup') {
    const amount = Number(raw)
    if (!Number.isFinite(amount)) {
      overrideError.value = 'Markup must be a number in KES.'
      return null
    }
    return { field, new_value: { amount } }
  }
  if (field === 'sheet_count') {
    const sheets = Number(raw)
    if (!Number.isInteger(sheets) || sheets < 0) {
      overrideError.value = 'Sheet count must be a whole number of sheets.'
      return null
    }
    return { field, new_value: { sheets_billed: sheets } }
  }
  if (field === 'spoilage') {
    const sheets = Number(raw)
    if (!Number.isInteger(sheets) || sheets < 0) {
      overrideError.value = 'Spoilage must be a whole number of sheets.'
      return null
    }
    return { field, new_value: { waste_sheets_added: sheets } }
  }
  return { field: 'paper_substitution', new_value: { label: raw } }
}

function resetPreview() {
  previewResult.value = null
  overrideError.value = ''
  overrideNote.value = ''
}

async function previewAdjustment(jobId: number) {
  const payload = buildOverridePayload()
  if (!payload) return
  previewingJobId.value = jobId
  overrideNote.value = ''
  const result = await m.previewJobOverride(jobId, payload)
  previewingJobId.value = null
  if (!result) {
    overrideError.value = m.error || "We couldn't preview that adjustment."
    return
  }
  previewResult.value = result
}

async function saveAdjustment(jobId: number) {
  const payload = buildOverridePayload()
  if (!payload) return
  savingJobId.value = jobId
  const result = await m.saveJobOverride(jobId, payload)
  savingJobId.value = null
  if (!result) {
    overrideError.value = m.error || "We couldn't save that adjustment."
    return
  }
  overrideNote.value = 'Adjustment recorded on the job.'
  if (result.manager) previewResult.value = result
}

async function dispatch(job: ManagerJobRow) {
  if (dispatchingId.value) return
  dispatchingId.value = job.id
  dispatchError.value = ''
  dispatchNote.value = ''
  errorJobId.value = null
  noteJobId.value = null
  const result = await m.dispatchJob(job.id)
  dispatchingId.value = null
  if (!result) {
    dispatchError.value = m.error || "We couldn't dispatch that job."
    errorJobId.value = job.id
    return
  }
  dispatchNote.value = `Dispatched to ${result.shop_name || 'the shop'} — queue created and the production team was notified.`
  noteJobId.value = job.id
}

onMounted(() => {
  m.fetchJobs()
})
</script>