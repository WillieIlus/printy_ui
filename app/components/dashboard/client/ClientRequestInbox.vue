<!-- Purpose: Client dashboard request inbox grouped by action state. Connected to quoteInboxStore. -->
<template>
  <DashboardSectionCard
    title="Your print requests"
    description="Track responses, compare quotes, and continue drafts."
  >
    <template #action>
      <BaseButton variant="primary" size="sm" to="/">Start new request</BaseButton>
    </template>

    <!-- Loading -->
    <div
      v-if="isBooting"
      class="flex items-center justify-center gap-2 py-12 text-sm text-[var(--p-text-muted)]"
    >
      <Icon name="lucide:loader-2" class="size-4 animate-spin" />
      Loading your requests...
    </div>

    <!-- Error -->
    <div
      v-else-if="error"
      class="rounded-2xl border border-[var(--p-error)]/30 bg-[var(--p-error-soft)] p-4 text-sm text-[var(--p-error)]"
    >
      <div class="space-y-3">
        <p class="font-semibold">We couldn't load your request activity.</p>
        <p>{{ error }}</p>
        <BaseButton variant="outline" size="sm" @click="refreshInbox">Try again</BaseButton>
      </div>
    </div>

    <!-- Empty -->
    <div v-else-if="!loading && allEmpty" class="space-y-4 py-14 text-center">
      <div class="mx-auto flex size-14 items-center justify-center rounded-3xl bg-[var(--p-bg-soft)]">
        <Icon name="lucide:inbox" class="size-7 text-[var(--p-text-muted)]" />
      </div>
      <div class="space-y-1">
        <p class="font-semibold text-[var(--p-text)]">No print requests yet</p>
        <p class="mx-auto max-w-xs text-sm text-[var(--p-text-muted)]">
          Use the homepage calculator to get matched with shops and send your first request.
        </p>
      </div>
      <BaseButton variant="primary" size="sm" to="/">Start your first request</BaseButton>
    </div>

    <!-- Grouped inbox -->
    <div v-else class="space-y-7">

      <!-- Needs your attention -->
      <template v-if="groups.attention.length">
        <div class="flex items-center gap-2.5">
          <span class="size-2 shrink-0 rounded-full" style="background: var(--p-warning)" />
          <p class="text-[11px] font-bold uppercase tracking-widest" style="color: var(--p-warning)">
            Needs your attention
          </p>
          <BaseBadge tone="warning">{{ groups.attention.length }}</BaseBadge>
        </div>
        <div
          v-for="req in groups.attention"
          :key="req.id"
          class="relative overflow-hidden rounded-2xl border border-[var(--p-border)] bg-[var(--p-surface)] transition hover:shadow-sm"
        >
          <div class="absolute inset-y-0 left-0 w-1" style="background: var(--p-warning)" />
          <div class="ml-1 flex flex-col gap-3 p-4 sm:flex-row sm:items-start sm:justify-between">
            <div class="min-w-0 space-y-1.5">
              <div class="flex flex-wrap items-center gap-2">
                <p class="font-semibold text-[var(--p-text)]">{{ reqTitle(req) }}</p>
                <BaseBadge :tone="reqBadge(req).tone">{{ reqBadge(req).text }}</BaseBadge>
              </div>
              <p v-if="reqSpec(req)" class="text-sm text-[var(--p-text-muted)]">{{ reqSpec(req) }}</p>
              <div class="flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-[var(--p-text-muted)]">
                <span v-if="reqShopsText(req)">{{ reqShopsText(req) }}</span>
                <span v-if="reqBestPrice(req)" class="font-semibold text-[var(--p-text)]">Best price: {{ reqBestPrice(req) }}</span>
              </div>
              <p v-if="reqConfirmations(req).length" class="text-xs" style="color: var(--p-warning)">
                Needs confirmation: {{ reqConfirmations(req).join(', ') }}
              </p>
            </div>
            <div class="shrink-0 pt-1">
              <BaseButton variant="primary" size="sm" :to="`/dashboard/client/requests/${req.id}`">
                Compare responses
              </BaseButton>
            </div>
          </div>
        </div>
      </template>

      <!-- Waiting on shops -->
      <template v-if="groups.waiting.length">
        <div class="flex items-center gap-2.5">
          <span class="size-2 shrink-0 rounded-full bg-slate-400" />
          <p class="text-[11px] font-bold uppercase tracking-widest text-[var(--p-text-muted)]">Waiting on shops</p>
        </div>
        <div
          v-for="req in groups.waiting"
          :key="req.id"
          class="relative overflow-hidden rounded-2xl border border-[var(--p-border)] bg-[var(--p-surface)] transition hover:shadow-sm"
        >
          <div class="absolute inset-y-0 left-0 w-1 bg-slate-300" />
          <div class="ml-1 flex flex-col gap-3 p-4 sm:flex-row sm:items-start sm:justify-between">
            <div class="min-w-0 space-y-1.5">
              <div class="flex flex-wrap items-center gap-2">
                <p class="font-semibold text-[var(--p-text)]">{{ reqTitle(req) }}</p>
                <BaseBadge :tone="reqBadge(req).tone">{{ reqBadge(req).text }}</BaseBadge>
              </div>
              <p v-if="reqSpec(req)" class="text-sm text-[var(--p-text-muted)]">{{ reqSpec(req) }}</p>
              <div class="flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-[var(--p-text-muted)]">
                <span v-if="reqShopsText(req)">{{ reqShopsText(req) }}</span>
              </div>
            </div>
            <div class="shrink-0 pt-1">
              <BaseButton variant="outline" size="sm" :to="`/dashboard/client/requests/${req.id}`">View details</BaseButton>
            </div>
          </div>
        </div>
      </template>

      <!-- Drafts -->
      <template v-if="draftFiles.length">
        <div class="flex items-center gap-2.5">
          <span class="size-2 shrink-0 rounded-full bg-slate-300" />
          <p class="text-[11px] font-bold uppercase tracking-widest text-[var(--p-text-muted)]">Drafts</p>
        </div>
        <div
          v-for="draft in draftFiles"
          :key="draft.id"
          class="relative overflow-hidden rounded-2xl border border-dashed border-[var(--p-border)] bg-[var(--p-surface)] transition hover:shadow-sm"
        >
          <div class="absolute inset-y-0 left-0 w-1 bg-slate-300" />
          <div class="ml-1 flex flex-col gap-3 p-4 sm:flex-row sm:items-start sm:justify-between">
            <div class="min-w-0 space-y-1.5">
              <div class="flex flex-wrap items-center gap-2">
                <p class="font-semibold text-[var(--p-text)]">{{ draftTitle(draft) }}</p>
                <BaseBadge tone="neutral">Draft</BaseBadge>
              </div>
              <p class="text-sm text-[var(--p-text-muted)]">{{ draftSpec(draft) }}</p>
            </div>
            <div class="shrink-0 pt-1">
              <BaseButton variant="outline" size="sm" to="/dashboard/client/drafts">Continue draft</BaseButton>
            </div>
          </div>
        </div>
      </template>

      <!-- Completed -->
      <template v-if="groups.completed.length">
        <div class="flex items-center gap-2.5">
          <span class="size-2 shrink-0 rounded-full" style="background: var(--p-success)" />
          <p class="text-[11px] font-bold uppercase tracking-widest" style="color: var(--p-success)">Completed</p>
        </div>
        <div
          v-for="req in groups.completed"
          :key="req.id"
          class="relative overflow-hidden rounded-2xl border border-[var(--p-border)] bg-[var(--p-surface)] opacity-75 transition hover:opacity-100 hover:shadow-sm"
        >
          <div class="absolute inset-y-0 left-0 w-1" style="background: var(--p-success)" />
          <div class="ml-1 flex flex-col gap-3 p-4 sm:flex-row sm:items-start sm:justify-between">
            <div class="min-w-0 space-y-1.5">
              <div class="flex flex-wrap items-center gap-2">
                <p class="font-semibold text-[var(--p-text)]">{{ reqTitle(req) }}</p>
                <BaseBadge :tone="reqBadge(req).tone">{{ reqBadge(req).text }}</BaseBadge>
              </div>
              <p v-if="reqSpec(req)" class="text-sm text-[var(--p-text-muted)]">{{ reqSpec(req) }}</p>
              <div class="flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-[var(--p-text-muted)]">
                <span v-if="reqShopsText(req)">{{ reqShopsText(req) }}</span>
                <span v-if="reqBestPrice(req)" class="font-semibold text-[var(--p-text)]">Best price: {{ reqBestPrice(req) }}</span>
              </div>
            </div>
            <div class="shrink-0 pt-1">
              <BaseButton variant="ghost" size="sm" :to="`/dashboard/client/requests/${req.id}`">View summary</BaseButton>
            </div>
          </div>
        </div>
      </template>

    </div>
  </DashboardSectionCard>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import type { ClientQuoteRequestSummary } from '~/stores/quoteInbox'
import type { QuoteDraftFile } from '~/shared/types/buyer'
import { useQuoteInboxStore } from '~/stores/quoteInbox'
import BaseBadge from '~/components/ui/BaseBadge.vue'
import BaseButton from '~/components/ui/BaseButton.vue'
import DashboardSectionCard from '~/components/dashboard/shared/DashboardSectionCard.vue'

type BadgeTone = 'primary' | 'secondary' | 'neutral' | 'success' | 'warning' | 'error' | 'info' | 'dark'

const store = useQuoteInboxStore()
const { clientRequests, draftFiles, loading, error } = storeToRefs(store)
const hasInitialized = ref(false)

onMounted(async () => {
  await refreshInbox()
})

const isBooting = computed(() => !hasInitialized.value || (loading.value && allEmpty.value))

const groups = computed(() => ({
  attention: clientRequests.value.filter(
    r => r.latest_response !== null
      && r.response_status !== 'accepted'
      && r.status !== 'accepted',
  ),
  waiting: clientRequests.value.filter(
    r => r.latest_response === null
      && r.status !== 'accepted'
      && r.status !== 'cancelled',
  ),
  completed: clientRequests.value.filter(
    r => r.response_status === 'accepted' || r.status === 'accepted',
  ),
}))

const allEmpty = computed(
  () => clientRequests.value.length === 0 && draftFiles.value.length === 0,
)

async function refreshInbox() {
  await Promise.allSettled([
    store.fetchClientRequests(),
    store.fetchDraftFiles('dashboard'),
  ])
  hasInitialized.value = true
}

// ── Field helpers ─────────────────────────────────────────────────────────────

function strField(req: ClientQuoteRequestSummary, key: string): string | null {
  const v = (req as Record<string, unknown>)[key]
  return typeof v === 'string' && v.trim() ? v.trim() : null
}

function numField(req: ClientQuoteRequestSummary, key: string): number | null {
  const v = (req as Record<string, unknown>)[key]
  if (typeof v === 'number') return v
  if (typeof v === 'string') {
    const n = Number(v)
    return Number.isFinite(n) ? n : null
  }
  return null
}

function reqTitle(req: ClientQuoteRequestSummary): string {
  if (req.title) return req.title
  const productType = strField(req, 'product_type')
  const qty = numField(req, 'quantity')
  if (productType) {
    const label = productType.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
    return qty ? `${label} — ${qty.toLocaleString()} pcs` : label
  }
  return `Request #${req.id}`
}

function reqSpec(req: ClientQuoteRequestSummary): string | null {
  const summary = strField(req, 'spec_summary')
  if (summary) return summary
  const parts: string[] = []
  const size = strField(req, 'finished_size')
  const paper = strField(req, 'paper_stock') ?? strField(req, 'paper')
  if (size) parts.push(size)
  if (paper) parts.push(paper)
  return parts.length ? parts.join(' · ') : null
}

function reqShopsText(req: ClientQuoteRequestSummary): string | null {
  const responded = numField(req, 'responses_count')
  const total = numField(req, 'shops_count') ?? numField(req, 'total_shops')
  if (responded !== null && total !== null) return `${responded} of ${total} shops responded`
  if (responded !== null) return responded === 1 ? '1 shop responded' : `${responded} shops responded`
  if (req.latest_response) return '1 shop responded'
  if (total !== null) return `Sent to ${total} shops`
  return null
}

function reqBestPrice(req: ClientQuoteRequestSummary): string | null {
  return strField(req, 'best_price') ?? (req.latest_response?.total ?? null)
}

function reqConfirmations(req: ClientQuoteRequestSummary): string[] {
  const v = (req as Record<string, unknown>).needs_confirmation
  if (Array.isArray(v)) return v.filter((x): x is string => typeof x === 'string')
  return []
}

function reqBadge(req: ClientQuoteRequestSummary): { text: string; tone: BadgeTone } {
  if (req.response_status === 'accepted' || req.status === 'accepted') return { text: 'Accepted', tone: 'success' }
  if (req.response_status === 'rejected') return { text: 'Declined', tone: 'error' }
  if (req.response_status === 'modified') return { text: 'Awaiting review', tone: 'warning' }
  if (req.status === 'needs_confirmation') return { text: 'Needs confirmation', tone: 'warning' }
  if (req.latest_response) return { text: 'Shop replied', tone: 'success' }
  return { text: req.status_label || 'Waiting on shops', tone: 'neutral' }
}

function draftTitle(draft: QuoteDraftFile): string {
  return draft.company_name || `Draft #${draft.id}`
}

function draftSpec(draft: QuoteDraftFile): string {
  const n = draft.item_count ?? 0
  return n === 1 ? '1 item in draft' : `${n} items in draft`
}
</script>
