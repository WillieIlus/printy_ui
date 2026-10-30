<template>
  <div class="mx-auto w-full max-w-[1200px]">
    <div class="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div>
        <div class="flex items-center gap-2 font-mono2 text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--sub)]">
          <Printer :size="12" class="text-[var(--accent)]" aria-hidden="true" /> {{ shopName }}
        </div>
        <h1 class="mt-1 font-disp text-[26px] font-bold tracking-tight text-[var(--ink)] sm:text-[30px]">Production Floor</h1>
        <p class="mt-1 max-w-3xl text-sm text-[var(--sub)]">
          One tap moves the job to the next stage. Your own production detail only — buyer prices and manager margins never enter this screen.
        </p>
      </div>
      <div class="flex flex-wrap items-center gap-2">
        <span class="inline-flex items-center gap-1.5 rounded-full bg-[var(--panel2)] px-2.5 py-1.5 font-mono2 text-[10px] uppercase tracking-[0.12em] text-[var(--sub)]">
          <span class="h-1.5 w-1.5 rounded-full bg-[#2FBF71]" /> Live shop data
        </span>
        <span class="rounded-full tone-accent px-2.5 py-1.5 font-mono2 text-[10px] uppercase tracking-[0.12em] text-[var(--accent)]">
          {{ activeJobs.length }} {{ activeJobs.length === 1 ? 'job' : 'jobs' }} live
        </span>
        <NuxtLink
          to="/app/printer/rates"
          class="inline-flex items-center gap-1.5 rounded-xl border border-[var(--line)] bg-[var(--panel)] px-3 py-2 text-xs font-semibold text-[var(--ink)] transition-colors hover:bg-[var(--panel2)]"
        >
          <Coins :size="14" aria-hidden="true" /> My rate card
          <span v-if="rateCardStatus" class="font-normal text-[var(--sub)]">
            · {{ rateCardStatus.is_confirmed ? 'You are live to managers.' : `${rateCardStatus.completed_steps} of ${rateCardStatus.total_steps} steps done` }}
          </span>
        </NuxtLink>
        <button
          type="button"
          class="inline-flex items-center gap-1.5 rounded-xl border border-[var(--line)] bg-[var(--panel)] px-3 py-2 text-xs font-semibold text-[var(--ink)] transition-colors hover:bg-[var(--panel2)]"
          :disabled="store.loading"
          @click="refresh"
        >
          <RefreshCw :size="13" :class="{ 'animate-spin': store.loading }" aria-hidden="true" /> Refresh
        </button>
      </div>
    </div>

    <div v-if="store.pendingCount" class="mb-4 flex flex-wrap items-center gap-3 rounded-2xl border px-4 py-3" style="border-color: #F5A623; background: rgba(245,166,35,.08)">
      <WifiOff :size="16" style="color: #8A5A00" aria-hidden="true" />
      <p class="min-w-0 flex-1 text-[12.5px] text-[#8A5A00]">
        <strong>{{ store.pendingCount }}</strong> {{ store.pendingCount === 1 ? 'update is' : 'updates are' }} waiting to send. Nothing was lost — we retry automatically.
      </p>
      <button type="button" class="rounded-lg border border-[#8A5A00] px-3 py-1.5 font-mono2 text-[9px] font-bold uppercase tracking-[0.1em] text-[#8A5A00]" @click="store.syncQueue()">
        Retry now
      </button>
    </div>

    <p v-if="store.error" class="mb-4 rounded-xl px-4 py-3 text-xs" role="status" style="background: rgba(251,77,109,.08); color: #B4243F">
      {{ store.error }}
    </p>

    <div v-if="store.loading && !store.loaded" class="flex items-center justify-center gap-2 rounded-2xl border border-[var(--line)] bg-[var(--panel)] py-14 text-sm text-[var(--sub)]">
      <Loader2 :size="16" class="animate-spin" aria-hidden="true" /> Loading your floor queue…
    </div>

    <div v-else-if="!store.items.length" class="flex flex-col items-center rounded-2xl border border-[var(--line)] bg-[var(--panel)] px-5 py-14 text-center">
      <CheckCheck :size="28" class="text-[var(--accent)]" aria-hidden="true" />
      <div class="mt-3 text-base font-bold text-[var(--ink)]">Floor is clear</div>
      <div class="mt-1 max-w-[42ch] text-sm text-[var(--sub)]">No live jobs on your presses. New requests land here first.</div>
    </div>

    <div v-else class="space-y-6">
      <section v-for="group in groups" :key="group.key" :aria-labelledby="`printer-group-${group.key}`">
        <div class="mb-2 flex items-center gap-2">
          <h2 :id="`printer-group-${group.key}`" class="font-mono2 text-[10px] font-bold uppercase tracking-[0.16em]" :style="{ color: group.muted ? 'var(--sub)' : 'var(--ink)' }">
            {{ group.label }}
          </h2>
          <span class="rounded-full bg-[var(--panel2)] px-2 py-[1px] font-mono2 text-[9px] font-semibold text-[var(--sub)]">{{ group.items.length }}</span>
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
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { Check, CheckCheck, Coins, Loader2, Printer, RefreshCw, Undo2, WifiOff } from 'lucide-vue-next'
import JobCard from '~/components/workbench/views/JobCard.vue'
import { usePrinterJobsStore } from '~/stores/printer-jobs'
import { useAuthStore } from '~/stores/auth'
import { useShopStore } from '~/stores/shop'
import { useApi } from '~/composables/useApi'
import { API } from '~/shared/api-paths'
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
const shopName = computed(() => {
  const fromUser = String(auth.user?.shop_name ?? '').trim()
  if (fromUser) return fromUser
  const active = shop.shops.find((entry) => entry.slug === shop.activeSlug) ?? shop.shops[0]
  const fromShop = String(active?.name ?? '').trim()
  if (fromShop) return fromShop
  const first = String(auth.user?.name ?? '').trim().split(/\s+/)[0]
  return first ? `${first} Press` : 'Your print shop'
})

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
  if (shop.identifier) await shop.fetchMachines()

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
