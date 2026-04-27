<template>
  <DashboardShell sidebar-tone="dark">
    <template #sidebar>
      <ShopSidebarNav />
    </template>

    <div class="space-y-6">
      <DashboardTopBar
        eyebrow="Print shop"
        title="Quote Requests"
        description="A clean inbox for calculator requests, with the full buyer brief visible before you respond."
        action-label="Respond"
      />

      <div v-if="loadError" class="rounded-3xl border border-rose-500/30 bg-rose-500/10 p-5 text-sm text-rose-100">
        {{ loadError }}
      </div>

      <div class="grid gap-4 md:grid-cols-5">
        <BaseCard
          v-for="metric in metrics"
          :key="metric.label"
          tone="dark"
          class="border border-white/10 bg-white/5"
        >
          <p class="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">{{ metric.label }}</p>
          <p class="mt-2 text-3xl font-bold text-white">{{ metric.value }}</p>
          <p class="mt-1 text-xs text-slate-400">{{ metric.helper }}</p>
        </BaseCard>
      </div>

      <div v-if="loading && !cards.length" class="rounded-3xl border border-white/10 bg-slate-950 p-8 text-sm text-slate-300">
        <div class="flex items-center gap-2">
          <Icon name="lucide:loader-2" class="size-4 animate-spin" />
          Loading quote requests...
        </div>
      </div>

      <template v-else>
        <section
          v-for="group in groupedCards"
          :key="group.key"
          class="space-y-4"
        >
          <div class="flex items-center gap-3">
            <span class="size-2.5 rounded-full" :class="group.dotClass" />
            <h2 class="text-sm font-bold uppercase tracking-[0.24em] text-slate-300">{{ group.label }}</h2>
            <BaseBadge tone="dark">{{ group.items.length }}</BaseBadge>
          </div>

          <div v-if="group.items.length" class="space-y-4">
            <BaseCard
              v-for="card in group.items"
              :key="card.id"
              tone="dark"
              class="border border-white/10 bg-slate-950/95"
            >
              <div class="space-y-5">
                <div class="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
                  <div class="space-y-3">
                    <div class="flex flex-wrap items-center gap-2">
                      <h3 class="text-xl font-bold text-white">{{ card.title }}</h3>
                      <BaseBadge :tone="card.statusTone">{{ card.statusLabel }}</BaseBadge>
                      <BaseBadge v-if="card.requestReference" tone="dark">{{ card.requestReference }}</BaseBadge>
                    </div>

                    <div class="flex flex-wrap gap-4 text-sm text-slate-300">
                      <span class="inline-flex items-center gap-1.5">
                        <Icon name="lucide:user" class="size-4" />
                        {{ card.buyerName }}
                      </span>
                      <span v-if="card.buyerEmail" class="inline-flex items-center gap-1.5">
                        <Icon name="lucide:mail" class="size-4" />
                        {{ card.buyerEmail }}
                      </span>
                      <span v-if="card.buyerPhone" class="inline-flex items-center gap-1.5">
                        <Icon name="lucide:phone" class="size-4" />
                        {{ card.buyerPhone }}
                      </span>
                    </div>

                    <p class="max-w-4xl text-sm leading-6 text-slate-300">
                      {{ card.briefSummary }}
                    </p>
                  </div>

                  <div class="space-y-1 text-left text-sm text-slate-400 xl:text-right">
                    <p class="font-medium text-slate-200">{{ card.receivedLabel }}</p>
                    <p>{{ card.turnaroundHint }}</p>
                  </div>
                </div>

                <div class="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                  <div class="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <p class="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">Job Type</p>
                    <p class="mt-2 text-lg font-semibold text-white">{{ card.jobType }}</p>
                  </div>
                  <div class="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <p class="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">Quantity</p>
                    <p class="mt-2 text-lg font-semibold text-white">{{ card.quantityLabel }}</p>
                  </div>
                  <div class="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <p class="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">Size / Specs</p>
                    <p class="mt-2 text-sm font-medium text-white">{{ card.sizeLabel }}</p>
                  </div>
                  <div class="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <p class="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">Artwork</p>
                    <p class="mt-2 text-sm font-medium text-white">{{ card.artworkLabel }}</p>
                  </div>
                </div>

                <div class="grid gap-4 xl:grid-cols-[1.05fr_0.95fr]">
                  <div class="space-y-4 rounded-3xl border border-white/10 bg-white/5 p-5">
                    <div class="flex items-center gap-2">
                      <Icon name="lucide:file-text" class="size-4 text-[var(--p-primary)]" />
                      <h4 class="text-sm font-bold uppercase tracking-[0.2em] text-slate-200">Buyer Brief</h4>
                    </div>

                    <div class="grid gap-4 md:grid-cols-2">
                      <div>
                        <p class="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">Requested finishings</p>
                        <div class="mt-2 flex flex-wrap gap-2">
                          <BaseBadge
                            v-for="item in card.finishings"
                            :key="item"
                            tone="info"
                          >
                            {{ item }}
                          </BaseBadge>
                          <span v-if="!card.finishings.length" class="text-sm text-slate-400">No finishings selected</span>
                        </div>
                      </div>

                      <div>
                        <p class="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">Needs confirmation</p>
                        <div class="mt-2 flex flex-wrap gap-2">
                          <BaseBadge
                            v-for="item in card.needsConfirmation"
                            :key="item"
                            tone="warning"
                          >
                            {{ item }}
                          </BaseBadge>
                          <span v-if="!card.needsConfirmation.length" class="text-sm text-slate-400">Nothing pending</span>
                        </div>
                      </div>
                    </div>

                    <div v-if="card.notes" class="rounded-2xl border border-white/10 bg-slate-950/70 p-4">
                      <p class="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">Buyer notes</p>
                      <p class="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-200">{{ card.notes }}</p>
                    </div>

                    <div v-if="card.artworkRefs.length" class="rounded-2xl border border-white/10 bg-slate-950/70 p-4">
                      <p class="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">Artwork references</p>
                      <ul class="mt-2 space-y-2 text-sm text-slate-200">
                        <li v-for="(artwork, index) in card.artworkRefs" :key="`${card.id}-art-${index}`">
                          {{ artwork }}
                        </li>
                      </ul>
                    </div>
                  </div>

                  <div class="space-y-4">
                    <div class="rounded-3xl border border-white/10 bg-white/5 p-5">
                      <div class="flex items-center gap-2">
                        <Icon name="lucide:factory" class="size-4 text-[var(--p-primary)]" />
                        <h4 class="text-sm font-bold uppercase tracking-[0.2em] text-slate-200">Production Preview</h4>
                      </div>

                      <div class="mt-4 grid gap-3 md:grid-cols-2">
                        <div class="rounded-2xl border border-white/10 bg-slate-950/70 p-4">
                          <p class="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">Layout</p>
                          <p class="mt-2 text-sm font-semibold text-white">{{ card.production.layout }}</p>
                        </div>
                        <div class="rounded-2xl border border-white/10 bg-slate-950/70 p-4">
                          <p class="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">Sheets / Media</p>
                          <p class="mt-2 text-sm font-semibold text-white">{{ card.production.sheets }}</p>
                        </div>
                      </div>

                      <p v-if="card.production.detail" class="mt-3 text-sm leading-6 text-slate-300">
                        {{ card.production.detail }}
                      </p>
                    </div>

                    <div class="rounded-3xl border border-white/10 bg-white/5 p-5">
                      <div class="flex items-center gap-2">
                        <Icon name="lucide:calculator" class="size-4 text-[var(--p-primary)]" />
                        <h4 class="text-sm font-bold uppercase tracking-[0.2em] text-slate-200">Printy Pricing Preview</h4>
                      </div>

                      <div class="mt-4 flex flex-wrap items-end gap-3">
                        <p class="text-2xl font-bold text-white">{{ card.pricing.total }}</p>
                        <BaseBadge tone="dark">{{ card.pricing.mode }}</BaseBadge>
                      </div>

                      <p v-if="card.pricing.explanation" class="mt-3 text-sm leading-6 text-slate-300">
                        {{ card.pricing.explanation }}
                      </p>

                      <div v-if="card.pricing.assumptions.length" class="mt-4">
                        <p class="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">Assumptions</p>
                        <ul class="mt-2 space-y-2 text-sm text-slate-300">
                          <li v-for="(assumption, index) in card.pricing.assumptions" :key="`${card.id}-assumption-${index}`">
                            {{ assumption }}
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="flex flex-wrap gap-2 border-t border-white/10 pt-5">
                  <BaseButton variant="primary" size="sm" @click="openAction(card.id, 'quote')">Respond with quote</BaseButton>
                  <BaseButton variant="outline" size="sm" @click="openAction(card.id, 'question')">Ask buyer a question</BaseButton>
                  <BaseButton variant="danger" size="sm" @click="openAction(card.id, 'reject')">Mark cannot fulfill</BaseButton>
                  <BaseButton variant="secondary" size="sm" @click="openAction(card.id, 'alternative')">Suggest alternative</BaseButton>
                  <BaseButton variant="outline" size="sm" :disabled="briefBusy" @click="shareBrief(card)">Share brief</BaseButton>
                  <BaseButton variant="outline" size="sm" :disabled="briefBusy" @click="downloadBriefPdf(card)">Download PDF</BaseButton>
                  <BaseButton
                    v-if="card.whatsappAvailable && card.whatsappUrl"
                    variant="outline"
                    size="sm"
                    :to="card.whatsappUrl"
                    target="_blank"
                  >
                    <Icon name="logos:whatsapp-icon" class="mr-1.5 size-4" />
                    {{ card.whatsappLabel || 'WhatsApp buyer' }}
                  </BaseButton>
                  <span
                    v-else-if="card.whatsappLabel"
                    class="inline-flex items-center rounded-full bg-white/5 px-3 py-2 text-xs font-medium text-slate-300"
                  >
                    {{ card.whatsappLabel }}
                  </span>
                </div>

                <div
                  v-if="activeAction.cardId === card.id"
                  class="rounded-3xl border border-[var(--p-primary)]/25 bg-slate-950/80 p-5"
                >
                  <div class="mb-4 flex items-center justify-between gap-3">
                    <div>
                      <p class="text-sm font-bold uppercase tracking-[0.18em] text-[var(--p-primary)]">{{ actionConfig.title }}</p>
                      <p class="mt-1 text-sm text-slate-300">{{ actionConfig.description }}</p>
                    </div>
                    <button
                      type="button"
                      class="rounded-full p-2 text-slate-400 transition hover:bg-white/10 hover:text-white"
                      @click="closeAction"
                    >
                      <Icon name="lucide:x" class="size-4" />
                    </button>
                  </div>

                  <form class="space-y-4" @submit.prevent="submitAction(card)">
                    <div v-if="activeAction.kind === 'quote' || activeAction.kind === 'alternative'" class="space-y-4">
                      <div class="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                        <label class="space-y-2">
                          <span class="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">Final price</span>
                          <input
                            v-model.trim="actionForm.total"
                            type="text"
                            inputmode="decimal"
                            class="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition focus:border-[var(--p-primary)]"
                            placeholder="e.g. 4500"
                          >
                        </label>
                        <label class="space-y-2">
                          <span class="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">Price range min</span>
                          <input
                            v-model.trim="actionForm.priceMin"
                            type="text"
                            inputmode="decimal"
                            class="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition focus:border-[var(--p-primary)]"
                            placeholder="Optional"
                          >
                        </label>
                        <label class="space-y-2">
                          <span class="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">Price range max</span>
                          <input
                            v-model.trim="actionForm.priceMax"
                            type="text"
                            inputmode="decimal"
                            class="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition focus:border-[var(--p-primary)]"
                            placeholder="Optional"
                          >
                        </label>
                        <label class="space-y-2">
                          <span class="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">Availability</span>
                          <input
                            v-model.trim="actionForm.availabilityStatus"
                            type="text"
                            class="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition focus:border-[var(--p-primary)]"
                            placeholder="e.g. Ready to produce"
                          >
                        </label>
                      </div>

                      <div class="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                        <label class="space-y-2">
                          <span class="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">Turnaround days</span>
                          <input
                            v-model.trim="actionForm.turnaroundDays"
                            type="number"
                            min="0"
                            class="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition focus:border-[var(--p-primary)]"
                            placeholder="e.g. 2"
                          >
                        </label>
                        <label class="space-y-2">
                          <span class="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">Turnaround hours</span>
                          <input
                            v-model.trim="actionForm.turnaroundHours"
                            type="number"
                            min="0"
                            class="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition focus:border-[var(--p-primary)]"
                            placeholder="Optional"
                          >
                        </label>
                        <label class="space-y-2">
                          <span class="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">Alternative suggestion</span>
                          <input
                            v-model.trim="actionForm.alternativeSuggestion"
                            type="text"
                            class="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition focus:border-[var(--p-primary)]"
                            placeholder="Offer a nearby spec if needed"
                          >
                        </label>
                      </div>

                      <div class="grid gap-4 md:grid-cols-2">
                        <label class="space-y-2">
                          <span class="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">Confirmed specs</span>
                          <textarea
                            v-model.trim="actionForm.confirmedSpecs"
                            rows="4"
                            class="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition focus:border-[var(--p-primary)]"
                            placeholder="One per line"
                          ></textarea>
                        </label>
                        <label class="space-y-2">
                          <span class="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">Needs buyer confirmation</span>
                          <textarea
                            v-model.trim="actionForm.needsBuyerConfirmation"
                            rows="4"
                            class="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition focus:border-[var(--p-primary)]"
                            placeholder="One per line"
                          ></textarea>
                        </label>
                      </div>

                      <div class="grid gap-4 md:grid-cols-2">
                        <div class="rounded-2xl border border-white/10 bg-white/5 p-4">
                          <p class="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">Printy estimate</p>
                          <p class="mt-2 text-lg font-semibold text-white">{{ card.pricing.total }}</p>
                          <ul v-if="card.pricing.assumptions.length" class="mt-3 space-y-2 text-sm text-slate-300">
                            <li v-for="(assumption, index) in card.pricing.assumptions" :key="`${card.id}-quote-assumption-${index}`">
                              {{ assumption }}
                            </li>
                          </ul>
                        </div>
                        <div class="rounded-2xl border border-white/10 bg-white/5 p-4">
                          <p class="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">Production preview</p>
                          <p class="mt-2 text-sm font-semibold text-white">{{ card.production.layout }} · {{ card.production.sheets }}</p>
                          <p v-if="card.production.detail" class="mt-2 text-sm text-slate-300">{{ card.production.detail }}</p>
                          <div class="mt-3 flex flex-wrap gap-2">
                            <BaseBadge
                              v-for="item in card.needsConfirmation"
                              :key="`${card.id}-quote-confirm-${item}`"
                              tone="warning"
                            >
                              {{ item }}
                            </BaseBadge>
                          </div>
                        </div>
                      </div>
                    </div>

                    <label class="space-y-2">
                      <span class="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">{{ actionConfig.fieldLabel }}</span>
                      <textarea
                        v-model.trim="actionForm.message"
                        rows="4"
                        class="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition focus:border-[var(--p-primary)]"
                        :placeholder="actionConfig.placeholder"
                      ></textarea>
                    </label>

                    <p v-if="actionError" class="text-sm text-rose-300">{{ actionError }}</p>

                    <div class="flex flex-wrap gap-2">
                      <BaseButton variant="primary" size="sm" type="submit" :disabled="submitting">
                        <Icon v-if="submitting" name="lucide:loader-2" class="mr-1.5 size-4 animate-spin" />
                        {{ actionConfig.submitLabel }}
                      </BaseButton>
                      <BaseButton
                        v-if="activeAction.kind === 'quote'"
                        variant="secondary"
                        size="sm"
                        type="button"
                        :disabled="submitting"
                        @click="submitQuote(card, 'pending')"
                      >
                        Save draft response
                      </BaseButton>
                      <BaseButton variant="ghost" size="sm" @click="closeAction">Cancel</BaseButton>
                    </div>
                  </form>
                </div>
              </div>
            </BaseCard>
          </div>

          <div v-else class="rounded-3xl border border-dashed border-white/10 bg-slate-950 p-6 text-sm text-slate-400">
            No requests in {{ group.label.toLowerCase() }}.
          </div>
        </section>

        <div v-if="!cards.length && !loading" class="rounded-3xl border border-dashed border-white/10 bg-slate-950 p-10 text-center text-sm text-slate-300">
          No quote requests yet.
        </div>
      </template>
    </div>
  </DashboardShell>
</template>

<script setup lang="ts">
import { useAdminWorkspace } from '~/composables/useAdminWorkspace'
import { useIncomingRequests } from '~/composables/useIncomingRequests'
import { useShopStore } from '~/stores/shop'
import BaseBadge from '~/components/ui/BaseBadge.vue'
import BaseButton from '~/components/ui/BaseButton.vue'
import BaseCard from '~/components/ui/BaseCard.vue'
import ShopSidebarNav from '~/components/dashboard/shop/ShopSidebarNav.vue'
import DashboardShell from '~/components/dashboard/shared/DashboardShell.vue'
import DashboardTopBar from '~/components/dashboard/shared/DashboardTopBar.vue'
import { normalizeQuoteRequestStatus, quoteRequestStatusLabel } from '~/utils/quoteStatus'

definePageMeta({
  layout: 'dashboard',
})

type IncomingRequestRecord = Record<string, unknown>
type ActionKind = 'quote' | 'question' | 'reject' | 'alternative'
type CardGroupKey = 'new' | 'needs_response' | 'responded' | 'accepted' | 'rejected'
type CardStatusTone = 'primary' | 'warning' | 'success' | 'error' | 'neutral' | 'info'
type QuoteSubmitStatus = 'pending' | 'sent'

type RequestCard = {
  id: number
  group: CardGroupKey
  title: string
  statusLabel: string
  statusTone: CardStatusTone
  requestReference: string
  buyerName: string
  buyerEmail: string
  buyerPhone: string
  briefSummary: string
  jobType: string
  quantityLabel: string
  sizeLabel: string
  artworkLabel: string
  artworkRefs: string[]
  finishings: string[]
  needsConfirmation: string[]
  notes: string
  receivedLabel: string
  turnaroundHint: string
  production: {
    layout: string
    sheets: string
    detail: string
  }
  pricing: {
    total: string
    mode: string
    explanation: string
    assumptions: string[]
  }
  whatsappAvailable: boolean
  whatsappUrl: string
  whatsappLabel: string
  raw: IncomingRequestRecord
}

const shopStore = useShopStore()
const { selectedShopSlug } = useAdminWorkspace()
const toast = useToast()

const loading = ref(false)
const loadError = ref<string | null>(null)
const cards = ref<RequestCard[]>([])
const briefBusy = ref(false)
const activeAction = reactive<{ cardId: number | null; kind: ActionKind | null }>({
  cardId: null,
  kind: null,
})
const actionForm = reactive({
  total: '',
  priceMin: '',
  priceMax: '',
  turnaroundDays: '',
  turnaroundHours: '',
  confirmedSpecs: '',
  needsBuyerConfirmation: '',
  alternativeSuggestion: '',
  availabilityStatus: '',
  message: '',
})
const actionError = ref<string | null>(null)
const submitting = ref(false)

const groupedCards = computed(() => {
  const groups: Array<{ key: CardGroupKey; label: string; dotClass: string; items: RequestCard[] }> = [
    { key: 'new', label: 'New', dotClass: 'bg-sky-400', items: [] },
    { key: 'needs_response', label: 'Needs Response', dotClass: 'bg-amber-400', items: [] },
    { key: 'responded', label: 'Responded', dotClass: 'bg-emerald-400', items: [] },
    { key: 'accepted', label: 'Accepted', dotClass: 'bg-green-500', items: [] },
    { key: 'rejected', label: 'Rejected / Expired', dotClass: 'bg-rose-400', items: [] },
  ]

  for (const card of cards.value) {
    const group = groups.find(item => item.key === card.group)
    if (group) group.items.push(card)
  }

  return groups
})

const metrics = computed(() => {
  const counts = groupedCards.value.reduce<Record<CardGroupKey, number>>((acc, group) => {
    acc[group.key] = group.items.length
    return acc
  }, {
    new: 0,
    needs_response: 0,
    responded: 0,
    accepted: 0,
    rejected: 0,
  })

  return [
    { label: 'New', value: String(counts.new), helper: 'Fresh buyer requests' },
    { label: 'Needs Response', value: String(counts.needs_response), helper: 'Requires your action' },
    { label: 'Responded', value: String(counts.responded), helper: 'Quote or reply sent' },
    { label: 'Accepted', value: String(counts.accepted), helper: 'Buyer moved ahead' },
    { label: 'Rejected / Expired', value: String(counts.rejected), helper: 'Closed out requests' },
  ]
})

const actionConfig = computed(() => {
  const configMap: Record<ActionKind, { title: string; description: string; fieldLabel: string; placeholder: string; submitLabel: string }> = {
    quote: {
      title: 'Respond With Quote',
      description: 'Send or draft a structured quote with confirmations, notes, and final pricing.',
      fieldLabel: 'Quote note',
      placeholder: 'Clarify what is included, any production assumptions, and what you need next.',
      submitLabel: 'Send quote',
    },
    question: {
      title: 'Ask Buyer A Question',
      description: 'Use this when one detail blocks pricing or production.',
      fieldLabel: 'Question',
      placeholder: 'Example: Please confirm whether you want matt or gloss lamination.',
      submitLabel: 'Send question',
    },
    reject: {
      title: 'Mark Cannot Fulfill',
      description: 'Tell the buyer clearly why this request cannot be produced as specified.',
      fieldLabel: 'Reason',
      placeholder: 'Explain the limiting factor so the buyer understands why the request cannot proceed.',
      submitLabel: 'Mark cannot fulfill',
    },
    alternative: {
      title: 'Suggest Alternative',
      description: 'Offer a nearby spec, material, or finishing option that your shop can produce as a response.',
      fieldLabel: 'Alternative note',
      placeholder: 'Explain what you can produce instead and why it is the best nearby option.',
      submitLabel: 'Send alternative',
    },
  }

  return activeAction.kind ? configMap[activeAction.kind] : configMap.question
})

function stringValue(value: unknown) {
  return typeof value === 'string' && value.trim() ? value.trim() : ''
}

function numberValue(value: unknown) {
  if (typeof value === 'number' && Number.isFinite(value)) return value
  if (typeof value === 'string' && value.trim()) {
    const parsed = Number(value)
    return Number.isFinite(parsed) ? parsed : null
  }
  return null
}

function listValue(value: unknown) {
  return Array.isArray(value) ? value.map(item => String(item)).filter(Boolean) : []
}

function titleCase(value: string) {
  return value.replace(/[_-]/g, ' ').replace(/\b\w/g, char => char.toUpperCase())
}

function splitLines(value: string) {
  return value
    .split(/\r?\n|,/)
    .map(item => item.trim())
    .filter(Boolean)
}

function formatRelativeDate(iso?: string) {
  if (!iso) return 'Just now'
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return iso

  const diffMs = Date.now() - date.getTime()
  const diffMinutes = Math.floor(diffMs / 60_000)
  const diffHours = Math.floor(diffMinutes / 60)
  const diffDays = Math.floor(diffHours / 24)

  if (diffMinutes < 1) return 'just now'
  if (diffMinutes < 60) return `${diffMinutes}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays < 7) return `${diffDays}d ago`
  return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}

function normalizeArtworkRefs(raw: IncomingRequestRecord, requestSnapshot: IncomingRequestRecord) {
  const customSnapshot = (requestSnapshot.custom_product_snapshot ?? {}) as IncomingRequestRecord
  const requestDetails = (requestSnapshot.request_details ?? {}) as IncomingRequestRecord
  const refs: string[] = []

  for (const item of listValue(customSnapshot.artwork_refs)) {
    refs.push(item)
  }

  const artworkFileName = stringValue(customSnapshot.artwork_file_name) || stringValue(requestDetails.artwork_file_name)
  if (artworkFileName) refs.push(artworkFileName)

  const attachments = Array.isArray(raw.attachments) ? raw.attachments : []
  for (const attachment of attachments) {
    if (attachment && typeof attachment === 'object') {
      const name = stringValue((attachment as IncomingRequestRecord).name) || stringValue((attachment as IncomingRequestRecord).file)
      if (name) refs.push(name)
    }
  }

  return Array.from(new Set(refs))
}

function getCardGroup(raw: IncomingRequestRecord, hasResponse: boolean): CardGroupKey {
  const status = normalizeQuoteRequestStatus(stringValue(raw.status))

  if (status === 'accepted') return 'accepted'
  if (['rejected', 'expired', 'cancelled'].includes(status)) return 'rejected'
  if (status === 'responded' || hasResponse) return 'responded'
  if (status === 'needs_confirmation' || status === 'viewed' || status === 'sent') return 'needs_response'
  return 'new'
}

function getStatusPresentation(group: CardGroupKey, rawStatus: string): { label: string; tone: CardStatusTone } {
  const status = normalizeQuoteRequestStatus(rawStatus)
  const map: Record<CardGroupKey, { label: string; tone: CardStatusTone }> = {
    new: { label: 'New', tone: 'primary' },
    needs_response: { label: 'Needs response', tone: 'warning' },
    responded: { label: 'Responded', tone: 'success' },
    accepted: { label: 'Accepted', tone: 'success' },
    rejected: { label: status === 'expired' ? 'Expired' : 'Rejected', tone: 'error' },
  }
  if (group === 'needs_response' && status === 'needs_confirmation') {
    return { label: 'Needs confirmation', tone: 'warning' }
  }
  if (group === 'new' && status === 'pending') {
    return { label: quoteRequestStatusLabel(status), tone: 'primary' }
  }
  return map[group]
}

function buildRequestCard(raw: IncomingRequestRecord): RequestCard {
  const requestSnapshot = (raw.request_snapshot ?? {}) as IncomingRequestRecord
  const calculatorInputs = (requestSnapshot.calculator_inputs ?? {}) as IncomingRequestRecord
  const pricingPreview = (requestSnapshot.pricing_preview_snapshot ?? {}) as IncomingRequestRecord
  const productionPreview = (requestSnapshot.production_preview_snapshot ?? {}) as IncomingRequestRecord
  const requestDetails = (requestSnapshot.request_details ?? {}) as IncomingRequestRecord
  const selectedShopPreview = (requestSnapshot.selected_shop_preview ?? {}) as IncomingRequestRecord

  const jobType = titleCase(stringValue(calculatorInputs.product_type) || 'custom print job')
  const quantity = numberValue(calculatorInputs.quantity)
  const sizeLabel = stringValue(calculatorInputs.finished_size)
    || stringValue(calculatorInputs.size_label)
    || stringValue(selectedShopPreview.size_label)
    || 'Size not specified'

  const finishings = Array.from(new Set([
    ...listValue(selectedShopPreview.matched_specs).filter(item => /lamination|binding|fold|corner|cut/i.test(item)),
    ...listValue(productionPreview.selected_finishings),
    ...['lamination', 'cover_lamination', 'binding_type', 'folding', 'corner_rounding', 'cut_type']
      .map(key => {
        const value = calculatorInputs[key]
        if (typeof value === 'boolean') return value ? titleCase(key) : ''
        return stringValue(value) ? titleCase(String(value)) : ''
      })
      .filter(Boolean),
  ]))

  const needsConfirmation = Array.from(new Set([
    ...listValue(requestSnapshot.needs_confirmation),
    ...listValue(selectedShopPreview.needs_confirmation),
  ]))

  const artworkRefs = normalizeArtworkRefs(raw, requestSnapshot)
  const hasResponse = Array.isArray(raw.sent_quotes) ? raw.sent_quotes.length > 0 : false
  const latestSentQuote = Array.isArray(raw.sent_quotes) && raw.sent_quotes.length
    ? (raw.sent_quotes[0] as IncomingRequestRecord)
    : null
  const group = getCardGroup(raw, hasResponse)
  const status = getStatusPresentation(group, stringValue(raw.status))

  const productionLayout = numberValue(productionPreview.pieces_per_sheet)
    ? `${numberValue(productionPreview.pieces_per_sheet)}-up`
    : 'Layout not calculated'
  const productionSheets = numberValue(productionPreview.sheets_required)
    ? `${numberValue(productionPreview.sheets_required)?.toLocaleString()} sheets`
    : stringValue(productionPreview.parent_sheet) || 'Waiting on review'

  const pricingTotalRaw = pricingPreview.total
    ?? ((pricingPreview.totals ?? {}) as IncomingRequestRecord).grand_total
    ?? selectedShopPreview.total
  const pricingCurrency = stringValue(pricingPreview.currency) || stringValue(selectedShopPreview.currency) || 'KES'
  const pricingTotal = pricingTotalRaw != null && String(pricingTotalRaw).trim()
    ? `${pricingCurrency} ${Number(pricingTotalRaw).toLocaleString()}`
    : 'Price pending'

  const briefParts = [
    jobType,
    quantity ? `${quantity.toLocaleString()} pcs` : '',
    sizeLabel,
    stringValue(calculatorInputs.paper_stock) ? titleCase(stringValue(calculatorInputs.paper_stock)) : '',
  ].filter(Boolean)

  return {
    id: Number(raw.id),
    group,
    title: `${jobType}${quantity ? ` - ${quantity.toLocaleString()} pcs` : ''}`,
    statusLabel: status.label,
    statusTone: status.tone,
    requestReference: stringValue(raw.request_reference),
    buyerName: stringValue(raw.customer_name) || stringValue(raw.customer_email) || `Buyer #${raw.id}`,
    buyerEmail: stringValue(raw.customer_email),
    buyerPhone: stringValue(raw.customer_phone),
    briefSummary: briefParts.join(' · '),
    jobType,
    quantityLabel: quantity ? `${quantity.toLocaleString()} pcs` : 'Quantity missing',
    sizeLabel,
    artworkLabel: artworkRefs.length ? `${artworkRefs.length} file${artworkRefs.length === 1 ? '' : 's'} referenced` : 'No artwork attached',
    artworkRefs,
    finishings,
    needsConfirmation,
    notes: stringValue(requestDetails.notes),
    receivedLabel: `Received ${formatRelativeDate(stringValue(raw.created_at))}`,
    turnaroundHint: hasResponse ? 'Buyer has a response from your shop.' : 'No shop response sent yet.',
    production: {
      layout: productionLayout,
      sheets: productionSheets,
      detail: stringValue(productionPreview.imposition_label)
        || (productionPreview.cutting_required ? 'Precision cutting appears to be part of this request.' : ''),
    },
    pricing: {
      total: pricingTotal,
      mode: titleCase(stringValue(pricingPreview.price_mode) || 'estimate'),
      explanation: stringValue(pricingPreview.message) || stringValue(pricingPreview.calculation_description),
      assumptions: [
        ...listValue(pricingPreview.assumptions),
        ...listValue(pricingPreview.warnings),
      ],
    },
    whatsappAvailable: Boolean(latestSentQuote?.whatsapp_available),
    whatsappUrl: stringValue(latestSentQuote?.whatsapp_url),
    whatsappLabel: stringValue(latestSentQuote?.whatsapp_label) || (hasResponse ? '' : 'WhatsApp available after shop responds'),
    raw,
  }
}

async function shareBrief(card: RequestCard) {
  if (!selectedShopSlug.value) return
  briefBusy.value = true
  try {
    const incomingRequests = useIncomingRequests(selectedShopSlug.value)
    const brief = await incomingRequests.getBrief(card.id)
    const summary = typeof brief.summary === 'string' ? brief.summary : `${card.title}\n${card.briefSummary}`
    if (navigator.share) {
      await navigator.share({ title: card.title, text: summary })
    } else if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(summary)
      toast.add({ title: 'Brief copied', description: 'The buyer brief is ready to paste or forward.', color: 'success' })
    } else {
      throw new Error('Sharing is not available in this browser.')
    }
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') return
    toast.add({
      title: 'Share brief failed',
      description: error instanceof Error ? error.message : 'Could not prepare the buyer brief.',
      color: 'error',
    })
  } finally {
    briefBusy.value = false
  }
}

async function downloadBriefPdf(card: RequestCard) {
  if (!selectedShopSlug.value) return
  briefBusy.value = true
  try {
    const incomingRequests = useIncomingRequests(selectedShopSlug.value)
    await incomingRequests.downloadPdf(card.id)
  } catch (error) {
    toast.add({
      title: 'Download failed',
      description: error instanceof Error ? error.message : 'Could not download the request PDF.',
      color: 'error',
    })
  } finally {
    briefBusy.value = false
  }
}

async function loadRequests() {
  const shopSlug = selectedShopSlug.value
  if (!shopSlug) {
    loadError.value = 'No active shop selected.'
    cards.value = []
    return
  }

  loading.value = true
  loadError.value = null

  try {
    await shopStore.ensureActiveShop(shopSlug)
    const incomingRequests = useIncomingRequests(shopSlug)
    const list = await incomingRequests.list()
    const details = await Promise.all(list.map(item => incomingRequests.get(Number(item.id))))
    cards.value = details
      .filter(item => Number.isFinite(Number(item.id)))
      .map(item => buildRequestCard(item as IncomingRequestRecord))
      .sort((left, right) => Number(new Date(stringValue(right.raw.created_at))) - Number(new Date(stringValue(left.raw.created_at))))
  } catch (error) {
    loadError.value = error instanceof Error ? error.message : 'Failed to load shop requests.'
    cards.value = []
  } finally {
    loading.value = false
  }
}

function resetActionForm() {
  actionForm.total = ''
  actionForm.priceMin = ''
  actionForm.priceMax = ''
  actionForm.turnaroundDays = ''
  actionForm.turnaroundHours = ''
  actionForm.confirmedSpecs = ''
  actionForm.needsBuyerConfirmation = ''
  actionForm.alternativeSuggestion = ''
  actionForm.availabilityStatus = ''
  actionForm.message = ''
  actionError.value = null
}

function openAction(cardId: number, kind: ActionKind) {
  activeAction.cardId = cardId
  activeAction.kind = kind
  resetActionForm()
  const card = cards.value.find(item => item.id === cardId)
  if (!card) return

  actionForm.total = card.pricing.total.replace(/[^\d.]/g, '')
  actionForm.turnaroundDays = ''
  actionForm.turnaroundHours = ''
  actionForm.confirmedSpecs = [
    card.jobType,
    card.quantityLabel,
    card.sizeLabel,
    ...card.finishings,
  ].filter(Boolean).join('\n')
  actionForm.needsBuyerConfirmation = card.needsConfirmation.join('\n')
  actionForm.availabilityStatus = kind === 'alternative' ? 'Alternative available' : 'Ready to produce'
  actionForm.alternativeSuggestion = ''
}

function closeAction() {
  activeAction.cardId = null
  activeAction.kind = null
  resetActionForm()
}

async function submitAction(card: RequestCard) {
  if (!selectedShopSlug.value || !activeAction.kind) return

  const incomingRequests = useIncomingRequests(selectedShopSlug.value)
  actionError.value = null
  submitting.value = true

  try {
    if (activeAction.kind === 'quote') {
      await submitQuote(card, 'sent')
    } else if (activeAction.kind === 'question') {
      if (!actionForm.message) {
        actionError.value = 'Enter the question you want to send.'
        return
      }
      await incomingRequests.askQuestion(card.id, { body: actionForm.message })
    } else if (activeAction.kind === 'reject') {
      if (!actionForm.message) {
        actionError.value = 'Enter the reason you cannot fulfill this request.'
        return
      }
      await incomingRequests.rejectRequest(card.id, { reason: actionForm.message })
    } else if (activeAction.kind === 'alternative') {
      if (!actionForm.alternativeSuggestion && !actionForm.message) {
        actionError.value = 'Enter the alternative you want to suggest.'
        return
      }
      await incomingRequests.sendQuote(card.id, buildQuotePayload(card, 'sent', {
        alternativeSuggestion: actionForm.alternativeSuggestion || actionForm.message,
        availabilityStatus: actionForm.availabilityStatus || 'Alternative available',
      }))
    }

    closeAction()
    await loadRequests()
  } catch (error) {
    actionError.value = error instanceof Error ? error.message : 'Could not send this response.'
  } finally {
    submitting.value = false
  }
}

function buildQuotePayload(
  card: RequestCard,
  status: QuoteSubmitStatus,
  overrides: { alternativeSuggestion?: string; availabilityStatus?: string } = {},
) {
  const total = numberValue(actionForm.total)
  const priceMin = numberValue(actionForm.priceMin)
  const priceMax = numberValue(actionForm.priceMax)

  if (status === 'sent' && total == null && priceMin == null && priceMax == null) {
    throw new Error('Enter a final price or a price range before sending the response.')
  }

  return {
    status,
    total,
    price_min: priceMin,
    price_max: priceMax,
    note: actionForm.message || undefined,
    turnaround_days: numberValue(actionForm.turnaroundDays),
    turnaround_hours: numberValue(actionForm.turnaroundHours),
    confirmed_specs: splitLines(actionForm.confirmedSpecs),
    needs_buyer_confirmation: splitLines(actionForm.needsBuyerConfirmation),
    alternative_suggestion: (overrides.alternativeSuggestion ?? actionForm.alternativeSuggestion) || undefined,
    availability_status: (overrides.availabilityStatus ?? actionForm.availabilityStatus) || undefined,
    revised_pricing_snapshot: {
      preview_total: card.pricing.total,
      production_layout: card.production.layout,
      production_sheets: card.production.sheets,
    },
  }
}

async function submitQuote(card: RequestCard, status: QuoteSubmitStatus) {
  if (!selectedShopSlug.value) return

  const incomingRequests = useIncomingRequests(selectedShopSlug.value)
  await incomingRequests.sendQuote(card.id, buildQuotePayload(card, status))
}

onMounted(() => {
  void loadRequests()
})

watch(selectedShopSlug, () => {
  void loadRequests()
})
</script>
