<template>
  <div class="flex flex-col gap-9">
    <DesignAdminPageHeader
      index="AD"
      kicker="Admin oversight"
      title="Network at a glance"
      description="Every layer of every job — totals, costs, custody and verification — reconciled in one place."
    >
      <template #actions>
        <button
          type="button"
          class="inline-flex items-center gap-1.5 rounded-xl border border-line bg-card px-3 py-1.5 font-mono text-[9.5px] font-semibold tracking-[0.12em] text-ink-2 uppercase transition-colors hover:border-line-strong hover:text-brand disabled:opacity-50"
          :disabled="busy"
          @click="refresh()"
        >
          <component :is="busy ? spinner : refreshIcon" :class="busy ? 'h-3 w-3 animate-spin' : 'h-3 w-3'" :stroke-width="2" />
          refresh
        </button>
      </template>
    </DesignAdminPageHeader>

    <div class="grid grid-cols-2 gap-4 lg:grid-cols-4">
      <DesignCard class="p-5">
        <DesignStat label="Escrow held" :value="money(custodyTotals.held)" tone="brand" :hint="`${pulseStats.total} tracked jobs`" />
      </DesignCard>
      <DesignCard class="p-5" data-design-placeholder="NO_DATA">
        <DesignStat label="Buyer volume" value="—" hint="No reporting API yet" />
      </DesignCard>
      <DesignCard class="p-5" data-design-placeholder="NO_DATA">
        <DesignStat label="Margin booked" value="—" hint="No reporting API yet" />
      </DesignCard>
      <DesignCard class="p-5" data-design-placeholder="NO_DATA">
        <DesignStat label="Payouts pending" value="—" hint="No reporting API yet" />
      </DesignCard>
    </div>

    <DesignAdminSection id="escrow" index="01" title="Escrow position" hint="funds never touch Printy accounts">
      <DesignCard class="p-6">
        <div class="flex flex-wrap items-end justify-between gap-5">
          <div>
            <p class="font-mono text-[10px] font-medium tracking-[0.16em] text-ink-3 uppercase">Funds held now</p>
            <p class="mt-1 tabular font-mono text-2xl font-semibold tracking-tight text-brand">{{ money(custodyTotals.held) }}</p>
            <p class="mt-1 text-[13px] text-ink-2">held across {{ pulseStats.total }} tracked jobs</p>
          </div>
          <div class="text-right">
            <p class="font-mono text-[10px] font-medium tracking-[0.16em] text-ink-3 uppercase">Released</p>
            <p class="mt-1 tabular font-mono text-xl font-semibold text-green">{{ money(custodyTotals.released) }}</p>
            <p class="mt-1 font-mono text-[9px] tracking-[0.1em] text-ink-3 uppercase">awaiting {{ money(custodyTotals.awaiting) }}</p>
          </div>
        </div>
        <div class="mt-5">
          <DesignAdminCustodyBar :held="custodyTotals.held" :released="custodyTotals.released" :awaiting="custodyTotals.awaiting" />
        </div>
      </DesignCard>
    </DesignAdminSection>

    <DesignAdminSection id="totals" index="02" title="Live platform totals" hint="read straight from the platform database">
      <div class="grid grid-cols-2 gap-3 md:grid-cols-5">
        <DesignCard v-for="card in countCards" :key="card.label" class="p-4">
          <p class="font-mono text-[9.5px] font-medium tracking-[0.12em] text-ink-3 uppercase">{{ card.label }}</p>
          <p class="mt-2 tabular font-mono text-[28px] leading-none font-semibold tracking-tight text-ink">{{ card.value }}</p>
        </DesignCard>
      </div>
    </DesignAdminSection>

    <DesignAdminSection id="pulse" index="03" title="Marketplace pulse" hint="job health across every manager and shop">
      <div class="grid grid-cols-2 gap-3 md:grid-cols-5">
        <DesignCard v-for="kpi in kpis" :key="kpi.label" class="relative overflow-hidden p-4">
          <div class="absolute inset-y-0 left-0 w-[3px]" :style="{ background: kpi.color }" />
          <p class="font-mono text-[9.5px] font-medium tracking-[0.12em] text-ink-3 uppercase">{{ kpi.label }}</p>
          <p class="mt-2 tabular font-mono text-[32px] leading-none font-semibold tracking-tight" :style="{ color: kpi.color }">{{ kpi.value }}</p>
          <p class="mt-1.5 font-mono text-[8.5px] tracking-[0.1em] text-ink-3 uppercase">{{ kpi.sub }}</p>
        </DesignCard>
      </div>
    </DesignAdminSection>

    <DesignAdminSection id="attention" index="04" title="Needs a decision" :count="attention.length" hint="one row per concern, each with its own page">
      <div class="grid gap-2 md:grid-cols-2">
        <NuxtLink
          v-for="row in attention"
          :key="row.to"
          :to="row.to"
          class="group flex items-center gap-3 rounded-xl border border-line bg-card p-3.5 transition-colors hover:border-line-strong"
        >
          <span :class="['flex h-9 w-9 shrink-0 items-center justify-center rounded-xl', ATTENTION_TONES[row.tone]]">
            <component :is="getIcon(ATTENTION_ICONS[row.icon])" class="h-4 w-4" :stroke-width="2" />
          </span>
          <div class="min-w-0 flex-1">
            <div class="flex items-center gap-2">
              <span class="truncate text-[14px] font-semibold tracking-tight text-ink">{{ row.label }}</span>
              <span :class="['rounded-full px-2 py-0.5 font-mono text-[9px] font-bold', ATTENTION_TONES[row.tone]]">{{ row.count }}</span>
            </div>
            <div class="truncate text-[11.5px] text-ink-2">{{ row.blurb }}</div>
          </div>
          <component :is="getIcon('ChevronRight')" class="h-4 w-4 shrink-0 text-ink-3 transition-transform group-hover:translate-x-0.5" :stroke-width="1.9" />
        </NuxtLink>
      </div>
    </DesignAdminSection>

    <DesignAdminSection id="jobs" index="05" title="All jobs" hint="full ledger — every layer visible to admin">
      <DesignAdminJobsTable :jobs="workflow.jobs" @open="openJob" />
    </DesignAdminSection>

    <DesignAdminSection id="network" index="06" title="Shops & managers" hint="verification and desk health">
      <DesignAdminNetworkRoster :rows="networkRows" />
    </DesignAdminSection>

    <DesignAdminSection id="people" index="07" title="People at a glance" hint="who is carrying risk on each side">
      <div class="grid gap-3 md:grid-cols-2">
        <DesignAdminPartnerPeek
          to="/app/admin/managers"
          title="Managers needing help"
          :rows="managerPeek"
          empty-copy="Every manager has a clear desk."
        />
        <DesignAdminPartnerPeek
          to="/app/admin/printers"
          title="Shops pending verification"
          :rows="printerPeek"
          empty-copy="Every shop is verified."
        />
      </div>
    </DesignAdminSection>

    <div class="grid items-start gap-6 lg:grid-cols-2">
      <DesignAdminSection id="ledger" index="08" title="Margin ledger" hint="by manager">
        <DesignAdminPlaceholder
          title="Margin ledger is not available"
          hint="Printy's current API exposes job values but not per-job print cost or manager margin, so the design's ledger rows cannot be populated."
        />
      </DesignAdminSection>
      <DesignAdminSection id="settings" index="09" title="Settings" hint="server-managed">
        <div class="flex flex-col gap-3">
          <DesignAdminPlaceholder
            title="Settings panel is not available"
            hint="The design's fixed system-status panel has no Printy settings API behind it."
          />
          <NuxtLink
            to="/notifications"
            class="flex items-center justify-between rounded-xl border border-line bg-card px-5 py-4 transition-colors hover:border-line-strong"
          >
            <span>
              <span class="block text-sm font-semibold text-ink">Notifications</span>
              <span class="mt-0.5 block font-mono text-[10px] tracking-[0.1em] text-ink-3 uppercase">open the shared notification feed</span>
            </span>
            <component :is="getIcon('ChevronRight')" class="h-4 w-4 text-ink-3" :stroke-width="1.9" />
          </NuxtLink>
        </div>
      </DesignAdminSection>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { getIcon } from '~/utils/design/icon-registry'
import type { IconName } from '~/utils/design/icon-registry'
import type { StatusTone } from '~/types/design/status-tone'
import { MANAGERS, PRINTERS, managerStats, money, type Job } from '~/shared/workflow/printy'
import { ADMIN_ROOT, type AdminNavIcon } from '~/shared/admin-nav'
import DesignAdminCustodyBar from '~/components/design/admin/AdminCustodyBar.vue'
import DesignAdminJobsTable from '~/components/design/admin/AdminJobsTable.vue'
import DesignAdminNetworkRoster, { type AdminNetworkRow } from '~/components/design/admin/AdminNetworkRoster.vue'
import DesignAdminPageHeader from '~/components/design/admin/AdminPageHeader.vue'
import DesignAdminPartnerPeek from '~/components/design/admin/AdminPartnerPeek.vue'
import DesignAdminPlaceholder from '~/components/design/admin/AdminPlaceholder.vue'
import DesignAdminSection from '~/components/design/admin/AdminSection.vue'
import DesignCard from '~/components/design/ui/Card.vue'
import DesignStat from '~/components/design/ui/Stat.vue'

const {
  admins,
  workflow,
  counts,
  busy,
  refresh,
  pulseStats,
  custodyTotals,
  awaitingQuotes,
  openDisputes,
  riskJobs,
  managersNeedingHelp,
  printersPendingVerification,
  statsFor,
} = useAdminNav()

const spinner = getIcon('Loader2')
const refreshIcon = getIcon('RotateCcw')

const ATTENTION_TONES = {
  red: 'bg-red-soft text-red',
  amber: 'bg-amber-soft text-amber',
  brand: 'bg-mint text-brand-deep',
} as const

const ATTENTION_ICONS: Record<AdminNavIcon, IconName> = {
  gauge: 'Gauge',
  'file-text': 'ReceiptText',
  rocket: 'Briefcase',
  users: 'Users',
  factory: 'Store',
  wallet: 'Banknote',
  flag: 'AlertTriangle',
  'badge-check': 'BadgeCheck',
  'alert-octagon': 'AlertTriangle',
  inbox: 'SearchX',
  lock: 'Lock',
  database: 'Layers3',
}

const countCards = computed(() => [
  { label: 'Users', value: counts.value.users },
  { label: 'Shops', value: counts.value.shops },
  { label: 'Quote requests', value: counts.value.quote_requests },
  { label: 'Quotes', value: counts.value.quotes },
  { label: 'Managed jobs', value: counts.value.managed_jobs },
  { label: 'Assignments', value: counts.value.job_assignments },
  { label: 'Job files', value: counts.value.job_files },
  { label: 'Payments', value: counts.value.payments },
  { label: 'Drafts', value: counts.value.calculator_drafts },
  { label: 'Notifications', value: counts.value.notifications },
])

const kpis = computed(() => [
  { label: 'Total jobs', value: pulseStats.value.total, sub: 'across the marketplace', color: 'var(--color-brand)' },
  { label: 'On track', value: pulseStats.value.onTrack, sub: `${pulseStats.value.completed} completed this cycle`, color: 'var(--color-ontrack)' },
  { label: 'At risk', value: pulseStats.value.atRisk, sub: 'inside 80% of SLA', color: 'var(--color-amber)' },
  { label: 'Overdue', value: pulseStats.value.overdue, sub: 'SLA breached', color: 'var(--color-red)' },
  { label: 'Disputed', value: pulseStats.value.disputed, sub: 'funds frozen', color: 'var(--color-red)' },
])

const attention = computed<Array<{ to: string; icon: AdminNavIcon; label: string; blurb: string; count: number; tone: keyof typeof ATTENTION_TONES }>>(() => [
  { to: `${ADMIN_ROOT}/disputes`, icon: 'flag', label: 'Open disputes', blurb: 'Funds frozen until a decision is recorded', count: openDisputes.value.length, tone: 'red' },
  { to: `${ADMIN_ROOT}/quotes`, icon: 'file-text', label: 'Awaiting quotes', blurb: 'Requested but not yet priced for the client', count: awaitingQuotes.value.length, tone: 'amber' },
  { to: `${ADMIN_ROOT}/jobs`, icon: 'rocket', label: 'Jobs needing a decision', blurb: 'Overdue, at risk or disputed', count: riskJobs.value.length, tone: 'red' },
  { to: `${ADMIN_ROOT}/managers`, icon: 'users', label: 'Managers needing help', blurb: 'Carrying an at-risk or disputed job', count: managersNeedingHelp.value.length, tone: 'red' },
  { to: `${ADMIN_ROOT}/printers`, icon: 'factory', label: 'Shops pending verification', blurb: 'Not yet cleared to price paid work', count: printersPendingVerification.value.length, tone: 'amber' },
])

const networkRows = computed<AdminNetworkRow[]>(() => [
  ...MANAGERS.map((manager) => {
    const stats = managerStats(workflow.jobs, manager.id)
    const exposure = stats.risk + stats.disputed
    return {
      name: manager.name,
      role: 'Manager',
      meta: `${manager.tag} · ${manager.onTime}% on-time`,
      status: exposure ? `${exposure} need help` : 'Clear desk',
      tone: (exposure ? 'atrisk' : 'ontrack') as StatusTone,
    }
  }),
  ...PRINTERS.map(printer => ({
    name: printer.name,
    role: 'Shop',
    meta: `${printer.city} · ${printer.contact}`,
    status: printer.verified ? 'Verified' : 'Verification pending',
    tone: (printer.verified ? 'ontrack' : 'atrisk') as StatusTone,
  })),
])

const managerPeek = computed(() =>
  managersNeedingHelp.value.map(manager => ({
    key: manager.id,
    lead: manager.name,
    trail: manager.tag,
    value: `${statsFor(manager.id).risk + statsFor(manager.id).disputed} at risk`,
    tone: 'red' as const,
  })),
)

const printerPeek = computed(() =>
  printersPendingVerification.value.map(printer => ({
    key: printer.id,
    lead: printer.name,
    trail: `${printer.city} · ${printer.caps[0] ?? 'no scope'}`,
    value: `${printer.jobsDone} jobs`,
    tone: 'amber' as const,
  })),
)

function openJob(job: Job) {
  admins.clearFocus()
  workflow.act('open-job', job)
}
</script>
