<template>
  <article class="rounded-[1.9rem] border border-slate-200 bg-white p-6 shadow-[0_16px_36px_rgba(15,23,42,0.06)]">
    <div class="flex items-start justify-between gap-4">
      <div>
        <p class="text-[10px] font-bold uppercase tracking-[0.24em] text-slate-500">Quote builder</p>
        <h3 class="mt-2 text-lg font-semibold tracking-tight text-slate-950">Create a partner quote</h3>
        <p class="mt-2 text-sm leading-6 text-slate-500">Start with a verified estimate, add your markup, and send a clear client-ready quote.</p>
      </div>
      <span class="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700">Partner flow</span>
    </div>

    <div class="mt-5 grid gap-4 lg:grid-cols-[1fr_0.94fr]">
      <div class="grid gap-4 md:grid-cols-2">
        <label class="space-y-1 md:col-span-2">
          <span class="text-sm font-semibold text-slate-900">Quote title</span>
          <input v-model.trim="form.title" type="text" class="input" placeholder="Business cards for client launch" >
        </label>
        <label class="space-y-1">
          <span class="text-sm font-semibold text-slate-900">Client name</span>
          <input v-model.trim="form.client_name" type="text" class="input" placeholder="Client name" >
        </label>
        <label class="space-y-1">
          <span class="text-sm font-semibold text-slate-900">Client phone</span>
          <input v-model.trim="form.client_phone" type="tel" class="input" placeholder="+254..." >
        </label>
        <label class="space-y-1">
          <span class="text-sm font-semibold text-slate-900">Client email</span>
          <input v-model.trim="form.client_email" type="email" class="input" placeholder="client@example.com" >
        </label>
        <label class="space-y-1">
          <span class="text-sm font-semibold text-slate-900">Product type</span>
          <select v-model="form.product_type" class="input">
            <option v-for="option in productOptions" :key="option.value" :value="option.value">{{ option.label }}</option>
          </select>
        </label>
        <label class="space-y-1">
          <span class="text-sm font-semibold text-slate-900">Quantity</span>
          <input v-model.number="form.quantity" type="number" min="1" class="input" >
        </label>
        <label class="space-y-1">
          <span class="text-sm font-semibold text-slate-900">Finished size</span>
          <input v-model.trim="form.finished_size" type="text" class="input" placeholder="85x55mm, A5, A4" >
        </label>
        <label class="space-y-1">
          <span class="text-sm font-semibold text-slate-900">Paper category</span>
          <input v-model.trim="form.requested_paper_category" type="text" class="input" placeholder="matt, gloss, bond" >
        </label>
        <label class="space-y-1">
          <span class="text-sm font-semibold text-slate-900">GSM</span>
          <input v-model.number="form.requested_gsm" type="number" min="80" class="input" placeholder="300" >
        </label>
        <label class="space-y-1">
          <span class="text-sm font-semibold text-slate-900">Markup</span>
          <input v-model="form.partner_markup" type="number" min="0" step="0.01" class="input" placeholder="0" >
        </label>
        <label class="space-y-1 md:col-span-2">
          <span class="text-sm font-semibold text-slate-900">Note</span>
          <textarea v-model.trim="form.note" rows="3" class="input min-h-[96px]" placeholder="Client note or quote context." />
        </label>
      </div>

      <div class="space-y-4">
        <div class="rounded-2xl border border-slate-200 bg-slate-50/80 p-4">
          <p class="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">Preview action</p>
          <p class="mt-2 text-sm leading-6 text-slate-500">Generate an estimate first, then choose the best production option and create the quote.</p>
          <div class="mt-4 flex flex-wrap gap-2">
            <button type="button" class="primary-btn" :disabled="loadingPreview" @click="previewEstimate">
              <Icon v-if="loadingPreview" name="lucide:loader-2" class="mr-2 size-4 animate-spin" />
              Preview estimate
            </button>
            <button type="button" class="secondary-btn" :disabled="!selectedMatchId || creatingQuote" @click="createQuote">
              <Icon v-if="creatingQuote" name="lucide:loader-2" class="mr-2 size-4 animate-spin" />
              Create partner quote
            </button>
          </div>
          <p v-if="error" class="mt-3 text-sm text-rose-600">{{ error }}</p>
        </div>

        <ManagedEstimateCard
          :title="previewState.title"
          :description="previewState.description"
          :range-text="previewState.rangeText"
          :route-count="previewState.routeCount"
          :confidence="previewState.confidence"
        />

        <div v-if="matches.length" class="space-y-3">
          <article
            v-for="match in matches"
            :key="match.id"
            class="rounded-2xl border p-4"
            :class="selectedMatchId === match.id ? 'border-[var(--p-primary)]/35 bg-[var(--p-primary)]/6' : 'border-slate-200 bg-white'"
          >
            <div class="flex flex-wrap items-start justify-between gap-3">
              <div>
                <VerifiedPartnerBadge />
                <p class="mt-3 text-sm font-semibold text-slate-950">{{ money(match.total, match.currency) }}</p>
                <p class="mt-1 text-sm text-slate-500">{{ match.human_ready_text || 'Exact turnaround follows artwork review.' }}</p>
              </div>
              <button type="button" class="secondary-btn" @click="selectMatch(match.id)">Choose option</button>
            </div>
          </article>
        </div>

        <div v-if="quotePreview" class="rounded-2xl border border-slate-200 bg-white p-4">
          <p class="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">Partner quote preview</p>
          <div class="mt-3 grid gap-3 md:grid-cols-2">
            <SafePriceBlock label="Production estimate" :value="money(quotePreview.production_total, 'KES')" caption="Managed production estimate shown to the partner." />
            <SafePriceBlock label="Client price" :value="money(quotePreview.client_total, 'KES')" caption="Your markup is already included in this total." />
          </div>
        </div>
      </div>
    </div>
  </article>
</template>

<script setup lang="ts">
import type { CalculatorPreviewMatch, CalculatorPreviewResponse } from '~/types/api/calculator'
import { API } from '~/shared/api-paths'
import ManagedEstimateCard from '~/components/marketing/home/ManagedEstimateCard.vue'
import SafePriceBlock from '~/components/workflow/SafePriceBlock.vue'
import VerifiedPartnerBadge from '~/components/marketing/home/VerifiedPartnerBadge.vue'
import { buildVisibilitySafePricingSnapshot } from '~/utils/pricingVisibility'

type PartnerQuotePreviewPayload = {
  production_total?: string | null
  client_total?: string | null
  partner_markup?: string | null
}

const emit = defineEmits<{
  (e: 'created'): void
}>()

const form = reactive({
  title: '',
  client_name: '',
  client_phone: '',
  client_email: '',
  note: '',
  product_type: 'business_card',
  quantity: 100,
  finished_size: '85x55mm',
  print_sides: 'DUPLEX',
  color_mode: 'COLOR',
  requested_paper_category: 'matt',
  requested_gsm: 300,
  partner_markup: '0',
})

const loadingPreview = ref(false)
const creatingQuote = ref(false)
const error = ref('')
const preview = ref<CalculatorPreviewResponse | null>(null)
const selectedMatchId = ref<number | null>(null)
const quotePreview = ref<PartnerQuotePreviewPayload | null>(null)

const productOptions = [
  { label: 'Business cards', value: 'business_card' },
  { label: 'Flyers', value: 'flyer' },
  { label: 'Letterheads', value: 'letterhead' },
  { label: 'Booklets', value: 'booklet' },
  { label: 'Large format', value: 'large_format' },
]

const matches = computed(() => preview.value?.matches?.slice(0, 3) ?? [])
const selectedMatches = computed(() => matches.value.filter(match => match.id === selectedMatchId.value))

const previewState = computed(() => {
  const min = preview.value?.min_price ? `KES ${preview.value.min_price}` : 'Pending'
  const max = preview.value?.max_price ? `KES ${preview.value.max_price}` : min
  return {
    title: preview.value ? 'Partner estimate ready' : 'Awaiting estimate',
    description: preview.value
      ? 'Choose a production option, add your markup, and create the client-facing quote.'
      : 'Run an estimate preview to see available production options.',
    rangeText: preview.value ? (preview.value.min_price === preview.value.max_price ? min : `${min} to ${max}`) : 'Run preview',
    routeCount: matches.value.length,
    confidence: matches.value.length ? 'Verified estimate' : 'Pending',
  }
})

function buildCalculatorPayload() {
  return {
    product_type: form.product_type,
    quantity: form.quantity,
    finished_size: form.finished_size || null,
    print_sides: form.print_sides,
    color_mode: form.color_mode,
    requested_paper_category: form.requested_paper_category || null,
    requested_gsm: form.requested_gsm || null,
  }
}

function isExact(match: CalculatorPreviewMatch) {
  const record = match as unknown as Record<string, unknown>
  if (record.exact_match !== undefined) return Boolean(record.exact_match)
  return Number(match.confidence_score ?? 0) >= 95
}

function getMatchedSpecs(match: CalculatorPreviewMatch) {
  return Array.isArray(match.matched_specs) ? match.matched_specs.map(String) : []
}

function getMissingSpecs(match: CalculatorPreviewMatch) {
  return Array.isArray(match.needs_confirmation) ? match.needs_confirmation.map(String) : []
}

function buildPricingSnapshot() {
  return buildVisibilitySafePricingSnapshot({
    preview: preview.value,
    selectedMatches: selectedMatches.value,
    isExact,
    getMatchedSpecs,
    getMissingSpecs,
  })
}

function money(value?: string | null, currency?: string | null) {
  if (!value) return 'Pending'
  return `${currency ?? 'KES'} ${Number(value).toLocaleString()}`
}

function selectMatch(id: number) {
  selectedMatchId.value = id
  quotePreview.value = null
  void previewPartnerQuote()
}

async function previewEstimate() {
  error.value = ''
  quotePreview.value = null
  selectedMatchId.value = null
  loadingPreview.value = true
  try {
    const { $api } = useNuxtApp()
    preview.value = await $api<CalculatorPreviewResponse>(API.calculatorPublicPreview(), {
      method: 'POST',
      body: buildCalculatorPayload(),
    })
    selectedMatchId.value = preview.value.matches?.[0]?.id ?? null
    if (selectedMatchId.value) {
      await previewPartnerQuote()
    }
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Could not build the estimate preview.'
  } finally {
    loadingPreview.value = false
  }
}

async function previewPartnerQuote() {
  if (!selectedMatchId.value || !preview.value) return
  error.value = ''
  try {
    const { $api } = useNuxtApp()
    quotePreview.value = await $api<PartnerQuotePreviewPayload>(API.partnerQuotePreview(), {
      method: 'POST',
      body: {
        shop: selectedMatchId.value,
        pricing_snapshot: buildPricingSnapshot(),
        partner_markup: form.partner_markup || '0',
      },
    })
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Could not preview partner quote.'
  }
}

async function createQuote() {
  if (!selectedMatchId.value || !preview.value) return
  error.value = ''
  creatingQuote.value = true
  try {
    const { $api } = useNuxtApp()
    await $api(API.partnerQuoteCreate(), {
      method: 'POST',
      body: {
        shop: selectedMatchId.value,
        title: form.title || undefined,
        client_name: form.client_name || undefined,
        client_phone: form.client_phone || undefined,
        client_email: form.client_email || undefined,
        note: form.note || undefined,
        calculator_inputs_snapshot: buildCalculatorPayload(),
        pricing_snapshot: buildPricingSnapshot(),
        partner_markup: form.partner_markup || '0',
      },
    })
    emit('created')
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Could not create partner quote.'
  } finally {
    creatingQuote.value = false
  }
}
</script>

<style scoped>
.input {
  width: 100%;
  border-radius: 1rem;
  border: 1px solid rgb(226 232 240);
  background: white;
  padding: 0.75rem 1rem;
  font-size: 0.875rem;
  color: rgb(15 23 42);
  outline: none;
  transition: border-color 0.15s ease, box-shadow 0.15s ease;
}

.input:focus {
  border-color: color-mix(in srgb, var(--p-primary) 65%, white);
  box-shadow: 0 0 0 4px color-mix(in srgb, var(--p-primary) 12%, transparent);
}

.primary-btn,
.secondary-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 0.9rem;
  padding: 0.65rem 1rem;
  font-size: 0.875rem;
  font-weight: 600;
  transition: background 0.15s ease, color 0.15s ease, border-color 0.15s ease;
}

.primary-btn {
  background: #101828;
  color: white;
}

.primary-btn:hover {
  background: #0f172a;
}

.secondary-btn {
  border: 1px solid rgb(226 232 240);
  background: white;
  color: rgb(15 23 42);
}

.secondary-btn:hover {
  background: rgb(248 250 252);
}
</style>
