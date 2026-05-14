<template>
  <DashboardShell sidebar-tone="light">
    <template #sidebar>
      <ClientSidebarNav />
    </template>

    <div class="space-y-6">
      <DashboardTopBar
        eyebrow="Current orders"
        title="Managed jobs"
        description="Track payment, proofs, delivery, and repeat orders from one order queue."
        action-label="Start new request"
        @action="navigateTo('/')"
      />

      <section class="rounded-3xl border border-slate-200 bg-[#101828] p-6 text-white shadow-[0_20px_48px_rgba(15,23,42,0.18)]">
        <div class="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div class="space-y-2">
            <p class="text-[10px] font-bold uppercase tracking-[0.28em] text-white/60">Order queue</p>
            <h2 class="text-2xl font-semibold tracking-tight">One place for every live print job.</h2>
            <p class="max-w-2xl text-sm leading-6 text-slate-300">
              Keep payment, proof review, delivery status, and reorder actions together without exposing internal production pricing or direct shop contacts.
            </p>
          </div>
          <div class="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-200">
            Select an order from the queue to open its latest status.
          </div>
        </div>
      </section>

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
              <p class="mt-1 text-sm text-[var(--p-text-muted)]">Your active orders appear here first. Quote intake stays separate until a request is accepted.</p>
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
                :counterparty-label="job.id === selectedJobId ? 'Selected order' : 'Current order'"
              />
            </button>
          </div>

          <div v-else class="mt-5 rounded-2xl border border-dashed border-[var(--p-border)] px-5 py-10 text-center">
            <p class="text-sm font-semibold text-[var(--p-text)]">No active jobs yet</p>
            <p class="mt-2 text-sm text-[var(--p-text-muted)]">Once a quote is accepted, your order will appear here with payment, proof, and delivery updates.</p>
          </div>
        </section>

        <section class="space-y-6">
          <div v-if="selectedJob" class="space-y-6">
            <JobStatusTimeline :job="selectedJob" />
            <div class="grid gap-4 md:grid-cols-2">
              <PaymentStatusCard
                :job="selectedJob"
                :settlement="activeSettlement"
                :payments="activePayments"
                :submitting="paymentSubmitting"
                @stk-push="handleStkPush"
                @query="handlePaymentQuery"
              />
              <DeliveryStatusCard :job="selectedJob" :events="activeEvents" />
            </div>
            <PaybillReferenceCard :payments="activePayments" />
            <ProofApprovalPanel :files="activeFiles" />
            <JobFilesPanel :files="activeFiles" />
            <SettlementSummary :settlement="activeSettlement" audience="client" />
            <ReorderCard />
          </div>

          <div v-else class="rounded-3xl border border-dashed border-[var(--p-border)] bg-[var(--p-surface)] px-5 py-10 text-center">
            <p class="text-sm font-semibold text-[var(--p-text)]">Select an order</p>
            <p class="mt-2 text-sm text-[var(--p-text-muted)]">Choose an order from the queue to inspect payment, proofs, delivery, and progress updates.</p>
          </div>
        </section>
      </div>
    </div>
  </DashboardShell>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import DeliveryStatusCard from '~/components/dashboard/client/DeliveryStatusCard.vue'
import JobFilesPanel from '~/components/dashboard/client/JobFilesPanel.vue'
import JobStatusTimeline from '~/components/dashboard/client/JobStatusTimeline.vue'
import PaymentStatusCard from '~/components/dashboard/client/PaymentStatusCard.vue'
import ProofApprovalPanel from '~/components/dashboard/client/ProofApprovalPanel.vue'
import ReorderCard from '~/components/dashboard/client/ReorderCard.vue'
import ClientSidebarNav from '~/components/dashboard/client/ClientSidebarNav.vue'
import DashboardShell from '~/components/dashboard/shared/DashboardShell.vue'
import DashboardTopBar from '~/components/dashboard/shared/DashboardTopBar.vue'
import ManagedJobCard from '~/components/workflow/ManagedJobCard.vue'
import PaybillReferenceCard from '~/components/workflow/PaybillReferenceCard.vue'
import SettlementSummary from '~/components/workflow/SettlementSummary.vue'
import { useWorkflowSpineStore } from '~/stores/workflowSpine'

definePageMeta({ layout: 'dashboard' })

const workflowStore = useWorkflowSpineStore()
const { managedJobs, filesByJob, paymentsByJob, settlementByJob, eventsByJob, loading } = storeToRefs(workflowStore)
const selectedJobId = ref<number | null>(null)
const paymentSubmitting = ref(false)

const selectedJob = computed(() => managedJobs.value.find(job => job.id === selectedJobId.value) ?? null)
const activeFiles = computed(() => (selectedJobId.value ? filesByJob.value[selectedJobId.value] ?? [] : []))
const activePayments = computed(() => (selectedJobId.value ? paymentsByJob.value[selectedJobId.value] ?? [] : []))
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
    await workflowStore.fetchJobPayments(selectedJob.value.id)
  } finally {
    paymentSubmitting.value = false
  }
}

async function handlePaymentQuery(checkoutRequestId: string) {
  if (!selectedJob.value) return
  paymentSubmitting.value = true
  try {
    await workflowStore.queryJobPaymentStatus(selectedJob.value.id, { checkout_request_id: checkoutRequestId })
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
