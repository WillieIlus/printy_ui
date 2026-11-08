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

    <DesignAlert v-if="store.error" tone="error" class="mt-4">
      {{ store.error }}
    </DesignAlert>

    <DesignLoading
      v-if="store.loading && !store.hasJobs"
      label="Loading your orders…"
      class="mt-8"
    />

    <DesignEmptyNote
      v-else-if="!store.hasJobs"
      icon="PackageCheck"
      title="No orders yet"
      hint="Once your quote is accepted and paid, your job lands here with live status, artwork sign-off and payment history."
      class="mt-6"
    />

    <div v-else class="mt-4 space-y-6">
      <section v-for="section in jobSections" :key="section.key">
        <div class="mb-2 flex items-center gap-2">
          <h3 class="font-mono2 text-[10px] font-semibold uppercase tracking-[0.18em]" :style="{ color: section.muted ? 'var(--sub)' : 'var(--ink)' }">{{ section.label }}</h3>
          <span class="rounded-full px-2 py-[1px] font-mono2 text-[9px] font-semibold" :style="{ background: 'var(--panel2)', color: 'var(--sub)' }">{{ section.items.length }}</span>
        </div>
        <div class="space-y-4">
          <article v-for="job in section.items" :key="job.id" class="overflow-hidden rounded-3xl border bg-[var(--panel)] transition" :class="[isMuted(job) ? 'opacity-60' : '', needsAttention(job) ? 'ring-2' : '']" :style="{ borderColor: actionJob(job) === job.id ? 'var(--accent)' : 'var(--line)' }">
        <div class="flex items-center justify-between gap-3 px-5 py-3" :style="{ background: 'var(--panel2)' }">
          <div class="flex items-center gap-2.5">
            <span class="font-mono2 text-[10.5px] font-semibold uppercase tracking-[0.14em]" :class="{ 'font-bold': needsAttention(job) }">{{ job.reference }}</span>
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
              <div v-if="job.timing" class="mt-2 flex flex-wrap gap-x-4 gap-y-1 font-mono2 text-[9.5px] uppercase tracking-[0.1em] text-[var(--sub)]">
                <span v-if="job.timing.due_date">Due <span class="font-semibold text-[var(--ink)]">{{ formatDate(job.timing.due_date) }}</span></span>
                <span v-if="job.timing.stage_label">Stage <span class="font-semibold text-[var(--ink)]">{{ job.timing.stage_label }}</span></span>
                <span v-if="job.timing.stage_owner">With <span class="font-semibold text-[var(--ink)]">{{ ownerLabel(job.timing.stage_owner) }}</span></span>
                <span v-if="remainingLabel(job.timing)" :style="job.timing.is_late ? { color: '#C81E44' } : {}">{{ remainingLabel(job.timing) }}</span>
              </div>
            </div>
            <div class="text-right">
              <ML>Total</ML>
              <div class="mt-1 font-disp text-[18px] font-bold" :style="{ color: 'var(--accent)' }">{{ money(job.pricing?.client_total) }}</div>
            </div>
          </div>

          <DesignAlert
            v-if="job.artwork_confirmation?.state === 'requested'"
            tone="warning"
            title="Your sign-off is needed"
            class="mt-4"
          >
            <p class="text-[12.5px] text-[var(--sub)]">{{ job.artwork_confirmation.note || 'Please confirm the artwork before this job goes to production.' }}</p>
            <div class="mt-3 flex flex-wrap gap-2">
              <button class="press-key inline-flex items-center gap-1.5 rounded-xl px-4 py-2 font-mono2 text-[10px] font-bold uppercase tracking-[0.12em] disabled:opacity-50" :style="{ background: 'var(--accent)', color: 'var(--accentInk)' }" :disabled="store.actingId === job.id" @click="respond(job, true)">
                <Check :size="12" /> Approve artwork
              </button>
              <button class="press-key inline-flex items-center gap-1.5 rounded-xl border px-4 py-2 font-mono2 text-[10px] font-bold uppercase tracking-[0.12em] disabled:opacity-50" :style="{ borderColor: 'var(--line)' }" :disabled="store.actingId === job.id" @click="respond(job, false)">
                <PencilRuler :size="12" /> Request changes
              </button>
            </div>
          </DesignAlert>

          <DesignAlert v-if="priceUpdate(job)" tone="warning" title="Price updated" class="mt-4">
            <p class="text-[12.5px] text-[var(--sub)]">Your print partner changed the price. Review the new total and acknowledge it before paying.</p>
            <div class="mt-1.5 flex items-center gap-2 text-[14px]">
              <span class="text-[var(--sub)] line-through">{{ money(priceUpdate(job)?.oldTotal) }}</span>
              <span class="text-[var(--sub)]">→</span>
              <span class="font-semibold" :style="{ color: 'var(--accent)' }">{{ money(priceUpdate(job)?.newTotal) }}</span>
            </div>
            <button
              class="press-key mt-2 inline-flex items-center gap-1.5 rounded-xl px-4 py-2 font-mono2 text-[10px] font-semibold uppercase tracking-[0.12em] disabled:opacity-60"
              :style="{ background: 'var(--accent)', color: 'var(--accentInk)' }"
              :disabled="store.actingId === job.id"
              @click="acknowledgePrice(job)"
            >
              <CheckCheck :size="12" /> I acknowledge the new price
            </button>
          </DesignAlert>

          <DesignAlert
            v-if="artworkNeedsBuyerAction(job)"
            tone="warning"
            title="Artwork needed before this job can proceed"
            class="mt-4"
          >
            <p class="text-[12.5px] text-[var(--sub)]">
              Upload your artwork, or tell us it is already with your manager/printer and they will confirm it.
            </p>
            <div class="mt-3 flex flex-wrap gap-2">
              <label class="press-key inline-flex cursor-pointer items-center gap-1.5 rounded-xl border px-4 py-2 font-mono2 text-[10px] font-bold uppercase tracking-[0.12em]" :style="{ borderColor: 'var(--accent)', color: 'var(--accent)' }">
                <Upload :size="12" /> Upload artwork
                <input type="file" class="hidden" accept=".pdf,.jpg,.jpeg,.png,.ai,.eps" @change="onArtwork(job, $event)" />
              </label>
              <button class="press-key inline-flex items-center gap-1.5 rounded-xl border px-4 py-2 font-mono2 text-[10px] font-bold uppercase tracking-[0.12em] disabled:opacity-50" :style="{ borderColor: 'var(--line)' }" :disabled="store.actingId === job.id" @click="claimArtwork(job)">
                <Handshake :size="12" /> It's already with my manager
              </button>
            </div>
          </DesignAlert>

          <DesignAlert
            v-else-if="claimState(job) === 'claimed'"
            tone="info"
            title="Waiting on your manager"
            class="mt-4"
          >
            <p class="text-[12.5px] text-[var(--sub)]">You told us the artwork is already with your manager/printer. Payment stays paused until they confirm they have it.</p>
          </DesignAlert>

          <DesignAlert
            v-if="claimState(job) === 'declined'"
            tone="error"
            title="Manager couldn't confirm the artwork"
            class="mt-4"
          >
            <p class="text-[12.5px] text-[var(--sub)]">{{ job.artwork_workflow?.decline_reason || 'Please upload your artwork so the job can continue.' }}</p>
          </DesignAlert>

          <div class="mt-4 flex flex-wrap gap-2 border-t pt-4" :style="{ borderColor: 'var(--line)' }">
            <button v-if="canPay(job)" class="press-key inline-flex items-center gap-1.5 rounded-xl px-5 py-2.5 font-mono2 text-[11px] font-semibold uppercase tracking-[0.14em]" :style="{ background: '#B45309', color: '#fff' }" @click="pay(job)">
              <CreditCard :size="13" /> Pay {{ money(job.pricing?.client_total) }}
            </button>
            <button
              v-else-if="!job.payment_confirmed && payReason(job)"
              class="press-key inline-flex items-center gap-1.5 rounded-xl px-5 py-2.5 font-mono2 text-[11px] font-semibold uppercase tracking-[0.14em] opacity-60"
              :style="{ background: 'var(--panel2)', color: 'var(--sub)' }"
              disabled
              :title="payReason(job) ?? undefined"
            >
              <CreditCard :size="13" /> {{ payReason(job) }}
            </button>
            <button
              v-if="job.status === 'delivered'"
              class="press-key inline-flex items-center gap-1.5 rounded-xl px-5 py-2.5 font-mono2 text-[11px] font-semibold uppercase tracking-[0.14em] disabled:opacity-60"
              :style="{ background: '#1E8E52', color: '#fff' }"
              :disabled="store.actingId === job.id"
              @click="confirmJob(job)"
            >
              <Check :size="13" /> Confirm completion
            </button>
            <button v-if="job.status === 'completed'" class="press-key inline-flex items-center gap-1.5 rounded-xl border px-4 py-2.5 font-mono2 text-[11px] font-semibold uppercase tracking-[0.14em]" :style="{ borderColor: 'var(--accent)', color: 'var(--accent)' }" @click="doReorder(job)">
              <RotateCcw :size="13" /> Reorder
            </button>
            <button class="press-key inline-flex items-center gap-1.5 rounded-xl border px-4 py-2.5 font-mono2 text-[11px] font-semibold uppercase tracking-[0.14em]" :style="{ borderColor: 'var(--line)' }" @click="open(job)">
              <Eye :size="13" /> View order
            </button>
          </div>

          <div class="mt-4 border-t pt-3" :style="{ borderColor: 'var(--line)' }">
            <JobCardFooter
              role="buyer"
              :job-code="job.job_reference || job.reference"
              :holder="job.timing ? ownerLabel(job.timing.stage_owner) : ''"
              :next-action="job.timing?.next_action"
              :due-date="job.timing?.due_date"
              :sla-minutes="job.timing?.time_remaining_minutes"
              :is-late="job.timing?.is_late"
              :price-updated="priceUpdate(job) ? { oldTotal: money(priceUpdate(job)?.oldTotal), newTotal: money(priceUpdate(job)?.newTotal) } : null"
            />
          </div>
        </div>
          </article>
        </div>
      </section>
    </div>

    <MpesaCheckout
      :open="!!payJob"
      :amount="payAmount"
      :reference="payJob?.reference ?? ''"
      :managed-job-id="payJob?.id ?? null"
      :prefill-phone="auth.phone ?? null"
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
        <DesignLoading
          v-if="store.loading && store.paymentHistory.length === 0"
          variant="inline"
          label="Loading payments…"
          class="px-1 py-4"
        />
        <DesignEmptyNote
          v-else-if="store.paymentHistory.length === 0"
          icon="ReceiptText"
          title="No M-Pesa payments recorded yet"
          hint="They'll appear here the moment a payment goes through."
        />
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

          <section v-if="store.activeJob.timing">
            <ML>Timing</ML>
            <dl class="mt-2 space-y-1.5">
              <div v-for="row in detailTiming" :key="row.label" class="flex justify-between gap-4 text-[12.5px]">
                <dt class="text-[var(--sub)]">{{ row.label }}</dt>
                <dd class="text-right font-medium text-[var(--ink)]">{{ row.value }}</dd>
              </div>
            </dl>
          </section>

          <section>
            <ML>Files</ML>
            <DesignEmptyNote
              v-if="store.files.length === 0"
              title="No files shared yet"
              hint="Artwork and proofs appear here when your manager shares them."
              class="mt-2 px-4 py-5"
            />
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
            <DesignEmptyNote
              v-if="store.payments.length === 0"
              title="No payments recorded yet"
              hint="M-Pesa payments for this order will be listed here."
              class="mt-2 px-4 py-5"
            />
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
            <DesignEmptyNote
              v-if="store.events.length === 0"
              title="No events yet"
              hint="Status changes and handoffs appear here as the job moves."
              class="mt-2 px-4 py-5"
            />
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
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { Check, CheckCheck, ChevronDown, CreditCard, Download, Eye, FileText, Handshake, History, Loader2, Package, PencilRuler, RefreshCw, RotateCcw, Upload, X } from 'lucide-vue-next'
import DesignAlert from '~/components/design/ui/Alert.vue'
import DesignEmptyNote from '~/components/design/ui/EmptyNote.vue'
import DesignLoading from '~/components/design/ui/Loading.vue'
import { useAuthStore } from '~/stores/auth'
import { useClientJobsStore } from '~/stores/client-jobs'
import { FUNNEL_EVENTS, trackFunnel } from '~/shared/funnel'
import {
  acknowledgeJobTotal,
  artworkSatisfied,
  canPayJob,
  createPriceTrackerState,
  observeJobTotals,
  payBlockedReason,
  priceNeedsAcknowledgement,
  priceUpdateFor,
} from '~/shared/buyer-law7'
import { isMuted, needsAttention, sectionsFromServer } from '~/shared/list-sections'
import type { ClientJobRecord, JobTiming } from '~/shared/types'

const store = useClientJobsStore()
const auth = useAuthStore()
const payJob = ref<ClientJobRecord | null>(null)
const paymentsOpen = ref(false)

// Law 7.1: track the totals the buyer has already seen so a refetch can surface
// a "Price updated" state that must be acknowledged before paying.
const priceTracker = ref(createPriceTrackerState())

watch(
  () => store.jobs,
  (jobs) => {
    priceTracker.value = observeJobTotals(priceTracker.value, jobs)
  },
  { deep: true, immediate: true },
)

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
  return formatKSh(value, 2)
}

function actionJob(job: ClientJobRecord) {
  return canPay(job) || job.artwork_confirmation?.state === 'requested' || artworkNeedsBuyerAction(job) || job.status === 'delivered' ? job.id : null
}

// Law 7.2: the buyer can supply artwork by upload, or by stating the manager
// already holds it. Show the buyer action until one of those is settled.
function claimState(job: ClientJobRecord): string {
  return job.artwork_workflow?.claim_state ?? 'none'
}

function artworkNeedsBuyerAction(job: ClientJobRecord): boolean {
  if (artworkSatisfied(job)) return false
  // While the manager's acceptance is pending, the ball is with the manager.
  if (claimState(job) === 'claimed') return false
  return true
}

async function claimArtwork(job: ClientJobRecord) {
  await store.claimArtworkWithManager(job.id)
}

function priceNeedsAck(job: ClientJobRecord): boolean {
  return priceNeedsAcknowledgement(priceTracker.value, job.id)
}

function priceUpdate(job: ClientJobRecord) {
  return priceUpdateFor(priceTracker.value, job.id)
}

function canPay(job: ClientJobRecord) {
  return canPayJob(job, { priceNeedsAck: priceNeedsAck(job) })
}

function payReason(job: ClientJobRecord): string | null {
  return payBlockedReason(job, { priceNeedsAck: priceNeedsAck(job) })
}

function acknowledgePrice(job: ClientJobRecord) {
  priceTracker.value = acknowledgeJobTotal(priceTracker.value, job.id)
}

function statusLabel(job: ClientJobRecord) {
  if (job.artwork_confirmation?.state === 'requested') return 'Needs your sign-off'
  if (!job.payment_confirmed && claimState(job) === 'claimed') return 'Waiting on manager'
  if (!job.payment_confirmed && canPay(job)) return 'Payment due'
  if (job.artwork_missing && claimState(job) !== 'accepted') return 'Artwork needed'
  if (job.status === 'delivered') return 'Delivered — confirm on arrival'
  if (job.status === 'completed') return 'Completed'
  return String(job.status || 'In progress').replace(/_/g, ' ')
}

function statusChip(job: ClientJobRecord) {
  if (job.artwork_confirmation?.state === 'requested') return { background: 'rgba(194,65,12,.14)', color: '#C2410C' }
  if (!job.payment_confirmed && claimState(job) === 'claimed') return { background: 'rgba(180,83,9,.14)', color: '#B45309' }
  if (!job.payment_confirmed && canPay(job)) return { background: 'rgba(180,83,9,.14)', color: '#B45309' }
  if (job.status === 'delivered') return { background: 'rgba(30,142,82,.15)', color: '#0E7A45' }
  if (job.status === 'completed') return { background: 'rgba(47,191,113,.16)', color: '#0E7A45' }
  return { background: 'color-mix(in srgb, var(--accent) 13%, transparent)', color: 'var(--accent)' }
}

function formatDate(value?: string | null) {
  if (!value) return ''
  const d = new Date(value)
  return Number.isNaN(d.getTime()) ? '' : d.toLocaleDateString('en-KE', { day: 'numeric', month: 'short', year: 'numeric' })
}

function ownerLabel(owner?: string | null) {
  if (owner === 'buyer') return 'You'
  if (owner === 'manager') return 'Print manager'
  if (owner === 'printer') return 'Printer'
  return owner || ''
}

function remainingLabel(timing: JobTiming) {
  const minutes = timing.time_remaining_minutes
  if (minutes === null || minutes === undefined) return ''
  if (minutes <= 0) return timing.is_late ? 'Overdue' : 'Due now'
  const hours = Math.round(minutes / 60)
  if (hours < 24) return `${hours}h left`
  return `${Math.round(hours / 24)}d left`
}

// Law 7.5: the backend decides each job's section and order; the panel only
// renders those groups.
const jobSections = computed(() => sectionsFromServer(store.jobs))

const detailSummary = computed(() => {
  const job = store.activeJob
  if (!job) return []
  return [
    { label: 'Status', value: statusLabel(job) },
    { label: 'Payment', value: job.payment_status || '' },
    { label: 'Assignment', value: job.assignment_status || '' },
    { label: 'Deadline', value: formatDate(job.requested_deadline) },
  ].filter((row) => row.value)
})

const detailTiming = computed(() => {
  const timing = store.activeJob?.timing
  if (!timing) return []
  return [
    { label: 'Due date', value: formatDate(timing.due_date) },
    { label: 'Current stage', value: timing.stage_label },
    { label: 'With', value: ownerLabel(timing.stage_owner) },
    { label: 'Next action', value: timing.next_action || '' },
    { label: 'Time remaining', value: remainingLabel(timing) },
  ].filter((row) => row.value)
})

async function respond(job: ClientJobRecord, approved: boolean) {
  await store.respondToArtworkConfirmation(job.id, approved)
}

function pay(job: ClientJobRecord) {
  // Law 7.1: refetch immediately before opening checkout so a stale price can
  // never be paid. The tracker folds the fresh totals in first.
  void openCheckout(job)
}

async function openCheckout(job: ClientJobRecord) {
  await store.fetchJobs()
  const fresh = store.jobs.find((item) => item.id === job.id) ?? job
  if (!canPay(fresh)) {
    return
  }
  payJob.value = fresh
}

async function onPaid() {
  const job = payJob.value
  payJob.value = null
  trackFunnel(FUNNEL_EVENTS.QUOTE_PAID, { job_id: job?.id ?? null })
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

async function confirmJob(job: ClientJobRecord) {
  await store.confirmCompletion(job.id)
  await store.fetchJobs()
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

function onWindowFocus() {
  // Law 7.1: buyer screens refetch on window focus so a manager price change
  // surfaces as "Price updated" before the buyer can act.
  void store.fetchJobs()
}

onMounted(() => {
  store.fetchJobs()
  window.addEventListener('focus', onWindowFocus)
})

onBeforeUnmount(() => {
  window.removeEventListener('focus', onWindowFocus)
})
</script>
