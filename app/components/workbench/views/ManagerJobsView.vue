<script setup lang="ts">
/**
 * Manager jobs list.
 *
 * A list only: code, title, client, current stage, next action and due date.
 * Every decision and the full job card live on /app/manager/jobs/:id.
 */
import { computed, onMounted } from 'vue'
import { ArrowLeft, ArrowRight, CalendarClock, RefreshCw } from 'lucide-vue-next'
import DesignManagerSurface from '~/components/design/manager/ManagerSurface.vue'
import DesignManagerPageHeader from '~/components/design/manager/ManagerPageHeader.vue'
import DesignCard from '~/components/design/ui/Card.vue'
import DesignAlert from '~/components/design/ui/Alert.vue'
import DesignLoading from '~/components/design/ui/Loading.vue'
import DesignEmptyNote from '~/components/design/ui/EmptyNote.vue'
import { useManagerStore } from '~/stores/manager'
import { isMuted, needsAttention, sectionsFromServer } from '~/shared/list-sections'
import type { ManagerJobRow } from '~/shared/types'

const m = useManagerStore()

const jobSections = computed(() => sectionsFromServer(m.jobs))

function stageTone(job: ManagerJobRow) {
  const status = String(job.status || '').toLowerCase()
  if (status.includes('complete') || status.includes('delivered')) return 'bg-green-soft text-green'
  if (job.timing?.is_late) return 'bg-red-soft text-red'
  if (needsAttention(job)) return 'bg-amber-soft text-amber'
  return 'bg-mint text-brand-deep'
}

function nextAction(job: ManagerJobRow) {
  return job.timing?.next_action || (job.payment_confirmed ? 'Assign a printer' : 'Waiting for payment')
}

function dueLabel(job: ManagerJobRow) {
  return job.timing?.due_date ? `Due ${new Date(job.timing.due_date).toLocaleDateString('en-KE', { day: 'numeric', month: 'short' })}` : 'No due date'
}

onMounted(() => {
  void m.fetchJobs()
})
</script>

<template>
  <DesignManagerSurface>
    <div class="flex flex-col gap-8 pb-32">
      <div class="flex flex-col gap-3">
        <NuxtLink
          to="/app/manager"
          class="inline-flex w-fit items-center gap-1.5 font-mono text-[10px] tracking-[0.16em] text-ink-3 uppercase transition-colors hover:text-brand"
        >
          <ArrowLeft :size="12" /> Back to dashboard
        </NuxtLink>
        <DesignManagerPageHeader
          index="MJ"
          kicker="Manager desk"
          title="Jobs"
          subtitle="Every paid job in one list."
          description="Open a job to see its full card, workflow, artwork, settlement and next action."
        />
      </div>

      <DesignLoading v-if="m.loading && !m.hasJobs" label="Loading jobs in progress…" />

      <DesignAlert v-else-if="m.error && !m.hasJobs" tone="error">
        <p class="max-w-[52ch] leading-relaxed">{{ m.error }}</p>
        <template #actions>
          <button class="inline-flex items-center gap-2 rounded-xl bg-brand px-4 py-2 font-mono text-[10px] font-semibold tracking-[0.14em] text-white uppercase" @click="m.fetchJobs()">
            <RefreshCw :size="12" /> Try again
          </button>
        </template>
      </DesignAlert>

      <DesignEmptyNote
        v-else-if="!m.hasJobs"
        icon="PackageCheck"
        title="No jobs in progress"
        hint="Paid jobs appear here once payment is confirmed."
      />

      <div v-else class="space-y-7">
        <div class="flex flex-wrap items-center gap-3">
          <span class="font-mono text-[10px] font-semibold tracking-[0.18em] text-brand uppercase">All jobs · {{ m.jobs.length }}</span>
          <span class="rounded-full bg-green-soft px-2.5 py-[3px] font-mono text-[9px] tracking-[0.12em] text-green uppercase">
            {{ m.dispatchableJobs.length }} ready to dispatch
          </span>
        </div>

        <section v-for="section in jobSections" :key="section.key" class="space-y-3">
          <div class="flex items-center gap-2 pl-1">
            <h3 class="font-mono text-[10px] font-semibold tracking-[0.18em] uppercase" :style="{ color: section.muted ? 'var(--sub)' : 'var(--ink)' }">{{ section.label }}</h3>
            <span class="rounded-full bg-paper-2 px-2 py-[1px] font-mono text-[9px] font-semibold text-ink-2">{{ section.items.length }}</span>
          </div>

          <DesignCard class="overflow-hidden">
            <ul class="divide-y divide-line">
              <li v-for="job in section.items" :key="job.id" :id="`manager-job-${job.id}`">
                <NuxtLink
                  :to="`/app/manager/jobs/${job.id}`"
                  data-test="manager-job-row"
                  class="group flex flex-wrap items-start justify-between gap-4 px-5 py-4 transition-colors hover:bg-paper-2"
                  :class="isMuted(job) ? 'opacity-70' : ''"
                  :aria-label="`Open job ${job.job_reference || job.reference}`"
                >
                  <div class="min-w-0 flex-1">
                    <div class="flex flex-wrap items-center gap-2">
                      <span class="font-mono text-[10.5px] font-semibold tracking-[0.1em]" :class="needsAttention(job) ? 'text-brand' : 'text-ink-3'">{{ job.job_reference || job.reference }}</span>
                      <span class="rounded-full px-2.5 py-[2px] font-mono text-[9px] font-semibold tracking-[0.1em] uppercase" :class="stageTone(job)">{{ job.timing?.stage_label || job.status }}</span>
                      <span v-if="job.payout_hold" data-test="manager-payout-hold" class="rounded-full bg-red-soft px-2 py-[2px] font-mono text-[8.5px] font-bold tracking-[0.1em] text-red uppercase">Payout hold</span>
                      <span v-if="job.unread" class="h-2 w-2 rounded-full bg-red" role="img" aria-label="Unread" />
                    </div>
                    <p class="mt-1 truncate text-[15px] font-bold tracking-tight text-ink">{{ job.title }}</p>
                    <p class="mt-0.5 truncate text-[12px] text-ink-2">
                      {{ job.client_name || 'Client' }}<span v-if="job.assigned_shop_name && job.assigned_shop_name !== 'Awaiting assignment'"> · {{ job.assigned_shop_name }}</span>
                    </p>
                    <p class="mt-1 text-[12px] font-medium text-ink-2">{{ nextAction(job) }}</p>
                  </div>
                  <div class="flex shrink-0 flex-col items-end gap-1 text-right">
                    <p class="flex items-center gap-1 font-mono text-[10px] tracking-[0.06em] text-ink-2">
                      <CalendarClock :size="11" /> {{ dueLabel(job) }}
                    </p>
                    <p class="font-mono text-[11px] font-semibold" :class="job.timing?.is_late ? 'text-red' : 'text-brand-deep'">
                      {{ job.timing?.is_late ? 'Running late' : job.artwork_status_label || 'Open job' }}
                    </p>
                    <span class="inline-flex items-center gap-1 font-mono text-[9px] font-semibold tracking-[0.1em] text-brand uppercase">
                      Open job <ArrowRight :size="11" />
                    </span>
                  </div>
                </NuxtLink>
              </li>
            </ul>
          </DesignCard>
        </section>
      </div>
    </div>
  </DesignManagerSurface>
</template>
