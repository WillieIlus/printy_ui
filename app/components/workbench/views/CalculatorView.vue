<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import {
  AlertCircle, BookOpen, CheckCheck, CreditCard, FileText, Flag,
  LayoutGrid, Loader2, Minus, Plus, RefreshCw, RotateCcw, ShieldCheck, Sparkles,
  Sticker, UploadCloud, Wallet, X,
} from 'lucide-vue-next'
import type { Component } from 'vue'
import {
  configProduct,
  configProductFirst,
  colorModeCopy,
  formatSizeMm,
  productSupportCopy,
  selectFieldOptions,
  stockTierLabel,
  visibleFields,
  type CalculatorConfigField,
  type NormalizedOption,
} from '~/shared/calculator-config'
import {
  buildIntakeQuery,
  buildPublicPreviewPayload,
  type CalculatorSpec,
} from '~/shared/calculator-spec'
import { getApiErrorMessage } from '~/shared/api'
import type { IntakeSubmitResult } from '~/shared/types'
import { useCalculatorStore, type CalculatorArtworkRef } from '~/stores/calculator'
import Chip from '../calculator/Chip.vue'
import Step from '../calculator/Step.vue'
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
  'quote-created': [ref: string, total: number | null]
  unlock: []
}>()

const ICONS: Record<string, Component> = {
  business_card: CreditCard,
  flyer: FileText,
  booklet: BookOpen,
  label_sticker: Sticker,
  letterhead: FileText,
  large_format: Flag,
}

const calcStore = useCalculatorStore()

const config = computed(() => calcStore.config)
const spec = computed(() => calcStore.spec)
const preview = computed(() => calcStore.preview)
const configStatus = computed(() => calcStore.configStatus)
const configError = computed(() => calcStore.configError)
const canPrice = computed(() => calcStore.canPrice)

const product = computed(() => configProduct(config.value, spec.value?.product_type))

const headline = computed(() => {
  if (props.locked) {
    return 'KSh ———'
  }
  return canPrice.value && preview.value?.display_price_text ? preview.value.display_price_text : ''
})

const formatMoney = (n: number | null) => (n === null ? '' : `KES ${n.toLocaleString('en-KE')}`)

/* ── config boot ── */
const booting = ref(true)
let previewTimer: ReturnType<typeof setTimeout> | null = null

function refreshPreview() {
  if (previewTimer) {
    clearTimeout(previewTimer)
  }
  const target = spec.value
  if (!target || !buildPublicPreviewPayload(target)) {
    return
  }
  previewTimer = setTimeout(() => {
    calcStore.refreshPreview(target).catch(() => {})
  }, 320)
}

async function init() {
  booting.value = true
  if (configStatus.value !== 'ready') {
    try {
      await calcStore.loadConfig()
    } catch {
      /* configError surface below */
    }
  }
  if (calcStore.config) {
    const restored = calcStore.restore()
    const target = restored ? configProduct(calcStore.config, restored.product_type) : null
    if (restored && target) {
      calcStore.adoptSpec(restored, target.key)
    } else {
      const first = configProductFirst(calcStore.config)
      if (first) {
        calcStore.setProduct(first.key, restored || null)
      }
    }
  }
  booting.value = false
  refreshPreview()
}

async function retryConfig() {
  booting.value = true
  try {
    await calcStore.loadConfig(true)
  } catch {
    /* configError surfaces below */
  } finally {
    booting.value = false
  }
  refreshPreview()
}

onMounted(init)
watch(spec, refreshPreview, { deep: true })

/* ── spec mutation helpers ── */
function setField(key: keyof CalculatorSpec, value: unknown) {
  if (!spec.value) {
    return
  }
  calcStore.setSpec({ ...spec.value, [key]: value })
}
function setNumber(key: 'quantity' | 'requested_gsm' | 'total_pages' | 'width_mm' | 'height_mm', value: number | null) {
  if (!spec.value) {
    return
  }
  const patch: Partial<CalculatorSpec> = { [key]: value ?? undefined }
  if (key === 'width_mm' || key === 'height_mm') {
    patch.finished_size = 'custom'
  }
  calcStore.setSpec({ ...spec.value, ...patch })
}
function pickProduct(key: string) {
  calcStore.setProduct(key, spec.value)
}
function pickSize(value: string) {
  setField('finished_size', value)
  if (value !== 'custom') {
    setField('width_mm', undefined)
    setField('height_mm', undefined)
  }
}
function isCustomSize() {
  return spec.value?.finished_size === 'custom'
}
function currentString(key: keyof CalculatorSpec): string {
  const v = spec.value?.[key]
  return typeof v === 'string' ? v : ''
}

function fieldValue(field: CalculatorConfigField): unknown {
  if (!spec.value) {
    return undefined
  }
  return (spec.value as Record<string, unknown>)[field.key]
}
function fieldStringValue(field: CalculatorConfigField): string {
  const v = fieldValue(field)
  return typeof v === 'string' ? v : ''
}
function fieldNumberValue(field: CalculatorConfigField): number {
  const v = fieldValue(field)
  return typeof v === 'number' && Number.isFinite(v) ? v : 0
}
function setFieldNumber(field: CalculatorConfigField, raw: number | null) {
  setNumber(field.key as 'requested_gsm', raw === null ? null : Math.max(0, raw))
}
function stepFieldNumber(field: CalculatorConfigField, delta: number) {
  setNumber(field.key as 'requested_gsm', Math.max(0, fieldNumberValue(field) + delta))
}
function readNumberFrom(event: Event, min?: number): number | null {
  const raw = (event.target as HTMLInputElement).value
  const n = Number(raw)
  if (raw === '' || !Number.isFinite(n)) {
    return null
  }
  return min === undefined ? n : Math.max(min, n)
}
function setFieldValue(field: CalculatorConfigField, value: unknown) {
  setField(field.key as keyof CalculatorSpec, value)
}

/** A "300gsm"-style tier option value (backend PAPER_TIER_DEFINITIONS ids). */
function isTierValue(value: unknown): boolean {
  return typeof value === 'string' && /^\d+gsm$/.test(value)
}

/**
 * Selecting a paper quality tier drives the spec's paper_stock key AND the
 * grammage that folds into pricing / manager recommendation — the client only
 * ever picks Premium / Standard / Budget, never raw paper names.
 */
function pickPaper(field: CalculatorConfigField, option: NormalizedOption) {
  setFieldValue(field, option.value)
  const meta = option.meta as { gsm?: number } | undefined
  if (typeof meta?.gsm === 'number') {
    setField('requested_gsm', meta.gsm)
  }
}

/* ── product-driven fields ── */
const open = ref(false)
const mobileOpen = ref(false)

const fieldList = computed(() => (product.value ? visibleFields(product.value, config.value) : []))
const stepFields = computed(() => {
  const steps: Array<{ n: string; field: CalculatorConfigField }> = []
  let index = 0
  for (const field of fieldList.value) {
    index += 1
    steps.push({ n: String(index).padStart(2, '0'), field })
  }
  return steps
})

function selectFieldOptionsOf(field: CalculatorConfigField): NormalizedOption[] {
  if (!product.value) {
    return []
  }
  return selectFieldOptions(product.value, field, config.value)
}
function optionLabelFor(field: CalculatorConfigField, value: string): string {
  const option = selectFieldOptionsOf(field).find((o) => o.value === value)
  return option ? option.label : value
}

function valueFor(field: CalculatorConfigField): string {
  const key = field.key
  if (key === 'quantity') {
    const q = spec.value?.quantity
    return typeof q === 'number' ? `${q.toLocaleString()} pcs` : ''
  }
  if (key === 'finished_size') {
    if (isCustomSize()) {
      return spec.value?.width_mm && spec.value?.height_mm
        ? formatSizeMm(spec.value.width_mm, spec.value.height_mm)
        : 'custom'
    }
    return currentString('finished_size') ? optionLabelFor(field, currentString('finished_size')) : ''
  }
  if (key === 'requested_gsm') {
    const gsm = spec.value?.requested_gsm
    return typeof gsm === 'number' ? `${gsm}gsm` : ''
  }
  if (key === 'total_pages') {
    const pages = spec.value?.total_pages
    return typeof pages === 'number' ? `${pages}pp` : ''
  }
  if (field.type === 'boolean') {
    const value = spec.value?.[key as 'corner_rounding']
    return value === undefined ? '' : value ? 'Yes' : 'No'
  }
  if (field.type === 'number') {
    const value = spec.value?.[key as 'requested_gsm']
    return typeof value === 'number' ? String(value) : ''
  }
  const current = currentString(key as keyof CalculatorSpec)
  return current ? optionLabelFor(field, current) : ''
}

function hintFor(field: CalculatorConfigField): string | undefined {
  if (field.help_text) {
    return field.help_text
  }
  const key = field.key
  if (key === 'quantity') {
    return 'Unit price drops fast — the press set-up is the same whether you print 100 or 10,000.'
  }
  if (key === 'finished_size') {
    return product.value?.key === 'large_format'
      ? 'Finished banner size — large format is priced by the square metre.'
      : 'Finished trim size. The binding adds bleed automatically.'
  }
  return undefined
}

/* ── quantity ladder (pure convenience, no data) ── */
const qty = computed(() => (typeof spec.value?.quantity === 'number' ? spec.value.quantity : 0))
const qtyStep = computed(() => Math.max(1, Math.round(qty.value / 4)))
function bumpQty(delta: number) {
  setNumber('quantity', Math.max(1, qty.value + delta))
}
function quickQty(value: number) {
  setNumber('quantity', Math.max(1, value))
}

/* ── submit flow ── */
const saving = ref(false)
const submitErr = ref('')
const sent = ref<{ ref: string; total: number | null } | null>(null)
const artwork = ref<CalculatorArtworkRef | null>(null)
const artworkUploading = ref(false)
const artworkError = ref('')
const managerDraftId = ref<number | null>(null)
const intakeResult = ref<IntakeSubmitResult | null>(null)

const managerQuery = computed(() => (spec.value ? buildIntakeQuery(spec.value, config.value) : {}))

async function onArtwork(event: Event) {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  target.value = ''
  if (!file) {
    return
  }
  artworkError.value = ''
  artworkUploading.value = true
  try {
    const upload = await calcStore.uploadGuestArtwork(file)
    artwork.value = { token: upload.artwork_token, filename: upload.filename }
  } catch (e) {
    artworkError.value = getApiErrorMessage(e, "We couldn't upload that file. Use PDF, JPG, PNG, AI or EPS under 50MB.")
  } finally {
    artworkUploading.value = false
  }
}

function finish() {
  if (sent.value) {
    emit('quote-created', sent.value.ref, sent.value.total)
  }
}

function onManagerSubmitted(result: IntakeSubmitResult) {
  intakeResult.value = result
  managerDraftId.value = null
}

async function handleUnlock() {
  if (saving.value) {
    return
  }
  saving.value = true
  try {
    await calcStore.saveGuestDraft(spec.value!, preview.value, artwork.value)
  } catch {
    /* keep the local spec — sign-up re-syncs via the shared session key */
  } finally {
    saving.value = false
  }
  emit('unlock')
}

async function submit() {
  if (saving.value || !spec.value) {
    return
  }
  submitErr.value = ''
  if (props.locked) {
    await handleUnlock()
    return
  }
  saving.value = true
  try {
    if (props.authed) {
      const draft = await calcStore.createDraft(spec.value, preview.value, artwork.value)
      managerDraftId.value = draft.id
      sent.value = { ref: draft.draft_reference, total: calcStore.previewMedian }
    } else {
      const draft = await calcStore.saveGuestDraft(spec.value, preview.value, artwork.value)
      sent.value = { ref: draft.draft_reference, total: calcStore.previewMedian }
      calcStore.clear()
      emit('quote-created', sent.value.ref, sent.value.total)
    }
  } catch (e) {
    submitErr.value = getApiErrorMessage(e, "We couldn't save your quote. Your spec is still safe on this device — please try again.")
  } finally {
    saving.value = false
  }
}

function resetAfterSent() {
  sent.value = null
  intakeResult.value = null
  if (product.value) {
    calcStore.setProduct(product.value.key)
    refreshPreview()
  }
}

const TRUST: Array<[Component, string, string]> = [
  [Wallet, 'Pay by M-Pesa', 'Funds sit in custody until you confirm delivery'],
  [LayoutGrid, 'Median, not a guess', `${preview.value?.matches_count ?? 0} live quote${(preview.value?.matches_count ?? 0) === 1 ? '' : 's'} from verified shops set the price`],
  [ShieldCheck, 'Verified managers only', 'Real managers confirm the exact figure against live rate cards'],
]
</script>

<template>
  <div v-if="sent" class="mx-auto w-full max-w-[620px] px-4 pb-24 pt-14">
    <div v-if="managerDraftId && !intakeResult" class="space-y-4">
      <div class="overflow-hidden rounded-3xl border text-center" style="border-color: var(--line); background: var(--panel)">
        <div class="p-8">
          <div class="calc-pop-in mx-auto flex h-14 w-14 items-center justify-center rounded-full" style="background: color-mix(in srgb, var(--accent) 14%, transparent)">
            <CheckCheck :size="26" style="color: var(--accent)" />
          </div>
          <h2 class="mt-4 font-disp text-[26px] font-bold tracking-tight">Draft saved</h2>
          <p class="mx-auto mt-2 max-w-[40ch] text-[13.5px] leading-relaxed text-[var(--sub)]">
            Reference <span class="font-mono2 font-semibold text-[var(--ink)]">{{ sent.ref }}</span> — now choose who confirms and runs your job.
          </p>
        </div>
      </div>
      <ManagerSelectPanel :draft-id="managerDraftId" :query="managerQuery" @submitted="onManagerSubmitted" />
      <div v-if="submitErr" class="flex items-start gap-2 rounded-2xl px-4 py-3 text-[12.5px]" style="background: rgba(251,77,109,.08); color: #B4243F">
        <AlertCircle :size="14" class="mt-0.5 shrink-0" />
        <p>{{ submitErr }}</p>
      </div>
    </div>

    <div v-else class="overflow-hidden rounded-3xl border text-center" style="border-color: var(--line); background: var(--panel)">
      <div class="p-8">
        <div class="calc-pop-in mx-auto flex h-14 w-14 items-center justify-center rounded-full" style="background: color-mix(in srgb, var(--accent) 14%, transparent)">
          <CheckCheck :size="26" style="color: var(--accent)" />
        </div>
        <h2 class="mt-4 font-disp text-[26px] font-bold tracking-tight">Quote request sent</h2>
        <p class="mx-auto mt-2 max-w-[40ch] text-[13.5px] leading-relaxed text-[var(--sub)]">
          Reference <span class="font-mono2 font-semibold text-[var(--ink)]">{{ sent.ref }}</span> — a verified printing manager confirms your spec against its live rate card, then the job enters the workflow.
        </p>
        <p v-if="intakeResult" class="mx-auto mt-2 max-w-[40ch] text-[12.5px] leading-relaxed text-[var(--sub)]">
          Routed to <span class="font-semibold text-[var(--ink)]">{{ intakeResult.manager_name }}</span>.
        </p>
        <div v-if="sent.total !== null" class="mt-5 inline-flex items-baseline gap-2 rounded-2xl px-5 py-3" style="background: var(--panel2)">
          <span class="font-mono2 text-[10px] uppercase tracking-[0.14em] text-[var(--sub)]">Indicative</span>
          <span class="font-disp text-[24px] font-bold" style="color: var(--accent)">{{ formatMoney(sent.total) }}</span>
        </div>
        <p v-else class="mx-auto mt-5 max-w-[36ch] text-[12px] leading-relaxed text-[var(--sub)]">
          Your spec was saved as-is — the manager prices it from live production data once it reaches them.
        </p>
        <div class="mt-6 grid gap-2 text-left sm:grid-cols-3">
          <div v-for="([k, v], i) in [['Now', 'Your printing manager confirms the spec'], ['Next', 'You approve artwork'], ['Then', 'Pay via M-Pesa into custody']]" :key="k" class="calc-fade-up rounded-xl p-3" :style="{ animationDelay: `${0.2 + i * 0.1}s` }" style="background: var(--panel2)">
            <div class="font-mono2 text-[9px] uppercase tracking-[0.16em] text-[var(--sub)]">{{ k }}</div>
            <div class="mt-0.5 text-[12px] font-semibold">{{ v }}</div>
          </div>
        </div>
        <div class="mt-6 flex flex-wrap items-center justify-center gap-2">
          <button
            v-if="authed"
            type="button"
            class="press-key inline-flex items-center gap-2 rounded-xl px-5 py-2.5 font-mono2 text-[11px] font-bold uppercase tracking-[0.14em] text-white"
            style="background: var(--accent)"
            @click="finish"
          >
            Back to my quotes
          </button>
          <button
            type="button"
            class="press-key inline-flex items-center gap-2 rounded-xl border px-5 py-2.5 font-mono2 text-[11px] font-semibold uppercase tracking-[0.14em]"
            style="border-color: var(--line)"
            @click="resetAfterSent"
          >
            <RotateCcw :size="13" /> Price another job
          </button>
        </div>
      </div>
    </div>
  </div>

  <div v-else class="mx-auto w-full max-w-[1180px] px-4 pb-40 pt-8 lg:pb-24">
    <div v-if="configStatus === 'loading' || booting" class="flex items-center justify-center gap-2 rounded-2xl border px-5 py-14 text-[13px] text-[var(--sub)]" style="border-color: var(--line)">
      <Loader2 :size="16" class="animate-spin" style="color: var(--accent)" /> Loading the live pricing network…
    </div>

    <div v-else-if="configStatus === 'error'" class="flex flex-col items-center gap-3 rounded-2xl border px-5 py-14 text-center" style="border-color: rgba(251,77,109,.4); background: rgba(251,77,109,.06)">
      <AlertCircle :size="20" style="color: #B4243F" />
      <p class="max-w-[44ch] text-[13px] leading-relaxed text-[var(--sub)]">{{ configError }}</p>
      <button type="button" class="press-key inline-flex items-center gap-2 rounded-xl border px-5 py-2.5 font-mono2 text-[10.5px] font-bold uppercase tracking-[0.14em]" style="border-color: var(--line)" @click="retryConfig">
        <RefreshCw :size="13" /> Try again
      </button>
    </div>

    <template v-else>
      <div v-if="submitErr" class="mb-6 flex items-start gap-2.5 rounded-2xl border px-4 py-3 text-[12.5px]" style="border-color: rgba(251,77,109,.4); background: rgba(251,77,109,.08); color: #B4243F">
        <AlertCircle :size="15" class="mt-0.5 shrink-0" />
        <p>{{ submitErr }}</p>
      </div>

      <div v-if="!embedded" class="calc-fade-up max-w-[46ch]">
        <div class="flex items-center gap-2 font-mono2 text-[10px] uppercase tracking-[0.22em] text-[var(--sub)]">
          <Sparkles :size="11" style="color: var(--accent)" /> live network estimate · no local guesswork
        </div>
        <h1 class="mt-2 font-disp text-[34px] font-bold leading-[1.05] tracking-tight sm:text-[42px]">
          Priced live.
          <span class="block text-[var(--sub)]">Across the network.</span>
        </h1>
        <p class="mt-3 text-[14px] leading-relaxed text-[var(--sub)]">
          Pick a product, set your spec, and see the median market price from verified shops. Change anything and the estimate moves.
        </p>
      </div>

      <div :class="['grid gap-8 lg:grid-cols-[1fr_370px]', embedded ? '' : 'mt-8']">
        <div class="space-y-7">
          <Step n="01" title="What are you printing?" :value="product?.label">
            <div class="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
              <button
                v-for="p in config?.products"
                :key="p.key"
                type="button"
                class="press-key flex flex-col items-start gap-2 rounded-2xl border p-3.5 text-left transition-colors"
                :style="{
                  borderColor: p.key === spec?.product_type ? 'var(--accent)' : 'var(--line)',
                  background: p.key === spec?.product_type ? 'color-mix(in srgb, var(--accent) 8%, transparent)' : 'var(--panel)',
                }"
                @click="pickProduct(p.key)"
              >
                <component :is="ICONS[p.key] ?? FileText" :size="19" :style="{ color: p.key === spec?.product_type ? 'var(--accent)' : 'var(--sub)' }" />
                <div>
                  <div class="font-disp text-[13px] font-bold leading-tight">{{ p.label }}</div>
                  <div class="mt-0.5 text-[9.5px] text-[var(--sub)]">{{ productSupportCopy(p) }}</div>
                </div>
              </button>
            </div>
          </Step>

          <Step
            v-for="s in stepFields"
            :key="s.field.key"
            :n="s.n"
            :title="s.field.label"
            :hint="hintFor(s.field)"
            :value="valueFor(s.field)"
          >
            <!-- quantity -->
            <template v-if="s.field.key === 'quantity'">
              <div class="flex flex-wrap items-center gap-2">
                <Chip v-for="q in [qty, qty * 2, qty * 5, qty * 10].filter((q) => q > 0)" :key="q" :active="qty === q" @click="quickQty(q)">
                  {{ q.toLocaleString() }}
                </Chip>
              </div>
              <div class="mt-3 flex items-center gap-3">
                <button type="button" class="press-key rounded-lg border p-2" style="border-color: var(--line)" @click="bumpQty(-qtyStep)"><Minus :size="13" /></button>
                <input
                  type="number"
                  :value="qty"
                  class="w-28 rounded-lg border bg-[var(--panel)] px-3 py-2 text-center font-mono2 text-[14px] font-semibold outline-none"
                  style="border-color: var(--line)"
                  @input="setNumber('quantity', readNumberFrom($event, 1) ?? 1)"
                />
                <button type="button" class="press-key rounded-lg border p-2" style="border-color: var(--line)" @click="bumpQty(qtyStep)"><Plus :size="13" /></button>
              </div>
            </template>

            <!-- finished size -->
            <template v-else-if="s.field.key === 'finished_size'">
              <div class="flex flex-wrap gap-2">
                <Chip
                  v-for="o in selectFieldOptionsOf(s.field)"
                  :key="o.value"
                  :active="currentString('finished_size') === o.value && !isCustomSize()"
                  :sub="o.sub"
                  @click="pickSize(o.value)"
                >
                  {{ o.label }}
                </Chip>
                <div v-if="product?.allow_custom_size" class="flex items-center gap-1.5 rounded-xl border px-3 py-2" :style="{ borderColor: isCustomSize() ? 'var(--accent)' : 'var(--line)', background: 'var(--panel)' }">
                  <span class="font-mono2 text-[9px] uppercase tracking-[0.12em] text-[var(--sub)]">custom</span>
                  <input
                    type="number"
                    :placeholder="String(spec?.width_mm ?? '')"
                    :value="spec?.width_mm ?? ''"
                    class="w-14 bg-transparent font-mono2 text-[12px] outline-none"
                    @input="setNumber('width_mm', readNumberFrom($event))"
                  />
                  <span class="text-[var(--sub)]">×</span>
                  <input
                    type="number"
                    :placeholder="String(spec?.height_mm ?? '')"
                    :value="spec?.height_mm ?? ''"
                    class="w-14 bg-transparent font-mono2 text-[12px] outline-none"
                    @input="setNumber('height_mm', readNumberFrom($event))"
                  />
                  <span class="font-mono2 text-[9px] text-[var(--sub)]">mm</span>
                </div>
              </div>
            </template>

            <!-- paper stocks -->
            <template v-else-if="['paper_stock', 'cover_stock', 'insert_stock'].includes(s.field.key)">
              <div class="grid gap-2 sm:grid-cols-2">
                <button
                  v-for="o in selectFieldOptionsOf(s.field)"
                  :key="o.value"
                  type="button"
                  class="press-key flex items-center gap-3 rounded-xl border p-3 text-left transition-colors"
                  :style="{
                    borderColor: fieldStringValue(s.field) === o.value ? 'var(--accent)' : 'var(--line)',
                    background: fieldStringValue(s.field) === o.value ? 'color-mix(in srgb, var(--accent) 8%, transparent)' : 'var(--panel)',
                  }"
                  @click="pickPaper(s.field, o)"
                >
                  <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg font-mono2 text-[10px] font-bold" :style="{ background: 'var(--panel2)', color: fieldStringValue(s.field) === o.value ? 'var(--accent)' : 'var(--sub)' }">
                    {{ o.meta.gsm ? `${o.meta.gsm}gsm` : 'papr' }}
                  </div>
                  <div class="min-w-0">
                    <div class="flex items-center gap-1.5">
                      <span class="truncate font-disp text-[13px] font-semibold">{{ o.label }}</span>
                      <span v-if="!isTierValue(o.value) && stockTierLabel(o.meta)" class="shrink-0 rounded bg-[var(--panel2)] px-1.5 py-0.5 font-mono2 text-[9px] uppercase tracking-[0.1em] text-[var(--sub)]">{{ stockTierLabel(o.meta) }}</span>
                    </div>
                    <div v-if="o.meta.description" class="mt-0.5 truncate text-[10.5px] text-[var(--sub)]">{{ o.meta.description }}</div>
                  </div>
                </button>
              </div>
            </template>

            <!-- booleans -->
            <template v-else-if="s.field.type === 'boolean'">
              <div class="flex gap-2">
                <Chip :active="fieldValue(s.field) === true" @click="setFieldValue(s.field, true)">Yes</Chip>
                <Chip :active="fieldValue(s.field) === false" @click="setFieldValue(s.field, false)">No</Chip>
              </div>
            </template>

            <!-- optional gsm / pages numbers -->
            <template v-else-if="s.field.type === 'number'">
              <div class="flex items-center gap-3">
                <button type="button" class="press-key rounded-lg border p-2" style="border-color: var(--line)" @click="stepFieldNumber(s.field, -10)"><Minus :size="13" /></button>
                <input
                  type="number"
                  :value="fieldNumberValue(s.field)"
                  class="w-32 rounded-lg border bg-[var(--panel)] px-3 py-2 text-center font-mono2 text-[14px] font-semibold outline-none"
                  style="border-color: var(--line)"
                  @input="setFieldNumber(s.field, readNumberFrom($event))"
                />
                <button type="button" class="press-key rounded-lg border p-2" style="border-color: var(--line)" @click="stepFieldNumber(s.field, 10)"><Plus :size="13" /></button>
                <span class="font-mono2 text-[10px] uppercase tracking-[0.12em] text-[var(--sub)]">{{ s.field.key === 'requested_gsm' ? 'grammes' : 'pages' }}</span>
              </div>
            </template>

            <!-- generic selects -->
            <template v-else>
              <div class="flex flex-wrap gap-2">
                <Chip
                  v-for="o in selectFieldOptionsOf(s.field)"
                  :key="o.value"
                  :active="fieldStringValue(s.field) === o.value"
                  :sub="o.sub"
                  @click="setFieldValue(s.field, o.value)"
                >
                  {{ o.label }}
                </Chip>
              </div>
            </template>
          </Step>

          <!-- artwork -->
          <Step n="—" title="Artwork" hint="Attach a print-ready file and it travels with the request to your printing manager." :value="artwork?.filename">
            <div class="mt-1">
              <label
                v-if="!artwork"
                class="flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed px-4 py-5 text-center font-mono2 text-[10px] uppercase tracking-[0.12em] text-[var(--sub)]"
                style="border-color: var(--line)"
              >
                <Loader2 v-if="artworkUploading" :size="14" class="animate-spin" />
                <UploadCloud v-else :size="14" />
                {{ artworkUploading ? 'Uploading…' : 'Attach artwork (PDF, PNG, JPG, AI, EPS · max 50MB)' }}
                <input type="file" accept=".pdf,.jpg,.jpeg,.png,.ai,.eps" class="hidden" @change="onArtwork" />
              </label>
              <div v-else class="flex items-center gap-3 rounded-xl border p-3" style="border-color: var(--line)">
                <FileText :size="15" style="color: var(--accent)" />
                <span class="min-w-0 flex-1 truncate text-[12.5px] font-semibold">{{ artwork.filename }}</span>
                <button type="button" class="press-key rounded-lg border p-1.5" style="border-color: var(--line)" @click="artwork = null">
                  <X :size="12" />
                </button>
              </div>
              <p v-if="artworkError" class="mt-2 text-[11.5px]" style="color: #B4243F">{{ artworkError }}</p>
            </div>
          </Step>

          <div class="flex flex-wrap gap-3 rounded-2xl border p-4" style="border-color: var(--line); background: var(--panel)">
            <div v-for="[icon, title, desc] in TRUST" :key="title" class="flex min-w-[190px] flex-1 items-start gap-2.5">
              <component :is="icon" :size="15" class="mt-0.5 shrink-0" style="color: var(--accent)" />
              <div>
                <div class="font-disp text-[12.5px] font-bold">{{ title }}</div>
                <div class="mt-0.5 text-[11px] leading-snug text-[var(--sub)]">{{ desc }}</div>
              </div>
            </div>
          </div>
        </div>

        <aside class="hidden lg:block">
          <div class="sticky top-24">
            <PriceRail
              v-if="spec"
              :spec="spec"
              :config="config"
              :preview="preview"
              :preview-status="calcStore.previewStatus"
              :preview-error="calcStore.previewError"
              :open="open"
              :locked="locked"
              @submit="submit"
              @toggle-open="open = !open"
              @unlock="handleUnlock"
            />
          </div>
        </aside>
      </div>

      <div class="fixed inset-x-0 bottom-0 z-40 border-t backdrop-blur-xl lg:hidden" style="border-color: var(--line); background: color-mix(in srgb, var(--bg) 92%, transparent)">
        <Transition name="calc-open">
          <div v-if="mobileOpen" class="max-h-[60vh] overflow-y-auto">
            <div class="p-4">
              <PriceRail
                v-if="spec"
                :spec="spec"
                :config="config"
                :preview="preview"
                :preview-status="calcStore.previewStatus"
                :preview-error="calcStore.previewError"
                :open="open"
                :locked="locked"
                @submit="submit"
                @toggle-open="open = !open"
                @unlock="handleUnlock"
              />
            </div>
          </div>
        </Transition>
        <div class="flex items-center gap-3 px-4 py-3">
          <div class="min-w-0 flex-1">
            <div class="font-mono2 text-[8.5px] uppercase tracking-[0.16em] text-[var(--sub)]">live estimate</div>
            <div class="truncate font-disp text-[21px] font-bold leading-none" style="color: var(--accent)">{{ headline || 'add your details' }}</div>
          </div>
          <button type="button" class="press-key rounded-xl border px-3 py-2.5 font-mono2 text-[10px] uppercase tracking-[0.14em]" style="border-color: var(--line)" @click="mobileOpen = !mobileOpen">
            {{ mobileOpen ? 'Hide' : 'Details' }}
          </button>
          <button type="button" class="press-key rounded-xl px-4 py-2.5 font-mono2 text-[10px] font-bold uppercase tracking-[0.14em] text-white" style="background: var(--accent)" @click="locked ? handleUnlock() : submit">
            {{ locked ? 'Unlock' : 'Request' }}
          </button>
        </div>
      </div>
    </template>
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
.calc-open-enter-active, .calc-open-leave-active {
  transition: height 0.28s ease, opacity 0.28s ease;
}
.calc-open-enter-from, .calc-open-leave-to {
  height: 0 !important;
  opacity: 0;
}
.calc-open-enter-to, .calc-open-leave-from {
  height: auto;
  opacity: 1;
}
</style>