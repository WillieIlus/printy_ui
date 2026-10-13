<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { Lock, Star, UserPlus, Users } from 'lucide-vue-next'
import type { RecommendedPrintManager } from '~/shared/types'
import { useIntakeStore } from '~/stores/intake'

const props = withDefaults(defineProps<{
  query: Record<string, string | number | null | undefined>
  locked?: boolean
  selectable?: boolean
  authed?: boolean
}>(), {
  locked: false,
  selectable: false,
  authed: false,
})

const emit = defineEmits<{ select: [id: number] }>()

interface ManagerCard {
  id: number
  name: string
  rating: number
  jobs: number | null
  hours: number | null
  reason: string
}

const intake = useIntakeStore()

const PLACEHOLDERS: ManagerCard[] = [
  { id: -1, name: 'James M.', rating: 4.9, jobs: 148, hours: 1.4, reason: 'Responds fast and has run this job type before.' },
  { id: -2, name: 'Sarah K.', rating: 4.8, jobs: 96, hours: 2.1, reason: 'Specialist match on your spec and finishing.' },
  { id: -3, name: 'Brian O.', rating: 4.7, jobs: 73, hours: 3.0, reason: 'Track record on quick, small-batch jobs like yours.' },
]

function toCard(m: RecommendedPrintManager, index: number): ManagerCard {
  return {
    id: m.id,
    name: m.display_name,
    rating: m.satisfaction_rating ?? 4.8,
    jobs: m.completed_jobs,
    hours: m.avg_response_hours,
    reason: m.recommendation_reason || PLACEHOLDERS[index]?.reason || '',
  }
}

const cards = computed<ManagerCard[]>(() => {
  const real = (props.authed ? intake.managers : intake.publicManagers).slice(0, 3)
  return real.length ? real.map(toCard) : PLACEHOLDERS
})

const selectedId = ref<number | null>(null)

function initials(name: string) {
  return name.split(' ').map((part) => part[0]).filter(Boolean).join('').slice(0, 2).toUpperCase() || 'PM'
}

function hoursLabel(value: number | null) {
  return value === null || value === undefined ? 'time to confirm' : `${Number(value).toFixed(1)} hrs`
}

function pick(card: ManagerCard) {
  if (!props.selectable) {
    return
  }
  selectedId.value = card.id
  emit('select', card.id)
}

let fetchTimer: ReturnType<typeof setTimeout> | null = null
function scheduleFetch() {
  if (fetchTimer) {
    clearTimeout(fetchTimer)
  }
  fetchTimer = setTimeout(() => {
    const q = props.query
    if (!q || !q.product_type || !q.quantity) {
      return
    }
    const promise = props.authed ? intake.fetchRecommendedManagers(q) : intake.fetchPublicRecommendedManagers(q)
    promise.catch(() => {})
  }, 350)
}

onMounted(scheduleFetch)
watch(() => props.query, scheduleFetch)
</script>

<template>
  <div class="mt-5">
    <div class="flex items-center gap-2 font-mono2 text-[10px] uppercase tracking-[0.18em] text-[var(--sub)]">
      <Users :size="12" style="color: var(--accent)" /> choose your print manager
    </div>
    <p v-if="selectable" class="mt-1.5 max-w-[52ch] text-[12px] leading-relaxed text-[var(--sub)]">
      Select whoever confirms and runs the job — then send it. Or let Printy assign the best available manager.
    </p>
    <div class="mt-3 grid gap-3 sm:grid-cols-3">
      <div
        v-for="(c, i) in cards"
        :key="c.id"
        class="relative flex flex-col overflow-hidden rounded-2xl border p-4"
        :style="{ borderColor: selectedId === c.id ? 'var(--accent)' : 'var(--line)', background: selectedId === c.id ? 'color-mix(in srgb, var(--accent) 7%, transparent)' : 'var(--panel2)' }"
      >
        <span
          v-if="i === 0"
          class="absolute right-3 top-3 rounded-full px-2 py-[2px] font-mono2 text-[8px] font-bold uppercase tracking-[0.12em]"
          style="background: color-mix(in srgb, var(--accent) 14%, transparent); color: var(--accent)"
        >Recommended</span>

        <div>
          <div class="flex items-center gap-2.5">
            <div class="flex h-9 w-9 shrink-0 items-center justify-center rounded-full font-mono2 text-[11px] font-semibold" style="background: color-mix(in srgb, var(--accent) 14%, transparent); color: var(--accent)">
              {{ initials(c.name) }}
            </div>
            <div class="min-w-0">
              <div class="truncate font-disp text-[13.5px] font-bold">{{ c.name }}</div>
              <div class="truncate font-mono2 text-[9px] uppercase tracking-[0.1em] text-[var(--sub)]">
                <Star :size="9" class="mb-0.5 mr-0.5 inline" style="color: var(--accent)" />
                {{ c.rating.toFixed(1) }} · {{ c.jobs ?? '—' }} jobs
              </div>
            </div>
          </div>
          <p class="mt-3 text-[11.5px] leading-relaxed text-[var(--sub)]">{{ c.reason }}</p>
          <div class="mt-3 font-mono2 text-[9px] uppercase tracking-[0.1em] text-[var(--sub)]">Responds in {{ hoursLabel(c.hours) }}</div>
        </div>

        <button
          v-if="selectable"
          type="button"
          class="press-key mt-4 inline-flex w-full items-center justify-center gap-1.5 rounded-xl px-4 py-2.5 font-mono2 text-[10px] font-bold uppercase tracking-[0.12em]"
          :style="{
            background: selectedId === c.id ? 'color-mix(in srgb, var(--accent) 16%, transparent)' : 'var(--accent)',
            color: selectedId === c.id ? 'var(--accent)' : '#fff',
          }"
          @click="pick(c)"
        >{{ selectedId === c.id ? 'Selected' : 'Select' }}</button>

        <div v-if="false && locked && !selectable" class="pointer-events-none absolute inset-0 flex items-center justify-center">
          <span class="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 font-mono2 text-[8px] uppercase tracking-[0.12em]" style="background: var(--panel); color: var(--accent)">
            <Lock :size="10" /> Sign up to meet them
          </span>
        </div>
      </div>
    </div>

    <p v-if="selectable && selectedId === null" class="mt-3 flex items-center gap-1.5 font-mono2 text-[9px] uppercase tracking-[0.12em] text-[var(--sub)]">
      <UserPlus :size="11" style="color: var(--accent)" /> none selected — Printy will pick the best available
    </p>
  </div>
</template>

<style scoped>
.obscured {
  filter: blur(6px) saturate(0.6);
  opacity: 0.85;
  pointer-events: none;
  user-select: none;
  -webkit-user-select: none;
}
</style>