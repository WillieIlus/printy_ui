<template>
  <DashboardShell sidebar-tone="light">
    <template #sidebar>
      <PartnerSidebarNav />
    </template>

    <div class="space-y-6">
      <DashboardTopBar
        eyebrow="Partner workspace"
        title="Relationship operations"
        description="Run sourcing, markup, workflow tracking, and managed production follow-through from one partner workspace."
        action-label="Start quick quote"
        @action="jumpToBuilder"
      />

      <section v-if="!isPartner" class="rounded-3xl border border-dashed border-[var(--p-border)] bg-[var(--p-surface)] px-6 py-12 text-center">
        <p class="text-lg font-semibold text-[var(--p-text)]">Partner capability not enabled</p>
        <p class="mt-2 text-sm text-[var(--p-text-muted)]">This dashboard only appears for users with partner sourcing access.</p>
      </section>

      <template v-else>
        <section class="rounded-[2rem] border border-slate-200 bg-[#101828] p-6 text-white shadow-[0_20px_48px_rgba(15,23,42,0.2)]">
          <div class="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div class="space-y-2">
              <p class="text-[10px] font-bold uppercase tracking-[0.28em] text-white/60">Primary workflow</p>
              <h2 class="text-2xl font-semibold tracking-tight">Create the quote fast, keep the relationship clear, and let Printy run production.</h2>
              <p class="max-w-3xl text-sm leading-6 text-slate-300">
                Partners can see the production estimate, their margin, the final client price, payment confirmation, and production status without losing control of the client relationship.
              </p>
            </div>
            <div class="flex flex-wrap gap-2">
              <BaseButton variant="primary" @click="jumpToBuilder">Open quote builder</BaseButton>
              <BaseButton variant="secondary" @click="jumpToJobs">View managed jobs</BaseButton>
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

        <section id="quote-builder">
          <PartnerQuoteBuilder @created="reload" />
        </section>

        <div id="earnings" class="grid gap-6 xl:grid-cols-[1fr_1fr]">
          <EarningsSummary :quoted-markup="quotedMarkup" :tracked-commission="trackedCommission" :release-ready="releaseReady" />
          <ClientRelationshipPanel />
        </div>

        <div class="grid gap-6 xl:grid-cols-[1fr_1fr]">
          <section class="space-y-4">
            <ProductionTrackingBoard :jobs="managedJobs" />

            <section id="partner-quotes" class="rounded-[1.9rem] border border-slate-200 bg-white p-6 shadow-[0_16px_36px_rgba(15,23,42,0.06)]">
              <div class="flex items-start justify-between gap-4">
                <div>
                  <p class="text-[10px] font-bold uppercase tracking-[0.24em] text-slate-500">Partner quotes</p>
                  <h3 class="mt-2 text-lg font-semibold tracking-tight text-slate-950">Recently created quotes</h3>
                </div>
                <BaseButton variant="secondary" size="sm" @click="jumpToBuilder">Create quote</BaseButton>
              </div>

              <div v-if="partnerQuotes.length" class="mt-5 space-y-3">
                <article v-for="quote in partnerQuotes.slice(0, 6)" :key="quote.id" class="rounded-2xl border border-slate-200 bg-slate-50/80 p-4">
                  <div class="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p class="text-sm font-semibold text-slate-950">{{ quote.client_name || `Quote #${quote.id}` }}</p>
                      <p class="mt-1 text-sm text-slate-500">{{ quote.partner_brand_name || 'Partner-branded quote' }} - Managed by Printy</p>
                    </div>
                    <span class="rounded-full px-3 py-1 text-xs font-semibold" :class="toneClass(normalizeQuoteTone(quote.status))">
                      {{ humanize(quote.status) }}
                    </span>
                  </div>
                  <div class="mt-3 grid gap-3 md:grid-cols-3">
                    <div class="rounded-2xl border border-slate-200 bg-white p-3">
                      <p class="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500">Client price</p>
                      <p class="mt-2 text-sm font-semibold text-slate-950">{{ formatMoney(quote.total) }}</p>
                    </div>
                    <div class="rounded-2xl border border-slate-200 bg-white p-3">
                      <p class="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500">Markup</p>
                      <p class="mt-2 text-sm font-semibold text-slate-950">{{ formatMoney(quote.partner_markup) }}</p>
                    </div>
                    <div class="rounded-2xl border border-slate-200 bg-white p-3">
                      <p class="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500">Created</p>
                      <p class="mt-2 text-sm font-semibold text-slate-950">{{ formatDate(quote.created_at) }}</p>
                    </div>
                  </div>
                </article>
              </div>

              <div v-else class="mt-5 rounded-2xl border border-dashed border-slate-200 px-5 py-10 text-center">
                <p class="text-sm font-semibold text-slate-950">No partner quotes yet</p>
                <p class="mt-2 text-sm text-slate-500">Use the quote builder above to create your first partner quote.</p>
              </div>
            </section>
          </section>

          <section class="space-y-4">
            <WorkflowMessagePanel />

            <section id="managed-jobs" class="rounded-[1.9rem] border border-slate-200 bg-white p-6 shadow-[0_16px_36px_rgba(15,23,42,0.06)]">
              <div class="flex items-start justify-between gap-4">
                <div>
                  <p class="text-[10px] font-bold uppercase tracking-[0.24em] text-slate-500">Managed jobs</p>
                  <h3 class="mt-2 text-lg font-semibold tracking-tight text-slate-950">Sourced jobs in flight</h3>
                </div>
                <BaseButton variant="secondary" size="sm" @click="reload">Refresh tracking</BaseButton>
              </div>

              <div v-if="managedJobs.length" class="mt-5 space-y-3">
                <PartnerJobCard
                  v-for="job in managedJobs.slice(0, 5)"
                  :key="job.id"
                  :job="job"
                  :settlement="settlementByJob[job.id] ?? null"
                />
              </div>

              <div v-else class="mt-5 rounded-2xl border border-dashed border-slate-200 px-5 py-10 text-center">
                <p class="text-sm font-semibold text-slate-950">No sourced jobs yet</p>
                <p class="mt-2 text-sm text-slate-500">Managed jobs tied to this partner will appear here after a quote is accepted.</p>
              </div>
            </section>
          </section>
        </div>
      </template>
    </div>
  </DashboardShell>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import ClientRelationshipPanel from '~/components/dashboard/partner/ClientRelationshipPanel.vue'
import EarningsSummary from '~/components/dashboard/partner/EarningsSummary.vue'
import PartnerJobCard from '~/components/dashboard/partner/PartnerJobCard.vue'
import PartnerSidebarNav from '~/components/dashboard/partner/PartnerSidebarNav.vue'
import ProductionTrackingBoard from '~/components/dashboard/partner/ProductionTrackingBoard.vue'
import WorkflowMessagePanel from '~/components/dashboard/partner/WorkflowMessagePanel.vue'
import DashboardShell from '~/components/dashboard/shared/DashboardShell.vue'
import DashboardTopBar from '~/components/dashboard/shared/DashboardTopBar.vue'
import BaseButton from '~/components/ui/BaseButton.vue'
import PartnerQuoteBuilder from '~/components/workflow/PartnerQuoteBuilder.vue'
import { useAuthStore } from '~/stores/auth'
import { useWorkflowSpineStore } from '~/stores/workflowSpine'
import { formatCurrency } from '~/utils/formatters'

definePageMeta({ layout: 'dashboard' })

const authStore = useAuthStore()
const workflowStore = useWorkflowSpineStore()
const { managedJobs, partnerQuotes, settlementByJob } = storeToRefs(workflowStore)

const isPartner = computed(() =>
  authStore.capabilities.can_source_jobs || authStore.isPartnerEnabled || authStore.user?.role === 'broker',
)

const quotedMarkupNumber = computed(() =>
  partnerQuotes.value.reduce((sum, quote) => sum + parseAmount(quote.partner_markup), 0),
)
const trackedCommissionNumber = computed(() =>
  managedJobs.value.reduce((sum, job) => sum + parseAmount(settlementByJob.value[job.id]?.partner_commission), 0),
)
const releaseReady = computed(() =>
  managedJobs.value.filter(job => settlementByJob.value[job.id]?.release_ready_at).length,
)
const quotedMarkup = computed(() => formatMoney(String(quotedMarkupNumber.value.toFixed(2))))
const trackedCommission = computed(() => formatMoney(String(trackedCommissionNumber.value.toFixed(2))))

const summaryCards = computed(() => {
  const activeJobs = managedJobs.value.filter(job => !['completed', 'cancelled'].includes(String(job.status ?? ''))).length
  return [
    { label: 'Partner quotes', value: String(partnerQuotes.value.length), helper: 'Quotes created from the reachable partner quote builder.' },
    { label: 'Active jobs', value: String(activeJobs), helper: 'Managed jobs currently moving through payment, production, or delivery.' },
    { label: 'Quoted markup', value: quotedMarkup.value, helper: 'Markup currently attached to sourced quotes.' },
    { label: 'Tracked commission', value: trackedCommission.value, helper: releaseReady.value > 0 ? `${releaseReady.value} job(s) are ready for payout release.` : 'Commission updates as jobs are completed.' },
  ]
})

function parseAmount(value?: string | null) {
  const parsed = Number.parseFloat(String(value ?? '0'))
  return Number.isFinite(parsed) ? parsed : 0
}

function humanize(value?: string | null) {
  if (!value) return 'Not available'
  return value.replace(/_/g, ' ').replace(/\b\w/g, char => char.toUpperCase())
}

function formatDate(value?: string | null) {
  if (!value) return 'Pending'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return 'Pending'
  return date.toLocaleDateString()
}

function formatMoney(value?: string | null) {
  return value ? formatCurrency(value, 'KES') : 'Pending'
}

function toneClass(tone?: string | null) {
  if (tone === 'success') return 'bg-green-500/10 text-green-700'
  if (tone === 'warning') return 'bg-amber-500/10 text-amber-700'
  if (tone === 'danger') return 'bg-rose-500/10 text-rose-700'
  if (tone === 'info') return 'bg-sky-500/10 text-sky-700'
  return 'bg-slate-200 text-slate-700'
}

function normalizeQuoteTone(status?: string | null) {
  if (status === 'accepted') return 'success'
  if (status === 'rejected' || status === 'declined' || status === 'expired') return 'danger'
  if (status === 'sent' || status === 'revised' || status === 'quoted') return 'info'
  return 'warning'
}

function jumpToBuilder() {
  document.getElementById('quote-builder')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

function jumpToJobs() {
  document.getElementById('managed-jobs')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

async function reload() {
  if (!isPartner.value) return
  await Promise.all([
    workflowStore.fetchPartnerQuotes(),
    workflowStore.fetchManagedJobs(),
  ])
  await Promise.all(managedJobs.value.map(job => workflowStore.fetchJobSettlement(job.id)))
}

onMounted(() => {
  reload().catch(() => undefined)
})
</script>
