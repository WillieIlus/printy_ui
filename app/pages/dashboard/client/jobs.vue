<template>
  <DashboardShell sidebar-tone="light">
    <template #sidebar>
      <ClientSidebarNav />
    </template>

    <div class="space-y-6">
      <DashboardTopBar
        eyebrow="Client"
        title="Managed jobs"
        description="Track payment, proofs, delivery, and repeat orders from one job workspace."
      />

      <section class="grid gap-4 md:grid-cols-3">
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

      <div class="grid gap-6 xl:grid-cols-[0.92fr_1.08fr]">
        <section class="rounded-3xl border border-[var(--p-border)] bg-[var(--p-surface)] p-6">
          <div class="flex items-start justify-between gap-4">
            <div>
              <p class="text-sm font-semibold text-[var(--p-text)]">Managed queue</p>
              <p class="mt-1 text-sm text-[var(--p-text-muted)]">Your active jobs appear here first, with earlier quote requests kept in history.</p>
            </div>
          </div>

          <div v-if="loading && !managedJobs.length" class="mt-5 space-y-3">
            <div v-for="index in 3" :key="index" class="h-24 animate-pulse rounded-2xl bg-[var(--p-bg-soft)]" />
          </div>

          <div v-else-if="managedJobs.length" class="mt-5 space-y-3">
            <button
              v-for="job in managedJobs"
              :key="job.id"
              type="button"
              class="w-full rounded-2xl text-left"
              @click="selectedJobId = job.id"
            >
              <ManagedJobCard
                :job="job"
                :counterparty-label="job.id === selectedJobId ? 'Selected managed job' : 'Managed by Printy'"
              />
            </button>
          </div>

          <div v-else class="mt-5 rounded-2xl border border-dashed border-[var(--p-border)] px-5 py-10 text-center">
            <p class="text-sm font-semibold text-[var(--p-text)]">No managed jobs yet</p>
            <p class="mt-2 text-sm text-[var(--p-text-muted)]">Accepted quotes that move into managed execution will appear here.</p>
          </div>
        </section>

        <section class="space-y-6">
          <div v-if="selectedJob" class="space-y-6">
            <JobStatusTimeline :job="selectedJob" />
            <div class="grid gap-4 md:grid-cols-2">
              <PaymentStatusCard :job="selectedJob" :settlement="activeSettlement" :submitting="paymentSubmitting" @stk-push="handleStkPush" />
              <DeliveryStatusCard :job="selectedJob" :events="activeEvents" />
            </div>
            <ArtworkProofPanel :files="activeFiles" />
            <SettlementSummary :settlement="activeSettlement" audience="client" />
            <ReorderCard />
          </div>

          <div v-else class="rounded-3xl border border-dashed border-[var(--p-border)] bg-[var(--p-surface)] px-5 py-10 text-center">
            <p class="text-sm font-semibold text-[var(--p-text)]">Select a job</p>
            <p class="mt-2 text-sm text-[var(--p-text-muted)]">Choose a job from the queue to inspect payment, proofs, and progress updates.</p>
          </div>
        </section>
      </div>
    </div>
  </DashboardShell>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import ArtworkProofPanel from '~/components/dashboard/client/ArtworkProofPanel.vue'
import DeliveryStatusCard from '~/components/dashboard/client/DeliveryStatusCard.vue'
import JobStatusTimeline from '~/components/dashboard/client/JobStatusTimeline.vue'
import PaymentStatusCard from '~/components/dashboard/client/PaymentStatusCard.vue'
import ReorderCard from '~/components/dashboard/client/ReorderCard.vue'
import ClientSidebarNav from '~/components/dashboard/client/ClientSidebarNav.vue'
import DashboardShell from '~/components/dashboard/shared/DashboardShell.vue'
import DashboardTopBar from '~/components/dashboard/shared/DashboardTopBar.vue'
import ManagedJobCard from '~/components/workflow/ManagedJobCard.vue'
import SettlementSummary from '~/components/workflow/SettlementSummary.vue'
import { useWorkflowSpineStore } from '~/stores/workflowSpine'

definePageMeta({ layout: 'dashboard' })

const workflowStore = useWorkflowSpineStore()
const { managedJobs, filesByJob, settlementByJob, eventsByJob, loading } = storeToRefs(workflowStore)
const selectedJobId = ref<number | null>(null)
const paymentSubmitting = ref(false)

const selectedJob = computed(() => managedJobs.value.find(job => job.id === selectedJobId.value) ?? null)
const activeFiles = computed(() => (selectedJobId.value ? filesByJob.value[selectedJobId.value] ?? [] : []))
const activeSettlement = computed(() => (selectedJobId.value ? settlementByJob.value[selectedJobId.value] ?? null : null))
const activeEvents = computed(() => (selectedJobId.value ? eventsByJob.value[selectedJobId.value] ?? [] : []))

const summaryCards = computed(() => {
  const jobs = managedJobs.value
  const activeCount = jobs.filter(job => !['completed', 'cancelled'].includes(String(job.status ?? ''))).length
  const awaitingPayment = jobs.filter(job => String(job.payment_status ?? '') === 'awaiting_payment').length
  const proofReview = jobs.filter(job =>
    (filesByJob.value[job.id] ?? []).some(file => ['proof_uploaded', 'revision_requested'].includes(String(file.status ?? ''))),
  ).length

  return [
    { label: 'Managed jobs', value: String(jobs.length), helper: 'Accepted quotes that are now active jobs.' },
    { label: 'Active jobs', value: String(activeCount), helper: 'Jobs still moving through payment, production, or delivery.' },
    { label: 'Need review', value: String(awaitingPayment + proofReview), helper: 'Payments waiting or proofs needing a client decision.' },
  ]
})

async function load() {
  await workflowStore.fetchManagedJobs()
  if (!selectedJobId.value && managedJobs.value.length) {
    selectedJobId.value = managedJobs.value[0]?.id ?? null
  }
}

async function handleStkPush(phone: string) {
  if (!selectedJob.value) return
  paymentSubmitting.value = true
  try {
    await workflowStore.initiateJobStkPush(selectedJob.value.id, phone, activeSettlement.value?.client_total ?? undefined)
  } finally {
    paymentSubmitting.value = false
  }
}

watch(selectedJobId, async (jobId) => {
  if (!jobId) return
  await workflowStore.hydrateJob(jobId)
}, { immediate: true })

onMounted(() => {
  load().catch(() => undefined)
})
</script>
