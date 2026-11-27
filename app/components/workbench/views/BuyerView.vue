<template>
  <DesignBuyerSurface>
    <!-- instant quote flow: an action on the orders page, never a second tab -->
    <div v-if="w.buyerQuoteOpen" class="pt-2">
      <div class="mx-auto w-full max-w-[1180px]">
        <button
          type="button"
          class="mb-4 inline-flex items-center gap-1.5 font-mono text-[10.5px] font-semibold uppercase tracking-[0.14em] text-ink-3 transition-colors hover:text-brand"
          @click="closeNewQuote"
        >
          <ArrowLeft :size="13" /> Back to my quotes
        </button>
        <div
          v-if="rematchNote"
          class="mb-4 rounded-xl border border-brand/30 bg-mint px-4 py-3 text-[12.5px] font-semibold text-brand-deep"
          data-test="rematch-note"
        >
          {{ rematchNote }}
        </div>
        <DesignCalculatorSurface>
          <DesignCalculator authed @quote-created="onQuoteCreated" />
        </DesignCalculatorSurface>
        <div class="pb-8" />
      </div>
    </div>

    <div v-else class="mx-auto flex w-full max-w-[1180px] flex-col gap-9 pb-40">
      <DesignBuyerPageHeader
        index="01"
        kicker="Buyer desk"
        :title="greeting"
        description="Every price is locked after acceptance. Every date shift needs your approval."
      >
        <template #actions>
          <input
            v-model="search"
            type="search"
            placeholder="Search your quotes"
            aria-label="Search your quotes"
            class="h-10 w-full min-w-[190px] rounded-xl border border-line-strong bg-card px-3.5 text-sm text-ink outline-none placeholder:text-ink-3 focus:border-brand sm:w-56"
          >
          <span v-if="search.trim()" class="font-mono text-[10.5px] text-ink-3">
            Filtering &ldquo;{{ search.trim() }}&rdquo;
          </span>
          <NuxtLink
            to="/app/buyer/new"
            class="press-key inline-flex h-10 items-center gap-2 rounded-xl bg-brand px-5 text-sm font-semibold text-white shadow-brand transition-colors hover:bg-brand-deep"
          >
            <Plus :size="16" /> New quote
          </NuxtLink>
        </template>
      </DesignBuyerPageHeader>

      <section
        v-if="approvals.length"
        class="rounded-2xl border border-ink bg-ink p-5 text-paper shadow-lift"
      >
        <div class="mb-4 flex flex-wrap items-center gap-2">
          <AlertTriangle :size="18" class="text-brand-bright" />
          <h2 class="text-sm font-bold tracking-tight text-paper">Needs your approval</h2>
          <span class="rounded-full border border-paper/30 bg-paper/10 px-2 py-0.5 font-mono text-[10px] font-semibold text-paper">{{ approvals.length }}</span>
          <span class="ml-auto hidden font-mono text-[10.5px] text-paper/60 sm:block">Prices &amp; dates never change silently</span>
        </div>
        <div class="space-y-3">
          <div
            v-for="approval in approvals"
            :key="approval.key"
            class="flex flex-col gap-4 rounded-xl border border-paper/15 bg-paper/5 p-4 md:flex-row md:items-center"
          >
            <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl" :class="approval.iconClass">
              <component :is="approval.icon" :size="18" />
            </div>
            <div class="min-w-0 flex-1">
              <div class="mb-1 flex flex-wrap items-center gap-2">
                <span class="rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider" :class="approval.chipClass">{{ approval.label }}</span>
                <span class="text-xs font-medium text-paper/60">{{ approval.reference }}</span>
              </div>
              <p class="text-sm text-paper">
                <span v-if="approval.oldValue" class="mr-2 text-paper/40 line-through">{{ approval.oldValue }}</span>
                <strong class="font-bold text-paper">{{ approval.newValue }}</strong>
              </p>
              <p class="mt-1 text-xs text-paper/60">{{ approval.reason }}</p>
            </div>
            <div class="flex shrink-0 gap-2">
              <button
                v-if="!approval.link"
                type="button"
                class="press-key rounded-xl bg-amber px-4 py-2 text-xs font-bold text-ink transition-colors hover:brightness-95"
                @click="scrollTo(approval.target)"
              >
                Review
              </button>
              <NuxtLink
                v-else
                :to="approval.link"
                class="press-key rounded-xl bg-amber px-4 py-2 text-xs font-bold text-ink transition-colors hover:brightness-95"
              >
                Review
              </NuxtLink>
              <NuxtLink
                to="/app/messages"
                class="rounded-xl border border-paper/25 px-4 py-2 text-xs font-semibold text-paper transition-colors hover:bg-paper/10"
              >
                Discussion
              </NuxtLink>
            </div>
          </div>
        </div>
      </section>

      <!-- Law 7.12: paid, owned jobs appear here with zero clicks, above
           everything else on the buyer dashboard. Hidden when there are none. -->
      <BuyerJobsInProgress class="pt-2" />

      <!-- B1.3 — the managers this client already works with, pinned above
           everything else. Hidden when the client has none. -->
      <ClientMyManagersPanel />





      <div class="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <DesignCard class="p-5">
          <div class="flex items-start justify-between gap-3">
            <DesignStat label="Payment protected" :value="escrowAmount" tone="brand" hint="Released only on your approval" />
            <div class="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-green-soft">
              <Lock :size="17" class="text-green" />
            </div>
          </div>
        </DesignCard>
        <DesignCard class="p-5">
          <div class="flex items-start justify-between gap-3">
            <DesignStat label="Active jobs" :value="String(activeJobs)" hint="All price-locked" />
            <div class="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-mint">
              <Package :size="17" class="text-brand" />
            </div>
          </div>
        </DesignCard>
        <DesignCard class="p-5">
          <div class="flex items-start justify-between gap-3">
            <DesignStat
              label="Quotes to review"
              :value="String(quotesToReview)"
              :tone="quotesToReview > 0 ? 'amber' : 'ink'"
              hint="All under fair-price cap"
            />
            <div class="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-amber-soft">
              <FileText :size="17" class="text-amber" />
            </div>
          </div>
        </DesignCard>
        <DesignCard class="p-5">
          <div class="flex items-start justify-between gap-3">
            <DesignStat label="Next due" :value="nextDueDate || '—'" hint="Acknowledged by you" />
            <div class="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-mint">
              <CalendarRange :size="17" class="text-brand" />
            </div>
          </div>
        </DesignCard>
      </div>

      <div class="grid items-start gap-8 lg:grid-cols-3">
        <DesignBuyerSection
          class="lg:col-span-2"
          index="03"
          title="Quotes waiting for you"
          hint="Every quote is within the fair-price range &mdash; accept, ask a question or decline."
        >
          <template #action>
            <button
              type="button"
              class="shrink-0 text-xs font-semibold text-brand transition-colors hover:text-brand-deep"
              @click="scrollTo('#quotes')"
            >
              See all
            </button>
          </template>

          <DesignCard class="overflow-hidden">
            <div v-if="overviewQuotes.length" class="divide-y divide-line">
              <div v-for="quote in overviewQuotes" :key="`${quote.kind}-${quote.id}`" class="flex flex-wrap items-center gap-4 px-5 py-4">
                <div class="min-w-0 flex-1">
                  <div class="flex flex-wrap items-center gap-2">
                    <span class="font-mono text-[10px] font-semibold uppercase tracking-wider text-brand">{{ quote.reference }}</span>
                    <span v-if="quote.needs_attention" class="rounded-full bg-amber-soft px-2 py-0.5 text-[9px] font-bold text-amber">Needs review</span>
                  </div>
                  <div class="mt-1 truncate text-sm font-bold text-ink">{{ quote.title }}</div>
                  <div class="mt-0.5 text-[10px] text-ink-3">
                    {{ quote.holder ? `Held by ${quote.holder}` : 'With your manager' }}<template v-if="quote.readyText"> &middot; Ready {{ quote.readyText }}</template>
                  </div>
                </div>
                <div class="text-right">
                  <div class="font-mono text-[13px] font-semibold text-ink">{{ quote.total !== null ? money(quote.total) : 'Pricing' }}</div>
                  <div v-if="quote.perPiece !== null" class="font-mono text-[10px] text-ink-3">{{ money(quote.perPiece) }}/pc</div>
                </div>
                <div class="flex w-full shrink-0 gap-2 sm:w-auto">
                  <button
                    type="button"
                    class="press-key flex-1 rounded-xl bg-brand px-3 py-2 text-[11px] font-bold text-white transition-colors hover:bg-brand-deep sm:flex-none"
                    @click="scrollTo('#quotes')"
                  >
                    Accept
                  </button>
                  <button
                    type="button"
                    class="flex-1 rounded-xl border border-line-strong px-3 py-2 text-[11px] font-bold text-ink-2 hover:bg-paper-2 sm:flex-none"
                    @click="scrollTo('#quotes')"
                  >
                    Counter
                  </button>
                  <button
                    type="button"
                    class="flex-1 rounded-xl border border-line-strong px-3 py-2 text-[11px] font-bold text-red hover:bg-paper-2 sm:flex-none"
                    @click="scrollTo('#quotes')"
                  >
                    Decline
                  </button>
                </div>
              </div>
            </div>

            <DesignEmptyNote
              v-else
              icon="ReceiptText"
              title="No quotes waiting"
              hint="Start a new quote and your manager's quote will land here."
            >
              <button type="button" class="press-key rounded-xl bg-brand px-4 py-2 text-xs font-bold text-white transition-colors hover:bg-brand-deep" @click="openNewQuote">
                New quote
              </button>
            </DesignEmptyNote>
          </DesignCard>
        </DesignBuyerSection>

        <DesignCard class="p-5">
          <div class="flex items-center gap-2">
            <ShieldCheck :size="18" class="text-green" />
            <h2 class="text-base font-bold tracking-tight text-ink">Your money, protected</h2>
          </div>
          <div class="mt-4 space-y-4">
            <div v-for="row in trustRows" :key="row.title" class="flex gap-3">
              <div class="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-xl bg-green-soft">
                <Check :size="14" class="text-green" />
              </div>
              <div>
                <div class="text-sm font-bold text-ink">{{ row.title }}</div>
                <p class="mt-0.5 text-[11px] leading-relaxed text-ink-2">{{ row.body }}</p>
              </div>
            </div>
          </div>
        </DesignCard>
      </div>

      <DesignBuyerSection
        id="quotes"
        index="04"
        title="Quotes"
        hint="Quotes from your manager, quotes being matched, and drafts you are still building."
      >
        <template #action>
          <button
            type="button"
            class="inline-flex items-center gap-1.5 rounded-xl border border-line-strong px-3 py-2 text-xs font-semibold text-ink transition-colors hover:bg-paper-2"
            @click="openNewQuote"
          >
            <Plus :size="14" /> New quote
          </button>
        </template>

        <QuoteResponsesPanel />

        <DesignAlert
          v-if="lastSubmittedReference"
          tone="success"
          title="Quote sent"
          class="mt-4"
          data-test="buyer-quote-sent"
        >
          Reference <span class="font-mono font-semibold">{{ lastSubmittedReference }}</span> is With your manager. Its quote will appear here.
        </DesignAlert>

        <DesignCard v-if="requestSummaries.length" class="mt-4 overflow-hidden">
          <div class="border-b border-line px-5 py-3 font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-ink-3">Quotes sent</div>
          <div class="divide-y divide-line">
            <NuxtLink
              v-for="request in requestSummaries"
              :key="`request-${request.id}`"
              :to="`/app/buyer/requests/${request.id}`"
              data-test="buyer-request-row"
              class="flex flex-wrap items-center gap-3 px-5 py-4 transition-colors hover:bg-paper-2"
            >
              <div class="flex h-9 w-9 items-center justify-center rounded-xl bg-mint"><Send :size="16" class="text-brand-deep" /></div>
              <div class="min-w-0 flex-1">
                <div class="truncate text-sm font-bold text-ink">{{ request.title }}</div>
                <div class="mt-0.5 text-[10px] text-ink-3">
                  {{ request.reference }}
                  <template v-if="request.holder"> &middot; {{ request.holder }}</template>
                  <template v-if="request.created"> &middot; {{ request.created }}</template>
                </div>
              </div>
              <span class="rounded-full bg-mint px-2.5 py-1 font-mono text-[9.5px] font-bold uppercase tracking-[0.12em] text-brand-deep">{{ request.statusLabel }}</span>
              <span class="font-mono text-xs font-semibold text-ink-2">{{ request.total !== null ? money(request.total) : 'Awaiting price' }}</span>
              <ArrowRight :size="14" class="text-ink-3" />
            </NuxtLink>
          </div>
        </DesignCard>

        <DesignCard v-if="draftSummaries.length" class="mt-4 overflow-hidden">
          <div class="border-b border-line px-5 py-3 font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-ink-3">Quote drafts</div>
          <div class="divide-y divide-line">
            <div v-for="draft in draftSummaries" :key="`draft-${draft.id}`" class="flex flex-wrap items-center gap-3 px-5 py-4">
              <div class="flex h-9 w-9 items-center justify-center rounded-xl bg-paper-2"><FileText :size="16" class="text-ink-3" /></div>
              <div class="min-w-0 flex-1">
                <div class="truncate text-sm font-bold text-ink">{{ draft.title }}</div>
                <div class="mt-0.5 text-[10px] text-ink-3">{{ draft.reference }} &middot; updated {{ draft.updated || draft.created }}</div>
              </div>
              <span class="font-mono text-xs font-semibold text-ink-2">{{ draft.total !== null ? money(draft.total) : 'Price locked' }}</span>
              <button type="button" class="inline-flex items-center gap-1 rounded-xl border border-line-strong px-3 py-2 text-[11px] font-bold text-ink hover:bg-paper-2" @click="continueDraft(draft.reference)">
                Send quote <ArrowRight :size="12" />
              </button>
            </div>
          </div>
        </DesignCard>

        <DesignEmptyNote
          v-if="!loadingQuotes && !responses.hasResponses && !draftSummaries.length && !requestSummaries.length"
          icon="ReceiptText"
          title="No quotes here yet"
          hint="Build a quote in about 30 seconds and send it straight to a print manager. Their quote lands here."
          class="mt-4"
        >
          <button type="button" class="press-key inline-flex items-center gap-1.5 rounded-xl bg-brand px-4 py-2 text-xs font-bold text-white transition-colors hover:bg-brand-deep" @click="openNewQuote">
            Build your first quote <ArrowRight :size="13" />
          </button>
        </DesignEmptyNote>

        <DesignAlert v-if="quotesError" tone="error" class="mt-4">
          {{ quotesError }}
        </DesignAlert>
      </DesignBuyerSection>

      <div class="grid gap-6 lg:grid-cols-2">
        <DesignBuyerSection
          id="notifications"
          index="10"
          title="Notifications"
          hint="Price, date and job updates"
        >
          <DesignCard class="flex flex-wrap items-center justify-between gap-4 p-5">
            <p class="max-w-[36ch] text-sm leading-relaxed text-ink-2">
              Every price update, approval and stage change is recorded in your notification feed.
            </p>
            <NuxtLink
              to="/notifications"
              class="inline-flex items-center gap-1.5 rounded-xl border border-line-strong px-4 py-2.5 text-sm font-semibold text-ink transition-colors hover:bg-paper-2"
            >
              Open notifications <ArrowRight :size="13" />
            </NuxtLink>
          </DesignCard>
        </DesignBuyerSection>
      </div>

      <DesignBuyerSection
        id="history"
        index="08"
        title="Past jobs"
        hint="Completed and closed jobs, kept for your records."
      >
        <div v-if="completedJobs.length" class="divide-y divide-line overflow-hidden rounded-2xl border border-line bg-card shadow-card">
          <div v-for="job in completedJobs" :key="job.id" class="flex flex-wrap items-center gap-3 px-5 py-4">
            <div class="flex h-9 w-9 items-center justify-center rounded-xl bg-green-soft"><Check :size="16" class="text-green" /></div>
            <div class="min-w-0 flex-1">
              <div class="text-sm font-bold text-ink">{{ jobCode(job) }} &middot; {{ job.title }}</div>
              <div class="mt-0.5 text-[10px] text-ink-3">{{ jobStatusLabel(job) }} &middot; {{ jobDue(job) || 'No due date' }}</div>
            </div>
            <div class="font-mono text-[13px] font-semibold text-ink">{{ jobPrice(job) }}</div>
            <NuxtLink v-if="job.tracking_url" :to="job.tracking_url" class="rounded-xl border border-line-strong px-3 py-2 text-[11px] font-bold text-ink hover:bg-paper-2">
              View
            </NuxtLink>
          </div>
        </div>
        <DesignEmptyNote
          v-else
          icon="CheckCircle2"
          title="No completed jobs yet"
          hint="Your first delivery will be archived here."
        />
      </DesignBuyerSection>

      <div class="pb-2" />
    </div>
  </DesignBuyerSurface>
</template>

<script setup lang="ts">
import { computed, nextTick, onMounted, ref, watch } from 'vue'
import type { Component } from 'vue'
import {
  AlertCircle, AlertTriangle, ArrowLeft, ArrowRight, ArrowUpRight, CalendarRange, Check,
  CreditCard, Eye, FileText, Lock, Package, Plus, Send, ShieldCheck,
} from 'lucide-vue-next'
import { money } from '~/shared/workflow/printy'
import { getApiErrorMessage } from '~/shared/api'
import { API } from '~/shared/api-paths'
import { useApi } from '~/composables/useApi'
import { summarizeBuyerItem } from '~/shared/quote-handoff'
import { formatKSh } from '~/utils/money'
import type { BuyerQuoteItem, ClientJobRecord } from '~/shared/types'
import { useWorkflowStore } from '~/stores/workflow'
import { useCalculatorStore } from '~/stores/calculator'
import { useIntakeStore } from '~/stores/intake'
import { useAuthStore } from '~/stores/auth'
import { useClientJobsStore } from '~/stores/client-jobs'
import { useClientResponsesStore } from '~/stores/responses'
import DesignBuyerPageHeader from '~/components/design/buyer/BuyerPageHeader.vue'
import DesignAlert from '~/components/design/ui/Alert.vue'
import DesignCard from '~/components/design/ui/Card.vue'
import DesignEmptyNote from '~/components/design/ui/EmptyNote.vue'
import DesignStat from '~/components/design/ui/Stat.vue'

interface ApprovalItem {
  key: string
  icon: Component
  iconClass: string
  chipClass: string
  label: string
  reference: string
  oldValue?: string
  newValue: string
  reason: string
  target: string
  link?: string
}

const w = useWorkflowStore()
const calcStore = useCalculatorStore()
const intake = useIntakeStore()
const auth = useAuthStore()
const jobsStore = useClientJobsStore()
const responses = useClientResponsesStore()

const search = useState<string>('client-search', () => '')
const navQuoteCount = useState<number>('client-nav-quote-count', () => 0)

const route = useRoute()
if (route.query.tab === 'quote' || route.query.quote === '1') {
  w.buyerQuoteOpen = true
}

const rematchNote = ref('')

/** A declined request re-opens the calculator with the same specs. */
async function openRematch(requestId: number) {
  const { api } = useApi()
  try {
    const detail = await api<{
      request_reference?: string
      request_snapshot?: Record<string, unknown> | null
    }>(API.client.request(requestId))
    const root = detail.request_snapshot && typeof detail.request_snapshot === 'object'
      ? detail.request_snapshot
      : {}
    const nested = root.request_snapshot && typeof root.request_snapshot === 'object'
      ? root.request_snapshot as Record<string, unknown>
      : {}
    const inputs = root.calculator_inputs && typeof root.calculator_inputs === 'object'
      ? root.calculator_inputs as Record<string, unknown>
      : nested
    const productKey = typeof inputs.product_type === 'string' ? inputs.product_type : ''
    if (productKey) {
      await continueIntoProduct(productKey, inputs)
      rematchNote.value = detail.request_reference
        ? `Same specs as ${detail.request_reference}. Choose a manager to send it again.`
        : 'Same specs carried over. Choose a manager to send it again.'
    }
  } catch {
    /* fall back to the normal calculator without a carried-over note */
  }
  w.buyerQuoteOpen = true
}

const quotes = ref<BuyerQuoteItem[]>([])
const loadingQuotes = ref(false)
const quotesError = ref('')
const lastSubmittedReference = ref('')

const summaries = computed(() => quotes.value.map(summarizeBuyerItem))

const filteredJobs = computed(() => {
  const query = search.value.trim().toLowerCase()
  if (!query) {
    return jobsStore.jobs
  }
  return jobsStore.jobs.filter((job) => {
    return `${jobCode(job)} ${job.title} ${job.status} ${job.timing?.stage_label ?? ''}`.toLowerCase().includes(query)
  })
})

const filteredSummaries = computed(() => {
  const query = search.value.trim().toLowerCase()
  if (!query) {
    return summaries.value
  }
  return summaries.value.filter((quote) => {
    return `${quote.reference} ${quote.title} ${quote.statusLabel}`.toLowerCase().includes(query)
  })
})

const overviewQuotes = computed(() =>
  filteredSummaries.value.filter(quote => quote.total !== null && !quote.muted).slice(0, 3),
)
const draftSummaries = computed(() => filteredSummaries.value.filter(quote => quote.kind === 'draft'))

/**
 * Submitted requests that do not have an offer yet. Once a print partner
 * responds, the offer is rendered by QuoteResponsesPanel instead, so the same
 * request is never listed twice.
 */
const requestSummaries = computed(() =>
  filteredSummaries.value.filter((quote) => {
    if (quote.kind !== 'quote_request' || quote.raw.item_type !== 'quote_request') {
      return false
    }
    const request = quote.raw.quote_request
    if (['rejected', 'expired', 'cancelled'].includes(String(request.status))) {
      return false
    }
    return !request.latest_response
  }),
)

const activeJobs = computed(() =>
  jobsStore.jobs.filter(job => !['completed', 'delivered', 'cancelled'].includes(String(job.status).toLowerCase())).length,
)

const quotesToReview = computed(() =>
  Math.max(quotes.value.filter(quote => quote.needs_attention).length, responses.pending.length),
)

const completedJobs = computed(() =>
  filteredJobs.value.filter(job => ['completed', 'delivered', 'cancelled'].includes(String(job.status).toLowerCase())),
)

const approvals = computed<ApprovalItem[]>(() => {
  const list: ApprovalItem[] = []

  for (const response of responses.items) {
    if (response.price_updated) {
      list.push({
        key: `price-${response.id}`,
        icon: CreditCard,
        iconClass: 'tone-accent text-[var(--accent)]',
        chipClass: 'tone-accent text-[var(--accent)]',
        label: 'Price updated',
        reference: `Quote #${response.id}`,
        oldValue: formatKSh(Number(response.price_updated_old_total ?? 0), 0),
        newValue: formatKSh(Number(response.price_updated_new_total ?? response.price ?? 0), 0),
        reason: 'Your print partner updated the price — acknowledge it to keep moving.',
        target: '#quotes',
        link: response.request_id ? `/app/buyer/requests/${response.request_id}` : undefined,
      })
    }
    if (response.date_updated) {
      list.push({
        key: `date-${response.id}`,
        icon: CalendarRange,
        iconClass: 'tone-accent text-[var(--accent)]',
        chipClass: 'tone-accent text-[var(--accent)]',
        label: 'Date updated',
        reference: `Quote #${response.id}`,
        oldValue: response.date_updated_old ? formatDate(response.date_updated_old) : undefined,
        newValue: response.date_updated_new ? formatDate(response.date_updated_new) : 'New date proposed',
        reason: 'A delivery date moved — approve the new date before production continues.',
        target: '#quotes',
        link: response.request_id ? `/app/buyer/requests/${response.request_id}` : undefined,
      })
    }
  }

  for (const job of jobsStore.jobs) {
    if (job.artwork_confirmation?.state === 'requested') {
      list.push({
        key: `artwork-${job.id}`,
        icon: AlertCircle,
        iconClass: 'tone-warn text-[#8A5A00]',
        chipClass: 'tone-warn text-[#8A5A00]',
        label: 'Action needed',
        reference: jobCode(job),
        newValue: 'Artwork sign-off required',
        reason: 'Confirm the artwork before this job goes to production.',
        target: '#jobs',
        link: `/app/buyer/jobs/${job.id}`,
      })
    } else if (!job.payment_confirmed && ['awaiting_payment', 'payment_pending'].includes(String(job.payment_status))) {
      list.push({
        key: `payment-${job.id}`,
        icon: CreditCard,
        iconClass: 'tone-accent text-[var(--accent)]',
        chipClass: 'tone-accent text-[var(--accent)]',
        label: 'Payment due',
        reference: jobCode(job),
        newValue: formatKSh(jobTotal(job), 0),
        reason: 'Payment is required before production starts.',
        target: '#jobs',
        link: `/app/buyer/jobs/${job.id}`,
      })
    }
  }

  for (const quote of quotes.value) {
    if (quote.needs_attention) {
      const summary = summarizeBuyerItem(quote)
      list.push({
        key: `quote-${quote.item_type}-${summary.id}`,
        icon: FileText,
        iconClass: 'tone-accent text-[var(--accent)]',
        chipClass: 'tone-accent text-[var(--accent)]',
        label: 'Quote review',
        reference: summary.reference,
        newValue: summary.title,
        reason: 'A quote is waiting for your review.',
        target: '#quotes',
        link: quote.item_type === 'quote_request' ? `/app/buyer/requests/${summary.id}` : undefined,
      })
    }
  }

  return list
})

watch(quotesToReview, (count) => {
  navQuoteCount.value = count
}, { immediate: true })

async function loadQuotes() {
  if (loadingQuotes.value) {
    return
  }
  loadingQuotes.value = true
  quotesError.value = ''
  try {
    quotes.value = await calcStore.fetchBuyerQuotes()
  } catch (e) {
    quotesError.value = getApiErrorMessage(e, "We couldn't load your quotes. Please try again.")
  } finally {
    loadingQuotes.value = false
  }
}

function openNewQuote() {
  calcStore.editingDraftId = null
  lastSubmittedReference.value = ''
  w.buyerQuoteOpen = true
  quotesError.value = ''
}

function closeNewQuote() {
  calcStore.editingDraftId = null
  w.buyerQuoteOpen = false
}

function continueDraft(reference: string) {
  const item = quotes.value.find(q => q.item_type === 'draft' && q.draft.draft_reference === reference)
  if (item?.item_type === 'draft') {
    calcStore.editingDraftId = item.draft.id
    const snapshot = item.draft.calculator_inputs_snapshot
    const productKey = typeof snapshot?.product_type === 'string' ? snapshot.product_type : ''
    void continueIntoProduct(productKey, snapshot)
  }
  w.buyerQuoteOpen = true
}

async function continueIntoProduct(productKey: string, snapshot: Record<string, unknown> | null) {
  if (calcStore.configStatus !== 'ready' && calcStore.configStatus !== 'error') {
    try {
      await calcStore.loadConfig()
    } catch {
      /* the calculator surfaces config failures itself */
    }
  }
  const product = calcStore.config?.products?.find(p => p.key === productKey) ?? null
  if (product) {
    calcStore.adoptSpec(snapshot, product.key)
  } else if (calcStore.config?.products?.[0]) {
    calcStore.setProduct(calcStore.config.products[0].key)
  }
}

async function onQuoteCreated(
  reference: string,
  _total: number | null,
  requestId: number | null = null,
) {
  w.buyerQuoteOpen = false
  calcStore.clear()
  lastSubmittedReference.value = reference
  if (requestId) {
    await navigateTo(`/app/buyer/requests/${requestId}`)
    return
  }
  await loadQuotes()
  await nextTick()
  document.getElementById('quotes')?.scrollIntoView?.({ behavior: 'smooth', block: 'start' })
}

/**
 * A signed-out visitor chose a real manager under the public calculator. The
 * draft was claimed at sign-up; submit it exactly once and open that request.
 */
async function completePendingIntake() {
  const pending = calcStore.pendingIntake()
  const manager = calcStore.pendingManagerSelection()
  if (!pending || !manager?.publicId) {
    return false
  }
  try {
    const result = await intake.submit({
      draft_id: pending.draftId,
      selected_manager_public_id: manager.publicId,
      manager_selection_mode: 'client_selected',
    })
    calcStore.forgetPendingIntake()
    calcStore.forgetPendingDraft()
    calcStore.forgetPendingManagerSelection()
    await navigateTo(`/app/buyer/requests/${result.intake_id}`)
    return true
  } catch (error) {
    const status = (error as { statusCode?: number })?.statusCode
    if (status === 400 || status === 404) {
      // The draft is no longer available; do not trap the buyer on every load.
      calcStore.forgetPendingIntake()
      calcStore.forgetPendingDraft()
      calcStore.forgetPendingManagerSelection()
      quotesError.value = getApiErrorMessage(
        error,
        'Your saved job could not be sent. Start a new quote to continue.',
      )
    }
    return false
  }
}

onMounted(async () => {
  // Legacy links used /app/buyer#jobs; the jobs list is now its own page.
  if (route.hash === '#jobs') {
    await navigateTo('/app/buyer/jobs')
    return
  }
  if (await completePendingIntake()) {
    return
  }
  jobsStore.fetchJobs()
  jobsStore.fetchPaymentHistory()
  if (typeof route.query.reference === 'string') {
    lastSubmittedReference.value = route.query.reference
  }
  const rematchId = Number(route.query.rematch)
  if (Number.isFinite(rematchId) && rematchId > 0) {
    await openRematch(rematchId)
  }
  await loadQuotes()
  if (route.query.quote === 'sent') {
    await nextTick()
    document.getElementById('quotes')?.scrollIntoView?.({ behavior: 'smooth', block: 'start' })
  }
})

const nextDueDate = computed(() => {
  const dueDates = jobsStore.jobs
    .filter(job => !['completed', 'delivered', 'cancelled'].includes(String(job.status).toLowerCase()))
    .map(job => job.timing?.due_date)
    .filter((value): value is string => Boolean(value))
    .map(value => new Date(value))
    .filter(date => !Number.isNaN(date.getTime()))
  if (dueDates.length === 0) return null
  dueDates.sort((a, b) => a.getTime() - b.getTime())
  return dueDates[0]!.toLocaleDateString('en-KE', { weekday: 'short', day: 'numeric', month: 'short' })
})

const escrowAmount = computed(() => {
  const total = jobsStore.jobs
    .filter(job => !['completed', 'delivered', 'cancelled'].includes(String(job.status).toLowerCase()))
    .filter(job => job.escrow_amount !== undefined && job.escrow_amount !== null)
    .map(job => Number(job.escrow_amount))
    .reduce((sum, amount) => sum + amount, 0)
  return total > 0 ? formatKSh(total, 0) : formatKSh(0, 0)
})

const firstName = computed(() => auth.user?.name?.trim().split(' ')[0] || '')
const greeting = computed(() => {
  const hour = new Date().getHours()
  const part = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening'
  return firstName.value ? `${part}, ${firstName.value}` : part
})

const trustRows = [
  { title: 'Only pay for what\'s accepted', body: 'Each quote is capped at the fair market rate. Your final price never changes silently.' },
  { title: 'Payment protected by Printy', body: 'Your money is held safely until you approve delivery.' },
  { title: 'No hidden fees', body: 'The price you accept is the price you pay — itemised upfront.' },
  { title: 'Every change needs you', body: 'Production will not start or change without your explicit sign-off.' },
]

function jobCode(job: ClientJobRecord) {
  return job.code || job.job_reference || job.reference
}

function jobTotal(job: ClientJobRecord) {
  return Number(job.pricing?.client_total ?? 0)
}

function jobQuantity(job: ClientJobRecord) {
  const raw = job.quantity ?? job.qty
  const quantity = Number(raw)
  return Number.isFinite(quantity) && quantity > 0 ? quantity : 0
}

function jobPrice(job: ClientJobRecord) {
  return jobTotal(job) > 0 ? formatKSh(jobTotal(job), 0) : '—'
}

function jobPerPiece(job: ClientJobRecord) {
  const quantity = jobQuantity(job)
  return quantity > 0 && jobTotal(job) > 0 ? formatKSh(jobTotal(job) / quantity, 2) : ''
}

function jobDue(job: ClientJobRecord) {
  const value = job.timing?.due_date || job.requested_deadline
  return value ? formatDate(value) : ''
}

function formatDate(value: string | null | undefined) {
  if (!value) return ''
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''
  return date.toLocaleDateString('en-KE', { weekday: 'short', day: 'numeric', month: 'short' })
}

function jobStatusLabel(job: ClientJobRecord) {
  if (job.artwork_confirmation?.state === 'requested') return 'Needs sign-off'
  const status = String(job.status || 'in progress').replace(/_/g, ' ')
  return status.charAt(0).toUpperCase() + status.slice(1)
}

function statusDot(job: ClientJobRecord) {
  const status = String(job.status).toLowerCase()
  if (job.artwork_confirmation?.state === 'requested') return 'bg-[#F5A623]'
  if (['completed', 'delivered', 'collected'].includes(status)) return 'bg-[#2FBF71]'
  if (['cancelled', 'rejected', 'failed'].includes(status)) return 'bg-[#FB4D6D]'
  if (['printing', 'in_production', 'production'].includes(status)) return 'bg-[var(--accent)]'
  if (['awaiting_payment', 'payment_pending'].includes(status)) return 'bg-[#F5A623]'
  return 'bg-[var(--accent)]'
}

function scrollTo(target: string) {
  if (!import.meta.client) return
  document.querySelector(target)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}
</script>
