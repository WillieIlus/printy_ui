<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { Lock, Star, Users } from 'lucide-vue-next'
import { useIntakeStore } from '~/stores/intake'

const props = withDefaults(defineProps<{
  query: Record<string, string | number | null | undefined>
  locked?: boolean
}>(), {
  locked: true,
})

interface ManagerCard {
  id: number | string
  name: string
  rating: number
  jobs: number | null
  hours: number | null
}

const intake = useIntakeStore()

const PLACEHOLDERS: ManagerCard[] = [
  { id: 'james', name: 'James M.', rating: 4.9, jobs: 148, hours: 1.4 },
  { id: 'sarah', name: 'Sarah K.', rating: 4.8, jobs: 96, hours: 2.1 },
  { id: 'brian', name: 'Brian O.', rating: 4.7, jobs: 73, hours: 3.0 },
]

const cards = computed<ManagerCard[]>(() => {
  const real = intake.publicManagers.slice(0, 3)
  if (real.length) {
    return real.map((m) => ({
      id: m.id,
      name: m.display_name,
      rating: m.satisfaction_rating ?? 4.8,
      jobs: m.completed_jobs,
      hours: m.avg_response_hours,
    }))
  }
  return PLACEHOLDERS
})

function initials(name: string) {
  return name.split(' ').map((part) => part[0]).filter(Boolean).join('').slice(0, 2).toUpperCase() || 'PM'
}

function hoursLabel(value: number | null) {
  return value === null || value === undefined ? 'time to confirm' : `${Number(value).toFixed(1)} hrs`
}

let fetchTimer: ReturnType<typeof setTimeout> | null = null
function scheduleFetch() {
  if (fetchTimer) {
    clearTimeout(fetchTimer)
  }
  fetchTimer = setTimeout(() => {
    const q = props.query
    if (q && q.product_type && q.quantity) {
      intake.fetchPublicRecommendedManagers(q).catch(() => {})
    }
  }, 350)
}

onMounted(scheduleFetch)
watch(() => props.query, scheduleFetch)
</script>

<template>
  <div class="mt-5">
    <div class="flex items-center gap-2 font-mono2 text-[10px] uppercase tracking-[0.18em] text-[var(--sub)]">
      <Users :size="12" style="color: var(--accent)" /> verified printing managers ready to quote
    </div>
    <div class="mt-3 grid gap-3 sm:grid-cols-3">
      <div
        v-for="(c, i) in cards"
        :key="c.id"
        class="relative overflow-hidden rounded-2xl border p-4"
        style="border-color: var(--line); background: var(--panel2)"
      >
        <span
          v-if="i === 0"
          class="absolute right-3 top-3 rounded-full px-2 py-[2px] font-mono2 text-[8px] font-bold uppercase tracking-[0.12em]"
          style="background: color-mix(in srgb, var(--accent) 14%, transparent); color: var(--accent)"
        >Recommended</span>

        <div :class="{ obscured: locked }" :aria-hidden="locked ? 'true' : undefined">
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
          <div class="mt-3 font-mono2 text-[9px] uppercase tracking-[0.1em] text-[var(--sub)]">Responds in {{ hoursLabel(c.hours) }}</div>
        </div>

        <div v-if="locked" class="pointer-events-none absolute inset-0 flex items-center justify-center">
          <span class="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 font-mono2 text-[8px] uppercase tracking-[0.12em]" style="background: var(--panel); color: var(--accent)">
            <Lock :size="10" /> Sign up to meet them
          </span>
        </div>
      </div>
    </div>
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
