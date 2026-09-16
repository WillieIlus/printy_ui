<template>
  <div v-if="w.buyerTab === 'quote'" class="pt-6">
    <div class="mx-auto mb-2 flex w-fit gap-1 rounded-full border p-1" :style="{ borderColor: 'var(--line)', background: 'var(--panel)' }">
      <button
        v-for="[k, label] in buyerTabs"
        :key="k"
        class="relative rounded-full px-4 py-2 font-mono2 text-[10px] font-semibold uppercase tracking-[0.14em] transition-colors"
        :style="{ color: w.buyerTab === k ? '#fff' : 'var(--sub)' }"
        @click="w.buyerTab = k"
      >
        <span v-if="w.buyerTab === k" class="absolute inset-0 rounded-full" :style="{ background: 'var(--accent)' }" />
        <span class="relative">{{ label }}</span>
      </button>
    </div>

    <!-- calculator (open) -->
    <div v-if="quoteOpen" class="mx-auto w-full max-w-[1180px] px-4 sm:px-0">
      <button type="button" class="press-key mb-4 inline-flex items-center gap-1.5 font-mono2 text-[10px] uppercase tracking-[0.16em] text-[var(--sub)] hover:text-[var(--accent)]" @click="quoteOpen = false">
        <ArrowLeft :size="12" /> Back to my quotes
      </button>
      <CalculatorView authed @quote-created="onQuoteCreated" />
      <div class="pb-8" />
    </div>

    <!-- quote list -->
    <div v-else class="mx-auto w-full max-w-[780px] px-4 pb-24 pt-6 sm:pt-8">
      <div class="flex flex-wrap items-end justify-between gap-4">
        <div>
          <div class="flex items-center gap-2 font-mono2 text-[10px] uppercase tracking-[0.22em] text-[var(--sub)]">
            <Sparkles :size="11" style="color: var(--accent)" /> instant quote · no signup
          </div>
          <h1 class="mt-2 font-disp text-[34px] font-bold leading-[1.05] tracking-tight sm:text-[40px]">
            My quotes <span class="text-[var(--sub)]">· {{ summaries.length }}</span>
          </h1>
          <p class="mt-2 max-w-[52ch] text-[13.5px] leading-relaxed text-[var(--sub)]">
            Drafts you're still building and requests already sitting with your printing manager — newest first.
          </p>
        </div>
        <button type="button" class="press-key inline-flex items-center gap-2 rounded-2xl px-5 py-3 font-mono2 text-[11px] font-bold uppercase tracking-[0.14em] text-white" style="background: var(--accent)" @click="openNewQuote">
          <Plus :size="15" /> New quote
        </button>
      </div>

      <div v-if="loadingQuotes" class="mt-8 flex items-center justify-center gap-2 py-16 text-[13px] text-[var(--sub)]">
        <Loader2 :size="16" class="animate-spin" style="color: var(--accent)" /> Loading your quotes…
      </div>

      <div v-else-if="quotesError" class="mt-8 rounded-2xl border px-5 py-6 text-[13px]" style="border-color: rgba(251,77,109,.4); background: rgba(251,77,109,.08); color: #B4243F">
        {{ quotesError }}
      </div>

      <div v-else-if="summaries.length === 0" class="mt-8 rounded-3xl border p-10 text-center" style="border-color: var(--line); background: var(--panel)">
        <div class="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl" style="background: color-mix(in srgb, var(--accent) 12%, transparent)">
          <Sparkles :size="20" style="color: var(--accent)" />
        </div>
        <h3 class="mt-4 font-disp text-[18px] font-bold tracking-tight">No quotes here yet</h3>
        <p class="mx-auto mt-1.5 max-w-[40ch] text-[13px] leading-relaxed text-[var(--sub)]">
          Build a quote in about 30 seconds — real sheet counts, real press rates. It lands here as a draft, then moves to your printing manager the moment you send it.
        </p>
        <button type="button" class="press-key mt-5 inline-flex items-center gap-2 rounded-2xl px-6 py-3 font-mono2 text-[11px] font-bold uppercase tracking-[0.14em] text-white" style="background: var(--accent)" @click="openNewQuote">
          Build your first quote <ArrowRight :size="14" />
        </button>
      </div>

      <div v-else class="mt-8 space-y-4">
        <article v-for="quote in summaries" :key="`${quote.kind}-${quote.id}`" class="overflow-hidden rounded-3xl border bg-[var(--panel)] shadow-[0_2px_24px_-12px_rgba(27,23,16,.25)]" :style="{ borderColor: 'var(--line)' }">
          <div class="flex flex-wrap items-center justify-between gap-3 px-5 py-3" style="background: var(--panel2)">
            <div class="flex items-center gap-2.5">
              <span class="flex h-6 w-6 items-center justify-center rounded-full" :style="{ background: `color-mix(in srgb, var(--accent) 14%, transparent)` }">
                <FileText v-if="quote.kind === 'quote_request'" :size="12" style="color: var(--accent)" />
                <PencilRuler v-else :size="12" style="color: var(--accent)" />
              </span>
              <span class="font-mono2 text-[10.5px] font-semibold uppercase tracking-[0.14em]" style="color: var(--ink)">{{ quote.reference }}</span>
              <span v-if="quote.kind === 'draft'" class="hidden font-mono2 text-[9px] uppercase tracking-[0.12em] text-[var(--sub)] sm:block">draft</span>
            </div>
            <span class="rounded-full px-2.5 py-[3px] font-mono2 text-[8.5px] font-semibold uppercase tracking-[0.12em]" style="background: color-mix(in srgb, var(--accent) 13%, transparent); color: var(--accent)">
              {{ quote.statusLabel }}
            </span>
          </div>
          <div class="p-5">
            <h2 class="font-disp text-[17px] font-bold leading-tight tracking-tight">{{ quote.title }}</h2>
            <p class="mt-1 text-[12.5px] text-[var(--sub)]">
              {{ quote.kind === 'draft' ? 'Saved draft — not yet sent to a printing manager.' : 'Sent to your printing manager — they respond within ~2h.' }}
            </p>
            <div class="mt-4 flex flex-wrap items-center justify-between gap-3 border-t pt-4" style="border-color: var(--line)">
              <div class="flex items-center gap-2 text-[11.5px] text-[var(--sub)]">
                <CalendarDays :size="13" /> Updated {{ quote.updated || quote.created }}
              </div>
              <div class="flex items-center gap-3">
                <span v-if="quote.total !== null" class="font-disp text-[20px] font-bold tracking-tight" style="color: var(--accent)">{{ money(quote.total) }}</span>
                <span v-else class="font-mono2 text-[9.5px] uppercase tracking-[0.12em] text-[var(--sub)]">{{ quote.kind === 'draft' ? 'price locked' : 'awaiting pricing' }}</span>
                <button
                  v-if="quote.kind === 'draft'"
                  type="button"
                  class="press-key inline-flex items-center gap-1.5 rounded-xl border px-3.5 py-2 font-mono2 text-[10px] font-semibold uppercase tracking-[0.14em]"
                  style="border-color: var(--line)"
                  @click="continueDraft(quote.reference)"
                >
                  Open in calculator <ArrowRight :size="12" />
                </button>
              </div>
            </div>
          </div>
        </article>
      </div>
    </div>
  </div>

  <div v-else class="mx-auto w-full max-w-[780px] px-4 pb-24 pt-6 sm:pt-8">
    <div class="mx-auto mb-2 flex w-fit gap-1 rounded-full border p-1" :style="{ borderColor: 'var(--line)', background: 'var(--panel)' }">
      <button
        v-for="[k, label] in buyerTabs"
        :key="k"
        class="relative rounded-full px-4 py-2 font-mono2 text-[10px] font-semibold uppercase tracking-[0.14em] transition-colors"
        :style="{ color: w.buyerTab === k ? '#fff' : 'var(--sub)' }"
        @click="w.buyerTab = k"
      >
        <span v-if="w.buyerTab === k" class="absolute inset-0 rounded-full" :style="{ background: 'var(--accent)' }" />
        <span class="relative">{{ label }}</span>
      </button>
    </div>

    <div class="flex items-center gap-2 font-mono2 text-[10px] uppercase tracking-[0.22em] text-[var(--sub)]">
      <Sparkles :size="11" style="color: var(--accent)" /> {{ BUYER_PERSONA.company }} · procurement
    </div>
    <h1 class="mt-2 font-disp text-[34px] font-bold leading-[1.05] tracking-tight sm:text-[44px]">
      Good morning, Ava.
      <span v-if="needAction.length > 0" class="block text-[var(--sub)]">
        {{ needAction.length }} {{ needAction.length === 1 ? 'thing needs' : 'things need' }} your eyes.
      </span>
      <span v-else class="block text-[var(--sub)]">Everything is moving nicely.</span>
    </h1>
    <p v-if="needAction.length === 0" class="mt-3 max-w-[46ch] text-[14px] leading-relaxed text-[var(--sub)]">
      Nothing is waiting on you. We're pressing, folding and checking — you'll hear from us the moment it's your turn.
    </p>

    <div class="mt-9 space-y-4">
      <article
        v-for="j in mine"
        :key="j.id"
        class="overflow-hidden rounded-3xl border bg-[var(--panel)] shadow-[0_2px_24px_-12px_rgba(27,23,16,.25)]"
        :style="{ borderColor: friendlyStatus(j).tone === 'act' || friendlyStatus(j).tone === 'pay' ? `${toneStyle(j).chip}44` : 'var(--line)' }"
      >
        <div class="flex items-center justify-between gap-3 px-5 py-3" :style="{ background: toneStyle(j).bg }">
          <div class="flex items-center gap-2.5">
            <span v-if="friendlyStatus(j).tone === 'calm'" class="ball-ping h-2 w-2 rounded-full" :style="{ background: 'var(--accent)' }" />
            <span class="font-disp text-[14.5px] font-bold tracking-tight" :style="{ color: toneStyle(j).fg }">{{ friendlyStatus(j).headline }}</span>
          </div>
          <span class="hidden font-mono2 text-[9.5px] uppercase tracking-[0.16em] text-[var(--sub)] sm:block">{{ j.code }}</span>
        </div>

        <div class="p-5">
          <div class="flex flex-wrap items-start justify-between gap-4">
            <div class="min-w-0">
              <h2 class="font-disp text-[19px] font-bold leading-tight tracking-tight">{{ j.product }}</h2>
              <div class="mt-1 text-[13px] text-[var(--sub)]">
                {{ j.title.split('—')[0]!.trim() }} · {{ j.qty.toLocaleString() }} units · {{ money(j.value) }}
              </div>
              <p class="mt-2.5 max-w-[52ch] text-[13.5px] leading-relaxed text-[var(--sub)]">{{ friendlyStatus(j).body }}</p>
            </div>
            <div class="text-right">
              <ML>Expected</ML>
              <div class="mt-1 font-disp text-[15px] font-bold">{{ j.eta.replace(' · ', ' · ') }}</div>
              <div class="mt-1 inline-flex items-center gap-1 font-mono2 text-[9px] uppercase tracking-[0.12em] text-[var(--sub)]">
                <Lock :size="9" /> {{ j.custody === 'held' ? 'in custody' : j.custody === 'awaiting' ? 'not charged' : 'released' }}
              </div>
            </div>
          </div>

          <div class="mt-4">
            <StageDots :job="j" />
          </div>

          <div v-if="j.stage === 'approval' || j.stage === 'payment' || j.stage === 'delivery'" class="mt-4 flex flex-wrap gap-2 border-t pt-4" :style="{ borderColor: 'var(--line)' }">
            <template v-if="j.stage === 'approval'">
              <button class="press-key inline-flex items-center gap-1.5 rounded-xl border px-4 py-2.5 font-mono2 text-[11px] font-semibold uppercase tracking-[0.14em]" :style="{ borderColor: 'var(--line)' }" @click="w.act('review-proof', j)">
                <Eye :size="13" /> Review
              </button>
              <button class="press-key inline-flex items-center gap-1.5 rounded-xl border px-4 py-2.5 font-mono2 text-[11px] font-semibold uppercase tracking-[0.14em]" :style="{ borderColor: 'var(--line)' }" @click="w.act('request-changes', j)">
                <PencilRuler :size="13" /> Request changes
              </button>
              <button class="press-key inline-flex items-center gap-1.5 rounded-xl px-5 py-2.5 font-mono2 text-[11px] font-semibold uppercase tracking-[0.14em]" :style="{ background: 'var(--accent)', color: '#fff' }" @click="w.act('approve', j)">
                <CheckCheck :size="13" /> Approve artwork
              </button>
            </template>
            <button v-if="j.stage === 'payment'" class="press-key inline-flex items-center gap-1.5 rounded-xl px-5 py-2.5 font-mono2 text-[11px] font-semibold uppercase tracking-[0.14em]" :style="{ background: '#B45309', color: '#fff' }" @click="payJob = j">
              <CreditCard :size="13" /> Pay {{ money(j.value) }}
            </button>
            <button v-if="j.stage === 'delivery'" class="press-key inline-flex items-center gap-1.5 rounded-xl px-5 py-2.5 font-mono2 text-[11px] font-semibold uppercase tracking-[0.14em]" :style="{ background: 'var(--accent)', color: '#fff' }" @click="w.act('confirm-delivery', j)">
              <PackageCheck :size="13" /> Confirm delivery
            </button>
          </div>

          <div class="mt-4 flex items-center gap-2 text-[12px] text-[var(--sub)]">
            <Truck v-if="j.stage === 'delivery'" :size="13" />
            <ShieldCheck v-else :size="13" style="color: var(--accent)" />
            <span v-if="nextStage(j)">Next: <span class="font-semibold text-[var(--ink)]">{{ nextStage(j)!.label.toLowerCase() }}</span> — {{ j.stage === 'delivery' ? 'you confirm, we release the funds' : 'handled by us' }}</span>
            <span v-else>This order is archived. Reorder any time.</span>
          </div>

          <div class="mt-3">
            <button class="font-mono2 text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--accent)] underline underline-offset-4 opacity-80 transition-opacity hover:opacity-100" @click="w.act('open-job', j)">
              View order timeline
            </button>
          </div>
        </div>
      </article>
    </div>

    <button class="press-key mt-6 flex w-full items-center gap-4 rounded-3xl border p-5 text-left transition-colors hover:border-[var(--accent)]" :style="{ borderColor: 'var(--line)', background: 'var(--panel)' }" @click="w.buyerTab = 'quote'">
      <div class="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl" :style="{ background: 'color-mix(in srgb, var(--accent) 12%, transparent)' }">
        <Sparkles :size="19" style="color: var(--accent)" />
      </div>
      <div class="min-w-0 flex-1">
        <div class="font-disp text-[16px] font-bold tracking-tight">Need something else printed?</div>
        <div class="mt-0.5 text-[12.5px] leading-snug text-[var(--sub)]">
          Get an exact price in about 30 seconds — real sheet counts, real press rates, no signup.
        </div>
      </div>
      <span class="hidden shrink-0 font-mono2 text-[10px] font-semibold uppercase tracking-[0.16em] sm:block" :style="{ color: 'var(--accent)' }">
        Open calculator →
      </span>
    </button>

    <div class="mt-8 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 rounded-3xl border px-6 py-5 text-center" :style="{ borderColor: 'var(--line)', background: 'var(--panel)' }">
      <div v-for="[a, b] in trustRows" :key="a">
        <div class="font-disp text-[13px] font-bold">{{ a }}</div>
        <div class="font-mono2 text-[9px] uppercase tracking-[0.14em] text-[var(--sub)]">{{ b }}</div>
      </div>
    </div>

    <MpesaCheckout
      :open="!!payJob"
      :amount="payJob?.value ?? 0"
      :reference="payJob?.code ?? ''"
      @close="payJob = null"
      @paid="onPaid"
    />

    <div v-if="w.proofJob" class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm" @click="w.proofJob = null">
      <div class="relative w-full max-w-[560px] overflow-hidden rounded-3xl bg-[var(--panel)]" @click.stop>
        <div class="flex items-center justify-between px-5 py-4">
          <div>
            <ML>Artwork proof · v2 · final</ML>
            <div class="mt-0.5 font-disp text-[17px] font-bold">{{ w.proofJob.title }}</div>
          </div>
          <button class="rounded-full p-2 hover:bg-[var(--panel2)]" @click="w.proofJob = null"><X :size="16" /></button>
        </div>
        <div class="relative mx-5 overflow-hidden rounded-2xl border" :style="{ borderColor: 'var(--line)' }">
          <img :src="w.proofJob.proofImg" alt="Artwork proof" class="w-full object-cover" />
          <span v-for="pos in cropMarks" :key="pos" class="absolute h-4 w-4 border-black/50" :class="pos" />
        </div>
        <div class="grid grid-cols-2 gap-2 p-5">
          <button class="press-key rounded-xl border px-4 py-3 font-mono2 text-[11px] font-semibold uppercase tracking-[0.14em]" :style="{ borderColor: 'var(--line)' }" @click="w.act('request-changes', w.proofJob); w.proofJob = null">
            Request changes
          </button>
          <button class="press-key rounded-xl px-4 py-3 font-mono2 text-[11px] font-semibold uppercase tracking-[0.14em] text-white" :style="{ background: 'var(--accent)' }" @click="w.act('approve', w.proofJob); w.proofJob = null">
            Approve artwork
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import {
  ArrowLeft, CalendarDays, CheckCheck, CreditCard, Eye, FileText, Loader2, Lock,
  PackageCheck, PencilRuler, Plus, ShieldCheck, Sparkles, Truck, X,
} from 'lucide-vue-next'
import { BUYER_PERSONA, money, nextStage, type Job } from '~/shared/workflow/printy'
import type { CalcInput } from '~/shared/workflow/pricing'
import { getApiErrorMessage } from '~/shared/api'
import { summarizeBuyerItem } from '~/shared/quote-handoff'
import type { BuyerQuoteItem } from '~/shared/types'
import { useWorkflowStore } from '~/stores/workflow'
import { useCalculatorStore } from '~/stores/calculator'

const w = useWorkflowStore()
const calcStore = useCalculatorStore()

const quoteOpen = ref(false)
const quotes = ref<BuyerQuoteItem[]>([])
const loadingQuotes = ref(false)
const quotesError = ref('')

const summaries = computed(() => quotes.value.map(summarizeBuyerItem))

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
  quoteOpen.value = true
  quotesError.value = ''
}

function continueDraft(reference: string) {
  const item = quotes.value.find((q) => q.item_type === 'draft' && q.draft.draft_reference === reference)
  if (item?.item_type === 'draft') {
    const snapshot = item.draft.calculator_inputs_snapshot as unknown as CalcInput | undefined
    if (snapshot?.productId) {
      calcStore.setInput(snapshot)
    }
  }
  quoteOpen.value = true
}

async function onQuoteCreated() {
  quoteOpen.value = false
  await loadQuotes()
}

onMounted(() => {
  if (w.buyerTab === 'quote') {
    loadQuotes()
  }
})

watch(() => w.buyerTab, () => {
  if (w.buyerTab === 'quote' && !quoteOpen.value) {
    loadQuotes()
  }
})

const payJob = ref<Job | null>(null)

const onPaid = () => {
  if (payJob.value) w.act('pay', payJob.value)
  payJob.value = null
}

const mine = computed(() => w.jobs.filter((j) => j.buyerId === BUYER_PERSONA.id))
const needAction = computed(() => mine.value.filter((j) => ['approval', 'payment', 'delivery'].includes(j.stage)))

const buyerTabs = computed<Array<['orders' | 'quote', string]>>(() => [
  ['orders', `My orders${needAction.value.length ? ` · ${needAction.value.length}` : ''}`],
  ['quote', 'Get an instant quote'],
])

const trustRows = [
  ['Escrow on every job', 'funds release only on delivery'],
  ['One workflow', 'same job, live, for everyone'],
  ['SLA-tracked', 'someone always has the ball'],
] as const

const cropMarks = [
  'top-2 left-2 border-t-2 border-l-2',
  'top-2 right-2 border-t-2 border-r-2',
  'bottom-2 left-2 border-b-2 border-l-2',
  'bottom-2 right-2 border-b-2 border-r-2',
]

const toneStyles: Record<string, { bg: string; fg: string; chip: string }> = {
  act: { bg: 'rgba(194,65,12,.08)', fg: '#C2410C', chip: '#C2410C' },
  pay: { bg: 'rgba(180,83,9,.08)', fg: '#B45309', chip: '#B45309' },
  calm: { bg: 'rgba(27,23,16,.035)', fg: '#1B1710', chip: '#1B1710' },
  done: { bg: 'rgba(27,23,16,.03)', fg: 'rgba(27,23,16,.5)', chip: 'rgba(27,23,16,.5)' },
}

function friendlyStatus(j: Job): { headline: string; body: string; tone: 'act' | 'calm' | 'pay' | 'done' } {
  switch (j.stage) {
    case 'approval':
      return { tone: 'act', headline: 'Your action — approve artwork', body: 'Proof v2 is ready. Take a look, approve it, or send it back for changes.' }
    case 'payment':
      return { tone: 'pay', headline: 'Payment required', body: `Artwork approved. ${money(j.value)} releases the job to production — held safely in Printy Custody until delivery.` }
    case 'printing':
    case 'production':
      return { tone: 'calm', headline: 'Your order is in production', body: "On press right now. Nothing needed from you — we'll tap your shoulder when it's time." }
    case 'finishing':
      return { tone: 'calm', headline: 'Your order is in production', body: 'Off the press and being finished — folded, trimmed and laminated to spec.' }
    case 'qc':
      return { tone: 'calm', headline: 'Final quality checks', body: 'Every batch is being sampled and measured before it leaves the floor.' }
    case 'delivery':
      return { tone: 'calm', headline: 'Out for delivery', body: "The courier has your order. Confirm when it lands and we'll release payment to the printer." }
    case 'artwork':
      return { tone: 'calm', headline: 'Artwork in progress', body: 'The studio is typesetting your job. A proof will land here for your sign-off.' }
    case 'completed':
      return { tone: 'done', headline: 'Delivered & complete', body: 'Signed, delivered, and payment released. Lovely working with you.' }
    default:
      return { tone: 'calm', headline: 'Order placed', body: "We're pricing your job now." }
  }
}

function toneStyle(j: Job) {
  return toneStyles[friendlyStatus(j).tone]!
}
</script>