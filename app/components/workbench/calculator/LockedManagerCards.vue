<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { Loader2, Star, UserPlus, Users } from 'lucide-vue-next'
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

const emit = defineEmits<{ select: [id: number, name: string] }>()

interface ManagerCard {
  id: number
  name: string
  rating: number | null
  jobs: number | null
  hours: number | null
  onTimeRate: number | null
  reason: string
}

const intake = useIntakeStore()

function toCard(m: RecommendedPrintManager): ManagerCard {
  return {
    id: m.id,
    name: m.display_name,
    rating: typeof m.satisfaction_rating === 'number' ? m.satisfaction_rating : null,
    jobs: typeof m.completed_jobs === 'number' ? m.completed_jobs : null,
    hours: typeof m.avg_response_hours === 'number' ? m.avg_response_hours : null,
    onTimeRate: typeof m.on_time_rate === 'number' ? m.on_time_rate : null,
    reason: m.recommendation_reason || '',
  }
}

const loading = computed(() => (props.authed ? intake.loading : intake.loadingPublic))

const cards = computed<ManagerCard[]>(() => {
  const real = (props.authed ? intake.managers : intake.publicManagers).slice(0, 3)
  return real.map(toCard)
})

const selectedId = ref<number | null>(null)

function initials(name: string) {
  return name.split(' ').map((part) => part[0]).filter(Boolean).join('').slice(0, 2).toUpperCase() || 'PM'
}

function hoursLabel(value: number | null) {
  return value === null ? 'time to confirm' : `${Number(value).toFixed(1)} hrs`
}

function pick(card: ManagerCard) {
  if (!props.selectable) {
    return
  }
  selectedId.value = card.id
  emit('select', card.id, card.name)
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

    <div v-if="loading && !cards.length" class="mt-3 flex items-center gap-2 text-[12.5px] text-[var(--sub)]">
      <Loader2 :size="14" class="animate-spin" style="color: var(--accent)" /> Finding available managers…
    </div>

    <p v-else-if="!cards.length" class="mt-3 max-w-[52ch] rounded-2xl border px-4 py-3 text-[12.5px] leading-relaxed text-[var(--sub)]" :style="{ borderColor: 'var(--line)', background: 'var(--panel2)' }">
      No matching Print Manager is available for this spec right now. Printy will assign the best available manager once you send your job.
    </p>

    <div v-else class="mt-3 grid gap-3 sm:grid-cols-3">
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
              <div v-if="c.rating !== null || c.jobs !== null" class="truncate font-mono2 text-[9px] uppercase tracking-[0.1em] text-[var(--sub)]">
                <template v-if="c.rating !== null">
                  <Star :size="9" class="mb-0.5 mr-0.5 inline" style="color: var(--accent)" />
                  {{ c.rating.toFixed(1) }}
                </template>
                <template v-if="c.rating !== null && c.jobs !== null"> · </template>
                <template v-if="c.jobs !== null">{{ c.jobs }} jobs</template>
              </div>
            </div>
          </div>
          <p v-if="c.reason" class="mt-3 text-[11.5px] leading-relaxed text-[var(--sub)]">{{ c.reason }}</p>
          <div class="mt-3 font-mono2 text-[9px] uppercase tracking-[0.1em] text-[var(--sub)]">Responds in {{ hoursLabel(c.hours) }}</div>
          <div
            v-if="c.onTimeRate !== null"
            class="mt-1 font-mono2 text-[9px] uppercase tracking-[0.1em] text-[var(--sub)]"
          >{{ c.onTimeRate }}% delivered on time</div>
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
      </div>
    </div>

    <p v-if="selectable && cards.length && selectedId === null" class="mt-3 flex items-center gap-1.5 font-mono2 text-[9px] uppercase tracking-[0.12em] text-[var(--sub)]">
      <UserPlus :size="11" style="color: var(--accent)" /> none selected — Printy will pick the best available
    </p>
  </div>
</template>
