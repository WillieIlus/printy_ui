<template>
  <div class="flex flex-col gap-9">
    <DesignAdminPageHeader
      index="AD"
      kicker="Admin oversight"
      title="Network at a glance"
      description="Live counts, custody, verification and disputes read from the admin reporting API."
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
        <DesignStat label="Buyer volume" :value="formatKSh(paidAmount)" tone="brand" hint="paid through M-Pesa" />
      </DesignCard>
      <DesignCard class="p-5">
        <DesignStat label="Custody held" :value="formatKSh(heldClientTotal)" hint="awaiting delivery confirmation" />
      </DesignCard>
      <DesignCard class="p-5">
        <DesignStat label="Manager payouts held" :value="formatKSh(heldManagerPayout)" hint="inside escrow" />
      </DesignCard>
      <DesignCard class="p-5">
        <DesignStat label="Payouts released" :value="formatKSh(releasedPayouts)" tone="brand" hint="manual releases recorded" />
      </DesignCard>
    </div>

    <DesignAdminSection id="escrow" index="01" title="Escrow position" hint="funds never touch Printy accounts">
      <DesignCard class="p-6">
        <div class="flex flex-wrap items-end justify-between gap-5">
          <div>
            <p class="font-mono text-[10px] font-medium tracking-[0.16em] text-ink-3 uppercase">Funds held now</p>
            <p class="mt-1 tabular font-mono text-2xl font-semibold tracking-tight text-brand">{{ formatKSh(heldClientTotal) }}</p>
            <p class="mt-1 text-[13px] text-ink-2">across {{ custody.held_jobs || 0 }} jobs</p>
          </div>
          <div class="text-right">
            <p class="font-mono text-[10px] font-medium tracking-[0.16em] text-ink-3 uppercase">Released</p>
            <p class="mt-1 tabular font-mono text-xl font-semibold text-green">{{ formatKSh(releasedClientTotal) }}</p>
            <p class="mt-1 font-mono text-[9px] tracking-[0.1em] text-ink-3 uppercase">{{ custody.released_jobs || 0 }} jobs</p>
          </div>
        </div>
        <div class="mt-5">
          <DesignAdminCustodyBar :held="Number(heldClientTotal)" :released="Number(releasedClientTotal)" :awaiting="0" />
        </div>
      </DesignCard>
    </DesignAdminSection>

    <DesignAdminSection id="ledger" index="02" title="Money ledger" hint="real payments in and payouts out">
      <div class="grid grid-cols-2 gap-3 md:grid-cols-4">
        <DesignCard class="p-4">
          <p class="font-mono text-[9.5px] font-medium tracking-[0.12em] text-ink-3 uppercase">Payments paid</p>
          <p class="mt-2 tabular font-mono text-[22px] font-semibold text-brand">{{ formatKSh(paidAmount) }}</p>
          <p class="mt-1 font-mono text-[8.5px] tracking-[0.1em] text-ink-3 uppercase">{{ payments.paid || 0 }} of {{ payments.total || 0 }} payments</p>
        </DesignCard>
        <DesignCard class="p-4">
          <p class="font-mono text-[9.5px] font-medium tracking-[0.12em] text-ink-3 uppercase">Payments pending</p>
          <p class="mt-2 tabular font-mono text-[22px] font-semibold text-amber">{{ payments.pending || 0 }}</p>
          <p class="mt-1 font-mono text-[8.5px] tracking-[0.1em] text-ink-3 uppercase">awaiting confirmation</p>
        </DesignCard>
        <DesignCard class="p-4">
          <p class="font-mono text-[9.5px] font-medium tracking-[0.12em] text-ink-3 uppercase">Payouts released</p>
          <p class="mt-2 tabular font-mono text-[22px] font-semibold text-green">{{ formatKSh(releasedPayouts) }}</p>
          <p class="mt-1 font-mono text-[8.5px] tracking-[0.1em] text-ink-3 uppercase">{{ payouts.released || 0 }} of {{ payouts.total || 0 }} payouts</p>
        </DesignCard>
        <DesignCard class="p-4">
          <p class="font-mono text-[9.5px] font-medium tracking-[0.12em] text-ink-3 uppercase">Payouts failed</p>
          <p class="mt-2 tabular font-mono text-[22px] font-semibold text-red">{{ payouts.failed || 0 }}</p>
          <p class="mt-1 font-mono text-[8.5px] tracking-[0.1em] text-ink-3 uppercase">need review</p>
        </DesignCard>
      </div>
      <p class="mt-2 text-[11.5px] text-ink-3">
        Margin is not part of the reporting payload, so no estimate is shown.
      </p>
    </DesignAdminSection>

    <DesignAdminSection id="pulse" index="03" title="Marketplace pulse" hint="real job and verification counts">
      <div class="grid grid-cols-2 gap-3 md:grid-cols-5">
        <DesignCard v-for="kpi in kpis" :key="kpi.label" class="relative overflow-hidden p-4">
          <div class="absolute inset-y-0 left-0 w-[3px]" :style="{ background: kpi.color }" />
          <p class="font-mono text-[9.5px] font-medium tracking-[0.12em] text-ink-3 uppercase">{{ kpi.label }}</p>
          <p class="mt-2 tabular font-mono text-[32px] leading-none font-semibold tracking-tight" :style="{ color: kpi.color }">{{ kpi.value }}</p>
          <p class="mt-1.5 font-mono text-[8.5px] tracking-[0.1em] text-ink-3 uppercase">{{ kpi.sub }}</p>
        </DesignCard>
      </div>
    </DesignAdminSection>

    <DesignAdminSection id="attention" index="04" title="Needs a decision" :count="attention.length" hint="each row opens its real queue">
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

    <DesignAdminSection id="people" index="05" title="Network verification" hint="real manager and printer queues">
      <div class="grid gap-3 md:grid-cols-2">
        <DesignCard class="p-5">
          <p class="font-mono text-[10px] tracking-[0.14em] text-ink-3 uppercase">Managers</p>
          <p class="mt-2 tabular font-mono text-[28px] font-semibold text-ink">{{ managers.total || 0 }}</p>
          <p class="mt-1 text-[12px] text-ink-2">{{ managers.pending || 0 }} pending · {{ managers.verified || 0 }} verified</p>
          <NuxtLink to="/app/admin/managers" class="mt-3 inline-flex text-[12px] font-semibold text-brand">Open verification</NuxtLink>
        </DesignCard>
        <DesignCard class="p-5">
          <p class="font-mono text-[10px] tracking-[0.14em] text-ink-3 uppercase">Printers</p>
          <p class="mt-2 tabular font-mono text-[28px] font-semibold text-ink">{{ printers.total || 0 }}</p>
          <p class="mt-1 text-[12px] text-ink-2">{{ printers.pending || 0 }} pending · {{ printers.verified || 0 }} verified</p>
          <NuxtLink to="/app/admin/printers" class="mt-3 inline-flex text-[12px] font-semibold text-brand">Open verification</NuxtLink>
        </DesignCard>
      </div>
    </DesignAdminSection>

    <DesignAlert v-if="error" tone="error">{{ error }}</DesignAlert>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { getIcon } from '~/utils/design/icon-registry'
import type { IconName } from '~/utils/design/icon-registry'
import type { AdminNavIcon } from '~/shared/admin-nav'
import { formatKSh } from '~/utils/money'
import { useAdminStore } from '~/stores/admin'
import DesignAdminCustodyBar from '~/components/design/admin/AdminCustodyBar.vue'
import DesignAdminPageHeader from '~/components/design/admin/AdminPageHeader.vue'
import DesignAdminSection from '~/components/design/admin/AdminSection.vue'
import DesignAlert from '~/components/design/ui/Alert.vue'
import DesignCard from '~/components/design/ui/Card.vue'
import DesignStat from '~/components/design/ui/Stat.vue'

const admin = useAdminStore()
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

const reporting = computed(() => admin.reporting ?? {})
const custody = computed(() => reporting.value.custody ?? {})
const managers = computed(() => reporting.value.managers ?? {})
const printers = computed(() => reporting.value.printers ?? {})
const jobs = computed(() => reporting.value.jobs ?? {})
const payouts = computed(() => reporting.value.payouts ?? {})
const payments = computed(() => reporting.value.payments ?? {})
const busy = computed(() => admin.loading)
const error = computed(() => admin.error)

const paidAmount = computed(() => payments.value.paid_amount ?? 0)
const heldClientTotal = computed(() => custody.value.held_amounts?.client_total ?? 0)
const heldManagerPayout = computed(() => custody.value.held_amounts?.manager_payout ?? 0)
const releasedClientTotal = computed(() => custody.value.released_amounts?.client_total ?? 0)
const releasedPayouts = computed(() => payouts.value.released_amount ?? 0)

const kpis = computed(() => [
  { label: 'Total jobs', value: jobs.value.total ?? 0, sub: 'all time', color: 'var(--color-brand)' },
  { label: 'Active', value: jobs.value.active ?? 0, sub: 'not completed', color: 'var(--color-ontrack)' },
  { label: 'Completed', value: jobs.value.completed ?? 0, sub: 'closed jobs', color: 'var(--color-brand)' },
  { label: 'Disputed', value: jobs.value.disputed ?? 0, sub: 'open disputes', color: 'var(--color-red)' },
  { label: 'Managers pending', value: managers.value.pending ?? 0, sub: 'verification queue', color: 'var(--color-amber)' },
])

const attention = computed<Array<{ to: string, icon: AdminNavIcon, label: string, blurb: string, count: number, tone: keyof typeof ATTENTION_TONES }>>(() => [
  { to: '/app/admin/disputes', icon: 'flag', label: 'Open disputes', blurb: 'Funds frozen until a decision is recorded', count: jobs.value.disputed ?? 0, tone: 'red' },
  { to: '/app/admin/managers', icon: 'users', label: 'Managers pending verification', blurb: 'Waiting for an admin decision', count: managers.value.pending ?? 0, tone: 'amber' },
  { to: '/app/admin/printers', icon: 'factory', label: 'Shops pending verification', blurb: 'Rate card or verification incomplete', count: printers.value.pending ?? 0, tone: 'amber' },
  { to: '/app/admin/custody', icon: 'wallet', label: 'Held custody jobs', blurb: 'Paid and waiting for release', count: custody.value.held_jobs ?? 0, tone: 'brand' },
])

async function refresh() {
  await Promise.all([admin.fetchHome(), admin.fetchReporting()])
}

onMounted(() => {
  if (!admin.reporting) admin.fetchReporting()
  if (!admin.hasCounts) admin.fetchHome()
})
</script>
