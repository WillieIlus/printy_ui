<template>
  <DashboardShell sidebar-tone="light">
    <template #sidebar>
      <ClientSidebarNav />
    </template>

    <div class="space-y-6">
      <DashboardTopBar
        eyebrow="Client"
        title="Overview"
        description="Active jobs come first, with earlier quote requests still available in your history."
        action-label="Start new request"
      />

      <section class="grid gap-4 md:grid-cols-3">
        <article
          v-for="card in summaryCards"
          :key="card.label"
          class="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-[0_12px_30px_rgba(15,23,42,0.05)]"
        >
          <p class="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">{{ card.label }}</p>
          <p class="mt-3 text-2xl font-semibold tracking-tight text-slate-950">{{ card.value }}</p>
          <p class="mt-2 text-sm leading-6 text-slate-500">{{ card.helper }}</p>
        </article>
      </section>

      <div class="grid gap-6 xl:grid-cols-[1.08fr_0.92fr]">
        <section class="space-y-4">
          <ManagedJobCard
            v-if="featuredJob"
            :job="featuredJob"
            counterparty-label="Managed by Printy"
          />
          <JobStatusTimeline v-if="featuredJob" :job="featuredJob" />
          <section class="grid gap-4 md:grid-cols-2">
            <PaymentStatusCard
              v-if="featuredJob"
              :job="featuredJob"
              :settlement="featuredSettlement"
              :submitting="paymentSubmitting"
              @stk-push="handleStkPush"
            />
            <DeliveryStatusCard v-if="featuredJob" :job="featuredJob" :events="featuredEvents" />
          </section>
        </section>

        <section class="space-y-4">
          <ArtworkProofPanel :files="featuredFiles" />
          <ReorderCard />
        </section>
      </div>

      <div class="grid gap-6 xl:grid-cols-[1.5fr_0.5fr]">
        <ClientRequestInbox />
        <div class="space-y-6">
          <ClientDraftRecoveryPanel />
          <ClientQuickActions />
        </div>
      </div>

      <ClientWhatsappStrip />
    </div>
  </DashboardShell>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import ArtworkProofPanel from '~/components/dashboard/client/ArtworkProofPanel.vue'
import ClientDraftRecoveryPanel from '~/components/dashboard/client/ClientDraftRecoveryPanel.vue'
import DeliveryStatusCard from '~/components/dashboard/client/DeliveryStatusCard.vue'
import JobStatusTimeline from '~/components/dashboard/client/JobStatusTimeline.vue'
import PaymentStatusCard from '~/components/dashboard/client/PaymentStatusCard.vue'
import ClientQuickActions from '~/components/dashboard/client/ClientQuickActions.vue'
import ClientRequestInbox from '~/components/dashboard/client/ClientRequestInbox.vue'
import ReorderCard from '~/components/dashboard/client/ReorderCard.vue'
import ClientSidebarNav from '~/components/dashboard/client/ClientSidebarNav.vue'
import ClientWhatsappStrip from '~/components/dashboard/client/ClientWhatsappStrip.vue'
import DashboardShell from '~/components/dashboard/shared/DashboardShell.vue'
import DashboardTopBar from '~/components/dashboard/shared/DashboardTopBar.vue'
import ManagedJobCard from '~/components/workflow/ManagedJobCard.vue'
import { useQuoteInboxStore } from '~/stores/quoteInbox'
import { useWorkflowSpineStore } from '~/stores/workflowSpine'

definePageMeta({
  layout: 'dashboard',
})

const workflowStore = useWorkflowSpineStore()
const quoteInboxStore = useQuoteInboxStore()
const { managedJobs, filesByJob, settlementByJob, eventsByJob } = storeToRefs(workflowStore)
const { clientRequests, draftFiles } = storeToRefs(quoteInboxStore)
const paymentSubmitting = ref(false)

const featuredJob = computed(() => managedJobs.value[0] ?? null)
const featuredSettlement = computed(() => featuredJob.value ? settlementByJob.value[featuredJob.value.id] ?? null : null)
const featuredFiles = computed(() => featuredJob.value ? filesByJob.value[featuredJob.value.id] ?? [] : [])
const featuredEvents = computed(() => featuredJob.value ? eventsByJob.value[featuredJob.value.id] ?? [] : [])

const summaryCards = computed(() => [
  {
    label: 'Managed jobs',
    value: String(managedJobs.value.length),
    helper: 'Accepted work tracked through payment confirmation, production, and completion.',
  },
  {
    label: 'Need attention',
    value: String(managedJobs.value.filter(job => ['awaiting_payment', 'pending'].includes(String(job.payment_status ?? ''))).length),
    helper: 'Jobs still waiting on payment confirmation or the next production update.',
  },
  {
    label: 'Intake still open',
    value: String(clientRequests.value.filter(request => request.status !== 'accepted').length + draftFiles.value.length),
    helper: 'Drafts and quote requests that have not turned into active jobs yet.',
  },
])

async function handleStkPush(phone: string) {
  if (!featuredJob.value) return
  paymentSubmitting.value = true
  try {
    await workflowStore.initiateJobStkPush(featuredJob.value.id, phone, featuredSettlement.value?.client_total ?? undefined)
  } finally {
    paymentSubmitting.value = false
  }
}

async function load() {
  await Promise.allSettled([
    workflowStore.fetchManagedJobs(),
    quoteInboxStore.fetchClientRequests(),
    quoteInboxStore.fetchDraftFiles('dashboard'),
  ])
  if (featuredJob.value) {
    await workflowStore.hydrateJob(featuredJob.value.id)
  }
}

watch(featuredJob, async (job) => {
  if (!job) return
  await workflowStore.hydrateJob(job.id)
})

onMounted(() => {
  void load()
})
</script>
