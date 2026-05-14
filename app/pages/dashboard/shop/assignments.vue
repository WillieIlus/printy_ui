<template>
  <DashboardShell sidebar-tone="dark">
    <template #sidebar>
      <ShopSidebarNav />
    </template>

    <div class="space-y-6">
      <DashboardTopBar
        eyebrow="Production workspace"
        title="Assignments"
        description="This is the primary production workspace for assignment acceptance, proofs, files, deadlines, and payout readiness."
        action-label="Open overview"
        @action="navigateTo('/dashboard/shop')"
      />

      <section class="rounded-3xl bg-slate-950 p-6 text-white ring-1 ring-white/10">
        <div class="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div class="space-y-2">
            <p class="text-[10px] font-bold uppercase tracking-[0.28em] text-slate-400">Factory operations</p>
            <h2 class="text-2xl font-semibold tracking-tight">Run the floor from assignments, not quote replies.</h2>
            <p class="max-w-3xl text-sm leading-6 text-slate-300">
              Each assignment keeps production state, proofs, files, deadlines, and payout status in one controlled workspace.
            </p>
          </div>
          <div class="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-200">
            No client direct contact, no partner margin, no client selling price.
          </div>
        </div>
      </section>

      <section class="grid gap-4 md:grid-cols-4">
        <article
          v-for="card in summaryCards"
          :key="card.label"
          class="rounded-3xl border border-[var(--p-border)] bg-[var(--p-surface)] p-5"
        >
          <p class="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--p-text-muted)]">{{ card.label }}</p>
          <p class="mt-3 text-2xl font-semibold text-[var(--p-text)]">{{ card.value }}</p>
          <p class="mt-2 text-sm text-[var(--p-text-muted)]">{{ card.helper }}</p>
        </article>
      </section>

      <div class="grid gap-6 xl:grid-cols-[0.94fr_1.06fr]">
        <AssignmentQueue :assignments="shopAssignments" :selected-id="selectedAssignmentId" @select="selectedAssignmentId = $event" />

        <section class="space-y-6">
          <template v-if="selectedAssignment">
            <AssignmentCard :assignment="selectedAssignment" />
            <WorkflowTimeline eyebrow="Production flow" title="Assignment timeline" :items="timelineItems" />
            <div class="grid gap-4 md:grid-cols-2">
              <ProductionSummaryCard :assignment="selectedAssignment" />
              <div id="payouts">
                <PayoutStatusPanel :settlement="activeSettlement" />
              </div>
            </div>
            <div class="grid gap-4 md:grid-cols-2">
              <WorkflowDeliveryStatusCard :job="activeJobRecord" :events="activeEvents" />
              <PaybillReferenceCard :payments="activePayments" />
            </div>
            <div class="grid gap-4 md:grid-cols-2">
              <ProofApprovalPanel
                :primary-proof-status="primaryProofStatus"
                :uploading="proofUploading"
                :can-upload="Boolean(proofFile)"
                @proof-selected="onProofSelected"
                @upload-proof="submitProof"
              />
              <MachineUtilizationPanel :assignments="shopAssignments" />
            </div>
            <ProductionWorkflowBoard :assignments="shopAssignments" />

            <div class="grid gap-4 md:grid-cols-2">
              <section class="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-[0_14px_34px_rgba(15,23,42,0.05)]">
                <p class="text-[10px] font-bold uppercase tracking-[0.24em] text-slate-500">Production detail</p>
                <h3 class="mt-2 text-base font-semibold text-slate-950">Assignment detail panel</h3>
                <div class="mt-5 grid gap-3 md:grid-cols-2">
                  <div class="rounded-2xl border border-slate-200 bg-slate-50/80 p-4">
                    <p class="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">Assignment</p>
                    <p class="mt-2 text-sm font-semibold text-slate-950">{{ selectedAssignment.managed_reference || `Assignment #${selectedAssignment.id}` }}</p>
                    <p class="mt-2 text-sm text-slate-500">{{ humanizeWorkflowValue(selectedAssignment.status) }}</p>
                  </div>
                  <div class="rounded-2xl border border-slate-200 bg-slate-50/80 p-4">
                    <p class="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">Deadline</p>
                    <p class="mt-2 text-sm font-semibold text-slate-950">{{ formatWorkflowDate(selectedAssignment.due_at || selectedAssignment.requested_deadline) }}</p>
                    <p class="mt-2 text-sm text-slate-500">Keep proof and production updates aligned to this operational cutoff.</p>
                  </div>
                  <div class="rounded-2xl border border-slate-200 bg-slate-50/80 p-4">
                    <p class="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">Assigned shop</p>
                    <p class="mt-2 text-sm font-semibold text-slate-950">{{ selectedAssignment.shop_name || 'Current production workspace' }}</p>
                    <p class="mt-2 text-sm text-slate-500">Operational contact remains inside managed workflow channels only.</p>
                  </div>
                  <div class="rounded-2xl border border-slate-200 bg-slate-50/80 p-4">
                    <p class="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">Visible payout</p>
                    <p class="mt-2 text-sm font-semibold text-slate-950">{{ formatWorkflowMoney(activeSettlement?.production_amount) }}</p>
                    <p class="mt-2 text-sm text-slate-500">Client selling price and partner margin remain hidden from the shop workspace.</p>
                  </div>
                  <div class="rounded-2xl border border-slate-200 bg-slate-50/80 p-4">
                    <p class="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">Artwork pack</p>
                    <p class="mt-2 text-sm font-semibold text-slate-950">{{ activeFiles.length }} file{{ activeFiles.length === 1 ? '' : 's' }} attached</p>
                    <p class="mt-2 text-sm text-slate-500">Customer uploads, proofs, and print-ready files stay attached to this assignment workspace.</p>
                  </div>
                  <div class="rounded-2xl border border-slate-200 bg-slate-50/80 p-4">
                    <p class="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">Proof state</p>
                    <p class="mt-2 text-sm font-semibold text-slate-950">{{ humanizeWorkflowValue(primaryProofStatus) }}</p>
                    <p class="mt-2 text-sm text-slate-500">Prepress decisions remain controlled through the managed proof lifecycle.</p>
                  </div>
                  <div class="rounded-2xl border border-slate-200 bg-slate-50/80 p-4 md:col-span-2">
                    <p class="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">Assignment notes</p>
                    <p class="mt-2 text-sm text-slate-600">{{ selectedAssignment.assignment_notes || 'No additional assignment notes have been attached yet.' }}</p>
                  </div>
                </div>
              </section>

              <section class="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-[0_14px_34px_rgba(15,23,42,0.05)]">
                <div class="flex items-start justify-between gap-3">
                  <div>
                    <p class="text-[10px] font-bold uppercase tracking-[0.24em] text-slate-500">Internal workflow thread</p>
                    <h3 class="mt-2 text-base font-semibold text-slate-950">Managed coordination updates</h3>
                  </div>
                  <span class="rounded-full bg-slate-100 px-3 py-1 text-[10px] font-semibold text-slate-700">No unmanaged customer contact</span>
                </div>

                <div v-if="activeEvents.length" class="mt-5 space-y-3">
                  <article
                    v-for="event in activeEvents.slice(0, 4)"
                    :key="event.id"
                    class="rounded-2xl border border-slate-200 bg-slate-50/80 p-4"
                  >
                    <div class="flex flex-wrap items-center justify-between gap-2">
                      <p class="text-sm font-semibold text-slate-950">{{ event.summary || humanizeWorkflowValue(event.event_type) }}</p>
                      <span class="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">{{ formatWorkflowDate(event.created_at) }}</span>
                    </div>
                    <p class="mt-2 text-sm text-slate-500">{{ event.actor_name || 'Printy workflow' }}</p>
                  </article>
                </div>

                <div v-else class="mt-5 rounded-2xl border border-dashed border-slate-200 px-5 py-10 text-center">
                  <p class="text-sm font-semibold text-slate-950">No workflow updates yet</p>
                  <p class="mt-2 text-sm text-slate-500">Assignment actions, proof decisions, and production milestones will appear here.</p>
                </div>
              </section>
            </div>

            <AssignmentActionButtons :status="selectedAssignment.status" @action="runAction" />

            <div id="files">
              <ArtworkDownloadCenter :files="activeFiles">
                <template #actions="{ file }">
                  <div class="flex flex-wrap gap-2">
                    <BaseButton size="sm" variant="ghost" @click="runFileAction(file.id, 'approve')">Approve</BaseButton>
                    <BaseButton size="sm" variant="ghost" @click="runFileAction(file.id, 'revision')">Request revision</BaseButton>
                    <BaseButton size="sm" variant="ghost" @click="runFileAction(file.id, 'print_ready')">Print ready</BaseButton>
                  </div>
                </template>
              </ArtworkDownloadCenter>
            </div>
          </template>

          <div v-else class="rounded-3xl border border-dashed border-[var(--p-border)] bg-[var(--p-surface)] px-5 py-10 text-center">
            <p class="text-sm font-semibold text-[var(--p-text)]">Select an assignment</p>
            <p class="mt-2 text-sm text-[var(--p-text-muted)]">Choose an assignment to view the production timeline, files, proofs, and payout status.</p>
          </div>
        </section>
      </div>
    </div>
  </DashboardShell>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { usePrintyToast } from '~/composables/usePrintyToast'
import AssignmentActionButtons from '~/components/dashboard/shop/AssignmentActionButtons.vue'
import AssignmentQueue from '~/components/dashboard/shop/AssignmentQueue.vue'
import ArtworkDownloadCenter from '~/components/dashboard/shop/ArtworkDownloadCenter.vue'
import MachineUtilizationPanel from '~/components/dashboard/shop/MachineUtilizationPanel.vue'
import PayoutStatusPanel from '~/components/dashboard/shop/PayoutStatusPanel.vue'
import ProductionSummaryCard from '~/components/dashboard/shop/ProductionSummaryCard.vue'
import ProductionWorkflowBoard from '~/components/dashboard/shop/ProductionWorkflowBoard.vue'
import ProofApprovalPanel from '~/components/dashboard/shop/ProofApprovalPanel.vue'
import DashboardShell from '~/components/dashboard/shared/DashboardShell.vue'
import DashboardTopBar from '~/components/dashboard/shared/DashboardTopBar.vue'
import ShopSidebarNav from '~/components/dashboard/shop/ShopSidebarNav.vue'
import AssignmentCard from '~/components/workflow/AssignmentCard.vue'
import PaybillReferenceCard from '~/components/workflow/PaybillReferenceCard.vue'
import WorkflowDeliveryStatusCard from '~/components/workflow/DeliveryStatusCard.vue'
import WorkflowTimeline from '~/components/workflow/WorkflowTimeline.vue'
import BaseButton from '~/components/ui/BaseButton.vue'
import { useWorkflowSpineStore } from '~/stores/workflowSpine'
import { buildAssignmentTimeline, formatWorkflowDate, formatWorkflowMoney, humanizeWorkflowValue } from '~/utils/workflowUi'

definePageMeta({ layout: 'dashboard' })

const workflowStore = useWorkflowSpineStore()
const toast = usePrintyToast()
const { managedJobs, shopAssignments, filesByJob, paymentsByJob, eventsByJob, settlementByJob } = storeToRefs(workflowStore)

const selectedAssignmentId = ref<number | null>(null)
const proofFile = ref<File | null>(null)
const proofUploading = ref(false)

const selectedAssignment = computed(() => shopAssignments.value.find(item => item.id === selectedAssignmentId.value) ?? null)
const selectedJobId = computed(() => selectedAssignment.value?.managed_job ?? null)
const activeJobRecord = computed(() => managedJobs.value.find(job => job.id === selectedJobId.value) ?? { id: selectedJobId.value ?? 0 })
const activeFiles = computed(() => (selectedJobId.value ? filesByJob.value[selectedJobId.value] ?? [] : []))
const activePayments = computed(() => (selectedJobId.value ? paymentsByJob.value[selectedJobId.value] ?? [] : []))
const activeSettlement = computed(() => (selectedJobId.value ? settlementByJob.value[selectedJobId.value] ?? null : null))
const activeEvents = computed(() => (selectedJobId.value ? eventsByJob.value[selectedJobId.value] ?? [] : []))
const timelineItems = computed(() => buildAssignmentTimeline(selectedAssignment.value))
const primaryProofStatus = computed(() => activeFiles.value.find(file => ['proof', 'print_ready'].includes(String(file.file_type ?? '')))?.status ?? 'proof_uploaded')

const summaryCards = computed(() => {
  const items = shopAssignments.value
  return [
    { label: 'Assignments', value: String(items.length), helper: 'Managed jobs assigned to this shop.' },
    { label: 'Pending', value: String(items.filter(item => String(item.status ?? '') === 'pending').length), helper: 'Assignments waiting for a production decision.' },
    { label: 'In production', value: String(items.filter(item => String(item.status ?? '') === 'in_production').length), helper: 'Assignments currently moving through production.' },
    { label: 'Ready or done', value: String(items.filter(item => ['ready', 'completed'].includes(String(item.status ?? ''))).length), helper: 'Assignments nearing handoff or already completed.' },
  ]
})

async function load() {
  await Promise.all([
    workflowStore.fetchShopAssignments(),
    workflowStore.fetchManagedJobs(),
  ])
  if (!selectedAssignmentId.value && shopAssignments.value.length) {
    selectedAssignmentId.value = shopAssignments.value[0]?.id ?? null
  }
}

watch(selectedJobId, async (jobId) => {
  if (!jobId) return
  await Promise.all([
    workflowStore.fetchJobFiles(jobId),
    workflowStore.fetchJobPayments(jobId),
    workflowStore.fetchJobEvents(jobId),
    workflowStore.fetchJobSettlement(jobId),
  ])
}, { immediate: true })

async function runAction(action: 'accept' | 'reject' | 'in_production' | 'ready' | 'completed' | 'issue') {
  if (!selectedAssignmentId.value) return
  try {
    const assignment = await workflowStore.performAssignmentAction(selectedAssignmentId.value, action)
    toast.success('Assignment updated.', `${action.replace(/_/g, ' ')} applied to ${assignment.managed_reference || `assignment #${assignment.id}`}.`, { context: 'dashboard' })
    if (assignment.managed_job) {
      await Promise.all([
        workflowStore.fetchShopAssignments(),
        workflowStore.fetchJobEvents(assignment.managed_job),
      ])
    }
  } catch (error) {
    toast.error('Assignment update failed.', error instanceof Error ? error.message : 'Could not update assignment.', { context: 'dashboard' })
  }
}

async function runFileAction(fileId: number, action: 'approve' | 'reject' | 'revision' | 'print_ready') {
  if (!selectedJobId.value) return
  try {
    await workflowStore.performFileAction(fileId, action)
    await Promise.all([
      workflowStore.fetchJobFiles(selectedJobId.value),
      workflowStore.fetchJobEvents(selectedJobId.value),
    ])
    toast.success('File updated.', `${action.replace(/_/g, ' ')} applied to the selected file.`, { context: 'dashboard' })
  } catch (error) {
    toast.error('File update failed.', error instanceof Error ? error.message : 'Could not update file state.', { context: 'dashboard' })
  }
}

function onProofSelected(event: Event) {
  const input = event.target as HTMLInputElement | null
  proofFile.value = input?.files?.[0] ?? null
}

async function submitProof() {
  if (!selectedJobId.value || !proofFile.value) return
  proofUploading.value = true
  try {
    await workflowStore.uploadProof(selectedJobId.value, proofFile.value)
    await Promise.all([
      workflowStore.fetchJobFiles(selectedJobId.value),
      workflowStore.fetchJobEvents(selectedJobId.value),
    ])
    proofFile.value = null
    toast.success('Proof uploaded.', 'The job files have been updated.', { context: 'upload' })
  } catch (error) {
    toast.error('Proof upload failed.', error instanceof Error ? error.message : 'Could not upload proof.', { context: 'upload' })
  } finally {
    proofUploading.value = false
  }
}

onMounted(() => {
  load().catch(() => undefined)
})
</script>
