<template>
  <DashboardShell sidebar-tone="dark">
    <template #sidebar>
      <ShopSidebarNav />
    </template>

    <div class="space-y-6">
      <DashboardTopBar
        eyebrow="Production"
        title="Assignments"
        description="Move production work from acceptance through completion in one assignment workspace."
      />

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
              <PayoutStatusPanel :settlement="activeSettlement" />
            </div>
            <div class="grid gap-4 md:grid-cols-2">
              <ProofApprovalPanel
                :primary-proof-status="primaryProofStatus"
                :uploading="proofUploading"
                :can-upload="Boolean(proofFile)"
                @proof-selected="onProofSelected"
                @upload-proof="submitProof"
              />
              <ProductionWorkflowBoard :assignments="shopAssignments" />
            </div>

            <div class="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-[0_14px_34px_rgba(15,23,42,0.05)]">
              <p class="text-[10px] font-bold uppercase tracking-[0.24em] text-slate-500">Controlled actions</p>
              <h3 class="mt-2 text-base font-semibold text-slate-950">Update production status</h3>
              <div class="mt-5 flex flex-wrap gap-3">
                <BaseButton size="sm" variant="primary" @click="runAction('accept')">Accept</BaseButton>
                <BaseButton size="sm" variant="secondary" @click="runAction('in_production')">Mark in production</BaseButton>
                <BaseButton size="sm" variant="secondary" @click="runAction('ready')">Mark ready</BaseButton>
                <BaseButton size="sm" variant="secondary" @click="runAction('completed')">Mark completed</BaseButton>
                <BaseButton size="sm" variant="ghost" @click="runAction('reject')">Reject</BaseButton>
                <BaseButton size="sm" variant="ghost" @click="runAction('issue')">Report issue</BaseButton>
              </div>
            </div>

            <ArtworkDownloadCenter :files="activeFiles">
              <template #actions="{ file }">
                <div class="flex flex-wrap gap-2">
                  <BaseButton size="sm" variant="ghost" @click="runFileAction(file.id, 'approve')">Approve</BaseButton>
                  <BaseButton size="sm" variant="ghost" @click="runFileAction(file.id, 'revision')">Request revision</BaseButton>
                  <BaseButton size="sm" variant="ghost" @click="runFileAction(file.id, 'print_ready')">Print ready</BaseButton>
                </div>
              </template>
            </ArtworkDownloadCenter>
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
import WorkflowTimeline from '~/components/workflow/WorkflowTimeline.vue'
import BaseButton from '~/components/ui/BaseButton.vue'
import { useWorkflowSpineStore } from '~/stores/workflowSpine'
import { buildAssignmentTimeline } from '~/utils/workflowUi'

definePageMeta({ layout: 'dashboard' })

const workflowStore = useWorkflowSpineStore()
const toast = usePrintyToast()
const { shopAssignments, filesByJob, eventsByJob, settlementByJob } = storeToRefs(workflowStore)

const selectedAssignmentId = ref<number | null>(null)
const proofFile = ref<File | null>(null)
const proofUploading = ref(false)

const selectedAssignment = computed(() => shopAssignments.value.find(item => item.id === selectedAssignmentId.value) ?? null)
const selectedJobId = computed(() => selectedAssignment.value?.managed_job ?? null)
const activeFiles = computed(() => (selectedJobId.value ? filesByJob.value[selectedJobId.value] ?? [] : []))
const activeSettlement = computed(() => (selectedJobId.value ? settlementByJob.value[selectedJobId.value] ?? null : null))
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
  await workflowStore.fetchShopAssignments()
  if (!selectedAssignmentId.value && shopAssignments.value.length) {
    selectedAssignmentId.value = shopAssignments.value[0]?.id ?? null
  }
}

watch(selectedJobId, async (jobId) => {
  if (!jobId) return
  await Promise.all([
    workflowStore.fetchJobFiles(jobId),
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
