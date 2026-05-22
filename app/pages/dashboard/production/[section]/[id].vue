<template>
  <RoleDashboardFrame
    title="Production Detail"
    badge="Production"
    :name="displayName"
    :initials="initials"
    subtitle="Assignment status, proof handling, and payout-safe production actions"
    breadcrumb-root="Dashboard"
    :nav-items="navItems"
    support-title="Production detail"
    support-copy="Only production-safe job details and payout status are shown here."
    support-action="Back"
    support-to="/dashboard/production/assignments"
    @logout="auth.logout()"
  >
    <BaseAlert v-if="pageError" variant="error" title="Production detail could not load." :message="pageError" />
    <BaseAlert v-else-if="successMessage" class="mb-6" variant="success" :message="successMessage" />

    <div v-if="!pageError && assignment && jobDetail" class="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
      <div class="space-y-6">
        <DashboardSection :title="jobReference" :subtitle="jobTitle">
          <div class="grid gap-4 md:grid-cols-2">
            <div v-for="item in jobSpecRows" :key="item.label" class="rounded-2xl border border-[#e4e7ec] bg-white p-4">
              <p class="text-xs font-semibold uppercase tracking-[0.18em] text-[#98a2b3]">{{ item.label }}</p>
              <p class="mt-2 text-sm font-semibold text-[#101828]">{{ item.value }}</p>
            </div>
          </div>
        </DashboardSection>

        <DashboardSection title="Artwork and Files" subtitle="Production-visible uploads only">
          <div class="space-y-3">
            <div v-for="file in files" :key="file.id" class="rounded-2xl border border-[#e4e7ec] bg-white p-4">
              <div class="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p class="text-sm font-semibold text-[#101828]">{{ file.original_filename || 'Job file' }}</p>
                  <p class="mt-1 text-sm text-[#667085]">{{ humanizeStatus(file.file_type) }} · {{ humanizeStatus(file.status) }}</p>
                </div>
                <a
                  v-if="file.download_url"
                  :href="file.download_url"
                  target="_blank"
                  rel="noreferrer"
                  class="inline-flex items-center rounded-xl border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700"
                >
                  Download
                </a>
              </div>
            </div>
            <p v-if="!files.length" class="text-sm text-[#667085]">No production-visible files yet.</p>
          </div>
        </DashboardSection>
      </div>

      <div class="space-y-6">
        <DashboardSection title="Financials and Status" subtitle="Production payout and workflow progress">
          <div class="space-y-4">
            <div class="rounded-2xl border border-[#e4e7ec] bg-white p-4">
              <p class="text-xs font-semibold uppercase tracking-[0.18em] text-[#98a2b3]">Your payment</p>
              <p class="mt-2 text-lg font-semibold text-[#101828]">{{ productionAmountLabel }}</p>
              <p class="mt-1 text-sm text-[#667085]">{{ paymentHoldLabel }}</p>
            </div>

            <div class="rounded-2xl border border-[#e4e7ec] bg-white p-4">
              <p class="text-xs font-semibold uppercase tracking-[0.18em] text-[#98a2b3]">Requested by</p>
              <p class="mt-2 text-sm font-semibold text-[#101828]">{{ requestedByLabel }}</p>
            </div>

            <div class="rounded-2xl border border-[#e4e7ec] bg-white p-4">
              <p class="text-xs font-semibold uppercase tracking-[0.18em] text-[#98a2b3]">Status timeline</p>
              <div class="mt-4 space-y-3">
                <div
                  v-for="step in timelineSteps"
                  :key="step.label"
                  class="flex items-center gap-3 text-sm"
                  :class="step.done ? 'text-[#101828]' : 'text-[#98a2b3]'"
                >
                  <span
                    class="flex h-6 w-6 items-center justify-center rounded-full border text-xs font-bold"
                    :class="step.done ? 'border-[#101828] bg-[#101828] text-white' : 'border-[#d0d5dd] bg-white text-[#98a2b3]'"
                  >
                    {{ step.done ? '•' : '○' }}
                  </span>
                  <span>{{ step.label }}</span>
                </div>
              </div>
            </div>
          </div>
        </DashboardSection>

        <DashboardSection title="Actions" subtitle="Only the next valid production actions are available">
          <div class="space-y-4">
            <div v-if="assignmentStatus === 'pending'" class="space-y-3">
              <div class="grid gap-3 md:grid-cols-2">
                <BaseButton :loading="actionLoading === 'accept'" @click="runAction('accept')">Accept job</BaseButton>
                <BaseButton variant="secondary" @click="showRejectForm = !showRejectForm">
                  {{ showRejectForm ? 'Hide reject' : 'Reject job' }}
                </BaseButton>
              </div>

              <div v-if="showRejectForm" class="rounded-2xl border border-[#fda29b] bg-[#fff5f4] p-4">
                <label class="block text-sm font-semibold text-[#101828]">Reason for rejecting</label>
                <textarea
                  v-model="rejectReason"
                  rows="3"
                  class="mt-2 w-full rounded-xl border border-[#fda29b] bg-white px-3 py-2 text-sm text-[#101828] outline-none focus:border-[#e13515]"
                  placeholder="Reason for rejecting (optional)"
                />
                <div class="mt-3 flex justify-end">
                  <BaseButton variant="danger" :loading="actionLoading === 'reject'" @click="runAction('reject')">Confirm reject</BaseButton>
                </div>
              </div>
            </div>

            <div v-else-if="assignmentStatus === 'accepted'" class="space-y-3">
              <BaseButton :loading="actionLoading === 'in-production'" @click="runAction('in-production')">Start production</BaseButton>
            </div>

            <div v-else-if="assignmentStatus === 'in_production'" class="space-y-4">
              <div class="rounded-2xl border border-[#e4e7ec] bg-white p-4">
                <p class="text-sm font-semibold text-[#101828]">Upload proof for client approval</p>
                <p class="mt-1 text-sm text-[#667085]">Accepted file types: JPG, PNG, PDF. Max 10MB.</p>
                <input class="mt-4 block w-full text-sm text-slate-700" type="file" accept=".jpg,.jpeg,.png,.pdf" @change="onProofSelected" />
                <textarea
                  v-model="proofNote"
                  rows="3"
                  class="mt-3 w-full rounded-xl border border-[#d0d5dd] bg-white px-3 py-2 text-sm text-[#101828] outline-none focus:border-[#101828]"
                  placeholder="Optional proof note"
                />
                <div class="mt-3 flex flex-wrap gap-3">
                  <BaseButton :loading="actionLoading === 'upload-proof'" :disabled="!proofFile" @click="submitProof">Upload proof</BaseButton>
                  <BaseButton variant="secondary" :loading="actionLoading === 'ready'" @click="runAction('ready')">Mark ready</BaseButton>
                </div>
              </div>

              <div v-if="proofStateMessage" class="rounded-2xl border p-4 text-sm" :class="proofStateTone">
                {{ proofStateMessage }}
              </div>
            </div>

            <div v-else-if="assignmentStatus === 'ready'" class="space-y-3">
              <div class="rounded-2xl border border-[#abefc6] bg-[#ecfdf3] p-4 text-sm text-[#067647]">
                Proof approved or the job is ready for handoff.
              </div>
              <BaseButton :loading="actionLoading === 'completed'" @click="runAction('completed')">Mark as complete</BaseButton>
            </div>

            <div v-else-if="assignmentStatus === 'completed'" class="rounded-2xl border border-[#99f6e4] bg-[#f0fdfa] p-4 text-sm text-[#0f766e]">
              Job complete. Payment will be settled according to the current payout state.
            </div>

            <div v-if="assignmentStatus !== 'completed'" class="border-t border-[#e4e7ec] pt-4">
              <button class="text-sm font-semibold text-[#155eef]" @click="showIssueForm = !showIssueForm">
                {{ showIssueForm ? 'Hide issue form' : 'Report an issue' }}
              </button>
              <div v-if="showIssueForm" class="mt-3 rounded-2xl border border-[#fda29b] bg-[#fff5f4] p-4">
                <label class="block text-sm font-semibold text-[#101828]">Issue description</label>
                <textarea
                  v-model="issueNote"
                  rows="3"
                  class="mt-2 w-full rounded-xl border border-[#fda29b] bg-white px-3 py-2 text-sm text-[#101828] outline-none focus:border-[#e13515]"
                  placeholder="Describe the issue"
                />
                <div class="mt-3 flex justify-end">
                  <BaseButton variant="secondary" :loading="actionLoading === 'issue'" :disabled="!issueNote.trim()" @click="runAction('issue')">
                    Submit issue
                  </BaseButton>
                </div>
              </div>
            </div>
          </div>
        </DashboardSection>
      </div>
    </div>
  </RoleDashboardFrame>
</template>

<script setup lang="ts">
import BaseAlert from '~/components/base/BaseAlert.vue'
import BaseButton from '~/components/base/BaseButton.vue'
import DashboardSection from '~/components/dashboard/DashboardSection.vue'
import RoleDashboardFrame from '~/components/dashboard/RoleDashboardFrame.vue'
import {
  acceptAssignment,
  getAssignmentDetail,
  markCompleted,
  markInProduction,
  markReady,
  rejectAssignment,
  reportIssue,
  uploadProof,
} from '~/services/production'
import { getApiErrorMessage } from '~/shared/api'

definePageMeta({ layout: false, middleware: 'auth' })

const auth = useAuthStore()
if (!auth.canAccessProductionDashboard) {
  await navigateTo(auth.homeRoute)
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

try {
  await loadDetail()
} catch (error: unknown) {
  pageError.value = getApiErrorMessage(error, 'Production detail is unavailable right now.')
}

const assignmentStatus = computed(() => String(assignment.value?.status || '').toLowerCase())
const latestProof = computed(() => {
  return files.value
    .filter(file => String(file.file_type || '').toLowerCase() === 'proof')
    .sort((left, right) => String(right.created_at || '').localeCompare(String(left.created_at || '')))[0] || null
})
const jobReference = computed(() => jobDetail.value?.reference || assignment.value?.managed_reference || `Assignment ${assignmentRouteId.value}`)
const jobTitle = computed(() => jobDetail.value?.title || 'Managed print job')
const requestedByLabel = computed(() => 'Printy partner')
const productionAmountLabel = computed(() => formatMoney(settlement.value?.production_amount || jobDetail.value?.pricing?.production_total))
const paymentHoldLabel = computed(() => summarizePaymentState(jobDetail.value?.payment_status))
const deadlineLabel = computed(() => formatDateTime(assignment.value?.requested_deadline || assignment.value?.due_at || jobDetail.value?.requested_deadline))

const jobSpecRows = computed(() => [
  { label: 'Product type', value: jobTitle.value },
  { label: 'Quantity', value: 'Not provided in production payload' },
  { label: 'Size', value: 'Not provided in production payload' },
  { label: 'Paper', value: 'Not provided in production payload' },
  { label: 'Sides', value: 'Not provided in production payload' },
  { label: 'Colour mode', value: 'Not provided in production payload' },
  { label: 'Finishing', value: 'Not provided in production payload' },
  { label: 'Turnaround / deadline', value: deadlineLabel.value },
  { label: 'Special notes', value: String(assignment.value?.assignment_notes || '').trim() || 'No production notes attached.' },
])

const timelineSteps = computed(() => {
  const status = assignmentStatus.value
  const proofStatus = String(latestProof.value?.status || '').toLowerCase()
  return [
    { label: 'Job assigned', done: Boolean(assignment.value) },
    { label: 'Accepted', done: ['accepted', 'in_production', 'ready', 'completed'].includes(status) },
    { label: 'In production', done: ['in_production', 'ready', 'completed'].includes(status) },
    { label: 'Proof uploaded', done: ['proof_uploaded', 'proof_approved', 'revision_requested', 'print_ready'].includes(proofStatus) },
    { label: 'Ready', done: ['ready', 'completed'].includes(status) },
    { label: 'Complete', done: status === 'completed' },
  ]
})

const proofStateMessage = computed(() => {
  const status = String(latestProof.value?.status || '').toLowerCase()
  if (status === 'revision_requested') return 'Revision requested on the latest proof.'
  if (status === 'proof_uploaded') return 'Proof sent for approval.'
  if (status === 'proof_approved') return 'Latest proof approved.'
  return ''
})

const proofStateTone = computed(() => {
  const status = String(latestProof.value?.status || '').toLowerCase()
  if (status === 'revision_requested') return 'border-[#fecd89] bg-[#fffaeb] text-[#b54708]'
  if (status === 'proof_uploaded') return 'border-[#bfd4ff] bg-[#eff6ff] text-[#175cd3]'
  return 'border-[#abefc6] bg-[#ecfdf3] text-[#067647]'
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
  return humanizeStatus(status)
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

async function runAction(action: 'accept' | 'reject' | 'in-production' | 'ready' | 'completed' | 'issue') {
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
      successMessage.value = 'Production started.'
    } else if (action === 'ready') {
      await markReady(assignment.value.id)
      successMessage.value = 'Assignment marked ready.'
    } else if (action === 'completed') {
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
    successMessage.value = 'Proof sent for approval.'
    await loadDetail()
  } catch (error: unknown) {
    pageError.value = getApiErrorMessage(error, 'Proof upload failed.')
  } finally {
    actionLoading.value = ''
  }
}
</script>
