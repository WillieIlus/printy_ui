<template>
  <div>
    <AdminPageHead
      eyebrow="Marketplace oversight"
      title="Every job · every manager · every printer · every dollar in custody"
      lede="The landing page stays short on purpose. Each concern below has its own page — nothing is buried in here."
    >
      <template #meta>
        <button
          type="button"
          class="press-key inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 font-mono2 text-[9px] font-semibold uppercase tracking-[0.14em] text-[var(--sub)] disabled:opacity-50"
          :style="{ borderColor: 'var(--line)' }"
          :disabled="busy"
          @click="refresh()"
        >
          <Loader2 v-if="busy" :size="11" class="animate-spin" />
          <RefreshCw v-else :size="11" />
          refresh
        </button>
      </template>
    </AdminPageHead>

    <AdminSection
      icon="database"
      tone="accent"
      title="Live platform totals"
      subtitle="Read straight from the platform database. Counts only — no assumptions, refreshed on demand."
    >
      <div class="grid grid-cols-2 gap-3 md:grid-cols-5">
        <div
          v-for="c in countCards"
          :key="c.label"
          class="rounded-2xl border p-4"
          :style="{ borderColor: 'var(--line)', background: 'var(--panel)' }"
        >
          <ML>{{ c.label }}</ML>
          <div class="mt-2 font-disp text-[30px] font-bold leading-none tracking-tight">{{ c.value }}</div>
        </div>
      </div>
    </AdminSection>

    <AdminSection
      icon="gauge"
      tone="warn"
      title="Marketplace pulse"
      subtitle="Job health across every manager and shop, counted by SLA status."
    >
      <div class="grid grid-cols-2 gap-3 md:grid-cols-5">
        <div
          v-for="k in kpis"
          :key="k.label"
          class="relative overflow-hidden rounded-2xl border p-4"
          :style="{ borderColor: 'var(--line)', background: 'var(--panel)' }"
        >
          <div class="absolute inset-y-0 left-0 w-[3px]" :style="{ background: k.color }" />
          <ML>{{ k.label }}</ML>
          <div class="mt-2 font-disp text-[34px] font-bold leading-none tracking-tight" :style="{ color: k.color }">{{ k.value }}</div>
          <div class="mt-1.5 font-mono2 text-[9px] uppercase tracking-[0.14em] text-[var(--sub)]">{{ k.sub }}</div>
        </div>
      </div>
    </AdminSection>

    <AdminSection
      icon="flag"
      tone="bad"
      title="Needs a decision"
      :count="attention.length"
      subtitle="One row per concern, each with its own page. Pick the loud one and work it down."
    >
      <div class="grid gap-2 md:grid-cols-2">
        <NuxtLink
          v-for="row in attention"
          :key="row.to"
          :to="row.to"
          class="group flex items-center gap-3 rounded-2xl border p-3.5 transition-colors hover:border-[var(--accent)]"
          :style="{ borderColor: 'var(--line)', background: 'var(--panel)' }"
        >
          <span
            class="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl"
            :style="row.count ? { background: `${row.color}1F`, color: row.color } : { background: 'var(--panel2)', color: 'var(--sub)' }"
          >
            <AdminIcon :name="row.icon" :size="15" />
          </span>
          <div class="min-w-0 flex-1">
            <div class="flex items-center gap-2">
              <span class="truncate font-disp text-[14px] font-bold tracking-tight">{{ row.label }}</span>
              <span
                class="rounded-full px-2 py-[1px] font-mono2 text-[9px] font-bold"
                :style="row.count ? { background: `${row.color}1F`, color: row.color } : { background: 'var(--panel2)', color: 'var(--sub)' }"
              >{{ row.count }}</span>
            </div>
            <div class="truncate text-[11.5px] text-[var(--sub)]">{{ row.blurb }}</div>
          </div>
          <ChevronRight :size="14" class="shrink-0 text-[var(--sub)] transition-transform group-hover:translate-x-0.5" />
        </NuxtLink>
      </div>
    </AdminSection>

    <AdminSection
      icon="wallet"
      tone="accent"
      title="Money in custody"
      subtitle="A single read on the escrow position. The per-job detail lives on the custody page."
    >
      <template #actions>
        <NuxtLink
          to="/app/admin/custody"
          class="press-key inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 font-mono2 text-[9px] font-semibold uppercase tracking-[0.14em] text-[var(--sub)] transition-colors hover:text-[var(--accent)]"
          :style="{ borderColor: 'var(--line)' }"
        >
          Open custody <ChevronRight :size="11" />
        </NuxtLink>
      </template>

      <div class="rounded-2xl border p-5" :style="{ borderColor: 'var(--line)', background: 'var(--panel)' }">
        <div class="flex flex-wrap items-end justify-between gap-4">
          <div>
            <ML>Funds held now</ML>
            <div class="mt-1 font-disp text-[38px] font-bold leading-none tracking-tight" style="color: #F2622E">
              {{ money(custodyTotals.held) }}
            </div>
          </div>
          <div class="text-right">
            <ML>Released</ML>
            <div class="mt-1 font-disp text-[22px] font-bold leading-none" style="color: #0E7A45">
              {{ money(custodyTotals.released) }}
            </div>
            <div class="mt-1 font-mono2 text-[9px] uppercase tracking-[0.12em] text-[var(--sub)]">
              awaiting {{ money(custodyTotals.awaiting) }}
            </div>
          </div>
        </div>
        <div class="mt-5">
          <CustodyBar :held="custodyTotals.held" :released="custodyTotals.released" :awaiting="custodyTotals.awaiting" />
        </div>
      </div>
    </AdminSection>

    <AdminSection
      icon="users"
      tone="neutral"
      title="People at a glance"
      subtitle="Who is carrying risk on each side of the marketplace, and who is not cleared to take work yet."
    >
      <div class="grid gap-3 md:grid-cols-2">
        <PartnerPeek
          to="/app/admin/managers"
          title="Managers needing help"
          :rows="managerPeek"
          empty-copy="Every manager has a clear desk."
        />
        <PartnerPeek
          to="/app/admin/printers"
          title="Shops pending verification"
          :rows="printerPeek"
          empty-copy="Every shop is verified."
        />
      </div>
    </AdminSection>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { ChevronRight, Loader2, RefreshCw } from 'lucide-vue-next'
import { money } from '~/shared/workflow/printy'
import { ADMIN_ROOT } from '~/shared/admin-nav'
import type { AdminNavIcon } from '~/shared/admin-nav'

const {
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
  { label: 'Total jobs', value: pulseStats.value.total, sub: 'across the marketplace', color: '#F2622E' },
  { label: 'On track', value: pulseStats.value.onTrack, sub: `${pulseStats.value.completed} completed this cycle`, color: '#2FBF71' },
  { label: 'At risk', value: pulseStats.value.atRisk, sub: 'inside 80% of SLA', color: '#B45309' },
  { label: 'Overdue', value: pulseStats.value.overdue, sub: 'SLA breached', color: '#C2410C' },
  { label: 'Disputed', value: pulseStats.value.disputed, sub: 'funds frozen', color: '#C81E44' },
])

const attention = computed<Array<{ to: string; icon: AdminNavIcon; label: string; blurb: string; count: number; color: string }>>(() => [
  { to: `${ADMIN_ROOT}/disputes`, icon: 'flag', label: 'Open disputes', blurb: 'Funds frozen until a decision is recorded', count: openDisputes.value.length, color: '#C81E44' },
  { to: `${ADMIN_ROOT}/quotes`, icon: 'file-text', label: 'Awaiting quotes', blurb: 'Requested but not yet priced for the client', count: awaitingQuotes.value.length, color: '#B45309' },
  { to: `${ADMIN_ROOT}/jobs`, icon: 'rocket', label: 'Jobs needing a decision', blurb: 'Overdue, at risk or disputed', count: riskJobs.value.length, color: '#C2410C' },
  { to: `${ADMIN_ROOT}/managers`, icon: 'users', label: 'Managers needing help', blurb: 'Carrying an at-risk or disputed job', count: managersNeedingHelp.value.length, color: '#C2410C' },
  { to: `${ADMIN_ROOT}/printers`, icon: 'factory', label: 'Shops pending verification', blurb: 'Not yet cleared to price paid work', count: printersPendingVerification.value.length, color: '#B45309' },
])

const managerPeek = computed(() =>
  managersNeedingHelp.value.map((m) => ({
    key: m.id,
    lead: m.name,
    trail: m.tag,
    value: `${statsFor(m.id).risk + statsFor(m.id).disputed} at risk`,
    color: '#C2410C',
  })),
)

const printerPeek = computed(() =>
  printersPendingVerification.value.map((pr) => ({
    key: pr.id,
    lead: pr.name,
    trail: `${pr.city} · ${pr.caps[0] ?? 'no scope'}`,
    value: `${pr.jobsDone} jobs`,
    color: '#B45309',
  })),
)
</script>