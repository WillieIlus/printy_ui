<template>
  <div>
    <div class="flex flex-wrap items-center justify-between gap-3">
      <div class="flex items-center gap-2 font-mono2 text-[10px] uppercase tracking-[0.22em] text-[var(--sub)]">
        <Package :size="11" style="color: var(--accent)" /> live orders · {{ store.jobs.length }}
      </div>
      <button
        class="press-key inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 font-mono2 text-[9px] font-semibold uppercase tracking-[0.14em] text-[var(--sub)]"
        :style="{ borderColor: 'var(--line)' }"
        :disabled="store.loading"
        @click="store.fetchJobs()"
      >
        <Loader2 v-if="store.loading" :size="11" class="animate-spin" /> <RefreshCw v-else :size="11" /> refresh
      </button>
    </div>

    <p v-if="store.error" class="mt-4 rounded-2xl border px-4 py-3 text-[12.5px]" :style="{ borderColor: 'rgba(251,77,109,.4)', background: 'rgba(251,77,109,.08)', color: '#B4243F' }">
      {{ store.error }}
    </p>

    <div v-if="store.loading && !store.hasJobs" class="mt-8 flex items-center justify-center gap-2 py-12 text-[13px] text-[var(--sub)]">
      <Loader2 :size="16" class="animate-spin" style="color: var(--accent)" /> Loading your orders…
    </div>

    <div v-else-if="!store.hasJobs" class="mt-6 rounded-3xl border p-10 text-center" :style="{ borderColor: 'var(--line)', background: 'var(--panel)' }">
      <div class="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl" :style="{ background: 'color-mix(in srgb, var(--accent) 12%, transparent)' }">
        <Package :size="20" style="color: var(--accent)" />
      </div>
      <h3 class="mt-4 font-disp text-[18px] font-bold tracking-tight">No orders yet</h3>
      <p class="mx-auto mt-1.5 max-w-[42ch] text-[13px] leading-relaxed text-[var(--sub)]">
        Once your quote is accepted and paid, your job lands here with live status, artwork sign-off and payment history.
      </p>
    </div>

    <div v-else class="mt-4 space-y-4">
      <article v-for="job in store.jobs" :key="job.id" class="overflow-hidden rounded-3xl border bg-[var(--panel)]" :style="{ borderColor: actionJob(job) === job.id ? 'var(--accent)' : 'var(--line)' }">
        <div class="flex items-center justify-between gap-3 px-5 py-3" :style="{ background: 'var(--panel2)' }">
          <div class="flex items-center gap-2.5">
            <span class="font-mono2 text-[10.5px] font-semibold uppercase tracking-[0.14em]">{{ job.reference }}</span>
          </div>
          <span class="rounded-full px-2.5 py-[3px] font-mono2 text-[8.5px] font-semibold uppercase tracking-[0.12em]" :style="statusChip(job)">
            {{ statusLabel(job) }}
          </span>
        </div>
        <div class="p-5">
          <div class="flex flex-wrap items-start justify-between gap-4">
            <div class="min-w-0">
              <h2 class="font-disp text-[18px] font-bold leading-tight tracking-tight">{{ job.title }}</h2>
              <div class="mt-1 text-[12.5px] text-[var(--sub)]">
                {{ job.production_assignment_reference || 'Awaiting production assignment' }}
                <span v-if="job.artwork_status_label"> · {{ job.artwork_status_label }}</span>
              </div>
            </div>
            <div class="text-right">
              <ML>Total</ML>
              <div class="mt-1 font-disp text-[18px] font-bold" :style="{ color: 'var(--accent)' }">{{ money(job.pricing?.client_total) }}</div>
            </div>
          </div>

          <div v-if="job.artwork_confirmation?.state === 'requested'" class="mt-4 rounded-2xl border p-3" :style="{ borderColor: 'rgba(242,98,46,.4)', background: 'rgba(194,65,12,.06)' }">
            <div class="flex items-center gap-2 font-mono2 text-[10px] font-semibold uppercase tracking-[0.14em]" style="color: #C2410C">
              <PenLine :size="12" /> Your sign-off is needed
            </div>
            <p class="mt-1.5 text-[12.5px] text-[var(--sub)]">{{ job.artwork_confirmation.note || 'Please confirm the artwork before this job goes to production.' }}</p>
            <div class="mt-3 flex flex-wrap gap-2">
              <button class="press-key inline-flex items-center gap-1.5 rounded-xl px-4 py-2 font-mono2 text-[10px] font-bold uppercase tracking-[0.12em] disabled:opacity-50" :style="{ background: 'var(--accent)', color: 'var(--accentInk)' }" :disabled="store.actingId === job.id" @click="respond(job, true)">
                <Check :size="12" /> Approve artwork
              </button>
              <button class="press-key inline-flex items-center gap-1.5 rounded-xl border px-4 py-2 font-mono2 text-[10px] font-bold uppercase tracking-[0.12em] disabled:opacity-50" :style="{ borderColor: 'var(--line)' }" :disabled="store.actingId === job.id" @click="respond(job, false)">
                <PencilRuler :size="12" /> Request changes
              </button>
            </div>
          </div>

          <div class="mt-4 flex flex-wrap gap-2 border-t pt-4" :style="{ borderColor: 'var(--line)' }">
            <button v-if="canPay(job)" class="press-key inline-flex items-center gap-1.5 rounded-xl px-5 py-2.5 font-mono2 text-[11px] font-semibold uppercase tracking-[0.14em]" :style="{ background: '#B45309', color: '#fff' }" @click="pay(job)">
              <CreditCard :size="13" /> Pay {{ money(job.pricing?.client_total) }}
            </button>
            <label v-if="job.artwork_missing" class="press-key inline-flex cursor-pointer items-center gap-1.5 rounded-xl border px-4 py-2.5 font-mono2 text-[11px] font-semibold uppercase tracking-[0.14em]" :style="{ borderColor: 'var(--line)' }">
              <Upload :size="13" /> Upload artwork
              <input type="file" class="hidden" accept=".pdf,.jpg,.jpeg,.png,.ai,.eps" @change="onArtwork(job, $event)" />
            </label>
            <button v-if="job.status === 'completed'" class="press-key inline-flex items-center gap-1.5 rounded-xl border px-4 py-2.5 font-mono2 text-[11px] font-semibold uppercase tracking-[0.14em]" :style="{ borderColor: 'var(--accent)', color: 'var(--accent)' }" @click="doReorder(job)">
              <RotateCcw :size="13" /> Reorder
            </button>
            <button class="press-key inline-flex items-center gap-1.5 rounded-xl border px-4 py-2.5 font-mono2 text-[11px] font-semibold uppercase tracking-[0.14em]" :style="{ borderColor: 'var(--line)' }" @click="open(job)">
              <Eye :size="13" /> View order
            </button>
          </div>
        </div>
      </article>
    </div>

    <MpesaCheckout
      :open="!!payJob"
      :amount="payAmount"
      :reference="payJob?.reference ?? ''"
      :managed-job-id="payJob?.id ?? null"
      @close="payJob = null"
      @paid="onPaid"
    />

    <section class="mt-8">
      <button class="press-key flex w-full items-center justify-between gap-3 rounded-2xl border p-4" :style="{ borderColor: 'var(--line)', background: 'var(--panel)' }" @click="togglePayments">
        <span class="flex items-center gap-2.5">
          <History :size="15" style="color: var(--accent)" />
          <span class="font-mono2 text-[10px] font-semibold uppercase tracking-[0.16em]">Payment history</span>
          <span v-if="!paymentsOpen" class="font-mono2 text-[9px] uppercase tracking-[0.12em] text-[var(--sub)]">all orders · newest first</span>
        </span>
        <ChevronDown :size="15" class="text-[var(--sub)] transition-transform" :style="paymentsOpen ? { transform: 'rotate(180deg)' } : {}" />
      </button>

      <div v-if="paymentsOpen" class="mt-3 space-y-2">
        <div v-if="store.loading && store.paymentHistory.length === 0" class="flex items-center gap-2 px-1 py-4 text-[12.5px] text-[var(--sub)]">
          <Loader2 :size="13" class="animate-spin" style="color: var(--accent)" /> Loading payments…
        </div>
        <div v-else-if="store.paymentHistory.length === 0" class="rounded-2xl border border-dashed p-6 text-center text-[12.5px] text-[var(--sub)]" :style="{ borderColor: 'var(--line)' }">
          No M-Pesa payments recorded yet. They'll appear here the moment a payment goes through.
        </div>
        <div v-for="p in store.paymentHistory" :key="p.id" class="flex flex-wrap items-center justify-between gap-2 rounded-2xl border px-4 py-3" :style="{ borderColor: 'var(--line)', background: 'var(--panel)' }">
          <div class="flex items-center gap-3">
            <span class="flex h-9 w-9 items-center justify-center rounded-xl" :style="{ background: 'color-mix(in srgb, var(--accent) 12%, transparent)' }">
              <CreditCard :size="15" style="color: var(--accent)" />
            </span>
            <div class="min-w-0">
              <div class="text-[13px] font-semibold">{{ p.payment_reference }}</div>
              <div class="font-mono2 text-[9.5px] uppercase tracking-[0.1em] text-[var(--sub)]">{{ p.job_reference }} · {{ p.channel || 'mpesa' }} · {{ formatDate(p.created_at) }}</div>
            </div>
          </div>
          <div class="text-right">
            <div class="font-disp text-[15px] font-bold" :style="{ color: paidTone(p.payment_status) }">{{ money(p.amount) }}</div>
            <div class="font-mono2 text-[9px] uppercase tracking-[0.1em]" :style="{ color: paidTone(p.payment_status) }">{{ p.payment_status }}</div>
          </div>
        </div>
      </div>
    </section>

    <!-- detail drawer -->
    <div v-if="store.activeJob" class="fixed inset-0 z-[70] flex justify-end bg-black/50 backdrop-blur-sm" @click="closeDrawer">
      <div class="h-full w-full max-w-[620px] overflow-y-auto border-l" :style="{ borderColor: 'var(--line)', background: 'var(--panel)' }" @click.stop>
        <div class="sticky top-0 z-10 flex items-center justify-between gap-3 border-b px-5 py-4" :style="{ borderColor: 'var(--line)', background: 'var(--panel)' }">
          <div class="min-w-0">
            <ML>{{ store.activeJob.reference }}</ML>
            <div class="mt-0.5 truncate font-disp text-[17px] font-bold">{{ store.activeJob.title }}</div>
          </div>
          <button class="rounded-full p-2 hover:bg-[var(--panel2)]" @click="closeDrawer"><X :size="16" /></button>
        </div>

        <div class="space-y-6 p-5">
          <div class="flex flex-wrap gap-2">
            <span v-for="s in detailSummary" :key="s.label" class="rounded-xl px-3 py-2" :style="{ background: 'var(--panel2)' }">
              <span class="block font-mono2 text-[8.5px] uppercase tracking-[0.12em] text-[var(--sub)]">{{ s.label }}</span>
              <span class="mt-0.5 block text-[13px] font-semibold">{{ s.value }}</span>
            </span>
          </div>

          <section>
            <ML>Files</ML>
            <div v-if="store.files.length === 0" class="mt-2 text-[12.5px] text-[var(--sub)]">No files shared yet.</div>
            <div v-else class="mt-2 space-y-2">
              <div v-for="file in store.files" :key="file.id" class="rounded-xl border p-3" :style="{ borderColor: 'var(--line)' }">
                <div class="flex flex-wrap items-center gap-2">
                  <FileText :size="13" style="color: var(--accent)" />
                  <span class="min-w-0 flex-1 truncate text-[12.5px] font-semibold">{{ file.original_filename || `File ${file.id}` }}</span>
                  <span class="rounded-full px-2 py-[2px] font-mono2 text-[8.5px] uppercase tracking-[0.1em]" :style="{ background: 'var(--panel2)', color: 'var(--sub)' }">{{ file.file_type }} · v{{ file.version }}</span>
                </div>
                <div class="mt-2 flex flex-wrap items-center gap-2">
                  <a :href="file.download_url" target="_blank" rel="noopener" class="press-key inline-flex items-center gap-1 rounded-lg border px-3 py-1.5 font-mono2 text-[9px] font-semibold uppercase tracking-[0.12em]" :style="{ borderColor: 'var(--line)' }">
                    <Download :size="11" /> Download
                  </a>
                  <template v-if="file.status !== 'approved'">
                    <button class="press-key inline-flex items-center gap-1 rounded-lg px-3 py-1.5 font-mono2 text-[9px] font-semibold uppercase tracking-[0.12em]" :style="{ background: 'var(--accent)', color: 'var(--accentInk)' }" @click="store.actOnFile(file.id, 'approve')">
                      <Check :size="11" /> Approve
                    </button>
                    <button class="press-key inline-flex items-center gap-1 rounded-lg border px-3 py-1.5 font-mono2 text-[9px] font-semibold uppercase tracking-[0.12em]" :style="{ borderColor: 'var(--line)' }" @click="store.actOnFile(file.id, 'revision')">
                      <PencilRuler :size="11" /> Changes
                    </button>
                  </template>
                  <span v-else class="font-mono2 text-[9px] uppercase tracking-[0.12em]" style="color: #0E7A45">approved</span>
                </div>
              </div>
            </div>
          </section>

          <section>
            <ML>Payments</ML>
            <div v-if="store.payments.length === 0" class="mt-2 text-[12.5px] text-[var(--sub)]">No payments recorded yet.</div>
            <div v-else class="mt-2 space-y-2">
              <div v-for="p in store.payments" :key="p.id" class="flex items-center justify-between gap-2 rounded-xl border px-3 py-2.5" :style="{ borderColor: 'var(--line)' }">
                <div class="min-w-0">
                  <div class="truncate text-[12.5px] font-semibold">{{ p.payment_reference }}</div>
                  <div class="font-mono2 text-[9px] uppercase tracking-[0.1em] text-[var(--sub)]">{{ p.payment_status }} · {{ p.channel }}</div>
                </div>
                <span class="font-disp text-[14px] font-bold">{{ money(p.amount) }}</span>
              </div>
            </div>
          </section>

          <section>
            <ML>Timeline</ML>
            <div v-if="store.events.length === 0" class="mt-2 text-[12.5px] text-[var(--sub)]">No events yet.</div>
            <ol v-else class="mt-3 space-y-3">
              <li v-for="event in store.events" :key="event.id" class="flex gap-3">
                <span class="mt-1 h-2 w-2 shrink-0 rounded-full" :style="{ background: 'var(--accent)' }" />
                <div class="min-w-0">
                  <div class="text-[12.5px] leading-snug">{{ event.summary }}</div>
                  <div class="font-mono2 text-[9px] uppercase tracking-[0.1em] text-[var(--sub)]">{{ event.actor_name }} · {{ formatDate(event.created_at) }}</div>
                </div>
              </li>
            </ol>
          </section>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { Check, ChevronDown, CreditCard, Download, Eye, FileText, History, Loader2, Package, PencilRuler, PenLine, RefreshCw, RotateCcw, Upload, X } from 'lucide-vue-next'
import { useClientJobsStore } from '~/stores/client-jobs'
import type { ClientJobRecord } from '~/shared/types'

const store = useClientJobsStore()
const payJob = ref<ClientJobRecord | null>(null)
const paymentsOpen = ref(false)

async function togglePayments() {
  paymentsOpen.value = !paymentsOpen.value
  if (paymentsOpen.value && store.paymentHistory.length === 0) {
    await store.fetchPaymentHistory()
  }
}

function paidTone(status?: string) {
  const s = (status || '').toLowerCase()
  if (['completed', 'confirmed', 'success', 'succeeded', 'paid'].includes(s)) return '#0E7A45'
  if (['pending', 'processing', 'initiated'].includes(s)) return '#B45309'
  if (['failed', 'cancelled', 'expired', 'reversed'].includes(s)) return '#C81E44'
  return 'var(--accent)'
}

const payAmount = computed(() => Number(payJob.value?.pricing?.client_total ?? 0))

function money(value?: string | null) {
  if (value == null || value === '') return '—'
  const n = Number(value)
  if (Number.isNaN(n)) return String(value)
  return 'KSh ' + n.toLocaleString('en-KE', { minimumFractionDigits: 2 })
}

function actionJob(job: ClientJobRecord) {
  return canPay(job) || job.artwork_confirmation?.state === 'requested' || job.artwork_missing ? job.id : null
}

function canPay(job: ClientJobRecord) {
  return !job.payment_confirmed && Number(job.pricing?.client_total ?? 0) > 0
}

function statusLabel(job: ClientJobRecord) {
  if (job.artwork_confirmation?.state === 'requested') return 'Needs your sign-off'
  if (!job.payment_confirmed && canPay(job)) return 'Payment due'
  if (job.artwork_missing) return 'Artwork needed'
  if (job.status === 'completed') return 'Completed'
  return String(job.status || 'In progress').replace(/_/g, ' ')
}

function statusChip(job: ClientJobRecord) {
  if (job.artwork_confirmation?.state === 'requested') return { background: 'rgba(194,65,12,.14)', color: '#C2410C' }
  if (!job.payment_confirmed && canPay(job)) return { background: 'rgba(180,83,9,.14)', color: '#B45309' }
  if (job.status === 'completed') return { background: 'rgba(47,191,113,.16)', color: '#0E7A45' }
  return { background: 'color-mix(in srgb, var(--accent) 13%, transparent)', color: 'var(--accent)' }
}

function formatDate(value?: string | null) {
  if (!value) return ''
  const d = new Date(value)
  return Number.isNaN(d.getTime()) ? '' : d.toLocaleDateString('en-KE', { day: 'numeric', month: 'short', year: 'numeric' })
}

const detailSummary = computed(() => {
  const job = store.activeJob
  if (!job) return []
  return [
    { label: 'Status', value: statusLabel(job) },
    { label: 'Payment', value: job.payment_status || '—' },
    { label: 'Assignment', value: job.assignment_status || '—' },
    { label: 'Deadline', value: formatDate(job.requested_deadline) || '—' },
  ]
})

async function respond(job: ClientJobRecord, approved: boolean) {
  await store.respondToArtworkConfirmation(job.id, approved)
}

function pay(job: ClientJobRecord) {
  payJob.value = job
}

async function onPaid() {
  const job = payJob.value
  payJob.value = null
  if (job) await store.fetchJobs()
}

async function onArtwork(job: ClientJobRecord, event: Event) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (file) await store.uploadArtwork(job.id, file)
  input.value = ''
}

async function doReorder(job: ClientJobRecord) {
  await store.reorder(job.id)
}

async function open(job: ClientJobRecord) {
  await Promise.all([
    store.fetchJob(job.id),
    store.fetchFiles(job.id),
    store.fetchEvents(job.id),
    store.fetchPayments(job.id),
  ])
}

function closeDrawer() {
  store.activeJob = null
}

onMounted(() => {
  store.fetchJobs()
})
</script>
