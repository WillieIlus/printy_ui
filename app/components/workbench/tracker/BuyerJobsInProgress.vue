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
      <TrackTicket
        v-for="job in shown"
        :key="job.id"
        :job="job"
        :now="now"
        :changed="job.id === changedJobId"
      />
    </div>

    <NuxtLink v-if="store.count > limit" to="/app/buyer#jobs" class="jobs-live__more">
      See all {{ store.count }} jobs <ArrowRight :size="13" aria-hidden="true" />
    </NuxtLink>
  </DesignBuyerSection>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { ArrowRight } from 'lucide-vue-next'
import TrackTicket from '~/components/workbench/tracker/TrackTicket.vue'
import DesignBuyerSection from '~/components/design/buyer/BuyerSection.vue'
import DesignAlert from '~/components/design/ui/Alert.vue'
import DesignLoading from '~/components/design/ui/Loading.vue'
import { useTrackedJobsStore } from '~/stores/tracked-jobs'

const store = useTrackedJobsStore()
const limit = 3
const now = ref(0)
const changedJobId = ref<number | null>(null)
let timer: ReturnType<typeof setInterval> | null = null
let changedTimer: ReturnType<typeof setTimeout> | null = null
let previousStages = new Map<number, string>()

const shown = computed(() => store.lateFirst.slice(0, limit))
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

async function refresh() {
  await store.fetch({ silent: store.loaded })
  now.value = Date.now()
  detectStageChange()
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
