<template>
  <RoleDashboardFrame
    :nav-items="navItems"
    role-badge="Client"
    :user-name="displayName"
    :user-email="userEmail"
  >
    <template #helperCard>
      <div class="rounded-xl border border-slate-200 bg-gradient-to-br from-slate-50 to-slate-100 p-4">
        <p class="text-sm font-semibold text-slate-900">Need a quote?</p>
        <p class="mt-1 text-xs leading-5 text-slate-500">
          Open a quote thread, review production updates, and pay only when your job is ready.
        </p>
        <NuxtLink to="/dashboard/client/quotes" class="mt-3 inline-flex text-xs font-semibold text-[#e13515] hover:underline">
          Open Quotes
        </NuxtLink>
      </div>
    </template>

    <BaseAlert v-if="pageError" variant="error" title="Client dashboard could not load." :message="pageError" />

    <DashboardPageHeader
      eyebrow="Client Workspace"
      :title="`Welcome back, ${firstName}`"
      subtitle="See the one thing that needs your attention, then review quotes, payments, and job history below."
    >
      <template #actions>
        <BaseButton to="/#live-estimate" variant="primary" size="md">Start a new quote</BaseButton>
        <BaseButton to="/dashboard/client/jobs" variant="ghost" size="md">View history</BaseButton>
      </template>
    </DashboardPageHeader>

    <DashboardSection title="Next action" subtitle="Start here. Printy has picked the most useful next step from your current quote and job state.">
      <div class="rounded-2xl border p-5" :class="primaryActionCardClass">
        <div class="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div class="min-w-0">
            <BaseBadge :variant="primaryAction.badgeVariant" dot>{{ primaryAction.badge }}</BaseBadge>
            <h2 class="mt-3 text-2xl font-black tracking-tight text-[#101828]">{{ primaryAction.title }}</h2>
            <p class="mt-2 max-w-2xl text-sm leading-6 text-[#475467]">{{ primaryAction.description }}</p>
            <div v-if="primaryAction.meta.length" class="mt-4 grid gap-2 sm:grid-cols-2">
              <div v-for="item in primaryAction.meta" :key="item.label" class="rounded-xl border border-white/70 bg-white/70 px-3 py-2">
                <p class="text-[11px] font-bold uppercase tracking-[0.14em] text-[#667085]">{{ item.label }}</p>
                <p class="mt-1 text-sm font-semibold text-[#101828]">{{ item.value }}</p>
              </div>
            </div>
          </div>
          <div class="flex shrink-0 flex-col gap-2 sm:flex-row lg:flex-col">
            <BaseButton v-if="primaryAction.kind === 'draft'" variant="primary" size="lg" @click="openCalculatorPanel">
              {{ primaryAction.actionLabel }}
            </BaseButton>
            <BaseButton v-else :to="primaryAction.actionTo" variant="primary" size="lg">
              {{ primaryAction.actionLabel }}
            </BaseButton>
            <BaseButton v-if="primaryAction.secondaryLabel && primaryAction.secondaryTo" :to="primaryAction.secondaryTo" variant="ghost" size="md">
              {{ primaryAction.secondaryLabel }}
            </BaseButton>
          </div>
        </div>
      </div>
    </DashboardSection>

    <DashboardSection title="Printy flow" subtitle="Your work moves through these stages from request to completion.">
      <div class="grid gap-3 md:grid-cols-5">
        <div
          v-for="step in flowSteps"
          :key="step.step"
          class="rounded-2xl border p-4"
          :class="step.active ? 'border-[#fda497] bg-[#fff8f7]' : step.done ? 'border-[#abefc6] bg-[#f6fef9]' : 'border-[#e4e7ec] bg-white'"
        >
          <p class="text-xs font-bold uppercase tracking-[0.14em]" :class="step.active ? 'text-[#c92f13]' : step.done ? 'text-[#067647]' : 'text-[#98a2b3]'">Step {{ step.step }}</p>
          <p class="mt-2 text-sm font-semibold text-[#101828]">{{ step.label }}</p>
          <p class="mt-1 text-xs font-medium text-[#667085]">{{ step.description }}</p>
        </div>
      </div>
    </DashboardSection>

    <ClientOnly>
      <DashboardSection
        v-if="hasPendingQuote"
        :title="pendingQuoteSectionTitle"
        :subtitle="pendingQuoteSectionSubtitle"
      >
        <div class="rounded-2xl border border-[#fda497] bg-[#fff8f7] p-5">
          <p class="text-sm font-semibold text-[#101828]">{{ pendingQuoteHeadline }}</p>
          <p class="mt-1 text-sm text-[#667085]">{{ pendingQuoteBody }}</p>
          <p v-if="pendingArtworkBanner" class="mt-2 text-sm font-medium text-[#9a3412]">{{ pendingArtworkBanner }}</p>
          <div class="mt-4 flex flex-wrap gap-3">
            <BaseButton variant="primary" size="sm" @click="openCalculatorPanel">Review saved specs</BaseButton>
            <BaseButton to="/dashboard/client/quotes" variant="secondary" size="sm">View Quotes</BaseButton>
          </div>
        </div>
        <div id="client-calculator" class="mt-5">
          <HomeHeroCalculator embedded />
        </div>
      </DashboardSection>

      <DashboardSection
        v-else-if="shouldShowMissingPendingQuote"
        title="Start a New Estimate"
        subtitle="We could not find a saved calculator draft on this device."
      >
        <DashboardEmptyState
          title="No saved draft found"
          description="Your previous draft may have expired, been sent already, or been saved in another browser. Start a new estimate and Printy will save the specs again."
          action-label="Open calculator"
          action-to="/#live-estimate"
        />
      </DashboardSection>
    </ClientOnly>

    <DashboardCardGrid>
      <BaseStatCard v-for="card in statCards" :key="card.label" :label="card.label" :value="card.value" :meta="card.meta" :accent="card.accent" :icon="card.icon" />
    </DashboardCardGrid>

    <div class="grid gap-6 xl:grid-cols-2">
      <DashboardSection title="Recent Quotes" subtitle="Quote requests and responses visible to your client account.">
        <div class="p-6 space-y-4">
          <BaseAlert v-if="quotesError" variant="error" title="Quotes could not load." :message="quotesError" />
          <BaseTable
            :columns="quoteColumns"
            :rows="recentQuotes"
            :loading="quotesLoading"
            empty-text="No quote requests yet."
            variant="dashboard"
            :row-action="openQuote"
            row-action-label="Open"
            show-action-column
          />
          <DashboardEmptyState
            v-if="!quotesLoading && !quotesError && recentQuotes.length === 0"
            title="No quote requests yet"
            description="Start a quote from the calculator. Your submitted requests and sent quotes will appear here."
            action-label="Start a quote"
            action-to="/#live-estimate"
          />
        </div>
      </DashboardSection>

      <DashboardSection title="Recent Messages" subtitle="Latest quote and job conversation updates.">
        <div class="p-6 space-y-4">
          <BaseAlert v-if="messagesError" variant="error" title="Messages could not load." :message="messagesError" />
          <BaseTable
            :columns="messageColumns"
            :rows="recentMessages"
            :loading="messagesLoading"
            empty-text="No messages yet."
            variant="dashboard"
            :row-action="openMessage"
            row-action-label="Open"
            show-action-column
          />
          <DashboardEmptyState
            v-if="!messagesLoading && !messagesError && recentMessages.length === 0"
            title="No messages yet"
            description="Messages from quote, job, and proof conversations will appear here."
            action-label="View quotes"
            action-to="/dashboard/client/quotes"
          />
        </div>
      </DashboardSection>
    </div>

    <div class="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
      <DashboardSection title="Recent Jobs" subtitle="Your current print jobs only.">
        <BaseTable :columns="jobColumns" :rows="jobs" :loading="loading" empty-text="No client jobs yet." variant="dashboard" />
        <DashboardEmptyState
          v-if="!loading && jobs.length === 0"
          title="No jobs yet"
          description="Start with a quote request. Accepted and paid jobs will appear here once Printy creates them."
          action-label="Start a quote"
          action-to="/#live-estimate"
        />
      </DashboardSection>

      <DashboardSection id="payments" title="Payments & MPESA" subtitle="Client-side payment actions stay here.">
        <div class="p-6 space-y-4">
          <BaseAlert variant="default" message="Only client accounts can trigger MPESA/STK payment actions. Partner and production workspaces are read-only for payment collection." />
          <BaseTable :columns="paymentColumns" :rows="payments" :loading="loading" empty-text="No payment prompts yet." variant="dashboard" />
          <DashboardEmptyState
            v-if="!loading && payments.length === 0"
            title="No pending client payments"
            description="Payment prompts appear after you accept a quote. If you are starting fresh, create a quote first."
            action-label="Start a quote"
            action-to="/#live-estimate"
          />
        </div>
      </DashboardSection>
    </div>
  </RoleDashboardFrame>
</template>

<script setup lang="ts">
import { callWithNuxt } from '#app'
import BaseAlert from '~/components/base/BaseAlert.vue'
import BaseBadge from '~/components/base/BaseBadge.vue'
import BaseButton from '~/components/base/BaseButton.vue'
import BaseStatCard from '~/components/base/BaseStatCard.vue'
import BaseTable from '~/components/base/BaseTable.vue'
import DashboardCardGrid from '~/components/dashboard/DashboardCardGrid.vue'
import DashboardEmptyState from '~/components/dashboard/DashboardEmptyState.vue'
import DashboardPageHeader from '~/components/dashboard/DashboardPageHeader.vue'
import DashboardSection from '~/components/dashboard/DashboardSection.vue'
import RoleDashboardFrame from '~/components/dashboard/RoleDashboardFrame.vue'
import HomeHeroCalculator from '~/components/marketing/HomeHeroCalculator.vue'
import { printyFlowSteps } from '~/constants/printyFlowSteps'
import { usePendingClientQuote } from '~/composables/usePendingClientQuote'
import { getApiErrorMessage } from '~/shared/api'
import { useDashboardApi } from '~/services/dashboard'
import { fetchClientInbox, fetchClientQuoteRequests } from '~/services/quotes'
import type { ClientDashboardHomeResponse, ClientInboxMessage, ClientQuoteRow } from '~/types/client'

definePageMeta({
  layout: false,
  middleware: 'auth',
})

useHead({
  title: 'Printy - Client Dashboard',
})

const nuxtApp = useNuxtApp()
const auth = useAuthStore()
const router = useRouter()
const { fetchDashboardHome } = useDashboardApi()
if (!auth.canAccessClientDashboard) {
  await callWithNuxt(nuxtApp, navigateTo, [auth.homeRoute])
}

const route = useRoute()
const loading = ref(true)
const pageError = ref('')
const quotesLoading = ref(true)
const quotesError = ref('')
const messagesLoading = ref(true)
const messagesError = ref('')
const payload = ref<ClientDashboardHomeResponse | null>(null)
const quoteRows = ref<ClientQuoteRow[]>([])
const messageRows = ref<ClientInboxMessage[]>([])
const pendingClientQuote = usePendingClientQuote()
const pendingQuoteChecked = ref(false)

onMounted(async () => {
  await Promise.all([loadClientHome(), loadClientQuotes(), loadClientMessages()])
})

async function loadClientHome() {
  try {
    payload.value = await fetchDashboardHome('client') as ClientDashboardHomeResponse
  } catch (error: unknown) {
    pageError.value = getApiErrorMessage(error, 'Client dashboard data is unavailable right now.')
  } finally {
    loading.value = false
  }
}

async function loadClientQuotes() {
  try {
    quoteRows.value = await fetchClientQuoteRequests() as ClientQuoteRow[]
  } catch (error: unknown) {
    quotesError.value = getApiErrorMessage(error, 'Client quotes are unavailable right now.')
  } finally {
    quotesLoading.value = false
  }
}

async function loadClientMessages() {
  try {
    messageRows.value = await fetchClientInbox() as ClientInboxMessage[]
  } catch (error: unknown) {
    messagesError.value = getApiErrorMessage(error, 'Client messages are unavailable right now.')
  } finally {
    messagesLoading.value = false
  }
}

const displayName = computed(() => auth.user?.name || auth.user?.email || 'Client')
const firstName = computed(() => displayName.value.split(' ')[0] || 'there')
const userEmail = computed(() => auth.user?.email || '')
const stats = computed(() => payload.value?.stats || { open_jobs: 0, awaiting_payment: 0, in_production: 0 })
const jobs = computed(() => Array.isArray(payload.value?.recent_jobs) ? payload.value.recent_jobs : [])
const payments = computed(() => Array.isArray(payload.value?.payments) ? payload.value.payments : [])
const recentQuotes = computed(() => quoteRows.value.slice(0, 5).map(row => ({
  ...row,
  quote_summary: quoteSummary(row),
  quote_total: formatKes(row.latest_response?.total),
  updated: formatDate(row.updated_at),
})))
const recentMessages = computed(() => messageRows.value.slice(0, 5).map(row => ({
  ...row,
  related: row.quote_request_id ? `Quote ${row.quote_request_id}` : 'Conversation',
  preview: row.snippet || row.body || '',
  received: formatDate(row.sent_at || row.created_at),
})))
const paymentDue = computed(() => payments.value.find(payment => isPaymentActionRequired(payment)) || null)
const activeJob = computed(() => jobs.value.find(job => isActiveJob(job)) || jobs.value[0] || null)
const proofJob = computed(() => jobs.value.find(job => hasProofAwaitingReview(job)) || null)
const hasPendingQuote = computed(() => pendingClientQuote.hasPendingQuote.value)
const isReorderDraft = computed(() => route.query.reorder === '1')
const shouldShowMissingPendingQuote = computed(() => route.query.pendingQuote === '1' && pendingQuoteChecked.value && !hasPendingQuote.value)
const pendingQuoteSectionTitle = computed(() => isReorderDraft.value ? 'Reorder Draft Ready' : 'Unsent Calculator Draft')
const pendingQuoteSectionSubtitle = computed(() => isReorderDraft.value ? 'We copied your completed job specs into a new draft.' : 'We saved your estimate. Continue from here.')
const pendingQuoteHeadline = computed(() => isReorderDraft.value ? 'Your reorder draft is ready. Review it before requesting a new quote.' : 'We saved your estimate. Continue from here.')
const pendingQuoteBody = computed(() => isReorderDraft.value
  ? 'Your product, quantity, paper preference, size, sides, colour mode, and finishing were copied into the calculator below.'
  : 'Your product, quantity, paper, size, sides, colour mode, and finishing are ready in the calculator below.')
const pendingArtworkBanner = computed(() => {
  const pending = pendingClientQuote.quote.value
  const filename = String(pending?.artwork_filename || pending?.artwork_name || '').trim()
  if (!filename || !pending?.artwork_token) {
    return ''
  }
  return `Artwork ready - ${filename}`
})

function openCalculatorPanel() {
  loadPendingQuote()
  if (!import.meta.client) {
    return
  }
  window.setTimeout(() => {
    document.getElementById('client-calculator')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, 0)
}

function loadPendingQuote() {
  const pending = pendingClientQuote.load()
  pendingQuoteChecked.value = true
  return pending
}

watch(
  () => route.query.pendingQuote,
  () => {
    loadPendingQuote()
  },
  { immediate: true },
)

onMounted(() => {
  loadPendingQuote()
})

const navItems = computed(() => [
  { label: 'Client Dashboard', path: '/dashboard/client', icon: 'home' },
  { label: 'Quotes', path: '/dashboard/client/quotes', icon: 'fileText' },
  { label: 'Jobs', path: '/dashboard/client/jobs', icon: 'printer' },
  { label: 'Payments', path: '/dashboard/client/payments', icon: 'creditCard' },
])

const primaryAction = computed(() => {
  if (hasPendingQuote.value) {
    return {
      kind: 'draft',
      badge: 'Continue quote',
      badgeVariant: 'active' as const,
      title: isReorderDraft.value ? 'Review your reorder draft' : 'Finish your saved quote request',
      description: pendingQuoteBody.value,
      actionLabel: 'Review saved specs',
      actionTo: '',
      secondaryLabel: 'View quote requests',
      secondaryTo: '/dashboard/client/quotes',
      meta: pendingArtworkBanner.value ? [{ label: 'Artwork', value: pendingArtworkBanner.value.replace('Artwork ready - ', '') }] : [],
    }
  }
  if (proofJob.value) {
    return {
      kind: 'link',
      badge: 'Awaiting Your Approval',
      badgeVariant: 'yellow' as const,
      title: 'Review the latest proof',
      description: 'A proof appears to be waiting for your review. Open the job and approve it or request changes.',
      actionLabel: 'Review proof',
      actionTo: `/dashboard/client/jobs/${proofJob.value.id}`,
      secondaryLabel: 'View all jobs',
      secondaryTo: '/dashboard/client/jobs',
      meta: jobActionMeta(proofJob.value),
    }
  }
  if (paymentDue.value) {
    return {
      kind: 'link',
      badge: 'Payment Required',
      badgeVariant: 'pending' as const,
      title: 'Complete payment to move forward',
      description: 'A payment prompt is ready. Complete payment so Printy can continue the managed job workflow.',
      actionLabel: 'Complete payment',
      actionTo: paymentDue.value.managed_job_id ? `/dashboard/client/jobs/${paymentDue.value.managed_job_id}` : '/dashboard/client/payments',
      secondaryLabel: 'View payments',
      secondaryTo: '/dashboard/client/payments',
      meta: paymentActionMeta(paymentDue.value),
    }
  }
  if (activeJob.value) {
    return {
      kind: 'link',
      badge: isCompletedJob(activeJob.value) ? 'Completed' : 'In Production',
      badgeVariant: isCompletedJob(activeJob.value) ? 'completed' as const : 'blue' as const,
      title: isCompletedJob(activeJob.value) ? 'Review your completed job' : 'Track production progress',
      description: isCompletedJob(activeJob.value)
        ? 'Your job is complete. Open it to review final status or start a reorder from the completed specs.'
        : 'Your active job is moving through Printy. Track progress and any proof or artwork actions from the job page.',
      actionLabel: isCompletedJob(activeJob.value) ? 'Open completed job' : 'Track production',
      actionTo: `/dashboard/client/jobs/${activeJob.value.id}`,
      secondaryLabel: 'View all jobs',
      secondaryTo: '/dashboard/client/jobs',
      meta: jobActionMeta(activeJob.value),
    }
  }
  return {
    kind: 'link',
    badge: 'Start here',
    badgeVariant: 'active' as const,
    title: 'Start a new quote',
    description: 'Create your first print request. Printy will save your specs, route the request, and show the next step here.',
    actionLabel: 'Start a quote',
    actionTo: '/#live-estimate',
    secondaryLabel: '',
    secondaryTo: '',
    meta: [{ label: 'Next step', value: 'Use the calculator to send your print specs' }],
  }
})

const primaryActionCardClass = computed(() => {
  if (primaryAction.value.badgeVariant === 'pending' || primaryAction.value.badgeVariant === 'yellow') {
    return 'border-[#fedf89] bg-[#fffaeb]'
  }
  if (primaryAction.value.badgeVariant === 'completed') {
    return 'border-blue-200 bg-blue-50'
  }
  if (primaryAction.value.badgeVariant === 'blue') {
    return 'border-blue-200 bg-[#eff6ff]'
  }
  return 'border-[#fda497] bg-[#fff8f7]'
})

const flowSteps = computed(() => [
  ...printyFlowSteps.map(step => ({
    ...step,
    done: isFlowStepDone(step.step),
    active: isFlowStepActive(step.step),
  })),
])

const statCards = computed(() => [
  {
    label: 'Open Jobs',
    value: stats.value.open_jobs ?? 0,
    meta: 'Only your active jobs',
    accent: 'orange' as const,
    icon: '<svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M3 7h18M6 11h12M9 15h6M5 3h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2z" /></svg>',
  },
  {
    label: 'Awaiting Payment',
    value: stats.value.awaiting_payment ?? 0,
    meta: 'Client-only MPESA prompts',
    accent: 'amber' as const,
    icon: '<svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><rect x="2" y="5" width="20" height="14" rx="2" /><path stroke-linecap="round" stroke-linejoin="round" d="M2 10h20" /></svg>',
  },
  {
    label: 'In Production',
    value: stats.value.in_production ?? 0,
    meta: 'Jobs currently moving through print',
    accent: 'green' as const,
    icon: '<svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 17v-6h13v6M9 7V5a2 2 0 012-2h9a2 2 0 012 2v2M5 11h.01M5 17h.01M5 5h.01" /></svg>',
  },
])

const jobColumns = [
  { key: 'reference', label: 'Reference' },
  { key: 'title', label: 'Job' },
  { key: 'status', label: 'Status' },
  { key: 'payment_status', label: 'Payment' },
]

const paymentColumns = [
  { key: 'reference', label: 'Reference' },
  { key: 'amount', label: 'Amount' },
  { key: 'payment_status', label: 'Status' },
  { key: 'channel', label: 'Channel' },
]

const quoteColumns = [
  { key: 'reference', label: 'Reference' },
  { key: 'quote_summary', label: 'Request' },
  { key: 'status_label', label: 'Status' },
  { key: 'quote_total', label: 'Total' },
  { key: 'updated', label: 'Updated' },
]

const messageColumns = [
  { key: 'subject', label: 'Subject' },
  { key: 'related', label: 'Related' },
  { key: 'preview', label: 'Message' },
  { key: 'received', label: 'Received' },
]

function isFlowStepDone(step: number) {
  if (step === 1) return hasPendingQuote.value || quoteRows.value.length > 0 || jobs.value.length > 0 || payments.value.length > 0
  if (step === 2) return jobs.value.length > 0 || payments.value.length > 0 || quoteRows.value.some(quote => ['accepted', 'approved'].includes(String(quote.status || '').toLowerCase()))
  if (step === 3) return jobs.value.some(job => isPaidStatus(job.payment_status)) || payments.value.some(payment => isPaidStatus(payment.payment_status))
  if (step === 4) return jobs.value.some(job => ['ready', 'completed', 'delivered'].includes(String(job.status || '').toLowerCase()))
  if (step === 5) return jobs.value.some(job => isCompletedJob(job))
  return false
}

function isFlowStepActive(step: number) {
  if (step === 1) return !hasPendingQuote.value && quoteRows.value.length === 0 && jobs.value.length === 0 && payments.value.length === 0
  if (step === 2) return hasPendingQuote.value || quoteRows.value.some(quote => isQuoteAwaitingClientReview(quote))
  if (step === 3) return Boolean(paymentDue.value)
  if (step === 4) return Boolean(activeJob.value && !isCompletedJob(activeJob.value) && !paymentDue.value)
  if (step === 5) return Boolean(activeJob.value && isCompletedJob(activeJob.value))
  return false
}

function isPaymentActionRequired(value: Record<string, any>) {
  const status = String(value.payment_status || value.status || '').toLowerCase()
  return ['pending', 'initiated', 'unpaid', 'awaiting_payment', 'payment_required'].includes(status)
}

function isPaidStatus(value: unknown) {
  return ['confirmed', 'paid', 'completed', 'success', 'successful', 'release_ready'].includes(String(value || '').toLowerCase())
}

function isQuoteAwaitingClientReview(quote: ClientQuoteRow) {
  const status = String(quote.latest_response?.status || quote.status || '').toLowerCase()
  return ['sent', 'revised', 'modified', 'awaiting_review', 'awaiting_response'].includes(status)
}

function isActiveJob(job: Record<string, any>) {
  const status = String(job.status || '').toLowerCase()
  return Boolean(job.id) && !['completed', 'delivered', 'cancelled', 'rejected'].includes(status)
}

function isCompletedJob(job: Record<string, any>) {
  return ['completed', 'delivered', 'ready'].includes(String(job.status || '').toLowerCase())
}

function hasProofAwaitingReview(job: Record<string, any>) {
  const proofStatus = String(job.proof_status || job.latest_proof_status || '').toLowerCase()
  return proofStatus.includes('manager_approved') || proofStatus.includes('awaiting') || proofStatus.includes('review')
}

function jobActionMeta(job: Record<string, any>) {
  return [
    { label: 'Job', value: String(job.reference || job.managed_reference || job.title || `Job ${job.id}`) },
    { label: 'Status', value: startCase(job.status || 'pending') },
  ]
}

function paymentActionMeta(payment: Record<string, any>) {
  return [
    { label: 'Amount', value: formatKes(payment.amount || payment.expected_amount) },
    { label: 'Status', value: startCase(payment.payment_status || payment.status || 'pending') },
  ]
}

function startCase(value: unknown) {
  return String(value || 'pending')
    .replace(/[_-]+/g, ' ')
    .replace(/\b\w/g, char => char.toUpperCase())
}

function formatKes(value: unknown) {
  const amount = Number(value)
  if (!Number.isFinite(amount) || amount <= 0) {
    return 'Amount pending'
  }
  return `KES ${amount.toLocaleString('en-KE', { maximumFractionDigits: 2 })}`
}

function formatDate(value: unknown) {
  if (!value) return '-'
  const date = new Date(String(value))
  if (Number.isNaN(date.getTime())) return '-'
  return date.toLocaleDateString('en-KE', { day: 'numeric', month: 'short', year: 'numeric' })
}

function quoteSummary(row: ClientQuoteRow) {
  const snapshot = row.request_snapshot || {}
  return String(
    snapshot.product_label
    || snapshot.product_type
    || snapshot.product
    || row.latest_response?.quote_reference
    || 'Print request',
  )
}

function openQuote(row: Record<string, any>) {
  if (row.id) {
    router.push(`/dashboard/client/quotes/${row.id}`)
  }
}

function openMessage(row: Record<string, any>) {
  const actionUrl = String(row.action_url || '')
  if (actionUrl.startsWith('/')) {
    router.push(actionUrl)
    return
  }
  if (row.quote_request_id) {
    router.push(`/dashboard/client/quotes/${row.quote_request_id}`)
  }
}
</script>
