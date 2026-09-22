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
      <AlertTriangle :size="22" style="color: #FB4D6D" />
      <p class="max-w-[44ch] text-[13px] leading-relaxed text-[var(--sub)]">{{ m.error }}</p>
      <button class="press-key mt-1 inline-flex items-center gap-2 rounded-xl px-4 py-2 font-mono2 text-[10px] font-semibold uppercase tracking-[0.14em]" :style="{ background: 'var(--accent)', color: 'var(--accentInk)' }" @click="m.fetchJobs()">
        <RefreshCw :size="12" /> Try again
      </button>
    </div>

    <div v-else-if="!m.hasJobs" class="mt-14 rounded-2xl border p-8 text-center" :style="{ borderColor: 'var(--line)', background: 'var(--panel)' }">
      <Inbox :size="22" class="mx-auto" style="color: var(--accent)" />
      <p class="mt-3 text-[13px] text-[var(--sub)]">No jobs in progress you can dispatch yet.</p>
    </div>

    <div v-else class="mt-6 space-y-2.5">
      <div class="mb-1 flex flex-wrap items-center gap-2 pl-1">
        <ML>All jobs · {{ m.jobs.length }}</ML>
        <span class="rounded-full px-2.5 py-[3px] font-mono2 text-[9px] uppercase tracking-[0.12em]" :style="{ background: 'rgba(47,191,113,.12)', color: '#2FBF71' }">
          {{ m.dispatchableJobs.length }} ready to dispatch
        </span>
      </div>

      <article
        v-for="job in m.jobs"
        :key="job.id"
        class="overflow-hidden rounded-2xl border transition-colors hover:border-[var(--accent)]"
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
            </div>
          </div>
          <div class="flex shrink-0 items-center gap-2">
            <span v-if="job.dispatched_at" class="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 font-mono2 text-[10px] font-semibold uppercase tracking-[0.12em]" :style="{ background: 'rgba(47,191,113,.12)', color: '#2FBF71' }">
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

          <div v-if="dispatchError && errorJobId === job.id" class="mt-3 rounded-xl border px-4 py-3 text-[12.5px]" :style="{ borderColor: 'rgba(251,77,109,.4)', background: 'rgba(251,77,109,.08)', color: '#FB4D6D' }">
            {{ dispatchError }}
          </div>
          <div v-if="dispatchNote && noteJobId === job.id" class="mt-3 flex items-center gap-2 rounded-xl border px-4 py-3 text-[12.5px]" :style="{ borderColor: 'rgba(47,191,113,.4)', background: 'rgba(47,191,113,.08)', color: '#2FBF71' }">
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
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { AlertTriangle, ArrowLeft, Check, ChevronDown, Inbox, Loader2, RefreshCw, Rocket } from 'lucide-vue-next'
import { useManagerStore } from '~/stores/manager'
import type { ManagerJobRow } from '~/shared/types'

const m = useManagerStore()

const openId = ref<number | null>(null)
const dispatchingId = ref<number | null>(null)
const dispatchError = ref('')
const dispatchNote = ref('')
const errorJobId = ref<number | null>(null)
const noteJobId = ref<number | null>(null)

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
  return `KES ${n.toLocaleString('en-KE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
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

function statusStyle(raw: string) {
  const s = (raw || '').toLowerCase()
  if (s.includes('complete') || s.includes('delivered') || s.includes('released')) return { background: 'rgba(47,191,113,.16)', color: '#2FBF71' }
  if (s.includes('print') || s.includes('produc') || s.includes('active')) return { background: 'rgba(47,191,113,.12)', color: '#2FBF71' }
  if (s.includes('issue') || s.includes('overdue') || s.includes('reject')) return { background: 'rgba(251,77,109,.14)', color: '#FB4D6D' }
  if (s.includes('payment')) return { background: 'rgba(245,166,35,.14)', color: '#F5A623' }
  return { background: 'var(--panel2)', color: 'var(--sub)' }
}

function paymentTone(job: ManagerJobRow) {
  const s = String(job.payment_status || '').toLowerCase()
  if (job.payment_confirmed || ['confirmed', 'release_ready', 'released', 'paid'].includes(s)) {
    return { color: '#2FBF71' }
  }
  if (['pending', 'processing'].includes(s)) return { color: '#F5A623' }
  if (['failed', 'cancelled'].includes(s)) return { color: '#FB4D6D' }
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
  m.fetchJob(id)
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