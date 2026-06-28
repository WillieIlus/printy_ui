
<script setup lang="ts">
import { callWithNuxt } from '#app'
import BaseAlert from '~/components/base/BaseAlert.vue'
import BaseBadge from '~/components/base/BaseBadge.vue'
import BaseButton from '~/components/base/BaseButton.vue'
import DashboardPageHeader from '~/components/dashboard/DashboardPageHeader.vue'
import DashboardSection from '~/components/dashboard/DashboardSection.vue'
import RoleDashboardFrame from '~/components/dashboard/RoleDashboardFrame.vue'
import { printyDueStatus, printyStatusBadgeVariant, printyStatusLabel, type PrintyBadgeVariant } from '~/constants/design'
import {
  acceptAssignment,
  getAssignmentDetail,
  markCompleted,
  markFinishing,
  markInProduction,
  markReady,
  rejectAssignment,
  reportIssue,
  uploadProof,
} from '~/services/production'
import { getApiErrorMessage } from '~/shared/api'

definePageMeta({ layout: false, middleware: 'auth' })

const nuxtApp = useNuxtApp()
const auth = useAuthStore()
const accessToken = useCookie<string | null>('printy_access_token')
if (!auth.canAccessProductionDashboard) {
  await callWithNuxt(nuxtApp, navigateTo, [auth.homeRoute])
}

const route = useRoute()
const assignmentRouteId = computed(() => String(route.params.id || ''))
const displayName = computed(() => auth.user?.name || auth.user?.email || 'Production')
const initials = computed(() => displayName.value.split(' ').map(part => part[0]).join('').slice(0, 2).toUpperCase() || 'PD')
const navItems = computed(() => [{ label: 'Assignments', to: '/dashboard/production/assignments', active: true }])

const pageError = ref('')
const successMessage = ref('')
const actionLoading = ref('')
const assignment = ref<Record<string, any> | null>(null)
const jobDetail = ref<Record<string, any> | null>(null)
const settlement = ref<Record<string, any> | null>(null)
const files = ref<Array<Record<string, any>>>([])
const proofFile = ref<File | null>(null)
const proofNote = ref('')
const rejectReason = ref('')
const issueNote = ref('')
const showRejectForm = ref(false)
const showIssueForm = ref(false)
const downloadingFileId = ref<number | string | null>(null)

async function loadDetail() {
  pageError.value = ''
  const detail = await getAssignmentDetail(assignmentRouteId.value)
  if (!detail.assignment || !detail.job) {
    throw new Error('Assignment detail is unavailable for this shop.')
  }
  assignment.value = detail.assignment
  jobDetail.value = detail.job
  settlement.value = detail.settlement
  files.value = Array.isArray(detail.files) ? detail.files : []
}

onMounted(async () => {
  try {
    await loadDetail()
  } catch (error: unknown) {
    pageError.value = getApiErrorMessage(error, 'Production detail is unavailable right now.')
  }
})

const assignmentStatus = computed(() => String(assignment.value?.status || '').toLowerCase())
const nextAllowedActions = computed<string[]>(() => Array.isArray(assignment.value?.next_allowed_actions) ? assignment.value.next_allowed_actions : [])
const artworkAvailable = computed(() => Boolean(assignment.value?.artwork_available))
const paymentConfirmed = computed(() => Boolean(assignment.value?.payment_confirmed))
const paymentBannerTitle = computed(() => paymentConfirmed.value ? 'Payment confirmed - complete this job to receive your payout' : 'Awaiting payment confirmation')
const paymentBannerCopy = computed(() => paymentConfirmed.value ? 'Printy has confirmed payment for this job. Keep the production timeline moving to unlock settlement.' : 'Do not hand over completed work until Printy marks this assignment as payment-confirmed.')
const latestProof = computed(() => {
  return files.value
    .filter(file => String(file.file_type || '').toLowerCase() === 'proof')
    .sort((left, right) => String(right.created_at || '').localeCompare(String(left.created_at || '')))[0] || null
})
const latestProofStatus = computed(() => String(latestProof.value?.status || '').toLowerCase())
const jobReference = computed(() => jobDetail.value?.reference || assignment.value?.managed_reference || `Assignment ${assignmentRouteId.value}`)
const jobTitle = computed(() => jobDetail.value?.title || 'Managed print job')
const requestedByLabel = computed(() => 'Print Manager')
const productionAmountLabel = computed(() => formatMoney(assignment.value?.payout_amount || settlement.value?.production_amount || jobDetail.value?.pricing?.production_total))
const paymentHoldLabel = computed(() => String(assignment.value?.payout_status_label || summarizePaymentState(jobDetail.value?.payment_status)))
const deadlineLabel = computed(() => formatDateTime(assignment.value?.requested_deadline || assignment.value?.due_at || jobDetail.value?.requested_deadline))
const urgencyState = computed(() => printyDueStatus(assignment.value?.requested_deadline || assignment.value?.due_at || jobDetail.value?.requested_deadline))
const urgencyLabel = computed(() => urgencyState.value.label)
const urgencyBadgeVariant = computed<PrintyBadgeVariant>(() => urgencyState.value.variant)
const productionSpecs = computed<Record<string, any>>(() => {
  const payload = jobDetail.value?.specs
  return payload && typeof payload === 'object' ? payload : {}
})

const jobSpecRows = computed(() => [
  { label: 'Product type', value: String(productionSpecs.value.product || jobTitle.value || 'Managed print job') },
  { label: 'Quantity', value: formatQuantity(productionSpecs.value.quantity) },
  { label: 'Size', value: String(productionSpecs.value.size || 'Awaiting confirmed size') },
  { label: 'Paper', value: String(productionSpecs.value.paper || 'Awaiting confirmed stock') },
  { label: 'Sides', value: String(productionSpecs.value.print_sides || 'Awaiting print-side confirmation') },
  { label: 'Colour mode', value: String(productionSpecs.value.color_mode || 'Awaiting colour mode confirmation') },
  { label: 'Finishing', value: String(productionSpecs.value.finishing || 'No finishing recorded') },
  { label: 'Turnaround / deadline', value: deadlineLabel.value },
  { label: 'Special notes', value: String(productionSpecs.value.notes || assignment.value?.assignment_notes || '').trim() || 'No production notes attached.' },
])

const timelineSteps = computed(() => {
  const baseSteps = Array.isArray(assignment.value?.production_timeline_steps) ? assignment.value.production_timeline_steps : []
  const proofStatus = latestProofStatus.value
  const proofStepState = proofStatus === 'proof_approved'
    ? 'completed'
    : proofStatus === 'manager_review' || proofStatus === 'manager_approved' || proofStatus === 'proof_uploaded' || proofStatus === 'revision_requested'
      ? 'current'
      : 'pending'
  const proofStep = {
    key: 'proof_uploaded',
    label: 'Proof uploaded',
    state: proofStepState,
    completed_at: latestProof.value?.created_at || null,
  }
  const readyIndex = baseSteps.findIndex((step: Record<string, any>) => step.key === 'ready')
  if (readyIndex === -1) {
    return [...baseSteps, proofStep]
  }
  return [...baseSteps.slice(0, readyIndex), proofStep, ...baseSteps.slice(readyIndex)]
})
const canMarkReady = computed(() => {
  if (!latestProof.value) return true
  const proofStatus = latestProofStatus.value
  return proofStatus === 'proof_approved'
})
const assignmentStatusLabel = computed(() => printyStatusLabel(assignmentStatus.value, 'production'))
const assignmentBadgeVariant = computed<PrintyBadgeVariant>(() => printyStatusBadgeVariant(assignmentStatus.value, 'production'))
const fileStateLabel = computed(() => artworkAvailable.value ? 'Files available' : 'Files missing')
const proofStateLabel = computed(() => {
  return printyStatusLabel(latestProofStatus.value || 'needed', 'proof')
})
const nextActionTitle = computed(() => {
  if (!artworkAvailable.value) return 'Review missing production files'
  if (assignmentStatus.value === 'pending') return 'Review and accept this job'
  if (assignmentStatus.value === 'accepted') return 'Start production'
  if (latestProofStatus.value === 'revision_requested') return 'Upload a revised proof'
  if (assignmentStatus.value === 'in_production') return 'Upload proof for review'
  if (assignmentStatus.value === 'finishing') return 'Finish and mark ready'
  if (assignmentStatus.value === 'ready') return 'Mark complete after handoff'
  if (assignmentStatus.value === 'completed') return 'Assignment complete'
  return 'Review assignment details'
})
const nextActionCopy = computed(() => {
  if (!artworkAvailable.value) return 'Production should not move until the required artwork or job files are available.'
  if (assignmentStatus.value === 'pending') return 'Confirm the specs and files, then accept or reject the assignment.'
  if (assignmentStatus.value === 'accepted') return 'Move this accepted assignment onto the production floor.'
  if (latestProofStatus.value === 'revision_requested') return 'The proof needs revision before approval can continue.'
  if (assignmentStatus.value === 'in_production') return 'Upload a proof when the first production proof is ready.'
  if (assignmentStatus.value === 'finishing') return 'Complete finishing, then mark the assignment ready for handoff.'
  if (assignmentStatus.value === 'ready') return 'Confirm completion only after the job is ready for collection or handoff.'
  return 'Use the available production action below when the status changes.'
})
const primaryAction = computed(() => {
  if (assignmentStatus.value === 'pending') {
    return { label: 'Accept job', variant: 'primary' as const, loadingKey: 'accept', disabled: false, run: () => runAction('accept') }
  }
  if (assignmentStatus.value === 'accepted') {
    return { label: 'Start production', variant: 'primary' as const, loadingKey: 'in-production', disabled: false, run: () => runAction('in-production') }
  }
  if (assignmentStatus.value === 'ready') {
    return { label: 'Mark complete', variant: 'primary' as const, loadingKey: 'completed', disabled: false, run: () => runAction('completed') }
  }
  if (assignmentStatus.value === 'in_production' || assignmentStatus.value === 'finishing') {
    return { label: 'Mark ready', variant: 'primary' as const, loadingKey: 'ready', disabled: !canMarkReady.value, run: () => runAction('ready') }
  }
  return null
})

function humanizeStatus(value: unknown) {
  return String(value || 'pending')
    .replace(/[_-]+/g, ' ')
    .replace(/\b\w/g, letter => letter.toUpperCase())
}

function formatMoney(value: unknown) {
  const amount = Number(value)
  if (!Number.isFinite(amount) || amount <= 0) {
    return 'Awaiting payout total'
  }
  return `KES ${amount.toLocaleString('en-KE', { maximumFractionDigits: 2 })}`
}

function formatQuantity(value: unknown) {
  const amount = Number(value)
  if (!Number.isFinite(amount) || amount <= 0) {
    return 'Awaiting confirmed quantity'
  }
  return `${amount.toLocaleString('en-KE')} pieces`
}

function formatDateTime(value: unknown) {
  if (!value) return 'No deadline set'
  const date = new Date(String(value))
  if (Number.isNaN(date.getTime())) return 'No deadline set'
  return new Intl.DateTimeFormat('en-KE', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(date)
}

function summarizePaymentState(value: unknown) {
  const status = String(value || 'pending').toLowerCase()
  if (status.includes('hold')) return 'On hold'
  if (status === 'release_ready') return 'Settlement pending release'
  if (status === 'confirmed' || status === 'paid') return 'Paid / pending settlement'
  return printyStatusLabel(status, 'payment')
}

function onProofSelected(event: Event) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0] || null
  if (!file) {
    proofFile.value = null
    return
  }
  if (file.size > 10 * 1024 * 1024) {
    pageError.value = 'Proof file must be 10MB or smaller.'
    proofFile.value = null
    input.value = ''
    return
  }
  pageError.value = ''
  proofFile.value = file
}

async function downloadFile(file: Record<string, any>) {
  if (!file.download_url) return
  downloadingFileId.value = file.id
  try {
    const token = accessToken.value
    const response = await fetch(file.download_url, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    })
    if (!response.ok) {
      pageError.value = `Download failed: ${response.status} ${response.statusText}`
      return
    }
    const blob = await response.blob()
    const objectUrl = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = objectUrl
    link.download = file.original_filename || 'job-file'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(objectUrl)
  } catch (error: unknown) {
    pageError.value = getApiErrorMessage(error, 'File download failed.')
  } finally {
    downloadingFileId.value = null
  }
}

async function runAction(action: 'accept' | 'reject' | 'in-production' | 'finishing' | 'ready' | 'completed' | 'issue') {
  if (!assignment.value?.id) return
  pageError.value = ''
  successMessage.value = ''
  actionLoading.value = action
  try {
    if (action === 'accept') {
      await acceptAssignment(assignment.value.id)
      successMessage.value = 'Assignment accepted.'
    } else if (action === 'reject') {
      await rejectAssignment(assignment.value.id, rejectReason.value.trim())
      await navigateTo('/dashboard/production/assignments')
      return
    } else if (action === 'in-production') {
      await markInProduction(assignment.value.id)
      successMessage.value = 'Printing started.'
    } else if (action === 'finishing') {
      await markFinishing(assignment.value.id)
      successMessage.value = 'Finishing started.'
    } else if (action === 'ready') {
      await markReady(assignment.value.id)
      successMessage.value = 'Assignment marked ready.'
    } else if (action === 'completed') {
      if (!window.confirm('Confirm job is complete and ready for collection?')) {
        return
      }
      await markCompleted(assignment.value.id)
      successMessage.value = 'Assignment completed.'
    } else {
      await reportIssue(assignment.value.id, issueNote.value.trim())
      issueNote.value = ''
      showIssueForm.value = false
      successMessage.value = 'Issue reported. Our team will follow up.'
    }
    showRejectForm.value = false
    rejectReason.value = ''
    await loadDetail()
  } catch (error: unknown) {
    pageError.value = getApiErrorMessage(error, 'Assignment action failed.')
  } finally {
    actionLoading.value = ''
  }
}

async function submitProof() {
  if (!assignment.value?.managed_job || !proofFile.value) return
  pageError.value = ''
  successMessage.value = ''
  actionLoading.value = 'upload-proof'
  try {
    await uploadProof(assignment.value.managed_job, proofFile.value, proofNote.value.trim())
    proofFile.value = null
    proofNote.value = ''
    successMessage.value = 'Proof sent for manager approval.'
    await loadDetail()
  } catch (error: unknown) {
    pageError.value = getApiErrorMessage(error, 'Proof upload failed.')
  } finally {
    actionLoading.value = ''
  }
}
</script>

<template>
  <main class="min-h-screen bg-slate-50 px-6 py-8">
    <section class="mx-auto max-w-6xl rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <p class="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-600">Assignment</p>
      <h1 class="mt-3 text-2xl font-bold text-slate-900">Assignment detail</h1>
      <p class="mt-2 text-sm text-slate-600">Production assignment status and actions render from this route.</p>
    </section>
  </main>
</template>
