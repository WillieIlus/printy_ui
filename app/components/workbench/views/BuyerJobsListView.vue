<script setup lang="ts">
/**
 * Buyer jobs list.
 *
 * A list, not a dashboard: each row identifies the job, its current stage and
 * the next action, and links to the canonical buyer job detail. Overview-only
 * sections (managers, quotes, notifications) stay on /app/buyer.
 */
import { computed, onMounted, ref } from 'vue'
import { ArrowLeft, ArrowRight, CalendarClock, RefreshCw } from 'lucide-vue-next'
import DesignBuyerSurface from '~/components/design/buyer/BuyerSurface.vue'
import DesignBuyerPageHeader from '~/components/design/buyer/BuyerPageHeader.vue'
import DesignCard from '~/components/design/ui/Card.vue'
import DesignAlert from '~/components/design/ui/Alert.vue'
import DesignLoading from '~/components/design/ui/Loading.vue'
import DesignEmptyNote from '~/components/design/ui/EmptyNote.vue'
import { useTrackedJobsStore } from '~/stores/tracked-jobs'
import type { TrackedJob } from '~/shared/types'
import { formatLeft, formatWhen } from '~/utils/printy'

const store = useTrackedJobsStore()

const filter = ref<'all' | 'needs' | 'progress' | 'done'>('all')

const jobs = computed(() => {
  const items = store.lateFirst
  if (filter.value === 'needs') return items.filter(job => job.next_step?.is_mine && job.current_stage_key !== 'delivered')
  if (filter.value === 'progress') return items.filter(job => job.current_stage_key !== 'delivered')
  if (filter.value === 'done') return items.filter(job => job.current_stage_key === 'delivered')
  return items
})

function stageTone(job: TrackedJob) {
  if (job.current_stage_key === 'delivered') return 'bg-green-soft text-green'
  if (job.is_late) return 'bg-red-soft text-red'
  if (job.next_step?.is_mine) return 'bg-amber-soft text-amber'
  return 'bg-mint text-brand-deep'
}

function nextActionLabel(job: TrackedJob) {
  if (job.current_stage_key === 'delivered') return 'Completed'
  if (job.next_step?.is_mine) return job.next_step.next_action?.label || job.next_step.headline || 'Needs you'
  return job.next_step?.headline || `Waiting on ${job.next_step?.owner_role || 'the next step'}`
}

function dueLabel(job: TrackedJob) {
  if (!job.due_at) return 'No due date'
  return `Due ${formatWhen(job.due_at)}`
}

function timeLabel(job: TrackedJob) {
  if (job.current_stage_key === 'delivered') return 'Delivered'
  if (job.is_late) return 'Running late'
  if (!job.estimated_remaining_minutes || job.estimated_remaining_minutes <= 0) return 'Due now'
  return `${formatLeft(job.estimated_remaining_minutes)} left`
}

onMounted(() => {
  void store.fetch()
})
</script>

<template>
  <DesignBuyerSurface>
    <div class="mx-auto flex w-full max-w-[1080px] flex-col gap-6 pb-40">
      <NuxtLink
        to="/app/buyer"
        class="inline-flex w-fit items-center gap-1.5 font-mono text-[10px] font-semibold tracking-[0.14em] text-ink-3 uppercase transition-colors hover:text-brand"
      >
        <ArrowLeft :size="12" /> Back to overview
      </NuxtLink>

      <DesignBuyerPageHeader
        index="MJ"
        kicker="Buyer desk"
        title="My jobs"
        description="Every paid job in one list. Open a job to see its full detail, artwork and next action."
      />

      <div class="flex flex-wrap gap-2" role="tablist" aria-label="Filter jobs">
        <button
          v-for="option in [{ key: 'all', label: 'All' }, { key: 'needs', label: 'Needs you' }, { key: 'progress', label: 'In progress' }, { key: 'done', label: 'Completed' }]"
          :key="option.key"
          type="button"
          role="tab"
          :aria-selected="filter === option.key"
          class="rounded-full border px-3.5 py-2 text-[11.5px] font-semibold transition-colors"
          :class="filter === option.key ? 'border-brand bg-mint text-brand-deep' : 'border-line bg-card text-ink-2 hover:border-line-strong hover:text-ink'"
          @click="filter = option.key as typeof filter"
        >
          {{ option.label }}
        </button>
      </div>

      <DesignLoading v-if="store.loading && !store.loaded" variant="skeleton" :rows="4" label="Loading your jobs…" />

      <DesignAlert v-else-if="store.error && !store.hasJobs" tone="error" title="We couldn't load your jobs">
        {{ store.error }}
        <template #actions>
          <button class="inline-flex items-center gap-2 rounded-xl bg-brand px-4 py-2 text-[12px] font-semibold text-white" @click="store.fetch()">
            <RefreshCw :size="12" /> Try again
          </button>
        </template>
      </DesignAlert>

      <DesignCard v-else-if="jobs.length" class="overflow-hidden">
        <ul data-test="buyer-jobs-list" class="divide-y divide-line">
          <li v-for="job in jobs" :key="job.id">
            <NuxtLink
              :to="`/app/buyer/jobs/${job.id}`"
              data-test="buyer-job-row"
              class="group flex flex-wrap items-start justify-between gap-4 px-5 py-4 transition-colors hover:bg-paper-2"
              :aria-label="`Open job ${job.job_code}`"
            >
              <div class="min-w-0 flex-1">
                <div class="flex flex-wrap items-center gap-2">
                  <span class="font-mono text-[10.5px] font-semibold tracking-[0.1em] text-ink-3">{{ job.job_code }}</span>
                  <span class="rounded-full px-2.5 py-[2px] font-mono text-[9px] font-semibold tracking-[0.1em] uppercase" :class="stageTone(job)">
                    {{ job.current_stage }}
                  </span>
                  <span v-if="job.is_late && job.current_stage_key !== 'delivered'" class="rounded-full bg-red-soft px-2.5 py-[2px] font-mono text-[9px] font-semibold tracking-[0.1em] text-red uppercase">Late</span>
                </div>
                <p class="mt-1 truncate text-[15px] font-bold tracking-tight text-ink">{{ job.title }}</p>
                <p class="mt-0.5 text-[12px] text-ink-2">{{ nextActionLabel(job) }}</p>
              </div>
              <div class="flex shrink-0 flex-col items-end gap-1 text-right">
                <p class="flex items-center gap-1 font-mono text-[10px] tracking-[0.06em] text-ink-2">
                  <CalendarClock :size="11" /> {{ dueLabel(job) }}
                </p>
                <p class="font-mono text-[11px] font-semibold" :class="job.is_late ? 'text-red' : 'text-brand-deep'">{{ timeLabel(job) }}</p>
                <span class="inline-flex items-center gap-1 font-mono text-[9px] font-semibold tracking-[0.1em] text-brand uppercase">
                  Open <ArrowRight :size="11" />
                </span>
              </div>
            </NuxtLink>
          </li>
        </ul>
      </DesignCard>

      <DesignEmptyNote
        v-else
        icon="PackageCheck"
        title="No jobs here yet"
        hint="Paid jobs appear here as soon as a quote is accepted and production starts."
      />
    </div>
  </DesignBuyerSurface>
</template>
