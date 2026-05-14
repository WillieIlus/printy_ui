<template>
  <DashboardShell sidebar-tone="light">
    <template #sidebar>
      <ClientSidebarNav />
    </template>

    <div class="space-y-6">
      <DashboardTopBar
        eyebrow="Your orders"
        title="Client workspace"
        description="Track current print jobs, payment, proofs, and delivery in one place."
        action-label="View all jobs"
        @action="navigateTo('/dashboard/client/jobs')"
      />

      <section class="rounded-[2rem] border border-slate-200 bg-[#101828] p-6 text-white shadow-[0_20px_48px_rgba(15,23,42,0.2)]">
        <div class="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div class="space-y-2">
            <p class="text-[10px] font-bold uppercase tracking-[0.28em] text-white/60">Active jobs</p>
            <h2 class="text-2xl font-semibold tracking-tight">Keep every live order in one clear queue.</h2>
            <p class="max-w-2xl text-sm leading-6 text-slate-300">
              See what needs payment, review proofs, follow delivery updates, and place repeat orders without digging through older quote threads.
            </p>
          </div>
          <div class="flex flex-wrap gap-2">
            <BaseButton variant="primary" to="/dashboard/client/jobs">Open current jobs</BaseButton>
            <BaseButton variant="secondary" to="/">Start new request</BaseButton>
          </div>
        </div>
      </section>

      <section class="grid gap-4 md:grid-cols-4">
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

      <section class="grid gap-4 xl:grid-cols-4">
        <NuxtLink
          v-for="shortcut in workspaceShortcuts"
          :key="shortcut.title"
          :to="shortcut.to"
          class="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-[0_12px_30px_rgba(15,23,42,0.05)] transition hover:-translate-y-0.5 hover:shadow-[0_16px_36px_rgba(15,23,42,0.08)]"
        >
          <div class="flex items-start justify-between gap-3">
            <div class="space-y-2">
              <p class="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">{{ shortcut.eyebrow }}</p>
              <h3 class="text-base font-semibold text-slate-950">{{ shortcut.title }}</h3>
            </div>
            <Icon :name="shortcut.icon" class="size-5 text-slate-400" />
          </div>
          <p class="mt-4 text-sm leading-6 text-slate-500">{{ shortcut.body }}</p>
          <p class="mt-4 text-sm font-semibold text-[var(--p-primary)]">{{ shortcut.cta }}</p>
        </NuxtLink>
      </section>

      <div class="grid gap-6 xl:grid-cols-[1.08fr_0.92fr]">
        <section class="space-y-4">
          <ManagedJobCard
            v-if="featuredJob"
            :job="featuredJob"
            counterparty-label="Current order"
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
          <ProofApprovalPanel :files="featuredFiles" />
          <JobFilesPanel :files="featuredFiles" />
          <ReorderCard />
        </section>
      </div>

      <div class="grid gap-6 xl:grid-cols-[1.5fr_0.5fr]">
        <section class="space-y-3">
          <div class="space-y-1">
            <p class="text-[10px] font-bold uppercase tracking-[0.24em] text-slate-500">Quote intake</p>
            <h3 class="text-lg font-semibold tracking-tight text-slate-950">Requests that are still waiting for pricing</h3>
            <p class="text-sm leading-6 text-slate-500">Use this area for new requests and pending quotes before they become active jobs.</p>
          </div>
          <ClientRequestInbox />
        </section>
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
import ClientDraftRecoveryPanel from '~/components/dashboard/client/ClientDraftRecoveryPanel.vue'
import DeliveryStatusCard from '~/components/dashboard/client/DeliveryStatusCard.vue'
import JobFilesPanel from '~/components/dashboard/client/JobFilesPanel.vue'
import JobStatusTimeline from '~/components/dashboard/client/JobStatusTimeline.vue'
import PaymentStatusCard from '~/components/dashboard/client/PaymentStatusCard.vue'
import ProofApprovalPanel from '~/components/dashboard/client/ProofApprovalPanel.vue'
import ClientQuickActions from '~/components/dashboard/client/ClientQuickActions.vue'
import ClientRequestInbox from '~/components/dashboard/client/ClientRequestInbox.vue'
import ReorderCard from '~/components/dashboard/client/ReorderCard.vue'
import ClientSidebarNav from '~/components/dashboard/client/ClientSidebarNav.vue'
import ClientWhatsappStrip from '~/components/dashboard/client/ClientWhatsappStrip.vue'
import DashboardShell from '~/components/dashboard/shared/DashboardShell.vue'
import DashboardTopBar from '~/components/dashboard/shared/DashboardTopBar.vue'
import ManagedJobCard from '~/components/workflow/ManagedJobCard.vue'
import BaseButton from '~/components/ui/BaseButton.vue'
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
    helper: 'Orders that are already live in production or delivery.',
  },
  {
    label: 'Payment to confirm',
    value: String(managedJobs.value.filter(job => ['awaiting_payment', 'pending', 'manual_payment_pending'].includes(String(job.payment_status ?? ''))).length),
    helper: 'Orders still waiting for payment confirmation.',
  },
  {
    label: 'Proofs and files',
    value: String(featuredFiles.value.length),
    helper: 'Files currently attached to the order you are viewing.',
  },
  {
    label: 'Quote intake',
    value: String(clientRequests.value.filter(request => request.status !== 'accepted').length + draftFiles.value.length),
    helper: 'Requests and drafts that have not turned into active jobs yet.',
  },
])

const workspaceShortcuts = computed(() => [
  {
    eyebrow: 'Timeline',
    title: 'Follow job progress',
    body: 'See where each order sits between payment, proof review, production, and handoff.',
    cta: 'Open current jobs',
    to: '/dashboard/client/jobs',
    icon: 'lucide:map',
  },
  {
    eyebrow: 'Proofs',
    title: 'Review artwork',
    body: 'Check proof files, approve revisions, and keep the latest version attached to the order.',
    cta: 'Go to proofs',
    to: '/dashboard/client/jobs',
    icon: 'lucide:file-check-2',
  },
  {
    eyebrow: 'Delivery',
    title: 'Track handoff',
    body: 'See whether your order is ready for pickup, rider handoff, or final delivery.',
    cta: 'See delivery status',
    to: '/dashboard/client/jobs',
    icon: 'lucide:truck',
  },
  {
    eyebrow: 'Support',
    title: 'Get help fast',
    body: 'Reach Printy support when you need help with payment, proofs, or delivery updates.',
    cta: 'Open support options',
    to: '/dashboard/client/account',
    icon: 'lucide:life-buoy',
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
