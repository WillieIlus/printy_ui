<template>
  <div>
    <AdminPageHead
      eyebrow="Production"
      title="Jobs"
      lede="Every job on the marketplace, grouped by what it needs from you. Nothing waits on a second page."
    >
      <template #meta>
        <span
          class="inline-flex items-center gap-2 rounded-full border px-3 py-1.5 font-mono2 text-[9px] uppercase tracking-[0.14em] text-[var(--sub)]"
          :style="{ borderColor: 'var(--line)' }"
        >
          <Rocket :size="12" :style="{ color: 'var(--accent)' }" />
          {{ workflow.jobs.length }} tracked · {{ counts.managed_jobs }} in the database
        </span>
      </template>
    </AdminPageHead>

    <AdminSection
      icon="flag"
      tone="bad"
      title="Needs a decision"
      :count="riskJobs.length"
      subtitle="Overdue, at risk or disputed — the jobs where the ball is not moving and money is already committed."
    >
      <AdminJobList :jobs="riskJobs" empty-copy="Nothing is at risk right now." @open="openJob" />
    </AdminSection>

    <AdminSection
      icon="gauge"
      tone="good"
      title="On track"
      :count="onTrackJobs.length"
      subtitle="Inside their SLA with the ball moving. Watch them here, act on them nowhere."
    >
      <AdminJobList :jobs="onTrackJobs" empty-copy="No jobs are currently on track." @open="openJob" />
    </AdminSection>

    <AdminSection
      icon="file-text"
      tone="neutral"
      title="Completed"
      :count="completedJobs.length"
      subtitle="Delivered, paid out and archived. Kept for the record only."
    >
      <AdminJobList :jobs="completedJobs" empty-copy="Nothing has completed yet." partner="none" @open="openJob" />
    </AdminSection>
  </div>
</template>

<script setup lang="ts">
import { Rocket } from 'lucide-vue-next'
import type { Job } from '~/shared/workflow/printy'

const { admins, workflow, counts, riskJobs, onTrackJobs, completedJobs } = useAdminNav()

function openJob(job: Job) {
  admins.clearFocus()
  workflow.act('open-job', job)
}
</script>