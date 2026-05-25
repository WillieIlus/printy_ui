<template>
  <RoleDashboardFrame
    title="Client Detail"
    badge="Client"
    :name="displayName"
    :initials="initials"
    subtitle="Final price, payment state, safe tracking, and reorder handoff"
    breadcrumb-root="Dashboard"
    :nav-items="navItems"
    support-title="Client detail"
    support-copy="Your payment stays inside Printy and job progress is tracked here until production is complete."
    support-action="Back"
    :support-to="`/dashboard/client/${section}`"
    @logout="auth.logout()"
  >
    <BaseAlert v-if="pageError" variant="error" title="Client detail could not load." :message="pageError" />
    <BaseAlert
      v-else-if="actionNotice.message"
      class="mb-6"
      :variant="actionNotice.variant"
      :title="actionNotice.title"
      :message="actionNotice.message"
    />

    <div v-if="!pageError" class="space-y-6">
      <DashboardSection :title="heroTitle" :subtitle="heroSubtitle">
        <div class="grid gap-4 md:grid-cols-3">
          <div class="rounded-2xl border border-[#e4e7ec] bg-white p-4">
            <p class="text-xs font-semibold uppercase tracking-[0.18em] text-[#98a2b3]">Status</p>
            <p class="mt-2 text-lg font-semibold text-[#101828]">{{ statusLabel }}</p>
          </div>
          <div class="rounded-2xl border border-[#e4e7ec] bg-white p-4">
            <p class="text-xs font-semibold uppercase tracking-[0.18em] text-[#98a2b3]">Final client price</p>
            <p class="mt-2 text-lg font-semibold text-[#101828]">{{ finalPriceLabel }}</p>
          </div>
          <div class="rounded-2xl border border-[#e4e7ec] bg-white p-4">
            <p class="text-xs font-semibold uppercase tracking-[0.18em] text-[#98a2b3]">Payment</p>
            <p class="mt-2 text-lg font-semibold text-[#101828]">{{ paymentStatusLabel }}</p>
          </div>
        </div>
      </DashboardSection>

      <DashboardSection v-if="section === 'quotes'" title="Your print manager" subtitle="A real person is responsible for moving this request forward inside Printy.">
        <div class="rounded-2xl border border-[#e4e7ec] bg-white p-5">
          <p class="text-lg font-semibold text-[#101828]">{{ assignedManagerName }}</p>
          <p class="mt-1 text-sm text-[#667085]">Handling your job end to end</p>
          <div class="mt-4 grid gap-3 md:grid-cols-2">
            <div class="rounded-2xl border border-[#e4e7ec] bg-[#f9fafb] p-4">
              <p class="text-xs font-semibold uppercase tracking-[0.18em] text-[#98a2b3]">Status</p>
              <p class="mt-2 text-sm font-semibold text-[#101828]">{{ assignedManagerStatus }}</p>
            </div>
            <div class="rounded-2xl border border-[#e4e7ec] bg-[#f9fafb] p-4">
              <p class="text-xs font-semibold uppercase tracking-[0.18em] text-[#98a2b3]">Expected by</p>
              <p class="mt-2 text-sm font-semibold text-[#101828]">{{ assignedManagerExpectedBy }}</p>
            </div>
          </div>
        </div>
      </DashboardSection>

      <DashboardSection v-if="section === 'quotes'" title="Your Specs" subtitle="What you asked Printy to price.">
        <div class="grid gap-3 md:grid-cols-2">
          <div v-for="row in quoteSpecRows" :key="row.label" class="rounded-2xl border border-[#e4e7ec] bg-white p-4">
            <p class="text-xs font-semibold uppercase tracking-[0.18em] text-[#98a2b3]">{{ row.label }}</p>
            <p class="mt-2 text-sm font-semibold text-[#101828]">{{ row.value }}</p>
          </div>
        </div>
      </DashboardSection>

      <DashboardSection v-if="section === 'quotes'" title="Quote Responses" subtitle="Client-safe offers only. Base price and broker margin stay hidden.">
        <DashboardEmptyState
          v-if="!responses.length"
          title="No quote response yet"
          description="Shops have not replied yet. Check back here for the first client-facing price."
          action-label="Back to quotes"
          action-to="/dashboard/client/quotes"
        />

        <div v-else class="space-y-4">
          <div class="rounded-2xl border border-[#bfd4ff] bg-[#eff6ff] p-4 text-sm text-[#175cd3]">
            Accepting a quote confirms the final client price only. Printy keeps production-side pricing private, coordinates the job, and keeps payment and proof updates on this route.
          </div>
          <article v-for="response in responses" :key="response.id" class="rounded-2xl border border-[#e4e7ec] bg-white p-5">
            <div class="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p class="text-xs font-semibold uppercase tracking-[0.18em] text-[#98a2b3]">{{ response.shop_name || 'Partner quote' }}</p>
                <h3 class="mt-2 text-lg font-semibold text-[#101828]">{{ formatKes(response.total) }}</h3>
                <p class="mt-1 text-sm text-[#667085]">{{ response.turnaround_label || response.human_ready_text || 'Turnaround to be confirmed' }}</p>
                <p v-if="quoteExpiryCopy(response)" class="mt-2 text-sm" :class="response.is_expired ? 'text-[#b42318]' : 'text-[#175cd3]'">
                  {{ quoteExpiryCopy(response) }}
                </p>
              </div>
              <div class="text-right">
                <span class="inline-flex rounded-full border border-[#d0d5dd] bg-[#f9fafb] px-3 py-1 text-xs font-semibold text-[#344054]">
                  {{ response.status_label || startCase(response.status || 'pending') }}
                </span>
              </div>
            </div>

            <p v-if="response.note" class="mt-4 text-sm text-[#667085]">{{ response.note }}</p>

            <div v-if="canActOnResponse(response)" class="mt-4 flex flex-wrap gap-3">
              <BaseButton variant="primary" size="sm" :loading="actionLoading === `accept-${response.id}`" @click="acceptQuote(response.id)">
                Accept quote
              </BaseButton>
              <BaseButton variant="secondary" size="sm" @click="toggleReply(response.id)">
                {{ replyingToResponseId === response.id ? 'Hide reply' : 'Request changes' }}
              </BaseButton>
              <BaseButton variant="danger" size="sm" @click="toggleReject(response.id)">
                {{ rejectingResponseId === response.id ? 'Hide reject' : 'Reject quote' }}
              </BaseButton>
            </div>

            <div v-if="replyingToResponseId === response.id" class="mt-4 rounded-2xl border border-[#e4e7ec] bg-[#f9fafb] p-4">
              <label class="block text-sm font-semibold text-[#101828]">Message to Printy</label>
              <textarea v-model="replyBody" rows="3" class="mt-2 w-full rounded-xl border border-[#d0d5dd] bg-white px-3 py-2 text-sm text-[#101828] outline-none focus:border-[#e13515]" placeholder="Describe what should change before you accept this quote." />
              <div class="mt-3 flex flex-wrap gap-3">
                <BaseButton variant="secondary" size="sm" :loading="actionLoading === `reply-${response.id}`" @click="sendReply(response.id)">
                  Send message
                </BaseButton>
              </div>
            </div>

            <div v-if="rejectingResponseId === response.id" class="mt-4 rounded-2xl border border-[#fde8e2] bg-[#fff8f7] p-4">
              <label class="block text-sm font-semibold text-[#101828]">Reason for rejection</label>
              <select v-model="rejectReason" class="mt-2 w-full rounded-xl border border-[#fda497] bg-white px-3 py-2 text-sm text-[#101828] outline-none focus:border-[#e13515]">
                <option value="price_too_high">Price too high</option>
                <option value="needs_changes">Needs changes</option>
                <option value="timeline_not_suitable">Timeline not suitable</option>
                <option value="other">Other</option>
              </select>
              <textarea v-model="rejectMessage" rows="3" class="mt-3 w-full rounded-xl border border-[#fda497] bg-white px-3 py-2 text-sm text-[#101828] outline-none focus:border-[#e13515]" placeholder="Optional note for the rejection." />
              <div class="mt-3 flex flex-wrap gap-3">
                <BaseButton variant="danger" size="sm" :loading="actionLoading === `reject-${response.id}`" @click="rejectQuote(response.id)">
                  Confirm rejection
                </BaseButton>
              </div>
            </div>
          </article>
        </div>
      </DashboardSection>

      <DashboardSection v-else title="Job Detail" subtitle="Client-safe status, payment, and proof visibility.">
        <div class="grid gap-3 md:grid-cols-2">
          <div v-for="row in jobDetailRows" :key="row.label" class="rounded-2xl border border-[#e4e7ec] bg-white p-4">
            <p class="text-xs font-semibold uppercase tracking-[0.18em] text-[#98a2b3]">{{ row.label }}</p>
            <p class="mt-2 text-sm font-semibold text-[#101828]">{{ row.value }}</p>
          </div>
        </div>
      </DashboardSection>

      <DashboardSection title="Timeline" subtitle="Production-safe milestones only.">
        <div class="grid gap-3 md:grid-cols-2">
          <div v-for="step in timelineSteps" :key="step.label" class="rounded-2xl border p-4" :class="step.done ? 'border-[#abefc6] bg-[#f6fef9]' : 'border-[#e4e7ec] bg-white'">
            <p class="text-sm font-semibold text-[#101828]">{{ step.label }}</p>
            <p class="mt-1 text-sm text-[#667085]">{{ step.copy }}</p>
          </div>
        </div>
      </DashboardSection>

      <DashboardSection v-if="showPaymentPanel" title="Pay With M-Pesa" subtitle="Backend-managed amount only.">
        <div class="rounded-2xl border border-[#e4e7ec] bg-white p-5">
          <p class="text-sm text-[#667085]">Pay securely with M-Pesa Paybill. Printy tracks the payment, keeps the job under managed workflow, and records the payout state before release.</p>
          <div class="mt-4 rounded-2xl border border-[#abefc6] bg-[#f6fef9] p-4 text-sm text-[#067647]">
            Buyer protection: your payment is attached to this job record, proof approvals stay visible here, and Printy can intervene if production or delivery needs review.
          </div>
          <div class="mt-4 grid gap-4 md:grid-cols-[1fr_auto] md:items-end">
            <div>
              <label class="block text-sm font-semibold text-[#101828]">M-Pesa phone number</label>
              <input v-model="mpesaPhone" type="tel" class="mt-2 w-full rounded-xl border border-[#d0d5dd] px-3 py-2 text-sm text-[#101828] outline-none focus:border-[#e13515]" placeholder="2547XXXXXXXX" />
            </div>
            <div class="rounded-2xl border border-[#e4e7ec] bg-[#f9fafb] px-4 py-3 text-sm font-semibold text-[#101828]">
              Amount: {{ finalPriceLabel }}
            </div>
          </div>
          <div class="mt-4 flex flex-wrap items-center gap-3">
            <BaseButton variant="primary" size="sm" :loading="actionLoading === 'pay'" @click="payWithMpesa">
              Pay with M-Pesa
            </BaseButton>
            <p class="text-sm text-[#667085]">{{ paymentHelperText }}</p>
          </div>
        </div>
      </DashboardSection>

      <DashboardSection title="Track & Reorder" subtitle="Public tracking when a token exists, otherwise safe dashboard fallback.">
        <div class="grid gap-4 md:grid-cols-2">
          <div class="rounded-2xl border border-[#e4e7ec] bg-white p-5">
            <p class="text-sm font-semibold text-[#101828]">Track this job</p>
            <p class="mt-2 text-sm text-[#667085]">{{ trackingCopy }}</p>
            <div class="mt-4 flex flex-wrap gap-3">
              <BaseButton v-if="canTrackJob" :to="trackJobHref" variant="primary" size="sm">Track job</BaseButton>
              <BaseButton v-else variant="secondary" size="sm" disabled>Tracking unavailable</BaseButton>
            </div>
          </div>
          <div class="rounded-2xl border border-[#e4e7ec] bg-white p-5">
            <p class="text-sm font-semibold text-[#101828]">Reorder</p>
            <p class="mt-2 text-sm text-[#667085]">{{ reorderCopy }}</p>
            <div class="mt-4 flex flex-wrap gap-3">
              <BaseButton v-if="canReorderJob" variant="secondary" size="sm" :loading="actionLoading === 'reorder'" @click="startReorder">Copy specs to calculator</BaseButton>
              <BaseButton v-else variant="secondary" size="sm" disabled>Reorder unavailable</BaseButton>
            </div>
          </div>
        </div>
      </DashboardSection>

      <DashboardSection title="Artwork & Proofs" subtitle="Client-visible files and proof state only.">
        <div v-if="artworkRequired" class="mb-4 rounded-2xl border border-[#fecd89] bg-[#fffaeb] p-5">
          <p class="text-sm font-semibold text-[#b54708]">Upload your artwork to start production</p>
          <p class="mt-1 text-sm text-[#b54708]">
            {{ artworkBannerCopy }}
          </p>
          <div class="mt-4 grid gap-3 md:grid-cols-[1fr_auto]">
            <div>
              <input class="block w-full text-sm text-slate-700" type="file" accept=".jpg,.jpeg,.png,.pdf,.ai,.eps" @change="onArtworkSelected" />
              <p class="mt-2 text-xs text-[#b54708]">Accepted: JPG, PNG, PDF, AI, EPS. Max 50MB.</p>
              <textarea v-model="artworkNote" rows="2" class="mt-3 w-full rounded-xl border border-[#fecd89] bg-white px-3 py-2 text-sm text-[#101828] outline-none focus:border-[#f59e0b]" placeholder="Optional artwork note" />
            </div>
            <div class="flex items-end">
              <BaseButton variant="primary" size="sm" :loading="actionLoading === 'upload-artwork'" :disabled="!artworkFile" @click="submitArtwork">
                Upload artwork
              </BaseButton>
            </div>
          </div>
        </div>

        <div class="grid gap-4 md:grid-cols-2">
          <div class="rounded-2xl border border-[#e4e7ec] bg-white p-5">
            <p class="text-sm font-semibold text-[#101828]">Artwork status</p>
            <p class="mt-2 text-sm text-[#667085]">{{ artworkSummary }}</p>
          </div>
          <div class="rounded-2xl border border-[#e4e7ec] bg-white p-5">
            <p class="text-sm font-semibold text-[#101828]">Proof status</p>
            <p class="mt-2 text-sm text-[#667085]">{{ proofSummary }}</p>
          </div>
        </div>

        <div v-if="proofFiles.length" class="mt-4 space-y-3">
          <article v-for="file in proofFiles" :key="file.id" class="rounded-2xl border border-[#e4e7ec] bg-white p-5">
            <div class="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p class="text-sm font-semibold text-[#101828]">{{ file.original_filename || 'Proof file' }}</p>
                <p class="mt-1 text-sm text-[#667085]">{{ startCase(file.status || 'pending') }}</p>
              </div>
              <div class="flex flex-wrap gap-3">
                <BaseButton variant="success" size="sm" :loading="actionLoading === `approve-${file.id}`" @click="approveProof(file.id)">Approve proof</BaseButton>
                <BaseButton variant="secondary" size="sm" @click="toggleProofRevision(file.id)">
                  {{ revisingProofId === file.id ? 'Hide note' : 'Request revision' }}
                </BaseButton>
              </div>
            </div>
            <div v-if="revisingProofId === file.id" class="mt-4 rounded-2xl border border-[#e4e7ec] bg-[#f9fafb] p-4">
              <textarea v-model="proofRevisionNote" rows="3" class="w-full rounded-xl border border-[#d0d5dd] bg-white px-3 py-2 text-sm text-[#101828] outline-none focus:border-[#e13515]" placeholder="Describe the proof change you need." />
              <div class="mt-3">
                <BaseButton variant="secondary" size="sm" :loading="actionLoading === `revision-${file.id}`" @click="requestProofChanges(file.id)">
                  Send revision request
                </BaseButton>
              </div>
            </div>
          </article>
        </div>
      </DashboardSection>
    </div>
  </RoleDashboardFrame>
</template>

<script setup lang="ts">
import BaseAlert from '~/components/base/BaseAlert.vue'
import BaseButton from '~/components/base/BaseButton.vue'
import DashboardEmptyState from '~/components/dashboard/DashboardEmptyState.vue'
import DashboardSection from '~/components/dashboard/DashboardSection.vue'
import RoleDashboardFrame from '~/components/dashboard/RoleDashboardFrame.vue'
import { usePendingClientQuote } from '~/composables/usePendingClientQuote'
import { useDashboardApi } from '~/services/dashboard'
import {
  fetchManagedJobFiles,
  fetchManagedJobPayments,
  initiateManagedJobPayment,
  reorderManagedJob,
  uploadManagedJobArtwork,
  updateJobFileAction,
} from '~/services/jobs'
import {
  acceptClientQuoteResponse,
  fetchCalculatorDraftDetail,
  fetchClientQuoteRequestDetail,
  rejectClientQuoteResponse,
  replyToQuoteResponse,
} from '~/services/quotes'
import { getApiErrorMessage } from '~/shared/api'

definePageMeta({ layout: false, middleware: 'auth' })

const auth = useAuthStore()
const pendingClientQuote = usePendingClientQuote()
const { fetchDashboardDetail } = useDashboardApi()
if (!auth.canAccessClientDashboard) {
  await navigateTo(auth.homeRoute)
}

const route = useRoute()
const section = computed(() => String(route.params.section || 'quotes'))
const id = computed(() => String(route.params.id || ''))
const displayName = computed(() => auth.user?.name || auth.user?.email || 'Client')
const initials = computed(() => displayName.value.split(' ').map(part => part[0]).join('').slice(0, 2).toUpperCase() || 'CL')
const navItems = computed(() => [
  { label: 'Quotes', to: '/dashboard/client/quotes', active: section.value === 'quotes' },
  { label: 'Jobs', to: '/dashboard/client/jobs', active: section.value === 'jobs' },
  { label: 'Payments', to: '/dashboard/client/payments' },
])

const pageError = ref('')
const actionLoading = ref('')
const quoteDetail = ref<Record<string, any> | null>(null)
const jobDetail = ref<Record<string, any> | null>(null)
const jobPayments = ref<Array<Record<string, any>>>([])
const jobFiles = ref<Array<Record<string, any>>>([])
const mpesaPhone = ref(String((auth.user as Record<string, any> | null)?.phone || ''))
const replyBody = ref('')
const rejectReason = ref('price_too_high')
const rejectMessage = ref('')
const replyingToResponseId = ref<number | string | null>(null)
const rejectingResponseId = ref<number | string | null>(null)
const revisingProofId = ref<number | string | null>(null)
const proofRevisionNote = ref('')
const artworkFile = ref<File | null>(null)
const artworkNote = ref('')
const actionNotice = reactive({
  variant: 'success' as 'success' | 'error' | 'default',
  title: '',
  message: '',
})

async function loadDetail() {
  pageError.value = ''
  actionNotice.message = ''
  quoteDetail.value = null
  jobDetail.value = null
  jobPayments.value = []
  jobFiles.value = []

  try {
    if (section.value === 'quotes') {
      quoteDetail.value = await fetchClientQuoteRequestDetail(id.value)
      if (quoteDetail.value?.managed_job?.id) {
        const payload = await fetchDashboardDetail('client', 'jobs', quoteDetail.value.managed_job.id)
        jobDetail.value = payload?.job || null
        jobPayments.value = await fetchManagedJobPayments(quoteDetail.value.managed_job.id)
        jobFiles.value = await fetchManagedJobFiles(quoteDetail.value.managed_job.id)
      }
    } else {
      const payload = await fetchDashboardDetail('client', 'jobs', id.value)
      jobDetail.value = payload?.job || null
      jobPayments.value = await fetchManagedJobPayments(id.value)
      jobFiles.value = await fetchManagedJobFiles(id.value)
    }
  } catch (error: unknown) {
    pageError.value = getApiErrorMessage(error, 'Client detail is unavailable right now.')
  }
}

await loadDetail()
watch([section, id], loadDetail)

const requestSnapshot = computed<Record<string, any>>(() => {
  const snapshot = quoteDetail.value?.request_snapshot
  if (snapshot && typeof snapshot === 'object' && snapshot.request_snapshot && typeof snapshot.request_snapshot === 'object') {
    return snapshot.request_snapshot
  }
  return snapshot && typeof snapshot === 'object' ? snapshot : {}
})
const requestInputs = computed<Record<string, any>>(() => {
  const inputs = requestSnapshot.value.calculator_inputs
  return inputs && typeof inputs === 'object' ? inputs : {}
})
const responses = computed(() => Array.isArray(quoteDetail.value?.responses) ? quoteDetail.value.responses : [])
const primaryResponse = computed(() => responses.value[0] || null)
const managedJobId = computed(() => quoteDetail.value?.managed_job?.id || jobDetail.value?.id || null)
const latestPayment = computed(() => jobPayments.value[0] || null)
const proofFiles = computed(() => jobFiles.value.filter(file => String(file.file_type || '').toLowerCase() === 'proof'))
const artworkFiles = computed(() => jobFiles.value.filter(file => ['artwork', 'customer_upload'].includes(String(file.file_type || '').toLowerCase())))
const paymentStatusRaw = computed(() => String(latestPayment.value?.payment_status || quoteDetail.value?.managed_job?.payment_status || jobDetail.value?.payment_status || 'pending'))
const isPaid = computed(() => ['confirmed', 'paid', 'completed', 'success', 'successful', 'release_ready'].includes(paymentStatusRaw.value.toLowerCase()))
const artworkRequired = computed(() => Boolean(jobDetail.value?.artwork_missing) || Boolean(jobDetail.value?.artwork_required) || (isPaid.value && artworkFiles.value.length === 0))
const showPaymentPanel = computed(() => Boolean(managedJobId.value) && !isPaid.value)
const heroTitle = computed(() => {
  return section.value === 'quotes'
    ? quoteTitleFromSnapshot(requestSnapshot.value, quoteDetail.value?.request_reference || `Quote ${id.value}`)
    : (jobDetail.value?.reference || `Job ${id.value}`)
})
const heroSubtitle = computed(() => {
  return section.value === 'quotes'
    ? (requestSnapshot.value.custom_brief || quoteDetail.value?.notes || 'Review your request, quote response, and next action.')
    : (jobDetail.value?.title || 'Review your managed job detail, payment, and proof state.')
})
const assignedManagerName = computed(() => {
  return quoteDetail.value?.assigned_manager?.display_name || 'Printy is assigning the best available Print Manager'
})
const assignedManagerStatus = computed(() => {
  if (primaryResponse.value) {
    return 'Quote received'
  }
  if (quoteDetail.value?.assigned_manager?.id) {
    return 'Waiting to respond'
  }
  return 'Assignment in progress'
})
const assignedManagerExpectedBy = computed(() => {
  return primaryResponse.value?.turnaround_label || 'Exact quote pending'
})
const statusLabel = computed(() => {
  return section.value === 'quotes'
    ? (primaryResponse.value?.status_label || quoteDetail.value?.status_label || 'Waiting for response')
    : startCase(jobDetail.value?.status || 'pending')
})
const finalClientAmount = computed(() => {
  return Number(
    primaryResponse.value?.total
    || quoteDetail.value?.managed_job?.client_total
    || jobDetail.value?.pricing?.client_total
    || 0
  )
})
const finalPriceLabel = computed(() => formatKes(finalClientAmount.value))
const paymentStatusLabel = computed(() => {
  if (actionLoading.value === 'pay') {
    return 'Initiating STK'
  }
  return startCase(paymentStatusRaw.value)
})
const paymentHelperText = computed(() => {
  const status = paymentStatusRaw.value.toLowerCase()
  if (actionLoading.value === 'pay') return 'Waiting for Safaricom confirmation.'
  if (['confirmed', 'paid', 'successful', 'success', 'completed', 'release_ready'].includes(status)) return 'Payment received and confirmed.'
  if (['failed', 'cancelled', 'timeout'].includes(status)) return 'Payment failed. You can retry the STK prompt.'
  if (['initiated', 'pending'].includes(status)) return 'Check your phone for the M-Pesa prompt.'
  return 'Payment status will update here after M-Pesa confirms the transaction.'
})

const quoteSpecRows = computed(() => [
  { label: 'Product', value: startCase(requestSnapshot.value.product_label || requestSnapshot.value.product_type || requestInputs.value.product_type || 'Print quote') },
  { label: 'Quantity', value: requestSnapshot.value.quantity || requestInputs.value.quantity ? `${Number(requestSnapshot.value.quantity || requestInputs.value.quantity).toLocaleString('en-KE')} pieces` : 'Not provided' },
  { label: 'Size', value: requestSnapshot.value.finished_size || requestSnapshot.value.size_label || requestInputs.value.finished_size || 'Not provided' },
  { label: 'Paper', value: requestSnapshot.value.paper_label || requestSnapshot.value.paper_stock || requestInputs.value.paper_stock || requestSnapshot.value.requested_gsm || requestInputs.value.requested_gsm ? `${requestSnapshot.value.paper_label || requestSnapshot.value.paper_stock || requestInputs.value.paper_stock || ''} ${(requestSnapshot.value.requested_gsm || requestInputs.value.requested_gsm) ? `(${requestSnapshot.value.requested_gsm || requestInputs.value.requested_gsm}gsm)` : ''}`.trim() : 'Not provided' },
  { label: 'Print sides', value: requestSnapshot.value.print_sides_label || startCase(requestSnapshot.value.print_sides || requestInputs.value.print_sides || 'Not provided') },
  { label: 'Colour mode', value: requestSnapshot.value.color_mode_label || startCase(requestSnapshot.value.color_mode || requestInputs.value.color_mode || 'Not provided') },
  { label: 'Finishing', value: requestSnapshot.value.lamination_label || startCase(requestSnapshot.value.lamination || requestInputs.value.lamination || 'None') },
  { label: 'Artwork', value: requestSnapshot.value.artwork_name || 'No artwork note saved yet' },
])

const jobDetailRows = computed(() => [
  { label: 'Job number', value: jobDetail.value?.reference || `Job ${id.value}` },
  { label: 'Status', value: startCase(jobDetail.value?.status || 'pending') },
  { label: 'Final price', value: finalPriceLabel.value },
  { label: 'Payment status', value: paymentStatusLabel.value },
  { label: 'Proof status', value: proofFiles.value.length ? 'Proof available' : 'No proof yet' },
  { label: 'Requested deadline', value: formatDateTime(jobDetail.value?.requested_deadline) },
])

const timelineSteps = computed(() => {
  const jobStatus = String(jobDetail.value?.status || quoteDetail.value?.managed_job?.status || '').toLowerCase()
  return [
    { label: 'Quote requested', copy: 'Your request has been saved in Printy.', done: Boolean(quoteDetail.value || jobDetail.value) },
    { label: 'Quote accepted', copy: primaryResponse.value ? 'A client-facing quote is available.' : 'Waiting for a client-facing quote.', done: Boolean(primaryResponse.value) },
    { label: 'Payment received', copy: paymentHelperText.value, done: isPaid.value },
    { label: 'Sent to production', copy: 'Production handoff stays visible only through safe status labels.', done: ['accepted', 'assigned', 'in_production', 'ready', 'completed'].includes(jobStatus) },
    { label: 'Proof uploaded', copy: proofFiles.value.length ? 'A proof file is available to review.' : 'No proof file is visible yet.', done: proofFiles.value.length > 0 },
    { label: 'Ready / completed', copy: ['ready', 'completed'].includes(jobStatus) ? 'The job is at the final stage.' : 'Still in progress.', done: ['ready', 'completed'].includes(jobStatus) },
  ]
})

const trackToken = computed(() => {
  return String(
    quoteDetail.value?.managed_job?.tracking_token
    || quoteDetail.value?.managed_job?.public_token
    || jobDetail.value?.tracking_token
    || jobDetail.value?.public_token
    || ''
  ).trim()
})
const trackJobHref = computed(() => {
  if (trackToken.value) {
    return `/track-job/${trackToken.value}`
  }
  if (managedJobId.value) {
    return `/dashboard/client/jobs/${managedJobId.value}`
  }
  return ''
})
const canTrackJob = computed(() => Boolean(trackToken.value || managedJobId.value))
const trackingCopy = computed(() => {
  if (trackToken.value) {
    return `Track your job: /track-job/${trackToken.value}`
  }
  if (managedJobId.value) {
    return 'No public token is exposed yet, so tracking falls back to the private client job page.'
  }
  return 'Tracking will appear after the job is created.'
})

const canReorderJob = computed(() => {
  return section.value === 'jobs' && Boolean(managedJobId.value) && String(jobDetail.value?.status || '').toLowerCase() === 'completed'
})
const reorderCopy = computed(() => {
  if (canReorderJob.value) {
    return 'We will copy your previous specs into a new draft. Review them before requesting a new quote.'
  }
  return 'Only completed jobs can be reordered.'
})

const artworkSummary = computed(() => {
  const artworkCount = artworkFiles.value.length
  if (jobDetail.value?.artwork_status_label) {
    return String(jobDetail.value.artwork_status_label)
  }
  if (artworkRequired.value && artworkCount === 0) {
    return 'Payment is confirmed. Artwork upload is required before production can begin.'
  }
  if (requestSnapshot.value.artwork_name) {
    return `Saved artwork note: ${requestSnapshot.value.artwork_name}.`
  }
  return artworkCount ? `${artworkCount} client-visible file(s) attached.` : 'No artwork file is visible on this route yet.'
})
const proofSummary = computed(() => proofFiles.value.length ? `${proofFiles.value.length} proof file(s) available.` : 'No proof file is available yet.')
const artworkBannerCopy = computed(() => {
  if (jobDetail.value?.artwork_reminder_sent) {
    return 'Payment is confirmed, and we have already asked you to upload artwork before production can begin.'
  }
  return 'Payment is confirmed, but production cannot begin until your artwork is attached.'
})

function setNotice(variant: 'success' | 'error' | 'default', title: string, message: string) {
  actionNotice.variant = variant
  actionNotice.title = title
  actionNotice.message = message
}

function canActOnResponse(response: Record<string, any>) {
  const status = String(response.status || '').toLowerCase()
  return !response.is_expired && !['accepted', 'rejected', 'expired'].includes(status) && !managedJobId.value
}

function quoteExpiryCopy(response: Record<string, any>) {
  const expiresAt = response?.expires_at ? new Date(String(response.expires_at)) : null
  if (!expiresAt || Number.isNaN(expiresAt.getTime())) {
    return ''
  }
  const remainingMs = expiresAt.getTime() - Date.now()
  if (response?.is_expired || remainingMs <= 0) {
    return 'Quote expired - request a new one'
  }
  const totalMinutes = Math.max(1, Math.floor(remainingMs / 60000))
  const days = Math.floor(totalMinutes / 1440)
  const hours = Math.floor((totalMinutes % 1440) / 60)
  const minutes = totalMinutes % 60
  if (days > 0) {
    return `Quote valid until ${formatDateTime(response.expires_at)} (${days}d ${hours}h left)`
  }
  return `This quote expires in ${hours}h ${minutes}m`
}

async function acceptQuote(responseId: number | string) {
  try {
    actionLoading.value = `accept-${responseId}`
    await acceptClientQuoteResponse(responseId)
    setNotice('success', 'Quote accepted', 'Your quote was accepted. If payment is available, you can now trigger the M-Pesa prompt below.')
    await loadDetail()
  } catch (error: unknown) {
    setNotice('error', 'Quote acceptance failed', getApiErrorMessage(error, 'Printy could not accept this quote.'))
  } finally {
    actionLoading.value = ''
  }
}

function toggleReply(responseId: number | string) {
  replyingToResponseId.value = replyingToResponseId.value === responseId ? null : responseId
  replyBody.value = ''
}

async function sendReply(responseId: number | string) {
  if (!replyBody.value.trim()) {
    setNotice('error', 'Message required', 'Enter a message before requesting changes.')
    return
  }
  try {
    actionLoading.value = `reply-${responseId}`
    await replyToQuoteResponse(responseId, 'client', replyBody.value.trim())
    replyingToResponseId.value = null
    replyBody.value = ''
    setNotice('success', 'Message sent', 'Your change request was sent and is visible on the quote thread.')
  } catch (error: unknown) {
    setNotice('error', 'Message failed', getApiErrorMessage(error, 'Printy could not send your message.'))
  } finally {
    actionLoading.value = ''
  }
}

function toggleReject(responseId: number | string) {
  rejectingResponseId.value = rejectingResponseId.value === responseId ? null : responseId
  rejectReason.value = 'price_too_high'
  rejectMessage.value = ''
}

async function rejectQuote(responseId: number | string) {
  try {
    actionLoading.value = `reject-${responseId}`
    await rejectClientQuoteResponse(responseId, rejectReason.value, rejectMessage.value.trim())
    rejectingResponseId.value = null
    rejectMessage.value = ''
    setNotice('success', 'Quote rejected', 'The quote was rejected and your reason was saved.')
    await loadDetail()
  } catch (error: unknown) {
    setNotice('error', 'Rejection failed', getApiErrorMessage(error, 'Printy could not reject this quote.'))
  } finally {
    actionLoading.value = ''
  }
}

async function payWithMpesa() {
  if (!managedJobId.value) {
    setNotice('error', 'Payment unavailable', 'This quote does not have a payable managed job yet.')
    return
  }
  if (!mpesaPhone.value.trim()) {
    setNotice('error', 'Phone number required', 'Enter the M-Pesa phone number for the STK prompt.')
    return
  }
  try {
    actionLoading.value = 'pay'
    await initiateManagedJobPayment(managedJobId.value, mpesaPhone.value.trim())
    setNotice('success', 'STK prompt sent', 'Check your phone for the M-Pesa prompt.')
    await loadDetail()
  } catch (error: unknown) {
    setNotice('error', 'Payment failed', getApiErrorMessage(error, 'Printy could not start the M-Pesa payment.'))
  } finally {
    actionLoading.value = ''
  }
}

function onArtworkSelected(event: Event) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0] || null
  if (!file) {
    artworkFile.value = null
    return
  }
  if (file.size > 50 * 1024 * 1024) {
    setNotice('error', 'Artwork too large', 'Artwork files must be 50MB or smaller.')
    input.value = ''
    artworkFile.value = null
    return
  }
  artworkFile.value = file
}

async function submitArtwork() {
  if (!managedJobId.value || !artworkFile.value) {
    setNotice('error', 'Artwork required', 'Choose an artwork file before uploading.')
    return
  }
  try {
    actionLoading.value = 'upload-artwork'
    await uploadManagedJobArtwork(managedJobId.value, artworkFile.value, artworkNote.value.trim())
    artworkFile.value = null
    artworkNote.value = ''
    setNotice('success', 'Artwork uploaded', 'Your artwork was attached and production can continue.')
    jobFiles.value = await fetchManagedJobFiles(managedJobId.value)
    const payload = await fetchDashboardDetail('client', 'jobs', managedJobId.value)
    jobDetail.value = payload?.job || null
  } catch (error: unknown) {
    setNotice('error', 'Artwork upload failed', getApiErrorMessage(error, 'Printy could not upload your artwork.'))
  } finally {
    actionLoading.value = ''
  }
}

async function approveProof(fileId: number | string) {
  try {
    actionLoading.value = `approve-${fileId}`
    await updateJobFileAction(fileId, 'approve')
    setNotice('success', 'Proof approved', 'Your proof approval was saved.')
    if (managedJobId.value) {
      jobFiles.value = await fetchManagedJobFiles(managedJobId.value)
    }
  } catch (error: unknown) {
    setNotice('error', 'Proof approval failed', getApiErrorMessage(error, 'Printy could not approve this proof.'))
  } finally {
    actionLoading.value = ''
  }
}

function toggleProofRevision(fileId: number | string) {
  revisingProofId.value = revisingProofId.value === fileId ? null : fileId
  proofRevisionNote.value = ''
}

async function requestProofChanges(fileId: number | string) {
  if (!proofRevisionNote.value.trim()) {
    setNotice('error', 'Revision note required', 'Describe the proof change you need before sending the request.')
    return
  }
  try {
    actionLoading.value = `revision-${fileId}`
    await updateJobFileAction(fileId, 'revision', proofRevisionNote.value.trim())
    revisingProofId.value = null
    proofRevisionNote.value = ''
    setNotice('success', 'Revision request sent', 'Your proof revision request was saved.')
    if (managedJobId.value) {
      jobFiles.value = await fetchManagedJobFiles(managedJobId.value)
    }
  } catch (error: unknown) {
    setNotice('error', 'Revision request failed', getApiErrorMessage(error, 'Printy could not request proof changes.'))
  } finally {
    actionLoading.value = ''
  }
}

async function startReorder() {
  if (!canReorderJob.value || !managedJobId.value) {
    setNotice('default', 'Reorder unavailable', 'Only completed jobs can be reordered.')
    return
  }
  try {
    actionLoading.value = 'reorder'
    const result = await reorderManagedJob(managedJobId.value)
    const draftId = Number(result.draft_id || 0) || null
    const draft = draftId ? await fetchCalculatorDraftDetail(draftId) : null
    const inputs = draft?.calculator_inputs_snapshot && typeof draft.calculator_inputs_snapshot === 'object'
      ? draft.calculator_inputs_snapshot as Record<string, any>
      : {}
    pendingClientQuote.save({
      draft_id: draftId,
      product_type: String(inputs.product_type || '').trim(),
      quantity: Math.max(1, Number(inputs.quantity || 0) || 1),
      finished_size: String(inputs.finished_size || '').trim(),
      paper_stock: String(inputs.paper_stock || '').trim(),
      print_sides: String(inputs.print_sides || 'SIMPLEX').trim() || 'SIMPLEX',
      color_mode: String(inputs.color_mode || 'COLOR').trim() || 'COLOR',
      requested_gsm: inputs.requested_gsm === undefined || inputs.requested_gsm === null
        ? null
        : Number(inputs.requested_gsm) || null,
      lamination: String(inputs.lamination || 'none').trim() || 'none',
      custom_brief: String(inputs.custom_brief || inputs.special_instructions || '').trim(),
      artwork_name: '',
      artwork_token: null,
      artwork_filename: null,
      artwork_expires_at: null,
      source: 'dashboard',
    })
    await navigateTo('/dashboard/client?pendingQuote=1&reorder=1')
  } catch (error: unknown) {
    setNotice('error', 'Reorder failed', getApiErrorMessage(error, 'Printy could not create a reorder draft.'))
  } finally {
    actionLoading.value = ''
  }
}

function formatKes(value: unknown, pendingLabel = true) {
  const amount = Number(value)
  if (!Number.isFinite(amount) || amount <= 0) {
    return pendingLabel ? 'Awaiting final total' : ''
  }
  return `KES ${amount.toLocaleString('en-KE', { maximumFractionDigits: 2 })}`
}

function formatDateTime(value: unknown) {
  if (!value) {
    return 'Not set'
  }
  const date = new Date(String(value))
  if (Number.isNaN(date.getTime())) {
    return 'Not set'
  }
  return new Intl.DateTimeFormat('en-KE', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(date)
}

function startCase(value: unknown) {
  return String(value || 'pending')
    .replace(/[_-]+/g, ' ')
    .replace(/\b\w/g, char => char.toUpperCase())
}

function quoteTitleFromSnapshot(snapshot: Record<string, any>, fallback: string) {
  const inputs = snapshot.calculator_inputs && typeof snapshot.calculator_inputs === 'object'
    ? snapshot.calculator_inputs as Record<string, any>
    : {}
  const product = snapshot.product_label || snapshot.product_type || inputs.product_type
  const quantity = snapshot.quantity || inputs.quantity
  if (!product) {
    return fallback
  }
  const quantityLabel = quantity ? ` x${Number(quantity).toLocaleString('en-KE')}` : ''
  return `${startCase(product)}${quantityLabel}`
}
</script>
