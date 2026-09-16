<script setup lang="ts">
import { computed } from 'vue'
import {
  ArrowRight, BadgeCheck, ChevronDown, Lock, ShieldCheck, Star, Timer,
  TrendingDown, UserPlus,
} from 'lucide-vue-next'
import {
  BROKERS, ksh, ksh2, type CalcInput, type QuoteResult,
} from '~/shared/workflow/pricing'
import Row from './Row.vue'

const props = withDefaults(defineProps<{
  q: QuoteResult
  input: CalcInput
  open: boolean
  locked?: boolean
}>(), {
  locked: false,
})

const emit = defineEmits<{ submit: []; 'toggle-open': []; unlock: [] }>()

const broker = computed(() => BROKERS.find((b) => b.id === props.input.brokerId)!)

const money = (n: number) => (props.locked ? 'KSh ———' : ksh(n))
const perUnit = (n: number) => (props.locked ? '——' : ksh2(n))
</script>

<template>
  <div class="overflow-hidden rounded-3xl border shadow-[0_8px_40px_-18px_rgba(27,23,16,.3)]" style="border-color: var(--line); background: var(--panel)">
    <div class="relative overflow-hidden p-5" style="background: color-mix(in srgb, var(--accent) 7%, transparent)">
      <div class="halftone pointer-events-none absolute inset-0 opacity-30" style="--dot: color-mix(in srgb, var(--accent) 30%, transparent)" />
      <div class="relative">
        <div class="font-mono2 text-[10px] uppercase tracking-[0.22em]">{{ locked ? 'Your price · locked' : 'Your price' }}</div>
        <div class="mt-1 flex items-end gap-2">
          <div class="font-disp text-[40px] font-bold leading-none tracking-tight" style="color: var(--accent)">{{ money(q.total) }}</div>
        </div>
        <div class="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 font-mono2 text-[10px] uppercase tracking-[0.12em] text-[var(--sub)]">
          <span><span class="font-semibold text-[var(--ink)]">{{ perUnit(q.unitPrice) }}</span> per piece</span>
          <span>{{ input.quantity.toLocaleString() }} units</span>
        </div>
        <div class="mt-3 flex flex-wrap gap-2">
          <span class="inline-flex items-center gap-1.5 rounded-full bg-[var(--panel)] px-2.5 py-1 font-mono2 text-[9.5px] uppercase tracking-[0.12em]">
            <Timer :size="10" style="color: var(--accent)" /> ready {{ q.readyBy }}
          </span>
          <span class="inline-flex items-center gap-1.5 rounded-full bg-[var(--panel)] px-2.5 py-1 font-mono2 text-[9.5px] uppercase tracking-[0.12em]">
            <ShieldCheck :size="10" style="color: var(--accent)" /> held in custody
          </span>
        </div>
      </div>
    </div>

    <!-- unlock gate -->
    <div v-if="locked" class="border-b px-5 py-4" style="border-color: var(--line); background: var(--panel2)">
      <div class="flex items-center gap-2 font-disp text-[14px] font-bold">
        <Lock :size="14" style="color: var(--accent)" /> Create a free account to see the price
      </div>
      <p class="mt-1.5 text-[12px] leading-relaxed text-[var(--sub)]">
        Your spec is already priced —
        {{ q.imposition
          ? `${q.imposition.billableSheets.toLocaleString()} sheets on ${q.imposition.sheet.label}`
          : `${q.areaSqm?.toFixed(2)} m² of material` }}
        , ready {{ q.readyBy }}. Sign up to reveal the exact figure and send it to your verified printing manager.
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

    <!-- bulk nudge -->
    <div v-if="!locked && q.tiers.length > 0 && q.tiers[0]!.save > 3" class="border-b px-5 py-3" style="border-color: var(--line); background: color-mix(in srgb, #B45309 6%, transparent)">
      <div class="flex items-center gap-1.5 font-mono2 text-[9.5px] font-semibold uppercase tracking-[0.16em]" style="color: #B45309">
        <TrendingDown :size="11" /> Bigger run, smaller unit price
      </div>
      <div class="mt-2 space-y-1">
        <div v-for="t in q.tiers.slice(0, 2)" :key="t.qty" class="flex items-center justify-between text-[11.5px]">
          <span class="text-[var(--sub)]">{{ t.qty.toLocaleString() }} pcs</span>
          <span class="font-mono2">{{ ksh2(t.unit) }}/pc</span>
          <span class="font-mono2 text-[10px] font-semibold" style="color: #B45309">−{{ t.save.toFixed(0) }}%</span>
        </div>
      </div>
    </div>

    <!-- breakdown -->
    <button type="button" class="flex w-full items-center justify-between px-5 py-3 text-left" @click="locked ? emit('unlock') : emit('toggle-open')">
      <span class="inline-flex items-center gap-1.5 font-mono2 text-[10px] font-semibold uppercase tracking-[0.16em]">
        How we got here <Lock v-if="locked" :size="10" />
      </span>
      <ChevronDown :size="15" class="transition-transform" :style="{ transform: open && !locked ? 'rotate(180deg)' : 'none', color: 'var(--sub)' }" />
    </button>

    <Transition name="calc-open">
      <div v-if="open && !locked" class="overflow-hidden">
        <div class="space-y-1.5 px-5 pb-4">
          <Row label="Printing & finishing" detail="materials · press · finishing · sourcing" :amount="q.productionWithMargin" bold />
          <Row label="Printy service fee" :detail="`${(q.feeRate * 100).toFixed(0)}% · ${q.feeReason}`" :amount="q.platformFee" />
          <Row v-if="q.servicesCost > 0" label="Services" detail="design & delivery" :amount="q.servicesCost" />
          <div class="my-2 border-t" style="border-color: var(--line)" />
          <Row label="Total" :detail="`${ksh2(q.unitPrice)} per piece`" :amount="q.total" bold accent />

          <div class="mt-3 flex items-start gap-2 rounded-xl p-3" style="background: var(--panel2)">
            <ShieldCheck :size="13" class="mt-0.5 shrink-0" style="color: var(--accent)" />
            <p class="text-[11px] leading-relaxed text-[var(--sub)]">
              <span class="font-semibold text-[var(--ink)]">Fair price guard.</span> Printy caps what a printing manager can charge
              for a job this size at
              {{ q.markupMultiple }}× fulfilment cost ({{ ksh(q.maxClientPrice) }}).
              {{ q.capped ? 'This quote was capped to that ceiling.' : 'Your quote sits comfortably under the cap.' }}
            </p>
          </div>
        </div>
      </div>
    </Transition>

    <div class="border-t px-5 py-3" style="border-color: var(--line)">
      <div class="flex items-center gap-2.5">
        <div
          class="flex h-8 w-8 items-center justify-center rounded-full font-mono2 text-[10px] font-semibold"
          :style="{ background: `hsla(${broker.hue},60%,45%,.14)`, color: `hsl(${broker.hue},60%,32%)` }"
        >
          {{ broker.initials }}
        </div>
        <div class="min-w-0 flex-1">
          <div class="flex items-center gap-1 truncate font-disp text-[13px] font-semibold">
            {{ broker.name }} <BadgeCheck :size="12" style="color: var(--accent)" />
          </div>
          <div class="font-mono2 text-[9px] uppercase tracking-[0.1em] text-[var(--sub)]">
            printing manager · {{ broker.area }} · {{ broker.onTime }}% on-time
          </div>
        </div>
        <span class="inline-flex items-center gap-1 font-mono2 text-[10px]"><Star :size="10" style="color: #B45309" /> {{ broker.rating }}</span>
      </div>
    </div>

    <div class="p-4">
      <button
        type="button"
        class="press-key flex w-full items-center justify-center gap-2 rounded-2xl py-3.5 font-mono2 text-[12px] font-bold uppercase tracking-[0.16em] text-white"
        style="background: var(--accent); box-shadow: 0 12px 30px -12px var(--glow)"
        @click="locked ? emit('unlock') : emit('submit')"
      >
        {{ locked ? 'Sign up to send this quote' : 'Request this quote' }} <ArrowRight :size="15" />
      </button>
      <p class="mt-2.5 text-center font-mono2 text-[9px] uppercase tracking-[0.12em] text-[var(--sub)]">
        {{ locked ? 'Free account · no card required' : 'No payment now · your printing manager responds within ~2h' }}
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