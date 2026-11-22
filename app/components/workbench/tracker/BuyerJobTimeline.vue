<template>
  <DesignBuyerSurface>
    <div class="mx-auto flex w-full max-w-[1180px] flex-col gap-6 pb-40">
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

        <FloatingNextStepCard
          v-if="detail?.job?.next_step"
          :item="detailNextItem"
          :job-id="props.jobId"
          role="buyer"
          :card-target="`/app/buyer/job-card/${props.jobId}`"
          :current-stage="detailCurrentStage"
          :overdue="detail.job.next_step.overdue_level !== 'none'"
          @updated="load()"
        />

      <DesignJobCommandCenter v-if="commandJob" :job="commandJob" role="client">
          <template #actions>
            <button
              v-if="canConfirm"
              type="button"
              class="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-brand px-4 py-2.5 font-mono text-[10px] font-semibold tracking-[0.12em] text-white uppercase transition-colors hover:bg-brand-deep disabled:cursor-not-allowed disabled:opacity-50"
              data-test="confirm-delivery"
              :disabled="confirming"
              @click="confirmDelivery"
            >
              <Loader2 v-if="confirming" :size="13" class="animate-spin" aria-hidden="true" />
              <PackageCheck v-else :size="13" aria-hidden="true" />
              Confirm delivery
            </button>
            <button
              type="button"
              class="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-line-strong bg-card px-4 py-2.5 font-mono text-[10px] font-semibold tracking-[0.12em] text-brand uppercase transition-colors hover:border-brand disabled:cursor-not-allowed disabled:opacity-50"
              :disabled="loading || confirming"
              @click="load"
            >
              <RefreshCw :size="13" :class="{ 'animate-spin': loading }" aria-hidden="true" />
              Refresh timeline
            </button>
          </template>
        </DesignJobCommandCenter>

        <DesignAlert v-if="confirmError" tone="error" title="We couldn't confirm delivery">
          {{ confirmError }}
        </DesignAlert>
        <DesignAlert v-else-if="confirmNote" tone="success" title="Delivery confirmed">
          {{ confirmNote }}
        </DesignAlert>

        <section
          class="rounded-2xl border p-6 shadow-card sm:p-7"
          :class="artworkRequested || artworkNeedsBuyer ? 'border-brand/60 bg-mint/30' : 'border-line bg-card'"
          data-test="buyer-artwork-step"
        >
          <div class="flex flex-wrap items-start justify-between gap-4">
            <div class="max-w-[66ch]">
              <DesignSectionLabel index="AW" tone="brand">Artwork</DesignSectionLabel>
              <p class="mt-2 text-base font-bold text-ink" data-test="buyer-artwork-title">{{ artworkTitle }}</p>
              <p class="mt-1 text-[12.5px] leading-relaxed text-ink-2">{{ artworkHint }}</p>
            </div>
            <span class="rounded-full bg-paper-2 px-3 py-1 font-mono text-[9.5px] font-semibold tracking-[0.1em] text-ink-3 uppercase">
              {{ detail.job.artwork_status_label || (artworkDone ? 'Artwork uploaded' : 'Artwork needed') }}
            </span>
          </div>

          <div v-if="artworkRequested" class="mt-5" data-test="buyer-artwork-approval">
            <p v-if="artworkConfirmation?.note" class="rounded-xl border border-line bg-paper-2 px-4 py-3 text-[12.5px] leading-relaxed text-ink-2">
              {{ artworkConfirmation.note }}
            </p>
            <div class="mt-4 flex flex-wrap items-center gap-3">
              <button
                type="button"
                class="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-brand px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-brand-deep disabled:cursor-not-allowed disabled:opacity-50"
                data-test="buyer-artwork-approve"
                :disabled="artworkBusy"
                @click="respondArtwork(true)"
              >
                <Loader2 v-if="artworkBusy" :size="16" class="animate-spin" aria-hidden="true" />
                <Check v-else :size="16" aria-hidden="true" />
                Approve artwork
              </button>
              <button
                type="button"
                class="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-line-strong bg-card px-6 py-3 text-sm font-semibold text-ink transition-colors hover:border-brand hover:text-brand disabled:cursor-not-allowed disabled:opacity-50"
                data-test="buyer-artwork-changes"
                :disabled="artworkBusy"
                @click="respondArtwork(false)"
              >
                <PencilRuler :size="16" aria-hidden="true" /> Request changes
              </button>
            </div>
          </div>

          <div v-else-if="artworkNeedsBuyer" class="mt-5" data-test="buyer-artwork-upload">
            <input
              ref="artworkInput"
              type="file"
              class="hidden"
              accept=".pdf,.jpg,.jpeg,.png,.ai,.eps"
              data-test="buyer-artwork-input"
              @change="onArtworkChosen"
            >
            <div class="flex flex-col gap-3">
              <button
                type="button"
                class="inline-flex min-h-16 w-full items-center justify-center gap-2 rounded-xl bg-brand px-6 py-4 text-[15px] font-bold text-white shadow-brand transition-colors hover:bg-brand-deep"
                data-test="buyer-artwork-pick"
                :disabled="artworkBusy"
                @click="chooseArtwork"
              >
                <Upload :size="18" aria-hidden="true" /> Choose artwork file
              </button>
              <button
                v-if="artworkFile"
                type="button"
                class="inline-flex min-h-14 w-full items-center justify-center gap-2 truncate rounded-xl bg-brand px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-brand-deep disabled:cursor-not-allowed disabled:opacity-50"
                data-test="buyer-artwork-upload-button"
                :disabled="artworkBusy"
                @click="uploadArtwork"
              >
                <Loader2 v-if="artworkBusy" :size="16" class="animate-spin" aria-hidden="true" />
                <Upload v-else :size="16" aria-hidden="true" />
                Upload {{ artworkFile.name }}
              </button>
              <button
                type="button"
                class="inline-flex min-h-14 w-full items-center justify-center gap-2 rounded-xl border border-line-strong bg-card px-6 py-3 text-sm font-semibold text-ink transition-colors hover:border-brand hover:text-brand disabled:cursor-not-allowed disabled:opacity-50"
                data-test="buyer-artwork-claim"
                :disabled="artworkBusy"
                @click="claimArtwork"
              >
                <Handshake :size="16" aria-hidden="true" /> My manager already has it
              </button>
            </div>
            <p class="mt-2 text-[11.5px] text-ink-3">PDF, JPG, PNG, AI or EPS up to 50MB.</p>
          </div>

          <p v-else-if="artworkClaimed && !artworkDone" class="mt-4 text-[12.5px] leading-relaxed text-ink-2">
            You told us your manager holds the artwork. This job stays paused until they confirm it.
          </p>

          <p v-else class="mt-4 inline-flex items-center gap-1.5 text-[12.5px] font-semibold text-brand-deep">
            <CheckCircle2 :size="15" aria-hidden="true" />
            Artwork received{{ artworkApproved ? ' and approved' : '' }}.
          </p>

          <p v-if="artworkError" class="mt-3 text-[12px] font-semibold text-red" data-test="buyer-artwork-error">{{ artworkError }}</p>
          <p v-else-if="artworkNotice" class="mt-3 text-[12px] font-semibold text-brand-deep" data-test="buyer-artwork-notice">{{ artworkNotice }}</p>
        </section>

        <section class="rounded-2xl border border-line bg-card p-6 shadow-card sm:p-7">
          <div class="flex flex-wrap items-end justify-between gap-3">
            <div>
              <DesignSectionLabel index="LT" tone="brand">Full stage log</DesignSectionLabel>
              <p class="mt-1 text-[12.5px] text-ink-2">
                Every tracked milestone from acceptance to delivery, with its own clock.
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
import { ArrowLeft, ArrowRight, ArrowUpRight, Check, CheckCircle2, Handshake, Loader2, PackageCheck, PencilRuler, RefreshCw, Upload } from 'lucide-vue-next'
import DesignAlert from '~/components/design/ui/Alert.vue'
import DesignLoading from '~/components/design/ui/Loading.vue'
import DesignSectionLabel from '~/components/design/ui/SectionLabel.vue'
import DesignBuyerSurface from '~/components/design/buyer/BuyerSurface.vue'
import DesignJobCommandCenter from '~/components/design/tracker/JobCommandCenter.vue'
import type { DesignJobCommandView } from '~/components/design/tracker/JobCommandCenter.vue'
import FloatingNextStepCard from '~/components/design/tracker/FloatingNextStepCard.vue'
import { toNextActionItem } from '~/utils/design/next-action'
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
const confirming = ref(false)
const confirmError = ref('')
const confirmNote = ref('')

const canConfirm = computed(() => Boolean(detail.value?.job.can_confirm_completion))
const detailNextItem = computed(() => (detail.value?.job ? toNextActionItem(detail.value.job) : null))
const detailCurrentStage = computed(() => String(detail.value?.job.current_stage_key || detail.value?.job.current_stage || ''))

/* ── artwork: the buyer's own post-payment workflow step ─────────────────── */
const artworkInput = ref<HTMLInputElement | null>(null)
const artworkFile = ref<File | null>(null)
const artworkBusy = ref(false)
const artworkError = ref('')
const artworkNotice = ref('')

const artworkConfirmation = computed(() => detail.value?.job.artwork_confirmation ?? null)
const artworkWorkflow = computed(() => detail.value?.job.artwork_workflow ?? null)
const artworkRequested = computed(() => artworkConfirmation.value?.state === 'requested')
const artworkApproved = computed(() => artworkConfirmation.value?.state === 'approved')
const artworkDone = computed(() => Boolean(detail.value?.job.artwork_uploaded) || artworkWorkflow.value?.satisfied === true)
const artworkClaimed = computed(() => artworkWorkflow.value?.claim_state === 'claimed')
const artworkNeedsBuyer = computed(() => !artworkDone.value && !artworkClaimed.value)

const artworkTitle = computed(() => {
  if (artworkRequested.value) return 'Your sign-off is needed before production'
  if (artworkNeedsBuyer.value) return 'Add your artwork so production can start'
  if (artworkClaimed.value && !artworkDone.value) return 'Waiting for your manager to confirm the artwork'
  return 'Artwork received'
})

const artworkHint = computed(() => {
  if (artworkRequested.value) {
    return 'Your manager has prepared the artwork. Approve it to release the job, or request changes with a note.'
  }
  if (artworkNeedsBuyer.value) {
    return 'Upload a print-ready file, or tell Printy your manager or printer already holds it.'
  }
  if (artworkClaimed.value && !artworkDone.value) {
    return 'You told us the artwork is already with your manager. The job stays paused until they confirm they have it.'
  }
  return 'This file is attached to your job. Your manager checks it before the press run.'
})

function chooseArtwork() {
  artworkError.value = ''
  artworkNotice.value = ''
  artworkInput.value?.click()
}

function onArtworkChosen(event: Event) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0] ?? null
  artworkError.value = ''
  artworkNotice.value = ''
  if (!file) {
    artworkFile.value = null
    return
  }
  const extension = file.name.split('.').pop()?.toLowerCase() ?? ''
  if (!['pdf', 'jpg', 'jpeg', 'png', 'ai', 'eps'].includes(extension)) {
    artworkError.value = 'Use a PDF, JPG, PNG, AI or EPS file.'
    artworkFile.value = null
    input.value = ''
    return
  }
  if (file.size > 50 * 1024 * 1024) {
    artworkError.value = 'Artwork cannot exceed 50MB.'
    artworkFile.value = null
    input.value = ''
    return
  }
  artworkFile.value = file
}

async function uploadArtwork() {
  if (!artworkFile.value || artworkBusy.value) return
  artworkBusy.value = true
  artworkError.value = ''
  artworkNotice.value = ''
  try {
    const form = new FormData()
    form.append('file', artworkFile.value)
    form.append('note', 'Artwork uploaded from the buyer job timeline.')
    await api(API.managedJobs.artwork(props.jobId), { method: 'POST', body: form })
    artworkFile.value = null
    if (artworkInput.value) artworkInput.value.value = ''
    await load()
    artworkNotice.value = 'Artwork received. Your manager can see it now.'
  } catch (caught) {
    artworkError.value = getApiErrorMessage(caught) || "We couldn't upload that artwork."
  } finally {
    artworkBusy.value = false
  }
}

async function claimArtwork() {
  if (artworkBusy.value) return
  artworkBusy.value = true
  artworkError.value = ''
  artworkNotice.value = ''
  try {
    await api(API.managedJobs.artworkWorkflow(props.jobId), { method: 'POST', body: { action: 'claim' } })
    await load()
    artworkNotice.value = 'Noted. Your manager will confirm they hold the artwork.'
  } catch (caught) {
    artworkError.value = getApiErrorMessage(caught) || "We couldn't save that."
  } finally {
    artworkBusy.value = false
  }
}

async function respondArtwork(approved: boolean) {
  if (artworkBusy.value) return
  artworkBusy.value = true
  artworkError.value = ''
  artworkNotice.value = ''
  try {
    await api(API.managedJobs.artworkConfirmationRespond(props.jobId), {
      method: 'POST',
      body: { action: approved ? 'approve' : 'reject' },
    })
    await load()
    artworkNotice.value = approved
      ? 'Artwork approved. Your manager can move this job into production.'
      : 'Change request sent. Your manager will update the artwork.'
  } catch (caught) {
    artworkError.value = getApiErrorMessage(caught) || "We couldn't record your artwork decision."
  } finally {
    artworkBusy.value = false
  }
}

async function confirmDelivery() {
  const job = detail.value?.job
  if (!job || confirming.value) return
  confirming.value = true
  confirmError.value = ''
  confirmNote.value = ''
  try {
    await api(API.managedJobs.confirmCompletion(job.id), { method: 'POST', body: {} })
    confirmNote.value = 'Delivery confirmed. Your print partner can now release the payout.'
    await load()
  } catch (caught) {
    confirmError.value = getApiErrorMessage(caught) || "We couldn't confirm delivery. Please try again."
  } finally {
    confirming.value = false
  }
}

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
