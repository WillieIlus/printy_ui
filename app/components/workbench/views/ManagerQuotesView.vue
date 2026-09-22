<template>
  <div class="mx-auto w-full max-w-[1200px] px-4 pb-28 pt-8 sm:px-6">
    <NuxtLink
      to="/app/manager"
      class="mb-3 inline-flex items-center gap-1.5 font-mono2 text-[10px] uppercase tracking-[0.16em] text-[var(--sub)] transition-colors hover:text-[var(--accent)]"
    >
      <ArrowLeft :size="12" /> Back to the control room
    </NuxtLink>
    <div class="flex items-center gap-2 font-mono2 text-[10px] uppercase tracking-[0.22em] text-[var(--sub)]">
      <Handshake :size="12" style="color: var(--accent)" /> quote prep
    </div>
    <h1 class="mt-2 font-disp text-[30px] font-bold leading-tight tracking-tight sm:text-[36px]">
      Broker the job.<span class="block text-[var(--sub)]">Price it, mark it up, send it.</span>
    </h1>
    <p class="mt-2 max-w-[60ch] text-[13.5px] leading-relaxed text-[var(--sub)]">
      Pull production options from printer shops, apply your margin, then prepare and send the
      priced offer back to your client.
    </p>

    <div v-if="m.loading && !m.hasQuotes" class="mt-14 flex flex-col items-center gap-3 text-[var(--sub)]">
      <Loader2 :size="22" class="animate-spin" :style="{ color: 'var(--accent)' }" />
      <span class="font-mono2 text-[10px] uppercase tracking-[0.18em]">Loading your quote workload…</span>
    </div>

    <div v-else-if="m.error && !m.hasQuotes" class="mt-14 flex flex-col items-center gap-3 rounded-2xl border p-8 text-center" :style="{ borderColor: 'var(--line)', background: 'var(--panel)' }">
      <AlertTriangle :size="22" style="color: #FB4D6D" />
      <p class="max-w-[44ch] text-[13px] leading-relaxed text-[var(--sub)]">{{ m.error }}</p>
      <button class="press-key mt-1 inline-flex items-center gap-2 rounded-xl px-4 py-2 font-mono2 text-[10px] font-semibold uppercase tracking-[0.14em]" :style="{ background: 'var(--accent)', color: 'var(--accentInk)' }" @click="m.fetchQuotes()">
        <RefreshCw :size="12" /> Try again
      </button>
    </div>

    <div v-else-if="!m.hasQuotes" class="mt-14 rounded-2xl border p-8 text-center" :style="{ borderColor: 'var(--line)', background: 'var(--panel)' }">
      <Inbox :size="22" class="mx-auto" style="color: var(--accent)" />
      <p class="mt-3 text-[13px] text-[var(--sub)]">No quote requests are waiting on you right now.</p>
    </div>

    <div v-else class="mt-6 grid gap-5 lg:grid-cols-[330px_1fr]">
      <!-- ── workload list ── -->
      <aside class="space-y-2">
        <ML class="pl-1">Quote workload · {{ m.quotes.length }}</ML>
        <button
          v-for="row in m.quotes"
          :key="row.id"
          class="w-full rounded-2xl border p-3.5 text-left transition-transform hover:-translate-y-0.5"
          :style="{ borderColor: m.activeQuote?.id === row.id ? 'var(--accent)' : 'var(--line)', background: 'var(--panel)' }"
          @click="select(row)"
        >
          <div class="flex items-center justify-between gap-2">
            <span class="font-mono2 text-[10px] tracking-[0.12em] text-[var(--accent)]">{{ row.quote_request_reference || row.reference }}</span>
            <span class="rounded-full px-2 py-[1px] font-mono2 text-[9px] uppercase tracking-[0.1em]" :style="statusStyle(row.raw_status)">{{ row.status_label || row.raw_status }}</span>
          </div>
          <div class="mt-1.5 truncate font-disp text-[14px] font-bold tracking-tight">{{ row.product || 'Print job' }}</div>
          <div class="mt-1 truncate text-[11.5px] text-[var(--sub)]">{{ row.customer_name || 'Client' }}<span v-if="row.shop_name"> · {{ row.shop_name }}</span></div>
        </button>
      </aside>

      <!-- ── detail ── -->
      <section class="min-w-0">
        <div v-if="!m.activeQuote" class="rounded-2xl border p-8 text-center text-[13px] text-[var(--sub)]" :style="{ borderColor: 'var(--line)', background: 'var(--panel)' }">
          Pick a request to prepare its quote.
        </div>

        <div v-else class="space-y-4">
          <div class="rounded-2xl border p-4" :style="{ borderColor: 'var(--line)', background: 'var(--panel)' }">
            <div class="flex flex-wrap items-center gap-3">
              <div class="min-w-0 flex-1">
                <div class="font-disp text-[18px] font-bold tracking-tight">{{ m.activeQuote.product || 'Print job' }}</div>
                <div class="mt-0.5 text-[12px] text-[var(--sub)]">
                  {{ m.activeQuote.customer_name || 'Client' }} · {{ m.activeQuote.quote_request_reference || m.activeQuote.reference }}
                  <span v-if="m.activeQuote.assigned_manager_name"> · manager {{ m.activeQuote.assigned_manager_name }}</span>
                </div>
              </div>
              <span class="rounded-full px-2.5 py-1 font-mono2 text-[9.5px] uppercase tracking-[0.1em]" :style="statusStyle(m.activeQuote.raw_status)">{{ m.activeQuote.status_label || m.activeQuote.raw_status }}</span>
            </div>
            <div v-if="prefillRows.length" class="mt-3 grid grid-cols-2 gap-x-4 gap-y-1.5 sm:grid-cols-3">
              <div v-for="p in prefillRows" :key="p.label">
                <div class="font-mono2 text-[8.5px] uppercase tracking-[0.12em] text-[var(--sub)]">{{ p.label }}</div>
                <div class="truncate text-[12.5px] text-[var(--ink)]">{{ p.value }}</div>
              </div>
            </div>
            <p v-if="m.prefill?.client_notes" class="mt-3 rounded-xl px-3 py-2 text-[12px] leading-relaxed text-[var(--sub)]" :style="{ background: 'var(--panel2)' }">
              “{{ m.prefill.client_notes }}”
            </p>
          </div>

          <!-- production options -->
          <div class="rounded-2xl border p-4" :style="{ borderColor: 'var(--line)', background: 'var(--panel)' }">
            <div class="flex flex-wrap items-center justify-between gap-2">
              <ML>Production options</ML>
              <button class="press-key inline-flex items-center gap-1.5 rounded-lg px-3 py-2 font-mono2 text-[9.5px] font-bold uppercase tracking-[0.12em] disabled:opacity-50" :style="{ background: 'var(--accent)', color: 'var(--accentInk)' }" :disabled="m.saving" @click="loadOptions">
                <Loader2 v-if="m.saving" :size="12" class="animate-spin" /> <Search v-else :size="12" /> Find printer shops
              </button>
            </div>

            <div v-if="m.shopOptions?.missing_fields?.length" class="mt-3 rounded-xl px-3 py-2 text-[11.5px]" :style="{ background: 'rgba(245,166,35,.1)', color: '#F5A623' }">
              Request is missing: {{ m.shopOptions.missing_fields.map((f) => SPEC_MISSING_LABELS[f] ?? f.replace(/[_-]/g, ' ')).join(', ') }}
            </div>

            <div v-if="shops.length" class="mt-3 space-y-2">
              <div
                v-for="s in shops"
                :key="String(s.shop_id ?? s.id)"
                class="overflow-hidden rounded-xl border"
                :style="{ borderColor: selectedShopId === (s.shop_id ?? s.id) ? 'var(--accent)' : 'var(--line)', background: 'var(--panel2)' }"
              >
                <button
                  type="button"
                  class="flex w-full flex-wrap items-center gap-3 px-3 py-2.5 text-left disabled:cursor-not-allowed disabled:opacity-60"
                  :disabled="s.eligible === false"
                  @click="chooseShop(s)"
                >
                  <span class="flex h-4 w-4 shrink-0 items-center justify-center rounded-full" :style="selectedShopId === (s.shop_id ?? s.id) ? { background: 'var(--accent)' } : { boxShadow: 'inset 0 0 0 1.5px var(--line)' }">
                    <Check v-if="selectedShopId === (s.shop_id ?? s.id)" :size="10" stroke-width="4" class="text-[var(--accentInk)]" />
                  </span>
                  <div class="min-w-0 flex-1">
                    <div class="truncate text-[13px] font-semibold">{{ s.name }}</div>
                    <div class="truncate text-[11px] text-[var(--sub)]">{{ s.location || '—' }}<span v-if="s.eligible === false"> · {{ s.ineligible_reason || 'unavailable' }}</span></div>
                  </div>
                  <span class="font-mono2 text-[12.5px] font-semibold" :style="{ color: s.eligible === false ? 'var(--sub)' : 'var(--accent)' }">
                    {{ s.production_cost || '—' }}
                  </span>
                </button>

                <div v-if="s.eligible === false" class="border-t px-3 py-2.5" :style="{ borderColor: 'var(--line)', background: 'rgba(245,166,35,.06)' }">
                  <div class="flex items-center gap-1.5">
                    <Info :size="12" style="color: #F5A623" />
                    <span class="font-mono2 text-[9px] font-semibold uppercase tracking-[0.12em]" style="color: #F5A623">Needs setup to price this</span>
                  </div>
                  <ul v-if="(s.missing_requirements ?? []).length" class="mt-1.5 space-y-1">
                    <li v-for="r in s.missing_requirements" :key="r" class="flex items-start gap-1.5 text-[11px] leading-snug text-[var(--sub)]">
                      <span class="mt-[5px] h-1 w-1 shrink-0 rounded-full" style="background: #F5A623" />
                      <span>{{ requirementLabel(r) }}</span>
                    </li>
                  </ul>
                  <p v-if="s.ineligible_reason || s.reason || s.explanation" class="mt-1.5 text-[11px] leading-snug text-[var(--sub)]">
                    {{ s.ineligible_reason || s.reason || s.explanation }}
                  </p>
                  <div class="mt-2 flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      class="press-key inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 font-mono2 text-[9px] font-bold uppercase tracking-[0.12em]"
                      :style="{ background: 'var(--panel)', color: 'var(--ink)' }"
                      @click="copyRequest(s)"
                    >
                      <Check v-if="copiedShop === (s.shop_id ?? s.id)" :size="11" style="color: #2FBF71" />
                      <Copy v-else :size="11" />
                      {{ copiedShop === (s.shop_id ?? s.id) ? 'Copied' : 'Copy exact request' }}
                    </button>
                    <a
                      v-if="waLink(s)"
                      :href="waLink(s)"
                      target="_blank"
                      rel="noopener"
                      class="press-key inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 font-mono2 text-[9px] font-bold uppercase tracking-[0.12em]"
                      :style="{ background: 'rgba(47,191,113,.14)', color: '#2FBF71' }"
                    >
                      <MessageCircle :size="11" /> Nudge on WhatsApp
                    </a>
                  </div>
                </div>
              </div>
            </div>
            <p v-else class="mt-3 text-[12px] text-[var(--sub)]">Run the search to see which shops can produce this job.</p>
          </div>

          <!-- margin -->
          <div class="rounded-2xl border p-4" :style="{ borderColor: 'var(--line)', background: 'var(--panel)' }">
            <ML>Your margin</ML>
            <div class="mt-3 flex flex-wrap items-end gap-3">
              <label class="block">
                <span class="font-mono2 text-[9px] uppercase tracking-[0.12em] text-[var(--sub)]">Markup %</span>
                <input v-model="markupPct" type="number" min="0" class="mt-1 w-[110px] rounded-xl border px-3 py-2 text-[13px]" :style="fieldStyle" />
              </label>
              <button class="press-key inline-flex items-center gap-1.5 rounded-xl px-4 py-2.5 font-mono2 text-[9.5px] font-bold uppercase tracking-[0.12em] disabled:opacity-50" :style="{ background: 'var(--accent)', color: 'var(--accentInk)' }" :disabled="m.saving || !selectedShopId" @click="calculate">
                <Loader2 v-if="m.saving" :size="12" class="animate-spin" /> <Calculator v-else :size="12" /> Calculate
              </button>
            </div>

            <div v-if="m.pricingPreview?.breakdown" class="mt-4 grid grid-cols-2 gap-x-4 gap-y-2 sm:grid-cols-3">
              <div v-for="b in breakdownRows" :key="b.label">
                <div class="font-mono2 text-[8.5px] uppercase tracking-[0.12em] text-[var(--sub)]">{{ b.label }}</div>
                <div class="text-[14px] font-semibold" :style="{ color: b.strong ? 'var(--accent)' : 'var(--ink)' }">{{ b.value }}</div>
              </div>
            </div>
          </div>

          <p v-if="actionError" class="rounded-xl border px-4 py-3 text-[12.5px]" :style="{ borderColor: 'rgba(251,77,109,.4)', background: 'rgba(251,77,109,.08)', color: '#FB4D6D' }">{{ actionError }}</p>
          <p v-if="actionNote" class="flex items-center gap-2 rounded-xl border px-4 py-3 text-[12.5px]" :style="{ borderColor: 'rgba(47,191,113,.4)', background: 'rgba(47,191,113,.08)', color: '#2FBF71' }">
            <Check :size="13" /> {{ actionNote }}
          </p>

          <div class="flex flex-wrap gap-2">
            <button class="press-key inline-flex items-center gap-2 rounded-xl px-5 py-3 font-mono2 text-[10.5px] font-bold uppercase tracking-[0.14em] disabled:opacity-50" :style="{ background: 'var(--accent)', color: 'var(--accentInk)' }" :disabled="m.saving || !canPrepare" @click="prepare">
              <Loader2 v-if="m.saving" :size="13" class="animate-spin" /> <FileCheck v-else :size="13" /> Prepare quote
            </button>
            <button class="press-key inline-flex items-center gap-2 rounded-xl border px-5 py-3 font-mono2 text-[10.5px] font-bold uppercase tracking-[0.14em] disabled:opacity-50" :style="{ borderColor: 'var(--accent)', color: 'var(--accent)' }" :disabled="m.saving || !prepared" @click="send">
              <Loader2 v-if="m.saving" :size="13" class="animate-spin" /> <Send v-else :size="13" /> Send to client
            </button>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { AlertTriangle, ArrowLeft, Calculator, Check, Copy, FileCheck, Handshake, Inbox, Info, Loader2, MessageCircle, RefreshCw, Search, Send } from 'lucide-vue-next'
import { useManagerStore } from '~/stores/manager'
import type { ManagerPricingShop, ManagerQuoteRow } from '~/shared/types'

const m = useManagerStore()

const markupPct = ref('75')
const selectedShopId = ref<number | null>(null)
const actionError = ref('')
const actionNote = ref('')
const prepared = ref(false)

const fieldStyle = { borderColor: 'var(--line)', background: 'var(--panel2)', color: 'var(--ink)' }

const shops = computed<ManagerPricingShop[]>(() => m.pricingPreview?.eligible_shops ?? m.shopOptions?.results ?? [])

const prefillRows = computed(() => {
  const p = m.prefill
  if (!p) return []
  const size = p.size as Record<string, unknown>
  const rows: Array<{ label: string; value: string }> = []
  if (p.quantity) rows.push({ label: 'Quantity', value: String(p.quantity) })
  const sizeLabel = size.label || (size.width_mm && size.height_mm ? `${size.width_mm}×${size.height_mm}mm` : '')
  if (sizeLabel) rows.push({ label: 'Size', value: String(sizeLabel) })
  if (p.paper?.gsm) rows.push({ label: 'Paper', value: `${p.paper.gsm}gsm ${p.paper.type || ''}`.trim() })
  if (p.print?.sides) rows.push({ label: 'Sides', value: p.print.sides })
  if (p.print?.color_mode) rows.push({ label: 'Colour', value: p.print.color_mode })
  if (p.turnaround) rows.push({ label: 'Turnaround', value: p.turnaround })
  if (p.finishing?.length) rows.push({ label: 'Finishing', value: p.finishing.map((f) => f.type).join(', ') })
  return rows
})

const breakdownRows = computed(() => {
  const b = m.pricingPreview?.breakdown
  if (!b) return []
  return [
    { label: 'Production cost', value: b.production_cost ?? '—', strong: false },
    { label: 'Your markup', value: b.markup_amount ?? '—', strong: false },
    { label: 'Platform fee', value: b.platform_fee ?? '—', strong: false },
    { label: 'Client price', value: b.broker_client_price ?? '—', strong: true },
    { label: 'Client total', value: b.client_total ?? '—', strong: true },
  ]
})

const canPrepare = computed(() => Boolean(selectedShopId.value && m.shopOptions?.pricing_snapshot && m.pricingPreview?.breakdown))

const SPEC_MISSING_LABELS: Record<string, string> = {
  quantity: 'Quantity',
  finished_size: 'Finished size',
  width_mm: 'Custom width',
  height_mm: 'Custom height',
  paper_stock: 'Paper stock',
  requested_gsm: 'Requested gsm',
  requested_paper_category: 'Paper type',
  cover_stock: 'Cover stock',
  insert_stock: 'Insert stock',
  print_sides: 'Print sides',
  color_mode: 'Colour mode',
  total_pages: 'Total pages',
  material_type: 'Material',
  finishing: 'Finishing',
  product_type: 'Product type',
}

const REQUIREMENT_LABELS: Record<string, string> = {
  finishing: 'A finishing rate (lamination / cutting / binding)',
  cutting: 'A cutting finishing rate',
  lamination: 'A lamination finishing rate',
  paper: 'An active paper stock for this request',
  machine: 'A machine that fits this paper',
  pricing: 'An active printing price for this sheet',
  coating: 'A coating rate',
  binding: 'A binding rate',
  stitching: 'A stitching / booklet rate',
  delivery: 'A delivery rate',
}

function requirementLabel(key: string) {
  return REQUIREMENT_LABELS[key] ?? key.replace(/[_-]/g, ' ')
}

const copiedShop = ref<number | null>(null)

function gapSummary(s: ManagerPricingShop) {
  const reqs = (s.missing_requirements ?? []).map(requirementLabel)
  const reason = s.ineligible_reason || s.reason || s.explanation
  const parts = [reqs.length ? reqs.join(', ') : null, reason || null].filter(Boolean)
  return parts.join(' — ')
}

function nudgeMessage(s: ManagerPricingShop) {
  const ref = m.activeQuote?.quote_request_reference || m.activeQuote?.reference || ''
  const lines = [`Printy production request${ref ? ` ${ref}` : ''}`]
  for (const row of prefillRows.value) {
    lines.push(`${row.label}: ${row.value}`)
  }
  lines.push('')
  lines.push(`To quote this job, please add: ${gapSummary(s)}.`)
  return lines.join('\n')
}

async function copyRequest(s: ManagerPricingShop) {
  const text = nudgeMessage(s)
  try {
    await navigator.clipboard.writeText(text)
  } catch {
    const ta = document.createElement('textarea')
    ta.value = text
    document.body.appendChild(ta)
    ta.select()
    document.execCommand('copy')
    document.body.removeChild(ta)
  }
  copiedShop.value = (s.shop_id ?? s.id) as number
}

function waLink(s: ManagerPricingShop) {
  if (!s.shop_contact) return ''
  let digits = s.shop_contact.replace(/\D/g, '')
  if (!digits) return ''
  if (digits.startsWith('0')) digits = `254${digits.slice(1)}`
  if (!digits.startsWith('254')) digits = `254${digits}`
  return `https://wa.me/${digits}?text=${encodeURIComponent(nudgeMessage(s))}`
}

function statusStyle(raw: string) {
  const s = (raw || '').toLowerCase()
  if (s.includes('sent')) return { background: 'rgba(47,191,113,.14)', color: '#2FBF71' }
  if (s.includes('reject') || s.includes('declin')) return { background: 'rgba(251,77,109,.14)', color: '#FB4D6D' }
  if (s.includes('accept') || s.includes('complete') || s.includes('paid')) return { background: 'rgba(47,191,113,.18)', color: '#2FBF71' }
  return { background: 'var(--panel2)', color: 'var(--sub)' }
}

function specsBody() {
  const p = m.prefill
  const size = (p?.size ?? {}) as Record<string, unknown>
  return {
    quantity: p?.quantity,
    requested_gsm: p?.paper?.gsm ?? undefined,
    requested_paper_category: p?.paper?.type || undefined,
    print_sides: p?.print?.sides || undefined,
    color_mode: p?.print?.color_mode || undefined,
    width_mm: (size.width_mm as number) || undefined,
    height_mm: (size.height_mm as number) || undefined,
    finished_size: (size.label as string) || undefined,
  }
}

async function select(row: ManagerQuoteRow) {
  actionError.value = ''
  actionNote.value = ''
  prepared.value = false
  selectedShopId.value = null
  m.activeQuote = row
  m.shopOptions = null
  m.pricingPreview = null
  await Promise.all([m.fetchQuote(row.id), m.fetchPrefill(row.id)])
}

async function loadOptions() {
  if (!m.activeQuote) return
  actionError.value = ''
  actionNote.value = ''
  prepared.value = false
  const result = await m.fetchShopOptions(m.activeQuote.id, specsBody())
  if (!result) actionError.value = m.error
  else {
    const priced = result.results?.find((s) => s.eligible !== false)
    if (priced) selectedShopId.value = priced.shop_id
  }
}

async function chooseShop(shop: ManagerPricingShop) {
  selectedShopId.value = (shop.shop_id ?? shop.id) as number
  await calculate()
}

async function calculate() {
  if (!m.activeQuote || !selectedShopId.value) return
  actionError.value = ''
  prepared.value = false
  const result = await m.previewPricing(m.activeQuote.id, {
    specs: specsBody(),
    shop_id: selectedShopId.value,
    markup_pct: markupPct.value,
  })
  if (!result) actionError.value = m.error
}

async function prepare() {
  if (!m.activeQuote || !selectedShopId.value || !m.shopOptions?.pricing_snapshot) return
  actionError.value = ''
  const result = await m.prepare(m.activeQuote.id, {
    shop: selectedShopId.value,
    pricing_snapshot: m.shopOptions.pricing_snapshot,
    partner_markup: markupPct.value,
  })
  if (!result) actionError.value = m.error
  else {
    prepared.value = true
    actionNote.value = 'Quote prepared — you can send it to the client now.'
  }
}

async function send() {
  if (!m.activeQuote) return
  actionError.value = ''
  const result = await m.sendToClient(m.activeQuote.id)
  if (!result) actionError.value = m.error
  else actionNote.value = result.offline_client ? 'Sent — an offline claim link was created for the client.' : 'Quote sent to the client.'
}

onMounted(async () => {
  await m.fetchQuotes()
  await m.fetchProfile()
  if (m.profile?.default_markup_rate) markupPct.value = String(m.profile.default_markup_rate)
})
</script>
