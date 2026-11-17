<script setup lang="ts">
import { computed, onMounted, ref, watch, resolveComponent } from 'vue'
import { ArrowRight, BadgeCheck, ChevronDown, ChevronUp, ListTodo, ShieldCheck } from 'lucide-vue-next'
import { cx } from '../../../utils/design/cx'
import { formatDue, formatLeft } from '../../../utils/design/next-format'

export type NextActionItem = {
  job_code: string
  owner_role: string
  is_mine: boolean
  next_action: { key: string; label: string; target: string } | null
  due_at: string | null
  waiting_since: string | null
  overdue_level: 'none' | 'warn' | 'late' | string
  headline: string
  explanation: string
  reassurance: string
  waiting_label: string | null
  phase: string
  completed: boolean
}

const props = withDefaults(defineProps<{
  items: NextActionItem[]
  readOnly?: boolean
  loading?: boolean
  error?: string | null
}>(), {
  readOnly: false,
  loading: false,
  error: null,
})

const LS_PREFIX = 'printy:nextcard:'
const sheetOpen = ref(false)
const minimised = ref(false)
const NuxtLinkComponent = resolveComponent('NuxtLink')

const primary = computed(() => props.items[0])
const actionKey = computed(() => primary.value?.next_action?.key ?? null)
const more = computed(() => props.items.length - 1)

const glowLevel = computed(() => (primary.value?.is_mine ? primary.value.overdue_level : 'none'))
const beacon = computed(() => {
  if (glowLevel.value === 'late') return 'bg-red'
  if (glowLevel.value === 'warn') return 'bg-amber'
  return 'bg-brand-bright'
})

const dueLabel = computed(() => (primary.value?.due_at ? formatDue(primary.value.due_at) : null))

const shell = 'fixed z-40 inset-x-4 bottom-[calc(env(safe-area-inset-bottom,0px)+12px)] sm:inset-x-auto sm:right-6 sm:bottom-6 sm:w-[380px]'

function readMin(jobCode: string): { key: string; min: boolean } | null {
  try {
    const raw = window.localStorage.getItem(LS_PREFIX + jobCode)
    return raw ? (JSON.parse(raw) as { key: string; min: boolean }) : null
  } catch {
    return null
  }
}

function writeMin(jobCode: string, key: string, min: boolean) {
  try {
    window.localStorage.setItem(LS_PREFIX + jobCode, JSON.stringify({ key, min }))
  } catch {
    /* private mode etc. — the card simply stays expanded */
  }
}

function restore() {
  const item = primary.value
  if (!item) return
  const stored = readMin(item.job_code)
  if (!stored) return
  if (stored.key !== actionKey.value) writeMin(item.job_code, actionKey.value ?? '-', false)
  else minimised.value = stored.min
}

onMounted(() => {
  restore()
})

watch(
  () => [primary.value?.job_code, actionKey.value] as const,
  () => restore(),
)

function toggleMin() {
  const next = !minimised.value
  minimised.value = next
  if (primary.value) writeMin(primary.value.job_code, actionKey.value ?? '-', next)
}
</script>

<template>
  <div v-if="props.loading" :class="shell" aria-busy="true">
    <div class="animate-pulse rounded-[28px] border border-ink bg-ink p-6 shadow-lift">
      <div class="h-3 w-24 rounded bg-paper/15" />
      <div class="mt-4 h-6 w-3/4 rounded bg-paper/15" />
      <div class="mt-3 h-3 w-1/2 rounded bg-paper/10" />
      <div class="mt-6 h-12 rounded-full bg-paper/10" />
    </div>
  </div>

  <div v-else-if="props.error" :class="shell" role="alert">
    <div class="rounded-[28px] border border-red/40 bg-ink p-5 text-paper shadow-lift">
      <p class="font-mono text-[10px] tracking-[0.2em] text-red uppercase">Next step</p>
      <p class="mt-2 text-[13px] text-paper/80">{{ props.error }}</p>
    </div>
  </div>

  <template v-else-if="primary">
    <div v-if="minimised" :class="shell" data-test="next-step-card">
      <button
        type="button"
        class="flex min-h-[44px] w-full cursor-pointer items-center justify-between gap-3 rounded-full border border-ink bg-ink px-4 py-2.5 text-paper shadow-lift focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
        @click="toggleMin"
      >
        <span class="flex min-w-0 items-center gap-2.5">
          <span class="h-2 w-2 shrink-0 rounded-full" :class="beacon" aria-hidden="true" />
          <span class="truncate text-[13px] font-semibold">
            {{ props.readOnly ? (primary.waiting_label ?? primary.headline) : primary.headline }}
          </span>
          <span class="tabular shrink-0 font-mono text-[10.5px] text-paper/50">
            {{ primary.job_code }}
          </span>
        </span>
        <ChevronUp class="h-4 w-4 shrink-0 text-paper/60" />
      </button>
    </div>

    <div v-else :class="shell" data-test="next-step-card">
      <component
        :is="props.readOnly || !primary.is_mine || !primary.next_action ? 'div' : NuxtLinkComponent"
        v-bind="props.readOnly || !primary.is_mine || !primary.next_action ? {} : { to: primary.next_action?.target }"
        class="block min-h-[44px] rounded-[28px] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand"
        :aria-label="props.readOnly || !primary.is_mine || !primary.next_action ? undefined : `${primary.next_action?.label} — ${primary.job_code}`"
      >
        <div
          class="relative overflow-hidden rounded-[28px] border border-ink bg-ink p-6 text-paper shadow-lift"
          :class="[
            primary.is_mine && !props.readOnly && 'na-glow',
            primary.is_mine && !props.readOnly && glowLevel === 'warn' && 'na-glow-warn',
            primary.is_mine && !props.readOnly && glowLevel === 'late' && 'na-glow-late',
          ]"
        >
          <span class="halftone pointer-events-none absolute top-4 right-4 h-24 w-24 opacity-40" aria-hidden="true" />

          <div class="flex items-start justify-between gap-3">
            <p class="font-mono text-[10px] font-semibold tracking-[0.22em] text-paper/50 uppercase">
              {{ primary.is_mine && !props.readOnly ? 'Your turn' : 'Next step' }}
            </p>
            <span class="relative z-10 text-brand-bright">
              <BadgeCheck class="h-5 w-5" :stroke-width="2" />
            </span>
          </div>

          <h4 class="relative z-10 mt-3 text-[24px] leading-tight font-bold tracking-tight text-white">
            {{ props.readOnly ? (primary.waiting_label ?? primary.headline) : primary.headline }}
          </h4>
          <p class="relative z-10 mt-1.5 text-[13px] leading-relaxed text-paper/60">
            {{ primary.explanation }}
          </p>

          <div class="relative z-10 mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 font-mono text-[10.5px] text-paper/50">
            <span class="tabular">{{ primary.job_code }}</span>
            <span v-if="dueLabel" class="tabular">due {{ dueLabel }}</span>
            <span v-if="primary.waiting_since && !primary.completed" class="tabular">
              waiting {{ formatLeft(primary.waiting_since).replace(' left', '') }}
            </span>
            <span
              v-if="primary.overdue_level !== 'none'"
              class="font-semibold uppercase"
              :class="primary.overdue_level === 'late' ? 'text-red' : 'text-amber'"
            >
              {{ primary.overdue_level === 'late' ? '48h+ overdue' : '24h+ overdue' }}
            </span>
          </div>

          <span
            v-if="!props.readOnly && primary.is_mine && primary.next_action"
            class="relative z-10 mt-5 flex min-h-[52px] w-full items-center justify-center gap-2 rounded-full bg-brand px-6 text-[15px] font-bold tracking-tight text-white"
          >
            {{ primary.next_action.label }}
            <ArrowRight class="h-4 w-4" />
          </span>
          <p
            v-if="!props.readOnly && primary.is_mine"
            class="relative z-10 mt-3 flex items-center justify-center gap-1.5 text-[11.5px] text-paper/50"
          >
            <ShieldCheck class="h-3.5 w-3.5" />
            {{ primary.reassurance }}
          </p>
          <p
            v-if="props.readOnly || !primary.is_mine"
            class="relative z-10 mt-4 flex items-center gap-2 text-[12px] text-paper/55"
          >
            <span class="h-1.5 w-1.5 rounded-full" :class="beacon" aria-hidden="true" />
            {{ primary.waiting_label }}
            <span v-if="primary.owner_role !== 'platform' && dueLabel"> · due {{ dueLabel }}</span>
          </p>

          <div class="relative z-10 mt-4 flex items-center justify-between border-t border-paper/10 pt-3">
            <button
              type="button"
              class="inline-flex min-h-[32px] cursor-pointer items-center gap-1 font-mono text-[10px] tracking-[0.12em] text-paper/45 uppercase hover:text-paper"
              @click.stop.prevent="toggleMin"
            >
              <ChevronDown class="h-3.5 w-3.5" /> Minimise
            </button>
            <button
              v-if="more > 0"
              type="button"
              class="inline-flex min-h-[32px] cursor-pointer items-center gap-1.5 rounded-full border border-paper/20 px-3 font-mono text-[10.5px] font-semibold text-paper/80 hover:border-paper/50"
              @click.stop.prevent="sheetOpen = true"
            >
              <ListTodo class="h-3.5 w-3.5" /> +{{ more }} more
            </button>
          </div>
        </div>
      </component>
    </div>

    <div v-if="sheetOpen" class="fixed inset-0 z-50 flex items-end justify-center bg-ink/50 p-4 backdrop-blur-sm sm:items-center">
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Jobs waiting on you"
        class="w-full max-w-md overflow-hidden rounded-[24px] border border-line bg-card shadow-lift"
      >
        <div class="flex items-center justify-between border-b border-line px-5 py-4">
          <p class="font-mono text-[10px] font-semibold tracking-[0.18em] text-ink-3 uppercase">
            Waiting on you · {{ props.items.length }}
          </p>
          <button
            type="button"
            class="cursor-pointer font-mono text-[10px] tracking-[0.12em] text-ink-3 uppercase hover:text-ink"
            @click="sheetOpen = false"
          >
            Close
          </button>
        </div>
        <ul class="max-h-[60vh] overflow-y-auto">
          <li v-for="it in props.items" :key="it.job_code" class="border-b border-line/60 last:border-b-0">
            <NuxtLink
              :to="it.next_action?.target ?? '/'"
              class="flex items-center justify-between gap-3 px-5 py-4 transition-colors hover:bg-paper-2"
              @click="sheetOpen = false"
            >
              <span class="min-w-0">
                <span class="tabular block font-mono text-[12px] font-semibold">{{ it.job_code }}</span>
                <span class="block truncate text-[13px] text-ink-2">{{ it.headline }}</span>
              </span>
              <span class="tabular shrink-0 font-mono text-[10.5px] text-ink-3">
                {{ it.due_at ? formatDue(it.due_at) : '' }}
              </span>
            </NuxtLink>
          </li>
        </ul>
      </div>
    </div>
  </template>
</template>
