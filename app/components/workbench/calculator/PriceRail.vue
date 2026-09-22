<script setup lang="ts">
import { computed } from 'vue'
import {
  ArrowRight, BadgeCheck, ChevronDown, CircleDashed, LayoutGrid, Lock,
  RefreshCw, ShieldCheck, TrendingUp, UserPlus,
} from 'lucide-vue-next'
import type { CalculatorConfig } from '~/shared/calculator-config'
import { configProduct } from '~/shared/calculator-config'
import type { CalculatorSpec } from '~/shared/calculator-spec'
import type { PreviewStatus } from '~/stores/calculator'
import type { ServerCalculatorPreview } from '~/shared/types'

const props = withDefaults(defineProps<{
  spec: CalculatorSpec | null
  config: CalculatorConfig | null
  preview: ServerCalculatorPreview | null
  previewStatus: PreviewStatus
  previewError?: string
  open: boolean
  locked?: boolean
}>(), {
  locked: false,
  previewError: '',
})

const emit = defineEmits<{ submit: []; 'toggle-open': []; unlock: [] }>()

const canPrice = computed(() => Boolean(props.preview?.can_calculate && props.preview.display_price_text))

const range = computed(() => props.preview?.market_range ?? null)

function numberish(value: string | number | null | undefined): number | null {
  if (value === null || value === undefined || value === '') {
    return null
  }
  const n = typeof value === 'number' ? value : Number(value)
  return Number.isFinite(n) ? n : null
}

const ksh = (n: number, suffix: string) =>
  `${range.value?.currency || 'KES'} ${n.toLocaleString('en-KE')}${suffix}`

const min = computed(() => numberish(range.value?.min))
const max = computed(() => numberish(range.value?.max))
const median = computed(() => numberish(range.value?.median))

const headline = computed(() => {
  if (props.locked) {
    return 'KSh ———'
  }
  return canPrice.value ? props.preview!.display_price_text! : ''
})

const unitPrice = computed(() => {
  const m = median.value
  if (!m || !props.spec?.quantity || props.spec.quantity <= 0) {
    return null
  }
  return Math.round((m / props.spec.quantity) * 100) / 100
})

const rangeMeter = computed(() => {
  const lo = min.value
  const hi = max.value
  const mid = median.value
  if (lo === null || hi === null || mid === null || hi <= lo) {
    return 50
  }
  const pct = ((mid - lo) / (hi - lo)) * 100
  return Math.min(90, Math.max(10, pct))
})

const rangeText = computed(() => {
  const lo = min.value
  const hi = max.value
  const c = range.value?.currency || 'KES'
  if (lo !== null && hi !== null && hi > lo) {
    return `${c} ${lo.toLocaleString('en-KE')} – ${c} ${hi.toLocaleString('en-KE')}`
  }
  if (lo !== null) {
    return `${c} ${lo.toLocaleString('en-KE')}+`
  }
  return ''
})

const confidence = computed(() => props.preview?.confidence_label || range.value?.confidence || '')

const specTitle = computed(() => {
  if (!props.spec) {
    return 'Your spec'
  }
  const product = configProduct(props.config, props.spec.product_type)
  if (!product) {
    return 'Your spec'
  }
  const finishedSize = props.spec.finished_size && props.spec.finished_size !== 'custom'
    ? props.spec.finished_size
    : props.spec.width_mm && props.spec.height_mm
      ? `${props.spec.width_mm} x ${props.spec.height_mm} mm`
      : ''
  return finishedSize ? `${product.label} · ${finishedSize}` : product.label
})

const includedRows = computed<Array<[string, string]>>(() => {
  const count = props.preview?.matches_count || 1
  return [
    ['Quote basis', `Median of ${count} verified quote${count === 1 ? '' : 's'}`],
    ['Markup & fees', 'Fully included — the price you see is what you pay'],
    ['Payment', 'M-Pesa, held in custody until you confirm delivery'],
  ]
})

const lockedGate = computed(() => {
  if (!props.preview || !canPrice.value) {
    return ''
  }
  const count = props.preview.matches_count
  if (count) {
    return `Matched against ${count} live quote${count === 1 ? '' : 's'} from verified shops.`
  }
  return 'Backed by live quotes from verified shops.'
})

const MISSING_FIELD_FALLBACKS: Record<string, { label: string; help: string }> = {
  quantity: { label: 'Quantity', help: 'How many pieces do you need?' },
  finished_size: { label: 'Finished size', help: 'Pick a stocked size, or enter a custom width and height.' },
  width_mm: { label: 'Width (mm)', help: 'Custom width of the finished piece.' },
  height_mm: { label: 'Height (mm)', help: 'Custom height of the finished piece.' },
  paper_stock: { label: 'Paper stock', help: 'Choose a paper from the list, or type a requested gsm / paper type.' },
  cover_stock: { label: 'Cover stock', help: 'Choose a stock for the cover.' },
  insert_stock: { label: 'Insert stock', help: 'Choose a stock for the inside pages.' },
  print_sides: { label: 'Print sides', help: 'Single or double sided?' },
  color_mode: { label: 'Colour mode', help: 'Black & white or full colour?' },
  total_pages: { label: 'Total pages', help: 'How many pages in total?' },
  material_type: { label: 'Material', help: 'What is the product made from?' },
  requested_gsm: { label: 'Requested gsm', help: 'An optional gsm we should quote around.' },
}

function missingFieldEntry(key: string): { label: string; help: string } {
  const product = props.spec ? configProduct(props.config, props.spec.product_type) : null
  const field = product?.fields?.find((f) => f.key === key)
  if (field) {
    return {
      label: field.label || key.replace(/_/g, ' '),
      help: field.help_text || MISSING_FIELD_FALLBACKS[key]?.help || '',
    }
  }
  return MISSING_FIELD_FALLBACKS[key] ?? { label: key.replace(/_/g, ' '), help: '' }
}

const missingList = computed(() =>
  (props.preview?.missing_fields ?? []).map((key) => ({ key, ...missingFieldEntry(key) })),
)
</script>

<template>
  <div class="overflow-hidden rounded-3xl border shadow-[0_8px_40px_-18px_rgba(27,23,16,.3)]" style="border-color: var(--line); background: var(--panel)">
    <!-- header -->
    <div class="relative overflow-hidden p-5" style="background: color-mix(in srgb, var(--accent) 7%, transparent)">
      <div class="halftone pointer-events-none absolute inset-0 opacity-30" style="--dot: color-mix(in srgb, var(--accent) 30%, transparent)" />
      <div class="relative">
        <div class="font-mono2 text-[10px] uppercase tracking-[0.22em]">{{ locked ? 'Your price · locked' : 'Live estimate' }}</div>

        <template v-if="previewStatus === 'loading' || previewStatus === 'idle'">
          <div class="mt-3 flex items-center gap-2 text-[12.5px] text-[var(--sub)]">
            <RefreshCw :size="14" class="animate-spin" style="color: var(--accent)" /> Checking the live pricing network…
          </div>
        </template>

        <template v-else-if="previewStatus === 'error'">
          <p class="mt-3 text-[12px] leading-relaxed" style="color: #B4243F">{{ previewError }}</p>
        </template>

        <template v-else-if="canPrice">
          <div class="mt-1 flex items-end gap-2">
            <div class="font-disp text-[34px] font-bold leading-none tracking-tight" style="color: var(--accent)">
              {{ headline }}
            </div>
          </div>
          <div class="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 font-mono2 text-[10px] uppercase tracking-[0.12em] text-[var(--sub)]">
            <span><span class="font-semibold text-[var(--ink)]">{{ specTitle }}</span></span>
            <span>{{ (spec?.quantity ?? 0).toLocaleString() }} units</span>
            <span v-if="unitPrice"><span class="font-semibold text-[var(--ink)]">{{ ksh(unitPrice, '') }}</span> per piece</span>
          </div>
          <div class="mt-3 flex flex-wrap gap-2">
            <span class="inline-flex items-center gap-1.5 rounded-full bg-[var(--panel)] px-2.5 py-1 font-mono2 text-[9.5px] uppercase tracking-[0.12em]">
              <TrendingUp :size="10" style="color: var(--accent)" />
              median
            </span>
            <span v-if="confidence" class="inline-flex items-center gap-1.5 rounded-full bg-[var(--panel)] px-2.5 py-1 font-mono2 text-[9.5px] uppercase tracking-[0.12em]">
              <ShieldCheck :size="10" style="color: var(--accent)" /> {{ confidence }}
            </span>
            <span v-if="preview?.matches_count" class="inline-flex items-center gap-1.5 rounded-full bg-[var(--panel)] px-2.5 py-1 font-mono2 text-[9.5px] uppercase tracking-[0.12em]">
              <LayoutGrid :size="10" style="color: var(--accent)" />
              {{ preview.matches_count }} production option{{ preview.matches_count === 1 ? '' : 's' }}
            </span>
          </div>
          <p v-if="preview?.summary" class="mt-2.5 text-[11.5px] leading-relaxed text-[var(--sub)]">{{ preview.summary }}</p>
        </template>

        <template v-else>
          <div v-if="missingList.length" class="mt-3 rounded-xl p-3" style="background: var(--panel2)">
            <div class="flex items-center gap-1.5">
              <CircleDashed :size="13" style="color: var(--accent)" />
              <span class="font-semibold text-[var(--ink)]">Finish these to price it</span>
            </div>
            <p class="mt-1 text-[10.5px] leading-snug text-[var(--sub)]">
              {{ preview?.summary || 'Add the spec details below and we can price it against live quotes from verified shops.' }}
            </p>
            <ul class="mt-2.5 space-y-2">
              <li v-for="{ key, label, help } in missingList" :key="key" class="flex items-start gap-2">
                <span class="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full" style="background: var(--accent)" />
                <span class="min-w-0">
                  <span class="block text-[11.5px] font-semibold text-[var(--ink)]">{{ label }}</span>
                  <span v-if="help" class="block text-[9.5px] leading-snug text-[var(--sub)]">{{ help }}</span>
                </span>
              </li>
            </ul>
          </div>
          <div v-else class="mt-3 rounded-xl p-3 text-[11.5px] leading-relaxed text-[var(--sub)]" style="background: var(--panel2)">
            <div class="flex items-center gap-1.5">
              <BadgeCheck :size="13" style="color: var(--accent)" />
              <span class="font-semibold text-[var(--ink)]">Almost there</span>
            </div>
            <p class="mt-1">{{ preview?.summary || 'Finish your spec and we can price it against live quotes from verified shops.' }}</p>
          </div>
        </template>
      </div>
    </div>

    <!-- unlock gate -->
    <div v-if="locked" class="border-b px-5 py-4" style="border-color: var(--line); background: var(--panel2)">
      <div class="flex items-center gap-2 font-disp text-[14px] font-bold">
        <Lock :size="14" style="color: var(--accent)" /> Create a free account to see the price
      </div>
      <p class="mt-1.5 text-[12px] leading-relaxed text-[var(--sub)]">
        Your spec is already priced{{ specTitle !== 'Your spec' ? ` (${specTitle})` : '' }}, and it's only getting sharper —
        {{ lockedGate || 'backed by live production rate data.' }} Sign up to reveal the exact figure and send it to a verified printing manager.
      </p>
      <button
        type="button"
        class="press-key mt-3 flex w-full items-center justify-center gap-2 rounded-xl py-3 font-mono2 text-[11px] font-bold uppercase tracking-[0.16em] text-white"
        style="background: var(--accent)"
        @click="emit('unlock')"
      >
        <UserPlus :size="14" /> Unlock my price — free
      </button>
    </div>

    <!-- breakdown -->
    <button
      v-if="locked || canPrice"
      type="button"
      class="flex w-full items-center justify-between px-5 py-3 text-left"
      @click="locked ? emit('unlock') : emit('toggle-open')"
    >
      <span class="inline-flex items-center gap-1.5 font-mono2 text-[10px] font-semibold uppercase tracking-[0.16em]">
        How the price is built <Lock v-if="locked" :size="10" />
      </span>
      <ChevronDown :size="15" class="transition-transform" :style="{ transform: open && !locked ? 'rotate(180deg)' : 'none', color: 'var(--sub)' }" />
    </button>

    <Transition name="calc-open">
      <div v-if="open && !locked && canPrice" class="overflow-hidden">
        <div class="space-y-3 px-5 pb-4">
          <div>
            <div class="font-mono2 text-[9.5px] uppercase tracking-[0.16em] text-[var(--sub)]">Estimated market range</div>
            <div v-if="rangeText" class="mt-1 font-disp text-[16px] font-bold tabular-nums">{{ rangeText }}</div>
            <div v-else-if="median" class="mt-1 font-disp text-[16px] font-bold tabular-nums" style="color: var(--accent)">
              {{ ksh(median, '') }} estimated
            </div>
            <div v-if="min !== null && max !== null && max > min" class="mt-2 h-1.5 w-full rounded-full" style="background: var(--line)">
              <div class="h-1.5 rounded-full" style="background: linear-gradient(90deg, var(--accent), #f97316); width: 100%; position: relative;">
                <span class="absolute top-[-3px] h-3 w-3 -translate-x-1/2 rounded-full border-2 border-white" :style="{ left: `${rangeMeter}%`, background: 'var(--accent)' }" />
              </div>
            </div>
          </div>

          <div class="space-y-1.5 border-t pt-3" style="border-color: var(--line)">
            <div class="flex items-center gap-1.5 font-mono2 text-[9.5px] uppercase tracking-[0.16em] text-[var(--sub)]">
              <BadgeCheck :size="11" /> This price is final
            </div>
            <div v-for="[k, v] in includedRows" :key="k" class="flex items-baseline justify-between gap-3">
              <span class="font-mono2 text-[9px] uppercase tracking-[0.12em] text-[var(--sub)]">{{ k }}</span>
              <span class="text-right text-[11.5px] font-semibold">{{ v }}</span>
            </div>
          </div>

          <div v-if="preview?.warnings?.length" class="space-y-1 border-t pt-2.5" style="border-color: var(--line)">
            <li v-for="w in preview.warnings" :key="w" class="text-[10.5px] leading-snug text-[var(--sub)]">• {{ w }}</li>
          </div>
        </div>
      </div>
    </Transition>

    <div class="p-4">
      <button
        type="button"
        class="press-key flex w-full items-center justify-center gap-2 rounded-2xl py-3.5 font-mono2 text-[12px] font-bold uppercase tracking-[0.16em] text-white"
        style="background: var(--accent); box-shadow: 0 12px 30px -12px var(--glow)"
        @click="locked ? emit('unlock') : emit('submit')"
      >
        {{ locked ? 'Sign up to send this quote' : 'Request this quote' }} <ArrowRight :size="15" />
      </button>
      <p v-if="canPrice" class="mt-2.5 text-center font-mono2 text-[9px] uppercase tracking-[0.12em] text-[var(--sub)]">
        {{ locked ? 'Free account · no card required' : 'No payment now · your printing manager confirms within ~2h' }}
      </p>
    </div>
  </div>
</template>

<style scoped>
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