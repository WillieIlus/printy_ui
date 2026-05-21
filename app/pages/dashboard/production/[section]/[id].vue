<template>
  <RoleDashboardFrame
    title="Production Detail"
    badge="Production"
    :name="displayName"
    :initials="initials"
    subtitle="Raw specs, proof handling, and assignment actions"
    breadcrumb-root="Dashboard"
    :nav-items="navItems"
    support-title="Production detail"
    support-copy="Client totals and broker economics remain hidden on this route."
    support-action="Back"
    :support-to="`/dashboard/production/${section}`"
    @logout="auth.logout()"
  >
    <BaseAlert v-if="pageError" variant="error" title="Production detail could not load." :message="pageError" />

    <div v-else class="space-y-6">
      <DashboardSection :title="jobReference" :subtitle="jobTitle">
        <div class="grid gap-4 md:grid-cols-4">
          <div class="rounded-2xl border border-[#e4e7ec] bg-white p-4">
            <p class="text-xs font-semibold uppercase tracking-[0.18em] text-[#98a2b3]">Assignment</p>
            <p class="mt-2 text-base font-semibold text-[#101828]">{{ assignmentLabel }}</p>
          </div>
          <div class="rounded-2xl border border-[#e4e7ec] bg-white p-4">
            <p class="text-xs font-semibold uppercase tracking-[0.18em] text-[#98a2b3]">Production amount</p>
            <p class="mt-2 text-base font-semibold text-[#101828]">{{ productionAmountLabel }}</p>
          </div>
          <div class="rounded-2xl border border-[#e4e7ec] bg-white p-4">
            <p class="text-xs font-semibold uppercase tracking-[0.18em] text-[#98a2b3]">Payment hold</p>
            <p class="mt-2 text-base font-semibold text-[#101828]">{{ paymentHoldLabel }}</p>
          </div>
          <div class="rounded-2xl border border-[#e4e7ec] bg-white p-4">
            <p class="text-xs font-semibold uppercase tracking-[0.18em] text-[#98a2b3]">Deadline</p>
            <p class="mt-2 text-base font-semibold text-[#101828]">{{ deadlineLabel }}</p>
          </div>
        </div>
      </DashboardSection>

      <DashboardSection title="Assignment actions" subtitle="Only real backend actions are shown">
        <div class="flex flex-wrap gap-3">
          <button class="rounded-xl border border-[#12b76a] px-4 py-2 text-sm font-semibold text-[#027a48] disabled:opacity-50" :disabled="!assignmentId || actionLoading === 'accept'" @click="runAssignmentAction('accept')">Accept job</button>
          <button class="rounded-xl border border-[#f79009] px-4 py-2 text-sm font-semibold text-[#b54708] disabled:opacity-50" :disabled="!assignmentId || actionLoading === 'reject'" @click="runAssignmentAction('reject')">Reject job</button>
          <button class="rounded-xl border border-[#155eef] px-4 py-2 text-sm font-semibold text-[#155eef] disabled:opacity-50" :disabled="!assignmentId || actionLoading === 'in-production'" @click="runAssignmentAction('in-production')">Mark in production</button>
          <button class="rounded-xl border border-[#7a5af8] px-4 py-2 text-sm font-semibold text-[#6941c6] disabled:opacity-50" :disabled="!assignmentId || actionLoading === 'ready'" @click="runAssignmentAction('ready')">Mark ready</button>
          <button class="rounded-xl border border-[#101828] px-4 py-2 text-sm font-semibold text-[#101828] disabled:opacity-50" :disabled="!assignmentId || actionLoading === 'completed'" @click="runAssignmentAction('completed')">Mark completed</button>
          <button class="rounded-xl border border-[#d92d20] px-4 py-2 text-sm font-semibold text-[#b42318] disabled:opacity-50" :disabled="!assignmentId || actionLoading === 'issue'" @click="runAssignmentAction('issue')">Report issue</button>
        </div>
      </DashboardSection>

      <DashboardSection title="Upload proof" subtitle="Visible without exposing client billing">
        <div class="flex flex-wrap items-center gap-3">
          <input type="file" accept=".pdf,image/*" @change="onProofSelected" />
          <button class="rounded-xl bg-[#101828] px-4 py-2 text-sm font-semibold text-white disabled:opacity-50" :disabled="!proofFile || actionLoading === 'upload-proof'" @click="uploadProof">
            {{ actionLoading === 'upload-proof' ? 'Uploading...' : 'Upload proof' }}
          </button>
        </div>
      </DashboardSection>

      <DashboardSection title="Files" subtitle="Artwork and proofs for production">
        <div class="space-y-3">
          <div v-for="file in files" :key="file.id" class="rounded-2xl border border-[#e4e7ec] bg-white p-4">
            <p class="text-sm font-semibold text-[#101828]">{{ file.original_filename || 'Job file' }}</p>
            <p class="mt-1 text-sm text-[#667085]">{{ file.file_type }} • {{ file.status }}</p>
          </div>
          <p v-if="!files.length" class="text-sm text-[#667085]">No production-visible files yet.</p>
        </div>
      </DashboardSection>

      <DashboardSection title="Specs and timeline" subtitle="Raw production-side context only">
        <div class="grid gap-4 md:grid-cols-2">
          <div class="rounded-2xl border border-[#e4e7ec] bg-white p-4">
            <p class="text-sm font-semibold text-[#101828]">Operational status</p>
            <p class="mt-2 text-sm text-[#667085]">{{ workflowLabel }}</p>
          </div>
          <div class="rounded-2xl border border-[#e4e7ec] bg-white p-4">
            <p class="text-sm font-semibold text-[#101828]">Payout state</p>
            <p class="mt-2 text-sm text-[#667085]">{{ paymentHoldLabel }}</p>
          </div>
        </div>
      </DashboardSection>
    </div>
  </RoleDashboardFrame>
</template>

<script setup lang="ts">
import BaseAlert from '~/components/base/BaseAlert.vue'
import DashboardSection from '~/components/dashboard/DashboardSection.vue'
import RoleDashboardFrame from '~/components/dashboard/RoleDashboardFrame.vue'
import { useDashboardApi } from '~/services/dashboard'
import {
  fetchManagedJobFiles,
  fetchManagedJobSettlement,
  fetchShopAssignments,
  updateAssignmentAction,
  uploadManagedJobProof,
} from '~/services/jobs'
import { getApiErrorMessage } from '~/shared/api'

definePageMeta({ layout: false, middleware: 'auth' })

const auth = useAuthStore()
const { fetchDashboardDetail } = useDashboardApi()
if (!auth.canAccessProductionDashboard) {
  await navigateTo(auth.homeRoute)
}

const route = useRoute()
const section = String(route.params.section || 'jobs')
const id = String(route.params.id || '')
const displayName = computed(() => auth.user?.name || auth.user?.email || 'Production')
const initials = computed(() => displayName.value.split(' ').map(part => part[0]).join('').slice(0, 2).toUpperCase() || 'PD')
const navItems = computed(() => [{ label: 'Jobs', to: '/dashboard/production/jobs', active: true }])

const pageError = ref('')
const actionLoading = ref('')
const jobDetail = ref<Record<string, any> | null>(null)
const settlement = ref<Record<string, any> | null>(null)
const assignments = ref<Array<Record<string, any>>>([])
const files = ref<Array<Record<string, any>>>([])
const proofFile = ref<File | null>(null)

async function loadDetail() {
  pageError.value = ''
  try {
    const payload = await fetchDashboardDetail('production', section, id)
    jobDetail.value = payload?.job || null
    settlement.value = await fetchManagedJobSettlement(id)
    assignments.value = await fetchShopAssignments()
    files.value = await fetchManagedJobFiles(id)
  } catch (error: unknown) {
    pageError.value = getApiErrorMessage(error, 'Production detail is unavailable right now.')
  }
}

await loadDetail()

const activeAssignment = computed(() => assignments.value.find(item => String(item.managed_job) === id) || null)
const assignmentId = computed(() => activeAssignment.value?.id || null)
const assignmentLabel = computed(() => activeAssignment.value?.status || jobDetail.value?.assignment_status || 'Pending dispatch')
const jobReference = computed(() => jobDetail.value?.reference || `Job ${id}`)
const jobTitle = computed(() => jobDetail.value?.title || 'Production job')
const productionAmountLabel = computed(() => settlement.value?.production_amount ? `KES ${settlement.value.production_amount}` : 'Awaiting dispatch')
const paymentHoldLabel = computed(() => String(jobDetail.value?.payment_status || '').toLowerCase().includes('hold') ? 'On hold' : 'Ready / pending confirmation')
const deadlineLabel = computed(() => jobDetail.value?.requested_deadline ? new Date(jobDetail.value.requested_deadline).toLocaleString() : 'No deadline set')
const workflowLabel = computed(() => jobDetail.value?.workflow_projection?.label || jobDetail.value?.status || 'Pending')

function onProofSelected(event: Event) {
  const input = event.target as HTMLInputElement
  proofFile.value = input.files?.[0] || null
}

async function runAssignmentAction(action: 'accept' | 'reject' | 'in-production' | 'ready' | 'completed' | 'issue') {
  if (!assignmentId.value) {
    return
  }
  const note = action === 'issue' || action === 'reject'
    ? (window.prompt('Add an optional note.') || '')
    : ''
  try {
    actionLoading.value = action
    await updateAssignmentAction(assignmentId.value, action, note)
    await loadDetail()
  } catch (error: unknown) {
    pageError.value = getApiErrorMessage(error, 'Assignment action failed.')
  } finally {
    actionLoading.value = ''
  }
}

async function uploadProof() {
  if (!proofFile.value) {
    return
  }
  try {
    actionLoading.value = 'upload-proof'
    await uploadManagedJobProof(id, proofFile.value)
    proofFile.value = null
    await loadDetail()
  } catch (error: unknown) {
    pageError.value = getApiErrorMessage(error, 'Proof upload failed.')
  } finally {
    actionLoading.value = ''
  }
}
</script>
