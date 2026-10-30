<template>
  <section v-if="visible" class="jobs-live" aria-labelledby="jobs-in-progress">
    <div class="jobs-live__head">
      <div>
        <div class="jobs-live__eyebrow">
          <span class="jobs-live__dot" aria-hidden="true" />
          Live
        </div>
        <h2 id="jobs-in-progress" class="jobs-live__title">Your jobs in progress</h2>
      </div>
      <span class="jobs-live__count">{{ store.count }} {{ store.count === 1 ? 'job' : 'jobs' }}</span>
    </div>

    <p v-if="store.error" class="jobs-live__error" role="status">
      {{ store.error }}
      <button type="button" class="jobs-live__retry" @click="refresh">Retry</button>
    </p>

    <div v-if="store.loading && !store.loaded" class="jobs-live__skeleton" aria-hidden="true">
      <span /><span /><span />
    </div>

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
  </section>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { ArrowRight } from 'lucide-vue-next'
import TrackTicket from '~/components/workbench/tracker/TrackTicket.vue'
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
.jobs-live {
  margin-bottom: 22px;
  border: 1px solid var(--line);
  border-radius: 22px;
  background: var(--panel);
  padding: 16px;
}

.jobs-live__head {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 12px;
}

.jobs-live__eyebrow {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-family: var(--font-mono2, ui-monospace, monospace);
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--accent);
}

.jobs-live__dot {
  width: 6px;
  height: 6px;
  border-radius: 999px;
  background: #2fbf71;
  box-shadow: 0 0 0 3px color-mix(in srgb, #2fbf71 18%, transparent);
}

.jobs-live__title {
  margin-top: 2px;
  font-family: var(--font-disp, inherit);
  font-size: 19px;
  font-weight: 700;
  letter-spacing: -0.01em;
  color: var(--ink);
}

.jobs-live__count {
  flex-shrink: 0;
  border-radius: 999px;
  background: var(--panel2);
  padding: 4px 9px;
  font-family: var(--font-mono2, ui-monospace, monospace);
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--sub);
}

.jobs-live__list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.jobs-live__error {
  margin-bottom: 10px;
  border-radius: 12px;
  background: color-mix(in srgb, #fb4d6d 9%, transparent);
  padding: 9px 12px;
  font-size: 12px;
  color: #b4243f;
}

.jobs-live__retry {
  margin-left: 8px;
  font-weight: 700;
  text-decoration: underline;
  text-underline-offset: 2px;
}

.jobs-live__skeleton {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.jobs-live__skeleton span {
  height: 96px;
  border-radius: 16px;
  background: linear-gradient(90deg, var(--panel2), color-mix(in srgb, var(--panel2) 55%, var(--panel)), var(--panel2));
  background-size: 200% 100%;
  animation: live-shimmer 1.4s linear infinite;
}

@keyframes live-shimmer {
  from { background-position: 200% 0; }
  to { background-position: -200% 0; }
}

@media (prefers-reduced-motion: reduce) {
  .jobs-live__skeleton span { animation: none; }
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

@media (min-width: 768px) {
  .jobs-live {
    padding: 18px 20px;
  }
}
</style>
