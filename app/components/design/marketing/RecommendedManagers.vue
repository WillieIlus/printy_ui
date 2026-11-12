<script setup lang="ts">
/**
 * Recommended managers — the live homepage shortlist.
 *
 * Sits directly below the speed cards and matches their card language. The
 * server decides who can meet the selected speed from real availability,
 * capacity, product history and on-time record; this component never invents a
 * manager, a photo or a ready-by figure. A curated recommendation, not a
 * marketplace: no ratings, search, filters or "see all" link.
 *
 * Signed-in buyers can lock up to three managers. The shortlist is persisted by
 * the API and re-read on load, so it survives a refresh and stays accurate even
 * when the recommendation cache is warm.
 */
import { computed, onMounted, ref, watch } from 'vue'
import { BadgeCheck, Check, Loader2, Lock, MoonStar, Unlock } from 'lucide-vue-next'
import { cx } from '../../../utils/design/cx'
import { API } from '~/shared/api-paths'
import { getApiErrorCode, getApiErrorMessage, isForbiddenError } from '~/shared/api'
import type {
  BuyerLockedManagersResponse,
  ManagerLockMutationResponse,
  PublicRecommendedManager,
  PublicRecommendedManagersResponse,
} from '~/shared/types'
import { useAuthStore } from '~/stores/auth'

const props = withDefaults(defineProps<{
  speedId: string
  speedLabel: string
  totalLabel: string
  perPieceLabel: string
  /** The exact payload the calculator preview priced. */
  payload?: Record<string, unknown> | null
  /** Standard-tier turnaround; null lets the server use its stage-SLA fallback. */
  turnaroundHours?: number | null
  loading?: boolean
  updating?: boolean
}>(), {
  payload: null,
  turnaroundHours: null,
  loading: false,
  updating: false,
})

interface ManagerCard {
  id: string
  name: string
  firstName: string
  photo: string | null
  initials: string
  verified: boolean
  availabilityLabel: string
  availableNow: boolean
  readyByLabel: string
  onTimePct: number | null
  jobsLabel: string | null
  recommended: boolean
}

const auth = useAuthStore()
const { api, getMediaUrl } = useApi()

const signedIn = computed(() => auth.isAuthenticated)
const canLock = computed(() => auth.canAccessClientDashboard)

const recommendation = ref<PublicRecommendedManagersResponse | null>(null)
const loading = ref(true)
const fetchError = ref('')
const lockedIds = ref<string[]>([])
const lockCap = ref(3)
const lockBusyId = ref<string | null>(null)
const lockError = ref('')
const photoFailures = ref<Record<string, boolean>>({})
let requestId = 0

const tier = computed(() => {
  const tiers = recommendation.value?.tiers
  if (!tiers) return null
  return tiers[props.speedId] ?? null
})

const tierHours = computed(() => {
  const hours = tier.value?.turnaround_hours
  return typeof hours === 'number' && hours > 0 ? hours : null
})

const liveBadge = computed(() => {
  if (props.loading || loading.value) return 'Checking availability'
  if (fetchError.value) return 'Availability unavailable'
  return 'Live availability'
})

const managerCards = computed<ManagerCard[]>(() => {
  const rows = tier.value?.managers ?? []
  return rows.map((row) => ({
    id: row.public_id,
    name: row.display_name,
    firstName: firstName(row.display_name),
    photo: photoFor(row),
    initials: initialsFor(row.display_name),
    verified: Boolean(row.verified),
    availabilityLabel: row.availability?.label || 'Availability on request',
    availableNow: row.availability?.status === 'available_now',
    readyByLabel: readyLabel(row),
    onTimePct: typeof row.on_time_pct === 'number' ? Math.round(row.on_time_pct) : null,
    jobsLabel: row.completed_jobs > 0
      ? `${row.completed_jobs} job${row.completed_jobs === 1 ? '' : 's'}`
      : null,
    recommended: Boolean(row.recommended),
  }))
})

const big = computed(() => managerCards.value.find(manager => manager.recommended) ?? managerCards.value[0])
const smalls = computed(() => managerCards.value.filter(manager => manager.id !== big.value?.id))
const showSkeleton = computed(() => (props.loading || loading.value) && managerCards.value.length === 0)
const emptyMessage = computed(() =>
  tier.value?.not_offered
    ? 'This speed is not available for this job right now.'
    : 'No manager is free for this speed.',
)

function firstName(name: string): string {
  return name.trim().split(/\s+/)[0] || name
}

function initialsFor(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return '?'
  const first = parts[0] ?? ''
  if (!first) return '?'
  if (parts.length === 1) return first.slice(0, 2).toUpperCase()
  const last = parts[parts.length - 1] ?? first
  return `${first.charAt(0)}${last.charAt(0)}`.toUpperCase()
}

function photoFor(row: PublicRecommendedManager): string | null {
  if (!row.photo_url || photoFailures.value[row.public_id]) return null
  return getMediaUrl(row.photo_url) || null
}

function markPhotoFailed(id: string) {
  photoFailures.value = { ...photoFailures.value, [id]: true }
}

function readyLabel(row: PublicRecommendedManager): string {
  if (row.ready_label) return `Ready by ${row.ready_label}`
  if (tierHours.value) return `Ready in about ${tierHours.value}h`
  return 'Timing confirmed with your quote'
}

function isLocked(id: string): boolean {
  return lockedIds.value.includes(id)
}

function mergeRecommendationLocks(data: PublicRecommendedManagersResponse) {
  if (!signedIn.value) return
  const rows = Object.values(data.tiers ?? {}).flatMap(tier => tier.managers ?? [])
  if (!rows.some(row => typeof row.is_locked === 'boolean')) return
  const next = new Set(lockedIds.value)
  for (const row of rows) {
    if (row.is_locked) next.add(row.public_id)
  }
  lockedIds.value = [...next]
}

function isBusy(id: string): boolean {
  return lockBusyId.value === id
}

async function loadRecommendations() {
  if (!props.payload) {
    loading.value = false
    return
  }
  const current = ++requestId
  loading.value = true
  fetchError.value = ''
  try {
    const body: Record<string, unknown> = { ...props.payload }
    if (props.turnaroundHours && !body.turnaround_hours) {
      body.turnaround_hours = props.turnaroundHours
    }
    const data = await api<PublicRecommendedManagersResponse>(API.managers.recommended, {
      method: 'POST',
      ...(signedIn.value ? {} : { auth: false }),
      body,
    })
    if (current !== requestId) return
    recommendation.value = data
    mergeRecommendationLocks(data)
  } catch {
    if (current !== requestId) return
    recommendation.value = null
    fetchError.value = 'Live manager recommendations are unavailable right now.'
  } finally {
    if (current === requestId) loading.value = false
  }
}

async function loadLocks() {
  if (!signedIn.value || !canLock.value) {
    lockedIds.value = []
    return
  }
  try {
    const listing = await api<BuyerLockedManagersResponse>(API.managers.locked)
    lockedIds.value = listing.results.map(row => row.public_id)
    if (typeof listing.cap === 'number' && listing.cap > 0) {
      lockCap.value = listing.cap
    }
  } catch {
    // The recommendation list is still useful without the shortlist; do not
    // surface a second error for a background read.
  }
}

function lockErrorMessage(error: unknown, wasLocked: boolean): string {
  if (isForbiddenError(error)) {
    return 'Only buyer accounts can lock managers. Switch to your buyer account to use this shortlist.'
  }
  const code = getApiErrorCode(error)
  if (code === 'lock_limit_reached') {
    return `You can lock up to ${lockCap.value} managers. Unlock one first.`
  }
  if (code === 'manager_at_capacity') {
    return 'This manager is at capacity right now. Try another manager.'
  }
  if (code === 'manager_unavailable') {
    return 'This manager is not accepting new jobs right now.'
  }
  if (code === 'manager_not_verified') {
    return 'This manager has not been verified yet.'
  }
  return getApiErrorMessage(
    error,
    wasLocked ? 'Could not unlock this manager. Try again.' : 'Could not lock this manager. Try again.',
  )
}

async function toggleLock(id: string) {
  if (!signedIn.value || isBusy(id)) return
  if (!canLock.value) {
    lockError.value = 'Only buyer accounts can lock managers. Switch to your buyer account to use this shortlist.'
    return
  }
  const wasLocked = isLocked(id)
  lockBusyId.value = id
  lockError.value = ''
  try {
    if (wasLocked) {
      await api(API.managers.lockedManager(id), { method: 'DELETE' })
      lockedIds.value = lockedIds.value.filter(locked => locked !== id)
    } else {
      const result = await api<ManagerLockMutationResponse>(
        API.managers.lockedManager(id),
        { method: 'PUT', body: {} },
      )
      if (!lockedIds.value.includes(id)) {
        lockedIds.value = [...lockedIds.value, id]
      }
      if (typeof result.cap === 'number' && result.cap > 0) {
        lockCap.value = result.cap
      }
    }
  } catch (error) {
    lockError.value = lockErrorMessage(error, wasLocked)
  } finally {
    lockBusyId.value = null
  }
}

function retry() {
  void loadRecommendations()
  void loadLocks()
}

watch(
  () => props.payload,
  () => {
    void loadRecommendations()
  },
)

watch(signedIn, () => {
  void loadRecommendations()
  void loadLocks()
})

onMounted(() => {
  void loadRecommendations()
  void loadLocks()
})
</script>

<template>
  <section class="mt-8" aria-labelledby="managers-heading">
    <div class="flex flex-wrap items-end justify-between gap-3">
      <div>
        <h3 id="managers-heading" class="text-xl font-bold tracking-tight sm:text-2xl">
          Managers who can handle this job
        </h3>
        <p class="mt-1 text-[13.5px] text-ink-2">
          Based on your spec and speed.
          <span v-if="signedIn && canLock && lockedIds.length > 0" class="text-ink-3">
            · {{ lockedIds.length }} of {{ lockCap }} locked
          </span>
        </p>
      </div>
      <span
        class="inline-flex items-center gap-1.5 rounded-md border px-2 py-1 font-mono text-[9.5px] font-semibold tracking-[0.1em] uppercase"
        :class="fetchError
          ? 'border-line bg-paper-2 text-ink-3'
          : 'border-brand/30 bg-mint text-brand-deep'"
      >
        <span
          class="h-1.5 w-1.5 rounded-full"
          :class="fetchError ? 'bg-amber' : 'pulse-dot bg-green'"
          aria-hidden="true"
        />
        {{ liveBadge }}
      </span>
    </div>

    <div
      v-if="lockError"
      role="alert"
      class="mt-4 flex items-start justify-between gap-3 rounded-xl border border-red/35 bg-red-soft px-4 py-3 text-[13px] font-medium text-red"
    >
      <span>{{ lockError }}</span>
      <button
        type="button"
        class="cursor-pointer font-mono text-[12px] leading-none text-red/70 transition-colors hover:text-red"
        aria-label="Dismiss"
        @click="lockError = ''"
      >
        ✕
      </button>
    </div>

    <div v-if="showSkeleton" class="mt-5 grid gap-4 lg:grid-cols-12">
      <div class="lg:col-span-7">
        <div class="animate-pulse rounded-2xl border border-line bg-card p-6 sm:p-8">
          <div class="flex items-center gap-5">
            <span class="h-20 w-20 rounded-full bg-paper-2" />
            <span class="flex-1">
              <span class="block h-5 w-48 rounded bg-paper-2" />
              <span class="mt-3 block h-3.5 w-28 rounded bg-paper-2" />
            </span>
          </div>
          <div class="mt-5 h-11 w-full rounded bg-paper-2" />
        </div>
      </div>
      <div class="grid gap-4 sm:grid-cols-2 lg:col-span-5 lg:grid-cols-1">
        <div v-for="n in 2" :key="n" class="animate-pulse rounded-2xl border border-line bg-card p-5">
          <div class="flex items-center gap-3.5">
            <span class="h-11 w-11 rounded-full bg-paper-2" />
            <span class="flex-1">
              <span class="block h-3.5 w-28 rounded bg-paper-2" />
              <span class="mt-2 block h-3 w-24 rounded bg-paper-2" />
            </span>
          </div>
          <div class="mt-4 h-8 w-full rounded bg-paper-2" />
        </div>
      </div>
    </div>

    <div
      v-else-if="fetchError"
      class="mt-5 rounded-2xl border border-dashed border-line-strong bg-paper-2/40 px-6 py-10 text-center"
    >
      <span class="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-paper">
        <MoonStar class="h-4.5 w-4.5 text-ink-3" />
      </span>
      <p class="mt-3 text-[15px] font-semibold tracking-tight text-ink">Live availability is unavailable.</p>
      <p class="mt-1 text-[13px] text-ink-2">The speed prices above are still live. Try the manager list again.</p>
      <button
        type="button"
        class="mt-4 inline-flex min-h-[40px] cursor-pointer items-center justify-center rounded-xl border border-line-strong bg-card px-4 py-2.5 text-[13px] font-semibold text-ink transition-colors hover:border-brand hover:text-brand"
        @click="retry"
      >
        Try again
      </button>
    </div>

    <div
      v-else-if="managerCards.length === 0"
      class="mt-5 rounded-2xl border border-dashed border-line-strong bg-paper-2/40 px-6 py-10 text-center"
    >
      <span class="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-paper">
        <MoonStar class="h-4.5 w-4.5 text-ink-3" />
      </span>
      <p class="mt-3 text-[15px] font-semibold tracking-tight text-ink">{{ emptyMessage }}</p>
      <p v-if="!tier?.not_offered" class="mt-1 text-[13px] text-ink-2">Try Standard or check back soon.</p>
    </div>

    <div v-else class="mt-5 grid items-stretch gap-4 lg:grid-cols-12">
      <article
        v-if="big"
        :key="`${props.speedId}-${big.id}`"
        class="reveal-up relative flex flex-col overflow-hidden rounded-2xl border border-line bg-card p-6 shadow-card transition-shadow duration-300 hover:shadow-lift sm:p-8"
        :class="smalls.length ? 'lg:col-span-7' : 'lg:col-span-12'"
      >
        <span class="absolute top-0 right-0 rounded-bl-2xl bg-brand px-3.5 py-2 font-mono text-[10.5px] font-semibold tracking-[0.12em] text-white uppercase">
          Recommended
        </span>
        <span v-if="isLocked(big.id) && signedIn" class="stamp absolute bottom-5 left-5 border-brand text-brand">
          Your managers
        </span>

        <div class="flex items-start gap-5 pr-32">
          <img
            v-if="big.photo"
            :src="big.photo"
            :alt="big.name"
            loading="lazy"
            class="h-20 w-20 shrink-0 rounded-full object-cover ring-1 ring-line"
            @error="markPhotoFailed(big.id)"
          >
          <span
            v-else
            class="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-brand/10 font-mono text-xl font-semibold text-brand-deep ring-1 ring-line"
            aria-hidden="true"
          >
            {{ big.initials }}
          </span>
          <div class="min-w-0">
            <p class="text-[20px] leading-tight font-bold tracking-tight">{{ big.name }}</p>
            <div class="mt-2 flex flex-wrap items-center gap-2">
              <span v-if="big.verified" class="inline-flex items-center gap-1 rounded-full border border-line bg-paper-2 px-2.5 py-1 font-mono text-[10.5px] font-semibold tracking-[0.08em] text-ink-2 uppercase">
                <BadgeCheck class="h-3.5 w-3.5 text-brand" :stroke-width="2.4" />
                Verified
              </span>
              <span v-if="big.onTimePct !== null" class="tabular font-mono text-[12px] text-ink-3">
                {{ big.onTimePct }}% on time<span v-if="big.jobsLabel"> · {{ big.jobsLabel }}</span>
              </span>
            </div>
            <div class="mt-2.5">
              <span class="inline-flex items-center gap-1.5 text-[14px] text-ink-2">
                <span :class="cx('inline-block h-2 w-2 rounded-full', big.availableNow ? 'pulse-dot bg-green' : 'bg-amber')" aria-hidden="true" />
                {{ big.availabilityLabel }}
              </span>
            </div>
          </div>
        </div>

        <div class="mt-6 flex flex-wrap items-end justify-between gap-4 border-t border-line pt-5">
          <div :class="cx('transition-opacity duration-300', props.updating && 'opacity-45')">
            <p class="font-mono text-[11px] tracking-[0.14em] text-ink-3 uppercase">{{ props.speedLabel }}</p>
            <p class="mt-1 text-[15px] font-medium text-ink">{{ big.readyByLabel }}</p>
            <p class="mt-0.5 font-mono text-[11px] text-ink-3">Estimated</p>
          </div>
          <div :class="cx('transition-opacity duration-300', props.updating && 'opacity-45')">
            <p class="tabular font-mono text-[20px] font-semibold tracking-tight text-ink">{{ props.totalLabel }}</p>
            <p class="tabular font-mono text-[12px] text-ink-3">{{ props.perPieceLabel }}</p>
          </div>
        </div>

        <div class="mt-auto pt-6">
          <NuxtLink
            v-if="!signedIn"
            to="/sign-in"
            class="inline-flex min-h-[52px] w-full items-center justify-center gap-2 rounded-xl bg-brand px-5 py-4 text-center text-[15px] leading-tight font-semibold tracking-[-0.01em] text-white shadow-brand transition-colors hover:bg-brand-deep"
          >
            <Lock class="h-4 w-4 shrink-0" />
            <span>Sign in to lock {{ big.firstName }}</span>
          </NuxtLink>
          <span
            v-else-if="!canLock"
            class="flex min-h-[52px] w-full items-center justify-center gap-2 rounded-xl border border-line bg-paper-2 px-5 py-4 text-center text-[13px] leading-tight font-medium text-ink-3"
          >
            <Lock class="h-4 w-4 shrink-0" />
            Buyer account required to lock
          </span>
          <span v-else-if="isLocked(big.id)" class="flex w-full items-center justify-between gap-2 rounded-xl border border-brand/40 bg-mint px-4 py-3">
            <span class="inline-flex items-center gap-1.5 text-[15px] font-semibold text-brand-deep">
              <Loader2 v-if="isBusy(big.id)" class="h-4 w-4 animate-spin" />
              <Check v-else class="h-4 w-4" :stroke-width="3" />
              {{ isBusy(big.id) ? 'Saving…' : 'Locked' }}
            </span>
            <button
              type="button"
              class="inline-flex cursor-pointer items-center gap-1 font-mono text-[10.5px] tracking-[0.08em] text-ink-3 uppercase transition-colors hover:text-ink disabled:cursor-wait disabled:opacity-50"
              :disabled="isBusy(big.id)"
              @click="toggleLock(big.id)"
            >
              <Unlock class="h-3.5 w-3.5" /> Unlock
            </button>
          </span>
          <button
            v-else
            type="button"
            class="inline-flex min-h-[52px] w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-brand px-5 py-4 text-center text-[15px] leading-tight font-semibold tracking-[-0.01em] text-white shadow-brand transition-colors hover:bg-brand-deep disabled:cursor-wait disabled:opacity-60"
            :disabled="isBusy(big.id)"
            @click="toggleLock(big.id)"
          >
            <Loader2 v-if="isBusy(big.id)" class="h-4 w-4 shrink-0 animate-spin" />
            <Lock v-else class="h-4 w-4 shrink-0" />
            <span>{{ isBusy(big.id) ? 'Saving…' : `Lock ${big.firstName}` }}</span>
          </button>
        </div>
      </article>

      <div v-if="smalls.length" class="grid gap-4 sm:grid-cols-2 lg:col-span-5 lg:auto-rows-fr lg:grid-cols-1">
        <article
          v-for="(manager, index) in smalls"
          :key="`${props.speedId}-${manager.id}`"
          class="reveal-up flex h-full flex-col rounded-2xl border border-line bg-card p-5 shadow-card transition-shadow duration-300 hover:shadow-lift"
          :style="{ animationDelay: `${70 + index * 70}ms` }"
        >
          <div class="flex items-start gap-3">
            <img
              v-if="manager.photo"
              :src="manager.photo"
              :alt="manager.name"
              loading="lazy"
              class="h-11 w-11 shrink-0 rounded-full object-cover ring-1 ring-line"
              @error="markPhotoFailed(manager.id)"
            >
            <span
              v-else
              class="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brand/10 font-mono text-[12px] font-semibold text-brand-deep ring-1 ring-line"
              aria-hidden="true"
            >
              {{ manager.initials }}
            </span>
            <div class="min-w-0 flex-1">
              <p class="truncate text-[14px] font-semibold tracking-tight">{{ manager.name }}</p>
              <div class="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1">
                <span v-if="manager.verified" class="inline-flex items-center gap-1 rounded-full border border-line bg-paper-2 px-2 py-[3px] font-mono text-[9.5px] font-semibold tracking-[0.08em] text-ink-2 uppercase">
                  <BadgeCheck class="h-3 w-3 text-brand" :stroke-width="2.4" />
                  Verified
                </span>
                <span v-if="manager.onTimePct !== null" class="tabular font-mono text-[10.5px] text-ink-3">
                  {{ manager.onTimePct }}% on time<span v-if="manager.jobsLabel"> · {{ manager.jobsLabel }}</span>
                </span>
              </div>
            </div>
          </div>

          <div class="mt-3 flex flex-col gap-1">
            <span class="inline-flex items-center gap-1.5 text-[12.5px] text-ink-2">
              <span :class="cx('inline-block h-1.5 w-1.5 rounded-full', manager.availableNow ? 'pulse-dot bg-green' : 'bg-amber')" aria-hidden="true" />
              {{ manager.availabilityLabel }}
            </span>
            <p :class="cx('text-[12.5px] text-ink-2 transition-opacity duration-300', props.updating && 'opacity-45')">
              {{ manager.readyByLabel }}
              <span class="ml-1.5 font-mono text-[10px] text-ink-3">Estimated</span>
            </p>
          </div>

          <div class="mt-3 flex items-end justify-between gap-3 border-t border-line pt-3">
            <div :class="cx('transition-opacity duration-300', props.updating && 'opacity-45')">
              <p class="tabular font-mono text-[17px] font-semibold tracking-tight text-ink">{{ props.totalLabel }}</p>
              <p class="tabular font-mono text-[10.5px] text-ink-3">{{ props.perPieceLabel }}</p>
            </div>
            <span v-if="isLocked(manager.id) && signedIn" class="rounded-full border border-brand/40 bg-mint px-2 py-[3px] font-mono text-[9px] font-semibold tracking-[0.08em] text-brand-deep uppercase">
              Your managers
            </span>
          </div>

          <div class="mt-auto pt-3">
            <NuxtLink
              v-if="!signedIn"
              to="/sign-in"
              class="inline-flex min-h-[44px] w-full items-center justify-center gap-2 rounded-xl border border-line-strong px-4 py-3 text-center text-[13px] leading-tight font-semibold tracking-[-0.01em] text-ink transition-colors hover:border-brand hover:text-brand"
            >
              <Lock class="h-3.5 w-3.5 shrink-0" />
              <span>Sign in to lock {{ manager.firstName }}</span>
            </NuxtLink>
            <span
              v-else-if="!canLock"
              class="flex min-h-[44px] w-full items-center justify-center gap-2 rounded-xl border border-line bg-paper-2 px-4 py-3 text-center text-[12px] leading-tight font-medium text-ink-3"
            >
              <Lock class="h-3.5 w-3.5 shrink-0" />
              Buyer account required
            </span>
            <span v-else-if="isLocked(manager.id)" class="flex w-full items-center justify-between gap-2 rounded-xl border border-brand/40 bg-mint px-4 py-2.5">
              <span class="inline-flex items-center gap-1.5 text-[13px] font-semibold text-brand-deep">
                <Loader2 v-if="isBusy(manager.id)" class="h-3.5 w-3.5 animate-spin" />
                <Check v-else class="h-3.5 w-3.5" :stroke-width="3" />
                {{ isBusy(manager.id) ? 'Saving…' : 'Locked' }}
              </span>
              <button
                type="button"
                class="inline-flex cursor-pointer items-center gap-1 font-mono text-[9.5px] tracking-[0.08em] text-ink-3 uppercase transition-colors hover:text-ink disabled:cursor-wait disabled:opacity-50"
                :disabled="isBusy(manager.id)"
                @click="toggleLock(manager.id)"
              >
                <Unlock class="h-3 w-3" /> Unlock
              </button>
            </span>
            <button
              v-else
              type="button"
              class="inline-flex min-h-[44px] w-full cursor-pointer items-center justify-center gap-2 rounded-xl border border-line-strong px-4 py-3 text-center text-[13px] leading-tight font-semibold tracking-[-0.01em] text-ink transition-colors hover:border-brand hover:text-brand disabled:cursor-wait disabled:opacity-60"
              :disabled="isBusy(manager.id)"
              @click="toggleLock(manager.id)"
            >
              <Loader2 v-if="isBusy(manager.id)" class="h-3.5 w-3.5 shrink-0 animate-spin" />
              <Lock v-else class="h-3.5 w-3.5 shrink-0" />
              <span>{{ isBusy(manager.id) ? 'Saving…' : `Lock ${manager.firstName}` }}</span>
            </button>
          </div>
        </article>
      </div>
    </div>

    <p class="mt-4 font-mono text-[10.5px] tracking-[0.06em] text-ink-3">
      Price is locked by your spec and speed · no shop identity or production cost is shown ·
      curated for this job, not a marketplace
    </p>
  </section>
</template>
