<template>
  <!--
    Shared job/quote card footer (F1.2).

    A role-aware strip that fills ExpandableCard's #footer slot. It renders only
    values the caller passes in, drawn from the role-projected API — it never
    derives prices, margins or identity. Privacy gates (law Part 5) are enforced
    by role: the buyer footer never shows shop identity or production cost, and
    the printer footer never shows client identity or client amounts.
  -->
  <div data-test="job-card-footer" :data-role="role" class="flex flex-wrap items-center gap-x-5 gap-y-2">
    <!-- job code: every role may see their own job code -->
    <div v-if="jobCode" data-test="footer-code" class="flex items-center gap-1.5">
      <Hash :size="11" style="color: var(--accent)" />
      <span class="font-mono2 text-[10px] font-semibold uppercase tracking-[0.12em]" :style="{ color: 'var(--ink)' }">{{ jobCode }}</span>
    </div>

    <!-- current holder: shown as a role label the caller already resolved -->
    <div v-if="showHolder && holder" data-test="footer-holder" class="flex items-center gap-1.5">
      <UserRound :size="11" class="text-[var(--sub)]" />
      <span class="font-mono2 text-[9.5px] uppercase tracking-[0.1em] text-[var(--sub)]">{{ holderLabel }}</span>
    </div>

    <!-- next action: what happens next, from the projected timing -->
    <div v-if="showNextAction && nextAction" data-test="footer-next-action" class="flex min-w-0 items-center gap-1.5">
      <ArrowRight :size="11" class="text-[var(--sub)]" />
      <span class="truncate font-mono2 text-[9.5px] uppercase tracking-[0.1em] text-[var(--sub)]">{{ nextAction }}</span>
    </div>

    <!-- due date -->
    <div v-if="showDue && dueLabel" data-test="footer-due" class="flex items-center gap-1.5">
      <CalendarClock :size="11" class="text-[var(--sub)]" />
      <span class="font-mono2 text-[9.5px] uppercase tracking-[0.1em] text-[var(--sub)]">
        Due <span class="font-semibold" :style="{ color: 'var(--ink)' }">{{ dueLabel }}</span>
      </span>
    </div>

    <!-- SLA remaining (buyer + manager only) -->
    <div v-if="showSla && slaLabel" data-test="footer-sla" class="flex items-center gap-1.5">
      <Timer :size="11" :style="{ color: isLate ? '#C81E44' : 'var(--sub)' }" />
      <span class="font-mono2 text-[9.5px] font-semibold uppercase tracking-[0.1em]" :style="{ color: isLate ? '#C81E44' : 'var(--sub)' }">
        {{ slaLabel }}
      </span>
    </div>

    <!-- price-change state (buyer only; totals are shown exactly as supplied) -->
    <div v-if="showPriceUpdate && priceUpdated" data-test="footer-price-update" class="flex items-center gap-1.5">
      <TriangleAlert :size="11" style="color: #B45309" />
      <span class="font-mono2 text-[9.5px] uppercase tracking-[0.1em]" style="color: #B45309">
        <span class="line-through">{{ priceUpdated.oldTotal }}</span>
        <span class="px-1">→</span>
        <span class="font-semibold">{{ priceUpdated.newTotal }}</span>
      </span>
    </div>

    <!-- dispatch state (manager only) -->
    <div v-if="showDispatch && dispatchState" data-test="footer-dispatch" class="flex items-center gap-1.5">
      <Rocket :size="11" style="color: var(--accent)" />
      <span class="font-mono2 text-[9.5px] uppercase tracking-[0.1em] text-[var(--sub)]">{{ dispatchState }}</span>
    </div>

    <!-- caller-controlled actions, right aligned -->
    <div v-if="$slots.actions" class="ml-auto flex flex-wrap items-center gap-2">
      <slot name="actions" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { ArrowRight, CalendarClock, Hash, Rocket, Timer, TriangleAlert, UserRound } from 'lucide-vue-next'
import { formatMinutes } from '~/shared/list-sections'
import { formatNairobiDate } from '~/shared/nairobi'

export type JobCardFooterRole = 'buyer' | 'manager' | 'printer'

const props = withDefaults(
  defineProps<{
    role: JobCardFooterRole
    jobCode?: string
    holder?: string
    nextAction?: string | null
    dueDate?: string | null
    slaMinutes?: number | null
    isLate?: boolean
    priceUpdated?: { oldTotal: string; newTotal: string } | null
    dispatchState?: string
  }>(),
  {
    jobCode: '',
    holder: '',
    nextAction: '',
    dueDate: null,
    slaMinutes: null,
    isLate: false,
    priceUpdated: null,
    dispatchState: '',
  }
)

// Privacy gates (law Part 5). Holder/next-action/due are role-neutral labels the
// caller already resolved; SLA and price-change states are buyer/manager facing;
// dispatch state is manager facing.
const showHolder = computed(() => props.role === 'buyer' || props.role === 'manager')
const showNextAction = computed(() => props.role === 'buyer' || props.role === 'manager')
const showDue = computed(() => props.role === 'buyer' || props.role === 'manager')
const showSla = computed(() => props.role === 'buyer' || props.role === 'manager')
const showPriceUpdate = computed(() => props.role === 'buyer')
const showDispatch = computed(() => props.role === 'manager')

const holderLabel = computed(() => (props.holder ? `With ${props.holder}` : ''))

const dueLabel = computed(() => formatNairobiDate(props.dueDate))

const slaLabel = computed(() => {
  const minutes = props.slaMinutes
  if (minutes === null || minutes === undefined) return ''
  if (minutes <= 0) return props.isLate ? 'Overdue' : 'Due now'
  return `${formatMinutes(minutes)} left`
})
</script>
