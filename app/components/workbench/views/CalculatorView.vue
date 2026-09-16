<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import {
  AlertCircle, BookOpen, CheckCheck, CreditCard, FileText, Flag, Gauge, Info, Layers, Minus,
  PencilRuler, Plus, RotateCcw, Scissors, ShieldCheck, Sparkles, Sticker, Truck,
  Wallet, Zap,
} from 'lucide-vue-next'
import type { Component } from 'vue'
import {
  DELIVERY_OPTS, DESIGN_OPTS, MATERIALS, PRODUCTS, RUSH_OPTS, BROKERS,
  calculate, defaultInput, finishingFor, papersFor, getProduct, ksh, ksh2,
  type CalcInput,
} from '~/shared/workflow/pricing'
import { getApiErrorMessage } from '~/shared/api'
import { useCalculatorStore } from '~/stores/calculator'
import Chip from '../calculator/Chip.vue'
import Step from '../calculator/Step.vue'
import Row from '../calculator/Row.vue'
import ImpositionDiagram from '../calculator/ImpositionDiagram.vue'
import PriceRail from '../calculator/PriceRail.vue'

const props = withDefaults(defineProps<{
  locked?: boolean
  embedded?: boolean
  authed?: boolean
}>(), {
  locked: false,
  embedded: false,
  authed: false,
})

const emit = defineEmits<{
  'quote-created': [ref: string, total: number]
  unlock: []
}>()

const ICONS: Record<string, Component> = {
  card: CreditCard, flyer: FileText, fold: Layers, book: BookOpen,
  sticker: Sticker, doc: FileText, banner: Flag,
}

const calcStore = useCalculatorStore()

const input = ref<CalcInput>(calcStore.restore() ?? defaultInput('business-cards'))
const open = ref(false)
const sent = ref<{ ref: string; total: number } | null>(null)
const mobileOpen = ref(false)

watch(
  input,
  (v) => {
    if (!sent.value) {
      calcStore.persist(v)
    }
  },
  { deep: true },
)

const product = computed(() => getProduct(input.value.productId)!)
const q = computed(() => calculate(input.value))

const money = (n: number) => (props.locked ? 'KSh ———' : ksh(n))
const perUnit = (n: number) => (props.locked ? '——' : ksh2(n))

function setState(patch: Partial<CalcInput>) {
  input.value = { ...input.value, ...patch }
}
function pickProduct(id: string) {
  input.value = defaultInput(id)
}
function toggleFin(id: string) {
  const has = input.value.finishingIds.includes(id)
  setState({ finishingIds: has ? input.value.finishingIds.filter((f) => f !== id) : [...input.value.finishingIds, id] })
}

const saving = ref(false)
const submitErr = ref('')

/**
 * Unlock path (public homepage): persist the visitor's spec as a server-side
 * guest draft (best-effort) before sending them to sign-up, so the draft can
 * be claimed against the new account. Local state is kept either way.
 */
async function handleUnlock() {
  if (saving.value) return
  saving.value = true
  try {
    await calcStore.saveGuestDraft(input.value, q.value)
  } catch {
    /* keep the local spec — sign-up re-syncs via the shared session key */
  } finally {
    saving.value = false
  }
  emit('unlock')
}

async function submit() {
  if (saving.value) return
  submitErr.value = ''
  if (props.locked) {
    await handleUnlock()
    return
  }
  saving.value = true
  try {
    if (props.authed) {
      const { draft, quoteRequests } = await calcStore.createAndSendDraft(input.value, q.value)
      const ref = quoteRequests[0]?.request_reference ?? draft.draft_reference
      sent.value = { ref, total: q.value.total }
    } else {
      const draft = await calcStore.saveGuestDraft(input.value, q.value)
      sent.value = { ref: draft.draft_reference, total: q.value.total }
    }
    calcStore.clear()
    emit('quote-created', sent.value.ref, sent.value.total)
  } catch (e) {
    submitErr.value = getApiErrorMessage(e, "We couldn't save your quote. Your spec is still safe on this device — please try again.")
  } finally {
    saving.value = false
  }
}

const size = computed(() => product.value.sizes.find((s) => s.id === input.value.sizeId) ?? product.value.sizes[0]!)
const isLF = computed(() => product.value.category === 'large_format')
const papers = computed(() => (isLF.value ? MATERIALS : papersFor(product.value.category)))
const fins = computed(() => finishingFor(product.value.category))
const customPanelActive = computed(() => Boolean(input.value.customW))

const TRUST: Array<[Component, string, string]> = [
  [Wallet, 'Pay by M-Pesa', 'Funds sit in custody until you confirm delivery'],
  [Scissors, 'Spoilage included', '2 set-up sheets + 10% — no surprise invoices'],
  [Info, 'Price is the price', `Capped by Printy's fair-price guard`],
]

function sheetAreaText(w: number, h: number) {
  return ((w / 1000) * (h / 1000)).toFixed(2)
}
function brokerTotal(brokerId: string) {
  return calculate({ ...input.value, brokerId }, false)
}
</script>

<template>
  <div v-if="sent" class="mx-auto w-full max-w-[620px] px-4 pb-24 pt-14">
    <div class="overflow-hidden rounded-3xl border text-center" style="border-color: var(--line); background: var(--panel)">
      <div class="p-8">
        <div class="calc-pop-in mx-auto flex h-14 w-14 items-center justify-center rounded-full" style="background: color-mix(in srgb, var(--accent) 14%, transparent)">
          <CheckCheck :size="26" style="color: var(--accent)" />
        </div>
        <h2 class="mt-4 font-disp text-[26px] font-bold tracking-tight">Quote request sent</h2>
        <p class="mx-auto mt-2 max-w-[40ch] text-[13.5px] leading-relaxed text-[var(--sub)]">
          Reference <span class="font-mono2 font-semibold text-[var(--ink)]">{{ sent.ref }}</span> — your verified printing manager confirmed it against your exact sheet count, then your job enters the workflow at <span class="font-semibold text-[var(--ink)]">Quote</span>.
        </p>
        <div class="mt-5 inline-flex items-baseline gap-2 rounded-2xl px-5 py-3" style="background: var(--panel2)">
          <span class="font-mono2 text-[10px] uppercase tracking-[0.14em] text-[var(--sub)]">Indicative</span>
          <span class="font-disp text-[24px] font-bold" style="color: var(--accent)">{{ ksh(sent.total) }}</span>
        </div>
        <div class="mt-6 grid gap-2 text-left sm:grid-cols-3">
<div v-for="([k, v], i) in [['Now', 'Your printing manager confirms the spec'], ['Next', 'You approve artwork'], ['Then', 'Pay via M-Pesa into custody']]" :key="k" class="calc-fade-up rounded-xl p-3" :style="{ animationDelay: `${0.2 + i * 0.1}s` }" style="background: var(--panel2)">
            <div class="font-mono2 text-[9px] uppercase tracking-[0.16em] text-[var(--sub)]">{{ k }}</div>
            <div class="mt-0.5 text-[12px] font-semibold">{{ v }}</div>
          </div>
        </div>
        <button
          type="button"
          class="press-key mt-6 inline-flex items-center gap-2 rounded-xl border px-5 py-2.5 font-mono2 text-[11px] font-semibold uppercase tracking-[0.14em]"
          style="border-color: var(--line)"
          @click="sent = null; input = defaultInput(product.id)"
        >
          <RotateCcw :size="13" /> Price another job
        </button>
      </div>
    </div>
  </div>

  <div v-else class="mx-auto w-full max-w-[1180px] px-4 pb-40 pt-8 lg:pb-24">
    <div v-if="submitErr" class="mb-6 flex items-start gap-2.5 rounded-2xl border px-4 py-3 text-[12.5px]" style="border-color: rgba(251,77,109,.4); background: rgba(251,77,109,.08); color: #B4243F">
      <AlertCircle :size="15" class="mt-0.5 shrink-0" />
      <p>{{ submitErr }}</p>
    </div>

    <div v-if="!embedded" class="calc-fade-up max-w-[46ch]">
      <div class="flex items-center gap-2 font-mono2 text-[10px] uppercase tracking-[0.22em] text-[var(--sub)]">
        <Sparkles :size="11" style="color: var(--accent)" /> instant quote · no signup
      </div>
      <h1 class="mt-2 font-disp text-[34px] font-bold leading-[1.05] tracking-tight sm:text-[42px]">
        Know the exact price
        <span class="block text-[var(--sub)]">before you commit.</span>
      </h1>
      <p class="mt-3 text-[14px] leading-relaxed text-[var(--sub)]">
        Real sheet counts, real press rates, real spoilage — the same engine your print manager uses. Change anything and watch the number move.
      </p>
    </div>

    <div :class="['grid gap-8 lg:grid-cols-[1fr_370px]', embedded ? '' : 'mt-8']">
      <div class="space-y-7">
        <Step n="01" title="What are you printing?" :value="product.name">
          <div class="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
            <button
              v-for="p in PRODUCTS"
              :key="p.id"
              type="button"
              class="press-key flex flex-col items-start gap-2 rounded-2xl border p-3.5 text-left transition-colors"
              :style="{
                borderColor: p.id === input.productId ? 'var(--accent)' : 'var(--line)',
                background: p.id === input.productId ? 'color-mix(in srgb, var(--accent) 8%, transparent)' : 'var(--panel)',
              }"
              @click="pickProduct(p.id)"
            >
              <component :is="ICONS[p.icon] ?? FileText" :size="19" :style="{ color: p.id === input.productId ? 'var(--accent)' : 'var(--sub)' }" />
              <div>
                <div class="font-disp text-[13px] font-bold leading-tight">{{ p.name }}</div>
                <div class="mt-0.5 text-[10.5px] leading-snug text-[var(--sub)]">{{ p.blurb }}</div>
              </div>
            </button>
          </div>
        </Step>

        <Step n="02" title="Size" :hint="isLF ? 'Finished banner size — we price by square metre.' : 'Finished trim size. We add 3mm bleed automatically.'" :value="`${size.label} · ${size.w}×${size.h}mm`">
          <div class="flex flex-wrap gap-2">
            <Chip v-for="s in product.sizes" :key="s.id" :active="s.id === input.sizeId && !customPanelActive" :sub="`${s.w}×${s.h}mm${s.note ? ' · ' + s.note : ''}`" @click="setState({ sizeId: s.id, customW: undefined, customH: undefined })">
              {{ s.label }}
            </Chip>
            <div class="flex items-center gap-1.5 rounded-xl border px-3 py-2" :style="{ borderColor: customPanelActive ? 'var(--accent)' : 'var(--line)', background: 'var(--panel)' }">
              <span class="font-mono2 text-[9px] uppercase tracking-[0.12em] text-[var(--sub)]">custom</span>
              <input
                type="number"
                :placeholder="String(size.w)"
                :value="input.customW ?? ''"
                class="w-14 bg-transparent font-mono2 text-[12px] outline-none"
                @input="setState({ customW: ($event.target as HTMLInputElement).value ? +($event.target as HTMLInputElement).value : undefined })"
              />
              <span class="text-[var(--sub)]">×</span>
              <input
                type="number"
                :placeholder="String(size.h)"
                :value="input.customH ?? ''"
                class="w-14 bg-transparent font-mono2 text-[12px] outline-none"
                @input="setState({ customH: ($event.target as HTMLInputElement).value ? +($event.target as HTMLInputElement).value : undefined })"
              />
              <span class="font-mono2 text-[9px] text-[var(--sub)]">mm</span>
            </div>
          </div>
        </Step>

        <Step n="03" title="How many?" hint="Unit price drops fast — the press set-up is the same whether you print 100 or 10,000." :value="`${input.quantity.toLocaleString()} pcs`">
          <div class="flex flex-wrap gap-2">
            <Chip v-for="qn in product.qtyLadder" :key="qn" :active="input.quantity === qn" @click="setState({ quantity: qn })">
              {{ qn.toLocaleString() }}
            </Chip>
          </div>
          <div class="mt-3 flex items-center gap-3">
            <button type="button" class="press-key rounded-lg border p-2" style="border-color: var(--line)" @click="setState({ quantity: Math.max(1, input.quantity - (product.qtyLadder[0] || 50)) })"><Minus :size="13" /></button>
            <input
              type="number"
              :value="input.quantity"
              class="w-28 rounded-lg border bg-[var(--panel)] px-3 py-2 text-center font-mono2 text-[14px] font-semibold outline-none"
              style="border-color: var(--line)"
              @input="setState({ quantity: Math.max(1, +($event.target as HTMLInputElement).value || 1) })"
            />
            <button type="button" class="press-key rounded-lg border p-2" style="border-color: var(--line)" @click="setState({ quantity: input.quantity + (product.qtyLadder[0] || 50) })"><Plus :size="13" /></button>
            <span class="font-mono2 text-[10px] uppercase tracking-[0.12em] text-[var(--sub)]">{{ perUnit(q.unitPrice) }} each</span>
          </div>
        </Step>

        <Step v-if="product.category === 'booklet'" n="04" title="How many pages?" hint="Pages are rounded up to the nearest 4 — that's how sheets fold." :value="`${input.pages}pp`">
          <div class="flex flex-wrap gap-2">
            <Chip v-for="p in [8, 16, 24, 32, 48, 64, 96, 128]" :key="p" :active="input.pages === p" @click="setState({ pages: p })">{{ p }}pp</Chip>
          </div>
        </Step>

        <Step :n="product.category === 'booklet' ? '05' : '04'" :title="isLF ? 'Material' : 'Paper stock'" :value="papers.find((p) => p.id === input.paperId)?.name">
          <div class="grid gap-2 sm:grid-cols-2">
            <button
              v-for="(p, idx) in papers as any[]"
              :key="p.id"
              type="button"
              class="press-key flex items-center gap-3 rounded-xl border p-3 text-left transition-colors"
              :style="{
                borderColor: p.id === input.paperId ? 'var(--accent)' : 'var(--line)',
                background: p.id === input.paperId ? 'color-mix(in srgb, var(--accent) 8%, transparent)' : 'var(--panel)',
              }"
              @click="setState({ paperId: p.id })"
            >
              <div class="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg font-mono2 text-[9px] font-bold" :style="{ background: 'var(--panel2)', color: p.id === input.paperId ? 'var(--accent)' : 'var(--sub)' }">
                {{ (p as any).gsm ?? 'm²' }}
              </div>
              <div class="min-w-0">
                <div class="truncate font-disp text-[13px] font-semibold">{{ p.name }}{{ (p as any).gsm ? ` ${(p as any).gsm}gsm` : '' }}</div>
                <div class="truncate text-[10.5px] text-[var(--sub)]">{{ p.tag }}</div>
              </div>
            </button>
          </div>
        </Step>

        <Step v-if="!isLF" :n="product.category === 'booklet' ? '06' : '05'" title="Ink & sides" :value="`${input.colorMode === 'COLOR' ? 'Full colour' : 'Black only'} · ${input.sides === 'DUPLEX' ? 'both sides' : 'one side'}`">
          <div class="grid gap-3 sm:grid-cols-2">
            <div class="flex gap-2">
              <Chip :active="input.colorMode === 'COLOR'" sub="CMYK" @click="setState({ colorMode: 'COLOR' })">Full colour</Chip>
              <Chip :active="input.colorMode === 'BW'" sub="cheapest" @click="setState({ colorMode: 'BW' })">Black only</Chip>
            </div>
            <div class="flex gap-2">
              <Chip :active="input.sides === 'SIMPLEX'" sub="front only" @click="setState({ sides: 'SIMPLEX' })">1 side</Chip>
              <Chip :active="input.sides === 'DUPLEX'" sub="front & back" @click="setState({ sides: 'DUPLEX' })">2 sides</Chip>
            </div>
          </div>
        </Step>

        <Step :n="product.category === 'booklet' ? '07' : isLF ? '05' : '06'" title="Finishing" hint="Each extra adds a one-off set-up fee plus a per-sheet or per-piece rate." :value="input.finishingIds.length ? `${input.finishingIds.length} selected` : 'none'">
          <div class="grid gap-2 sm:grid-cols-2">
            <button
              v-for="f in fins"
              :key="f.id"
              type="button"
              class="press-key flex items-start gap-2.5 rounded-xl border p-3 text-left transition-colors"
              :style="{
                borderColor: input.finishingIds.includes(f.id) ? 'var(--accent)' : 'var(--line)',
                background: input.finishingIds.includes(f.id) ? 'color-mix(in srgb, var(--accent) 8%, transparent)' : 'var(--panel)',
              }"
              @click="toggleFin(f.id)"
            >
              <div
                class="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded"
                :style="{
                  background: input.finishingIds.includes(f.id) ? 'var(--accent)' : 'transparent',
                  boxShadow: input.finishingIds.includes(f.id) ? 'none' : 'inset 0 0 0 1.5px var(--line)',
                }"
              >
                <CheckCheck v-if="input.finishingIds.includes(f.id)" :size="10" class="text-white" />
              </div>
              <div class="min-w-0">
                <div class="font-disp text-[12.5px] font-semibold leading-tight">{{ f.name }}</div>
                <div class="mt-0.5 text-[10.5px] leading-snug text-[var(--sub)]">{{ f.note }}</div>
<div class="mt-1 font-mono2 text-[9px] uppercase tracking-[0.1em] text-[var(--sub)]">
  {{ perUnit(f.price) }} {{ f.basis.replace(/_/g, ' ') }}{{ f.setup_fee ? ` · ${money(f.setup_fee)} set-up` : '' }}
</div>
              </div>
            </button>
          </div>
        </Step>

        <Step :n="product.category === 'booklet' ? '08' : isLF ? '06' : '07'" title="Artwork, speed & delivery" :value="`${DESIGN_OPTS.find((d) => d.id === input.designId)?.label} · ${RUSH_OPTS.find((r) => r.id === input.rushId)?.label}`">
          <div class="space-y-4">
            <div v-for="group in [
              { icon: PencilRuler, label: 'Artwork', opts: DESIGN_OPTS, key: 'designId', val: input.designId },
              { icon: Zap, label: 'Turnaround', opts: RUSH_OPTS, key: 'rushId', val: input.rushId },
              { icon: Truck, label: 'Delivery', opts: DELIVERY_OPTS, key: 'deliveryId', val: input.deliveryId },
            ]" :key="group.label">
              <div class="flex items-center gap-1.5 font-mono2 text-[9.5px] uppercase tracking-[0.16em] text-[var(--sub)]">
                <component :is="group.icon" :size="11" /> {{ group.label }}
              </div>
              <div class="mt-2 flex flex-wrap gap-2">
                <Chip
                  v-for="o in group.opts"
                  :key="o.id"
                  :active="(group.val as string) === o.id"
                  :sub="o.kind === 'pct' ? (o.price ? `+${(o.price * 100).toFixed(0)}%` : 'included') : o.price ? ksh(o.price) : 'free'"
                  @click="setState({ [group.key]: o.id } as Partial<CalcInput>)"
                >
                  {{ o.label }}
                </Chip>
              </div>
            </div>
          </div>
        </Step>

        <Step v-if="q.imposition" n="—" title="How your sheet is laid out" hint="This is the actual imposition your price is built from. Nothing hidden.">
          <div class="rounded-2xl border p-5" style="border-color: var(--line); background: var(--panel)">
            <ImpositionDiagram :imp="q.imposition" />
            <div class="mt-4 flex items-start gap-2 rounded-xl p-3" style="background: var(--panel2)">
              <Gauge :size="13" class="mt-0.5 shrink-0" style="color: var(--accent)" />
              <p class="text-[11.5px] leading-relaxed text-[var(--sub)]">
                <span class="font-semibold text-[var(--ink)]">{{ q.machine?.name }}.</span> {{ q.machineReason }}.
              </p>
            </div>
          </div>
        </Step>

        <Step v-if="isLF && q.areaSqm" n="—" title="Area we're pricing">
          <div class="flex flex-wrap items-center gap-6 rounded-2xl border p-5" style="border-color: var(--line); background: var(--panel)">
            <div>
              <div class="font-mono2 text-[10px] uppercase tracking-[0.22em]">Per banner</div>
              <div class="mt-1 font-disp text-[22px] font-bold">{{ sheetAreaText(size.w, size.h) }} m²</div>
            </div>
            <div>
              <div class="font-mono2 text-[10px] uppercase tracking-[0.22em]">Total area</div>
              <div class="mt-1 font-disp text-[22px] font-bold" style="color: var(--accent)">{{ q.areaSqm.toFixed(2) }} m²</div>
            </div>
            <p class="min-w-[200px] flex-1 text-[11.5px] leading-relaxed text-[var(--sub)]">
              Large format is priced by the square metre of material plus any hemming or pole pockets by the linear metre.
            </p>
          </div>
        </Step>

        <Step n="—" title="Who manages your print?" hint="Three verified printing managers, margin included in the price. Pick on price, speed or strength." :value="BROKERS.find((b) => b.id === input.brokerId)?.name">
          <div class="grid gap-2.5 sm:grid-cols-3">
            <button
              v-for="b in BROKERS"
              :key="b.id"
              type="button"
              class="press-key relative rounded-2xl border p-4 text-left transition-colors"
              :style="{
                borderColor: b.id === input.brokerId ? 'var(--accent)' : 'var(--line)',
                background: b.id === input.brokerId ? 'color-mix(in srgb, var(--accent) 8%, transparent)' : 'var(--panel)',
              }"
              @click="setState({ brokerId: b.id })"
            >
              <span
                v-if="BROKERS.every((o) => brokerTotal(o.id).total >= brokerTotal(b.id).total)"
                class="absolute -top-2 right-3 rounded-full px-2 py-[2px] font-mono2 text-[8.5px] font-bold uppercase tracking-[0.12em] text-white"
                style="background: #B45309"
              >
                best price
              </span>
              <div class="flex items-center gap-2">
                <div class="flex h-8 w-8 items-center justify-center rounded-full font-mono2 text-[10px] font-semibold" :style="{ background: `hsla(${b.hue},60%,45%,.14)`, color: `hsl(${b.hue},60%,32%)` }">{{ b.initials }}</div>
                <div class="min-w-0">
                  <div class="truncate font-disp text-[13px] font-bold">{{ b.name }}</div>
                  <div class="font-mono2 text-[9px] uppercase tracking-[0.1em] text-[var(--sub)]">print manager · {{ b.area }}</div>
                </div>
              </div>
              <div class="mt-2.5 font-disp text-[17px] font-bold" :style="{ color: b.id === input.brokerId ? 'var(--accent)' : 'var(--ink)' }">{{ money(brokerTotal(b.id).total) }}</div>
              <div class="mt-1 font-mono2 text-[9px] uppercase tracking-[0.1em] text-[var(--sub)]">ready {{ brokerTotal(b.id).readyBy }} · ★ {{ b.rating }} · margin included</div>
              <div class="mt-2 text-[10.5px] leading-snug text-[var(--sub)]">{{ b.strength }}</div>
            </button>
          </div>
        </Step>

        <div class="flex flex-wrap gap-3 rounded-2xl border p-4" style="border-color: var(--line); background: var(--panel)">
          <div v-for="[icon, title, desc] in TRUST" :key="title" class="flex min-w-[190px] flex-1 items-start gap-2.5">
            <component :is="icon" :size="15" class="mt-0.5 shrink-0" style="color: var(--accent)" />
            <div>
              <div class="font-disp text-[12.5px] font-bold">{{ title }}</div>
              <div class="mt-0.5 text-[11px] leading-snug text-[var(--sub)]">
                <ShieldCheck v-if="title === 'Pay by M-Pesa'" :size="11" class="mr-1 mb-0.5 inline" style="color: var(--accent)" />{{ desc }}
              </div>
            </div>
          </div>
        </div>
      </div>

<aside class="hidden lg:block">
  <div class="sticky top-24">
    <PriceRail :q="q" :input="input" :open="open" :locked="locked" @submit="submit" @toggle-open="open = !open" @unlock="handleUnlock" />
  </div>
</aside>
    </div>

    <div class="fixed inset-x-0 bottom-0 z-40 border-t backdrop-blur-xl lg:hidden" style="border-color: var(--line); background: color-mix(in srgb, var(--bg) 92%, transparent)">
      <Transition name="calc-open">
        <div v-if="mobileOpen" class="max-h-[60vh] overflow-y-auto">
          <div class="p-4">
            <PriceRail :q="q" :input="input" :open="open" :locked="locked" @submit="submit" @toggle-open="open = !open" @unlock="handleUnlock" />
          </div>
        </div>
      </Transition>
      <div class="flex items-center gap-3 px-4 py-3">
        <div class="min-w-0 flex-1">
          <div class="font-mono2 text-[8.5px] uppercase tracking-[0.16em] text-[var(--sub)]">your total</div>
          <div class="font-disp text-[21px] font-bold leading-none" style="color: var(--accent)">{{ money(q.total) }}</div>
        </div>
        <button type="button" class="press-key rounded-xl border px-3 py-2.5 font-mono2 text-[10px] uppercase tracking-[0.14em]" style="border-color: var(--line)" @click="mobileOpen = !mobileOpen">
          {{ mobileOpen ? 'Hide' : 'Details' }}
        </button>
        <button type="button" class="press-key rounded-xl px-4 py-2.5 font-mono2 text-[10px] font-bold uppercase tracking-[0.14em] text-white" style="background: var(--accent)" @click="locked ? handleUnlock() : submit">
          {{ locked ? 'Unlock' : 'Request' }}
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.calc-fade-up {
  animation: calc-rise 0.6s cubic-bezier(0.22, 1, 0.36, 1) both;
}
@keyframes calc-rise {
  from { opacity: 0; transform: translateY(16px); }
  to { opacity: 1; transform: translateY(0); }
}
.calc-pop-in {
  animation: calc-pop 0.4s cubic-bezier(0.22, 1, 0.36, 1) 0.1s both;
}
@keyframes calc-pop {
  from { opacity: 0; transform: scale(0); }
  to { opacity: 1; transform: scale(1); }
}
</style>