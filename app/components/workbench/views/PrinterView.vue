<template>
  <DesignPrinterSurface>
    <div class="flex flex-col gap-9">
      <DesignPrinterPageHeader
        index="PR"
        kicker="Printer workspace"
        :title="shopName"
        description="Jobs arrive sized, specced and escrow-funded. Advance the line as work moves — payout releases the moment delivery is confirmed."
      >
        <template #actions>
          <span class="inline-flex items-center gap-1.5 rounded-full border border-line bg-card px-2.5 py-1.5 font-mono text-[10px] uppercase tracking-[0.12em] text-ink-2">
            <span class="h-1.5 w-1.5 rounded-full bg-green" /> Live shop data
          </span>
          <span class="rounded-full border border-brand/35 bg-mint px-2.5 py-1.5 font-mono text-[10px] uppercase tracking-[0.12em] text-brand-deep">
            {{ activeJobs.length }} {{ activeJobs.length === 1 ? 'job' : 'jobs' }} live
          </span>
          <NuxtLink
            to="/app/printer/rates"
            class="inline-flex items-center gap-1.5 rounded-xl border border-line-strong bg-card px-3 py-2 text-xs font-semibold text-ink transition-colors hover:border-brand hover:text-brand"
          >
            <Coins :size="14" aria-hidden="true" /> My rate card
            <span v-if="rateCardStatus" class="font-normal text-ink-3">
              · {{ rateCardStatus.is_confirmed ? 'You are live to managers.' : `${rateCardStatus.completed_steps} of ${rateCardStatus.total_steps} steps done` }}
            </span>
          </NuxtLink>
          <button
            type="button"
            class="inline-flex items-center gap-1.5 rounded-xl border border-line-strong bg-card px-3 py-2 text-xs font-semibold text-ink transition-colors hover:border-brand hover:text-brand"
            :disabled="store.loading"
            @click="refresh"
          >
            <RefreshCw :size="13" :class="{ 'animate-spin': store.loading }" aria-hidden="true" /> Refresh
          </button>
        </template>
      </DesignPrinterPageHeader>

      <section
        v-if="rateCardStatus && !rateCardStatus.is_confirmed"
        class="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-amber/45 bg-amber-soft/60 p-5"
      >
        <div class="flex items-start gap-3">
          <span class="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-amber text-paper">
            <Printer :size="17" aria-hidden="true" />
          </span>
          <div>
            <p class="text-[15px] font-bold tracking-tight text-amber">Finish setting up your shop</p>
            <p class="mt-0.5 max-w-lg text-[13px] leading-relaxed text-ink-2">
              You are not visible to managers until your rate card is saved and confirmed.
            </p>
          </div>
        </div>
        <NuxtLink
          to="/app/printer/get-started"
          class="inline-flex items-center gap-2 rounded-xl bg-brand px-4 py-2.5 text-[13px] font-semibold text-white shadow-brand transition-colors hover:bg-brand-deep"
        >
          Continue setup <ArrowRight :size="14" />
        </NuxtLink>
      </section>

      <div v-if="store.pendingCount" class="flex flex-wrap items-center gap-3 rounded-2xl border border-amber/45 bg-amber-soft/60 px-4 py-3">
        <WifiOff :size="16" class="text-amber" aria-hidden="true" />
        <p class="min-w-0 flex-1 text-[12.5px] text-ink-2">
          <strong>{{ store.pendingCount }}</strong> {{ store.pendingCount === 1 ? 'update is' : 'updates are' }} waiting to send. Nothing was lost — we retry automatically.
        </p>
        <button type="button" class="rounded-lg border border-amber/60 px-3 py-1.5 font-mono text-[9px] font-bold uppercase tracking-[0.1em] text-amber" @click="store.syncQueue()">
          Retry now
        </button>
      </div>

      <p v-if="store.error" class="rounded-xl border border-red/35 bg-red-soft px-4 py-3 text-xs text-red" role="status">
        {{ store.error }}
      </p>

      <section class="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <DesignCard class="p-5">
          <DesignStat label="In queue" :value="String(activeJobs.length)" tone="brand" hint="advance stages as you print" />
        </DesignCard>
        <DesignCard class="p-5">
          <DesignStat label="Needs you" :value="String(store.actionNeeded)" :tone="store.actionNeeded ? 'amber' : 'ink'" hint="one-tap stage actions" />
        </DesignCard>
        <DesignCard class="p-5">
          <DesignStat label="Payouts pending" :value="formatKES(payoutsPendingKes)" tone="amber" hint="escrowed by Printy" />
        </DesignCard>
        <DesignCard class="p-5">
          <DesignStat label="Paid out" :value="formatKES(payoutsReleasedKes)" tone="green" :hint="`${completedJobs.length} job${completedJobs.length === 1 ? '' : 's'} delivered`" />
        </DesignCard>
      </section>

      <span id="requests" class="block scroll-mt-24" aria-hidden="true" />

      <DesignPrinterSection id="jobs" index="01" title="Production floor" hint="one tap moves the line">
        <div v-if="store.loading && !store.loaded" class="flex items-center justify-center gap-2 rounded-2xl border border-line bg-card py-14 text-sm text-ink-2">
          <Loader2 :size="16" class="animate-spin text-brand" aria-hidden="true" /> Loading your floor queue…
        </div>

        <DesignCard v-else-if="!store.items.length" class="flex flex-col items-center px-5 py-14 text-center">
          <CheckCheck :size="28" class="text-brand" aria-hidden="true" />
          <div class="mt-3 text-base font-bold text-ink">Floor is clear</div>
          <div class="mt-1 max-w-[42ch] text-sm text-ink-2">No live jobs on your presses. New requests land here first.</div>
        </DesignCard>

        <div v-else class="space-y-6">
          <section v-for="group in groups" :key="group.key" :aria-labelledby="`printer-group-${group.key}`">
            <div class="mb-2 flex items-center gap-2">
              <h2 :id="`printer-group-${group.key}`" class="font-mono text-[10px] font-bold uppercase tracking-[0.16em]" :class="group.muted ? 'text-ink-3' : 'text-ink'">
                {{ group.label }}
              </h2>
              <span class="rounded-full bg-paper-2 px-2 py-[1px] font-mono text-[9px] font-semibold text-ink-3">{{ group.items.length }}</span>
            </div>
            <div class="grid gap-4 sm:grid-cols-2">
              <JobCard
                v-for="assignment in group.items"
                :key="assignment.id"
                :assignment="assignment"
                :now="now"
                @advance="onAdvance"
              />
            </div>
          </section>
        </div>
      </DesignPrinterSection>

      <div class="grid items-start gap-8 lg:grid-cols-2">
        <DesignPrinterSection id="rates" index="02" title="Rate card" hint="server-enforced fair bands">
          <DesignCard class="p-6">
            <div class="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p class="text-lg font-bold tracking-tight">Your published prices</p>
                <p class="mt-1 max-w-md text-[13px] leading-relaxed text-ink-2">
                  One price panel feeds every paper, printing and finishing cell. Managers only see shops with a saved, confirmed rate card.
                </p>
              </div>
              <DesignStatusPill :tone="rateCardStatus?.is_confirmed ? 'ontrack' : 'atrisk'">
                {{ rateCardStatus?.is_confirmed ? 'Live' : 'Draft' }}
              </DesignStatusPill>
            </div>
            <div class="mt-5 flex items-center justify-between gap-4 border-t border-line pt-4">
              <p class="font-mono text-[10.5px] tracking-[0.06em] text-ink-3">
                <template v-if="rateCardStatus">
                  {{ rateCardStatus.completed_steps }} of {{ rateCardStatus.total_steps }} setup steps done
                </template>
                <template v-else>Setup status unavailable right now</template>
              </p>
              <NuxtLink
                to="/app/printer/rates"
                class="inline-flex items-center gap-1.5 rounded-xl border border-line-strong bg-card px-3.5 py-2 font-mono text-[10px] font-semibold uppercase tracking-[0.1em] text-ink-2 transition-colors hover:border-brand hover:text-brand"
              >
                Open rate card <ChevronRight :size="12" />
              </NuxtLink>
            </div>
          </DesignCard>
        </DesignPrinterSection>

        <DesignPrinterSection id="shop" index="03" title="Shop profile" hint="verified partner details">
          <DesignCard class="p-6">
            <div class="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p class="text-lg font-bold tracking-tight">{{ shopName }}</p>
                <p class="mt-1 flex items-center gap-1.5 font-mono text-[11px] text-ink-3">
                  <MapPin :size="13" /> {{ shopLocation }}
                </p>
              </div>
              <span class="inline-flex items-center gap-1.5 rounded-full border border-brand/40 bg-mint px-2.5 py-1 font-mono text-[9.5px] font-semibold uppercase tracking-[0.1em] text-brand-deep">
                <BadgeCheck :size="12" /> Verified
              </span>
            </div>
            <div class="my-5 border-t border-dashed border-line" />
            <dl class="grid grid-cols-2 gap-4">
              <div>
                <dt class="font-mono text-[10px] uppercase tracking-[0.14em] text-ink-3">Paper stock</dt>
                <dd class="tabular mt-1 font-mono text-xl font-semibold">{{ shop.papers.length }}</dd>
              </div>
              <div>
                <dt class="font-mono text-[10px] uppercase tracking-[0.14em] text-ink-3">Finishing services</dt>
                <dd class="tabular mt-1 font-mono text-xl font-semibold text-green">{{ shop.finishings.length }}</dd>
              </div>
            </dl>
            <p class="mt-5 rounded-xl border border-dashed border-line-strong bg-paper-2/60 px-4 py-3 font-mono text-[10.5px] leading-relaxed text-ink-3">
              Profile facts are server-side. Edits go through admin verification — buyers never see unvetted claims.
            </p>
            <NuxtLink
              to="/app/printer/shop"
              class="mt-4 inline-flex items-center gap-1.5 font-mono text-[10px] font-semibold uppercase tracking-[0.1em] text-brand transition-colors hover:text-brand-deep"
            >
              Open shop setup <ChevronRight :size="12" />
            </NuxtLink>
          </DesignCard>
        </DesignPrinterSection>
      </div>

      <DesignPrinterSection id="payouts" index="04" title="Payouts" hint="escrow releases on delivery">
        <DesignCard class="p-6">
          <div class="mb-4 grid grid-cols-2 gap-5 border-b border-line pb-4">
            <div>
              <p class="font-mono text-[10px] uppercase tracking-[0.14em] text-ink-3">Pending</p>
              <p class="tabular mt-1 font-mono text-xl font-semibold text-amber">{{ formatKES(payoutsPendingKes) }}</p>
            </div>
            <div>
              <p class="font-mono text-[10px] uppercase tracking-[0.14em] text-ink-3">Released</p>
              <p class="tabular mt-1 font-mono text-xl font-semibold text-green">{{ formatKES(payoutsReleasedKes) }}</p>
            </div>
          </div>
          <DesignLedgerRows v-if="payoutRows.length" :rows="payoutRows" />
          <p v-else class="text-[12.5px] leading-relaxed text-ink-2">
            No payout has been released yet. Completed jobs appear here the moment delivery is confirmed.
          </p>
        </DesignCard>
      </DesignPrinterSection>

      <div class="grid items-start gap-8 lg:grid-cols-2">
        <DesignPrinterSection id="messages" index="05" title="Messages" hint="manager and client threads">
          <DesignCard class="flex flex-wrap items-center justify-between gap-4 p-5">
            <div class="min-w-0">
              <p class="text-[14px] font-semibold tracking-tight">Production conversations</p>
              <p class="mt-1 text-[12.5px] leading-relaxed text-ink-2">Questions, artwork notes and production updates stay in one thread.</p>
            </div>
            <NuxtLink to="/app/messages" class="inline-flex items-center gap-1.5 rounded-xl border border-line-strong bg-card px-3.5 py-2 font-mono text-[10px] font-semibold uppercase tracking-[0.1em] text-ink-2 transition-colors hover:border-brand hover:text-brand">
              Open messages <ChevronRight :size="12" />
            </NuxtLink>
          </DesignCard>
        </DesignPrinterSection>

        <DesignPrinterSection id="notifications" index="06" title="Notifications" hint="queue alerts">
          <DesignCard class="flex flex-wrap items-center justify-between gap-4 p-5">
            <div class="min-w-0">
              <p class="text-[14px] font-semibold tracking-tight">Queue notifications</p>
              <p class="mt-1 text-[12.5px] leading-relaxed text-ink-2">New jobs, rate approvals and escrow confirmation land here.</p>
            </div>
            <NuxtLink to="/notifications" class="inline-flex items-center gap-1.5 rounded-xl border border-line-strong bg-card px-3.5 py-2 font-mono text-[10px] font-semibold uppercase tracking-[0.1em] text-ink-2 transition-colors hover:border-brand hover:text-brand">
              Open notifications <ChevronRight :size="12" />
            </NuxtLink>
          </DesignCard>
        </DesignPrinterSection>
      </div>

      <!-- "Done. Undo" toast, two-minute window (prompt 5 item 3). -->
      <div v-if="store.toast" class="undo-toast" role="status" aria-live="polite">
        <span class="undo-toast__icon" aria-hidden="true"><Check :size="14" /></span>
        <span class="undo-toast__text">
          Done. <strong>{{ store.toast.text }}</strong>
          <span class="undo-toast__code">{{ store.toast.code }}</span>
        </span>
        <button type="button" class="undo-toast__button" @click="store.undoToast()">
          <Undo2 :size="13" aria-hidden="true" /> Undo
        </button>
        <button type="button" class="undo-toast__close" aria-label="Dismiss" @click="store.clearToast()">×</button>
      </div>
    </div>
  </DesignPrinterSurface>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { ArrowRight, BadgeCheck, Check, CheckCheck, ChevronRight, Coins, Loader2, MapPin, Printer, RefreshCw, Undo2, WifiOff } from 'lucide-vue-next'
import JobCard from '~/components/workbench/views/JobCard.vue'
import DesignPrinterSurface from '~/components/design/printer/PrinterSurface.vue'
import DesignPrinterPageHeader from '~/components/design/printer/PrinterPageHeader.vue'
import DesignPrinterSection from '~/components/design/printer/PrinterSection.vue'
import DesignCard from '~/components/design/ui/Card.vue'
import DesignStat from '~/components/design/ui/Stat.vue'
import DesignStatusPill from '~/components/design/ui/StatusPill.vue'
import DesignLedgerRows from '~/components/design/ui/LedgerRows.vue'
import { usePrinterJobsStore } from '~/stores/printer-jobs'
import { useAuthStore } from '~/stores/auth'
import { useShopStore } from '~/stores/shop'
import { useApi } from '~/composables/useApi'
import { API } from '~/shared/api-paths'
import { formatKES } from '~/utils/printy'
import type { LedgerRow } from '~/types/design/ledger-row'
import type { JobAssignment } from '~/shared/types'

interface SetupStatusSummary {
  is_confirmed: boolean
  completed_steps: number
  total_steps: number
}

const store = usePrinterJobsStore()
const auth = useAuthStore()
const shop = useShopStore()
const { api } = useApi()
const rateCardStatus = ref<SetupStatusSummary | null>(null)
const now = ref(0)
let refreshTimer: ReturnType<typeof setInterval> | null = null
let clockTimer: ReturnType<typeof setInterval> | null = null

const groups = computed(() => {
  const order = ['new', 'paid', 'in_progress', 'finished', 'completed']
  const labels: Record<string, string> = {
    new: 'New work',
    paid: 'Paid work',
    in_progress: 'Work in progress',
    finished: 'Finished',
    completed: 'Completed and paid',
  }
  const buckets = new Map<string, JobAssignment[]>()
  for (const assignment of store.sorted) {
    const key = order.includes(String(assignment.section)) ? String(assignment.section) : 'in_progress'
    if (!buckets.has(key)) buckets.set(key, [])
    buckets.get(key)!.push(assignment)
  }
  return order
    .filter((key) => (buckets.get(key)?.length ?? 0) > 0)
    .map((key) => ({
      key,
      label: labels[key] ?? key,
      muted: key === 'finished' || key === 'completed',
      items: buckets.get(key)!,
    }))
})

const activeJobs = computed(() => store.items.filter((item) => String(item.status) !== 'completed'))
const completedJobs = computed(() => store.items.filter((item) => String(item.status) === 'completed' || item.muted))
const shopName = computed(() => {
  const fromUser = String(auth.user?.shop_name ?? '').trim()
  if (fromUser) return fromUser
  const active = shop.shops.find((entry) => entry.slug === shop.activeSlug) ?? shop.shops[0]
  const fromShop = String(active?.name ?? '').trim()
  if (fromShop) return fromShop
  const first = String(auth.user?.name ?? '').trim().split(/\s+/)[0]
  return first ? `${first} Press` : 'Your print shop'
})

const shopLocation = computed(() => {
  const active = shop.shops.find((entry) => entry.slug === shop.activeSlug) ?? shop.shops[0]
  const parts = [String(active?.service_area ?? '').trim(), String(active?.city ?? '').trim()].filter(Boolean)
  return parts.length ? parts.join(' · ') : 'Location set in shop setup'
})

function payoutAmount(item: JobAssignment): number {
  const value = Number(item.payout_amount ?? 0)
  return Number.isFinite(value) ? value : 0
}

const payoutsPendingKes = computed(() => store.items
  .filter((item) => String(item.status) !== 'completed' && !item.muted)
  .reduce((total, item) => total + payoutAmount(item), 0))

const payoutsReleasedKes = computed(() => completedJobs.value
  .reduce((total, item) => total + payoutAmount(item), 0))

const payoutRows = computed<LedgerRow[]>(() => completedJobs.value
  .filter((item) => payoutAmount(item) > 0)
  .slice(0, 6)
  .map((item) => ({
    label: item.code || item.managed_reference || item.job_reference,
    hint: item.payout_status_label || item.section_label || undefined,
    value: formatKES(payoutAmount(item)),
    tone: 'green' as const,
  })))

function onAdvance(assignment: JobAssignment) {
  void store.advance(assignment)
}

async function refresh() {
  await store.load({ silent: store.loaded })
  now.value = Date.now()
}

function onOnline() {
  void store.syncQueue()
  void refresh()
}

onMounted(async () => {
  now.value = Date.now()
  store.hydrateQueue()
  await store.load()
  void store.syncQueue()
  try {
    const payload = await api<{ setup_status?: SetupStatusSummary }>(API.rateCard.setup)
    rateCardStatus.value = payload?.setup_status ?? null
  } catch {
    rateCardStatus.value = null
  }
  if (shop.shops.length === 0) await shop.fetchShops()
  if (shop.identifier) {
    await Promise.all([
      shop.fetchPapers(),
      shop.fetchFinishings(),
      shop.fetchMachines(),
    ])
  }

  refreshTimer = setInterval(() => {
    if (typeof document !== 'undefined' && document.visibilityState === 'hidden') return
    void refresh()
    void store.syncQueue()
  }, 30_000)
  clockTimer = setInterval(() => {
    now.value = Date.now()
  }, 30_000)
  window.addEventListener('online', onOnline)
})

onBeforeUnmount(() => {
  if (refreshTimer) clearInterval(refreshTimer)
  if (clockTimer) clearInterval(clockTimer)
  window.removeEventListener('online', onOnline)
  store.clearToast()
})
</script>

<style scoped>
.undo-toast {
  position: fixed;
  bottom: 20px;
  left: 50%;
  z-index: 80;
  display: flex;
  align-items: center;
  gap: 10px;
  width: min(520px, calc(100vw - 24px));
  transform: translateX(-50%);
  border: 1px solid #2fbf71;
  border-radius: 14px;
  background: #1b1710;
  padding: 10px 12px;
  color: #fff;
  box-shadow: 0 18px 44px -20px rgba(0, 0, 0, 0.55);
}

.undo-toast__icon {
  display: flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border-radius: 999px;
  background: #2fbf71;
  color: #0b1710;
}

.undo-toast__text {
  min-width: 0;
  flex: 1;
  font-size: 12.5px;
  line-height: 1.3;
}

.undo-toast__code {
  display: block;
  margin-top: 1px;
  font-family: var(--font-mono2, ui-monospace, monospace);
  font-size: 9px;
  letter-spacing: 0.08em;
  color: rgba(255, 255, 255, 0.6);
}

.undo-toast__button {
  display: inline-flex;
  flex-shrink: 0;
  align-items: center;
  gap: 4px;
  border-radius: 9px;
  background: #fff;
  padding: 8px 11px;
  font-family: var(--font-mono2, ui-monospace, monospace);
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: #1b1710;
}

.undo-toast__close {
  flex-shrink: 0;
  padding: 4px 6px;
  font-size: 16px;
  line-height: 1;
  color: rgba(255, 255, 255, 0.6);
}

@media (prefers-reduced-motion: reduce) {
  .undo-toast {
    transition: none;
  }
}
</style>
