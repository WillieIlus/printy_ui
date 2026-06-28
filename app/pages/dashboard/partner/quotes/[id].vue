<script setup lang="ts">
import { callWithNuxt } from '#app'
import BaseAlert from '~/components/base/BaseAlert.vue'
import BaseButton from '~/components/base/BaseButton.vue'
import DashboardPageHeader from '~/components/dashboard/DashboardPageHeader.vue'
import DashboardSection from '~/components/dashboard/DashboardSection.vue'
import StatusBadge from '~/components/dashboard/StatusBadge.vue'
import RoleDashboardFrame from '~/components/dashboard/RoleDashboardFrame.vue'
import { fetchManagedJobFiles, updateManagerProofApproval } from '~/services/jobs'
import { dispatchPartnerJob, getPartnerQuoteDetail } from '~/services/partner'
import { getApiErrorMessage } from '~/shared/api'

interface RawCustomerPricing {
  customer_total?: number | string | null
  total?: number | string | null
  total_price?: number | string | null
  final_client_price?: number | string | null

  unit_price?: number | string | null
  price_per_unit?: number | string | null
  per_unit?: number | string | null

  platform_fee?: number | string | null
  platform_service_amount?: number | string | null
  printy_fee?: number | string | null

  broker_margin?: number | string | null
  broker_margin_amount?: number | string | null
  margin_fee?: number | string | null

  printer_payout?: number | string | null
  partner_payout?: number | string | null
  production_cost?: number | string | null
  production_base_price?: number | string | null
}

interface NormalizedCustomerPricing {
  customerTotal: number
  unitPrice: number
  platformFee: number
  brokerMargin: number
  printerPayout: number
}

definePageMeta({ layout: false, middleware: 'auth' })

const nuxtApp = useNuxtApp()
const auth = useAuthStore()
if (!auth.canAccessPartnerDashboard) {
  await callWithNuxt(nuxtApp, navigateTo, [auth.homeRoute])
}

const route = useRoute()
const section = computed(() => String(route.params.section || 'quotes'))
const id = computed(() => String(route.params.id || ''))
const displayName = computed(() => auth.user?.name || auth.user?.email || 'Partner')
const initials = computed(() => displayName.value.split(' ').map(part => part[0]).join('').slice(0, 2).toUpperCase() || 'PT')
const navItems = computed(() => [
  { label: 'Quotes', to: '/dashboard/partner/quotes', active: section.value === 'quotes' },
  { label: 'Jobs', to: '/dashboard/partner/jobs', active: section.value === 'jobs' },
])

const TIMELINE_STEPS = [
  { key: 'requested', label: 'Quote Requested' },
  { key: 'assigned', label: 'Quote Assigned to Partner' },
  { key: 'prepared', label: 'Partner Quote Prepared' },
  { key: 'sent', label: 'Quote Sent to Client' },
  { key: 'accepted', label: 'Client Accepted Quote' },
  { key: 'paid', label: 'Payment Received' },
  { key: 'dispatched', label: 'Job Dispatched to Production' },
  { key: 'proof_uploaded', label: 'Proof Uploaded' },
  { key: 'proof_approved', label: 'Proof Approved' },
  { key: 'completed', label: 'Job Completed' },
]

const pageError = ref('')
const dispatchLoading = ref(false)
const proofActionLoading = ref('')
const noticeMessage = ref('')
const noticeVariant = ref<'success' | 'default' | 'error'>('success')
const quoteDetail = ref<Record<string, any> | null>(null)
const jobFiles = ref<Array<Record<string, any>>>([])

async function loadDetail() {
  pageError.value = ''
  try {
    const payload = await getPartnerQuoteDetail(id.value)
    quoteDetail.value = payload?.quote || null
    const jobId = quoteDetail.value?.managed_job?.id
    jobFiles.value = jobId ? await fetchManagedJobFiles(jobId) : []
  } catch (error: unknown) {
    pageError.value = getApiErrorMessage(error, 'Partner detail is unavailable right now.')
  }
}

onMounted(async () => {
  await loadDetail()
})

const latestResponse = computed(() => quoteDetail.value?.latest_response || {})
const responseSnapshot = computed(() => latestResponse.value?.response_snapshot || null)
const requestSnapshot = computed(() => quoteDetail.value?.request_snapshot || {})
const requestDetails = computed(() => requestSnapshot.value?.request_details || {})
const requestInputs = computed(() => requestSnapshot.value?.calculator_inputs || {})
const managedJob = computed(() => quoteDetail.value?.managed_job || null)
const proofFiles = computed(() => jobFiles.value.filter(file => String(file.file_type || '').toLowerCase() === 'proof'))
const managerReviewProof = computed(() => proofFiles.value.find(file => ['manager_review', 'proof_uploaded'].includes(String(file.status || '').toLowerCase())) || null)
const latestProof = computed(() => proofFiles.value[proofFiles.value.length - 1] || null)
const proofStatusLabel = computed(() => formatLabel(latestProof.value?.status || 'No proof uploaded yet'))
const paymentStatus = computed(() => String(managedJob.value?.payment_status || '').toLowerCase())
const assignmentStatus = computed(() => String(managedJob.value?.assignment_status || '').toLowerCase())
const jobStatus = computed(() => String(managedJob.value?.status || '').toLowerCase())
const isPaid = computed(() => ['confirmed', 'release_ready', 'paid'].includes(paymentStatus.value))
const isDispatched = computed(() => Boolean(managedJob.value?.dispatched_at) || ['assignment_pending', 'assigned', 'accepted'].includes(assignmentStatus.value))
const isComplete = computed(() => ['completed', 'delivered'].includes(jobStatus.value))
const artworkUploaded = computed(() => Boolean(managedJob.value?.artwork_uploaded))
const artworkMissing = computed(() => Boolean(managedJob.value?.artwork_missing) || (isPaid.value && !artworkUploaded.value))
const intakeArtworkMissing = computed(() => {
  if (managedJob.value?.id) {
    return false
  }
  return !String(requestDetails.value?.artwork_reference || '').trim()
})

const heroTitle = computed(() => quoteTitleFromSnapshot() || quoteDetail.value?.reference || quoteDetail.value?.request_reference || `Quote ${id.value}`)
const heroSubtitle = computed(() => latestResponse.value?.shop_name || 'Partner-managed quote detail')
const clientName = computed(() => quoteDetail.value?.client_name || quoteDetail.value?.customer_name || 'Client')
const clientEmail = computed(() => quoteDetail.value?.client_email || '')
const clientPhone = computed(() => quoteDetail.value?.client_phone || '')
const sentDateLabel = computed(() => formatDate(quoteDetail.value?.latest_response?.sent_at || quoteDetail.value?.created_at))
const productLabel = computed(() => requestSnapshot.value?.product_label || requestSnapshot.value?.product_type || requestInputs.value?.product_type || 'Partner quote')
const quantitySizeLabel = computed(() => {
  const quantityValue = requestSnapshot.value?.quantity || requestInputs.value?.quantity
  const quantity = quantityValue ? `${Number(quantityValue).toLocaleString('en-KE')} qty` : 'Qty pending'
  const size = requestSnapshot.value?.finished_size || requestSnapshot.value?.size_label || requestInputs.value?.finished_size || 'Size pending'
  return `${quantity} · ${size}`
})
const specsLabel = computed(() => {
  const parts = [
    requestSnapshot.value?.print_sides || requestSnapshot.value?.print_sides_label || requestInputs.value?.print_sides,
    requestSnapshot.value?.color_mode || requestSnapshot.value?.color_mode_label || requestInputs.value?.color_mode,
    requestSnapshot.value?.paper_stock || requestSnapshot.value?.paper_label || requestInputs.value?.paper_stock,
    requestSnapshot.value?.lamination || requestSnapshot.value?.lamination_label || requestInputs.value?.lamination,
  ].filter(Boolean)
  return parts.length ? parts.join(' · ') : 'Specs pending'
})
const turnaroundLabel = computed(() => latestResponse.value?.turnaround_label || 'Turnaround not provided')
const normalizedPricing = computed<NormalizedCustomerPricing>(() => {
  const raw = responseSnapshot.value?.customer_pricing as RawCustomerPricing | undefined
  return normalizeCustomerPricing(raw)
})
const printerPayoutLabel = computed(() => formatCurrency(normalizedPricing.value.printerPayout))
const unitPriceLabel = computed(() => formatCurrency(normalizedPricing.value.unitPrice))
const brokerMarginLabel = computed(() => formatCurrency(normalizedPricing.value.brokerMargin))
const platformFeeLabel = computed(() => formatCurrency(normalizedPricing.value.platformFee))
const clientTotalLabel = computed(() => formatCurrency(normalizedPricing.value.customerTotal))

const timelineTimestamps = computed<Record<string, unknown>>(() => ({
  requested: quoteDetail.value?.created_at,
  assigned: quoteDetail.value?.assigned_at || requestSnapshot.value?.assigned_at,
  prepared: latestResponse.value?.created_at || latestResponse.value?.sent_at,
  sent: latestResponse.value?.sent_to_client_at || latestResponse.value?.sent_at,
  accepted: quoteDetail.value?.accepted_at || managedJob.value?.accepted_at || managedJob.value?.created_at,
  paid: managedJob.value?.payment_confirmed_at || managedJob.value?.paid_at,
  dispatched: managedJob.value?.dispatched_at,
  proof_uploaded: managedJob.value?.proof_uploaded_at,
  proof_approved: managedJob.value?.proof_approved_at,
  completed: managedJob.value?.completed_at,
}))
const timelineSteps = computed(() => TIMELINE_STEPS.map((step) => {
  const timestamp = timelineTimestamps.value[step.key]
  return {
    ...step,
    copy: timestamp ? formatDateTime(timestamp) : 'Not completed yet',
    done: Boolean(timestamp),
  }
}))

const showDispatchButton = computed(() => Boolean(managedJob.value?.id) && !isDispatched.value && !isComplete.value)
const showPrepareQuoteButton = computed(() => !latestResponse.value?.id && !managedJob.value?.id && section.value === 'quotes')
const dispatchButtonDisabled = computed(() => !isPaid.value || !artworkUploaded.value)
const dispatchButtonVariant = computed<'primary' | 'secondary'>(() => dispatchButtonDisabled.value ? 'secondary' : 'primary')
const dispatchButtonLabel = computed(() => {
  if (!isPaid.value) return 'Awaiting payment'
  if (!artworkUploaded.value) return 'Awaiting artwork'
  return 'Start Production'
})
const dispatchButtonTooltip = computed(() => {
  if (!isPaid.value) return 'Client payment must be confirmed before dispatch'
  if (!artworkUploaded.value) return 'Client must upload artwork before dispatch'
  return 'Dispatch this job to production'
})
const showArtworkWaitingBox = computed(() => Boolean(managedJob.value?.id) && isPaid.value && !artworkUploaded.value)
const showProofApprovalBox = computed(() => Boolean(managedJob.value?.id && managerReviewProof.value))
const actionBoxClass = computed(() => {
  if (isComplete.value) return 'border-teal-200 bg-teal-50 text-teal-800'
  if (isDispatched.value) return 'border-blue-200 bg-blue-50 text-blue-800'
  if (isPaid.value && !artworkUploaded.value) return 'border-amber-200 bg-amber-50 text-amber-800'
  if (isPaid.value) return 'border-green-200 bg-green-50 text-green-800'
  if (managedJob.value?.id) return 'border-amber-200 bg-amber-50 text-amber-800'
  return 'border-slate-200 bg-slate-50 text-slate-700'
})
const actionTitle = computed(() => {
  if (isComplete.value) return 'Job complete'
  if (isDispatched.value) return 'Job is being printed'
  if (isPaid.value && !artworkUploaded.value) return 'Client paid, waiting for artwork'
  if (isPaid.value) return `Client has paid ${clientTotalLabel.value}`
  if (managedJob.value?.id) return 'Client accepted - awaiting payment'
  return 'Waiting for client to accept'
})
const actionCopy = computed(() => {
  if (isComplete.value) return 'Production has completed the job. Settlement follows the confirmed completion state.'
  if (isDispatched.value) return 'Production has the assignment. Your markup remains protected until the job closes out.'
  if (isPaid.value && !artworkUploaded.value) return 'Dispatch is blocked until the client uploads artwork.'
  if (isPaid.value) return 'Client payment is confirmed, so dispatch is available now.'
  if (managedJob.value?.id) return 'The client accepted the quote. Dispatch unlocks after payment confirmation.'
  return 'No production action is available yet.'
})
const detailStatusLabel = computed(() => {
  if (isComplete.value) return 'Completed'
  if (isDispatched.value) return 'In production'
  if (isPaid.value && !artworkUploaded.value) return 'Paid - artwork needed'
  if (isPaid.value) return 'Paid - dispatch now'
  if (managedJob.value?.id) return 'Accepted - awaiting payment'
  if (latestResponse.value?.id) return 'Awaiting client response'
  return 'Needs quote'
})
const detailStatusKey = computed(() => {
  if (isComplete.value) return 'complete'
  if (isDispatched.value) return 'dispatched'
  if (isPaid.value) return 'paid'
  if (managedJob.value?.id) return 'accepted'
  if (latestResponse.value?.id) return 'sent'
  return 'submitted'
})
const nextActionTitle = computed(() => {
  if (showPrepareQuoteButton.value) return 'Prepare and send the client quote'
  if (showDispatchButton.value && !dispatchButtonDisabled.value) return 'Dispatch this paid job to production'
  if (showDispatchButton.value) return dispatchButtonLabel.value
  if (showProofApprovalBox.value) return 'Review the uploaded production proof'
  if (isDispatched.value) return 'Track production progress'
  if (isComplete.value) return 'Review completed job'
  return actionTitle.value
})
const nextActionCopy = computed(() => {
  if (showPrepareQuoteButton.value) return 'Use the existing quote builder to choose production pricing, set margin, and send the client-facing quote.'
  if (showDispatchButton.value) return actionCopy.value
  if (showProofApprovalBox.value) return 'Approve the proof for client review or reject it so production can upload a corrected file.'
  return actionCopy.value
})
const artworkAlertCopy = computed(() => {
  if (managedJob.value?.artwork_reminder_sent) {
    return 'Awaiting artwork from client. They have been notified to upload, and dispatch stays blocked until the file exists.'
  }
  return 'Awaiting artwork from client. Dispatch stays blocked until the file is uploaded.'
})

async function dispatchQuoteJob() {
  if (!managedJob.value?.id || dispatchButtonDisabled.value) {
    return
  }
  dispatchLoading.value = true
  try {
    await dispatchPartnerJob(managedJob.value.id)
    noticeVariant.value = 'success'
    noticeMessage.value = "Job sent to production. You'll be notified when it's ready."
    await loadDetail()
  } catch (error: unknown) {
    noticeVariant.value = 'error'
    noticeMessage.value = getApiErrorMessage(error, 'Dispatch failed.')
  } finally {
    dispatchLoading.value = false
  }
}

async function reviewManagerProof(action: 'approve' | 'reject') {
  if (!managedJob.value?.id || !managerReviewProof.value?.id) {
    return
  }
  proofActionLoading.value = action
  try {
    await updateManagerProofApproval(managedJob.value.id, action)
    noticeVariant.value = 'success'
    noticeMessage.value = action === 'approve'
      ? 'Proof released to the client for approval.'
      : 'Proof rejected. Production can upload a corrected proof.'
    await loadDetail()
  } catch (error: unknown) {
    noticeVariant.value = 'error'
    noticeMessage.value = getApiErrorMessage(error, 'Proof review failed.')
  } finally {
    proofActionLoading.value = ''
  }
}

async function prepareQuote() {
  await navigateTo(`/dashboard/partner/quotes?prepare=${id.value}`)
}

function quoteTitleFromSnapshot() {
  const product = requestSnapshot.value?.product_label || requestSnapshot.value?.product_type || requestInputs.value?.product_type
  const quantity = requestSnapshot.value?.quantity || requestInputs.value?.quantity
  if (!product) {
    return ''
  }
  return `${formatLabel(product)}${quantity ? ` x${Number(quantity).toLocaleString('en-KE')}` : ''}`
}

const safeNumber = (value: unknown): number => {
  const num = Number(value)
  return Number.isFinite(num) ? num : 0
}

const normalizeCustomerPricing = (raw?: RawCustomerPricing): NormalizedCustomerPricing => {
  if (!raw) {
    return {
      customerTotal: 0,
      unitPrice: 0,
      platformFee: 0,
      brokerMargin: 0,
      printerPayout: 0,
    }
  }

  const normalized: NormalizedCustomerPricing = {
    customerTotal: safeNumber(
      raw.customer_total
      ?? raw.final_client_price
      ?? raw.total
      ?? raw.total_price,
    ),
    unitPrice: safeNumber(
      raw.unit_price
      ?? raw.price_per_unit
      ?? raw.per_unit,
    ),
    platformFee: safeNumber(
      raw.platform_fee
      ?? raw.printy_fee
      ?? raw.platform_service_amount,
    ),
    brokerMargin: safeNumber(
      raw.broker_margin
      ?? raw.broker_margin_amount
      ?? raw.margin_fee,
    ),
    printerPayout: safeNumber(
      raw.printer_payout
      ?? raw.partner_payout
      ?? raw.production_cost
      ?? raw.production_base_price,
    ),
  }

  if (
    import.meta.dev
    && Object.keys(raw).length > 0
    && Object.values(normalized).every(value => value === 0)
  ) {
    console.warn('[Financials] customer_pricing mapping produced all zeros.', { raw })
  }

  return normalized
}

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('en-KE', {
    style: 'currency',
    currency: 'KES',
  }).format(safeNumber(value))

function formatDate(value: unknown) {
  if (!value) {
    return 'Not sent yet'
  }
  const date = new Date(String(value))
  if (Number.isNaN(date.getTime())) {
    return 'Not sent yet'
  }
  return new Intl.DateTimeFormat('en-KE', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(date)
}

function formatDateTime(value: unknown) {
  if (!value) {
    return ''
  }
  const date = new Date(String(value))
  if (Number.isNaN(date.getTime())) {
    return ''
  }
  return new Intl.DateTimeFormat('en-KE', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date)
}

function formatLabel(value: unknown) {
  return String(value || '')
    .replace(/[_-]+/g, ' ')
    .replace(/\b\w/g, char => char.toUpperCase())
}
</script>

<template>
  <main class="min-h-screen bg-slate-50 px-6 py-8">
    <section class="mx-auto max-w-6xl rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <p class="text-sm font-semibold uppercase tracking-[0.2em] text-purple-600">Partner quote</p>
      <h1 class="mt-3 text-2xl font-bold text-slate-900">Quote detail</h1>
      <p class="mt-2 text-sm text-slate-600">Quote details and production actions render from this route.</p>
    </section>
  </main>
</template>
