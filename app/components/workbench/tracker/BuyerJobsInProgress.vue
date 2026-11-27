<template>
  <DesignBuyerSection
    v-if="visible"
    id="jobs-in-progress"
    index="00"
    title="Your jobs in progress"
    hint="Live · the same workflow across every dashboard"
    class="jobs-live"
  >
    <template #action>
      <span class="inline-flex items-center gap-1.5 rounded-full border border-line bg-card px-2.5 py-1 font-mono text-[9.5px] font-semibold uppercase tracking-[0.12em] text-ink-2">
        <span class="h-1.5 w-1.5 rounded-full bg-green" aria-hidden="true" />
        {{ store.count }} {{ store.count === 1 ? 'job' : 'jobs' }} live
      </span>
    </template>

    <DesignAlert v-if="store.error" tone="error" class="jobs-live__error">
      {{ store.error }}
      <template #actions>
        <button type="button" class="jobs-live__retry" @click="refresh">Retry</button>
      </template>
    </DesignAlert>

    <DesignLoading
      v-if="store.loading && !store.loaded"
      variant="skeleton"
      :rows="3"
      label="Loading your live jobs…"
    />

    <div v-else class="jobs-live__list">
      <template v-for="job in shown" :key="job.id">
        <DesignJobCard
          v-if="cards[job.id]"
          :card="cards[job.id]"
          viewer-role="buyer"
          :fallback-target="`/app/buyer/jobs/${job.id}`"
          @updated="(card: JobCardEnvelope) => onCardUpdated(job.id, card)"
          @note-added="refreshCards"
        />
        <TrackTicket
          v-else
          :job="job"
          :now="now"
          :changed="job.id === changedJobId"
        />
      </template>
    </div>
  </DesignBuyerSection>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import TrackTicket from '~/components/workbench/tracker/TrackTicket.vue'
import DesignJobCard from '~/components/design/job/JobCard.vue'
import DesignBuyerSection from '~/components/design/buyer/BuyerSection.vue'
import DesignAlert from '~/components/design/ui/Alert.vue'
import DesignLoading from '~/components/design/ui/Loading.vue'
import { useTrackedJobsStore } from '~/stores/tracked-jobs'
import { API } from '~/shared/api-paths'
import type { JobCardEnvelope } from '~/shared/job-card'

const store = useTrackedJobsStore()
const { api } = useApi()
const cards = ref<Record<number, JobCardEnvelope>>({})
const now = ref(0)
const changedJobId = ref<number | null>(null)
let timer: ReturnType<typeof setInterval> | null = null
let changedTimer: ReturnType<typeof setTimeout> | null = null
let previousStages = new Map<number, string>()

const shown = computed(() => store.lateFirst)
const visible = computed(() => store.items.length > 0 || (store.loading && !store.loaded))

function rememberStages() {
  const next = new Map<number, string>()
  for (const job of store.items) next.set(job.id, job.current_stage_key)
  return next
}

function detectStageChange() {
  if (previousStages.size) {
    const changed = store.items.find((job) => {
      const before = previousStages.get(job.id)
      return before && before !== job.current_stage_key
    })
    if (changed) {
      changedJobId.value = changed.id
      if (changedTimer) clearTimeout(changedTimer)
      changedTimer = setTimeout(() => {
        changedJobId.value = null
        changedTimer = null
      }, 1600)
    }
  }
  previousStages = rememberStages()
}

async function refreshCards() {
  const jobs = shown.value
  if (!jobs.length) {
    cards.value = {}
    return
  }
  const entries = await Promise.all(jobs.map(async (job) => {
    try {
      const card = await api<JobCardEnvelope>(API.managedJobs.card(job.id))
      return card && Array.isArray(card.jobs) ? [job.id, card] as const : null
    } catch {
      return null
    }
  }))
  cards.value = Object.fromEntries(entries.filter((entry): entry is readonly [number, JobCardEnvelope] => Boolean(entry)))
}

function onCardUpdated(jobId: number, card: JobCardEnvelope) {
  if (card && Array.isArray(card.jobs)) cards.value = { ...cards.value, [jobId]: card }
  void store.fetch({ silent: true })
}

async function refresh() {
  await store.fetch({ silent: store.loaded })
  now.value = Date.now()
  detectStageChange()
  await refreshCards()
}

function onVisibility() {
  if (document.visibilityState === 'visible') void refresh()
}

onMounted(async () => {
  now.value = Date.now()
  await refresh()
  rememberStages()
  timer = setInterval(() => {
    now.value = Date.now()
    void refresh()
  }, 30_000)
  document.addEventListener('visibilitychange', onVisibility)
  window.addEventListener('focus', onVisibility)
})

onBeforeUnmount(() => {
  if (timer) clearInterval(timer)
  if (changedTimer) clearTimeout(changedTimer)
  document.removeEventListener('visibilitychange', onVisibility)
  window.removeEventListener('focus', onVisibility)
})

watch(
  () => store.items.map((job) => `${job.id}:${job.current_stage_key}`).join('|'),
  () => detectStageChange(),
)
</script>

<style scoped>
.jobs-live__list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.jobs-live__error {
  margin-bottom: 10px;
}

.jobs-live__retry {
  font-weight: 700;
  text-decoration: underline;
  text-underline-offset: 2px;
}

.jobs-live__more {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  margin-top: 12px;
  font-family: var(--font-mono2, ui-monospace, monospace);
  font-size: 9.5px;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--accent);
}
</style>
