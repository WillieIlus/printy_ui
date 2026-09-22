<template>
  <div class="mx-auto w-full max-w-[1180px] px-4 pb-24 pt-6 sm:px-6">
    <div class="flex flex-wrap items-end justify-between gap-3">
      <div>
        <h1 class="font-disp text-[26px] font-bold tracking-tight">Marketplace oversight</h1>
        <ML>Every job · every manager · every printer · every dollar in custody</ML>
      </div>
      <span class="inline-flex items-center gap-2 rounded-full border px-3 py-1.5 font-mono2 text-[9.5px] uppercase tracking-[0.16em] text-[var(--sub)]" :style="{ borderColor: 'var(--line)' }">
        <span class="h-1.5 w-1.5 animate-pulse rounded-full bg-[#2FBF71]" /> live · {{ a.counts.shops }} shops · {{ a.counts.managed_jobs }} jobs
      </span>
    </div>

    <section class="mt-6">
      <div class="flex items-center gap-2">
        <Database :size="13" :style="{ color: 'var(--accent)' }" />
        <ML class="!text-[11px]">Live platform totals</ML>
        <button
          class="ml-auto press-key inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 font-mono2 text-[9px] font-semibold uppercase tracking-[0.14em] text-[var(--sub)]"
          :style="{ borderColor: 'var(--line)' }"
          :disabled="a.loading"
          @click="a.fetchHome()"
        >
          <Loader2 v-if="a.loading" :size="11" class="animate-spin" /> <RefreshCw v-else :size="11" /> refresh
        </button>
      </div>
      <p v-if="a.error" class="mt-3 text-[12px]" style="color: #FB4D6D">{{ a.error }}</p>
      <div class="mt-3 grid grid-cols-2 gap-3 md:grid-cols-5">
        <div v-for="c in countCards" :key="c.label" class="rounded-2xl border p-4" :style="{ borderColor: 'var(--line)', background: 'var(--panel)' }">
          <ML>{{ c.label }}</ML>
          <div class="mt-2 font-disp text-[30px] font-bold leading-none tracking-tight">{{ c.value }}</div>
        </div>
      </div>
    </section>

    <section class="mt-6">
      <div class="flex items-center gap-2"><Activity :size="13" :style="{ color: 'var(--accent)' }" /><ML class="!text-[11px]">Marketplace pulse</ML></div>
      <div class="mt-3 grid grid-cols-2 gap-3 md:grid-cols-5">
        <div v-for="k in kpis" :key="k.label" class="relative overflow-hidden rounded-2xl border p-4" :style="{ borderColor: 'var(--line)', background: 'var(--panel)' }">
          <div class="absolute inset-y-0 left-0 w-[3px]" :style="{ background: k.color }" />
          <ML>{{ k.label }}</ML>
          <div class="mt-2 font-disp text-[34px] font-bold leading-none tracking-tight" :style="{ color: k.color }">{{ k.value }}</div>
          <div class="mt-1.5 font-mono2 text-[9px] uppercase tracking-[0.14em] text-[var(--sub)]">{{ k.sub }}</div>
        </div>
      </div>
    </section>

    <div class="mt-8 grid gap-8 lg:grid-cols-2">
      <section>
        <div class="flex items-center gap-2"><Users :size="13" :style="{ color: 'var(--accent)' }" /><ML class="!text-[11px]">Manager performance</ML></div>
        <div class="mt-3 space-y-2">
          <button
            v-for="m in MANAGERS"
            :key="m.id"
            type="button"
            class="group flex w-full items-center gap-3.5 rounded-2xl border p-3.5 text-left transition-colors hover:border-[var(--accent)]"
            :style="{ borderColor: 'var(--line)', background: 'var(--panel)' }"
            @click="openManager(m)"
          >
            <Avatar :initials="m.initials" :hue="m.hue" :size="40" />
            <div class="min-w-0 flex-1">
              <div class="flex items-center gap-2">
                <span class="truncate font-disp text-[14.5px] font-bold tracking-tight">{{ m.name }}</span>
                <Flag v-if="ms(m.id).disputed > 0" :size="11" class="text-[#FB4D6D]" />
              </div>
              <div class="truncate font-mono2 text-[9px] uppercase tracking-[0.12em] text-[var(--sub)]">{{ m.tag }}</div>
            </div>
            <div class="hidden w-[110px] sm:block">
              <div class="mb-1 flex justify-between font-mono2 text-[8.5px] uppercase tracking-[0.1em] text-[var(--sub)]">
                <span>on-time</span><span>{{ m.onTime }}%</span>
              </div>
              <Meter :value="m.onTime / 100" :color="m.onTime >= 92 ? '#2FBF71' : m.onTime >= 87 ? '#F5A623' : '#FF6B4A'" :h="4" />
            </div>
            <div class="text-right">
              <div class="font-disp text-[15px] font-bold">{{ ms(m.id).active }}<span class="text-[11px] text-[var(--sub)]"> live</span></div>
              <div class="font-mono2 text-[8.5px] uppercase tracking-[0.1em]" :style="{ color: needHelpInfo(m.id).color }">{{ needHelpInfo(m.id).text }}</div>
            </div>
            <ChevronRight :size="14" class="text-[var(--sub)] transition-transform group-hover:translate-x-0.5" />
          </button>
        </div>
      </section>

      <section>
        <div class="flex items-center gap-2"><Factory :size="13" :style="{ color: 'var(--accent)' }" /><ML class="!text-[11px]">Printer roster</ML></div>
        <div class="mt-3 grid gap-2 sm:grid-cols-2">
          <button
            v-for="pr in PRINTERS"
            :key="pr.id"
            type="button"
            :class="`relative rounded-2xl border p-4 text-left transition-transform ${pr.verified ? 'hover:-translate-y-0.5' : 'border-dashed opacity-90'}`"
            :style="{ borderColor: hasDisputeFor(pr) ? 'rgba(251,77,109,.5)' : pr.verified ? 'var(--line)' : 'rgba(245,166,35,.5)', background: 'var(--panel)' }"
            @click="openPrinter(pr)"
          >
            <div class="flex items-center gap-3">
              <Avatar :initials="pr.initials" :hue="pr.hue" :size="40" />
              <div class="min-w-0 flex-1">
                <div class="flex items-center gap-1.5 truncate font-disp text-[14.5px] font-bold tracking-tight">
                  {{ pr.name }}
                  <BadgeCheck v-if="pr.verified" :size="13" :style="{ color: 'var(--accent)' }" />
                  <AlertOctagon v-else :size="12" class="text-[#F5A623]" />
                </div>
                <div class="font-mono2 text-[9px] uppercase tracking-[0.12em] text-[var(--sub)]">{{ pr.city }}</div>
              </div>
              <div v-if="pr.verified" class="text-right font-mono2 text-[9px] uppercase tracking-[0.1em] text-[var(--sub)]">
                <div class="inline-flex items-center gap-1"><Star :size="9" class="text-[#F5A623]" /> {{ pr.rating }}</div>
                <div>{{ pr.onTime }}% on-time</div>
              </div>
            </div>
            <div class="mt-3 flex flex-wrap gap-1">
              <span v-for="cap in pr.caps" :key="cap" class="rounded-full px-2 py-[3px] font-mono2 text-[8.5px] uppercase tracking-[0.12em]" :style="{ background: 'var(--panel2)', color: 'var(--sub)' }">{{ cap }}</span>
            </div>
            <div class="mt-3 border-t pt-2.5 font-mono2 text-[9px] uppercase tracking-[0.12em]" :style="{ borderColor: 'var(--line)', color: hasDisputeFor(pr) ? '#FB4D6D' : 'var(--sub)' }">
              {{ pr.verified ? (hasDisputeFor(pr) ? '1 job in dispute' : activeFor(pr).length ? `${activeFor(pr).length} live job${activeFor(pr).length > 1 ? 's' : ''} on floor` : `${pr.jobsDone} jobs all-time`) : 'verification pending · limited scopes' }}
            </div>
          </button>
        </div>
      </section>
    </div>

    <div class="mt-8 grid gap-8 lg:grid-cols-2">
      <section>
        <div class="flex items-center gap-2"><Wallet :size="13" :style="{ color: 'var(--accent)' }" /><ML class="!text-[11px]">Payment custody · escrow</ML></div>
        <div class="mt-3 rounded-2xl border p-5" :style="{ borderColor: 'var(--line)', background: 'var(--panel)' }">
          <div class="flex flex-wrap items-end justify-between gap-4">
            <div>
              <ML>Funds held now</ML>
              <div class="mt-1 font-disp text-[38px] font-bold leading-none tracking-tight" :style="{ color: '#F2622E' }">{{ money(c.held) }}</div>
            </div>
            <div class="text-right">
              <ML>Released</ML>
              <div class="mt-1 font-disp text-[22px] font-bold leading-none text-[#2FBF71]">{{ money(c.released) }}</div>
              <div class="mt-1 font-mono2 text-[9px] uppercase tracking-[0.12em] text-[var(--sub)]">awaiting {{ money(c.awaiting) }}</div>
            </div>
          </div>
          <div class="mt-5"><CustodyBar :held="c.held" :released="c.released" :awaiting="c.awaiting" /></div>
          <div class="mt-4 space-y-1.5">
            <button
              v-for="j in heldJobs"
              :key="j.id"
              type="button"
              class="flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left transition-colors hover:bg-[var(--panel2)]"
              @click="w.act('open-job', j)"
            >
              <Lock :size="10" :style="{ color: j.status === 'disputed' ? '#FB4D6D' : 'var(--sub)' }" />
              <span class="font-mono2 text-[10px] tracking-[0.1em] text-[var(--accent)]">{{ j.code }}</span>
              <span class="truncate text-[11.5px] text-[var(--sub)]">{{ j.title }}</span>
              <span class="ml-auto font-mono2 text-[10.5px] font-semibold" :style="{ color: j.status === 'disputed' ? '#FB4D6D' : 'var(--ink)' }">{{ money(j.value) }}</span>
            </button>
          </div>
        </div>
      </section>

      <section>
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2"><Flag :size="13" class="text-[#FB4D6D]" /><ML class="!text-[11px]">Disputes · frozen funds</ML></div>
          <span class="font-mono2 text-[9.5px] uppercase tracking-[0.14em] text-[#FB4D6D]">{{ disputes.length }} open</span>
        </div>
        <div class="mt-3 space-y-2.5">
          <div v-if="disputes.length === 0" class="rounded-2xl border p-6 text-center font-mono2 text-[10px] uppercase tracking-[0.16em] text-[var(--sub)]" :style="{ borderColor: 'var(--line)' }">
            Zero open disputes — marketplace is clean
          </div>
          <div
            v-for="j in disputes"
            :key="j.id"
            class="overflow-hidden rounded-2xl border"
            :style="{ borderColor: 'rgba(251,77,109,.45)' }"
          >
            <div class="hazard h-2" />
            <div class="p-4" :style="{ background: 'rgba(251,77,109,.06)' }">
              <div class="flex items-center justify-between gap-2">
                <button type="button" class="font-mono2 text-[11px] font-semibold tracking-[0.14em] text-[#FB4D6D] underline underline-offset-4" @click="w.act('open-job', j)">{{ j.code }}</button>
                <StatusPill :status="j.status" size="sm" />
              </div>
              <button type="button" class="mt-2 text-left font-disp text-[16px] font-bold tracking-tight hover:underline" @click="w.act('open-job', j)">{{ j.title }}</button>
              <p class="mt-2 text-[12.5px] leading-snug text-[var(--sub)]">{{ j.dispute?.reason }}</p>
              <div class="mt-3 flex flex-wrap items-center gap-2">
                <span class="rounded-full bg-[rgba(251,77,109,.14)] px-2.5 py-1 font-mono2 text-[9.5px] uppercase tracking-[0.12em] text-[#FB4D6D]">
                  {{ money(j.dispute?.amount ?? j.value) }} frozen
                </span>
                <span class="font-mono2 text-[9.5px] uppercase tracking-[0.12em] text-[var(--sub)]">{{ j.dispute?.openedBy }}</span>
                <div class="ml-auto flex gap-2">
                  <ActionBtn v-if="!j.dispute?.resolved" variant="danger" class="!px-3 !py-2" @click="w.act('resolve-dispute', j)">Resolve</ActionBtn>
                  <ActionBtn variant="ghost" class="!px-3 !py-2" @click="w.act('open-job', j)">Inspect</ActionBtn>
                </div>
              </div>
            </div>
          </div>
          <div v-for="j in resolvedJobs" :key="j.id" class="flex items-center gap-3 rounded-2xl border p-3.5" :style="{ borderColor: 'var(--line)', background: 'var(--panel)' }">
            <StatusPill status="on-track" size="sm" />
            <span class="font-mono2 text-[10px] tracking-[0.12em] text-[var(--accent)]">{{ j.code }}</span>
            <span class="truncate text-[12px] text-[var(--sub)]">Dispute resolved — reprint approved</span>
          </div>
        </div>
      </section>
    </div>

    <div v-if="drill" class="fixed inset-0 z-50 flex justify-end">
      <div class="absolute inset-0 bg-black/55 backdrop-blur-[6px]" @click="drill = null" />
      <aside class="relative h-full w-full max-w-[440px] overflow-y-auto border-l p-6" :style="{ background: 'var(--bg)', borderColor: 'var(--line)' }">
        <button type="button" class="absolute right-4 top-4 rounded-full p-2 hover:bg-[var(--panel2)]" :style="{ color: 'var(--sub)' }" @click="drill = null"><X :size="16" /></button>

        <template v-if="drillManager">
          <div class="flex items-center gap-3">
            <Avatar :initials="drillManager.initials" :hue="drillManager.hue" :size="52" />
            <div>
              <div class="font-disp text-[20px] font-bold tracking-tight">{{ drillManager.name }}</div>
              <div class="font-mono2 text-[9.5px] uppercase tracking-[0.14em] text-[var(--sub)]">{{ drillManager.tag }}</div>
            </div>
          </div>
          <div class="mt-5 grid grid-cols-3 gap-2 text-center">
            <div v-for="row in mgrDrillRows" :key="row[1]" class="rounded-xl p-3" :style="{ background: 'var(--panel2)' }">
              <div class="font-disp text-[16px] font-bold">{{ row[0] }}</div>
              <div class="mt-0.5 font-mono2 text-[8px] uppercase tracking-[0.12em] text-[var(--sub)]">{{ row[1] }}</div>
            </div>
          </div>
          <ML class="mt-6">Their jobs</ML>
          <div class="mt-2 space-y-2">
            <button
              v-for="j in ms(drillManager.id).jobs"
              :key="j.id"
              type="button"
              class="w-full rounded-xl border p-3 text-left transition-colors hover:border-[var(--accent)]"
              :style="{ borderColor: 'var(--line)', background: 'var(--panel)' }"
              @click="closeAndOpen(j)"
            >
              <div class="flex items-center justify-between gap-2">
                <span class="font-mono2 text-[9.5px] tracking-[0.12em] text-[var(--accent)]">{{ j.code }}</span>
                <StatusPill :status="j.status" size="sm" />
              </div>
              <div class="mt-1 truncate font-disp text-[13.5px] font-bold">{{ j.title }}</div>
              <div class="mt-1.5"><StageDots :job="j" /></div>
            </button>
          </div>
        </template>

        <template v-if="drillPrinter">
          <div class="flex items-center gap-3">
            <Avatar :initials="drillPrinter.initials" :hue="drillPrinter.hue" :size="52" />
            <div>
              <div class="flex items-center gap-1.5 font-disp text-[20px] font-bold tracking-tight">
                {{ drillPrinter.name }} <BadgeCheck :size="15" :style="{ color: 'var(--accent)' }" />
              </div>
              <div class="font-mono2 text-[9.5px] uppercase tracking-[0.14em] text-[var(--sub)]">{{ drillPrinter.city }} · contact {{ drillPrinter.contact }}</div>
            </div>
          </div>
          <div class="mt-5 grid grid-cols-3 gap-2 text-center">
            <div v-for="row in prDrillRows" :key="row[1]" class="rounded-xl p-3" :style="{ background: 'var(--panel2)' }">
              <div class="font-disp text-[16px] font-bold">{{ row[0] }}</div>
              <div class="mt-0.5 font-mono2 text-[8px] uppercase tracking-[0.12em] text-[var(--sub)]">{{ row[1] }}</div>
            </div>
          </div>
          <ML class="mt-6">Capabilities</ML>
          <div class="mt-2 flex flex-wrap gap-1.5">
            <span v-for="cap in drillPrinter.caps" :key="cap" class="rounded-full px-2.5 py-1 font-mono2 text-[9px] uppercase tracking-[0.12em]" :style="{ background: 'var(--panel2)', color: 'var(--sub)' }">{{ cap }}</span>
          </div>
          <ML class="mt-6">Jobs on their floor</ML>
          <div class="mt-2 space-y-2">
            <button
              v-for="j in drillPrinterJobs"
              :key="j.id"
              type="button"
              class="w-full rounded-xl border p-3 text-left transition-colors hover:border-[var(--accent)]"
              :style="{ borderColor: 'var(--line)', background: 'var(--panel)' }"
              @click="closeAndOpen(j)"
            >
              <div class="flex items-center justify-between gap-2">
                <span class="font-mono2 text-[9.5px] tracking-[0.12em] text-[var(--accent)]">{{ j.code }}</span>
                <StatusPill :status="j.status" size="sm" />
              </div>
              <div class="mt-1 truncate font-disp text-[13.5px] font-bold">{{ j.title }}</div>
              <div class="mt-1 font-mono2 text-[9px] uppercase tracking-[0.12em] text-[var(--sub)]">
                {{ STAGES[stIdx(j.stage)]!.label }} · {{ money(j.value) }}
              </div>
            </button>
            <div v-if="drillPrinterJobs.length === 0" class="rounded-xl border p-4 text-center font-mono2 text-[9.5px] uppercase tracking-[0.14em] text-[var(--sub)]" :style="{ borderColor: 'var(--line)' }">
              No active jobs
            </div>
          </div>
        </template>
      </aside>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import {
  Activity, AlertOctagon, BadgeCheck, ChevronRight, Database, Factory, Flag, Loader2, Lock, RefreshCw, Star, Users, Wallet, X,
} from 'lucide-vue-next'
import {
  MANAGERS, PRINTERS, STAGES, custody, managerStats, money, pulse, stIdx,
  type Job, type Manager, type Printer,
} from '~/shared/workflow/printy'
import { useWorkflowStore } from '~/stores/workflow'
import { useAdminStore } from '~/stores/admin'

const w = useWorkflowStore()
const a = useAdminStore()

onMounted(() => {
  w.syncFromApi()
  a.fetchHome()
})

const countCards = computed(() => [
  { label: 'Users', value: a.counts.users },
  { label: 'Shops', value: a.counts.shops },
  { label: 'Quote requests', value: a.counts.quote_requests },
  { label: 'Quotes', value: a.counts.quotes },
  { label: 'Managed jobs', value: a.counts.managed_jobs },
  { label: 'Assignments', value: a.counts.job_assignments },
  { label: 'Job files', value: a.counts.job_files },
  { label: 'Payments', value: a.counts.payments },
  { label: 'Drafts', value: a.counts.calculator_drafts },
  { label: 'Notifications', value: a.counts.notifications },
])

type Drill = { type: 'manager' | 'printer'; id: string } | null
const drill = ref<Drill>(null)

const p = computed(() => pulse(w.jobs))
const c = computed(() => custody(w.jobs))
const disputes = computed(() => w.jobs.filter((j) => j.status === 'disputed'))
const heldJobs = computed(() => w.jobs.filter((j) => j.custody === 'held'))
const resolvedJobs = computed(() => w.jobs.filter((j) => j.dispute?.resolved))

const drillManager = computed<Manager | null>(() => {
  const d = drill.value
  return d?.type === 'manager' ? MANAGERS.find((m) => m.id === d.id)! : null
})
const drillPrinter = computed<Printer | null>(() => {
  const d = drill.value
  return d?.type === 'printer' ? PRINTERS.find((x) => x.id === d.id)! : null
})

const kpis = computed(() => [
  { label: 'Total jobs', value: p.value.total, sub: 'across the marketplace', color: '#F2622E' },
  { label: 'On track', value: p.value.onTrack, sub: `${p.value.completed} completed this cycle`, color: '#2FBF71' },
  { label: 'At risk', value: p.value.atRisk, sub: 'inside 80% of SLA', color: '#F5A623' },
  { label: 'Overdue', value: p.value.overdue, sub: 'SLA breached', color: '#FF6B4A' },
  { label: 'Disputed', value: p.value.disputed, sub: 'funds frozen', color: '#FB4D6D' },
])

const mgrDrillRows = computed(() => {
  const dm = drillManager.value
  if (!dm) return []
  const s = managerStats(w.jobs, dm.id)
  return [
    [String(s.active), 'live jobs'],
    [money(s.value), 'in play'],
    [`${dm.onTime}%`, 'on-time'],
  ] as [string, string][]
})

const prDrillRows = computed(() => {
  const dp = drillPrinter.value
  if (!dp) return []
  return [
    [String(dp.rating), 'rating'],
    [`${dp.onTime}%`, 'on-time'],
    [String(dp.jobsDone), 'jobs done'],
  ] as [string, string][]
})

const drillPrinterJobs = computed(() => {
  const dp = drillPrinter.value
  return dp ? w.jobs.filter((j) => j.printerId === dp.id) : []
})
const ms = (id: string) => managerStats(w.jobs, id)
const activeFor = (pr: Printer) => w.jobs.filter((j) => j.printerId === pr.id && j.stage !== 'completed')
const hasDisputeFor = (pr: Printer) => activeFor(pr).some((j) => j.status === 'disputed')
const needHelpInfo = (id: string) => {
  const s = managerStats(w.jobs, id)
  const bad = s.risk + s.disputed > 0
  return { color: bad ? '#FF6B4A' : 'var(--sub)', text: bad ? `${s.risk + s.disputed} need help` : 'clear desk' }
}
const openManager = (m: Manager) => {
  drill.value = { type: 'manager', id: m.id }
}
const openPrinter = (pr: Printer) => {
  if (pr.verified) drill.value = { type: 'printer', id: pr.id }
}
const closeAndOpen = (j: Job) => {
  drill.value = null
  w.act('open-job', j)
}
</script>